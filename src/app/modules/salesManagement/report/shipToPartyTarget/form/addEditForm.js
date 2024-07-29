/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from "react";
import { useParams } from "react-router";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";

const initData = {
  conditionType: "",
  conditionTypeRef: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
};

export default function ShipToPartyTargetEntryForm() {
  // get user data from store
  // const {
  //   profileData: { accountId: accId },
  //   selectedBusinessUnit: { value: buId },
  // } = useSelector((state) => state?.authData, shallowEqual);

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
          saveHandler={saveHandler}
        />
      </div>
    </>
  );
}
