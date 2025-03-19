/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";

import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import // setIndentStatementAction,

//setIndentTableIndexAction
"../../../../_helper/reduxForLocalStorage/Actions";
import {
  // getProcureToPayReportXMLDownload,
  generateExcel,
  getPlantList,
  getProcureToPayExcelReport,
  getProcureToPayReport,
  getPurchaseOrgList,
  getWarehouseList,
} from "../helper";

import { _dateFormatter } from "./../../../../_helper/_dateFormate";
// import PaginationTable from "./../../../../_helper/_tablePagination";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
// import IViewModal from "../../../../_helper/_viewModal";
import { SetReportBillBySupplierAction } from "../../../../_helper/reduxForLocalStorage/Actions";
// import ReactToPrint from "react-to-print";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import { InventoryTransactionReportViewTableRow } from "../../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow";
import { PurchaseOrderViewTableRow } from "../../../purchase-management/purchaseOrder/report/tableRow";
import { ItemReqViewTableRow } from "../../../purchase-management/purchaseRequestNew/report/tableRow";
import "../style.css";
const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const parameterValues = (values, unitId) => {
  console.log("values", values);
  return [
    { name: "fDate", value: `${values?.fromDate}` },
    { name: "intUnit", value: `${unitId}` },
    { name: "tDate", value: `${values?.toDate}` },
    { name: "intPurchOrg", value: `${+values?.purchaseOrganization?.value}` },
    { name: "intPlantId", value: `${values?.plant?.value}` },
    { name: "intWarehouseId", value: `${values?.wareHouse?.value}` },
  ];
};

//  intPlantId , intWarehouseId

