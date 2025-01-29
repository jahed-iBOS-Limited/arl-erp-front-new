import React from "react";
import { Formik, Form as FormikForm } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls/ModalProgressBar";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls/Card";
import NewSelect from "./../../../../_helper/_select";
import { getDamageCalender } from "./../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import { YearDDL } from "../../../../_helper/_yearDDL";

const validationSchema = Yup.object().shape({});

function Form(props) {
  const {
    initData,
    profileData,
    selectedBusinessUnit,
    saveHandler,
    title,
    calendarConfig,
    setCalendarConfig,
    setIsLoading,
    selectIndividualItem,
  } = props;

  return (
    <>
      <Formik
        enableReinitialize={true}
        validationSchema={validationSchema}
        initialValues={{ ...initData }}
        onSubmit={(values, { resetForm, setFieldValue }) => {
          saveHandler(values, setFieldValue, () => {
            resetForm(initData);
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
          setValues,
        }) => (
          <>
            <FormikForm>
              <Card>
                {true && <ModalProgressBar />}
                <CardHeader title={title}>
                  <CardHeaderToolbar>
                    <button
                      onSubmit={handleSubmit}
                      type="submit"
                      className="btn btn-primary save-btn"
                    >
                      Save
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>
                <CardBody>
                  <div>
                    <div className="form-card">
                      <div className="form-card-content">
                        <div className="row mb-3 global-form">
                          <div className="col-lg-3">
                            <NewSelect
                              name="year"
                              options={YearDDL()}
                              value={values?.year}
                              label="Year"
                              onChange={(valueOption) => {
                                getDamageCalender(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  valueOption?.value,
                                  setCalendarConfig,
                                  setIsLoading
                                );
                                setFieldValue("year", valueOption);
                              }}
                              placeholder="Year"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        </div>
                        {/* Table */}
                        <div className="row">
                          <div className="col-lg-12">
                            {calendarConfig?.length > 0 && (
                              <div className="table-responsive">
                                <table className="table custom-table">
                                  <thead>
                                    <tr>
                                      <th>SL</th>
                                      <th>Month</th>
                                      <th>Start Date</th>
                                      <th>End Date</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {calendarConfig?.map((item, index) => (
                                      <tr key={index}>
                                        <td className="text-center">
                                          {index + 1}
                                        </td>
                                        <td className="text-center">
                                          {item?.monthName}
                                        </td>
                                        <td className="text-center">
                                          <InputField
                                            className="form-control mb-0 mt-1"
                                            value={
                                              values?.startDate ||
                                              _dateFormatter(item?.startDate)
                                            }
                                            name="startDate"
                                            type="date"
                                            min={values?.year?.prevDate}
                                            max={values?.year?.nextDate}
                                            onChange={(e) => {
                                              selectIndividualItem(
                                                index,
                                                e.target.value,
                                                "startDate"
                                              );
                                            }}
                                            errors={errors}
                                            touched={touched}
                                          />
                                        </td>
                                        <td className="text-center">
                                          <InputField
                                            className="form-control mb-0 mt-1"
                                            value={
                                              values?.endDate ||
                                              _dateFormatter(item?.endDate)
                                            }
                                            name="endDate"
                                            min={values?.year?.prevDate}
                                            max={values?.year?.nextDate}
                                            type="date"
                                            onChange={(e) => {
                                              selectIndividualItem(
                                                index,
                                                e.target.value,
                                                "endDate"
                                              );
                                            }}
                                            errors={errors}
                                            touched={touched}
                                          />
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </FormikForm>
          </>
        )}
      </Formik>
    </>
  );
}

export default Form;
