import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { getTaxBranchDDL, getVatAdjustmentLandingPasignation } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import customStyles from "../../../../selectCustomStyle";
import Select from "react-select";
import { Formik } from "formik";
import ICustomCard from "../../../../_helper/_customCard";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
export function TableRow() {
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState({});
  const [loading, setLoading] = useState(false);
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [selectedTaxBranchDDL, setSelectedTaxBranchDDL] = useState("");
  const history = useHistory();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  // eslint-disable-next-line no-unused-vars
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  // eslint-disable-next-line no-unused-vars
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  // useEffect for first values of ddl
  useEffect(() => {
    if (taxBranchDDL[0]?.value) {
      getVatAdjustmentLandingPasignation(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        taxBranchDDL[0]?.value,
        setGridData,
        pageNo,
        pageSize,
        setLoading,
        null
      );
      setSelectedTaxBranchDDL(taxBranchDDL[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taxBranchDDL]);
  const pushData = () => {
    history.push({
      // pathname: "/mngVat/voucher/vat-adjustment/create",
      pathname: "/mngVat/otherAdjustment/vat-adjustment/create",
      state: { selectedTaxBranchDDL },
    });
  };
  const setPositionHandler = (pageNo, pageSize, values, searchValue) => {
    getVatAdjustmentLandingPasignation(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.value,
      setGridData,
      pageNo,
      pageSize,
      setLoading,
      searchValue
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, selectedTaxBranchDDL, searchValue);
  };
  return (
    <ICustomCard
      title="VAT Adjustment"
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
      <Formik>
        <>
          <div className="row global-form">
            <div className="col-lg-3">
              <label>Tax Branch Name</label>
              <Select
                onChange={(valueOption) => {
                  setSelectedTaxBranchDDL(valueOption);
                  getVatAdjustmentLandingPasignation(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    setGridData,
                    pageNo,
                    pageSize,
                    setLoading
                  );
                }}
                value={selectedTaxBranchDDL}
                options={taxBranchDDL || []}
                isSearchable={true}
                styles={customStyles}
              />
            </div>
          </div>

          <div className="row">
            <div className="col-lg-12">
              {loading && <Loading />}
              <PaginationSearch
                placeholder="Item Name & Code Search"
                paginationSearchHandler={paginationSearchHandler}
              />
              <table className="table table-striped table-bordered mt-3 global-table">
                <thead>
                  <tr>
                    <th style={{ width: "30px" }}>SL</th>
                    <th style={{ width: "30px" }}>Adjustment Code</th>
                    <th style={{ width: "50px" }}>Adjustment Date</th>
                    <th style={{ width: "30px" }}>Amount</th>
                    <th style={{ width: "30px" }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => (
                      <tr key={index}>
                        {/* key={item.businessUnitId} */}
                        <td>{item.sl}</td>
                        <td className="text-center">{item.adjustmentId}</td>
                        <td>
                          <div className="text-center">
                            {_dateFormatter(item.adjustmentDate)}
                          </div>
                        </td>
                        <td>
                          <div className="text-right pr-2">
                            {_formatMoney(item.amount)}
                          </div>
                        </td>
                        <td>
                          <div className="d-flex justify-content-around">
                            <span
                              className="edit"
                              onClick={() => {
                                history.push(
                                  `/mngVat/otherAdjustment/vat-adjustment/edit/${item.adjustmentId}`
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
