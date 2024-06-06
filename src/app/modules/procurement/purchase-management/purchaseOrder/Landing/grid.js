import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import ICustomTable from "../../../../_helper/_customTable";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IClose from "../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationSearch from "../../../../_helper/_search";
import { postPoApprovalLandingDataAction } from "../helper";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import IView from "./../../../../_helper/_helperIcons/_view";
import PaginationTable from "./../../../../_helper/_tablePagination";
// import { setTableLastAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// import { useDispatch } from "react-redux";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import IViewModal from "../../../../_helper/_viewModal";
import { checkTwoFactorApproval } from "../helper";
import { ReceivePoReportView } from "../report/recievePoReportView";
import { ShippingViewReport1 } from "../report/shippingreport1";
import { PurchaseOrderViewTableRow } from "../report/tableRow";
import { ShippingViewReport2 } from "../report/shippingReport2";
import { ShippingViewReport3 } from "../report/shippingReport3";
import AttachmentView from "./attachmentView";
const GridData = ({
  history,
  POorderType,
  PORefType,
  paginationState,
  setPositionHandler,
  paginationSearchHandler,
  values,
  cb,
  selectedBusinessUnit,
  profileData,
  gridData,
  data,
}) => {
  let ths = [
    "SL",
    "PO Code",
    "Warehouse",
    "Supplier Name",
    "Order Date",
    "Delivery Address",
    "Terms",
    "Validity",
    "PO Qty",
    "RCV Qty",
    "Status",
    "Action",
  ];
  // gridData ddl

  const { pageNo, setPageNo, pageSize, setPageSize } = paginationState;
  // const dispatch = useDispatch();

  const tableIndex = useSelector((state) => state?.localStorage?.tablePOIndex);

  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [singleData, setSingleData] = useState({});
  const [reverseModalShowState, setReverseModalShowState] = useState({
    isShow: false,
    data: null,
  });
  const [disabledModalButton, setDisabledModalButton] = useState(false);
  const [isReceivePoModal, setIsReceivePoModal] = useState(false);
  const [isShippingReportModal_1, setIsShippingReportModal_1] = useState(false);
  const [isShippingReportModal_2, setIsShippingReportModal_2] = useState(false);
  const [isShippingReportModal_3, setIsShippingReportModal_3] = useState(false);

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (POId, POorderTypeID, PORefType) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to Close this PO`,
      yesAlertFunc: () => {
        postPoApprovalLandingDataAction(
          POId,
          POorderTypeID,
          PORefType
        ).then(() => cb());
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const handleClose = () => {
    setReverseModalShowState({
      isShow: false,
      data: null,
    });
  };
  console.log("for pagination values: ", values);
  return (
    <div style={{ marginTop: "-35px" }}>
      <div className="po_custom_search">
        <PaginationSearch
          // isDisabledFiled={
          //   !values?.orderType ||
          //   !values?.sbu ||
          //   !values?.purchaseOrg ||
          //   !values?.plant ||
          //   !values?.warehouse ||
          //   !values?.refType ||
          //   data?.length <= 0
          // }
          placeholder="PO Name & Code Search"
          paginationSearchHandler={paginationSearchHandler}
        />
      </div>
      <ICustomTable ths={ths} className="table-font-size-sm">
        {data?.map((td, index) => {
          return (
            <tr key={index}>
              <td> {td?.sl} </td>
              <td> {td?.purchaseOrderNo} </td>
              <td> {td?.whName} </td>
              <td> {td?.supplierName} </td>
              <td> {_dateFormatter(td?.purchaseOrderDate)} </td>
              <td style={{ minWidth: "250px" }}> {td?.deliveryAddress} </td>
              <td> {td?.paymentTermsName} </td>
              <td> {_dateFormatter(td?.validityDate)} </td>
              <td> {td?.poquantity || 0} </td>
              <td>
                {
                  <span style={{ textDecoration: "underline" }}>
                    <Link
                      onClick={() => {
                        setIsReceivePoModal(true);
                        setCurrentItem(td);
                      }}
                      to="#"
                    >
                      {td?.receiveqty || 0}
                    </Link>
                  </span>
                }
              </td>
              <td> {td?.isApprove ? "Approved" : "Pending"} </td>
              <td>
                <div className="d-flex justify-content-center align-items-center">
                  {/* <button style={{ border: "none", background: "none" }}>
                    <IView
                      clickHandler={() =>
                        history.push({
                          pathname: `/mngProcurement/purchase-management/purchaseorder/view/${td?.purchaseOrderId}/${POorderType}`,
                          state: true,
                        })
                      }
                    />
                  </button> */}

                  <span className="mr-3"></span>
                  {td?.isClose ? (
                    <IView
                      classes={
                        tableIndex === td?.purchaseOrderId ? "text-primary" : ""
                      }
                      clickHandler={() => {
                        // history.push({
                        //   pathname: `/mngProcurement/purchase-management/purchaseorder/report/${td?.purchaseOrderId}/${POorderType}`,
                        //   state: true,
                        // });
                        // dispatch(setTableLastAction(td?.purchaseOrderId));
                        setCurrentItem(td);
                        setIsShowModal(true);
                      }}
                    />
                  ) : (
                    <>
                      <span className="mr-1">
                        <IView
                          classes={
                            tableIndex === td?.purchaseOrderId
                              ? "text-primary"
                              : ""
                          }
                          clickHandler={() => {
                            setCurrentItem(td);
                            setIsShowModal(true);
                          }}
                        />
                      </span>
                      {!td.isApprove && (
                        <>
                          {/* { POorderType !== 8 &&  */}
                          <span
                            onClick={() =>
                              history.push({
                                pathname: `/mngProcurement/purchase-management/purchaseorder/edit/${td?.purchaseOrderId}/${POorderType}`,
                                //  state: values,
                              })
                            }
                            className="mr-3 ml-1 pointer"
                          >
                            <IEdit />
                          </span>
                          {/* } */}
                        </>
                      )}
                      <span className="mt-1 pointer">
                        <IClose
                          title="Close"
                          closer={() =>
                            approveSubmitlHandler(
                              td?.purchaseOrderId,
                              POorderType,
                              PORefType
                            )
                          }
                        />
                      </span>
                      {td?.isApprove && !td?.isMrr && (
                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">{"Edit"}</Tooltip>}
                        >
                          <span
                            className={`iconActive ml-1 pointer`}
                            onClick={() => {
                              setReverseModalShowState({
                                isShow: true,
                                data: td,
                                index,
                                otp: "",
                              });
                            }}
                          >
                            <i
                              className={`fa pointer fa fa-history pointer`}
                              aria-hidden="true"
                            ></i>
                          </span>
                        </OverlayTrigger>
                      )}
                    </>
                  )}
                  {/* For Shipping Business Unit View Form */}
                  <span className="mr-3"></span>
                  {selectedBusinessUnit?.value === 102 && (
                    <IView
                      title="Shipping View"
                      classes={
                        tableIndex === td?.purchaseOrderId ? "text-primary" : ""
                      }
                      clickHandler={() => {
                        setCurrentItem(td);
                        if (td?.itemCategoryId === 624) {
                          setIsShippingReportModal_1(true);
                        } else if (td?.itemCategoryId === 651) {
                          setIsShippingReportModal_3(true);
                        } else {
                          setIsShippingReportModal_2(true);
                        }
                      }}
                    />
                  )}
                  {td?.isAttatchmentFound && (
                    <button
                      onClick={() => {
                        setShowAttachmentModal(true);
                        setSingleData(td);
                      }}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">{"Attachment"}</Tooltip>}
                      >
                        <i class="far fa-file-image"></i>
                      </OverlayTrigger>
                    </button>
                  )}
                </div>
              </td>
            </tr>
          );
        })}
      </ICustomTable>
      <Modal
        show={reverseModalShowState?.isShow}
        backdrop="static"
        onHide={handleClose}
        centered
      >
        <Modal.Header closeButton>
          {!reverseModalShowState?.isOtpGenerate && (
            <Modal.Title>Are you sure?</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {!reverseModalShowState?.isOtpGenerate && (
            <h5 className="text-center my-5">Do you want to Edit the PO?</h5>
          )}
          {reverseModalShowState?.isOtpGenerate && (
            <div className="text-center my-5">
              <span className="mr-3"> Please Enter OTP Number</span>
              <input
                value={reverseModalShowState?.otp}
                onChange={(e) => {
                  setReverseModalShowState({
                    ...reverseModalShowState,
                    otp: e.target.value,
                  });
                }}
              />
            </div>
          )}
          <div className="text-center my-5">
            <button
              className="btn btn-primary mr-5"
              onClick={(e) => {
                if (reverseModalShowState?.isOtpGenerate) {
                  checkTwoFactorApproval(
                    2,
                    selectedBusinessUnit?.value,
                    "PurchaseOrder",
                    reverseModalShowState?.data?.purchaseOrderId,
                    reverseModalShowState?.data?.purchaseOrderNo,
                    profileData?.userId,
                    reverseModalShowState?.otp,
                    1,
                    setDisabledModalButton,
                    (status) => {
                      if (status === 1) {
                        // gridData.splice(reverseModalShowState?.index, 1);
                        // // setRowDto([...rowDto]);
                        // setReverseModalShowState({
                        //   isShow: false,
                        //   data: null,
                        // });
                        history.push({
                          pathname: `/mngProcurement/purchase-management/purchaseorder/edit/${reverseModalShowState?.data?.purchaseOrderId}/${POorderType}`,
                          //  state: values,
                        });
                      }
                    }
                  );
                } else {
                  checkTwoFactorApproval(
                    1,
                    selectedBusinessUnit?.value,
                    "PurchaseOrder",
                    reverseModalShowState?.data?.purchaseOrderId,
                    reverseModalShowState?.data?.purchaseOrderNo,
                    profileData?.userId,
                    "",
                    1,
                    setDisabledModalButton,
                    () => {
                      setReverseModalShowState({
                        ...reverseModalShowState,
                        otp: "",
                        isOtpGenerate: true,
                      });
                    }
                  );
                  // setReverseModalShowState({
                  //   ...reverseModalShowState,
                  //   otp:"",
                  //   isOtpGenerate: true,
                  // });
                }
              }}
              disabled={disabledModalButton}
            >
              {/* {reverseModalShowState?.isOtpGenerate ? "Send" : "Yes"} */}
              {disabledModalButton
                ? "Processing"
                : reverseModalShowState?.isOtpGenerate
                ? "Send"
                : "Yes"}
            </button>
            <button
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={disabledModalButton}
            >
              {reverseModalShowState?.isOtpGenerate ? "Cancel" : "No"}
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <IViewModal
        show={isShowModal}
        onHide={() => setIsShowModal(false)}
        title="View Purchase Order"
      >
        <PurchaseOrderViewTableRow
          poId={currentItem?.purchaseOrderId}
          purchaseOrderTypeId={currentItem?.purchaseOrderTypeId}
          orId={POorderType}
          isHiddenBackBtn={true}
          formValues={values}
        />
      </IViewModal>
      <IViewModal
        show={isReceivePoModal}
        onHide={() => setIsReceivePoModal(false)}
        title="Receive Purchase Order"
      >
        <ReceivePoReportView
          poId={currentItem?.purchaseOrderId}
          orId={POorderType}
          isHiddenBackBtn={true}
          values={values}
        />
      </IViewModal>

      {/* for shipping iFrame */}

      <IViewModal
        show={isShippingReportModal_1}
        onHide={() => setIsShippingReportModal_1(false)}
        title="View Purchase Order"
      >
        <ShippingViewReport1
          poId={currentItem?.purchaseOrderId}
          orId={POorderType}
          isHiddenBackBtn={true}
        />
      </IViewModal>

      <IViewModal
        show={isShippingReportModal_2}
        onHide={() => setIsShippingReportModal_2(false)}
        title="View Purchase Order"
      >
        <ShippingViewReport2
          poId={currentItem?.purchaseOrderId}
          orId={POorderType}
          isHiddenBackBtn={true}
        />
      </IViewModal>

      <IViewModal
        show={isShippingReportModal_3}
        onHide={() => setIsShippingReportModal_3(false)}
        title="View Purchase Order"
      >
        <ShippingViewReport3
          poId={currentItem?.purchaseOrderId}
          orId={POorderType}
          isHiddenBackBtn={true}
        />
      </IViewModal>

      <IViewModal
        title="View Attachment"
        show={showAttachmentModal}
        onHide={() => setShowAttachmentModal(false)}
      >
        <AttachmentView singleData={singleData} orderTypeId={POorderType} />
      </IViewModal>

      {data?.length > 0 && (
        <PaginationTable
          count={gridData?.totalCount}
          setPositionHandler={setPositionHandler}
          paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
          rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500, 1000, 1500]}
        />
      )}
    </div>
  );
};

export default withRouter(GridData);
