import React, { useRef, useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import {
  Card,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
// import ViewForm from "../../../transaction/tresuary/tresuaryDeposit/View/viewModal";
import ViewForm from "../../../transaction/tresuaryDeposit/View/viewModal";
export default function TreasuryDepositDetailsModal({
  show,
  onHide,
  singleTreasuryDeposit,
}) {
  const printRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [rowData, setRowData] = useState({});
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"Treasury Deposit"}
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
                      <th style={{ width: "30px" }}>Serial No.</th>
                      <th>Treasury Challan Number</th>
                      <th>Bank Name</th>
                      <th>Branch Name</th>
                      <th>Date</th>
                      <th>Tax Deposited Account Code</th>
                      <th>Amount</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {singleTreasuryDeposit?.length > 0 &&
                      singleTreasuryDeposit?.map((item, index) => (
                        <tr>
                          <td> {index + 1}</td>
                          <td>
                            <div className="text-right pr-2">
                              {item?.trChallanNo}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.bankName}</div>
                          </td>
                          <td>
                            <div className="pl-2">{item?.branchName}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {_dateFormatter(item?.date)}
                            </div>
                          </td>
                          <td>
                            {" "}
                            <div className="text-right pr-2">
                              {item?.taxDepositedAccCode}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">{item.amount}</div>
                          </td>
                          <td>
                            {" "}
                            <div className="pl-2">{item?.notes}</div>
                          </td>
                          <td className="text-center">
                            {" "}
                            <button
                              onClick={() => {
                                setRowData({ ...item, id: item?.tresuaryId });
                                setShowModal(true);
                              }}
                              className="btn btn-primary"
                              type="button"
                              style={{ padding: "3px 10px 5px 10px" }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
            <ViewForm
              show={showModal}
              id={rowData?.id}
              onHide={() => setShowModal(false)}
            />
          </CardBody>
        </Card>
      </IViewModal>
    </div>
  );
}
