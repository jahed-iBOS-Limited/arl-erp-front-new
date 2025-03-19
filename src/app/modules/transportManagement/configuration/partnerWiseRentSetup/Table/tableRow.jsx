import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import IExtend from "../../../../_helper/_helperIcons/_extend";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import RouteStandardViewModal from "../View/viewModal";
import { getPartnerWiseRentSetupLanding } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  console.log(gridData);
  // Modal State
  const [landingData, ] = useState("");
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
      getPartnerWiseRentSetupLanding(
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
    getPartnerWiseRentSetupLanding(
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
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
        <div className="table-responsive">
        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
            <thead>
              <tr>
                <th>SL</th>
                <th>Partner Name</th>
                <th>Address</th>
                <th>Number of Vehicle</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.data?.map((item, index) => (
                <tr key={index} className="text-left">
                  <td> {index + 1}</td>
                  <td>
                    <div className="pl-2">{item?.partnerName}</div>
                  </td>
                  <td>
                    <div className="pl-2">{item?.partnerAddress}</div>
                  </td>
                  <td>
                    <div className="pl-2 text-center">{item?.numberOfVehicle}</div>
                  </td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span
                        onClick={() => {
                          history.push(
                            `/transport-management/configuration/partner-wise-rent-setup/extend/${item?.intPartnerId}`
                          );
                        }}
                      >
                        <IExtend />
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
