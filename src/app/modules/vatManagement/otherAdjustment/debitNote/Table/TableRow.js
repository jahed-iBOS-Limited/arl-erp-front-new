import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { getGridData } from "../helper/helper";
import { SearchForm } from "./Form";
import { _todayDate } from "../../../../_helper/_todayDate";

export function TableRow() {
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [values, setValues] = useState({});
  //paginationState
  const [pageNo, setPageNo] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(15);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(
      values?.taxBranch.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    getGridData(
      values?.taxBranch?.value,
      values?.fromDate,
      values?.toDate,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      searchValue
    );
  };

  useEffect(() => {
    if (taxBranchDDL[0]?.value)
      getGridData(
        taxBranchDDL[0].value,
        _todayDate(),
        _todayDate(),
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxBranchDDL]);
  return (
    <>
      <div>
        <SearchForm
          setTaxBranchDDL={setTaxBranchDDL}
          taxBranchDDL={taxBranchDDL}
          onSubmit={(values) => {
            setValues(values);
            getGridData(
              values.taxBranch.value,
              values.fromDate,
              values.toDate,
              setGridData,
              setLoading,
              pageNo,
              pageSize
            );
          }}
        ></SearchForm>
      </div>
      <div className="row">
        {loading && <Loading />}
        <div className="col-lg-12">
          <PaginationSearch
            placeholder="Item Name & Code Search"
            paginationSearchHandler={paginationSearchHandler}
            values={values}
          />
          <table className="table table-striped table-bordered global-table">
            <thead>
              <tr>
                {/* <th style={{ width: "30px" }}>SL</th> */}
                <th style={{ width: "50px" }}>Partner</th>
                <th style={{ width: "50px" }}>Debit Note Code</th>
                <th style={{ width: "50px" }}>Sales Invoice No</th>
                <th style={{ width: "50px" }}>Fiscal Year</th>
                <th style={{ width: "50px" }}>Transaction Date</th>
                <th style={{ width: "50px" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {gridData?.objdata?.map((data, index) => (
                <tr style={{ textAlign: "center" }} key={index}>
                  <td className="text-left">
                    <div className="text-left pl-2">
                      {data.strSoldtoPartnerName}
                    </div>
                  </td>
                  <td>{data.strTaxSalesCode}</td>
                  <td>{data.taxSalesId}</td>
                  <td className="text-center">
                    {_dateFormatter(data.fiscalYear)}
                  </td>
                  <td className="text-center">
                    {_dateFormatter(data.dteLastActionDateTime)}
                  </td>
                  <td>
                    <div className="d-flex justify-content-around">
                      <span
                        className="edit"
                        onClick={() => {
                          history.push({
                            pathname: `/mngVat/otherAdjustment/debit-note/edit/${data.taxSalesId}`,
                            state: { singleItem: data },
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
        {gridData?.objdata?.length > 0 && (
          <PaginationTable
            count={gridData?.count}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
            values={values}
          />
        )}
      </div>
    </>
  );
}
