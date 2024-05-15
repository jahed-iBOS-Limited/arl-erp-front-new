import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { customerListDDL } from "../../../../config/partner-management/partnerProductAllocation/helper";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import ICard from "../../../../_helper/_card";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";

const initData = {
  type: "",
  customer: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
};

export default function MoneyReceiptSubmitLandingTable() {
  const [, getGridData, loading] = useAxiosGet();
  const [customerList, setCustomerList] = useState([]);
  const [rowData, setRowData] = useState([]);
  // const [pageNo, setPageNo] = useState(0);
  // const [pageSize, setPageSize] = useState(50);
  const history = useHistory();

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  //setLandingData
  const setLandingData = (values, SearchTerm) => {
    const detailsURL = `/oms/SalesInformation/GetChequeSubmitPendingChallan?intPartid=2&intCustomerId=${values?.customer?.value}&intBusinessUnitId=${buId}`;
    const topSheetURL = `/wms/CustomerDeposit/GetCustomerDepositTopSheet?AccountId=${accId}&BusinessUnitId=${buId}&CustomerId=${values?.customer?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`;
    const url = values?.type?.value === 1 ? detailsURL : topSheetURL;
    // const search = SearchTerm ? `&SearchTerm=${SearchTerm}` : "";
    // const url = `/wms/CustomerDeposit/GetCustomerDepositPagination?AccountId=${accId}&BusinessUnitId=${buId}&CustomerId=${values?.customer?.value}&FromDate=${values?.fromDate}&ToDate=${values?.toDate}&PageNo=${pageNo}&PageSize=${pageSize}${search}`;
    getGridData(url, (resData) => {
      setRowData(resData);
    });
  };

  useEffect(() => {
    customerListDDL(accId, buId, setCustomerList);
  }, [accId, buId]);

  return (
    <>
      <Formik initialValues={initData} onSubmit={() => {}}>
        {({ values, setFieldValue }) => (
          <ICard
            title="Money Receipt Submit"
            // isCreteBtn={true}
            // createHandler={() => {
            //   history.push(
            //     `/vessel-management/allotment/tenderinformation/entry`
            //   );
            // }}
          >
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Details" },
                      { value: 2, label: "Top Sheet" },
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
                <div className="col-lg-3">
                  <NewSelect
                    name="customer"
                    options={customerList || []}
                    value={values?.customer}
                    label="Customer"
                    onChange={(valueOption) => {
                      setFieldValue("customer", valueOption);
                    }}
                    placeholder="Customer"
                  />
                </div>
                {values?.type?.value === 2 && (
                  <FromDateToDateForm obj={{ values, setFieldValue }} />
                )}
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setLandingData(values, "");
                    }}
                    disabled={!values?.customer}
                  >
                    View
                  </button>
                </div>
              </div>
              <>
                {loading && <Loading />}
                <div className="col-lg-12">
                  {values?.type?.value === 1 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>SL</th>
                            <th>Partner Name</th>
                            <th>Partner Code</th>
                            <th>Quantity</th>
                            <th>Delivery Invoice Amount</th>
                            <th>Salesforce Dues</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td> {index + 1}</td>
                                <td>{item?.strSoldToPartnerName}</td>
                                <td>{item?.strSoldToPartnerCode}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.numQuantity, true, 0)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.numDeliveryInvoiceAmount,
                                    true
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(
                                    item?.numDeliveryInvoiceAmount,
                                    true
                                  )}
                                </td>

                                <td>
                                  <div className="d-flex justify-content-around">
                                    <span className="text-center">
                                      <ICon
                                        title={"Payment Collection"}
                                        onClick={() => {
                                          history.push({
                                            pathname: `/financial-management/invoicemanagement-system/moneyreceiptsubmit/collection`,
                                            state: values,
                                          });
                                        }}
                                      >
                                        <i class="fas fa-money-bill-alt"></i>
                                      </ICon>
                                    </span>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                  {values?.type?.value === 2 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                        <thead>
                          <tr>
                            <th style={{ width: "40px" }}>SL</th>
                            <th>Deposit Date</th>
                            <th>Count</th>
                            <th>Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, index) => {
                            return (
                              <tr key={index}>
                                <td> {index + 1}</td>
                                <td>{_dateFormatter(item?.depositDate)}</td>
                                <td>{item?.count}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.amount, true)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
                {/* {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
                    setPositionHandler={setLandingData}
                    paginationState={{
                      pageNo,
                      setPageNo,
                      pageSize,
                      setPageSize,
                    }}
                    values={values}
                  />
                )} */}
              </>
            </Form>
          </ICard>
        )}
      </Formik>
    </>
  );
}
