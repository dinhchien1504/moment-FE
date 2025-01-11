import API from "@/api/api";
import { FetchServerGetApi, FetchServerPostApi } from "@/api/fetch_server_api";
import FriendAll from "@/components/friend/friend_all";
import { getCurrentTime } from "@/utils/utils_time";
import { Container } from "react-bootstrap";

const PageFriend = async () => {
  const time = getCurrentTime();
  const dataBody: IFriendFilterRequest = {
    pageCurrent: 0,
    time: time,
  };
  const res = await FetchServerPostApi(API.ACCOUNT.LIST, dataBody);
  const accountAcceptedResponses: IAccountResponse[] = res.result;
  const totalItems:number =res.totalPages
  return (
    <Container>
      <FriendAll
        accountAcceptedResponses={accountAcceptedResponses}
        time={time}
        totalItems={totalItems}
      ></FriendAll>
    </Container>
  );
};
export default PageFriend;
