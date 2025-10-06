"use client";

import { useState } from "react";

interface TradeHistoryCardProps {
  record: any;
  isLiveTrade: boolean;
  type: string;
  status: string;
  amount: number;
  currency: string;
  method: string;
  time: string;
  orderId: string;
  onCopy: (value: string) => void;
}

const TransactionCard = ({ record, isLiveTrade }: TradeHistoryCardProps) => {
  const [showDetail, setShowDetail] = useState(false);

  const isSuccess = record.isCashIn;
  const resultColor = isSuccess ? "text-green-600" : "text-red-500";
  const profitPrefix = isSuccess ? "+" : "-";

  return (
    <div className="border-b py-3 px-4">
      {/* Summary Header */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => setShowDetail(!showDetail)}
      >
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <button
              className={`${
                record.isCashIn ? "bg-green-500" : "bg-red-500"
              } text-white text-xs rounded  py-1 w-[65px] flex items-center justify-center`}
            >
              {record.isCashIn ? "Cash In" : "Cash Out"}
            </button>
          </div>
          <div className="text-xs">
            <p className="font-semibold space-x-2">
              <span>{record.unique_id}</span>
            </p>
            <p className="text-gray-500 text-xs">
              {new Date(record.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
        {isLiveTrade ? (
          <div className="text-right">
            <p className={`text-xs ${resultColor} font-bold`}>
              {record.purpose}
            </p>
            <p className={`${resultColor} text-xs font-bold`}>
              {!record.amount ? "0.00" : Math.abs(record.amount).toFixed(2)} $
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className={`text-xs ${resultColor} font-bold`}>
              {record.purpose}
            </p>
            <p className={`${resultColor} text-xs font-bold`}>
              {!record.amount ? "---" : Math.abs(record.amount).toFixed(2)} $
            </p>
          </div>
        )}
      </div>

      {/* Details */}
      {showDetail && (
        <div className="bg-gray-50 mt-3 rounded-lg p-3 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-gray-500">Record Id</span>
            <span>{record.unique_id}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Amount</span>
            <span>${record.amount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">purpose</span>
            <span>{record.purpose}</span>
          </div>
          <div className="flex flex-col justify-between gap-1">
            <span className="text-gray-500">Description</span>
            <span className="text-[.70rem] self-end">{record.description}</span>
          </div>

          <div className="flex justify-between">
            <span className={`${resultColor} `}>Status</span>
            <span className={resultColor}>
              {record.isCashIn ? "Cash In" : "Cash Out"}
            </span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-500">Trade time</span>
            <span>
              {new Date(record.createdAt).toLocaleString("en-GB", {
                year: "numeric",
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionCard;
