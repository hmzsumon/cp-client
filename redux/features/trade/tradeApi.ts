import { IAccount } from "../account/accountApi";
import { apiSlice } from "../api/apiSlice";

export interface Position {
  _id: string;
  accountId: string;
  symbol: string;
  side: "buy" | "sell";
  volume: number;
  entryPrice: number;
  status: "open" | "closed";
  openedAt: string;
  closedAt?: string;
  profit?: number;
}

export const tradeApi = apiSlice.injectEndpoints({
  endpoints: (b) => ({
    listDemoPositions: b.query<{ items: Position[] }, { accountId: string }>({
      query: ({ accountId }) => ({
        url: `/demo/positions?accountId=${accountId}`,
      }),
      providesTags: ["Positions"],
    }),
    openDemoOrder: b.mutation<
      { position: Position; account: IAccount },
      {
        accountId: string;
        symbol: string;
        side: "buy" | "sell";
        volume: number;
        price: number;
      }
    >({
      query: (body) => ({ url: "/demo/orders", method: "POST", body }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    closeDemoPosition: b.mutation<
      { position: Position; account: IAccount },
      { id: string; price: number }
    >({
      query: ({ id, price }) => ({
        url: `/demo/positions/${id}`,
        method: "DELETE",
        body: { price },
      }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    /* ────────── placeMarketOrder ────────── */
    placeMarketOrder: b.mutation<
      { success: true; position: any },
      {
        accountId: string;
        symbol: string;
        side: "buy" | "sell";
        lots: number;
        price: number;
      }
    >({
      query: (body) => ({ url: "/trade/market", method: "POST", body }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
    /* ────────── close MarketOrder ────────── */
    closePosition: b.mutation<
      { success: true; position: any },
      { id: string; price: number }
    >({
      query: (body) => ({
        url: `/trade/${body.id}/close`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Accounts", "Positions"],
    }),
  }),
});

export const {
  useListDemoPositionsQuery,
  useOpenDemoOrderMutation,
  useCloseDemoPositionMutation,
  usePlaceMarketOrderMutation,
  useClosePositionMutation,
} = tradeApi;
