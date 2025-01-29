/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useEffect, useRef, useState } from "react";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { shallowEqual, useSelector } from "react-redux";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import printIcon from "../../../../_helper/images/print-icon.png";
import { getexistingTranportPolicyLandingData } from "../helper";

const initData = {};

function ExistingTransportPolicyLanding() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    getexistingTranportPolicyLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading
    );
  }, [selectedBusinessUnit, profileData]);

  const printRef = useRef();

  return (
    <>
      <ICustomCard title="Existing Transport Policy">
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={initData}>
          {({ values, setFieldValue }) => (
            <>
              <Form componentRef={printRef} ref={printRef}>
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
                        filename={`Existing Transport Policy`}
                        sheet={"tablexls"}
                        buttonText="Export to Excel"
                        style={{ padding: "0px" }}
                      />
                    </div>
                  </div>
                  <h1>{selectedBusinessUnit.label}</h1>
                  <h6>Proposed Transport Rate</h6>
                </div>
                <div className="row">
                  {loading && <Loading />}
                  <div className="col-lg-12 table-responsive">
                    <table
                      className="table table-striped table-bordered global-table"
                      id="table-to-xlsx"
                    >
                      <thead>
                        <tr>
                          <th rowSpan="2">SL</th>
                          <th rowSpan="2">Zone Name</th>
                          <th colSpan="3" rowSpan="1">
                            Particulars
                          </th>
                          <th rowSpan="2">Additional Cost</th>
                        </tr>
                        <tr>
                          <th rowSpan="1">
                            <div>1-45000 pcs</div>
                            <div>(3 Ton)</div>
                          </th>
                          <th rowSpan="1">
                            <div>46000-65000 pcs</div>
                            <div>(5 Ton)</div>
                          </th>
                          <th rowSpan="1">
                            <div>65001-100000 pcs</div>
                            <div>(7 Ton)</div>
                          </th>
                        </tr>
                      </thead>
                      <tbody className="text-center">
                        {gridData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>
                              <div className="text-left pl-2">
                                {item?.zoneName}
                              </div>
                            </td>
                            <td className="text-right">
                              <div className="text-right pr-2">
                                {item?.num3Ton}
                              </div>
                            </td>
                            <td className="text-right">
                              <div className="text-right pr-2">
                                {item?.num5Ton}
                              </div>
                            </td>
                            <td className="text-right">
                              <div className="text-right pr-2">
                                {item?.num7Ton}
                              </div>
                            </td>
                            <td className="text-right">
                              <div className="text-right pr-2">
                                {item?.additional}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </>
  );
}

export default ExistingTransportPolicyLanding;
