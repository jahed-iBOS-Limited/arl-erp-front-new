import React, { useRef } from "react";
import printIcon from "./../../../_helper/images/print-icon.png";
import ReactToPrint from "react-to-print";
import "./transferOutIboss.css";
import { _dateFormatter } from "./../../../_helper/_dateFormate";
import moment from "moment";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";

const tableTitles = [
  "SL No",
  "Goods (In case of specify brand name Description)",
  "Quantity",
  "Value Excluding Tax",
  "Amount Of Applicable Tax",
  "Comments",
];
export default function TransferOutViewForm({
  id,
  show,
  desinationName,
  onHide,
  createSaveData,
  URL,
  modelData,
}) {
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData } = storeData;

  const printRef = useRef();
  return (
    <div>
      {/* <IViewModal
        show={show}
        onHide={onHide}
        title={"Sales Invoice iBOS"}
        btnText="Close"
        componentRef={printRef}
      > */}
      <div
        className="sales-invoice-model_top sales-invoice-model-print print_wrapper"
        ref={printRef}
      >
        <div className="row sales-invoice-model m-0">
          <div className="col-lg-2 mt-4 offset-10 d-flex justify-content-end">
            <ReactToPrint
              trigger={() => (
                <button
                  type="button"
                  className="btn btn-primary sales_invoice_btn"
                >
                  <img
                    style={{ width: "25px", paddingRight: "5px" }}
                    src={printIcon}
                    alt="print-icon"
                  />
                  Print
                </button>
              )}
              content={() => printRef.current}
            />
          </div>
          <div className="col-lg-12 p-0">
            <div className="title text-center mt-5">
              <div className="top">
                <h1>Government of the People's Republic of Bangladesh</h1>
                <h5>National Board of Revenue</h5>
              </div>

              <div className="buttom">
                <p>
                  Invoice for transfer Goods of Central registered organization
                </p>
                <p>[See Clauses (C) and (f) of Sub-Rule (1) of Rule 40]</p>
              </div>
            </div>
          </div>
          <div className="col-lg-12">
            <div className="d-flex justify-content-between">
              <div className="left">
                <p>
                  Name of Registered Person:{" "}
                  {modelData?.getByIdHeader?.regPersonName}{" "}
                </p>
                <p>
                  BIN of Registered Person: {modelData?.getByIdHeader?.binNo}
                </p>
                <p>
                  Name & Address of the unit/Branch/Warehouse Sending Supply:
                  {modelData?.getByIdHeader?.addressOfSendingSupply}
                </p>
                <p className="py-2">
                  Name & Address of the unit/Branch/Warehouse Receipent Supply:
                  {modelData?.getByIdHeader?.addressOfReceipentSupply}
                </p>
                <p>
                  Receipent Branch Address:{" "}
                  {modelData?.getByIdHeader?.receipentBranchAddress}
                </p>
              </div>
              <div className="right">
                <p>Invoice No: {modelData?.getByIdHeader?.taxSalesCode}</p>
                <p>Invoice No: {modelData?.getByIdHeader?.taxSalesCode}</p>
                <p>
                  Date of Issue:{" "}
                  {_dateFormatter(
                    modelData?.getByIdHeader?.taxDeliveryDateTime
                  )}
                </p>
                <p className="mt-2">
                  Time of Issue:
                  {moment(modelData?.getByIdHeader?.taxDeliveryDateTime).format(
                    "LT"
                  )}
                </p>
              </div>
            </div>
          </div>
          <div className="col-lg-12 p-0">
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr className="vendorListHeading">
                  {tableTitles.map((th, index) => {
                    return (
                      <th className="text-center" key={index}>
                        <div>{th}</div>
                      </th>
                      // <th> {th} </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {modelData?.getByIdRow?.map((item, index) => {
                  return (
                    <tr>
                      <td className="text-center">{index + 1}</td>
                      <td className="text-left">
                        <span className="pl-2">{item?.taxItemGroupName}</span>
                      </td>

                      <td className="text-right">
                        <sapn className="pr-2">{Math.abs(item?.quantity)}</sapn>
                      </td>
                      <td className="text-right">
                        <span className="pr-2">
                          {Math.abs(item?.baseTotal)}
                        </span>
                      </td>
                      <td className="text-right">
                        <span className="pr-2">
                          {Math.abs(item?.grandTotal)}
                        </span>
                      </td>
                      <td className="text-center"></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="d-flex justify-content-between mt-20">
          <div className="left">
            <div className="row footer_buttom  mt-4 ">
              <div className="col-lg-12 p-0">
                <p>Name of organization Officer-in-charge</p>
                <p className="mt-5">
                  Name & Designation: {profileData?.userName} [{desinationName}]
                </p>
                <p>Mobile Number: {profileData?.contact}</p>
              </div>
            </div>
          </div>
          <div className="middle mt-4">
            <p>Driver Signature</p>
          </div>
          <div className="right mt-4">
            <p>Receiver Signature</p>
          </div>
        </div>
      </div>
      {/* </IViewModal> */}
    </div>
  );
}
