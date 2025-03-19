/* eslint-disable react-hooks/exhaustive-deps */

import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Select from "react-select";

import customStyles from "../../../../selectCustomStyle";
import { Input } from "../../../../../../_metronic/_partials/controls";
import { toast } from "react-toastify";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  businessunit: Yup.object().shape({
    label: Yup.string().required("Partner Type is required"),
    value: Yup.string().required("Partner Type is required"),
  }),
  employee: Yup.object().shape({
    label: Yup.string().required("Employee is required"),
    value: Yup.string().required("Employee is required"),
  }),
});

export default function RoleExForm({
  data,
  btnRef,
  saveBusinessUnit,
  // disableHandler,
  rowdataList,
  setRowdataListFromChild,
  deleteFromChild,
  empSetter,
  accountId,
  selectedBusinessUnit,
}) {
  const [orgtypeListDDL, setorgtypeListDDL] = useState("");
  const [orgnameListDDL, setorgnameListDDL] = useState("");

  useEffect(() => {
    getOrgTypeData();
  }, []);
  console.log(rowdataList, "rowdataList");
  const getOrgTypeData = async () => {
    try {
      const res = await Axios.get(
        "/domain/RoleExtension/GetOrganizationTypeList"
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        let ItemType = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.organizationUnitTypeId,
              label: item.organizationUnitTypeName,
            };
            ItemType.push(items);
          });
        setorgtypeListDDL(ItemType);
      }
    } catch (error) {
      // console.log(error)
    }
  };

  const getOrgNameData = async (id, buId) => {
    try {
      const res = await Axios.get(
        `/domain/RoleExtension/GetOrganizationList?OrganizationTypeId=${id}&AccountId=${accountId}&BussinessUnitId=${selectedBusinessUnit.value}`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        let ItemType = [];
        data &&
          data.forEach((item) => {
            let items = {
              value: item.id,
              label: item.name,
            };
            ItemType.push(items);
          });
        setorgnameListDDL(ItemType);
      }
    } catch (error) {
      // console.log(error)
    }
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={data}
        validationSchema={ProductEditSchema}
        onSubmit={(values) => {
          saveBusinessUnit(values.employee?.value);
          console.log("Save");
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {/* {disableHandler(!errors)} */}
            
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-4">
                  <label>Business Unit</label>
                  <Field
                    value={selectedBusinessUnit.label}
                    name="businessunit"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled
                  />
                </div>

                <div className="col-lg-4">
                  <Field
                    disabled
                    name="employee"
                    label="User"
                    value={values?.employee?.label}
                    component={Input}
                  />
                </div>
              </div>
              <div className="global-form row">
                <div className="col-lg-4">
                  <label>Organization Type</label>
                  <Field
                    name="orgtype"
                    component={() => (
                      <Select
                        options={orgtypeListDDL}
                        placeholder="Select Organization"
                        value={values.orgtype}
                        onChange={(selectedOption) => {
                          setFieldValue("orgtype", selectedOption);
                          setFieldValue("orgname", { label: "", value: "" });
                          getOrgNameData(selectedOption?.value);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    label="Organization Type"
                  />
                </div>
                <div className="col-lg-4">
                  <label>Organization Name</label>
                  <Field
                    name="orgname"
                    component={() => (
                      <Select
                        options={orgnameListDDL}
                        placeholder="Select Organization Name"
                        value={values.orgname}
                        isDisabled={!orgtypeListDDL || !orgnameListDDL}
                        onChange={(selectedOption) => {
                          setFieldValue("orgname", selectedOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                    label="Organization Type"
                  />
                </div>
                <div className="col-lg-4">
                  <button
                    style={{ marginTop: "14px" }}
                    type="button"
                    onClick={() => {
                      const obj = {
                        accountId: accountId,
                        actionBy: 770,
                        active: true,
                        lastActionDateTime: "2020-07-16T15:14:30.633",
                        organizationTypeName: values.orgtype.label,
                        organizationUnitReffId: values.orgname.value,
                        organizationUnitReffName: values.orgname.label,
                        organizationUnitTypeId: values.orgtype.value,
                        permissionId: 1,
                        rowId: 1,
                        userId: values.employee.value,
                      };
                      const filterArr = rowdataList?.filter(
                        (item) =>
                          item?.organizationTypeName === values.orgtype.label &&
                          values.orgname.label ===
                            item?.organizationUnitReffName
                      );

                      if (filterArr?.length > 0) {
                        toast.warn("Not allowed");
                      } else {
                        setRowdataListFromChild(obj);
                      }

                      // setFieldValue('orgname', { label: '', value: '' })
                      // setFieldValue('orgtype', 0)
                    }}
                    className="btn btn-primary prurchaseBtn"
                    disabled={!values.orgname.label || !values.orgtype.value}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <tr>
                    <th>SL</th>
                    <th>Organization Type</th>
                    <th>Organization Name</th>
                    <th>Action</th>
                  </tr>
                  {rowdataList.length &&
                    rowdataList.map((itm, index) => (
                      <tr>
                        <td className="text-center">{index + 1}</td>
                        <td>{itm.organizationTypeName}</td>
                        <td>{itm.organizationUnitReffName}</td>
                        <td className="text-center">
                          <span
                            className="pointer alterUomDeleteIcon"
                            style={{
                              width: "50%",
                              marginTop: "3px",
                            }}
                          >
                            <i
                              onClick={() =>
                                deleteFromChild(itm.organizationUnitReffName)
                              }
                              className="fa fa-trash"
                              aria-hidden="true"
                            ></i>
                          </span>
                        </td>
                      </tr>
                    ))}
                </table>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                // onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
