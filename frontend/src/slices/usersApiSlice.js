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
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/signup`,
        method: 'POST',
        body: data
      }) 
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/signout`,
        method: 'POST'
      })
    }),
    updateUser: builder.mutation({
      query: ({id, data}) => ({
        url: `${USERS_URL}/${id}`,
        method: 'PUT',
        body: data
      }) 
    }),
  })
})

export const { useLoginMutation, useLogoutMutation, useRegisterMutation, useUpdateUserMutation } = usersApiSlice;