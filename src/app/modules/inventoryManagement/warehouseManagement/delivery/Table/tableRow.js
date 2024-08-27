import React, { useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import useAxiosPut from "../../../../_helper/customHooks/useAxiosPut";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { useCementInvoicePrintHandler } from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/Form/formHandlerBluePill";
import InvoiceReceptForCement from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/invoiceCement/invoiceRecept";
import { deliverySlice } from "../_redux/Slice";
import { getDeliveryChallanInfoById, getInvoiceDataForPrint } from "../utils";
import ForeingSalesInvoicePrint from "../View/print/foreignSalesInvoice";
import ChallanPrint from "../View/print/table";
import { _fixedPoint } from "./../../../../_helper/_fixedPoint";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import PaginationSearch from "./../../../../_helper/_search";
import PaginationTable from "./../../../../_helper/_tablePagination";
import IViewModal from "./../../../../_helper/_viewModal";
import ChallanPrintModal from "./../../../../salesManagement/orderManagement/partnerAllotmentChallan/challanPrintModal/challanPrintModal";
import PartnerAllotmentChallanForm from "./../../../../salesManagement/orderManagement/partnerAllotmentChallan/Form/addEditForm";
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
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const gridData = useSelector((state) => {
    return state.delivery?.gridData;
  }, shallowEqual);

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
  const [, putData, loader] = useAxiosPut();

  const {
    printRefCement,
    handleInvoicePrintCement,
  } = useCementInvoicePrintHandler();

  const rowDataHandler = (name, index, value) => {
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

  const makeUnprinted = (deliveryId) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "Do you want to mark this UNPRINTED?",
      yesAlertFunc: async () => {
        putData(
          `/oms/OManagementReport/InactivePrintedDeliveryPaper?deliveryId=${deliveryId}&userId=${userId}`,
          setLoading,
          () => {
            paginationSearchHandler("", values);
          }
        );
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  let grandTotal = 0;

  const isLoader = loader || loading || IsLoading;
  return (
    <>
      {/* Table Start */}
      {isLoader && <Loading />}
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
                  <th style={{ width: "100px" }}>Actions</th>
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
                                <div className="d-flex justify-content-left">
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
                                            accId,
                                            buId,
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

                          {buId === 180 && (
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
                          {!td?.isPaperDOPrinted ? (
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
                          ) : (
                            <span>
                              <ICon
                                title={"Make it Unprinted"}
                                onClick={() => {
                                  makeUnprinted(td?.deliveryId);
                                }}
                              >
                                <i class="fas fa-history"></i>
                              </ICon>
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
            paginationSearchHandler("", values);
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
