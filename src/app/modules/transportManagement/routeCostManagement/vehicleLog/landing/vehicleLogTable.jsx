import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";

const VehicleLogTable = ({ obj }) => {
  const {
    setId,
    values,
    rowData,
    setOpen,
    permitted,
    setShowModal,
    setSingleItem,
    deleteVehicleLog,
  } = obj;

  return (
    <>
      {rowData?.data?.length > 0 && (
       <div className="table-responsive">
         <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Date</th>
              <th>Code</th>
              <th>From</th>
              <th>To</th>
              <th>Consumed Mileage</th>
              <th>Usage Type</th>
              <th>Fuel Purchased?</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.length &&
              rowData?.data?.map((data, i) => (
                <tr key={i + 1}>
                  <td>{i + 1}</td>
                  <td>{_dateFormatter(data.travelDate)}</td>
                  <td>{data.travelCode}</td>
                  <td>{data.fromAddress}</td>
                  <td>{data.toAddress}</td>
                  <td>{data.vehicleConsumedMileage}</td>
                  <td>
                    {data.isPersonalUsage === true ? "Personal" : "Official"}
                  </td>
                  <td>{data.isFuelPurchased === true ? "Yes" : "No"}</td>
                  <td className="text-center d-flex justify-content-around">
                    <IView
                      clickHandler={() => {
                        setShowModal(true);
                        setId(data?.vehicleLogId);
                      }}
                    />
                    {permitted && (
                      <>
                        <IEdit
                          title="Vehicle Update"
                          onClick={() => {
                            setSingleItem(data);
                            setOpen(true);
                          }}
                        />
                        <span
                          onClick={() => {
                            deleteVehicleLog(data?.vehicleLogId, values);
                          }}
                        >
                          <IDelete />
                        </span>
                      </>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
       </div>
      )}
    </>
  );
};

export default VehicleLogTable;
