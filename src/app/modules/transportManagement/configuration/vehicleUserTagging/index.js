import Axios from "axios";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "./../../../_helper/SearchAsyncSelect";
import FormikError from "./../../../_helper/_formikError";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import IViewModal from "./../../../_helper/_viewModal";
import {
  GetVehicleDDL,
  GetVehicleNUserInformation_api,
  UpdateVehicleTaggingEntry_api,
} from "./helper";
import VehicleUserTaggingUpdate from "./updateModel";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SendMailModal from "./sendMailModal";

const initData = {
  vehicle: "",
  employeeName: "",
};
export default function VehicleUserTagging() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );
  const [clickRowData, setClickRowData] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [singleItem, setSingleItem] = useState(null);
  const [showMailModal, setShowMailModal] = useState(false);

  const saveHandler = () => {};

  const loadEmployeeInfo = (v) => {
    //  if (v?.length < 3) return []
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
    }
  }, [profileData, selectedBusinessUnit]);

  const getViewHandelar = (values) => {
    setRowDto([]);
    const buiId =
      values?.reportType?.value === 1 ? 0 : selectedBusinessUnit.value;
    GetVehicleNUserInformation_api(
      buiId,
      values?.vehicle?.value,
      values?.employeeName?.value,
      values?.reportType?.value,
      profileData?.userId,
      setRowDto,
      setLoading
    );
  };

  const deleteHandler = (item, values) => {
    const payload = {
      row: [
        {
          employeeID: item?.intEmployeeID,
          vehicleID: item?.intVehicleID,
          vehicleName: item?.strVehicleNo,
          employeeName: item?.strEmployeeFullName,
          editID: item?.intID || 0,
          active: false,
          driverName: item?.strDriverName,
          driverID: item?.intDriverEnrol,
        },
      ],
      intUpdateBy: profileData?.userId,
    };
    UpdateVehicleTaggingEntry_api(
      payload,
      () => {
        getViewHandelar(values);
      },
      setLoading
    );
  };

  // console.log(rowDto);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { resetForm }) => {
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
          setValues,
        }) => (
          <>
            <Card>
              <CardHeader title={"Vehicle User Tagging"}>
                <CardHeaderToolbar>
                  <button
                    type="button"
                    className={"btn btn-primary ml-2"}
                    onClick={() => {
                      setIsShowModal(true);
                    }}
                    disabled={loading}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="reportType"
                          options={
                            [
                              { value: 1, label: "All Fuel Log User" },
                              { value: 2, label: "Unit Base" },
                              { value: 3, label: "Vehicle Base" },
                              { value: 4, label: "Employee Base" },
                            ] || []
                          }
                          value={values?.reportType}
                          label="Report Type"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("reportType", valueOption);
                            setFieldValue("employeeName", "");
                            setFieldValue("vehicle", "");
                          }}
                          placeholder="Report Type"
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                      {[3].includes(values?.reportType?.value) && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="vehicle"
                            options={vehicleDDL || []}
                            value={values?.vehicle}
                            label="Vehicle"
                            onChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("vehicle", valueOption);
                            }}
                            placeholder="Select Vehicle"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                      )}

                      {[4].includes(values?.reportType?.value) && (
                        <div className="col-lg-3">
                          <label>Employee Name</label>
                          <SearchAsyncSelect
                            selectedValue={values?.employeeName}
                            handleChange={(valueOption) => {
                              setRowDto([]);
                              setFieldValue("employeeName", valueOption);
                            }}
                            loadOptions={loadEmployeeInfo}
                          />
                          <FormikError
                            errors={errors}
                            name="employeeName"
                            touched={touched}
                          />
                        </div>
                      )}

                      <div className="col-lg-3">
                        <button
                          disabled={
                            values?.reportType?.value === 3
                              ? !values?.vehicle
                              : values?.reportType?.value === 4
                              ? !values?.employeeName
                              : !values?.reportType
                          }
                          type="button"
                          className="btn btn-primary mt-5"
                          style={{ marginLeft: "13px" }}
                          onClick={() => {
                            getViewHandelar(values);
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                  {rowDto?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Business Unit Name</th>
                            <th>Employee Name</th>
                            <th>Vehicle No</th>
                            <th>Driver Name</th>
                            <th>Driver Contact</th>
                            <th>Vehicel User Name</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strBusinessUnitName}</td>
                              <td>{item?.strEmployeeFullName}</td>
                              <td>{item?.strVehicleNo}</td>
                              <td>{item?.strDriverName}</td>
                              <td>{item?.strDriverContact}</td>
                              <td>{item?.strVehicelUserName}</td>
                              <td>
                                {item?.ysnPermission && (
                                  <div className="d-flex justify-content-center align-items-center">
                                    <button
                                      type="button"
                                      className="btn btn-primary"
                                      onClick={() => {
                                        setIsShowModal(true);
                                        setClickRowData(item);
                                      }}
                                      style={{ padding: "3px 14px" }}
                                    >
                                      Update
                                    </button>
                                    <button
                                      type="button"
                                      className="btn btn-primary mx-2"
                                      onClick={() => {
                                        deleteHandler(item, values);
                                      }}
                                      style={{ padding: "3px 14px" }}
                                    >
                                      Delete
                                    </button>
                                    <span>
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            {"Send Mail"}
                                          </Tooltip>
                                        }
                                      >
                                        <span
                                          onClick={() => {
                                            setSingleItem(item);
                                            setShowMailModal(true);
                                          }}
                                        >
                                          <i
                                            style={{ fontSize: "16px" }}
                                            class="fa fa-envelope pointer"
                                            aria-hidden="true"
                                          ></i>{" "}
                                        </span>
                                      </OverlayTrigger>
                                    </span>
                                  </div>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  <IViewModal
                    show={isShowModal}
                    onHide={() => {
                      setClickRowData("");
                      setIsShowModal(false);
                    }}
                  >
                    <VehicleUserTaggingUpdate
                      clickRowData={clickRowData}
                      CB={() => {
                        setIsShowModal(false);
                        getViewHandelar(values);
                      }}
                    />
                  </IViewModal>

                  <button
                    type="submit"
                    style={{ display: "none" }}
                    onSubmit={() => handleSubmit()}
                  ></button>

                  <button
                    type="reset"
                    style={{ display: "none" }}
                    onSubmit={() => resetForm(initData)}
                  ></button>
                </Form>
              </CardBody>
            </Card>

            {/* Send Mail Modal */}
            <div>
              <IViewModal
                show={showMailModal}
                onHide={() => {
                  setShowMailModal(false);
                }}
              >
                <SendMailModal singleItem={singleItem} />
              </IViewModal>
            </div>
          </>
        )}
      </Formik>
    </>
  );
}
