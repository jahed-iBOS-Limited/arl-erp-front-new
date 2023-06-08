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
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import NewSelect from "../../../../_helper/_select";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { editORDeletePartnerChequeSubmit } from "../helper";
import IDelete from "../../../../_helper/_helperIcons/_delete";
// import IApproval from "../../../../_helper/_helperIcons/_approval";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { _todayDate } from "../../../../_helper/_todayDate";
import InputField from "../../../../_helper/_inputField";
import { getEmployeeList } from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/helper";

const dHeader = [
  "SL",
  "Customer Name",
  "Cheque No",
  "Cheque Bearer",
  "Cheque Date",
  "Submission Date",
  "Bank Name",
  "Branch Name",
  "Amount",
  "Advance (70%)",
  "Previous (30%)",
  "Remarks",
  "Status",
  "Actions",
];

const tsHeader = ["SL", "Submission Date", "Completed", "Pending", "Cancelled"];

const getHeader = (id) => (id === 1 ? dHeader : tsHeader);

const initData = {
  channel: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  employee: "",
};

const PartnerCheckSubmitTable = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [channelList, getChannelList] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(rowData);
  const [empList, setEmpList] = useState([]);

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo, pageSize) => {
    const detailsURL = `partner/PartnerOverDue/GetBusinessPartnerCheckLanding?AccountId=${accId}&BusniessUnitId=${buId}&BusinessPartnerId=${values
      ?.customer?.value ||
      0}&viewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}&FromDate=${
      values?.fromDate
    }&ToDate=${values?.toDate}`;

    const topSheetURL = `/partner/PartnerOverDue/GetBusinessPartnerCheckDateAndEmpWise?AccountId=${accId}&BusniessUnitId=${buId}&FromDate=${
      values?.fromDate
    }&ToDate=${values?.toDate}&employeeId=${
      values?.viewType?.value === 3 ? values?.employee?.value : 0
    }&ViewOrder=desc&PageNo=${pageNo}&PageSize=${pageSize}`;

    const url = values?.viewType?.value === 1 ? detailsURL : topSheetURL;
    getRowData(url);
  };

  useEffect(() => {
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    getEmployeeList(accId, buId, setEmpList, setLoading);
  }, [accId, buId]);

  useEffect(() => {
    setFilteredData(rowData);
  }, [rowData]);

  const handleFilter = (status) => {
    switch (status) {
      // All
      case 0:
        setFilteredData(rowData);
        break;
      // Pending
      case 1:
        setFilteredData({
          ...rowData,
          data: rowData?.data?.filter(
            (item) => item?.isActive && !item?.isPosted
          ),
        });
        break;
      // Completed
      case 2:
        setFilteredData({
          ...rowData,
          data: rowData?.data?.filter(
            (item) => item?.isActive && item?.isPosted
          ),
        });
        break;
      // Cancelled
      case 3:
        setFilteredData({
          ...rowData,
          data: rowData?.data?.filter((item) => !item?.isActive),
        });
        break;

      default:
        setFilteredData(rowData);
        break;
    }
  };

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize);
  };

  const deleteOrMrrCheque = (id, item, values, key) => {
    const payload = {
      create: [],
      edit:
        key === "mrr"
          ? [
              {
                configId: +id,
                mrramount: item?.mrramount,
                advanceAmount70P: item?.advanceAmount70P,
                previousAmount30P: item?.previousAmount30P,
                chequeDate: item?.chequeDate,
                actionBy: userId,
                bankId: item?.bankId,
                bankName: item?.bankName,
                branchId: item?.branchId,
                branchName: item?.branchName,
                comments: item?.comments,
                isEdit: true,
                isMrrdone: true,
              },
            ]
          : [],
      delete:
        key === "delete"
          ? [
              {
                configId: +id,
                isDelete: true,
              },
            ]
          : [],
    };
    let confirmObject = {
      title: "Are you sure?",
      message: `${
        key === "mrr"
          ? "Are you sure MRR for this cheque is done?"
          : "Are you sure you want to delete this cheque?"
      }`,
      yesAlertFunc: () => {
        editORDeletePartnerChequeSubmit(payload, setLoading, () => {
          getData(values, pageNo, pageSize);
        });
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  let totalMrrAmount = 0;
  let totalAdvanceAmount70P = 0;
  let totalPreviousAmount30P = 0;
  let totalCompleted = 0;
  let totalPending = 0;
  let totalCancelled = 0;

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
              <CardHeader title="Partner Cheque Submit">
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-end">
                    {rowData?.data?.length > 0 && (
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button-att-reports"
                        className="btn btn-primary"
                        table="table-to-xlsx"
                        filename="Partner Cheque Submit"
                        sheet="Sheet1"
                        buttonText="Export Excel"
                      />
                    )}
                    <button
                      onClick={() => {
                        history.push(
                          "/config/partner-management/partnerchecksubmit/create"
                        );
                      }}
                      className="btn btn-primary ml-2"
                      disabled={loading || isLoading}
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(loading || isLoading) && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-3">
                        <NewSelect
                          name="viewType"
                          options={[
                            { value: 1, label: "Details" },
                            { value: 2, label: "Top Sheet (Date base)" },
                            { value: 3, label: "Top Sheet (Employee base)" },
                          ]}
                          value={values?.viewType}
                          label="View Type"
                          onChange={(valueOption) => {
                            setFieldValue("viewType", valueOption);
                            setFilteredData([]);
                          }}
                          placeholder="Select View Type"
                        />
                      </div>
                      {values?.viewType?.value === 1 && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="channel"
                              options={[
                                { value: 0, label: "All" },
                                ...channelList,
                              ]}
                              value={values?.channel}
                              label="Distribution Channel"
                              onChange={(valueOption) => {
                                setFieldValue("channel", valueOption);
                              }}
                              placeholder="Distribution Channel"
                            />
                          </div>
                          <div className="col-lg-3">
                            <label>Customer</label>
                            <SearchAsyncSelect
                              selectedValue={values?.customer}
                              handleChange={(valueOption) => {
                                setFieldValue("customer", valueOption);
                              }}
                              isDisabled={!values?.channel}
                              placeholder="Search Customer"
                              loadOptions={(v) => {
                                const searchValue = v.trim();
                                if (searchValue?.length < 3) return [];
                                return axios
                                  .get(
                                    `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                                  )
                                  .then((res) => res?.data);
                              }}
                            />
                          </div>
                        </>
                      )}

                      {[3].includes(values?.viewType?.value) && (
                        <>
                          <div className="col-lg-3">
                            <NewSelect
                              name="employee"
                              options={empList || []}
                              value={values?.employee}
                              label="Employee (Cheque Bearer)"
                              onChange={(valueOption) => {
                                setFieldValue("employee", valueOption);
                              }}
                              placeholder="Employee (Cheque Bearer)"
                            />
                          </div>
                        </>
                      )}
                      {/* {[1, 2].includes(values?.viewType?.value) && ( */}
                      <>
                        <div className="col-lg-3">
                          <InputField
                            label="From Date"
                            value={values?.fromDate}
                            name="fromDate"
                            placeholder="From Date"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
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
                            }}
                          />
                        </div>
                      </>
                      {/* )} */}

                      <div className="col-lg-3">
                        <button
                          className="btn btn-primary btn-sm mt-5"
                          type="button"
                          onClick={() => {
                            getData(values, pageNo, pageSize);
                          }}
                          disabled={
                            loading ||
                            isLoading ||
                            !values?.viewType ||
                            (values?.viewType?.value === 3 && !values?.employee)
                          }
                        >
                          View
                        </button>
                      </div>
                      <div className="col-12"></div>
                      {rowData?.data?.length > 0 &&
                        values?.viewType?.value === 1 && (
                          <div className="col-lg-3">
                            <NewSelect
                              name="status"
                              options={[
                                { value: 0, label: "All" },
                                { value: 1, label: "Pending" },
                                { value: 2, label: "Completed" },
                                { value: 3, label: "Cancelled" },
                              ]}
                              value={values?.status}
                              label="Filter by Status"
                              onChange={(valueOption) => {
                                setFieldValue("status", valueOption);
                                handleFilter(valueOption?.value);
                              }}
                              placeholder="Select Status"
                            />
                          </div>
                        )}
                    </div>
                  </div>

                  {filteredData?.data?.length > 0 && (
                    <table
                      id="table-to-xlsx"
                      className={
                        "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                      }
                    >
                      <thead>
                        <tr className="cursor-pointer">
                          {getHeader(values?.viewType?.value)?.map(
                            (th, index) => {
                              return <th key={index}> {th} </th>;
                            }
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredData?.data?.map((item, index) => {
                          // total calculation
                          totalMrrAmount += item?.mrramount || 0;
                          totalAdvanceAmount70P += item?.advanceAmount70P || 0;
                          totalPreviousAmount30P +=
                            item?.previousAmount30P || 0;
                          totalCompleted += item?.complete || 0;
                          totalPending += item?.pending || 0;
                          totalCancelled += item?.cancel || 0;

                          return values?.viewType?.value === 1 ? (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.businessPartnerName}</td>
                              <td>{item?.chequeNo}</td>
                              <td>{item?.chequeBearerName}</td>
                              <td>{_dateFormatter(item?.chequeDate)}</td>
                              <td>{_dateFormatter(item?.submitDate)}</td>
                              <td>{item?.bankName}</td>
                              <td>{item?.branchName}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.mrramount, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.advanceAmount70P, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.previousAmount30P, true)}
                              </td>
                              <td>{item?.comments}</td>
                              <td
                                style={
                                  item?.isActive
                                    ? item?.isPosted
                                      ? { backgroundColor: "#35e635" }
                                      : { backgroundColor: "yellow" }
                                    : { backgroundColor: "red" }
                                }
                              >
                                {item?.isActive
                                  ? item?.isPosted
                                    ? "Completed"
                                    : "Pending"
                                  : "Cancelled"}
                              </td>
                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                {item?.isActive && !item?.isPosted && (
                                  <div className="d-flex justify-content-around">
                                    <span>
                                      <IEdit
                                        onClick={() => {
                                          history.push({
                                            pathname: `/config/partner-management/partnerchecksubmit/edit/${item?.configId}`,
                                            state: item,
                                          });
                                        }}
                                      />
                                    </span>
                                    <span
                                      onClick={() => {
                                        deleteOrMrrCheque(
                                          item?.configId,
                                          item,
                                          values,
                                          "delete"
                                        );
                                      }}
                                    >
                                      <IDelete />
                                    </span>
                                    {/* <span
                                    onClick={() => {
                                      deleteOrMrrCheque(
                                        item?.configId,
                                        item,
                                        values,
                                        "mrr"
                                      );
                                    }}
                                  >
                                    <IApproval title="MRR Done" />
                                  </span> */}
                                  </div>
                                )}
                              </td>
                            </tr>
                          ) : (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{_dateFormatter(item?.submitDate)}</td>
                              <td className="text-right">{item?.complete}</td>
                              <td className="text-right">{item?.pending}</td>
                              <td className="text-right">{item?.cancel}</td>
                            </tr>
                          );
                        })}
                        {values?.viewType?.value !== 1 && (
                          <tr
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            <td colSpan={2}>Total</td>
                            <td>{_fixedPoint(totalCompleted, true)}</td>
                            <td>{_fixedPoint(totalPending, true)}</td>
                            <td>{_fixedPoint(totalCancelled, true)}</td>
                          </tr>
                        )}
                        {values?.viewType?.value === 1 && (
                          <tr
                            style={{ textAlign: "right", fontWeight: "bold" }}
                          >
                            <td colSpan={8}>Total</td>
                            <td>{_fixedPoint(totalMrrAmount, true)}</td>
                            <td>{_fixedPoint(totalAdvanceAmount70P, true)}</td>
                            <td>{_fixedPoint(totalPreviousAmount30P, true)}</td>

                            <td colSpan={3}></td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  )}

                  {filteredData?.data?.length > 0 && (
                    <PaginationTable
                      count={filteredData?.totalCount}
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

export default PartnerCheckSubmitTable;
