
import API from "@/api/api"
import { CreateSignature } from "./create_signature";


export const GetImage = (src: any): string => {
    if(src === null) {
        return "/images/avatar.jpg"
    }

    return `${API.POST.GET_IMG}${src}`

}

export const blobUrlToFile = async (blobUrl: string, fileName: string) => {

    const response = await fetch(blobUrl); // Lấy dữ liệu từ Blob URL
    const blob = await response.blob(); // Chuyển thành Blob

    // Tạo File từ Blob
    return new File([blob], fileName, { type: blob.type });
};


export const handleUploadImg = async (file: File) => {

    const timestamp = Math.round((new Date).getTime() / 1000);
    const { signature, apiKey } = await CreateSignature(timestamp);

    console.log("signature >>> ", signature)

    console.log("apiKey >>> ", apiKey)

    const FOLDER = "moment-folder"
    const UPLOAD_PRESET = "moment-preset"

    const fd = new FormData();

    fd.append("file", file);
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
    console.log("data >>> ", data)
    return data

}

export const handlePreviewImg = (file: File | null) => {
    if (file === null) return "/images/unnamed.png"
    else return URL.createObjectURL(file)
}
