import axios from "axios";
import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import TextArea from "../../../../_helper/TextArea";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import { getInvoiceDataByDate } from "../helper";
import { SalesInvoiceFormTable } from "./table";
function Form({ propsObj }) {
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
    customerList,
    getCustomerList,
    SOList,
    getSOList,
    getRowsBySO,
    getSOInfo,
    setCustomerList,
    setSOList,
  } = propsObj;

  const getCustomers = (values) => {
    getCustomerList(
      `/oms/OManagementReport/GetCustomerAndSalesOrder?businessUnitId=${buId}&channelId=${values?.distributionChannel?.value}&soldToPartnerId=0&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
      (resData) => {
        const modifiedData = resData?.map((item) => {
          return {
            ...item,
            value: item?.soldToPartnerId,
            label: item?.soldToPartnerName,
          };
        });
        setCustomerList(modifiedData);
      }
    );
  };

  return (
    <>
      <div className="row global-form global-form-custom">
        <div className="col-lg-3">
          <NewSelect
            name="invoiceType"
            options={[
              { value: 1, label: "Date Range Base" },
              { value: 2, label: "SO Base" },
            ]}
            value={values?.invoiceType}
            label="Invoice Type"
            onChange={(valueOption) => {
              setFieldValue("invoiceType", valueOption);
              setFieldValue("customer", "");
              setFieldValue("projectLocation", "");
              setRowDto([]);
            }}
            placeholder="Invoice Type"
            errors={errors}
            touched={touched}
          />
        </div>
        <FromDateToDateForm
          obj={{
            values,
            setFieldValue,
            onChange: (allValues) => {
              if (
                values?.invoiceType?.value === 2 &&
                values?.distributionChannel?.value
              ) {
                getCustomers(allValues);
              }
            },
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
              if (values?.invoiceType?.value === 2) {
                getCustomers({ ...values, distributionChannel: valueOption });
              }
            }}
            placeholder="Distribution Channel"
            errors={errors}
            touched={touched}
          />
        </div>

        {values?.invoiceType?.value === 1 && (
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
        )}
        {values?.invoiceType?.value === 2 && (
          <>
            <div className="col-lg-3">
              <NewSelect
                name="customer"
                options={customerList || []}
                value={values?.customer}
                label="Customer"
                onChange={(valueOption) => {
                  setFieldValue("customer", valueOption);
                  getSOList(
                    `/oms/OManagementReport/GetCustomerAndSalesOrder?businessUnitId=${buId}&channelId=${values?.distributionChannel?.value}&soldToPartnerId=${valueOption?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`,
                    (resData) => {
                      const modifiedData = resData?.map((item) => {
                        return {
                          ...item,
                          value: item?.salesOrderId,
                          label: item?.salesOrderCode,
                        };
                      });
                      setSOList(modifiedData);
                    }
                  );
                  setRowDto([]);
                }}
                placeholder="Customer"
                errors={errors}
                touched={touched}
                isDisabled={!values?.distributionChannel}
              />
            </div>
            <div className="col-lg-3">
              <NewSelect
                name="salesOrder"
                options={SOList || []}
                value={values?.salesOrder}
                label="Sales Order"
                onChange={(valueOption) => {
                  setFieldValue("salesOrder", valueOption);
                  getSOInfo(
                    `/oms/SalesOrder/GetDataBySalesOrderId?AccountId=${accId}&BusinessUnit=${buId}&SalesOrderId=${valueOption?.value}`,
                    (resData) => {
                      const location =
                        resData[0]?.objHeader?.shiptoPartnerAddress;
                      setFieldValue("projectLocation", location);
                    }
                  );
                  getSOInfo(
                    `/wms/CommercialInvoice/GetPartnerInfoByOrder?OrderId=${valueOption?.value}`,
                    (resData) => {
                      setFieldValue("refNumber", resData?.partnerRefferenceNo);
                    }
                  );
                  setRowDto([]);
                }}
                placeholder="Sales Order"
                errors={errors}
                touched={touched}
                isDisabled={!values?.customer}
              />
            </div>
          </>
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
        <div className="col-lg-3">
          <NewSelect
            name="vat"
            options={[
              { value: true, label: "Include" },
              { value: false, label: "Exclude" },
            ]}
            value={values?.vat}
            label="VAT"
            onChange={(valueOption) => {
              setFieldValue("vat", valueOption);
            }}
            placeholder="VAT"
            errors={errors}
            touched={touched}
          />
        </div>
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
        <div className="col-lg-3 mt-5">
          <button
            onClick={() => {
              if (values?.invoiceType?.value === 1) {
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
              } else if (values?.invoiceType?.value === 2) {
                getRowsBySO(
                  `/oms/OManagementReport/GetPendingInvoiceBySO?businessUnitId=${buId}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&salesOrderId=${values?.salesOrder?.value}&reference=${values?.refNumber}&projLocation=${values?.projectLocation}`,
                  (resData) => {
                    setRowDto(resData);
                  }
                );
              }
            }}
            className="btn btn-primary mr-2"
            type="button"
            disabled={!values?.invoiceType || !values?.customer}
          >
            View
          </button>
        </div>
      </div>
      <SalesInvoiceFormTable
        obj={{ rowDto, buId, allSelect, selectedAll, rowDtoHandler, values }}
      />
    </>
  );
}

export default Form;
