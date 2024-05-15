import React, { useEffect, useState, useRef } from "react";
//import PaginationSearch from './../../../../_helper/_search'
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
// import { useHistory } from 'react-router-dom'
import { Formik, Form } from "formik";
import { useDispatch, useSelector } from "react-redux";
import {
  getSBUList,
  getPlantList,
  getWhList,
  getPOPrGRNLanding,
} from "../helper";
import ILoader from "../../../../_helper/loader/_loader";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationTable from "./../../../../_helper/_tablePagination";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { _todayDate } from "../../../../_helper/_todayDate";
import ReactToPrint from "react-to-print";
import "../prpogrn.css";
import { SetReportPrPoGrnAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import { getTotalAmount } from "./utils";
// const statusData = [
//   { label: 'Approved', value: true },
//   { label: 'Pending', value: false },
// ]

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const POPRGRNTable = () => {
  const { reportPrPoGrn } = useSelector((state) => state?.localStorage);

  let initData = {
    wh: reportPrPoGrn?.wh || "",
    plant: reportPrPoGrn?.plant || "",
    sbu: reportPrPoGrn?.sbu || "",
    fromDate: reportPrPoGrn?.fromDate || _todayDate(),
    toDate: reportPrPoGrn?.toDate || _todayDate(),
    type: reportPrPoGrn?.type || "",
    typeCode: reportPrPoGrn?.typeCode || "",
  };

  const dispatch = useDispatch();
  // //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [whList, setWhList] = useState("");
  const printRef = useRef();
  const [total, setTotal] = useState(null)

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

  useEffect(() => {
    if (landing?.length) {
      setTotal(getTotalAmount({ landing }));
    }
  }, [landing]);


  // const history = useHistory()

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getPOPrGRNLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.type?.value,
      values?.typeCode,
      pageNo,
      pageSize
    );
  };

  // const paginationSearchHandler = (value, values) => {
  //   getPOPrGRNLanding(
  //     profileData?.accountId,
  //     selectedBusinessUnit?.value,
  //     setLoading,
  //     setLanding,
  //     values?.sbu?.value,
  //     values?.plant?.value,
  //     values?.wh?.value,
  //     values?.fromDate,
  //     values?.toDate,
  //     values?.type?.value,
  //     values?.typeCode,
  //     pageNo,
  //     pageSize,
  //     value
  //   )
  // }

  const viewRegisterData = (values) => {
    getPOPrGRNLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.sbu?.value,
      values?.plant?.value,
      values?.wh?.value,
      values?.fromDate,
      values?.toDate,
      values?.type?.value,
      values?.typeCode,
      pageNo,
      pageSize
    );
  };


  console.log("total",total)
  return (
    <ICustomCard
      title="PR PO GRN"
      renderProps={() => (
        <>
          <ReactToPrint
            pageStyle="@page { size: 8in 12in  !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
            trigger={() => (
              <button className="btn btn-primary mr-2">Print</button>
            )}
            content={() => printRef.current}
          />

          <ReactToPrint
            pageStyle="@page { size: 8in 12in  !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
            trigger={() => <button className="btn btn-primary">PDF</button>}
            content={() => printRef.current}
          />

          <ReactHTMLTableToExcel
            id="test-table-xls-button"
            className="download-table-xls-button btn btn-primary ml-2"
            table="table-to-xlsx"
            filename="tablexls"
            sheet="tablexls"
            buttonText="Excel"
          />
        </>
      )}
    >
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
                  <div className="col-lg-3">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        setFieldValue("sbu", v);
                        dispatch(SetReportPrPoGrnAction({ ...values, sbu: v }));
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
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
                        dispatch(
                          SetReportPrPoGrnAction({
                            ...values,
                            plant: v,
                            wh: "",
                          })
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
                        dispatch(SetReportPrPoGrnAction({ ...values, wh: v }));
                        setFieldValue("wh", v);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                      style={{ width: "100%" }}
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        onChange={(e) => { 
                          dispatch(SetReportPrPoGrnAction({ ...values, fromDate: e?.target?.value }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                      style={{ width: "100%" }}
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        onChange={(e) => { 
                          dispatch(SetReportPrPoGrnAction({ ...values, toDate: e?.target?.value }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Purchase Request" },
                        { value: 2, label: "Purchase Order" },
                        { value: 3, label: "Inventory Transaction" },
                        { value: 4, label: "Item" },
                      ]}
                      value={values?.type}
                      label="Type"
                      onChange={(v) => {
                        setFieldValue("type", v);
                        setFieldValue("typeCode", "");
                        dispatch(SetReportPrPoGrnAction({ ...values, type: v }));
                      }}
                      placeholder="Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>
                      {values?.type?.value === 1
                        ? "Purchase Request Code"
                        : values?.type?.value === 2
                        ? "Purchase Order Code"
                        : values?.type?.value === 3
                        ? "Transaction Code"
                        : "Item"}
                    </label>
                    <div className="d-flex">
                      <InputField
                      style={{ width: "100%" }}
                        value={values?.typeCode}
                        name="typeCode"
                        placeholder={
                          values?.type?.value === 1
                            ? "Purchase Request Code"
                            : values?.type?.value === 2
                            ? "Purchase Order Code"
                            : values?.type?.value === 3
                            ? "Transaction Code"
                            : "Item"
                        }
                        type="text"
                        onChange={(e) => { 
                          dispatch(SetReportPrPoGrnAction({ ...values, typeCode: e?.target?.value }));
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2 mt-5">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !values?.wh ||
                        !values?.plant ||
                        !values?.sbu ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.type
                        // ||
                        // !values?.typeCode
                      }
                      onClick={() => {
                        viewRegisterData(values);
                      }}
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              <div ref={printRef} className="mt-3">
                <div className="inventoryStatement_reports_title">
                  <div className="global-form d-flex justify-content-center align-items-center my-3">
                    <h2>PR PO GRN Report</h2>
                  </div>
                </div>
                <div className="row">
                  {/* {loading && <Loading />} */}

                  <div className="col-lg-12">
                    {/* <PaginationSearch
                    placeholder="PO PR GRN Search"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  /> */}
                    <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm" id="table-to-xlsx">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Item Name</th>
                          <th>Item Code</th>
                          <th>PR Code</th>
                          <th>PR Date</th>
                          <th>PR Quantity</th>
                          <th>PO Quantity</th>
                          <th>Receive Quantity</th>
                          <th>Remarks</th>
                        </tr>
                      </thead>
                      {loading ? (
                        <ILoader />
                      ) : (
                        <tbody>
                          {landing?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.sl}</td>
                              <td>{item?.itemName}</td>
                              <td>{item?.itemCode}</td>
                              <td>{item?.purchaseRequestCode}</td>
                              <td>{_dateFormatter(item?.requestDate)}</td>
                              <td>{item?.prQty}</td>
                              <td>{item?.poQty}</td>
                              <td>{item?.invQty}</td>
                              <td>{item?.remarks}</td>
                            </tr>
                          ))}
                          {landing?.length ? (
                            <tr>
                              <td colSpan="5" className="text-right font-weight-bold">Total</td>
                              <td className="text-center font-weight-bold">{total?.prTotal}</td>
                              <td className="text-center font-weight-bold">{total?.poTotal}</td>
                              <td className="text-center font-weight-bold">{total?.invTotal}</td>
                              <td></td>
                            </tr>
                          ):null}
                        </tbody>
                      )}
                    </table>
                    </div>
                  </div>
                </div>
              </div>
              {landing?.length > 0 && (
                <PaginationTable
                  count={landing[0]?.totalRows}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
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

export default POPRGRNTable;
