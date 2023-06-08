/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useRef } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import govLogo from "../images/govLogo.png";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  getGridDataOthers,
  getTreasuryChallanNoDDL,
  generate66,
  SetIsGenerated_api,
} from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import customStyles from "../../../../selectCustomStyle";
import Select from "react-select";

function ReportBodyOther({ values, setModalShowOther }) {
  const [singleData, setSingleData] = useState([]);
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [treasuryDDL, setTreasuryDDL] = useState("");
  const [balance, setBalance] = useState(0);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  // State For Input
  const [date, setDate] = useState(_todayDate());
  const [challanNo, setChallanNo] = useState("");

  const [certificateNo, setCertificateNo] = useState("");
  const [dateIssue, setDateIssue] = useState(_todayDate());

  useEffect(() => {
    getTreasuryChallanNoDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTreasuryDDL
    );
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (values?.viewType?.value === 1) {
      getGridDataOthers(
        profileData.accountId,
        selectedBusinessUnit?.value,
        values?.partner?.value,
        values?.viewType?.value,
        values?.taxBranch.value,
        values?.fromDate,
        values?.toDate,
        setSingleData,
        setLoading
      );
    } else if (values?.viewType?.value === 0) {
      getGridDataOthers(
        profileData.accountId,
        selectedBusinessUnit?.value,
        null,
        values?.viewType?.value,
        values?.taxBranch.value,
        values?.fromDate,
        values?.toDate,
        setSingleData,
        setLoading
      );
    }
  }, [values]);
  const taxPurchaseId = singleData?.map((itm) => itm?.taxPurchaseId);

  const SetIsGeneratedFunc = () => {
    const paylaod = taxPurchaseId;
    SetIsGenerated_api(paylaod);
    setModalShowOther(false);
  };

  const genarateHandler = () => {
    const payload = {
      mushak66HeaderDTO: {
        headerId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        taxBranchId: values?.taxBranch?.value,
        nameofWithholdingEntity: singleData[0]?.businessUnitName,
        certificateNo: "",
        addressofWithholdingEntity: singleData[0]?.companyAddress,
        dateofIssue: dateIssue || _todayDate(),
        binofWithholdingEntity: singleData[0]?.companyBin,
        treasuryChallanNo: challanNo?.label,
        treasuryDepositDate: date,
        treasuryChallanId: challanNo?.value || 0,
        taxPurchaseId: singleData[0]?.taxPurchaseId || 0,
      },
      mushak66RowDTO: singleData?.map((item) => {
        return {
          rowId: 0,
          headerId: 0,
          supplierId: item?.supplierId,
          supplierName: item?.supplierName,
          biNno: item?.supplierBin,
          invMushakChallanNo: item?.chalanNo || "",
          invIssueDate: item?.purchaseDateTime,
          totalValueofSupply: item?.total,
          amountofVat: item?.vdstotal,
          deductedVatamount: item?.vdstotal,
          isActive: true,
        };
      }),
    };
    generate66(
      payload,
      setCertificateNo,
      setDateIssue,
      SetIsGeneratedFunc,
      setLoading
    );
  };

  return (
    <>
      {loading && <Loading />}
      <div className="d-flex justify-content-between align-items-center">
        <div className="printSectionNone">
          <b>Balance</b>: {balance}
        </div>
        <div className="text-right mt-4 mb-8">
          <button
            type="button"
            style={{ padding: "6px 5px" }}
            disabled={!challanNo}
            className="btn btn-primary mr-2"
            onClick={() => {
              genarateHandler();
            }}
          >
            Generate
          </button>
          {singleData[0]?.length > 0 && (
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
          )}
        </div>
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

        {/* Middle Part Start */}
        <div style={{ width: "100%" }} className="row row-wrapper">
          <div style={{ width: "50%" }} className="col-lg-6">
            <h6>
              Name of withholding Entity : {singleData[0]?.businessUnitName}
            </h6>
            <h6>
              Address of Withholding Entity : {singleData[0]?.companyAddress}
            </h6>
            <h6>
              BIN Of withholding Entity (if applicable) :{" "}
              {singleData[0]?.companyBin}
            </h6>
          </div>
          <div style={{ width: "50%" }} className="col-lg-6">
            <h6>Certificate No : {certificateNo}</h6>
            <h6 className="d-flex align-items-center">
              <span>Date of issue : </span>
              <sapn>
                {" "}
                {certificateNo ? (
                  _dateFormatter(dateIssue)
                ) : (
                  <input
                    style={{ padding: ".1rem .5rem" }}
                    type="date"
                    value={dateIssue}
                    className="form-control ml-2"
                    onChange={(e) => setDateIssue(e.target.value)}
                  />
                )}
              </sapn>
            </h6>
            <h6 className="d-flex">
              <span className="d-flex align-items-center w-50">
                <label>Treasury Challan No :</label>
                <Select
                  className="w-100"
                  placeholder="Treasury Challan No"
                  value={challanNo}
                  onChange={(value) => {
                    setChallanNo(value);
                    setBalance(value?.balance);
                  }}
                  styles={customStyles}
                  isSearchable={true}
                  options={treasuryDDL || []}
                />
              </span>
            </h6>
            <h6 className="d-flex align-items-center">
              <span>Tr. Deposit Date :</span>
              <span>
                <input
                  style={{ padding: ".1rem .5rem" }}
                  type="date"
                  value={date}
                  className="form-control ml-2"
                  onChange={(e) => setDate(e.target.value)}
                />
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

        {/* Table Part Start */}
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
              {singleData &&
                singleData?.map((item, index) => (
                  <tr>
                    <td className="text-center">{index + 1}</td>
                    <td>
                      <div className="pl-2">{item?.supplierName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.supplierBin}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.chalanNo}</div>
                    </td>
                    <td className="text-center">
                      {_dateFormatter(item?.purchaseDateTime)}
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{_formatMoney(item?.total)}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{_formatMoney(item?.vdstotal)}</div>
                    </td>
                    <td className="text-right">
                      <div className="pr-2">{_formatMoney(item?.vdstotal)}</div>
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

export default ReportBodyOther;
