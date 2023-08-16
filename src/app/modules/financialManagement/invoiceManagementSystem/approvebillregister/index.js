import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../_helper/_select";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../_metronic/_partials/controls";
import {
  getPlantDDL,
  GetBillTypeDDL,
  GetBillRegister_api,
  getSbuDDL,
  rejectBillRegister_api,
  BillApproved_api,
  getCostCenterDDL,
} from "./helper";
import GridData from "./grid";
import Loading from "./../../../_helper/_loading";
import { setApprovebillregLandingAction } from "../../../_helper/reduxForLocalStorage/Actions";
import IConfirmModal from "./../../../_helper/_confirmModal";
import PaginationTable from "./../../../_helper/_tablePagination";
import PaginationSearch from "./../../../_helper/_search";
import InputField from "../../../_helper/_inputField";
import moment from "moment";
import { _dateFormatter } from "../../../_helper/_dateFormate";

const initData = {
  sbu: "",
  billType: "",
  plant: "",
  costCenter: "",
  status: {
    value: 1,
    label: "Pending",
  },
};
// Validation schema
const validationSchema = Yup.object().shape({});

function ApproveapprovebillregLanding() {
  const [SBUDDL, setSBUDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [billTypeDDL, setBillTypeDDL] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [gridDataArry, setGridDataArry] = useState([]);
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [isReject, setIsReject] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const approvebillregLanding = useSelector((state) => {
    return state.localStorage.approvebillregLanding;
  }, shallowEqual);

  useEffect(() => {
    if (gridDataArry?.data?.length > 0) {
      setRowDto(gridDataArry?.data);
    } else {
      setRowDto([]);
    }
  }, [gridDataArry]);

  const girdDataFunc = (values, pageSizeP, pageNoP, searchTax) => {
    const isPageSize = pageSizeP ? pageSizeP : pageSize;
    const isPageNo = pageNoP ? pageNoP : pageNo;
    GetBillRegister_api(
      values,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.billType?.value,
      values?.status?.value,
      values?.plant?.value,
      values?.sbu?.value,
      values?.costCenter?.value,
      isPageSize,
      isPageNo,
      setGridDataArry,
      setDisabled,
      searchTax
    );
  };
  const ViewOnChangeHandler = (values) => {
    girdDataFunc(values);
  };

  // All item select
  const allGridCheck = (value, gridData) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    return modifyGridData;
  };
  // one item select
  const itemSlectedHandler = (value, index, gridData) => {
    const copyRowDto = [...gridData];
    copyRowDto[index].itemCheck = !copyRowDto[index]?.itemCheck;
    return copyRowDto;
  };
  const atListOneItemSelectGridData = rowDto?.some((itm) => itm?.itemCheck);

  const approveBillHandlerFunc = (values) => {
    const itemCheckTrue = rowDto
      ?.filter((item) => item?.itemCheck)
      .map((itm) => ({
        billId: itm?.billRegisterId,
        unitId: selectedBusinessUnit?.value,
        billTypeId: itm?.billType,
        approvedAmount: itm?.monTotalAmount,
        remarks: "",
      }));

    const payload = {
      bill: itemCheckTrue,
      row: [],
    };

    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to Approve Bill`,
      yesAlertFunc: () => {
        BillApproved_api(
          profileData?.userId,
          payload,
          setDisabled,
          girdDataFunc,
          values
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const rejectSaveHandler = (values, laingValues, gridItem, setDisabled) => {
    const itemCheckTrue = rowDto
      ?.filter((item) => item?.itemCheck)
      .map((itm) => itm?.billRegisterId);
    // singele and mutiple reject

    const payload = {
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      typeId: 1,
      remarks: values?.remarks,
      billIds: gridItem?.billRegisterId
        ? gridItem?.billRegisterId
        : itemCheckTrue,
      actionById: profileData?.userId,
    };
    rejectBillRegister_api(
      payload,
      setDisabled,
      girdDataFunc,
      laingValues,
      setIsReject
    );
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(values, pageSize, pageNo);
  };
  const paginationSearchHandler = (searchValue, values) => {
    girdDataFunc(values, pageSize, pageNo, searchValue);
  };

  const formikRef = React.useRef(null);

  useEffect(() => {
    const values = approvebillregLanding || initData;
    if (formikRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const isRedirectHR = urlParams.get("isRedirectHR");
      if (!isRedirectHR) {
        formikRef.current.setValues(values);
        if (values?.sbu?.value) {
          getCostCenterDDL(
            profileData.accountId,
            selectedBusinessUnit.value,
            values?.sbu?.value,
            setCostCenterDDL
          );
        }
        if (values?.plant?.value) {
          girdDataFunc(values);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSbuDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setSBUDDL,
        (sbuList) => {
          SetRedirectHRValues(sbuList);
        }
      );
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
      GetBillTypeDDL(setBillTypeDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const SetRedirectHRValues = (sbuList) => {
    if (formikRef.current) {
      const urlParams = new URLSearchParams(window.location.search);
      const isRedirectHR = urlParams.get("isRedirectHR");
      if (isRedirectHR) {
        const firstDayOfPreviousMonth = moment()
          .subtract(2, "months")
          .startOf("month");
        const lestDayOfCurrentMonth = moment().endOf("month");
        const redirectHRValues = {
          fromDate: _dateFormatter(firstDayOfPreviousMonth),
          toDate: _dateFormatter(lestDayOfCurrentMonth),
          sbu: sbuList?.[0],
          costCenter: {
            value: 0,
            label: "All",
          },
          billType: { value: 0, label: "All" },
          plant: { value: 0, label: "All" },
          status: {
            value: 1,
            label: "Pending",
          },
        };
        formikRef.current.setValues(redirectHRValues);
        girdDataFunc(redirectHRValues);
      }
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{}}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
        innerRef={formikRef}
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
          <div className=''>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Approve Bill Register"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {disabled && <Loading />}
                <Form className='form form-label-right'>
                  <div className='row global-form global-form-custom'>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='sbu'
                        options={SBUDDL || []}
                        value={values?.sbu}
                        label='Select SBU'
                        onChange={(valueOption) => {
                          setFieldValue("sbu", valueOption);
                          setFieldValue("costCenter", "");
                          setRowDto([]);
                          getCostCenterDDL(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setCostCenterDDL
                          );
                        }}
                        placeholder='Select SBU'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='plant'
                        options={
                          [{ value: 0, label: "All" }, ...plantDDL] || []
                        }
                        value={values?.plant}
                        label='Select Plant'
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setRowDto([]);
                        }}
                        placeholder='Select Plant'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='billType'
                        options={
                          [{ value: 0, label: "All" }, ...billTypeDDL] || []
                        }
                        value={values?.billType}
                        label='Bill Type'
                        onChange={(valueOption) => {
                          setFieldValue("billType", valueOption);
                          setRowDto([]);
                        }}
                        placeholder='Bill Type'
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className='col-lg-3'>
                      <NewSelect
                        name='status'
                        options={[
                          {
                            value: 1,
                            label: "Pending",
                          },
                          {
                            value: 2,
                            label: "Approve",
                          },
                          {
                            value: 3,
                            label: "Reject",
                          },
                        ]}
                        value={values?.status}
                        label='Status'
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                          setRowDto([]);
                        }}
                        placeholder='Status'
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className='col-lg-3'>
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name='fromDate'
                        placeholder='From Date'
                        type='date'
                      />
                    </div>
                    <div className='col-lg-3'>
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name='toDate'
                        placeholder='To Date'
                        type='date'
                      />
                    </div>
                    {selectedBusinessUnit?.value === 17 && (
                      <div className='col-lg-3'>
                        <NewSelect
                          name='costCenter'
                          options={costCenterDDL || []}
                          value={values?.costCenter || ""}
                          label='Cost Center'
                          onChange={(valueOption) => {
                            setFieldValue("costCenter", valueOption);
                            setRowDto([]);
                          }}
                          placeholder='Cost Center'
                          isDisabled={!values?.sbu}
                        />
                      </div>
                    )}

                    <div className='col-lg-3' style={{ marginTop: "19px" }}>
                      <button
                        onClick={() => {
                          dispatch(setApprovebillregLandingAction(values));
                          ViewOnChangeHandler(values);
                        }}
                        className='btn btn-primary ml-2 mr-2'
                        type='button'
                        disabled={!values?.plant || !values?.billType}
                      >
                        View
                      </button>
                      {values?.status?.value === 1 && (
                        <button
                          onClick={() => {
                            dispatch(setApprovebillregLandingAction(values));
                            approveBillHandlerFunc(values);
                          }}
                          className='btn btn-primary ml-2 mr-2'
                          type='button'
                          disabled={
                            !values?.plant ||
                            !values?.billType ||
                            !atListOneItemSelectGridData
                          }
                        >
                          Approve Bill
                        </button>
                      )}
                      {/* {values?.status?.value === 1 && (
                        <button
                          onClick={() => {
                            dispatch(setApprovebillregLandingAction(values));
                            setIsReject(true);
                          }}
                          className="btn btn-primary ml-2 mt-4 mr-2"
                          type="button"
                          disabled={
                            !values?.plant ||
                            !values?.billType ||
                            !atListOneItemSelectGridData
                          }
                        >
                          Reject
                        </button>
                      )} */}
                    </div>
                  </div>
                  {/* <div className="row global-form global-form-custom py-6"></div> */}
                  <PaginationSearch
                    placeholder='Bill Register Code Search'
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />

                  <GridData
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    allGridCheck={allGridCheck}
                    itemSlectedHandler={itemSlectedHandler}
                    values={values}
                    girdDataFunc={girdDataFunc}
                    isReject={isReject}
                    setIsReject={setIsReject}
                    rejectSaveHandler={rejectSaveHandler}
                  />

                  {rowDto?.length > 0 && (
                    <PaginationTable
                      count={gridDataArry?.totalCount}
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
          </div>
        )}
      </Formik>
    </>
  );
}

export default ApproveapprovebillregLanding;
