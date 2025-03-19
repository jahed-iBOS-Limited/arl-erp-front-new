import React, { useEffect, useRef } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import { getSalesquotationGridData } from "../_redux/Actions";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import { useState } from "react";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import PaginationSearch from "../../../../_helper/_search";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { setSalesQuotationLandingAction } from "./../../../../_helper/reduxForLocalStorage/Actions";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { useReactToPrint } from "react-to-print";
import SalesQuotationForCement from "../cementSalesQuotation/invoiceRecept";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export function TableRow() {
  const dispatch = useDispatch();
  const history = useHistory();
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [invoiceData, getInvoiceData, loader, setInvoiceData] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const gridData = useSelector((state) => {
    return state.salesQuotation?.gridData;
  }, shallowEqual);

  const salesQuotationLanding = useSelector(
    (state) => state.localStorage.salesQuotationLanding
  );

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, searchValue, values) => {
    dispatch(
      getSalesquotationGridData(
        accId,
        buId,
        setLoading,
        pageNo,
        pageSize,
        searchValue,
        values?.status?.value,
        values?.formDate,
        values?.toDate
      )
    );
  };

  const paginationSearchHandler = (searchValue, values) => {
    setPositionHandler(pageNo, pageSize, searchValue, values);
  };

  useEffect(() => {
    if (buId && accId) {
      setPositionHandler(pageNo, pageSize, null, salesQuotationLanding);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId, salesQuotationLanding]);

  const handleInvoicePrint = useReactToPrint({
    content: () => printRef.current,
    pageStyle:
      "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}",
  });

  const getPrintInfo = (quoteId, partnerId) => {
    getInvoiceData(
      `/oms/SalesQuotation/GetSalesQuotationInfoForPrint?QuotationId=${quoteId}&SoldtoPartnerId=${partnerId}`,
      (resData) => {
        setInvoiceData(resData);
        handleInvoicePrint();
        // handleInvoicePrintCement();
      }
    );
  };

  const isLoading = loader || loading;

  return (
    <>
      {/* Table Start */}
      {isLoading && <Loading />}
      <Formik initialValues={salesQuotationLanding} onSubmit={() => {}}>
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={[
                      { value: false, label: "Quotation Open" },
                      { value: true, label: "Quotation Closed" },
                    ]}
                    value={values?.status}
                    label="Quotation Status"
                    onChange={(valueOption) => {
                      setFieldValue("status", valueOption);
                      dispatch(
                        getSalesquotationGridData(
                          accId.accountId,
                          buId.value,
                          setLoading,
                          pageNo,
                          pageSize,
                          null,
                          valueOption?.value,
                          values?.formDate,
                          values?.toDate
                        )
                      );
                      dispatch(
                        setSalesQuotationLandingAction({
                          ...values,
                          status: valueOption,
                        })
                      );
                    }}
                    placeholder="Quotation Status"
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.formDate}
                    name="formDate"
                    placeholder="From Date"
                    type="date"
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                  />
                </div>

                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: "17px",
                    }}
                    className="btn btn-primary"
                    type="button"
                    onClick={() => {
                      setPositionHandler(pageNo, pageSize, null, values);
                      dispatch(setSalesQuotationLandingAction(values));
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="mt-2">
                    <PaginationSearch
                      placeholder="Quotation No. & Party Name & Code"
                      paginationSearchHandler={paginationSearchHandler}
                      values={values}
                    />
                  </div>
                </div>

                <div className="col-lg-12">
                  {gridData?.data?.length >= 0 && (
                   <div className="table-responsive">
                     <table className="table table-striped table-bordered global-table sales_order_landing_table">
                      <thead>
                        <tr>
                          <th style={{ width: "35px" }}>SL</th>
                          <th style={{ width: "90px" }}>Quotation No</th>
                          <th style={{ width: "90px" }}>Quotation Date</th>
                          <th style={{ width: "90px" }}>
                            Quotation closed Date
                          </th>
                          <th>Sales Organization</th>
                          <th>Channel</th>
                          <th>Party Name</th>
                          <th style={{ width: "75px" }}>Total Qty</th>
                          <th style={{ width: "90px" }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gridData?.data?.map((td, index) => (
                          <tr key={index}>
                            <td className="text-center"> {td.sl} </td>
                            <td>
                              <div className="pl-2">{td.quotationCode} </div>
                            </td>
                            <td className="text-center">
                              {_dateFormatter(td.quotationDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(td.quotationEndDate)}
                            </td>
                            <td> {td.salesOrganizationName} </td>
                            <td> {td.distributionChannelName} </td>
                            <td> {td.soldToPartnerName} </td>
                            <td className="text-right">
                              {" "}
                              {td.totalQuotationQty}{" "}
                            </td>
                            <td>
                              <div className="d-flex justify-content-around">
                                <span className="view">
                                  <IView
                                    clickHandler={() => {
                                      history.push({
                                        pathname: `/sales-management/ordermanagement/salesquotation/view/${td.quotationId}`,
                                        state: td,
                                      });
                                    }}
                                  />
                                </span>
                                {!values?.status?.value && (
                                  <span
                                    className="edit"
                                    onClick={() => {
                                      history.push({
                                        pathname: `/sales-management/ordermanagement/salesquotation/edit/${td.quotationId}`,
                                        state: td,
                                      });
                                    }}
                                  >
                                    <IEdit />
                                  </span>
                                )}
                                {buId === 4 && (
                                  <span>
                                    <ICon
                                      title={"Print Sales Quotation"}
                                      onClick={() => {
                                        getPrintInfo(
                                          td?.quotationId,
                                          td?.soldToPartnerId
                                        );
                                      }}
                                    >
                                      <i class="fas fa-print"></i>
                                    </ICon>
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                   </div>
                  )}
                </div>
                {gridData?.data?.length > 0 && (
                  <PaginationTable
                    count={gridData?.totalCount}
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
                {invoiceData && buId === 4 && (
                  <SalesQuotationForCement
                    printRef={printRef}
                    invoiceData={invoiceData?.objRow}
                    businessPartnerInfo={{
                      strBusinessPartnerName:
                        invoiceData?.objRow?.length > 0
                          ? invoiceData?.objRow[0]?.businessPartnerName
                          : "",
                      strBusinessPartnerAddress:
                        invoiceData?.objRow?.length > 0
                          ? invoiceData?.objRow[0]?.businessPartnerAddress
                          : "",
                    }}
                  />
                )}
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
