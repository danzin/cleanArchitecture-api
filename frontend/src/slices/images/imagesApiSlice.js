import { apiSlice } from "../apiSlice";

//TODO: Consider separate constants file
const IMAGES_URL = '/api/image';


export const imageApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    loadImages: builder.query({
      query: () => `${IMAGES_URL}/all`,  // Adjust the endpoint to match your backend URL
    }),
  }),
});

export const { useLoadImagesQuery } = imageApiSlice;