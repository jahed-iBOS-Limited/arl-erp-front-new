import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { getPartnerTransportZoneLanding } from "../helper";

export function TableRow() {
  const history = useHistory();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);
  const [gridData, setGridData] = useState([]);

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getPartnerTransportZoneLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLoading,
        pageNo,
        pageSize,
        setGridData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getPartnerTransportZoneLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      pageNo,
      pageSize,
      setGridData
    );
  };
  return (
    <>
      {loading && <Loading />}
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          {gridData?.data?.length >= 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th>Shipping Name</th>
                    {/* <th>Partner Name</th> */}
                    <th>Zone Name</th>
                    <th>Per Bag Price</th>
                    <th style={{ width: "90px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((td, index) => (
                    <tr key={index}>
                      <td> {td.sl} </td>
                      <td>
                        <div className="pl-2">{td?.shippingName}</div>
                      </td>
                      {/* <td>
                      <div className="pl-2">{td?.partnerName}</div>
                    </td> */}
                      <td>
                        <div className="pl-2">{td?.zoneName}</div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {td?.numPerBagPrice}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span
                            className="edit"
                            onClick={() => {
                              history.push(
                                `/sales-management/configuration/partnerThanaRate/edit/${td?.intId}`
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
          )}
        </div>
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
