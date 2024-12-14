"use server"

import API from "@/api/api";
import { v2 as cloudinary } from 'cloudinary'; // Thay thế require bằng import

export const UploadImages = async (src: any) => {


    const timestamp = Math.round((new Date).getTime() / 1000);
    const FOLDER = "moment-folder"
    const UPLOAD_PRESET = "moment-preset"
    const apiSecret = String(process.env.API_SECRET) 

    const signature = cloudinary.utils.api_sign_request({

        folder: FOLDER,
        timestamp: timestamp,
        upload_preset: UPLOAD_PRESET,

    }, apiSecret);

    const apiKey = process.env.API_KEY
    const fd = new FormData();

    fd.append("file", src);
    fd.append("upload_preset", UPLOAD_PRESET);
    fd.append("signature", signature);
    fd.append("api_key", String(apiKey))
    fd.append("folder", FOLDER)
    fd.append("timestamp", String(timestamp))

    const res = await fetch(API.POST.UPLOAD_IMG,
        {
            method: 'POST',
            body: fd
        }
    );


    const data = await res.json();
  
    return data


}



