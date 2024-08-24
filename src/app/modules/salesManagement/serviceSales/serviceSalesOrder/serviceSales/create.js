import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { addMonthsToDate, calculateMonthDifference } from "./helper";
import Schedule from "./schedule";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { dateFormatterForInput } from "../../../../productionManagement/msilProduction/meltingProduction/helper";
import moment from "moment";

const initData = {
  distributionChannel: "",
  salesOrg: "",
  customer: "",
  paymentType: { value: 2, label: "One Time" },
  billToParty: "",
  scheduleType: "",
  invoiceDay: "",
  validFrom: "",
  validTo: "",
  agreementStartDate: "",
  agreementEndDate: "",
  item: "",
  qty: "",
  rate: "",
  vat: "",
  dteActualLiveDate: "",
  intWarrantyMonth: "",
  dteWarrantyEndDate: "",
  accountManager: "",
  numScheduleAmount: "",
  numServerAmount: "",
  status: "",
};

export default function ServiceSalesCreate({
  isEdit = false,
  isView = false,
  singleData,
  getData,
}) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [objProps, setObjprops] = useState({});
  const [attachmentList, setAttachmentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [customerList, getCustomerList, customerListLoader] = useAxiosGet();
  const [itemDDL, getItemDDL, itemDDLloader] = useAxiosGet();
  const [itemList, setItemList] = useState([]);
  const [scheduleList, setSheduleList] = useState([]);
  const [scheduleListFOneTime, setSheduleListFOneTime] = useState([]);
  const [netAmount, setNetAmount] = useState(0);
  const [actualAmount, setActualAmount] = useState(0);
  const [actualVatAmount, setActualVatAmount] = useState(0);
  const formikRef = React.useRef(null);
  const [, saveHandlerFunc, loader] = useAxiosPost();
  const [, updateSalesOrder, load] = useAxiosPost();
  const [salesOrgList, getSalesOrgList, salesOrgListLoader] = useAxiosGet();
  const [channelDDL, getChannelDDL, channelDDLloader] = useAxiosGet();
  const [accountManagerList, getAccountManagerList] = useAxiosGet();
  const [
    agreementDatesForRecuuring,
    getAgreementDatesForRecuuring,
    loading,
    setAgreementDatesForRecuuring,
  ] = useAxiosGet();
  const [rowData, getRowData, loader2] = useAxiosGet();

useEffect(()=>{
 if(isView){
  getRowData(`/oms/ServiceSales/GetServiceSaleOrderReport?BusinessUnitId=${
            selectedBusinessUnit?.value
          }&CustomerId=${singleData?.intCustomerId}&PaymentTypeId=${2}&FromDate=${"2021-01-01"}&ToDate=${_todayDate()}`)
 }
// eslint-disable-next-line react-hooks/exhaustive-deps
},[isView])

  useEffect(() => {
    if (itemList?.length) {
      // let amount = (itemList[0]?.qty || 0) * (itemList[0]?.rate || 0);
      const amount = itemList.reduce(
        (sum, item) => sum + (item?.qty || 0) * (item?.rate || 0),
        0
      );
      // let vat = itemList[0]?.vat || 0;
      const vat = itemList.reduce(
        (sum, item) => sum + (item?.vatAmount || 0),
        0
      );
      let netAmount = amount + (amount * vat) / 100;
      setActualAmount(amount);
      setActualVatAmount(vat);
      setNetAmount(netAmount);
    } else {
      setNetAmount(0);
    }
  }, [itemList]);

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
    getSalesOrgList(
      `/oms/BusinessUnitSalesOrganization/GetBUSalesOrgDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&SBUId=0`
    );

    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemDDL(
      `/oms/SalesOrder/GetgetServiceItemList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getAccountManagerList(
      `/domain/EmployeeBasicInformation/GetEmployeeDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    if (!values?.distributionChannel?.value)
      return toast.warn("Distribution Channel is required");
    if (itemList?.length < 0) return toast.warn("Add at least one Item");
    if (scheduleList?.length < 0) return toast.warn("Add Schedule");
    let totalPercentage = scheduleListFOneTime.reduce(
      (accumulator, currentValue) => accumulator + currentValue["percentage"],
      0
    );
    if (
      !isEdit &&
      values?.paymentType?.label === "One Time" &&
      +totalPercentage !== 100
    ) {
      return toast.warn("Total percentage should be 100");
    }

    let scheduleArray =
      values?.paymentType?.label === "Re-Curring"
        ? scheduleList
        : scheduleListFOneTime;
    let payload = {
      header: {
        intServiceSalesOrderId: 0,
        strServiceSalesOrderCode: "",
        intAccountId: profileData?.accountId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intDistributionChannelId: values?.distributionChannel?.value, // add new field
        strDistributionChannelName: values?.distributionChannel?.label, // add new field
        intSalesTypeId: values?.salesOrg?.value,
        strSalesTypeName: values?.salesOrg?.label,
        intCustomerId: values?.customer?.value || 0,
        strCustomerCode: values?.customer?.code || "",
        strCustomerName: values?.customer?.label,
        strCustomerAddress: values?.customer?.address,
        intPaymentTypeId: values?.paymentType?.value || 0,
        strPaymentType: values?.paymentType?.label || "",
        intScheduleTypeId:
          values?.paymentType?.value === 2
            ? 4
            : values?.scheduleType?.value || 0,
        strScheduleTypeName:
          values?.paymentType?.value === 2
            ? "One Time"
            : values?.scheduleType?.label || "",
        intScheduleDayCount: +values?.invoiceDay || 0,
        dteStartDateTime: values?.validFrom || values?.agreementStartDate,
        dteEndDateTime: values?.validTo || values?.agreementEndDate,
        strAttachmentLink: attachmentList[0]?.id || "",
        intActionBy: profileData?.userId,
        dteActualLiveDate: values?.dteActualLiveDate || null,
        intWarrantyMonth: values?.intWarrantyMonth || 0,
        dteWarrantyEndDate: values?.dteWarrantyEndDate || null,
        intAccountManagerEnroll: values?.accountManager?.value || 0,
        strAccountManagerName: values?.accountManager?.label || "",
        numScheduleAmount: +values?.numScheduleAmount || 0,
        numServerAmount: +values?.numServerAmount || 0,
        strStatus: values?.status?.value,
      },
      row: itemList?.map((item) => ({
        intServiceSalesOrderRowId: 0,
        intServiceSalesOrderId: 0,
        intItemId: item?.value,
        strItemName: item?.label,
        strUom: "",
        numSalesQty: +item?.qty || 0,
        numRate: +item?.rate || 0,
        numSalesAmount: (+item?.qty || 0) * (+item?.rate || 0),
        numSalesVatAmount: item?.vatAmount,
        numNetSalesAmount: +netAmount || 0,
        isActive: true,
      })),
      schedule: scheduleArray?.map((schedule) => ({
        intServiceSalesScheduleId: 0,
        intServiceSalesOrderId: 0,
        dteScheduleDateTime: _todayDate(),
        dteDueDateTime: schedule?.dueDate,
        intPaymentByPercent: +schedule?.percentage || 0,
        numScheduleVatAmount:
          +schedule?.scheduleListFOneTimeVat || +schedule?.vatAmount,
        numScheduleAmount: +schedule?.amount,
        strRemarks: schedule?.remarks || "",
        strStatus: "",
        isActive: true,
      })),
    };

    if (isEdit) {
      const header = {
        intServiceSalesOrderId: singleData?.intServiceSalesOrderId,
        strServiceSalesOrderCode: singleData?.strServiceSalesOrderCode,
        intAccountId: singleData?.intAccountId,
        intBusinessUnitId: singleData?.intBusinessUnitId,
        dteOrderDate:
          values?.agreementStartDate || singleData?.dteStartDateTime,
        intDistributionChannelId: values?.distributionChannel?.value,
        strDistributionChannelName: values?.distributionChannel?.label,
        intPaymentTypeId: values?.paymentType?.value || 0,
        strPaymentType: values?.paymentType?.label,
        intSalesTypeId: values?.salesOrg?.value,
        strSalesTypeName: values?.salesOrg?.label,
        intCustomerId: values?.customer?.value,
        strCustomerCode: values?.customer?.code || singleData?.strCustomerCode,
        strCustomerName: values?.customer?.label || singleData?.strCustomerName,
        strCustomerAddress:
          values?.customer?.address || singleData?.strCustomerAddress,
        intScheduleTypeId:
          values?.paymentType?.value === 2
            ? 4
            : values?.scheduleType?.value || 0,
        strScheduleTypeName:
          values?.paymentType?.value === 2
            ? "One Time"
            : values?.scheduleType?.label || "",
        intScheduleDayCount:
          +values?.invoiceDay || singleData?.intScheduleDayCount || 0,
        dteStartDateTime:
          values?.agreementStartDate || singleData?.dteStartDateTime,
        dteEndDateTime: values?.agreementEndDate || singleData?.dteEndDateTime,
        dteActualLiveDate:
          values?.dteActualLiveDate || singleData?.dteActualLiveDate,
        intWarrantyMonth:
          values?.intWarrantyMonth || singleData?.intWarrantyMonth,
        dteWarrantyEndDate:
          values?.dteWarrantyEndDate || singleData?.dteWarrantyEndDate || null,
        intAccountManagerEnroll:
          values?.accountManager?.value ||
          singleData?.intAccountManagerEnroll ||
          0,
        strAccountManagerName:
          values?.accountManager?.label ||
          singleData?.strAccountManagerName ||
          "",
        intOnetimeServiceSalesOrderId: 0,
        numTotalSalesAmount: 0,
        numScheduleAmount: +values?.numScheduleAmount || 0,
        numServerAmount: +values?.numServerAmount || 0,
        strAttachmentLink:
          attachmentList[0]?.id || singleData?.strAttachmentLink,
        isActive: true,
        intActionBy: profileData?.userId,
        strStatus: values?.status?.value || singleData?.strStatus,
      };
      // const row = itemList?.map((item) => ({
      //   intServiceSalesOrderRowId: item?.intServiceSalesOrderRowId,
      //   intServiceSalesOrderId: item?.intServiceSalesOrderId,
      //   intItemId: item?.value || item?.intItemId,
      //   strItemName: item?.label || item?.strItemName,
      //   strUom: item?.strUom || "",
      //   numSalesQty: +item?.qty || +item?.numSalesQty || 0,
      //   numRate: +item?.rate || +item?.numRate || 0,
      //   numSalesAmount:
      //     (+item?.qty || +item?.numSalesQty || 0) *
      //     (+item?.rate || +item?.numRate || 0),
      //   numSalesVatAmount: item?.vatAmount || +item?.numSalesVatAmount || 0,
      //   numNetSalesAmount: +netAmount || item?.numNetSalesAmount || 0,
      //   isActive: true,
      // }));
      // const schedule = scheduleArray?.map((schedule) => ({
      //   intServiceSalesScheduleId: schedule?.intServiceSalesScheduleId || 0,
      //   intServiceSalesOrderId: schedule?.intServiceSalesOrderId || 0,
      //   dteScheduleDateTime:
      //     schedule?.dteScheduleCreateDateTime || _todayDate(),
      //   dteDueDateTime: schedule?.dueDate || schedule?.dteDueDateTime,
      //   intPaymentByPercent:
      //     +schedule?.percentage || +schedule?.intPaymentByPercent0,
      //   numScheduleVatAmount:
      //     +schedule?.scheduleListFOneTimeVat ||
      //     +schedule?.vatAmount ||
      //     +schedule?.numScheduleVatAmount,
      //   numScheduleAmount: +schedule?.amount || schedule?.numScheduleAmount,
      //   strRemarks: schedule?.remarks || schedule?.strRemarks || "",
      //   isInvoiceComplete: schedule?.isInvoiceComplete,
      //   isActive: true,
      // }));
      updateSalesOrder(
        `/oms/ServiceSales/UpdateServiceSalesOrder`,
        {
          header: header,
          // row: row,
          // schedule: schedule,
        },
        cb,
        true
      );
    } else {
      saveHandlerFunc(
        `oms/ServiceSales/createServiceSalesOrder`,
        payload,
        cb,
        true
      );
    }
  };

  const getTotalPersecentage = (newValue, index) => {
    const totalPercentage = scheduleListFOneTime.reduce(
      (acc, curr, currIndex) => {
        if (currIndex === index) {
          return acc + (+newValue || 0);
        } else {
          return acc + (+curr.percentage || 0);
        }
      },
      0
    );

    return totalPercentage;
  };
  useEffect(() => {
    if (isEdit || isView) {
      const mappedItems = singleData?.items.map((item) => ({
        ...item,
        strItemCode: item.intItemId, // Assuming intItemId is used as Item Code
        label: item.strItemName,
        qty: item.numSalesQty,
        rate: item.numRate,
        amount: item.numSalesAmount,
        vat:
          item.numSalesVatAmount === 0
            ? 0
            : (item.numSalesVatAmount / item.numSalesAmount) * 100,
        vatAmount: item.numSalesVatAmount,
        netAmount: item.numNetSalesAmount,
      }));
      const transformedSchedules = singleData.schedules.map((schedule) => ({
        ...schedule,
        dueDate: moment(schedule.dteDueDateTime).format("YYYY-MM-DD"), // Convert to 'YYYY-MM-DD' format
        percentage: schedule.intPaymentByPercent,
        amount: schedule.numScheduleAmount,
        scheduleListFOneTimeVat: schedule.numScheduleVatAmount,
        vat:
          schedule.numScheduleVatAmount === 0
            ? 0
            : (schedule.numScheduleVatAmount / schedule.numScheduleAmount) *
              100,
        vatAmount: schedule?.numScheduleVatAmount,
        remarks: schedule.strRemarks || "",
        isInvoiceComplete: schedule.isInvoiceComplete,
      }));

      setSheduleListFOneTime(transformedSchedules);
      setSheduleList(transformedSchedules);
      setItemList(mappedItems);
    }
  }, [isEdit, isView, singleData]);

    // Calculate totals for Report Type 1
    const totals = rowData?.reduce(
      (acc, item) => {
        acc.totalScheduleCount += item?.totalScheduleCount || 0;
        acc.totalScheduleAmount += item?.totalScheduleAmount || 0;
        acc.totalInvoiceCount += item?.totalInvoiceCount || 0;
        acc.totalInvoiceAmount += item?.totalInvoiceAmount || 0;
        acc.totalCollectionAmount += item?.totalCollectionAmount || 0;
        acc.totalPendingAmount += item?.totalPendingAmount || 0;
        return acc;
      },
      {
        totalScheduleCount: 0,
        totalScheduleAmount: 0,
        totalInvoiceCount: 0,
        totalInvoiceAmount: 0,
        totalCollectionAmount: 0,
        totalPendingAmount: 0,
      }
    );

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        isEdit || isView
          ? {
              ...initData,
              paymentType: {
                value: singleData?.strPaymentType === "One Time" ? 2 : 1,
                label: singleData?.strPaymentType,
              },
              scheduleType:
                singleData?.strScheduleTypeName === "Monthly"
                  ? { value: 1, label: "Monthly", range: 1 }
                  : singleData?.strScheduleTypeName === "Quarterly"
                  ? { value: 2, label: "Quarterly", range: 3 }
                  : singleData?.strScheduleTypeName === "Yearly"
                  ? { value: 3, label: "Yearly", range: 12 }
                  : { value: 1, label: "Monthly", range: 1 },
              salesOrg: {
                value: singleData?.intSalesTypeId,
                label: singleData?.strSalesTypeName,
              },
              distributionChannel: {
                value: singleData?.intDistributionChannelId,
                label: singleData?.strDistributionChannelName,
              },
              accountManager: {
                value: singleData?.intAccountManagerEnroll,
                label: singleData?.strAccountManagerName,
              },
              billToParty: singleData?.strCustomerName,
              numScheduleAmount: singleData?.numScheduleAmount,
              numServerAmount: singleData?.numServerAmount,

              customer: {
                value: singleData?.intCustomerId,
                label: singleData?.strCustomerName,
              },
              item: {
                value: singleData?.intItemId || "",
                label: singleData?.strItemName || "",
              },
              agreementStartDate: moment(singleData?.dteStartDateTime).format(
                "YYYY-MM-DD"
              ),
              agreementEndDate: moment(singleData?.dteEndDateTime).format(
                "YYYY-MM-DD"
              ),
              validFrom: moment(singleData?.dteStartDateTime).format(
                "YYYY-MM-DD"
              ),
              validTo: moment(singleData?.dteEndDateTime).format("YYYY-MM-DD"),
              intWarrantyMonth: singleData?.intWarrantyMonth,
              dteWarrantyEndDate: dateFormatterForInput(
                singleData?.dteWarrantyEndDate || ""
              ),
              dteActualLiveDate: dateFormatterForInput(
                singleData?.dteActualLiveDate || ""
              ),
              status: singleData?.strStatus
                ? { value: singleData?.strStatus, label: singleData?.strStatus }
                : "",
            }
          : {
              ...initData,
              status:
                !isEdit && !isView
                  ? { value: "Running", label: "Running" }
                  : "",
            }
      }
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setItemList([]);
          setSheduleList([]);
          setSheduleListFOneTime([]);
          getData && getData();
        });
      }}
      innerRef={formikRef}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loader ||
            loader2 ||
            channelDDLloader ||
            salesOrgListLoader ||
            loading ||
            customerListLoader ||
            load ||
            itemDDLloader) && <Loading />}
          <IForm
            title={`${
              isEdit ? "Edit" : isView ? "View" : "Create"
            } Service Sales Order`}
            isHiddenBack={isView}
            isHiddenReset={isView}
            isHiddenSave={isView}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={channelDDL || []}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("distributionChannel", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || isView}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOrg"
                    options={salesOrgList || []}
                    value={values?.salesOrg}
                    label="Sales Org"
                    onChange={(valueOption) => {
                      setFieldValue("salesOrg", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={isEdit || isView}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentType"
                    isDisabled
                    options={[
                      // { value: 1, label: "Re-Curring" },
                      { value: 2, label: "One Time" },
                    ]}
                    value={values?.paymentType}
                    label="Payment Type"
                    onChange={(valueOption) => {
                      setFieldValue("paymentType", valueOption);
                      setFieldValue("scheduleType", "");
                      setFieldValue("invoiceDay", "");
                      setFieldValue("validFrom", "");
                      setFieldValue("validTo", "");
                      setFieldValue("dteActualLiveDate", "");
                      setFieldValue("intWarrantyMonth", "");
                      setFieldValue("dteWarrantyEndDate", "");
                      setFieldValue("accountManager", "");
                      setItemList([]);
                      setSheduleList([]);
                      setSheduleListFOneTime([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="customer"
                    isDisabled={isEdit || isView}
                    options={customerList || []}
                    value={values?.customer}
                    label="Customer"
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                      setFieldValue("billToParty", valueOption?.label || "");
                      setFieldValue("item", "");
                      setAgreementDatesForRecuuring(null);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={itemDDL || []}
                    value={values?.item}
                    label="Item Name"
                    isDisabled={isEdit || isView}
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                      setAgreementDatesForRecuuring(null);
                      if (
                        valueOption &&
                        [1].includes(values?.paymentType?.value)
                      ) {
                        getAgreementDatesForRecuuring(
                          `/oms/ServiceSales/RecurringSalseInfo?intCustomerId=${values?.customer?.value}&intItemId=${valueOption?.value}`,
                          (res) => {
                            setFieldValue(
                              "validFrom",
                              _dateFormatter(res?.dteStartDateTime) || ""
                            );
                            setFieldValue(
                              "validTo",
                              _dateFormatter(res?.dteEndDateTime) || ""
                            );
                          }
                        );
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    disabled={isEdit || isView}
                    value={values?.billToParty}
                    label="Bill To Party"
                    name="billToParty"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("billToParty", e.target.value);
                    }}
                  />
                </div>

                {[1]?.includes(values?.paymentType?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="scheduleType"
                        options={[
                          { value: 1, label: "Monthly", range: 1 },
                          { value: 2, label: "Quarterly", range: 3 },
                          { value: 3, label: "Yearly", range: 12 },
                        ]}
                        value={values?.scheduleType}
                        label="Schedule Type"
                        onChange={(valueOption) => {
                          setFieldValue("scheduleType", valueOption);
                          if (!agreementDatesForRecuuring) {
                            setFieldValue("validTo", "");
                          }
                          setItemList([]);
                          setSheduleList([]);
                          setSheduleListFOneTime([]);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={isView}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.invoiceDay}
                        // disabled={agreementDatesForRecuuring}
                        label="Invoice Day"
                        name="invoiceDay"
                        disabled={isView}
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0 || +e.target.value > 31) {
                            return toast.warn("Invoice Day should be 1 to 31");
                          }
                          setFieldValue("invoiceDay", e.target.value);
                          setFieldValue("validFrom", "");
                          setFieldValue("validTo", "");
                          setSheduleList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.validFrom}
                        // disabled={
                        //   !values?.scheduleType ||
                        //   !values?.invoiceDay ||
                        //   agreementDatesForRecuuring
                        // }
                        disabled={
                          !values?.scheduleType || !values?.invoiceDay || isView
                        }
                        label="Agreement Valid From"
                        name="validFrom"
                        type="date"
                        onChange={(e) => {
                          if (
                            +e.target.value?.split("-")[2] !==
                            +values?.invoiceDay
                          ) {
                            return toast.warn(
                              `Selected Date should be ${values?.invoiceDay} `
                            );
                          }

                          setFieldValue("validFrom", e.target.value);
                          setFieldValue("validTo", "");
                          setSheduleList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.validTo}
                        // disabled={agreementDatesForRecuuring}
                        disabled={isView}
                        label="Agreement Valid To"
                        name="validTo"
                        type="date"
                        min={addMonthsToDate(
                          values?.validFrom || _todayDate(),
                          values?.scheduleType?.range || 1
                        )}
                        onChange={(e) => {
                          if (
                            +e.target.value?.split("-")[2] !==
                            +values?.invoiceDay
                          ) {
                            return toast.warn(
                              `Selected Date should be ${values?.invoiceDay} `
                            );
                          }
                          setFieldValue("validTo", e.target.value);
                          setSheduleList([]);
                        }}
                      />
                    </div>
                  </>
                ) : null}

                {[2]?.includes(values?.paymentType?.value) ? (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        disabled={isView}
                        value={values?.agreementStartDate}
                        label="Agreement Start Date"
                        name="agreementStartDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("agreementStartDate", e.target.value);
                          setFieldValue("agreementEndDate", "");
                          setSheduleList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.agreementEndDate}
                        disabled={!values?.agreementStartDate || isView}
                        label="Agreement End Date"
                        name="agreementEndDate"
                        type="date"
                        onChange={(e) => {
                          if (
                            +e.target.value?.split("-")[2] !==
                            +values?.agreementStartDate?.split("-")[2]
                          ) {
                            return toast.warn(
                              `Selected Date should be ${+values?.agreementStartDate?.split(
                                "-"
                              )[2]} `
                            );
                          }
                          setFieldValue("agreementEndDate", e.target.value);
                          setSheduleList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        disabled={isView}
                        value={values.dteActualLiveDate}
                        label="Projected Live Date"
                        name="dteActualLiveDate"
                        type="date"
                        onChange={(e) => {
                          const date = e.target.value;
                          setFieldValue("dteActualLiveDate", date);
                          if (date && values.intWarrantyMonth) {
                            const warrantyEndDate = addMonthsToDate(
                              date,
                              values.intWarrantyMonth
                            );
                            setFieldValue(
                              "dteWarrantyEndDate",
                              warrantyEndDate
                            );
                          } else {
                            setFieldValue("dteWarrantyEndDate", ""); // Clear warranty end date if live date or warranty month is absent
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        disabled={isView}
                        value={values.intWarrantyMonth}
                        label="Warranty Month"
                        name="intWarrantyMonth"
                        type="number"
                        onChange={(e) => {
                          const warrantyMonth = parseInt(e.target.value, 10); // Ensure numeric value
                          if (isNaN(warrantyMonth) || warrantyMonth < 0) {
                            // Handle invalid input (e.g., toast notification)
                            setFieldValue("intWarrantyMonth", "");
                            setFieldValue("dteWarrantyEndDate", "");
                            return;
                          }
                          setFieldValue("intWarrantyMonth", warrantyMonth);
                          if (values.dteActualLiveDate) {
                            const warrantyEndDate = addMonthsToDate(
                              values.dteActualLiveDate,
                              warrantyMonth
                            );
                            setFieldValue(
                              "dteWarrantyEndDate",
                              warrantyEndDate
                            );
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        // disabled={
                        //   !values.dteActualLiveDate || !values.intWarrantyMonth
                        // }
                        disabled={isView}
                        value={values.dteWarrantyEndDate}
                        label="Warranty End Date"
                        name="dteWarrantyEndDate"
                        type="date" // Assuming InputField supports date type
                        onChange={(e) =>
                          setFieldValue("dteWarrantyEndDate", e.target.value)
                        }
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        isDisabled={isEdit || isView}
                        name="accountManager"
                        options={accountManagerList || []}
                        value={values?.accountManager}
                        label="Account Manager"
                        onChange={(valueOption) => {
                          setFieldValue("accountManager", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        disabled={isView}
                        value={values?.numScheduleAmount}
                        label="Schedule Amount"
                        name="numScheduleAmount"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("numScheduleAmount", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        disabled={isView}
                        value={values?.numServerAmount}
                        label="Server Amount"
                        name="numServerAmount"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("numServerAmount", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="status"
                        options={[
                          { value: "Closed", label: "Closed" },
                          { value: "Discontinued", label: "Discontinued" },
                          { value: "Locked", label: "Locked" },
                          { value: "Running", label: "Running" },
                        ]}
                        isDisabled={!isEdit}
                        value={values?.status}
                        label="Status"
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                          setItemList([]);
                          setSheduleList([]);
                          setSheduleListFOneTime([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                ) : null}

                <div className="col-lg-2 mt-5">
                  <AttachmentUploaderNew
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachmentList(attachmentData);
                      }
                    }}
                  />
                </div>
              </div>

              <div className="form-group  global-form row mt-5">
                <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    isDisabled
                    options={itemDDL || []}
                    value={values?.item}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-2">
                  <InputField
                    value={values?.qty}
                    label="Qty"
                    disabled={isEdit || isView}
                    name="qty"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("qty", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.rate}
                    label="Rate"
                    name="rate"
                    disabled={isEdit || isView}
                    type="number"
                    onChange={(e) => {
                      setFieldValue("rate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.vat}
                    label="Vat %"
                    disabled={isEdit || isView}
                    name="vat"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("vat", e.target.value);
                    }}
                  />
                </div>
                <div className="d-flex">
                  {[1]?.includes(values?.paymentType?.value) ? (
                    <div style={{ marginTop: "18px" }} className="ml-4">
                      <button
                        disabled={
                          !values?.paymentType?.value ||
                          !values?.validFrom ||
                          !values?.validTo ||
                          (!agreementDatesForRecuuring &&
                            !values?.invoiceDay) ||
                          !values?.item?.value ||
                          !values?.qty ||
                          !values?.rate ||
                          !values?.vat ||
                          itemList?.length
                        }
                        onClick={() => {
                          setSheduleList([]);
                          let isExist = itemList?.some(
                            (item) => item.label === values?.item?.label
                          );
                          if (isExist) return toast.warn("Already exist");
                          setItemList((prev) => [
                            ...prev,
                            {
                              ...values?.item,
                              qty: +values?.qty || 0,
                              rate: +values?.rate || 0,
                              vat: +values?.vat || 0,
                              amount:
                                (+values?.qty || 0) * (+values?.rate || 0),
                              netAmount:
                                (() => {
                                  let amount =
                                    (+values?.qty || 0) * (+values?.rate || 0);
                                  let vat = +values?.vat || 0;
                                  return amount + (amount * vat) / 100;
                                })() || 0,

                              vatAmount:
                                (() => {
                                  let amount =
                                    (+values?.qty || 0) * (+values?.rate || 0);
                                  let vat = +values?.vat || 0;
                                  return (amount * vat) / 100;
                                })() || 0,
                            },
                          ]);

                          if (
                            values?.scheduleType?.range &&
                            values?.validTo &&
                            values?.validFrom
                          ) {
                            const list = [];
                            const n =
                              +calculateMonthDifference(
                                values?.validFrom,
                                values?.validTo
                              ) / +values?.scheduleType?.range;
                            for (let i = 0; i < n; i++) {
                              list.push({
                                dueDate: addMonthsToDate(
                                  values?.validFrom,
                                  i === 0 ? 0 : i * values?.scheduleType?.range
                                ),
                                percentage: 0,
                                amountWithoutVat:
                                  (+values?.qty || 0) * (+values?.rate || 0),
                                vat: +values?.vat || 0,
                                amount:
                                  (() => {
                                    let amount =
                                      (+values?.qty || 0) *
                                      (+values?.rate || 0);
                                    let vat = +values?.vat || 0;
                                    // return amount + (amount * vat) / 100;
                                    return amount;
                                  })() || 0,

                                vatAmount:
                                  (() => {
                                    let amount =
                                      (+values?.qty || 0) *
                                      (+values?.rate || 0);
                                    let vat = +values?.vat || 0;
                                    return (amount * vat) / 100;
                                  })() || 0,
                              });
                            }
                            setSheduleList(list);
                          } else {
                            setSheduleList([]);
                          }
                        }}
                        type="button"
                        className="btn btn-primary"
                      >
                        Create Schedule
                      </button>
                    </div>
                  ) : null}
                  {[2]?.includes(values?.paymentType?.value) &&
                  !isEdit &&
                  !isView ? (
                    <>
                      <div style={{ marginTop: "18px" }} className="ml-4">
                        <button
                          disabled={
                            !values?.item?.value ||
                            !values?.qty ||
                            !values?.rate ||
                            !values?.vat
                          }
                          onClick={() => {
                            setSheduleList([]);
                            let isExist = itemList?.some(
                              (item) => item.label === values?.item?.label
                            );
                            if (isExist) return toast.warn("Already exist");
                            setItemList((prev) => [
                              ...prev,
                              {
                                ...values?.item,
                                qty: +values?.qty || 0,
                                rate: +values?.rate || 0,
                                vat: +values?.vat || 0,
                                amount:
                                  (+values?.qty || 0) * (+values?.rate || 0),
                                netAmount:
                                  (() => {
                                    let amount =
                                      (+values?.qty || 0) *
                                      (+values?.rate || 0);
                                    let vat = +values?.vat || 0;
                                    return amount + (amount * vat) / 100;
                                  })() || 0,

                                vatAmount:
                                  (() => {
                                    let amount =
                                      (+values?.qty || 0) *
                                      (+values?.rate || 0);
                                    let vat = +values?.vat || 0;
                                    return (amount * vat) / 100;
                                  })() || 0,
                              },
                            ]);
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          ADD
                        </button>
                      </div>
                      <div style={{ marginTop: "18px" }} className="ml-4">
                        <button
                          disabled={!itemList?.length}
                          onClick={() => {
                            setSheduleListFOneTime([
                              {
                                dueDate: _todayDate(),
                                percentage: 0,
                                amount: 0,
                                remarks: "",
                                // calculate vat on itemList[0]?.vatAmount and percentage
                                scheduleListFOneTimeVat: 0,
                              },
                            ]);
                          }}
                          type="button"
                          className="btn btn-primary"
                        >
                          Create Schedule
                        </button>
                      </div>
                    </>
                  ) : null}
                </div>
              </div>

              {itemList?.length > 0 && (
                <div className="mt-5">
                  <div>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Item Code</th>
                            <th>Item Name</th>
                            <th>Qty</th>
                            <th>Rate</th>
                            <th>Amount</th>
                            <th>Vat %</th>
                            <th>Vat Amount</th>
                            <th>Net Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemList?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.strItemCode}</td>
                              <td>{item?.label}</td>
                              <td className="text-center">{item?.qty}</td>
                              <td className="text-center">{item?.rate}</td>
                              <td className="text-right">{item?.amount}</td>
                              <td className="text-center">{item?.vat}</td>
                              <td className="text-center">{item?.vatAmount}</td>
                              <td className="text-right">{item?.netAmount}</td>
                              <td className="text-center">
                                {!isView && !isEdit && (
                                  <IDelete
                                    style={{ fontSize: "16px" }}
                                    remover={(index) => {
                                      let data = itemList.filter(
                                        (item, i) => i !== index
                                      );
                                      setItemList(data);
                                      setSheduleList([]);
                                      setSheduleListFOneTime([]);
                                    }}
                                    id={index}
                                  />
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {[1]?.includes(values?.paymentType?.value) ? (
                <div className="mt-5">
                  <div>
                    {scheduleList?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Due Date</th>
                              <th>Vat %</th>
                              <th>Vat Amount</th>
                              <th>Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleList?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <InputField
                                    value={item?.dueDate}
                                    type="date"
                                    disabled
                                    onChange={(e) => {
                                      let data = [...scheduleList];
                                      data[index]["dueDate"] = e.target.value;
                                      setFieldValue("validTo", e.target.value);
                                      setSheduleList(data);
                                    }}
                                  />
                                </td>
                                <td className="text-right">{item?.vat}</td>
                                <td className="text-right">
                                  {item?.vatAmount}
                                </td>
                                <td className="text-right">{item?.amount}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {[2]?.includes(values?.paymentType?.value) ? (
                <div className="mt-5">
                  <div>
                    {scheduleListFOneTime?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Due Date</th>
                              <th>Percentage</th>
                              <th>Amount</th>
                              <th>Actual Vat Amount</th>
                              <th>Remarks</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {scheduleListFOneTime?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>
                                  <InputField
                                    value={item?.dueDate}
                                    type="date"
                                    disabled={isEdit || isView}
                                    onChange={(e) => {
                                      let data = [...scheduleListFOneTime];
                                      data[index]["dueDate"] = e.target.value;
                                      setSheduleListFOneTime(data);
                                    }}
                                  />
                                </td>
                                <td>
                                  <InputField
                                    value={item?.percentage || ""}
                                    type="number"
                                    disabled={isEdit || isView}
                                    onChange={(e) => {
                                      const newValue = +e.target.value;
                                      if (newValue < 0) {
                                        return;
                                      }
                                      let totalPercentage = getTotalPersecentage(
                                        newValue,
                                        index
                                      );
                                      if (totalPercentage > 100) {
                                        return toast.warn(
                                          "Total percentage should be 100"
                                        );
                                      }
                                      let updatedScheduleList = [
                                        ...scheduleListFOneTime,
                                      ];
                                      updatedScheduleList[
                                        index
                                      ].percentage = newValue;
                                      updatedScheduleList[index].amount =
                                        ((newValue || 0) / 100) *
                                        (actualAmount || 0);

                                      updatedScheduleList[
                                        index
                                      ].scheduleListFOneTimeVat =
                                        actualVatAmount * (newValue / 100) || 0;

                                      setSheduleListFOneTime(
                                        updatedScheduleList
                                      );
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  {((item?.percentage || 0) / 100) *
                                    (actualAmount || 0)}
                                </td>
                                <td className="text-center">
                                  {item?.scheduleListFOneTimeVat}
                                </td>
                                <td>
                                  <InputField
                                    value={item?.remarks}
                                    disabled={isEdit || isView}
                                    type="text"
                                    onChange={(e) => {
                                      let updatedScheduleList = [
                                        ...scheduleListFOneTime,
                                      ];
                                      updatedScheduleList[index].remarks =
                                        e.target.value;

                                      setSheduleListFOneTime(
                                        updatedScheduleList
                                      );
                                    }}
                                  />
                                </td>
                                <td>
                                  {!isView && !isEdit && (
                                    <div className="d-flex justify-content-around">
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            {"Add"}
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          <i
                                            style={{
                                              fontSize: "16px",
                                              cursor: "pointer",
                                            }}
                                            className="fa fa-plus-square"
                                            onClick={() => {
                                              const newValue =
                                                scheduleListFOneTime[index][
                                                  "percentage"
                                                ];

                                              if (!newValue) {
                                                return toast.warn(
                                                  "Please add percentage"
                                                );
                                              }

                                              let totalPercentage = scheduleListFOneTime.reduce(
                                                (acc, curr, currIndex) => {
                                                  if (currIndex === index) {
                                                    return acc + newValue;
                                                  } else {
                                                    return (
                                                      acc + curr.percentage
                                                    );
                                                  }
                                                },
                                                0
                                              );

                                              if (totalPercentage >= 100) {
                                                return toast.warn(
                                                  "Total percentage already 100"
                                                );
                                              }

                                              let updatedScheduleList = [
                                                ...scheduleListFOneTime,
                                              ];

                                              setSheduleListFOneTime([
                                                ...updatedScheduleList,
                                                {
                                                  dueDate: _todayDate(),
                                                  percentage: 0,
                                                  amount: 0,
                                                  remarks: "",
                                                },
                                              ]);
                                            }}
                                          ></i>
                                        </span>
                                      </OverlayTrigger>

                                      <IDelete
                                        style={{ fontSize: "16px" }}
                                        id={index}
                                        remover={(index) => {
                                          let updatedScheduleList = scheduleListFOneTime?.filter(
                                            (schedule, i) => i !== index
                                          );
                                          setSheduleListFOneTime(
                                            updatedScheduleList
                                          );
                                        }}
                                      />
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              ) : null}

              {isView && [2]?.includes(values?.paymentType?.value) && (
                <div className="table-responsive">
                  <table
                      className="table table-striped mt-2 table-bordered bj-table bj-table-landing"
                    >
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Order Code</th>
                          <th>Payment Type</th>
                          {/* <th>Customer Name</th>
                          <th>Customer Code</th> */}
                          {/* <th>Agreement Date</th>
                          <th>Actual Live Date</th>
                          <th>Warranty Month</th>
                          <th>Schedule Count</th> */}
                          <th>Schedule Amount</th>
                          {/* <th>Invoice Count</th> */}
                          <th>Invoice Amount</th>
                          <th>Collection Amount</th>
                          <th>Pending Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.strServiceSalesOrderCode}
                            </td>
                            <td>{item?.strPaymentType}</td>
                            {/* <td>{item?.strCustomerName}</td>
                            <td>{item?.strCustomerCode}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.agreementDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteActualLiveDate)}
                            </td>
                            <td className="text-center">
                              {item?.intWarrantyMonth}
                            </td>
                            <td className="text-right">
                              {item?.totalScheduleCount || 0}
                            </td> */}
                            <td className="text-right">
                              {item?.totalScheduleAmount || 0}
                            </td>
                            {/* <td className="text-right">
                              {item?.totalInvoiceCount || 0}
                            </td> */}
                            <td className="text-right">
                              {item?.totalInvoiceAmount || 0}
                            </td>
                            <td className="text-right">
                              {item?.totalCollectionAmount || 0}
                            </td>
                            <td className="text-right">
                              {item?.totalPendingAmount || 0}
                            </td>
                          </tr>
                        ))}
                        <tr>
                          <td colSpan="3" className="text-center">
                            <strong>Total</strong>
                          </td>
                          {/* <td className="text-right">
                            {Math.round(totals.totalScheduleCount)}
                          </td> */}
                          <td className="text-right">
                            {Math.round(totals.totalScheduleAmount)}
                          </td>
                          {/* <td className="text-right">
                            {Math.round(totals.totalInvoiceCount)}
                          </td> */}
                          <td className="text-right">
                            {Math.round(totals.totalInvoiceAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalCollectionAmount)}
                          </td>
                          <td className="text-right">
                            {Math.round(totals.totalPendingAmount)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                </div>
              )}

              <IViewModal show={isOpen} onHide={() => setIsOpen(false)}>
                <Schedule />
              </IViewModal>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
