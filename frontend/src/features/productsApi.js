import { apiSlice } from "./apiSlice";

export const productsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: () => "/api/products",
      providesTags: ["Products"],
    }),
    getProductById: builder.query({
      query: (id) => `/api/products/${id}`,
      providesTags: ["Products"],
    }),
    createProduct: builder.mutation({
      query: (body) => ({
        url: "/api/products",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Products"],
    }),
    updateStock: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `/api/products/${id}/stock`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Products", "Transactions"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateStockMutation,
} = productsApi;
