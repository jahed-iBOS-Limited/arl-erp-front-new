/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams } from "react-router";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import Form from "./form";

export default function PartnerOverDueRequestForm() {
  // get user profile data from store
  let {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [objProps] = useState({});
  const [channelDDL, getCannelDDL] = useAxiosGet();
  const [res, postData, isLoading] = useAxiosPost();
  const [isDisabled, setDisabled] = useState(false);

  const initData = {
    channel: "",
    customer: "",
    fromDate: "",
    toDate: "",
    updatedDaysLimit: "",
    creditLimit: "",
    overDueAmount: "",
    reqQty: "",
    reqAmount: "",
    presentDebitAmount: "",
    lastDeliveryDate: "",
    commitment: "",
  };

  const headers = [
    "Ledger Balance",
    "Credit Limit",
    "Unbilled Amount",
    "Available Balance",
    "Undelivered Amount",
    "Pending Qty",
    "Transport Qty",
    "Day Limit",
    "Updated Limit",
  ];

  useEffect(() => {
    getCannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
  }, [accId, buId]);

  const saveHandler = async (values, cb) => {
    const payload = {
      accountId: accId,
      businessUnitId: buId,
      businessPartnerId: values?.customer?.value,
      numCreditLimit: values?.creditLimit || 0,
      fromDate: values?.fromDate,
      toDate: values?.toDate,
      actionBy: userId,
      active: true,
      dayLimit: true,
      limitDays: +values?.updatedDaysLimit,
      isApproveBySales: false,
      approveBySalesID: 0,
      isApproveByAccounts: false,
      approveByAccountsID: 0,
      isApproveByCredit: false,
      approveByCreditID: 0,
      overdueAmount: +values?.overDueAmount || 0,
      requsetQnt: +values?.reqQty || 0,
      requsetAmount: values?.reqAmount || "",
      presentDebitAmount: values?.presentDebitAmount || 0,
      lastDeliveyDate: values?.lastDeliveryDate || "",
      commitment: values?.commitment || "",
    };

    postData(
      `/partner/PartnerOverDue/CreatePartnerOverDue`,
      payload,
      () => {
        cb();
      },
      true
    );
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          channelDDL={channelDDL}
          accId={accId}
          buId={buId}
          headers={headers}
          setLoading={setLoading}
          setDisabled={setDisabled}
        />
      </div>
    </>
  );
}
