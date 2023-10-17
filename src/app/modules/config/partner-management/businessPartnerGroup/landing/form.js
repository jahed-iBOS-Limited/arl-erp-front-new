import React from "react";
import NewSelect from "../../../../_helper/_select";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import axios from "axios";
import IButton from "../../../../_helper/iButton";

export default function BusinessPartnerGroupLandingForm({ obj }) {
  const {
    buId,
    accId,
    values,
    partnerGroups,
    setFieldValue,
    getLandingData,
  } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
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
              <label>Business Partner</label>
              <SearchAsyncSelect
                selectedValue={values?.customer}
                handleChange={(valueOption) => {
                  setFieldValue("customer", valueOption);
                }}
                isDisabled={!values?.channel}
                placeholder="Search Business Partner"
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

            <div className="col-lg-3">
              <NewSelect
                name="partnerGroup"
                label="Partner Group"
                placeholder="Partner Group"
                options={[{ value: 0, label: "All" }, ...partnerGroups] || []}
                value={values?.partnerGroup}
                onChange={(valueOption) => {
                  setFieldValue("partnerGroup", valueOption);
                }}
              />
            </div>
            <IButton
              onClick={() => {
                getLandingData(values);
              }}
            />
          </div>
        </div>
      </form>
    </>
  );
}
