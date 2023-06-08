import { Form, Formik } from "formik";
import html2pdf from "html2pdf.js";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import ImageViewer from "../../../performancePlanning/workPlan/landing/staticImageViewerModal";
import image from "./../assets/johariWindow-02.jpg";
import JohariChip from "./chip";
import "./JohariWindow.css";
import PDFVIEW from "./pdf";

const initData = {
  employee: "",
  year: "",
  open: "",
  blind: "",
  hidden: "",
  unknown: "",
};

export const validationSchema = Yup.object().shape({
  employee: Yup.object().shape({
    label: Yup.string().required("Employee is required"),
    value: Yup.string().required("Employee is required"),
  }),
  year: Yup.object().shape({
    label: Yup.string().required("Year is required"),
    value: Yup.string().required("Year is required"),
  }),
});
export default function JohariWindowLanding() {
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [yearDDL, getYearDDL] = useAxiosGet();
  const [employeeDDL, getEmployeeDDL] = useAxiosGet();
  const [chipsDDL, getChipsDDL, , setChipsDDL] = useAxiosGet();
  const [chipList, setChipList] = useState({
    open: [],
    blind: [],
    hidden: [],
    unknown: [],
  });
  const [isShowRowItemModal, setIsShowRowItemModal] = useState(false);
  const [, saveData] = useAxiosPost();

  const {
    accountId,
    userId,
    employeeId,
    employeeFullName,
    designationId,
  } = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit.value;
  }, shallowEqual);

  useEffect(() => {
    if (rowData?.johariWindowHeaderId) {
      const data = { ...chipList };
      data["open"] = [...data?.open, ...rowData?.open];
      data["blind"] = [...data?.blind, ...rowData?.blind];
      data["hidden"] = [...data?.hidden, ...rowData?.hidden];
      data["unknown"] = [...data?.unknown, ...rowData?.unknown];
      setChipList(data);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowData]);

  useEffect(() => {
    getYearDDL(
      `/pms/CommonDDL/YearDDL?AccountId=${accountId}&BusinessUnitId=4`
    );
    getEmployeeDDL(
      `/pms/PerformanceMgmt/GetEmployeeWithSupervisorStatusDDL?intEmployeeId=${employeeId}&strEmployeeName=${employeeFullName}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addChipHandler = (name, valueOption) => {
    let data = { ...chipList };
    const isExist = data[name]?.some((itm) => itm.label === valueOption?.label);
    if (isExist) return toast.warn("Chip already exist");

    data[name].push({ value: valueOption?.value, label: valueOption.label });
    setChipList(data);
  };

  const deleteChipHandler = (label, name) => {
    let data = { ...chipList };
    data[name] = data[name].filter((chip) => chip.label !== label);
    setChipList(data);
  };

  const saveHandler = (values, cb) => {
    const openData = chipList?.open.map((data) => {
      return {
        intRowId: data?.intRowId || 0,
        intJohariWindowHeaderId: data?.intJohariWindowHeaderId || 0,
        strChipsType: "Open",
        strChipsLabel: data.label,
        isActive: true,
        dteActionDate: _todayDate(),
        intActionBy: userId,
      };
    });

    const blindData = chipList?.blind.map((data) => {
      return {
        intRowId: data.intRowId || 0,
        intJohariWindowHeaderId: data?.intJohariWindowHeaderId || 0,
        strChipsType: "Blind",
        strChipsLabel: data.label,
        isActive: true,
        dteActionDate: _todayDate(),
        intActionBy: userId,
      };
    });
    const hiddenData = chipList?.hidden.map((data) => {
      return {
        intRowId: data.intRowId || 0,
        intJohariWindowHeaderId: data?.intJohariWindowHeaderId || 0,
        strChipsType: "Hidden",
        strChipsLabel: data.label,
        isActive: true,
        dteActionDate: _todayDate(),
        intActionBy: userId,
      };
    });
    const unknownData = chipList?.unknown.map((data) => {
      return {
        intRowId: data.intRowId || 0,
        intJohariWindowHeaderId: data?.intJohariWindowHeaderId || 0,
        strChipsType: "Unknown",
        strChipsLabel: data.label,
        isActive: true,
        dteActionDate: _todayDate(),
        intActionBy: userId,
      };
    });
    const johariWindowPayload = {
      johariWindowHeaderId: rowData?.johariWindowHeaderId || 0,
      employeeId: values?.employee?.value,
      employeeName: values?.employee?.label,
      designationId: designationId,
      businessUnitId: selectedBusinessUnit,
      workplaceGroupId: rowData?.workplaceGroupId || 0,
      yearId: values?.year?.value,
      year: values?.year?.label,
      quarterId: 0,
      quarter: "",
      isActive: true,
      actionDate: _todayDate(),
      actionBy: userId,
      open: openData,
      blind: blindData,
      hidden: hiddenData,
      unknown: unknownData,
    };
    saveData(
      "/pms/PerformanceMgmt/CreateJohariWindow",
      johariWindowPayload,
      null,
      true
    );
  };

  const pdfExport = (fileName) => {
    var element = document.getElementById("pdf-section");

    var clonedElement = element.cloneNode(true);
    clonedElement.classList.add("d-block");

    var opt = {
      margin: 20,
      filename: `${fileName}.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 5, dpi: 300, letterRendering: true },
      jsPDF: {
        unit: "px",
        hotfixes: ["px_scaling"],
        orientation: "portrait",
      },
    };
    html2pdf()
      .set(opt)
      .from(clonedElement)
      .save();
  };

  // console.log("rowwwww", rowData);
  // console.log("chiplist", chipList);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validationSchema}
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
          <Form className="form form-label-right">
            {true && <ModalProgressBar />}
            {lodar && <Loading />}
            <Card>
              <CardHeader title="Johari Window">
                <CardHeaderToolbar>
                  <button
                    type="button"
                    className={`btn btn-primary mr-2`}
                    onClick={() => {
                      setIsShowRowItemModal(true);
                    }}
                  >
                    <i className="mr-1 fa fa-info" aria-hidden="true"></i>
                    HELP
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primary mr-2`}
                    onClick={() => {
                      pdfExport("Johari Window");
                    }}
                    disabled={
                      !chipList?.open?.length &&
                      !chipList?.hidden?.length &&
                      !chipList?.blind?.length &&
                      !chipList?.unknown?.length
                    }
                  >
                    <i className="mr-1 fa fa-download" aria-hidden="true"></i>
                    Download PDF
                  </button>
                  <button
                    type="submit"
                    style={{
                      cursor: "pointer",
                    }}
                    disabled={
                      !chipList?.open?.length &&
                      !chipList?.hidden?.length &&
                      !chipList?.blind?.length &&
                      !chipList?.unknown?.length
                    }
                    className="btn btn-primary mr-2"
                  >
                    Save
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <div className="johari-window-wrapper">
                  <div className="row">
                    <div className="col-lg-4 mt-2">
                      <div>
                        <strong>Name</strong>:{" "}
                        <span>
                          {values?.employee
                            ? values?.employee?.label
                            : rowData?.employeeName}
                        </span>
                      </div>
                      <div>
                        <strong>Enroll</strong>:{" "}
                        <span>
                          {values?.employee
                            ? values?.employee?.value
                            : rowData?.employeeId}
                        </span>
                      </div>
                    </div>
                    <div className="col-lg-4 mt-2">
                      <div>
                        <strong>Designation</strong>:{" "}
                        <span>{rowData?.designation || ""}</span>
                      </div>
                      <div>
                        <strong>Location</strong>:{" "}
                        <span>{rowData?.workplaceGroup || ""}</span>
                      </div>
                    </div>
                  </div>
                  <hr />
                  <div className="form-group row mb-4 global-form">
                    <div className="col-sm-4  col-lg-3">
                      <NewSelect
                        name="employee"
                        options={employeeDDL}
                        value={values?.employee}
                        label="Employee"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("employee", valueOption);
                            setFieldValue("year", "");
                            setChipList({
                              open: [],
                              blind: [],
                              hidden: [],
                              unknown: [],
                            });
                          } else {
                            setFieldValue("employee", "");
                            setFieldValue("year", "");
                            setChipList({
                              open: [],
                              blind: [],
                              hidden: [],
                              unknown: [],
                            });
                            setRowData([]);
                          }
                        }}
                        placeholder="Employee"
                        isSearchable={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-sm-4 col-lg-3">
                      <NewSelect
                        name="year"
                        options={yearDDL}
                        value={values?.year}
                        label="Year"
                        isDisabled={!values?.employee?.value}
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("year", valueOption);
                            setChipList({
                              open: [],
                              blind: [],
                              hidden: [],
                              unknown: [],
                            });
                            getRowData(
                              `/pms/PerformanceMgmt/GetJohariWindow?EmployeeId=${values?.employee.value}&YearId=${valueOption.value}`
                            );
                            getChipsDDL(
                              `/pms/PerformanceMgmt/GetJohariWindoWChips`
                            );
                          } else {
                            setFieldValue("year", "");
                            setRowData([]);
                            setChipsDDL([]);
                            setChipList({
                              open: [],
                              blind: [],
                              hidden: [],
                              unknown: [],
                            });
                          }
                        }}
                        placeholder="Year"
                        isSearchable={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </div>
                  <div className="form-group row mb-4 global-form">
                    {/* start */}
                    <div className="col-sm-6 p-0 johari-window-model-open-block">
                      <div className="johari-window-model">
                        <div className="row">
                          <div className="col-sm-4 col-md-2">
                            <label htmlFor="">
                              <strong style={{ fontSize: "12px" }}>
                                {"Open"}
                              </strong>
                            </label>
                          </div>
                          <div className="col-sm-8 col-md-8 col-lg-6 col-xl-4">
                            <NewSelect
                              name="open"
                              options={chipsDDL}
                              value={values?.open}
                              onChange={(valueOption) => {
                                addChipHandler("open", valueOption);
                                setFieldValue("open", "");
                              }}
                              isSearchable={true}
                              isDisabled={
                                values?.employee?.subordinateStatus ===
                                "Supervisor"
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          {chipList?.open?.map((data, index) => (
                            <JohariChip
                              key={index}
                              data={data}
                              name={"open"}
                              deleteChipHandler={deleteChipHandler}
                              isDisabled={
                                values?.employee?.subordinateStatus ===
                                "Supervisor"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* end */}
                    {/* start */}
                    <div className="col-sm-6 p-0">
                      <div className="johari-window-model">
                        <div className="row">
                          <div className="col-sm-4 col-md-2">
                            <label htmlFor="">
                              <strong style={{ fontSize: "12px" }}>
                                Blind
                              </strong>
                            </label>
                          </div>
                          <div className="col-sm-8 col-md-8 col-lg-6 col-xl-4">
                            <NewSelect
                              name="blind"
                              options={chipsDDL}
                              value={values?.blind}
                              onChange={(valueOption) => {
                                addChipHandler("blind", valueOption);
                                setFieldValue("blind", "");
                              }}
                              isSearchable={true}
                              isDisabled={
                                values?.employee?.subordinateStatus === "Self"
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          {chipList?.blind?.map((data, index) => (
                            <JohariChip
                              key={index}
                              data={data}
                              name={"blind"}
                              deleteChipHandler={deleteChipHandler}
                              isDisabled={
                                values?.employee?.subordinateStatus === "Self"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* end */}
                    {/* start */}
                    <div className="col-sm-6 p-0 johari-window-model-hidden-block">
                      <div className="johari-window-model">
                        <div className="row">
                          <div className="col-sm-4 col-md-2">
                            <label htmlFor="">
                              <strong style={{ fontSize: "12px" }}>
                                Hidden
                              </strong>
                            </label>
                          </div>
                          <div className="col-sm-8 col-md-8 col-lg-6 col-xl-4">
                            <NewSelect
                              name="hidden"
                              options={chipsDDL}
                              value={values?.hidden}
                              onChange={(valueOption) => {
                                addChipHandler("hidden", valueOption);
                                setFieldValue("hidden", "");
                              }}
                              isSearchable={true}
                              isDisabled={
                                values?.employee?.subordinateStatus ===
                                "Supervisor"
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          {chipList?.hidden?.map((data, index) => (
                            <JohariChip
                              key={index}
                              data={data}
                              name={"hidden"}
                              deleteChipHandler={deleteChipHandler}
                              isDisabled={
                                values?.employee?.subordinateStatus ===
                                "Supervisor"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* end */}
                    {/* start */}
                    <div className="col-sm-6 p-0">
                      <div className="johari-window-model">
                        <div className="row">
                          <div className="col-sm-4 col-md-2">
                            <label htmlFor="">
                              <strong style={{ fontSize: "12px" }}>
                                Unknown
                              </strong>
                            </label>
                          </div>
                          <div className="col-sm-8 col-md-8 col-lg-6 col-xl-4">
                            <NewSelect
                              name="unknown"
                              options={chipsDDL}
                              value={values?.unknown}
                              onChange={(valueOption) => {
                                addChipHandler("unknown", valueOption);
                                setFieldValue("unknown", "");
                              }}
                              isSearchable={true}
                              isDisabled={
                                values?.employee?.subordinateStatus === "Self"
                              }
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          {chipList?.unknown?.map((data, index) => (
                            <JohariChip
                              key={index}
                              data={data}
                              name={"unknown"}
                              deleteChipHandler={deleteChipHandler}
                              isDisabled={
                                values?.employee?.subordinateStatus === "Self"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    {/* end */}
                  </div>
                </div>
              </CardBody>

              <ImageViewer
                show={isShowRowItemModal}
                onHide={() => setIsShowRowItemModal(false)}
                title="Johari Window"
                modelSize="md"
                image={image}
              ></ImageViewer>
              <div id="pdf-section" className="d-none">
                <PDFVIEW chipList={chipList} rowData={rowData} />
              </div>
            </Card>
          </Form>
        </>
      )}
    </Formik>
  );
}
