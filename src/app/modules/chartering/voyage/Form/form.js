import { Formik } from "formik";
import React, { useState } from "react";
import { useHistory } from "react-router";
import { validationSchema } from "../helper";
import BusinessPartner from "./components/businessPartner";
import ChartererRow from "./components/chartererRow";
import ChartererSection from "./components/chartererSection";
import Header from "./components/header";
import TimeCharterer from "./components/timeCharterer";
import VoyageCharterer from "./components/voyageCharterer";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  setLoading,
  getByIdCalled,

  /* DDL */
  vesselDDL,
  chartererDDL,
  setVesselDDL,
  brokerDDL,
  cargoDDL,
  businessPartnerTypeDDL,
  portDDL,

  /* Row Data */
  cargoList,
  setCargoList,
  businessPartnerGrid,
  setBusinessPartnerGrid,
  chartererRowData,
  setChartererRowData,
  fileObjects,
  setFileObjects,
  setUploadedFile,
  uploadedFile,
  setCPList,cpList,
  currentVoyageNo,
  getCurrentVoyageNo,
  setCurrentVoyageNo
}) {
  const history = useHistory();
  const [businessPartnerNameDDL, setBusinessPartnerNameDDL] = useState([]);

  const setTotalAmountHandler = (values, setFieldValue) => {
    if (values?.dailyHire) {
      const totalAmount =
        Number(values?.voyageDuration || 1) * values?.dailyHire;
      const addCommission =
        (totalAmount / 100) * values?.addressCommission || 1;
      const brokCommission =
        (totalAmount / 100) * values?.brokerCommission || 1;
      const totalComm = addCommission + brokCommission;

      setFieldValue("totalAmount", totalAmount - totalComm);
    }
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setCargoList([]);
            setChartererRowData([]);
            setBusinessPartnerGrid([]);
            resetForm(initData);
            setCurrentVoyageNo("");
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
          setErrors,
          setTouched,
        }) => (
          <>
            <form className="marine-form-card pb-6">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary px-3 py-2"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button>
                  {viewType !== "view" && (
                    <button
                      type="button"
                      onClick={() => {
                        setBusinessPartnerGrid([]);
                        setCargoList([]);
                        setChartererRowData([]);
                        resetForm(initData);
                      }}
                      className={"btn btn-info reset-btn ml-2 px-3 py-2"}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== "view" && (
                    <button
                      type="submit"
                      // type="button"
                      className={"btn btn-success ml-2 px-3 py-2"}
                      onClick={handleSubmit}
                      // onClick={() =>
                      //   saveHandler(values, () => {
                      //     setCargoList([]);
                      //     setChartererRowData([]);
                      //     setBusinessPartnerGrid([]);
                      //     resetForm(initData);
                      //   })
                      // }
                    >
                      Save
                    </button>
                  )}
                </div>
              </div>

              {/* Header Section Common */}
              <Header
                values={values}
                businessPartnerTypeDDL={businessPartnerTypeDDL}
                setFieldValue={setFieldValue}
                viewType={viewType}
                errors={errors}
                touched={touched}
                vesselDDL={vesselDDL}
                setVesselDDL={setVesselDDL}
                setLoading={setLoading}
                setBusinessPartnerGrid={setBusinessPartnerGrid}
                setCargoList={setCargoList}
                setChartererRowData={setChartererRowData}
                setTotalAmountHandler={setTotalAmountHandler}
                currentVoyageNo={currentVoyageNo}
                getCurrentVoyageNo={getCurrentVoyageNo}
                setCurrentVoyageNo={setCurrentVoyageNo}
              />

              {/* Business Partner Section Common */}
              <BusinessPartner
                values={values}
                businessPartnerTypeDDL={businessPartnerTypeDDL}
                setFieldValue={setFieldValue}
                viewType={viewType}
                errors={errors}
                touched={touched}
                businessPartnerNameDDL={businessPartnerNameDDL}
                setBusinessPartnerNameDDL={setBusinessPartnerNameDDL}
                businessPartnerGrid={businessPartnerGrid}
                setBusinessPartnerGrid={setBusinessPartnerGrid}
                setErrors={setErrors}
                setTouched={setTouched}
              />

              {/* Charterer Section */}
              <>
                {/* Charterer Row Data */}
                {chartererRowData?.length > 0 ? (
                  <>
                    {values?.voyageType?.value === 2 ? (
                      <ChartererRow
                        chartererRowData={chartererRowData}
                        setChartererRowData={setChartererRowData}
                        values={values}
                        errors={errors}
                        touched={touched}
                        viewType={viewType}
                        getByIdCalled={getByIdCalled}
                        /* DDL */
                        businessPartnerTypeDDL={businessPartnerTypeDDL}
                        brokerDDL={brokerDDL}
                        portDDL={portDDL}
                        chartererDDL={chartererDDL}
                        cargoDDL={cargoDDL}
                      />
                    ) : null}
                  </>
                ) : null}

                {/* Charterer Form */}
                {viewType !== "view" ? (
                  <>
                    {!values?.voyageType?.value ? null : (
                      <ChartererSection
                        values={values}
                        businessPartnerTypeDDL={businessPartnerTypeDDL}
                        setFieldValue={setFieldValue}
                        viewType={viewType}
                        errors={errors}
                        touched={touched}
                        brokerDDL={brokerDDL}
                        portDDL={portDDL}
                        chartererDDL={chartererDDL}
                        chartererRowData={chartererRowData}
                        setChartererRowData={setChartererRowData}
                        setTotalAmountHandler={setTotalAmountHandler}
                        fileObjects={fileObjects}
                        setFileObjects={setFileObjects}
                        setUploadedFile={setUploadedFile}
                      />
                    )}
                  </>
                ) : null}

                {viewType === "view" && values?.voyageType?.value === 1 ? (
                  <ChartererSection
                    values={values}
                    businessPartnerTypeDDL={businessPartnerTypeDDL}
                    setFieldValue={setFieldValue}
                    viewType={viewType}
                    errors={errors}
                    touched={touched}
                    brokerDDL={brokerDDL}
                    portDDL={portDDL}
                    chartererDDL={chartererDDL}
                    chartererRowData={chartererRowData}
                    setChartererRowData={setChartererRowData}
                    setTotalAmountHandler={setTotalAmountHandler}
                    // fileObjects={fileObjects}
                    // setFileObjects={setFileObjects}
                    // setUploadImage={setUploadImage}
                  />
                ) : null}
              </>

              {/* Voyage Charterer & Cargo Section */}
              {viewType !== "view" ? (
                <>
                  {values?.voyageType?.value === 2 ? (
                    <VoyageCharterer
                      values={values}
                      setFieldValue={setFieldValue}
                      viewType={viewType}
                      errors={errors}
                      touched={touched}
                      cargoList={cargoList}
                      cargoDDL={cargoDDL}
                      portDDL={portDDL}
                      setCargoList={setCargoList}
                      chartererRowData={chartererRowData}
                      setChartererRowData={setChartererRowData}
                      setErrors={setErrors}
                      setTouched={setTouched}
                      uploadedFile={uploadedFile}
                      setCPList={setCPList}
                      cpList={cpList}
                    />
                  ) : null}
                </>
              ) : null}

              {/* Time Chartere Section */}
              {values?.voyageType?.value === 1 ? (
                <TimeCharterer
                  values={values}
                  setFieldValue={setFieldValue}
                  viewType={viewType}
                  errors={errors}
                  touched={touched}
                  setTotalAmountHandler={setTotalAmountHandler}
                />
              ) : null}
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
