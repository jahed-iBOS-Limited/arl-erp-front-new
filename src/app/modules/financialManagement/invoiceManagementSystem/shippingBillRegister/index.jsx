import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import { Card, CardBody, CardHeader, CardHeaderToolbar, ModalProgressBar } from "../../../../../_metronic/_partials/controls";
import { setShippingBillregisterLandingAction } from "../../../_helper/reduxForLocalStorage/Actions";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import { GetBillTypeDDL, getCostCenterDDL, getPlantDDL, getSbuDDL } from "../billregister/helper";
import OthersBillForm from "../billregister/othersBill/Form/addEditForm";
import NewSelect from "./../../../_helper/_select";
import GridData from "./grid";
import { getShippingBillRegisterPagination_api } from "./helper";

// Validation schema
const validationSchema = Yup.object().shape({});

function ShippingBillregisterLanding() {
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
  const shippingBillRegisterLanding = useSelector((state) => {
    return state.localStorage.shippingBillRegisterLanding;
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

  const girdDataFunc = (pageNo, pageSize, values) => {
    getShippingBillRegisterPagination_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.plant?.value,
      values?.sbu?.value,
      0,
      values?.billType?.value,
      pageNo,
      pageSize,
      setRowDto,
      setDisabled,
      values
    );
  };
  const ViewOnChangeHandler = (values) => {
    girdDataFunc(pageNo, pageSize, values);
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    girdDataFunc(pageNo, pageSize, values);
  };
  useEffect(() => {
    if (shippingBillRegisterLanding?.sbu?.value) {
      girdDataFunc(pageNo, pageSize, shippingBillRegisterLanding);
      getCostCenterDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        shippingBillRegisterLanding?.sbu?.value,
        setCostCenterDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cb = () => {
    getShippingBillRegisterPagination_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      shippingBillRegisterLanding?.plant?.value,
      shippingBillRegisterLanding?.sbu?.value,
      shippingBillRegisterLanding?.costCenter?.value,
      shippingBillRegisterLanding?.billType?.value,
      pageNo,
      pageSize,
      setRowDto,
      setDisabled,
      shippingBillRegisterLanding
    );
  };

  const modifyBillTypeDDL = billTypeDDL?.filter((data) => data?.value === 15)

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...shippingBillRegisterLanding,
          billType: {
            value: modifyBillTypeDDL[0]?.value,
            label: modifyBillTypeDDL[0]?.label
          }
        }}
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
              <CardHeader title={"Shipping Bill Register"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      dispatch(setShippingBillregisterLandingAction(values));
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/shippingInvoice/create`,
                        state: values,
                      });
                      // }
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                    disabled={
                      !values?.sbu || !values?.plant || !values?.billType.label
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
                            shippingBillRegisterLanding?.sbu?.value || valueOption?.value,
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
                        options={plantDDL || []}
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
                        isDisabled={true}
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
                          dispatch(setShippingBillregisterLandingAction(values));
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
                  {/* <div className="row global-form global-form-custom py-6"></div> */}
                  <GridData
                    rowDto={rowDto}
                    values={values}
                    profileData={profileData}
                    selectedBusinessUnit={selectedBusinessUnit}
                    cb={cb}
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
                      rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
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

export default ShippingBillregisterLanding;
