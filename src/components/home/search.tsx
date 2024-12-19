"use client";
import API from "@/api/api";
import { FetchClientGetApiWithSignal } from "@/api/fetch_client_api";
import { useRef, useState } from "react";
import { Form, InputGroup } from "react-bootstrap";
import FriendCard from "./friend_card";
import { SpinnerOverlay } from "./spinner_overlay";

const LiveSearch = () => {
  const [suggestions, setSuggestions] = useState<IAccountResponse[] | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [valueSearch, setValueSearch] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null); // Use ref to keep track of the controller

  const handleSearch = async (value: string) => {
    // Bật trạng thái loading
    setLoading(true);
    setValueSearch(value);

    // Nếu giá trị nhập trống, dừng và xóa kết quả
    if (value.trim().length === 0) {
      setSuggestions([]);
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
      setSuggestions(data?.result); // Cập nhật kết quả
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
        className="position-fixed top-0 bottom-0 start-0 end-0 z-1"
        onClick={() => setValueSearch("")}
      ></div>
    );

    // Nếu đang tải, hiển thị spinner
    if (loading) {
      return (
        <>
          {renderOverlay()}
          <div className="w-100 shadow show w-100 position-absolute bg-white z-2 p-2 rounded">
            <div className="search-load z-2">
              <SpinnerOverlay />
            </div>
          </div>
        </>
      );
    } else {
      // Nếu không có từ khóa tìm kiếm, không hiển thị gì
      if (!valueSearch.trim()) return <></>;

      // Nếu không có suggestions hoặc suggestions trống, hiển thị "Không tìm thấy"
      if (suggestions === null || suggestions?.length === 0) {
        return (
          <>
            {renderOverlay()}
            <div className="w-100 shadow show w-100 position-absolute bg-white z-2 p-2 rounded">
              <p>Không tìm thấy</p>
            </div>
          </>
        );
      }
      if (suggestions !== null && suggestions?.length > 0)
        // Nếu có kết quả tìm kiếm, hiển thị danh sách kết quả
        return (
          <>
            {renderOverlay()}
            <div className="w-100 shadow show w-100 position-absolute bg-white z-2 p-2 rounded">
              {suggestions.map((item, index) => (
                <FriendCard accountResponse={item} key={index} />
              ))}
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
