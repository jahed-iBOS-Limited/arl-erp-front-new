import React from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IViewModal from "../../../../_helper/_viewModal";
import DelegateForm from "./delegate";
import InvestigateForm from "./investigate";

const LandingTable = ({ obj }) => {
  const { gridData, commonGridDataCB } = obj;
  const history = useHistory();
  const [delegatModalShow, setDelegatModalShow] = React.useState(false);
  const [investigateModalShow, setInvestigateModalShow] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});

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

                  {item?.status === "Open" && (
                    <>
                      <span>
                        <OverlayTrigger
                          overlay={<Tooltip id='cs-icon'>Delegate</Tooltip>}
                        >
                          <span
                            onClick={() => {
                              setDelegatModalShow(true);
                              setClickRowData(item);
                            }}
                          >
                            <i
                              class='fa fa-user-plus pointer'
                              aria-hidden='true'
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </span>
                    </>
                  )}

                  {item?.status === "Delegate" && (
                    <>
                      <span>
                        <OverlayTrigger
                          overlay={<Tooltip id='cs-icon'>Investigate</Tooltip>}
                        >
                          <span
                            onClick={() => {
                              setInvestigateModalShow(true);
                              setClickRowData(item);
                            }}
                          >
                            <i
                              class='fa fa-low-vision pointer'
                              aria-hidden='true'
                            ></i>
                          </span>
                        </OverlayTrigger>
                      </span>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
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
    </>
  );
};

export default LandingTable;
