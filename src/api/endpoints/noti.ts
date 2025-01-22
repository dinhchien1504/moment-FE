import API_HOST from "../host";

const NOTI_API = {
    NOTI_SOCKET: `${API_HOST}/api/ws`,
    NOTI_GET:`${API_HOST}/api/noti/get`,
    // COUNT_NOTI_NEW : `${API_HOST}/api/noti/count-noti-new`,
    // COUNT_NOTI_ALL : `${API_HOST}/api/noti/count-noti-all`,
    // COUNT_NOTI_UNREAD : `${API_HOST}/api/noti/count-noti-unread`,
    COUNT_NOTI: `${API_HOST}/api/noti/count-noti`,
  };
  
export default NOTI_API;