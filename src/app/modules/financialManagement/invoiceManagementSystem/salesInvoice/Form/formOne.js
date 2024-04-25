import axios from "axios";
import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import TextArea from "../../../../_helper/TextArea";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getInvoiceDataByDate } from "../helper";
import { FormOneTable } from "./formOneTable";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
function FormOne({ propsObj }) {
  const {
    distributionChannelDDL,
    values,
    setFieldValue,
    setRowDto,
    errors,
    touched,
    accId,
    buId,
    employeeList,
    setDisabled,
    rowDto,
    rowDtoHandler,
    setChannelId,
    selectedAll,
    allSelect,
    // setCustomerType,
  } = propsObj;

  return (
    <>
      <div className="row global-form global-form-custom">
        <FromDateToDateForm
          obj={{
            values,
            setFieldValue,
          }}
        />
        <div className="col-lg-3">
          <NewSelect
            name="distributionChannel"
            options={distributionChannelDDL}
            value={values?.distributionChannel}
            label="Distribution Channel"
            onChange={(valueOption) => {
              setFieldValue("distributionChannel", valueOption);
              setFieldValue("customer", "");
              setChannelId(valueOption?.value);
              setRowDto([]);
            }}
            placeholder="Distribution Channel"
            errors={errors}
            touched={touched}
          />
        </div>
        {[8].includes(buId) && (
          <div className="col-lg-3">
            <NewSelect
              name="customerType"
              options={[
                { value: 1, label: "In House Customer" },
                { value: 2, label: "Out Customer" },
              ]}
              value={values?.customerType}
              label="Customer Type"
              onChange={(valueOption) => {
                setFieldValue("customerType", valueOption);
                setFieldValue("customer", "");
                // setCustomerType(valueOption?.value);
                setRowDto([]);
              }}
              placeholder="Customer Type"
              errors={errors}
              touched={touched}
            />
          </div>
        )}
        <div className="col-lg-3">
          <div>
            <label>Customer</label>
            <SearchAsyncSelect
              selectedValue={values?.customer}
              handleChange={(valueOption) => {
                setFieldValue("customer", valueOption);
                setRowDto([]);
              }}
              isDisabled={!values?.distributionChannel}
              placeholder="Search Customer"
              loadOptions={(v) => {
                const searchValue = v.trim();
                if (searchValue?.length < 3) return [];
                return axios
                  .get(
                    `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.distributionChannel?.value}`
                  )
                  .then((res) => res?.data);
              }}
            />
          </div>
        </div>

        {[8].includes(buId) && (
          <div className="col-lg-3">
            <InputField
              label="Particulars"
              value={values?.particulars}
              name="particulars"
              placeholder="Particulars"
              onChange={(e) => {
                setFieldValue("particulars", e?.target?.value);
              }}
              type="text"
            />
          </div>
        )}
        <div className="col-lg-3">
          <InputField
            value={values?.refNumber}
            name="refNumber"
            placeholder="PO/WO Number"
            // placeholder="Ref Number"
            // label="Ref Number"
            label="PO/WO Number"
            onChange={(e) => {
              setFieldValue("refNumber", e.target.value);
            }}
            type="text"
          />
        </div>
        <div className="col-lg-3">
          <label>Project Location</label>
          <InputField
            value={values?.projectLocation}
            name="projectLocation"
            placeholder="Project Location"
            onChange={(e) => {
              setFieldValue("projectLocation", e.target.value);
            }}
            type="text"
          />
        </div>

        {/* Invoice will auto generate */}
        {/* <div className="col-lg-3">
          <label>Invoice Number</label>
          <InputField
            value={values?.invoiceNo}
            name="invoiceNo"
            placeholder="Invoice No"
            onChange={(e) => {
              setFieldValue("invoiceNo", e.target.value);
            }}
            type="text"
          />
        </div> */}
        <div className="col-lg-3">
          <NewSelect
            name="ait"
            options={[
              { value: true, label: "Include" },
              { value: false, label: "Exclude" },
            ]}
            value={values?.ait}
            label="AIT"
            onChange={(valueOption) => {
              setFieldValue("ait", valueOption);
            }}
            placeholder="AIT"
            errors={errors}
            touched={touched}
          />
        </div>
        {[4, 186, 138]?.includes(buId) && (
          <>
            <div className="col-lg-3">
              <NewSelect
                name="soldBy"
                options={employeeList || []}
                value={values?.soldBy}
                label="Sold By"
                onChange={(valueOption) => {
                  setFieldValue("soldBy", valueOption);
                }}
                placeholder="Sold By"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="salesOrderCreatedBy"
                options={employeeList || []}
                value={values?.salesOrderCreatedBy}
                label="Sales Order Created By"
                onChange={(valueOption) => {
                  setFieldValue("salesOrderCreatedBy", valueOption);
                }}
                placeholder="Sales Order Created By"
                errors={errors}
                touched={touched}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="paymentTerms"
                options={[
                  { value: 1, label: "Cash" },
                  { value: 2, label: "Credit" },
                  { value: 3, label: "Both" },
                ]}
                value={values?.paymentTerms}
                label="Payment Term"
                onChange={(valueOption) => {
                  setFieldValue("paymentTerms", valueOption);
                }}
                placeholder="Payment Term"
                errors={errors}
                touched={touched}
              />
            </div>
            {/* <div className="col-lg-3">
              <InputField
                label="Payment Terms"
                value={values?.paymentTerms}
                name="paymentTerms"
                placeholder="Payment Terms"
                type="text"
              />
            </div> */}
            <div className="col-lg-3 mt-3">
              <label>Remarks</label>
              <TextArea
                name="remarks"
                value={values?.remarks || ""}
                label="Remarks"
                placeholder="Remarks"
                touched={touched}
                rows="3"
              />
            </div>
          </>
        )}
        <div className="col-lg-3 mt-5">
          <button
            onClick={() => {
              getInvoiceDataByDate(
                accId,
                buId,
                values?.fromDate,
                values?.toDate,
                values?.customer?.value,
                values?.refNumber,
                values?.projectLocation,
                setDisabled,
                setRowDto
              );
            }}
            className="btn btn-primary mr-2"
            type="button"
          >
            View
          </button>
        </div>
      </div>
      <FormOneTable
        obj={{ rowDto, buId, allSelect, selectedAll, rowDtoHandler }}
      />
    </>
  );
}

export default FormOne;
