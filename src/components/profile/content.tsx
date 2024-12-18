"use client";
import React from "react";
import { Row, Col } from "react-bootstrap";


const ContentOfUser = ({
  //  data

 }) => {
  // // Tách dữ liệu thành nhóm 2 phần tử
  // const rows = [];
  // for (let i = 0; i < data.length; i += 2) {
  //   rows.push(data.slice(i, i + 2));
  // }

  return (
    <>
      {/* {rows.map((row, rowIndex) => (
        <Row key={rowIndex} className="mb-3">
          {row.map((item, colIndex) => (
            <Col key={colIndex} xs={12} sm={6}>
              <img src={item} alt={`image-${rowIndex}-${colIndex}`} className="img-fluid rounded" />
            </Col>
          ))}
        </Row>
      ))} */}
    </>
  );
};

export default ContentOfUser;
