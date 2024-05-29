/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IView from "../../../../_helper/_helperIcons/_view";
import PaginationSearch from "../../../../_helper/_search";
import PaginationTable from "../../../../_helper/_tablePagination";

const Table = ({ obj }) => {
  const {
    values,
    getData,
    gridData,
    buId,
    pageNo,
    setPageNo,
    pageSize,
    setPageSize,
  } = obj;
  const history = useHistory();

  const paginationSearchHandler = (search, values) => {
    getData(values, pageNo, pageSize, search);
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize, "");
  };

  let grandTotal = 0;

  return (
    <>
      <div className="row global-table">
        <div className="col-lg-12 pr-0 pl-0">
          <PaginationSearch
            placeholder="Delivery Order Search"
            paginationSearchHandler={paginationSearchHandler}
            values={values}
          />
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
                          <span className="view">
                            <IView
                              clickHandler={() => {
                                history.push({
                                  pathname: `/inventory-management/warehouse-management/hallogrambasedelivery/view/${td.deliveryId}`,
                                  state: values,
                                });
                              }}
                            />
                          </span>
                          {buId === 180 && (
                            <span
                              className="view"
                              onClick={() => {
                                // setRow(td);
                                // history.push({
                                //   state: values,
                                // });
                                // getDeliveryChallanInfoById(
                                //   td?.deliveryId,
                                //   setDeliveryChallanInfo,
                                //   setLoading,
                                //   () => {
                                //     setShow(true);
                                //   }
                                // );
                              }}
                            >
                              {/* <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  Direct Challan Print
                                </Tooltip>
                              }
                            >
                              <i class="fab pointer fa-weibo"></i>
                            </OverlayTrigger> */}
                            </span>
                          )}
                          {/* {td?.isEditable && (
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
                        )} */}
                          {td?.isCommissionBase && (
                            <span
                              onClick={() => {
                                // setAllotmentChallanModel(true);
                                // setClickRowData(td);
                              }}
                            >
                              {/* <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">
                                  {"Allotment Challan"}
                                </Tooltip>
                              }
                            >
                              <span>
                                <i className={`far fa-file-alt pointer`}></i>
                              </span>
                            </OverlayTrigger> */}
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
        {/* Allotment Challan Model */}
        {/* {allotmentChallanModel && (
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
        </IViewModal> */}
      </div>
    </>
  );
};

export default Table;
