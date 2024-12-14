
import API from "@/api/api"

export const GetImage =  (src:any):string => {

    return   `${API.POST.GET_IMG}${src}`
    
}
