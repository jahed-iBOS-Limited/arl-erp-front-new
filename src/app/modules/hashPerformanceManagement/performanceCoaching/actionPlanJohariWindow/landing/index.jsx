import { Formik } from "formik";
import React, { useEffect } from "react";
import html2pdf from "html2pdf.js";
import "./styles.css";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import IClose from "../../../../_helper/_helperIcons/_close";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { quaterDDL } from "../../../hashPerformanceCommon";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _todayDate } from "../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import JohariWindowPdfFile from "../JohariWindowPdfFile";
const initData = {
  year: "",
  quater: "",
};

export default function JohariWindowActionPlan() {
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit.value;
  }, shallowEqual);
  const {
    accountId,
    userId,
    employeeId,
    employeeFullName,
    designationId,
  } = profileData;
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [yearData, getYearData] = useAxiosGet();
  const [referenceData, getReferenceData] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const closeHandler = (index) => {
    let updatedData = rowData?.row?.filter((item, i) => index !== i);
    setRowData({
      ...rowData,
      row: updatedData,
    });
  };

  const saveHandler = (values) => {
    if (
      values?.year?.value &&
      values?.quater?.value &&
      rowData.row.length > 0
    ) {
      const rowList = rowData?.row?.map((data) => {
        return {
          rowId: data?.rowId || 0,
          actionPlanHeaderId: data?.actionPlanHeaderId || 0,
          activity: data?.activity,
          stardDate: data?.stardDate,
          endDate: data?.endDate,
          isActive: true,
          actionDate: _dateFormatter(new Date()),
          actionBy: userId,
        };
      });
      const payload = {
        actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
        employeeId: employeeId,
        employeeName: employeeFullName,
        designationId: designationId,
        businessUnitId: selectedBusinessUnit,
        workplaceGroupId: values?.workplaceGroupId || 0,
        typeId: rowData?.typeId || 1,
        type: rowData?.type || "Johari Window",
        typeReferenceId:
          rowData?.typeReferenceId || values?.typeReference?.value,
        typeReference:
          rowData?.typeReference || values?.typeReference?.chipsLabel,
        yearId: values?.year?.value,
        year: values?.year?.label,
        quarterId: values?.quater?.value || 1,
        quarter: values?.quater?.label || "",
        currentResult: values?.currentResult,
        desiredResult: values?.desiredResult,
        isActive: true,
        actionDate: _todayDate(),
        actionBy: userId,
        typeGroup: "JohariWindow",
        row: rowList,
      };
      saveData(
        `/pms/PerformanceMgmt/PMSActionPlanCreateAndEdit`,
        payload,
        null,
        true
      );
    } else {
      toast.error("Please Select Year and Quater");
    }
  };

  const addHandler = (values) => {
    if (values?.activity && values?.stardDate && values?.endDate) {
      if (rowData?.row?.find((item) => item?.activity === values?.activity)) {
        toast.error("Activity already exist");
        return;
      } else {
        if (rowData.row) {
          const modifiedData = [...rowData?.row];
          modifiedData.push({
            rowId: 0,
            actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
            activity: values?.activity,
            stardDate: values?.stardDate,
            endDate: values?.endDate,
            isActive: true,
            actionDate: _dateFormatter(new Date()),
            actionBy: userId,
          });
          setRowData({
            actionPlanHeaderId: rowData?.actionPlanHeaderId,
            row: modifiedData,
          });
        } else {
          const modifiedData = [];
          modifiedData.push({
            rowId: 0,
            actionPlanHeaderId: rowData?.actionPlanHeaderId || 0,
            activity: values?.activity,
            stardDate: values?.stardDate,
            endDate: values?.endDate,
            isActive: true,
            actionDate: _dateFormatter(new Date()),
            actionBy: userId,
          });
          setRowData({
            actionPlanHeaderId: rowData?.actionPlanHeaderId,
            row: modifiedData,
          });
        }
      }
    } else {
      toast.error("Please fill all the fields");
      return;
    }
  };

  const getApiData = (empId, yearId, quaterId, setFieldValue) => {
    getRowData(
      `/pms/PerformanceMgmt/GetActionPlanRowGrid?EmployeeId=${empId}&YearId=${yearId}&QuarterId=${quaterId}&TypeGroup=JohariWindow`,
      (data) => {
        setFieldValue("typeReference", {
          value: data?.typeReferenceId,
          label: data?.typeReference,
        });
      }
    );
  };

  useEffect(() => {
    getYearData(
      `/pms/CommonDDL/YearDDL?AccountId=${accountId}&BusinessUnitId=4`
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");
    var clonedElement = element.cloneNode(true);
    clonedElement.classList.add("d-block");

    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: { unit: "px", hotfixes: ["px_scaling"], orientation: "portrait" },
    };
    html2pdf()
      .set(opt)
      .from(clonedElement)
      .save();
  };

  const pdfData = {
    rowData,
    employeeId,
    employeeFullName,
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          type: {
            value: 1,
            label: "Johari Window",
          },
        }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Action Plan Johari Window"}>
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      saveHandler(values);
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <NewSelect
                        name="year"
                        options={yearData}
                        value={values?.year}
                        label="Year"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("year", valueOption);
                            setFieldValue("quater", "");
                            setRowData({});
                          } else {
                            setFieldValue("year", "");
                            setFieldValue("quater", "");
                            setRowData({});
                          }
                        }}
                        placeholder="Year"
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="quater"
                        options={quaterDDL}
                        value={values?.quater}
                        label="Quater"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            getApiData(
                              employeeId,
                              values.year.value,
                              valueOption?.value,
                              setFieldValue
                            );
                            getReferenceData(
                              `/pms/PerformanceMgmt/GetJohariWindowActionPlanDDL?EmployeeId=${employeeId}&YearId=${values.year.value}&QuarterId=${valueOption?.value}&DDLTypeId=1`             
                            );
                            setFieldValue("quater", valueOption);
                          } else {
                            setFieldValue("quater", "");
                            setRowData({});
                          }
                        }}
                        placeholder="Quater"
                        errors={errors}
                        isDisabled={!values.year}
                      />
                    </div>
                    {values.year.value && values?.quater ? (
                      <>
                        <div className="col-lg-3">
                          <button
                            id="actionplan-pdf"
                            onClick={(e) =>
                              pdfExport("Action plan Johari Window")
                            }
                            className="btn btn-primary position-absolute bottom-0"
                            type="button"
                          >
                            <i
                              className="mr-1 fa fa-download pointer"
                              aria-hidden="true"
                            ></i>
                            Export PDF
                          </button>
                        </div>
                      </>
                    ) : null}
                  </div>
                </div>
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[]}
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {}}
                      placeholder="Type"
                      errors={errors}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="typeReference"
                      options={referenceData}
                      value={values?.typeReference}
                      label="Type Reference"
                      onChange={(valueOption) => {
                        setFieldValue("typeReference", valueOption);
                      }}
                      placeholder="Type Reference"
                      errors={errors}
                      isDisabled={
                        rowData?.row?.length > 0 ||
                        (!values?.quater && !values?.year)
                      }
                    />
                  </div>
                  <div className="col-lg-3"></div>
                  <div className="col-lg-3"></div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.activity}
                      label="Task name"
                      placeholder="Activity name"
                      required
                      type="string"
                      name="activity"
                      onChange={(e) => {
                        setFieldValue("activity", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.startDate}
                      label="Start Date"
                      placeholder="Start Date"
                      required
                      type="date"
                      name="stardDate"
                      onChange={(e) => {
                        setFieldValue("stardDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      value={values?.endDate}
                      label="End Date"
                      placeholder="End Date"
                      required
                      type="date"
                      name="endDate"
                      onChange={(e) => {
                        setFieldValue("endDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      onClick={() => {
                        addHandler(values);
                      }}
                      className="btn btn-primary mt-5"
                      type="button"
                    >
                      Add
                    </button>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>
                            LIST OF TASKS/ACTIVITIES/BEHAVIOR TO ACHIEVE RESULT
                          </th>
                          <th>START DATE</th>
                          <th>END DATE</th>
                          <th>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.row?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item.activity}</td>
                              <td className="text-center">
                                {_dateFormatter(item.stardDate)}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(item.endDate)}
                              </td>
                              <td className="text-center">
                                  <span
                                    onClick={() => {
                                      closeHandler(index);
                                    }}
                                  >
                                    <IClose />
                                  </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div id="pdf-section" className="actionplan-pdf-section d-none">
                  <JohariWindowPdfFile pdfData={pdfData} />
                </div>
                {/* <section
                  id="pdf-section"
                  className="actionplan-pdf-section d-none"
                  componentRef={printRef}
                  ref={printRef}
                  style={{
                    marginTop: "20px",
                  }}
                >
                  <h4 className="texr-secondary text-center mb-5 mt-5">
                    Action Plan/Initiative Form
                  </h4>
                  <h6 className="mt-2">Employee Name: {employeeFullName}</h6>
                  <h6>Employee Id: {employeeId}</h6>
                  <table style={{ width: "100%" }}>
                    <tr>
                      <th colSpan={4} className="text-center">
                        GOAL/OBJECTIVE/KPI/BEHAVIOUR
                      </th>
                    </tr>
                    <tr>
                      <td className="text-center" colSpan={4}>
                        {rowData.typeReference}
                      </td>
                    </tr>
                    <tr>
                      <th
                        colSpan={2}
                        className="text-center"
                        style={{
                          width: "50%",
                        }}
                      >
                        CURRENT RESULT
                      </th>
                      <th colSpan={2} className="text-center">
                        DESIRED RESULT
                      </th>
                    </tr>
                    <tr>
                      <td colSpan={2} className="text-center">
                        {rowData.currentResult}
                      </td>
                      <td colSpan={2} className="text-center">
                        {rowData.desiredResult}
                      </td>
                    </tr>

                    <tr>
                      <th className="text-center">SN</th>
                      <th className="text-center">LIST OF TASK</th>
                      <th className="text-center">START DATE</th>
                      <th className="text-center">END DATE</th>
                    </tr>
                    {rowData?.row?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{item.activity}</td>
                          <td className="text-center">
                            {_dateFormatter(item.stardDate)}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item.endDate)}
                          </td>
                        </tr>
                      );
                    })}
                  </table>

                  <div style={{ marginTop: "45px" }}>
                    <h6 style={{ textAlign: "right", marginRight: "25px" }}>
                      DATE & SIGN
                    </h6>
                  </div>
                </section> */}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
