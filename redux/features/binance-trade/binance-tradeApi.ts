// redux/features/binance-trade/binance-tradeApi.ts
import type { Side } from "@/components/binance-trade/TradeLayout";
import { apiSlice } from "../api/apiSlice";

export interface PlaceBinanceOrderRequest {
  symbol: string;
  side: Side;
  orderType: "market" | "limit"; // backend এ শুধুই এই দুইটা আছে
  quantity: number;
  price?: number;
}

export interface PlaceBinanceOrderResponse {
  success: boolean;
  order: {
    _id: string;
    symbol: string;
    side: Side;
    type: string;
    price: number;
    quantity: number;
    notional: number;
    createdAt: string;
  };
}

// Spot wallet ব্যালেন্স টাইপ
export interface SpotWallet {
  _id: string;
  asset: string; // BTC, ACM
  symbol: string; // BTCUSDT
  qty: number; // কত BTC/ACM আছে
  avgPrice: number;
}

export const binanceTradeApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 👉 Order place mutation
    placeBinanceOrder: builder.mutation<
      PlaceBinanceOrderResponse,
      PlaceBinanceOrderRequest
    >({
      query: (body) => ({
        url: "/binance-trade/order",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    // 👉 Spot balances query
    getSpotBalances: builder.query<SpotWallet[], void>({
      query: () => "/binance-trade/balances",
      transformResponse: (res: { success: boolean; items: SpotWallet[] }) =>
        res.items,
    }),
  }),
});

export const { usePlaceBinanceOrderMutation, useGetSpotBalancesQuery } =
  binanceTradeApi;
