import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
import AttachmentUploaderNew from "../../../../_helper/attachmentUploaderNew";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import IViewModal from "../../../../_helper/_viewModal";
import { AwaitingAuditModal } from "./awaitingAuditModal";

export const DateWiseReportTable = ({ landingData, filterObj }) => {
  const [, uploadFile] = useAxiosPost();
  const dispatch = useDispatch();
  let totalAmount = landingData?.reduce(
    (sum, data) => sum + data?.monAmount,
    0
  );

  const[awaitingAuditState, setAwaitingAuditState] = useState({
    data: {},
    isShowModal: false,
  });

  const handleUploadAttachment = (file, applicationId) => {
    const url = `/hcm/TrustManagement/UpdateDonationApplicationAttachmentById`;
    //payload for single file upload
    const payload = {
      applicationId,
      attachmentUrl: file[0]?.id,
    };
    uploadFile(url, payload);
  };
  return (
    <>
      <div className="row">
        <div className="col-lg-12">
          <h6 style={{ marginBottom: 0, paddingTop: "30px" }}>
            Date Wise Details Report:
          </h6>
          <div className="loan-scrollable-table employee-overall-status">
            <div style={{}} className="scroll-table _table">
              <table
                className="table table-striped table-bordered bj-table bj-table-landing"
                id="date-wise-table-to-xlsx"
              >
                <thead>
                  <tr>
                    <th style={{ minWidth: "70px" }}>SL</th>
                    <th style={{ minWidth: "100px" }}>Application's Id</th>
                    <th style={{ minWidth: "100px" }}>Registration No</th>
                    <th>Application Date</th>
                    <th style={{ minWidth: "130px" }}>Applicant Name</th>
                    <th style={{ minWidth: "150px" }}>Name of Beneficiary</th>
                    <th style={{ minWidth: "90px" }}>Adress</th>
                    <th style={{ minWidth: "80px" }}>Contact No</th>
                    <th style={{ minWidth: "80px" }}>National Id</th>
                    <th style={{ minWidth: "150px" }}>Hospital/Institutes</th>
                    <th style={{ minWidth: "140px" }}>
                      Cause of Donation/Zakat
                    </th>
                    <th style={{ minWidth: "100px" }}>Donation Name</th>
                    <th style={{ minWidth: "100px" }}>Mode of Payment</th>
                    <th style={{ minWidth: "70px" }}>Amount</th>
                    <th style={{ minWidth: "120px" }}>Account Holder's Name</th>
                    <th style={{ minWidth: "100px" }}>Account No</th>
                    <th style={{ minWidth: "180px" }}>Remarks</th>
                    <th style={{ minWidth: "100px" }}>Status</th>
                    <th style={{ minWidth: "20px" }}>Attachment</th>
                  </tr>
                </thead>
                {landingData?.length > 0 && (
                  <tbody>
                    {landingData?.length > 0 &&
                      landingData?.map((item, i) => (
                        <tr key={i}>
                          <td>{i + 1}</td>
                          <td className="text-center">
                            {item?.intApplicationID}
                          </td>
                          <td className="text-center">
                            {item?.strRegistrationNo}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteApplicationDate)}
                          </td>
                          <td>{item?.strApplicantName}</td>
                          <td>{item?.strPatientName}</td>
                          <td>{item?.strAddress}</td>
                          <td className="text-center">{item?.strContactNo}</td>
                          <td className="text-center">{item?.strNationalID}</td>
                          <td>{item?.strOrganizationName}</td>
                          <td>{item?.strDonationPurpose}</td>
                          <td>{item?.strDonationName}</td>
                          <td>{item?.strModeOfPayment}</td>
                          <td className="text-right">{item?.monAmount}</td>
                          <td>{item?.strAccountHolderName}</td>
                          <td className="text-center">{item?.strAccountNo}</td>
                          <td>{item?.strRemarks}</td>
                          <td>
                          {item?.strStatus === "Awaiting Audit" ? (
                            <button onClick={()=>{
                              setAwaitingAuditState({data: item, isShowModal: true})
                            }} type="button" className="btn btn-primary">
                              {item?.strStatus}
                            </button>
                          ) : (
                            item?.strStatus
                          )}
                        </td>
                          <td
                            style={{
                              verticalAlign: "middle",
                              textAlign: "center",
                            }}
                          >
                            <div className="d-flex align-items-evaly">
                              {item?.strAttachmentUrl && (
                                <IView
                                style={{fontSize: "16px", marginLeft: "2px"}}
                                  clickHandler={() => {
                                    dispatch(
                                      getDownlloadFileView_Action(
                                        item?.strAttachmentUrl
                                      )
                                    );
                                  }}
                                />
                              )}
                              <div style={{ marginLeft: "10px" }}>
                                <AttachmentUploaderNew
                                  showIcon
                                  style={{
                                    backgroundColor: "transparent",
                                    color: "black",
                                  }}
                                  CBAttachmentRes={(attachmentData) => {
                                    if (Array.isArray(attachmentData)) {
                                      console.log(attachmentData);
                                      handleUploadAttachment(
                                        attachmentData,
                                        item?.intApplicationID
                                      );
                                      
                                    }
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    <tr>
                      {/* 18 */}
                      <td></td>
                      <td colspan="12">
                        <div className="text-right">
                          <b>Total </b>
                        </div>
                      </td>
                      <td>
                        <div className="text-right">
                          <b>{numberWithCommas(totalAmount) || "0"}</b>
                        </div>
                      </td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                      <td></td>
                    </tr>
                  </tbody>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
      <>
      <IViewModal
          show={awaitingAuditState?.isShowModal}
          modelSize={"lg"}
          onHide={() => {
            setAwaitingAuditState({data:{}, isShowModal: false})
          }}
        >
          <AwaitingAuditModal awaitingAuditState={awaitingAuditState} filterObj={filterObj} setAwaitingAuditState={setAwaitingAuditState}/>
        </IViewModal>
      </>
    </>
  );
};
