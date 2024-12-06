import ACCOUNT_API from "./endpoints/account";
import AUTH_API from "./endpoints/auth";
import HOME_API from "./endpoints/home";

const API = {
  AUTH: AUTH_API,
  ACCOUNT:ACCOUNT_API,
  HOME: HOME_API
};

export default API;