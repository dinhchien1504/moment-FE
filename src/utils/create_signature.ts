"use server"

import { v2 as cloudinary } from 'cloudinary'; // Thay thế require bằng import

export const CreateSignature = async  (timestamp:any) => {


   
    const FOLDER = "moment-folder"
    const UPLOAD_PRESET = "moment-preset"
    const apiSecret = String(process.env.API_SECRET) 

    const signature = cloudinary.utils.api_sign_request({
        folder: FOLDER,
        timestamp: timestamp,
        upload_preset: UPLOAD_PRESET,

    }, apiSecret);

    const apiKey = process.env.API_KEY

    return {signature, apiKey}


  


}



