import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IForm from "./../../../_helper/_form";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import Loading from "../../../_helper/_loading";


const initData = {
  vesselName: ""
}

export default function ManagementDashboard() {
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [show, setShow] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([])
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL
    );
    if (initData?.vesselName) {
      getVoyageDDL(initData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      hireType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };


  const getReportId = (values) => {
    if (values?.reportType?.value === 1) {
      return "36acdf46-2d4e-44f4-916b-9e4bdca932d0";
    } else if (values?.reportType?.value === 2) {
      return "d7999c8d-ce78-4257-9904-647491d6caac";
    } else if (values?.reportType?.value === 3) {
      return "c98e8d68-3a19-46b0-bf33-6a81b283be46";
    } else if (values?.reportType?.value === 4) {
      return "8e00fbd8-95b9-49ba-85b1-9f03487a9576";
    } else if (values?.reportType?.value === 5) {
      return "a1d05d40-4b95-429a-b3c3-2504e145de0f";
    } else if (values?.reportType?.value === 6) {
      return "41233307-2a96-4de0-8955-cd0297c72a1a";
    } else if (values?.reportType?.value === 7) {
      return "8369ab2a-0fee-46bc-9d84-9659fc3ad7cd";
    }
    return "";
  };

  const getGroupId = (values) => {
    return "e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a";
  };

  const parameterValues = (values) => {
    const commonParam = [
      { name: "intUnitId", value: selectedBusinessUnit?.value?.toString() },
      { name: "ProfitCenterId", value: "0" },
      { name: "ControlUnitId", value: "0" },
      { name: "ProficCenterGroupId", value: "0" },
      { name: "dteFromDate", value: values?.fromDate },
      { name: "dteToDate", value: values?.toDate },
    ];
    const paramThree = [
      { name: "fromDate", value: values?.fromDate },
      { name: "toDate", value: values?.toDate },
    ];
    const paramFive = [
      { name: "dteFromDate", value: values?.fromDate },
      { name: "dteToDate", value: values?.toDate },
    ];
    const paramSeven = [
      { name: "intUnit", value: selectedBusinessUnit?.value?.toString() },
      { name: "intVesselId", value: values?.vesselName?.value?.toString() },
      { name: "intVoyageNo", value: values?.voyageNo?.value?.toString() },
      { name: "dteFromDate", value: values?.fromDate },
      { name: "dteToDate", value: values?.toDate },
    ];
    if ([1, 2, 4].includes(values?.reportType?.value)) {
      return commonParam;
    } else if ([3].includes(values?.reportType?.value)) {
      return paramThree;
    } else if ([5].includes(values?.reportType?.value)) {
      return paramFive;
    } else if ([7].includes(values?.reportType?.value)) {
      return paramSeven;
    }
    return [];
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
          {loading && <Loading />}
          <IForm
            title="Management Dashboard"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Shipping Crew Report" },
                        { value: 2, label: "Shipping FGV Tech Report" },
                        { value: 3, label: "Shipping Vessel Certification" },
                        {
                          value: 4,
                          label: "Shipping Profit Cost Center Report",
                        },
                        {
                          value: 5,
                          label: "ASLL SBU Report",
                        },
                        {
                          value: 6,
                          label: "Vessel Schedule",
                        },
                        {
                          value: 7,
                          label: "Voyage Revenue Expense",
                        },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption || "");
                        setFieldValue('vesselName', "")
                        setShow(false);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {[7].includes(values?.reportType?.value) && (
                    <>
                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.vesselName || ""}
                          isSearchable={true}
                          options={vesselDDL || []}
                          name="vesselName"
                          placeholder="Vessel Name"
                          label="Vessel Name"
                          onChange={(valueOption) => {
                            setVoyageNoDDL([]);
                            setFieldValue("vesselName", valueOption);
                            if (valueOption) {
                              getVoyageDDL({ ...values, vesselName: valueOption });
                            }
                            setShow(false)
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <FormikSelect
                          value={values?.voyageNo || ""}
                          isSearchable={true}
                          options={voyageNoDDL || []}
                          name="voyageNo"
                          placeholder="Voyage No"
                          label="Voyage No"
                          onChange={(valueOption) => {
                            setFieldValue("voyageNo", valueOption);
                            setShow(false)
                          }}
                          isDisabled={!values?.vesselName}
                          errors={errors}
                          touched={touched}
                        />
                      </div></>
                  )}
                  {![6]?.includes(values?.reportType?.value) && (
                    <>
                      {" "}
                      <div className="col-lg-3">
                        <InputField
                          value={values?.fromDate}
                          label="From Date"
                          name="fromDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e.target.value);
                            setShow(false);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.toDate}
                          label="To Date"
                          name="toDate"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e.target.value);
                            setShow(false);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        setShow(true);
                      }}
                      type="button"
                      className="btn btn-primary mt-5"
                    >
                      Show
                    </button>
                  </div>
                </div>
                {show && (
                  <div className="mt-5">
                    <PowerBIReport
                      reportId={getReportId(values)}
                      groupId={getGroupId(values)}
                      parameterValues={parameterValues(values)}
                      parameterPanel={false}
                    />
                  </div>
                )}
              </>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
