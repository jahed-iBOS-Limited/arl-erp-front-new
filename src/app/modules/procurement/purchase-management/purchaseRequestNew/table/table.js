import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import IClose from "../../../../_helper/_helperIcons/_close";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IViewModal from "../../../../_helper/_viewModal";
import ILoader from "../../../../_helper/loader/_loader";
import { setPurchaseRequestPPRAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import {
  completePoHandlerAction,
  getPlantList,
  getPurchaseOrgList,
  getPurchaseRequestLanding,
  getSBUList,
  getWhList,
  postPurchaseReqCancelAction,
} from "../helper";
import { PurchaseRequestReportModal } from "../report/purchaseRequestReportModal";
import { ItemReqViewTableRow } from "../report/tableRow";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationSearch from "./../../../../_helper/_search";
import PaginationTable from "./../../../../_helper/_tablePagination";

const statusData = [
  { label: "Approved", value: true },
  { label: "Pending", value: false },
];

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const PurchaseRequestTable = () => {
  const [, setSbu] = useState("");
  const [, setPo] = useState("");
  const [, setPlant] = useState("");
  const [, setWh] = useState("");

  const purchaseRequestLanding = useSelector((state) => {
    return state.localStorage.purchaseRequestLanding;
  });

  const prTableIndex = useSelector((state) => {
    return state.localStorage.prtablePOIndex;
  });

  const dispatch = useDispatch();
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");

  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);


  // redux data
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  // get ddl
  useEffect(() => {
    getSBUList(profileData?.accountId, selectedBusinessUnit?.value, setSbuList);
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const getLandingPageDataFunc = (pageNo, pageSize, search) => {
    getPurchaseRequestLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      pageNo,
      pageSize,
      purchaseRequestLanding?.sbu?.value,
      purchaseRequestLanding?.po?.value,
      purchaseRequestLanding?.plant?.value,
      purchaseRequestLanding?.wh?.value,
      purchaseRequestLanding?.status?.value,
      purchaseRequestLanding?.fromDate,
      purchaseRequestLanding?.toDate
    );
  };
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getLandingPageDataFunc(pageNo, pageSize);
      getPurchaseOrgList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const history = useHistory();

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getLandingPageDataFunc(pageNo, pageSize);
  };

  const paginationSearchHandler = (value) => {
    getPurchaseRequestLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      pageNo,
      pageSize,
      purchaseRequestLanding?.sbu?.value,
      purchaseRequestLanding?.po?.value,
      purchaseRequestLanding?.plant?.value,
      purchaseRequestLanding?.wh?.value,
      purchaseRequestLanding?.status?.value,
      purchaseRequestLanding?.fromDate,
      purchaseRequestLanding?.toDate,
      value
    );
  };

  // Get Warehouse DDL
  useEffect(() => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      whList?.length === 0
    ) {
      getWhList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        purchaseRequestLanding?.plant?.value,
        setWhList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [purchaseRequestLanding?.plant]);

  const viewPurchaseOrderData = (values) => {
    getPurchaseRequestLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      pageNo,
      pageSize,
      values?.sbu?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.status?.value,
      values?.fromDate,
      values?.toDate
    );
  };

  // approveSubmitlHandler btn submit handler
  const approveSubmitlHandler = (Pred) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to Inactive this purchase request`,
      yesAlertFunc: () => {
        postPurchaseReqCancelAction(Pred).then(() =>
          getLandingPageDataFunc(pageNo, pageSize)
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const [isShowModal, setIsShowModal] = useState(false);
  const [isShowPurchaseRequestReportModal,setShowPurchaseRequestReportModal] = useState(false)
  const [currentRowData, setCurrentRowData] = useState("");
  const itemCompleteHandler = (reqId, userId, values) => {
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to Complete this PO`,
      yesAlertFunc: () => {
        completePoHandlerAction(reqId, userId).then(() =>
          viewPurchaseOrderData(values)
        );
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <ICustomCard title="Purchase Request">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={{
            ...purchaseRequestLanding,
          }}
        >
          {({ values, errors, touched, setFieldValue }) => (
            <>
              <div
                style={{ transform: "translateY(-40px)" }}
                className="text-right"
              >
                <button
                  type="submit"
                  className="btn btn-primary"
                  onClick={() => {
                    viewPurchaseOrderData(values);
                    dispatch(setPurchaseRequestPPRAction(values));
                  }}
                >
                  View
                </button>
                <button
                  onClick={() => {
                    history.push({
                      pathname:
                        "/mngProcurement/purchase-management/purchase-request/create",
                      state: values,
                    });
                    dispatch(setPurchaseRequestPPRAction(values));
                  }}
                  className="btn btn-primary ml-3"
                  disabled={
                    !values?.sbu || !values?.po || !values?.wh || !values?.plant
                  }
                >
                  Create
                </button>
              </div>
              <Form className="form form-label-left" style={{ marginTop: -35 }}>
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="col-lg-2">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        setSbu(v);
                        setFieldValue("sbu", v);
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="po"
                      options={poList || []}
                      value={values?.po}
                      label="Purchase Organization"
                      onChange={(v) => {
                        setPo(v);
                        setFieldValue("po", v);
                      }}
                      placeholder="Purchase Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
                        setPlant(v);
                        setWh("");
                        getWhList(
                          profileData?.userId,
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          v?.value,
                          setWhList
                        );
                        setFieldValue("plant", v);
                        setFieldValue("wh", "");
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="wh"
                      options={whList || []}
                      value={values?.wh}
                      label="Warehouse"
                      onChange={(v) => {
                        setWh(v);
                        setFieldValue("wh", v);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="status"
                      options={statusData || []}
                      value={values?.status}
                      label="Status"
                      onChange={(v) => {
                        setFieldValue("status", v);
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        style={{ width: "100%" }}
                      />
                    </div>
                  </div>
                </div>
              </Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
                  <PaginationSearch
                    placeholder="Request Code & Request Type Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm td">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Request Code</th>
                          <th>Purchase Request Type</th>
                          <th>Warehouse</th>
                          <th>Request Date</th>
                          <th>Purpose</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.sl}</td>
                              <td>{item?.purchaseRequestCode}</td>
                              <td>{item?.purchaseRequestTypeName}</td>
                              <td>{item?.warehouseName}</td>
                              <td>{_dateFormatter(item?.requestDate)}</td>
                              <td>{item?.purpose}</td>
                              <td className="text-center">
                                {item?.isApproved ? "Approved" : "Pending"}
                              </td>
                              <td className="text-center align-middle">
                                <div className="d-flex justify-content-around">
                                  <span
                                    onClick={() =>
                                      history.push({
                                        pathname: `/mngProcurement/purchase-management/purchase-request/edit/${item?.purchaseRequestId}`,
                                        item,
                                        state: {
                                          ...values,
                                        },
                                      })
                                    }
                                  >
                                    {!item?.isApproved && <IEdit />}
                                  </span>
                                  <span className="">
                                    {!item?.isApproved && (
                                      <IClose
                                        title="In Active"
                                        closer={() =>
                                          approveSubmitlHandler(
                                            item?.purchaseRequestId
                                          )
                                        }
                                      />
                                    )}
                                  </span>

                                  <span>
                                   
                                    {
                                      selectedBusinessUnit?.value === 102 && (values?.plant?.value >= 91 && values?.plant?.value <=100) ? 
                                      <IView
                                      classes={
                                        prTableIndex === item?.purchaseRequestId
                                          ? "text-primary"
                                          : ""
                                      }
                                      clickHandler={() => {
                                        setCurrentRowData(item);
                                        setShowPurchaseRequestReportModal(true);
                                      }}
                                    />
                                      : <IView
                                      classes={
                                        prTableIndex === item?.purchaseRequestId
                                          ? "text-primary"
                                          : ""
                                      }
                                      clickHandler={() => {
                                        setCurrentRowData(item);
                                        setIsShowModal(true);
                                      }}
                                    />
                                    }
                                    {" "}
                                  </span>
                                  {!item?.isClosed &&
                                    item?.isApproved &&
                                    (profileData?.userId === 509697 ||
                                      profileData?.userId === 520986) && (
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            Complete
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          <i
                                            className="fa fa-check-circle"
                                            onClick={() =>
                                              itemCompleteHandler(
                                                item?.purchaseRequestId,
                                                profileData?.userId,
                                                values
                                              )
                                            }
                                          ></i>
                                        </span>
                                      </OverlayTrigger>
                                    )}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      )}
                    </table>
                  </div>
                </div>
              </div>
              <IViewModal
                show={isShowModal}
                onHide={() => setIsShowModal(false)}
              >
                <ItemReqViewTableRow prId={currentRowData?.purchaseRequestId} />
              </IViewModal>
              {/* modal show for PurchaseRequestReport */}
              <IViewModal
                show={isShowPurchaseRequestReportModal}
                onHide={() => setShowPurchaseRequestReportModal(false)}
              >
                <PurchaseRequestReportModal currentRowData={currentRowData} />
              </IViewModal>
              {landing?.data?.length > 0 && (
                <PaginationTable
                  count={landing?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default PurchaseRequestTable;
