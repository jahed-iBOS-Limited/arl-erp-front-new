import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function FuelStationSummaryTbl({ rowData, values }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [detailsData, getDetailsData, loading, setDetailsData] = useAxiosGet();
  return (
    <div>
      {loading && <Loading />}
      <h4 className="text-center mt-5">
        <strong>Fuel Station Wise Summary Fuel Cost</strong>
      </h4>
      <div className="table-responsive">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Fuel Station Name</th>
            <th>Total Purchase</th>
            <th>Cash</th>
            <th>Credit</th>
            <th style={{ minWidth: "30px" }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.strFuelStationName}</td>
              <td className="text-right">
                {item?.numFuelCashAmount + item?.numFuelCreditAmount}
              </td>
              <td className="text-right">{item?.numFuelCashAmount}</td>
              <td className="text-right">{item?.numFuelCreditAmount}</td>
              <td className="text-center">
                <IView
                  clickHandler={() => {
                    setIsShowModal(true);
                    setDetailsData([]);
                    getDetailsData(
                      `/mes/VehicleLog/GetFuelStationCosting?partName=fuelStationCostDetails&intFuelStationId=${item?.intFuelStationId}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`
                    );
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      <IViewModal
        title={"Fuel Station Name"}
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
       <div className="table-responsive">
       <table className="table table-striped table-bordered bj-table bj-table-landing">
          <thead>
            <tr>
              <th>SL</th>
              <th>LPG Gas</th>
              <th>Diesel</th>
              <th>Octane </th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {detailsData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="text-right">{item?.lpg}</td>
                <td className="text-right">{item?.diesel}</td>
                <td className="text-right">{item?.octane} </td>
                <td className="text-center">
                  {_dateFormatter(item?.dteTripDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       </div>
      </IViewModal>
    </div>
  );
}
