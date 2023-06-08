import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
import {
  generateSalaryAndConfirmAction,
  getButtonTextAndListDataAction,
} from "../helper";

const validationSchema = Yup.object().shape({});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  workPlaceGroupDDL,
  bUDDL,
  gridData,
  setGridData,
  isLoading,
  setLoading,
  selectedBusinessUnit,
  monthDDL,
  yearDDL,
  buttonText,
  setButtonText,
  profileData,
}) {
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          year: yearDDL?.length > 0 ? yearDDL?.[0] : "",
          month: monthDDL?.length > 0 ? monthDDL?.[0] : "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
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
        }) => (
          <>
            <Form className="form form-label-right">
              {isLoading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-2">
                  <ISelect
                    options={bUDDL}
                    label="Business Unit"
                    placeholder="Business Unit"
                    value={values?.businessUnit}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                      let data = {
                        ...values,
                        businessUnit: valueOption,
                      };
                      getButtonTextAndListDataAction(
                        3,
                        setButtonText,
                        data,
                        setLoading
                      );
                      getButtonTextAndListDataAction(
                        4,
                        setGridData,
                        data,
                        setLoading
                      );
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={workPlaceGroupDDL}
                    label="Work Place Group"
                    placeholder="Work Place Group"
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                      let data = {
                        ...values,
                        workplaceGroup: valueOption,
                      };
                      getButtonTextAndListDataAction(
                        3,
                        setButtonText,
                        data,
                        setLoading
                      );
                      getButtonTextAndListDataAction(
                        4,
                        setGridData,
                        data,
                        setLoading
                      );
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={monthDDL}
                    label="Month"
                    placeholder="Month"
                    value={values?.month}
                    onChange={(valueOption) => {
                      setFieldValue("month", valueOption);
                      let data = {
                        ...values,
                        month: valueOption,
                      };
                      getButtonTextAndListDataAction(
                        3,
                        setButtonText,
                        data,
                        setLoading
                      );
                      getButtonTextAndListDataAction(
                        4,
                        setGridData,
                        data,
                        setLoading
                      );
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <ISelect
                    options={yearDDL}
                    label="Year"
                    placeholder="Year"
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue("year", valueOption);
                      let data = {
                        ...values,
                        year: valueOption,
                      };
                      getButtonTextAndListDataAction(
                        3,
                        setButtonText,
                        data,
                        setLoading
                      );
                      getButtonTextAndListDataAction(
                        4,
                        setGridData,
                        data,
                        setLoading
                      );
                    }}
                  />
                </div>

                <div>
                  {/* text will be Error if API call failed */}
                  {buttonText !== "Error" && (
                    <button
                      style={{ marginTop: "14px" }}
                      className="btn btn-primary ml-2"
                      onClick={(e) => {

                        const cb = () => {
                          getButtonTextAndListDataAction(
                            4,
                            setGridData,
                            values,
                            setLoading
                          );
                        }

                        generateSalaryAndConfirmAction(
                          5,
                          setLoading,
                          values,
                          profileData?.userId,
                          cb
                        );
                      }}
                    >
                      {buttonText}
                    </button>
                  )}

                  <button
                    style={{ marginTop: "14px" }}
                    className="btn btn-primary ml-2"
                    onClick={(e) => {
                      if (
                        !values?.businessUnit ||
                        !values?.month ||
                        !values?.year ||
                        !values?.workplaceGroup
                      )
                        return toast.warn("Please select all fields");
                      getButtonTextAndListDataAction(
                        4,
                        setGridData,
                        values,
                        setLoading
                      );
                    }}
                  >
                    Refresh
                  </button>
                </div>
              </div>
              {isLoading && <Loading />}

              <div className="react-bootstrap-table table-responsive">
                <table
                  className={"table table-striped table-bordered global-table"}
                >
                  <thead>
                    <tr>
                      <th>Business Unit</th>
                      <th>Workplace Group</th>
                      <th style={{ width: "70px" }}>Month</th>
                      <th style={{ width: "70px" }}>Year</th>
                      <th>Net Payable</th>
                      <th style={{ width: "100px" }}>Status</th>
                      <th style={{ width: "100px" }}>Confirmation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.length > 0 &&
                      gridData?.map((item, index) => (
                        <tr>
                          <td className="text-left">
                            {item?.strBusinessUnitName}
                          </td>
                          <td>{item?.strWorkplaceGroupName}</td>
                          <td className="text-center">{item?.strMonthName}</td>
                          <td className="text-center">{item?.intYear}</td>
                          <td className="text-right">
                            {_formatMoney(item?.numNetPayable)}
                          </td>
                          <td>{item?.strStatus}</td>
                          <td>
                            {item?.isActive === false
                              ? "Cancelled"
                              : item?.intStatusId === 1 &&
                                item?.isPaid === false ? (
                                  <button
                                    onClick={(e) => {
                                      const cb = () => {
                                        getButtonTextAndListDataAction(
                                          4,
                                          setGridData,
                                          values,
                                          setLoading
                                        );
                                      }


                                      generateSalaryAndConfirmAction(
                                        6,
                                        setLoading,
                                        values,
                                        profileData?.userId,
                                        cb
                                      );
                                    }}
                                    className="btn btn-primary"
                                  >
                                    Confirm
                                  </button>
                                ) : item?.isPaid && "Paid"}
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
