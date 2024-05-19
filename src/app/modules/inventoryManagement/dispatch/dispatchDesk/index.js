import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IApproval from "../../../_helper/_helperIcons/_approval";
import Loading from "../../../_helper/_loading";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import CommonTable from "../../../_helper/commonTable";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import ReceiveModal from "./receiveModal";
import SendModal from "./sendModal";
import PaginationSearch from "../../../_helper/_search";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import IConfirmModal from "../../../_helper/_confirmModal";
import OwnerSendModal from "./ownerSendModal";
const initData = {
  requisition: "send",
};
export default function DispatchDeskLanding() {
  const saveHandler = (values, cb) => {};
  const [isShowModal, setShowModal] = useState(false);
  const [isShowSendModal, setShowSendModal] = useState(false);
  const [isShowReceiveModal, setShowReceiveModal] = useState(false);
  const [singleItem, setSingleItem] = useState({});
  const [fromPlantDDL, getFromPlantDDL, , setFromPlant] = useAxiosGet();
  //   const history = useHistory();
  const {
    profileData: { accountId: accId, userId, employeeId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loadGridData, setGridData] = useAxiosGet();
  const [, receiveHandler, receiveLoader] = useAxiosPost();

  const handleGetRowData = (status, pageNo, pageSize, searchValue) => {
    const searchParam = searchValue ? `&search=${searchValue}` : "";
    if (status === "send") {
      getGridData(
        `/tms/DocumentDispatch/GetDispatchsSendPasignation?AccountId=${accId}&businessUnitId=${buId}&dispatchDeskSenderId=${0}&SenderId=${0}&ReceiverId=0&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchParam}`,
        (rowData) => {
          const result = rowData?.data?.sort((a, b) =>
            a.isSend === b.isSend ? 0 : a.isSend ? 1 : -1
          );
          setGridData({ ...rowData, data: result });
        }
      );
    } else {
      getGridData(
        `/tms/DocumentDispatch/GetDispatchsReceivePasignation?AccountId=${accId}&businessUnitId=${buId}&SenderId=0&ReceiverId=${0}&dispatchDeskReceiverId=${0}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}${searchParam}
      `
      );
    }
  };
  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    handleGetRowData(values?.requisition, pageNo, pageSize, searchValue);
  };

  useEffect(() => {
    getFromPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`,
      (data) => {
        const fromPlantPayload = data?.map((item) => item?.value);
        handleGetRowData("send", pageNo, pageSize);
        setFromPlant(fromPlantPayload);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, buId]);

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loadGridData || receiveLoader) && <Loading />}
          <IForm
            title="Dispatch Desk"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setShowReceiveModal(true);
                    }}
                  >
                    Receive
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="row global-form">
                <div
                  style={{ alignItems: "center", gap: "15px" }}
                  className="col-lg-4  d-flex"
                >
                  <label
                    style={{ alignItems: "center", gap: "5px" }}
                    className="d-flex"
                    htmlFor="send"
                  >
                    <input
                      id="send"
                      type="radio"
                      name="requisition"
                      checked={values?.requisition === "send"}
                      onChange={(e) => {
                        setFieldValue("requisition", "send");
                        setPageNo(0);
                        setPageSize(15);
                        handleGetRowData("send", 0, 15);
                      }}
                    />
                    Send
                  </label>
                  <label
                    style={{ alignItems: "center", gap: "5px" }}
                    className="mr-3 d-flex"
                    htmlFor="receive"
                  >
                    <input
                      id="receive"
                      type="radio"
                      name="requisition"
                      checked={values?.requisition === "received"}
                      onChange={(e) => {
                        setFieldValue("requisition", "received");
                        setPageNo(0);
                        setPageSize(15);
                        handleGetRowData("received", 0, 15);
                      }}
                    />
                    Receive
                  </label>
                </div>
              </div>
              <div>
                <PaginationSearch
                  placeholder="Search..."
                  paginationSearchHandler={paginationSearchHandler}
                  values={values}
                />
              </div>
              <div style={{ marginTop: "7px", gap: "5px" }}>
                <CommonTable
                  headersData={[
                    "Document No",
                    "Sender Name",
                    "Sender Location",
                    "Dispatch Type",
                    "Document Type",
                    {
                      title:
                        values?.requisition === "received"
                          ? "Received Date"
                          : "Requisition Date",
                    },
                    "Receiver Name",
                    "Receiver Business Unit",
                    "Receiver Location",
                    "Send By",
                    "Remarks",
                    "Status",
                    "Action",
                  ]}
                >
                  <tbody>
                    {gridData?.data?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.dispatchCode}</td>
                        <td className="text-center">
                          {item?.senderName} [{item?.senderEnrollId}]
                        </td>
                        <td className="text-center">{item?.fromLocation}</td>
                        <td className="text-center">{item?.dispatchType}</td>
                        <td className="text-center">
                          {item?.dispatchDescription}
                        </td>
                        <td className="text-center">
                          {values?.requisition === "received"
                            ? _dateFormatter(item.dispatchReceiveDate)
                            : _dateFormatter(item.requisitionDate)}
                        </td>
                        <td className="text-center">
                          {item?.receiverName} [{item?.receiverEnrollId}]
                        </td>
                        <td className="text-center">
                          {item?.receiverBusinessUnit}
                        </td>
                        <td className="text-center">{item?.toLocation}</td>
                        <td className="text-center">{values?.requisition === "send" ? item?.sendByName : item?.sendToReceiverBy}</td>
                        <td className="text-center">{item?.dispatchNote}</td>
                        <td className="text-center">
                          <span style={{ color: "green", fontWeight: "bold" }}>
                            {item?.sendReceive}
                          </span>
                        </td>
                        <td className="text-center">
                          {values?.requisition === "send" &&
                            !item?.isSend &&
                            item?.isRequisitionDesk && (
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => console.log("click icon")}
                              >
                                <IApproval
                                  title="Send"
                                  onClick={() => {
                                    setShowModal(true);
                                    setSingleItem(item);
                                  }}
                                />
                              </span>
                            )}
                          {values?.requisition === "send" &&
                            !item?.isRequisitionDesk && (
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  IConfirmModal({
                                    message: `Are you sure to receive ?`,
                                    yesAlertFunc: () => {
                                      receiveHandler(
                                        `/tms/DocumentDispatch/RequisitionDeskApprovel?DispatchId=${item?.dispatchHeaderId}&UserId=${userId}`,
                                        null,
                                        () => {
                                          handleGetRowData(
                                            values?.requisition,
                                            pageNo,
                                            pageSize
                                          );
                                        }
                                      );
                                    },
                                    noAlertFunc: () => {},
                                  });
                                }}
                                className="ml-1"
                              >
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Receive</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      style={{ fontSize: "16px" }}
                                      class="fa fa-download"
                                      aria-hidden="true"
                                    ></i>
                                  </span>
                                </OverlayTrigger>
                              </span>
                            )}
                          {values?.requisition === "received" &&
                            item?.isReceive && !item?.isOwnerDeskSend && (
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => console.log("click icon")}
                              >
                                <IApproval
                                  title="Send To Owner"
                                  onClick={() => {
                                    setShowSendModal(true);
                                    setSingleItem(item);
                                  }}
                                />
                              </span>
                            )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </CommonTable>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setPositionHandler}
                    values={values}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                  />
                )}
              </div>
              {isShowModal && (
                <>
                  <IViewModal
                    show={isShowModal}
                    onHide={() => {
                      setShowModal(false);
                      setSingleItem({});
                    }}
                  >
                    <SendModal
                      singleItem={singleItem}
                      handleGetRowData={() =>
                        handleGetRowData(values?.requisition, pageNo, pageSize)
                      }
                      onHide={() => setShowModal(false)}
                    />
                  </IViewModal>
                </>
              )}
              {isShowReceiveModal && (
                <>
                  <IViewModal
                    show={isShowReceiveModal}
                    onHide={() => {
                      setShowReceiveModal(false);
                      setFieldValue("requisition", "received");
                      handleGetRowData("received", pageNo, pageSize);
                    }}
                  >
                    <ReceiveModal />
                  </IViewModal>
                </>
              )}
              {isShowSendModal && (
                <>
                  <IViewModal
                    show={isShowSendModal}
                    onHide={() => {
                      setShowSendModal(false);
                      setFieldValue("requisition", "received");
                      handleGetRowData("received", pageNo, pageSize);
                    }}
                  >
                    <OwnerSendModal
                      handleGetRowData={handleGetRowData}
                      propsObj={{ status: "received", pageNo, pageSize }}
                    />
                  </IViewModal>
                </>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