const ProcureToPayReportTable = () => {
  const { reportBillBySupplier } = useSelector((state) => state?.localStorage);

  let initData = {
    sbu: reportBillBySupplier?.sbu || "",
    issuer: reportBillBySupplier?.issuer || "",
    partner: reportBillBySupplier?.partner || "",
    po: reportBillBySupplier?.po || "",
    status: reportBillBySupplier?.status || "",
    fromDate: reportBillBySupplier?.fromDate || _todayDate(),
    toDate: reportBillBySupplier?.toDate || _todayDate(),
    purchaseOrganization: reportBillBySupplier?.purchaseOrganization || "",
    plant: reportBillBySupplier?.plant || "",
    wareHouse: reportBillBySupplier?.wareHouse || "",
  };

  // //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  // const [mdalShow, setModalShow] = useState(false);
  // const [gridItem] = useState("");

  const dispatch = useDispatch();

  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");
  const [wareHouseList, setWareHouseList] = useState("");
  const [isReportShow, setIsReportShow] = useState(false);

  // landing
  const [landing, setLanding] = useState([]);
  const [excelData, setExcelData] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);
  const [modalState, setModalState] = useState({
    isShow: false,
    data: null,
  });

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPurchaseOrgList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );
      getPlantList(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlantList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  //  const history = useHistory()

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getProcureToPayReport(
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.purchaseOrganization?.value,
      values?.plant?.value,
      values?.wareHouse?.value,
      values?.search,
      pageNo,
      pageSize,
      setLoading,
      setLanding
    );
  };

  const getProcureToPayReportlanding = (values) => {
    getProcureToPayReport(
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      values?.purchaseOrganization?.value,
      values?.plant?.value,
      values?.wareHouse?.value,
      values?.search,
      pageNo,
      pageSize,
      setLoading,
      setLanding,
      (data) => {
        getProcureToPayExcelReport(
          selectedBusinessUnit?.value,
          values?.fromDate,
          values?.toDate,
          values?.purchaseOrganization?.value,
          values?.plant?.value,
          values?.wareHouse?.value,
          values?.search,
          0,
          data[0]?.totalRows || 0,
          setLoading,
          setExcelData
        );
      }
    );
  };
  const printRef = useRef();
  return (
    <ICustomCard title="Procure To Pay">
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
              {loading && <Loading />}
              <Form className="form form-label-left">
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="purchaseOrganization"
                      options={poList || []}
                      value={values?.purchaseOrganization}
                      label="Purchase Organization"
                      onChange={(v) => {
                        setLanding([]);
                        setIsReportShow(false);
                        setFieldValue("purchaseOrganization", v);
                        dispatch(
                          SetReportBillBySupplierAction({
                            ...values,
                            purchaseOrganization: v,
                          })
                        );
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
                        setLanding([]);
                        setIsReportShow(false);
                        setFieldValue("plant", v);
                        setFieldValue("wareHouse", "");
                        setWareHouseList([]);
                        if (v?.value) {
                          getWarehouseList(
                            profileData?.userId,
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            v?.value,
                            setWareHouseList
                          );
                        }
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="wareHouse"
                      options={wareHouseList || []}
                      value={values?.wareHouse}
                      label="Warehouse"
                      onChange={(v) => {
                        setLanding([]);
                        setIsReportShow(false);
                        setFieldValue("wareHouse", v);
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
                          console.log("Values", values);
                          setLanding([]);
                          setIsReportShow(false);
                          dispatch(
                            SetReportBillBySupplierAction({
                              ...values,
                              fromDate: e?.target?.value,
                            })
                          );
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
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          console.log("Values", values);
                          setLanding([]);
                          setIsReportShow(false);
                          dispatch(
                            SetReportBillBySupplierAction({
                              ...values,
                              toDate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      name="search"
                      value={values?.search}
                      label="Search"
                      onChange={(e) => {
                        setLanding([]);
                        setIsReportShow(false);
                        dispatch(
                          SetReportBillBySupplierAction({
                            ...values,
                            search: e?.target?.value,
                          })
                        );
                        setFieldValue("search", e.target.value);
                      }}
                      placeholder="Search"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div
                    className="col-lg-6 text-right mt-5"
                    style={{
                      flexWrap: "wrap",
                      alignItems: "center",
                      width: " 100%",
                      gap: "5px",
                    }}
                  >
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.purchaseOrganization
                      }
                      onClick={() => {
                        getProcureToPayReportlanding(values);
                      }}
                    >
                      Show
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-3"
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.purchaseOrganization
                      }
                      onClick={() => {
                        if (landing?.length > 0) {
                          generateExcel(
                            [
                              {
                                text: "SL",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Warehouse",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "PR No",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "PR Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Approved Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Due Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "PO No",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Pay Term",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "PO Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "PO Value",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "MRR No",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "MRR Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Inv Value",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Payment Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Supplier",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "PO Prepare By",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Bill Code",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Bill No",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Bill Type",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Bill Amount",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Pay Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Pay Amount",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Billing Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Audit Date",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Total PO Adjustment",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                              {
                                text: "Total PO Advance",
                                fontSize: 9,
                                border: "all 000000 thin",
                                alignment: "center",
                                textFormat: "text",
                                bold: true,
                              },
                            ],
                            excelData,
                            setLoading
                          );
                        }
                      }}
                    >
                      Export Excel
                    </button>
                    {console.log("valuesvalues", values)}
                    <button
                      type="button"
                      disabled={
                        !values?.purchaseOrganization?.value ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.wareHouse ||
                        !values?.plant
                      }
                      onClick={() => setIsReportShow(true)}
                      className="btn btn-primary ml-3"
                    >
                      RDLC REPORT VIEW
                    </button>
                    {/* <ReactToPrint
                      trigger={() => (
                        <button
                          type="button"
                          className="btn btn-primary ml-3"
                          disabled={
                            !values?.fromDate ||
                            !values?.toDate ||
                            !values?.purchaseOrganization
                          }
                        >
                          <i class="fa fa-print pointer" aria-hidden="true"></i>
                          Print
                        </button>
                      )}
                      content={() => printRef.current}
                    /> */}
                  </div>
                </div>
              </Form>
              {!isReportShow ? (
                <>
                  {" "}
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="procureTopay scroll-table-auto">
                        <table
                          className="table table-striped table-bordered global-table table-font-size-sm"
                          componentRef={printRef}
                          ref={printRef}
                          id="pdf-section"
                        >
                          <thead className="position-relative">
                            <tr className="position-sticky" style={{ top: 0 }}>
                              <th>SL</th>
                              <th>Warehouse</th>
                              <th>PR No</th>
                              <th>PR Date</th>
                              <th>PR By</th>
                              <th>PR Qty</th>
                              <th>Approved Date</th>
                              <th>Due Date</th>
                              <th>PO No</th>
                              <th>Pay Term</th>
                              <th>PO Date</th>
                              <th>PO Qty</th>
                              <th>PO Value</th>
                              <th>MRR No</th>
                              <th>GRN Qty</th>
                              <th>GRN By</th>
                              <th>MRR Date</th>
                              <th>Inv Value</th>
                              <th>Payment Date</th>
                              <th>Expected Payment Date</th>
                              <th>Supplier</th>
                              <th>PO Prepare By</th>
                              <th>Bill Code</th>
                              <th>Bill No</th>
                              <th>Voucher</th>
                              <th>Bill Type</th>
                              <th>Bill Amount</th>
                              <th>Pay Date</th>
                              <th>Pay Amount</th>
                              <th>Billing Date</th>
                              <th>Audit Date</th>
                              <th>Total PO Adjustment</th>
                              <th>Total PO Advance</th>
                              {/* <th>PO Close</th> */}
                            </tr>
                          </thead>

                          <tbody>
                            {landing?.map((item, index) => (
                              <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{item?.strWarehouseName}</td>
                                <td>
                                  <span
                                    className="text-primary font-weight-bold cursor-pointer"
                                    style={{ textDecoration: "underline" }}
                                    onClick={() => {
                                      setModalState({
                                        isShow: true,
                                        view: 1,
                                        data: item,
                                      });
                                    }}
                                  >
                                    {item?.strPurchaseRequestCode}
                                  </span>
                                </td>
                                <td>{_dateFormatter(item?.dtePRDate)}</td>
                                <td>{item?.strPrBy}</td>
                                <td>{item?.prQTY}</td>
                                <td>
                                  {_dateFormatter(item?.dteApproveDatetime)}
                                </td>
                                <td>{_dateFormatter(item?.dteDueDate)}</td>
                                <td>
                                  <span
                                    className="text-primary font-weight-bold cursor-pointer"
                                    style={{ textDecoration: "underline" }}
                                    onClick={() => {
                                      setModalState({
                                        isShow: true,
                                        view: 2,
                                        data: item,
                                      });
                                    }}
                                  >
                                    {item?.strPurchaseOrderNo}
                                  </span>
                                </td>
                                <td>{item?.strPaymentTermsName}</td>
                                <td>
                                  {_dateFormatter(item?.dtePurchaseOrderDate)}
                                </td>
                                <td>{item?.poQTY}</td>
                                <td>{item?.numTotalPOAmount}</td>
                                <td>
                                  <span
                                    className="text-primary font-weight-bold cursor-pointer"
                                    style={{ textDecoration: "underline" }}
                                    onClick={() => {
                                      setModalState({
                                        isShow: true,
                                        view: 3,
                                        data: item,
                                      });
                                    }}
                                  >
                                    {item?.strInventoryTransactionCode}
                                  </span>
                                </td>
                                <td>{item?.grnQTY}</td>
                                <td>{item?.strReceiveBy}</td>
                                <td>{_dateFormatter(item?.dteMrrDate)}</td>
                                <td>{item?.numInvAmount}</td>
                                <td>
                                  {_dateFormatter(item?.dtePaymentRequestDate)}
                                </td>
                                <td>
                                  {_dateFormatter(item?.expectedPaymenDate)}
                                </td>
                                <td>{item?.strBusinessPartnerName}</td>
                                <td>{item?.poPreparedBy}</td>
                                <td>{item?.strBillRegisterCode}</td>
                                <td>{item?.strBillRef}</td>
                                <td>{item?.strJournalCode}</td>
                                <td>{item?.strbillType}</td>
                                <td>{item?.numBillAmount}</td>
                                <td>{_dateFormatter(item?.payDate)}</td>
                                <td>{item?.monReqestAmount}</td>
                                <td>{_dateFormatter(item?.dteBillRegisterDate)}</td>
                                <td>{_dateFormatter(item?.dteBillRegisterApprovedDate)}</td>
                                <td>{item?.monTotalAdjustment}</td>
                                <td>{item?.monTotalAdvance}</td>
                                {/* <td></td> */}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  {landing?.length > 0 && (
                    <PaginationTable
                      count={landing[0]?.totalRows}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                      values={values}
                      rowsPerPageOptions={[
                        5,
                        10,
                        20,
                        50,
                        100,
                        200,
                        300,
                        400,
                        500,
                      ]}
                    />
                  )}
                  <IViewModal
                    show={modalState?.isShow}
                    onHide={() =>
                      setModalState({
                        isShow: false,
                        data: null,
                      })
                    }
                  >
                    {modalState?.view === 1 && (
                      <ItemReqViewTableRow
                        prId={modalState?.data?.intPurchaseRequestId}
                      />
                    )}
                    {modalState?.view === 2 && (
                      <PurchaseOrderViewTableRow
                        poId={modalState?.data?.intPurchaseOrderId}
                        orId={modalState?.data?.intPurchaseOrderTypeId}
                        isHiddenBackBtn={true}
                      />
                    )}
                    {modalState?.view === 3 && (
                      <InventoryTransactionReportViewTableRow
                        Invid={modalState?.data?.intInventoryTransactionId}
                        grId={modalState?.data?.intTransactionGroupId}
                      />
                    )}
                  </IViewModal>
                </>
              ) : null}
              {isReportShow ? (
                <PowerBIReport
                  groupId={"e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a"}
                  reportId={"40362af0-7312-4e45-a4f1-e54d71c3c209"}
                  parameterValues={parameterValues(
                    values,
                    selectedBusinessUnit?.value
                  )}
                  parameterPanel={false}
                />
              ) : null}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default ProcureToPayReportTable;
