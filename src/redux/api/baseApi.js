import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://10.10.7.46:5000/api/v1"
        // baseUrl: "http://192.168.10.195:5000/api"
    }),
    endpoints: () => ({})
});

// export const imageUrl = "http://206.189.231.81:5000";
export const imageUrl = "http://10.10.7.46:5000";