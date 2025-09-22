/* ──────────────────────────────────────────────────────────────────────────
   tradeSlice — selected symbol, timeframe, in-memory quotes (demo feed)
────────────────────────────────────────────────────────────────────────── */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Timeframe = "1m" | "3m" | "5m" | "10m" | "15m" | "1h" | "2h";

export type Quote = {
  symbol: string;
  bid: number;
  ask: number;
  ts: number;
};

export type Instrument = {
  symbol: string; // "XAUUSD"
  name: string; // "Gold vs US Dollar"
  category:
    | "Majors"
    | "Metals"
    | "Crypto"
    | "Indices"
    | "Stocks"
    | "Most"
    | "Favorites";
  decimals: number; // 3 for XAUUSD, 5 for EURUSD etc
  minVol: number; // 0.01
  stepVol: number; // 0.01
  pipValue: number; // UI info only
};

type TradeState = {
  symbol: string;
  tf: Timeframe;
  quote?: Quote;
  drawerOpen: boolean;
  ticketOpen: boolean;
  volume: number;
};

const initial: TradeState = {
  symbol: "XAUUSD",
  tf: "5m",
  drawerOpen: false,
  ticketOpen: false,
  volume: 0.01,
};

const tradeSlice = createSlice({
  name: "trade",
  initialState: initial,
  reducers: {
    setSymbol(s, a: PayloadAction<string>) {
      s.symbol = a.payload;
    },
    setTimeframe(s, a: PayloadAction<Timeframe>) {
      s.tf = a.payload;
    },
    setQuote(s, a: PayloadAction<Quote>) {
      if (a.payload.symbol === s.symbol) s.quote = a.payload;
    },
    setDrawerOpen(s, a: PayloadAction<boolean>) {
      s.drawerOpen = a.payload;
    },
    setTicketOpen(s, a: PayloadAction<boolean>) {
      s.ticketOpen = a.payload;
    },
    setVolume(s, a: PayloadAction<number>) {
      s.volume = a.payload;
    },
  },
});

export const {
  setSymbol,
  setTimeframe,
  setQuote,
  setDrawerOpen,
  setTicketOpen,
  setVolume,
} = tradeSlice.actions;
export default tradeSlice.reducer;
