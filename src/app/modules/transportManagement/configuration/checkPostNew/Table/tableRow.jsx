import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
import { CheckPostListLandingPagination } from "../helper";
import CheckPostNewViewForm from "../view/addForm";
import PaginationTable from "./../../../../_helper/_tablePagination";

export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");

  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // eslint-disable-next-line no-unused-vars
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      CheckPostListLandingPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageNo,
        pageSize,
        setGridData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const setPositionHandler = (pageNo, pageSize) => {
    CheckPostListLandingPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageNo,
      pageSize,
      setGridData,
      setLoading
    );
  };
  const pushData = () => {
    history.push({
      pathname: "/transport-management/configuration/checkpostCreate/add",
    });
  };
  return (
    <ICustomCard
      title="Check Post List"
      renderProps={() => (
        <button className="btn btn-primary" onClick={pushData}>
          Create new
        </button>
      )}
    >
      {loading && <Loading />}
      <Formik>
        <>
          <div className="row cash_journal">
            <div className="col-lg-12 pr-0 pl-0">
            <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Checkpost Name</th>
                    <th style={{ width: "70px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.sl}</td>
                        <td>
                          <div className="pl-2">{item?.checkPostName}</div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  setId(item?.checkPostId);
                                  setShowModal(true);
                                }}
                              />
                            </span>
                            <span
                              className="edit"
                              onClick={() => {
                                history.push(
                                  `/transport-management/configuration/checkpostCreate/edit/${item?.checkPostId}`
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

                <IViewModal show={showModal} onHide={() => setShowModal(false)}>
                  <CheckPostNewViewForm id={id} />
                </IViewModal>
              </table>
            </div>
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
      </Formik>
    </ICustomCard>
  );
}
