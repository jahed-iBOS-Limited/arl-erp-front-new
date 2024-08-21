import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "./../../../../_helper/_search";
import IViewModal from "./../../../../_helper/_viewModal";
import PartnerAllotmentChallanForm from "./../../../../salesManagement/orderManagement/partnerAllotmentChallan/Form/addEditForm";
import ChallanPrintModal from "./../../../../salesManagement/orderManagement/partnerAllotmentChallan/challanPrintModal/challanPrintModal";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import { getDeliveryChallanInfoById, getInvoiceDataForPrint } from "../utils";
import ChallanPrint from "../View/print/table";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import ForeingSalesInvoicePrint from "../View/print/foreignSalesInvoice";
import { useCementInvoicePrintHandler } from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/Form/formHandlerBluePill";
import InvoiceReceptForCement from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/invoiceCement/invoiceRecept";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import { deliverySlice } from "../_redux/Slice";
import HologramPrintForAkijCommodities from "./hologramForCommodities";
const { actions: slice } = deliverySlice;

export function TableRow({
  pageNo,
  setPageNo,
  setPositionHandler,
  pageSize,
  setPageSize,
  loading,
  setLoading,
  paginationSearchHandler,
  values,
  isWorkable,
}) {
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const history = useHistory();
  const [allotmentChallanModel, setAllotmentChallanModel] = useState(false);
  const [clickRowData, setClickRowData] = useState("");
  const [challanPrintModalShow, setChallanPrintModalShow] = useState(false);
  const [show, setShow] = useState(false);
  const [deliveryChallanInfo, setDeliveryChallanInfo] = useState({});
  const [row, setRow] = useState({});
  const [foreignSalesInvoiceModal, setForeignSalesInvoiceModal] = useState(
    false
  );
  const [printData, getPrintData, IsLoading] = useAxiosPut();
  const dispatch = useDispatch();
  const [showMutipleModal, setShowMultipleModal] = useState(false);

  const [invoiceData, setInvoiceData] = useState([]);

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = useCementInvoicePrintHandler();

  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.delivery?.gridData;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // useEffect(() => {
  //   if (selectedBusinessUnit && profileData) {
  //     dispatch(
  //       getDeliveryGridData(
  //         profileData.accountId,
  //         selectedBusinessUnit.value,
  //         setLoading,
  //         pageNo,
  //         pageSize,
  //       )
  //     )
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedBusinessUnit, profileData])

  const rowDataHandler = (name, index, value) => {
    // Clone the gridData to avoid mutating the original object
    let _data = [...gridData?.data];

    // Ensure that the specific row object is mutable
    if (Object.isExtensible(_data[index])) {
      _data[index][name] = value;
    } else {
      // If the object is not extensible, clone it before modifying
      _data[index] = { ..._data[index], [name]: value };
    }

    // Dispatch the updated gridData to the Redux store or state management
    dispatch(slice.SetGridData({ ...gridData, data: _data }));
  };

  let grandTotal = 0;
  return (
    <>
      {/* Table Start */}
      {(loading || IsLoading) && <Loading />}
      <div className="row global-table">
        <div className="col-lg-12 pr-0 pl-0">
          <div className="d-flex justify-content-between">
            <PaginationSearch
              placeholder="Delivery Order Search"
              paginationSearchHandler={paginationSearchHandler}
              values={values}
            />
            <div>
              {gridData?.data?.filter((e) => e?.isSelectedPrint)?.length >
                0 && (
                <button
                  type="button"
                  className={"btn btn-primary mr-2"}
                  onClick={() => {
                    const payload = gridData?.data
                      ?.filter((element) => element?.isSelectedPrint)
                      ?.map((item) => item?.deliveryId);
                    setShowMultipleModal(true);
                    getPrintData(
                      `/oms/OManagementReport/GetMultiplePaperDOPrintCopy?UserId=${userId}&BusinessUnitId=${buId}`,
                      payload,
                      () => {
                        setShowMultipleModal(true);
                      },
                      true
                    );
                  }}
                >
                  Print
                </button>
              )}
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table table-font-size-sm">
              <thead>
                <tr>
                  <th style={{ width: "35px" }}>SL</th>
                  <th>Delivery Order</th>

                  <th style={{ width: "90px" }}>Delivery Date</th>

                  <th>Sales Organization</th>
                  <th>Channel</th>
                  <th>Ship Point</th>
                  <th>Sold To Party</th>
                  <th>Vehicle Mode</th>
                  <th>Supplier Type</th>
                  <th>Delivery Time</th>

                  <th style={{ width: "90px" }}>Total Quantity</th>
                  <th style={{ width: "75px" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {gridData?.data?.map((td, index) => {
                  grandTotal += td.totalDeliveryQuantity;
                  return (
                    <tr key={index}>
                      <td> {td.sl} </td>
                      <td>
                        <div className="text-center pr-2">
                          {td.deliveryCode}
                        </div>
                      </td>

                      <td>
                        <div className="text-center">
                          {_dateFormatter(td.deliveryDate)}
                        </div>
                      </td>

                      <td>
                        <div className="pl-2">{td.salesOrganizationName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{td.distributionChannelName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{td.shipPointName}</div>
                      </td>
                      <td>
                        <div className="pl-2">{td.soldToPartnerName}</div>
                      </td>
                      <td>
                        <div className="text-center pr-2">{td.vehicleMode}</div>
                      </td>
                      <td>
                        <div className="text-center pr-2">
                          {td.supplierType}
                        </div>
                      </td>
                      <td>
                        <div className="text-center">{td.deliveryTime}</div>
                      </td>
                      <td>
                        <div className="text-right">
                          {td.totalDeliveryQuantity}
                        </div>
                      </td>
                      <td>
                        <div className="d-flex justify-content-around">
                          {td?.distributionChannelName === "Export" ? (
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  setForeignSalesInvoiceModal(true);
                                  setClickRowData(td);
                                }}
                              />
                            </span>
                          ) : (
                            <>
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    if (td?.isCommissionBase) {
                                      setChallanPrintModalShow(true);
                                      setClickRowData(td);
                                    } else {
                                      history.push({
                                        pathname: `/inventory-management/warehouse-management/delivery/view/${td.deliveryId}`,
                                        state: values,
                                      });
                                    }
                                  }}
                                />
                              </span>
                              {isWorkable && (
                                <div className="d-flex justify-content-between">
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">
                                        {"Print Invoice"}
                                      </Tooltip>
                                    }
                                  >
                                    <span>
                                      <i
                                        onClick={() => {
                                          getInvoiceDataForPrint({
                                            accId: profileData?.accountId,
                                            buId: selectedBusinessUnit?.value,
                                            deliveryId: td?.deliveryId,
                                            setLoading,
                                            cb: (resData) => {
                                              setInvoiceData(resData?.item1);
                                              handleInvoicePrintCement();
                                            },
                                          });
                                        }}
                                        style={{
                                          fontSize: "16px",
                                          cursor: "pointer",
                                        }}
                                        class="fa fa-print"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              )}
                            </>
                          )}

                          {selectedBusinessUnit?.value === 180 && (
                            <span
                              className="view"
                              onClick={() => {
                                setRow(td);
                                history.push({
                                  state: values,
                                });
                                getDeliveryChallanInfoById(
                                  td?.deliveryId,
                                  setDeliveryChallanInfo,
                                  setLoading,
                                  () => {
                                    setShow(true);
                                  }
                                );
                              }}
                            >
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    Direct Challan Print
                                  </Tooltip>
                                }
                              >
                                <i class="fab pointer fa-weibo"></i>
                              </OverlayTrigger>
                            </span>
                          )}
                          {td?.isEditable && (
                            <span
                              className="edit"
                              onClick={() => {
                                history.push(
                                  `/inventory-management/warehouse-management/delivery/edit/${td.deliveryId}`
                                );
                              }}
                            >
                              <IEdit />
                            </span>
                          )}
                          {td?.isCommissionBase && (
                            <span
                              onClick={() => {
                                setAllotmentChallanModel(true);
                                setClickRowData(td);
                              }}
                            >
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">
                                    {"Allotment Challan"}
                                  </Tooltip>
                                }
                              >
                                <span>
                                  <i className={`far fa-file-alt pointer`}></i>
                                </span>
                              </OverlayTrigger>
                            </span>
                          )}
                          {!td?.isPaperDOPrinted && (
                            <span
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                gap: "5px",
                              }}
                            >
                              <ICon
                                title="Print"
                                onClick={() => {
                                  const payload = [td?.deliveryId];
                                  getPrintData(
                                    `/oms/OManagementReport/GetMultiplePaperDOPrintCopy?UserId=${userId}&BusinessUnitId=${buId}`,
                                    payload,
                                    () => {
                                      setShow(true);
                                    },
                                    true
                                  );
                                }}
                              >
                                <i class="fas fa-print"></i>
                              </ICon>
                              <input
                                type="checkbox"
                                value={td?.isSelectedPrint}
                                checked={td?.isSelectedPrint}
                                onChange={() => {
                                  rowDataHandler(
                                    "isSelectedPrint",
                                    index,
                                    !td.isSelectedPrint
                                  );
                                }}
                              />
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                <tr className="text-right font-weight-bold">
                  <td className="text-right" colSpan="10">
                    {" "}
                    Grand Total{" "}
                  </td>
                  <td> {_fixedPoint(grandTotal || 0)} </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Pagination Code */}
        {gridData?.data?.length > 0 && (
          <PaginationTable
            count={gridData?.totalCount}
            setPositionHandler={setPositionHandler}
            paginationState={{
              pageNo,
              setPageNo,
              pageSize,
              setPageSize,
            }}
            rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
            values={values}
          />
        )}
        {isWorkable && (
          <InvoiceReceptForCement
            printRef={printRefCement}
            invoiceData={invoiceData?.length > 0 ? invoiceData : []}
            // channelId={46}
            channelId={values?.channel?.value}
            isWorkable={isWorkable}
            isWithVat={values?.isCheck}
            typedVat={values?.vat}
          />
        )}
        {/* Allotment Challan Model */}
        {allotmentChallanModel && (
          <IViewModal
            show={allotmentChallanModel}
            onHide={() => setAllotmentChallanModel(false)}
          >
            <PartnerAllotmentChallanForm
              deliveryLandingData={{
                ...clickRowData,
                isBackBtn: true,
                deliveryLandingRowBtnEnter: true,
                setAllotmentChallanModel: setAllotmentChallanModel,
              }}
            />
          </IViewModal>
        )}

        {challanPrintModalShow && (
          <ChallanPrintModal
            show={challanPrintModalShow}
            deliveryId={clickRowData?.commisssionDlvId}
            onHide={() => {
              setChallanPrintModalShow(false);
            }}
            setChallanPrintModalShow={setChallanPrintModalShow}
          />
        )}

        <IViewModal show={show} onHide={() => setShow(false)}>
          <ChallanPrint deliveryChallanInfo={deliveryChallanInfo} row={row} />
        </IViewModal>

        {foreignSalesInvoiceModal && (
          <IViewModal
            show={foreignSalesInvoiceModal}
            onHide={() => setForeignSalesInvoiceModal(false)}
          >
            <ForeingSalesInvoicePrint
              landingData={clickRowData}
            ></ForeingSalesInvoicePrint>
          </IViewModal>
        )}
        <IViewModal
          show={showMutipleModal}
          onHide={() => {
            setShowMultipleModal(false);
            // getData(values, pageNo, pageSize, "");
          }}
        >
          {buId === 221 && (
            // Akij Commodities Ltd.
            <HologramPrintForAkijCommodities printDataList={printData} />
          )}
        </IViewModal>
      </div>
    </>
  );
}
