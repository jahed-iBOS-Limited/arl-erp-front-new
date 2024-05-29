/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import { useHistory } from "react-router";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import TextArea from "../../../../_helper/TextArea";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

export default function _Form({
  buId,
  accId,
  addRow,
  rowData,
  empList,
  bankList,
  viewType,
  initData,
  deleteRow,
  branchList,
  setRowData,
  saveHandler,
  channelList,
  getBranchList,
}) {
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowData([]);
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
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={`Partner Cheque Submit`}>
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    {viewType !== "view" && (
                      <button
                        type="reset"
                        onClick={() => {
                          setRowData([]);
                          resetForm(initData);
                        }}
                        className="btn btn-light ml-2"
                        disabled={viewType === "view"}
                      >
                        <i className="fa fa-redo"></i>
                        Reset
                      </button>
                    )}

                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={handleSubmit}
                      disabled={
                        (!rowData?.length && !viewType) ||
                        (viewType &&
                          (!values?.amount ||
                            !values?.chequeDate ||
                            !values?.branchName))
                      }
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="channel"
                          options={[{ value: 0, label: "All" }, ...channelList]}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType || rowData?.length}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                            if (valueOption) {
                            }
                          }}
                          isDisabled={
                            !values?.channel || viewType || rowData?.length
                          }
                          placeholder="Search Customer"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="companyBankName"
                          options={bankList || []}
                          value={values?.companyBankName}
                          label="Company Bank Name"
                          onChange={(valueOption) => {
                            setFieldValue("companyBankName", valueOption);
                          }}
                          placeholder="Company Bank Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="bankName"
                          options={bankList || []}
                          value={values?.bankName}
                          label="Bank Name (customer bank)"
                          onChange={(valueOption) => {
                            setFieldValue("bankName", valueOption);
                            setFieldValue("branchName", "");
                            if (valueOption) {
                              getBranchList(
                                `/partner/BusinessPartnerBankInfo/GetBranchDDLInfo?BankId=${valueOption?.value}`
                              );
                            }
                          }}
                          placeholder="Bank Name (customer bank)"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="branchName"
                          options={branchList || []}
                          value={values?.branchName}
                          label="Branch Name"
                          onChange={(valueOption) => {
                            setFieldValue("branchName", valueOption);
                          }}
                          placeholder="Branch Name"
                          errors={errors}
                          touched={touched}
                          isDisabled={viewType === "view" || !values?.bankName}
                        />
                      </div>

                      <div className="col-lg-3">
                        <InputField
                          label="Cheque No"
                          value={values?.chequeNo}
                          name="chequeNo"
                          placeholder="Cheque No"
                          type="text"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="chequeBearer"
                          options={empList || []}
                          value={values?.chequeBearer}
                          label="Cheque Bearer"
                          onChange={(valueOption) => {
                            setFieldValue("chequeBearer", valueOption);
                          }}
                          placeholder="Cheque Bearer"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Cheque Date"
                          value={values?.chequeDate}
                          name="chequeDate"
                          placeholder="Cheque Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="amount"
                          value={values?.amount}
                          name="amount"
                          placeholder="Amount"
                          type="number"
                          errors={errors}
                          touched={touched}
                          onChange={(e) => {
                            setFieldValue("amount", e?.target?.value);
                            setFieldValue(
                              "advance",
                              (+e?.target?.value / 100) * 70
                            );
                            setFieldValue(
                              "previous",
                              (+e?.target?.value / 100) * 30
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Advance (70%)"
                          value={values?.advance}
                          name="advance"
                          placeholder="Advance (70%)"
                          type="number"
                          errors={errors}
                          touched={touched}
                          // disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="Previous (30%)"
                          value={values?.previous}
                          name="previous"
                          placeholder="Previous (30%)"
                          type="number"
                          errors={errors}
                          touched={touched}
                          // disabled
                        />
                      </div>

                      <div className="col-lg-3">
                        <label htmlFor="">Remarks</label>
                        <TextArea
                          label="Remarks"
                          value={values?.remarks}
                          name="remarks"
                          placeholder="Remarks"
                          type="text"
                          disabled={viewType === "view"}
                        />
                      </div>

                      <div className="col-12"></div>
                      {!viewType && (
                        <>
                          <div className="col-lg-1 mt-5">
                            <button
                              className="btn btn-primary"
                              onClick={() => {
                                addRow(values, () => {
                                  setFieldValue("checkDate", "");
                                  setFieldValue("amount", "");
                                  setFieldValue("advance", "");
                                  setFieldValue("previous", "");
                                  setFieldValue("bankName", "");
                                  setFieldValue("branchName", "");
                                  setFieldValue("remarks", "");
                                  setFieldValue("chequeNo", "");
                                  setFieldValue("chequeBearer", "");
                                });
                              }}
                              disabled={
                                !values?.customer ||
                                !values?.amount ||
                                !values?.chequeDate ||
                                !values?.branchName
                              }
                            >
                              + Add
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  {rowData?.length > 0 && (
                    <div className="table-responsive">
                      <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          <th>SL</th>
                          <th>Customer Name</th>
                          <th>Cheque No</th>
                          <th>Cheque Bearer</th>
                          <th>Amount</th>
                          <th>Bank Name</th>
                          <th>Branch Name</th>
                          {viewType !== "view" && <th>Action</th>}
                        </tr>
                      </thead>
                      {rowData.map((row, index) => (
                        <tr key={index}>
                          <td className="text-center" style={{ width: "40px" }}>
                            {index + 1}
                          </td>
                          <td>{row?.businessPartnerName}</td>
                          <td>{row?.chequeNo}</td>
                          <td>{row?.chequeBearerName}</td>
                          <td className="text-right">{row?.mrramount}</td>
                          <td>{row?.bankName}</td>
                          <td>{row?.branchName}</td>
                          {viewType !== "view" && (
                            <td
                              className="text-center"
                              style={{ width: "60px" }}
                            >
                              <IDelete remover={deleteRow} id={index} />
                            </td>
                          )}
                        </tr>
                      ))}
                    </table>
                    </div>
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
