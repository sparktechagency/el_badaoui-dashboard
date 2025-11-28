// categorySlice.ts
import { api } from "../api/baseApi";

type SubCategory = {
  _id: string;
  name: string;
  image: string;
  basePrice: number;
  baseArea: number;
};

const subCategorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllSubCategories: builder.query<{ success: boolean; message: string; data: SubCategory[] }, null>({
      query: () => {
        return {
          method: "GET",
          url: "/subcategories", 
        };
      },
      providesTags: ["SubCategories"],
    }),

    createSubCategory: builder.mutation({
      query: (data) => {
    

        return {
          method: "POST",
          url: "/subcategories", 
          body: data,
        };
      },
      invalidatesTags: ["SubCategories"], 
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, ...data }) => {
   
        

        return {
          method: "PATCH",
          url: `/subcategories/${id}`, 
          body: data,
        };
      },
      invalidatesTags: ["SubCategories"],
    }),

    deleteSubCategory: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/subcategories/${id}`, 
        };
      },
      invalidatesTags: ["SubCategories"],
    }),
  }),
});

export const {
  useGetAllSubCategoriesQuery,
  useCreateSubCategoryMutation,
  useUpdateSubCategoryMutation,
  useDeleteSubCategoryMutation,
} = subCategorySlice;