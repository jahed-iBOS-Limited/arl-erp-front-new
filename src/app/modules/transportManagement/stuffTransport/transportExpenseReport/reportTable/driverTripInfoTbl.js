import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IView from "../../../../_helper/_helperIcons/_view";
import NewIcon from "../../../../_helper/_helperIcons/newIcon";
import IViewModal from "../../../../_helper/_viewModal";
import MapView from "../mapView";
import AttachmentViewModal from "./attachmentViewModal";

export default function DriverTripInfoTbl({ rowData }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [singleData, setSingleData] = useState({})
  const [showAttachmentModal,setShowAttachmentModal] =useState(false)
  const totalKM = rowData?.reduce((acc, curr) => acc + curr?.tripKM, 0);
  const totalTollAmount = rowData?.reduce(
    (acc, curr) => acc + curr?.numTollAmount,
    0
  );
  const totalFoodAmount = rowData?.reduce(
    (acc, curr) => acc + curr?.numFoodAmount,
    0
  );
  const totalOthers = rowData?.reduce(
    (acc, curr) => acc + curr?.numOthersAmount,
    0
  );
  const totalMaintenance = rowData?.reduce(
    (acc, curr) => acc + curr?.numRepairingAmount,
    0
  );
  const totalDriverCost = rowData?.reduce((acc, curr) => {
    const total =
      curr?.numTollAmount + curr?.numOthersAmount + curr?.numRepairingAmount;
    return acc + total;
  }, 0);

  const totalLPG = rowData?.reduce((acc, curr) => acc + curr?.lpeg, 0);
  const totalDiesel = rowData?.reduce((acc, curr) => (acc = curr?.diesel), 0);
  const totalOctane = rowData?.reduce((acc, curr) => (acc = curr?.octane), 0);
  const totalFuelCost = totalLPG + totalDiesel + totalOctane;
  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Driver Trip Details</strong>
      </h4>
      <div className="table-responsive">
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Date</th>
            <th>Trip Type</th>
            <th>Trip No</th>
            <th>KM</th>
            <th>Vehicle No</th>
            <th>From</th>
            <th>To</th>
            <th>Toll</th>
            <th>DA</th>
            <th>Others</th>
            <th>Maintaince</th>
            <th>Total Driver Cost</th>
            <th>LPG Gas</th>
            <th>Diesel</th>
            <th>Octane </th>
            <th>Total Fuel Cost</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.length > 0 &&
            rowData?.map((item, index) => (
              <tr key={index}>
                <td className="text-center">{index + 1}</td>
                <td className="text-center">
                  {_dateFormatter(item?.dteTripDate)}
                </td>
                <td>{item?.strTripType}</td>
                <td>{item?.strTripCode}</td>
                <td className="text-center">{item?.tripKM}</td>
                <td className="text-center">{item?.strVehicleNo}</td>
                <td>{item?.strFirstRoundStartAddress}</td>
                <td>{item?.strFirstRoundEndAddress}</td>
                <td className="text-right">{item?.numTollAmount}</td>
                <td className="text-right">{item?.numFoodAmount}</td>
                <td className="text-right">{item?.numOthersAmount}</td>
                <td className="text-right">{item?.numRepairingAmount}</td>
                <td className="text-right">
                  {item?.numTollAmount +
                    item?.numOthersAmount +
                    item?.numRepairingAmount}
                </td>
                <td className="text-right">{item?.lpeg}</td>
                <td className="text-right">{item?.diesel}</td>
                <td className="text-right">{item?.octane}</td>
                <td className="text-right">
                  {item?.lpeg + item?.diesel + item?.octane}
                </td>
                <td className="text-center">
                  <div style={{display:"flex", gap:"4px",padding:"0px 8px"}}>
                  <span
                    onClick={() => {
                      setSingleData(item);
                      setIsShowModal(true);
                    }}
                  >
                    <IView styles={{fontSize:"15px"}}/>
                  </span>
                  <NewIcon
                  customStyles={{cursor:"pointer",fontSize:"15px"}}
                  title = "View All Attachment"
                  clickHandler={()=>{
                    setShowAttachmentModal(true)
                    setSingleData(item);
                  }}
                  iconName="fa fa-file-image-o"
                  />
                  </div>
                </td>
              </tr>
            ))}
          {rowData?.length > 0 && (
            <tr style={{ fontWeight: "bold" }}>
              <td colSpan={3}>Total</td>
              <td className="text-right"> {totalKM} </td>
              <td colSpan={3}></td>
              <td className="text-right">{_formatMoney(totalTollAmount)}</td>
              <td className="text-right">{_formatMoney(totalFoodAmount)}</td>
              <td className="text-right">{_formatMoney(totalOthers)}</td>
              <td className="text-right">{_formatMoney(totalMaintenance)}</td>
              <td className="text-right">{_formatMoney(totalDriverCost)}</td>
              <td className="text-right">{_formatMoney(totalLPG)}</td>
              <td className="text-right">{_formatMoney(totalDiesel)}</td>
              <td className="text-right">{_formatMoney(totalOctane)}</td>
              <td className="text-right">{_formatMoney(totalFuelCost)}</td>
            </tr>
          )}
        </tbody>
      </table>
      </div>
      <div>
        <IViewModal
          show={isShowModal}
          onHide={() => {
            setIsShowModal(false);
          }}
          title="Trip Details Info Report"
        >
          <MapView singleData={singleData} />
        </IViewModal>
        <IViewModal
          show={showAttachmentModal}
          onHide={() => {
            setShowAttachmentModal(false);
          }}
          title="Attachment View"
        >
          <AttachmentViewModal singleData={singleData} />
        </IViewModal>
      </div>
    </div>
  );
}
