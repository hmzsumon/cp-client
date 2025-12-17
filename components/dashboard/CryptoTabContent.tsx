"use client";

import { useMiniTickerMap } from "@/hooks/useMiniTickerMap";
import { useGetSpotBalancesQuery } from "@/redux/features/binance-trade/binance-tradeApi";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import CryptoAssetCard from "./CryptoAssetCard";

interface SpotWalletItem {
  _id: string;
  asset: string; // e.g. "XRP"
  symbol: string; // e.g. "XRPUSDT"
  qty: number;
  avgPrice: number;
  iconUrl?: string;
}

interface DemoAsset {
  symbol: string;
  name: string;
  iconSrc: string;
}

// UI সুন্দর করার জন্য কিছু demo asset
const DEMO_ASSETS: DemoAsset[] = [
  {
    symbol: "TRX",
    name: "TRON",
    iconSrc: "/images/icons/trx_icon.png",
  },
  {
    symbol: "POL",
    name: "Polygon",
    iconSrc: "/images/icons/pol_icon.png",
  },
  {
    symbol: "FDUSD",
    name: "First Digital USD",
    iconSrc: "/images/icons/fdusd_icon.png",
  },
  {
    symbol: "HBAR",
    name: "Hedera Hashgraph",
    iconSrc: "/images/icons/hbar_icon.png",
  },
];

const CryptoTabContent: React.FC = () => {
  const { user } = useSelector((state: any) => state.auth);

  // Spot wallet থেকে ইউজারের আসল asset গুলো আনছি
  const { data: spotBalances, isLoading } = useGetSpotBalancesQuery(undefined, {
    skip: !user?._id,
  }) as {
    data?: SpotWalletItem[];
    isLoading: boolean;
  };

  const usdtBalance = Number(user?.m_balance ?? 0);
  const wallets = spotBalances ?? [];

  // wallet symbols দিয়ে Binance ticker prices আনব
  const walletSymbols = wallets.map((w) => w.symbol.toUpperCase());
  const priceMap = useMiniTickerMap(walletSymbols);

  const cards = useMemo(() => {
    type CardItem = {
      key: string;
      symbol: string;
      name: string;
      balance: number;
      iconSrc: string;
      avgPrice?: number;
      quoteValue?: number;
      todayPnl?: number;
    };

    const list: CardItem[] = [];

    // 1) সব সময় USDT card উপরে দেখাবো (balance না থাকলেও 0)
    list.push({
      key: "USDT-CASH",
      symbol: "USDT",
      name: "TetherUS",
      balance: usdtBalance,
      iconSrc: "/images/icons/usdt_icon.png",
      avgPrice: undefined,
      quoteValue: usdtBalance,
      todayPnl: 0,
    });

    // 2) Spot wallet থেকে আসল asset গুলো
    for (const w of wallets) {
      const sym = w.symbol.toUpperCase(); // যেমন: XRPUSDT
      const lastPrice = priceMap[sym]; // লাইভ Binance price (USDT এ)
      const qty = w.qty;

      // Approx total value in USDT
      const quoteValue =
        typeof lastPrice === "number" ? lastPrice * qty : w.avgPrice * qty;

      // PNL = (current - avg) * qty  (USDT)
      const todayPnl =
        typeof lastPrice === "number" ? (lastPrice - w.avgPrice) * qty : 0;

      list.push({
        key: w._id,
        symbol: w.asset, // "XRP"
        name: w.symbol, // "XRPUSDT"
        balance: qty,
        iconSrc: w.iconUrl || "/images/icons/default-coin.png",
        avgPrice: w.avgPrice,
        quoteValue,
        todayPnl,
      });
    }

    // 3) যদি item খুব কম হয় তাহলে DEMO_ASSETS থেকে কয়েকটা যোগ করি
    const MIN_ITEMS = 4;
    const existing = new Set(list.map((x) => x.symbol));

    if (list.length < MIN_ITEMS) {
      for (const demo of DEMO_ASSETS) {
        if (list.length >= MIN_ITEMS) break;
        if (existing.has(demo.symbol)) continue;

        list.push({
          key: `DEMO-${demo.symbol}`,
          symbol: demo.symbol,
          name: demo.name,
          balance: 0,
          iconSrc: demo.iconSrc,
          avgPrice: undefined,
          quoteValue: 0,
          todayPnl: 0,
        });
      }
    }

    return list;
  }, [usdtBalance, wallets, priceMap]);

  if (isLoading && (!spotBalances || spotBalances.length === 0)) {
    return (
      <div className="py-4 text-xs text-zinc-500">Loading your assets...</div>
    );
  }

  return (
    <div className="space-y-3">
      {cards.map((asset) => (
        <CryptoAssetCard
          key={asset.key}
          symbol={asset.symbol}
          name={asset.name}
          balance={asset.balance}
          iconSrc={asset.iconSrc}
          quoteSymbol="USDT"
          quoteValue={asset.quoteValue}
          avgPrice={asset.avgPrice}
          todayPnl={asset.todayPnl}
          onTrade={() => {
            console.log("Trade clicked for", asset.symbol);
          }}
        />
      ))}
    </div>
  );
};

export default CryptoTabContent;
