import axios from "axios";
import { Form, Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getEmpInfoById } from "../helper";

export default function _Form({
  buId,
  accId,
  userId,
  headers,
  rowData,
  plantDDL,
  initData,
  addHandler,
  saveHandler,
  workPlaceDDL,
  deleteHandler,
}) {
  const history = useHistory();
  const [, getBillAmount, loading] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();

  const getBill = (values, cb) => {
    getBillAmount(
      `/hcm/MenuListOfFoodCorner/EmployeePumpFoodingRate?accountId=${accId}&businessUnitId=${buId}&designationId=${values?.designationId}&startDate=${values?.fromDate}&startTime=${values?.fromTime}&endDate=${values?.toDate}&endTime=${values?.toTime}`,
      (resData) => {
        cb(resData);
      }
    );
  };

  const loadUserList = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/GetEmployeeDesignationDDL?accountId=${accId}&businessUnitId=${buId}&searchTerm=${v}`
      )
      .then((res) => {
        return res?.data;
      })
      .catch((err) => []);
  };

  let totalTaka = 0;

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ resetForm, values, setFieldValue }) => (
          <>
            {loading && <Loading />}
            <ICustomCard
              title={"Pump Fooding Bill Entry"}
              backHandler={() => {
                history.goBack();
              }}
              resetHandler={() => {
                resetForm();
              }}
              saveHandler={() => {
                saveHandler(() => {
                  resetForm(initData);
                });
              }}
            >
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      options={plantDDL}
                      label="Plant"
                      value={values?.plant}
                      placeholder="Plant"
                      onChange={(valueOption) => {
                        setFieldValue("plant", valueOption);
                        getWarehouseDDL(
                          `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&PlantId=${valueOption?.value}&OrgUnitTypeId=8`
                        );
                      }}
                      // isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      options={warehouseDDL}
                      label="Warehouse"
                      value={values?.warehouse}
                      placeholder="Warehouse"
                      onChange={(valueOption) => {
                        setFieldValue("warehouse", valueOption);
                      }}
                      // isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Employee</label>
                    <SearchAsyncSelect
                      selectedValue={values?.employee}
                      isSearchIcon={true}
                      handleChange={(valueOption) => {
                        getEmpInfoById(valueOption?.value, setFieldValue);
                        setFieldValue("enroll", valueOption?.value || "");
                        setFieldValue("code", valueOption?.employeeCode || "");
                        setFieldValue("employee", valueOption);
                        console.log(
                          "pre: ",
                          values?.designationId,
                          "next: ",
                          valueOption?.employeeDesignationId
                        );
                        if (
                          values?.designationId !==
                          valueOption?.employeeDesignationId
                        ) {
                          setFieldValue("fromDate", "");
                          setFieldValue("fromTime", "");
                          setFieldValue("toDate", "");
                          setFieldValue("toTime", "");
                          setFieldValue("taka", "");
                        }
                        setFieldValue(
                          "designation",
                          valueOption?.employeeDesignation
                        );
                        setFieldValue(
                          "designationId",
                          valueOption?.employeeDesignationId
                        );
                      }}
                      loadOptions={loadUserList}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      options={workPlaceDDL}
                      label="Work Place"
                      value={values?.workPlace}
                      placeholder="Work Place"
                      onChange={(valueOption) => {
                        setFieldValue("workPlace", valueOption);
                      }}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.enroll}
                      label="ERP Enroll"
                      placeholder="ERP Enroll"
                      name="enroll"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.designation}
                      label="Designation"
                      placeholder="Designation"
                      name="designation"
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.code}
                      label="Code"
                      placeholder="Code"
                      name="code"
                    />
                  </div>
                  <FromDateToDateForm
                    obj={{
                      values,
                      setFieldValue,
                      time: true,
                      onChange: (allValues) => {
                        if (
                          allValues?.fromDate &&
                          allValues?.toDate &&
                          allValues?.fromTime &&
                          allValues?.toTime
                        ) {
                          getBill(allValues, (bill) => {
                            setFieldValue("taka", bill);
                          });
                        }
                      },
                    }}
                  />
                  {/* <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      placeholder="Date"
                      type="date"
                      name="date"
                      onChange={(e) => {
                        setFieldValue("date", e.target.value);
                        if (values?.startTime && values?.endTime) {
                          let difference = getDifferenceBetweenTime(
                            e.target.value,
                            values?.startTime,
                            values?.endTime
                          );
                          setFieldValue("overTimeHour", difference);
                        }
                      }}
                      // min={_dateFormatter(firstDay)}
                      max={_todayDate()}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.startTime}
                      label="Start Time"
                      placeholder="Start Time"
                      type="time"
                      onChange={(e) => {
                        setFieldValue("startTime", e.target.value);
                        if (values?.date && values?.endTime) {
                          let difference = getDifferenceBetweenTime(
                            values?.date,
                            e.target.value,
                            values?.endTime
                          );
                          setFieldValue("hours", difference);
                          getBill(
                            { ...values, startTime: e?.target?.value },
                            (res) => {
                              setFieldValue("taka", res);
                            }
                          );
                        }
                      }}
                      name="startTime"
                      disabled={!values?.employee}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.endTime}
                      label="End Time"
                      placeholder="End Time"
                      onChange={(e) => {
                        setFieldValue("endTime", e.target.value);
                        if (values?.date && values?.startTime) {
                          let difference = getDifferenceBetweenTime(
                            values?.date,
                            values?.startTime,
                            e.target.value
                          );
                          setFieldValue("hours", difference);
                          getBill(
                            { ...values, endTime: e?.target?.value },
                            (res) => {
                              setFieldValue("taka", res);
                            }
                          );
                        }
                      }}
                      type="time"
                      name="endTime"
                      disabled={!values?.employee}
                    />
                  </div> */}
                  {/* <div className="col-lg-3">
                    <InputField
                      disabled
                      value={values?.hours}
                      label="Hours"
                      placeholder="Hours"
                      name="hours"
                    />
                  </div> */}

                  {/* <div className="col-lg-3">
                    <InputField
                      value={values?.otCount}
                      label="Overtime Count"
                      placeholder="Overtime Count"
                      name="otCount"
                    />
                  </div> */}
                  <div className="col-lg-3">
                    <InputField
                      value={values?.taka}
                      label="Taka"
                      placeholder="Taka"
                      name="taka"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.remarks}
                      label="Remarks (optional)"
                      placeholder="Remarks (optional)"
                      name="remarks"
                    />
                  </div>
                  <div className="col-lg-3 d-flex align-items-center mt-5 ">
                    <AttachmentUploaderNew
                      style={{
                        backgroundColor: "transparent",
                        color: "black",
                      }}
                      CBAttachmentRes={(attachmentData) => {
                        if (Array.isArray(attachmentData)) {
                          console.log("fafa")
                          console.log({attachmentUrl: attachmentData});
                          setFieldValue("attachmentUrl", attachmentData?.[0]?.id)
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3 mt-5">
                    <button
                      onClick={() => {
                        addHandler(values, () => {
                          setFieldValue("enroll", "");
                          setFieldValue("code", "");
                          setFieldValue("employee", "");
                          setFieldValue("designation", "");
                          setFieldValue("workPlace", "");
                        });
                      }}
                      disabled={
                        !values?.employee ||
                        !values?.fromDate ||
                        !values?.fromTime ||
                        !values?.toDate ||
                        !values?.toTime
                      }
                      type="button"
                      className="btn btn-primary"
                    >
                      Add
                    </button>
                  </div>
                </div>
                {rowData?.length > 0 && (
                  <table
                    id="table-to-xlsx"
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr className="cursor-pointer">
                        {headers?.map((th, index) => {
                          return <th key={index}> {th} </th>;
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => {
                        totalTaka += item?.taka;
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.employeeName}</td>
                            <td>{item?.enroll}</td>
                            <td>{item?.workplaceName}</td>
                            <td>{item?.designation}</td>
                            <td>{_dateFormatter(item?.date)}</td>
                            <td>{item?.startTime}</td>
                            <td>{_dateFormatter(item?.endDate)}</td>
                            <td>{item?.endTime}</td>
                            {/* <td>{item?.hours}</td> */}
                            <td className="text-right">{item?.taka}</td>
                            <td>{item?.remarks}</td>
                            <td
                              style={{ width: "80px" }}
                              className="text-center"
                            >
                              <div className="d-flex justify-content-around">
                                {/* <span>
                                <IEdit
                                  onClick={() => {
                                    setSingleData(item);
                                    setFormType("edit");
                                    setShow(true);
                                  }}
                                />
                              </span> */}
                                <span>
                                  <IDelete
                                    remover={(i) => {
                                      deleteHandler(i);
                                    }}
                                    id={index}
                                  />
                                </span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      <tr>
                        <td colSpan={9} className="text-right">
                          <b>Total</b>
                        </td>
                        <td className="text-right">
                          <b>{_fixedPoint(totalTaka, true, 0)}</b>
                        </td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                )}
              </Form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
