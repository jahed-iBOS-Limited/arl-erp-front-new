/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";

const PartnerCheckSubmitLandingForm = ({ obj }) => {
  const {
    buId,
    accId,
    loader,
    pageNo,
    values,
    rowData,
    empList,
    getData,
    pageSize,
    channelList,
    handleFilter,
    setFieldValue,
    setFilteredData,
  } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="salesType"
                options={[
                  { value: 1, label: "Local" },
                  { value: 2, label: "Foreign" },
                ]}
                value={values?.salesType}
                label="Sales Type"
                onChange={(valueOption) => {
                  setFieldValue("salesType", valueOption);
                  setFilteredData([]);
                }}
                placeholder="Select Sales Type"
              />
            </div>
            {values?.salesType?.value === 1 && (
              <div className="col-lg-3">
                <NewSelect
                  name="viewType"
                  options={[
                    { value: 1, label: "Details" },
                    { value: 2, label: "Top Sheet (Date base)" },
                    { value: 3, label: "Top Sheet (Employee base)" },
                  ]}
                  value={values?.viewType}
                  label="View Type"
                  onChange={(valueOption) => {
                    setFieldValue("viewType", valueOption);
                    setFilteredData([]);
                  }}
                  placeholder="Select View Type"
                />
              </div>
            )}
            {(values?.viewType?.value === 1 ||
              values?.salesType?.value === 2) && (
              <>
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    options={[{ value: 0, label: "All" }, ...channelList]}
                    value={values?.channel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("channel", valueOption);
                    }}
                    placeholder="Distribution Channel"
                  />
                </div>
                <div className="col-lg-3">
                  <label>Customer</label>
                  <SearchAsyncSelect
                    selectedValue={values?.customer}
                    handleChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                    }}
                    isDisabled={!values?.channel}
                    placeholder="Search Customer"
                    loadOptions={(v) => {
                      const searchValue = v.trim();
                      if (searchValue?.length < 3) return [];
                      return axios
                        .get(
                          `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                        )
                        .then((res) => res?.data);
                    }}
                  />
                </div>
              </>
            )}

            {[3].includes(values?.viewType?.value) && (
              <>
                <div className="col-lg-3">
                  <NewSelect
                    name="employee"
                    options={empList || []}
                    value={values?.employee}
                    label="Employee (Cheque Bearer)"
                    onChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    placeholder="Employee (Cheque Bearer)"
                  />
                </div>
              </>
            )}

            <FromDateToDateForm obj={{ values, setFieldValue }} />
            {[2].includes(values?.salesType?.value) && (
              <>
                <div className="col-lg-3">
                  <NewSelect
                    name="chequeStatus"
                    options={[
                      { value: 1, label: "Pending" },
                      { value: 2, label: "Approved" },
                    ]}
                    value={values?.chequeStatus}
                    label="Status"
                    onChange={(valueOption) => {
                      setFieldValue("chequeStatus", valueOption);
                    }}
                    placeholder="Status"
                  />
                </div>
              </>
            )}
            <IButton
              onClick={() => {
                getData(values, pageNo, pageSize);
              }}
              disabled={
                loader ||
                (values?.salesType?.value === 1 && !values?.viewType) ||
                (values?.viewType?.value === 3 && !values?.employee)
              }
            />

            <div className="col-12"></div>
            {rowData?.data?.length > 0 && values?.viewType?.value === 1 && (
              <div className="col-lg-3">
                <NewSelect
                  name="status"
                  options={[
                    { value: 0, label: "All" },
                    { value: 1, label: "Pending" },
                    { value: 2, label: "Completed" },
                    { value: 3, label: "Cancelled" },
                  ]}
                  value={values?.status}
                  label="Filter by Status"
                  onChange={(valueOption) => {
                    setFieldValue("status", valueOption);
                    handleFilter(valueOption?.value);
                  }}
                  placeholder="Select Status"
                />
              </div>
            )}
          </div>
        </div>
      </form>
    </>
  );
};

export default PartnerCheckSubmitLandingForm;
