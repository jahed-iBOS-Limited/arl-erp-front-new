import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import NewSelect from "../../../../_helper/_select";
import Loading from "../../../../_helper/_loading";
import {
  getDepartmentDDL,
  getWorkplaceDDL_api,
} from "../../employeeInformation/helper";

const PromotionIncrement = () => {
  // states
  const [rowDto, setRowDto] = useState([]);
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [departmentDDL, setDepartmentDDL] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // eslint-disable-next-line no-unused-vars
  const [loader, setLoader] = useState(false);

  const setAllSelectHandler = (isAllSelect) => {
    const data = rowDto?.data?.map((item) => ({
      ...item,
      isSelect: isAllSelect,
    }));
    setRowDto(data);
  };

  const singleCheckBoxHandler = (value, index) => {
    let newRowDto = [...rowDto];
    newRowDto[index].isSelect = value;
    setRowDto(newRowDto);
  };

  // useEffects
  useEffect(() => {
    getWorkplaceDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
    getDepartmentDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setDepartmentDDL
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <ICustomCard title="Promotion and Increment">
        <Formik
          enableReinitialize={true}
          initialValues={{}}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            setValues,
            isValid,
          }) => (
            <>
              {loader && <Loading />}
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row d-flex justify-content-between">
                        <div className="col-lg-9">
                          <div className="row">
                            <div className="col-lg-3">
                              <NewSelect
                                name="workPlace"
                                options={workplaceDDL}
                                value={values?.workPlace}
                                label="Workplace"
                                onChange={(valueOption) =>
                                  setFieldValue("workPlace", valueOption)
                                }
                                placeholder="Workplace"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div className="col-lg-3">
                              <NewSelect
                                name="department"
                                options={departmentDDL}
                                value={values?.department}
                                label="Department"
                                onChange={(valueOption) =>
                                  setFieldValue("department", valueOption)
                                }
                                placeholder="Department"
                                isSearchable={true}
                                errors={errors}
                                touched={touched}
                              />
                            </div>
                            <div
                              style={{ marginTop: "14px" }}
                              className="col-lg-1"
                            >
                              <button
                                type="button"
                                className="btn btn-primary"
                                disabled={
                                  !values?.workPlace || !values?.department
                                }
                                onClick={() => {}}
                              >
                                View
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
              {/* Table Start */}
              {rowDto?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        {values?.applicationType?.value === 1 && (
                          <th style={{ width: "20px" }}>
                            <input
                              type="checkbox"
                              id="parent"
                              onChange={(event) => {
                                setAllSelectHandler(event.target.checked);
                              }}
                            />
                          </th>
                        )}
                        <th>SL</th>
                        <th>Name</th>
                        <th>From-Date</th>
                        <th>To-Date</th>
                        <th>Leave Type</th>
                        <th>Total Days</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((data, index) => (
                          <tr key={index}>
                            {values?.applicationType?.value === 1 && (
                              <td>
                                <input
                                  id="isSelect"
                                  type="checkbox"
                                  value={data?.isSelect}
                                  checked={data?.isSelect}
                                  onChange={(e) => {
                                    singleCheckBoxHandler(
                                      e.target.checked,
                                      index
                                    );
                                  }}
                                />
                              </td>
                            )}
                            <td>{index + 1}</td>
                            <td>
                              <div className="pl-2">{data?.employeeName}</div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(data?.appliedFromDate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(data?.appliedToDate)}
                              </div>
                            </td>
                            <td>
                              <div className="text-left pl-2">
                                {data?.leaveType}
                              </div>
                            </td>
                            <td>
                              <div className="text-center">
                                {data?.totalDays}
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default PromotionIncrement;
