import ACCOUNT_API from "./endpoints/account";
import AUTH_API from "./endpoints/auth";
import NOTI_API from "./endpoints/noti";
import PHOTO_API from "./endpoints/photo";
import POST_API from "./endpoints/post";
import SEARCH_API from "./endpoints/search";
import PROFILE_API from "./endpoints/profile";

const API = {
  AUTH: AUTH_API,
  ACCOUNT:ACCOUNT_API,
  PHOTO: PHOTO_API,
  POST:POST_API,
  SEARCH: SEARCH_API,
  PROFILE:PROFILE_API,
  NOTI: NOTI_API
};

export default API;