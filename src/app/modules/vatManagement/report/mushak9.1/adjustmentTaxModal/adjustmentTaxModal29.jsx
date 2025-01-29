import React, { useRef } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from '../../../../_helper/_fixedPoint';
import {

  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";

export default function AdjustmentTaxDetailsModal29({
  show,
  onHide,
  singleAdjustmentTax,
}) {
  const printRef = useRef();
  let totalValue = 0,
    totalDeductedVat = 0;
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"DECREASING ADJUSTMENTS [SUB-FORM]"}
        btnText="Close"
      >
        <Card>
          <CardBody>
            <div className="d-flex justify-content-end mt-2">
              <ReactToPrint
                trigger={() => (
                  <button
                    type="button"
                    className="btn btn-primary px-1 py-1 my-0"
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

            {/* Table Start */}
            <div ref={printRef} className="row my-2">
              <div className="col-lg-12 p-0">
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>Serial No.</th>
                        <th>Buyer's BIN</th>
                        <th>Buyer's Name</th>
                        <th>Buyer's Address</th>
                        <th>Value</th>
                        <th>Deducted VAT</th>
                        <th>Invoice No./Challan/Bill No. Etc.</th>
                        <th>Invoice/Challan/Bill Date</th>
                        <th>VAT Deduction at source, Certificate No </th>
                        <th>VAT Deduction at source, Certificate Date</th>
                        <th>Tax deposit Account Code</th>
                        <th>Tax deposit serial number of Book transfer</th>
                        <th>Tax deposit date</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleAdjustmentTax?.length > 0 &&
                        singleAdjustmentTax?.map((item, index) => {
                          totalValue += item?.value || 0;
                          totalDeductedVat += item?.deductedVat || 0;
                          return (
                            <tr>
                              <td> {index + 1}</td>
                              <td> {item?.bin}</td>
                              <td> {item?.name}</td>
                              <td> {item?.address}</td>
                              <td className="text-right"> {_fixedPoint(item?.value)}</td>
                              <td  className="text-right"> {_fixedPoint(item?.deductedVat)}</td>
                              <td> {item?.invoiceNo}</td>
                              <td> {_dateFormatter(item?.invoiceDate)}</td>
                              <td> {item?.certificateNo}</td>
                              <td> {item?.certificateDate}</td>
                              <td> {item?.taxDepositAccountCode}</td>
                              <td>
                                {" "}
                                {item?.taxDepositSerialNumberOfBookTransfer}
                              </td>
                              <td>
                                {" "}
                                {_dateFormatter(item?.treasuryDepositDate)}
                              </td>
                              <td> {item?.notes}</td>
                            </tr>
                          );
                        })}
                      <tr>
                        <td></td>
                        <td colspan="3">
                          <b>TOTAL</b>
                        </td>
                        <td  className="text-right">
                          <b>{_fixedPoint(totalValue, true)}</b>
                        </td>
                        <td  className="text-right">
                          <b>{_fixedPoint(totalDeductedVat, true)}</b>
                        </td>
                        <td colspan="8"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </IViewModal>
    </div>
  );
}
