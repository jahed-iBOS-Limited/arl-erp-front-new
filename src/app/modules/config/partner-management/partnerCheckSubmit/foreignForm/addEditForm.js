/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _firstDateofMonth } from "../../../../_helper/_firstDateOfCurrentMonth";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Form from "./form";
import { editExportPaymentPosting } from "../helper";

const initData = {
  customer: "",
  channel: "",
  soDate: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  salesOrder: "",
  soRef: "",
  salesContractRef: "",
  ttAmount: "",
  erqValue: "",
  orqValue: "",
  conversionRate: "",
  ttAmountBDT: "",
  erqValueBDT: "",
  orqValueBDT: "",
  finalDestination: "",
};

export default function ExportPaymentPostingForm({
  type,
  setShow,
  getData,
  singleItem,
  landingFormValues,
}) {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [objProps] = useState({});
  const [channelList, getChannelList] = useAxiosGet();
  const [rowData, getRowData, rowLoader, setRowData] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [
    singleData,
    getSingleData,
    singleDataLoader,
    setSingleData,
  ] = useAxiosGet();
  const [soList, getSOList, soLoader] = useAxiosGet();
  const [uploadedImage, setUploadedImage] = useState([]);
  const [employeeInfo, getEmployeeInfo] = useAxiosGet();

  useEffect(() => {
    if (type) {
      getSingleData(
        `/partner/PartnerOverDue/GetExportPartnerPaymentInfoById?accountId=${accId}&businessUnitId=${buId}&paymentPrepareId=${singleItem?.paymentPrepareId}`,
        (resData) => {
          const h = resData?.objHead;
          const modifyData = {
            ...h,
            customer: {
              label: h?.customerName,
              value: h?.customerId,
            },
            channel: "",
            soDate: h?.soDate,
            ttAmount: h?.ttamount,
            fromDate: _firstDateofMonth(),
            toDate: _todayDate(),
            salesOrder: {
              value: h?.salesOrderId,
              label: h?.salesOrderCode,
            },
            soRef: h?.salesOrderRefererence,
            salesContractRef: h?.salesQuotationCode,
            erqValue: h?.erqvalue,
            orqValue: h?.orqvalue,

            conversionRate: h?.conversionRateBDT,
            ttAmountBDT: h?.ttAmountBDT,
            erqValueBDT: h?.erqvalueBDT,
            orqValueBDT: h?.orqvalueBDT,

            finalDestination: h?.finalDestination,
          };
          setSingleData(modifyData);
          setRowData(resData?.objRow);
        }
      );
    }
    if (!type) {
      getChannelList(
        `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
      );
      getRowData(`/oms/SalesOrder/GetExportExpenseTypeDDl`, (resData) => {
        const modifyData = resData?.map((item) => {
          return {
            expenseAutoId: item?.value,
            expenseName: item?.label,
            expenseAmountBdt: "",
          };
        });
        setRowData(modifyData);
      });
    }
    if (type === "approve") {
      getEmployeeInfo(
        `/partner/PartnerOverDue/GetUserInfoForExportPartnerPaymentApproval?userId=${userId}`
      );
    }
  }, [accId, buId, type]);

  const approver =
    !singleData?.isSupervisorApproved && employeeInfo?.departmentId === 219
      ? "supervisor"
      : !singleData?.isAccountsApproved && employeeInfo?.departmentId === 1
      ? "accounts"
      : "";

  const supervisor = approver === "supervisor";
  const accounts = approver === "accounts";

  const getSalesOrderList = (values) => {
    getSOList(
      `/oms/SalesOrder/GetExportSalesOrderForPreparePayment?businessUnitId=${buId}&soldToPartnerId=${values?.customer?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
  };

  const saveHandler = (values, cb) => {
    if (type === "edit") {
      const payloadForEdit = {
        objHead: {
          accountId: accId,
          businessUnitId: buId,
          paymentPrepareId: singleData?.paymentPrepareId,
          ttamount: values?.ttAmount,
          erqvalue: values?.erqValue,
          orqvalue: values?.orqValue,
          conversionRateBDT: values?.conversionRate,
          ttAmountBDT: values?.ttAmountBDT,
          erqvalueBDT: values?.erqValueBDT,
          orqvalueBDT: values?.orqValueBDT,
          remark: "",
          actionBy: userId,
        },
        objRow: rowData,
      };

      const payloadForApprove = {
        objHead: {
          accountId: accId,
          businessUnitId: buId,
          paymentPrepareId: singleData?.paymentPrepareId,
          ttamount: values?.ttAmount,
          erqvalue: values?.erqValue,
          orqvalue: values?.orqValue,
          conversionRateBDT: values?.conversionRate,
          ttAmountBDT: values?.ttAmountBDT,
          erqvalueBDT: values?.erqValueBDT,
          orqvalueBDT: values?.orqValueBDT,
          remark: "",
          actionBy: userId,

          isSupervisorApproved: supervisor
            ? true
            : values?.isSupervisorApproved,
          supervisorApprovedBy: supervisor
            ? userId
            : values?.supervisorApprovedBy,
          supervisorApprovedDateTime: supervisor
            ? new Date()
            : values?.supervisorApprovedDateTime,
          isAccountsApproved: accounts ? true : null,
          accountsApprovedBy: accounts ? userId : 0,
          accountsApprovedDateTime: accounts ? new Date() : "",
        },
        objRow: rowData,
      };

      const payload =
        type === "edit"
          ? payloadForEdit
          : type === "approve"
          ? payloadForApprove
          : {};

      editExportPaymentPosting(payload, setLoading, () => {
        getData(landingFormValues);
        setShow(false);
      });
    } else {
      const payload = {
        objHead: {
          accountId: accId,
          businessUnitId: buId,
          salesOrderId: values?.salesOrder?.value,
          salesOrderCode: values?.salesOrder?.salesOrderCode,
          customerId: values?.customer?.value,
          salesOrderRefererence: values?.salesOrderRef,
          ttamount: values?.ttAmount,
          erqvalue: values?.erqValue,
          orqvalue: values?.orqValue,
          remark: "",
          actionBy: userId,

          conversionRateBDT: values?.conversionRate,
          ttAmountBDT: values?.ttAmountBDT,
          erqvalueBDT: values?.erqValueBDT,
          orqvalueBDT: values?.orqValueBDT,
          attachment: uploadedImage[0]?.id,

          finalDestination: values?.country,
          salesContractRef: values?.salesContractRef,
        },
        objRow: rowData,
      };
      postData(
        `/partner/PartnerOverDue/PrepareExportPartnerPaymentInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    }
  };

  const loader =
    soLoader || loading || isLoading || rowLoader || singleDataLoader;

  return (
    <>
      {loader && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          buId={buId}
          accId={accId}
          soList={soList}
          viewType={type}
          rowData={rowData}
          setRowData={setRowData}
          saveHandler={saveHandler}
          channelList={channelList}
          setUploadedImage={setUploadedImage}
          getSalesOrderList={getSalesOrderList}
          initData={type ? singleData : initData}
        />
      </div>
    </>
  );
}
