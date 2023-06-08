import axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IConfirmModal from "../../../_helper/_confirmModal";
import ICustomCard from "../../../_helper/_customCard";
import ICustomTable from "../../../_helper/_customTable";
import IDelete from "../../../_helper/_helperIcons/_delete";
import Loading from "../../../_helper/_loading";
import "./style.css";
const intData = {
  employee: "",
};

const AttendanceBenefitLanding = () => {
  const { profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [rowDto, getRowDto, dataLoadin] = useAxiosGet();
  const [, getDelete] = useAxiosGet();
  const [, getSeve] = useAxiosGet();

  useEffect(() => {
    getRowDto(
      `/hcm/EmployeeAttendance/AttendanceBenefit?strPart=report&EmployeeId=${0}&ActionBy=${
        profileData?.userId
      }`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return res?.data;
      });
  };

  return (
    <>
      {dataLoadin && <Loading />}
      <ICustomCard title="Attendance Benefit">
        <Formik
          enableReinitialize={true}
          initialValues={intData}
          // validationSchema={LoanApproveSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm();
          }}
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
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form">
                      <div className="row">
                        <div className="col-lg-3">
                          <>
                            <label>Employee</label>
                            <SearchAsyncSelect
                              selectedValue={values?.employee}
                              isSearchIcon={true}
                              handleChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              loadOptions={loadEmp}
                            />
                          </>
                        </div>
                        <div style={{ marginTop: "14px" }}>
                          <button
                            type="button"
                            disabled={!values?.employee}
                            className="btn btn-primary"
                            onClick={() => {
                              getSeve(
                                `/hcm/EmployeeAttendance/AttendanceBenefit?strPart=ENTRY&EmployeeId=${values?.employee?.value}&ActionBy=${profileData?.userId}`,
                                (data) => {
                                  if (data?.statuscode === 200) {
                                    setFieldValue("employee", "");
                                    toast.success(data?.message);
                                  } else {
                                    toast.warn(data?.message);
                                  }
                                }
                              );
                            }}
                          >
                            Save
                          </button>
                        </div>
                        <div style={{ marginTop: "14px", marginLeft: "10px" }}>
                          <button
                            type="button"
                            disabled={false}
                            className="btn btn-primary"
                            onClick={() => {
                              getRowDto(
                                `/hcm/EmployeeAttendance/AttendanceBenefit?strPart=report&EmployeeId=${values
                                  ?.employee?.value || 0}&ActionBy=${
                                  profileData?.userId
                                }`
                              );
                            }}
                          >
                            Show
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
        <ICustomTable
          ths={[
            "SL",
            // "Attendance Benefit Id",
            "Employee Id",
            "Employee Code",
            "Employee Name",
            "Designation",
            "Department",
            "Business Unit",
            "Workplace Group",
            "Workplace",
            "Action",
          ]}
        >
          {rowDto.length > 0 &&
            rowDto.map((item, index) => (
              <tr>
                <td className="text-center">{index + 1}</td>
                {/* <td className="text-center">{item?.intAttendanceBenifitId}</td> */}
                <td className="text-center">{item?.intEmployeeId}</td>
                <td>{item?.strEmployeeCode}</td>
                <td>{item?.strEmployeeFullName}</td>
                <td>{item?.strDesignationName}</td>
                <td>{item?.strDepartmentName}</td>
                <td>{item?.strBusinessUnitName}</td>
                <td>{item?.strWorkplaceGroupName}</td>
                <td>{item?.strWorkplaceName}</td>
                <td className="text-center del-icon">
                  <span
                    onClick={(e) => {
                      e.stopPropagation();
                      IConfirmModal({
                        title: `Attendance Benefit`,
                        message: `Are you sure to delete?`,
                        yesAlertFunc: () => {
                          getDelete(
                            `/hcm/EmployeeAttendance/AttendanceBenefit?strPart=UPDATE&EmployeeId=${item?.intEmployeeId}&ActionBy=${profileData?.userId}`,
                            () => {
                              getRowDto(
                                `/hcm/EmployeeAttendance/AttendanceBenefit?strPart=report&EmployeeId=${0}&ActionBy=${
                                  profileData?.userId
                                }`
                              );
                            }
                          );
                        },
                        noAlertFunc: () => {},
                      });
                    }}
                  >
                    <IDelete />
                  </span>
                </td>
              </tr>
            ))}
        </ICustomTable>
      </ICustomCard>
    </>
  );
};

export default AttendanceBenefitLanding;
