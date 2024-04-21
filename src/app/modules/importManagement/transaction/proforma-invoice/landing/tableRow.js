/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomTable from "../../../../_helper/_customTable";
import { _formatMoney } from "../../../../_helper/_formatMoney";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import PurchaseOrder from "../../purchase-order/form/addEditForm";
import { getLandingData } from "../helper";
// import IWarningModal from "../../../../_helper/_warningModal";
import { getSingleDataForPoView } from "../../purchase-order/helper";
import ExportDocumentaryCredit from "./exportDC";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import LCApplicationExport from "./lcApplication";

const header = [
  "SL",
  "PR No",
  "PI No",
  "PO No",
  "Beneficiary Name",
  "Total PI Amount",
  "Currrency",
  "Action",
];

const TableRow = () => {
  const history = useHistory();
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [open, setOpen] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(75);

  const [proformaInvoice, setProformaInvoice] = useState({});
  const [viewStateOfModal, setViewStateOfModal] = useState("create");
  //for PO view;

  const [rowDto, setRowDto] = useState([]);
  const [singleDataForPoView, setSingleDataForPoView] = useState({});

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      "",
      setGridData,
      setIsLoading,
      pageNo,
      pageSize
    );
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.piNo?.label ?? 0,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize
    );
  };

  // useEffect(() => {
  //   getGrid();
  // }, []);

  const getGrid = () => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      null,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize
    );
  };

  //searchable drop down in po list;
  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/ImportCommonDDL/GetPINumberDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchItem=${v}`
    ).then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ PiNo: "" }}
        onSubmit={() => {}}
      >
        {({ setFieldValue, values }) => (
          <>
            <Card>
              <CardHeader title="Proforma Invoice">
                <CardHeaderToolbar>
                  <button
                    onClick={() =>
                      history.push(
                        "/managementImport/transaction/proforma-invoice/add"
                      )
                    }
                    className="btn btn-primary"
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {isloading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3 col-md-3">
                    <label>PI No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.PiNo}
                      isSearchIcon={true}
                      name="PiNo"
                      handleChange={(valueOption) => {
                        setFieldValue("PiNo", valueOption);
                        getLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.label,
                          setGridData,
                          setIsLoading,
                          pageNo,
                          pageSize
                        );
                      }}
                      loadOptions={loadPartsList || []}
                    />
                  </div>
                </div>
                <ICustomTable ths={header}>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td
                            style={{ width: "110px" }}
                            className="text-center"
                          >
                            {item?.purchaseRequestrNo
                              ? item?.purchaseRequestrNo
                              : item?.purchaseContractNo}
                          </td>
                          <td
                            style={{ width: "110px" }}
                            className="text-center"
                          >
                            {item?.pinumber}
                          </td>
                          <td
                            style={{ width: "150px" }}
                            className="text-center"
                          >
                            {item?.purchaseOrderNo}
                          </td>
                          <td>{item?.supplierName}</td>
                          <td className="text-right" style={{ width: "140px" }}>
                            {_formatMoney(item?.pivalue)}
                          </td>
                          <td
                            className="text-center"
                            style={{ width: "100px" }}
                          >
                            {item?.currencyName}
                          </td>

                          <td
                            style={{ width: "150px" }}
                            className="text-center"
                          >
                            <div className="d-flex justify-content-center">
                              <span className="view ml-3">
                                <IView
                                  clickHandler={() => {
                                    history.push({
                                      pathname: `/managementImport/transaction/proforma-invoice/view/${item?.proformaInvoiceId}`,
                                      state: item,
                                    });
                                  }}
                                />
                              </span>
                              {item.poStatus ? (
                                <span
                                  className="ml-3 edit"
                                  // onClick={() => Warning()}
                                  disabled
                                  style={{ opacity: 0.5 }}
                                >
                                  <IEdit title={"Can't edit"} />
                                </span>
                              ) : (
                                <span
                                  className="ml-3 edit"
                                  onClick={() => {
                                    history.push({
                                      pathname: `/managementImport/transaction/proforma-invoice/edit/${item?.proformaInvoiceId}`,
                                      state: item,
                                    });
                                  }}
                                >
                                  <IEdit />
                                </span>
                              )}
                              <span className="ml-3">
                                <ICon
                                  title={"Download LC Application Form"}
                                  onClick={() => {
                                    setShow(true);
                                  }}
                                >
                                  <i class="fas fa-download"></i>
                                </ICon>
                              </span>
                              <span className="ml-3">
                                <ICon
                                  title={"LC Application"}
                                  onClick={() => {
                                    setOpen(true);
                                  }}
                                >
                                  <i class="fas fa-file-download"></i>
                                </ICon>
                              </span>
                              <span className="ml-3">
                                <button
                                  className="btn btn-outline-dark mr-1 pointer"
                                  type="button"
                                  style={{
                                    padding: "1px 5px",
                                    fontSize: "11px",
                                    width: "100px",
                                  }}
                                  onClick={() => {
                                    setIsShowModal(true);

                                    if (item?.poStatus) {
                                      getSingleDataForPoView(
                                        profileData?.accountId,
                                        selectedBusinessUnit?.value,
                                        item?.purchaseOrderId,
                                        setSingleDataForPoView,
                                        setRowDto
                                      );
                                      setViewStateOfModal({
                                        view: "view",
                                        purchaseOrderId: item?.purchaseOrderId,
                                      });
                                    } else {
                                      setViewStateOfModal("create");
                                      setRowDto([]);
                                    }
                                    setProformaInvoice({ ...values, ...item });
                                  }}
                                >
                                  {item.poStatus ? "View PO" : "Create PO"}
                                </button>
                              </span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </ICustomTable>

                {/* modal  */}
                <IViewModal
                  show={isShowModal}
                  onHide={() => setIsShowModal(false)}
                >
                  <PurchaseOrder
                    proformaInvoiceValue={proformaInvoice}
                    viewStateOfModal={viewStateOfModal}
                    getGrid={getGrid}
                    singleDataForPoView={singleDataForPoView}
                    rowDto={rowDto}
                    setRowDto={setRowDto}
                    setIsShowModal={setIsShowModal}
                  />
                </IViewModal>

                {/* LC Application Form */}
                <IViewModal
                  modelSize={"md"}
                  show={show}
                  onHide={() => setShow(false)}
                >
                  <ExportDocumentaryCredit setShow={setShow} />
                </IViewModal>

                {/* LC Application */}
                <IViewModal show={open} onHide={() => setOpen(false)}>
                  <LCApplicationExport setOpen={setOpen} />
                </IViewModal>

                {/* Pagination Code */}
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
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default TableRow;
