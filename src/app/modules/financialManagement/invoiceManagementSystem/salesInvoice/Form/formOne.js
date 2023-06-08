import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import NewSelect from "../../../../_helper/_select";
import axios from "axios";
import InputField from "../../../../_helper/_inputField";
import { Field } from "formik";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import { getInvoiceDataByDate } from "../helper";
import TextArea from "../../../../_helper/TextArea";
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
    setCustomerType,
  } = propsObj;

  // totals for 1st table
  let grandTotalDeliveredQtyCFT = 0;
  let grandTotalDeliveredQtyCUM = 0;
  let grandTotalAmount1 = 0;

  //  totals for 2nd table
  let grandTotalDeliveredQty = 0;
  let grandTotalAmount2 = 0;
  return (
    <>
      <div className="row global-form global-form-custom">
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
                setCustomerType(valueOption?.value);
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
        <div className="col-lg-3">
          <label>From Date</label>
          <InputField
            value={values?.fromDate}
            name="fromDate"
            // placeholder="Date"
            type="date"
          />
        </div>
        <div className="col-lg-3">
          <label>To Date</label>
          <InputField
            value={values?.toDate}
            name="toDate"
            // placeholder="Date"
            type="date"
          />
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
        <div className="col-lg-3">
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
        </div>
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
        {[4, 186]?.includes(buId) && (
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
              <InputField
                label="Payment Terms"
                value={values?.paymentTerms}
                name="paymentTerms"
                placeholder="Payment Terms"
                type="text"
              />
            </div>
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
      {rowDto?.length > 0 && (
        <div className="row">
          <div className="col-12">
            {[94, 175].includes(buId) ? (
              <table className="global-table table">
                <thead>
                  <tr onClick={() => allSelect(!selectedAll())}>
                    <th className="check-box" style={{ width: "45px" }}>
                      <input
                        type="checkbox"
                        style={{ marginRight: "4px" }}
                        value={selectedAll()}
                        checked={selectedAll()}
                        onChange={() => {}}
                      />
                    </th>
                    <th style={{ width: "45px" }}>SL</th>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Total Delivery Qty (CFT)</th>
                    <th>Total Delivery Qty (CUM)</th>

                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => {
                    grandTotalDeliveredQtyCFT += item.totalDeliveredQtyCFT;
                    grandTotalDeliveredQtyCUM += item.totalDeliveredQtyCUM;
                    grandTotalAmount1 += item.totalAmount;

                    return (
                      <tr
                        key={index}
                        style={
                          rowDto[index]?.presentStatus
                            ? { backgroundColor: "#aacae3" }
                            : {}
                        }
                        onClick={() => {
                          rowDtoHandler(
                            "presentStatus",
                            !rowDto[index]?.presentStatus,
                            index
                          );
                        }}
                      >
                        <td className="text-center align-middle check-box">
                          <Field
                            type="checkbox"
                            name="presentStatus"
                            checked={rowDto[index]?.presentStatus}
                            value={rowDto[index]?.presentStatus}
                            onChange={(e) => {}}
                          />
                        </td>
                        <td className="text-center">{index + 1}</td>
                        <td className="ml-2">
                          {_dateFormatter(item?.deliveriDate)}
                        </td>

                        <td className="ml-2">{item?.itemName}</td>
                        <td className="text-right">
                          {item?.totalDeliveredQtyCFT.toFixed(2)}
                        </td>
                        <td className="text-right">
                          {item?.totalDeliveredQtyCUM.toFixed(2)}
                        </td>

                        <td className="text-right">
                          {_fixedPoint(item?.totalAmount, true)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr
                    style={{
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <td colSpan={4}> Total </td>

                    <td>{_fixedPoint(grandTotalDeliveredQtyCFT, true)}</td>
                    <td>{_fixedPoint(grandTotalDeliveredQtyCUM, true)}</td>
                    <td>{_fixedPoint(grandTotalAmount1, true)}</td>
                  </tr>
                </tbody>
              </table>
            ) : (
              <table className="global-table table">
                <thead>
                  <tr onClick={() => allSelect(!selectedAll())}>
                    <th className="check-box" style={{ width: "45px" }}>
                      <input
                        type="checkbox"
                        style={{ marginRight: "4px" }}
                        value={selectedAll()}
                        checked={selectedAll()}
                      />
                    </th>
                    <th style={{ width: "45px" }}>SL</th>
                    <th>Delivery Order</th>
                    <th>Challan No</th>
                    <th>Challan Date</th>
                    <th>Total Delivery Qty</th>
                    <th>Total Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.map((item, index) => {
                    grandTotalDeliveredQty += item.totalDeliveredQty;
                    grandTotalAmount2 += item.totalAmount;
                    return (
                      <tr
                        className="cursor-pointer"
                        key={index}
                        style={
                          rowDto[index]?.presentStatus
                            ? { backgroundColor: "#aacae3" }
                            : {}
                        }
                        onClick={() => {
                          rowDtoHandler(
                            "presentStatus",
                            !rowDto[index]?.presentStatus,
                            index
                          );
                        }}
                      >
                        <td className="text-center align-middle check-box">
                          <Field
                            type="checkbox"
                            name="presentStatus"
                            checked={rowDto[index]?.presentStatus}
                            onChange={(e) => {}}
                          />
                        </td>
                        <td className="text-center">{index + 1}</td>
                        <td className="ml-2">{item?.orderCode}</td>
                        <td className="ml-2">{item?.deliveryCode}</td>
                        <td className="ml-2">
                          {_dateFormatter(item?.deliveryDate)}
                        </td>
                        <td className="text-right">
                          {item?.totalDeliveredQty}
                        </td>
                        <td className="text-right">
                          {item?.totalAmount.toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                  <tr
                    style={{
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    <td colSpan={5}> Total </td>
                    <td>{_fixedPoint(grandTotalDeliveredQty, true)}</td>
                    <td>{_fixedPoint(grandTotalAmount2, true)}</td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default FormOne;
