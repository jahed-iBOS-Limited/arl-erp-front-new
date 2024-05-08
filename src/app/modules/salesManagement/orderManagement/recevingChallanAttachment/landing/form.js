/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import TextArea from "../../../../_helper/TextArea";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import IButton from "../../../../_helper/iButton";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

const DamageEntryLandingForm = ({ obj }) => {
  const {
    buId,
    accId,
    values,
    pageNo,
    sbuDDL,
    pageSize,
    gridData,
    editHandler,
    setGridData,
    setFieldValue,
    salesReturnLandingActions,
  } = obj;

  const customerList = (v) => {
    const searchValue = v.trim();
    if (searchValue?.length < 3 || !searchValue) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
      )
      .then((res) => res?.data);
  };

  return (
    <>
      <form>
        <div className="row global-form">
          <div className="col-lg-2">
            <NewSelect
              name="viewAs"
              options={[
                { value: 1, label: "Supervisor" },
                // { value: 2, label: "Accountant" },
              ]}
              value={values?.viewAs}
              label="View As"
              onChange={(valueOption) => {
                setFieldValue("viewAs", valueOption);
                setGridData([]);
              }}
              placeholder="View As"
            />
          </div>
          {buId === 4 && (
            <>
              <RATForm
                obj={{
                  values,
                  setFieldValue,
                  region: false,
                  area: false,
                  territory: false,
                  columnSize: "col-lg-2",
                  onChange: () => {
                    setFieldValue("customer", "");
                    setGridData([]);
                  },
                }}
              />
              <div className="col-lg-2">
                <label>Customer</label>
                <SearchAsyncSelect
                  selectedValue={values?.customer}
                  handleChange={(valueOption) => {
                    setFieldValue("customer", valueOption);
                    setGridData([]);
                  }}
                  isDisabled={!values?.channel}
                  placeholder="Search Customer"
                  loadOptions={customerList || []}
                />
              </div>
            </>
          )}
          <FromDateToDateForm
            obj={{ values, setFieldValue, colSize: "col-lg-2" }}
          />{" "}
          <div className="col-lg-2">
            <NewSelect
              name="status"
              options={[
                { value: 0, label: "All" },
                { value: 1, label: "Approved" },
                { value: 2, label: "Pending" },
                { value: 3, label: "Canceled" },
              ]}
              value={values?.status}
              label="Status"
              onChange={(valueOption) => {
                setFieldValue("status", valueOption);
                setGridData([]);
              }}
              placeholder="Status"
            />
          </div>
          {values?.viewAs?.value === 2 && (
            <>
              <div className="col-md-2">
                <NewSelect
                  name="sbu"
                  options={sbuDDL || []}
                  value={values?.sbu}
                  label="SBU"
                  onChange={(valueOption) => {
                    setFieldValue("sbu", valueOption);
                  }}
                  placeholder="Select SBU"
                />
              </div>{" "}
              <div className="col-lg-4">
                <label>Narration</label>
                <TextArea
                  name="narration"
                  value={values?.narration}
                  label="Narration"
                  placeholder="Narration"
                />
              </div>
            </>
          )}
          <IButton
            onClick={() => {
              salesReturnLandingActions(values, pageNo, pageSize);
            }}
            disabled={
              !values?.viewAs || (values?.viewAs?.value === 2 && !values?.sbu)
            }
          />
          {/* {gridData?.data?.length > 0 && values?.status?.value === 2 && (
            <IButton
              className={"btn-info"}
              onClick={() => {
                editHandler(values);
              }}
            >
              Update & Approve
            </IButton>
          )} */}
        </div>
      </form>
    </>
  );
};

export default DamageEntryLandingForm;
