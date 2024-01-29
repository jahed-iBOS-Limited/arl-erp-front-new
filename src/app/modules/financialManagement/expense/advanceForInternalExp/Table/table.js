import axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Select from "react-select";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import FormikError from "../../../../_helper/_formikError";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import { setAdvanceForInternalExpLandingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import customStyles from "../../../../selectCustomStyle";
import {
  SetGridDataEmpty_action,
  getAdvanceExpGridData,
  setSelectedSBU_action,
} from "../_redux/Actions";
import {
  getCURRENCY,
  getEMP,
  getExpensePlantDDLAction,
  getSBU,
  validationSchema,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ViewRowItem from "./modal";

const initData = {
  checkPublic: false,
  selectedEmp: "",
  plant: "",
  sbu: "",
  currency: "",
  approval: false,
};

const AdvanceForInternalExpLanding = () => {
  const [sbu, setSbu] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [emp, setEmp] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [currency, setCurrency] = useState([]);
  const [currentRow, setCurrentRow] = useState({});
  const [viewModalShow, setViewModalShow] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
      gridData: state?.adInternalExp?.gridData,
      singleData: state?.adInternalExp?.singleData,
      advanceForInternalExpLanding:
        state?.localStorage?.advanceForInternalExpLanding,
    };
  }, shallowEqual);

  const {
    profileData,
    selectedBusinessUnit,
    gridData,
    advanceForInternalExpLanding,
  } = storeData;

  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      getSBU(profileData.accountId, selectedBusinessUnit.value, setSbu);
    }
  }, [profileData, selectedBusinessUnit]);

  const expenseBy_Default = {
    value: profileData?.employeeId,
    label: `${profileData.userName} (${profileData.employeeId})`,
  };

  useEffect(() => {
    if (selectedBusinessUnit.value) {
      getCURRENCY(selectedBusinessUnit.value, setCurrency);
      getExpensePlantDDLAction(
        selectedBusinessUnit.value,
        setPlantDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);

  const viewHandler = (values, approval, pageNo, pageSize) => {
    dispatch(
      getAdvanceExpGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.sbu?.value,
        values?.currency?.value,
        values?.selectedEmp?.value,
        approval,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      advanceForInternalExpLanding?.plant?.value
    ) {
      dispatch(setSelectedSBU_action(advanceForInternalExpLanding?.sbu));
      dispatch(
        getAdvanceExpGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          advanceForInternalExpLanding?.sbu?.value,
          advanceForInternalExpLanding?.currency?.value,
          advanceForInternalExpLanding?.selectedEmp?.value,
          advanceForInternalExpLanding?.approval,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    viewHandler(values, values?.approval, pageNo, pageSize);
  };

  const handleChangePublic = (checkPublic, setFieldValue) => {
    if (checkPublic) {
      getEMP(profileData.accountId, selectedBusinessUnit.value, setEmp);
    } else {
      setEmp([]);
      setFieldValue("selectedEmp", expenseBy_Default);
    }
  };

  const ddlData = (v) => {
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

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          ...advanceForInternalExpLanding,
          selectedEmp:
            advanceForInternalExpLanding?.selectedEmp || expenseBy_Default,
          sbu: advanceForInternalExpLanding?.sbu || sbu[0] || "",
          currency: advanceForInternalExpLanding?.currency || currency[0] || "",
          plant: plantDDL?.[0] || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <ICard title="Advance For Internal Expense">
              {/* Header Start */}
              <div className="row global-form mb-0">
                <div className="col-lg-1 d-flex align-items-center flex-column">
                  <label for="public">Public</label>
                  <input
                    className=""
                    id="public"
                    checked={values?.checkPublic}
                    value={values?.checkPublic}
                    type="checkbox"
                    name="toggle"
                    onChange={(e) => {
                      setFieldValue("checkPublic", e.target.checked);
                      handleChangePublic(e.target.checked, setFieldValue);
                      dispatch(SetGridDataEmpty_action());
                    }}
                  />
                </div>
                {/* changes by miraj bhai */}
                <div className="col-lg-2 pr-0">
                  <label>Expense By</label>
                  <SearchAsyncSelect
                    selectedValue={values?.selectedEmp}
                    handleChange={(valueOption) => {
                      setFieldValue("selectedEmp", valueOption);
                      dispatch(SetGridDataEmpty_action());
                    }}
                    loadOptions={ddlData}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                    isDisabled={!values?.checkPublic}
                    name="selectedEmp"
                  />
                  <FormikError
                    name="selectedEmp"
                    errors={errors}
                    touched={touched}
                  />
                  {/* <label>Request For (Employee)</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("selectedEmp", valueOption);
                      dispatch(SetGridDataEmpty_action());
                    }}
                    value={values?.selectedEmp}
                    options={emp || []}
                    isSearchable={true}
                    styles={customStyles}
                    name="selectedEmp"
                    placeholder="Select EMP"
                    isDisabled={!values?.checkPublic}
                  /> */}
                </div>
                {/* <div className="col-lg-2 pr-0">
                  <label>Plant</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      dispatch(SetGridDataEmpty_action());
                    }}
                    value={values?.plant}
                    options={plantDDL || []}
                    isSearchable={true}
                    styles={customStyles}
                    name="plant"
                    placeholder="Plant"
                  />
                </div> */}
                <div className="col-lg-2 pr-0">
                  <label>Select SBU</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                      dispatch(SetGridDataEmpty_action());
                    }}
                    value={values?.sbu}
                    options={sbu || []}
                    isSearchable={true}
                    styles={customStyles}
                    placeholder="SBU"
                    name="sbu"
                  />
                </div>
                <div className="col-lg-2 pr-0">
                  <label>Select Currency</label>
                  <Select
                    onChange={(valueOption) => {
                      setFieldValue("currency", valueOption);
                      dispatch(SetGridDataEmpty_action());
                    }}
                    value={values?.currency}
                    options={currency || []}
                    isSearchable={true}
                    styles={customStyles}
                    placeholder="CURRENCY"
                    name="currency"
                  />
                </div>
                <div className="col-lg-3 pr-0">
                  <button
                    onClick={() => {
                      dispatch(
                        setAdvanceForInternalExpLandingAction({
                          ...values,
                          approval: false,
                        })
                      );
                      setPageNo(0)
                      setPageSize(20)
                      viewHandler(values, false, 0, 20);
                      setFieldValue("approval", false);
                    }}
                    disabled={
                      !values?.selectedEmp ||
                      !values?.plant ||
                      !values?.sbu ||
                      !values?.currency
                    }
                    className="btn btn-primary mr-2 mt-5"
                  >
                    View
                  </button>
                  <button
                    onClick={() => {
                      dispatch(
                        setAdvanceForInternalExpLandingAction({ ...values })
                      );
                      history.push({
                        pathname:
                          `${window.location.pathname}/create`,
                        state: {
                          selectedSbu: values?.sbu,
                          selectedEmp: values?.selectedEmp,
                          selectedCurrency: values?.currency,
                          checkPublic: values?.checkPublic,
                          selectedPlant: values?.plant,
                        },
                      });
                    }}
                    disabled={
                      !values?.selectedEmp ||
                      !values?.plant ||
                      !values?.sbu ||
                      !values?.currency
                    }
                    className="btn btn-primary mt-5"
                  >
                    Create
                  </button>
                </div>
              </div>

              <div
                style={{
                  paddingBottom: "4px",
                  marginLeft: "-13px",
                  paddingLeft: ".50rem",
                  paddingRight: ".50rem",
                }}
                className="d-flex bank-journal bank-journal-custom"
              >
                <div
                  role="group"
                  aria-labelledby="my-radio-group"
                  className="d-flex justify-content-between align-items-center cashJournalCheckbox mt-2"
                >
                  <div className="bill-submit d-flex justify-content-center ml-2">
                    <label for="Approved">
                      <strong className="mr-2">Approved</strong>
                    </label>
                    <input
                      type="checkbox"
                      id="Approved"
                      name="approval"
                      checked={values?.approval}
                      onChange={(event) => {
                        setFieldValue("approval", event.target.checked);
                        setPageNo(0)
                        setPageSize(20)
                        viewHandler(
                          values,
                          event.target.checked,
                          0,
                          20
                        );
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Table Start */}
              <div className="row">
                <div className="col-lg-12 pr-0 pl-0">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm global-table">
                      <thead>
                        <tr>
                          <th style={{ width: "40px" }}>SL</th>
                          <th style={{ width: "100px" }}>Request Code</th>
                          <th style={{ width: "57px" }}>Request Date</th>
                          {/* <th style={{ width: "57px" }}>Due Date</th> */}
                          <th style={{ width: "80px" }}>Payment Type</th>
                          <th style={{ width: "80px" }}>Exp. Group</th>
                          <th style={{ width: "100px" }}>Requested Amount</th>
                          <th style={{ width: "100px" }}>Approved Amount</th>
                          <th style={{ width: "100px" }}>Paid Amount</th>
                          <th style={{ width: "100px" }}>Bill Code</th>
                          <th style={{ width: "100px" }}>Journal Code</th>
                          {/* <th style={{ width: "100px" }}>
                            Disbursement Center
                          </th> */}
                          <th style={{ width: "100px" }}>Comments</th>
                          {/* new changes for miraj bhai */}
                          <th style={{ width: "85px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody className="advanceInternalExp_table">
                        {loading && <Loading />}
                        {gridData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-left">
                              <div className="pl-2">{item?.advanceCode}</div>
                            </td>
                            <td className="text-center">
                              <div>{_dateFormatter(item?.requestDate)}</div>
                            </td>

                            {/* <td className="text-center">
                              <div>{_dateFormatter(item?.dueDate)}</div>
                            </td> */}

                            <td className="text-left">
                              <div className="pl-2">{item?.instrumentName}</div>
                            </td>
                            <td className="text-left">
                              <div className="pl-2">{item?.expenseGroup}</div>
                            </td>
                            <td className="text-right">
                              <div className="pr-2">
                                {_formatMoney(item?.requestedAmmount)}
                              </div>
                            </td>
                            <td className="text-center">
                              <div> {_formatMoney(item?.approvedAmount)}</div>
                            </td>
                            <td className="text-center">
                              <div> {_formatMoney(item?.numAcpaidAmount)}</div>
                            </td>
                            <td className="text-center">
                              <div> {item?.billCode}</div>
                            </td>
                            <td className="text-center">
                              <div> {item?.journalCode}</div>
                            </td>
                            {/* <td className="text-left">
                              <div className="pl-2">
                                {item?.disbursementCenterName}
                              </div>
                            </td> */}
                            {/* <td className="text-left"><div className="pl-2">{item?.categoryName}</div></td> */}
                            <td className="text-left">
                              <div className="pl-2">{item?.comments}</div>
                            </td>

                            {/* new changes for miraj bhai */}
                            <td>
                              <div className="d-flex justify-content-around">
                                <span>
                                  <IView
                                    title={"View"}
                                    clickHandler={() => {
                                      setCurrentRow(item)
                                      setViewModalShow(true)
                                    }}
                                  />
                                </span>
                                {!values?.approval && (
                                  <span
                                    className="edit"
                                    onClick={() =>
                                      history.push({
                                        pathname: `${window.location.pathname}/edit/${item.advanceId}`,
                                        state: {
                                          item,
                                        },
                                      })
                                    }
                                  >
                                    <IEdit />
                                  </span>
                                )}
                                {!values?.approval && (
                                  <span
                                    className="edit"
                                    onClick={() =>
                                      history.push({
                                        pathname: `${window.location.pathname}/approval/${item?.advanceId}`,
                                        state: {
                                          item,
                                          approval: true,
                                        },
                                      })
                                    }
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
                  {gridData?.data?.length > 0 && (
                    <PaginationTable
                      count={gridData?.totalCount}
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
                </div>
              </div>
              <IViewModal
                show={viewModalShow}
                onHide={() => setViewModalShow(false)}
              // title="Advance For Internal Expense"
              >
                <ViewRowItem children={currentRow} />
              </IViewModal>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default AdvanceForInternalExpLanding;
