import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router";
import { toast } from "react-toastify";
import TextArea from "../../../../_helper/TextArea";
import { getVoyageDDLNew } from "../../../helper";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import FormikSelect from "../../../_chartinghelper/common/formikSelect";
import customStyles from "../../../_chartinghelper/common/selectCustomStyle";
import {
  createJournalForTimeCharter,
  createTimeCharterBR,
  getSalesOrgList,
  GetTransactionDetails,
  timeCharterReceiveAmountUpdate,
  validationSchema
} from "../helper";
import EditInvoiceForOwner from "../invoice/editInvoiceForOwner";
import InvoiceForCharterer from "../invoice/invoiceForCharterer";
import InvoiceForChartererView from "../invoice/invoiceForChartererView";
import InvoiceForOwner from "../invoice/invoiceForOwner";
import InvoiceForOwnerView from "../invoice/invoiceForOwnerView";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  vesselDDL,
  setLoading,
  transactionNameDDL,
  beneficiaryDDL,
  id,
  sbuList,
  setOffHireDuration,
  offHireDuration,
  dataForEdit,
  singleData,
  accNoDDL,
}) {
  const history = useHistory();
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [invoiceHireData, setInvoiceHireData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [salesOrgList, setSalesOrgList] = useState([]);

  const { state: preData, type } = useLocation();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(()=>{
    if(type === "create" && preData?.vesselName?.value){
      getVoyageDDLNew({
        accId,
        buId,
        id: preData?.vesselName?.value,
        setter: setVoyageNoDDL,
        setLoading: setLoading,
        hireType: 0,
        isComplete: 2,
        voyageTypeId: 1,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[preData])

  useEffect(() => {
    if (singleData?.objRows?.length > 0 && viewType !== "edit") {
      setRowData([...singleData?.objRows]);
    } else if (viewType === "edit") {
      setRowData(dataForEdit?.objRows);
    }
  }, [singleData, viewType, dataForEdit]);

  /* All Calculation Here!! */
  const rowDtoHandler = (index, name, value, item) => {
    if (viewType === "edit") {
      const {
        objHeader: { comm, cveday, dailyHire, lsfoprice, lsmgoprice },
      } = dataForEdit;

      const copy = [...rowData];

      if (name === "isChecked" || name === "credit" || name === "debit") {
        copy[index][name] = +value;
      }

      if (item?.isDescription && name === "description") {
        copy[index].description = value;
      }

      if (name === "duration") {
        copy[index][name] = +value;

        switch (item?.description) {
          case "HIRE DUE TO OWNR":
            copy[index].credit = +value * dailyHire;
            break;
          case "HIRE ADD COMM":
            copy[index].debit = +value * dailyHire * (comm / 100);
            break;
          case "HIRE BROK COM":
            copy[index].debit = +value * dailyHire * (comm / 100);
            break;
          case "C/V/E":
            copy[index].credit = (+value * cveday) / 30;
            break;
          default:
            break;
        }
      }

      if (name === "quantity") {
        copy[index][name] = +value;
        switch (item?.description) {
          case "BOD-LSFO":
            copy[index].credit = +value * lsfoprice;
            break;
          case "BOD-LSMGO":
            copy[index].credit = +value * lsmgoprice;
            break;
          case "BOR-LSFO":
            copy[index].debit = +value * lsfoprice;
            break;
          case "BOR-LSMGO":
            copy[index].debit = +value * lsmgoprice;
            break;
          default:
            break;
        }
      }

      setRowData([...copy]);
    } else {
      const copy = [...rowData];

      if (name === "isChecked" || name === "credit" || name === "debit") {
        copy[index][name] = +value;
      }

      if (item?.isDescription && name === "description") {
        copy[index].description = value;
      }

      if (name === "duration") {
        copy[index][name] = +value;

        switch (item?.description) {
          case "HIRE DUE TO OWNR":
            copy[index].credit = +value * invoiceHireData?.dailyHire;
            break;
          case "HIRE ADD COMM":
            copy[index].debit =
              +value *
              invoiceHireData?.dailyHire *
              (invoiceHireData.comm / 100);
            break;
          case "HIRE BROK COM":
            copy[index].debit =
              +value *
              invoiceHireData?.dailyHire *
              (invoiceHireData.comm / 100);
            break;
          case "C/V/E":
            copy[index].credit = (+value * invoiceHireData.cveday) / 30;
            break;
          default:
            break;
        }
      }

      if (name === "quantity") {
        copy[index][name] = +value;
        switch (item?.description) {
          case "BOD-LSFO":
            copy[index].credit = +value * invoiceHireData?.lsfoprice;
            break;
          case "BOD-LSMGO":
            copy[index].credit = +value * invoiceHireData?.lsmgoprice;
            break;
          case "BOR-LSFO":
            copy[index].debit = +value * invoiceHireData?.lsfoprice;
            break;
          case "BOR-LSMGO":
            copy[index].debit = +value * invoiceHireData?.lsmgoprice;
            break;
          default:
            break;
        }
      }

      setRowData([...copy]);
    }
  };

  const addHandler = (index) => {
    const copy = [...rowData];
    copy.splice(index + 1, 0, {
      description: "",

      tctransactionId: 0,
      duration: "",
      quantity: "",
      debit: "",
      credit: "",
      active: true,
      notes: "",

      isDescription: { name: "description" },
      isDuration: { name: "duration" },
      isCredit: { name: "credit" },
      isDebit: { name: "debit" },
      isQty: { name: "quantity" },
      isChecked: true,
    });
    setRowData(copy);
  };

  const deleteHandler = (index) => {
    const copy = [...rowData];
    const newArr = copy.filter((item, idx) => idx !== index);
    setRowData(newArr);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(
            {
              ...values,
              rowData,
              invoiceHireData,
              offHireIds: invoiceHireData?.offHireIds,
            },
            () => {
              resetForm(initData);
              setInvoiceHireData([]);
              setRowData([]);
            }
          );
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setTouched,
          setErrors,
          setValues,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (type === "create" ? false : preData?.vesselName?.label) {
                        history.push("/");
                      } else {
                        history.goBack();
                      }
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={"btn btn-info px-3 py-2 reset-btn ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" &&
                  (invoiceHireData?.vesselId ||
                    dataForEdit?.objHeader?.vesselId) ? (
                    <button
                      type="submit"
                      className={"btn btn-primary px-3 py-2 ml-2"}
                      onClick={handleSubmit}
                      // disabled if previous hire is not received
                      disabled={invoiceHireData?.returnMSG ? true : false}
                    >
                      Save
                    </button>
                  ) : null}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setInvoiceHireData([]);
                        setRowData([]);
                        setFieldValue("voyageNo", "");
                        setFieldValue("transactionName", "");
                        setFieldValue("hireTypeName", "");
                        setFieldValue("beneficiary", {
                          value: valueOption?.ownerId,
                          label: valueOption?.ownerName,
                        });
                        setFieldValue("vesselName", valueOption);
                        if (valueOption) {
                          // getVoyageDDLFilter({
                          //   id: valueOption?.value,
                          //   setter: setVoyageNoDDL,
                          //   typeId: 1, // 1 for Time Charterer
                          //   setLoading: setLoading,
                          //   isComplete: false,
                          // });
                          getVoyageDDLNew({
                            accId,
                            buId,
                            id: valueOption?.value,
                            setter: setVoyageNoDDL,
                            setLoading: setLoading,
                            hireType: 0,
                            isComplete: 2,
                            voyageTypeId: 1,
                          });
                        }
                      }}
                      isDisabled={type === "create" ? false : viewType || preData?.vesselName}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ""}
                      isSearchable={true}
                      options={voyageNoDDL || []}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      onChange={(valueOption) => {
                        setInvoiceHireData([]);
                        setRowData([]);
                        setFieldValue("transactionName", "");
                        setFieldValue("hireTypeName", {
                          value: valueOption?.hireTypeId,
                          label: valueOption?.hireTypeName,
                        });
                        setFieldValue("voyageNo", valueOption);
                      }}
                      isDisabled={type === "create" ? false :
                        viewType || !values?.vesselName || preData?.voyageNo
                      }
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.hireTypeName?.value ? (
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.hireTypeName || ""}
                        isSearchable={true}
                        options={[]}
                        styles={customStyles}
                        name="hireTypeName"
                        placeholder="Ship Type"
                        label="Ship Type"
                        onChange={(valueOption) => {
                          setFieldValue("statement", valueOption);
                        }}
                        isDisabled={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.transactionName || ""}
                      isSearchable={true}
                      options={transactionNameDDL || []}
                      styles={customStyles}
                      name="transactionName"
                      placeholder="Transaction Name"
                      label="Transaction Name"
                      onChange={async (valueOption) => {
                        setInvoiceHireData([]);
                        setRowData([]);
                        setFieldValue("redeliveryDate", "");
                        setFieldValue("transactionName", valueOption);

                        GetTransactionDetails(
                          accId,
                          buId,
                          values?.vesselName?.value,
                          values?.voyageNo?.value,
                          valueOption?.value,
                          rowData,
                          setRowData,
                          setInvoiceHireData,
                          setLoading,
                          setOffHireDuration,
                          (resData) => {
                            setValues({
                              ...values,
                              transactionName: valueOption,
                              narration: `Amount debited to ${resData?.chtrName} & credited to Freight Income as provision of freight income of ${resData?.vesselName}, V${resData?.voyageNo}`,
                            });
                          },
                          type,
                          values?.hireTypeName?.value
                        );
                      }}
                      isDisabled={viewType}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Transaction Date</label>
                    <FormikInput
                      value={values?.transactionDate}
                      name="transactionDate"
                      placeholder="Transaction Date"
                      type="date"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "view"}
                    />
                  </div>

                  {/* if hire is not created yet */}
                  {+invoiceHireData?.objHeader?.tctransactionId === 0 ||
                  invoiceHireData?.tctransactionId === 0 ? (
                    <div className="col-lg-3">
                      <FormikSelect
                        value={values?.beneficiary || ""}
                        isSearchable={true}
                        options={beneficiaryDDL}
                        styles={customStyles}
                        name="beneficiary"
                        placeholder="Beneficiary Name"
                        label="Beneficiary Name"
                        onChange={(valueOption) => {
                          setFieldValue("beneficiary", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  ) : null}

                  {/* {!invoiceHireData?.returnMSG && (
                    <div className="col-12"></div>
                  )} */}

                  {/* If hire is created and amount not received */}
                  {invoiceHireData?.objHeader?.tctransactionId > 0 ? (
                    <>
                      <div className="col-lg-3">
                        <label>Receive Amount</label>
                        <FormikInput
                          value={
                            values?.receiveAmount ||
                            invoiceHireData?.objHeader?.totalReceivedAmount
                          }
                          name="receiveAmount"
                          placeholder="Receive Amount"
                          type="number"
                          errors={errors}
                          touched={touched}
                          // disable for received hire
                          disabled={
                            +invoiceHireData?.objHeader?.totalReceivedAmount !==
                            0
                          }
                        />
                      </div>

                      {/* if any amount of selected hire is not received then show this section */}

                      {+invoiceHireData?.objHeader?.totalReceivedAmount ===
                      0 ? (
                        <>
                          <div className="col-lg-3">
                            <FormikSelect
                              value={values?.bankAccNo || ""}
                              isSearchable={true}
                              options={accNoDDL || []}
                              styles={customStyles}
                              name="bankAccNo"
                              placeholder="Bank Account No"
                              label="Bank Account No"
                              onChange={(valueOption) => {
                                setFieldValue("bankAccNo", valueOption);
                              }}
                              errors={errors}
                              touched={touched}
                              isDisabled={viewType}
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Receive Date</label>
                            <FormikInput
                              value={values?.receivedDate}
                              name="receivedDate"
                              placeholder="Receive Date"
                              type="date"
                              errors={errors}
                              touched={touched}
                              disabled={viewType === "view"}
                            />
                          </div>
                          <div className="col-lg-3 mt-5">
                            <button
                              onClick={() => {
                                if (
                                  +invoiceHireData?.objHeader
                                    ?.totalReceivedAmount === 0
                                ) {
                                  timeCharterReceiveAmountUpdate(
                                    buId,
                                    invoiceHireData?.objHeader?.tctransactionId,
                                    values?.receiveAmount,
                                    values?.receivedDate,
                                    () => {
                                      createTimeCharterBR(
                                        accId,
                                        buId,
                                        invoiceHireData?.objHeader?.chtrId,
                                        values?.receiveAmount,
                                        values?.bankAccNo?.value,
                                        setLoading,
                                        () => {
                                          resetForm(initData);
                                          setInvoiceHireData([]);
                                          setRowData([]);
                                        }
                                      );
                                    }
                                  );
                                } else {
                                  toast.warning("Amount Already Received", {
                                    toastId: 13124,
                                  });
                                }
                              }}
                              type={"button"}
                              className="btn btn-primary px-3 py-2"
                              disabled={
                                values?.receiveAmount < 1 ||
                                !values?.receivedDate ||
                                !values?.bankAccNo
                              }
                            >
                              Receive
                            </button>
                          </div>
                        </>
                      ) : null}
                    </>
                  ) : null}

                  {/* Show JV Code for Journal created invoices */}
                  {invoiceHireData?.objHeader?.journalVoucherCode && (
                    <div className="col-lg-4 mt-5">
                      <b>JV Code:</b>{" "}
                      {invoiceHireData?.objHeader?.journalVoucherCode}
                    </div>
                  )}

                  {/* Show a warning message for previous not received hire */}
                  {invoiceHireData?.returnMSG ? (
                    <div style={{ color: "tomato" }} className="col-lg-4 mt-3">
                      {invoiceHireData?.returnMSG || ""}
                    </div>
                  ) : (
                    <div className="col-12"></div>
                  )}
                </div>
              </div>

              {/* if hire is created and Journal is not created then show this section */}

              {invoiceHireData?.objHeader?.tctransactionId > 0 &&
                !invoiceHireData?.objHeader?.journalVoucherCode && (
                  <div className="marine-form-card-content">
                    <div className="row">
                      <div className="col-12">
                        <h6>Journal</h6>
                      </div>
                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.sbu || ""}
                          isSearchable={true}
                          options={sbuList || []}
                          styles={customStyles}
                          name="sbu"
                          placeholder="SBU"
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                            setFieldValue("salesOrg", "");
                            if (valueOption) {
                              getSalesOrgList(
                                accId,
                                buId,
                                valueOption?.value,
                                setSalesOrgList,
                                setLoading
                              );
                            }
                          }}
                          // isDisabled={viewType || preData?.vesselName}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.salesOrg || ""}
                          isSearchable={true}
                          options={salesOrgList || []}
                          styles={customStyles}
                          name="salesOrg"
                          placeholder="Sales Organization"
                          label="Sales Organization"
                          onChange={(valueOption) => {
                            setFieldValue("salesOrg", valueOption);
                          }}
                          isDisabled={!values?.sbu}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Journal Date</label>
                        <FormikInput
                          value={values?.journalDate}
                          name="journalDate"
                          placeholder="Journal Date"
                          type="date"
                          errors={errors}
                          touched={touched}
                          disabled={viewType === "view"}
                        />
                      </div>
                      <div className="col-lg-3 text-right">
                        <button
                          type="button"
                          className="btn btn-primary px-3 py-2 mt-5"
                          onClick={() => {
                            if (
                              !values?.sbu ||
                              !values?.salesOrg ||
                              !values?.narration ||
                              !values?.journalDate
                            ) {
                              setTouched({
                                sbu: true,
                                salesOrg: true,
                                narration: true,
                                journalDate: true,
                              });
                              window.setTimeout(() => {
                                setErrors({
                                  sbu: !values?.sbu && "SBU is required",
                                  salesOrg:
                                    !values?.salesOrg &&
                                    "Sales Organization is required",
                                  narration:
                                    !values?.narration &&
                                    "Narration is required",
                                  journalDate:
                                    !values?.journalDate &&
                                    "Journal Date is required",
                                });
                              }, 50);
                            } else {
                              createJournalForTimeCharter(
                                accId,
                                userId,
                                buId,
                                values,
                                invoiceHireData?.objHeader?.tctransactionId,
                                rowData,
                                setLoading,
                                () => {
                                  setFieldValue("sbu", "");
                                  setFieldValue("salesOrg", "");
                                  setFieldValue("narration", "");
                                }
                              );
                            }
                          }}
                        >
                          Create Journal
                        </button>
                      </div>
                      <div className="col-lg-6">
                        <label>Narration</label>
                        <TextArea
                          // defaultValue={Amount debited to "Charter Name" & credited to "Freight Income" as provision of freight income of "AKij Moon", "Voyage-01"}
                          value={values?.narration}
                          name="narration"
                          placeholder="Narration"
                          rows="3"
                          onChange={(e) =>
                            setFieldValue("narration", e.target.value)
                          }
                          max={1000}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                )}
              {/* Invoice For Owner */}
              {values?.hireTypeName?.value === 1 ? (
                <>
                  {/* Invoice For Owner Create */}
                  {invoiceHireData?.vesselId &&
                  invoiceHireData?.vesselName &&
                  rowData?.length > 0 ? (
                    <InvoiceForOwner
                      invoiceHireData={invoiceHireData}
                      formikprops={{
                        handleSubmit,
                        resetForm,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                      }}
                      rowData={rowData}
                      setRowData={setRowData}
                      rowDtoHandler={rowDtoHandler}
                      addHandler={addHandler}
                      deleteHandler={deleteHandler}
                      offHireDuration={offHireDuration}
                    />
                  ) : null}

                  {/* Invoice For Owner View */}
                  {invoiceHireData?.objRows?.length > 0 ||
                  (id &&
                    viewType !== "edit" &&
                    singleData?.objRows?.length > 0) ? (
                    <>
                      <InvoiceForOwnerView
                        invoiceHireData={
                          id
                            ? singleData?.objHeader
                            : invoiceHireData?.objHeader
                        }
                        formikprops={{
                          handleSubmit,
                          resetForm,
                          values,
                          errors,
                          touched,
                          setFieldValue,
                          isValid,
                        }}
                        rowData={rowData}
                        setRowData={setRowData}
                      />
                    </>
                  ) : viewType === "edit" ? (
                    <EditInvoiceForOwner
                      invoiceHireData={dataForEdit?.objHeader}
                      formikprops={{
                        handleSubmit,
                        resetForm,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                      }}
                      rowData={rowData}
                      setRowData={setRowData}
                      rowDtoHandler={rowDtoHandler}
                      addHandler={addHandler}
                      deleteHandler={deleteHandler}
                      offHireDuration={offHireDuration}
                    />
                  ) : null}
                </>
              ) : null}

              {/* Invoice For Charterer */}
              {values?.hireTypeName?.value === 2 ? (
                <>
                  {/* Invoice For Charterer Create */}
                  {invoiceHireData?.vesselId &&
                  invoiceHireData?.vesselName &&
                  rowData?.length > 0 ? (
                    <InvoiceForCharterer
                      invoiceHireData={invoiceHireData}
                      formikprops={{
                        handleSubmit,
                        resetForm,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                        isValid,
                      }}
                      rowData={rowData}
                      setRowData={setRowData}
                      rowDtoHandler={rowDtoHandler}
                      addHandler={addHandler}
                      deleteHandler={deleteHandler}
                    />
                  ) : null}

                  {/* Invoice For Charterer View */}
                  {invoiceHireData?.objRows?.length > 0 ||
                  (id && singleData?.objRows?.length > 0) ? (
                    <>
                      <InvoiceForChartererView
                        invoiceHireData={
                          id
                            ? singleData?.objHeader
                            : invoiceHireData?.objHeader
                        }
                        formikprops={{
                          handleSubmit,
                          resetForm,
                          values,
                          errors,
                          touched,
                          setFieldValue,
                          isValid,
                        }}
                        rowData={rowData}
                        setRowData={setRowData}
                      />
                    </>
                  ) : null}
                </>
              ) : null}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
