import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../_helper/_dateFormate";
import IForm from "../../_helper/_form";
import IApproval from "../../_helper/_helperIcons/_approval";
import IEdit from "../../_helper/_helperIcons/_edit";
import Loading from "../../_helper/_loading";
import PaginationTable from "../../_helper/_tablePagination";
import CommonTable from "../../_helper/commonTable";
import useAxiosGet from "../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../_helper/customHooks/useAxiosPost";
const initData = {
  requisition: "send",
};
export default function DispatchRequisitionLanding() {
  const saveHandler = (values, cb) => {};
  const history = useHistory();
  const {
    profileData: { accountId: accId, employeeId,userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [gridData, getGridData, loadGridData] = useAxiosPost();
  const [, getDocReceivedApproval, loadDocReceivedApproval] = useAxiosPost();
  const [fromPlantDDL,getFromPlantDDL,,setFromPlant] = useAxiosGet()

  const headersData = [
    "Document No",
    "Dispatch Type",
    "Document Type",
    "Requisition Date",
    "Send Date",
    "Received Date",
    "From Location",
    "To Location",
    "Receiver Name",
    "Status",
    "Action",
  ];
  const handleGetRowData = (status, pageNo, pageSize, plantPayload) => {
    const payload = plantPayload ? plantPayload : fromPlantDDL;
   if(status === "send"){
    getGridData(
      `/tms/DocumentDispatch/GetRequsitionSendPasignation?AccountId=${accId}&SenderId=${employeeId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}`,
      payload
    );
   }else{
    getGridData(
      `/tms/DocumentDispatch/GetRequsitionReceivePasignation?AccountId=${accId}&ReceiverId=${employeeId}&viewOrder=asc&PageNo=${pageNo}&PageSize=${pageSize}
      `,
      payload
    );
   }
  };
 
  const setPositionHandler = (pageNo, pageSize, values) => {
   
    handleGetRowData(values?.requisition,pageNo,pageSize)
  };

  useEffect(() => {
    getFromPlantDDL(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${userId}&AccId=${accId}&BusinessUnitId=${buId}&OrgUnitTypeId=7`,
  (data)=>{
    const fromPlantPayload = data?.map(item=>item?.value)
    handleGetRowData("send",pageNo,pageSize,fromPlantPayload)
    setFromPlant(fromPlantPayload)
  }
  )
   

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId,buId]);
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
          {(loadGridData || loadDocReceivedApproval) && <Loading />}
          <IForm
            title="Dispatch Requisition"
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
                      history.push({
                        pathname: "/self-service/DispatchRequisition/create",
                        state: values,
                      });
                    }}
                  >
                    Create
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
                        handleGetRowData("send",pageNo,pageSize);
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
                        handleGetRowData("received",pageNo,pageSize);
                      }}
                    />
                    Receive
                  </label>
                </div>
              </div>
              <div style={{ marginTop: "20px", gap: "5px" }}>
                <CommonTable headersData={headersData}>
                  <tbody>
                    {gridData?.data?.map((item, index) => (
                      <tr>
                        <td className="text-center">{item?.dispatchCode}</td>
                        <td className="text-center">{item?.dispatchType}</td>
                        <td className="text-center">{item?.dispatchDescription}</td>
                        <td className="text-center">
                          {_dateFormatter(item.requisitionDate)}
                        </td>
                        <td className="text-center">
                          {_dateFormatter(item.dispatchSendDate)}
                        </td>
                        <td className="text-center">
                          {_dateFormatter(item.dispatchReceiveDate)}
                        </td>
                        <td className="text-center">{item?.fromLocation}</td>
                        <td className="text-center">{item?.toLocation}</td>
                        <td className="text-center">{item?.receiverName}</td>
                       {
                        values?.requisition === "send" ? (
                          <td className="text-center">
                          { item?.isSend &&
                          !item?.isReceive &&
                          !item?.isOwnerReceive ? (
                            <span style={{ color: "green" }}>Send</span>
                          ) : item?.isReceive && !item?.isOwnerReceive ? (
                            <span style={{ color: "purple",fontWeight:"bold" }}>Desk Received</span>
                          ) : item?.isOwnerReceive ? (
                            <span style={{ color: "green",fontWeight:"bold" }}>Owner Received</span>
                          ) : (
                            <span style={{ color: "red" }}>Not Send</span>
                          )}
                        </td>
                        ) : (
                          <td className="text-center">
                            {
                               item?.isReceive && !item?.isOwnerReceive ? (
                                <span style={{ color: "purple",fontWeight:"bold" }}>Desk Received</span>
                              ) : item?.isOwnerReceive ? (
                                <span style={{ color: "green",fontWeight:"bold"  }}>Owner Received</span>
                              ) : null
                            }
                          </td>
                        )
                       }
                        <td className="text-center">
                          {values?.requisition === "send" && !item?.isSend ? (
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() =>history.push(`/self-service/DispatchRequisition/edit/${item?.dispatchHeaderId}`)}
                            >
                              <IEdit />
                            </span>
                          ) : values?.requisition === "received" && item?.isReceive && !item?.isOwnerReceive ?(
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                getDocReceivedApproval(
                                  `/tms/DocumentDispatch/DocumentReceivedApprovel?DispatchId=${item?.dispatchHeaderId}&UserId=${employeeId}`,
                                  "",
                                  () => {
                                    handleGetRowData(values?.requisition,pageNo,pageSize)
                                  },
                                  true
                                );
                              }}
                            >
                              <IApproval title="Approve User Receive"/>
                            </span>
                          ):null}
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
