import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { _monthLastDate } from "../../../_helper/_monthLastDate";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import "./style.css";
const initData = {
  fromDate: _monthFirstDate(),
  toDate: _monthLastDate(),
  businessUnit: "",
  businessPartner: "",
};

export default function InventoryLoanApproveLanding() {
  const saveHandler = (values, cb) => {};
  const [, approveLoan, approveLoanLoading] = useAxiosPost();
  const [partnerDDl, getPartnerDDl] = useAxiosGet();
  const [businessUnitDDL, getBusinessUnitDDL] = useAxiosGet();
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const getLandingData = (values, pageNo, pageSize) => {
    getRowData(
      `/wms/InventoryLoan/GetLoanItemLanding?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&partnerId=${values?.partner?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=asc`
    );
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };
  const handleRateChange = (value, itemQty, index) => {
    const data = [...rowData?.data];
    console.log("rowData", data);
    data[index]["itemRate"] = +value;
    data[index]["itemAmount"] = value * itemQty;
    setRowData((prevState) => ({
      ...prevState,
      rowData: data,
    }));
  };

  useEffect(() => {
    getPartnerDDl(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=4`
    );
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${profileData?.accountId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(rowDataLoader || approveLoanLoading) && <Loading />}
          <IForm
            title="Inventory Loan Rate Approve"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            //   renderProps={() => {
            //     return (
            //       <div>
            //         <button
            //           type="button"
            //           className="btn btn-primary"
            //           onClick={() => {
            //             history.push("route here");
            //           }}
            //         >
            //           Create
            //         </button>
            //       </div>
            //     );
            //   }}
          >
            <Form>
              <div>
                <div className="row global-form">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e.target.value);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e.target.value);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="businessUnit"
                      options={
                        [{ value: 0, label: "All" }, ...businessUnitDDL] || []
                      }
                      value={values?.businessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        setFieldValue("businessUnit", valueOption);
                        setRowData([]);
                      }}
                      placeholder="Business Unit"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="partner"
                      options={
                        [{ value: 0, label: "All" }, ...partnerDDl] || []
                      }
                      value={values?.partner}
                      label="Business Partner"
                      onChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                        setRowData([]);
                      }}
                      placeholder="Business Partner"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        getLandingData(values, pageNo, pageSize);
                      }}
                      disabled={
                        !values?.partner ||
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.businessUnit
                      }
                    >
                      View
                    </button>
                  </div>
                </div>
                {rowData?.data?.length > 0 && (
                  <div className="common-scrollable-table">
                    <div className="scroll-table _table">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>SL</th>
                              <th>Business Unit</th>
                              <th>Business Partner</th>
                              <th>Loan & Transaction Type</th>
                              <th>Transaction Date</th>
                              <th>Warehouse</th>
                              <th style={{ minWidth: "80px" }}>Icn Number</th>
                              <th>Shipment Name</th>
                              <th>Survey Report No</th>
                              <th>Mother Vessel</th>
                              <th>Lighter Vessel</th>
                              <th>Item</th>
                              <th
                                className="table-header"
                                style={{
                                  backgroundColor: "#ffc107 ",
                                  minWidth: "80px",
                                }}
                              >
                                QTY
                              </th>
                              <th
                                className="table-header"
                                style={{
                                  backgroundColor: "#ffc107",
                                  minWidth: "80px",
                                }}
                              >
                                Rate
                              </th>
                              <th
                                className="table-header"
                                style={{
                                  backgroundColor: "#ffc107 ",
                                  minWidth: "80px",
                                }}
                              >
                                Amount
                              </th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowData?.data?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">{item?.sbuName}</td>
                                <td className="text-center">
                                  {item?.businessPartnerName}
                                </td>
                                <td className="text-center">
                                  {`${item?.intLoanTypeName} (${item?.transTypeName})`}
                                </td>
                                <td className="text-center">
                                  {_dateFormatter(item?.transDate)}
                                </td>
                                <td className="text-center">
                                  {item?.wareHouseName}
                                </td>
                                <td className="text-center">
                                  {item?.lcnumber}
                                </td>
                                <td className="text-center">
                                  {item?.shipmentName}
                                </td>
                                <td className="text-center">
                                  {item?.surveyReportNo}
                                </td>
                                <td className="text-center">
                                  {item?.motherVesselName}
                                </td>
                                <td className="text-center">
                                  {item?.lighterVesselName}
                                </td>
                                <td className="text-center">
                                  {item?.itemName}
                                </td>
                                <td
                                  style={{ backgroundColor: "#ffc107" }}
                                  className="text-center"
                                >
                                  {item?.itemQty}
                                </td>
                                {item?.intLoanTypeName === "External Loan" &&
                                item?.transTypeName === "Receive" ? (
                                  <td>
                                    <InputField
                                      name="itemRate"
                                      value={item?.itemRate}
                                      type="number"
                                      onChange={(e) => {
                                        handleRateChange(
                                          e.target.value,
                                          item?.itemQty,
                                          index
                                        );
                                      }}
                                    />
                                  </td>
                                ) : (
                                  <td
                                    style={{ backgroundColor: "#ffc107" }}
                                    className="text-center"
                                  >
                                    {item?.itemRate}
                                  </td>
                                )}
                                <td
                                  style={{
                                    backgroundColor: "#ffc107",
                                    marginRight: "3px",
                                  }}
                                  className="text-right"
                                >
                                  {_formatMoney(
                                    Math.round(item?.itemAmount, 2)
                                  )}
                                </td>
                                <td className="text-center">
                                  <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => {
                                      approveLoan(
                                        `/wms/InventoryLoan/ItemInventoryLoanTransaction?LoanId=${item?.loanId}&ItemRate=${item?.itemRate}&NumAmount=${item?.itemAmount}&ActionById=${profileData?.accountId}`,
                                        "",
                                        () => {
                                          getLandingData(
                                            values,
                                            pageNo,
                                            pageSize
                                          );
                                        },
                                        true
                                      );
                                    }}
                                  >
                                    Approve
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
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
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
