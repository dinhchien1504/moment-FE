"use client";
import API from "@/api/api";
import { FetchClientGetApi } from "@/api/fetch_client_api";
import React, { useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import FriendCard from "./friend_card";

const LiveSearch = () => {
  const [suggestions, setSuggestions] = useState<IFriendResponse[]>([]);

  const handleSearch = async (value: string) => {
    if (value.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const response = await FetchClientGetApi(API.SEARCH.ALL + "?s=" + value);
      const data = await response;
      if (data.status === 200) {
        setSuggestions(data.result);
      }
    } catch (error) {
      console.error("Lỗi khi fetch dữ liệu:", error);
    }
  };

  return (
    <>
      <div className="w-100 position-relative">
        <InputGroup className="d-flex justify-content-center">
          <InputGroup.Text id="basic-addon1" className="icon-search">
            <i className="fa fa-search inp-search"></i>
          </InputGroup.Text>
          <Form.Control
            id="search-input"
            placeholder="Tìm kiếm bạn"
            aria-label="Search"
            aria-describedby="basic-addon1"
            className="inp-search"
            onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
          />
        </InputGroup>
        {suggestions.length > 0 && (
          <div className="dropdown-menu w-100 shadow show w-100 position-absolute">
            {suggestions.map((item,index) => (
                <FriendCard friendResponse={item} key={index}></FriendCard>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default LiveSearch;
