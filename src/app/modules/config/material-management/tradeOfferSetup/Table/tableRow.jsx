import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { getTradeOfferGridData } from "../_redux/Actions";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.tradeOffer?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getTradeOfferGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    dispatch(
      getTradeOfferGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize
      )
    );
  };

  return (
    <>
      {loading && <Loading />}
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
         <div className="table-responsive">
         <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
            <thead>
              <tr>
                <th style={{ width: "35px" }}>SL</th>
                {/* <th>Offer Name</th> */}
                <th>Offer Type</th>
                <th>Offer Base</th>
                <th>Is Slab</th>
                <th style={{ width: "90px" }}>Start Date</th>
                <th style={{ width: "90px" }}>End Date</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((td, index) => (
                <tr key={index}>
                  <td> {td.sl} </td>
                  {/* <td>
                      <div className="pl-2">{td.tradeOfferName}</div>
                    </td> */}
                  <td>
                    <div className="pl-2">{td.tradeOfferConditionTypeName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{td.valueBase}</div>
                  </td>
                  <td>
                    <div className="pl-2">{td.slabProgram}</div>
                  </td>
                  <td>
                    <div className="text-right pr-2">
                      {_dateFormatter(td.startDate)}
                    </div>
                  </td>
                  <td>
                    <div className="text-right pr-2">
                      {_dateFormatter(td.endDate)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
         </div>
        </div>
      </div>
      {/* Pagination Code */}
      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}
    </>
  );
}
