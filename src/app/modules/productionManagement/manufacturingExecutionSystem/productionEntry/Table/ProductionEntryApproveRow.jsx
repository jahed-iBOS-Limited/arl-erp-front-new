import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Select from 'react-select';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IApproval from '../../../../_helper/_helperIcons/_approval';
import Loading from '../../../../_helper/_loading';
import PaginationSearch from '../../../../_helper/_search';
import { SetManufacturePETableLandingAction } from '../../../../_helper/reduxForLocalStorage/Actions';
import customStyles from '../../../../selectCustomStyle';
import ProductionEntryViewModal from '../View/ViewModal';
import BackCalculationPEViewModal from '../ViewForBackCalculation/ViewModal';
import { getGridData, getPlantNameDDL } from '../helper';
import PaginationTable from './../../../../_helper/_tablePagination';
import NewSelect from '../../../../_helper/_select';
import { getShopFloorDDL } from '../../../../_helper/_commonApi';

export function ProductionEntryApproveRow({ dataForBackCalculationCheck }) {
  const { manufacturePETableLanding } = useSelector(
    (state) => state.localStorage
  );
  const [landingData, setLandingData] = useState([]);
  const [modalShow, setModalShow] = useState(false);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [modalShowForBackCalculation, setModalShowForBackCalculation] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ value: false, label: 'Pending' });

  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  const [plant, setPlant] = useState([]);
  const [selectPlant, setselectPlant] = useState(
    manufacturePETableLanding?.plant
  );

  const [shopFloorDDL, setShopFloorDDL] = useState([]);
  const [selectedDDLShop, setselectedDDLShop] = React.useState(
    manufacturePETableLanding?.shopfloor
  );

  const dispatch = useDispatch();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPlantNameDDL(
      profileData.userId,
      profileData.accountId,
      selectedBusinessUnit.value,
      setPlant
    );
  }, [profileData.accountId, selectedBusinessUnit.value]);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue) => {
    if (!selectPlant || !selectedDDLShop)
      return toast.warn('Please select plant and shop floor');
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      selectPlant?.value,
      selectedDDLShop?.value,
      setLandingData,
      setLoading,
      pageNo,
      pageSize,
      searchValue,
      fromDate,
      toDate,
      status?.value
    );
  };

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };
  const history = useHistory();

  useEffect(() => {
    selectPlant?.value &&
      selectedDDLShop?.value &&
      getGridData(
        profileData.accountId,
        selectedBusinessUnit.value,
        selectPlant?.value,
        selectedDDLShop?.value,
        setLandingData,
        setLoading,
        pageNo,
        pageSize,
        '',
        fromDate,
        toDate,
        status?.value
      );
    selectPlant?.value &&
      getShopFloorDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        selectPlant?.value,
        setShopFloorDDL
      );
  }, []);

  return (
    <>
      <div className="">
        <div className="global-form">
          <div className="row">
            <div className="col-lg-2">
              <label>Plant</label>
              <Select
                placeholder="Plant Name"
                onChange={(valueOption) => {
                  setselectPlant(valueOption);
                  setselectedDDLShop('');
                  dispatch(
                    SetManufacturePETableLandingAction({
                      plant: valueOption,
                      shopfloor: '',
                    })
                  );
                  getShopFloorDDL(
                    profileData?.accountId,
                    selectedBusinessUnit?.value,
                    valueOption?.value,
                    setShopFloorDDL
                  );
                  dispatch(
                    SetManufacturePETableLandingAction({
                      plant: valueOption,
                      shopfloor: '',
                    })
                  );
                }}
                value={selectPlant}
                options={plant || []}
                isSearchable={true}
                styles={customStyles}
                name="plant"
              />
            </div>
            <div className="col-lg-2">
              <label>Shop Floor</label>
              <Select
                placeholder="Shop Floor"
                name={shopFloorDDL}
                options={shopFloorDDL || []}
                value={selectedDDLShop}
                onChange={(valueOption) => {
                  setselectedDDLShop(valueOption);
                  dispatch(
                    SetManufacturePETableLandingAction({
                      plant: selectPlant,
                      shopfloor: valueOption,
                    })
                  );
                }}
                isSearchable={true}
                styles={customStyles}
                // errors={errors}
                // touched={touched}
                // isDisabled={isEdit}
              />
            </div>
            <div className="col-lg-2">
              <label>From Date</label>
              <input
                value={fromDate}
                className="form-control"
                placeholder="From Date"
                type="date"
                onChange={(e) => {
                  setFromDate(e.target.value);
                }}
              />
            </div>
            <div className="col-lg-2">
              <label>To Date</label>
              <input
                value={toDate}
                className="form-control"
                placeholder="To Date"
                type="date"
                onChange={(e) => {
                  setToDate(e.target.value);
                }}
              />
            </div>
            <div className="col-lg-2">
              <NewSelect
                name="status"
                options={[
                  { value: false, label: 'Pending' },
                  { value: true, label: 'Approved' },
                ]}
                value={status}
                label="Status"
                onChange={(valueOption) => {
                  setStatus(valueOption);
                }}
              />
            </div>
            <div style={{ marginTop: '10px' }} className="col-lg-1 ml-5">
              <button
                className="btn btn-primary"
                disabled={!selectedDDLShop || !selectPlant}
                onClick={(e) => {
                  getGridData(
                    profileData.accountId,
                    selectedBusinessUnit.value,
                    selectPlant?.value,
                    selectedDDLShop?.value,
                    setLandingData,
                    setLoading,
                    pageNo,
                    pageSize,
                    '',
                    fromDate,
                    toDate,
                    status?.value
                  );
                }}
              >
                View
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div style={{ marginTop: '10px' }} className="col-lg-12 pr-0 pl-0">
          {loading && <Loading />}
          <PaginationSearch
            placeholder="Item Name Search"
            paginationSearchHandler={paginationSearchHandler}
          />
          <div className="row">
            <div className="col-lg-12">
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      {/* <th style={{ width: "30px" }}>SL</th> */}
                      <th style={{ width: '30px' }}>SL</th>
                      <th style={{ width: '50px' }}>Production Date</th>
                      <th style={{ width: '50px' }}>Shift</th>
                      <th style={{ width: '50px' }}>Item Name</th>
                      <th style={{ width: '50px' }}>UoM Name</th>
                      <th style={{ width: '50px' }}>Production Order Code</th>
                      <th style={{ width: '50px' }}>Production Qty</th>
                      <th style={{ width: '50px' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {landingData?.data?.map((item, index) => (
                      <tr key={index}>
                        <td>{item?.sl}</td>
                        <td className="text-center">
                          {_dateFormatter(item?.date)}
                        </td>
                        <td>
                          <div className="pl-2">{item?.shiftName}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item?.itemName}</div>
                        </td>
                        <td>
                          <div className="pl-2">{item?.uomName}</div>
                        </td>
                        <td>
                          {/* <div className="text-center">{item?.productionOrderCode}</div> */}
                          <div className="text-center">
                            {/* {item?.referenceCode} */}
                            {item?.productionOrderCode ? (
                              <span
                                className="text-primary font-weight-bold cursor-pointer mr-2"
                                style={{ textDecoration: 'underline' }}
                                onClick={() => {
                                  history.push(
                                    `/production-management/mes/productionorder/view/${item?.productionOrderNo}`
                                  );
                                }}
                              >
                                {item?.productionOrderCode || ''}
                              </span>
                            ) : (
                              <span>{item?.productionCode || ''}</span>
                            )}
                          </div>
                        </td>
                        <td className="text-center">{item?.productionQty}</td>
                        <td>
                          <div class="d-flex align-items-center justify-content-center">
                            {/* {productionEntry?.isView && (
                            <button class="btn borderlessBtn">
                              <span className="text-center mx-2">
                                <IView
                                  clickHandler={() => {
                                    if (
                                      dataForBackCalculationCheck?.isBackCalculation ===
                                      1
                                    ) {
                                      setModalShowForBackCalculation(true);
                                      getSingleDataByForBackCalculation(
                                        item?.productionId,
                                        setSingleBackCalculationData
                                      );
                                    } else {
                                      setModalShow(true);
                                      getSingleDataById(
                                        item?.productionId,
                                        profileData?.accountId,
                                        selectedBusinessUnit?.value,
                                        setSingleData
                                      );
                                    }
                                  }}
                                  classes="text-primary"
                                />
                              </span>
                            </button>
                          )}
                          <button
                            class="btn borderlessBtn"
                            onClick={() => {
                              if (
                                dataForBackCalculationCheck?.isBackCalculation ===
                                1
                              ) {
                                history.push(
                                  `/production-management/mes/productionentry/backCalculationEdit/${item?.productionId}`
                                );
                              } else {
                                history.push(
                                  `/production-management/mes/productionentry/edit/${item?.productionId}`
                                );
                              }
                            }}
                            disabled={item?.isApprove === true}
                          >
                            <span className="edit text-center mr-2">
                              <IEdit />
                            </span>
                          </button> */}
                            {/* APPROVAL */}
                            {item?.isApprove ? (
                              <button
                                class="btn borderlessBtn"
                                disabled={item?.isApprove === true}
                              >
                                <span>
                                  <IApproval
                                    title="Can't Approval"
                                    classes="text-success"
                                  />
                                </span>
                              </button>
                            ) : (
                              <button
                                class="btn borderlessBtn"
                                onClick={() => {
                                  const path =
                                    dataForBackCalculationCheck?.isBackCalculation ===
                                    1
                                      ? `/production-management/mes/productionentry/approveBackCalculation/${item?.productionId}`
                                      : `/production-management/mes/productionentry/approval/${item?.productionId}/${dataForBackCalculationCheck?.isBackCalculation}`;

                                  history.push(path);
                                }}
                              >
                                <span>
                                  <IApproval
                                    title="Approval"
                                    classes="text-primary"
                                  />
                                </span>
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        {/* Pagination Code */}
        {landingData?.data?.length > 0 && (
          <PaginationTable
            count={landingData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          />
        )}
        <ProductionEntryViewModal
          data={{}}
          show={modalShow}
          onHide={() => setModalShow(false)}
        />
        <BackCalculationPEViewModal
          data={{}}
          show={modalShowForBackCalculation}
          onHide={() => setModalShowForBackCalculation(false)}
        />
      </div>
    </>
  );
}
