import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import { IInput } from "../../../../_helper/_input";
import { shallowEqual, useSelector } from "react-redux";
import { getWorkplaceDDL_api } from "../../overTimeEntry/helper";
import { getOvertimeReport } from "../helper";
import Loading from "../../../../_helper/_loading";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import IViewModal from "../../../../_helper/_viewModal";
import ViewModal from "./View";
import IView from "../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [workPlaceDDL, setWorkplaceDDL] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getWorkplaceDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const printRef = useRef();
  const [show, setShow] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  const onClose = () => {
    setShow(!show);
  };

  const applicationTypeDDL = [
    { value: 1, label: "Pending Application" },
    { value: 2, label: "Approved Application" },
    { value: 3, label: "Rejected Application" },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
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
              {console.log("values", values)}
              {loading && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="viewAs"
                    options={[
                      { value: 0, label: "Admin" },
                      { value: 1, label: "Supervisor" },
                      { value: 2, label: "Line Manager" },
                    ]}
                    value={values?.viewAs}
                    label="View As"
                    onChange={(valueOption) => {
                      setFieldValue("viewAs", valueOption);
                    }}
                    placeholder="View As"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="applicationType"
                    options={applicationTypeDDL || []}
                    value={values?.applicationType}
                    label="Application Type"
                    onChange={(valueOption) => {
                      setFieldValue("applicationType", valueOption);
                    }}
                    placeholder="Application Type"
                    isSearchable={true}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    options={
                      [
                        {
                          value: 0,
                          label: "All",
                        },
                        ...workPlaceDDL,
                      ]
                    }
                    label="Work Place"
                    placeholder="Work Place"
                    value={values?.workPlace}
                    onChange={(valueOption) => {
                      setFieldValue("workPlace", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <IInput
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                  />
                </div>
                <div style={{ marginTop: "14px" }} className="col-lg d-flex">
                  <button
                    onClick={(e) =>
                      getOvertimeReport(
                        selectedBusinessUnit?.value,
                        values?.workPlace?.value,
                        values?.fromDate,
                        values?.toDate,
                        setReports,
                        setLoading,
                        values?.applicationType?.value,
                        values?.viewAs?.value,
                        profileData?.employeeId
                      )
                    }
                    disabled={
                      !values?.workPlace ||
                      !values?.viewAs ||
                      !values?.applicationType
                    }
                    type="button"
                    className="btn btn-primary mr-2"
                  >
                    View
                  </button>
                  <ReactHTMLTableToExcel
                    id="test-table-xls-button-att-reports"
                    className="btn btn-primary mr-2"
                    table="table-to-xlsx"
                    filename="Overtime Report"
                    sheet="Overtime Report"
                    buttonText="Export Excel"
                  />
                  <button type="button" className="btn btn-primary">
                    <ReactToPrint
                      pageStyle={
                        "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                      }
                      trigger={() => (
                        <i
                          style={{ fontSize: "18px" }}
                          className="fas fa-print"
                        ></i>
                      )}
                      content={() => printRef.current}
                    />
                  </button>
                </div>
              </div>

              {/* Table */}

              {/* {reports?.length > 0 && (
                <>
                  <div className="mt-4 d-flex justify-content-end">
                    
                  </div>
                </>
              )} */}
              <div ref={printRef}>
                <h3 className="overTime-title text-center">Overtime Report</h3>
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Employee Id</th>
                      <th>ERP Emp. Id</th>
                      <th>Employee Code</th>
                      <th>Employee Name</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Job Type</th>
                      <th>Salary</th>
                      <th>Basic</th>
                      <th>Hour</th>
                      <th>Hour Amount</th>
                      <th>Day Amount</th>
                      <th className="overtimeReportAction">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td className="text-center">{item?.intEmployeeId}</td>
                        <td className="text-center">{item?.erpemployeeId}</td>
                        <td className="text-center">{item?.strEmployeeCode}</td>
                        <td>{item?.strEmployeeFullName}</td>
                        <td>{item?.strDesignationName}</td>
                        <td>{item?.strDepartmentName}</td>
                        <td>{item?.strEmploymentType}</td>
                        <td className="text-center">{item?.numGrossAmount}</td>
                        <td className="text-center">{item?.numBasicSalary}</td>
                        <td className="text-center">{item?.numHours}</td>
                        <td className="text-center">{item?.numPerHourRate}</td>
                        <td className="text-center">{item?.numTotalAmount}</td>
                        <td className="overtimeReportAction">
                          <div className="text-center">
                            <IView
                              title="Details"
                              clickHandler={(e) => {
                                setCurrentItem(item);
                                setShow(true);
                              }}
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {/* for excel */}
                <table
                  id="table-to-xlsx"
                  className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1 d-none"
                >
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Enroll</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Job Type</th>
                      <th>Salary</th>
                      <th>Basic</th>
                      <th>Hour</th>
                      <th>Hour Amount</th>
                      <th>Day Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reports?.map((item, index) => (
                      <tr>
                        <td>{index + 1}</td>
                        <td className="text-center">{item?.intEmployeeId}</td>
                        <td>{item?.strEmployeeFullName}</td>
                        <td>{item?.strDesignationName}</td>
                        <td>{item?.strDepartmentName}</td>
                        <td>{item?.strEmploymentType}</td>
                        <td className="text-center">{item?.numGrossAmount}</td>
                        <td className="text-center">{item?.numBasicSalary}</td>
                        <td className="text-center">{item?.numHours}</td>
                        <td className="text-center">{item?.numPerHourRate}</td>
                        <td className="text-center">{item?.numTotalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <IViewModal title="Overtime Details" show={show} onHide={onClose}>
                <ViewModal currentItem={currentItem} values={values} />
              </IViewModal>

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
