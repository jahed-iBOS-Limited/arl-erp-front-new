import React, { useEffect, useState, useRef } from "react";
import {
  getSinglePurchase,
  generate66,
  getTreasuryChallanNoDDL,
  SetIsGenerated_api,
} from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import govLogo from "../images/govLogo.png";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import Loading from "./../../../../_helper/_loading";

function ReportBody({ viewClick }) {
  const [singleData, setSingleData] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [treasuryDDL, setTreasuryDDL] = useState("");
  const [, setRowDto] = useState([]);
  const printRef = useRef();

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
  const [balance, setBalance] = useState(0);

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
    if (viewClick) {
      getSinglePurchase(viewClick?.taxPurchaseId, setSingleData, setRowDto);
    }
  }, [viewClick]);

  const SetIsGeneratedFunc = () => {
    const paylaod = [singleData?.taxPurchaseId];
    SetIsGenerated_api(paylaod);;
  };
  const genarateHandler = () => {
    const payload = {
      mushak66HeaderDTO: {
        headerId: 0,
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        taxBranchId: singleData?.taxBranchId,
        nameofWithholdingEntity: singleData?.businessUnitName,
        certificateNo: "",
        addressofWithholdingEntity: singleData?.companyAddress,
        dateofIssue: dateIssue || _todayDate(),
        binofWithholdingEntity: singleData?.companyBin,
        treasuryChallanNo: challanNo?.label,
        treasuryDepositDate: date,
        treasuryChallanId: challanNo?.value || 0,
        taxPurchaseId: singleData?.taxPurchaseId || 0,
      },
      mushak66RowDTO: [
        {
          rowId: 0,
          headerId: 0,
          supplierId: +singleData?.supplierId || 0,
          supplierName: singleData?.supplierName,
          biNno: +singleData?.supplierBin || 0,
          invMushakChallanNo: singleData?.chalanNo || "",
          invIssueDate: singleData?.purchaseDateTime,
          totalValueofSupply: +singleData?.total || 0,
          amountofVat: +singleData?.vdstotal || 0,
          deductedVatamount: +singleData?.vdstotal || 0,
          isActive: true,
        },
      ],
    };
    generate66(
      payload,
      setCertificateNo,
      setDateIssue,
      SetIsGeneratedFunc,
      setIsLoading
    );
  };

  return (
    <>
      {isLoading && <Loading />}
      <div className="d-flex justify-content-between align-items-center">
        <div className="printSectionNone">
          <b>Balance</b>: {balance}
        </div>
        <div className="text-right mt-4 mb-8">
          {!certificateNo && (
            <button
              type="button"
              style={{ padding: "6px 5px" }}
              disabled={!challanNo || isLoading}
              className="btn btn-primary mr-2"
              onClick={() => {
                genarateHandler();
              }}
            >
              Generate
            </button>
          )}

          {certificateNo && (
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

        <div style={{ width: "100%" }} className="row row-wrapper">
          <div style={{ width: "50%" }} className="col-lg-6">
            <h6>Name of withholding Entity : {singleData?.businessUnitName}</h6>
            <h6>
              Address of Withholding Entity : {singleData?.companyAddress}
            </h6>
            <h6>
              BIN Of withholding Entity (if applicable) :{" "}
              {singleData?.companyBin}
            </h6>
          </div>
          <div style={{ width: "50%" }} className="col-lg-6">
            <h6>Certificate No : {certificateNo}</h6>
            {/* <h6>Date of issue : {_dateFormatter(dateIssue)}</h6> */}
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
                {certificateNo ? (
                  challanNo?.value
                ) : (
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
                )}
              </span>
            </h6>
            <h6 className="d-flex align-items-center">
              <span>Tr. Deposit Date :</span>
              <span>
                {certificateNo ? (
                  date
                ) : (
                  <input
                    style={{ padding: ".1rem .5rem" }}
                    type="date"
                    value={date}
                    className="form-control ml-2"
                    onChange={(e) => setDate(e.target.value)}
                  />
                )}
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
              <tr>
                <td className="text-center">1</td>
                <td>
                  <div className="pl-2">{singleData?.supplierName}</div>
                </td>
                <td>
                  <div className="pl-2">{singleData?.partnerBin}</div>
                </td>
                <td>
                  <div className="pl-2">{singleData?.chalanNo}</div>
                </td>
                <td className="text-center">
                  {_dateFormatter(singleData?.purchaseDateTime)}
                </td>
                <td className="text-right">
                  <div className="pr-2">{_formatMoney(singleData?.total)}</div>
                </td>
                <td className="text-right">
                  <div className="pr-2">
                    {_formatMoney(singleData?.vdstotal)}
                  </div>
                </td>
                <td className="text-right">
                  <div className="pr-2">
                    {_formatMoney(singleData?.vdstotal)}
                  </div>
                </td>
              </tr>
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

export default ReportBody;
