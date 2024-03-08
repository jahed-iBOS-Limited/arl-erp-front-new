import React, { useState } from "react";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IViewModal from "../../../../_helper/_viewModal";
import StandByApprovalModal from "../modalView/standByApprovalModal";

export default function StandByVehicleStatus({ rowData, values }) {
  const [isShowApproveModal,setShowApproveModal] = useState(false)
  const [singleData,setSingleData] = useState({})
  return (
    <div>
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
            <th>Driver Name and Mobile</th>
            <th>Status</th>
            <th>Action</th>
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
                {item?.workplace}
              </td>
              <td className="">
                {item?.bookingTime}
              </td>
              <td className="">
                {item?.tourTime}
              </td>
              <td className="">
                ""
              </td>
              <td className="">
                {item?.purpose}
              </td>
              <td className="">
                {item?.numberOfPerson}
              </td>
              <td className="">
                <span>{item?.driverName}</span>
                <span>({item?.driverContact})</span>
              </td>
              <td className="">
               <strong style={{color:item?.adminStatus==="Approved" ? "green" : item?.adminStatus === "Reject" ? "red":"black"}}>{item?.adminStatus}</strong>
              </td> 
              <td>
                {item?.adminStatus === "Pending"? <>
               <span style={{display:"flex", alignItems:"center", gap:"5px"}}>
              <span onClick={()=>{
                  setShowApproveModal(true)
                  setSingleData(item)
                }}> <IApproval title="Approve"/></span> <IDelete title="Reject" iconName="fa fa-window-close-o" />
               </span>
                </>: ""}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isShowApproveModal && <IViewModal show={isShowApproveModal} onHide={()=>setShowApproveModal(false)}>
        <StandByApprovalModal singleData={singleData}/>
        </IViewModal>}
     
    </div>
  );
}
