/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { useSelector, shallowEqual } from "react-redux";

import { fetchLandingData } from "../helper";
import ICustomTable from "./../../../../_helper/_customTable";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import RosterModel from "./viewModal";
import IView from "./../../../../_helper/_helperIcons/_view";

const headers = ["SL", "Roster Group Name", "Created By Name", "Action"];

const TBody = ({ rowData, loader, setModelShow, setModelData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {rowData?.length > 0 &&
        rowData?.map((item, index) => {
          return (
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td style={{ textAlign: "left" }}>
                <span className="pl-2">{item?.rosterGroupHeaderName}</span>
              </td>
              <td style={{ textAlign: "left" }}>
                <span className="pl-2">{item?.createdByName}</span>
              </td>

              <td colSpan="" style={{ textAlign: "center", width: "80px" }}>
                <div className="d-flex justify-content-around">
                  <span className="view">
                    <IView
                      clickHandler={() => {
                        setModelShow(true);
                        setModelData(item?.rosterGroupHeaderId);
                      }}
                    />
                  </span>
                  <span
                    onClick={(e) =>
                      history.push(
                        `/human-capital-management/calendar/roster/edit/${item?.rosterGroupHeaderId}`
                      )
                    }
                    className="mx-2"
                  >
                    <IEdit title="Edit" />
                  </span>
                </div>
              </td>
            </tr>
          );
        })}
    </>
  );
};

const RosterLanding = () => {
  const history = useHistory();
  const [loader, setLoader] = useState(false);
  const [modelData, setModelData] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [rowData, setRowData] = useState([]);
  const [modelShow, setModelShow] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Get Landing Pasignation Data
  useEffect(() => {
    fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setRowData,
      setLoader,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    fetchLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setRowData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <ICustomCard
        title="Roster"
        createHandler={() =>
          history.push(`/human-capital-management/calendar/roster/create`)
        }
      >
        <ICustomTable
          ths={headers}
          children={
            <TBody
              rowData={rowData?.objdata}
              loader={loader}
              setModelShow={setModelShow}
              setModelData={setModelData}
            />
          }
        />

        <RosterModel
          show={modelShow}
          onHide={() => setModelShow(false)}
          modelData={modelData}
        />

        {/* Pagination Code */}
        <div>
          {rowData?.objdata?.length > 0 && (
            <PaginationTable
              count={rowData?.count}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </ICustomCard>
    </>
  );
};

export default RosterLanding;
