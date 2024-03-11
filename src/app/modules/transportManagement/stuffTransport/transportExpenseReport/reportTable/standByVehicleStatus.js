import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import StandByApprovalModal from "../modalView/standByApprovalModal";

export default function StandByVehicleStatus({ rowData, values, getRowData }) {
  const [isShowApproveModal, setShowApproveModal] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [, saveReject] = useAxiosPost();
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);
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
              <td className="text-center">{index + 1}</td>
              <td className="text-center">{item?.employeeName}</td>
              <td className="text-center">{item?.employeeId}</td>
              <td className="text-center">{item?.designation}</td>
              <td className="text-center">{item?.officeMail}</td>

              <td className="text-center">{item?.workplace}</td>
              <td className="text-center">{item?.bookingTime}</td>
              <td className="text-center">{item?.tourTime}</td>
              <td className="text-center">{item?.tripToAddress}</td>
              <td className="text-center">{item?.purpose}</td>
              <td className="text-center">{item?.numberOfPerson}</td>
              <td className="text-center">
                <span>{item?.driverName}</span>
                <span>({item?.driverContact})</span>
              </td>
              <td className="text-center">
                <strong
                  style={{
                    color:
                      item?.adminStatus === "Approved"
                        ? "green"
                        : item?.adminStatus === "Rejected"
                        ? "red"
                        : "black",
                  }}
                >
                  {item?.adminStatus}
                </strong>
              </td>
              <td>
                {item?.adminStatus === "Pending" ? (
                  <>
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "5px",
                      }}
                    >
                      <span
                        onClick={() => {
                          setShowApproveModal(true);
                          setSingleData(item);
                        }}
                      >
                        {" "}
                        <IApproval title="Approve" />
                      </span>{" "}
                      <span
                        onClick={()=>saveReject(
                          `/mes/VehicleLog/ApproveBookingStandByVehicle`,
                          {
                            isAdminApprove: false,
                            bookingId: item?.bookingId,
                            driverId: 0,
                            driverName: "",
                            vehicleId:"",
                            vehicleName:"",
                            approvedBy: userId,
                          },
                          ()=>{
                            getRowData(
                              `/mes/VehicleLog/GetBookingStandByVehicleStatus?fromDate=${values?.fromDate}&todate=${values?.toDate}&adminStatus=${values?.status?.value}`
                            );
                          },
                          true
                        )}
                      >
                        <IDelete
                          title="Reject"
                          iconName="fa fa-window-close-o"
                        />
                      </span>
                    </span>
                  </>
                ) : (
                  ""
                )}
                 
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {isShowApproveModal && (
        <IViewModal
          show={isShowApproveModal}
          onHide={() => setShowApproveModal(false)}
        >
          <StandByApprovalModal
            singleData={singleData}
            getRowData={getRowData}
            setShowApproveModal={setShowApproveModal}
            parentValues={values}
          />
        </IViewModal>
      )}
    </div>
  );
}
