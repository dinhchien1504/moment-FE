import ACCOUNT_API from "./endpoints/account";
import AUTH_API from "./endpoints/auth";
import HOME_API from "./endpoints/home";
import POST_API from "./endpoints/post";
import SETTING_API from "./endpoints/setting";

const API = {
  AUTH: AUTH_API,
  ACCOUNT:ACCOUNT_API,
  HOME: HOME_API,
  POST:POST_API,
  SETTING:SETTING_API,
};

export default API;