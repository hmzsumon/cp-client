/* ────────── TransferPage (with Cancel + split components) ────────── */

"use client";

import RechargeInstructions from "@/components/RechargeInstructions";
import { TransferDrawer } from "@/components/transfer/TransferDrawer";
import { formatBalance } from "@/lib/functions";
import { useFindUserByQueryMutation } from "@/redux/features/auth/authApi";
import { useSendMutation } from "@/redux/features/send/sendApi";
import { fetchBaseQueryError } from "@/redux/services/helpers";
import { Card } from "flowbite-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

/* pieces */
import ActionBar from "@/components/transfer/ActionBar";
import AmountField from "@/components/transfer/AmountField";
import LookupInput from "@/components/transfer/LookupInput";
import LookupModeToggle from "@/components/transfer/LookupModeToggle";
import PreviewBlock from "@/components/transfer/PreviewBlock";

/* ────────── consts ────────── */
const tips = [
  "Minimum transfer amount is 5 USDT.",
  "You can transfer only to valid registered users of this platform.",
  "Once transferred, the balance cannot be reversed or refunded.",
  "Double-check the receiver’s User ID before confirming.",
  "A 2% fee is charged. Gross = Receive + Fee.",
  "You must have sufficient balance to cover the gross amount.",
  "Suspicious or fraudulent transfers may lead to suspension.",
];
const FEE_RATE = 0.02;

