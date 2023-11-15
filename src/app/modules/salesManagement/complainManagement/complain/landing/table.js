import React from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";

const LandingTable = ({ obj }) => {
  const { gridData } = obj;
  const history = useHistory();


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
