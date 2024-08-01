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

const initData = {
  distributionChannel: "",
  salesOrg: "",
  customer: "",
  paymentType: { value: 1, label: "Re-Curring" },
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
};

export default function ServiceSalesCreateRecurring() {
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
  const [salesOrgList, getSalesOrgList, salesOrgListLoader] = useAxiosGet();
  const [channelDDL, getChannelDDL, channelDDLloader] = useAxiosGet();
  const [accountManagerList, getAccountManagerList] = useAxiosGet();
  const [
    agreementDatesForRecuuring,
    getAgreementDatesForRecuuring,
    loading,
    setAgreementDatesForRecuuring,
  ] = useAxiosGet();

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
    if (values?.paymentType?.label === "One Time" && +totalPercentage !== 100) {
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

    console.log("payload", payload);

    saveHandlerFunc(
      `oms/ServiceSales/createServiceSalesOrder`,
      payload,
      cb,
      true
    );
  };

  const getTotalPersecentage = (newValue, index) => {
    scheduleListFOneTime.reduce((acc, curr, currIndex) => {
      if (currIndex === index) {
        return acc + newValue;
      } else {
        return acc + curr.percentage;
      }
    }, 0);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setItemList([]);
          setSheduleList([]);
          setSheduleListFOneTime([]);
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
            channelDDLloader ||
            salesOrgListLoader ||
            loading ||
            customerListLoader ||
            itemDDLloader) && <Loading />}
          <IForm title="Create Re-Curring Sales Order" getProps={setObjprops}>
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
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentType"
                    isDisabled
                    options={[
                      { value: 1, label: "Re-Curring" },
                      //   { value: 2, label: "One Time" },
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
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.invoiceDay}
                        // disabled={agreementDatesForRecuuring}
                        label="Invoice Day"
                        name="invoiceDay"
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
                        disabled={!values?.scheduleType || !values?.invoiceDay}
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
                        disabled={!values?.agreementStartDate}
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
                        disabled={
                          !values.dteActualLiveDate || !values.intWarrantyMonth
                        }
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
                  {[2]?.includes(values?.paymentType?.value) ? (
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
                                    onChange={(e) => {
                                      let data = [...scheduleListFOneTime];
                                      data[index]["dueDate"] = e.target.value;
                                      setSheduleListFOneTime(data);
                                    }}
                                  />
                                </td>
                                <td>
                                  {console.log("itemList", itemList)}
                                  <InputField
                                    value={item?.percentage || ""}
                                    type="number"
                                    onChange={(e) => {
                                      const newValue = +e.target.value;
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
                                  <div className="d-flex justify-content-around">
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="cs-icon">{"Add"}</Tooltip>
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
                                                  return acc + curr.percentage;
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
