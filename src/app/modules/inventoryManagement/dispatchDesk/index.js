import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
// import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../_helper/_dateFormate";
import IForm from "../../_helper/_form";
import IApproval from "../../_helper/_helperIcons/_approval";
import Loading from "../../_helper/_loading";
import PaginationTable from "../../_helper/_tablePagination";
import IViewModal from "../../_helper/_viewModal";
import CommonTable from "../../_helper/commonTable";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
import ReceiveModal from "./receiveModal";
import SendModal from "./sendModal";
const initData = {
  requisition: "send",
};
export default function DispatchDeskLanding() {
  const saveHandler = (values, cb) => {};
  const [isShowModal, setShowModal] = useState(false);
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
  const [gridData, getGridData, loadGridData] = useAxiosGet();

  const handleGetRowData = (status, pageNo, pageSize, plantPayload) => {
    // const payload = plantPayload ? plantPayload : fromPlantDDL;
   if(status === "send"){
    getGridData(
      `/tms/DocumentDispatch/GetDispatchsSendPasignation?AccountId=${accId}&businessUnitId=${buId}&SenderId=${0}&ReceiverId=0&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`
    );
   }else{
    getGridData(
      `/tms/DocumentDispatch/GetDispatchsReceivePasignation?AccountId=${accId}&businessUnitId=${buId}&SenderId=0&ReceiverId=${0}&dispatchReceiverId=${employeeId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}
      `
    );
   }
  };
  const setPositionHandler = (pageNo, pageSize, values) => {
    handleGetRowData(values?.requisition, pageNo, pageSize);
  };

  useEffect(() => {
    getFromPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`,
      (data) => {
        const fromPlantPayload = data?.map((item) => item?.value);
        handleGetRowData("send", pageNo, pageSize, fromPlantPayload);
        setFromPlant(fromPlantPayload);
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, buId]);

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
          {loadGridData && <Loading />}
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
                        handleGetRowData("send", pageNo, pageSize);
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
                        handleGetRowData("received", pageNo, pageSize);
                      }}
                    />
                    Receive
                  </label>
                </div>
              </div>
              <div style={{ marginTop: "20px", gap: "5px" }}>
                <CommonTable
                  headersData={[
                    "Document No",
                    "Sender Name",
                    "Dispatch Type",
                    "Document Type",
                    {
                      title:
                        values?.requisition === "received"
                          ? "Received Date"
                          : "Requisition Date",
                    },
                    "From Location",
                    "To Location",
                    "Receiver Name",
                    "Status",
                    "Action",
                  ]}
                >
                  <tbody>
                    {gridData?.data?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.dispatchCode}</td>
                        <td className="text-center">{item?.senderName}</td>
                        <td className="text-center">
                          {item?.dispatchType}
                        </td>
                        <td className="text-center">
                          {item?.dispatchDescription}
                        </td>
                        <td className="text-center">
                          {values?.requisition === "received"
                            ? _dateFormatter(item.dispatchReceiveDate)
                            : _dateFormatter(
                                item.requisitionDate
                              )}
                        </td>
                        <td className="text-center">{item?.fromLocation}</td>
                        <td className="text-center">{item?.toLocation}</td>
                        <td className="text-center">{item?.receiverName}</td>
                        {values?.requisition === "send" ? (
                          <td className="text-center">
                            {item?.isSend &&
                            !item?.isReceive &&
                            !item?.isOwnerReceive ? (
                              <span style={{ color: "green" }}>Send</span>
                            ) : item?.isReceive && !item?.isOwnerReceive ? (
                              <span
                                style={{ color: "purple", fontWeight: "bold" }}
                              >
                                Received
                              </span>
                            ) : item?.isOwnerReceive ? (
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                Approved
                              </span>
                            ) : (
                              <span style={{ color: "red" }}>Not Send</span>
                            )}
                          </td>
                        ) : (
                          <td className="text-center">
                            {item?.isReceive && !item?.isOwnerReceive ? (
                              <span
                                style={{ color: "purple", fontWeight: "bold" }}
                              >
                                Received
                              </span>
                            ) : item?.isOwnerReceive ? (
                              <span
                                style={{ color: "green", fontWeight: "bold" }}
                              >
                                Approved
                              </span>
                            ) : null}
                          </td>
                        )}
                        <td className="text-center">
                          {values?.requisition === "send" && !item?.isSend && (
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
