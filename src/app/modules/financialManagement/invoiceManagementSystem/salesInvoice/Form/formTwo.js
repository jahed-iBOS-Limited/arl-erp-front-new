import React from "react";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import InputField from "../../../../_helper/_inputField";
import TextArea from "../../../../_helper/TextArea";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import CreateGrid from "../Table/createGrid";
import {
  getDeliveryDDLFromOrder,
  getDeliveryInformationByDeliveryId,
  getOrderDDL,
  getPartnerInfoByOrder,
} from "../helper";
function FormTwo({ propsObj }) {
  const {
    values,
    setFieldValue,
    setRowDto,
    errors,
    touched,
    accId,
    buId,
    setDisabled,
    rowDto,
    customerDDL,
    setOrderDDL,
    orderDDL,
    setPartnerInfo,
    setSingleValue,
    setDeliveryDDL,
    partnerInfo,
    deliveryDDL,
    challanNo,
    setChallanNo,
    grandTotal
  } = propsObj;

  return (
    <>
      <div className="row global-form global-form-custom">
        <div className="col-lg-3">
          <label>Select Sold to Party</label>
          <Select
            options={customerDDL || []}
            value={values?.customer}
            name="customer"
            errors={errors}
            touched={touched}
            isSearchable={true}
            styles={customStyles}
            placeholder="Select Sold to Party"
            onChange={(valueOption) => {
              getOrderDDL(accId, buId, "", valueOption?.value, setOrderDDL);
              setFieldValue("order", "");
              setFieldValue("purchaseOrderNo", "");
              setFieldValue("companyAddress", "");
              setFieldValue("companyName", "");
              setFieldValue("contactNo", "");
              setFieldValue("customer", valueOption);
            }}
          />
        </div>
        <div className="col-lg-3">
          <label>Order</label>
          <Select
            options={orderDDL || []}
            value={values?.order}
            name="order"
            errors={errors}
            touched={touched}
            isSearchable={true}
            styles={customStyles}
            placeholder="Order"
            onChange={(valueOption) => {
              setFieldValue("order", valueOption);
              getPartnerInfoByOrder(valueOption.value, setPartnerInfo, setFieldValue);
              getDeliveryDDLFromOrder(
                accId,
                buId,
                valueOption?.value,
                "",
                setDeliveryDDL
              );
              setSingleValue(valueOption?.value);
              setFieldValue("purchaseOrderNo", );
            }}
          />
        </div>
        <div className="col-lg-3">
          <label>Purchase Order No</label>
          <InputField
            value={partnerInfo?.partnerRefferenceNo}
            name="purchaseOrderNo"
            placeholder="Purchase Order No"
            onChange={(e) => {
              setPartnerInfo({
                ...partnerInfo,
                partnerRefferenceNo: e.target.value,
              });
            }}
            type="text"
            disabled={true}
          />
        </div>
        <div className="col-lg-3">
          <label>Purchase Date</label>
          <InputField
            value={values?.purchaseDate}
            name="purchaseDate"
            // placeholder="Date"
            type="date"
          />
        </div>
        <div className="col-lg-3">
          <label>Invoice Date</label>
          <InputField
            value={values?.invoiceDate}
            name="invoiceDate"
            // placeholder="Date"
            type="date"
          />
        </div>
        <div className="col-lg-3">
          <label>Company Name</label>
          <InputField
            value={partnerInfo?.companyName}
            name="companyName"
            placeholder="Compnay Name"
            disabled
            type="text"
          />
        </div>
        <div className="col-lg-3">
          <label>Company Address</label>
          <InputField
            value={partnerInfo?.companyAddress}
            name="companyAddress"
            placeholder="Compnay Address"
            type="text"
            disabled
          />
        </div>
        <div className="col-lg-3">
          <label>Contact Person & Designation</label>
          <InputField
            value={values?.contactPerson}
            name="contactPerson"
            placeholder="Contact Person & Designation"
            type="text"
          />
        </div>
        <div className="col-lg-3">
          <label>Contact No</label>
          <InputField
            value={partnerInfo?.contactNo}
            name="contactNo"
            placeholder="Contact No"
            type="text"
            disabled
          />
        </div>
        <div className="col-lg-3">
          <label>Project Name</label>
          {/* <InputField
      value={partnerInfo?.projectNameAddr}
      name="projectName"
      placeholder="Project Name"
      type="text"
      disabled
    /> */}
          <TextArea
            value={partnerInfo?.projectNameAddr}
            name="projectName"
            placeholder="Project Name"
            type="text"
            disabled
            rows="3"
          />
        </div>
        <div className="col-lg-3">
          <label>Delivery</label>
          <Select
            options={deliveryDDL || []}
            value={values.delivery}
            name="delivery"
            // setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            isSearchable={true}
            styles={customStyles}
            placeholder="Delivery"
            onChange={(valueOption) => {
              // setChallanNo((prev) => {
              //   return [
              //     ...prev,
              //     valueOption?.value
              //       ? valueOption?.label +
              //         "_" +
              //         _dateFormatter(valueOption?.date)
              //       : "",
              //   ];
              // });
              setFieldValue("delivery", valueOption);
              // setRowDto([]);
            }}
          />
          {/* <SearchAsyncSelect
      selectedValue={values?.delivery}
      //   placeholder="Search Delivery"
      isSearchIcon={true}
      name="delivery"
      handleChange={(valueOption) => {
        setChallanNo((prev) => {
          return [
            ...prev,
            valueOption?.value
              ? valueOption?.label +
                "_" +
                _dateFormatter(valueOption?.date)
              : "",
          ];
        });
        setFieldValue("delivery", valueOption);
      }}
      isDisabled={!values?.order?.value}
      loadOptions={deliveryLoadPartsList || []}
    /> */}
        </div>
        <div className="col-lg-3 mt-3">
          <TextArea
            name="challanNo"
            value={challanNo}
            label="Challan No & Date"
            placeholder="Challan No & Date"
            touched={touched}
            rows="3"
            disabled
          />
        </div>
        <div className="col-lg-1 mr-1">
          <button
            onClick={() => {
              setChallanNo((prev) => {
                return [
                  ...prev,
                  values?.delivery?.value
                    ? values?.delivery?.label +
                      "_" +
                      _dateFormatter(values?.delivery?.date)
                    : "",
                ];
              });
              getDeliveryInformationByDeliveryId(
                values?.delivery?.value,
                setDisabled,
                setRowDto
              );
            }}
            style={{ marginTop: "19px" }}
            className="btn btn-primary ml-2 mr-2"
            type="button"
            disabled={!values?.delivery?.value}
          >
            Add
          </button>
        </div>
      </div>
      <CreateGrid
        rowDto={rowDto}
        values={values}
        grandTotal={grandTotal}
        setFieldValue={setFieldValue}
      />
    </>
  );
}

export default FormTwo;
