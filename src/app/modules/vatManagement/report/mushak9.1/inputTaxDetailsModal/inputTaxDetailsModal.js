import React, { useRef , useState} from "react";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import IViewModal from '../../../../_helper/_viewModal';
import CommonView from '../../commonView';
import {
  Card,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";

export default function InputTaxDetailsModal({ show, onHide, inputTaxDetailsData }) {
  const [viewClick, setViewClick] = useState("");
  const [modelShow, setModelShow] = useState(false);
  const printRef = useRef();
  return (
    <div>
      <IViewModal
        show={show}
        onHide={() => {
          onHide();
        }}
        title={"Supply InputTax"}
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
                      <th>Challan No</th>
                      <th>Branch Name</th>
                      <th>Item Group</th>
                      <th>UOM</th>
                      <th>Quantity</th>
                      <th>Trade Type</th>
                      <th>Transaction</th>
                      <th>HS Code</th>
                      <th>Challan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {inputTaxDetailsData?.length > 0 &&
                      inputTaxDetailsData?.map((item, index) => (
                        <tr>
                          <td> {index + 1}</td>
                          <td>
                            <div className="pl-2">
                              {item?.challanNo}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.branchName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.itemGroupName}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.uoM}
                            </div>
                          </td>
                          <td>
                            <div className="pl-2">
                              {item?.quantity}
                            </div>
                          </td>
                          <td>
                            <div className="text-right pr-2">{item?.tradeTypeName}</div>
                          </td>
                          <td>
                            {" "}
                            <div className="text-right pr-2">{item?.transactionName}</div>
                          </td>
                          <td>
                            <div className="text-right pr-2">
                              {item.hScode}
                            </div>
                          </td>
                          <td className="text-center">
                            <button
                              className="btn btn-primary"
                              style={{padding:'3px 10px 5px 10px'}}
                              type="button"
                              onClick={() => {
                                setViewClick({
                                  ...item,
                            
                                });
                                setModelShow(true);
                              }}
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
            <CommonView
              modelShow={modelShow}
              setModelShow={setModelShow}
              viewClick={viewClick}
            />
          </CardBody>
        </Card>
      </IViewModal>
    </div>
  );
}
