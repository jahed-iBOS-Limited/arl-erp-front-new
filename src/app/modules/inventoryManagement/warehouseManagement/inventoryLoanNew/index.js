import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import PaginationTable from "../../../_helper/_tablePagination";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
// import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import LoanViewModal from "./modal/loanViewModal";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  businessPartner: "",
};
export default function InventoryLoanLandingNew() {
  const history = useHistory();
  const [partnerDDl, getPartnerDDl, partnerDDlloader] = useAxiosGet();
  const [rowData, getRowData, rowDataLoader, setRowData] = useAxiosGet();
  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);
  const [showModal, setShowModal] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    getPartnerDDl(
      `/partner/PManagementCommonDDL/GetBusinessPartnerbyIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PartnerTypeId=4`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getLandingData = (values, pageNo, pageSize) => {
    if (
      profileData?.accountId &&
      selectedBusinessUnit?.value &&
      values?.partner
    ) {
      getRowData(
        `/wms/InventoryLoan/GetInvItemloanListPagination?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}&partnerId=${values?.partner?.value}&PageNo=${pageNo}&PageSize=${pageSize}&viewOrder=desc`
      );
    }
  };

  const setPositionHandler = (pageNo, pageSize, values) => {
    getLandingData(values, pageNo, pageSize);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {(partnerDDlloader || rowDataLoader) && <Loading />}
          <IForm
            title="Inventory Loan"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        `/inventory-management/warehouse-management/inventoryLoan/create`
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
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
                      disabled={!values?.partner}
                    >
                      View
                    </button>
                  </div>
                </div>
                {rowData?.data?.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Transaction Code</th>
                          <th>Business Partner</th>
                          <th>Transaction Type</th>
                          <th>Loan Type</th>
                          <th>Warehouse</th>
                          <th>Transaction Date</th>
                          <th>Item Name</th>
                          <th>Item Qty</th>
                          {/* <th>Action</th> */}
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.data?.map((item, index) => (
                          <tr key={index}>
                            <td>
                              <div className="text-center">{index + 1}</div>
                            </td>
                            <td>
                              <div className="text-center">
                                {item?.strInventoryTransactionCode}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.businessPartnerName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.transTypeName}</div>
                            </td>
                            <td>
                              <div className="pl-2">
                                {item?.intLoanTypeName}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.wareHouseName}</div>
                            </td>
                            <td>
                              <div className="text-center">
                                {_dateFormatter(item?.transDate)}
                              </div>
                            </td>
                            <td>
                              <div className="pl-2">{item?.itemName}</div>
                            </td>
                            <td>
                              <div className="text-right pr-2">
                                {Math?.abs(item?.itemQty)}
                              </div>
                            </td>

                            {/* <td className="action-att-report-print-disabled">
                                                        <div className="d-flex justify-content-around">
                                                            <span className="view">
                                                                <IView
                                                                    clickHandler={() => {
                                                                        setShowModal(true);
                                                                    }}
                                                                    classes="text-primary"
                                                                />
                                                            </span>
                                                        </div>
                                                    </td> */}
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
                  />
                )}
              </div>
              <IViewModal
                title="View Loan Details"
                show={showModal}
                onHide={() => {
                  setShowModal(false);
                }}
              >
                <LoanViewModal />
              </IViewModal>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
