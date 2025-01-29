/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import Loading from "../../../../../_helper/_loading";
import { _todayDate } from "../../../../../_helper/_todayDate";
import { editPartnerCheque } from "../../helper";
import Form from "./form";

const initData = {
  billNo: "",
  channel: "",
  partner: "",
  billAmount: "",
  billSubmitDate: _todayDate(),
  chequeDate: _todayDate(),
  chequeNo: "",
  chequeAmount: "",
  deductedAit: "",
  receivedAit: "",
  aitChallanNo: "",
  aitDate: _todayDate(),
  comments: "",
};

export default function PartnerCheckSubmitForCement() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { type, id } = useParams();
  const { state } = useLocation();
  const [rowData, setRowData] = useState([]);
  const [, postData, loading] = useAxiosPost();
  const [invoiceInfo, getData] = useAxiosGet();
  const [initialValues, setInitialValues] = useState(initData);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (id) {
      getData(
        `/partner/PartnerOverDue/GetPartnerChequeDataForACCLByID?ConfigID=${id}`,
        (resData) => {
          const s = resData;
          setInitialValues({
            billNo: s?.refference,
            partner: { value: s?.partnerId, label: s?.partnerName },
            billAmount: s?.totalAmount,
            billSubmitDate: _dateFormatter(s?.submitDate),
            chequeDate: _dateFormatter(s?.chequeDate),
            chequeNo: s?.chequeNumber,
            chequeAmount: s?.mrrAmount,
            deductedAit: s?.deductedAit,
            receivedAit: s?.receivedAit,
            aitChallanNo: s?.aitchallanNo,
            aitDate: _dateFormatter(s?.aitdate),
            comments: s?.comments,
          });
        }
      );
    } else {
      getData(
        `/oms/OManagementReport/GetSalesInvoiceByBillNo?SalesInvoiceId=${state?.salesInvoiceId}`,
        (resData) => {
          setInitialValues({
            ...initialValues,
            partner: {
              value: resData?.customerId,
              label: resData?.customerName,
            },
            billAmount: resData?.totalAmount,
            billSubmitDate: _dateFormatter(resData?.invoiceDate),
            billNo: state?.refference,
          });
        }
      );
    }
  }, []);

  const addRow = (values, callBack) => {
    const isExist = rowData?.find(
      (item) => item?.chequeNo === values?.chequeNo
    );
    if (isExist) {
      return toast.warn("Duplicate cheque no not allowed!");
    }
    try {
      const newRow = {
        accountId: accId,
        actionBy: userId,
        businessPartnerId: values?.partner?.value,
        businessPartnerName: values?.partner?.label,
        businessUnitId: buId,
        chequeDate: values?.chequeDate,
        chequeNo: values?.chequeNo,
        comments: values?.comments,
        mrramount: +values?.chequeAmount,
        submitDate: values?.billSubmitDate,
        deductedAit: +values?.deductedAit,
        receivedAit: +values?.receivedAit,
        aitchallanNo: values?.aitChallanNo,
        aitdate: values?.aitDate,
        billAmount: +values?.billAmount,
        invoiceId: invoiceInfo?.salesInvoiceId,
        deliveryId: invoiceInfo?.deliveryId,
        deliveryCode: invoiceInfo?.deliveryCode,
      };
      setRowData([...rowData, newRow]);
      callBack();
    } catch (e) {
      console.log(e);
    }
  };

  const deleteRow = (index) => {
    const newRow = [...rowData];
    newRow.splice(index, 1);
    setRowData(newRow);
  };

  const saveHandler = (values, cb) => {
    if (id) {
      const payload = {
        configId: id,
        chequeDate: values?.chequeDate,
        submitDate: values?.billSubmitDate,
        comments: values?.comments,
        chequeNo: values?.chequeNo,
        mrramount: values?.chequeAmount,
        deductedAit: values?.deductedAit,
        receivedAit: values?.receivedAit,
        aitdate: values?.aitDate,
        aitchallanNo: values?.aitChallanNo,
      };
      editPartnerCheque(payload, setIsLoading);
    } else {
      postData(
        `/partner/PartnerOverDue/CreateBusinessPartnerCheckForMRR`,
        rowData,
        () => {
          cb();
        },
        true
      );
    }
  };

  const title = `${id ? "Edit" : "Enter"} Partner Cheque${id ? "" : "s"}`;

  return (
    <>
      {(isLoading || loading) && <Loading />}
      <div className="mt-0">
        <Form
          title={title}
          accId={accId}
          viewType={type}
          addRow={addRow}
          getData={getData}
          rowData={rowData}
          deleteRow={deleteRow}
          setRowData={setRowData}
          initData={initialValues}
          saveHandler={saveHandler}
        />
      </div>
    </>
  );
}
