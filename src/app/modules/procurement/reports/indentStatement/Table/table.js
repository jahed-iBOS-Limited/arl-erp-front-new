/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import PaginationSearch from "./../../../../_helper/_search";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { setIndentStatementAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getSBUList,
  getPlantList,
  getPurchaseOrgList,
  getWhList,
  getPurchaseRequestLanding,
  getItemTypeListDDL_api,
  getItemCategoryDDLByTypeApi,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationTable from "./../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import IView from "../../../../_helper/_helperIcons/_view";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import { ItemReqViewTableRow } from "../../../purchase-management/purchaseRequestNew/report/tableRow";

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

let initData = {
  wh: "",
  plant: "",
  po: "",
  sbu: "",
  status: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  type: "",
  itemCategory: "",
  itemType: "",
};

const PurchaseRequestReportTable = () => {
  // const purchaseRequestLanding = useSelector((state) => {
  //   return state.localStorage.purchaseRequestLanding;
  // });
  const [itemTypeOption, setItemTypeOption] = useState([]);

  // //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(200);

  const dispatch = useDispatch();

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");
  const [itemCategoryDDLByType, setItemCategoryDDLByType] = useState([]);

  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  const indentStatement = useSelector((state) => {
    return state?.localStorage?.indentStatement;
  });

  const indentTable = useSelector((state) => {
    return state?.localStorage?.indentTableIndex;
  });

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

  useEffect(() => {
    if (indentStatement) {
      getPurchaseRequestLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setLoading,
        setLanding,
        indentStatement?.sbu?.value,
        indentStatement?.po?.value,
        indentStatement?.plant?.value,
        indentStatement?.wh?.value,
        // indentStatement?.status?.value,
        indentStatement?.fromDate,
        indentStatement?.toDate,
        pageNo,
        pageSize,
        indentStatement?.type?.value || 3,
        "",
        indentStatement?.itemCategory?.value || 0
        // 3 means All
      );
      if (indentStatement?.plant) {
        getWhList(
          profileData?.userId,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          indentStatement?.plant?.value,
          setWhList
        );
        getItemCategoryDDLByTypeApi(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          indentStatement?.itemType?.value || 0,
          setItemCategoryDDLByType
        );
      }
    }
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // getLandingPageDataFunc(pageNo, pageSize)
      getPurchaseOrgList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );

      getItemTypeListDDL_api(setItemTypeOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getPurchaseRequestLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      values?.type?.value,
      "",
      values?.itemCategory?.value || 0
    );
  };

  const paginationSearchHandler = (value, values) => {
    getPurchaseRequestLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      values?.type?.value,
      value,
      values?.itemCategory?.value || 0
    );
  };

  const viewPurchaseOrderData = (values) => {
    getPurchaseRequestLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      values?.type?.value,
      "",
      values?.itemCategory?.value || 0
    );
  };

  const [currentItem, setCurrentItem] = useState("");
  const [isShowModal, setIsShowModal] = useState(false);

  return (
    <ICustomCard title="PR Statement">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={indentStatement || initData}
          //validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {}}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form form-label-left">
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="col-lg-3">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        setFieldValue("sbu", v);
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="po"
                      options={poList || []}
                      value={values?.po}
                      label="Purchase Organization"
                      onChange={(v) => {
                        setFieldValue("po", v);
                      }}
                      placeholder="Purchase Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantList || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="wh"
                      options={whList || []}
                      value={values?.wh}
                      label="Warehouse"
                      onChange={(v) => {
                        setFieldValue("wh", v);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="status"
                      options={statusData || []}
                      value={values?.status}
                      label="Status"
                      onChange={(v) => {
                        setFieldValue('status', v)
                      }}
                      placeholder="Status"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  <div className="col-lg-3">
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
                  <div className="col-lg-3">
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Pending" },
                        { value: 2, label: "PO Issued" },
                        { value: 3, label: "All" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(v) => {
                        setFieldValue("type", v);
                      }}
                      placeholder="Type"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemType"
                      options={itemTypeOption || []}
                      value={values?.itemType}
                      label="Item Type"
                      onChange={(valueOption) => {
                        setFieldValue("itemType", valueOption);
                        setFieldValue("itemCategory", "");
                        getItemCategoryDDLByTypeApi(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setItemCategoryDDLByType
                        );
                      }}
                      placeholder="Item Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="itemCategory"
                      options={
                        [
                          {
                            value: 0,
                            label: "All",
                          },
                          ...itemCategoryDDLByType,
                        ] || []
                      }
                      value={values?.itemCategory}
                      label="Item Category"
                      onChange={(v) => {
                        setFieldValue("itemCategory", v);
                      }}
                      placeholder="Item Category"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3 mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !values?.wh ||
                        !values?.plant ||
                        !values?.po ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.type ||
                        !values?.toDate ||
                        !values?.itemCategory
                      }
                      onClick={() => {
                        viewPurchaseOrderData(values);
                        dispatch(setIndentStatementAction(values));
                      }}
                    >
                      View
                    </button>
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
                    <table className="table table-striped table-bordered global-table pr-statement-report">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>PR Code</th>
                          <th>PO Code</th>
                          <th>Request Type</th>
                          <th>PO Created By</th>
                          <th>PR Created By</th>
                          <th>Request Date</th>
                          <th>Item Code</th>
                          <th>Item Name</th>
                          <th>Uom</th>
                          <th>Request Quantity</th>
                          <th>PO Quantity</th>
                          <th>Pending Qty</th>
                          <th>Receive Qty</th>
                          <th>Status</th>
                          <th>Purpose</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.sl}</td>
                              <td>{item?.strPurchaseRequestCode}</td>
                              <td>{item?.strPurchaseOrderNo}</td>
                              <td>{item?.strPurchaseRequestTypeName}</td>
                              <td>{item?.poCreateBy}</td>
                              <td>{item?.prCreateBy}</td>
                              <td>{_dateFormatter(item?.dteRequestDate)}</td>
                              <td>{item?.strCode}</td>
                              <td>{item?.strItemName}</td>
                              <td>{item?.strUoMName}</td>
                              <td>{item?.requestQty}</td>
                              <td>{item?.poQuantity}</td>
                              <td>{item?.pendingQty}</td>
                              <td>{item?.receiveQty}</td>
                              <td className="text-center">
                                {item?.strStatus ? "Approved" : "Pending"}
                              </td>
                              <td className="text-center">
                                {item?.strRemarks}
                              </td>
                              <td className="text-center align-middle">
                                <span>
                                  {" "}
                                  <IView
                                    classes={
                                      indentTable === item?.sl
                                        ? "text-primary"
                                        : ""
                                    }
                                    clickHandler={() => {
                                      // history.push({
                                      //   pathname: `/mngProcurement/purchase-management/purchase-request/report/${item?.intPurchaseRequestId}`,
                                      //   item,
                                      // })
                                      // dispatch(setIndentTableIndexAction(item?.sl))
                                      setCurrentItem(item);
                                      setIsShowModal(true);
                                    }}
                                  />
                                </span>
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
                <ItemReqViewTableRow prId={currentItem?.intPurchaseRequestId} />
              </IViewModal>
              {landing?.length > 0 && (
                <PaginationTable
                  count={landing[0]?.totalRows}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                />
              )}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default PurchaseRequestReportTable;
