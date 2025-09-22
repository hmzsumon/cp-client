import { baseQueryWithReauth } from "@/redux/baseQueryWithReauth";
import { createApi } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,
  tagTypes: [
    "Users",
    "Admin",
    "Pxc",
    "Wallet",
    "Transactions",
    "User",
    "Withdraw",
    "Withdraws",
    "MyWithdraws",
    "Mining",
    "Deposits",
    "Notification",
    "Notifications",
    "Package",
    "Transaction",
    "Trade",
    "Trades",
    "Transfer",
    "Accounts",
    "Positions",
  ],
  endpoints: (builder) => ({}),
});
