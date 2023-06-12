import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";
import NewSelect from "./../../../_helper/_select";
import {
  GetItemNameDDL_api,
  GetItemTypeDDLPurchase_api,
  GetItemTypeDDLSales_api,
  PurchaseRegister_Report_api,
  SalesRegister_Report_api,
  getHeaderData_api,
  getVatBranches_api,
} from "./helper";

import Loading from "../../../_helper/_loading";
import PurchaseRegSummary from "./purchaseRegSummary";
import SalesRegSummary from "./salesRegSummary";

// Validation schema
const validationSchema = Yup.object().shape({});

const initData = {
  id: undefined,
  fromDate: _todayDate(),
  toDate: _todayDate(),
  itemType: "",
  branch: "",
  itemName: "",
};

export default function WHStockReportVat() {
  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [itemName, setItemName] = useState([]);
  const [itemTypeDDL, setitemType] = useState([]);
  const [branchDDL, setBranchDDL] = useState([]);
  const [headerData, setHeaderData] = useState("");

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getVatBranches_api(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setBranchDDL
      );
      getHeaderData_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setHeaderData
      );
    }
  }, [selectedBusinessUnit, profileData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({ errors, touched, setFieldValue, isValid, values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Warehouse Stock Report(VAT)"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loading && <Loading />}
                <Form className="form form-label-right">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <NewSelect
                        name="branch"
                        options={branchDDL || []}
                        value={values?.branch}
                        label="Branch"
                        onChange={(valueOption) => {
                          setFieldValue("branch", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Branch"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="reportType"
                        options={
                          [
                            { value: 1, label: "Raw Material" },
                            { value: 2, label: "Finished Goods" },
                          ] || []
                        }
                        value={values?.reportType}
                        label="Report Type"
                        onChange={(valueOption) => {
                          setFieldValue("reportType", valueOption);
                          setFieldValue("itemType", "");
                          setFieldValue("itemName", "");
                          if (valueOption.value === 1) {
                            GetItemTypeDDLPurchase_api(setitemType);
                          } else {
                            GetItemTypeDDLSales_api(setitemType);
                          }
                        }}
                        placeholder="Report Type"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="itemType"
                        options={itemTypeDDL || []}
                        value={values?.itemType}
                        label="Item Type"
                        onChange={(valueOption) => {
                          setFieldValue("itemType", valueOption);
                          setFieldValue("itemName", "");
                          setRowDto([]);
                          GetItemNameDDL_api(
                            profileData.accountId,
                            selectedBusinessUnit.value,
                            valueOption?.value,
                            setItemName
                          );
                        }}
                        placeholder="Item Type"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="itemName"
                        options={itemName || []}
                        value={values?.itemName}
                        label="Item"
                        onChange={(valueOption) => {
                          setFieldValue("itemName", valueOption);
                          setRowDto([]);
                        }}
                        placeholder="Item Name"
                        errors={errors}
                        touched={touched}
                        // isDisabled={isEdit}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>From Date</label>
                      <InputField
                        value={values?.fromDate}
                        name="fromDate"
                        placeholder="From Date"
                        type="date"
                        onChange={() => {
                          setFieldValue("fromDate", values?.fromDate);
                          setRowDto([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Top Date</label>
                      <InputField
                        value={values?.toDate}
                        name="toDate"
                        placeholder="Top Date"
                        type="date"
                        onChange={() => {
                          setFieldValue("toDate", values?.toDate);
                          setRowDto([]);
                        }}
                      />
                    </div>
                    <div className="col-lg-3 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={
                          !values?.branch ||
                          !values?.reportType ||
                          !values?.itemType ||
                          !values?.itemName ||
                          !values?.fromDate ||
                          !values?.toDate
                        }
                        onClick={() => {
                          if (values?.reportType?.value === 1) {
                            PurchaseRegister_Report_api(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.fromDate,
                              values?.toDate,
                              values?.itemName?.value,
                              values?.branch?.value,
                              setRowDto,
                              setLoading
                            );
                          } else {
                            SalesRegister_Report_api(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.fromDate,
                              values?.toDate,
                              values?.itemName?.value,
                              values?.branch?.value,
                              setRowDto,
                              setLoading
                            );
                          }
                        }}
                      >
                        View
                      </button>
                    </div>
                  </div>
                  {rowDto?.length > 0 && (
                    <>
                      <div className="row mb-2">
                        <div className="col-lg-12">
                          <div className="text-center">
                            <b>
                              <h4 className="mb-1">
                                Name: {headerData?.nameOfTaxpayer}
                              </h4>
                              <h6 className="mb-1">
                                Address:{headerData?.addressOfTaxpayer}
                              </h6>
                              <h6 className="mb-1">Bin No:{headerData?.bin}</h6>
                            </b>
                          </div>
                        </div>
                      </div>

                      {values?.reportType?.value === 1 ? (
                        <PurchaseRegSummary rowDto={rowDto} />
                      ) : (
                        <SalesRegSummary rowDto={rowDto} />
                      )}
                    </>
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
