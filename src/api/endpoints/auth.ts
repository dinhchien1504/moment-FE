import API_HOST from "../host";

const AUTH_API = {
    TOKEN: `${API_HOST}/api/auth/token`,
    MY_INFO:`${API_HOST}/api/auth/my-info`,
    INTROSPECT: `${API_HOST}/api/auth/introspect`,

  };
  
export default AUTH_API;