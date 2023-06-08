/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import { workPlaceLandingData } from "../Helper/Actions";
import PaginationTable from "./../../../../_helper/_tablePagination";
import WorkPlaceViewForm from "../View/viewModal";
const tableHeader = ["SL", "Workplace Group Name", "Action"];

const TableBody = ({ loader, landingData }) => {
  const [show, setShow] = useState(false);
  const [clickRowDto, setClickRowDto] = useState('');
  const history = useHistory();
  return (
    <>
      {loader && <Loading />}
      {landingData?.map((data, index) => (
        <tr key={index}>
          <td style={{ textAlign: "center" }}>{index + 1}</td>
          <td style={{ textAlign: "left" }}>
            <span className="pl-2">{data.workplaceGroup}</span>
          </td>
          <td style={{ width: "80px" }}>
            <div className="d-flex justify-content-around">
              <span
                onClick={() =>
                  history.push({
                    pathname: `/human-capital-management/hcmconfig/workplace/edit/${data.workplaceId}`,
                    state: data,
                  })
                }
              >
                <IEdit />
              </span>
              <span className="view">
                <IView
                  clickHandler={() => {
                    setClickRowDto(data)
                    setShow(true)
                  }}
                />
              </span>
            </div>
          </td>
        </tr>
      ))}

      {show && <WorkPlaceViewForm show={show} onHide={() => {
        setShow(false)
      }} clickRowDto={clickRowDto} />}

    </>
  );
};

export default function TableRow() {
  const [landingData, setLandingData] = useState([]);
  const [loader, setLoader] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    workPlaceLandingData(
      profileData.accountId,
      setLandingData,
      setLoader,
      pageNo,
      pageSize
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    workPlaceLandingData(
      profileData.accountId,
      selectedBusinessUnit.value,
      setLandingData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <ICustomTable ths={tableHeader}>
        <TableBody landingData={landingData?.data || []} loader={loader} />
      </ICustomTable>

      {/* Pagination Code */}
      <div>
        {landingData?.data?.length > 0 && (
          <PaginationTable
            count={landingData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
