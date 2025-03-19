import React, { useState } from "react";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import { ApplicationApproveModal } from "../Modal/applicationApproveModal";
import { ApplicationRejectModal } from "../Modal/applicationRejectModal";

export const ApplicationApproveTable = ({
  getData,
  landingData,
  filterObj,
}) => {
  const [isShowModal, setisShowModal] = useState(false);
  const [isRejectModal, setisRejectodal] = useState(false);
  const [singleData, setSingleData] = useState("");
  const header = [
    "SL",
    "Application ID",
    "Application Date",
    "Applicant's Name",
    "Account Holder's Name",
    "Hospital/Institutes",
    "Cause Of Donation/Zakat",
    "Effective Date",
    "Expiry Date",
    "Amount",
    "Action",
  ];
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <h6 style={{ marginBottom: 0, paddingTop: "25px" }}>
            Donation Application For Approval:
          </h6>
          <div>
            <ICustomTable ths={header} id="payment-status-table-to-xlsx">
              {landingData?.length > 0 &&
                landingData?.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="text-center">{item?.intApplicationID}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteApplicationDate)}
                    </td>
                    <td>{item?.strApplicantName}</td>
                    <td>{item?.strAccountHolderName}</td>
                    <td>{item?.strOrganizationName}</td>
                    <td>{item?.strDonationPurpose}</td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteEffectiveDate)}
                    </td>
                    <td className="text-center">
                      {_dateFormatter(item?.dteEndDate)}
                    </td>
                    <td className="text-right">{item?.monAmount}</td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <div
                          onClick={() => {
                            setisShowModal(true);
                            setSingleData(item);
                          }}
                          style={{
                            listStyle: "none",
                            cursor: "pointer",
                            color: "#52c726",
                          }}
                        >
                          Approve
                        </div>
                        <div
                          onClick={() => {
                            setisRejectodal(true);
                            setSingleData(item);
                          }}
                          style={{
                            listStyle: "none",
                            cursor: "pointer",
                            color: "#e11f1f",
                          }}
                        >
                          Reject
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
            </ICustomTable>
          </div>
          <div>
            <IViewModal
              title={"Approve Application"}
              show={isShowModal}
              onHide={() => setisShowModal(false)}
              modelSize={"lg"}
            >
              <ApplicationApproveModal
                singleData={singleData}
                getData={getData}
                setisShowModal={setisShowModal}
                filterObj={filterObj}
              />
            </IViewModal>
          </div>
          <div>
            <IViewModal
              title={"Reject Application"}
              show={isRejectModal}
              onHide={() => setisRejectodal(false)}
              modelSize={"lg"}
            >
              <ApplicationRejectModal
                singleData={singleData}
                getData={getData}
                setisRejectodal={setisRejectodal}
                filterObj={filterObj}
              />
            </IViewModal>
          </div>
        </div>
      </div>
    </>
  );
};
