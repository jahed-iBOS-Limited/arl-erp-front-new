import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getPriceSetupGridData } from "../_redux/Actions";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { _fixedPointVat } from "../../../../_helper/_fixedPointVat";

export function TableRow() {
  const dispatch = useDispatch();
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

  // get grid data
  const gridData = useSelector((state) => {
    return state.taxPriceSetup?.gridData;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getPriceSetupGridData(
          profileData.accountId,
          selectedBusinessUnit.value,
          setLoading,
          pageNo,
          pageSize
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    dispatch(
      getPriceSetupGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        setLoading,
        pageNo,
        pageSize,
        searchValue
      )
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };

  return (
    <>
      {/* Table Start */}
      <div className="row cash_journal">
        {loading && <Loading />}
        <div className="col-lg-12 pr-0 pl-0 mt-2">
          <PaginationSearch
            placeholder="Tax Item Name Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          <div className="react-bootstrap-table table-responsive">
            {gridData?.data?.length > 0 && (
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Tax Item Name</th>
                    <th>UOM</th>
                    <th>Valid From</th>
                    <th>Valid To</th>
                    <th>Base Price</th>
                    <th>SD(%)</th>
                    <th>VAT(%)</th>
                    <th>Surcharge(%)</th>
                    <th>Vat Amount</th>
                    <th>Tax Price</th>
                    <th>Base Quantity</th>
                    <th>Include Tax</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((item, index) => (
                    <tr key={index}>
                      <td>{item.sl}</td>
                      <td>
                        <div className="pl-2">{item.taxItemGroupName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{item.uomName}</div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(item.dteValidFrom)}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          {_dateFormatter(item.dteValidTo)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {_fixedPointVat(item.basePrice)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {_fixedPointVat(item.sdpercentage)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {_fixedPointVat(item.vatpercentage)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {_fixedPointVat(item.surchargePercentage)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {_fixedPointVat(item.vatamount)}
                        </div>
                      </td>
                      <td>
                        <div className="text-right pr-2">
                          {_fixedPointVat(item.taxPrice)}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <input
                            type="checkbox"
                            value={item.isPriceIncludingTax}
                            checked={item.isPriceIncludingTax}
                            name="isPriceIncludingTax"
                            onChange={() => {
                              return false;
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="text-center">
                          <input
                            type="checkbox"
                            value={item.isOnQty}
                            checked={item.isOnQty}
                            name="isOnQty"
                            onChange={() => {
                              return false;
                            }}
                          />
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          <span
                            className="edit"
                            onClick={() => {
                              history.push(
                                `/mngVat/cnfg-vat/priceSetup/edit/${item.taxPricingId}`
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
            )}
          </div>
        </div>
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
      </div>
    </>
  );
}
