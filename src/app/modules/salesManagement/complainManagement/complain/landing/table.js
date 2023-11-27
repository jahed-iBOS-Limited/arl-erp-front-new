import moment from "moment";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import IViewModal from "../../../../_helper/_viewModal";
import feedbackIcon from "../../../../_helper/images/feedback.png";
import { saveColseComplainApi } from "../../resolution/helper";
import FeedbackModal from "../../resolution/landing/feedbackModal";
import InvoiceView from "./invoiceView";
const LandingTable = ({ obj }) => {
  const {
    profileData: { accountId: accId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [isFeedbackModalShow, setIsFeedbackModalShow] = React.useState(false);

  const { gridData, setLoading, commonGridDataCB } = obj;
  const history = useHistory();
  const [isShowModal, setIsShowModal] = React.useState(false);
  const [clickedRow, setClickedRow] = React.useState({});
  const {
    profileData: { userId },
  } = useSelector((state) => state?.authData, shallowEqual);

  return (
    <>
      <table className='table table-striped table-bordered global-table'>
        <thead>
          <tr>
            <th>SL</th>
            <th>Issue Id</th>
            <th>Occurrence Date</th>
            <th>Respondent Type</th>
            <th>Respondent Name</th>
            <th>Create By</th>
            <th>Create Date</th>
            <th>Delegate By</th>
            <th>Delegate Date</th>
            <th>Deligate To</th>
            <th>Investigation By</th>
            <th>Investigation Date</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {gridData?.data?.map((item, index) => {
            const matchEmployeeId = item?.investigatorAssignByName?.find(
              (itm) => itm?.investigatorId === employeeId
            );

            return (
              <tr key={index}>
                <td className='text-center'> {index + 1}</td>
                <td>{item?.complainNo}</td>
                <td>{_dateFormatter(item?.requestDateTime)}</td>
                <td>{item?.respondentTypeName}</td>
                <td>{item?.respondentName}</td>
                <td>{item?.actionByName}</td>
                <td>{_dateFormatter(item?.lastActionDateTime)}</td>
                <td>{item?.delegateByName}</td>
                <td>
                  {item?.delegateDateTime &&
                    moment(item?.delegateDateTime).format(
                      "YYYY-MM-DD, HH:mm A"
                    )}
                </td>
                <td>{item?.delegateToName}</td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip className='mytooltip' id='info-tooltip'>
                        <>
                          {item?.investigatorAssignByName?.map((itm, idx) => (
                            <div
                              style={{
                                display: "flex",
                                gap: "2px 8px",
                              }}
                            >
                              <p>
                                <b>Investigation: </b>
                                {itm?.investigatorName},{" "}
                                {itm?.investigationDateTime &&
                                  moment(itm?.investigationDateTime).format(
                                    "YYYY-MM-DD, HH:mm A"
                                  )}
                              </p>
                            </div>
                          ))}
                        </>
                      </Tooltip>
                    }
                  >
                    <div>
                      {item?.investigatorAssignByName?.[0]?.investigatorName}
                    </div>
                  </OverlayTrigger>
                </td>
                <td>
                  <OverlayTrigger
                    overlay={
                      <Tooltip className='mytooltip' id='info-tooltip'>
                        <>
                          {item?.investigatorAssignByName?.map((itm, idx) => (
                            <div
                              style={{
                                display: "flex",
                                gap: "2px 8px",
                              }}
                            >
                              <p>
                                <b>Investigation: </b>
                                {itm?.investigatorName},{" "}
                                {itm?.investigationDateTime &&
                                  moment(itm?.investigationDateTime).format(
                                    "YYYY-MM-DD, HH:mm A"
                                  )}
                              </p>
                            </div>
                          ))}
                        </>
                      </Tooltip>
                    }
                  >
                    <div>
                      {matchEmployeeId?.investigationDateTime &&
                        moment(matchEmployeeId?.investigationDateTime).format(
                          "YYYY-MM-DD, HH:mm A"
                        )}
                    </div>
                  </OverlayTrigger>
                </td>
                <td>
                  <span
                    style={{
                      color:
                        item?.status === "Open"
                          ? "red"
                          : item?.status === "Delegate"
                          ? "blue"
                          : item?.status === "Investigate"
                          ? "orrage"
                          : "green",
                    }}
                  >
                    {item?.status}
                  </span>
                </td>
                <td>
                  <div
                    className='d-flex justify-content-around'
                    style={{
                      gap: "8px",
                    }}
                  >
                    {item?.status === "Open" && (
                      <span
                        onClick={() => {
                          history.push(
                            `/sales-management/complainmanagement/complain/edit/${item?.complainId}`
                          );
                        }}
                      >
                        <IEdit />
                      </span>
                    )}

                    <span
                      onClick={() => {
                        setClickedRow(item);
                        setIsShowModal(true);
                        // history.push(
                        //   `/sales-management/complainmanagement/complain/view/${item?.complainId}`
                        // );
                      }}
                    >
                      <IView />
                    </span>
                    {item?.status === "Investigate" && (
                      <span>
                        <OverlayTrigger
                          overlay={<Tooltip id='cs-icon'>Issue Close </Tooltip>}
                        >
                          <span
                            onClick={() => {
                              IConfirmModal({
                                title: "Issue Close",
                                message:
                                  "Are you sure you want to Issue Close?",
                                yesAlertFunc: () => {
                                  const payload = {
                                    complainId: item?.complainId || 0,
                                    statusId: 4,
                                    status: "Close",
                                    actionById: userId,
                                  };
                                  saveColseComplainApi(
                                    payload,
                                    setLoading,
                                    () => {
                                      commonGridDataCB();
                                    }
                                  );
                                },
                                noAlertFunc: () => {},
                              });
                            }}
                          >
                            <i
                              class='fa fa-times-circle text-danger'
                              aria-hidden='true'
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </span>
                    )}
                    {item?.status === "Close" && (
                      <>
                        <span
                          onClick={() => {
                            setIsFeedbackModalShow(true);
                            setClickedRow(item);
                          }}
                        >
                          <img
                            className='pointer'
                            src={feedbackIcon}
                            alt='feedbackIcon'
                            style={{
                              width: "20px",
                              height: "20px",
                            }}
                          />
                        </span>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {isShowModal && (
        <>
          <IViewModal
            show={isShowModal}
            onHide={() => {
              setIsShowModal(false);
            }}
          >
            <InvoiceView clickRowData={clickedRow} />
          </IViewModal>
        </>
      )}
      {isFeedbackModalShow && (
        <>
          <IViewModal
            show={isFeedbackModalShow}
            onHide={() => {
              setIsFeedbackModalShow(false);
              setClickedRow({});
            }}
            modelSize={"sm"}
          >
            <FeedbackModal
              clickRowData={clickedRow}
              landingCB={() => {
                setIsFeedbackModalShow(false);
                setClickedRow({});
                commonGridDataCB();
              }}
            />
          </IViewModal>
        </>
      )}
    </>
  );
};

export default LandingTable;
