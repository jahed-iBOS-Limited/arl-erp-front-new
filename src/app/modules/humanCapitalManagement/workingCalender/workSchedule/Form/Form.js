import React, { useEffect, useRef, useState } from "react";
import { Formik, Form } from "formik";
import { ISelect } from "../../../../_helper/_inputDropDown";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import ReactToPrint from "react-to-print";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import IViewModal from "../../../../_helper/_viewModal";
import ViewModal from "./View";
import IView from "../../../../_helper/_helperIcons/_view";
import { getWorkplaceDDL_api } from "../../../overTimeManagement/overTimeEntry/helper";
import { getWorkScheduleReport } from "../helper";

export default function _Form({ initData, btnRef, resetBtnRef }) {
  // Redux Store data
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );

  // State
  const [workPlaceDDL, setWorkplaceDDL] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [currentItem, setCurrentItem] = useState("");

  // Ref
  const printRef = useRef();

  // functions
  const onClose = () => {
    setShow(!show);
  };

  // useEffects
  useEffect(() => {
    getWorkplaceDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setWorkplaceDDL
    );
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
                  <ISelect
                    options={businessUnitList}
                    label="Business Unit"
                    placeholder="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    options={workPlaceDDL}
                    label="Work Place"
                    placeholder="Work Place"
                    onChange={(valueOption) => {
                      setFieldValue("workPlace", valueOption);
                    }}
                  />
                </div>
                <div style={{ marginTop: "17px" }} className="col-lg-2">
                  <button
                    onClick={(e) =>
                      getWorkScheduleReport(
                        values?.businessUnit?.value,
                        values?.workPlace?.value,
                        setLoading,
                        setReports
                      )
                    }
                    disabled={!values?.businessUnit || !values?.workPlace}
                    type="button"
                    className="btn btn-primary"
                  >
                    View
                  </button>
                </div>
              </div>

              {/* Table */}

              {reports?.length > 0 && (
                <>
                  <div className="mt-4 d-flex justify-content-end">
                    <ReactHTMLTableToExcel
                      id="test-table-xls-button-att-reports"
                      className="btn btn-primary m-0 mx-2 py-2 px-2"
                      table="table-to-xlsx"
                      filename="Work Schedule Report"
                      sheet="Work Schedule Report"
                      buttonText="Export Excel"
                    />
                    <button
                      type="button"
                      className="btn btn-primary p-0 m-0 py-2 px-2"
                    >
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
                </>
              )}
              <div ref={printRef}>
                <h3 className="d-none-print text-center">
                  Work Schedule Report
                </h3>
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Enroll</th>
                      <th>Name</th>
                      <th>Designation</th>
                      <th>Department</th>
                      <th>Current Calender</th>
                      <th className="overtimeReportAction">Action</th>
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
                        <td>{item?.strCurrentCalendar}</td>
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
                      <th>Current Calender</th>
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
                        <td>{item?.strCurrentCalendar}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <IViewModal title="Work Schedule Report" show={show} onHide={onClose}>
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
