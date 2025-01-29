import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import * as Yup from "yup";
import PaginationSearch from "../../../_helper/_search";
import IViewModal from "../../../_helper/_viewModal";
import { setBillregisterLandingAtion } from "../../../_helper/reduxForLocalStorage/Actions";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "./../../../../../_metronic/_partials/controls";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import PaginationTable from "./../../../_helper/_tablePagination";
import { _todayDate } from "./../../../_helper/_todayDate";
import GridData from "./grid";
import {
  GetBillTypeDDL,
  getBillRegisterPagination_api,
  getCostCenterDDL,
  getPlantDDL,
  getSbuDDL,
} from "./helper";
import OthersBillForm from "./othersBill/Form/addEditForm";
const initData = {
  sbu: "",
  billType: "",
  plant: "",
  costCenter: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
// Validation schema
const validationSchema = Yup.object().shape({});

function BillregisterLanding() {
  const [costCenterDDL, setCostCenterDDL] = useState([]);
  const [plantDDL, setPlantDDL] = useState([]);
  const [SBUDDL, setSBUDDL] = useState([]);
  const [billTypeDDL, setBillTypeDDL] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [isMOdalShow, setModalShowState] = useState(false);
  const history = useHistory();
  const dispatch = useDispatch();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const billregisterLanding = useSelector((state) => {
    return state.localStorage.billregisterLanding;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSbuDDL(profileData.accountId, selectedBusinessUnit.value, setSBUDDL);
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantDDL
      );
      GetBillTypeDDL(setBillTypeDDL);
    }
  }, [profileData, selectedBusinessUnit]);

  const girdDataFunc = (pageNo, pageSize, values, searchValue = "") => {
    getBillRegisterPagination_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.plant?.value,
      values?.sbu?.value,
      values?.costCenter?.value,
      values?.billType?.value,
      pageNo,
      pageSize,
      setRowDto,
      setDisabled,
      values,
      searchValue
    );
  };
  const ViewOnChangeHandler = (values) => {
    girdDataFunc(pageNo, pageSize, values);
  };
  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    girdDataFunc(pageNo, pageSize, values, searchValue);
  };
  useEffect(() => {
    if (billregisterLanding?.sbu?.value) {
      girdDataFunc(pageNo, pageSize, billregisterLanding);
      getCostCenterDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        billregisterLanding?.sbu?.value,
        setCostCenterDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cb = () => {
    getBillRegisterPagination_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      billregisterLanding?.plant?.value,
      billregisterLanding?.sbu?.value,
      billregisterLanding?.costCenter?.value,
      billregisterLanding?.billType?.value,
      pageNo,
      pageSize,
      setRowDto,
      setDisabled,
      billregisterLanding
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={billregisterLanding || initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          <div className="">
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Bill Register"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      dispatch(setBillregisterLandingAtion(values));
                      // if (values?.billType?.value === 12) {
                      //   setModalShowState(true)
                      // } else {
                      history.push({
                        pathname: `${window.location.pathname}/create`,
                        state: values,
                      });
                      // }
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                    disabled={
                      !values?.sbu || !values?.plant || !values?.billType?.label
                    }
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {disabled && <Loading />}
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom">
                    <div className="col-lg-3">
                      <NewSelect
                        name="sbu"
                        options={SBUDDL || []}
                        value={values?.sbu}
                        label="Select SBU"
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
                        placeholder="Select SBU"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="plant"
                        options={
                          [{ value: 0, label: "All" }, ...plantDDL] || []
                        }
                        value={values?.plant}
                        label="Select Plant"
                        onChange={(valueOption) => {
                          setFieldValue("plant", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Select Plant"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="billType"
                        options={billTypeDDL || []}
                        value={values?.billType}
                        label="Bill Type"
                        onChange={(valueOption) => {
                          setFieldValue("billType", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Bill Type"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                      />
                    </div>
                    {selectedBusinessUnit?.value === 17 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="costCenter"
                          options={costCenterDDL || []}
                          value={values?.costCenter || ""}
                          label="Cost Center"
                          onChange={(valueOption) => {
                            setFieldValue("costCenter", valueOption);
                            setRowDto([]);
                          }}
                          placeholder="Cost Center"
                          isDisabled={!values?.sbu}
                        />
                      </div>
                    )}

                    <div className="col-lg-1 mr-1">
                      <button
                        onClick={() => {
                          dispatch(setBillregisterLandingAtion(values));
                          ViewOnChangeHandler(values);
                        }}
                        style={{ marginTop: "19px" }}
                        className="btn btn-primary ml-2 mr-2"
                        type="button"
                        disabled={!values?.plant || !values?.billType}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  <div>
                    <div className="po_custom_search">
                      <PaginationSearch
                        isDisabledFiled={false}
                        placeholder="Partner & Register Code Search"
                        paginationSearchHandler={paginationSearchHandler}
                        values={values}
                      />
                    </div>
                  </div>
                  {/* <div className="row global-form global-form-custom py-6"></div> */}
                  <GridData
                    rowDto={rowDto}
                    values={values}
                    profileData={profileData}
                    selectedBusinessUnit={selectedBusinessUnit}
                    cb={cb}
                    ViewOnChangeHandler={ViewOnChangeHandler}
                  />
                  {rowDto?.data?.length > 0 && (
                    <PaginationTable
                      count={rowDto?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                      rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500]}
                    />
                  )}

                  <IViewModal
                    show={isMOdalShow}
                    onHide={() => setModalShowState(false)}
                  >
                    <OthersBillForm landingValue={values} />
                  </IViewModal>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}

export default BillregisterLanding;
