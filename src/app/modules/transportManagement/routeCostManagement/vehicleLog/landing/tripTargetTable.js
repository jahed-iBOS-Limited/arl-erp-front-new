import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const VehicleTripTargetTable = ({ obj }) => {
  const { rowData, buId, values, details } = obj;

  const [detailsRowData, getTargetDetails, loader] = useAxiosGet();
  const [open, setOpen] = useState(false);

  const getDetails = () => {
    getTargetDetails(
      `/tms/Vehicle/GetVehicleTripTargetDetails?businessUnitId=${buId}&shipPointId=${values?.shipPoint?.value}&vehicleId=${values?.vehicleNo?.value}&yearId=${values?.year?.value}&monthId=${values?.month?.value}`,
      (resData) => {
        if (resData?.length > 0) {
          setOpen(true);
        }
      }
    );
  };

  return (
    <>
      {loader && <Loading />}
      {rowData?.data?.length > 0 && (
       <div className="table-responsive">
         <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              {details ? <th>Date</th> : <th>SL</th>}
              <th>ShipPoint</th>
              <th>Month</th>
              <th>Year</th>
              <th>Vehicle</th>
              <th>Trip Target</th>
              {!details && <th>Action</th>}
            </tr>
          </thead>
          <tbody>
            {rowData?.data?.map((data, i) => {
              const date = new Date(
                data?.yearId,
                data?.monthId - 1,
                data?.dayId
              );
              return (
                <tr key={i + 1}>
                  {details ? <td>{_dateFormatter(date)}</td> : <td>{i + 1}</td>}
                  <td>{data.shipPointName}</td>
                  <td>{data.monthName}</td>
                  <td>{data.yearId}</td>
                  <td>{data.vehicleName}</td>
                  <td>{data.tripTarget}</td>
                  {!details && (
                    <td className="text-center d-flex justify-content-around">
                      <IView
                        title={"View Details"}
                        clickHandler={() => {
                          getDetails();
                        }}
                      />
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
       </div>
      )}
      <IViewModal show={open} onHide={() => setOpen(false)}>
        <VehicleTripTargetDetails obj={{ rowData: { data: detailsRowData } }} />
      </IViewModal>
    </>
  );
};

export default VehicleTripTargetTable;

const VehicleTripTargetDetails = ({ obj }) => {
  const { rowData } = obj;
  return (
    <>
      <VehicleTripTargetTable obj={{ rowData, details: true }} />
    </>
  );
};
