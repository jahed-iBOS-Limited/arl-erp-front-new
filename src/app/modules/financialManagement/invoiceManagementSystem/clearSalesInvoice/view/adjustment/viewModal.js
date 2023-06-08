import React, { useState } from "react";
import { Formik, Form } from "formik";
import InputField from "./../../../../../_helper/_inputField";
import ISpinner from "./../../../../../_helper/_spinner";
import { Modal } from "react-bootstrap";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { createAdvAdjustmentInvoiceClear_api } from "../../helper";

// import { toast } from "react-toastify";
// import IDelete from "./../../../../../_helper/_helperIcons/_delete";
import Loading from "./../../../../../_helper/_loading";

const initData = {
  invoiceAmount: "",
  pendingAmount: "",
  cash: false,
  bank: false,
  advanceReceive: "",
  advanceAmount: "",
  balanceAmount: "",

  currentLadger: "",
  adjustAmount: "",
};

// Validation schema
const validationSchema = Yup.object().shape({});

export default function AdjustmentViewForm({
  id,
  show,
  onHide,
  isShow,
  item,
  gridDataFunc,
  parentFormValues,
}) {
  const [isDisabled, setDisabled] = useState(false);

  let { profileData, selectedBusinessUnit } = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
      };
    },
    { shallowEqual }
  );

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = [
        {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          accountReceivablePayableId: item?.accountReceivablePayableId,
          invoiceCode: item?.invoiceCode,
          clearedAmount: values?.adjustAmount,
          journalId: 0,
          journalCode: "",
          actionBy: profileData?.userId,
          cashOrBank: "",
          businessPartnerId: item?.businessPartnerId,
        },
      ];

      createAdvAdjustmentInvoiceClear_api(payload, cb, setDisabled);
    }
  };

  return (
    <div className="clear_sales_invoice_View_Form">
      <div className="viewModal">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
            invoiceAmount: item?.amount,
            pendingAmount: item?.adjustmentPendingAmount,
            receiveFrom: item?.businessPartnerName,
            // balanceAmount: total?.totalAmount,

            currentLadger: item?.ledgerBalance,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            // setValid(false);
            saveHandler(values, () => {
              // setRowDto([]);
              resetForm(initData);
              gridDataFunc(parentFormValues);
              onHide();
              // setValid(true);
            });
          }}
        >
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
              <Modal
                show={show}
                onHide={onHide}
                size="xl"
                aria-labelledby="example-modal-sizes-title-xl"
                className="clear_sales_invoice_View_Form"
              >
                {isDisabled && <Loading />}
                {isShow ? (
                  <ISpinner isShow={isShow} />
                ) : (
                  <>
                    <Form className="form form-label-right">
                      <Modal.Header className="bg-custom">
                        <Modal.Title className="w-100">
                          <div className="d-flex justify-content-between px-4 py-2">
                            <div className="title">
                              {"Adjustment View Form"}
                            </div>
                            <div className="">
                              <button
                                type="reset"
                                className={"btn btn-light ml-2"}
                                onClick={() => {
                                  resetForm(initData);
                                }}
                              >
                                <i className="fa fa-redo"></i>
                                Reset
                              </button>
                              <button
                                type="submit"
                                className={"btn btn-primary ml-2"}
                                // onClick={() => {
                                //   saveHandler(values);
                                // }}
                                disabled={isDisabled}
                              >
                                Save
                              </button>
                            </div>
                          </div>
                        </Modal.Title>
                      </Modal.Header>

                      <Modal.Body id="example-modal-sizes-title-xl">
                        <>
                          <div className="form-group row">
                            <div className="col-lg-3">
                              <label>Invoice Amount</label>
                              <InputField
                                value={values?.invoiceAmount}
                                name="invoiceAmount"
                                placeholder="Invoice Amount"
                                type="text"
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label>Pending Amount</label>
                              <InputField
                                value={values?.pendingAmount}
                                name="pendingAmount"
                                placeholder="Pending Amount"
                                type="text"
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label>Current Ladger</label>
                              <InputField
                                value={values?.currentLadger}
                                name="currentLadger"
                                placeholder="Current Ladger"
                                type="text"
                                disabled={true}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label>Adjust Amount</label>
                              <InputField
                                value={values?.adjustAmount}
                                name="adjustAmount"
                                placeholder="Adjust Amount"
                                type="number"
                                min={0}
                                required
                              />
                            </div>
                            {/* <div
                              className="col-lg-4 pl pr-1  d-flex align-items-center"
                              style={{ marginTop: "30px" }}
                            >
                              <div className="mr-5">
                                <span className="mr-2">Cash</span>
                                <Field
                                  type="checkbox"
                                  name="cash"
                                  checked={values.cash}
                                  onChange={(e) => {
                                    setFieldValue("cash", e.target.checked);
                                    setFieldValue("bank", !e.target.checked);
                                    setFieldValue("advanceReceive", "");
                                    if (e.target.checked) {
                                      getInvoiceClearDDL_api(
                                        "cash",
                                        profileData?.accountId,
                                        selectedBusinessUnit.value,
                                        item?.businessPartnerId,
                                        setAdvanceReceive
                                      );
                                    } else {
                                      getInvoiceClearDDL_api(
                                        "bank",
                                        profileData?.accountId,
                                        selectedBusinessUnit.value,
                                        item?.businessPartnerId,
                                        setAdvanceReceive
                                      );
                                    }
                                  }}
                                />
                              </div>
                              <div>
                                <span className="mr-2">Bank</span>
                                <Field
                                  type="checkbox"
                                  name="bank"
                                  checked={values.bank}
                                  onChange={(e) => {
                                    setFieldValue("bank", e.target.checked);
                                    setFieldValue("cash", !e.target.checked);
                                    setFieldValue("advanceReceive", "");
                                    if (e.target.checked) {
                                      getInvoiceClearDDL_api(
                                        "bank",
                                        profileData?.accountId,
                                        selectedBusinessUnit.value,
                                        item?.businessPartnerId,
                                        setAdvanceReceive
                                      );
                                    } else {
                                      getInvoiceClearDDL_api(
                                        "cash",
                                        profileData?.accountId,
                                        selectedBusinessUnit.value,
                                        item?.businessPartnerId,
                                        setAdvanceReceive
                                      );
                                    }
                                  }}
                                />
                              </div>
                            </div> */}
                            {/* <div className="col-lg-12">
                              <hr></hr>
                            </div> */}
                            {/* <div className="col-lg-3">
                              <NewSelect
                                name="advanceReceive"
                                options={advanceReceive || []}
                                value={values?.advanceReceive}
                                label="Advance Receive"
                                onChange={(valueOption) => {
                                  setFieldValue("advanceReceive", valueOption);
                                  setFieldValue(
                                    "advanceAmount",
                                    valueOption?.amount
                                  );
                                }}
                                placeholder="Advance Receive"
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label>Advance Amount</label>
                              <InputField
                                value={values?.advanceAmount}
                                name="advanceAmount"
                                placeholder="Advance Amount"
                                type="number"
                                min="0"
                                max={item?.adjustmentPendingAmount}
                              />
                            </div>
                            <div className="col-lg-3">
                              <label>Balance Amount</label>
                              <InputField
                                value={values?.balanceAmount}
                                name="balanceAmount"
                                placeholder="Balance Amount"
                                type="text"
                                disabled={true}
                              />
                            </div> */}
                            {/* <div className="col-lg-3 mt-5 d-flex align-items-center">
                              <button
                                type="button"
                                className={"btn btn-primary"}
                                style={{ marginTop: "7px" }}
                                onClick={() => {
                                  setter(values);
                                }}
                                disabled={
                                  !values?.advanceReceive ||
                                  !values?.advanceAmount
                                }
                              >
                                Add
                              </button>
                              <p className="mb-0 ml-3">
                                Total Amount: <b>{total?.totalAmount}</b>
                              </p>
                            </div> */}
                          </div>
                          {/* Table Start */}
                          {/* <div className="row cash_journal">
                            <div className="col-lg-12 pr-0 pl-0">
                              {rowDto?.length > 0 && (
                                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                  <thead>
                                    <tr>
                                      <th style={{ width: "30px" }}>SL</th>
                                      <th style={{ width: "30px" }}>Type</th>
                                      <th style={{ width: "30px" }}>
                                        Voucher Id
                                      </th>
                                      <th style={{ width: "30px" }}>
                                        Voucher No
                                      </th>
                                      <th style={{ width: "30px" }}>Amount</th>
                                      <th style={{ width: "30px" }}>Action</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {rowDto?.map((item, index) => (
                                      <>
                                        <tr>
                                          <td className="text-center">
                                            {index + 1}
                                          </td>
                                          <td className="text-center">
                                            {item?.type}
                                          </td>
                                          <td className="text-center">
                                            {item?.voucherId}
                                          </td>
                                          <td className="text-center">
                                            {item?.voucherNo}
                                          </td>
                                          <td className="text-center">
                                            {item?.amount}
                                          </td>
                                          <td className="text-center">
                                            <IDelete
                                              remover={remover}
                                              id={index}
                                            />
                                          </td>
                                        </tr>
                                      </>
                                    ))}
                                  </tbody>
                                </table>
                              )}
                            </div>
                          </div> */}
                          {/* Table End */}
                        </>
                      </Modal.Body>
                      <Modal.Footer>
                        <div>
                          <button
                            type="button"
                            onClick={() => {
                              onHide();
                              // setRowDto([]);
                              setFieldValue("balanceAmount", "");
                            }}
                            className="btn btn-light btn-elevate"
                          >
                            Cancel
                          </button>
                          <> </>
                        </div>
                      </Modal.Footer>
                    </Form>
                  </>
                )}
              </Modal>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
}
