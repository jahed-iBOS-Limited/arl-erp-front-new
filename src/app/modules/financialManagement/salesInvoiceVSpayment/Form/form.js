import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import InputField from "../../../_helper/_inputField";
import { GetSalesInvoiceByBillNo } from "../helper";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../_helper/_dateFormate";
// Validation schema
const validationSchema = Yup.object().shape({
  // amount: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Amount is required"),
  // deductedAIT: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Deducted AIT is required"),
  // poNo: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("PO No is required"),
  // challan: Yup.string().required("AIT Challan is required"),
  // ChallanDate: Yup.string().required("Challan Date is required"),
  // date: Yup.string().required("Pay Date is required"),
  // receivedAIT: Yup.string()
  //   .min(2, "Minimum 2 symbols")
  //   .max(100, "Maximum 100 symbols")
  //   .required("Received AIT is required"),
  // billNo: Yup.object().shape({
  //   label: Yup.string().required("Controlling Unit is required"),
  //   value: Yup.string().required("Controlling Unit is required"),
  // }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setRowDto,
}) {
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [salesInvoice, setSalesInvoice] = useState({});
  const addItem = (values) => {
    const filterDuplicates = rowDto?.filter(
      (item) => item?.poNo === values?.poNo
    );

    if (filterDuplicates?.length > 0) {
      return toast.warning("Duplicate data not allowed");
    }
    const amountSum = rowDto.reduce((acc, cur) => acc + +cur?.amount || 0, 0);
    const total = amountSum + +values?.amount || 0;

    if (total > (salesInvoice?.totalAmount || 0)) {
      return toast.warning("Amount Not Greater than salesInvoice Amount");
    }

    let data = {
      billNo: values.billNo?.value,
      date: values?.date,
      poNo: values?.poNo,
      amount: values?.amount,
      deductedAIT: values?.deductedAIT,
      receivedAIT: values?.receivedAIT,
      challan: values?.challan,
      ChallanDate: values?.ChallanDate,
      remarks: values?.remarks,
    };
    setRowDto([...rowDto, data]);
  };
  const deleteItem = (data) => {
    let deleteItem = rowDto.filter((itm) => itm.poNo !== data);
    setRowDto(deleteItem);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-2">
                  <label>Bill No</label>
                  <SearchAsyncSelect
                    selectedValue={values?.billNo}
                    handleChange={(valueOption) => {
                      setFieldValue("billNo", valueOption);
                    }}
                    placeholder="Search Bill No"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/oms/OManagementReport/GetSalesInvoiceByBillNoDDL?SearchTerm=${searchValue}&BusinessUnitId=${selectedBusinessUnit?.value}`
                        )
                        .then((res) => res?.data);
                    }}
                  />
                </div>
                <div className="col-lg-2" style={{ marginTop: "19px" }}>
                  <button
                    onClick={() => {
                      GetSalesInvoiceByBillNo(values?.billNo, setSalesInvoice);
                    }}
                    className="btn btn-primary ml-2 mr-2"
                    type="button"
                    disabled={!values?.billNo}
                  >
                    View
                  </button>
                </div>
                <div className="col-lg-2">
                  <p className="mt-5">
                    Date: {_dateFormatter(salesInvoice?.invoiceDate)}
                  </p>
                </div>
                <div className="col-lg-2">
                  <p className="mt-5">Amount: {salesInvoice?.totalAmount}</p>
                </div>
              </div>
              {salesInvoice?.totalAmount ? (
                <div className="row global-form global-form-custom">
                  <div className="col-lg-2">
                    <label>Pay Date</label>
                    <InputField
                      value={values?.date}
                      name="date"
                      placeholder="Pay Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>PO No</label>
                    <InputField
                      value={values?.poNo || ""}
                      name="poNo"
                      placeholder="PO No"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("poNo", e.target.value);
                      }}
                      // disabled={values?.date}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Amount</label>
                    <InputField
                      value={values?.amount || ""}
                      name="amount"
                      placeholder="Amount"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("amount", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Deducted AIT</label>
                    <InputField
                      value={values?.deductedAIT || ""}
                      name="deductedAIT"
                      placeholder="Deducted AIT"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("deductedAIT", e.target.value);
                      }}
                      disabled={values?.openingBalance}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Received AIT</label>
                    <InputField
                      value={values?.receivedAIT || ""}
                      name="receivedAIT"
                      placeholder="Received AIT"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("receivedAIT", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>AIT Challan</label>
                    <InputField
                      value={values?.challan || ""}
                      name="challan"
                      placeholder="AIT Challan"
                      type="number"
                      onChange={(e) => {
                        setFieldValue("challan", e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-2">
                    <label>AIT Challan Date</label>
                    <InputField
                      value={values?.ChallanDate}
                      name="ChallanDate"
                      placeholder="AIT Challan Date"
                      type="date"
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>Remarks</label>
                    <InputField
                      value={values?.remarks}
                      name="remarks"
                      placeholder="Remarks"
                      type="text"
                      onChange={(e) => {
                        setFieldValue("remarks", e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-4" style={{ marginTop: "19px" }}>
                    <button
                      onClick={() => {
                        addItem(values);
                      }}
                      className="btn btn-primary ml-2 mr-2"
                      type="button"
                      disabled={
                        !values?.ChallanDate ||
                        !values?.poNo ||
                        !values?.challan ||
                        !values?.amount ||
                        !values?.deductedAIT ||
                        !values?.receivedAIT
                      }
                    >
                      Add
                    </button>
                  </div>
                </div>
              ) : (
                ""
              )}

              {rowDto?.length > 0 && (
                <div
                  style={{ maxHeight: "450px" }}
                  className="scroll-table _table"
                >
                  <table className="global-table table table-font-size-sm">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "40px" }}>SL</th>
                        <th style={{ minWidth: "70px" }}>Bill NO</th>
                        <th style={{ minWidth: "70px" }}>Bill Date</th>
                        <th style={{ minWidth: "70px" }}>Pay Date</th>
                        <th style={{ minWidth: "70px" }}>PO NO</th>
                        <th style={{ minWidth: "70px" }}>Pay Amount</th>
                        <th style={{ minWidth: "70px" }}>Deducted AIT</th>
                        <th style={{ minWidth: "70px" }}>Received AIT</th>
                        <th style={{ minWidth: "70px" }}>AIT Challan No</th>
                        <th style={{ minWidth: "70px" }}>Remarks</th>
                        <th style={{ minWidth: "70px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody style={{ overflow: "scroll" }}>
                      {rowDto.map((itm, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{itm?.billNo}</td>
                          <td>{itm?.date}</td>
                          <td>{itm?.date}</td>
                          <td>{itm?.poNo}</td>
                          <td>{itm?.amount}</td>
                          <td>{itm?.deductedAIT}</td>
                          <td>{itm?.receivedAIT}</td>
                          <td>{itm?.challan}</td>
                          <td>{itm?.remarks}</td>
                          <td className="text-center">
                            <span
                              className="pointer alterUomDeleteIcon"
                              style={{
                                width: "50%",
                                marginTop: "3px",
                              }}
                            >
                              <i
                                onClick={() => deleteItem(itm.poNo)}
                                className="fa fa-trash"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                disabled={rowDto?.length === 0}
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
