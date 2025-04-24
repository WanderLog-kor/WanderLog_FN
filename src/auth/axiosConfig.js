import axios from "axios";


const api = axios.create({
    baseURL: "https://www.wanderlog.shop",
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response){
            if(error.response.status === 401) {
                window.location.href = "/error/unauthorized";
            } else if (error.response.status === 403) {
                window.location.href = "/error/forbidden";
            }
        }
        return Promise.reject(error);
    }
)

export default api;