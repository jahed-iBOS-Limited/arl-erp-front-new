/* eslint-disable no-undef */
// /* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";
// eslint-disable-next-line no-unused-vars
import Axios from "axios";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getCustomerNameDDL_api, getRate_api } from "../helper";

// Validation schema
const validationSchema = Yup.object().shape({
  itemName: Yup.object().shape({
    label: Yup.string().required("Item Name is required"),
    value: Yup.string().required("Item Name is required"),
  }),
  customerName: Yup.object().shape({
    label: Yup.string().required("Customer Name is required"),
    value: Yup.string().required("Customer Name  is required"),
  }),
  territoryName: Yup.string().required("Territory Name is required"),
  quantity: Yup.number()
    .min(1, "Minimum 2 symbols")
    .max(1000000000, "Maximum 100 symbols")
    .required("Quantity is required"),
  rate: Yup.number().required("Rate is required"),
  month: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Month is required"),
  year: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Year is required"),
  startDate: Yup.date().required("Start Date is required"),
  endDate: Yup.date().required("End Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  accountId,
  selectedBusinessUnit,
  saveHandler,
  resetBtnRef,
  disableHandler,
  itemNameDDL,
  isEdit,
  setter,
  state,
  disabled,
  customerNameDDL,
  setCustomerNameDDL,
  setRowDto,
  total,
  remover,
  rowDto,
}) {
  // eslint-disable-next-line no-unused-vars
  const [rateForm, setRateForm] = useState("");

  useEffect(() => {
    getCustomerNameDDL_api(
      accountId,
      selectedBusinessUnit,
      state?.values?.territoryName?.value,
      setCustomerNameDDL
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accountId, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                territoryName: state?.values?.territoryName?.label,
                month: state?.values?.month?.label,
                year: state?.values?.year?.label,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          setValues,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!isValid)} */}

            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-2">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 pl pr-1 mb-1">
                      <InputField
                        value={values?.territoryName}
                        name="territoryName"
                        label="Territory Name"
                        placeholder="Territory Name"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1">
                      <NewSelect
                        name="customerName"
                        options={customerNameDDL}
                        value={values?.customerName}
                        label="Customer Name"
                        onChange={(valueOption) => {
                          setFieldValue("customerName", valueOption);
                        }}
                        placeholder="Customer Name"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>
                    {/* {console.log(customerName,"custom")} */}
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <div>Month</div>
                      <InputField
                        value={values?.month}
                        name="month"
                        placeholder="Month"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1"></div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <InputField
                        value={values?.year}
                        label="Year"
                        name="year"
                        placeholder="Year"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr pl-2 mb-1">
                      <InputField
                        value={total?.totalAmount}
                        name="totalAmount"
                        label="Total Amount"
                        placeholder="Total Amount"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Start Date</label>
                      <InputField
                        value={_dateFormatter(values?.startDate)}
                        name="startDate"
                        placeholder="Start Date"
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>End Date</label>
                      <InputField
                        value={_dateFormatter(values?.endDate)}
                        name="endDate"
                        placeholder="End Date"
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-10">
                  <div className={"row bank-journal-custom bj-right"}  style={{
                      marginLeft: "0px",
                      marginRight: "0px",
                      marginTop: "5px",
                    }}>
                    <div className="col-lg-3 pr-1 pl mb-1">
                      <NewSelect
                        name="itemName"
                        options={itemNameDDL}
                        value={values?.itemName}
                        label="Item Name"
                        onChange={(valueOption) => {
                          getRate_api(
                            accountId,
                            selectedBusinessUnit,
                            values?.customerName?.value,
                            valueOption?.value,
                            setFieldValue
                          );
                          setFieldValue("itemName", valueOption);
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3 pr-1 pl mb-1 ml-50">
                      <label>Quantity</label>
                      <InputField
                        value={values?.quantity || ""}
                        name="quantity"
                        placeholder="Quantity"
                        type="number"
                      />
                    </div>
                    <div className="col-lg-3 pr-1 pl mb-1 ml-50">
                      <label>Rate</label>
                      <InputField
                        value={values?.rate}
                        name="rate"
                        placeholder="Rate"
                        type="number"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-2 pl-2 bank-journal mt-3">
                      <button
                        style={{ marginBottom: "20px", marginLeft: "15px" }}
                        type="button"
                        className="btn btn-primary"
                        disabled={!values?.itemName}
                        onClick={() => {
                          const obj = {
                            itemName: values?.itemName,
                            quantity: values?.quantity,
                            rate: values?.rate,
                          };
                          setter(obj, setRowDto);
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                  {/* <div className="col-lg-3 pl-5 pr mb-0 mt-5 h-narration border-gray">
                    <h6>Total Amount:{_formatMoney(total?.totalAmount)}</h6>
                  </div> */}
                  {/* Table Header input end */}

                  <div className="row">
                    <div className="col-lg-12 pr-0">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto?.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "80px" }}>Item Name</th>
                            <th style={{ width: "100px" }}>Quantity</th>
                            <th style={{ width: "60px" }}>Rate</th>
                            <th style={{ width: "100px" }}>Total Amount</th>
                            <th style={{ width: "30px" }}>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {item?.itemName?.label || item?.itemName}
                                </div>
                              </td>
                              <td>
                                <div className="text-center pl-2">
                                  {item?.quantity}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">{item?.rate}</div>
                              </td>
                              <td>
                                <div className="text-center pl-2">
                                  <div className=" pl-0 bank-journal">
                                    {_formatMoney(item?.quantity * item?.rate)}
                                  </div>
                                </div>
                              </td>
                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              {/* Row Dto Table End */}
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
