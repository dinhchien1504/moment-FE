import API from "@/api/api";
import { FetchServerPostApi } from "@/api/fetch_server_api";
import FriendAll from "@/components/friend/friend_all";
import { getServerUTC } from "@/utils/utc_server_action";
import { Container } from "react-bootstrap";

const PageFriend = async () => {
  const time = await getServerUTC();
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
