import API_HOST from "../host";

const ACCOUNT_API = {
    REGISTER: `${API_HOST}/api/account/register`,
    LIST:  `${API_HOST}/api/account/friend`,
    LIST_SENT:  `${API_HOST}/api/account/friend/sent`,
    LIST_INVITED:  `${API_HOST}/api/account/friend/invited`,
    CHANGE_STATUS: `${API_HOST}/api/account/friend/status`,
    ADD: `${API_HOST}/api/account/friend/add`,
  };
  
export default ACCOUNT_API;