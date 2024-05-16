/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { Formik } from "formik";
import { Form } from "formik";
import Loading from "../../../../_helper/_loading";
import moment from "moment";
import {
  customerCreditBalanceLanding,
  getDistributionChannelDDL,
} from "../helper";
import ReactToPrint from "react-to-print";
import printIcon from "../../../../_helper/images/print-icon.png";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import NewSelect from "./../../../../_helper/_select";
import { _todayDate } from "./../../../../_helper/_todayDate";
import InputField from "./../../../../_helper/_inputField";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  distributionChannel: "",
};

function CustomerCreditBalanceLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
  }, [selectedBusinessUnit, profileData]);

  const printRef = useRef();

  return (
    <>
      <ICustomCard title="Customer Credit Balance">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form className="form form-label-right">
                <div className="form-group row global-form printSectionNone">
                  <div className="col-lg-3">
                    <NewSelect
                      name="distributionChannel"
                      options={distributionChannelDDL}
                      value={values?.distributionChannel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setFieldValue("distributionChannel", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Distribution Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        setGridData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setGridData([]);
                      }}
                    />
                  </div>

                  <div className="col d-flex align-items-end mt-2">
                    <button
                      disabled={!values?.distributionChannel}
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        customerCreditBalanceLanding(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.fromDate,
                          values?.toDate,
                          values?.distributionChannel?.value,
                          setGridData,
                          setLoading
                        );
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
                {gridData?.length > 0 && (
                  <div componentRef={printRef} ref={printRef}>
                    <div className="text-center mt-4">
                      <div className="d-flex justify-content-end">
                        <div className="printSectionNone text-right">
                          <ReactToPrint
                            trigger={() => (
                              <button
                                type="button"
                                className="btn btn-primary"
                                style={{ padding: "2px 5px" }}
                              >
                                <img
                                  style={{
                                    width: "25px",
                                    paddingRight: "5px",
                                  }}
                                  src={printIcon}
                                  alt="print-icon"
                                />
                                Print
                              </button>
                            )}
                            content={() => printRef.current}
                            pageStyle={
                              "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
                            }
                          />
                        </div>
                        <div className="printSectionNone text-right ml-2 mt-0">
                          <ReactHTMLTableToExcel
                            id="test-table-xls-button"
                            className="p-2 btn btn-primary"
                            table="table-to-xlsx"
                            filename={`Customer Credit Balance excel`}
                            sheet={"tablexls"}
                            buttonText="Export to Excel"
                            style={{ padding: "0px" }}
                          />
                        </div>
                      </div>
                      <h1>{selectedBusinessUnit.label}</h1>
                      <h6>{selectedBusinessUnit.address}</h6>
                      <hr />
                      <h4 style={{ marginTop: "10px" }}>
                        Customer Credit Balance
                      </h4>
                      {/* <h5>Date: {_dateFormatter(new Date())}</h5> */}
                      <div className="d-flex justify-content-center">
                        <h5>
                          From Date:{" "}
                          {moment(values?.fromDate).format("DD-MM-YYYY")}
                        </h5>
                        <h5 className="ml-5">
                          To Date: {moment(values?.toDate).format("DD-MM-YYYY")}
                        </h5>
                      </div>
                    </div>

                    <div className="row">
                      {loading && <Loading />}
                      <div className="col-lg-12">
                        <div className="table-responsive">
                          <table
                            className="table table-striped table-bordered global-table table-font-size-sm"
                            id="table-to-xlsx"
                          >
                            <thead>
                              <tr>
                                <th>Customer Name</th>
                                <th>Credit Limit Days</th>
                                <th>Credit Limit</th>
                                <th>Debit</th>
                                <th>Collection</th>
                                <th>Outstanding</th>
                              </tr>
                            </thead>
                            <tbody className="text-center">
                              {gridData?.map((item, index) => (
                                <tr key={index}>
                                  <td>
                                    <div className="text-left pl-2">
                                      {item?.soldToPArtnerName}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {item?.collectionDays}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {numberWithCommas(
                                        Math.round(item?.creditLimit || 0),
                                        0
                                      )}
                                    </div>
                                  </td>
                                  <td className="text-right">
                                    <div className="text-right pr-2">
                                      {numberWithCommas(
                                        Math.round(item?.debit || 0, 0)
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {numberWithCommas(
                                        Math.round(item?.collection || 0),
                                        0
                                      )}
                                    </div>
                                  </td>
                                  <td>
                                    <div className="text-right pr-2">
                                      {item?.outstanding}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
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
}

export default CustomerCreditBalanceLanding;
