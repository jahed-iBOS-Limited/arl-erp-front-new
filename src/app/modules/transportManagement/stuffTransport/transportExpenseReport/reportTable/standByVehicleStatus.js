import React, { useState } from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function StandByVehicleStatus({ rowData, values }) {
  const [isShowModal, setIsShowModal] = useState(false);
  const [detailsData, getDetailsData, loading, setDetailsData] = useAxiosGet();
  return (
    <div>
      {loading && <Loading />}
      <h4 className="text-center mt-5">
        <strong>Stand By Vehicle Status</strong>
      </h4>
      <table className="table table-striped table-bordered bj-table bj-table-landing">
        <thead>
          <tr>
            <th>SL</th>
            <th>Employee Name</th>
            <th>Enroll</th>
            <th>Designation</th>
            <th>Email Address</th>
            <th>Job Station</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Destination</th>
            <th>Purpose(In Details)</th>
            <th>Total Person</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {rowData?.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item?.employeeName}</td>
              <td className="">
                { item?.employeeId}
              </td>
              <td className="">
                {item?.designation}
              </td>
              <td className="">
                {item?.officeMail}
              </td>
              
              <td className="">
                {item?.bookingTime}
              </td>
              <td className="">
                {item?.tourTime}
              </td>
              <td className="">
                {item?.designation}
              </td>
              <td className="">
                {item?.purpose}
              </td>
              <td className="">
                {item?.numberOfPerson}
              </td>
              <td className="">
                <span>{item?.driverName}</span>
                <span>{item?.driverContact}</span>
              </td>
              <td className="">
               <strong style={{color:item?.adminStatus==="Approved" ? "green" : item?.adminStatus === "Reject" ? "red":"black"}}>{item?.adminStatus}</strong>
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
            {detailsData?.map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td className="">{item?.lpg}</td>
                <td className="">{item?.diesel}</td>
                <td className="">{item?.octane} </td>
                <td className="text-center">
                  {_dateFormatter(item?.dteTripDate)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </IViewModal>
    </div>
  );
}
