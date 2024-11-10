import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import PaginationTable from "../../../../_helper/_tablePagination";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "./../../../../_helper/_select";
import printIcon from "./../../../../_helper/images/print-icon.png";
import {
  GetDetailTaxPendingDeliveryListAuto,
  getManualSalesInvoiceIbos,
  getShipPointByBranchId_api,
  getTaxBranchDDL_api
} from "./../helper";
import GridData from "./grid";

import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IViewModal from "../../../../_helper/_viewModal";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { generateJsonToExcel } from "../../../../_helper/excel/jsonToExcel";
import ModalDateRangeModal from "./modalDateRangeModal";

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
  const [, getExcelData, excelDataLoader] = useAxiosGet();
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

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
      (taxBranchDDL[0]?.value || taxBranchDDL[0]?.value === 0)
    ) {
      getShipPointByBranchId_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        taxBranchDDL[0]?.value,
        (resData) => {
          setShipPointByBranchDDL(resData || [])
          const values  = {
            ...initData,
            branch: taxBranchDDL[0] || "",
            shipPoint: resData[0] || "",
          }
          commonGridFunc(null, values, pageNo, pageSize);
        }
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
      getManualSalesInvoiceIbos(
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
        GetDetailTaxPendingDeliveryListAuto(
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
      },
    ];
    const _data = row.map((item, index) => {
      return {
        ...item,
        sl: index + 1,
        transferDate: _dateFormatter(item?.transferDate),
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
          branch: taxBranchDDL[0] || "",
        }}
        //validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Auto Sales Invoice"}>
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
                        getExcelData(
                          `/vat/TaxSalesInvoiceIbos/GetSalesInvoiceIbosSearchPagination?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&taxBranchId=${values?.branch?.value}&status=true&fromdate=${values?.fromDate}&todate=${values?.toDate}&PageNo=1&PageSize=${gridData?.totalCountForExcel}&viewOrder=desc`,
                          (data) => {
                            generateExcel(data?.data);
                          }
                        );
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
