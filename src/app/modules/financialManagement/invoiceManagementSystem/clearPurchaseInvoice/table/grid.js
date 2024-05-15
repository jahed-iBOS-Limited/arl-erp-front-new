import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { withRouter } from "react-router-dom";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import { setPlantNameAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// eslint-disable-next-line no-unused-vars
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import {
  getBankAcDDL,
  getCashGlDDL,
  getPurchaseClearPagination_api,
  plantDDL_api,
  getGridData,
} from "../helper";
import IView from "../../../../_helper/_helperIcons/_view";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import PaymentModal from "../paymentModal/modal";
import Loading from "./../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";

const GridData = () => {
  // eslint-disable-next-line no-unused-vars
  let history = useHistory();
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [gridData, setGridData] = useState([]);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [bankAcDDL, setBankAcDDL] = useState([]);
  const [cashGlDDL, setCashGlDDL] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBankAcDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBankAcDDL
      );
      getCashGlDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCashGlDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //const [currentItem, setCurrentItem] = useState();
  const [plantDDL, setplantDDL] = useState([]);

  const [paymentModal, setPaymentModal] = useState(false);

  const [selectedPurchase, setSelectedPurchase] = useState({});

  const [glGridData, setGlGridData] = useState([]);

  const plantNameInitData = useSelector(
    (state) => state.localStorage.plantNameDDL
  );
  const dispatch = useDispatch();
  useEffect(() => {
    if (plantNameInitData?.value) {
      getPurchaseClearPagination_api(
        selectedBusinessUnit?.value,
        plantNameInitData?.value,
        profileData?.accountId,
        setGridData,
        setLoading,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  useEffect(() => {
    plantDDL_api(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setplantDDL
    );
  }, [profileData, selectedBusinessUnit]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    getPurchaseClearPagination_api(
      selectedBusinessUnit?.value,
      plantNameInitData?.value,
      profileData?.accountId,
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
      <div className="global-form">
        <div className="row">
          <div className="col-lg-4">
            {/* Header Start */}
            <label>Plant Name</label>
            <Select
              onChange={(valueOption) => {
                dispatch(setPlantNameAction(valueOption));
                getPurchaseClearPagination_api(
                  selectedBusinessUnit?.value,
                  valueOption?.value,
                  profileData?.accountId,
                  setGridData,
                  setLoading,
                  pageNo,
                  pageSize
                );
              }}
              value={plantNameInitData}
              options={plantDDL || []}
              isSearchable={true}
              styles={customStyles}
              name={plantDDL}
            />
          </div>
        </div>
      </div>
      <div className="row cash_journal">
        <div className="col-lg-12 pr-0 pl-0">
          <PaginationSearch
            placeholder="Invoice Code or Supplier  Search"
            paginationSearchHandler={paginationSearchHandler}
          />
        </div>
        <div className="col-lg-12 pr-0 pl-0">
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing global-table">
              <thead>
                <tr>
                  <th style={{ width: "25px" }}>Sl</th>
                  <th>Invoice Code</th>
                  <th>Transaction Date</th>
                  <th>Supplier</th>
                  <th>Warehouse Name</th>
                  <th>PO Amount</th>
                  <th>GRN Amount</th>
                  {/* <th>Invoice Amount</th> */}
                  <th>Payment Amount</th>
                  <th style={{ width: "90px" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading && <Loading />}
                {gridData?.data?.map((item, index) => (
                  <tr key={index}>
                    <td>{item?.sl}</td>
                    <td>
                      <div className="pl-2">{item?.invoiceCode}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {item?.transanctionDate
                          ? _dateFormatter(item?.transanctionDate)
                          : "N/A"}
                      </div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.partnerName}</div>
                    </td>
                    <td>
                      <div className="pl-2">{item?.wareHouseName}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.poAmount}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">{item?.grnAmount}</div>
                    </td>
                    <td>
                      <div className="text-right pr-2">
                        {item?.invoiceAmount}
                      </div>
                    </td>
                    <td className="text-center">
                      <div className="d-flex justify-content-around">
                        <span className="view">
                          <IView
                            clickHandler={() => {
                              history.push(
                                `/financial-management/invoicemanagement-system/clearpurchaseinvoice/view/${item?.invoiceId}/${item?.supplierInvoiceId}`
                              );
                            }}
                          />
                        </span>

                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">{"Payment"}</Tooltip>}
                        >
                          <span
                            onClick={() => {
                              getGridData(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                item?.sbuId || 0,
                                item?.partnerId || 0,
                                cashGlDDL[0]?.value || 0,
                                item?.invoiceAmount,
                                bankAcDDL[0]?.value,
                                setGlGridData
                              );
                              setSelectedPurchase(item);
                              setPaymentModal(true);
                            }}
                          >
                            <i
                              className={`fa pointer fa-credit-card`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </OverlayTrigger>
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
            />
          )}
        </div>
      </div>

      <PaymentModal
        show={paymentModal}
        onHide={(e) => setPaymentModal(false)}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        selectedPurchase={selectedPurchase}
        glGridData={glGridData}
        setGlGridData={setGlGridData}
        cashGlDDL={cashGlDDL}
        bankAcDDL={bankAcDDL}
        setPaymentModal={setPaymentModal}
        plantNameInitData={plantNameInitData}
        setGridData={setGridData}
        setLoading={setLoading}
        pageNo={pageNo}
        pageSize={pageSize}
      />
    </>
  );
};

export default withRouter(GridData);
