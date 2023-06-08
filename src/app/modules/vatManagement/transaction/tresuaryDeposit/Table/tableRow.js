/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router-dom";
import { getBranchDDL, GetTresuaryDepositPagination } from "../helper";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { Formik } from "formik";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";

export function TableRow() {
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  // tax branch ddl for landing
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [selectedTaxBranchDDL, setSelectedTaxBranchDDL] = useState("");

  useEffect(() => {
    if (taxBranchDDL?.length > 0) {
      setSelectedTaxBranchDDL(taxBranchDDL[0]);
      GetTresuaryDepositPagination(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        taxBranchDDL[0]?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
  }, [taxBranchDDL]);

  // useEffect for TaxBranchDDL for landing
  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      profileData?.userId
    ) {
      getBranchDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  const pushData = () => {
    history.push({
      pathname: "/mngVat/transaction/treasury/add",
      state: { selectedTaxBranchDDL },
    });
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue, values) => {
    GetTresuaryDepositPagination(
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

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  return (
    // ICustomCard for Table Header
    <ICustomCard
      title="Treasury Deposit Request"
      renderProps={() => (
        <button
          className="btn btn-primary"
          disabled={!selectedTaxBranchDDL}
          onClick={pushData}
        >
          Create new
        </button>
      )}
    >
      <Formik>
        <>
          <div className="row global-form">
            <div className="col-lg-3">
              <label>Branch Name</label>
              <Select
                onChange={(valueOption) => {
                  setSelectedTaxBranchDDL(valueOption);
                  GetTresuaryDepositPagination(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    setGridData,
                    setLoading,
                    pageNo,
                    pageSize
                  );
                }}
                value={selectedTaxBranchDDL}
                options={taxBranchDDL || []}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
          </div>
          {loading && <Loading />}
          <div className="row ">
            <div className="col-lg-12">
              <PaginationSearch
                placeholder="Tresuary Code and Challan No Search"
                paginationSearchHandler={paginationSearchHandler}
              />
              <table className="table table-striped table-bordered global-table">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th style={{ width: "50px" }}>Tresuary Code</th>
                    <th style={{ width: "50px" }}>Deposit Amount</th>
                    <th style={{ width: "50px" }}>Deposit Date</th>
                    <th style={{ width: "50px" }}>Challan No</th>
                    <th style={{ width: "50px" }}>Challan Date</th>
                    <th style={{ width: "50px" }}>Instrument No</th>
                    <th style={{ width: "50px" }}>Instrument Date</th>
                    <th style={{ width: "30px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td> {item.sl}</td>
                      <td>
                        <div className="pl-2">{item?.tresuaryCode}</div>
                      </td>
                      <td className="text-right">
                        <div className="pr-2">{_formatMoney(item?.amount)}</div>
                      </td>
                      <td className="text-center">
                        <div>{_dateFormatter(item?.depositDate)}</div>
                      </td>
                      <td className="text-right">
                        <div className="pr-2">{item?.trChallanNo}</div>
                      </td>
                      <td className="text-center">
                        <div>{_dateFormatter(item?.trChallanDate)}</div>
                      </td>
                      <td className="text-right">
                        <div className="pr-2">{item?.instumentNo}</div>
                      </td>
                      <td className="text-center">
                        <div>{_dateFormatter(item?.instrumentDate)}</div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span className="view">
                            <IView
                              clickHandler={() => {
                                history.push(
                                  `/mngVat/transaction/treasury/view/${item?.tresuaryId}`
                                );
                              }}
                            />
                          </span>
                          <span
                            className="edit"
                            onClick={() => {
                              history.push(
                                `/mngVat/transaction/treasury/edit/${item?.tresuaryId}`
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
                values={selectedTaxBranchDDL}
              />
            )}
          </div>
        </>
      </Formik>
    </ICustomCard>
  );
}
