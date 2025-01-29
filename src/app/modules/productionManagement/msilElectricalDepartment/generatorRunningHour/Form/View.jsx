/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef } from "react";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";

const BreakdownViewModal = ({ currentItem, values }) => {
  const { intBusinessUnitId, intGeneratorRunningHourId } = currentItem;

  const [rowData, getRowData, loading] = useAxiosGet([]);
  const printRef = useRef();

  useEffect(() => {
    getRowData(
      `/mes/MSIL/GetGeneratorRunningHourBreakDownTypeList?BusinessUnitId=${intBusinessUnitId}&RunningHourId=${intGeneratorRunningHourId}`
    );
  }, [currentItem]);

  return (
    <div>
      {rowData?.length > 0 && (
        <>
          {/* <div className="mt-4 d-flex justify-content-end">
            <ReactHTMLTableToExcel
              id="test-table-xls-button-att-reports"
              className="btn btn-primary m-0 mx-2 py-2 px-2"
              table="table-to-xlsx"
              filename="Work Schedule Report"
              sheet="Work Schedule Report"
              buttonText="Export Excel"
            />
            <button type="button" className="btn btn-primary p-0 m-0 py-2 px-2">
              <ReactToPrint
                pageStyle={
                  "@media print{body { -webkit-print-color-adjust: exact;}@page {size: portrait ! important}}"
                }
                trigger={() => (
                  <i style={{ fontSize: "18px" }} className="fas fa-print"></i>
                )}
                content={() => printRef.current}
              />
            </button>
          </div> */}
        </>
      )}
      {loading && <Loading />}
      {true && <ModalProgressBar />}
      <div className="row">
        <div className="col-lg-4">
          Date:{" "}
          {currentItem?.dteDate ? _dateFormatter(currentItem?.dteDate) : ""}
        </div>
        <div className="col-lg-4">Shift Name: {currentItem?.strShift}</div>
        <div className="col-lg-4">
          Generator Name: {currentItem?.strGeneratorName}
        </div>
        <div className="col-lg-4">
          Start Time: {_timeFormatter(currentItem?.tmStartTime)}
        </div>
        <div className="col-lg-4">
          End Time: {_timeFormatter(currentItem?.tmEndTime)}
        </div>
        <div className="col-lg-4">
          Running Hour:{" "}
          {currentItem && currentItem?.tmTotalHour?.split(":")?.[0] + "H"}{" "}
          {currentItem && currentItem?.tmTotalHour?.split(":")?.[1] + "M"}
        </div>
        <div className="col-lg-4">
          Previous Running Hour: {currentItem?.numPreviousReading}
        </div>
        <div className="col-lg-4">
          Present Running Hour: {currentItem?.numPresentReading}
        </div>
        <div className="col-lg-4">
          Generation (KWh): {currentItem?.numGeneration}
        </div>
        <div className="col-lg-4">
          Generation (KW): {currentItem?.numGenerationKw}
        </div>
      </div>
      <div ref={printRef}>
        <div className="table-responsive">
          <table
            id="table-to-xlsx"
            className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table mr-1"
          >
            <thead>
              <tr>
                <th style={{ width: "30px" }}>SL</th>
                <th className="text-center">Breakdown Type</th>
                <th className="text-center">Reason Of Stopage</th>
                <th className="text-center">Start Time</th>
                <th className="text-center">End Time</th>
                <th className="text-center">Duration (hr)</th>
              </tr>
            </thead>
            <tbody>
              {rowData?.data?.breakDownTypeObject?.map((item, index) => (
                <tr>
                  <td>{index + 1}</td>
                  <td className="text-center">{item?.strBreakdownType}</td>
                  <td className="text-center">{item?.strReasonOfStopage}</td>
                  <td className="text-center">
                    {_timeFormatter(item?.strStartTime)}
                  </td>
                  <td className="text-center">
                    {_timeFormatter(item?.strEndTime)}
                  </td>
                  <td className="text-center">{item?.numDuration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* <h3 className="d-none-print text-center">BreakDown Details</h3> */}
      </div>
    </div>
  );
};

export default BreakdownViewModal;
