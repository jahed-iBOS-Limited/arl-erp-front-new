import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import NewIcon from "../../../../_helper/_helperIcons/newIcon";
import IViewModal from "../../../../_helper/_viewModal";
import CommonTable from "../../../../_helper/commonTable";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import StandByApprovalModal from "../modalView/standByApprovalModal";

export default function StandByVehicleStatus({ rowData, values, getRowData }) {
  const [isShowApproveModal, setShowApproveModal] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [, saveReject] = useAxiosPost();
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const headersData = [
    "SL",
    "Employee Name",
    "Enroll",
    "Designation",
    "Email Address",
    "Job Station",
    "Start Time",
    "End Time",
    "Destination",
    "Purpose(In Details)",
    "Total Person",
    "Driver Name and Mobile",
    "Status",
    "Action",
  ];

  return (
    <div>
      <h4 className="text-center mt-5">
        <strong>Stand By Vehicle Status</strong>
      </h4>
      <CommonTable headersData={headersData}>
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
                        <NewIcon
                          title="Approve"
                          customStyles={{ color: "green", fontSize: "14px" }}
                          iconName="fas fa-check-circle"
                        />
                      </span>{" "}
                      <span
                        onClick={() =>
                          saveReject(
                            `/mes/VehicleLog/ApproveBookingStandByVehicle`,
                            {
                              isAdminApprove: false,
                              bookingId: item?.bookingId,
                              driverId: 0,
                              driverName: "",
                              vehicleId: "",
                              vehicleName: "",
                              approvedBy: userId,
                            },
                            () => {
                              getRowData(
                                `/mes/VehicleLog/GetBookingStandByVehicleStatus?fromDate=${values?.fromDate}&todate=${values?.toDate}&adminStatus=${values?.status?.value}`
                              );
                            },
                            true
                          )
                        }
                      >
                        <NewIcon
                          title="Reject"
                          customStyles={{ color: "red", fontSize: "14px" }}
                          iconName="fa fa-times-circle closeBtn"
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
      </CommonTable>

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
