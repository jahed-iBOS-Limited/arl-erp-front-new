import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import "./JohariWindow.css";

export default function PDFVIEW({ chipList, rowData }) {
  const { employeeId, employeeFullName } = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  return (
    <>
      <div className="johari-window-wrapper">
        <div className="mb-5">
          <h4 className="texr-secondary text-center mb-5 mt-5">
            Johari Window
          </h4>
          <div className="row mt-2 mb-2">
            <div className="col-lg-4 ml-3">
              <div>
                <strong>Name</strong>: <span>{employeeFullName}</span>
              </div>
              <div>
                <strong>Enroll</strong>: <span>{employeeId}</span>
              </div>
            </div>
            <div className="col-lg-4">
              <div>
                <strong>Designation</strong>:{" "}
                <span>{rowData?.designation || ""}</span>
              </div>
              <div>
                <strong>Location</strong>:{" "}
                <span>{rowData?.workplaceGroup || ""}</span>
              </div>
            </div>
            <div className="col-lg-3">
              <div>
                <strong>Year</strong>: <span>{rowData?.year || ""}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group row mb-4 global-form">
          {/* start */}
          <div className="col-sm-6 p-0 johari-window-model-open-block">
            <div className="johari-window-model">
              <strong className="mr-5" style={{ fontSize: "12px" }}>
                Open
              </strong>
              <div className="mt-2">
                {chipList?.open?.map((data, index) => (
                  <span className="pdf-chip-johari-window">{data?.label}</span>
                ))}
              </div>
            </div>
          </div>
          {/* end */}
          {/* start */}
          <div className="col-sm-6 p-0">
            <div className="johari-window-model">
              <strong className="mr-5" style={{ fontSize: "12px" }}>
                Blind
              </strong>
              <div className="mt-2">
                {chipList?.blind?.map((data, index) => (
                  <span className="pdf-chip-johari-window">{data?.label}</span>
                ))}
              </div>
            </div>
          </div>
          {/* end */}
          {/* start */}
          <div className="col-sm-6 p-0 johari-window-model-hidden-block">
            <div className="johari-window-model">
              <strong className="mr-5" style={{ fontSize: "12px" }}>
                Hidden
              </strong>
              <div className="mt-2">
                {chipList?.hidden?.map((data, index) => (
                  <span className="pdf-chip-johari-window">{data?.label}</span>
                ))}
              </div>
            </div>
          </div>
          {/* end */}
          {/* start */}
          <div className="col-sm-6 p-0">
            <div className="johari-window-model">
              <strong className="mr-5" style={{ fontSize: "12px" }}>
                Unknown
              </strong>
              <div className="mt-2">
                {chipList?.unknown?.map((data, index) => (
                  <span className="pdf-chip-johari-window">{data?.label}</span>
                ))}
              </div>
            </div>
          </div>
          {/* end */}
        </div>
      </div>
    </>
  );
}