export default function TransferPage() {
  /* ────────── state ────────── */
  const router = useRouter();
  const { user } = useSelector((s: any) => s.auth);
  const availableBalance = Number(user?.m_balance || 0);

  const [userId, setUserId] = useState(""); // email or userId
  const [amountText, setAmountText] = useState(""); // typed receive amount
  const amount = Number(amountText) || 0;

  const fee = useMemo(() => (amount > 0 ? amount * FEE_RATE : 0), [amount]);
  const gross = useMemo(() => amount + fee, [amount, fee]); // deducted from sender

  const [amountError, setAmountError] = useState<string>("");
  const [recipient, setRecipient] = useState<any>(null);
  const [recipientError, setRecipientError] = useState("");

  const [viaMode, setViaMode] = useState<"auto" | "email" | "customerId">(
    "email"
  );
  const [viaServer, setViaServer] = useState<"email" | "customerId" | null>(
    null
  );

  const [isVerify, setIsVerify] = useState(false);
  const [isDisable, setIsDisable] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);

  const [findUserByQuery, { isLoading: findLoading }] =
    useFindUserByQueryMutation();
  const [
    send,
    {
      isLoading: sendLoading,
      isError: s_isError,
      isSuccess: s_isSuccess,
      error: s_error,
    },
  ] = useSendMutation();

  /* ────────── handlers ────────── */
  const handleChangeUserId = (v: string) => {
    setRecipientError("");
    setUserId(v);
  };

  const handleChangeAmount = (v: string) => {
    const safe = v.replace(/[^\d.]/g, "");
    setAmountText(safe);
    setAmountError("");
  };

  /* ────────── amount validation ────────── */
  useEffect(() => {
    if (!amountText) return setAmountError("");
    const n = Number(amountText);
    if (!Number.isFinite(n) || n <= 0)
      return setAmountError("Amount must be greater than zero");
    if (n < 5) return setAmountError("Minimum transfer amount is 5 USDT");
    if (gross > availableBalance) {
      return setAmountError(
        `Insufficient balance. Gross ${formatBalance(
          gross
        )} USDT > Available ${formatBalance(availableBalance)} USDT`
      );
    }
  }, [amountText, gross, availableBalance]);

  /* ────────── find user (string query + optional via) ────────── */
  const handleFindUser = async () => {
    try {
      const res = await findUserByQuery({
        query: userId,
        via: viaMode !== "auto" ? viaMode : undefined,
      }).unwrap();

      const u = res?.user;
      if (!u) throw new Error("User not found");

      if ((u.customerId || u.customer_id) === user?.customerId) {
        setRecipientError("You cannot send to yourself");
        setRecipient(null);
        setViaServer(null);
        setIsDisable(false);
        return;
      }

      setRecipient(u);
      setViaServer(res.via || (viaMode === "auto" ? null : viaMode));
      setIsDisable(true);
    } catch (err: any) {
      setRecipientError(
        (err as fetchBaseQueryError)?.data?.error || "User not found"
      );
      setRecipient(null);
      setViaServer(null);
      setIsDisable(false);
    }
  };

  /* ────────── cancel (new) ────────── */
  const handleCancel = () => {
    setRecipient(null);
    setIsDisable(false);
    setIsVerify(false);
    setViaServer(null);
    // keep userId & amount as-is (you can clear if you prefer)
  };

  /* ────────── submit ────────── */
  const handleSubmit = () => {
    if (gross > availableBalance)
      return toast.error("Not enough balance to cover amount + fee.");
    if (!recipient) return toast.error("No recipient selected.");

    send({
      recipient_id: recipient.customerId || recipient.customer_id,
      amount,
      fee,
      receive_amount: amount,
      gross_amount: gross,
    });
  };

  /* ────────── post-send ────────── */
  useEffect(() => {
    if (s_isError)
      toast.error(
        (s_error as fetchBaseQueryError)?.data?.error || "Transfer failed"
      );
    if (s_isSuccess) {
      toast.success("Transfer successful");
      setOpenDrawer(false);
      setUserId("");
      setAmountText("");
      setRecipient(null);
      setViaServer(null);
      setIsDisable(false);
      setIsVerify(false);
      router.push("/transactions");
    }
  }, [s_isError, s_error, s_isSuccess, router]);

  /* ────────── disable rule (must have userId + valid amount) ────────── */
  const disableFindBtn =
    !userId || !amountText || !!amountError || findLoading || isDisable;

  return (
    <div className="mx-auto space-y-4 md:w-1/2">
      <Card className="bg-transparent">
        <div>
          <div className="space-y-2">
            <h2 className="text-center text-xl font-bold text-blue-gray-300">
              Transfer USDT
            </h2>
          </div>

          <hr className="my-2 border border-blue-gray-800" />
          <p className="text-center text-xs font-semibold">User To User</p>

          <div className="my-4 space-y-3 text-sm">
            {/* lookup mode */}
            <LookupModeToggle
              mode={viaMode}
              onChange={(m) => setViaMode(m)}
              disabled={isDisable}
            />

            {/* id/email input */}
            <LookupInput
              mode={viaMode}
              value={userId}
              onChange={handleChangeUserId}
              onClear={() => {
                setUserId("");
                setRecipient(null);
                setRecipientError("");
                setViaServer(null);
              }}
              disabled={isDisable}
              error={recipientError}
            />

            {/* amount field */}
            <AmountField
              value={amountText}
              onChange={handleChangeAmount}
              onClear={() => setAmountText("")}
              disabled={isDisable}
              fee={fee}
              available={availableBalance}
              error={amountError}
            />

            {/* preview block (only when recipient selected) */}
            {recipient && (
              <PreviewBlock
                recipient={recipient}
                receive={amount}
                fee={fee}
                gross={gross}
              />
            )}

            {/* actions (Cancel + Security Verify / Proceed) */}
            <ActionBar
              hasRecipient={!!recipient}
              isVerify={isVerify}
              disableFind={disableFindBtn}
              disableProceed={
                sendLoading || !!amountError || gross > availableBalance
              }
              onFind={() =>
                amountError ? toast.error(amountError) : handleFindUser()
              }
              onVerify={() =>
                amountError ? toast.error(amountError) : setOpenDrawer(true)
              }
              onProceed={() => {
                if (amountError) return toast.error(amountError);
                handleSubmit();
              }}
              onCancel={handleCancel} // ← new cancel
            />

            {/* resolved by chip */}
            {viaServer && (
              <div className="text-right text-[11px] text-neutral-400">
                Resolved by:{" "}
                <span className="font-medium">
                  {viaServer === "email" ? "Email" : "User ID"}
                </span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <RechargeInstructions data={tips} title="Balance Transfer Instructions" />

      <TransferDrawer
        open={openDrawer}
        setOpen={setOpenDrawer}
        handleConfirm={() => {
          setIsVerify(true);
          setOpenDrawer(false);
        }}
      />
    </div>
  );
}
