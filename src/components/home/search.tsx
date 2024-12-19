"use client";
import API from "@/api/api";
import { FetchClientGetApiWithSignal } from "@/api/fetch_client_api";
import { useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import FriendCard from "./friend_card";
import SpinnerAnimation from "../shared/spiner_animation";

const LiveSearch = () => {
  const [suggestions, setSuggestions] = useState<IAccountResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [valueSearch, setValueSearch] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null); // Use ref to keep track of the controller

  const handleSearch = async (value: string) => {
    // Bật trạng thái loading
    setLoading(true);
    setValueSearch(value);

    // Nếu giá trị nhập trống, dừng và xóa kết quả
    if (value.trim().length === 0) {
      // setSuggestions([]);
      setLoading(false); // Tắt loading nếu không cần fetch
      return;
    }

    // Hủy yêu cầu trước đó nếu có
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Tạo một AbortController mới
    const abortController = new AbortController();
    abortControllerRef.current = abortController; // Lưu vào ref để có thể hủy

    const { signal } = abortController;

    try {
      // Thực hiện fetch với signal
      const data = await FetchClientGetApiWithSignal(
        API.SEARCH.ALL + "?s=" + value,
        signal
      );
      if(data)
        setSuggestions(data.result); // Cập nhật kết quả
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          // Yêu cầu bị hủy, không làm gì
          console.log("Yêu cầu đã bị hủy");
        } else {
          console.error("Lỗi khi fetch dữ liệu:", error.message);
        }
      } else {
        console.error("Lỗi không xác định:", error);
      }
    } finally {
      // Chỉ tắt trạng thái loading khi yêu cầu không bị hủy
      if (!signal.aborted) {
        setLoading(false);
      }
    }
  };
  const renderSearchPanel = () => {
    // Hàm để tái sử dụng phần giao diện nền
    const renderOverlay = () => (
      <div
        className="position-fixed top-0 bottom-0 start-0 end-0 z-2"
        onClick={() =>{setValueSearch("");setSuggestions([])} }
      ></div>
    );
  
    // Nếu không có từ khóa tìm kiếm, không hiển thị gì
    if (!valueSearch.trim()) return <></>;
  
    // Nếu không có suggestions hoặc suggestions trống, hiển thị "Không tìm thấy"
    if (!loading && (suggestions === null || suggestions?.length === 0)) {
      return (
        <>
          {renderOverlay()}
          <div className="w-100 shadow show w-100 position-absolute bg-white z-3 p-2 rounded">
            <p>Không tìm thấy</p>
          </div>
        </>
      );
    }
  
    // Nếu đang tải và có danh sách suggestions, hiển thị cả hai
    if (loading && suggestions?.length > 0) {
      return (
        <>
          {renderOverlay()}
          <div className="w-100 shadow show w-100 position-absolute bg-white z-3 p-2 rounded search-load">
            <div className="align-items-center bg-dark bg-opacity-25 bottom-0 d-flex end-0 justify-content-center position-absolute start-0 top-0 z-3">
              <SpinnerAnimation />
            </div>
            {suggestions.map((item, index) => (
              <FriendCard accountResponse={item} key={index} />
            ))}
          </div>
        </>
      );
    }
  
    // Nếu chỉ có danh sách suggestions
    if (suggestions?.length > 0) {
      return (
        <>
          {renderOverlay()}
          <div className="w-100 shadow show w-100 position-absolute bg-white z-3 p-2 rounded search-load">
            {suggestions.map((item, index) => (
              <FriendCard accountResponse={item} key={index} />
            ))}
          </div>
        </>
      );
    }
  
    // Trường hợp mặc định, loading mà không có suggestions
    if (loading) {
      return (
        <>
          {renderOverlay()}
          <div className="w-100 shadow show w-100 position-absolute bg-white z-3 p-2 rounded search-load">
            <div className="align-items-center bg-dark bg-opacity-25 bottom-0 d-flex end-0 justify-content-center position-absolute start-0 top-0 z-3">
              <SpinnerAnimation />
            </div>
          </div>
        </>
      );
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
            value={valueSearch}
            onInput={(e) => handleSearch((e.target as HTMLInputElement).value)}
          />
        </InputGroup>

        {renderSearchPanel()}
      </div>
    </>
  );
};

export default LiveSearch;
