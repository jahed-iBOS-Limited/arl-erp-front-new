import React, { useState } from "react";
import IViewModal from "../../../../_helper/_viewModal";
import { Formik, Form } from "formik";
import IView from "../../../../_helper/_helperIcons/_view";
import PurchaseOrderView from "./purchaseOrderView";
import { useDispatch } from "react-redux";
import { getDownlloadFileView_Action } from "./../../../../_helper/_redux/Actions";
const initData = {};

export default function ClearInvoiceViewModel({
  show,
  onHide,
  gridRowItem,
  gridData,
}) {
  const [purchaseOrderViewModel, setPurchaseOrderViewModel] = useState(false);
  const dispatch = useDispatch();
  return (
    <div className="Clear Invoice View">
      <IViewModal
        show={show}
        onHide={onHide}
        title={"Internal Expense View"}
        style={{ fontSize: "1.2rem !important" }}
        btnText="Close"
      >
        <div>
          <Formik enableReinitialize={true} initialValues={initData}>
            {({
              handleSubmit,
              resetForm,
              values,
              errors,
              touched,
              setFieldValue,
              isValid,
            }) => (
              <>
                <Form className="form form-label-right">
                  <div className="row mt-3">
                    <div className="col-lg-2">
                      <label>
                        <b>Partner :</b> {gridRowItem.partnerName}
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label>
                        <b>Ledger Balance :</b> {gridRowItem.ledgerBalance}
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label>
                        <b>PO Amount :</b> {gridRowItem.poAmount}
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label>
                        <b>GRN Amount :</b> {gridRowItem.grnAmount}
                      </label>
                    </div>
                    <div className="col-lg-2">
                      <label>
                        <b>Invoice Amount :</b> {gridRowItem.invoiceAmount}
                      </label>
                    </div>
                    <div className="col-lg-2 d-flex justify-content-end">
                      <button
                        onClick={() => {}}
                        className="btn btn-primary ml-2 mr-2"
                        type="button"
                       
                      >
                        Save
                      </button>
                    </div>
                  </div>
                  <div className="row mt-3">
                    <div className="col-lg-4">
                      <div>
                        <button
                          onClick={() => {
                            setPurchaseOrderViewModel(true);
                          }}
                          className="btn btn-primary ml-2 mt-4 mr-2"
                          type="button"
                          style={{ padding: "5px 4px" }}
                        >
                          Purchase Order
                          <i
                            className={`fa pointer fa-eye pl-1`}
                            aria-hidden="true"
                          ></i>
                        </button>
                        <button
                          onClick={() => {
                            dispatch(
                              getDownlloadFileView_Action(
                                "60bd998747097661d29daf75"
                              )
                            );
                          }}
                          className="btn btn-primary ml-2 mt-4 mr-2"
                          type="button"
                          style={{ padding: "5px 4px" }}
                        >
                          Invoice
                          <i
                            className={`fa pointer fa-eye pl-1`}
                            aria-hidden="true"
                          ></i>
                        </button>
                      </div>
                    </div>
                    <div className="col-lg-8">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 global-table">
                          <thead>
                            <tr>
                              <th style={{ width: "35px" }}>SL</th>
                              <th style={{ width: "150px" }}>GRN NO</th>
                              <th style={{ width: "150px" }}>Amount</th>
                              <th style={{ width: "150px" }}>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {gridData?.map((item, index) => (
                              <tr key={index}>
                                <td> {index + 1}</td>

                                <td>
                                  <div className="pl-2">
                                    {item?.advanceCode}
                                  </div>
                                </td>

                                <td>
                                  <div className="pl-2">
                                    {item?.advanceCode}
                                  </div>
                                </td>

                                <td>
                                  <IView clickHandler={() => {}} />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <PurchaseOrderView
                    show={purchaseOrderViewModel}
                    onHide={() => setPurchaseOrderViewModel(false)}
                  />
                </Form>
              </>
            )}
          </Formik>
        </div>
      </IViewModal>
    </div>
  );
}
