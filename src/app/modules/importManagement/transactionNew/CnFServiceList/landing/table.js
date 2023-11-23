import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { getLandingData } from "../helper";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  // Input,
} from "../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import NewSelect from "../../../../_helper/_select";
import InputField from "../../../../_helper/_inputField";
import { Formik } from "formik";

const header = [
  "SL",
  "Unit",
  "LC No",
  "Part",
  "Custom House",
  "Doc F Date",
  "Duty F Date",
  "Delivery Date",
  "Value",
  "Currency",
  "Packing",
  "Item Description",
];

const CnFServiceList = () => {
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
    if (profileData?.accountId) {
      getLandingData(
        profileData?.accountId,
        setIsLoading,
        setGridData,
        pageNo,
        pageSize
      );
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

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
      <Formik>
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <Card>
            <CardHeader title="CnF Service List">
              <CardHeaderToolbar>
                {/* <button
              onClick={() =>
                history.push(
                  "/import-management/transaction/transport-charges/create"
                )
              }
              className="btn btn-primary"
            >
              Create
            </button> */}
              </CardHeaderToolbar>
            </CardHeader>
            <CardBody>
              <div className="row">
                <div className="col-lg-3">
                  <NewSelect name="agent" label="Agent" placeholder="Agent" />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="custom"
                    label="Custom"
                    placeholder="Custom"
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    name="fromDate"
                    label="From Date"
                    placeholder="From"
                    type="date"
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    name="toDate"
                    label="To Date"
                    placeholder="To"
                    type="date"
                  />
                </div>
                <div className="col-lg-2 pt-5">
                  <button className="btn btn-primary">Show</button>
                </div>
              </div>
              {isloading && <Loading />}
              <ICustomTable ths={header}>
                {/* {gridData?.data?.length > 0 &&
              gridData?.data?.map((item, index) => { */}
                {/* return ( */}
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
        )}
      </Formik>
    </>
  );
};

export default CnFServiceList;
