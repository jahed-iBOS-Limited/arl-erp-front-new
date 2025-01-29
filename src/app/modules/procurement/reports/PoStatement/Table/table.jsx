import React, { useEffect, useState } from "react";
import PaginationSearch from "./../../../../_helper/_search";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import { Formik, Form } from "formik";
import { useSelector } from "react-redux";
import {
  getSBUList,
  getPlantList,
  getPurchaseOrgList,
  getWhList,
  getPOStatementLanding,
  getOrderTypeList,
  getRefferenceTypeList,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationTable from "./../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import IView from "../../../../_helper/_helperIcons/_view";
import { useHistory } from "react-router";
import { _todayDate } from "../../../../_helper/_todayDate";
const statusData = [
  { label: "Approved", value: true },
  { label: "Pending", value: false },
];

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
  indentNo: "",
  ordrty: "",
  refType: "",
};

const POReportTable = () => {
  // //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");
  const [orderTypeList, setOrderTypeList] = useState([]);
  const [refTypeList, setRefTypeList] = useState([]);

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
      getOrderTypeList(setOrderTypeList);
    }
  }, [profileData, selectedBusinessUnit]);

  //getLandingPageDataFunc
  // const getLandingPageDataFunc = (pageNo, pageSize, search) => {

  //   getPurchaseRequestLanding(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setLoading,
  //     setLanding,
  //     purchaseRequestLanding?.sbu?.value,
  //     purchaseRequestLanding?.po?.value,
  //     purchaseRequestLanding?.plant?.value,
  //     purchaseRequestLanding?.wh?.value,
  //     purchaseRequestLanding?.status?.value,
  //     purchaseRequestLanding?.fromDate,
  //     purchaseRequestLanding?.toDate
  //   )
  // }
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      // getLandingPageDataFunc(pageNo, pageSize)
      getPurchaseOrgList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const history = useHistory();

  // //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getPOStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.ordrty?.value,
      values?.refType?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.status?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize
    );
  };

  const paginationSearchHandler = (value, values) => {
    getPOStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.ordrty?.value,
      values?.refType?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.status?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      value
    );
  };

  const viewPurchaseOrderData = (values) => {
    getPOStatementLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.ordrty?.value,
      values?.refType?.value,
      values?.po?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.status?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize
    );
  };

  return (
    <ICustomCard title="PO Statement">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={initData}
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
                  <div className="col-lg-2">
                    <NewSelect
                      name="ordrty"
                      options={orderTypeList || []}
                      value={values?.ordrty}
                      label="Order Type"
                      onChange={(v) => {
                        setFieldValue("ordrty", v);
                        setFieldValue("refType", "");
                        getRefferenceTypeList(v?.value, setRefTypeList);
                      }}
                      placeholder="Order Type"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
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
                  <div className="col-lg-2">
                    <NewSelect
                      name="refType"
                      options={refTypeList || []}
                      value={values?.refType}
                      label="Refference Type"
                      onChange={(v) => {
                        setFieldValue("refType", v);
                      }}
                      placeholder="Refference Type"
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
                  <div className="col-lg-2 mt-5">
                    <button
                      type="submit"
                      disabled={
                        !values?.wh ||
                        !values?.plant ||
                        !values.po ||
                        !values.sbu ||
                        !values.status ||
                        !values.fromDate ||
                        !values.toDate ||
                        !values.ordrty ||
                        !values.refType
                      }
                      className="btn btn-primary"
                      onClick={() => {
                        viewPurchaseOrderData(values);
                        // dispatch(setPurchaseRequestPPRAction(values))
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
                    placeholder="PO Code Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>PO Code</th>
                          <th>Supplier Name</th>
                          <th>Order Date</th>
                          <th>Delivery Address</th>
                          <th>Currency</th>
                          <th>Payment Terms</th>
                          <th>Validity</th>
                          <th>Approval Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.data?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.purchaseOrderNo}</td>
                              <td>{item?.supplierName}</td>
                              <td>{_dateFormatter(item?.purchaseOrderDate)}</td>
                              <td>{item?.deliveryAddress}</td>
                              <td>{item?.currencyName}</td>
                              <td>{item?.paymentTermsName}</td>
                              <td>{_dateFormatter(item?.validityDate)}</td>
                              <td className="text-center">
                                {item?.isApprove ? "Approved" : "Pending"}
                              </td>
                              <td className="text-center align-middle">
                                <span>
                                  <IView
                                    clickHandler={() =>
                                      history.push({
                                        pathname: `/mngProcurement/purchase-management/purchaseorder/report/${item?.purchaseOrderId}/${values?.ordrty?.value}`,
                                        item,
                                      })
                                    }
                                  />{" "}
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
              {landing?.data?.length > 0 && (
                <PaginationTable
                  count={landing?.totalCount}
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

export default POReportTable;
