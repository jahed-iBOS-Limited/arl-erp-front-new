/* eslint-disable eqeqeq */
import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "../../../../../../_helper/_select";
import InputField from "../../../../../../_helper/_inputField";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "./../../../../../../../../_metronic/_partials/controls";
import { runningCalender_api } from "./helper";
import { toast } from "react-toastify";
import { useLocation } from "react-router";

// Validation schema
const validationSchema = Yup.object().shape({
  generateDate: Yup.string()
    .min(1, "Minimum 1 symbol")
    .max(100, "Maximum 100 symbols")
    .required("Date of Joining is required")
    .typeError("Date of Joining is required"),
  calenderType: Yup.object()
    .shape({
      label: Yup.string().required("Calendar Type is required"),
      value: Yup.string().required("Calendar Type is required"),
    })
    .typeError("Calendar Type is required"),
  calender: Yup.object()
    .shape({
      label: Yup.string().required("Calendar is required"),
      value: Yup.string().required("Calendar is required"),
    })
    .typeError("Calendar is required"),
  nextChangeDate: Yup.string()
    .min(1, "Minimum 1 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Next Change Date is required")
    .typeError("Next Change Date is required"),
  startingCalender: Yup.string().when("calenderType", {
    is: (val) => val?.value == 2,
    then: Yup.string()
      .required("Starting calender is required")
      .typeError("Starting calender is required"),
  }),
});

export default function _Form({
  initData,
  saveHandler,
  setEdit,
  edit,
  isDisabled,
  calenderDDL,
  calenderRoasterDDL,
  runningCalender,
  setRunningCalender,
  getRosterByIdCb,
}) {
  const location = useLocation();

//Starting Calenderddl load for edit
  const startingCalender = (value) => {
    runningCalender_api(value?.calender?.value, setRunningCalender);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (
            values?.calenderType?.value === 2 &&
            !values?.startingCalender?.label
          )
            return toast.warning("Starting calender is required");
          saveHandler(values, () => {
            getRosterByIdCb();
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
        }) => (
          <div className={!edit ? "editForm" : ""}>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Create Work Schedule"}>
                {!location?.state?.fromReRegistration && (
                  <CardHeaderToolbar>
                    {edit ? (
                      <>
                        <button
                          onClick={() => {
                            setEdit(false);
                            resetForm(initData);
                          }}
                          className="btn btn-light "
                          type="button"
                        >
                          <i className="fas fa-times pointer"></i>
                          Cancel
                        </button>
                        <button
                          onClick={handleSubmit}
                          className="btn btn-primary ml-2"
                          type="submit"
                          disabled={isDisabled}
                        >
                          Save
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => {
                          setEdit(true);
                          startingCalender(values);
                        }}
                        className="btn btn-light"
                        type="button"
                      >
                        <i className="fas fa-pen-square pointer"></i>
                        Edit
                      </button>
                    )}
                  </CardHeaderToolbar>
                )}
              </CardHeader>
              {console.log(values, "valuesjj")}
              <CardBody>
                <Form className="form form-label-right">
                  <div className="row global-form global-form-custom bj-left pb-2">
                    <div className="col-lg-3">
                      <label>Generate Date</label>
                      <InputField
                        value={values?.generateDate}
                        name="generateDate"
                        placeholder="Generate Date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("nextChangeDate", e.target.value);
                          setFieldValue("generateDate", e.target.value);
                        }}
                        disabled={!edit || location?.state?.fromReRegistration}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="calenderType"
                        options={[
                          {
                            value: 1,
                            label: "Calendar General",
                          },
                          { value: 2, label: "Roster Group Name" },
                        ]}
                        value={values?.calenderType}
                        label="Calendar Type"
                        onChange={(valueOption) => {
                          if (valueOption?.value === 1) {
                            setFieldValue("startingCalender", "");
                          }
                          setFieldValue("calender", "");
                          setFieldValue("calenderType", valueOption);
                        }}
                        placeholder="Calendar Type"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit || location?.state?.fromReRegistration}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="calender"
                        options={
                          values?.calenderType?.value === 2
                            ? calenderRoasterDDL
                            : calenderDDL
                        }
                        value={values?.calender}
                        label={values?.calenderType?.label}
                        onChange={(valueOption) => {
                          setFieldValue("startingCalender", "");
                          setFieldValue("calender", valueOption);
                          runningCalender_api(
                            valueOption?.value,
                            setRunningCalender
                          );
                        }}
                        placeholder="Calendar"
                        errors={errors}
                        touched={touched}
                        isDisabled={!edit || !values?.calenderType || location?.state?.fromReRegistration}
                      />
                    </div>
                    {values?.calenderType?.value !== 1 && (
                      <div className="col-lg-3">
                        <NewSelect
                          name="startingCalender"
                          options={runningCalender}
                          value={values?.startingCalender}
                          label="Starting Calendar"
                          onChange={(valueOption) => {
                            setFieldValue("startingCalender", valueOption);
                          }}
                          placeholder="Starting Calendar"
                          errors={errors}
                          touched={touched}
                          isDisabled={!edit || !values?.calender || location?.state?.fromReRegistration}
                          hide={values?.calenderType?.value === 1}
                        />
                      </div>
                    )}

                    {values?.calenderType?.value === 2 && (
                      <div className="col-lg-3">
                        <label>Next Change Date</label>
                        <InputField
                          value={values?.nextChangeDate}
                          required={values?.calenderType?.value === 2}
                          name="nextChangeDate"
                          placeholder="Next Change Date"
                          type="date"
                          min={values?.generateDate}
                          disabled={!edit || !values?.calenderType || location?.state?.fromReRegistration}
                        />
                      </div>
                    )}
                  </div>
                </Form>
              </CardBody>
            </Card>
          </div>
        )}
      </Formik>
    </>
  );
}
