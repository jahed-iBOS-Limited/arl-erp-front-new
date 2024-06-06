import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import PaginationSearch from "../../../_helper/_search";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import IViewModal from "../../../_helper/_viewModal";
import QcViewModal from "../firstWeight/qcViewModal";
import { PurchaseOrderViewTableRow } from "../../../procurement/purchase-management/purchaseOrder/report/tableRow";
import { InventoryTransactionReportViewTableRow } from "../../../inventoryManagement/warehouseManagement/invTransaction/report/tableRow";
// import AttachmentView from "./POview";

function RowMaterialAutoPR() {
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, lodar, setRowData] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);
  const [weightmentId, setWeightmentId] = useState(null);
  const [singleData, setSingleData] = useState(null);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [isShowModalTwo, setIsShowModalTwo] = useState(false);
  const [POorderType, setPOorderType] = useState(false);
  const [GRN, setGRN] = useState({});

  const [itemRequest, setItemRequest] = useState(true);
  const history = useHistory();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/mes/WeightBridge/GetAllQCListForPRLanding?PageNo=${pageNo}&PageSize=${pageSize}&BusinessUnitId=${
        selectedBusinessUnit?.value
      }&Status=${0}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const headerCheckBoxHandler = (name, value) => {
    const newData = rowData?.qcList?.map((item) => ({
      ...item,
      [name]: value,
    }));
    setRowData({ ...rowData, qcList: newData });
    const approval = newData?.some(
      (itm) => itm.isPRCompleted === true && !itm?.intPurchaseRequestId
    );
    if (approval) {
      setItemRequest(false);
    } else {
      setItemRequest(true);
    }
  };

  const singleCheckBoxHandler = (name, value, index) => {
    let data = [...rowData?.qcList];
    data[index][name] = value;
    setRowData({ ...rowData, qcList: data });

    const approval = data?.some(
      (itm) => itm.isPRCompleted === true && !itm?.intPurchaseRequestId
    );
    if (approval) {
      setItemRequest(false);
    } else {
      setItemRequest(true);
    }
  };

  const setPositionHandler = (pageNo, pageSize, values, searchValue = "") => {
    let fromDate = values?.fromDate ? `&FromDate=${values?.fromDate}` : "";
    let toDate = values?.toDate ? `&ToDate=${values?.toDate}` : "";
    getRowData(
      `/mes/WeightBridge/GetAllQCListForPRLanding?PageNo=${pageNo}&PageSize=${pageSize}&BusinessUnitId=${
        selectedBusinessUnit?.value
      }${fromDate}${toDate}&Status=${values?.status?.value ||
        0}&Search=${searchValue}`
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, values, searchValue);
  };
  const handleItemClick = (items, i, item, index) => {
    setGRN({
      intInventoryTransactionId: items?.intInventoryTransactionId?.[index],
      grnCode: items.strInventoryTransactionCode?.[index],
    });
    setIsShowModalTwo(!isShowModalTwo);
  };
  const renderCommaSeparatedItems = (items, i, product) => {
    return items.map((item, index) => (
      <span
        className="text-center text-primary text-decoration-underline"
        style={{ cursor: "pointer" }}
        key={index}
        onClick={() => handleItemClick(product, i, item, index)}
      >
        {item} {index < items?.length - 1 ? "," : ""}
      </span>
    ));
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          status: { value: 0, label: "All" },
          // fromDate: _todayDate(),
          // toDate: _todayDate()
        }}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Raw Materials Auto PO"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: ``,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {lodar && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <NewSelect
                        name="status"
                        options={[
                          { value: 0, label: "All" },
                          { value: 1, label: "PO Completed" },
                          { value: 2, label: "Pending" },
                        ]}
                        value={values?.status}
                        label="Status"
                        onChange={(valueOption) => {
                          setFieldValue("status", valueOption);
                        }}
                        isDisabled={false}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("fromDate", e.target.value);
                          //setDate(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("toDate", e.target.value);
                          //setDate(e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-1">
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={false}
                        onClick={() => {
                          let fromDate = values?.fromDate
                            ? `&FromDate=${values?.fromDate}`
                            : "";
                          let toDate = values?.toDate
                            ? `&ToDate=${values?.toDate}`
                            : "";
                          getRowData(
                            `/mes/WeightBridge/GetAllQCListForPRLanding?PageNo=${pageNo}&PageSize=${pageSize}&BusinessUnitId=${selectedBusinessUnit?.value}${fromDate}${toDate}&Status=${values?.status?.value}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                    {/* create PR comment order by kabir vai */}
                    {/* <div className="col-lg-2">
                      <button
                        style={{ marginTop: "18px" }}
                        className="btn btn-primary ml-2"
                        disabled={itemRequest}
                        onClick={() => {
                          history.push({
                            pathname: `/production-management/msil-gate-register/RMAutoPR/create`,
                            state: rowData,
                          });
                        }}
                      >
                        Create PR
                      </button>
                    </div> */}
                  </div>
                </div>
                <div className="po_custom_search">
                  <PaginationSearch
                    placeholder="Search here..."
                    paginationSearchHandler={paginationSearchHandler}
                  />
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            {/* tick mark remove order by kabir vai */}
                            {/* <th style={{ width: "23px" }}>
                              <input
                                type="checkbox"
                                id="parent"
                                onChange={(e) => {
                                  headerCheckBoxHandler(
                                    "isPRCompleted",
                                    e.target.checked
                                  );
                                }}
                              />
                            </th> */}
                            <th style={{ width: "30px" }}>SL</th>
                            <th>তারিখ</th>
                            <th>গাড়ীর নাম্বার</th>
                            <th>রেজি. নং</th>
                            <th>চালান নাম্বার</th>
                            <th>পণ্যের নাম</th>
                            <th>সাপ্লায়ার নাম</th>
                            <th>PO Code</th>
                            <th>GRN Code</th>
                            <th>1st Weight</th>
                            <th>2nd Weight</th>
                            <th>Net Weight</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.qcList?.length > 0 &&
                            rowData?.qcList?.map((item, index) => (
                              <tr key={index}>
                                {/* <td>
                                  <input
                                    id="isPRCompleted"
                                    type="checkbox"
                                    className=""
                                    value={item.isPRCompleted}
                                    checked={item.isPRCompleted}
                                    name={item.isPRCompleted}
                                    onChange={(e) => {
                                      singleCheckBoxHandler(
                                        "isPRCompleted",
                                        e.target.checked,
                                        index
                                      );
                                    }}
                                    disabled={item?.intPurchaseRequestId}
                                  />
                                </td> */}
                                <td>{index + 1}</td>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strTruckNumber}</td>
                                <td>{item?.strGateEntryCode}</td>
                                <td>{item?.strInvoiceNumber}</td>
                                <td className="text-center">
                                  {item?.strMaterialName}
                                </td>
                                <td className="text-left">
                                  {item?.strSupplierName}
                                </td>
                                <td
                                  className="text-center text-primary text-decoration-underline"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    setShowAttachmentModal(
                                      !showAttachmentModal
                                    );
                                    setPOorderType(item?.strPurchaseOrderNo);
                                    setSingleData(item);
                                  }}
                                >
                                  {item?.strPurchaseOrderNo}
                                </td>
                                <td className="text-center">
                                  {item?.strInventoryTransactionCode?.length > 0
                                    ? renderCommaSeparatedItems(
                                        item?.strInventoryTransactionCode,
                                        index,
                                        item
                                      )
                                    : ""}
                                </td>
                                <td className="text-center">
                                  {item?.strPurchaseOrderNo}
                                </td>
                                <td>{item?.numFirstWeight}</td>
                                <td>{item?.numLastWeight}</td>
                                <td>{item?.numNetWeight}</td>
                                <td className="text-center">
                                  <span
                                    onClick={() => {
                                      setWeightmentId(item?.intWeightmentId);
                                      setIsShowModal(true);
                                    }}
                                  >
                                    <IView styles={{ fontSize: "17px" }} />
                                  </span>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    {rowData?.qcList?.length > 0 && (
                      <PaginationTable
                        count={rowData?.totalCount}
                        setPositionHandler={setPositionHandler}
                        paginationState={{
                          pageNo,
                          setPageNo,
                          pageSize,
                          setPageSize,
                        }}
                        values={values}
                      />
                    )}
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
      <div>
        <IViewModal
          title="View Purchase Order"
          show={showAttachmentModal}
          onHide={() => setShowAttachmentModal(false)}
        >
          <PurchaseOrderViewTableRow
            poId={singleData?.intPurchaseOrderId}
            purchaseOrderTypeId={1}
            orId={1}
            isHiddenBackBtn={true}
            formValues={{}}
          />
        </IViewModal>
        <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
          <QcViewModal weightmentId={weightmentId} />
        </IViewModal>
        <IViewModal
          show={isShowModalTwo}
          onHide={() => setIsShowModalTwo(false)}
        >
          <InventoryTransactionReportViewTableRow
            Invid={GRN?.intInventoryTransactionId}
            grId={{}}
            currentRowData={{}}
          />
        </IViewModal>
      </div>
    </>
  );
}

export default RowMaterialAutoPR;
