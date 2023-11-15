import React from "react";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import NewSelect from "../../../../_helper/_select";
import { useHistory } from "react-router-dom";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";

const LandingTable = ({ obj }) => {
  const {
    gridData,
    loadUserList,
    complainStatus,
    assignToAndStatusHandler,
  } = obj;
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
              <td>{item?.status}</td>
              <td>
                <div className='d-flex justify-content-around'>
                  {item?.status !== "Done" && (
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
