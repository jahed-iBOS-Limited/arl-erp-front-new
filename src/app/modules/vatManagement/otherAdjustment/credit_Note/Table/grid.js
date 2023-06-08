import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import IView from "./../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import CreditNoteModal from "./../viewModal";
import {
  creditNoteLandingPasignation_api,
  getCreditNoteSupplierBalancById,
} from "../helper";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

const GridData = ({
  gridData,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
  values,
  setGridData,
}) => {
  const [modelShow, setModelShow] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  const landingDataFunc = (pageNo, pageSize, searchValue) => {
    creditNoteLandingPasignation_api(
      values?.branch?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      pageNo,
      pageSize,
      searchValue
    );
  };

  // setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    landingDataFunc(pageNo, pageSize);
  };

  const paginationSearchHandler = (searchValue) => {
    landingDataFunc(pageNo, pageSize, searchValue);
  };

  return (
    <>
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12">
          <PaginationSearch
            placeholder="Item Name & Code Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          {gridData?.objdata?.length > 0 && (
            <table className="table table-striped table-bordered global-table">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th style={{ width: "35px" }}>Partner</th>
                  <th style={{ width: "35px" }}>Credit Note Code Invoice</th>
                  <th style={{ width: "35px" }}>Purchase Invoice No</th>
                  <th style={{ width: "35px" }}>Fiscal Year</th>
                  <th style={{ width: "35px" }}>Transaction Date</th>
                  <th style={{ width: "35px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.objdata?.map((tableData, index) => (
                  <tr key={index}>
                    <td> {index + 1} </td>
                    <td> {tableData.supplierName} </td>
                    <td className="text-center">
                      {" "}
                      {tableData.taxPurchaseCode}{" "}
                    </td>
                    <td className="text-center"> {tableData.taxPurchaseId} </td>
                    <td className="text-center"> {tableData.fiscalYear} </td>
                    <td className="text-center">
                      {" "}
                      {_dateFormatter(tableData.lastActionDateTime)}{" "}
                    </td>
                    <td className="d-flex justify-content-around">
                      <span className="view">
                        <IView
                          clickHandler={() => {
                            setModelShow(true);
                            getCreditNoteSupplierBalancById(
                              tableData?.taxPurchaseId,
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              setRowDto,
                              setLoading
                            );
                          }}
                        />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {gridData?.objdata?.length > 0 && (
          <PaginationTable
            count={gridData?.count}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}

        <CreditNoteModal
          onHide={() => setModelShow(false)}
          show={modelShow}
          rowDto={rowDto}
        />
      </div>
    </>
  );
};

export default withRouter(GridData);
