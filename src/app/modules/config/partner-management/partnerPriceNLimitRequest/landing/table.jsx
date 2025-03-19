/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useHistory } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  Card,
  CardHeader,
  CardHeaderToolbar,
  CardBody,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import PaginationTable from "../../../../_helper/_tablePagination";
import { Formik } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import IView from "../../../../chartering/_chartinghelper/icons/_view";

const header = [
  "SL",
  "Customer Name",
  "Address",
  "Contact Person",
  "Contact Number",
  "Limit Days",
  "Limit Amount",
  "Payment Mode",
  "Status",
  "Actions",
];

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const PartnerPriceAndLimitRequestTable = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, getRowData, loading] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    getRowData(
      `/oms/BusinessPartnerLimitNPriceApproval/GetBusinessPartnerLimitNPriceApprovalRequest?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&AccountId=${accId}&BusinessUnitId=${buId}&PageNo=${pageNo}&PageSize=${pageSize}`
    );
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize);
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              <ModalProgressBar />
              <CardHeader title="Partner Price and Limit Request">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    <button
                      onClick={() => {
                        history.push(
                          "/config/partner-management/partnerpricenlimitrequest/create"
                        );
                      }}
                      className="btn btn-primary"
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <InputField
                          label="From Date"
                          value={values?.fromDate}
                          name="fromDate"
                          placeholder="From Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("fromDate", e?.target?.value);
                            getData(
                              { ...values, fromDate: e?.target?.value },
                              pageNo,
                              pageSize
                            );
                          }}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          label="To Date"
                          value={values?.toDate}
                          name="toDate"
                          placeholder="To Date"
                          type="date"
                          onChange={(e) => {
                            setFieldValue("toDate", e?.target?.value);
                            getData(
                              { ...values, toDate: e?.target?.value },
                              pageNo,
                              pageSize
                            );
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {rowData?.data?.length > 0 && (
                    <div className="table-responsive">
                      <table
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {header.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                      {rowData?.data?.map((item, index) => {
                        return (
                          <tr className="cursor-pointer" key={index}>
                            <td
                              style={{ width: "40px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.strPartnerName}</td>
                            <td>{item?.strAddress}</td>
                            <td>{item?.strContactPersion}</td>
                            <td>{item?.strPhone}</td>
                            <td>{item?.intLimitDays}</td>
                            <td>{item?.numCreditLimit}</td>
                            <td>{item?.strPaymentMode}</td>
                            <td>{item?.strStatus || "Pending"}</td>
                            <td
                              style={{ width: "80px" }}
                              className="text-center"
                            >
                              {
                                <div className="d-flex justify-content-around">
                                  <IView
                                    title={`${
                                      !item?.isRejected &&
                                      (!item?.isApproveByAccounts ||
                                        !item?.isApproveSupervisor)
                                        ? "View and Approve/Reject"
                                        : "View"
                                    }`}
                                    clickHandler={() => {
                                      history.push({
                                        pathname: `/config/partner-management/partnerpricenlimitrequest/view/${item?.intConfigId}`,
                                        state: item,
                                      });
                                    }}
                                  />
                                  {!item?.isRejected &&
                                    !item?.isApproveByAccounts &&
                                    !item?.isApproveSupervisor && (
                                      <span>
                                        <IEdit
                                          onClick={() => {
                                            history.push({
                                              pathname: `/config/partner-management/partnerpricenlimitrequest/edit/${item?.intConfigId}`,
                                              state: item,
                                            });
                                          }}
                                        />
                                      </span>
                                    )}
                                </div>
                              }
                            </td>
                          </tr>
                        );
                      })}
                    </table>
                    </div>
                  )}

                  {rowData?.data?.length > 0 && (
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
                </form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerPriceAndLimitRequestTable;
