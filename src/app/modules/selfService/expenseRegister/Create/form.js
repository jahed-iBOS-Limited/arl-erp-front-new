/* eslint-disable jsx-a11y/no-distracting-elements */
import React, { useState } from "react";
import Axios from "axios";
import { DropzoneDialogBase } from "material-ui-dropzone";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Select from "react-select";
import customStyles from "../../../selectCustomStyle";
import { IInput } from "../../../_helper/_input";
import IDelete from "../../../_helper/_helperIcons/_delete";
import { useEffect } from "react";
import { getDownlloadFileView_Action } from "../../../_helper/_redux/Actions";
import moment from "moment";
import {
  getTransaction,
  getPaymentType,
  getCategory,
  getProjectName,
  getCostCenter,
  getDisbursementCenter,
  getVehicleDDL,
  expenseAttachment_action,
} from "../helper";
import FormikError from "../../../_helper/_formikError";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import { useDispatch } from "react-redux";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import { CostElementDDLApi } from "../../../inventoryManagement/warehouseManagement/invTransaction/Form/issueInvantory/helper";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _todayDate } from "../../../_helper/_todayDate";
import { toast } from "react-toastify";
// Validation schema for bank transfer
const validationSchema = Yup.object().shape({
  // paymentType: Yup.object().shape({
  //   label: Yup.string().required("Payment type is required"),
  //   value: Yup.string().required("Payment type is required"),
  // }),
  expenseGroup: Yup.mixed().required("Expense Group is required"),
  expenseFrom: Yup.date().required("Amount is required"),
  expenseTo: Yup.date().required("Instrument no is required"),
  // disbursmentCenter: Yup.object().shape({
  //   label: Yup.string().required("disbursmentCenter type is required"),
  //   value: Yup.string().required("disbursmentCenter type is required"),
  // }),
  comments1: Yup.string(),
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
  sbu,
  isEdit,
  total,
  setRowDto,
  approval,
  fileObjects,
  setFileObjects,
  setUploadImage,
  location,
}) {
  // eslint-disable-next-line no-unused-vars
  const [transaction, setTransaction] = useState([]);
  // payment type state
  // eslint-disable-next-line no-unused-vars
  const [paymentType, setPaymentType] = useState([]);
  //
  //category state
  const [, setCategory] = useState([]);
  // project state
  const [projectName, setProjectName] = useState([]);
  // cost center state
  const [costCenter, setCostCenter] = useState([]);
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [bugetHeadWiseBalance, getBugetHeadWiseBalance, budgetWiseLoader, setBugetHeadWiseBalance] = useAxiosGet();
  const [availableBudgetAdvanceBalance, getAvailableBudgetAdvanceBalance, availableBudgetAdvanceBalanceLoader, setAvailableBudgetAdvanceBalance] = useAxiosGet();

  const [
    profitcenterDDL,
    getProfitcenterDDL,
    loadingOnGetProfitCenter,
    setProfitcenterDDL,
  ] = useAxiosGet();
  // disbursment state
  const [disbustmentCenter, setDisbustmentCenter] = useState([]);
  //vehicle state
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getTransaction(
        profileData.accountId,
        selectedBusinessUnit.value,
        setTransaction
      );
      getCategory(
        profileData.accountId,
        selectedBusinessUnit.value,
        sbu?.value,
        setCategory
      );
      getCostCenter(
        profileData.accountId,
        selectedBusinessUnit.value,
        sbu?.value,
        setCostCenter
      );
      getPaymentType(setPaymentType);

      getDisbursementCenter(
        profileData.accountId,
        selectedBusinessUnit.value,
        sbu?.value,
        setDisbustmentCenter
      );
      getProjectName(
        profileData.accountId,
        selectedBusinessUnit.value,
        setProjectName
      );
      getVehicleDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setVehicleDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, sbu?.value, selectedBusinessUnit]);

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
    )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  useEffect(()=>{
    if([184].includes(selectedBusinessUnit?.value)){
      getProfitcenterDDL(
        `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=0&businessUnitId=${selectedBusinessUnit.value}&employeeId=${[184].includes(selectedBusinessUnit?.value) ? profileData?.employeeId : 0}`,
      );
     }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])

  return (
    <>
      {(loadingOnGetProfitCenter || budgetWiseLoader || availableBudgetAdvanceBalanceLoader) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                vehicle: {
                  value: vehicleDDL[0]?.value,
                  label: vehicleDDL[0]?.label,
                },
                disbursmentCenter:
                  disbustmentCenter?.length > 0
                    ? {
                        value: disbustmentCenter[0]?.value,
                        label: disbustmentCenter[0]?.label,
                      }
                    : "",
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
        }) => (
          <>
            <marquee
              direction="left"
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              This month TADA bill can not submit after the 5 days of next month
            </marquee>
            <Form className="form form-label-right">
              <div className="row">
                <div className="col-lg-3">
                  <div className="row bank-journal bank-journal-custom bj-left">
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Disbursement Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("disbursmentCenter", valueOption);
                        }}
                        value={values?.disbursmentCenter || ""}
                        isSearchable={true}
                        options={disbustmentCenter || []}
                        styles={customStyles}
                        name="disbursmentCenter"
                        placeholder="Disbursement Center"
                        isDisabled={isEdit}
                      />
                      {/* <FormikError
                        errors={errors}
                        name="disbursmentCenter"
                        touched={touched}
                      /> */}
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <div>Expense Period From</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.expenseFrom}
                        name="expenseFrom"
                        onChange={(e) => {
                          setFieldValue("expenseFrom", e.target.value);
                          const endOfMonth = moment(e.target.value)
                            .endOf("month")
                            .format();
                          setFieldValue(
                            "expenseTo",
                            _dateFormatter(endOfMonth)
                          );
                          setFieldValue("expenseDate", "");
                        }}
                        type="date"
                        disabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <div>Expense Period To</div>
                      <input
                        className="trans-date cj-landing-date"
                        value={values?.expenseTo}
                        name="expenseTo"
                        onChange={(e) => {
                          setFieldValue("expenseTo", e.target.value);
                          setFieldValue("expenseDate", "");
                        }}
                        type="date"
                        disabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-12 pr-1 pl mb-1">
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
                        isDisabled={isEdit}
                      />
                    </div>
                    <div className="col-lg-12 pr pl-2 mb-1">
                      <label>Project Name</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("projectName", valueOption);
                          setFieldValue("costCenter", "");
                        }}
                        value={values?.projectName || ""}
                        isSearchable={true}
                        options={projectName || []}
                        styles={customStyles}
                        placeholder="Project Name"
                        name="projectName"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="projectName"
                        touched={touched}
                      />
                    </div>
                    {/* payment type is removed by miraj bhai */}
                    {/* <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Payment Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("paymentType", valueOption);
                        }}
                        value={values?.paymentType || ""}
                        isSearchable={true}
                        options={paymentType || []}
                        styles={customStyles}
                        name="paymentType"
                        isDisabled={isEdit}
                      />
                      <FormikError
                        errors={errors}
                        name="paymentType"
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-12 pr-1 pl mb-1">
                      <label>Vehicle No. (Optional)</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("vehicle", valueOption);
                        }}
                        value={values?.vehicle || ""}
                        isSearchable={true}
                        options={vehicleDDL || []}
                        styles={customStyles}
                        name="vehicle"
                        isDisabled={isEdit}
                        placeholder="Vehicle"
                      />
                    </div>
                    <div className="col-lg-12 pl pr-1 mb-1 h-narration border-gray">
                      <IInput
                        value={values?.comments1}
                        label="Comments"
                        name="comments1"
                        disabled={isEdit}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-lg-9">
                  <div className={"row bank-journal-custom bj-right"} style={{
                    marginTop: "5px",
                    marginLeft: "0px",
                    marginRight: "0px",
                  }}>
                    <div className="col-lg-3">
                      <label>Expense Date</label>
                      <InputField
                        value={values?.expenseDate || ""}
                        name="expenseDate"
                        placeholder="Expense Date"
                        type="date"
                        min={values?.expenseFrom}
                        max={values?.expenseTo}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Cost Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("costCenter", valueOption);
                          setFieldValue("costElement", "");
                          setFieldValue("accountHead", "");
                          setCostElementDDL([]);
                          if (valueOption) {
                            CostElementDDLApi(
                              profileData.accountId,
                              selectedBusinessUnit.value,
                              valueOption?.value,
                              setCostElementDDL
                            );
                           if(![184].includes(selectedBusinessUnit?.value)){
                            setFieldValue("profitCenter", "");
                            setProfitcenterDDL([]);
                            getProfitcenterDDL(
                              `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${valueOption?.value}&businessUnitId=${selectedBusinessUnit.value}&employeeId=${[184].includes(selectedBusinessUnit?.value) ? profileData?.employeeId : 0}`,
                              (data) => {
                                if (data?.length === 1) {
                                  setFieldValue("profitCenter", data[0]);
                                }
                              }
                            );
                           }
                          }
                        }}
                        value={values?.costCenter || ""}
                        isSearchable={true}
                        options={costCenter || []}
                        styles={customStyles}
                        placeholder="Cost Center"
                        name="costCenter"
                      />
                    </div>
                    <div className="col-lg-3">
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
                        value={values?.costElement || ""}
                        isSearchable={true}
                        options={costElementDDL || []}
                        styles={customStyles}
                        placeholder="Cost Element"
                        name="costElement"
                        isDisabled={!values?.costCenter}
                      />
                    </div>
                    {(bugetHeadWiseBalance?.length > 0) && (
                          <>
                          <div className="col-lg-3">
                          <NewSelect
                            name="accountHead"
                            options={bugetHeadWiseBalance || []}
                            value={values?.accountHead}
                            label="Account Head"
                            onChange={(valueOption) => {
                              setFieldValue("accountHead", valueOption || "");
                              if(valueOption){
                                getAvailableBudgetAdvanceBalance(`/fino/BudgetaryManage/GetAvailableBudgetAdvanceBalance?businessUnitId=${selectedBusinessUnit?.value}&subGlId=${values?.costElement?.subGlId}&accountHeadId=${valueOption?.value}&dteJournalDate=${_todayDate()}`)
                              }

                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        </>
                        )}
                    <div className="col-lg-3">
                      <label>Profit Center</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                        }}
                        value={values?.profitCenter || ""}
                        isSearchable={true}
                        options={profitcenterDDL || []}
                        styles={customStyles}
                        placeholder="Profit Center"
                        name="Profit Center"
                        isDisabled={![184].includes(selectedBusinessUnit?.value) && !values?.costCenter}
                      />
                    </div>

                    {/* <div className="col-lg-3 pl pr-1">
                      <label>Select Expense Type</label>
                      <Select
                        onChange={(valueOption) => {
                          setFieldValue("transaction", valueOption);
                        }}
                        value={values?.transaction || ""}
                        isSearchable={true}
                        options={transaction || []}
                        styles={customStyles}
                        name="transaction"
                        placeholder="Expense Type"
                      />
                    </div> */}

                    {/* <div className="col-lg-3 pl-0 pr-1 mb-2 h-narration border-gray">
                      <IInput
                        value={values?.quantity || ''}
                        label="Quantity"
                        name="quantity"
                        type="number"
                        min="0"
                      />
                    </div> */}

                    <div className="col-lg-3">
                      <label>Expense Description</label>
                      <InputField
                        value={values?.comments2}
                        name="comments2"
                        placeholder="Expense Description"
                        type="text"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Expense Amount</label>
                      <InputField
                        value={values?.expenseAmount}
                        name="expenseAmount"
                        placeholder="Expense Amount"
                        type="number"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Expense Place</label>
                      <InputField
                        value={values?.location || ""}
                        name="location"
                        placeholder="Expense Place"
                        type="text"
                      />
                    </div>

                    <div
                      className="col-lg-3 pl-2 pr-0 mt-3 h-narration border-gray"
                      style={{ marginTop: "-5px" }}
                    >
                      <div className="d-flex justify-content-around align-items-center">
                        <button
                          className="btn btn-primary mr-2"
                          type="button"
                          onClick={() => setOpen(true)}
                          style={{ padding: "4px 5px" }}
                        >
                          Attachment
                        </button>
                        <button
                          type="button"
                          disabled={
                            values?.driverExp
                              ? !values?.expenseDate ||
                                !values?.expenseAmount ||
                                !values?.location ||
                                !values?.userNmae
                              : !values?.expenseDate ||
                                !values?.expenseAmount ||
                                !values?.location ||
                                !values?.costCenter ||
                                !values?.costElement ||
                                !values?.profitCenter ||
                                (bugetHeadWiseBalance?.length > 0 && !values?.accountHead)
                          }
                          className="btn btn-primary"
                          onClick={() => {
                            if (
                              availableBudgetAdvanceBalance[0].numRemainAmount > 0 &&
                              availableBudgetAdvanceBalance[0].numRemainAmount < values?.expenseAmount
                            ) {
                              return toast.warn("Budget Advance Amount is Exceed");
                            }
                            setter(values, () => {
                              setFieldValue("expenseAmount", "");
                              setAvailableBudgetAdvanceBalance(null);
                              setFieldValue("accountHead", "")
                            });
                            setFieldValue("driverExp", false);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </div>
                    {!values?.driverExp && (
                      <div className="col-lg-3 pt-5">
                        <label>Driver Expense</label>
                        <Field
                          name="driverExp"
                          type="checkbox"
                          className="checkbox ml-3 mb-3"
                          checked={values?.driverExp}
                          onChange={(e) => {
                            setFieldValue("driverExp", e.target.checked);
                          }}
                        />
                      </div>
                    )}

                    {values?.driverExp && (
                      <div className="col-lg-3">
                        <label>Employee Name</label>
                        <div style={{ position: "relative" }}>
                          <SearchAsyncSelect
                            selectedValue={values?.userNmae}
                            handleChange={(valueOption) => {
                              setFieldValue("userNmae", valueOption);
                            }}
                            loadOptions={loadUserList}
                            name="userNmae"
                            dependency={"driverExp"}
                          />
                          <i
                            style={{
                              position: "absolute",
                              right: "16px",
                              top: "4px",
                            }}
                            class="far fa-times-circle globalCircleIcon2"
                            onClick={() => {
                              setFieldValue("userNmae", "");
                              setFieldValue("driverExp", false);
                            }}
                          ></i>
                        </div>
                      </div>
                    )}
                    {rowDto.length > 0 && (
                      <div className="col-lg-3 pl-5 pr mb-0 mt-5">
                        <h6>Total Expense : {total?.totalAmount} </h6>
                      </div>
                    )}
                  </div>
                  {/* Table Header input end */}
                  {/* It will be hidden when user select bank tranfer from previous page */}
                  <div className="row">
                    <div className="col-lg-12 pr-0">
                    <div className="table-responsive">
                      <table className={"table mt-1 bj-table"}>
                        <thead className={rowDto.length < 1 && "d-none"}>
                          <tr>
                            <th style={{ width: "20px" }}>SL</th>
                            <th style={{ width: "120px" }}>Expense Date</th>
                            <th>Cost Center</th>
                            <th>Cost Element</th>
                            <th>Account Head</th>
                            <th>Profit Center</th>
                            <th>Expense Place</th>
                            <th>Expense Amount</th>
                            <th>Expense Description</th>
                            <th>Driver Name</th>
                            <th>Attachments</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <div className="text-center">
                                  {_dateFormatter(item?.expenseDate)}
                                </div>
                              </td>
                              <td>{item?.costCenter?.label}</td>
                              <td>{item?.costElement?.label}</td>
                              <td>{item?.accountHead?.label}</td>
                              <td>{item?.profitCenter?.label}</td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.location}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  <InputField
                                    value={item?.expenseAmount}
                                    name="expenseAmount"
                                    placeholder="Expense Amount"
                                    type="number"
                                    onChange={(e) => {
                                      // Line Manager && Supervisor check
                                      if (
                                        location?.state?.isApproval &&
                                        e.target.value > item?.prvExpenseAmount
                                      ) {
                                        return false;
                                      }

                                      const copy = [...rowDto];
                                      copy[index].expenseAmount =
                                        e.target.value;
                                      setRowDto(copy);
                                    }}
                                    min={0}
                                    step="any"
                                  />
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.comments2}
                                </div>
                              </td>
                              <td>
                                <div className="text-left pl-2">
                                  {item?.driverName}
                                </div>
                              </td>
                              <td>
                                <div className="text-center pl-2">
                                  {item?.attachmentLink && (
                                    <IView
                                      clickHandler={() => {
                                        dispatch(
                                          getDownlloadFileView_Action(
                                            item?.attachmentLink
                                          )
                                        );
                                      }}
                                    />
                                  )}
                                </div>
                              </td>
                              <td className="text-center">
                                <IDelete remover={remover} id={index} />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      </div>
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

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={["image/*", "application/pdf"]}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  // on delete
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  expenseAttachment_action(fileObjects).then((data) => {
                    setUploadImage(data);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
                fileObjects={fileObjects}
              />
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
