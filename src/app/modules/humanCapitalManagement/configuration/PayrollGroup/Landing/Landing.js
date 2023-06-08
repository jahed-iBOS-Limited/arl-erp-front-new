/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useSelector, shallowEqual } from "react-redux";
import { getLandingPageData } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

const headers = [
  "SL",
  "Payroll Group Code",
  "Payroll Group Name",
  "Payroll Period",
  "Current Period Start",
  "Current Period End",
  "Action",
];

const TBody = ({ loader, landingPageData }) => {
  const history = useHistory();
  return (
    <>
      {loader && <Loading />}
      {landingPageData?.length > 0 &&
        landingPageData?.map((data, index) => (
          <tr style={{ textAlign: "left" }} key={index}>
            {/* {console.log(data)} */}
            <td>{index + 1}</td>
            <td>{data.payrollGroupCode}</td>
            <td>{data.payrollGroupName}</td>
            <td>{data.payrollPeriod}</td>
            <td style={{ textAlign: "center" }}>
              {_dateFormatter(data.currentPeriodStart)}
            </td>
            <td style={{ textAlign: "center" }}>
              {_dateFormatter(data.currentPeriodEnd)}
            </td>

            <td style={{ textAlign: "center" }}>
              <span
                onClick={() =>
                  history.push(
                    `/human-capital-management/hcmconfig/payrollGroup/edit/${data.payrollGroupId}`
                  )
                }
              >
                <IEdit></IEdit>
              </span>
            </td>
          </tr>
        ))}
    </>
  );
};

const PayrollGroupLanding = () => {
  const history = useHistory();

  const [landingPageData, setLandingPageData] = useState([]);
  const [loader, setLoader] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getLandingPageData(
      profileData.accountId,
      setLandingPageData,
      setLoader,
      pageNo,
      pageSize
    );
  }, [profileData.accountId, profileData.defaultBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingPageData(
      profileData.accountId,
      setLandingPageData,
      setLoader,
      pageNo,
      pageSize
    );
  };

  return (
    <ICustomCard
      title="Payroll Group"
      createHandler={() =>
        history.push("/human-capital-management/hcmconfig/payrollGroup/create")
      }
    >
      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
        <thead>
          <tr>
            {headers.map((th, index) => {
              return <th key={index}> {th} </th>;
            })}
          </tr>
        </thead>
        <tbody>
          <TBody
            landingPageData={landingPageData?.data || []}
            loader={loader}
          />
        </tbody>
      </table>

      {/* Pagination Code */}
      <div>
        {landingPageData?.data?.length > 0 && (
          <PaginationTable
            count={landingPageData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </ICustomCard>
  );
};

export default PayrollGroupLanding;
