import API_HOST from "../host";

const ACCOUNT_API = {
    REGISTER: `${API_HOST}/api/account/register`,
    LIST:  `${API_HOST}/api/account/friend`,
    CHANGE_STATUS: `${API_HOST}/api/account/friend/status`,
    ADD: `${API_HOST}/api/account/friend/add`,
  };
  
export default ACCOUNT_API;