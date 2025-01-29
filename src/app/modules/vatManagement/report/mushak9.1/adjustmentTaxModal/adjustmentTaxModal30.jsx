import React, { useRef } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";

export default function AdjustmentTaxDetailsModal30({
  show,
  onHide,
  singleAdjustmentTax,
}) {
  const printRef = useRef();
  let totalVatAmount = 0;
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
              <div className="col-lg-12">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>Serial No.</th>
                      <th>Bill of Entry Number</th>
                      <th>Date</th>
                      <th>Coustom House/Customs Station</th>
                      <th>Advance Tax Amount</th>
                      <th>Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleAdjustmentTax?.length > 0 &&
                      singleAdjustmentTax?.map((item, index) => {
                        totalVatAmount += item?.vatAmount || 0;
                        return (
                          <tr>
                            <td> {index + 1}</td>
                            <td> {item?.billOfEntryNumber}</td>
                            <td> {_dateFormatter(item?.date)}</td>
                            <td> {item?.customHouse}</td>
                            <td className="text-right"> {_fixedPoint(item?.vatAmount)}</td>
                            <td> {item?.notes}</td>
                          </tr>
                        );
                      })}
                    <tr>
                      <td></td>
                      <td colspan="3">
                        <b>TOTAL</b>
                      </td>
                      <td className="text-right">
                        <b>{_fixedPoint(totalVatAmount, true)}</b>
                      </td>
                      <td></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </CardBody>
        </Card>
      </IViewModal>
    </div>
  );
}
