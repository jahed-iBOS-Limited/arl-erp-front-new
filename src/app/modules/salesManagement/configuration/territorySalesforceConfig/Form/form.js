import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { ISelect } from "../../../../_helper/_inputDropDown";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import NewSelect from "../../../../_helper/_select";
import { getDistributionChannelDDL_api } from "../../../report/customerSalesTargetReport/helper";
import { getRegionAreaTerritory } from "./api";
import { toast } from "react-toastify";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";

// Validation schema
const validationSchema = Yup.object().shape({
  territoryType: Yup.object().shape({
    label: Yup.string().required("Territory type is required"),
    value: Yup.string().required("Territory type is required"),
  }),
  
  // territory: Yup.object().shape({
  //   label: Yup.string().required("Territory is required"),
  //   value: Yup.string().required("Territory is required"),
  // }),
  employee: Yup.object().shape({
    label: Yup.string().required("Responsible Person is required"),
    value: Yup.string().required("Responsible Person is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  empDDL,
  territoryTypeDDL,
  territoryDDL,
  territroyDDLCaller,
  setter,
  remover,
  rowDto,
  setRowDto,
  ty,
  setDisabled,
  selectedBusinessUnit,
  profileData,
}) {
  const [territoryList, setTerritoryList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [channelList, setChannelList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [pointList, setPointList] = useState([]);

  useEffect(() => {
    getDistributionChannelDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setChannelList
    );
  }, [profileData, selectedBusinessUnit]);

  const getTerritoryIdName = (values) => {
    switch (values?.territoryType?.label?.toLowerCase()) {
      case "area":
        return {
          territoryId: values?.area?.value,
          territoryName: values?.area?.label,
        };

      case "region":
        return {
          territoryId: values?.region?.value,
          territoryName: values?.region?.label,
        };

      case "point":
        return {
          territoryId: values?.point?.value,
          territoryName: values?.point?.label,
        };

      default:
        return {
          territoryId: values?.territory?.value,
          territoryName: values?.territory?.label,
        };
    }
  };

  const getTerritoryNameForRowTableHeaderLabel = (values) => {
    switch (values?.territoryType?.label?.toLowerCase()) {
      case "area":
        return "Area Name";

      case "region":
        return "Region Name";

      case "point":
        return "Point Name";

      default:
        return "Territory Name";
    }
  };

  const loadSupervisorAndLineManagerList = (v) => {
    const na = { value: 0, label: "Not Applicable" };
    if (v?.length < 2) return [na];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeByAcIdDDL?AccountId=${profileData?.accountId}&search=${v}`
      )
      .then((res) => {
        return [na, ...res?.data];
      })
      .catch((err) => [na]);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
              <div className="form-group row">
                <div className="col-lg-3">
                  <label>Select Territory Type</label>
                  <Field
                    name="territoryType"
                    placeholder="Select Territory Type"
                    component={() => (
                      <Select
                        options={territoryTypeDDL}
                        placeholder="Select Territory Type"
                        defaultValue={values.territoryType}
                        onChange={(valueOption) => {
                          setFieldValue("territory", "");
                          setFieldValue("territoryType", valueOption);
                          territroyDDLCaller(valueOption?.value);
                        }}
                        isDisabled={rowDto.length}
                        isSearchable={true}
                        styles={customStyles}
                      />
                    )}
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.territoryType &&
                    touched &&
                    touched.territoryType
                      ? errors.territoryType.value
                      : ""}
                  </p>
                </div>

                {[7].includes(values?.territoryType?.levelPosition) &&  <div className="col-lg-3">
                        <NewSelect
                          name="salesForceType"
                          options={[
                            {value:"TSO", label:"TSO"},
                            {value: "TerritoryManager", label:"Territory Manager"},
                            {value:"ProductServiceEngineer", label:"Product Service Engineer"},
                          ]}
                          value={values?.salesForceType}
                          label="SalesForce Type"
                          onChange={(valueOption) => {
                            setFieldValue("salesForceType", valueOption);
                            setRowDto([]);
                          }}
                          placeholder="SalesForce Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>}

                <>
                  {["area", "region", "territory", "point"].includes(
                    values?.territoryType?.label?.toLowerCase()
                  ) ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="distributionChannel"
                          options={[...channelList]}
                          value={values?.distributionChannel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("distributionChannel", valueOption);
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            if (valueOption) {
                              getRegionAreaTerritory({
                                channelId: valueOption?.value,
                                setter: setRegionList,
                                setLoading: setDisabled,
                                value: "regionId",
                                label: "regionName",
                              });
                            }
                            if (valueOption?.value === 0) {
                              setFieldValue("region", {
                                value: 0,
                                label: "All",
                              });
                              setFieldValue("area", { value: 0, label: "All" });
                              setFieldValue("territory", {
                                value: 0,
                                label: "All",
                              });
                            }
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      <div className="col-lg-3">
                        <NewSelect
                          name="region"
                          options={[...regionList]}
                          value={values?.region}
                          label="Region"
                          onChange={(valueOption) => {
                            setFieldValue("region", valueOption);
                            setFieldValue("area", "");
                            setFieldValue("territory", "");
                            if (valueOption) {
                              getRegionAreaTerritory({
                                channelId: values?.distributionChannel?.value,
                                regionId: valueOption?.value,
                                setter: setAreaList,
                                setLoading: setDisabled,
                                value: "areaId",
                                label: "areaName",
                              });
                            }
                            if (valueOption?.value === 0) {
                              setFieldValue("area", {
                                value: 0,
                                label: "All",
                              });
                            }
                          }}
                          placeholder="Region"
                          errors={errors}
                          touched={touched}
                          isDisabled={
                            !values?.distributionChannel ||
                            values?.distributionChannel?.value === 0
                          }
                        />
                      </div>

                      {["area", "territory", "point"].includes(
                        values?.territoryType?.label?.toLowerCase()
                      ) ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name="area"
                            options={[...areaList]}
                            value={values?.area}
                            label="Area"
                            onChange={(valueOption) => {
                              setFieldValue("area", valueOption);
                              setFieldValue("territory", "");
                              if (valueOption) {
                                getRegionAreaTerritory({
                                  channelId: values?.distributionChannel?.value,
                                  regionId: values?.region?.value,
                                  areaId: valueOption?.value,
                                  setter: setTerritoryList,
                                  setLoading: setDisabled,
                                  value: "territoryId",
                                  label: "territoryName",
                                });
                              }
                            }}
                            placeholder="Area"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              !values?.region || values?.region?.value === 0
                            }
                          />
                        </div>
                      ) : null}

                      {["territory", "point"].includes(
                        values?.territoryType?.label?.toLowerCase()
                      ) ? (
                        <div className="col-lg-3">
                          <NewSelect
                            name="territory"
                            options={[...territoryList]}
                            value={values?.territory}
                            label="Territory"
                            onChange={(valueOption) => {
                              if (
                                values?.territoryType?.label?.toLowerCase() ===
                                "point"
                              ) {
                                getRegionAreaTerritory({
                                  channelId: values?.distributionChannel?.value,
                                  regionId: values?.region?.value,
                                  areaId: values?.area?.value,
                                  setter: setPointList,
                                  setLoading: setDisabled,
                                  value: "zoneId",
                                  label: "zoneName",
                                  territoryId: valueOption?.value,
                                });
                              }

                              setFieldValue("territory", valueOption);
                            }}
                            placeholder="Territory"
                            errors={errors}
                            touched={touched}
                            isDisabled={
                              !values?.region ||
                              !values?.area ||
                              values?.region?.value === 0
                            }
                          />
                        </div>
                      ) : null}
                    </>
                  ) : null}
                </>

                {["area", "region", "territory", "point"].includes(
                  values?.territoryType?.label?.toLowerCase()
                ) === false ? (
                  <div className="col-lg-3">
                    <ISelect
                      name="territory"
                      label="Select Territory"
                      options={territoryDDL}
                      defaultValue={values.territory}
                      isDisabled={!values.territoryType || rowDto.length}
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : null}

                {["point"].includes(
                  values?.territoryType?.label?.toLowerCase()
                ) ? (
                  <div className="col-lg-3">
                    <ISelect
                      label="Point"
                      options={pointList}
                      defaultValue={values.point}
                      name="point"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : null}

                {[171, 224].includes(selectedBusinessUnit?.value) ? (
                  <div className="col-lg-3">
                    <label>Select Sales Person</label>
                    <SearchAsyncSelect
                      style={{ height: "60px" }}
                      selectedValue={values?.employee}
                      handleChange={(valueOption) => {
                        setFieldValue("employee", valueOption);
                      }}
                      loadOptions={loadSupervisorAndLineManagerList}
                      placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                    />
                    <FormikError
                      name="employee"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                ) : (
                  <div className="col-lg-3">
                    <ISelect
                      label="Select Sales Person"
                      options={[
                        { value: 0, label: "Not Applicable" },
                        ...empDDL,
                      ]}
                      defaultValue={values.employee}
                      name="employee"
                      setFieldValue={setFieldValue}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}

                <div className="col-lg-3">
                  <button
                    onClick={() => {
                      const obj = {
                        ...getTerritoryIdName(values),
                        territoryTypeId: values?.territoryType?.value,
                        employeeName: values?.employee?.name,
                        employeeId: values?.employee?.value,
                        email: values.employee.email,
                        employeeCode: values?.employee?.code,
                        channelId: values?.distributionChannel?.value,
                        salesForceType:values?.salesForceType?.value || "",
                      };

                      if (!obj?.territoryId) {
                        return toast.warn(
                          "Please select territory or area or region or point"
                        );
                      }
                      if([7].includes(values?.territoryType?.levelPosition) && !obj?.salesForceType){
                        return toast.warn("Please Select SalesForce Type")
                      }
                      setter(obj);
                    }}
                    type="button"
                    class="btn btn-primary addBtn"
                    disabled={!values?.territoryType || !values.employee}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col">
                  {rowDto.length ? (
                    <table className="table table-striped table-bordered">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>
                            {getTerritoryNameForRowTableHeaderLabel(values) ||
                              "Territory Name"}
                          </th>
                          <th>Sales Person</th>
                          <th>Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto.map((itm, idx) => (
                          <tr>
                            <td>{idx + 1}</td>
                            <td>{itm.territoryName}</td>
                            <td>{`${itm.employeeName}-${itm.employeeCode}`}</td>
                            <td>{itm.email}</td>
                            <td className="text-center">
                              <span>
                                <i
                                  onClick={() => remover(itm.employeeId)}
                                  className="fa fa-trash deleteBtn"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    ""
                  )}
                </div>
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
