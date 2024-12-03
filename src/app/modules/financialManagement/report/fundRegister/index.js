import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import ICard from "../../../_helper/_card";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import { YearDDL } from "../../../_helper/_yearDDL";
import { getBankDDLAll } from "../../banking/fundManagement/helper";
import * as Yup from "yup";

const initData = {
  type: {
    value: 1,
    label: "Cash Position",
  },
  date: _todayDate(),
  businessUnit: "",
  year: "",
  intBankId: "",
  intLCType: "",
  USDRate: "",
  EURate: "",
};
// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  type: Yup.object()
    .required("Type is required")
    .nullable(),
  intBankId: Yup.string().when("type.value", {
    is: 4,
    then: Yup.string().required("Bank is required"),
  }),
  businessUnit: Yup.string().when("type.value", {
    is: 4,
    then: Yup.string().required("BusinessUnit is required"),
  }),
  intLCType: Yup.string().when("type.value", {
    is: 4,
    then: Yup.string().required("LC Type is required"),
  }),
  USDRate: Yup.string().when("type.value", {
    is: 4,
    then: Yup.string().required("USD Rate is required"),
  }),
  EURate: Yup.string().when("type.value", {
    is: 4,
    then: Yup.string().required("EUR Rate is required"),
  }),
});
function FundRegisterLanding() {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [
    businessUnitDDL,
    getBusinessUnitDDL,
    businessUnitDDlloader,
  ] = useAxiosGet();

  const [showReport, setShowReport] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);

  const groupId = "218e3d7e-f3ea-4f66-8150-bb16eb6fc606";

  const getReportId = (values) => {
    let reportId = "";
    if ([1, 2].includes(values?.type?.value)) {
      reportId = "1c58a47c-1783-438c-ac3c-f718a2bbb13a";
    } else if ([3].includes(values?.type?.value)) {
      reportId = "f46ad25c-816b-447a-8e93-57e9156799c6";
    } else if ([4].includes(values?.type?.value)) {
      reportId = "7bda9b36-e758-4c2b-91e0-7776d1424cd7";
    }

    return reportId;
  };

  const parameterValues = (values) => {
    let paramList = [];
    if ([1, 2].includes(values?.type?.value)) {
      paramList = [
        { name: "ReportType", value: `${values?.type?.value || 0}` },
        {
          name: "businessUnitId",
          value: `${values?.businessUnit?.value || 0}`,
        },
        { name: "dteDate", value: `${values?.date || _todayDate()}` },
      ];
    } else if ([3].includes(values?.type?.value)) {
      paramList = [
        {
          name: "businessUnitId",
          value: `${values?.businessUnit?.value || 0}`,
        },
        { name: "ExpiryDate", value: `${values?.year?.label}` },
      ];
    } else if ([4].includes(values?.type?.value)) {
      paramList = [
        {
          name: "intBankId",
          value: `${values?.intBankId?.value || 0}`,
        },
        {
          name: "businessUnitId",
          value: `${values?.businessUnit?.value || 0}`,
        },
        {
          name: "intLCType",
          value: `${values?.intLCType?.value || 0}`,
        },
        { name: "USDRate", value: `${values?.USDRate}` },
        { name: "EURate", value: `${values?.EURate}` },
      ];
    }
    return paramList;
  };
  useEffect(() => {
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    getBankDDLAll(setBankDDL, setLoading);
  }, []);
  return (
    <>
      {businessUnitDDlloader && <Loading />}
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setShowReport(false);
          setTimeout(() => {
            setShowReport(true);
          }, 1000);
        }}
      >
        {({
          values,
          setFieldValue,
          errors,
          touched,
          validateForm,
          isValid,
        }) => {
          return (
            <ICard title="Fund Register">
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      placeholder=""
                      label="Select type"
                      value={values?.type}
                      onChange={(v) => {
                        if (v) {
                          setFieldValue("type", v);
                          setShowReport(false);
                        } else {
                          setFieldValue("type", "");
                          setShowReport(false);
                        }
                      }}
                      options={[
                        {
                          value: 1,
                          label: "Cash Position",
                        },
                        {
                          value: 2,
                          label: "Group  Liability Position",
                        },
                        {
                          value: 3,
                          label: "Group Liability For Bank",
                        },
                        {
                          value: 4,
                          label: "LC Outstanding",
                        },
                      ]}
                    />
                  </div>
                  {[4].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="intBankId"
                        options={bankDDL}
                        value={values?.bank}
                        onChange={(valueOption) => {
                          setFieldValue("intBankId", valueOption);
                        }}
                        label="Bank"
                        placeholder="Bank"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}

                  {[2, 3, 4].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessUnit"
                        placeholder="Select Busisness Unit"
                        label="Select Busisness Unit"
                        value={values?.businessUnit}
                        onChange={(v) => {
                          if (v) {
                            setFieldValue("businessUnit", v);
                            setShowReport(false);
                          } else {
                            setFieldValue("businessUnit", "");
                            setShowReport(false);
                          }
                        }}
                        options={
                          [{ value: 0, label: "All" }, ...businessUnitDDL] || []
                        }
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {[4].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="intLCType"
                        placeholder="LC type"
                        label="LC type"
                        value={values?.intLCType}
                        onChange={(v) => {
                          if (v) {
                            setFieldValue("intLCType", v);
                            setShowReport(false);
                          } else {
                            setFieldValue("intLCType", "");
                            setShowReport(false);
                          }
                        }}
                        options={[
                          {
                            value: 1,
                            label: "At-Sight LC",
                          },
                          {
                            value: 2,
                            label: "UPAS LC",
                          },
                          {
                            value: 3,
                            label: "ABP",
                          },
                        ]}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  )}
                  {[4].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <label>USD Rate</label>
                      <InputField
                        value={values?.USDRate}
                        placeholder="USD Rate"
                        type="number"
                        name="USDRate"
                        onChange={(e) => {
                          setFieldValue("USDRate", e.target.value);
                          setShowReport(false);
                        }}
                        touched={touched}
                      />
                    </div>
                  )}
                  {[4].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <label>EU Rate</label>
                      <InputField
                        value={values?.EURate}
                        placeholder="EU Rate"
                        type="number"
                        name="EURate"
                        onChange={(e) => {
                          setFieldValue("EURate", e.target.value);
                          setShowReport(false);
                        }}
                        touched={touched}
                      />
                    </div>
                  )}
                  {[3].includes(values?.type?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="year"
                        placeholder=""
                        label="Select Year"
                        value={values?.year}
                        onChange={(v) => {
                          setFieldValue("year", v || "");
                          setShowReport(false);
                        }}
                        options={YearDDL()}
                      />
                    </div>
                  )}
                  {values?.type?.value === 1 && (
                    <div className="col-lg-3">
                      <label>Date</label>
                      <InputField
                        value={values?.date}
                        placeholder="Date"
                        type="date"
                        name="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                          setShowReport(false);
                        }}
                      />
                    </div>
                  )}
                  <div>
                    <button
                      type="submit"
                      style={{
                        marginTop: "17px",
                      }}
                      // onClick={() => {
                      // setShowReport(false);
                      // setTimeout(() => {
                      //   setShowReport(true);
                      // }, 1000);
                      // validateForm().then((formErrors) => {
                      //   console.log(formErrors, errors, touched);
                      //   if (Object.keys(formErrors).length === 0 && isValid) {
                      //   } else {
                      //     setShowReport(false);
                      //   }
                      // });
                      // }}
                      className="btn btn-primary"
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              {showReport && (
                <PowerBIReport
                  reportId={getReportId(values)}
                  groupId={groupId}
                  parameterValues={parameterValues(values)}
                  parameterPanel={false}
                />
              )}
            </ICard>
          );
        }}
      </Formik>
    </>
  );
}

export default FundRegisterLanding;
