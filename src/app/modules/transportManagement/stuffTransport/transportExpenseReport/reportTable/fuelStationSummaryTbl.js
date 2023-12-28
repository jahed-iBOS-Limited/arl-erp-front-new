import React, { useState } from "react";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";

export default function FuelStationSummaryTbl({ rowData }) {
  const [isShowModal, setIsShowModal] = useState(false);
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Fuel Station Wise Summary Fuel Cost</strong>
      </h4>
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
            <tr>
              <td>SL</td>
              <td>Fuel Station Name</td>
              <td>Total Purchase</td>
              <td>Cash</td>
              <td>Credit</td>
              <td className="text-center">
                <IView
                  clickHandler={() => {
                    setIsShowModal(true);
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <IViewModal
        title={"Fuel Station Name"}
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
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
            {[1]?.map((item, index) => (
              <tr>
                <td>SL</td>
                <td>LPG Gas</td>
                <td>Diesel</td>
                <td>Octane </td>
                <td>Date</td>
              </tr>
            ))}
          </tbody>
        </table>
      </IViewModal>
    </div>
  );
}
