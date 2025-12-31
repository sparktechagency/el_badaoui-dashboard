// categorySlice.ts
import { api } from "../api/baseApi";

type Category = {
  _id: string;
  name: string;
  image: string;
};

const categorySlice = api.injectEndpoints({
  endpoints: (builder) => ({
    getAllCategories: builder.query<{ success: boolean; message: string; data: Category[] }, null>({
      query: () => {
        return {
          method: "GET",
          url: "/categories", 
        };
      },
      providesTags: ["Category"], 
    }),

    createCategory: builder.mutation({
      query: (data) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          method: "POST",
          url: "/categories", 
          body: formData,
        };
      },
      invalidatesTags: ["Category"], 
    }),

    updateCategory: builder.mutation({
      query: ({ id, ...data }) => {
        const formData = new FormData();
        formData.append("name", data.name);
        if (data.image && data.image instanceof File) {
          formData.append("image", data.image);
        }

        return {
          method: "PATCH",
          url: `/categories/${id}`, 
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),

    deleteCategory: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/categories/${id}`, 
        };
      },
      invalidatesTags: ["Category"],
    }),

    addExtraService: builder.mutation({
      query: (formData: FormData) => {
        return {
          method: "POST",
          url: "/questions",
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),
    updateExtraService: builder.mutation({
      query: ({ id, formData }: { id: string; formData: FormData }) => {
        return {
          method: "PATCH",
          url: `/questions/${id}`,
          body: formData,
        };
      },
      invalidatesTags: ["Category"],
    }),
    getExtraServices: builder.query({
      query: (id) => {
        return {
          method: "GET",
          url: `/questions/categories/${id}`, 
        };
      },
      providesTags: ["Category"], 
    }),
    deleteExtraService: builder.mutation({
      query: (id) => {
        return {
          method: "DELETE",
          url: `/questions/${id}`, 
        };
      },
      invalidatesTags: ["Category"],
    }),
  }),
});

export const {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useAddExtraServiceMutation,
  useGetExtraServicesQuery,
  useUpdateExtraServiceMutation,
  useDeleteExtraServiceMutation,
} = categorySlice;
