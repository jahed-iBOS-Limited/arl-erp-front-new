/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import IClose from "../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { approvalInActiveByConfigId, getApprovalLandingDataAction } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import IConfirmModal from "./../../../../_helper/_confirmModal";

const ApprovalLanding = () => {
  const history = useHistory();

  const [grid, setGrid] = useState([]);
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const selectedBusinessUnit = useSelector(
    (state) => state?.authData?.selectedBusinessUnit,
    shallowEqual
  );

  useEffect(() => {
    getApprovalLandingDataAction(
      selectedBusinessUnit?.value,
      setGrid,
      setLoading,
      pageNo,
      pageSize
    );
  }, [selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getApprovalLandingDataAction(
      selectedBusinessUnit?.value,
      setGrid,
      setLoading,
      pageNo,
      pageSize
    );
  };



   // approveSubmitlHandler btn submit handler
   const approveSubmitlHandler = (confId) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to Inactive this approval`,
      yesAlertFunc: () => {
        approvalInActiveByConfigId(confId).then(()=>
        getApprovalLandingDataAction(
          selectedBusinessUnit?.value,
          setGrid,
          setLoading,
          pageNo,
          pageSize
        )
        )  
      
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  return (
    <ICustomCard
      title="Approval"
      createHandler={() =>
        history.push("/config/domain-controll/approvalsetup/create")
      }
    >
      {loading && <Loading />}
      <div className="table-responsive">
        <table className="table table-striped table-bordered global-table">
          <thead>
            <tr>
              <th>SL</th>
              <th>Activity Name</th>
              <th>Plant Name</th>
              <th>Group Name</th>
              <th>Any Order</th>
              <th>In Sequence</th>
              <th>Any Users</th>
              <th>Action</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {grid?.data?.map((item, index) => (
              <tr>
                <td>{index + 1}</td>
                <td>{item?.predisorActivityName}</td>
                <td>{item?.plantName}</td>
                <td className="font-weight-bold">{item?.groupName}</td>
                <td>{`${item?.isAnyOrder}`}</td>
                <td>{`${item?.isInSequence}`}</td>
                <td>{`${item?.anyUsers}`}</td>
                <td className="text-center">
                  <div className="d-flex justify-content-center align-items-center">
                  <span>
                    <IView
                      clickHandler={() =>
                        history.push(
                          `/config/domain-controll/approvalsetup/view/${item?.approvalConfigId}/view`
                        )
                      }
                    />
                  </span>
                  <span className="pl-2">
                    <IClose
                    title="InActive"
                    closer={() => approveSubmitlHandler(item?.approvalConfigId) }
                    />
                  </span>
                  </div>
                </td>
                <td className="text-center">
                  <span
                    onClick={() =>
                      history.push(
                        `/config/domain-controll/approvalsetup/edit/${item?.approvalConfigId}`
                      )
                    }
                  >
                    <IEdit />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Code */}
      {grid?.data?.length > 0 && (
        <PaginationTable
          count={grid?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </ICustomCard>
  );
};

export default ApprovalLanding;
