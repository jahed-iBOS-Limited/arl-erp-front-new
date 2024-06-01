import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import IViewModal from "../../../../_helper/_viewModal";
import EditModal from "./editmodal";
const LandingTable = ({ obj }) => {
  const {
    profileData: { employeeId },
    tokenData: { token },
  } = useSelector((state) => state?.authData, shallowEqual);
  const { gridData, setLoading, setGridData, landingCB } = obj;
  const [isShowModal, setIsShowModal] = React.useState(false);
  const [clickedRow, setClickedRow] = React.useState({});
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Product Name
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Company Name
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Contact Person's Name
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Contact Number
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Active/ Inactive
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Account Manager
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Job Title
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Age Range
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Gender
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Industry
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Location (District)
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Employee Number
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Income Level
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Pain Points
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Goals
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Why They Choose Us
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Buying Behavior
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Preferred Communication Channels
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Competitors Brand Usages
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Enroll
              </th>
              <th
                style={{
                  minWidth: "100px",
                }}
              >
                Customer Id
              </th>
              {/* <th
                style={{
                  minWidth: "100px",
                }}
              >
                Channel
              </th> */}

              <th
                style={{
                  width: "70px",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {gridData?.map((item, index) => {
              return (
                <tr key={index}>
                  <td className="text-center"> {index + 1}</td>
                  <td>{item?.productName}</td>
                  <td>{item?.companyName}</td>
                  <td>{item?.contactPersonsName}</td>
                  <td>{item?.contactNumber}</td>
                  <td>{item?.activeInactive}</td>
                  <td>{item?.accountManager}</td>
                  <td>{item?.jobTitle}</td>
                  <td>{item?.ageRange}</td>
                  <td>{item?.gender}</td>
                  <td>{item?.industry}</td>
                  <td>{item?.locationDistrict}</td>
                  <td>{item?.employeeNumber}</td>
                  <td>{item?.incomeLevel}</td>
                  <td>{item?.painPoints}</td>
                  <td>{item?.goals}</td>
                  <td>{item?.whyTheyChooseUs}</td>
                  <td>{item?.buyingBehavior}</td>
                  <td>{item?.preferredCommunicationChannels}</td>
                  <td>{item?.competitorsBrandUsages}</td>
                  <td>
                    {
                      <InputField
                        value={item?.enroll || ""}
                        name="enroll"
                        placeholder="Enroll"
                        type="number"
                        onChange={(e) => {
                          const copyData = [...gridData];
                          copyData[index].enroll = e.target.value;
                          setGridData(copyData);
                        }}
                      />
                    }
                  </td>
                  <td>
                    {
                      <InputField
                        value={item?.enroll || ""}
                        name="enroll"
                        placeholder="Enroll"
                        type="number"
                        onChange={(e) => {
                          const copyData = [...gridData];
                          copyData[index].enroll = e.target.value;
                          setGridData(copyData);
                        }}
                      />
                    }
                  </td>
                  <td>
                    {
                      <InputField
                        value={item?.customerId || ""}
                        name="customerId"
                        placeholder="customerId"
                        type="number"
                        onChange={(e) => {
                          const copyData = [...gridData];
                          copyData[index].customerId = e.target.value;
                          setGridData(copyData);
                        }}
                      />
                    }
                  </td>
                  <td>
                    <div
                      className="d-flex justify-content-around"
                      style={{
                        gap: "8px",
                      }}
                    >
                      <span
                        onClick={() => {
                          setIsShowModal(true);
                          setClickedRow(item);
                        }}
                      >
                        {" "}
                        <IEdit />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isShowModal && (
        <>
          <IViewModal
            show={isShowModal}
            onHide={() => {
              setIsShowModal(false);
              setClickedRow({});
            }}
          >
            <EditModal
              clickedRow={clickedRow}
              landingCB={() => {
                landingCB();
                setIsShowModal(false);
                setClickedRow({});
              }}
            />
          </IViewModal>
        </>
      )}
    </>
  );
};

export default LandingTable;
