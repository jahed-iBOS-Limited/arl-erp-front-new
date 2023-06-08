import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  getItemTransferInPagination,
  getTaxBranchDDL,
  getTaxItemTypeDDL,
} from "../helper";
import Select from "react-select";

import ItemTransferInViewForm from "../view/addForm";
import ICustomCard from "./../../../../../_helper/_customCard";
import customStyles from "./../../../../../selectCustomStyle";
import Loading from "../../../../../_helper/_loading";
import PaginationSearch from "./../../../../../_helper/_search";
import { _dateFormatter } from "./../../../../../_helper/_dateFormate";
import IView from "./../../../../../_helper/_helperIcons/_view";
import IViewModal from "./../../../../../_helper/_viewModal";
import PaginationTable from "./../../../../../_helper/_tablePagination";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [id, setId] = useState("");

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // tax branch ddl
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [selectedTaxBranchDDL, setSelectedTaxBranchDDL] = useState("");

  // item type ddl
  const [itemType, setItemType] = useState([]);
  const [selectedItemType, setSelectedItemType] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getTaxBranchDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
      getTaxItemTypeDDL(setItemType);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (taxBranchDDL[0]?.value && itemType[0]?.value) {
      getItemTransferInPagination(
        itemType[0]?.value,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        taxBranchDDL[0]?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
      setSelectedTaxBranchDDL(taxBranchDDL[0]);
      setSelectedItemType(itemType[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxBranchDDL, itemType]);

  const pushData = () => {
    history.push({
      pathname: "/operation/inventoryTransaction/transferIn/create",
      state: { selectedTaxBranchDDL, selectedItemType },
    });
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getItemTransferInPagination(
      selectedItemType?.value,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectedTaxBranchDDL?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };
  return (
    <>
      <ICustomCard
        title="Item Transfer-In"
        renderProps={() => (
          <button
            className="btn btn-primary"
            disabled={!taxBranchDDL}
            onClick={pushData}
          >
            Create new
          </button>
        )}
      >
        <div className="row global-form ">
          <div className="col-lg-3">
            <label>Branch Name</label>
            <Select
              onChange={(valueOption) => {
                setSelectedTaxBranchDDL(valueOption);
                setGridData([])
              }}
              value={selectedTaxBranchDDL}
              options={taxBranchDDL || []}
              isSearchable={true}
              styles={customStyles}
            />
          </div>

          <div className="col-lg-3">
            <label>Item Type</label>
            <Select
              onChange={(valueOption) => {
                setSelectedItemType(valueOption);
                setGridData([])
              }}
              value={selectedItemType}
              options={itemType || []}
              isSearchable={true}
              styles={customStyles}
            />
          </div>
          <div className="col-lg-3">
            <button
              className="btn btn-primary mt-3"
              onClick={() =>
                getItemTransferInPagination(
                  selectedItemType?.value,
                  profileData?.accountId,
                  selectedBusinessUnit?.value,
                  selectedTaxBranchDDL?.value,
                  setGridData,
                  setLoading,
                  pageNo,
                  pageSize
                )
              }
            >
              View
            </button>
          </div>
        </div>
        {/* Table Start */}
        <div className="row ">
          {loading && <Loading />}
          <div className="col-lg-12">
            <PaginationSearch
              placeholder="Purchase Code Search"
              paginationSearchHandler={paginationSearchHandler}
            />
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th>SL</th>
                  <th>Transfer-In No</th>
                  <th>Transfer-In Date</th>
                  <th>Branch Name</th>
                  <th>Transaction Type</th>
                  <th>Vehicle No.</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td> {index + 1}</td>
                    <td> {item?.taxPurchaseCode}</td>
                    <td>
                      <div className="text-center">
                        {_dateFormatter(item?.purchaseDateTime)}
                      </div>
                    </td>
                    <td>
                      {" "}
                      <div className="pl-2">{item?.taxBranchName}</div>{" "}
                    </td>
                    <td>
                      <div className="pl-2">{item?.taxTransactionTypeName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.vehicleNo}</div>
                    </td>
                    <td>
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              setShowModal(true);
                              setId(item?.taxPurchaseId);
                            }}
                          />
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <IViewModal show={showModal} onHide={() => setShowModal(false)}>
            <ItemTransferInViewForm
              id={id}
              location={{ selectedItemType, selectedTaxBranchDDL }}
            />
          </IViewModal>

          {gridData?.data?.length > 0 && (
            <PaginationTable
              count={gridData?.totalCount}
              setPositionHandler={setPositionHandler}
              paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            />
          )}
        </div>
      </ICustomCard>
    </>
  );
}
