import React, { useState, useRef } from "react";
import { _todayDate } from "../../../../_helper/_todayDate";
import govLogo from "../images/govLogo.png";
import InputField from "../../../../_helper/_inputField";
import { _dateFormatterTwo } from "../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
const Latetable = ({ taxPayerInfo, employeeBasicDetails }) => {
  // const [taxPayerName, setTaxPayerName] = useState("");
  // const [number1, setNumber1] = useState("");
  // const [number2, setNumber2] = useState("");
  // const [number3, setNumber3] = useState("");
  // const [number4, setNumber4] = useState("");
  // const [number5, setNumber5] = useState("");
  // const [number6, setNumber6] = useState("");
  // const [number7, setNumber7] = useState("");
  // const [number8, setNumber8] = useState("");
  // const [number9, setNumber9] = useState("");
  const [reason, setReason] = useState("");

  let boxStyle = {
    borderRight: "1px solid #000000",
    height: "29px",
    width: "35px",
  };

  // let inputStyle = {
  //   border: "1px solid gray",
  //   borderRadius: "4px",
  // };

  let month = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  let date = new Date();
  let _month = date.getMonth();
  let cMonth = month[_month];

  let today = _todayDate();
  let splittedToday = today.split("-").join("");
  let splittedTodayNew = splittedToday.split("");
  const pageStyle = `
    @page {
      margin: 1mm  1mm  1mm 1mm !important;
    }
  `;
  const printRef = useRef();
  const binNumber = taxPayerInfo?.bin?.split("") || [];
  return (
    <div>
      <div
        className="bg-white"
        style={{ padding: "30px 40px" }}
        componentRef={printRef}
        ref={printRef}
      >
        <div className="d-flex justify-content-end printSectionNone">
          <ReactToPrint
            pageStyle={pageStyle}
            trigger={() => (
              <button
                type="button"
                className="btn btn-primary"
                style={{ padding: "2px 5px" }}
              >
                <img
                  style={{
                    width: "25px",
                    paddingRight: "5px",
                  }}
                  src={printIcon}
                  alt="print-icon"
                />
                Print
              </button>
            )}
            content={() => printRef.current}
          />
        </div>
        <div className="amend-header">
          <img
            style={{ position: "absolute", top: "60px", left: "60px" }}
            src={govLogo}
            alt={"Ibos"}
          />
          <div className="text-center">
            <div>গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</div>
            <div>
              <b>জাতীয় রাজস্ব বোর্ড</b>
            </div>
          </div>
          <div className="text-right">
            <b
              style={{
                border: "1px solid #000000",
                width: "70px",
                padding: "4px",
              }}
            >
              মূসক-৯.৩
            </b>
          </div>
          <div className="text-center">
            <div>
              <b>সংশোধিত দাখিলপত্র পেশের আবেদন</b>
            </div>
            <div>[বিধি ৪৯ এর উপ-বিধি (২) দ্রষ্টব্য]</div>
          </div>
          <div style={{ background: "#80808026" }} className="text-center mt-5">
            <div>
              <b>অংশ-১ : করাদাতার তথ্য</b>
            </div>
          </div>
          {/* Table */}
          <table className="table amend-table">
            <tbody>
              <tr>
                <td style={{ width: "340px" }}>
                  <b>(১) করাদাতার নাম</b>
                </td>
                <td style={{ width: "70px" }} className="text-center">
                  :
                </td>
                <td>
                  {taxPayerInfo?.nameOfTaxpayer}
                  {/* <input
                    value={taxPayerName}
                    className="m-1"
                    name="taxBranchAddress"
                    placeholder="Enter text"
                    style={inputStyle}
                    onChange={(e) =>{
                        setTaxPayerName(e.target.value);
                    }}
                    type="text"
                /> */}
                </td>
              </tr>
              <tr>
                <td style={{ width: "340px" }}>
                  <b>(২) ব্যবসায় সনাক্তকরণ সংখ্যা (বিআইএন) </b>
                </td>
                <td style={{ width: "30px" }} className="text-center">
                  :
                </td>
                <td style={{ height: "43px" }}>
                  <div className="d-flex justify-content-center">
                    <div
                      style={{
                        border: "1px solid #000000",
                        borderRight: "0px solid transparent",
                        marginTop: "30px",
                        height: "30px",
                        width: "300px",
                        display: "flex",
                      }}
                    >
                      {binNumber?.map((itm) => (
                        <div className="text-center" style={boxStyle}>
                          {itm}
                        </div>
                      ))}
                      {/* <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[0]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[1]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[2]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[3]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[4]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[5]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[6]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[8]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[9]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[10]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[11]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[12]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {taxPayerInfo?.bin?.split("")?.[13]}
                      </div> */}
                    </div>
                  </div>

                  {/* <div className="d-flex justify-content-center">
                    <div style={{
                      //   border: "1px solid #000000",
                      borderRight: "0px solid transparent",
                      marginTop: "30px",
                      height: "30px",
                      width: "300px",
                      display: "flex",
                    }}>
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number1}
                            name="number1"
                            onChange={(e) =>{
                                setNumber1(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number2}
                            name="number2"
                            onChange={(e) =>{
                                setNumber2(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number3}
                            name="number3"
                            onChange={(e) =>{
                                setNumber3(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number4}
                            name="number4"
                            onChange={(e) =>{
                                setNumber4(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number5}
                            name="number5"
                            onChange={(e) =>{
                                setNumber5(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number6}
                            name="number6"
                            onChange={(e) =>{
                                setNumber6(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number7}
                            name="number7"
                            onChange={(e) =>{
                                setNumber7(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number8}
                            name="number8"
                            onChange={(e) =>{
                                setNumber8(e.target.value);
                            }}
                            type="text"
                        />
                        <input
                            style={{ ...inputStyle, ...boxStyle }}
                            value={number9}
                            name="number9"
                            onChange={(e) =>{
                                setNumber9(e.target.value);
                            }}
                            type="text"
                        />
                    </div>
                  </div> */}
                </td>
              </tr>
            </tbody>
          </table>

          {/* Second section with table start */}
          <div style={{ background: "#80808026" }} className="text-center mt-5">
            <div>
              <b>অংশ-২ : দাখিলপত্র পেশের তথ্য </b>
            </div>
          </div>
          {/* Table */}
          <table className="table amend-table">
            <tbody>
              <tr>
                <td style={{ width: "340px" }}>
                  <b>(১) কর মেয়াদ</b>
                </td>
                <td style={{ width: "30px" }} className="text-center">
                  :
                </td>
                <td className="text-center">
                  {cMonth} / {date.getFullYear()}
                </td>
              </tr>
              <tr>
                <td style={{ width: "340px" }}>
                  <b>(২) দাখিলের তারিখ </b>
                </td>
                <td style={{ width: "30px" }} className="text-center">
                  :
                </td>
                <td style={{ height: "70px" }}>
                  <div className="d-flex justify-content-center">
                    <div
                      style={{
                        border: "1px solid #000000",
                        borderRight: "0px solid transparent",
                        marginTop: "30px",
                        height: "30px",
                        width: "300px",
                        display: "flex",
                      }}
                    >
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[6]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[7]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        /
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[4]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[5]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        /
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[0]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[1]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[2]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[3]}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {/* Second section with table end */}

          {/* Third section with table start */}
          <div style={{ background: "#80808026" }} className="text-center mt-5">
            <div>
              <b>অংশ-৩ : বিলম্বে দাখিলের তথ্য </b>
            </div>
          </div>
          {/* Table */}
          <table className="table amend-table">
            <tbody>
              <tr>
                <td style={{ width: "340px" }}>
                  <b>(১) প্রস্তাবিত দাখিলের তারিখ </b>
                </td>
                <td style={{ width: "30px" }} className="text-center">
                  :
                </td>
                <td style={{ height: "70px" }}>
                  <div className="d-flex justify-content-center">
                    <div
                      style={{
                        border: "1px solid #000000",
                        borderRight: "0px solid transparent",
                        marginTop: "30px",
                        height: "30px",
                        width: "300px",
                        display: "flex",
                      }}
                    >
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[6]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[7]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        /
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[4]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[5]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        /
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[0]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[1]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[2]}
                      </div>
                      <div className="text-center" style={boxStyle}>
                        {splittedTodayNew[3]}
                      </div>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ width: "340px" }}>
                  <b>(২) বিলম্বে পেশের কারন</b>
                </td>
                <td style={{ width: "30px" }} className="text-center">
                  :
                </td>
                <td className="text-center">
                  {/* <input
                  value={reason}
                  name="taxBranchAddress"
                  placeholder="বিলম্বে পেশের কারন"
                  onChange={(e) => {
                    setReason(e.target.value);
                  }}
                  type="text"
                /> */}

                  <InputField
                    style={{ height: "35px" }}
                    value={reason}
                    name="reason"
                    placeholder="বিলম্বে পেশের কারন"
                    type="text"
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {/* Fourth section with table Start */}
          <div style={{ background: "#80808026" }} className="text-center mt-5">
            <div>
              <b>অংশ-৪ : ঘোষণা </b>
            </div>
          </div>
          <table className="table amend-table">
            <tbody>
              <tr>
                <td colspan="3">
                  <div className="ml-1">
                    আমি ঘোষণা করিতেছি যে , এই আবেদন পত্রে প্রদত্ত তথ্য
                    সর্বোতভাবে সম্পুর্ণ সত্য ও নির্ভুল ।
                  </div>
                </td>
              </tr>
              <tr>
                <td style={{ width: "200px" }}>
                  <div className="ml-1">নাম</div>
                </td>
                <td colspan="2" style={{ width: "600px" }}>
                  {employeeBasicDetails?.userName}
                  {/* <input
                  className="m-1"
                  style={inputStyle}
                  type="text"
                  placeholder="নাম"
                /> */}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="ml-1">পদবি</div>
                </td>
                <td style={{ width: "600px" }}>
                  {employeeBasicDetails?.designationName}
                  {/* <input
                  className="m-1"
                  style={inputStyle}
                  type="text"
                  placeholder="পদবি"
                /> */}
                </td>
                <td rowspan="4"></td>
              </tr>
              <tr>
                <td>
                  <div className="ml-1">তারিখ</div>
                </td>
                <td>
                  {_dateFormatterTwo(_todayDate())}
                  {/* <input
                  className="m-1"
                  style={inputStyle}
                  type="text"
                  placeholder="তারিখ"
                /> */}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="ml-1">মোবাইল নম্বর</div>
                </td>
                <td>
                  {employeeBasicDetails?.contact}
                  {/* <input
                  className="m-1"
                  style={inputStyle}
                  type="text"
                  placeholder="মোবাইল নম্বর"
                /> */}
                </td>
              </tr>
              <tr>
                <td>
                  <div className="ml-1">ইমেইল</div>
                </td>
                <td>
                  {employeeBasicDetails?.emailAddress}
                  {/* <input
                  className="m-1"
                  style={inputStyle}
                  type="text"
                  placeholder="ইমেইল"
                /> */}
                </td>
              </tr>
              <tr>
                <td style={{ visibility: "hidden" }}></td>
                <td style={{ visibility: "hidden" }}></td>
                <td>
                  <div className="ml-1">স্বাক্ষর</div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Latetable;
