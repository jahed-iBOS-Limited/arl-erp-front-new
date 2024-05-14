/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import TextArea from "../../../../_helper/TextArea";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import PaginationTable from "../../../../_helper/_tablePagination";
import IViewModal from "../../../../_helper/_viewModal";
import {
  approveOrReject,
  getOverDueApprovalUserApi,
  getPartnerOverDueRequestList
} from "../helper";

const header = [
  "SL",
  "Customer Name",
  "Existing Credit Limit (Tk)",
  "Requested Credit Limit (Tk)",
  "Existing Credit Limit Days",
  "Requested Credit Limit Days",
  "From Date",
  "To Date",
  "Requested Qty",
  "Requested Amount",
  "Present Debit Amount",
  "Last Delivery Date",
  "Approve by Sales",
  "Approve by Accounts",
  "Approve by Credit Control",
  "Status",
  "Credit Control",
];

const initData = {
  reason: "",
  status: "",
};

const PartnerOverDueRequestTable = () => {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [rowData, setRowData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  // const [isPermitted, setIsPermitted] = useState(false);
  const [show, setShow] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [overDueApprovalUser, setOverDueApprovalUser] = useState("");

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // const tHeaders = () => {
  //   const heads = buId === 175 ? header
  // }

  const getData = (pageNo, pageSize) => {
    getPartnerOverDueRequestList(
      accId,
      buId,
      pageNo,
      pageSize,
      setLoading,
      setRowData,
      setGridData,
      setTotalCount
    );
  };

  useEffect(() => {
    if (buId && accId) {
      getData(pageNo, pageSize);
      // checkPermission(userId, buId, setIsPermitted, setLoading);
      getOverDueApprovalUserApi(
        accId,
        buId,
        userId,
        setOverDueApprovalUser,
        setLoading
      );
    }
  }, [accId, buId]);

  // set PositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getData(pageNo, pageSize);
  };

  const rowDataHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: item?.isRejected
          ? false
          : !(item?.isCreditControllApprove && item?.isSalesApprove)
          ? value
          : false,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.filter((item) => item?.isSelected)?.length ===
      rowData?.filter(
        (e) =>
          (!e?.isCreditControllApprove || !e?.isSalesApprove) && !e?.isRejected
      )?.length && rowData?.filter((i) => i?.isSelected)?.length > 0
      ? true
      : false;
  };

  const approveOfReject = (status, values, cb) => {
    const selectedItems = rowData?.filter(
      (e) =>
        e?.isSelected && (!e?.isCreditControllApprove || !e?.isSalesApprove)
    );
    if (selectedItems?.length === 0) {
      toast.warn("Please select at least one row");
      return;
    }
    if (selectedItems?.length > 0) {
      const payload = selectedItems.map((item) => {
        return {
          header: {
            intConfigId: item?.intId,
            approveType: item?.isSalesApprove ? 2 : 1,
            isApprovedBySales: item?.isSalesApprove
              ? item?.isSalesApprove
              : status,
            intApproveBySales: userId,
            creditLimitDaysApproveBySales: status
              ? item?.creditLimitDaysRequesting
              : 0,
            isApprovedByAccounts: item?.isSalesApprove
              ? item?.isSalesApprove
              : status,
            intApproveByAccounts: userId,
            creditLimitDaysApproveByAccounts: status
              ? item?.creditLimitDaysRequesting
              : 0,
            isApprovedByCreditController:
              status && item?.isSalesApprove ? true : false,
            intApproveByCreditController: userId,
            creditLimitDaysApproveByCreditControll:
              status && item?.isSalesApprove
                ? item?.creditLimitDaysRequesting
                : 0,
            dteLastActionDateTime: _dateFormatter(new Date()),
            intPartnerId: item?.intPartnerId,
            strComments: values?.reason,
            isRejected: !status ? true : false,
          },
        };
      });
      approveOrReject(payload, setLoading, () => {
        getData(pageNo, pageSize);
        cb && cb();
      });
    }
  };

  const filterRowData = (status) => {
    setRowData([]);
    switch (status) {
      case 0:
        setRowData(gridData);
        break;

      case 1:
        setRowData(gridData?.filter((item) => item?.isCreditControllApprove));
        break;

      case 2:
        setRowData(gridData?.filter((item) => item?.isSalesApprove));
        break;

      case 3:
        setRowData(
          gridData?.filter(
            (item) =>
              !(item?.isSalesApprove && item?.isCreditControllApprove) &&
              !item?.isRejected
          )
        );
        break;
      case 4:
        setRowData(gridData?.filter((item) => item?.isRejected));
        break;

      default:
        setRowData(gridData);
        break;
    }
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
              <CardHeader title='Partner Over Due Request'>
                <CardHeaderToolbar>
                  <div className='d-flex justify-content-end'>
                    {/* [299, 4, 219, 356, 357].includes(departmentId) && */}
                    {overDueApprovalUser && (
                      <>
                        <button
                          onClick={() => {
                            setShow(true);
                          }}
                          className='btn btn-danger mr-2'
                          disabled={
                            !rowData?.filter(
                              (e) =>
                                e?.isSelected &&
                                !(
                                  e?.isCreditControllApprove &&
                                  e?.isSalesApprove
                                )
                            )?.length
                          }
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => {
                            approveOfReject(true, values);
                          }}
                          className='btn btn-primary mr-2'
                          disabled={
                            !rowData?.filter(
                              (e) =>
                                e?.isSelected &&
                                !(
                                  e?.isCreditControllApprove &&
                                  e?.isSalesApprove
                                )
                            )?.length
                          }
                        >
                          Approve
                        </button>
                      </>
                    )}

                    <button
                      onClick={() => {
                        history.push(
                          "/config/partner-management/partneroverduerequest/create"
                        );
                      }}
                      className='btn btn-primary'
                    >
                      Create
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                <form className='form form-label-right'>
                  {loading && <Loading />}
                  <div className='global-form'>
                    <div className='row'>
                      <div className='col-md-3'>
                        <NewSelect
                          name='status'
                          options={[
                            { value: 0, label: "All" },
                            { value: 1, label: "Approved" },
                            { value: 2, label: "Approved by Sales" },
                            { value: 3, label: "Pending" },
                            { value: 4, label: "Rejected" },
                          ]}
                          value={values?.status}
                          label='Status'
                          onChange={(valueOption) => {
                            setFieldValue("status", valueOption);
                            filterRowData(valueOption?.value);
                          }}
                          placeholder='Select Status'
                        />
                      </div>
                    </div>
                  </div>
                 <div className="table-responsive">
                 <table
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    <thead>
                      <tr
                        onClick={() => allSelect(!selectedAll())}
                        className='cursor-pointer'
                      >
                        <th style={{ width: "40px" }}>
                          <input
                            type='checkbox'
                            value={selectedAll()}
                            checked={selectedAll()}
                            onChange={() => {}}
                          />
                        </th>
                        {header.map((th, index) => {
                          return <th key={index}>{th}</th>;
                        })}
                      </tr>
                    </thead>
                    {rowData?.map((item, index) => {
                      return (
                        <tr
                          className='cursor-pointer'
                          key={index}
                          onClick={() => {
                            if (
                              (!item?.isCreditControllApprove ||
                                !item?.isSalesApprove) &&
                              !item?.isRejected
                            ) {
                              rowDataHandler(
                                index,
                                "isSelected",
                                !item.isSelected
                              );
                            }
                          }}
                          style={
                            item?.isSelected
                              ? { backgroundColor: "#ECF0F3" }
                              : {}
                          }
                        >
                          <td className='text-center' style={{ width: "40px" }}>
                            {!(
                              (item?.isCreditControllApprove &&
                                item?.isSalesApprove) ||
                              item?.isRejected
                            ) && (
                              <input
                                type='checkbox'
                                value={item?.isSelected}
                                checked={item?.isSelected}
                                onChange={() => {}}
                              />
                            )}
                          </td>
                          <td style={{ width: "40px" }} className='text-center'>
                            {index + 1}
                          </td>
                          <td>{item?.partnerName}</td>
                          <td className='text-right' style={{ width: "60px" }}>
                            {!item?.isDayLimit
                              ? item?.creditLimitAmountExisting
                              : ""}
                          </td>
                          <td className='text-right' style={{ width: "60px" }}>
                            {!item?.isDayLimit
                              ? item?.creditLimitAmountRequesting
                              : ""}
                          </td>
                          <td className='text-right' style={{ width: "60px" }}>
                            {item?.isDayLimit
                              ? item?.creditLimitDaysExisting
                              : ""}
                          </td>
                          <td className='text-right' style={{ width: "60px" }}>
                            {item?.isDayLimit
                              ? item?.creditLimitDaysRequesting
                              : ""}
                          </td>
                          <td style={{ width: "60px" }}>
                            {item?.isDayLimit
                              ? _dateFormatter(item?.fromDate)
                              : ""}
                          </td>
                          <td style={{ width: "60px" }}>
                            {item?.isDayLimit
                              ? _dateFormatter(item?.toDate)
                              : ""}
                          </td>
                          <td style={{ width: "60px" }} className='text-right'>
                            {item?.requsetQnt}
                          </td>
                          <td style={{ width: "60px" }} className='text-right'>
                            {item?.requsetAmount}
                          </td>
                          <td style={{ width: "60px" }} className='text-right'>
                            {item?.presentDebitAmount}
                          </td>
                          <td style={{ width: "60px" }}>
                            {_dateFormatter(item?.lastDeliveyDate)}
                          </td>
                          <td
                            style={
                              item?.isSalesApprove
                                ? { backgroundColor: "#35e635", width: "60px" }
                                : !item?.isSalesApprove
                                ? { backgroundColor: "yellow", width: "60px" }
                                : { width: "60px" }
                            }
                          >
                            {item?.isSalesApprove ? "Yes" : "No"}
                          </td>
                          {/* {buId !== 175 && ( */}
                          <td
                            style={
                              item?.isAccountApprove
                                ? {
                                    backgroundColor: "#35e635",
                                    width: "60px",
                                  }
                                : !item?.isAccountApprove
                                ? { backgroundColor: "yellow", width: "60px" }
                                : { width: "60px" }
                            }
                          >
                            {item?.isAccountApprove ? "Yes" : "No"}
                          </td>
                          {/* )} */}
                          <td
                            style={
                              item?.isCreditControllApprove
                                ? { backgroundColor: "#35e635", width: "60px" }
                                : !item?.isCreditControllApprove
                                ? { backgroundColor: "yellow", width: "60px" }
                                : { width: "60px" }
                            }
                          >
                            {item?.isCreditControllApprove ? "Yes" : "No"}
                          </td>
                          <td className='font-weight-bold'>
                            {item?.isRejected
                              ? "Rejected"
                              : item?.isCreditControllApprove
                              ? "Approved"
                              : "Pending"}
                          </td>
                          <td>
                            {overDueApprovalUser ? (
                              <button
                                onClick={() => {
                                  history.push({
                                    pathname: `/config/partner-management/partner-basic-info/edit/${item?.intPartnerId}`,
                                    state: {
                                      businessPartnerCode:
                                        item?.partnerCode || "",
                                      businessPartnerName:
                                        item?.partnerName || "",
                                      checkBox: "SalesInformation",
                                      businessPartnerTypeName: "Customer",
                                    },
                                  });
                                }}
                                style={{ border: "none", background: "none" }}
                              >
                                <IEdit title='Credit Control' />
                              </button>
                            ) : null}
                          </td>
                        </tr>
                      );
                    })}
                  </table>
                 </div>

                  {/* Pagination Code */}
                  {rowData?.length > 0 && (
                    <PaginationTable
                      count={totalCount}
                      setPositionHandler={setPositionHandler}
                      paginationState={{
                        pageNo,
                        setPageNo,
                        pageSize,
                        setPageSize,
                      }}
                    />
                  )}
                </form>
              </CardBody>
            </Card>
            <IViewModal
              modelSize='md'
              show={show}
              onHide={() => setShow(false)}
            >
              {loading && <Loading />}
              <div className='form form-label-right'>
                <div className='d-flex justify-content-end'>
                  <button
                    type='button'
                    onClick={() => {
                      approveOfReject(false, values, () => {
                        setShow(false);
                      });
                    }}
                    className='btn btn-primary mt-1'
                    disabled={!values?.reason}
                  >
                    Done
                  </button>
                </div>

                <div className='row global-form '>
                  <div className='col-12'>
                    <label htmlFor=''>Rejection Reason</label>
                    <TextArea
                      value={values?.reason}
                      name='reason'
                      placeholder='Enter Rejection Reason'
                      type='text'
                      rows='4'
                    />
                  </div>
                </div>
              </div>
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerOverDueRequestTable;
