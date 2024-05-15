import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import RouteStandardViewModal from "../View/viewModal";
import { getRouteStandardCostLanding } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // Modal State
  const [landingData, setlandingData] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      getRouteStandardCostLanding(
        profileData.accountId,
        selectedBusinessUnit.value,
        pageNo,
        pageSize,
        setGridData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  const setPositionHandler = (pageNo, pageSize) => {
    getRouteStandardCostLanding(
      profileData.accountId,
      selectedBusinessUnit.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };

  return (
    <>
      {/* Table Start */}
      {loading && <Loading />}
      <div className='row cash_journal'>
        <div className='col-lg-12 pr-0 pl-0'>
        <div className="table-responsive">
        <table className='table table-striped table-bordered mt-3 bj-table bj-table-landing'>
            <thead>
              <tr>
                <th>SL</th>
                <th>Transport Organization Name</th>
                <th>Route Name</th>
                {/* <th>Amount</th> */}
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, index) => (
                <tr key={index}>
                  <td> {item?.sl}</td>
                  <td>
                    <div className='pl-2'>
                      {item?.transportOrganizationName}
                    </div>
                  </td>
                  <td>
                    <div className='pl-2'>{item?.routeName}</div>
                  </td>

                  {/* <td>
                    <div className='text-right pr-2'>{item?.amount}</div>
                  </td> */}
                  <td>
                    <div className='d-flex justify-content-center'>
                      <span className='view mr-2'>
                        <IView
                          clickHandler={() => {
                            setlandingData(item);
                            setShowModal(true);
                          }}
                        />
                      </span>
                      <span
                        className='edit'
                        onClick={() => {
                          history.push({
                            pathname: `/transport-management/configuration/routestandardcost/${"edit"}/${
                              item.routeId
                            }`,
                            state: item,
                          });
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

          <IViewModal show={showModal} onHide={() => setShowModal(false)}>
            <RouteStandardViewModal landingData={landingData} type={"view"} />
          </IViewModal>

          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </div>
    </>
  );
}
