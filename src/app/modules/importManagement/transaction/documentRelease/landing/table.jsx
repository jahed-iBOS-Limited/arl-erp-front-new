/* eslint-disable react-hooks/exhaustive-deps */
import Axios from "axios";
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
} from "../../../../../../_metronic/_partials/controls";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IView from "../../../../_helper/_helperIcons/_view";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import PaymentOnMaturityForm from "../../paymentOnMaturity/form/addEditForm";
import PerformanceGuarantee from "../../performance-guarantee/form/addEditForm";
import { getLandingData } from "../helper";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";

const DocumentReleaseLanding = () => {
  const history = useHistory();
  const [gridData, setGridData] = useState([]);
  const [isloading, setIsLoading] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [
    isperformanceGiuaranteeShowModal,
    setPerformanceGiuaranteeIsShowModal,
  ] = useState(false);
  const [singleItem, setSingleItem] = useState({});
  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(75);
  const [isCheckState, setIsCheckState] = useState(true);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize,
      values?.poNo?.label
    );
  };

  const getGrid = (poNo, fromDate, toDate) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize,
      poNo || "",
      fromDate,
      toDate
    );
  };

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit.value,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize,
      0,
      "",
      ""
    );
  }, [profileData, selectedBusinessUnit]);

  //searchable drop down in po list;
  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/LetterOfCredit/GetPOorLCNumberList?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
    ).then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          poNo: "",
          fromDate: _firstDateofMonth(),
          toDate: _todayDate(),
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title="Beneficiary Payment"></CardHeader>
              <CardBody>
                {isloading && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3 col-md-3">
                    <label>PO No/ LC No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.poNo}
                      isSearchIcon={true}
                      paddingRight={10}
                      handleChange={(valueOption) => {
                        setFieldValue("poNo", valueOption);
                        getGrid(valueOption?.label, "", "");
                      }}
                      loadOptions={loadPartsList}
                    />
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
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      disabled={isCheckState === false}
                      onChange={(e) => {
                        if (e?.target?.value) {
                          setFieldValue("fromDate", e?.target?.value);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      disabled={isCheckState === false}
                      onChange={(e) => {
                        if (e?.target?.value) {
                          setFieldValue("toDate", e?.target?.value);
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
                          values?.poNo?.label,
                          values?.fromDate,
                          values?.toDate
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="react-bootstrap-table table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th>PO No</th>
                        <th>LC No</th>
                        <th>Shipment No</th>
                        <th>LC Type</th>
                        <th>Shipment Policy Status</th>
                        <th>DOC Release Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.length > 0 &&
                        gridData?.data?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "20px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td className="text-center">{item?.poNumber}</td>
                              <td className="text-center">{item?.lcNumber}</td>
                              <td className="text-center">
                                {item?.shipmentCode}
                              </td>
                              <td className="text-center">
                                {item?.lcTypeName}
                              </td>
                              <td className="text-center">
                                {item?.policyStatus}
                              </td>
                              <td className="text-center">
                                {item?.docReleaseStatus}
                              </td>
                              <td
                                className="text-center"
                                style={{ width: "15rem" }}
                              >
                                <div className="d-flex justify-content-center align-items-center">
                                  <span className="ml-3">
                                    {item?.docReleaseStatus !== "Pending" ? (
                                      <IView
                                        clickHandler={() => {
                                          history.push({
                                            pathname: `/managementImport/transaction/document-release/view`,
                                            state: item,
                                            routeState: "view",
                                          });
                                        }}
                                        classes="h5"
                                      />
                                    ) : (
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            View Disable
                                          </Tooltip>
                                        }
                                      >
                                        <span>
                                          <i
                                            style={{ cursor: "no-drop" }}
                                            className={`fa fa-eye h5`}
                                            aria-hidden="true"
                                          ></i>
                                        </span>
                                      </OverlayTrigger>
                                    )}
                                  </span>

                                  <span className="pl-3">
                                    {item?.docReleaseStatus !== "Done" ? (
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">
                                            Doc Release
                                          </Tooltip>
                                        }
                                      >
                                        <i
                                          class="fas pointer far fa-file"
                                          aria-hidden="true"
                                          style={{ width: "15px" }}
                                          onClick={() => {
                                            history.push({
                                              pathname: `/managementImport/transaction/document-release/create`,
                                              state: item,
                                              poId: values?.poNo?.poId,
                                              lcId: values?.poNo?.lcId,
                                              routeState: "create",
                                            });
                                          }}
                                        ></i>
                                      </OverlayTrigger>
                                    ) : (
                                      <i
                                        style={{ cursor: "no-drop" }}
                                        class="fas far fa-file"
                                        aria-hidden="true"
                                      ></i>
                                    )}
                                  </span>
                                  <span className="pl-3">
                                    {item?.payDate === null ? (
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">M-Pay</Tooltip>
                                        }
                                      >
                                        <i
                                          class="fas pointer far fa-money-bill-alt"
                                          aria-hidden="true"
                                          disabled={
                                            item?.docReleaseStatus === "Pending"
                                          }
                                          onClick={() => {
                                            setIsShowModal(true);
                                            setSingleItem(item);
                                          }}
                                        ></i>
                                      </OverlayTrigger>
                                    ) : null}
                                  </span>
                                  <span className="pl-3">
                                    {item?.pgStatus &&
                                    item?.docReleaseStatus !== "Pending" ? (
                                      <OverlayTrigger
                                        overlay={
                                          <Tooltip id="cs-icon">PG-Pay</Tooltip>
                                        }
                                      >
                                        <i
                                          class="fas pointer fas fa-share-square"
                                          aria-hidden="true"
                                          disabled={
                                            item?.docReleaseStatus === "Pending"
                                          }
                                          onClick={() => {
                                            setPerformanceGiuaranteeIsShowModal(
                                              true
                                            );
                                            setSingleItem(item);
                                          }}
                                        ></i>
                                      </OverlayTrigger>
                                    ) : (
                                      <i
                                        style={{ cursor: "no-drop" }}
                                        class="fas fas fa-share-square"
                                        aria-hidden="true"
                                        disabled={
                                          item?.docReleaseStatus === "Pending"
                                        }
                                      ></i>
                                    )}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>

                {/* modal  */}
                <IViewModal
                  show={isShowModal}
                  onHide={() => {
                    setIsShowModal(false);
                  }}
                >
                  <PaymentOnMaturityForm
                    documentReleaseValue={values}
                    singleItem={singleItem}
                  />
                </IViewModal>
                <IViewModal
                  show={isperformanceGiuaranteeShowModal}
                  onHide={() => setPerformanceGiuaranteeIsShowModal(false)}
                >
                  <PerformanceGuarantee
                    setIsShowModal={setPerformanceGiuaranteeIsShowModal}
                    documentReleaseValue={values}
                    singleItem={singleItem}
                    cb={() => {
                      getLandingData(
                        profileData?.accountId,
                        selectedBusinessUnit.value,
                        setGridData,
                        setIsLoading,
                        pageNo,
                        pageSize,
                        values?.poNo?.label
                      );
                    }}
                  />
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

export default DocumentReleaseLanding;
