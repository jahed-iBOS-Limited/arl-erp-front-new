/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { getSingleGenerateData, getTreasuryChallanNoDDL } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import govLogo from "../images/govLogo.png";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

function ReportBodyGenerate({ viewClick }) {
  const [singleData, setSingleData] = useState("");
  const [rowDto, setRowDto] = useState([]);
  const printRef = useRef();

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  useEffect(() => {
    if (viewClick) {
      getSingleGenerateData(
        viewClick?.generateMushakId,
        setSingleData,
        setRowDto
      );
    }
  }, [viewClick]);

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
        {/* Header Part */}
        <div className="text-center d-flex justify-content-between mt-4 mb-8">
          <div>
            <img src={govLogo} alt={"Ibos"} />
          </div>
          <div>
            <h5 className="text-center">
              Government of the People's Republic of Bangladesh
            </h5>
            <h5 className="font-weight-bold text-center">
              National Board of Revenue
            </h5>
            <h3 className="font-weight-bold text-center">
              VAT Deduct at Soucre Certificate
            </h3>
            <p className="text-center">
              (See clause (f) of Sub-Rule (1) of Rule 40)
            </p>
          </div>
          <div>
            <sapn
              style={{
                border: "2px solid #808080",
                padding: "2px",
              }}
              className="text-right font-weight-bold"
            >
              Musok-6.6
            </sapn>
          </div>
        </div>
        {/* Header Part End */}

        <div style={{ width: "100%" }} className="row row-wrapper">
          <div style={{ width: "50%" }} className="col-lg-6">
            <h6>
              Name of withholding Entity : {singleData?.nameofWithholdingEntity}
            </h6>
            <h6>
              Address of Withholding Entity :{" "}
              {singleData?.addressofWithholdingEntity}
            </h6>
            <h6>
              BIN Of withholding Entity (if applicable) :{" "}
              {singleData?.binofWithholdingEntity}
            </h6>
          </div>
          <div style={{ width: "50%" }} className="col-lg-6">
            <h6>Certificate No : {singleData?.certificateNo} </h6>
            <h6>Date of issue : {_dateFormatter(singleData?.dateofIssue)}</h6>
            <h6 className="d-flex">
              <span className="d-flex align-items-center w-50">
                Treasury Challan No : {singleData?.treasuryChallanNo}
              </span>
            </h6>
            <h6 className="d-flex align-items-center">
              <span>
                Tr. Deposit Date :{" "}
                {_dateFormatter(singleData?.treasuryDepositDate)}
              </span>
            </h6>
          </div>
        </div>
        <div className="row mt-5 mb-8">
          <div className="col-lg-12">
            <h6>
              This is to certify that VAT has been deducted at source from the
              supplies having VAT deductible at source in accordance with
              section 49 of the act. The VAT so deducted has been deposited in
              the government treasury by book transfer / treasury challan /
              increasing adjustment in the return. A copy has been attached ( if
              applicable )
            </h6>
          </div>
        </div>
        {/* Middle Part End */}

        {/* Table Part */}

        <div className="mb-30">
          <table className="table table-striped table-bordered bj-table border">
            <thead>
              <tr>
                <th rowSpan="2">S/N</th>
                <th rowSpan="1" colSpan="2">
                  Supplier Information
                </th>
                <th rowSpan="1" colSpan="2">
                  Concerned tax invoice
                </th>
                <th rowSpan="2">Total Value of supply1 (TK)</th>
                <th rowSpan="2">Amount of VAT (TK)</th>
                <th rowSpan="2">Amount of VAT deducted at source (TK)</th>
              </tr>
              <tr>
                <th colSpan="1">Name</th>
                <th colSpan="1">BIN NO</th>
                <th colSpan="1">Mushak Challan Number</th>
                <th colSpan="1">Issue Date</th>
              </tr>
            </thead>
            <tbody>
              {rowDto?.map((item, index) => (
                <tr>
                  <td className="text-center">{index + 1}</td>
                  <td>
                    <div className="pl-2">{item?.supplierName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.biNno}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.invMushakChallanNo}</div>
                  </td>
                  <td className="text-center">
                    {_dateFormatter(item?.invIssueDate)}
                  </td>
                  <td className="text-right">
                    <div className="pr-2">
                      {_formatMoney(item?.totalValueofSupply)}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">
                      {_formatMoney(item?.amountofVat)}
                    </div>
                  </td>
                  <td className="text-right">
                    <div className="pr-2">
                      {_formatMoney(item?.deductedVatamount)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Table Part End */}

        {/* Footer Part */}
        <div className="mb-8">
          <h6 className="mb-10">Signature of In-Charge</h6>
        </div>
        <div>
          <span style={{ borderTop: "1px solid #808080", fontSize: "1rem" }}>
            1 VAT & SD (if any inclusive price)
          </span>
        </div>
        {/* Footer Part End */}
      </div>
    </>
  );
}

export default ReportBodyGenerate;
