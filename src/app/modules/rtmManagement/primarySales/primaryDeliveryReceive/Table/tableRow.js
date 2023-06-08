import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
// eslint-disable-next-line no-unused-vars
import { getGridData, getItemTransferInPagination } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";

import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
// import Loading from "../../../../_helper/_loading";
import { _formatMoney } from "./../../../../_helper/_formatMoney";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  // const [values, setValues] = useState({});
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getGridData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };
  return (
    <>
      <ICustomCard
        title="Delivery Confirmation"
        renderProps={() => (
          <button
            type="button"
            className="btn btn-primary"
            // ref={btnRef}
            onClick={() =>
              history.push({
                pathname:
                  "/rtm-management/primarySale/primaryDeliveryReceive/create",
              })
            }
          >
            Create
          </button>
        )}
      >
        {/* Table Start */}
        <div className="row cash_journal">
          {loading && <Loading />}
          <div className="col-lg-12 pr-0 pl-0">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Challan no</th>
                  <th>Item Quantity</th>
                  <th>Received Amount </th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.objdata?.map((item, index) => (
                  <tr key={index}>
                    <td className="text-center">{index + 1}</td>
                    <td className="text-right">
                      <span className="pr-2">
                        {item?.distributionChallanId}
                      </span>
                    </td>
                    <td className="text-right">
                      <span className="pr-2">{item?.quantity}</span>
                    </td>
                    <td className="text-right">
                      <span className="pr-2">
                        {_formatMoney(item?.totalAmount)}
                      </span>
                    </td>

                    <td>
                      <div className="d-flex justify-content-around">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/rtm-management/primarySale/primaryDeliveryReceive/edit/${item?.inventoryTransactionId}`
                            );
                          }}
                        >
                          <IEdit />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {gridData?.objdata?.length > 0 && (
            <PaginationTable
              count={gridData?.counts}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </ICustomCard>
    </>
  );
}
