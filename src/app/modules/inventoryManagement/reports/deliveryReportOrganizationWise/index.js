import React, { useState, useRef } from "react";
import ICustomCard from "../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "react-bootstrap";
import { DeliveryReportOrganizationWiseLandingAction } from "./helper";
import { _todayDate } from "../../../_helper/_todayDate";
import Loading from "../../../_helper/_loading";
import { _firstDateofMonth } from "../../../_helper/_firstDateOfCurrentMonth";
import ReactToPrint from "react-to-print";
import InputField from "../../../_helper/_inputField";

const initData = {
  startDate: _firstDateofMonth(),
  endDate: _todayDate(),
};

const DeliveryReportOrganizationWise = () => {
  const [rowDto, setRowDto] = useState(null);
  const [loader, setLoader] = useState(false);
  const printRef = useRef();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);


  return (
    <>
      {loader && <Loading />}
      <ICustomCard title="Delivery Report Organization Wise">
        <Formik
          enableReinitialize={true}
          initialValues={{
            ...initData,
          }}
          //   validationSchema={LoanApproveSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            resetForm(initData);
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              {/*  */}
              <Form className="form form-label-right">
                <div className="row">
                  <div className="col-lg-12">
                    <div className="global-form row d-flex justify-content-between">
                      <div className="col-lg-9">
                        <div className="row">
                          <div className="col-lg-3">
                            <div>Start Date</div>
                            <InputField
                              className="trans-date cj-landing-date"
                              value={values?.startDate}
                              name="startDate"
                              onChange={(e) => {
                                setFieldValue("startDate", e.target.value);
                              }}
                              type="date"
                            />
                          </div>
                          <div className="col-lg-3">
                            <div>End Date</div>
                            <InputField
                              className="trans-date cj-landing-date"
                              value={values?.endDate}
                              name="endDate"
                              onChange={(e) => {
                                setFieldValue("endDate", e.target.value);
                              }}
                              type="date"
                            />
                          </div>
                          <div
                            style={{ marginTop: "15px" }}
                            className="col-lg-4 d-flex"
                          >
                            <button
                              type="button"
                              className="btn btn-primary mr-2"
                              onClick={() => {
                                DeliveryReportOrganizationWiseLandingAction(
                                  profileData?.accountId,
                                  selectedBusinessUnit?.value,
                                  values?.startDate,
                                  values?.endDate,
                                  setRowDto,
                                  setLoader
                                );
                              }}
                              disabled={!values?.startDate || !values?.endDate}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-3">
                        {rowDto && (
                          <>
                            <div className="d-flex justify-content-end mt-4 px-0">
                              <ReactToPrint
                                trigger={() => (
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                  >
                                    <i
                                      style={{ fontSize: "18px" }}
                                      className="fas fa-print ml-3"
                                    ></i>
                                    Print
                                  </button>
                                )}
                                content={() => printRef.current}
                                pageStyle={
                                  "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                                }
                              />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Table Start */}
                {rowDto && (
                  <div>
                    <div ref={printRef}>
                      <h1 className="d-none-print text-center">
                        {selectedBusinessUnit.label}
                      </h1>
                      <h3 className="d-none-print text-center mt-3 mb-3">
                        Delivery Report
                      </h3>
                      <table className="table table-striped table-bordered bj-table bj-table-landing text-center table-font-size-sm">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Sales Org</th>
                            <th>Quantity</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td>1</td>
                            <td className="text-left">Local Sales</td>
                            <td>{rowDto?.localSales} </td>
                          </tr>
                          <tr>
                            <td>2</td>
                            <td className="text-left">Foreign Sales</td>
                            <td>{rowDto?.foreignSales} </td>
                          </tr>
                          <tr>
                            <td>3</td>
                            <td className="text-left">Wastage Sales</td>
                            <td>{rowDto?.wastageSales} </td>
                          </tr>
                          <tr>
                            <td colSpan="2">
                              <b>Grand Total</b>
                            </td>
                            <td>
                              <b>
                                {rowDto?.localSales +
                                  rowDto?.foreignSales +
                                  rowDto?.wastageSales}
                              </b>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
};

export default DeliveryReportOrganizationWise;
