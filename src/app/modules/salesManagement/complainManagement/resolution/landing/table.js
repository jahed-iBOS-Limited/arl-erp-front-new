import moment from "moment";
import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
// import feedbackIcon from "../../../../_helper/images/feedback.png";
import DelegateForm from "./delegate";
import FeedbackModal from "./feedbackModal";
import InvestigateForm from "./investigate";
import { saveColseComplainApi } from "../helper";
import InvoiceView from "../../complain/landing/invoiceView";
import IView from "../../../../_helper/_helperIcons/_view";

const LandingTable = ({ obj }) => {
  const {
    profileData: { accountId: accId, employeeId, userId },
    selectedBusinessUnit: { value: buId },
    tokenData: { token },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [isShowModal, setIsShowModal] = React.useState(false);
  const { gridData, commonGridDataCB, setLoading, title } = obj;
  const history = useHistory();
  const [delegatModalShow, setDelegatModalShow] = React.useState(false);
  const [investigateModalShow, setInvestigateModalShow] = React.useState(false);
  const [isFeedbackModalShow, setIsFeedbackModalShow] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});

  // const isMyComplaint =
  //   window.location.pathname === "/self-service/my-complaint";

  const isDelegatePage = title === "Delegate";
  return (
    <>
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Issue Id</th>
              <th>Issue Type</th>
              <th>Occurrence Date</th>
              <th>Respondent Type</th>
              <th>Respondent Name</th>
              <th>Create By</th>
              <th>Assigned Employee</th>
              <th>Create Date</th>
              <th>Delegate By</th>
              <th>Delegate Date</th>
              <th>Delegate To</th>
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

              const investigateItem = matchEmployeeId
                ? matchEmployeeId
                : isDelegatePage
                ? item?.investigatorAssignByName?.[0]
                : null;
              return (
                <tr key={index}>
                  <td className="text-center"> {index + 1}</td>
                  <td>{item?.complainNo}</td>
                  <td>{item?.complainCategoryName}</td>
                  <td>{_dateFormatter(item?.requestDateTime)}</td>
                  <td>{item?.respondentTypeName}</td>
                  <td>{item?.respondentName}</td>
                  <td>{item?.actionByName}</td>
                  <td>{item?.assignEmployeeName}</td>
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
                        <Tooltip className="mytooltip" id="info-tooltip">
                          <>
                            {item?.investigatorAssignByName?.map((itm, idx) => (
                              <div
                                style={{
                                  display: "flex",
                                  gap: "2px 8px",
                                }}
                              >
                                <p>
                                  <b> </b>
                                  {itm?.investigatorName}
                                  {itm?.investigationDueDate && (
                                    <>
                                      , Due:
                                      {moment(itm?.investigationDueDate).format(
                                        "YYYY-MM-DD"
                                      )}
                                    </>
                                  )}
                                  {itm?.investigationDateTime && (
                                    <>
                                      , Actual:
                                      {moment(
                                        itm?.investigationDateTime
                                      ).format("YYYY-MM-DD, HH:mm A")}
                                    </>
                                  )}
                                </p>
                              </div>
                            ))}
                          </>
                        </Tooltip>
                      }
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                      >
                        {investigateItem?.investigatorName &&
                          investigateItem?.investigatorName}
                      </div>
                    </OverlayTrigger>
                  </td>
                  <td>
                    <OverlayTrigger
                      overlay={
                        <Tooltip className="mytooltip" id="info-tooltip">
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
                                  {itm?.investigatorName}
                                  {itm?.investigationDueDate && (
                                    <>
                                      , Due:
                                      {moment(itm?.investigationDueDate).format(
                                        "YYYY-MM-DD"
                                      )}
                                    </>
                                  )}
                                  {itm?.investigationDateTime && (
                                    <>
                                      , Actual:
                                      {moment(
                                        itm?.investigationDateTime
                                      ).format("YYYY-MM-DD, HH:mm A")}
                                    </>
                                  )}
                                </p>
                              </div>
                            ))}
                          </>
                        </Tooltip>
                      }
                    >
                      <div
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                      >
                        {investigateItem?.investigationDateTime &&
                          moment(investigateItem?.investigationDateTime).format(
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
                            ? "orange"
                            : "green",
                      }}
                    >
                      {item?.status}
                    </span>
                  </td>
                  <td>
                    <div
                      className="d-flex justify-content-around"
                      style={{
                        gap: "8px",
                      }}
                    >
                      {/* {item?.status === "Open" && !isMyComplaint && (
                      <span
                        onClick={() => {
                          history.push(
                            `/sales-management/complainmanagement/complain/edit/${item?.complainId}`
                          );
                        }}
                      >
                        <IEdit />
                      </span>
                    )} */}

                      {(item?.status === "Open" ||
                        item?.status === "Delegate") && (
                        <>
                          <span>
                            <OverlayTrigger
                              overlay={<Tooltip id="cs-icon">Delegate</Tooltip>}
                            >
                              <span
                                onClick={() => {
                                  setDelegatModalShow(true);
                                  setClickRowData(item);
                                }}
                              >
                                <i
                                  class="fa fa-user-plus pointer"
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          </span>
                        </>
                      )}

                      {item?.status === "Investigate" && matchEmployeeId && (
                        <>
                          <span>
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  {item?.status === "Investigate"
                                    ? "Update Investigate"
                                    : "Investigate"}
                                </Tooltip>
                              }
                            >
                              <span
                                onClick={() => {
                                  setInvestigateModalShow(true);
                                  setClickRowData(item);
                                }}
                              >
                                {item?.status === "Investigate" ? (
                                  <i
                                    class="fa fa-users pointer"
                                    aria-hidden="true"
                                  ></i>
                                ) : (
                                  <i
                                    class="fa fa-low-vision pointer"
                                    aria-hidden="true"
                                  ></i>
                                )}
                              </span>
                            </OverlayTrigger>
                          </span>
                          {/* <span
                            onClick={() => {
                              setIsFeedbackModalShow(true);
                              setClickRowData(item);
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
                          </span> */}
                        </>
                      )}
                      {item?.status === "Investigate" && matchEmployeeId && (
                        <span>
                          <OverlayTrigger
                            overlay={
                              <Tooltip id="cs-icon">Issue Close </Tooltip>
                            }
                          >
                            <span
                              onClick={() => {
                                setIsFeedbackModalShow(true);
                                setClickRowData({
                                  ...item,
                                  status: "Close",
                                  statusId: 4,
                                });
                              }}
                            >
                              <i
                                class="fa fa-times-circle text-danger"
                                aria-hidden="true"
                              ></i>
                            </span>
                          </OverlayTrigger>
                        </span>
                      )}

                      <span
                        onClick={() => {
                          setClickRowData(item);
                          setIsShowModal(true);
                        }}
                      >
                        <IView />
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {delegatModalShow && (
        <>
          <IViewModal
            show={delegatModalShow}
            onHide={() => {
              setDelegatModalShow(false);
              setClickRowData({});
            }}
          >
            <DelegateForm
              clickRowData={clickRowData}
              landingCB={() => {
                setDelegatModalShow(false);
                setClickRowData({});
                commonGridDataCB();
              }}
            />
          </IViewModal>
        </>
      )}{" "}
      {investigateModalShow && (
        <>
          <IViewModal
            show={investigateModalShow}
            onHide={() => {
              setInvestigateModalShow(false);
              setClickRowData({});
            }}
          >
            <InvestigateForm
              clickRowData={clickRowData}
              landingCB={() => {
                setInvestigateModalShow(false);
                setClickRowData({});
                commonGridDataCB();
              }}
            />
          </IViewModal>
        </>
      )}
      {isFeedbackModalShow && (
        <>
          <IViewModal
            show={isFeedbackModalShow}
            onHide={() => {
              setIsFeedbackModalShow(false);
              setClickRowData({});
            }}
            modelSize={"sm"}
          >
            <FeedbackModal
              clickRowData={clickRowData}
              landingCB={() => {
                if (clickRowData?.status === "Close") {
                  const payload = {
                    complainId: clickRowData?.complainId || 0,
                    statusId: 4,
                    status: "Close",
                    actionById: userId,
                  };
                  saveColseComplainApi(payload, setLoading, () => {
                    setIsFeedbackModalShow(false);
                    setClickRowData({});
                    commonGridDataCB();
                  });
                } else {
                  setIsFeedbackModalShow(false);
                  setClickRowData({});
                  commonGridDataCB();
                }
              }}
            />
          </IViewModal>
        </>
      )}
      {isShowModal && (
        <>
          <IViewModal
            show={isShowModal}
            onHide={() => {
              setIsShowModal(false);
              setClickRowData({});
            }}
          >
            <InvoiceView clickRowData={clickRowData} />
          </IViewModal>
        </>
      )}
    </>
  );
};

export default LandingTable;
