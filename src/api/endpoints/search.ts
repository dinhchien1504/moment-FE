import API_HOST from "../host";

const SEARCH_API = {
    ALL:  `${API_HOST}/api/account/search`,
    USERNAME: `${API_HOST}/api/account/search/username`,
    NAME: `${API_HOST}/api/account/search/name`,
    EMAIL: `${API_HOST}/api/account/search/email`,
    PHONENUMBER: `${API_HOST}/api/account/search/phonenumber`,
  };
export default SEARCH_API;