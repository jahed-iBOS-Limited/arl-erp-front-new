/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData } from "../helper";
import Loading from "./../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "./../../../../../../_metronic/_partials/controls";
import PaginationTable from "./../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";

const header = [
  "SL",
  "PO No",
  "Bill No",
  "Pay Date",
  "Customs",
  "Port",
  "Shipping",
  "Transport",
  "Cnf/Other",
];

const CnFChargesLanding = () => {
  const history = useHistory();

  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getLandingData(
      profileData?.accountId,
      setIsLoading,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  return (
    <>
      <Card>
        <CardHeader title="All CnF Payment (BDT)">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push("/managementImport/transaction/cnf-charges/create")
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          {isloading && <Loading />}
          <ICustomTable ths={header}>
    
            <tr>
              <td style={{ width: "30px" }} className="text-center">
                1
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Reason</span>
              </td>
              <td className="text-center">
                <span className="pl-2 text-center">Pay Date</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              <td>
                <span className="pl-2">Date</span>
              </td>
              <td>
                <span className="pl-2">Amendment no</span>
              </td>
              {/* <td style={{ width: "100px" }} className="text-center">
                <span
                  className="edit"
                  // onClick={(e) =>
                  //   history.push(`/config/domain-controll/role-manager/edit/`)
                  // }
                >
                  <IEdit />
                </span>
              </td> */}
            </tr>

            {/* );
              })} */}
          </ICustomTable>

          {/* Pagination Code */}
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </CardBody>
      </Card>
    </>
  );
};

export default CnFChargesLanding;
