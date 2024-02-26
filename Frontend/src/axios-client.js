import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://127.0.0.1:5000/",
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("ACCESS_TOKEN");
  config.headers.Authorization = `Bearer ${token}`;

  return config;
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;

    if (response?.status === 401) {
      const token = localStorage.getItem("ACCESS_TOKEN");

      if (token) {
        // Retry the original request with the existing access token
        error.config.headers.Authorization = `Bearer ${token}`;
        const retryOriginalRequest = await axios(error.config);
        return retryOriginalRequest;
      } else {
        // Access token is expired or not available, handle this scenario
        console.error("Access token expired or not available. User needs to re-authenticate.");
        // You might want to redirect to the login page or handle the authentication flow.
      }
    }

    // If no access token or unsuccessful retry, throw the original error
    throw error;
  }
);

export default axiosClient;
