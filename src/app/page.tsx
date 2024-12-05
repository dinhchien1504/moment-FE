import API from "@/api/api"
import { FetchServerGetApi } from "@/api/fetch_server_api"

const HomePage = async () => {

  const res = await FetchServerGetApi(API.AUTH.MY_INFO)
  console.log("Res home page >>> ", res)
  return (<>
        Trang chủ
  </>)
}

export default HomePage