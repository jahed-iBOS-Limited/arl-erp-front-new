/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import ICon from "../../../../../chartering/_chartinghelper/icons/_icon";
// import { getSalesInvoiceLanding } from "../../../../../financialManagement/invoiceManagementSystem/salesInvoice/helper";
import FromDateToDateForm from "../../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../../_helper/iButton";
import ICard from "../../../../../_helper/_card";
import { _dateFormatter } from "../../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
import IEdit from "../../../../../_helper/_helperIcons/_edit";
import Loading from "../../../../../_helper/_loading";
import PaginationSearch from "../../../../../_helper/_search";
import NewSelect from "../../../../../_helper/_select";
import PaginationTable from "../../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../../_helper/_todayDate";
// import NewSelect from "../../../../../_helper/_select";
// import { toast } from "react-toastify";
// import useAxiosGet from "../../../../../_helper/customHooks/useAxiosGet";
// import IConfirmModal from "../../../../../_helper/_confirmModal";
// import { _fixedPoint } from "../../../../../_helper/_fixedPoint";
// import IDelete from "../../../../../_helper/_helperIcons/_delete";
// import { deleteMMRChequeOfCement } from "../../helper";

// const dHeader = [
//   "SL",
//   "Partner Name",
//   "Delivery Code",
//   "Quantity",
//   "Challan Date",
//   "Invoice Date",
//   "Project Location",
//   "Reference",
// ];

// const tsHeader = [
//   "SL",
//   "Partner Name",
//   "Bill Amount",
//   "Submit Date",
//   "Cheque Date",
//   "Cheque No",
//   "Cheque Amount",
//   "Deducted AIT",
//   "Received AIT",
//   "AIT Challan No",
//   "AIT Date",
//   "Comments",
//   "Actions",
// ];

// const getHeader = (id) => (id === 1 ? dHeader : tsHeader);

