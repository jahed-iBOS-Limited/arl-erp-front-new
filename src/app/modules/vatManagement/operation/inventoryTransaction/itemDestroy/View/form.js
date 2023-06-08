/* eslint-disable no-undef */
// /* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../../_helper/_inputField";

// Validation schema
const validationSchema = Yup.object().shape({
  branchName: Yup.object().shape({
    label: Yup.string().required("Branch Name is required"),
    value: Yup.string().required("Branch Name is required"),
  }),
  itemName: Yup.object().shape({
    label: Yup.string().required("Item Name is required"),
    value: Yup.string().required("Item Name is required"),
  }),
  itemType: Yup.object().shape({
    label: Yup.string().required("Item Type is required"),
    value: Yup.string().required("Item Type is required"),
  }),
  vatTotal: Yup.string().required("VAT is required"),
  quantity: Yup.number()
    .min(1, "Minimum 2 symbols")
    .max(1000000000000, "Maximum 100 symbols")
    .required("Quantity is required"),
  transactionDate: Yup.date().required("Transaction Date is required"),
  referenceNo: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Reference No is required"),
  sdChargeableValue: Yup.number().required("SD Value is required"),
  sdTotal: Yup.number().required("SD Total is required"),
  referenceDate: Yup.date().required("Reference Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  accountId,
  selectedBusinessUnit,
  saveHandler,
  resetBtnRef,
  disableHandler,
  setItemNameList,
  taxBranchDDL,
  itemNameList,
  itemType,
  isEdit,
  sdTotalData,
  vatData,
  sdChargeableValueData,
  state,
  basePriceData,
  rowDtoHandler,
  disabled,
  setRowDto,
  remover,
  rowDto,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          // initData
          isEdit
            ? initData
            : {
                ...initData,
                branchName: {
                  value: state?.values?.branchName?.value,
                  label: state?.values?.branchName?.label,
                },
                branchAddress: state?.values?.branchName?.name,
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
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-2">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <div>Transaction Date</div>
                      <InputField
                        value={values?.transactionDate}
                        name="transactionDate"
                        placeholder="Transaction Date"
                        type="date"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-12 pr pl-2 mb-1">
                      <label>Reference No</label>
                      <InputField
                        value={values?.referenceNo}
                        name="referenceNo"
                        placeholder="Reference No"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr pl-2 mb-1">
                      <label>Reference Date</label>
                      <InputField
                        value={values?.referenceDate}
                        name="referenceDate"
                        placeholder="Reference Date"
                        type="date"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>SD Chargeable Value</label>
                      <InputField
                        value={values?.sdChargeableValue}
                        name="sdChargeableValue"
                        placeholder="SD Chargeable Value"
                        type="number"
                        disabled={true}
                        min="0"
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>SD Total</label>
                      <InputField
                        value={values?.sdTotal}
                        name="sdTotal"
                        placeholder="
                        SD Total"
                        type="number"
                        disabled={true}
                        min="0"
                      />
                      SD Chargeable Value
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>VAT</label>
                      <InputField
                        value={values?.vatTotal}
                        name="vatTotal"
                        placeholder="VAT"
                        type="number"
                        disabled={true}
                        min="0"
                      />
                    </div>
                  </div>
                </div>

                <div className="col-lg-10">
                  <table className={"table mt-1 bj-table"}>
                    <thead className={rowDto?.length < 1 && "d-none"}>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "50px" }}>Material Name</th>
                        <th style={{ width: "20px" }}>UoM</th>
                        <th style={{ width: "50px" }}>Used Quantity</th>
                        <th style={{ width: "50px" }}>SD Chargeable Value</th>
                        <th style={{ width: "50px" }}>Based Price</th>
                        <th style={{ width: "40px" }}>SD</th>
                        <th style={{ width: "30px" }}>VAT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>
                            <div className="text-center">
                              {item?.materialName}
                            </div>
                          </td>
                          <td>
                            <div className="text-center pl-2">{item?.uom}</div>
                          </td>
                          <td style={{ width: "25px" }}>
                            <div className="text-center">
                              {item?.useQuantity}
                            </div>
                          </td>
                          <td style={{ width: "35px" }}>
                            <div className="text-center">
                              {rowDto[index]?.sdChargeableValue.toFixed(2)}
                            </div>
                          </td>
                          <td style={{ width: "35px" }}>
                            <div className="text-center align-middle">
                              {item?.basedPrice.toFixed(2)}
                            </div>
                          </td>
                          <td style={{ width: "35px" }}>
                            <div className="text-center">
                              {rowDto[index]?.sdTotal}
                            </div>
                          </td>

                          <td style={{ width: "35px" }}>
                            <div className="text-center">
                              {rowDto[index]?.vat}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
