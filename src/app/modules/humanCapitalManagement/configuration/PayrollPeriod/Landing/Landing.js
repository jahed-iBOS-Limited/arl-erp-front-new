/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useSelector, shallowEqual } from "react-redux";
import { getLandingPageData } from "../helper";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

const headers = [
  "SL",
  "Period Name",
  "Code",
  "Start Date",
  "End Date",
  "Run Date",
  "Pay Date",
  "Action",
];

const TBody = ({ loader, landingPageData }) => {
  const history = useHistory();

  return (
    <>
      {loader && <Loading />}
      {landingPageData?.length > 0 &&
        landingPageData?.map((data, index) => (
          <tr key={index}>
            {/* {console.log(data)} */}
            <td>{index + 1}</td>
            <td>
              <div className="pl-2">{data.payrollPeriodName}</div>
            </td>
            <td>
              <div className="pl-2">{data.payrollPeriodCode}</div>
            </td>
            <td style={{ textAlign: "center" }}>
              {_dateFormatter(data.startDate)}
            </td>
            <td style={{ textAlign: "center" }}>
              {_dateFormatter(data.endDate)}
            </td>
            <td style={{ textAlign: "center" }}>
              {_dateFormatter(data.runDate)}
            </td>
            <td style={{ textAlign: "center" }}>
              {_dateFormatter(data.payDate)}
            </td>

            <td style={{ textAlign: "center" }}>
              <span
                onClick={() =>
                  history.push(
                    `/human-capital-management/hcmconfig/payrollPeriod/edit/${data.payrollPeriodId}`
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

const PayrollPeriodLanding = () => {
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
      title="Payroll Period"
      createHandler={() =>
        history.push("/human-capital-management/hcmconfig/payrollPeriod/create")
      }
    >
      <ICustomTable
        ths={headers}
        children={
          <TBody
            loader={loader}
            landingPageData={landingPageData?.data || []}
          />
        }
      ></ICustomTable>

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

export default PayrollPeriodLanding;
