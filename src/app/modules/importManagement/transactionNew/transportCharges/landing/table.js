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
import NewSelect from "../../../../_helper/_select";

const header = [
  "SL",
  "Provider",
  "PO No",
  "Bill Number",
  "Qty",
  "Payment Date",
  "Amount (BDT)",
];

const TransportChargesLanding = () => {
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
        <CardHeader title="Transport Charges Payment Info">
          <CardHeaderToolbar>
            <button
              onClick={() =>
                history.push(
                  "/managementImport/transaction/transport-charges/create"
                )
              }
              className="btn btn-primary"
            >
              Create
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="d-flex justify-content-between pt-2">
            <p className="pt-5">LC Number: 5416485</p>
            <div className="col-lg-3">
              <NewSelect
                name="shipment"
                //   options={partnerTypeDDL || []}
                // value={values?.coverage}
                label="Shipment"
                // onChange={(valueOption) => {
                //   setFieldValue("coverage", valueOption);
                // }}
                placeholder="Shipment"
                // errors={errors}
                // touched={touched}
                //   isDisabled={isEdit}
              />
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
            <tr>
              <td></td>
              <td>Total</td>
              <td></td>
              <td></td>
              <td className="text-right">100</td>
              <td></td>
              <td className="text-right">100</td>
            </tr>
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

export default TransportChargesLanding;
