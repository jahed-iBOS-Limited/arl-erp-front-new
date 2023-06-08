/* eslint-disable no-useless-concat */
import React from "react";
import { Modal } from "react-bootstrap";
import { Form as FormikForm } from "formik";
import { ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import CashIcon from "../../../_helper/_helperIcons/cash.svg";
import CreditIcon from "../../../_helper/_helperIcons/credit.svg";

export default function SalesInvoiceDetails({ show, onHide, header, rowData }) {
  let subTotal = 0
  return (
    <div className="viewModal">
      <Modal
        show={show}
        onHide={onHide}
        size={"md"}
        aria-labelledby="example-modal-sizes-title-xl"
        dialogClassName="dialogClassName"
      >
        <ModalProgressBar variant="query" />
        <>
          {" "}
          <Modal.Header className="bg-custom">
            <Modal.Title
              className="text-left"
              style={{
                margin: "0px 0px 0px 10px",
                fontSize: "15px !important",
              }}
            >
              {header?.soldToPartnerName + "`s" + " Invoice Details"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id="example-modal-sizes-title-xl">
            <>
              <FormikForm>
                <div
                  className="form form-label-right"
                  style={{ margin: "auto" }}
                >
                  <div>
                    <div className="row">
                      <div className="col-lg-6 d-flex" style={{ margin: "auto" }}>
                        <div
                          className={
                            header?.creditAmount
                              ? "image-icon clicked-button"
                              : "image-icon"
                          }
                        >
                          <img src={CreditIcon} alt="Cash" height="50px" />
                          <h6 style={{ color: "white", marginTop: "-8px" }}>
                            Credit
                          </h6>
                        </div>
                        <div
                          className={
                            header?.cashAmount
                              ? "image-icon clicked-button"
                              : "image-icon"
                          }
                        >
                          <img src={CashIcon} alt="Cash" height="50px" />
                          <h6 style={{ color: "white", marginTop: "-8px" }}>
                            Cash
                          </h6>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-6 d-flex justify-content-between" style={{ margin: "auto" }}>
                        <h3 className="header-amount">
                          <span>{header?.creditAmount || 0}</span>
                        </h3>
                        <h3 className="header-amount">
                          <span>{header?.cashAmount || 0}</span>
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-12">
                      <div style={{ marginTop: "10px" }}>
                        <table className="table table-striped table-bordered global-table" style={{ margin: 0 }}>
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Item Name</th>
                              <th>UOM</th>
                              <th>Quantity</th>
                              <th>Rate</th>
                              <th>Sub Total</th>
                            </tr>
                          </thead>
                          <tbody className="itemList">
                            {rowData?.map((item, index) => {
                              subTotal+=(item?.quantity * item?.rate)
                              return (
                                <tr key={index}>
                                  <td>{index + 1}</td>
                                  <td className="text-left">{item?.itemName}</td>
                                  <td>{item?.uomName}</td>
                                  <td className="text-center">{item?.quantity}</td>
                                  <td className="text-center">{item?.rate}</td>
                                  <td className="text-right">
                                    {item?.quantity * item?.rate -
                                      item?.totalDiscountValue}
                                  </td>
                                </tr>
                              )
                            })}
                            <tr>
                              <td className="text-right" style={{fontWeight:"bold"}} colSpan="5">Total</td>
                              <td className="text-right">{subTotal}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </FormikForm>
            </>
          </Modal.Body>
          <Modal.Footer>
            <div>
              <button
                type="button"
                onClick={() => onHide()}
                className="btn btn-light btn-elevate"
              >
                {"Close"}
              </button>
              <> </>
            </div>
          </Modal.Footer>
        </>
      </Modal>
    </div>
  );
}
