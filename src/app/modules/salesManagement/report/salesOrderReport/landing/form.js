import React from "react";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

export default function Form({ obj }) {
  const {
    buId,
    accId,
    values,
    errors,
    touched,
    setGridData,
    shipPointDDL,
    setFieldValue,
    getReportView,
  } = obj;
  return (
    <>
      <form>
        <div className="row global-form">
          <div className="col-lg-3">
            <NewSelect
              name="shipPoint"
              options={[{ value: 0, label: "All" }, ...shipPointDDL]}
              value={values?.shipPoint}
              label="Shippoint"
              onChange={(valueOption) => {
                setFieldValue("shipPoint", valueOption);
                setGridData([]);
              }}
              placeholder="Shippoint"
              errors={errors}
              touched={touched}
            />
          </div>
          <RATForm
            obj={{
              values,
              setFieldValue,
              region: false,
              area: false,
              territory: false,
            }}
          />
          <div className="col-lg-3">
            <label>Customer</label>
            <SearchAsyncSelect
              selectedValue={values?.customer}
              handleChange={(valueOption) => {
                setFieldValue("customer", valueOption);
                setGridData([]);
              }}
              isDisabled={!values?.channel}
              placeholder="Search Customer"
              loadOptions={(v) => {
                const searchValue = v.trim();
                if (searchValue?.length < 3 || !searchValue) return [];
                return axios
                  .get(
                    `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                  )
                  .then((res) => res?.data);
              }}
            />
          </div>
          <FromDateToDateForm obj={{ values, setFieldValue }} />
          <div className="col-lg-3">
            <NewSelect
              name="reportType"
              options={[
                { value: 0, label: "Details" },
                { value: 1, label: "Top Sheet" },
                { value: 2, label: "Orders from APP" },
              ]}
              value={values?.reportType}
              label="View Type"
              onChange={(valueOption) => {
                setFieldValue("reportType", valueOption);
                setGridData([]);
              }}
              placeholder="View Type"
              errors={errors}
              touched={touched}
            />
          </div>
          <IButton
            onClick={() => {
              getReportView(values);
            }}
            disabled={
              !values?.fromDate || !values?.toDate || !values?.shipPoint
            }
          />
        </div>
      </form>
    </>
  );
}
