/* eslint-disable no-undef */
// /* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { getFourData_api, getItemNamelistDDL_api } from "../helper";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";

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
  // quantity: Yup.number()
  //   .min(1, "Minimum 2 symbols")
  //   .max(1000000000000, "Maximum 100 symbols")
  //   .required("Quantity is required"),
  transactionDate: Yup.date().required("Transaction Date is required"),
  referenceNo: Yup.string()
    .min(1, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols"),
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
  setItemNameList,
  itemNameList,
  itemType,
  isEdit,
  sdTotalData,
  vatData,
  state,
  rowDtoHandler,
  addRowDataHandler,
  setRowDto,

  rowDto,
  remover,
}) {
  // Change "" when user input negetive value
  const onChangeValidator = (index, name) => {
    const xData = [...rowDto];
    xData[index][name] = "";
    setRowDto([...xData]);
  };

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
                  address: state?.values?.branchName?.address,
                },
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
            {/* {disableHandler(!isValid)} */}
            
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-2 global-form">
                  <div className="row  ">
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <div>Transaction Date</div>
                      <InputField
                        value={values?.transactionDate}
                        name="transactionDate"
                        placeholder="Transaction Date"
                        type="date"
                        //disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-12 pr pl-2 mb-1">
                      <label>Reference No</label>
                      <InputField
                        value={values?.referenceNo}
                        name="referenceNo"
                        placeholder="Reference No"
                        type="text"
                        //disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr pl-2 mb-1">
                      <label>Reference Date</label>
                      <InputField
                        value={values?.referenceDate}
                        name="referenceDate"
                        placeholder="Reference Date"
                        type="date"
                        //disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>SD Chargeable Value</label>
                      <InputField
                        value={values?.sdChargeableValue}
                        name="sdChargeableValue"
                        placeholder="SD Chargeable Value"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "sdChargeableValue"
                          );
                        }}
                        type="number"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>SD Total</label>
                      <InputField
                        value={values?.sdTotal}
                        name="sdTotal"
                        placeholder="SD Total"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "sdTotal"
                          );
                        }}
                        type="number"
                        disabled={true}
                      />
                      SD Chargeable Value
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>VAT</label>
                      <InputField
                        value={values?.vatTotal}
                        name="vatTotal"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "vatTotal"
                          );
                        }}
                        placeholder="VAT"
                        type="number"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-10">
                  <div className={"row global-form"}>
                    <div className="col-lg-3 pr-1 pl mb-1">
                      <NewSelect
                        name="itemType"
                        options={itemType}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setFieldValue("itemType", valueOption);
                          setFieldValue("itemName", "");
                          getItemNamelistDDL_api(
                            accountId,
                            selectedBusinessUnit,
                            valueOption?.value,
                            setItemNameList
                          );
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={rowDto?.length > 0}
                      />
                    </div>
                    <div className="col-lg-3 pr-1 pl mb-1">
                      <NewSelect
                        name="itemName"
                        options={itemNameList}
                        value={values?.itemName}
                        label="Item Name"
                        onChange={(valueOption) => {
                          setFieldValue("itemName", valueOption);
                          if (values?.itemType?.value === 3) {
                            setRowDto([]);
                          }
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        //isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pr-1 pl mb-1">
                      <label>Quantity</label>
                      <InputField
                        value={values?.quantity}
                        name="quantity"
                        placeholder="Quantity"
                        type="number"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "quantity"
                          );
                        }}
                      />
                    </div>

                    <div className="col-lg-3 pl-2 bank-journal mt-3">
                      {values?.itemType?.value === 3 ? (
                        <button
                          style={{ marginTop: "5px" }}
                          type="button"
                          className="btn btn-primary"
                          disabled={!values?.itemName || !values?.quantity}
                          onClick={() => {
                            getFourData_api(
                              accountId,
                              selectedBusinessUnit,
                              values?.itemName?.value,
                              values?.quantity,
                              setRowDto,
                              values
                            );
                          }}
                        >
                          Show
                        </button>
                      ) : (
                        <button
                          style={{ marginTop: "5px" }}
                          type="button"
                          className="btn btn-primary"
                          disabled={!values?.itemName || !values?.quantity}
                          onClick={() => {
                            addRowDataHandler(
                              values?.itemName?.value,
                              values,
                              setFieldValue
                            );
                          }}
                        >
                          Add
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Table Header input end */}
                  <div className="row ">
                    <div className="col-lg-12 global-table">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto?.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "50px" }}>Material Name</th>
                            <th style={{ width: "20px" }}>UoM</th>
                            <th style={{ width: "50px" }}>Used Quantity</th>
                            <th style={{ width: "50px" }}>
                              SD Chargeable Value
                            </th>
                            <th style={{ width: "50px" }}>Based Price</th>
                            <th style={{ width: "40px" }}>SD</th>
                            <th style={{ width: "30px" }}>VAT</th>
                            <th style={{ width: "20px" }}>Actions</th>
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
                                <div className="text-center pl-2">
                                  {item?.uom}
                                </div>
                              </td>
                              <td style={{ width: "25px" }}>
                                <div className="text-center">
                                  {item?.useQuantity}
                                </div>
                              </td>
                              <td style={{ width: "35px" }}>
                                <div className="text-right">
                                  <InputField
                                    value={rowDto[index]?.sdChargeableValue}
                                    name="sdValue"
                                    onChange={(e) => {
                                      if (e.target.value >= 0) {
                                        rowDtoHandler(
                                          "sdChargeableValue",
                                          e.target.value,
                                          index,
                                          setFieldValue
                                        );
                                      } else {
                                        onChangeValidator(
                                          index,
                                          "sdChargeableValue"
                                        );
                                      }
                                    }}
                                    placeholder="SD Value"
                                    type="number"
                                  />
                                </div>
                              </td>
                              <td style={{ width: "35px" }}>
                                <div className="text-center align-middle">
                                  {item?.basedPrice}
                                </div>
                              </td>
                              <td style={{ width: "35px" }}>
                                <div className="text-right">
                                  <InputField
                                    value={rowDto[index]?.sdTotal}
                                    name="sd"
                                    placeholder="SD"
                                    type="number"
                                    onChange={(e) => {
                                      if (e.target.value > 0) {
                                        rowDtoHandler(
                                          "sdTotal",
                                          e.target.value,
                                          index,
                                          setFieldValue
                                        );
                                      } else {
                                        onChangeValidator(index, "sdTotal");
                                      }
                                    }}
                                  />
                                </div>
                              </td>

                              <td style={{ width: "35px" }}>
                                <div className="text-right">
                                  <InputField
                                    value={rowDto[index]?.vat}
                                    name="vat"
                                    onChange={(e) => {
                                      if (e.target.value >= 0) {
                                        rowDtoHandler(
                                          "vat",
                                          e.target.value,
                                          index,
                                          setFieldValue
                                        );
                                      } else {
                                        onChangeValidator(index, "vat");
                                      }
                                    }}
                                    placeholder="VAT"
                                    type="number"
                                  />
                                </div>
                              </td>
                              <td className="text-center align-middle ">
                                <span
                                  onClick={() => remover(index, setFieldValue)}
                                >
                                  <IDelete />
                                </span>
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
