/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { Form, Formik } from "formik";
import { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { ISelect } from "../../../../_helper/_inputDropDown";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import { downloadFile } from "../../../../_helper/downloadFile";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [workPlaceGroupDDL, getWorkplaceGroupDDL] = useAxiosGet();
  const [buDDL, getBuDDL] = useAxiosGet();
  const [workplace, getWorkplaceDDL] = useAxiosGet();
  const [workplaceDDL, setWorkplaceDDL] = useState([]);
  const [rowDto, getRowDto, loading] = useAxiosGet();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    getBuDDL(
      `/hcm/HCMReport/GetOnboardedBusinessUnitList?accountId=${profileData?.accountId}`
    );
    getWorkplaceGroupDDL(
      `/hcm/HCMDDL/GetWorkPlaceGroupByAccountIdDDL?AccountId=${profileData?.accountId}`
    );

    getWorkplaceDDL(
      `/hcm/HCMDDL/GetWorkPlaceDDL?AccountId=${
        profileData?.accountId
      }&BusinessUnitId=${0}&WorkplaceGroupId=${0}`,
      (data) => {
        setWorkplaceDDL([{ value: 0, label: "All" }, ...data]);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    if (rowDto.length > 0) {
      let data = rowDto.reduce((total, item) => total + item?.totalPayable, 0);
      setTotal(data);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowDto]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
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
          <>
            <Form className="form form-label-right">
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <ISelect
                    options={[{ value: 0, label: "All" }, ...buDDL]}
                    label="Business Unit"
                    name="businessUnit"
                    placeholder="Business Unit"
                    value={values?.businessUnit}
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    options={[{ value: 0, label: "All" }, ...workPlaceGroupDDL]}
                    label="Work Place Group"
                    name="workplaceGroup"
                    placeholder="Work Place Group"
                    value={values?.workplaceGroup}
                    onChange={(valueOption) => {
                      setFieldValue("workplaceGroup", valueOption);
                      setFieldValue("workplace", { value: 0, label: "All" });
                      getWorkplaceDDL(
                        `/hcm/HCMDDL/GetWorkPlaceDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&WorkplaceGroupId=${valueOption?.value}`,
                        (data) => {
                          setWorkplaceDDL([
                            { value: 0, label: "All" },
                            ...data,
                          ]);
                        }
                      );
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    options={workplaceDDL}
                    label="Work Place"
                    name="workplace"
                    placeholder="Work Place"
                    value={values?.workplace}
                    onChange={(valueOption) => {
                      setFieldValue("workplace", valueOption);
                    }}
                  />
                </div>
                <div style={{ marginTop: "14px" }} className=" col-lg-3">
                  <button
                    className="btn btn-primary mr-4"
                    type="button"
                    onClick={() => {
                      getRowDto(
                        `/hcm/HCMReport/EmployeeEarnLeaveReport?businessUnitId=${values?.businessUnit?.value}&workplaceGroupId=${values?.workplaceGroup?.value}&workplaceId=${values?.workplace?.value}&year=2022&isDownload=false`
                      );
                    }}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      downloadFile(
                        `/hcm/HCMReport/EmployeeEarnLeaveReport?businessUnitId=${values?.businessUnit?.value}&workplaceGroupId=${values?.workplaceGroup?.value}&workplaceId=${values?.workplace?.value}&year=2022&isDownload=true`,
                        "Earn Leave Report",
                        "xlsx"
                      );
                    }}
                  >
                    Export Excel
                  </button>
                </div>
              </div>

              {/* Table */}

              {rowDto?.length > 0 && (
                <>
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Enroll No</th>
                        <th>Name of Employee</th>
                        <th>Designation</th>
                        <th>Department</th>
                        <th>Section</th>
                        <th>Employment Type</th>
                        <th>Workplace Group</th>
                        <th>BusinessUnit</th>
                        <th>Joining Date</th>
                        <th>Basic Salary</th>
                        <th style={{ maxWidth: "55px" }}>Earn Leave Remain</th>
                        <th>Total Payble TK</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.map((item, index) => (
                        <>
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.intEmployeeId}
                            </td>
                            <td>{item?.strEmployeeFullName}</td>
                            <td>{item?.strDesignationName}</td>
                            <td>{item?.strDepartmentName}</td>
                            <td>{item?.strSection}</td>
                            <td>{item?.strEmploymentType}</td>
                            <td>{item?.strWorkplaceGroupName}</td>
                            <td>{item?.strBusinessUnitName}</td>
                            <td className="text-center">
                              {_dateFormatter(item?.dteJoiningDate)}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.numBasicSalary)}
                            </td>
                            <td className="text-center">
                              {item?.intRemainingDays}
                            </td>
                            <td className="text-right">
                              {_formatMoney(item?.totalPayable)}
                            </td>
                          </tr>
                        </>
                      ))}
                      <tr>
                        <td className="text-right" colspan="12">
                          <strong>Total: </strong>
                        </td>
                        <td className="text-right">
                          <strong>{_formatMoney(total)}</strong>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </>
              )}

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
