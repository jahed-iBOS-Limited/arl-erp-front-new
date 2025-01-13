import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
const validationSchema = Yup.object().shape({
  activityDateTime: Yup.string().required("Date is required"),
  description: Yup.string().required("Agenda is required"),
  outcome: Yup.string().required("Outcome is required"),
  calledbyName: Yup.object().shape({
    value: Yup.number().required("Call By is required"),
    label: Yup.string().required("Call By is required"),
  }),
  followUpDate: Yup.string().required("Follow Up Date is required"),
});
export default function CallTab({ data }) {
  const formikRef = React.useRef(null);

  const {
    profileData: { userId },
    selectedBusinessUnit,
  } = useSelector((state) => state?.authData || {}, shallowEqual);

  const [scheduleTypeDDL, getScheduleTypeDDL] = useAxiosGet();
  const [, SaveCustomerFollowUpActivity, isLoading] = useAxiosPost();

  const saveHandler = (values, cb) => {
    const payload = {
      followUpActivityId: 0,
      businessUnitId: selectedBusinessUnit?.value,
      customerAcquisitionId: data?.customerAcquisitionId || 0,
      stageName: data?.currentStage || "",
      activityTypeId: 1,
      activityTypeName: "Call",

      calledbyId: values?.calledbyName?.value || 0,
      calledbyName: values?.calledbyName?.label || "",

      activityDateTime: values?.activityDateTime || new Date(),
      description: values?.description || "",
      outcome: values?.outcome || "",
      attachment: "",
      actionBy: userId || 0,

      scheduleTypeId: values?.scheduleTypeName?.value || 0,
      scheduleTypeName: values?.scheduleTypeName?.label || "",

      followUpDate: values?.followUpDate || new Date(),
    };

    SaveCustomerFollowUpActivity(
      "/oms/SalesQuotation/CreateCustomerFollowUpActivity",
      payload,
      () => {
        if (cb) {
          cb();
        }
      },
      "save"
    );
  };
  const loadCallByDDL = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDDLSearchByBU?AccountId=1&BusinessUnitId=${selectedBusinessUnit?.value}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };
  // get all ddl
  React.useEffect(() => {
    getScheduleTypeDDL(`/oms/SalesQuotation/GetFollowUpActivityTypeDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <ICustomCard
      title={"Call"}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          activityDateTime: "",
          description: "",
          outcome: "",
          calledbyName: "",
          scheduleTypeName: "",
          followUpDate: "",
          attachment: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>{JSON.stringify(errors)}</h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr",
                  gap: "10px",
                }}
              >
                <div className="form-group row global-form">
                  {/* Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Date"
                      type="datetime-local"
                      name="activityDateTime"
                      value={values?.activityDateTime}
                      onChange={(e) => {
                        setFieldValue("activityDateTime", e.target.value);
                      }}
                    />
                  </div>
                  {/* Agenda */}
                  <div className="col-lg-3">
                    <InputField
                      label="Agenda"
                      name="description"
                      value={values?.description}
                      placeholder="Agenda"
                      onChange={(e) => {
                        setFieldValue("description", e.target.value);
                      }}
                    />
                  </div>
                  {/* Outcome */}
                  <div className="col-lg-3">
                    <InputField
                      label="Outcome"
                      name="outcome"
                      value={values?.outcome}
                      placeholder="Outcome"
                      onChange={(e) => {
                        setFieldValue("outcome", e.target.value);
                      }}
                    />
                  </div>
                  {/* Call By */}
                  <div className="col-lg-3">
                    <label>Call By</label>
                    <SearchAsyncSelect
                      selectedValue={values?.calledbyName}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        setFieldValue("calledbyName", valueOption);
                      }}
                      loadOptions={loadCallByDDL}
                    />
                  </div>
                  {/* scheduleType */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={"Schedule Type"}
                      options={scheduleTypeDDL || []}
                      value={values?.scheduleTypeName}
                      name="scheduleTypeName"
                      onChange={(valueOption) => {
                        setFieldValue("scheduleTypeName", valueOption || "");
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Follow Up Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Follow Up Date"
                      type="datetime-local"
                      name="followUpDate"
                      value={values?.followUpDate}
                      onChange={(e) => {
                        setFieldValue("followUpDate", e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}
