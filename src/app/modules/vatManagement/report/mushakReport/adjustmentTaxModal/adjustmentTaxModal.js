import React, { useRef } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";

export default function AdjustmentTaxDetailsModal({
  show,
  onHide,
  singleAdjustmentTax,
}) {
  const printRef = useRef();
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"Adjustment Vat"}
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
            <div ref={printRef} className="row cash_journal my-2">
              <div className="col-lg-12">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th style={{ width: "30px" }}>SL</th>
                      <th>Date</th>
                      <th>Adjustment Type Name</th>
                      <th>Tax Branch Address</th>
                      <th>Tax Branch Name</th>
                      <th>Atv Total</th>
                      <th>Vat Total</th>
                      <th>Adjustment Reason</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleAdjustmentTax?.length > 0 &&
                      singleAdjustmentTax?.map((item, index) => (
                        <tr>
                          <td> {index + 1}</td>
                          <td>
                            <div className="text-right pr-2">
                              {_dateFormatter(item?.date)}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.adjustmentTypeName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.taxBranchAddress}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.taxBranchName}</div>
                          </td>
                          <td>
                            {" "}
                            <div className="text-right pr-2">
                              {item?.atvTotal}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {item?.vatTotal}
                            </div>
                          </td>
                          <td>
                            {" "}
                            <div className="pl-2">{item?.adjustmentReason}</div>
                          </td>
                        </tr>
                      ))}
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
