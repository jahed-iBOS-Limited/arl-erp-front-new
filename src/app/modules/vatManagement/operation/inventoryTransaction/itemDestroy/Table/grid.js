import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import { GetItemDestroyPagination } from "../helper";
import { shallowEqual, useSelector } from "react-redux";
import ItemDestroyViewForm from "../View/addEditForm";
import { _dateFormatter } from './../../../../../_helper/_dateFormate';
import IView from './../../../../../_helper/_helperIcons/_view';
import IViewModal from './../../../../../_helper/_viewModal';
import PaginationTable from './../../../../../_helper/_tablePagination';

const GridData = ({
  rowDto,
  setRowDto,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  setLoading,
  values,
}) => {
  const [id, setId] = useState("");
  const [typeId, setItemTypeId] = useState("");
  const [showModal, setShowModal] = useState(false);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (pageNo, pageSize) => {
    GetItemDestroyPagination(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.branchName?.value,
      values?.itemType?.value,
      setRowDto,
      setLoading,
      pageNo,
      pageSize
    );
  };
  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        <div className="col-lg-12">
          {rowDto?.data?.length > 0 && (
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "25px" }}>SL</th>
                  <th style={{ width: "40px" }}>Destory Application Code</th>
                  <th style={{ width: "40px" }}>Transaction Date</th>
                  <th style={{ width: "40px" }}>Reference No</th>
                  <th style={{ width: "20px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {rowDto?.data?.map((item, index) => (
                  <tr>
                    <td className="text-center"> {index + 1}</td>
                    <td className="text-left">
                      <div className="pl-2"> {item?.destroyCode}</div>
                    </td>
                    <td className="text-center">
                      {" "}
                      {_dateFormatter(item?.transactionDate)}
                    </td>
                    <td className="text-center">
                      {" "}
                      {item?.referenceNo ? item?.referenceNo : "NaN"}
                    </td>
                    <td className="text-center">
                      {" "}
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              setId(item?.destroyId);
                              setItemTypeId(item?.itemTypeId);
                              setShowModal(true);
                              // history.push(
                              //   `/operation/inventoryTransaction/itemDestroy/view/${item?.destroyId}/${item?.itemTypeId}`
                              // );
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

          <IViewModal
            show={showModal}
            onHide={() => setShowModal(false)}
            title={"View Item Destroy"}
            btnText="Close"
          >
            <ItemDestroyViewForm id={id} typeId={typeId} />
          </IViewModal>
        </div>
        {rowDto?.data?.length > 0 && (
          <PaginationTable
            count={rowDto?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
      {/* Table End */}
    </>
  );
};

export default withRouter(GridData);
