import React, { useEffect } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IView from "../../../../_helper/_helperIcons/_view";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { withRouter } from "react-router-dom";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationTable from "../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import IViewModal from "./../../../../_helper/_viewModal";
import CompleteModal from "./completeModal";
import { getOrderCompleteInfo } from "./../helper";
import ShippointTransferModel from "./shippointTransferModel";
import Loading from "../../../../_helper/_loading";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getDownlloadFileView_Action } from "../../../../_helper/_redux/Actions";
const GridData = ({
  callBackFuncGridData,
  history,
  setPositionHandler,
  values,
  isShowModal,
  setIsShowModal,
  setCompleteModalInfo,
  completeModalInfo,
  profileData,
  selectedBusinessUnit,
  saveCompleteModel,
  loading,
  setLoading,
  setSalesOrderId,
  shipPointDDL,
  cancelHandler,
  pageNo,
  pageSize,
  setPageNo,
  setPageSize,
}) => {
  // get salesOrder list  from store
  const gridData = useSelector((state) => {
    return state.salesOrder?.gridData;
  }, shallowEqual);
  const [clickRowData, setClickRowData] = React.useState("");
  const [permitted, getPermission] = useAxiosGet();
  const [, getAddressChangingPermission, loader] = useAxiosGet();
  const dispatch = useDispatch();

  useEffect(() => {
    getPermission(
      `/oms/SalesOrder/SalesOrderEditPermission?UserId=${profileData?.userId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
      (resData) => {}
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const paginationSearchHandler = (searchValue) => {
    setPositionHandler(pageNo, pageSize, searchValue);
  };
  const [isTransferModel, setIsTransferModel] = React.useState(false);

  const isLoading = loading || loader;

  return (
    <>
      {/* Table Start */}
      {isLoading && <Loading />}
      <div className="row ">
        <div className="col-lg-12 mt-2 table-responsive">
          <PaginationSearch
            placeholder="Sales Order No. & Party Name & Code"
            paginationSearchHandler={paginationSearchHandler}
          />
          {gridData?.data?.length > 0 && (
            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table sales_order_landing_table">
                <thead>
                  <tr>
                    <th style={{ width: "35px" }}>SL</th>
                    <th style={{ width: "50px" }}>Order No</th>
                    <th style={{ width: "70px" }}>Order Date</th>
                    <th style={{ width: "95px" }}>Ref. Type</th>
                    <th style={{ width: "110px" }}>Sold to Party</th>
                    <th style={{ width: "90px" }}>Shippoint</th>
                    <th style={{ width: "75px" }}>Payment Terms</th>
                    <th style={{ width: "70px" }}>Transshipment</th>
                    <th style={{ width: "70px" }}>Partial Shipment</th>
                    <th style={{ width: "45px" }}>Order Total</th>
                    <th style={{ width: "60px" }}>Approval Status</th>
                    <th style={{ width: "60px" }}>Approval By</th>
                    <th style={{ width: "60px" }}>SO will Expired in</th>
                    <th style={{ width: "85px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {gridData?.data?.map((td, index) => (
                    <tr key={index}>
                      <td> {td?.sl} </td>
                      <td> {td?.salesOrderCode} </td>
                      <td> {_dateFormatter(td?.salesOrderDate)} </td>
                      <td> {td?.refferenceTypeName} </td>
                      <td> {td?.soldToPartnerName} </td>
                      <td> {td?.shippointName} </td>
                      <td> {td?.paymentTermsName} </td>
                      <td className="text-center">
                        {" "}
                        {td?.transshipment.toString()}{" "}
                      </td>
                      <td className="text-center">
                        {" "}
                        {td?.partialShipment.toString()}{" "}
                      </td>
                      <td className="text-right">
                        <div className="pr-2">{td?.totalOrderValue}</div>
                      </td>
                      <td className="text-center">
                        {" "}
                        {td?.approved ? "Approved" : "UnApprove"}{" "}
                      </td>
                      <td>{td?.approvedByName}</td>
                      <td className="text-center">
                        {td?.salesOrderValidityDays}
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <span className="pr-2">
                            <IView
                              clickHandler={() =>
                                history.push({
                                  pathname: `/sales-management/ordermanagement/salesorder/view/${td.salesOrderId}`,
                                  state: td,
                                })
                              }
                            />
                          </span>

                          {/* Edit Icon*/}
                          {values?.orderStatus?.value !== 4 && (
                            <>
                              {!td.approved && (
                                <span
                                  className="pr-2"
                                  onClick={() => {
                                    const modifyValues = {
                                      sbu: {
                                        value: td?.sbuId,
                                        label: td?.sbuName,
                                      },
                                      shippoint: {
                                        value: td?.shippointId,
                                        label: td?.shippointName,
                                      },
                                      plant: {
                                        value: td?.plantId,
                                        label: td?.plantName,
                                      },
                                      salesOrg: {
                                        value: td?.salesOrganizationId,
                                        label: td?.salesOrganizationName,
                                      },
                                      salesOffice: {
                                        value: td?.salesOfficeId,
                                        label: td?.salesOfficeName,
                                      },
                                      distributionChannel: {
                                        value: td?.distributionChannelId,
                                        label: td?.distributionChannelName,
                                      },
                                      orderType: values?.orderType,
                                      orderStatus: values?.orderStatus,
                                    };
                                    history.push({
                                      pathname: `/sales-management/ordermanagement/salesorder/edit/${td.salesOrderId}`,
                                      state: { ...td, ...modifyValues },
                                    });
                                  }}
                                  style={{ border: "none", background: "none" }}
                                >
                                  <IApproval title="Approve/Reject/Offer" />
                                </span>
                              )}
                              {/* Close Icon*/}
                              {td?.approved && (
                                <>
                                  <div>
                                    <OverlayTrigger
                                      overlay={
                                        <Tooltip id="delete-icon">
                                          Close
                                        </Tooltip>
                                      }
                                    >
                                      <span>
                                        <i
                                          onClick={() => {
                                            getOrderCompleteInfo(
                                              profileData?.accountId,
                                              selectedBusinessUnit?.value,
                                              td?.salesOrderId,
                                              setCompleteModalInfo
                                            );
                                            setSalesOrderId(td?.salesOrderId);
                                            setIsShowModal(true);
                                          }}
                                          className="fa fa-trash deleteBtn text-danger"
                                          aria-hidden="true"
                                        ></i>
                                      </span>
                                    </OverlayTrigger>
                                  </div>
                                </>
                              )}
                              {/* Cancel Icon*/}
                              {!td?.approved && (
                                <div>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="delete-icon">Cancel</Tooltip>
                                    }
                                  >
                                    <span>
                                      <i
                                        onClick={() => {
                                          cancelHandler(td?.salesOrderId);
                                        }}
                                        className="fa fa-window-close pointer"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              )}
                              {/* Shippoint Transfer  Icon*/}
                              {!td?.isDeliver && (
                                <div>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip>Shippoint Transfer</Tooltip>
                                    }
                                  >
                                    <span className="pl-2">
                                      <i
                                        onClick={() => {
                                          setIsTransferModel(true);
                                          setClickRowData(td);
                                        }}
                                        className="fas fa-exchange-alt pointer"
                                        aria-hidden="true"
                                      ></i>
                                    </span>
                                  </OverlayTrigger>
                                </div>
                              )}
                              {td?.isEditable && permitted && (
                                <span className="pl-2">
                                  <IEdit
                                    title="Edit Sales Order"
                                    onClick={() => {
                                      const modifyValues = {
                                        sbu: {
                                          value: td?.sbuId,
                                          label: td?.sbuName,
                                        },
                                        shippoint: {
                                          value: td?.shippointId,
                                          label: td?.shippointName,
                                        },
                                        plant: {
                                          value: td?.plantId,
                                          label: td?.plantName,
                                        },
                                        salesOrg: {
                                          value: td?.salesOrganizationId,
                                          label: td?.salesOrganizationName,
                                        },
                                        salesOffice: {
                                          value: td?.salesOfficeId,
                                          label: td?.salesOfficeName,
                                        },
                                        distributionChannel: {
                                          value: td?.distributionChannelId,
                                          label: td?.distributionChannelName,
                                        },
                                        orderType: values?.orderType,
                                        orderStatus: values?.orderStatus,
                                      };

                                      getAddressChangingPermission(
                                        `/wms/FertilizerOperation/GetAllModificationPermission?UserEnroll=${profileData?.userId}&BusinessUnitId=${selectedBusinessUnit?.value}&Type=YsnAddressChange`,
                                        (addressChangingPermission) => {
                                          history.push({
                                            pathname: `/sales-management/ordermanagement/salesorder/update/${td?.salesOrderId}`,
                                            state: {
                                              ...td,
                                              ...modifyValues,
                                              addressChangingPermission,
                                            },
                                          });
                                        }
                                      );
                                    }}
                                  />
                                </span>
                              )}
                            </>
                          )}
                          {td?.attachment ? (
                            <OverlayTrigger
                              overlay={
                                <Tooltip id="cs-icon">View Attachment</Tooltip>
                              }
                            >
                              <span
                                onClick={(e) => {
                                  e.stopPropagation();
                                  dispatch(
                                    getDownlloadFileView_Action(td?.attachment)
                                  );
                                }}
                                className="mt-2 ml-2"
                              >
                                <i
                                  style={{ fontSize: "16px" }}
                                  className={`fa pointer fa-eye`}
                                  aria-hidden="true"
                                ></i>
                              </span>
                            </OverlayTrigger>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Table End */}

      {gridData?.data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
        />
      )}

      {/* Complete Modal */}
      <IViewModal
        title="Sales Order Close"
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
      >
        <CompleteModal
          completeModalInfo={completeModalInfo}
          saveCompleteModel={saveCompleteModel}
          loading={loading}
        />
      </IViewModal>

      {/*  Shippoint Transfer Modal */}
      <IViewModal
        title="Shippoint Transfer"
        show={isTransferModel}
        onHide={() => setIsTransferModel(false)}
      >
        <ShippointTransferModel
          completeModalInfo={completeModalInfo}
          loading={loading}
          values={values}
          shipPointDDL={shipPointDDL}
          clickRowData={clickRowData}
          setIsTransferModel={setIsTransferModel}
          callBackFuncGridData={callBackFuncGridData}
        />
      </IViewModal>
    </>
  );
};

export default withRouter(GridData);
