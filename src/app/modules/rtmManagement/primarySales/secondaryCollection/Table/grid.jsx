import React, { useState } from "react";
import { useHistory, withRouter } from "react-router-dom";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { SecondaryCollectionLanding } from "../helper";

import IView from "../../../../_helper/_helperIcons/_view";
const GridData = ({
  gridData,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  values,
  setGridData,
}) => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values, setGridData) => {
    SecondaryCollectionLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.routeName?.value,
      values?.completeOrder,
      values?.pendingOrder,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  return (
    <>
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12">
          {gridData?.objdata?.length > 0 && (
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th style={{ width: "35px" }}>OutletName</th>
                  <th style={{ width: "35px" }}>Total Amount</th>
                  <th style={{ width: "35px" }}>Total Qty</th>
                  <th style={{ width: "35px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.objdata?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {tableData?.strOutletName} </td>
                    <td className="text-right p-4">
                      {" "}
                      {tableData?.totalAmount}{" "}
                    </td>
                    <td className="text-right">
                      <span className="pr-2">{tableData?.totalQty}</span>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push(
                                `/rtm-management/primarySale/secondaryCollection/view/${tableData?.intOrderId}`
                              );
                            }}
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {gridData?.objdata?.length > 0 && (
          <PaginationTable
            count={gridData?.counts}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
};

export default withRouter(GridData);
