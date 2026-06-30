import { apiSlice } from "./apiSlice";

export const transactionsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query({
      query: ({ page = 1, limit = 10, search = "" } = {}) =>
        `/api/transactions?page=${page}&limit=${limit}${search ? `&search=${encodeURIComponent(search)}` : ""}`,
      providesTags: ["Transactions"],
    }),
    getTransactionsByProduct: builder.query({
      query: ({ productId, page = 1, limit = 10 }) =>
        `/api/transactions/${productId}?page=${page}&limit=${limit}`,
      providesTags: ["Transactions"],
    }),
  }),
});

export const { useGetTransactionsQuery, useGetTransactionsByProductQuery } =
  transactionsApi;
