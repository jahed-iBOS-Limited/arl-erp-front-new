import React, { useEffect, useState } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { getGridData } from '../helper';
import IEdit from '../../../../_helper/_helperIcons/_edit';
import ICustomCard from '../../../../_helper/_customCard';
import Loading from '../../../../_helper/_loading';
import PaginationTable from '../../../../_helper/_tablePagination';

export function TableRow() {
  const history = useHistory();
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

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
  }, []);

  // setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(
      profileData.accountId,
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
        title="Route Plan Setup Config"
        renderProps={() => (
          <button
            type="button"
            className="btn btn-primary"
            // ref={btnRef}
            onClick={() =>
              history.push({
                pathname:
                  '/rtm-management/configuration/routePlanConfig/create',
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
                  <th>Last Route Plan Entry Day</th>
                  <th>Last Route Plan Edited Day</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    {/* key={item.businessUnitId} */}
                    <td className="text-center"> {item?.sl}</td>
                    <td>
                      <div className="pr-2 text-right">
                        {' '}
                        {item?.lastRoutePlanEntryDay}
                      </div>
                    </td>
                    <td>
                      <div className="pr-2 text-right">
                        {item?.lastRoutePlanEditDay}
                      </div>
                    </td>

                    <td>
                      <div className="d-flex justify-content-around">
                        {/* <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push(
                                `/rtm-management/configuration/routePlanConfig/view/${item.taxPurchaseId}`
                              );
                            }}
                          />
                        </span> */}
                        <span
                          className="edit"
                          onClick={() => {
                            history.push(
                              `/rtm-management/configuration/routePlanConfig/edit/${item.autoId}`
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
          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
              // values={values}
            />
          )}
        </div>
      </ICustomCard>
    </>
  );
}
