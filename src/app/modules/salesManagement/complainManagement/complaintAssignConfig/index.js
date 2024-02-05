/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IForm from "../../../_helper/_form";
import IEdit from "../../../_helper/_helperIcons/_edit";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import NewSelect from "../../../_helper/_select";
import FormikError from "../../../_helper/_formikError";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import axios from "axios";
import SwitchBtn from "./components/switchBtn";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../chartering/_chartinghelper/_dateFormatter";
const initData = {
  businessUnit: "",
  issueType: "",
  employee: "",
  process: "",
};
export default function ComplainAssignConfigLanding() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const [businessUnitDDL, getBusinessUnitDDL] = useAxiosGet([]);
  const [issueTypeDDL, getIssueTypeDDL] = useAxiosGet();
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  const [
    complainAssignData,
    getComplaiAssignData,
    loadComplaintAssignData,
    setComplainAssignData,
  ] = useAxiosGet();

  const [, updateStatus, isUpdatingStatus, , updatingError] = useAxiosPost();

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const handleStatusChange = async (index, autoId, values) => {
    const api = `/oms/CustomerPoint/UpdateComplainAssignStatus?autoId=${autoId}`;
    await updateStatus(
      api,
      null,
      (res) => {
        handleGetLandingData(values, pageNo, pageSize);
      },
      true,
      null,
      null,
      (err) => {
        handleGetLandingData(values, pageNo, pageSize);
      }
    );
  };

  const handleGetLandingData = (values, pageNo, pageSize) => {
    const { issueType, employee, businessUnit } = values || {};
    const api = `/oms/CustomerPoint/GetComplainAssignLanding?BusinessUnitId=${businessUnit?.value ||
      0}&EmployeeId=${employee?.value || 0}&IssueTypeId=${issueType?.value ||
      0}&pageNo=${pageNo}&pageSize=${pageSize}`;
    getComplaiAssignData(api);
  };

  const commonGridData = (pageNo, pageSize, values) => {
    handleGetLandingData(values, pageNo, pageSize);
  };

  useEffect(() => {
    handleGetLandingData(null, pageNo, pageSize);
  }, []);

  useEffect(() => {
    getIssueTypeDDL(
      `/oms/CustomerPoint/ComplainCategory?businessUnitId=${buId}`
    );
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loadComplaintAssignData || isUpdatingStatus) && <Loading />}
          <IForm
            title="User Role Manager"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/sales-management/complainmanagement/complaintassignconfig/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div
                  style={{ alignItems: "center", gap: "3px" }}
                  className="col-lg-3 d-flex"
                >
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label="Assign Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div
                  style={{ alignItems: "center", gap: "3px" }}
                  className="col-lg-3 d-flex"
                >
                  <NewSelect
                    name="issueType"
                    options={issueTypeDDL}
                    value={values?.issueType}
                    label="Issue Type"
                    onChange={(valueOption) => {
                      setFieldValue("issueType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3  ">
                  <label>User Enroll & Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.user}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption);
                    }}
                    // loadOptions={(v) => loadUserList(accId, buId, v)}
                    loadOptions={(v) => {
                      if (v?.length < 2) return [];
                      return axios
                        .get(
                          `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${accId}&BusinessUnitId=0&searchTearm=${v}`
                        )
                        .then((res) => {
                          return res?.data?.map((itm) => ({
                            ...itm,
                            value: itm?.value,
                            label: `${itm?.level} (${itm?.employeeCode})`,
                          }));
                        })
                        .catch((err) => []);
                    }}
                  />
                  <FormikError errors={errors} name="user" touched={touched} />
                </div>

                <div
                  style={{ alignItems: "center", gap: "3px" }}
                  className="col-lg-3 d-flex"
                >
                  <NewSelect
                    name="process"
                    options={[{ value: 1, label: "Assign" }]}
                    value={values?.process}
                    label="Process"
                    onChange={(valueOption) => {
                      setFieldValue("process", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    onClick={() => {
                      handleGetLandingData(values, pageNo, pageSize);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: "18px" }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL No</th>
                        <th>Employee Name</th>
                        <th>Business Unit</th>
                        <th>Issue Type</th>
                        <th>Process</th>
                        <th>Action Date</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complainAssignData?.data?.length > 0 &&
                        complainAssignData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-left">{item?.employeeName}</td>
                            <td className="text-left">
                              {item?.businessUnitName}
                            </td>
                            <td className="text-left">{item?.issueTypeName}</td>
                            <td className="text-left">{item?.process}</td>
                            <td className="text-center">
                              {item?.actionDate &&
                                _dateFormatter(item?.actionDate)}
                            </td>
                            <td className="text-center">
                              {item?.isActive ? (
                                <span
                                  style={{
                                    color: "#249e45",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Active
                                </span>
                              ) : (
                                <span
                                  style={{
                                    color: "#ad502b",
                                    fontWeight: "bold",
                                  }}
                                >
                                  Inactive
                                </span>
                              )}
                            </td>
                            <td className="text-center">
                              <span>
                                <SwitchBtn
                                  disabled={isUpdatingStatus}
                                  checked={item?.isActive}
                                  onChange={() =>
                                    handleStatusChange(
                                      index,
                                      item?.autoId,
                                      values
                                    )
                                  }
                                />
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
                {complainAssignData?.data?.length > 0 && (
                  <PaginationTable
                    count={complainAssignData?.totalCount}
                    setPositionHandler={(pageNo, pageSize) => {
                      commonGridData(pageNo, pageSize, values);
                    }}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
