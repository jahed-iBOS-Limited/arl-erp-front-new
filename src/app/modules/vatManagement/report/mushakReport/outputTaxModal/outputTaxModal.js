import React, { useRef } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";

export default function OutputTaxDetailsModal({
  show,
  onHide,
  singleOutputTax,
}) {
  const printRef = useRef();
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"Supply OutputTax"}
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
            <div ref={printRef}>
              <div className="row cash_journal my-2">
                <div className="col-lg-12">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>Goods Or Service Code</th>
                        <th>Goods Or Service Description</th>
                        <th>Goods Or Service Name</th>
                        <th>SD</th>
                        <th>Vat</th>
                        <th>Value</th>
                        <th>Notes</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleOutputTax?.length > 0 &&
                        singleOutputTax?.map((item, index) => (
                          <tr>
                            <td> {index + 1}</td>
                            <td>
                              <div className="pl-2">
                                {item?.goodsOrServiceCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.goodsOrServiceDesp}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.goodsOrServiceName}
                              </div>
                            </td>
                            <td>
                              <div className="text-right pr-2">{item?.sd}</div>
                            </td>
                            <td>
                              {" "}
                              <div className="text-right pr-2">{item?.vat}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {item.value}
                              </div>
                            </td>
                            <td>
                              {" "}
                              <div className="pl-2">{item?.notes}</div>
                            </td>
                          </tr>
                        ))}
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
