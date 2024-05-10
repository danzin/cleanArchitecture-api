import { apiSlice } from "./apiSlice";

//TODO: Consider separate constants file
const USERS_URL = '/api/users';

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signin`,
        method: 'POST',
        body: data
      }) 
    })
  })
})

export const { useLoginMutation } = usersApiSlice;