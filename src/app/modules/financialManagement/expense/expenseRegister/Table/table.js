/* eslint-disable jsx-a11y/no-distracting-elements */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FormikError from "../../../../_helper/_formikError";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import {
  BillSubmit_Api,
  getCountry,
  getCurrency,
  getExpenseLandingPagination,
  // getExpensePlantDDLAction,
  getSBU,
} from "../helper";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import Loading from "./../../../../_helper/_loading";
import NewSelect from "./../../../../_helper/_select";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { setPersonalExpRegLandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";

// Validation schema
const validationSchema = Yup.object().shape({});
const ExpenseRegisterLanding = () => {
  const initData = {
    checkPublic: false,
    internalAccount: false,
    expenseFor: "",
    plant: "",
    sbu: "",
    country: "",
    currency: "",
    unsubmitedExpense: true,
    approval: false,
    billSubmit: false,
    supervisor: { value: true, label: "Supervisor" },
    approveType: { value: 0, label: "Regular" },
    fromDate: "",
    toDate: "",
  };

  const dispatch = useDispatch();
  const formikRef = React.useRef(null);
  const [loading, setLoading] = useState(false);
  const [sbu, setSbu] = useState([]);
  // const [plantDDL, setPlantDDL] = useState([]);
  // const [expenseFor, setExpenseFor] = useState([]);
  const [country, setCountry] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [viewGrid, setViewGrid] = useState([]);

  // billSubmitBtn
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  //ls
  const [rowDto, setRowDto] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const history = useHistory();
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      personalExpRegLanding: state?.localStorage?.personalExpRegLanding,
    };
  }, shallowEqual);
  const {
    profileData,
    selectedBusinessUnit,
    personalExpRegLanding,
  } = storeData;

  useEffect(() => {
    if (viewGrid?.data?.length > 0) {
      const newRowDto = viewGrid?.data?.map((itm) => ({
        ...itm,
        itemCheck: false,
      }));
      setRowDto(newRowDto);
    } else {
      setRowDto([]);
    }
  }, [viewGrid]);

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = rowDto?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
    // btn hide conditon
    const bllSubmitBtn = modifyGridData.some((itm) => itm.itemCheck === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };
  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);
    // btn hide conditon
    const bllSubmitBtn = copyRowDto.some((itm) => itm.itemCheck === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  const gridDataCB = (values, pageNo, pageSize, billSubmit, approval) => {
    if (values?.sbu && values?.country && values?.currency) {
      getExpenseLandingPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.expenseFor?.value || profileData?.employeeId,
        values?.sbu?.value,
        values?.country?.value,
        values?.currency?.value,
        values?.supervisor?.value,
        billSubmit,
        approval,
        values?.fromDate,
        values?.toDate,
        values?.approveType?.value,
        setViewGrid,
        setLoading,
        pageNo,
        pageSize
      );
    }
  };

  const girdDataFunc = (values, pageNo, pageSize) => {
    console.log("girdDataFunc", values);
    if (values?.billSubmit) {
      gridDataCB(values, pageNo, pageSize, true, false);
    } else if (values?.approval) {
      gridDataCB(values, pageNo, pageSize, true, true);
    } else {
      gridDataCB(values, pageNo, pageSize, false, false);
    }
  };

  // billSubmitlHandler btn submit handler
  const billSubmitlHandler = (setFieldValue, values) => {
    const modifyFilterRowDto = rowDto.filter((itm) => itm.itemCheck === true);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected buill submit`,
      yesAlertFunc: () => {
        const payload = modifyFilterRowDto.map((itm) => ({
          expenseId: itm.expenseId,
          isSubmitted: true,
          billSubmittedBy: profileData.userId,
        }));
        BillSubmit_Api(payload, girdDataFunc, values, pageNo, pageSize);
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
    //
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(values, pageNo, pageSize);
  };

  const expenseBy_Default = {
    value: profileData?.employeeId,
    label: `${profileData.userName} (${profileData.employeeId})`,
  };

  const loadSupervisorAndLineManagerList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  // useEffect for getExpenseFor from helper start
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSBU(profileData.accountId, selectedBusinessUnit.value, setSbu);
      getCountry(setCountry);
      getCurrency(selectedBusinessUnit.value, setCurrency);
      // getExpensePlantDDLAction(
      //   profileData?.accountId,
      //   selectedBusinessUnit.value,
      //   setPlantDDL
      // );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (formikRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const isRedirectHR = urlParams.get("isRedirectHR");
      if (isRedirectHR) {
        const initialRedirectHR = {
          ...initData,
          expenseFor: expenseBy_Default,
          sbu: sbu[0] || "",
          country: country[17] || "",
          currency: currency[0] || "",
          plant: "",
        };
        formikRef.current.setValues(initialRedirectHR);

        if (
          initialRedirectHR?.sbu?.value &&
          initialRedirectHR?.country?.value &&
          initialRedirectHR?.currency?.value &&
          initialRedirectHR?.plant?.value
        ) {
          girdDataFunc(initialRedirectHR, pageNo, pageSize);
        }
      } else {
        const initialValues = {
          ...initData,
          ...personalExpRegLanding,
          expenseFor: personalExpRegLanding?.expenseFor
            ? personalExpRegLanding?.expenseFor
            : expenseBy_Default,
          sbu: personalExpRegLanding?.sbu
            ? personalExpRegLanding?.sbu
            : sbu[0] || "",
          country: personalExpRegLanding?.country
            ? personalExpRegLanding?.country
            : country[17] || "",
          currency: personalExpRegLanding?.currency
            ? personalExpRegLanding?.currency
            : currency[0] || "",
          plant: "",
        };
        formikRef.current.setValues(initialValues);
        if (
          initialValues?.sbu?.value &&
          initialValues?.country?.value &&
          initialValues?.currency?.value &&
          initialValues?.plant?.value
        ) {
          girdDataFunc(initialValues, pageNo, pageSize);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sbu, country, currency]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Internal Expense"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      dispatch(setPersonalExpRegLandingAction(values));
                      history.push({
                        pathname: `${window.location.pathname}/create`,
                        state: {
                          selectedExpense: values?.expenseFor,
                          selectedSbu: values?.sbu,
                          selectedCountry: values?.country,
                          selectedCurrency: values?.currency,
                          selectedPlant: values?.plant,
                          ...values,
                        },
                      });
                    }}
                    className="btn btn-primary"
                    disabled={
                      !values?.expenseFor?.value ||
                      !values?.sbu?.value ||
                      !values?.country?.value ||
                      !values?.currency?.value
                      // || !values?.plant?.value
                    }
                  >
                    Create
                  </button>
                </CardHeaderToolbar>

                <marquee
                  direction="left"
                  style={{
                    fontSize: "15px",
                    fontWeight: "bold",
                    color: "red",
                    position: "absolute",
                    right: "95px",
                  }}
                >
                  Please select respective unit for 'Expense Approve' & See the
                  TADA Policy before submitting your expenses
                </marquee>
              </CardHeader>
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-1 d-flex pr-0 pl-0 justify-content-around">
                      <div className="d-flex flex-column mr-1 align-items-center">
                        <label>Public</label>
                        <input
                          checked={values?.checkPublic}
                          value={values?.checkPublic}
                          type="checkbox"
                          name="checkPublic"
                          onChange={(e) => {
                            setFieldValue("checkPublic", e.target.checked);
                            setRowDto([]);
                            if (e.target.checked) {
                              setFieldValue("expenseFor", "");
                            } else {
                              setFieldValue("expenseFor", expenseBy_Default);
                            }
                          }}
                          className="ml-2"
                        />
                      </div>
                    </div>

                    {/* <div className="col-lg-2 pr-0">
                      <NewSelect
                        name="expenseFor"
                        options={expenseFor || []}
                        value={values?.expenseFor}
                        label="Expense By"
                        onChange={(valueOption) => {
                          setFieldValue("expenseFor", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Expense By"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.checkPublic}
                      />
                    </div> */}
                    <div className="col-lg-2 pr-0">
                      <label>Expense By</label>
                      <SearchAsyncSelect
                        selectedValue={values?.expenseFor}
                        handleChange={(valueOption) => {
                          setFieldValue("expenseFor", valueOption);
                          setRowDto([]);
                        }}
                        loadOptions={loadSupervisorAndLineManagerList}
                        placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                      />
                      <FormikError
                        name="expenseFor"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {/* <div className="col-lg-2 pr-0">
                      <NewSelect
                        name="plant"
                        options={plantDDL || []}
                        value={values?.plant}
                        label="Plant"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("plant", valueOption);
                        }}
                        placeholder="Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div> */}
                    <div className="col-lg-2 pr-0">
                      <NewSelect
                        name="sbu"
                        options={sbu || []}
                        value={values?.sbu}
                        label="SBU"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("sbu", valueOption);
                        }}
                        placeholder="SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 pr-0">
                      <NewSelect
                        name="country"
                        options={country || []}
                        value={values?.country}
                        label="Country"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("country", valueOption);
                        }}
                        placeholder="Country"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-2 pr-0">
                      <NewSelect
                        name="currency"
                        options={currency || []}
                        value={values?.currency}
                        label="Currency"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("currency", valueOption);
                        }}
                        placeholder="Currency"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3 d-flex align-items-center justify-content-end mt-4">
                      <button
                        className="btn btn-success pointer"
                        onClick={() => {
                          window.open(`https://drive.google.com/file/d/1WNjJxwpSD8j-wvFkvLv7vn2CCqcv-pSM/view`, "_blank");
                          // dispatch(
                          //   getDownlloadFileView_Action(
                          //     "638323656050908814_ARL_TADA_POLICY.pdf",
                          //     null,
                          //     null,
                          //     setLoading
                          //   )
                          // );
                        }}
                      >
                        TADA Policy
                      </button>
                    </div>

                    <div className="col-lg-5 col-xl-5 d-flex justify-content-between align-items-center mt-2 p-0 flex-wrap ">
                      <div
                        role="group"
                        aria-labelledby="my-radio-group"
                        className=" mt-1 d-flex"
                      >
                        <div className="bill-submit d-flex justify-content-center align-items-center mr-4">
                          <input
                            className="mr-1"
                            id="unsubmitedExpense"
                            type="checkbox"
                            checked={values?.unsubmitedExpense}
                            onChange={(event) => {
                              setRowDto([]);
                              setFieldValue("unsubmitedExpense", true);
                              setFieldValue("approval", false);
                              setFieldValue("billSubmit", false);
                              setPageNo(0);
                              setPageSize(20);
                              girdDataFunc(
                                {
                                  ...values,
                                  unsubmitedExpense: true,
                                  billSubmit: false,
                                  approval: false,
                                },
                                0,
                                20
                              );
                            }}
                          />
                          <label for="unsubmitedExpense" className="pt-0">
                            <strong>Unsubmited Expense</strong>
                          </label>
                        </div>
                        <div className="bill-submit d-flex justify-content-center ml-2 align-items-center mr-4">
                          <input
                            className="mr-1"
                            id="submitedExpense"
                            type="checkbox"
                            checked={values?.billSubmit}
                            onChange={(event) => {
                              setRowDto([]);
                              const unsubmitedExpense = event.target.checked
                                ? false
                                : true;
                              setFieldValue("billSubmit", event.target.checked);
                              setFieldValue("approval", false);
                              setFieldValue(
                                "unsubmitedExpense",
                                unsubmitedExpense
                              );
                              setPageNo(0);
                              setPageSize(20);
                              girdDataFunc(
                                {
                                  ...values,
                                  billSubmit: event.target.checked,
                                  approval: false,
                                  unsubmitedExpense: unsubmitedExpense,
                                },
                                0,
                                20
                              );
                            }}
                          />
                          <label for="submitedExpense" className="pt-0">
                            <strong>Unapproved Expense</strong>
                          </label>
                        </div>

                        <div className="bill-submit d-flex justify-content-center ml-2 align-items-center mr-4">
                          <input
                            className="mr-1"
                            type="checkbox"
                            id="approvedExpense"
                            checked={values?.approval}
                            onChange={(event) => {
                              setRowDto([]);
                              const unsubmitedExpense = event.target.checked
                                ? false
                                : true;
                              setFieldValue("approval", event.target.checked);
                              setFieldValue("billSubmit", false);
                              setFieldValue(
                                "unsubmitedExpense",
                                unsubmitedExpense
                              );
                              setPageNo(0);
                              setPageSize(20);

                              girdDataFunc(
                                {
                                  ...values,
                                  unsubmitedExpense: unsubmitedExpense,
                                  billSubmit: false,
                                  approval: event.target.checked,
                                },
                                0,
                                20
                              );
                            }}
                          />
                          <label for="approvedExpense" className="pt-0">
                            <strong>Approved Expense</strong>
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-2 pr-0">
                      <NewSelect
                        name="supervisor"
                        options={[
                          { value: true, label: "Supervisor" },
                          { value: false, label: "Line Manager" },
                        ]}
                        value={values?.supervisor}
                        label="View As"
                        onChange={(valueOption) => {
                          setRowDto([]);
                          setFieldValue("supervisor", valueOption);
                        }}
                        placeholder="View As"
                        errors={errors}
                        touched={touched}
                        isClearable={false}
                      />
                    </div>
                    {[521235, 1056, 470548].includes(profileData?.userId) && (
                      <div className="col-lg-2 pr-0">
                        <NewSelect
                          name="approveType"
                          options={[
                            { value: 0, label: "Regular" },
                            { value: 1, label: "Forcefully " },
                          ]}
                          value={values?.approveType}
                          label="Approve Type"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("approveType", valueOption);
                          }}
                          placeholder="Approve Type"
                          errors={errors}
                          touched={touched}
                          isClearable={false}
                        />
                      </div>
                    )}
                    {values?.approveType?.value === 1 && (
                      <FromDateToDateForm
                        obj={{ values, setFieldValue, colSize: "col-lg-2" }}
                      />
                    )}
                    <div className=" col d-flex justify-content-end align-items-end pr-0 mt-4">
                      {!values?.billSubmit && !values?.approval && (
                        <button
                          onClick={() => {
                            billSubmitlHandler(setFieldValue, values);
                          }}
                          className="btn btn-primary ml-1"
                          disabled={billSubmitBtn}
                        >
                          Submited Expense
                        </button>
                      )}
                      {console.log("error", errors)}
                      <button
                        onClick={() => {
                          console.log("values", values);
                          dispatch(
                            setPersonalExpRegLandingAction({
                              ...values,
                            })
                          );
                          console.log("values2", values);
                          setPageNo(0);
                          setPageSize(20);
                          girdDataFunc(
                            {
                              ...values,
                            },
                            0,
                            20
                          );
                        }}
                        disabled={
                          !values?.expenseFor ||
                          !values?.sbu ||
                          !values?.country ||
                          !values?.currency ||
                          !values?.supervisor
                        }
                        className="btn btn-primary ml-2"
                      >
                        View
                      </button>
                    </div>
                  </div>

                  {/* Table Start */}
                  <div className="row">
                    <div className="col-lg-12">
                      {loading && <Loading />}
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered  bj-table bj-table-landing table-font-size-sm">
                          <thead>
                            <tr>
                              {!values?.billSubmit && !values?.approval && (
                                <th style={{ width: "20px" }}>
                                  <input
                                    type="checkbox"
                                    id="parent"
                                    onChange={(event) => {
                                      allGridCheck(event.target.checked);
                                    }}
                                  />
                                </th>
                              )}

                              <th style={{ width: "40px" }}>SL</th>
                              <th style={{ width: "100px" }}>Expense Code</th>
                              <th style={{ width: "100px" }}>Expense By</th>
                              {values?.approval && (
                                <th style={{ width: "100px" }}>Bill Code</th>
                              )}

                              <th style={{ width: "100px" }}>From</th>
                              <th style={{ width: "100px" }}>To</th>
                              {/* <th style={{ width: "80px" }}>Employee ID</th> */}
                              <th style={{ width: "100px" }}>
                                Disbursement Center
                              </th>
                              <th style={{ width: "100px" }}>Total Expense</th>
                              <th style={{ width: "40px" }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody className="expenseRegisterTable">
                            {rowDto?.map((item, index) => (
                              <tr key={index}>
                                {!values?.billSubmit && !values?.approval && (
                                  <td>
                                    <input
                                      id="itemCheck"
                                      type="checkbox"
                                      className=""
                                      value={item.itemCheck}
                                      checked={item.itemCheck}
                                      name={item.itemCheck}
                                      onChange={(e) => {
                                        //setFieldValue("itemCheck", e.target.checked);
                                        itemSlectedHandler(
                                          e.target.checked,
                                          index
                                        );
                                      }}
                                    />
                                  </td>
                                )}

                                <td className="text-center">{index + 1}</td>
                                <td>
                                  <div className="pl-2">
                                    {item?.expenseCode}
                                  </div>
                                </td>
                                <td>
                                  <div className="pl-2">{item?.expenseBy}</div>
                                </td>
                                {values?.approval && (
                                  <td>
                                    <div className="pl-2">{item?.billCode}</div>
                                  </td>
                                )}

                                <td>
                                  <div className="pl-2">
                                    {_dateFormatter(item?.fromDate)}
                                  </div>
                                </td>
                                <td className="pl-2">
                                  <div className="pl-2">
                                    {_dateFormatter(item?.toDate)}
                                  </div>
                                </td>

                                <td>
                                  <div className="pl-2">
                                    {item?.disbursementCenterName}
                                  </div>
                                </td>
                                <td>
                                  <div className="pr-2 text-right">
                                    {/* "Supervisor === true" or Line Manager===false  */}
                                    {(values?.supervisor?.value
                                      ? item?.totalSupervisorAmount ||
                                        item?.totalAmount
                                      : item?.totalLineManagerAmount ||
                                        item?.totalSupervisorAmount) ||
                                      item?.totalAmount}
                                  </div>
                                </td>
                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="view">
                                      <IView
                                        clickHandler={() =>
                                          history.push({
                                            pathname: `/financial-management/expense/expense-register/view/${item?.expenseId}`,
                                            state: {
                                              item,
                                              selectedExpense:
                                                values?.expenseFor,
                                              selectedSbu: values?.sbu,
                                              selectedCountry: values?.country,
                                              selectedCurrency:
                                                values?.currency,
                                              selectedPlant: values?.plant,
                                            },
                                          })
                                        }
                                      />
                                    </span>

                                    {/* billSubmit true */}
                                    <span
                                      className={
                                        values?.approval || values?.billSubmit
                                          ? "d-none"
                                          : "edit"
                                      }
                                      onClick={() => {
                                        history.push({
                                          pathname: `${window.location.pathname}/edit/${item?.expenseId}`,
                                          state: {
                                            item,
                                            ...values,
                                            selectedExpense: values?.expenseFor,
                                            selectedSbu: values?.sbu,
                                            selectedCountry: values?.country,
                                            selectedCurrency: values?.currency,
                                            selectedPlant: values?.plant,
                                          },
                                        });
                                        dispatch(
                                          setPersonalExpRegLandingAction({
                                            ...values,
                                          })
                                        );
                                      }}
                                    >
                                      <IEdit />
                                    </span>
                                    {values?.billSubmit &&
                                      item?.isApprovedPermit && (
                                        <span
                                          onClick={() => {
                                            dispatch(
                                              setPersonalExpRegLandingAction({
                                                ...values,
                                              })
                                            );
                                            history.push({
                                              pathname: `${window.location.pathname}/approval/${item?.expenseId}`,
                                              state: {
                                                item,
                                                ...values,
                                                selectedExpense:
                                                  values?.expenseFor,
                                                selectedSbu: values?.sbu,
                                                selectedCountry:
                                                  values?.country,
                                                selectedCurrency:
                                                  values?.currency,
                                                selectedPlant: values?.plant,
                                                isApproval: true,
                                              },
                                            });
                                          }}
                                        >
                                          <OverlayTrigger
                                            overlay={
                                              <Tooltip id="cs-icon">
                                                {"Approval"}
                                              </Tooltip>
                                            }
                                          >
                                            <span>
                                              <i
                                                class="far fa-check-circle pointer approval"
                                                style={{ fontSize: "14px" }}
                                              ></i>
                                            </span>
                                          </OverlayTrigger>
                                        </span>
                                      )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {/* Table End */}
                  {viewGrid?.data?.length > 0 && (
                    <PaginationTable
                      count={viewGrid?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                      rowsPerPageOptions={[
                        5,
                        10,
                        20,
                        50,
                        100,
                        200,
                        300,
                        400,
                        500,
                      ]}
                    />
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default ExpenseRegisterLanding;
