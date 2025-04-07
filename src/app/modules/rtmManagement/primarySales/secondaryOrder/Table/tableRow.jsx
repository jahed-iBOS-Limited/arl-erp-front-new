import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import { useHistory } from 'react-router-dom';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';
import { getSecondaryOrderLanding } from '../helper';

export function TableRow() {
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, setGridData] = useState([]);

  console.log(gridData, 'gridData');

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      getSecondaryOrderLanding(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        setGridData
      );
    }
  }, [selectedBusinessUnit, profileData]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getSecondaryOrderLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      setLoading,
      pageNo,
      pageSize,
      setGridData
    );
  };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12 pr-0 pl-0">
          {gridData?.data?.length > 0 && (
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Outlet Name</th>
                  <th>Order Qty</th>
                  <th>Delivery Qty</th>
                  <th>Order Amount</th>
                  <th>Delivery Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td> {item?.sl}</td>
                    <td>
                      <div className="pl-2">{item?.outletName}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {item?.orderQuantity}
                      </div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {item?.deliveryQuantity}
                      </div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.orderAmount}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {item?.deliveryAmount}
                      </div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/rtm-management/primarySale/secondaryOrder/edit/${item?.orderId}`
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
