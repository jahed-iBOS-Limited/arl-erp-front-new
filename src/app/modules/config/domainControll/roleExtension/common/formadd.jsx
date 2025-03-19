/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Select from "react-select";
import { toast } from "react-toastify";
import customStyles from "../../../../selectCustomStyle";
import { Input } from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../../_helper/_formikError";
import { shallowEqual, useSelector } from "react-redux";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  employee: Yup.object().shape({
    label: Yup.string().required("Employee is required"),
    value: Yup.string().required("Employee is required"),
  }),
  orgtype: Yup.object().shape({
    label: Yup.string().required("Organization Type is required"),
    value: Yup.string().required("Organization Type is required"),
  }),
  orgname: Yup.object().shape({
    label: Yup.string().required("Organization Name is required"),
    value: Yup.string().required("Organization Name is required"),
  }),
});

const intialValuse = {
  businessunit: "",
  employee: "",
  orgtype: "",
  orgname: "",
};

export default function RoleExForm({
  btnRef,
  saveBusinessUnit,
  // disableHandler,
  accountId,
  selectedBusinessUnit,
}) {
  const [state, setUpdateState] = useState([]);
  const [emp, setEmp] = useState(null);
  const [, setemployeeListDDL] = useState([]);
  const [orgtypeListDDL, setorgtypeListDDL] = useState([]);
  const [orgnameListDDL, setorgnameListDDL] = useState([]);
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  useEffect(() => {
    getEmployeeData(accountId, selectedBusinessUnit.value);
  }, [accountId, selectedBusinessUnit.value]);
  useEffect(() => {
    getOrgTypeData();
  }, []);

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
      //console.log(error);
    }
  };

  const getEmployeeData = async (accId, buId) => {
    try {
      const res = await Axios.get(
        `/domain/CreateUser/GetUserDDL?AccountId=${accId}&UnitId=${buId}`
      );
      const { status, data } = res;
      if (status === 200 && data.length) {
        const modified = data?.map((itm) => ({
          value: itm?.value,
          label: `${itm?.label} (${itm?.value})`,
        }));
        setemployeeListDDL(modified);
      }
    } catch (error) {}
  };

  const getOrgNameData = async (id) => {
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
    } catch (error) {}
  };

  const addItem = (values) => {
    let d = {
      orgtype: values.orgtype.label,
      orgid: values.orgname.value,
      orgname: values.orgname.label,
      orgtypeid: values.orgtype.value,
    };
    const filterArr = state?.filter(
      (item) =>
        item?.orgtype === values.orgtype.label && values.orgname.label === "ALL"
    );
    if (filterArr?.length >= 1) {
      toast.warn("Not allowed");
    } else {
      setUpdateState([...state, d]);
    }
  };

  const empSetter = (empPayload) => {
    if (!state.length) {
      setEmp(empPayload);
      return true;
    } else if (!emp) {
      setEmp(empPayload);
      return true;
    } else {
      if (empPayload == emp) {
        setEmp(empPayload);
        return true;
      } else {
        alert("Employee already exist");
        return false;
      }
    }
  };

  const deleteItem = (data) => {
    let deleteItem = state.filter((p) => p.orgname !== data);
    setUpdateState(deleteItem);
  };
  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/domain/CreateUser/GetUserListSearchDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
    ).then((res) => {
      const updateList = res?.data.map((item) => ({
        ...item,
        label: item?.label + ` [${item?.value}]`,
      }));
      return updateList;
    });
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={intialValuse}
        validationSchema={ProductEditSchema}
        onSubmit={(values, { resetForm }) => {
          saveBusinessUnit({ header: emp, rowDto: state }, (product) => {
            resetForm(product);
          });
          setUpdateState([]);
        }}
      >
        {({ values, errors, setFieldValue, touched }) => (
          <>
            {/* {disableHandler(!errors)} */}
            <Form className="form form-label-right">
              <div className="row global-form">
                <div className="col-lg-4">
                  <Field
                    value={selectedBusinessUnit.label}
                    name="businessUnitName"
                    component={Input}
                    placeholder="Business Unit"
                    label="Business Unit"
                    disabled
                  />
                </div>

                <div className="col-lg-3 mt-1">
                  <label>Select User</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    handleChange={(valueOption) => {
                      const isExist = empSetter(valueOption?.value);
                      isExist && setFieldValue("employee", valueOption);
                    }}
                    loadOptions={loadUserList}
                    disabled={true}
                  />
                  <FormikError
                    errors={errors}
                    name="employee"
                    touched={touched}
                  />
                </div>
              </div>
              <div className="row global-form">
                <div className="col-lg-4">
                  <label>Organization Type</label>
                  <Field
                    name="orgtype"
                    component={() => (
                      <Select
                        options={orgtypeListDDL || []}
                        placeholder="Select Organization"
                        value={values.orgtype}
                        onChange={(selectedOption) => {
                          setFieldValue("orgtype", selectedOption);
                          // setFieldValue("orgname", { label: "", value: "" });
                          getOrgNameData(selectedOption?.value);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={!orgtypeListDDL}
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
                        options={orgnameListDDL || []}
                        placeholder="Select Organization Name"
                        value={values.orgname}
                        onChange={(selectedOption) => {
                          setFieldValue("orgname", selectedOption);
                        }}
                        isSearchable={true}
                        styles={customStyles}
                        isDisabled={!orgtypeListDDL || !orgnameListDDL}
                      />
                    )}
                    label="Organization Type"
                  />
                </div>
                <div className="col-lg-4">
                  <button
                    type="button"
                    style={{ marginTop: "14px" }}
                    onClick={() => {
                      addItem(values);
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
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Organization Type</th>
                      <th>Organization Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.map((itm, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{itm.orgtype}</td>
                        <td>{itm.orgname}</td>
                        <td className="text-center">
                          <span
                            className="pointer alterUomDeleteIcon"
                            style={{
                              width: "50%",
                              marginTop: "3px",
                            }}
                          >
                            <i
                              onClick={() => deleteItem(itm.orgname)}
                              className="fa fa-trash"
                              aria-hidden="true"
                            ></i>
                          </span>
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
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
