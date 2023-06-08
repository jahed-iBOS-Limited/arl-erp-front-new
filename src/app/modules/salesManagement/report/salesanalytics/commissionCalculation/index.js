/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import NewSelect from "./../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";

function CommissionCalculationForm({ obj }) {
  const { setFieldValue, values, setGridData } = obj;
  const [channelList, getChannelList] = useAxiosGet();
  const [shipPointList, getShipPointList] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    getShipPointList(
      `/domain/OrganizationalUnitUserPermission/GetOrganizationalUnitUserPermissionByUnitId?UserId=${userId}&ClientId=${accId}&BusinessUnitId=${buId}`
    );
  }, [accId, buId]);

  const shipPointDDL = shipPointList?.map((item) => ({
    ...item,
    value: item?.organizationUnitReffId,
    label: item?.organizationUnitReffName,
  }));

  return (
    <>
      <div className="col-lg-3">
        <NewSelect
          name="shipPoint"
          options={shipPointDDL || []}
          value={values?.shipPoint}
          label="Ship Point"
          onChange={(valueOption) => {
            setFieldValue("shipPoint", valueOption);
            setGridData([]);
          }}
          placeholder="Select Ship Point"
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          name="channel"
          options={channelList || []}
          value={values?.channel}
          label="Distribution Channel"
          onChange={(valueOption) => {
            setFieldValue("channel", valueOption);
            setFieldValue("customer", "");
            setGridData([]);
          }}
          placeholder="Select Distribution Channel"
        />
      </div>
      <div className="col-lg-3">
        <label>Customer</label>
        <SearchAsyncSelect
          selectedValue={values?.customer}
          handleChange={(valueOption) => {
            setFieldValue("customer", valueOption);
            if (valueOption) {
            }
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
      <div className="col-lg-3">
        <label>From Date</label>
        <InputField
          value={values?.fromDate}
          name="fromDate"
          placeholder="Date"
          type="date"
          onChange={(e) => {
            setGridData([]);
            setFieldValue("fromDate", e.target.value);
          }}
        />
      </div>
      <div className="col-lg-3">
        <label>To Date</label>
        <InputField
          value={values?.toDate}
          name="toDate"
          placeholder="Date"
          type="date"
          onChange={(e) => {
            setGridData([]);
            setFieldValue("toDate", e.target.value);
          }}
        />
      </div>
    </>
  );
}

export default CommissionCalculationForm;
