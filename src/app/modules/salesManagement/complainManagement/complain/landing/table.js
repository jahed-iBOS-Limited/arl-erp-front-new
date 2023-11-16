import React from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import { shallowEqual, useSelector } from "react-redux";
import { investigateComplainApi } from "../../resolution/helper";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IConfirmModal from "../../../../_helper/_confirmModal";

const LandingTable = ({ obj }) => {
  const { gridData, setLoading, commonGridDataCB } = obj;
  const history = useHistory();
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
          {gridData?.data?.map((item, index) => (
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
                  _dateFormatter(item?.delegateDateTime)}
              </td>
              <td>{item?.delegateToName}</td>
              <td>{item?.investigatorAssignByName}</td>
              <td>
                {item?.investigatorAssignDate &&
                  _dateFormatter(item?.investigatorAssignDate)}
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
                      history.push(
                        `/sales-management/complainmanagement/complain/view/${item?.complainId}`
                      );
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
                              message: "Are you sure you want to Issue Close?",
                              yesAlertFunc: () => {
                                const payload = {
                                  complainId: item?.complainId || 0,
                                  statusId: 4,
                                  status: "Close",
                                  actionById: userId,
                                  investigationInfo: [],
                                };
                                investigateComplainApi(
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
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default LandingTable;