const initData = {
  type: { value: 0, label: "All" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

const PartnerCheckSubmitTableForCement = () => {
  const history = useHistory();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(100);
  const [, getRowData, loading] = useAxiosGet();
  // const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);

  // get user profile data from store
  const {
    // profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // const getGridData = (values, pageNo = 0, pageSize = 20, search = "") => {
  //   getSalesInvoiceLanding(
  //     accId,
  //     buId,
  //     values?.fromDate,
  //     values?.toDate,
  //     pageNo,
  //     pageSize,
  //     search,
  //     setLoading,
  //     setRowData
  //   );
  // };

  const getData = (values, pageNo, pageSize, searchValue = "") => {
    const search = searchValue ? `&Search=${searchValue}` : "";
    const url = `/partner/PartnerOverDue/GetBusinessPartnerChequeForACCLanding?TypeId=${values?.type?.value}${search}&BusinessUnitId=${buId}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}`;

    getRowData(url, (resData) => {
      if (resData?.totalCount === 0) {
        toast.warn("Data not found!");
        setRowData([]);
      } else {
        setRowData(resData);
      }
    });
  };

  useEffect(() => {
    getData(initData, pageNo, pageSize, "");
  }, []);

  // set PositionHandler

  const setPositionHandler = (pageNo, pageSize, values) => {
    getData(values, pageNo, pageSize, "");
  };

  // const deleteHandler = (id, values) => {
  //   let confirmObject = {
  //     title: "Are you sure?",
  //     message: "Are you sure you want to delete this cheque?",
  //     yesAlertFunc: () => {
  //       deleteMMRChequeOfCement(id, setLoading, () => {
  //         getData(values, pageNo, pageSize, "");
  //       });
  //     },
  //     noAlertFunc: () => {},
  //   };
  //   IConfirmModal(confirmObject);
  // };

  let totalBillAmount = 0;
  let totalChequeAmount = 0;

  const paginationSearchHandler = (searchValue, values) => {
    getData(values, pageNo, pageSize, searchValue);
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
            <ICard
              // isCreteBtn={true}
              title="Partner Cheque Submit"
              // createHandler={() => {
              //   history.push(
              //     "/config/partner-management/partnerchecksubmit/create"
              //   );
              // }}
            >
              <>
                {loading && <Loading />}
                <form className="form form-label-right">
                  <div className="global-form">
                    <div className="row">
                      <div className="col-lg-2">
                        <NewSelect
                          name="type"
                          options={[
                            { value: 0, label: "All" },
                            { value: 1, label: "Pending" },
                            { value: 2, label: "Complete/Submitted" },
                          ]}
                          value={values?.type}
                          label="Type"
                          onChange={(valueOption) => {
                            setFieldValue("type", valueOption);
                            setRowData([]);
                          }}
                          placeholder="Type"
                        />
                      </div>
                      <FromDateToDateForm
                        obj={{ values, setFieldValue, colSize: "col-lg-2" }}
                      />
                      <IButton
                        colSize={"col-lg-6"}
                        onClick={() => {
                          getData(values, pageNo, pageSize, "");
                        }}
                        // disabled={!values?.type}
                      />
                    </div>
                  </div>

                  {/* <table
                    id="table-to-xlsx"
                    className={
                      "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                    }
                  >
                    {values?.type && (
                      <thead>
                        <tr className="cursor-pointer">
                          {getHeader(values?.type?.value)?.map((th, index) => {
                            return <th key={index}> {th} </th>;
                          })}
                        </tr>
                      </thead>
                    )}
                    {values?.type?.value === 1 ? (
                      <tbody>
                        {rowData?.pendingData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.partnerName}</td>
                              <td>{item?.deliveryCode}</td>
                              <td className="text-right">{item?.quantity}</td>
                              <td style={{ width: "80px" }}>
                                {_dateFormatter(item?.challanDate)}
                              </td>
                              <td style={{ width: "80px" }}>
                                {_dateFormatter(item?.invoiceDate)}
                              </td>
                              <td>{item?.projectLocation}</td>
                              <td>{item?.refference}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    ) : (
                      <tbody>
                        {rowData?.completeData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td
                                style={{ width: "40px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td>{item?.businessPartnerName}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.billAmount, true)}
                              </td>
                              <td>{_dateFormatter(item?.submitDate)}</td>
                              <td>{_dateFormatter(item?.chequeDate)}</td>
                              <td>{item?.chequeNo}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.mrramount, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.deductedAit, true)}
                              </td>
                              <td className="text-right">
                                {_fixedPoint(item?.receivedAit, true)}
                              </td>

                              <td>{item?.aitchallanNo}</td>
                              <td>{_dateFormatter(item?.aitdate)}</td>
                              <td>{item?.comments}</td>

                              <td
                                style={{ width: "80px" }}
                                className="text-center"
                              >
                                <div className="d-flex justify-content-around">
                                  <span
                                    onClick={() => {
                                      deleteHandler(item?.configId, values);
                                    }}
                                  >
                                    <IDelete />
                                  </span>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    )}
                  </table> */}

                  {/* {(rowData?.pendingData?.length > 0 ||
                    rowData?.completeData?.length > 0) && (
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
                  )} */}
                </form>
                <div className="col-lg-3 mt-3">
                  <PaginationSearch
                    placeholder="Customer Name"
                    paginationSearchHandler={paginationSearchHandler}
                    values={values}
                  />
                </div>
                {[175, 186, 4, 94, 8].includes(buId) ? (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                    <thead>
                      <tr>
                        <th style={{ width: "40px" }}>SL</th>
                        <th>Invoice No</th>
                        <th>Invoice Date</th>
                        <th>Challan Date</th>
                        <th>Partner Name</th>
                        <th>Reference No</th>
                        <th>Cheque No</th>
                        <th>Project Location</th>
                        <th>Quantity</th>
                        <th>Bill Amount</th>
                        <th>Cheque Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && <Loading />}
                      {rowData?.data?.map((tableData, index) => {
                        totalBillAmount += tableData?.totalAmount;
                        totalChequeAmount += tableData?.mrrAmount;
                        return (
                          <tr key={index}>
                            <td className="text-center"> {index + 1} </td>
                            <td>{tableData?.strInvoiceNumber}</td>
                            <td>{_dateFormatter(tableData?.invoiceDate)}</td>
                            <td>{_dateFormatter(tableData?.challanDate)}</td>
                            <td>{tableData?.partnerName}</td>
                            <td>{tableData?.refference}</td>
                            <td>{tableData?.chequeNumber}</td>
                            <td>{tableData?.projectLocation}</td>
                            <td className="text-right">
                              {tableData?.quantity}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(tableData?.totalAmount, true, 0)}
                            </td>
                            <td className="text-right">
                              {_fixedPoint(tableData?.mrrAmount, true, 0)}
                            </td>
                            <td className="text-center">
                              {!tableData?.chequeNumber ? (
                                <ICon
                                  title="Cheque Submit"
                                  onClick={() => {
                                    history.push({
                                      pathname: `/config/partner-management/partnerchecksubmit/create`,
                                      state: tableData,
                                    });
                                  }}
                                >
                                  <i class="fas fa-money-bill"></i>
                                </ICon>
                              ) : (
                                <>
                                  <IEdit
                                    onClick={() => {
                                      history.push({
                                        pathname: `/config/partner-management/partnerchecksubmit/edit/${tableData?.configId}`,
                                        state: tableData,
                                      });
                                    }}
                                  />
                                </>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                      {rowData?.data?.length > 0 && (
                        <tr>
                          <td colSpan={9} className="text-right">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalBillAmount, true, 0)}
                          </td>
                          <td className="text-right">
                            {_fixedPoint(totalChequeAmount, true, 0)}
                          </td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                  </div>
                ) : (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered global-table table-font-size-sm">
                    <thead>
                      <tr>
                        <th style={{ width: "20px" }}>SL</th>
                        <th style={{ width: "80px" }}>Inv No</th>
                        <th style={{ width: "80px" }}>Inv Date</th>
                        <th style={{ width: "100px" }}>DO No</th>
                        <th style={{ width: "100px" }}>Purchase Order No</th>
                        <th style={{ width: "80px" }}>Total Amount</th>
                        <th style={{ width: "80px" }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading && <Loading />}
                      {rowData?.data?.map((tableData, index) => (
                        <tr key={index}>
                          <td className="text-center"> {tableData?.sl} </td>
                          <td> {tableData?.invoiceCode} </td>
                          <td>{_dateFormatter(tableData?.invoiceDate)}</td>
                          <td> {tableData?.doNo} </td>
                          <td>{tableData?.purchaseOrderNo}</td>
                          <td className="text-right">
                            {" "}
                            {tableData?.totalAmount}{" "}
                          </td>
                          <td className="text-center">
                            {/* <span > */}
                            <div className="d-flex justify-content-around align-items-center">
                              <ICon
                                title="Cheque Submit"
                                onClick={() => {
                                  history.push(
                                    "/config/partner-management/partnerchecksubmit/create"
                                  );
                                }}
                              >
                                <i class="fal fa-money-bill-alt"></i>
                              </ICon>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
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
                    rowsPerPageOptions={[5, 10, 20, 50, 100, 200]}
                  />
                )}
              </>
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
};

export default PartnerCheckSubmitTableForCement;
