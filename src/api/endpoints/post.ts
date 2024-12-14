import API_HOST from "../host";

const POST_API = {
    UPLOAD_IMG: 'https://api.cloudinary.com/v1_1/moment-images/upload',
    GET_IMG: "https://res.cloudinary.com/moment-images/image/upload/",
    POST:`${API_HOST}/api/photo/post`
  };
  
export default POST_API;