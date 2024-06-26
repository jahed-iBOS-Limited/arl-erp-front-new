import axios from "axios";
import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";

const reportTypes = [
  { value: 1, label: "Days And Amount Base Balance" },
  // { value: 4, label: "Receivable Report" },
  { value: 2, label: "Regular Irregular Party" },
  { value: 3, label: "Sister Concern Overdue" },
  { value: 5, label: "Party Status" },
  { value: 6, label: "Sales & Revenue Collection Report" },
  { value: 7, label: "BP BA CP Analysis Report" },
  { value: 8, label: "Receivable & OverDue Report" },
];

// const partyStatusList = [
//   { value: 0, label: "All" },
//   { value: 30, label: "Regular" },
//   { value: 60, label: "IRegular" },
//   { value: 1, label: "Block" },
// ];

const partyGroupList = [
  { value: 0, label: "All" },
  { value: 2, label: "Bank Guarantee" },
  { value: 3, label: "Work order / Purchase Order" },
  { value: 4, label: "Cheque" },
  { value: 5, label: "Contract" },
  { value: 6, label: "LC" },
  { value: 7, label: "Cash" },
];

export default function Form({ obj }) {
  const {
    buId,
    accId,
    buDDL,
    values,
    setRowDto,
    setIsShow,
    channelId,
    viewHandler,
    setChannelId,
    setFieldValue,
  } = obj;

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${v}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${channelId}`
      )
      .then((res) => res?.data);
  };

  const disableHandler = (values) => {
    return (
      ([1, 2].includes(values?.reportType?.value) && !values?.channel) ||
      !values?.reportType ||
      ([4].includes(values?.reportType?.value) && !values?.viewType)
    );
  };

  const idSetOne = (values) => {
    const typeId = values?.reportType?.value;
    const result = [1, 2, 5, 7].includes(typeId);

    return result;
  };

  const idSetTwo = (values) => {
    const typeId = values?.reportType?.value;
    const result = [2, 5, 7].includes(typeId);

    return result;
  };

  return (
    <>
      <form className="form form-label-right">
        <div className="form-group row global-form printSectionNone">
          <div className="col-lg-3">
            <NewSelect
              name="reportType"
              options={reportTypes}
              value={values?.reportType}
              label="Report Type"
              onChange={(valueOption) => {
                setIsShow(false);
                setFieldValue("reportType", valueOption);
              }}
            />
          </div>
          {[3, 4, 6].includes(values?.reportType?.value) && (
            <>
              <div className="col-lg-3">
                <NewSelect
                  name="businessUnit"
                  options={[{ value: 0, label: "All" }, ...buDDL]}
                  value={values?.businessUnit}
                  label="Business Unit"
                  onChange={(valueOption) => {
                    setIsShow(false);
                    setFieldValue("businessUnit", valueOption);
                  }}
                  placeholder="Business Unit"
                />
              </div>
              {[4].includes(values?.reportType?.value) && (
                <div className="col-lg-3">
                  <NewSelect
                    name="viewType"
                    options={[
                      { value: 1, label: "Details" },
                      { value: 5, label: "Top Sheet" },
                    ]}
                    value={values?.viewType}
                    label="View Type"
                    onChange={(valueOption) => {
                      setIsShow(false);
                      setFieldValue("viewType", valueOption);
                    }}
                    placeholder="View Type"
                  />
                </div>
              )}
            </>
          )}
          {![6,7,8].includes(values?.reportType?.value) && (
            <div className="col-lg-3">
              <InputField
                value={values?.date}
                label={`${
                  [2,4, 5].includes(values?.reportType?.value)
                    ? "Transaction"
                    : ""
                } Date`}
                name="date"
                type="date"
                onChange={(e) => {
                  setIsShow(false);
                  setFieldValue("date", e?.target?.value);
                  setRowDto([]);
                }}
              />
            </div>
          )}
          {[3].includes(values?.reportType?.value) && ( <div className="col-lg-3">
                  <NewSelect
                    name="sisViewType"
                    options={[
                      { value: 1, label:  "Top Sheet" },
                      { value: 2, label: "Details" },
                    ]}
                    value={values?.sisViewType}
                    label="View Type"
                    onChange={(valueOption) => {
                      setIsShow(false);
                      setFieldValue("sisViewType", valueOption);
                    }}
                    placeholder="View Type"
                  />
                </div>)}
          {[6,7,8].includes(values?.reportType?.value) && (
            <FromDateToDateForm
              obj={{
                values,
                setFieldValue,
                onChange: () => {
                  setIsShow(false);
                },
              }}
            />
          )}

          {idSetOne(values) && (
            <>
              <RATForm
                obj={{
                  values,
                  setFieldValue,
                  region: idSetTwo(values),
                  area: idSetTwo(values),
                  territory: idSetTwo(values),
                  onChange: (allValue, fieldName) => {
                    setIsShow(false);
                    setRowDto([]);
                    if (fieldName === "channel") {
                      console.log("channel");
                      setChannelId(allValue?.channel?.value);
                    }
                  },
                }}
              />

              {![7].includes(values?.reportType?.value) && (
                <div className="col-lg-3">
                  <label>Customer</label>
                  <SearchAsyncSelect
                    selectedValue={values?.customer}
                    handleChange={(valueOption) => {
                      setIsShow(false);
                      setFieldValue("customer", valueOption);
                      setRowDto([]);
                    }}
                    placeholder="Search Customer"
                    loadOptions={loadCustomerList}
                  />
                </div>
              )}
              {[2].includes(values?.reportType?.value) && ( <div className="col-lg-3">
                  <NewSelect
                    name="partyStatus"
                    options={[
                      { value: 1, label:  "Regular" },
                      { value: 2, label: "Irregular" },
                      { value: 3, label: "Block" },
                      { value: 4, label: "Above 90 Days" },
                    ]}
                    value={values?.partyStatus}
                    label="Party Status"
                    onChange={(valueOption) => {
                      setIsShow(false);
                      setFieldValue("partyStatus", valueOption);
                    }}
                    placeholder="Party Status"
                  />
                </div>)}
            </>
          )}

          {[5].includes(values?.reportType?.value) && (
            <>
              {/* <div className="col-lg-3">
                <NewSelect
                  name="partyStatus"
                  options={partyStatusList}
                  value={values?.partyStatus}
                  label="Party Status"
                  onChange={(valueOption) => {
                    setIsShow(false);
                    setFieldValue("partyStatus", valueOption);
                  }}
                  placeholder="Party Status"
                />
              </div> */}
              <div className="col-lg-3">
                <NewSelect
                  name="partyGroup"
                  options={partyGroupList}
                  value={values?.partyGroup}
                  label="Party Group"
                  onChange={(valueOption) => {
                    setIsShow(false);
                    setFieldValue("partyGroup", valueOption);
                  }}
                  placeholder="Party Group"
                />
              </div>
            </>
          )}

          <IButton
            onClick={() => {
              if ([1].includes(values?.reportType?.value)) {
                viewHandler(values);
              } else if (
                [2, 3, 4, 5, 6, 7, 8].includes(values?.reportType?.value)
              ) {
                setIsShow(true);
              }
            }}
            disabled={disableHandler(values)}
          />
        </div>
      </form>
    </>
  );
}
