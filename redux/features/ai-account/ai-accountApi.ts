/* ──────────────────────────────────────────────────────────────────────────
   accountApi — create/list/update/default/transfer/close
────────────────────────────────────────────────────────────────────────── */
import { apiSlice } from "../api/apiSlice";

export type TAccountType =
  | "lite"
  | "core"
  | "prime"
  | "elite"
  | "ultra"
  | "infinity"
  | "titan";
export interface IAccount {
  _id: string;
  accountNumber: number;
  type: TAccountType;
  currency: "USD" | "BDT";
  leverage: number;
  balance: number;
  isDefault: boolean;
  status: "active" | "closed";
  mode: "ai";
  plan: string;
}

export const aiAccountApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createAiAccount: builder.mutation<
      { success: true; account: IAccount },
      {
        plan: string;
        amount: number;
      }
    >({
      query: (body) => ({ url: "/create-ai-accounts", method: "POST", body }),
      invalidatesTags: ["Accounts", "User"],
    }),
    getMyAiAccounts: builder.query<{ success: true; items: IAccount[] }, void>({
      query: () => ({ url: "/my-ai-accounts" }),
      providesTags: ["Accounts"],
    }),
    updateAccount: builder.mutation<
      { success: true; account: IAccount },
      { id: string; name?: string; leverage?: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    setDefaultAccount: builder.mutation<
      { success: true; account: IAccount },
      { id: string }
    >({
      query: ({ id }) => ({ url: `/accounts/${id}/default`, method: "PATCH" }),
      invalidatesTags: ["Accounts"],
    }),
    transferInternal: builder.mutation<
      { success: true; account: IAccount },
      { id: string; direction: "fund" | "defund"; amount: number }
    >({
      query: ({ id, ...body }) => ({
        url: `/accounts/${id}/transfer`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounts"],
    }),
    closeAccount: builder.mutation<{ success: true }, { id: string }>({
      query: ({ id }) => ({ url: `/accounts/${id}`, method: "DELETE" }),
      invalidatesTags: ["Accounts"],
    }),
    /* ────────── demoTopUp mutation ────────── */
    demoTopUp: builder.mutation<
      {
        success: true;
        account: IAccount;
        receipt: { status: "accepted"; amount: number; currency: string };
      },
      { id: string; amount: number }
    >({
      query: ({ id, amount }) => ({
        url: `/accounts/${id}/demo-deposit`,
        method: "POST",
        body: { amount },
      }),
      invalidatesTags: ["Accounts"],
    }),
    /* ────────── get all active ai positions ────────── */
    getAllAiPositions: builder.query<
      { success: true; items: IAccount[] },
      void
    >({
      query: () => ({ url: "/get-active-ai-positions-for-user" }),
      providesTags: ["Positions"],
    }),

    /* ────────── get all closed ai positions ────────── */
    getClosedAiPositions: builder.query<
      { success: true; items: IAccount[] },
      void
    >({
      query: () => ({ url: "/get-closed-ai-positions-for-user" }),
      providesTags: ["Positions"],
    }),
  }),
});

export const {
  useCreateAiAccountMutation,
  useGetMyAiAccountsQuery,
  useUpdateAccountMutation,
  useSetDefaultAccountMutation,
  useTransferInternalMutation,
  useCloseAccountMutation,
  useDemoTopUpMutation,
  useGetAllAiPositionsQuery,
  useGetClosedAiPositionsQuery,
} = aiAccountApi;
