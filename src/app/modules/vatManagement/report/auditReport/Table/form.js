import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import {
  GetExportSales_api,
  GetCustomHouseDDL_api,
  GetLocalSales_api,
  GetLocalPurchase_api,
  GetBusinessPartnerByType_api,
} from "../helper";
import { _todayDate } from "./../../../../_helper/_todayDate";
import ReactHTMLTableToExcel from "react-html-table-to-excel";
import NewSelect from "./../../../../_helper/_select";
import ExportSalesTable from "./exportSalesTable";
import SearchAsyncSelect from "./../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import Loading from "./../../../../_helper/_loading";
import LocalSalesTable from "./localSalesTable";
import { GetImportPurchase_api } from "./../helper";
import ImportPurchaseTable from "./importPurchaseTable";
import LocalPurchaseTable from "./localPurchaseTable";
import { useLocation } from "react-router";
import { useHistory } from "react-router";
import ICustomCard from "./../../../../_helper/_customCard";
import InputField from "./../../../../_helper/_inputField";
// Validation schema
const validationSchema = Yup.object().shape({});
const initData = {
  customsHouse: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  reportType: "",
  tarrifSchedule: "",
};

export default function HeaderForm() {
  const [rowDto, setRowDto] = useState([]);
  const [gridAllData, setGridAllData] = useState([]);
  const [partnerByType, setPartnerByType] = useState([]);
  const [loading, setLoading] = useState(false);
  const [customHouseDDL, setCustomHouseDDL] = useState([]);
  const { state: landingData } = useLocation();
  // get selected business unit from store
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    GetCustomHouseDDL_api(setCustomHouseDDL);
  }, []);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const tradeType = [2].includes(landingData?.value) ? 2 : 1;
      GetBusinessPartnerByType_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        tradeType,
        setPartnerByType
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);
  const girdDataFunc = (values) => {
    setRowDto([]);
    if (values?.reportType?.value === 3) {
      GetExportSales_api(
        selectedBusinessUnit?.value,
        values,
        setRowDto,
        setLoading,
        setGridAllData
      );
    } else if (values?.reportType?.value === 2) {
      GetLocalSales_api(
        selectedBusinessUnit?.value,
        values,
        setRowDto,
        setLoading
      );
    } else if (values?.reportType?.value === 4) {
      GetImportPurchase_api(
        selectedBusinessUnit?.value,
        values,
        setRowDto,
        setLoading
      );
    } else if (values?.reportType?.value === 1) {
      GetLocalPurchase_api(
        selectedBusinessUnit?.value,
        values,
        setRowDto,
        setLoading
      );
    }
  };

  // const loadOptionsCustomer = async (v, values) => {
  //   if (v?.length < 3) return [{ value: 0, label: "All" }];
  //   try {
  //     const tradeType = [4].includes(values?.reportType?.value) ? 2 : 1;
  //     const res = await axios.get(
  //       `/vat/TaxItemGroup/GetItemTarifSchedule?Searchterm=${v}&Type=${tradeType}`
  //     );
  //     const updateList = res?.data.map((item) => ({
  //       ...item,
  //       label: `${item?.name}(${item?.label})`,
  //     }));
  //     return [{ value: 0, label: "All" }, ...updateList];
  //   } catch (error) {}
  // };

  const loadOptionsTarrifSchedule = async (v, values) => {
    if (v?.length < 3) return [];
    const tradeType = [4].includes(values?.reportType?.value) ? 2 : 1;
    try {
      const res = await axios.get(
        `/vat/TaxItemGroup/GetItemTarifSchedule?Searchterm=${v}&Type=${tradeType}`
      );
      const updateList = res?.data.map((item) => ({
        ...item,
        label: item?.description,
      }));
      return updateList;
    } catch (error) {}
  };
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData, reportType: landingData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          girdDataFunc(values);
        }}
      >
        {({
          errors,
          touched,
          setFieldValue,
          isValid,
          handleSubmit,
          values,
        }) => (
          <>
            {loading && <Loading />}
            <ICustomCard
              title={`Audit Report (${landingData?.label})`}
              backHandler={() => {
                history.goBack();
              }}
            >
              <Form className="form form-label-right">
                <div className="row global-form">
                  {/* <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={[
                        { value: 1, label: "Local Purchase" },
                        { value: 2, label: "Local Sales" },
                        { value: 3, label: "Export Sales" },
                        { value: 4, label: "Import Purchase" },
                      ]}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                        setFieldValue("partnerByType", "");
                        setFieldValue("customsHouse", "");
                        setFieldValue("tarrifSchedule", "");
                        setRowDto([]);
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div> */}
                  {/* Export Sales && Import Purchase*/}
                  {[3, 4].includes(values?.reportType?.value) && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="customsHouse"
                          options={
                            [{ value: 0, label: "All" }, ...customHouseDDL] ||
                            []
                          }
                          value={values?.customsHouse}
                          label="Customs House"
                          onChange={(valueOption) => {
                            setFieldValue("customsHouse", valueOption);
                            setRowDto([]);
                          }}
                          placeholder="Customs House"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}
                  {/* Local Sales && Local Purchase */}
                  {[1, 2].includes(values?.reportType?.value) && (
                    <>
                      {/* <div className="col-lg-3  ">
                        <label>Customer Name/Bin No</label>
                        <SearchAsyncSelect
                          selectedValue={values?.supplier}
                          handleChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          loadOptions={(v) => loadOptionsCustomer(v, values)}
                        />
                      </div> */}
                      <div className="col-lg-3">
                        <NewSelect
                          name="partnerByType"
                          options={
                            [{ value: 0, label: "All" }, ...partnerByType] || []
                          }
                          value={values?.partnerByType}
                          label={
                            landingData?.value === 1
                              ? "Supplier Name"
                              : "Customer Name"
                          }
                          onChange={(valueOption) => {
                            setFieldValue("partnerByType", valueOption);
                          }}
                          placeholder={
                            landingData?.value === 1
                              ? "Supplier Name"
                              : "Customer Name"
                          }
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}

                  <div className="col-lg-3">
                    <label>Trade Name/HS Code (Optional)</label>
                    <SearchAsyncSelect
                      selectedValue={values?.tarrifSchedule}
                      handleChange={(valueOption) => {
                        setFieldValue("tarrifSchedule", valueOption);
                      }}
                      placeholder="Search by HS Code / Description"
                      loadOptions={(v) => loadOptionsTarrifSchedule(v, values)}
                      isClearable={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.fromDate}
                      label="From Date"
                      type="date"
                      name="fromDate"
                      placeholder="From Date"
                    />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      value={values?.toDate}
                      label="To Date"
                      type="date"
                      name="toDate"
                      placeholder="To Date"
                    />
                  </div>

                  <div className="col d-flex justify-content-end align-items-center">
                    <button
                      disabled={
                        !values?.fromDate ||
                        !values?.toDate ||
                        !values?.reportType
                      }
                      type="submit"
                      className="btn btn-primary mt-2"
                      onSubmit={() => handleSubmit()}
                    >
                      View
                    </button>
                    {rowDto?.length > 0 && (
                      <ReactHTMLTableToExcel
                        id="test-table-xls-button"
                        className="btn btn-primary mt-2 ml-1"
                        table="table-to-xlsx"
                        filename={`auditReport_(${landingData?.label})`}
                        sheet="tablexls"
                        buttonText="Export Excel"
                      />
                    )}
                  </div>
                </div>
              </Form>
              {
                <>
                  {/* Local Purchase */}
                  {values?.reportType?.value === 1 && (
                    <LocalPurchaseTable rowDto={rowDto} />
                  )}
                  {/* Local Sales */}
                  {values?.reportType?.value === 2 && (
                    <LocalSalesTable rowDto={rowDto} />
                  )}
                  {/* exportSales */}
                  {values?.reportType?.value === 3 && (
                    <ExportSalesTable
                      gridAllData={gridAllData}
                      setRowDto={setRowDto}
                      rowDto={rowDto}
                    />
                  )}
                  {/* Import Purchase */}
                  {values?.reportType?.value === 4 && (
                    <ImportPurchaseTable rowDto={rowDto} />
                  )}
                </>
              }
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
