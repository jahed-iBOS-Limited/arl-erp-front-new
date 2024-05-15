/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { billSubmitApi, cancelShipmentCost, getGridData } from "../helper";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import { SearchForm } from "./form";
// import IView from "../../../../_helper/_helperIcons/_view";
// import printIcon from "../../../../_helper/images/print-icon.png";
import ICustomCard from "../../../../_helper/_customCard";
import Loading from "../../../../_helper/_loading";
import PaginationSearch from "../../../../_helper/_search";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import ShipmentCostViewForm from "../view/addEditForm";
import SalesInvoiceModel from "../viewModal";
import IConfirmModal from "./../../../../_helper/_confirmModal";
// import ReactToPrint from "react-to-print";
import { setShipmentCostLadingAction } from "../../../../_helper/reduxForLocalStorage/Actions";

export function TableRow() {
  const [gridData, setGridData] = useState([]);
  // const history = useHistory();
  const printRef = useRef();
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState({});
  const [billSubmitBtn, setBillSubmitBtn] = useState(true);
  // Modal State
  const [id, setId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modelShow, setModelShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isBillSubmit, setIsBillSubmit] = useState(false);

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
        null
      );
      if (shipmentCostLading?.reportType?.value === true) {
        setIsBillSubmit(true);
      } else {
        setIsBillSubmit(false);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const paginationSearchHandler = (searchValue, values) => {
    getGridData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.reportType.value,
      values?.fromDate,
      values?.toDate,
      values?.shipPoint?.value,
      setGridData,
      setLoading,
      searchValue
    );
  };

  // Bill Submited Handler
  const billSubmit = (values) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: () => {
        const filterSelectedData = gridData?.filter((item) => item?.isSelect);
        const payload = filterSelectedData?.map((item) => {
          return {
            shipmentCostId: item?.shipmentCostId,
            intActionBy: profileData?.userId,
          };
        });
        billSubmitApi(setLoading, payload, () => {
          getGridData(
            profileData.accountId,
            selectedBusinessUnit?.value,
            values?.reportType.value,
            values?.fromDate,
            values?.toDate,
            values?.shipPoint?.value,
            setGridData,
            setLoading,
            null
          );
          setBillSubmitBtn(true);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const shipmentCostCancel = (values, shipmentCostId) => {
    let confirmObject = {
      title: "Are you sure?",
      yesAlertFunc: () => {
        cancelShipmentCost(
          setLoading,
          values?.reportType?.value,
          shipmentCostId,
          () => {
            getGridData(
              profileData.accountId,
              selectedBusinessUnit?.value,
              values?.reportType.value,
              values?.fromDate,
              values?.toDate,
              values?.shipPoint?.value,
              setGridData,
              setLoading,
              null
            );
          }
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...gridData];
    copyRowDto[index].isSelect = !copyRowDto[index].isSelect;
    setGridData(copyRowDto);

    // btn hide conditon
    const bllSubmitBtn = copyRowDto.some((itm) => itm.isSelect === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      isSelect: value,
    }));
    setGridData(modifyGridData);
    // btn hide conditon
    const bllSubmitBtn = modifyGridData.some((itm) => itm.isSelect === true);
    if (bllSubmitBtn) {
      setBillSubmitBtn(false);
    } else {
      setBillSubmitBtn(true);
    }
  };

  return (
    <>
      <ICustomCard title="Shipment Cost Cancel">
        <SearchForm
          shipmentCostLading={shipmentCostLading}
          setGridData={setGridData}
          isBillSubmit={isBillSubmit}
          setIsBillSubmit={setIsBillSubmit}
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
              null
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
                  <div className="col-lg-6">
                    <PaginationSearch
                      placeholder="Shipment Code & Vehical No"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <div
                    className="print_wrapper table-responsive"
                    componentRef={printRef}
                    ref={printRef}
                  >
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Shipment Code</th>
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
                                <div className="pl-2">{item.shipmentCode}</div>
                              </td>
                              <td>
                                <div className="pl-2">{item.vehicleNo}</div>
                              </td>

                              <td>
                                <div className="pl-2">{item.driverName}</div>
                              </td>
                              <td>
                                <div className="pl-2">{item.routeName}</div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  <div className="pl-2">{item.distanceKM}</div>
                                </div>
                              </td>
                              <td>
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

                              <td className="printSectionNone text-center">
                                <button
                                  onClick={() => {
                                    shipmentCostCancel(
                                      values,
                                      item?.shipmentCostId
                                    );
                                  }}
                                  type="button"
                                  className="btn btn-primary"
                                >
                                  Cancel
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                        {values?.reportType?.value === 2 && (
                          <tr>
                            <td colSpan="5" className="text-right">
                              <b>Total:</b>
                            </td>
                            <td className="">
                              <div className="pl-2">
                                <b>
                                  {gridData?.reduce(
                                    (acc, cur) => acc + cur?.distanceKM,
                                    0
                                  )}
                                </b>
                              </div>
                            </td>
                            <td className="">
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
                            <td> </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
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
