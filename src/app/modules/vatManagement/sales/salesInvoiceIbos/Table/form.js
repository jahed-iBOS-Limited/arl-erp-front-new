import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import NewSelect from "./../../../../_helper/_select";
import GridData from "./grid";
import {
  getShipPointByBranchId_api,
  getTaxBranchDDL_api,
  getDetailTaxPendingDeliveryList,
  getSalesInvoiceIbosPagination_api,
} from "./../helper";
import printIcon from "./../../../../_helper/images/print-icon.png";
import { useDispatch, useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import InputField from "../../../../_helper/_inputField";
import { _todayDate } from "../../../../_helper/_todayDate";
import { setSalesInvoiceiBOSlanding_Action } from "../../../../_helper/reduxForLocalStorage/Actions";
import IViewModal from "../../../../_helper/_viewModal";
import ModalDateRangeModal from "./modalDateRangeModal";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

export default function HeaderForm() {
  const [taxBranchDDL, setTaxBranchDDL] = useState([]);
  const [shipPointByBranchDDL, setShipPointByBranchDDL] = useState([]);
  const [gridData, setGirdData] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalDateRange, setModalDateRange] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(15);
  // get user profile data from store
  const [, getExcelData, excelDataLoader] = useAxiosGet()
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const salesInvoiceiBOSlanding = useSelector(
    (state) => state.localStorage.salesInvoiceiBOSlanding
  );
  const { profileData, selectedBusinessUnit } = storeData;
  const dispatch = useDispatch();
  const initData = {
    toDate: _todayDate(),
    fromDate: _todayDate(),
    branch: "",
    status: "printed",
    shipPoint: "",
  };

  //FETCHING ALL DATA FROM helper.js

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit?.value) {
      getTaxBranchDDL_api(
        profileData.userId,
        profileData.accountId,
        selectedBusinessUnit?.value,
        setTaxBranchDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (
      selectedBusinessUnit?.value &&
        profileData?.accountId &&
        salesInvoiceiBOSlanding?.branch
        ? salesInvoiceiBOSlanding?.branch?.value
        : taxBranchDDL[0]?.value
    ) {
      getShipPointByBranchId_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        salesInvoiceiBOSlanding?.branch
          ? salesInvoiceiBOSlanding?.branch?.value
          : taxBranchDDL[0]?.value,
        setShipPointByBranchDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, taxBranchDDL]);

  const commonGridFunc = (
    searchValue,
    values,
    _pageNo = pageNo,
    _pageSize = pageSize
  ) => {
    setGirdData([]);

    if (values?.status === "printed") {
      getSalesInvoiceIbosPagination_api(
        profileData?.accountId,
        selectedBusinessUnit.value,
        values?.branch?.value,
        values?.fromDate,
        values?.toDate,
        setGirdData,
        setLoading,
        _pageNo,
        _pageSize,
        searchValue
      );
    } else {
      if (values?.shipPoint?.value) {
        getDetailTaxPendingDeliveryList(
          profileData.accountId,
          selectedBusinessUnit.value,
          values?.shipPoint?.value,
          setGirdData,
          setLoading,
          _pageNo,
          _pageSize,
          searchValue
        );
      }
    }
  };

  const paginationSearchHandler = (searchValue, values) => {
    commonGridFunc(searchValue, values, pageNo, pageSize);
  };
  //setPagination Handler
  const setPositionHandler = (pageNo, pageSize, values) => {
    commonGridFunc(null, values, pageNo, pageSize);
  };
  useEffect(() => {
    if (salesInvoiceiBOSlanding?.branch && salesInvoiceiBOSlanding?.status) {
      commonGridFunc(null, salesInvoiceiBOSlanding, pageNo, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const isMagnum = [171, 224]?.includes(selectedBusinessUnit?.value);

  const generateExcel = (row) => {
    const header = [
      {
        text: "SL",
        textFormat: "number",
        alignment: "center:middle",
        key: "sl",
      },
      {
        text: "Invoice",
        textFormat: "text",
        alignment: "center:middle",
        key: "invoice",
      },
      {
        text: "Transfer Date",
        textFormat: "date",
        alignment: "center:middle",
        key: "transferDate",
      },
      {
        text: "Transfer To",
        textFormat: "text",
        alignment: "center:middle",
        key: "transferTo",
      },
      {
        text: "Quantity",
        textFormat: "number",
        alignment: "center:middle",
        key: "quantity",
      },
      {
        text: "Value",
        textFormat: "number",
        alignment: "center:middle",
        key: "value",
      }
    ];
    const _data = row.map((item, index) => {
      return {
        ...item,
        sl: index + 1,
        transferDate: _dateFormatter(item?.transferDate)
      };
    });
    generateJsonToExcel(header, _data, "Sales Invoice iBOS");
  };


  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          ...salesInvoiceiBOSlanding,
          branch: salesInvoiceiBOSlanding?.branch
            ? salesInvoiceiBOSlanding?.branch
            : taxBranchDDL[0],
        }}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => { }}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Sales Invoice"}>
                <CardHeaderToolbar>
                  <div className="d-flex justify-content-center align-items-center">
                    {isMagnum && (
                      <>
                        {" "}
                        <button
                          type="button"
                          className="btn btn-primary"
                          style={{ padding: "5px 11px" }}
                          onClick={() => {
                            setModalDateRange(true);
                          }}
                        >
                          <img
                            src={printIcon}
                            alt="print-icon"
                            style={{ width: "15px" }}
                          />
                          Date Range Print
                        </button>
                      </>
                    )}
                    <button
                      className="btn btn-primary ml-2"
                      type="button"
                      onClick={(e) => {
                        getExcelData(`/vat/TaxSalesInvoiceIbos/GetSalesInvoiceIbosSearchPagination?accountId=${profileData?.accountId
                          }&businessUnitId=${selectedBusinessUnit?.value
                          }&taxBranchId=${values?.branch?.value
                          }&status=true&fromdate=${values?.fromDate
                          }&todate=${values?.toDate
                          }&PageNo=1&PageSize=${gridData?.totalCountForExcel}&viewOrder=desc`, (data) => {
                            generateExcel(data?.data)
                          })
                      }}
                      disabled={!gridData?.data?.length}
                    >
                      Export Excel
                    </button>
                  </div>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {(loading || excelDataLoader) && <Loading />}
                <Form className="form form-label-right">
                  <div className="row global-form align-items-center">
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={taxBranchDDL || []}
                        value={values?.branch}
                        label="Branch"
                        onChange={(valueOption) => {
                          const modifyValues = {
                            ...values,
                            branch: valueOption,
                            status: "printed",
                            shipPoint: "",
                          };
                          getShipPointByBranchId_api(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setShipPointByBranchDDL
                          );
                          commonGridFunc(null, modifyValues, pageNo, pageSize);
                          dispatch(
                            setSalesInvoiceiBOSlanding_Action(modifyValues)
                          );
                          setFieldValue("shipPoint", "");
                          setFieldValue("status", "printed");
                          setFieldValue("branch", valueOption);
                        }}
                        placeholder="Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPointByBranchDDL || []}
                        value={values?.shipPoint}
                        label="ShipPoint"
                        onChange={(valueOption) => {
                          // setFieldValue("status", "");
                          setFieldValue("shipPoint", valueOption);
                          const modifyValues = {
                            ...values,
                            shipPoint: valueOption,
                          };
                          commonGridFunc(null, modifyValues, pageNo, pageSize);
                          dispatch(
                            setSalesInvoiceiBOSlanding_Action(modifyValues)
                          );
                        }}
                        placeholder="ShipPoint"
                        errors={errors}
                        touched={touched}
                      // isDisabled={values?.status === "printed"}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="formDate"
                        type="date"
                        onChange={(e) => {
                          const modifyValues = {
                            ...values,
                            fromDate: e?.target?.value,
                          };
                          setFieldValue("fromDate", e?.target?.value);
                          commonGridFunc(null, modifyValues, pageNo, pageSize);
                          dispatch(
                            setSalesInvoiceiBOSlanding_Action(modifyValues)
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <label>To Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          const modifyValues = {
                            ...values,
                            toDate: e?.target?.value,
                          };
                          setFieldValue("toDate", e?.target?.value);
                          commonGridFunc(null, modifyValues, pageNo, pageSize);
                          dispatch(
                            setSalesInvoiceiBOSlanding_Action(modifyValues)
                          );
                        }}
                      />
                    </div>
                    <div className="col-lg-2 d-flex align-items-center">
                      <span
                        className="d-flex align-items-center mr-2"
                        style={{ marginTop: "15px" }}
                      >
                        <input
                          id="printed"
                          className=""
                          type="radio"
                          value="printed"
                          name="status"
                          onChange={(e) => {
                            const modifyValues = {
                              ...values,
                              status: e?.target?.value,
                            };
                            commonGridFunc(
                              null,
                              modifyValues,
                              pageNo,
                              pageSize
                            );
                            dispatch(
                              setSalesInvoiceiBOSlanding_Action(modifyValues)
                            );
                            setFieldValue("status", e.target.value);
                          }}
                          checked={values?.status === "printed"}
                        />
                        <label className="ml-2" for="printed">
                          Printed
                        </label>
                      </span>
                      <span
                        className="d-flex align-items-center"
                        style={{ marginTop: "15px" }}
                      >
                        <input
                          id="unprinted"
                          className=""
                          type="radio"
                          value="unprinted"
                          name="status"
                          onChange={(e) => {
                            const modifyValues = {
                              ...values,
                              status: e?.target?.value,
                            };
                            commonGridFunc(
                              null,
                              modifyValues,
                              pageNo,
                              pageSize
                            );
                            dispatch(
                              setSalesInvoiceiBOSlanding_Action(modifyValues)
                            );
                            setFieldValue("status", e.target.value);
                          }}
                          checked={values?.status === "unprinted"}
                          disabled={!values?.shipPoint}
                        />
                        <label className="ml-2" for="unprinted">
                          Unprinted
                        </label>
                      </span>
                    </div>
                  </div>
                  <GridData
                    paginationSearchHandler={paginationSearchHandler}
                    rowDto={gridData}
                    setRowDto={setGirdData}
                    values={values}
                    profileData={profileData}
                    selectedBusinessUnit={selectedBusinessUnit}
                    setGirdData={setGirdData}
                    commonGridFunc={commonGridFunc}
                  />
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

                  {modalDateRange && (
                    <IViewModal
                      show={modalDateRange}
                      onHide={() => {
                        setModalDateRange(false);
                      }}
                    >
                      <ModalDateRangeModal values={values} />
                    </IViewModal>
                  )}
                </Form>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
