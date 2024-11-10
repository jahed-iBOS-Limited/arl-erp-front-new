import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import { useHistory } from "react-router-dom";
import IView from "../../../../_helper/_helperIcons/_view";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import InputField from "./../../../../_helper/_inputField";
import { getSalesInvoiceLandingData, getShippointDDL } from "../helper"
const initData = {
  counter:'',
  fromDate: new Date(),
  toDate: new Date()
}

export function TableRow() {
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  const [shippointDDL, setShippointDDL] = React.useState([])
  const [gridData, setGridData] = React.useState([])
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
    getSalesInvoiceLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setGridData,
      setLoading,
      pageNo,
      pageSize,
      values?.counter?.value,
      values?.formDate,
      values?.toDate
    )
  };

  useEffect(() => {
    getShippointDDL(profileData?.userId, profileData?.accountId, setShippointDDL)
  }, [profileData])

  return (
    <>
      {/* Table Start */}
      {loading && <Loading />}
      <Formik
        initialValues={initData}
        onSubmit={(values, { setSubmitting }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
          setValues,
        }) => (
          <>
            <Form>
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="status"
                    options={shippointDDL}
                    value={values?.counter}
                    label="Counter"
                    onChange={(valueOption) => {
                      setFieldValue("counter", valueOption);
                    }}
                    placeholder="Counter"
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
                    className="btn btn-primary mt-5"
                    type="button"
                    onClick={() => {
                      setPositionHandler(pageNo, pageSize, values);
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="row">
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
                          <th style={{ width: "60px" }}>Actions</th>
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
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
