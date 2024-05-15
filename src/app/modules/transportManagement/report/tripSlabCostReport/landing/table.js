/* eslint-disable react-hooks/exhaustive-deps */
import { Form, Formik } from "formik";
import React, { useRef, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import ICard from "../../../../_helper/_card";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getLandingData } from "../helper";
const initData = {
  shipPoint: "",
};

function TripSlabCostReport() {
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  const getReportView = (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        values?.shipPoint?.value,
        setGridData,
        setLoading
      );
    }
  };

  const printRef = useRef();
  return (
    <>
      <ICard
        printTitle="Print"
        isPrint={true}
        isShowPrintBtn={true}
        componentRef={printRef}
        isExcelBtn={true}
        excelFileNameWillbe="Trip Slab Cost Report"
        title="Trip Slab Cost Report"
      >
        {loading && <Loading />}
        <Formik enableReinitialize={true} initialValues={{ initData }}>
          {({ values, setFieldValue, errors, touched }) => (
            <>
              <Form>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={[{ value: 0, label: "All" }, ...shipPointDDL]}
                      value={values?.shipPoint}
                      label="Shippoint"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                        setGridData([]);
                      }}
                      placeholder="Shippoint"
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="col d-flex  align-items-end">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getReportView(values);
                      }}
                      disabled={!values?.shipPoint}
                    >
                      View
                    </button>
                  </div>
                </div>
                <div className="text-center">
                  <h2>{selectedBusinessUnit?.label}</h2>
                  <h6> Thana Wise Transport Rate </h6>
                </div>
                <div className="table-responsive">
                <table
                  className="table table-striped table-bordered global-table"
                  id="table-to-xlsx"
                  ref={printRef}
                >
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Ship Point</th>
                      <th>Transport Zone</th>
                      <th>Minimum Order Qty</th>
                      <th>Maximum Order Qty</th>
                      <th>KM (Up-Down)</th>
                      <th>Transport Rate</th>
                      {/* <th>Proposal Rate (per ton)</th> */}
                      <th>Subsidy Rate</th>
                      <th>Insert By</th>
                      <th>Insertion Date</th>
                      <th>Handling Cost</th>
                      <th>Labour Cost</th>
                      <th>Other Cost</th>
                      <th>Is Amount Base</th>
                      <th>Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gridData?.map((item, index) => (
                      <tr
                        style={
                          item?.isAmountBase
                            ? { backgroundColor: "#ff5f5f" }
                            : {}
                        }
                        key={index}
                      >
                        <td className="text-center"> {index + 1}</td>
                        <td>{item?.shippointName}</td>
                        <td>{item?.zoneName}</td>
                        <td className="text-right">{item?.minimumOrderQty}</td>
                        <td className="text-right">{item?.maximumOrderQty}</td>
                        <td className="text-right">{item?.distanceKm}</td>
                        <td className="text-right">{item?.proposalRate}</td>
                        <td className="text-right">{item?.subsidiaryRate}</td>
                        <td>{item?.userName}</td>
                        <td>{_dateFormatter(item?.lastActionDateTime)}</td>
                        <td className="text-right">
                          {_fixedPoint(item?.handlingCost, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.labourCost, true, 0)}
                        </td>
                        <td className="text-right">
                          {_fixedPoint(item?.otherCost, true, 0)}
                        </td>
                        <td>{item?.isAmountBase ? "Yes" : "No"}</td>
                        <td>{item?.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICard>
    </>
  );
}

export default TripSlabCostReport;
