import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { getGridData } from "../helper";
//import IEdit from "../../../../_helper/_helperIcons/_edit";
import ReactToPrint from "react-to-print";
import ICustomCard from "../../../../_helper/_customCard";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import printIcon from "../../../../_helper/images/print-icon.png";
import { setShipmentCostLadingAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import ShipmentCostViewForm from "../view/addEditForm";
import { ManualShippointCostDetails } from "../view/manualShippointCostDetails";
import SalesInvoiceModel from "../viewModal";
import { SearchForm } from "./form";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  const history = useHistory();
  const printRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState({});
  // Modal State
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentItem, setCurrentItem] = useState()
  const [manualShippointCostDetails, setManualShippointCostDetails] = useState(false);

  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [paginationState, setPaginationState] = useState();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const shipmentCostLading = useSelector((state) => {
    return state.localStorage.shipmentCostLading;
  }, shallowEqual);

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  // Initially Load Grid Data
  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
      profileData?.accountId &&
      shipmentCostLading?.reportType?.label
    ) {
      const type = shipmentCostLading?.reportType?.label
        ? shipmentCostLading?.reportType?.value
        : false;
      const fromDate = shipmentCostLading?.fromDate || _todayDate();
      const toDate = shipmentCostLading?.toDate || _todayDate();
      const shipPoint = shipmentCostLading?.shipPoint;
      getGridData(
        profileData.accountId,
        selectedBusinessUnit?.value,
        type,
        fromDate,
        toDate,
        shipPoint?.value,
        setGridData,
        setLoading,
        pageNo,
        pageSize,
        setPaginationState
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const setPositionHandler = (pageNo, pageSize, values) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.reportType.value,
      values?.fromDate,
      values?.toDate,
      values?.shipPoint?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      setPaginationState
    );
  };

  return (
    <>
      <ICustomCard
        title="Manual Shipment Cost"
        createHandler={() =>
          history.push(
            "/transport-management/routecostmanagement/shipmentcostManual/create"
          )
        }
      >
        <SearchForm
          shipmentCostLading={shipmentCostLading}
          setGridData={setGridData}
          onSubmit={(values) => {
            getGridData(
              profileData.accountId,
              selectedBusinessUnit?.value,
              values?.reportType.value,
              values?.fromDate,
              values?.toDate,
              values?.shipPoint?.value,
              setGridData,
              setLoading,
              pageNo,
              pageSize,
              setPaginationState
            );
            dispatch(setShipmentCostLadingAction(values));
          }}
        >
          {(values, setFieldValue) => (
            <>
              {/* Table Start */}
              {loading && <Loading />}
              <div className="row ">
                <div className="col-lg-12 row">
                  <div className="col-lg-6 d-flex justify-content-end align-items-center">
                    <div>
                      {values?.reportType?.value && (
                        <ReactToPrint
                          trigger={() => (
                            <button
                              type="button"
                              className="btn btn-primary"
                              style={{ padding: "2px 5px" }}
                            >
                              <img
                                style={{
                                  width: "25px",
                                  paddingRight: "5px",
                                }}
                                src={printIcon}
                                alt="print-icon"
                              />
                              Print
                            </button>
                          )}
                          content={() => printRef.current}
                        />
                      )}
                    </div>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div
                    className="print_wrapper"
                    componentRef={printRef}
                    ref={printRef}
                  >
                  <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>

                          <th>Vehical No</th>
                          <th>Driver Name</th>
                          <th>Route Name</th>
                          <th>Distance KM</th>
                          <th>Actual Cost</th>
                          <th>Pay to Driver</th>
                          <th className="printSectionNone">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td> {index + 1}</td>
                              <td>
                                <div className="pl-2">{item.vehicleNo}</div>
                              </td>

                              <td>
                                <div className="pl-2">{item.driverName}</div>
                              </td>
                              <td>
                                <div className="pl-2">{item.routeName}</div>
                              </td>
                              <td className="text-right">
                                <div className="pl-2">
                                  <div className="pl-2">{item.distanceKm}</div>
                                </div>
                              </td>
                              <td className="text-right">
                                <div className="pl-2">
                                  <div className="pl-2">
                                    {item.totalActualCost}
                                  </div>
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {item?.netPayable}
                                </div>
                              </td>

                              <td className="printSectionNone">
                                <div className="d-flex justify-content-around">
                                  <span className="view">
                                    <IView
                                      clickHandler={() => {
                                        setId(item?.shipmentCostId);
                                        setShowModal(true);
                                      }}
                                    />
                                  </span>
                                  <div className="text-right">
                                    <button
                                      disabled={false}
                                      type="button"
                                      class="btn btn-primary "
                                      // style={{ marginTop: "18px" }}
                                      onClick={() => {
                                        setCurrentItem(item)
                                        setManualShippointCostDetails(true)
                                      }}
                                    >
                                      Details
                                    </button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                        {/* {values?.reportType?.value && ( */}
                        <tr>
                          <td colSpan="4" className="text-right">
                            <b>Total:</b>
                          </td>
                          <td className="text-right">
                            <div className="pl-2">
                              <b>
                                {gridData?.reduce(
                                  (acc, cur) => acc + cur?.distanceKm,
                                  0
                                )}
                              </b>
                            </div>
                          </td>
                          <td className="text-right">
                            <div className="pl-2">
                              <b>
                                {gridData?.reduce(
                                  (acc, cur) => acc + cur?.totalActualCost,
                                  0
                                )}
                              </b>
                            </div>
                          </td>
                          <td className="text-right">
                            <b>
                              {gridData?.reduce(
                                (acc, cur) => acc + cur?.netPayable,
                                0
                              )}
                            </b>
                          </td>
                          <td></td>
                        </tr>
                        {/* )} */}
                      </tbody>
                    </table>
                  </div>
                  </div>
                  <IViewModal
                    show={manualShippointCostDetails}
                    onHide={() => setManualShippointCostDetails(false)}
                    title=" Manual Shipment Cost Details"
                  >
                    <ManualShippointCostDetails
                      currentItem={currentItem}
                      isHiddenBackBtn={true}
                      valuesfordate={values}
                    />
                  </IViewModal>

                  {gridData?.length > 0 && (
                    <PaginationTable
                      count={paginationState?.totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                    />
                  )}

                  <IViewModal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                  >
                    <ShipmentCostViewForm id={id} values={values} />
                  </IViewModal>
                </div>
              </div>
            </>
          )}
        </SearchForm>
      </ICustomCard>

      <SalesInvoiceModel
        show={modelShow}
        onHide={() => setModelShow(false)}
        rowDto={singleData.objList || []}
        singleData={singleData}
      />
    </>
  );
}
