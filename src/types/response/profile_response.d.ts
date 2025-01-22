interface IProfileResponse{
    id:number;
    listPhotoProfile: IPhotoResponse[],
    // description:string;
    name:string;
    userName:string;
    urlAvt:string;
    quantityFriend: number;
    friendStatus: string;
    idAccount:string;
}