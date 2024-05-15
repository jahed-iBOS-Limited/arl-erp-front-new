/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
// import PaginationSearch from './../../../../_helper/_search'
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
///approvebillregister/supplerInvoiceView
import // setIndentStatementAction,

  //setIndentTableIndexAction
  "../../../../_helper/reduxForLocalStorage/Actions";
// import { useHistory } from 'react-router-dom'
import { Form, Formik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import NewSelect from "../../../../_helper/_select";
import ILoader from "../../../../_helper/loader/_loader";
import {
  getPurchaseOrgList,
  getSBUList,
  getbillbysupplierLanding,
  getissuerList,
} from "../helper";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
import PaginationTable from "./../../../../_helper/_tablePagination";
// import IView from '../../../../_helper/_helperIcons/_view';
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import FormikError from "../../../../_helper/_formikError";
import IView from "../../../../_helper/_helperIcons/_view";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import { _todayDate } from "../../../../_helper/_todayDate";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { SetReportBillBySupplierAction } from "../../../../_helper/reduxForLocalStorage/Actions";
import AdvForInternalView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/advForInternal";
import ExpenseView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/expenseView";
import SupplerInvoiceView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplerInvoiceView";
import SupplierAdvanceView from "../../../../financialManagement/invoiceManagementSystem/approvebillregister/supplierAdvanceView";
import ViewFuelBill from "../../../../financialManagement/invoiceManagementSystem/billregister/fuelBill/view/viewBillRegister";
import ViewLabourBill from "../../../../financialManagement/invoiceManagementSystem/billregister/labourBill/view/viewBillRegister";
import ViewSalesCommission from "../../../../financialManagement/invoiceManagementSystem/billregister/salesCommission/view/viewSalesCommission";
import ViewTransportBill from "../../../../financialManagement/invoiceManagementSystem/billregister/transportBill/view/viewBillRegister";
import ViewInternalTransportBill from "./../../../../financialManagement/invoiceManagementSystem/billregister/internalTransportBill/view/viewBillRegister";

const validationSchema = Yup.object().shape({
  toDate: Yup.string().when("fromDate", (fromDate, Schema) => {
    if (fromDate) return Schema.required("To date is required");
  }),
});

const BillbySupplierReportTable = () => {
  const { reportBillBySupplier } = useSelector((state) => state?.localStorage);

  let initData = {
    sbu: reportBillBySupplier?.sbu || "",
    plant: reportBillBySupplier?.plant || { value: 0, label: "All" },
    warehouse: reportBillBySupplier?.warehouse || { value: 0, label: "All" },
    issuer: reportBillBySupplier?.issuer || "",
    partner: reportBillBySupplier?.partner || "",
    po: reportBillBySupplier?.po || "",
    status: reportBillBySupplier?.status || "",
    fromDate: reportBillBySupplier?.fromDate || _todayDate(),
    toDate: reportBillBySupplier?.toDate || _todayDate(),
  };

  // //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20);
  const [mdalShow, setModalShow] = useState(false);
  const [gridItem, setGridItem] = useState("");

  const dispatch = useDispatch();

  // ddl state
  const [sbuList, setSbuList] = useState("");
  const [poList, setPoList] = useState("");
  const [plantList, setPlantList] = useState("");


  const [plantListddl, getPlantListddl] = useAxiosGet();
  const [wareHouseddl, getWareHouseddl] = useAxiosGet();

  // landing
  const [landing, setLanding] = useState([]);

  // loading
  const [loading, setLoading] = useState(false);

  // redux data
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  });

  useEffect(() => {
    getPlantListddl(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`)

    if (initData?.plant) {
      getWareHouseddl(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId
        }&AccId=${profileData?.accountId
        }&BusinessUnitId=${selectedBusinessUnit?.value
        }&PlantId=${initData?.plant?.value
        }&OrgUnitTypeId=8`)
    }
    if (initData?.po) {
      getissuerList(
        selectedBusinessUnit?.value,
        initData?.po?.value,
        setPlantList
      );
    }
  }, []);

  // },[indentStatement,profileData?.accountId,selectedBusinessUnit?.value])

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getSBUList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSbuList
      );
      getPurchaseOrgList(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPoList
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  // //setPositionHandler
  const setPositionHandler = (pageNo, pageSize, values) => {
    getbillbysupplierLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.po?.value,
      values?.partner?.value,
      values?.issuer?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      values?.plant?.value,
      values?.warehouse?.value,
    );
  };

  const viewPurchaseOrderData = (values) => {
    getbillbysupplierLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setLoading,
      setLanding,
      values?.po?.value,
      values?.partner?.value,
      values?.issuer?.value,
      values?.fromDate,
      values?.toDate,
      pageNo,
      pageSize,
      values?.plant?.value,
      values?.warehouse?.value,
    );
  };

  return (
    <ICustomCard title="Bill By Supplier Statement">
      <>
        <Formik
          enableReinitialize={true}
          validationSchema={validationSchema}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => { }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              <Form className="form form-label-left">
                <div
                  className="row global-form"
                  style={{ background: " #d6dadd" }}
                >
                  <div className="col-lg-2">
                    <NewSelect
                      name="sbu"
                      options={sbuList || []}
                      value={values?.sbu}
                      label="SBU"
                      onChange={(v) => {
                        dispatch(
                          SetReportBillBySupplierAction({ ...values, sbu: v })
                        );
                        setFieldValue("sbu", v);
                      }}
                      placeholder="SBU"
                      errors={errors}
                      touched={touched}
                    />{" "}
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="plant"
                      options={[
                        { value: 0, label: "All" },
                        ...plantListddl
                      ] || []}
                      value={values?.plant}
                      label="Plant"
                      onChange={(v) => {
                        dispatch(
                          SetReportBillBySupplierAction({ ...values, plant: v })
                        );
                        setFieldValue("plant", v);
                        getWareHouseddl(`/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermissionforWearhouse?UserId=${profileData?.userId
                          }&AccId=${profileData?.accountId
                          }&BusinessUnitId=${selectedBusinessUnit?.value
                          }&PlantId=${v?.value
                          }&OrgUnitTypeId=8`)
                      }}
                      placeholder="Plant"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="warehouse"
                      options={[
                        { value: 0, label: "All" },
                        ...wareHouseddl
                      ] || []}
                      value={values?.warehouse}
                      label="Warehouse"
                      onChange={(v) => {
                        dispatch(
                          SetReportBillBySupplierAction({ ...values, warehouse: v })
                        );
                        setFieldValue("warehouse", v);
                      }}
                      placeholder="Warehouse"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="po"
                      options={poList || []}
                      value={values?.po}
                      label="Purchase Organization"
                      onChange={(v) => {
                        dispatch(
                          SetReportBillBySupplierAction({ ...values, po: v })
                        );
                        setFieldValue("po", v);
                        getissuerList(
                          selectedBusinessUnit?.value,
                          v?.value,
                          setPlantList
                        );
                      }}
                      placeholder="Purchase Organization"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <label>From Date</label>
                    <div className="d-flex">
                      <InputField
                      style={{ width: "100%" }}
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportBillBySupplierAction({
                              ...values,
                              fromDate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <label>To Date</label>
                    <div className="d-flex">
                      <InputField
                       style={{ width: "100%" }}
                        value={values?.toDate}
                        name="toDate"
                        placeholder="To date"
                        type="date"
                        onChange={(e) => {
                          dispatch(
                            SetReportBillBySupplierAction({
                              ...values,
                              toDate: e?.target?.value,
                            })
                          );
                        }}
                      />
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="issuer"
                      options={plantList || []}
                      value={values?.issuer}
                      label="PO Issuer"
                      onChange={(v) => {
                        dispatch(
                          SetReportBillBySupplierAction({
                            ...values,
                            issuer: v,
                            partner: "",
                          })
                        );
                        setFieldValue("issuer", v);
                        setFieldValue("partner", "");
                      }}
                      placeholder="PO Issuer"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !values?.issuer ||
                        !values?.po ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        viewPurchaseOrderData(values);
                        // dispatch(setIndentStatementAction(values))
                      }}
                    >
                      Show
                    </button>
                  </div>

                  <div className="col-lg-2">
                    <label>Supplier</label>
                    <SearchAsyncSelect
                      selectedValue={values.partner}
                      handleChange={(valueOption) => {
                        setFieldValue("partner", valueOption);
                        setFieldValue("issuer", "");
                      }}
                      loadOptions={(v) => {
                        if (v.length < 3) return [];
                        return axios
                          .get(
                            `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=${values?.sbu?.value}`
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                            }));
                            return updateList;
                          });
                      }}
                      disabled={true}
                      isDisabled={!values?.sbu}
                    />
                    <FormikError
                      errors={errors}
                      name="partner"
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2 mt-6">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={
                        !values?.po ||
                        !values?.fromDate ||
                        !values?.toDate
                      }
                      onClick={() => {
                        viewPurchaseOrderData(values);
                        // dispatch(setIndentStatementAction(values))
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
              </Form>
              <div className="row">
                {/* {loading && <Loading />} */}

                <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table table-font-size-sm">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Bill Register No</th>
                        <th>Bill Type</th>
                        <th>Po No</th>
                        <th>Supplier Code</th>
                        <th>Supplier Name</th>
                        <th>Bill No</th>
                        <th>Bill Date</th>
                        <th>Bill Amount</th>
                        <th>PO Date</th>
                        <th>Approve Amount</th>
                        <th>Pay Amount</th>
                        <th>Pay Date</th>
                        <th>Paid Date</th>
                        <th>Is Advice</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    {loading ? (
                      <ILoader />
                    ) : (
                      <tbody>
                        {landing?.map((item, index) => (
                          <tr key={index}>
                            <td>{item?.sl}</td>
                            <td>{item?.strBillRegisterCode}</td>
                            <td>{item?.strbillType}</td>
                            <td>{item?.strPoNo}</td>
                            <td>{item?.strBusinessPartnerCode}</td>
                            <td>{item?.strBusinessPartnerName}</td>
                            <td>{item?.strBillRef}</td>
                            <td>{_dateFormatter(item?.dteBillRegisterDate)}</td>
                            <td>
                              {numberWithCommas(
                                (item?.monTotalAmount || 0).toFixed(2)
                              )}
                            </td>
                            <td>
                              {_dateFormatter(item?.dtePurchaseOrderDate)}
                            </td>
                            <td>
                              {numberWithCommas(
                                (item?.monApproveAmount || 0).toFixed(2)
                              )}
                            </td>
                            <td>
                              {numberWithCommas(
                                (item?.numPayAmount || 0).toFixed(2)
                              )}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dtePaymentRequestDate)}
                            </td>
                            <td className="text-center">
                              {_dateFormatter(item?.dtePayComplete)}
                            </td>
                            <td className="text-center">
                              {item?.isAdvicePrint ? "Yes" : "No"}
                            </td>
                            <td className="text-center">
                              <IView
                                //classes="text-muted"
                                clickHandler={() => {
                                  setModalShow(true);
                                  setGridItem({
                                    ...item,
                                    billRegisterId: item?.intBillRegisterId,
                                    billType: item?.intBillType,
                                  });
                                }}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    )}
                  </table>
                  </div>
                </div>
                <>
                  <IViewModal
                    show={mdalShow}
                    onHide={() => setModalShow(false)}
                  >
                    {[1].includes(gridItem?.billType ) && (
                      <SupplerInvoiceView
                        gridItem={gridItem}
                        laingValues={values}
                        setModalShow={setModalShow}
                      />
                    )}
                    {gridItem?.billType === 2 && (
                      <SupplierAdvanceView
                        gridItem={gridItem}
                        laingValues={values}
                        bilRegister={true}
                        setModalShow={setModalShow}
                      />
                    )}
                    {gridItem?.billType === 3 && (
                      <AdvForInternalView
                        gridItem={gridItem}
                        laingValues={{
                          ...values,
                          status: {
                            value: gridItem?.billStatus === "Approved" ? 2 : 1,
                            label: "",
                          },
                        }}
                        setModalShow={setModalShow}
                      />
                    )}
                    {gridItem?.billType === 4 && (
                      <ExpenseView
                        gridItem={gridItem}
                        laingValues={{
                          ...values,
                          status: {
                            value: gridItem?.billStatus === "Approved" ? 2 : 1,
                            label: "",
                          },
                        }}
                        setModalShow={setModalShow}
                      />
                    )}
                    {gridItem?.billType === 7 && (
                      <ViewSalesCommission
                        billRegisterId={gridItem?.billRegisterId}
                      />
                    )}
                    {gridItem?.billType === 6 && (
                      <ViewTransportBill
                        landingValues={values}
                        gridItem={gridItem}
                      />
                    )}
                    {gridItem?.billType === 8 && (
                      <ViewFuelBill
                        landingValues={values}
                        gridItem={gridItem}
                      />
                    )}
                    {(gridItem?.billType === 9 ||
                      gridItem?.billType === 10) && (
                        <ViewLabourBill
                          landingValues={values}
                          gridItem={gridItem}
                        />
                      )}
                    {gridItem?.billType === 13 && (
                      <ViewInternalTransportBill
                        landingValues={values}
                        gridItem={gridItem}
                      />
                    )}
                  </IViewModal>
                </>
              </div>
              {landing?.length > 0 && (
                <PaginationTable
                  count={landing[0]?.totalRows}
                  setPositionHandler={setPositionHandler}
                  paginationState={{ pageNo, setPageNo, pageSize, setPageSize }}
                  values={values}
                  rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 300, 400, 500]}
                />
              )}
            </>
          )}
        </Formik>
      </>
    </ICustomCard>
  );
};

export default BillbySupplierReportTable;
