/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
// import * as Yup from "yup";
import axios from "axios";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../_helper/SearchAsyncSelect";
import IForm from "../../../_helper/_form";
import FormikError from "../../../_helper/_formikError";
import IDelete from "../../../_helper/_helperIcons/_delete";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  businessUnit: "",
  issueType: "",
  user: "",
  process: "",
};

export default function ComplainAssignConfigCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [rowData, getRowData, loadRowData, setRowData] = useAxiosGet([]);
  const [businessUnitDDL, getBusinessUnitDDL] = useAxiosGet([]);
  const [issueTypeDDL, getIssueTypeDDL] = useAxiosGet();
  const [, saveComplaintAssign, loadComplaintAssign] = useAxiosPost();
  const [singleData, setSingleData] = useState();
  const { state } = useLocation();

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const { id } = useParams();

  // event handlers
  const handleAddRowData = (values, resetForm) => {
    const duplicateRowData = [...rowData]?.find(
      (item) =>
        item?.userName === values?.user?.employeeName &&
        item?.userId === values?.user?.value &&
        item?.issueTypeId === values?.issueType?.value
    );
    if (duplicateRowData) {
      toast.warn("Duplicate data is not allowed");
      return;
    }
    setRowData([
      ...rowData,
      {
        businessUnitId: values?.businessUnit?.value,
        businessUnitName: values?.businessUnit?.label,
        userName: values?.user?.employeeName,
        userId: values?.user?.value,
        issueTypeName: values?.issueType?.label,
        issueTypeId: values?.issueType?.value,
        process: values?.process?.label,
      },
    ]);
    resetForm();
  };
  const HandleDelete = (item) => {
    const updatedRowData = rowData?.filter(
      (i) =>
        !(
          i?.userName === item?.userName &&
          i?.userId === item?.userId &&
          i?.issueTypeId === item?.issueTypeId
        )
    );
    setRowData(updatedRowData);
  };
  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = rowData?.map((i) => ({
        actionBy: userId,
        businessUnitId: buId,
        EmployeeName: i?.userName,
        issueTypeId: i.issueTypeId,
        employeeId: i.userId,
        process: i.process,
      }));
      saveComplaintAssign(
        `/oms/CustomerPoint/CreateComplaintAssign`,
        payload,
        () => {
          setRowData([]);
        },
        true
      );
    } else {
      const payload = rowData?.map((i) => ({
        autoId: i?.autoId || 0,
        issueTypeId: i?.issueTypeId,
        issueTypeName: i?.issueTypeName,
        businessUnitId: i?.businessUnitId,
        process: i?.process || "Assign",
        employeeId: i?.userId,
        employeeName: i?.userName,
      }));
      saveComplaintAssign(
        `/oms/CustomerPoint/CreateComplaintAssign`,
        payload,
        () => {},
        true
      );
    }
  };

  useEffect(() => {
    getIssueTypeDDL(
      `/oms/CustomerPoint/ComplainCategory?businessUnitId=${buId}`
    );
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);
  useEffect(() => {
    if (id) {
      getRowData(
        `/oms/CustomerPoint/GetComplainAssignByEmployeeId?BusinessUnitId=${buId}&EmployeeId=${id}`,
        (data) => {
          const updatedData = data?.map((item) => ({
            autoId: item?.autoId,
            businessUnitId: item?.businessUnitId,
            userName: item?.employeeName,
            userId: item?.employeeId,
            issueTypeName: item?.issueTypeName,
            issueTypeId: item?.issueTypeId,
            process: item?.process,
          }));
          setRowData(updatedData);
        }
      );
      setSingleData({
        user: {
          label: state?.employeeName,
          employeeName: state?.employeeName,
          value: state?.employeeId,
        },
      });
    }
  }, [id]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? singleData : initData}
      //   validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (!rowData?.length > 0) {
          toast.warn("Add minimum one issue type");
          return;
        } else {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }
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
          {console.log({ values })}
          {console.log({ rowData })}
          {(loadComplaintAssign || loadRowData) && <Loading />}
          <IForm title="Feature Assign To User" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3  ">
                  <label>User Enroll & Name</label>
                  <SearchAsyncSelect
                    selectedValue={values?.user}
                    handleChange={(valueOption) => {
                      setFieldValue("user", valueOption);
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
                            label: `${itm?.level} [${itm?.employeeCode}]`,
                          }));
                        })
                        .catch((err) => []);
                    }}
                    // disabled={true}
                    isDisabled={id}
                  />
                  <FormikError errors={errors} name="user" touched={touched} />
                </div>
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
                      handleAddRowData(values, resetForm);
                    }}
                    className="btn btn-primary btn-sm"
                    style={{ marginTop: "18px" }}
                    disabled={
                      !values?.user || !values?.issueType || !values?.process
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="row ">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Employee Name</th>
                          <th>Business Unit</th>
                          <th>Issue Type</th>
                          <th>Process</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.length > 0 &&
                          rowData?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.userName}</td>
                              <td>{item?.businessUnitName}</td>
                              <td>{item?.issueTypeName}</td>
                              <td>{item?.process}</td>
                              <td className="text-center">
                                <span onClick={() => HandleDelete(item)}>
                                  <IDelete />
                                </span>
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
