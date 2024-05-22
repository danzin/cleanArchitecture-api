import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';


const baseQuery = fetchBaseQuery({ baseUrl:'', });

//Base api slice
export const apiSlice = createApi({
  baseQuery,
  tagTypes: ['User', 'Images'],
  endpoints: (builder) => ({}),
});