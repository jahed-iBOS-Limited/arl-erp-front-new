/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router";
import IButton from "../../../../../_helper/iButton";
import TextArea from "../../../../../_helper/TextArea";
import ICustomCard from "../../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import IDelete from "../../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../../_helper/_inputField";
import NewSelect from "../../../../../_helper/_select";

export default function _Form({
  title,
  addRow,
  rowData,
  viewType,
  initData,
  deleteRow,
  setRowData,
  saveHandler,
}) {
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ resetForm, values, errors, touched, setFieldValue }) => (
          <>
            <ICustomCard
              title={title}
              backHandler={() => {
                history.goBack();
              }}
              resetHandler={() => {
                resetForm();
                setRowData([]);
              }}
              saveHandler={() => {
                saveHandler(values, () => {
                  resetForm(initData);
                  setRowData([]);
                });
              }}
            >
              <Form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    {/* <div className="col-lg-3">
                      <label>Bill No</label>
                      <SearchAsyncSelect
                        selectedValue={values?.billNo}
                        handleChange={(valueOption) => {
                          setFieldValue("billNo", valueOption);
                          if (valueOption) {
                            getData(
                              `/oms/OManagementReport/GetSalesInvoiceByBillNo?SalesInvoiceId=${valueOption?.value}`,
                              (resData) => {
                                setFieldValue("partner", {
                                  value: resData?.customerId,
                                  label: resData?.customerName,
                                });
                                setFieldValue(
                                  "billAmount",
                                  resData?.totalAmount
                                );
                                setFieldValue(
                                  "billSubmitDate",
                                  _dateFormatter(resData?.invoiceDate)
                                );
                              }
                            );
                          }
                        }}
                        placeholder="Search Bill No"
                        loadOptions={(v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3) return [];
                          return axios
                            .get(
                              `/oms/OManagementReport/GetSalesInvoiceByBillNoDDL?SearchTerm=${searchValue}&BusinessUnitId=${buId}`
                            )
                            .then((res) => res?.data);
                        }}
                      />
                    </div> */}
                    <div className="col-lg-3">
                      <InputField
                        label="Bill No"
                        value={values?.billNo}
                        name="billNo"
                        placeholder="Bill No"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="partner"
                        options={[]}
                        value={values?.partner}
                        label="Partner Name"
                        onChange={(valueOption) => {
                          setFieldValue("partner", valueOption);
                        }}
                        placeholder="Partner Name"
                        errors={errors}
                        touched={touched}
                        isDisabled
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        label="Bill Amount"
                        value={values?.billAmount}
                        name="billAmount"
                        placeholder="Bill Amount"
                        type="text"
                        errors={errors}
                        touched={touched}
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Bill Submit Date"
                        value={values?.billSubmitDate}
                        name="billSubmitDate"
                        placeholder="Bill Submit Date"
                        type="date"
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
                      <InputField
                        label="Cheque Amount"
                        value={values?.chequeAmount}
                        name="chequeAmount"
                        placeholder="Cheque Amount"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Deducted AIT"
                        value={values?.deductedAit}
                        name="deductedAit"
                        placeholder="Deducted AIT"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="Received AIT"
                        value={values?.receivedAit}
                        name="receivedAit"
                        placeholder="Received AIT"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="AIT Challan No"
                        value={values?.aitChallanNo}
                        name="aitChallanNo"
                        placeholder="AIT Challan No"
                        type="text"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        label="AIT Date"
                        value={values?.aitDate}
                        name="aitDate"
                        placeholder="AIT Date"
                        type="date"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Comments</label>
                      <TextArea
                        value={values?.comments}
                        name="comments"
                        placeholder="Comments"
                        type="text"
                        disabled={viewType === "view"}
                      />
                    </div>

                    {!viewType && (
                      <IButton
                        onClick={() => {
                          addRow(values, () => {});
                        }}
                        disabled={
                          !(
                            values?.billNo &&
                            values?.chequeDate &&
                            values?.chequeNo &&
                            values?.chequeAmount &&
                            values?.deductedAit &&
                            values?.receivedAit &&
                            values?.aitChallanNo &&
                            values?.aitDate
                          )
                        }
                      >
                        + Add
                      </IButton>
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
                        <th>Partner Name</th>
                        <th>Bill Amount</th>
                        <th>Cheque No</th>
                        <th>Cheque Amount</th>
                        <th>Deducted AIT</th>
                        <th>Received AIT</th>
                        <th>AIT Challan No</th>
                        <th>Comments</th>
                        {viewType !== "view" && <th>Action</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData.map((row, index) => (
                        <tr key={index + row?.chequeNo}>
                          <td className="text-center" style={{ width: "40px" }}>
                            {index + 1}
                          </td>
                          <td>{row?.businessPartnerName}</td>
                          <td className="text-right">
                            {_fixedPoint(row?.billAmount, true)}
                          </td>
                          <td>{row?.chequeNo}</td>
                          <td className="text-right">
                            {_fixedPoint(row?.mrramount, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(row?.deductedAit, true)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(row?.receivedAit, true)}
                          </td>
                          <td>{row?.aitchallanNo}</td>
                          <td>{row?.comments}</td>
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
                    </tbody>
                  </table>
                 </div>
                )}
              </Form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
