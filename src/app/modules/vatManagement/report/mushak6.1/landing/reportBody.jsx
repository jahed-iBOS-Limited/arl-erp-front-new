import React, { useRef } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import govLogo from "../images/govLogo.png";

function ReportBody({ gridData, headerData }) {
  const printRef = useRef();
  return (
    <>
      <div className="text-right mt-4 mb-8">
        <ReactToPrint
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

      <div componentRef={printRef} ref={printRef}>
        <table className="table w-100 table-sixPointone">
          <thead>
            <tr>
              <th className="sixOne-th" valign="center" halign="center">
                <div>
                  <img src={govLogo} alt={"Ibos"} />
                </div>
              </th>
              <th className="sixOne-th">
                <h2 className="text-center">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
                <div className="text-center">
                  <h4>
                    <strong>জাতীয় রাজস্ব বোর্ড</strong>
                  </h4>
                </div>
                <h4 className="text-center mt-4">
                  ২ (দুই) লক্ষ টাকার অধিক মূল্যমানের ক্রয়-বিক্রয় চালানপত্রের
                  তথ্য
                </h4>
                <h6>[ বিধি ৪২ এর উপ-বিধি (১) দ্রষ্টব্য ]</h6>
              </th>
              <th className="sixOne-th" valign="center" halign="center">
                <div>
                  <span>মুসক ৬.১০</span>
                </div>
              </th>
            </tr>
          </thead>
        </table>
        {/* <div
          style={{ display: "flex", alignItems: "center" }}
          className="col-lg-12 d-flex align-items-center justify-content-between row"
        >
          <div className="col-lg-3 d-flex align-items-center">
            <img src={govLogo} alt={"Ibos"} />
          </div>
          <div className="col-lg-6">
            <h2 className="text-center">গণপ্রজাতন্ত্রী বাংলাদেশ সরকার</h2>
            <div className="text-center">
              <h4>
                <strong>জাতীয় রাজস্ব বোর্ড</strong>
              </h4>
            </div>
          </div>
          <div className="col-lg-3  d-flex justify-content-end align-items-center">
            <span>মুসক ৬.১০</span>
          </div>
        </div> */}
        <div className="text-left mt-5">
          <h4>
            নিবন্ধিত/তালিকাভুক্ত ব্যক্তির নাম : {headerData?.nameOfTaxpayer}
          </h4>
          <h6>বিআইএন : {headerData?.bin}</h6>
        </div>
        {/* First Table */}
        <div className="my-10">
          <div className="text-left">
            <h4>অংশ-কঃ ক্রয় হিসাব তথ্য</h4>
          </div>
          <table className="table table-striped table-bordered bj-table border">
            <thead>
              <tr>
                <th colSpan="1" rowSpan="2">
                  ক্রমিক নং
                </th>
                <th colSpan="6" rowSpan="1">
                  ক্রয়
                </th>
              </tr>
              <tr>
                <th colSpan="1" rowSpan="1">
                  চালান পত্র নং
                </th>
                <th colSpan="1" rowSpan="1">
                  ইস্যুর তারিখ
                </th>
                <th colSpan="1" rowSpan="1">
                  মূল্য
                </th>
                <th colSpan="1" rowSpan="1">
                  ক্রেতার নাম
                </th>
                <th colSpan="1" rowSpan="1">
                  ক্রেতার ঠিকানা
                </th>
                <th colSpan="1" rowSpan="1">
                  ক্রেতার বিআইএন / জাতীয় পরিচয়পত্র নং
                </th>
              </tr>

              <tr>
                <th colSpan="1" rowSpan="1">
                  (১)
                </th>
                <th colSpan="1" rowSpan="1">
                  (২)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৩)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৪)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৫)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৬)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৭)
                </th>
              </tr>
            </thead>
            <tbody>
              {gridData?.purchaseData?.map((item, key) => (
                <tr key={key}>
                  <td className="text-center">{key + 1}</td>
                  <td>
                    <div className="pl-2">{item?.challanNo}</div>
                  </td>
                  <td>
                    <div className="text-center">
                      {_dateFormatter(item?.dateOfIssue)}
                    </div>
                  </td>
                  <td>
                    <div className="text-right pr-2">{item?.amount}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.supplierName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.supplierAddress}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.binNo}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* First Table End */}

        {/* Second Table */}
        <div className="mb-8">
          <div className="text-left">
            <h4>অংশ-খঃ বিক্রয় হিসাব তথ্য</h4>
          </div>
          <table className="table table-striped table-bordered bj-table border">
            <thead>
              <tr>
                <th colSpan="1" rowSpan="2">
                  ক্রমিক নং
                </th>
                <th colSpan="6" rowSpan="1">
                  ক্রয়
                </th>
              </tr>
              <tr>
                <th style={{ width: "100px" }} colSpan="1" rowSpan="1">
                  চালান পত্র নং
                </th>
                <th colSpan="1" rowSpan="1">
                  ইস্যুর তারিখ
                </th>
                <th colSpan="1" rowSpan="1">
                  মূল্য
                </th>
                <th colSpan="1" rowSpan="1">
                  বিক্রেতার নাম
                </th>
                <th colSpan="1" rowSpan="1">
                  বিক্রেতার ঠিকানা
                </th>
                <th colSpan="1" rowSpan="1">
                  বিক্রেতার বিআইএন / জাতীয় পরিচয়পত্র নং
                </th>
              </tr>
              <tr>
                <th colSpan="1" rowSpan="1">
                  (১)
                </th>
                <th colSpan="1" rowSpan="1">
                  (২)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৩)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৪)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৫)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৬)
                </th>
                <th colSpan="1" rowSpan="1">
                  (৭)
                </th>
              </tr>
            </thead>
            <tbody>
              {gridData?.salesData?.map((item, key) => (
                <tr key={key}>
                  <td className="text-center">{key + 1}</td>
                  <td>
                    <div className="pl-2">{item?.challanNo}</div>
                  </td>
                  <td>
                    <div className="text-center">
                      {_dateFormatter(item?.dateOfIssue)}
                    </div>
                  </td>
                  <td>
                    <div className="text-right pr-2">{item?.amount}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.supplierName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.supplierAddress}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.binNo}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="text-left mt-8">
            <h4>দায়িত্বপ্রাপ্ত ব্যক্তির সাক্ষর :</h4>
            <h6>নাম : </h6>
            <h6> তারিখ : </h6>
          </div>

          <div className="text-left pl-8 mt-8">
            যেই ক্ষেত্রে অনিবন্ধিত ব্যক্তির নিকট হইতে পণ্য/সেবা ক্রয় করা হইবে বা
            অনিবন্ধিত ব্যক্তির নিকট পণ্য/সেবা বিক্রয় করা হইবে, সেইক্ষেত্রে উক্ত
            ব্যক্তির পূর্ণাঙ্গ নাম, ঠিকানা ও জাতীয় পরিচয়পত্র নম্বর যথাযথভাবে
            সংশ্লিষ্ট কলামে [(৭) (৮) ও (৯)] আবশ্যিকভাবে উল্লেখ করিতে হইবে
          </div>
        </div>
        {/* Second Table End */}
      </div>
    </>
  );
}

export default ReportBody;
