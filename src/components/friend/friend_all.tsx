"use client";
import API from "@/api/api";
import { FetchClientGetApi, FetchClientPostApi } from "@/api/fetch_client_api";
import { useState } from "react";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import FriendCard from "../home/friend_card";
import SpinnerAnimation from "../shared/spiner_animation";

interface FriendAllProps {
  accountAcceptedResponses: IAccountResponse[];
  time: string;
}
const FriendAll = (props: FriendAllProps) => {
  const [accountResponses, setAccountResponses] = useState<IAccountResponse[]>(
    props.accountAcceptedResponses
  );
  const [accountInvitedResponses, setAccountInvitedResponses] = useState<
    IAccountResponse[] | null
  >(null);
  const [accountSentResponses, setAccountSentResponses] = useState<
    IAccountResponse[] | null
  >(null);

  const time = props.time;
  const [pageCurrentAccepted, setPageCurrentAccepted] = useState<number>(0);
  const [pageCurrentInvited, setPageCurrentInvited] = useState<number>(0);
  const [pageCurrentSent, setPageCurrentSent] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<string>("first");

  const handleTabSelect = (key: string | null) => {
    if (key !== null) {
      setActiveTab(key);
    }
    if (key === "second" && accountInvitedResponses === null) {
      const fetchData = async () => {
        const dataBody: IFriendFilterRequest = {
          pageCurrent: pageCurrentInvited,
          time: time,
        };
        const res = await FetchClientPostApi(
          API.ACCOUNT.LIST_INVITED,
          dataBody
        );
        setAccountInvitedResponses(res.result);
      };
      fetchData();
    }
    if (key === "third" && accountSentResponses === null) {
      const fetchData = async () => {
        const dataBody: IFriendFilterRequest = {
          pageCurrent: pageCurrentSent,
          time: time,
        };
        const res = await FetchClientPostApi(API.ACCOUNT.LIST_SENT, dataBody);
        setAccountSentResponses(res.result);
      };
      fetchData();
    }
  };

  const addAccountFriendAccepted = async () => {
    setPageCurrentAccepted(pageCurrentAccepted + 1);
    try {
      const dataBody: IFriendFilterRequest = {
        pageCurrent: pageCurrentAccepted + 1,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST, dataBody);
      const newAccountResponses:IAccountResponse[] = res.result;
      if (newAccountResponses != null && newAccountResponses != undefined)
        setAccountResponses((prevAccountResponses) => [
          ...prevAccountResponses,
          ...newAccountResponses, // Thêm ảnh mới vào danh sách ảnh hiện tại
        ]);
    } catch (error) {
      console.error("Error fetching additional images:", error);
    }
    return;
  };
  const addAccountFriendInvited = async () => {
    setPageCurrentInvited(pageCurrentInvited + 1);
    try {
      const dataBody: IFriendFilterRequest = {
        pageCurrent: pageCurrentInvited + 1,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST_INVITED, dataBody);
      const newAccountResponses = res.result;
      if (newAccountResponses != null && newAccountResponses != undefined)
        setAccountInvitedResponses((prevAccountResponses) => [
          ...(prevAccountResponses ? prevAccountResponses : []),
          ...newAccountResponses,
        ]);
    } catch (error) {
      console.error("Error fetching additional images:", error);
    }
    return;
  };
  const addAccountFriendSent = async () => {
    setPageCurrentSent(pageCurrentSent + 1);
    try {
      const dataBody: IFriendFilterRequest = {
        pageCurrent: pageCurrentSent + 1,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST_SENT, dataBody);
      const newAccountResponses:IAccountResponse[] = res.result;
      if (newAccountResponses != null && newAccountResponses != undefined)
        setAccountSentResponses((prevAccountResponses) => [
          ...(prevAccountResponses ? prevAccountResponses : []),
          ...newAccountResponses, // Thêm ảnh mới vào danh sách ảnh hiện tại
        ]);
    } catch (error) {
      console.error("Error fetching additional images:", error);
    }
    return;
  };
  const addAccountFriend=(type:string)=>{
    if(type=='accepted'){
      addAccountFriendAccepted()
    }
    if(type=='invited'){
      addAccountFriendInvited()
    }
    if(type=='sent'){
      addAccountFriendSent()
    }

  }

  const renderCardFriend = (accountResponses: IAccountResponse[] | null, type:string) => {
    if (accountResponses === null) return <SpinnerAnimation></SpinnerAnimation>;
    const rows = [];
    for (let i = 0; i < accountResponses?.length; i += 2) {
      rows.push(
        <Row key={`row-${i}`}>
          <Col sm={6}>
            <div className="m-1 bg-hover p-2 rounded-2">
              <FriendCard accountResponse={accountResponses[i]} />
            </div>
          </Col>
          {i + 1 < accountResponses.length && (
            <Col sm={6}>
              <div className="m-1 bg-hover p-2 rounded-2">
                <FriendCard accountResponse={accountResponses[i + 1]} />
              </div>
            </Col>
          )}
        </Row>
      );
    }    

    rows.push(
      <Button key="load-more" onClick={() => addAccountFriend(type)}>
        Xem thêm
      </Button>
    );
    return <>{rows}</>;
  };
  return (
    <>
      <Tab.Container
        id="left-tabs-example"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Row>
          <Col sm={3} className="col-12 ">
            <Nav variant="pills" className="flex-column shadow round-2 border-2">
              <Row>
                <Col sm={12} className="col-4 p-1">
                  <Nav.Item>
                    <Nav.Link
                      className="text-center bg-hover"
                      eventKey="first"
                    >
                    <i className="fa-solid fa-users"></i>  Bạn bè
                    </Nav.Link>
                  </Nav.Item>
                </Col>
                <Col sm={12} className="col-4 p-1">
                  <Nav.Item>
                    <Nav.Link
                      className="text-center bg-hover"
                      eventKey="second"
                    >
                      <i className="fa-regular fa-envelope"></i><i className="fa-solid fa-arrow-left"></i> Lời mời
                    </Nav.Link>
                  </Nav.Item>
                </Col>
                <Col sm={12} className="col-4 p-1">
                  <Nav.Item>
                    <Nav.Link
                      className="text-center bg-hover"
                      eventKey="third"
                    >
                      <i className="fa-regular fa-envelope"></i><i className="fa-solid fa-arrow-right"></i> Đã gửi
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              </Row>
            </Nav>
          </Col>
          <Col sm={9} >
            <Tab.Content className="p-2 bg-light shadow rounded-2 border-2" >
              <Tab.Pane eventKey="first">
                {renderCardFriend(accountResponses,'accepted')}
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                {renderCardFriend(accountInvitedResponses,'invited')}
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                {renderCardFriend(accountSentResponses,'sent')}
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};
export default FriendAll;
