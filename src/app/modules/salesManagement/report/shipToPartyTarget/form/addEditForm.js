/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  conditionType: "",
  conditionTypeRef: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
};

export default function ShipToPartyTargetEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [channelList, getChannelList] = useAxiosGet();

  useEffect(() => {
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // getTransportZoneDDL(accId, buId, setZoneDDL);
  }, [accId, buId]);

  const { type } = useParams();
  const [objProps] = useState({});
  const [, postData, isLoading] = useAxiosPost();

  const saveHandler = (values, cb) => {};

  return (
    <>
      {isLoading && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          viewType={type}
          initData={initData}
          postData={postData}
          channelList={channelList}
          saveHandler={saveHandler}
        />
      </div>
    </>
  );
}
