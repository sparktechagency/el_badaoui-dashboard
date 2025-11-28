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
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("baseArea", data.baseArea.toString()); // Convert to string
        formData.append("basePrice", data.basePrice.toString()); // Convert to string
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          method: "POST",
          url: "/subcategories", 
          body: formData,
        };
      },
      invalidatesTags: ["SubCategories"], 
    }),

    updateSubCategory: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        formData.append("baseArea", data.baseArea.toString()); // Convert to string
        formData.append("basePrice", data.basePrice.toString()); // Convert to string
        if (data.image && data.image instanceof File) {
          formData.append("image", data.image);
        }

        return {
          method: "PATCH",
          url: `/subcategories/${id}`, 
          body: formData,
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