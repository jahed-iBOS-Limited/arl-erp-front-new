import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import IViewModal from "../../../../_helper/_viewModal";
import Schedule from "./schedule";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addMonthsToDate, calculateMonthDifference } from "./helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { _todayDate } from "../../../../_helper/_todayDate";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IForm from "../../../../_helper/_form";
import InputField from "../../../../_helper/_inputField";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { update } from "lodash";

const initData = {
  salesOrg: "",
  customer: "",
  paymentType: "",
  billToParty: "",
  scheduleType: "",
  invoiceDay: "",
  validFrom: "",
  validTo: "",
  item: "",
  qty: "",
  rate: "",
  vat: "",
};

// const validationSchema = Yup.object().shape({
//   item: Yup.object()
//     .shape({
//       label: Yup.string().required("Item is required"),
//       value: Yup.string().required("Item is required"),
//     })
//     .typeError("Item is required"),

//   remarks: Yup.string().required("Remarks is required"),
//   amount: Yup.number().required("Amount is required"),
//   date: Yup.date().required("Date is required"),
// });

export default function ServiceSalesCreate() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const [attachmentList, setAttachmentList] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [customerList, getCustomerList] = useAxiosGet();
  const [itemDDL, getItemDDL] = useAxiosGet();
  const [itemList, setItemList] = useState([]);
  const [validFromData, setValidFromData] = useState("");
  const [validToData, setValidToData] = useState("");
  const [scheduleList, setSheduleList] = useState([]);
  const [scheduleListFOneTime, setSheduleListFOneTime] = useState([]);
  const [netAmount, setNetAmount] = useState(0);
  const formikRef = React.useRef(null);
  const [, saveHandlerFunc, loader] = useAxiosPost();
  const [scheduleMonthRange, setScheduleMonthRange] = useState(0);
  const [salesOrgList, getSalesOrgList] = useAxiosGet();

  console.log("scheduleList", scheduleList);
  console.log("scheduleListFOneTime", scheduleListFOneTime);
  console.log("itemList", itemList);

  useEffect(() => {
    if (itemList?.length) {
      let amount = (itemList[0]?.qty || 0) * (itemList[0]?.rate || 0);
      let vat = itemList[0]?.vat || 0;
      let netAmount = amount + (amount * vat) / 100;
      setNetAmount(netAmount);
    } else {
      setNetAmount(0);
    }
  }, [itemList]);

  // useEffect(() => {
  //   if (scheduleMonthRange && validToData && validFromData) {
  //     const list = [];
  //     const n =
  //       calculateMonthDifference(validFromData, validToData) /
  //       scheduleMonthRange;
  //     for (let i = 0; i < n; i++) {
  //       list.push({
  //         dueDate: addMonthsToDate(
  //           validFromData,
  //           i === 0 ? 0 : i * scheduleMonthRange
  //         ),
  //         percentage: 0,
  //         amount: 0,
  //       });
  //     }
  //     // formikRef.current.setFieldValue("validTo", list[list.length - 1].dueDate);
  //     setSheduleList(list);
  //   } else {
  //     setSheduleList([]);
  //   }
  // }, [scheduleMonthRange, validToData, validFromData]);

  useEffect(() => {
    getSalesOrgList(
      `/oms/BusinessUnitSalesOrganization/GetBUSalesOrgDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}&SBUId=0`
    );

    getCustomerList(
      `/partner/BusinessPartnerBasicInfo/GetSoldToPartnerShipToPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getItemDDL(
      `/oms/SalesOrder/GetgetServiceItemList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
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
        intSalesTypeId: values?.salesOrg?.value,
        strSalesTypeName: values?.salesOrg?.label,
        intCustomerId: values?.customer?.value,
        strCustomerName: values?.customer?.label,
        strCustomerAddress: values?.customer?.address,
        intPaymentTypeId: values?.paymentType?.value || 0,
        strPaymentType: values?.paymentType?.label || "",
        intScheduleTypeId: values?.scheduleType?.value || 0,
        strScheduleTypeName: values?.scheduleType?.label || "",
        intScheduleDayCount: +values?.invoiceDay || 0,
        dteStartDateTime: values?.validFrom || _todayDate(),
        dteEndDateTime: values?.validTo || _todayDate(),
        strAttachmentLink: attachmentList[0]?.id || "",
        intActionBy: profileData?.userId,
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
        numSalesVatAmount: +item?.vat || 0,
        numNetSalesAmount: +netAmount || 0,
        isActive: true,
      })),
      schedule: scheduleArray?.map((schedule) => ({
        intServiceSalesScheduleId: 0,
        intServiceSalesOrderId: 0,
        dteScheduleDateTime: _todayDate(),
        dteDueDateTime: schedule?.dueDate,
        intPaymentByPercent: +schedule?.percentage || 0,
        numScheduleAmount: +schedule?.amount,
        strRemarks: schedule?.remarks || "",
        strStatus: "",
        isActive: true,
      })),
    };

    saveHandlerFunc(
      `oms/ServiceSales/createServiceSalesOrder`,
      payload,
      cb,
      true
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
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
          {loader && <Loading />}
          <IForm title="Create Service Sales Order" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
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
                    name="customer"
                    options={customerList || []}
                    value={values?.customer}
                    label="Customer"
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                      setFieldValue("billToParty", valueOption?.label || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="paymentType"
                    options={[
                      { value: 1, label: "Re-Curring" },
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
                          setFieldValue("validTo", "");
                          setValidToData("");
                          setScheduleMonthRange(valueOption?.range || 0);
                          setItemList([]);
                          setSheduleList([]);
                          setSheduleListFOneTime([]);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    {console.log(values)}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.invoiceDay}
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
                          setValidToData("");
                          setValidFromData("");
                          setSheduleList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.validFrom}
                        disabled={!values?.scheduleType || !values?.invoiceDay}
                        label="Valid From"
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
                          setValidToData("");
                          setValidFromData(e.target.value);
                          setSheduleList([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.validTo}
                        label="Valid To"
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
                          setValidToData(e.target.value);
                          setSheduleList([]);
                        }}
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
                  {/* <div style={{ marginTop: "18px" }}>
                    <button
                      type="button"
                      disabled={
                        !values?.item?.value ||
                        !values?.qty ||
                        !values?.rate ||
                        !values?.vat
                      }
                      className="btn btn-primary ml-4"
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
                            amount: (+values?.qty || 0) * (+values?.rate || 0),
                            netAmount:
                              (() => {
                                let amount =
                                  (+values?.qty || 0) * (+values?.rate || 0);
                                let vat = +values?.vat || 0;
                                return amount + (amount * vat) / 100;
                              })() || 0,
                          },
                        ]);
                      }}
                    >
                      Add
                    </button>
                  </div> */}
                  {[1]?.includes(values?.paymentType?.value) ? (
                    <div style={{ marginTop: "18px" }} className="ml-4">
                      <button
                        disabled={
                          !values?.paymentType?.value ||
                          !values?.validFrom ||
                          !values?.validTo ||
                          !values?.invoiceDay ||
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
                            },
                          ]);

                          if (
                            values?.scheduleType?.range &&
                            values?.validTo &&
                            values?.validFrom
                          ) {
                            console.log(
                              "scheduleType" + values.scheduleType?.range
                            );
                            console.log("validTo" + values.validTo);
                            console.log("validFrom" + values.validFrom);
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
                                amount:
                                  (() => {
                                    let amount =
                                      (+values?.qty || 0) *
                                      (+values?.rate || 0);
                                    let vat = +values?.vat || 0;
                                    return amount + (amount * vat) / 100;
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
                    <div style={{ marginTop: "18px" }} className="ml-4">
                      <button
                        disabled={
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
                            },
                          ]);

                          setSheduleListFOneTime([
                            {
                              dueDate: _todayDate(),
                              percentage: 0,
                              amount: 0,
                              remarks: "",
                            },
                          ]);
                        }}
                        type="button"
                        className="btn btn-primary"
                      >
                        Create Schedule
                      </button>
                    </div>
                  ) : null}
                  {/* <div style={{ marginTop: "18px" }}>
                    <button
                      onClick={() => setIsOpen(true)}
                      type="button"
                      className="btn btn-primary ml-4"
                    >
                      Schedule
                    </button>
                  </div> */}
                </div>
              </div>

              {itemList?.length > 0 && (
                <div className="mt-5">
                  <div>
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Qty</th>
                          <th>Rate</th>
                          <th>Amount</th>
                          <th>Vat %</th>
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
              )}

              {[1]?.includes(values?.paymentType?.value) ? (
                <div className="mt-5">
                  <div>
                    {scheduleList?.length > 0 && (
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Due Date</th>
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
                              <td className="text-right">{item?.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>
              ) : null}

              {[2]?.includes(values?.paymentType?.value) ? (
                <div className="mt-5">
                  <div>
                    {scheduleListFOneTime?.length > 0 && (
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Due Date</th>
                            <th>Percentage</th>
                            <th>Amount</th>
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
                                <InputField
                                  value={item?.percentage || ""}
                                  type="number"
                                  onChange={(e) => {
                                    const newValue = +e.target.value;

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

                                    if (totalPercentage > 100) {
                                      toast.warn(
                                        "Total percentage should be 100"
                                      );
                                      return;
                                    }

                                    let updatedScheduleList = [
                                      ...scheduleListFOneTime,
                                    ];
                                    updatedScheduleList[
                                      index
                                    ].percentage = newValue;
                                    updatedScheduleList[index].amount =
                                      ((newValue || 0) / 100) *
                                      (netAmount || 0);
                                    setSheduleListFOneTime(updatedScheduleList);
                                  }}
                                />
                              </td>
                              <td className="text-center">{item?.amount}</td>
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

                                    setSheduleListFOneTime(updatedScheduleList);
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
