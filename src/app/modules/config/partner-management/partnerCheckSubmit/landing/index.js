/* eslint-disable react-hooks/exhaustive-deps */
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
} from "../../../../../../_metronic/_partials/controls";
import IConfirmModal from "../../../../_helper/_confirmModal";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { editORDeletePartnerChequeSubmit } from "../helper";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import { toast } from "react-toastify";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getEmployeeList } from "../../../../financialManagement/invoiceManagementSystem/salesInvoice/helper";
import PartnerCheckSubmitLandingForm from "./form";
import PartnerCheckSubmitTable from "./table";
import ExportPaymentPostingTable from "./tableTwo";

const initData = {
  channel: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  employee: "",
  salesType: { value: 1, label: "Local" },
  chequeStatus: "",
};

const PartnerCheckSubmitLanding = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [rowData, getRowData, isLoading] = useAxiosGet();
  const [channelList, getChannelList] = useAxiosGet();
  const [loading, setLoading] = useState(false);
  const [filteredData, setFilteredData] = useState(rowData);
  const [empList, setEmpList] = useState([]);
  const [employeeInfo, getEmployeeInfo] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values, pageNo = 0, pageSize = 100, searchTerm = "") => {
    const search = searchTerm ? `&searchTerm=${searchTerm}` : "";

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

    const foreignSalesURL = `/partner/PartnerOverDue/GetExportPartnerPaymentInfoPagination?accountId=${accId}&businessUnitId=${buId}&soldToPartnerId=${values?.customer?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&pageNo=${pageNo}&pageSize=${pageSize}${search}&status=${values?.chequeStatus?.label}`;

    const url =
      values?.salesType?.value === 2
        ? foreignSalesURL
        : values?.viewType?.value === 1
        ? detailsURL
        : topSheetURL;

    getRowData(url);
  };

  useEffect(() => {
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    getEmployeeList(accId, buId, setEmpList, setLoading);
    getEmployeeInfo(
      `/partner/PartnerOverDue/GetUserInfoForExportPartnerPaymentApproval?userId=${userId}`
    );
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

  const loader = loading || isLoading;

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
                        if (!values?.salesType) {
                          toast.warn("Please select a sales type!");
                        } else {
                          const path =
                            values?.salesType?.value === 2
                              ? "/config/partner-management/partnerchecksubmit/export-payment-posting"
                              : "/config/partner-management/partnerchecksubmit/create";

                          history.push(path);
                        }
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
                {loader && <Loading />}
                <PartnerCheckSubmitLandingForm
                  obj={{
                    buId,
                    accId,
                    loader,
                    pageNo,
                    values,
                    rowData,
                    empList,
                    getData,
                    pageSize,
                    channelList,
                    handleFilter,
                    setFieldValue,
                    setFilteredData,
                  }}
                />
                {values?.salesType?.value === 1 && (
                  <PartnerCheckSubmitTable
                    obj={{
                      values,
                      pageNo,
                      pageSize,
                      setPageNo,
                      setPageSize,
                      filteredData,
                      deleteOrMrrCheque,
                      setPositionHandler,
                    }}
                  />
                )}
                {values?.salesType?.value === 2 && (
                  <ExportPaymentPostingTable
                    obj={{
                      values,
                      pageNo,
                      getData,
                      rowData,
                      pageSize,
                      setPageNo,
                      setPageSize,
                      employeeInfo,
                      setPositionHandler,
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

export default PartnerCheckSubmitLanding;
