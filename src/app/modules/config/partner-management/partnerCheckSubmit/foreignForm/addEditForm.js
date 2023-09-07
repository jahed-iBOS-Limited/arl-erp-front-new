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
  ttAmount: "",
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  salesOrder: "",
  soRef: "",
  salesContractRef: "",
  erqValue: "",
  orqValue: "",
};

export default function ExportPaymentPostingForm({ type, singleItem }) {
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
            soDate: "",
            ttAmount: h?.ttamount,
            fromDate: _firstDateofMonth(),
            toDate: _todayDate(),
            salesOrder: {
              value: h?.salesOrderId,
              label: h?.salesOrderCode,
            },
            soRef: h?.salesOrderRefererence,
            salesContractRef: "",
            erqValue: h?.erqvalue,
            orqValue: h?.orqvalue,
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
  }, [accId, buId, type]);

  const getSalesOrderList = (values) => {
    getSOList(
      `/oms/SalesOrder/GetExportSalesOrderForPreparePayment?businessUnitId=${buId}&soldToPartnerId=${values?.customer?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
    );
  };

  const saveHandler = (values, cb) => {
    if (type === "edit") {
      const payload = {
        objHead: {
          accountId: accId,
          businessUnitId: buId,
          paymentPrepareId: singleData?.paymentPrepareId,
          ttamount: values?.ttAmount,
          erqvalue: values?.erqValue,
          orqvalue: values?.orqValue,
        },
        objRow: rowData,
      };
      editExportPaymentPosting(payload, setLoading, () => {});
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
          getSalesOrderList={getSalesOrderList}
          initData={type ? singleData : initData}
        />
      </div>
    </>
  );
}
