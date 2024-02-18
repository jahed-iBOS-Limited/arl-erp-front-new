/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import { getLandingData, GetBankDDL, getPoForLcOpen } from "../helper";
import Loading from "../../../../_helper/_loading";
import Axios from "axios";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
} from "../../../../../../_metronic/_partials/controls";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import PaginationTable from "../../../../_helper/_tablePagination";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik } from "formik";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IView from "../../../../_helper/_helperIcons/_view";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { _firstDateofMonth } from "./../../../../_helper/_firstDateOfCurrentMonth";
import IConfirmModal from "../../../../_helper/_confirmModal";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const header = [
  "PO No",
  "LC No",
  "LC Date",
  "Expire Date",
  "LC Amount (FC)",
  "Currency",
  "Action",
];

const TableRow = () => {
  const history = useHistory();
  const [gridData, setGridData] = useState();
  const [isloading, setIsLoading] = useState(false);
  const [bankDDL, setBankDDL] = useState([]);

  const [, saveApproveLcOpen, saveApproveLcOpenLoader] = useAxiosPost();

  //paginationState
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(75);
  let isShowBtnClicked = false;

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    GetBankDDL(setBankDDL, profileData?.accountId, selectedBusinessUnit?.value);
  }, []);

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.poNo?.label ?? 0,
      values?.bankDDL?.value ?? 0,
      isShowBtnClicked ? values?.fromDate : 0,
      isShowBtnClicked ? values?.toDate : 0,
      setGridData,
      setIsLoading,
      pageNo,
      pageSize
    );
  };

  useEffect(() => {
    getLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      null,
      null,
      "",
      "",
      setGridData,
      setIsLoading,
      pageNo,
      pageSize
    );
  }, []);

  const loadPartsList = (v) => {
    if (v?.length < 3) return [];
    return Axios.get(
      `/imp/ImportCommonDDL/GetDirectPOForLC?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&searchPO=${v}`
    ).then((res) => res?.data);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          poNo: "",
          bankDDL: "",
          fromDate: _dateFormatter(_firstDateofMonth()),
          toDate: _dateFormatter(new Date()),
        }}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              <CardHeader title="LC Open">
                <CardHeaderToolbar>
                  <button
                    onClick={() => {
                      getPoForLcOpen(
                        profileData?.accountId,
                        selectedBusinessUnit?.value,
                        values?.poNo?.poId
                      ).then((response) => {
                        if (response?.status === 200) {
                          history.push({
                            pathname:
                              "/managementImport/transaction/lc-open/create",
                            state: {
                              poNo: response?.data[0],
                              searchableLandingPoNo: values?.poNo,
                              routeState: "create",
                            },
                          });
                        }
                      });
                    }}
                    className="btn btn-primary"
                    disabled={!values?.poNo}
                  >
                    Create
                  </button>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(isloading || saveApproveLcOpenLoader) && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3 col-md-3">
                    <label>PO No/ LC No</label>
                    <SearchAsyncSelect
                      selectedValue={values?.poNo}
                      isSearchIcon={true}
                      paddingRight={10}
                      handleChange={(valueOption) => {
                        setFieldValue("poNo", valueOption);
                        getLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.label ?? null,
                          values?.bankDDL?.value ?? null,
                          "",
                          "",
                          setGridData,
                          setIsLoading,
                          pageNo,
                          pageSize
                        );
                      }}
                      loadOptions={loadPartsList}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      value={values?.bankDDL}
                      options={bankDDL || []}
                      name="bankDDL"
                      label="Bank Name"
                      placeholder="Bank name"
                      onChange={(valueOption) => {
                        setFieldValue("bankDDL", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LC Open Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>LC Expire Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-2 pt-5 mt-1">
                    <button
                      className="btn btn-primary"
                      type="button"
                      onClick={() => {
                        isShowBtnClicked = true;
                        getLandingData(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.poNo?.label ?? null,
                          values?.bankDDL?.value ?? null,
                          values?.fromDate ?? null,
                          values?.toDate ?? null,
                          setGridData,
                          setIsLoading,
                          pageNo,
                          pageSize
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <ICustomTable ths={header}>
                  {gridData?.data?.length > 0 &&
                    gridData?.data?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ width: "100px" }} className="text-left">
                            {item?.ponumber}
                          </td>
                          <td style={{ width: "100px" }}>{item?.lcnumber}</td>
                          <td
                            className="text-center"
                            style={{ width: "100px" }}
                          >
                            {_dateFormatter(item?.dteLcdate)}
                          </td>
                          <td
                            className="text-center"
                            style={{ width: "100px" }}
                          >
                            {_dateFormatter(item?.dteLcexpireDate)}
                          </td>
                          <td style={{ width: "120px" }} className="text-right">
                            {numberWithCommas(
                              (item?.numTotalPiamountFC).toFixed(2)
                            )}
                          </td>
                          <td style={{ width: "120px" }}>
                            {item?.currencyName}
                          </td>
                          <td
                            style={{ width: "150px" }}
                            className="text-center"
                          >
                            <div className="d-flex justify-content-center">
                              <span className="view">
                                <IView
                                  clickHandler={() => {
                                    history.push({
                                      pathname: `/managementImport/transaction/lc-open/view/${item?.lcid}`,
                                      state: item,
                                    });
                                  }}
                                />
                              </span>
                              <span
                                className="ml-5 edit"
                                onClick={() => {
                                  history.push({
                                    pathname: `/managementImport/transaction/lc-open/edit/${item?.lcid}`,
                                    state: item,
                                  });
                                }}
                              >
                                <IEdit />
                              </span>
                              <span style={{ minWidth: "50px" }}>
                                <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">LC Amendment</Tooltip>
                                  }
                                >
                                  <i
                                    class="fas pointer fa-retweet"
                                    aria-hidden="true"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/managementImport/transaction/lc-amendment`,
                                        state: item,
                                      });
                                    }}
                                  ></i>
                                </OverlayTrigger>
                              </span>
                              {!item?.isComplete ? (
                                <span>
                                  <OverlayTrigger
                                    overlay={
                                      <Tooltip id="cs-icon">Approve</Tooltip>
                                    }
                                  >
                                    <i
                                      class="fa fa-check-circle pointer"
                                      aria-hidden="true"
                                      onClick={() => {
                                        IConfirmModal({
                                          title: `LC Approve`,
                                          message: `Are you sure to approve LC: ${item?.lcnumber}?`,
                                          yesAlertFunc: () => {
                                            saveApproveLcOpen(
                                              `/imp/LetterOfCredit/LetterOfCreditComplete?LCId=${item?.lcid}&Lcnumber=${item?.lcnumber}`,
                                              null,
                                              () => {
                                                getLandingData(
                                                  profileData?.accountId,
                                                  selectedBusinessUnit?.value,
                                                  values?.poNo?.label ?? null,
                                                  values?.bankDDL?.value ??
                                                    null,
                                                  values?.fromDate ?? null,
                                                  values?.toDate ?? null,
                                                  setGridData,
                                                  setIsLoading,
                                                  pageNo,
                                                  pageSize
                                                );
                                              },
                                              true
                                            );
                                          },
                                          noAlertFunc: () => {},
                                        });
                                      }}
                                    ></i>
                                  </OverlayTrigger>
                                </span>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </ICustomTable>
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
