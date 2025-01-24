"use client";
import API from "@/api/api";
import { FetchClientPostApi } from "@/api/fetch_client_api";
import { useState } from "react";
import { Button, Col, Nav, Row, Tab } from "react-bootstrap";
import FriendCard from "../home/friend_card";
import SpinnerAnimation from "../shared/spiner_animation";

interface FriendAllProps {
  accountAcceptedResponses: IAccountResponse[];
  time: string;
  totalItems: number;
}
const FriendAll = (props: FriendAllProps) => {
  const [accountResponses, setAccountResponses] = useState<IAccountResponse[]>(
    props.accountAcceptedResponses
  );
  const totalItemsAccepted = props.totalItems;
  const [totalItemsSent, settotalItemsSent] = useState<number>(0);
  const [totalItemsReceived, settotalItemsReceived] = useState<number>(0);

  const [accountReceivedResponses, setAccountReceivedResponses] = useState<
    IAccountResponse[] | null
  >(null);
  const [accountSentResponses, setAccountSentResponses] = useState<
    IAccountResponse[] | null
  >(null);

  const [loading, setLoading] = useState<boolean>(false);

  const time = props.time;
  const [pageCurrentAccepted, setPageCurrentAccepted] = useState<number>(0);
  const [pageCurrentReceived, setPageCurrentReceived] = useState<number>(0);
  const [pageCurrentSent, setPageCurrentSent] = useState<number>(0);

  const [activeTab, setActiveTab] = useState<string>("first");

  const handleTabSelect = (key: string | null) => {
    if (key !== null) {
      setActiveTab(key);
    }
    if (key === "second" && accountReceivedResponses === null) {
      const fetchData = async () => {
        const dataBody: IFriendFilterRequest = {
          pageCurrent: pageCurrentReceived,
          time: time,
        };
        const res = await FetchClientPostApi(
          API.ACCOUNT.LIST_RECEIVED,
          dataBody
        );
        setAccountReceivedResponses(res.result);
        settotalItemsReceived(res.totalItems);
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
        settotalItemsSent(res.totalItems);
      };
      fetchData();
    }
  };

  const addAccountFriendAccepted = async () => {
    setPageCurrentAccepted(pageCurrentAccepted + 1);
    try {
      setLoading(true);
      const dataBody: IFriendFilterRequest = {
        pageCurrent: pageCurrentAccepted + 1,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST, dataBody);
      const newAccountResponses: IAccountResponse[] = res.result;
      if (newAccountResponses != null && newAccountResponses != undefined)
        setAccountResponses((prevAccountResponses) => [
          ...prevAccountResponses,
          ...newAccountResponses, // Thêm ảnh mới vào danh sách ảnh hiện tại
        ]);
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      setLoading(false);
    }
    return;
  };

  const addAccountFriendReceived = async () => {
    setPageCurrentReceived(pageCurrentReceived + 1);
    try {
      setLoading(true);

      const dataBody: IFriendFilterRequest = {
        pageCurrent: pageCurrentReceived + 1,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST_RECEIVED, dataBody);
      const newAccountResponses = res.result;
      if (newAccountResponses != null && newAccountResponses != undefined)
        setAccountReceivedResponses((prevAccountResponses) => [
          ...(prevAccountResponses ? prevAccountResponses : []),
          ...newAccountResponses,
        ]);
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      setLoading(false);
    }
    return;
  };

  const addAccountFriendSent = async () => {
    setPageCurrentSent(pageCurrentSent + 1);
    try {
      setLoading(true);

      const dataBody: IFriendFilterRequest = {
        pageCurrent: pageCurrentSent + 1,
        time: time,
      };
      const res = await FetchClientPostApi(API.ACCOUNT.LIST_SENT, dataBody);
      const newAccountResponses: IAccountResponse[] = res.result;
      if (newAccountResponses != null && newAccountResponses != undefined)
        setAccountSentResponses((prevAccountResponses) => [
          ...(prevAccountResponses ? prevAccountResponses : []),
          ...newAccountResponses, // Thêm ảnh mới vào danh sách ảnh hiện tại
        ]);
    } catch (error) {
      console.error("Error fetching additional images:", error);
    } finally {
      setLoading(false);
    }
    return;
  };

  const addAccountFriend = (type: string) => {
    if (type == "accepted") {
      addAccountFriendAccepted();
    }
    if (type == "received") {
      addAccountFriendReceived();
    }
    if (type == "sent") {
      addAccountFriendSent();
    }
  };

  const renderLoadMore = (type: string) => {
    if (
      totalItemsAccepted > (pageCurrentAccepted + 1) * 10 ||
      totalItemsReceived > (pageCurrentReceived + 1) * 10 ||
      totalItemsSent > (pageCurrentSent + 1) * 10
    )
      return (
        <Button
          variant="primary"
          disabled={loading} // Disable button khi đang loading
          onClick={() => addAccountFriend(type)}
        >
          Xem thêm
        </Button>
      );
  };

  const renderCardFriend = (accountResponses: IAccountResponse[] | null) => {
    if (accountResponses === null) {
      return (
        <>
          <div className="d-flex justify-content-center">
            <SpinnerAnimation></SpinnerAnimation>
          </div>
        </>
      )
    }


    return (
      <div >
        <div className="row row-cols-1 row-cols-sm-1 row-cols-md-2 row-cols-xl-3 g-1">
          {Array.isArray(accountResponses) && accountResponses.map((accountResponse, index) => (
            <div className="col" key={index}>
              <FriendCard accountResponse={accountResponse} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      <Tab.Container
        id="left-tabs-example"
        activeKey={activeTab}
        onSelect={handleTabSelect}
      >
        <Row className="mt-2">
          <Col sm={3} className="col-12">
            <Nav
              variant="pills"
              className="flex-column shadow round-2 border-2"
            >
              <Row>
                <Col sm={12} className="col-4 mb-1">
                  <Nav.Item>
                    <Nav.Link as={"div"} className="text-center" eventKey="first" style={{ cursor: "pointer" }}>
                      <i className="fa-solid fa-users" style={{ marginRight: "5px" }}></i> Bạn bè
                    </Nav.Link>
                  </Nav.Item>
                </Col>
                <Col sm={12} className="col-4  mb-1">
                  <Nav.Item>
                    <Nav.Link as={"div"} className="text-center" eventKey="second" style={{ cursor: "pointer" }}>
                      <i className="fa-regular fa-envelope" style={{ marginRight: "5px" }}></i>
                      <i className="fa-solid fa-arrow-left"></i> Lời mời
                    </Nav.Link>
                  </Nav.Item>
                </Col>
                <Col sm={12} className="col-4  mb-1">
                  <Nav.Item>
                    <Nav.Link as={"div"} className="text-center" eventKey="third" style={{ cursor: "pointer" }}>
                      <i className="fa-regular fa-envelope" style={{ marginRight: "5px" }}></i>
                      <i className="fa-solid fa-arrow-right"></i> Đã gửi
                    </Nav.Link>
                  </Nav.Item>
                </Col>
              </Row>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content className="p-2 bg-light shadow rounded-2 border-2">
              <Tab.Pane eventKey="first">
                {renderCardFriend(accountResponses)}
                <div className="d-flex justify-content-center">
                  {loading ? <SpinnerAnimation /> : renderLoadMore("accepted")}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                {renderCardFriend(accountReceivedResponses)}
                <div className="d-flex justify-content-center">
                  {loading ? <SpinnerAnimation /> : renderLoadMore("received")}
                </div>
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                {renderCardFriend(accountSentResponses)}
                <div className="d-flex justify-content-center">
                  {loading ? <SpinnerAnimation /> : renderLoadMore("sent")}
                </div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </>
  );
};
export default FriendAll;
