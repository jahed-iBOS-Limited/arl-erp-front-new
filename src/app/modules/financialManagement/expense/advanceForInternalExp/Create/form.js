/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Select from "react-select";
import * as Yup from "yup";
import FormikError from "../../../../_helper/_formikError";
import { IInput } from "../../../../_helper/_input";
import { _todayDate } from "../../../../_helper/_todayDate";
import customStyles from "../../../../selectCustomStyle";
import { getPaymentType, getRequestedEmp, getSBU } from "../helper";
import NewSelect from "./../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getCostCenter } from "../../expenseRegister/helper";
import Loading from "../../../../_helper/_loading";
import { CostElementDDLApi } from "../../../../inventoryManagement/warehouseManagement/invTransaction/Form/issueInvantory/helper";
import { toast } from "react-toastify";

// Validation schema for Advance for Internal Expense
const validationSchema = Yup.object().shape({
  requestedEmp: Yup.object().shape({
    label: Yup.string().required("Requested Employee is required"),
    value: Yup.string().required("Requested Employee is required"),
  }),
  SBU: Yup.object().shape({
    label: Yup.string().required("Requested SBU is required"),
    value: Yup.string().required("Requested SBU is required"),
  }),
  costCenter: Yup.object().shape({
    label: Yup.string().required("Cost Center is required"),
    value: Yup.string().required("Cost Center is required"),
  }),
  costElement: Yup.object().shape({
    label: Yup.string().required("Cost Element is required"),
    value: Yup.string().required("Cost Element is required"),
  }),
  expenseGroup: Yup.object().shape({
    label: Yup.string().required("Expense Group is required"),
    value: Yup.string().required("Expense Group is required"),
  }),
  numRequestedAmount: Yup.number()
    .min(1, "Minimum 1 symbols")
    .max(10000000000000, "Maximum 10000000000000 symbols")
    .required("Requested Amount is required"),

  dueDate: Yup.string().required("Due date is required"),
  // paymentType: Yup.object().shape({
  //   label: Yup.string().required("Payment Type is required"),
  //   value: Yup.string().required("Payment Type is required"),
  // }),
  // disbursementCenterName: Yup.object().shape({
  //   label: Yup.string().required("Disbursment Center is required"),
  //   value: Yup.string().required("Disbursment Center is required"),
  // }),
  // expenseHead: Yup.object().shape({
  //   label: Yup.string().required("Expense Head is required"),
  //   value: Yup.string().required("Expense Head is required"),
  // }),
  comments: Yup.string(),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  remover,
  setter,
  profileData,
  selectedBusinessUnit,
  jorunalType,
  isEdit,
  state,
  approval,
}) {
  const [requestedEmp, setRequestedEmp] = useState([]);
  const [costCenterDDl, setCostCenter] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [loading, setLoading] = useState(false);
  const [bugetHeadWiseBalance, getBugetHeadWiseBalance, budgetWiseLoader, setBugetHeadWiseBalance] = useAxiosGet();


  // const [paymentType, setPaymentType] = useState([]);
  // const [disbursementCenterName, setDisbursementCenterName] = useState([]); // this ddl will be off order by miraz vai
  const [selectedSbu, setSelectedSbu] = useState([]);
  // const [expenseHeadDDL, setExpenseHeadDDL] = useState([]); // this ddl will be off order by miraz vai
  const [
    profitcenterDDL,
    getProfitcenterDDL,
    loadingOnGetProfitCenter,
    setProfitcenterDDL,
  ] = useAxiosGet();
  useEffect(() => {
    if (
      profileData.accountId &&
      selectedBusinessUnit?.value &&
      (state?.selectedSbu?.value || state?.item?.sbuid)
    ) {
      getSBU(profileData.accountId, selectedBusinessUnit.value, setSelectedSbu);
      // GetBusTransDDLForExp_api(
      //   profileData.accountId,
      //   selectedBusinessUnit.value,
      //   setExpenseHeadDDL
      // );
      // getPaymentType(setPaymentType);

      // getDisbursementCenterName(
      //   profileData.accountId,
      //   selectedBusinessUnit?.value,
      //   state?.selectedSbu?.value || state?.item?.sbuid,
      //   setDisbursementCenterName
      // );
    }
  }, [profileData, selectedBusinessUnit, state]);

  useEffect(() => {
    if (state?.checkPublic) {
      getRequestedEmp(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setRequestedEmp
      );
    }
  }, [state]);
  useEffect(() => {
    if ([184].includes(selectedBusinessUnit?.value)) {
      getProfitcenterDDL(
        `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=0&businessUnitId=${
          selectedBusinessUnit.value
        }&employeeId=${
          [184].includes(selectedBusinessUnit?.value)
            ? profileData?.employeeId
            : 0
        }`
      );
    }
    getCostCenter(
      profileData.accountId,
      selectedBusinessUnit.value,
      state?.selectedSbu?.value || state?.item?.sbuid,
      setCostCenter
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                requestedEmp: {
                  value: state?.selectedEmp?.value,
                  label: state?.selectedEmp?.label,
                },

                SBU: {
                  value: state?.selectedSbu?.value,
                  label: state?.selectedSbu?.label,
                },
              }
        }
        // initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if(bugetHeadWiseBalance?.length > 0 && !values?.accountHead?.label){
            return toast.warn("Account Head is Required !")
          }
          saveHandler(values, () => {
            resetForm(initData);
            setBugetHeadWiseBalance([])
          });
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
        }) => (
          <>
            {loading && <Loading />}
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-12">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    {/* ///requested employee */}

                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Request For (Employee)</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("requestedEmp", valueOption);
                        }}
                        options={requestedEmp || []}
                        value={values?.requestedEmp}
                        isSearchable={true}
                        name="requestedEmp"
                        styles={customStyles}
                        placeholder="EMP"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="requestedEmp"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Select SBU</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("SBU", valueOption);
                          setFieldValue("disbursementCenterName", "");
                          getCostCenter(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setCostCenter
                          );
                          // getDisbursementCenterName(
                          //   profileData.accountId,
                          //   selectedBusinessUnit?.value,
                          //   valueOption?.value,
                          //   setDisbursementCenterName
                          // );
                        }}
                        options={selectedSbu || []}
                        value={values?.SBU}
                        isSearchable={true}
                        name="SBU"
                        styles={customStyles}
                        placeholder="SBU"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="SBU"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-6 pl pr-1 mb-2 disable-border disabled-feedback border-gray">
                      <IInput
                        value={values.numRequestedAmount}
                        label="Requested Amount"
                        name="numRequestedAmount"
                        placeholder="Requested Amount"
                        min="0"
                        type="number"
                      />
                    </div>

                    {/* ////DUE DATE ////// */}

                    <div className="col-lg-6 pl-date pr pl-1 mb-2 bank-journal-date border-gray">
                      <IInput
                        value={values.dueDate}
                        label="Due Date"
                        name="dueDate"
                        type="date"
                        min={_todayDate()}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Cost Center </label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", valueOption);
                          setFieldValue("costElement", "");
                          setFieldValue("accountHead", "");
                          if (valueOption) {
                            setLoading(true);
                            CostElementDDLApi(
                              profileData.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setCostElementDDL
                            );
                            if (![184].includes(selectedBusinessUnit?.value)) {
                              setFieldValue("profitCenter", "");
                              setProfitcenterDDL([]);
                              getProfitcenterDDL(
                                `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${
                                  valueOption?.value
                                }&businessUnitId=${
                                  selectedBusinessUnit.value
                                }&employeeId=${
                                  [184].includes(selectedBusinessUnit?.value)
                                    ? profileData?.employeeId
                                    : 0
                                }`,
                                (data) => {
                                  if (data?.length === 1) {
                                    setFieldValue("profitCenter", data[0]);
                                  }
                                }
                              );
                            }
                            setLoading(false);
                          }
                        }}
                        options={costCenterDDl || []}
                        value={values?.costCenter}
                        isSearchable={true}
                        name="costCenter"
                        styles={customStyles}
                        placeholder="Cost Center"
                      />
                      <FormikError
                        errors={errors}
                        name="costCenter"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Cost Element</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("costElement", valueOption);
                          setFieldValue("accountHead", "");
                          setBugetHeadWiseBalance([])
                          if(valueOption){
                            getBugetHeadWiseBalance(`/fino/BudgetaryManage/GetBugetHeadWiseBalance?businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${valueOption?.glId}&subGlId=${valueOption?.subGlId}&accountHeadId=0&dteJournalDate=${_todayDate()}`, (res)=>{
                              const modiFyData = res?.map((item)=>({...item, value: item?.intAccountHeadId , label: item?.strAccountHeadName}))

                              setBugetHeadWiseBalance(modiFyData)
                            })
                          }
                        }}
                        options={costElementDDL || []}
                        value={values?.costElement}
                        isSearchable={true}
                        name="costElement"
                        styles={customStyles}
                        placeholder="Cost Element"
                      />
                      <FormikError
                        errors={errors}
                        name="costElement"
                        touched={touched}
                      />
                    </div>
                    {(bugetHeadWiseBalance?.length > 0) && (
                          <>
                          <div className="col-lg-6 pl pr-1 mb-2">
                          <NewSelect
                            name="accountHead"
                            options={bugetHeadWiseBalance || []}
                            value={values?.accountHead}
                            label="Account Head"
                            onChange={(valueOption) => {
                              setFieldValue("accountHead", valueOption || "");

                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        </>
                        )}
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Profit Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                        }}
                        options={profitcenterDDL || []}
                        value={values?.profitCenter}
                        isSearchable={true}
                        name="profitCenter"
                        styles={customStyles}
                        placeholder="Profit Center"
                      />
                      <FormikError
                        errors={errors}
                        name="profitCenter"
                        touched={touched}
                      />
                    </div>
                    {/* ////  PAYMENT TYPE ////// */}

                    {/* <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Select Payment Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("paymentType", valueOption);
                        }}
                        options={paymentType || []}
                        value={values?.paymentType}
                        isSearchable={true}
                        name="paymentType"
                        styles={customStyles}
                        placeholder="Payment Type"
                      />
                      <FormikError
                        errors={errors}
                        name="paymentType"
                        touched={touched}
                      />
                    </div> */}

                    {/* ////  DUSBURSEMENT CENTER ////// */}
                    {/* <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Select Disbursement Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("disbursementCenterName", valueOption);
                        }}
                        options={disbursementCenterName || []}
                        value={values?.disbursementCenterName}
                        isSearchable={true}
                        name="disbursementCenterName"
                        styles={customStyles}
                        placeholder="Disbursement Center"
                      />
                      <FormikError
                        errors={errors}
                        name="disbursementCenterName"
                        touched={touched}
                      />
                    </div> */}
                    {/* DUSBURSEMENT CENTER & Expanse Head ddl will be hold order by miraz vai */}
                    {/* <div className="col-lg-6 pl pr-1 mb-2">
                      <label>Expense Head</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("expenseHead", valueOption);
                        }}
                        options={expenseHeadDDL || []}
                        value={values?.expenseHead}
                        isSearchable={true}
                        name="expenseHead"
                        styles={customStyles}
                        placeholder="Disbursement Center"
                      />
                      <FormikError
                        errors={errors}
                        name="expenseHead"
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-6 pl pr-1 mb-2">
                      <NewSelect
                        name="expenseGroup"
                        options={[
                          {
                            value: "TaDa",
                            label: "Ta/Da",
                          },
                          {
                            value: "Other",
                            label: "Other",
                          },
                        ]}
                        value={values?.expenseGroup}
                        label="Expense Group"
                        onChange={(valueOption) => {
                          setFieldValue("expenseGroup", valueOption);
                        }}
                        placeholder="Expense Group"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    {/* ////  advExpCategoryName ////// */}

                    <div className="col-lg-6 pl pr mb-2 h-narration border-gray">
                      <IInput
                        value={values.comments}
                        label="Comments"
                        name="comments"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Row Dto Table End */}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
