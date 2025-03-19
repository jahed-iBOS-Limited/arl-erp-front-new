/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import axios from "axios";
// import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import {
  Card,
  CardHeader,
  ModalProgressBar,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import {
  cancelShipmentHeaderById,
  getShipmentLandingData,
} from "../collapsePanels/shipment/helper";
import { useHistory } from "react-router-dom";
import { Formik, Form } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
// import IWarningModal from "../../../../_helper/_warningModal";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IView from "../../../../_helper/_helperIcons/_view";
// import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";
import { toast } from "react-toastify";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";
import IEdit from "./../../../../_helper/_helperIcons/_edit";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import { useDispatch } from "react-redux";
import { managementImportTransactionShipmentAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
export default function TableRow() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(75);
  const [gridData, setGridData] = useState([]);
  const [isCheckState, setIsCheckState] = useState(true);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const { managementImportTransactionShipment: localStorageData } = useSelector(
    (state) => state.localStorage
  );

  const loadPoList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/imp/ImportCommonDDL/GetPONoDDL?searchTerm=${v}&accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
      )
      .then((res) => res?.data);
  };

  //1 weak ago date
  // const previousweek = () => {
  //   let today = new Date();
  //   let preweek = new Date(
  //     today.getFullYear(),
  //     today.getMonth(),
  //     today.getDate() - 10
  //   );
  //   return _dateFormatter(preweek);
  // };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getShipmentLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageSize,
      pageNo,
      setGridData,
      values?.poDDL?.label || 0,
      values?.fromDate || 0,
      values?.toDate || 0
    );
  };

  const getGrid = (poLabel, fromDate, toDate) => {
    getShipmentLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      pageSize,
      pageNo,
      setGridData,
      poLabel,
      fromDate,
      toDate
    );
  };

  useEffect(() => {
    if (localStorageData?.searchPo?.value) {
      getShipmentLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageSize,
        pageNo,
        setGridData,
        localStorageData?.searchPo?.label,
        "",
        ""
      );
    } else {
      getShipmentLandingData(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        pageSize,
        pageNo,
        setGridData,
        "",
        "",
        ""
      );
    }
  }, [profileData, selectedBusinessUnit, localStorageData]);

  const remover = (id) => {
    let confirmObject = {
      title: "Are you sure?",
      message: "If you delete this, it can not be undone",
      yesAlertFunc: async () => {
        const cb = () => {
          getShipmentLandingData(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            pageSize,
            pageNo,
            setGridData,
            "",
            "",
            ""
          );
        };
        cancelShipmentHeaderById(id, cb);
      },
      noAlertFunc: () => {
        "";
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          poDDL: localStorageData?.searchPo?.value
            ? localStorageData?.searchPo
            : "",
          isCheck: true,
          fromDate: _firstDateofMonth(),
          toDate: _todayDate(),
        }}
      >
        {({ setFieldValue, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title="Shipment And Packing">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      values?.poDDL?.isInsuranceAmendment === false
                        ? toast.warn(
                            "Please Create insurance amendment as you created lc amendment"
                          )
                        : history.push({
                            pathname: `/managementImport/transaction/shipment/create`,
                            state: {
                              checkbox: "shipmentInformation",
                              routeState: "create",
                              values: values,
                            },
                          });
                    }}
                    className="btn btn-primary"
                    disabled={!values?.poDDL}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>

              <CardBody>
                <Form className="form form-label-right">
                  <div className="row cash_journal global-form">
                    <div className="col-lg-3 col-md-3 d-flex align-items-end">
                      <div>
                        <label>PO No/ LC No</label>
                        <SearchAsyncSelect
                          selectedValue={values?.poDDL}
                          // isSearchIcon={true}
                          handleChange={(valueOption) => {
                            // setFieldValue("poNo", valueOption);
                            // if (valueOption) {
                            setFieldValue("poDDL", valueOption);
                            dispatch(
                              managementImportTransactionShipmentAction({
                                ...localStorageData,
                                searchPo: valueOption,
                              })
                            );
                            getGrid(valueOption?.label, "", "");
                            // }
                          }}
                          loadOptions={loadPoList || []}
                        />
                      </div>
                      {localStorageData?.searchPo?.value && (
                        <span
                          className="ml-2"
                          style={{ cursor: "pointer" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(
                              managementImportTransactionShipmentAction({
                                ...localStorageData,
                                searchPo: "",
                              })
                            );
                          }}
                        >
                          <i
                            class="fa fa-times-circle"
                            aria-hidden="true"
                            style={{ cursor: "pointer" }}
                            onClick={() => {
                              getShipmentLandingData(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                pageSize,
                                pageNo,
                                setGridData,
                                "",
                                "",
                                ""
                              );
                            }}
                          ></i>
                        </span>
                      )}
                    </div>
                    <div
                      className="col-lg-2 d-flex"
                      style={{ marginTop: "18px" }}
                    >
                      <input
                        style={{ width: "15px", height: "15px" }}
                        name="isCheck"
                        type="checkbox"
                        checked={isCheckState}
                        className="form-control ml-3 mr-3"
                        onChange={(e) => setIsCheckState(!isCheckState)}
                      />
                      <label>Shipment Wise Filter</label>
                    </div>
                    <div className="col-lg-2">
                      <label>Shipping Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        max={values?.toDate}
                        disabled={isCheckState === false}
                        onChange={(e) => {
                          // if (e?.target?.value) {
                          setFieldValue("fromDate", e?.target?.value);
                          // getGrid(
                          //   values?.poDDL?.label,
                          //   e?.target?.value,
                          //   values?.toDate
                          // );
                          // }
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>Received Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To Date"
                        type="date"
                        min={values?.fromDate}
                        disabled={isCheckState === false}
                        onChange={(e) => {
                          if (e?.target?.value) {
                            setFieldValue("toDate", e?.target?.value);
                            // getGrid(
                            //   values?.poDDL?.label,
                            //   values?.fromDate,
                            //   e?.target?.value
                            // );
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-2 pt-5 mt-1">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => {
                          getGrid(
                            values?.poDDL?.label,
                            values?.fromDate,
                            values?.toDate
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </div>
                </Form>
                <div className="react-bootstrap-table table-responsive">
                  <table className="global-table table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>PO No</th>
                        <th>LC No</th>
                        <th>Shipment No</th>
                        <th>Shipment Qty</th>
                        <th>Invoice No</th>
                        <th>Invoice Amount (FC)</th>
                        <th>Packing Number</th>
                        <th>Status</th>
                        <th style={{ width: 180 }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.ponumber}</td>
                          <td>{item?.lcnumber}</td>
                          <td className="text-center">{item?.shipmentCode}</td>
                          <td className="text-center">{item?.shippedQty}</td>
                          <td className="ml-2 text-center">
                            {item?.invoiceNumber}
                          </td>
                          <td className="ml-2 text-right">
                            {numberWithCommas(item?.invoiceAmount)}
                          </td>
                          <td className="text-center">{item?.packingIds}</td>
                          <td className="text-center">
                            {item?.isApprove ? "Approved" : "Pending"}
                          </td>
                          <td className="text-center justify-content-center">
                            <span className="view">
                              <IView
                                clickHandler={() => {
                                  history.push({
                                    pathname: `/managementImport/transaction/shipment/view/${item?.shipmentId}`,
                                    state: {
                                      ...item,
                                      checkbox: "shipmentInformation",
                                    },
                                  });
                                }}
                              />
                            </span>
                            <span
                              className="ml-5 edit"
                              onClick={() => {
                                history.push({
                                  pathname: `/managementImport/transaction/shipment/edit/${item?.shipmentId}`,
                                  state: {
                                    ...item,
                                    checkbox: "shipmentInformation",
                                  },
                                });
                              }}
                            >
                              <IEdit />
                            </span>
                            <span className="ml-5">
                              <OverlayTrigger
                                overlay={
                                  <Tooltip id="cs-icon">Packing</Tooltip>
                                }
                              >
                                <i
                                  class="fas fa-box-open"
                                  aria-hidden="true"
                                  style={{ cursor: "pointer" }}
                                  onClick={() => {
                                    history.push({
                                      pathname: `/managementImport/transaction/shipment/create`,
                                      state: {
                                        checkbox: "packingInformation",
                                        shipmentId: item?.shipmentId,
                                        item: item,
                                        values: values,
                                      },
                                    });
                                  }}
                                ></i>
                              </OverlayTrigger>
                            </span>
                            {!item?.status && (
                              <span className="ml-5">
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">Delete</Tooltip>
                                  }
                                >
                                  <i
                                    class="fa fa-trash deleteBtn text-danger"
                                    aria-hidden="true"
                                    style={{ cursor: "pointer" }}
                                    onClick={() => {
                                      remover(item?.shipmentId);
                                    }}
                                  ></i>
                                </OverlayTrigger>
                              </span>
                            )}

                            {/* <button
                            className="btn btn-outline-dark mr-1 pointer ml-3"
                            type="button"
                            style={{
                              padding: "1px 5px",
                              fontSize: "11px",
                              width: "60px",
                            }}
                            onClick={() => {
                              history.push({
                                pathname: `/managementImport/transaction/shipment/create`,
                                state: {
                                  checkbox: "packingInformation",
                                  shipmentId: item?.shipmentId,
                                  item: item,
                                  values: values,
                                },
                              });
                            }}
                          >
                            Packing
                          </button> */}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

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
}
