"use client";

import TransactionCard from "@/components/transactions/TransactionCard";
import { useGetTransactionsQuery } from "@/redux/features/transactions/transactionApi";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ScaleLoader } from "react-spinners";

const Transactions = () => {
  const { data: transData, isFetching } = useGetTransactionsQuery(undefined, {
    pollingInterval: 1000 * 60 * 5, // 5 minutes
    refetchOnFocus: true,
    refetchOnReconnect: true,
  });
  const { transactions } = transData || [];

  const [page, setPage] = useState(1);
  const [records, setRecords] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(true);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (transactions?.length) {
      setRecords((prev) => [...prev, ...transactions]);
      if (transactions < 10) {
        setHasMore(false);
      }
    } else {
      setHasMore(false);
    }
  }, [transactions]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetching && hasMore) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      if (loadMoreRef.current) {
        observer.unobserve(loadMoreRef.current);
      }
    };
  }, [loadMoreRef.current, isFetching, hasMore]);

  return (
    <div className="bg-white min-h-[80vh] ">
      {records.length > 0 ? (
        <>
          {records.map((record: any, index: number) => (
            <TransactionCard key={index} record={record} isLiveTrade={false} />
          ))}

          <div ref={loadMoreRef} className="flex justify-center py-4">
            {isFetching ? (
              <ScaleLoader color="#00b894" height={25} />
            ) : !hasMore ? (
              <p className="text-gray-400 text-sm">No more records</p>
            ) : null}
          </div>
        </>
      ) : (
        <div className="text-center flex items-center justify-center min-h-[80vh]">
          <div>
            <Image
              src="/images/no-data.gif"
              width={200}
              height={200}
              alt="No Data"
              className="mx-auto"
            />
            <p className="text-gray-500 text-sm font-semibold">
              No Records found
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
