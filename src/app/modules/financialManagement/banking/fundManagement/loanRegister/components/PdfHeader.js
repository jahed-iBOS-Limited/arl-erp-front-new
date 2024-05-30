import React from 'react'
import { APIUrl } from '../../../../../../App'

const PdfHeader = ({selectedBusinessUnit}) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center my-3">
    {selectedBusinessUnit?.imageId && (
      <div
        style={{
          position: "absolute",
          left: "100px",
          top: "20px",
        }}
      >
        <img
          style={{ width: "65px" }}
          src={`${APIUrl}/domain/Document/DownlloadFile?id=${selectedBusinessUnit?.imageId}`}
          alt=""
        />
      </div>
    )}

    <h1
      style={{
        textDecoration: "underline",
        fontSize: "22px",
      }}
    >
      {selectedBusinessUnit?.label}
    </h1>
    <h3
      style={{
        textDecoration: "underline",
        fontSize: "18px",
      }}
    >
      Akij House, 198 Bir Uttam, Gulshan Link Road, Tejgaon, Dhaka-1208.
    </h3>
  </div>
  )
}

export default PdfHeader