// components/trade/OrderForm.tsx
import {
  useGetSpotBalancesQuery,
  usePlaceBinanceOrderMutation,
} from "@/redux/features/binance-trade/binance-tradeApi";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import type { OrderType, Side } from "./TradeLayout";

interface OrderFormProps {
  side: Side;
  orderType: OrderType;
  symbol: string;
  lastPrice: string | null;
}

// Amount থেকে ফি = amount * 0.000075
// Amount = 1000 => 0.075
const FEE_RATE = 0.000075; // 0.0075%

const OrderForm: React.FC<OrderFormProps> = ({
  side,
  orderType,
  symbol,
  lastPrice,
}) => {
  const { user } = useSelector((state: any) => state.auth);

  const [price, setPrice] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [slider, setSlider] = useState<number>(0);

  const [placeOrder, { isLoading }] = usePlaceBinanceOrderMutation();

  // base = ACM, BTC, AAVE ...
  const baseAsset = symbol.endsWith("USDT")
    ? symbol.replace("USDT", "")
    : symbol;
  // quote = USDT (আমাদের কেসে)
  const quoteAsset = symbol.endsWith("USDT") ? "USDT" : symbol.slice(-3);
  const normalizedSymbol = symbol.toUpperCase();

  const isBuy = side === "buy";

  // 👉 Redux থেকে ব্যালান্স (USDT balance = quoteAvailable)
  const quoteAvailable = Number(user?.m_balance ?? 0); // Avbl USDT

  // 👉 Spot wallet balances (SELL এর জন্য)
  const { data: spotBalances, isLoading: isBalancesLoading } =
    useGetSpotBalancesQuery(undefined, {
      skip: !user?._id, // লগইন না থাকলে কল করবে না
    });

  const baseAvailable =
    spotBalances?.find((w) => w.symbol === normalizedSymbol)?.qty ?? 0;

  const available = isBuy ? quoteAvailable : baseAvailable;

  // symbol change হলে ফর্ম রিসেট
  useEffect(() => {
    setPrice("");
    setAmount("");
    setSlider(0);
  }, [symbol]);

  // প্রথমে price এ lastPrice বসাই
  useEffect(() => {
    if (!price && lastPrice) {
      setPrice(lastPrice);
    }
  }, [lastPrice, price]);

  const handleBbo = (): void => {
    if (lastPrice) setPrice(lastPrice);
  };

  // Slider => Avbl ব্যালান্সের কত % ব্যবহার করব
  const handleSlider = (value: number): void => {
    setSlider(value);
    const pct = value / 100;

    if (isBuy) {
      const priceNumeric = parseFloat(price || "0") || 0;
      if (!priceNumeric) {
        setAmount("");
        return;
      }
      const amtBase = (quoteAvailable * pct) / priceNumeric;
      setAmount(amtBase ? amtBase.toFixed(6) : "");
    } else {
      const amtBase = baseAvailable * pct;
      setAmount(amtBase ? amtBase.toFixed(6) : "");
    }
  };

  const priceNum = parseFloat(price || "0") || 0;
  const amountNum = parseFloat(amount || "0") || 0;

  const totalNum = priceNum && amountNum ? priceNum * amountNum : 0;
  const total = totalNum ? totalNum.toFixed(2) : "";

  const maxBuyBase = isBuy && priceNum > 0 ? quoteAvailable / priceNum : 0;
  const maxSellBase = !isBuy ? baseAvailable : 0;
  const maxBase = isBuy ? maxBuyBase : maxSellBase;

  const feeBase = amountNum * FEE_RATE;
  const feeDisplay = feeBase ? feeBase.toFixed(3) : "0.000"; // ex: 0.075

  // backend এ কেবল "market" | "limit" সাপোর্ট করলে:
  const backendOrderType: "market" | "limit" =
    orderType === "market" ? "market" : "limit";

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();

    if (!user?._id) {
      toast.error("Please login first");
      return;
    }

    if (!amountNum || amountNum <= 0) {
      toast.error(`Enter valid amount of ${baseAsset}`);
      return;
    }

    if (backendOrderType === "limit" && (!priceNum || priceNum <= 0)) {
      toast.error("Enter valid price for limit order");
      return;
    }

    // SELL হলে Avbl চেক করো
    if (!isBuy && amountNum > baseAvailable) {
      toast.error(`Not enough ${baseAsset} to sell`);
      return;
    }

    try {
      const res = await placeOrder({
        symbol: normalizedSymbol, // "BTCUSDT"
        side, // "buy" | "sell"
        orderType: backendOrderType, // backend friendly
        quantity: amountNum, // base asset amount
        price: backendOrderType === "limit" ? priceNum : undefined,
      }).unwrap();

      toast.success(
        `${side === "buy" ? "Bought" : "Sold"} ${amountNum.toFixed(
          6
        )} ${baseAsset} @ ${priceNum || res.order.price}`
      );

      // ফর্ম রিসেট
      setAmount("");
      setSlider(0);
      if (backendOrderType !== "limit") {
        setPrice(""); // market হলে backend price ব্যবহার হবে
      }
      console.log("order result:", res);
    } catch (err: any) {
      const msg =
        err?.data?.message || err?.data?.error || err?.error || "Order failed";
      toast.error(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 text-xs text-slate-200">
      {/* Price */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Price ({quoteAsset})
          </span>
          <span className="rounded-full bg-slate-800 px-2 py-[2px] text-[10px] uppercase text-slate-400">
            {orderType}
          </span>
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.00000001"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
            placeholder="0.00"
            disabled={backendOrderType === "market"} // market এ ইনপুট বন্ধ
          />
          <button
            type="button"
            onClick={handleBbo}
            className="shrink-0 rounded-md bg-slate-800 px-3 text-[10px] font-medium text-slate-100 hover:bg-slate-700"
          >
            BBO
          </button>
        </div>
      </div>

      {/* Amount (BASE asset) */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400">Amount ({baseAsset})</span>
        <input
          type="number"
          step="0.000001"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full rounded-md border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-50 placeholder:text-slate-500 focus:border-slate-500 focus:outline-none"
          placeholder="0.000000"
        />
      </div>

      {/* Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          step={25}
          value={slider}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            handleSlider(Number(e.target.value))
          }
          className="w-full accent-emerald-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
          <span>75%</span>
          <span>100%</span>
        </div>
      </div>

      {/* Total */}
      <div className="space-y-1.5">
        <span className="text-[11px] text-slate-400">Total ({quoteAsset})</span>
        <input
          readOnly
          value={total}
          placeholder="0.00"
          className="w-full cursor-default rounded-md border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-50"
        />
      </div>

      {/* Avbl + Max + Est. Fee */}
      <div className="space-y-0.5 text-[11px] text-slate-400">
        <div className="flex items-center justify-between">
          <span>Avbl</span>
          {isBuy ? (
            <span className="font-medium text-slate-100">
              {quoteAvailable.toFixed(8)} {quoteAsset}
            </span>
          ) : isBalancesLoading ? (
            <span className="text-slate-500">Loading...</span>
          ) : (
            <span className="font-medium text-slate-100">
              {baseAvailable.toFixed(8)} {baseAsset}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span>Max {isBuy ? "Buy" : "Sell"}</span>
          <span className="text-slate-200">
            {maxBase.toFixed(6)} {baseAsset}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Est. Fee</span>
          <span className="text-slate-200">
            {feeDisplay} {baseAsset}
          </span>
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading || (!isBuy && isBalancesLoading)}
        className={`mt-1 w-full rounded-lg py-2.5 text-sm font-semibold shadow-md shadow-black/40 transition ${
          isBuy
            ? "bg-emerald-500 text-slate-950 hover:bg-emerald-400 disabled:bg-emerald-700/60"
            : "bg-red-500 text-slate-950 hover:bg-red-400 disabled:bg-red-700/60"
        }`}
      >
        {isLoading || (!isBuy && isBalancesLoading)
          ? "Placing..."
          : isBuy
          ? `Buy ${baseAsset}`
          : `Sell ${baseAsset}`}
      </button>
    </form>
  );
};

export default OrderForm;
