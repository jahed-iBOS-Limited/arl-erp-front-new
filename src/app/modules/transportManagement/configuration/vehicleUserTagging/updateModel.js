import { Form, Formik } from "formik";
import React, { useState, useEffect } from "react";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import SearchAsyncSelect from "./../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../_helper/_formikError";
import NewSelect from "./../../../_helper/_select";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import {
  GetVehicleDDL,
  GetVehicleNUserInformation_api,
  UpdateVehicleTaggingEntry_api,
} from "./helper";
import Loading from "./../../../_helper/_loading";

export default function VehicleUserTaggingUpdate({ clickRowData, CB }) {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [loading, setLoading] = useState(false);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [driverDDL, setDriverDDL] = useState([]);

  const saveHandler = (values, cb) => {
    const payload = {
      row: [
        {
          employeeID: values?.employeeName?.value,
          vehicleID: values?.vehicle?.value,
          vehicleName: values?.vehicle?.label,
          employeeName: values?.employeeName?.label,
          editID: clickRowData?.intID || 0,
          active: true,
          driverName: values?.driver?.label,
          driverID: values?.driver?.value,
        },
      ],
      intUpdateBy: profileData?.userId,
    };
    UpdateVehicleTaggingEntry_api(payload, cb, setLoading);
  };

  const loadEmployeeInfo = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Search=${v}`
    ).then((res) => {
      return res?.data;
    });
  };
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      GetVehicleDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setVehicleDDL
      );
      GetVehicleNUserInformation_api(
        selectedBusinessUnit.value,
        0,
        0,
        5,
        profileData?.userId,
        setDriverDDL,
        setLoading
      );
    }
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          vehicle: clickRowData?.intVehicleID
            ? {
                value: clickRowData?.intVehicleID,
                label: clickRowData?.strVehicleNo,
              }
            : "",
          employeeName: clickRowData?.intEmployeeID
            ? {
                value: clickRowData?.intEmployeeID,
                label: clickRowData?.strEmployeeFullName,
              }
            : "",
          driver: clickRowData?.intDriverEnrol
          ? {
              value: clickRowData?.intDriverEnrol,
              label: clickRowData?.strDriverName,
            }
          : "",
        }}
        onSubmit={(values, { resetForm }) => {
          saveHandler(values, () => {
            CB();
            resetForm({
              vehicle: "",
              employeeName: "",
            });
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
          setValues,
        }) => (
          <>
            <Form className="form form-label-right">
              <Card>
                <CardHeader title={"Vehicle User Tagging"}>
                  <CardHeaderToolbar>
                    <button
                      type="submit"
                      className={"btn btn-primary ml-2"}
                      onClick={handleSubmit}
                      disabled={
                        loading ||
                        !values?.employeeName ||
                        !values?.vehicle ||
                        !values?.driver
                      }
                    >
                      {clickRowData?.intID ? "Update" : "Save"}
                      
                    </button>
                  </CardHeaderToolbar>
                </CardHeader>

                <CardBody>
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <label>Employee Name</label>
                        <SearchAsyncSelect
                          selectedValue={values?.employeeName}
                          handleChange={(valueOption) => {
                            setFieldValue("employeeName", valueOption);
                          }}
                          loadOptions={loadEmployeeInfo}
                          isDisabled={clickRowData?.intID}
                        />
                        <FormikError
                          errors={errors}
                          name="employeeName"
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="vehicle"
                          options={vehicleDDL || []}
                          value={values?.vehicle}
                          label="Vehicle"
                          onChange={(valueOption) => {
                            setFieldValue("vehicle", valueOption);
                          }}
                          placeholder="Select Vehicle"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="driver"
                          options={
                            driverDDL?.map((itm) => ({
                              value: itm?.intEmployeeID,
                              label: itm?.strEmployeeFullName,
                            })) || []
                          }
                          value={values?.driver}
                          label="Driver"
                          onChange={(valueOption) => {
                            setFieldValue("driver", valueOption);
                          }}
                          placeholder="Select Driver"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
