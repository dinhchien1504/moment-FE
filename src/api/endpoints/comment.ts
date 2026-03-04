import API_HOST from "../host";


const COMMENT_API = {
    ADMIN_LIST_COMMENT: `${API_HOST}/api/comment/list-admin`,
    ADMIN_DELETE_COMMENT: `${API_HOST}/api/comment/change-status-admin`,
    COMMENT: `${API_HOST}/api/comment`,
    COMMENT_PHOTO: `${API_HOST}/api/comment/photo`,
    COMMENT_PHOTO_REPLY: `${API_HOST}/api/comment/photo/reply`,

};
export default COMMENT_API; 