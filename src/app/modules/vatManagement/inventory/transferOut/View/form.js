/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { IInput } from "../../../../_helper/_input";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useEffect } from "react";
import { GetTransactionTypeDDL } from "../helper";
import FormikError from "../../../../_helper/_formikError";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import InputField from "../../../../_helper/_inputField";
import Axios from "axios";
import { NegetiveCheck } from "../../../../_helper/_negitiveCheck";

// Validation schema for bank transfer

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  remover,
  profileData,
  selectedBusinessUnit,
  itemSelectHandler,
  setCheckPublic,
  checkPublic,
  isEdit,
  total,
  setRowDto,
}) {
  const [transactionType, setTransactionType] = useState([]);

  const [valid, setValid] = useState(true);

  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      GetTransactionTypeDDL(setTransactionType);
    }
  }, [profileData, selectedBusinessUnit]);

  const GetCustomDataStructureById = async (values) => {
    const { itemName, uom, quantity } = values;

    //TaxItemGroupId=${values?.itemName?.value} it will be dynamic after backened done properly.

    try {
      const res = await Axios.get(
        `/vat/HsCode/GetCustomsDutyStructureById?TaxItemGroupId=${itemName?.value}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
      );
      if (res.status === 200 && res?.data) {
        const item = res?.data[0];
        const newData = {
          ...item,
          itemName,
          uom,
          quantity,
          individualAmount: item.basePrice * quantity,
        };
        setRowDto([...rowDto, newData]);
      }
    } catch (error) {}
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          transactionType:
            transactionType?.length > 0
              ? {
                  value: transactionType[6]?.value,
                  label: transactionType[6]?.label,
                }
              : "",
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setValid(false);
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
          setValid(true);
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
          isValid,
          handleBlur,
          handleChange,
        }) => (
          <>
            {disableHandler(!isValid || !valid)}
            {console.log("values", values)}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-2">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 pl pr-1 mb-1">
                      <label>Branch</label>
                      <Select
                        value={values?.branch || ""}
                        isSearchable={true}
                        styles={customStyles}
                        placeholder="Branch"
                        name="branch"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Branch Address</label>
                      <InputField
                        value={values?.branchAddress || ""}
                        name="branchAddress"
                        placeholder="Branch Address"
                        type="text"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Transaction Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("transactionType", valueOption);
                        }}
                        value={values?.transactionType || ""}
                        isSearchable={true}
                        options={transactionType || []}
                        styles={customStyles}
                        name="transactionType"
                        placeholder="Transaction Type"
                        isDisabled={initData}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Item Type</label>
                      <Select
                        value={values?.itemType || ""}
                        isSearchable={true}
                        styles={customStyles}
                        name="itemType"
                        placeholder="Item Type"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>To Business Unit</label>
                      <Select
                        value={values?.toBusinessUnit || ""}
                        isSearchable={true}
                        styles={customStyles}
                        name="toBusinessUnit"
                        placeholder="To Businees Unit"
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Transfer To (Branch)</label>
                      <Select
                        value={values?.transferTo || ""}
                        isSearchable={true}
                        styles={customStyles}
                        name="transferTo"
                        placeholder="Transfer To"
                        isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Address</label>
                      <InputField
                        value={values?.address || ""}
                        name="address"
                        placeholder="Address"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Transaction Date</label>
                      <input
                        className="trans-date cj-landing-date"
                        value={_dateFormatter(values?.transactionDate)}
                        name="transactionDate"
                        type="date"
                        disabled={true}
                        placeholder="Transaction date"
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Vehicle Info</label>
                      <InputField
                        value={values?.vehicleInfo || ""}
                        name="vehicleInfo"
                        placeholder="Vahicle Info"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 disable-border disabled-feedback border-gray">
                      <label>Reference No Info</label>
                      <InputField
                        value={values?.referenceNo || ""}
                        name="referenceNo"
                        placeholder="Reference No"
                        type="text"
                        disabled={true}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Reference Date</label>
                      <input
                        className="trans-date cj-landing-date"
                        value={_dateFormatter(values?.referenceDate)}
                        name="referenceDate"
                        onChange={(e) => {
                          setFieldValue("referenceDate", e.target.value);
                        }}
                        type="date"
                        disabled={true}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-10">
                  {/* Table Header input */}
                  <div className={"row bank-journal-custom bj-right"}  style={{
                      marginLeft: "0px",
                      marginRight: "0px",
                      marginTop: "5px",
                    }}>
                    <div className="col-lg-3 pl pr-1">
                      <label>Item Name</label>
                      <Select
                        value={values?.itemName || ""}
                        isSearchable={true}
                        styles={customStyles}
                        name="itemName"
                        placeholder="Item name"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1">
                      <label>Uom</label>
                      <Select
                        value={values?.uom || ""}
                        isSearchable={true}
                        styles={customStyles}
                        name="uom"
                        placeholder="Transaction"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3 pl pr-1 mb-0">
                      <label>Quantity</label>
                      <IInput
                        value={values?.quantity || ""}
                        placeholder="Quantity"
                        name="quantity"
                        onChange={(e) => {
                          NegetiveCheck(
                            e.target.value,
                            setFieldValue,
                            "quantity"
                          );
                        }}
                        type="number"
                        disabled={true}
                      />
                                 
                    </div>

                    <div className="col-lg-1 pl-2 bank-journal">
                      <button
                        style={{ marginTop: "10px" }}
                        type="button"
                        disabled={
                          !values?.itemName || !values?.uom || !values?.quantity
                        }
                        className="btn btn-primary"
                        onClick={() => {
                          GetCustomDataStructureById(values, setRowDto);
                        }}
                      >
                        Add
                      </button>
                    </div>
                    <div className="col-lg-3 pl-5 pr mb-0 mt-5 h-narration border-gray">
                      <h6>
                        Total Amount :
                        {_formatMoney(Math.abs(total?.totalAmount))}
                      </h6>
                    </div>
                  </div>
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  <div className="row">
                    <div className="col-lg-12 pr-0">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "30px" }}>SL</th>
                            <th style={{ width: "120px" }}>Item Name</th>
                            <th style={{ width: "100px" }}>Uom</th>
                            <th style={{ width: "100px" }}>Quantity</th>
                            <th style={{ width: "100px" }}>Rate</th>
                            {/* <th style={{ width: "100px" }}>SD</th>
                            <th style={{ width: "100px" }}>VAT</th>
                            <th style={{ width: "100px" }}>Surcharge</th> */}
                            <th style={{ width: "100px" }}>Total Amount</th>
                            {/* <th style={{ width: "100px" }}>Is Free</th> */}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {item?.itemName?.label}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.uom?.label}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {Math.abs(item?.quantity)}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {Math.abs(item?.rate)}
                                </div>
                              </td>
                              {/* <td>
                                <div className="text-center">
                                  {item?.sdpercentage}
                                </div>
                              </td>
                              <td>
                                <div className="text-center">
                                  {item?.vatamount}
                                </div>
                              </td> */}
                              {/* <td>
                                <div className="text-center">
                                  {item?.surchargePercentage}
                                </div>
                              </td> */}
                              <td>
                                <div className="text-center">
                                  {Math.abs(item?.amount)}
                                </div>
                              </td>
                              {/* <td>
                                <div className="text-center">
                                 
                                <input
                                    style={{
                                      marginTop: "10px",
                                    }}
                                    // checked={check}
                                    type="checkbox"
                                    name="isFree"
                                    // onChange={(e) => {
                                    //   setCheck(e.target.checked);
                                    // }}
                                    value={item.isFree}
                                    checked={item.isFree}
                                    onChange={(e) => {
                                      // setFieldValue("isSd", e.target.checked);
                                      itemSelectHandler(
                                        index,
                                        e.target.checked,
                                        e.target.name
                                      );
                                    }}
                                  />
                                </div>
                              </td> */}
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
