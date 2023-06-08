import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import TableGird from "./gird";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import moment from "moment";
import {
  getTaxSalesReport_api,
  getItemDDL_api,
  GetBranchDDL,
  getPartnerNameDDL_api,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "./../../../../_helper/_select";
import "./style.css";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  shipmentName: "",
  taxItemName: "",
  partnerName: "",
};

export default function SalesReportOMSTable() {
  const printRef = useRef();
  const [rowDto, setRowDto] = useState([]);
  const [branch, setBranch] = useState([]);
  const [partnerNameDDL, setPartnerNameDDL] = useState([]);
  const [taxItemNameDDL, setTaxItemNameDDL] = useState([]);
  const [loading, setLoading] = useState(false);

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
      getItemDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setTaxItemNameDDL
      );
      GetBranchDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBranch
      );
      getPartnerNameDDL_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPartnerNameDDL
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Sales Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle={
            "@media print{body { -webkit-print-color-adjust: exact; margin: 0mm;}@page {size: portrait ! important}}"
          }
        >
          <div ref={printRef}>
            <div className="mx-auto SalesReportOMG">
              <Formik enableReinitialize={true} initialValues={initData}>
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-3">
                          <label>From Date</label>
                          <InputField
                            value={values?.fromDate}
                            placeholder="From Date"
                            name="fromDate"
                            type="date"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <label>To Date</label>
                          <InputField
                            value={values?.toDate}
                            placeholder="To Date"
                            name="toDate"
                            type="date"
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="shipmentName"
                            options={
                              [{ value: 0, label: "All" }, ...branch] || []
                            }
                            value={values?.shipmentName}
                            label="Ship Point"
                            onChange={(valueOption) => {
                              setFieldValue("shipmentName", valueOption);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="taxItemName"
                            options={[
                              { value: 0, label: "All" },
                              ...taxItemNameDDL,
                            ]}
                            value={values?.taxItemName}
                            label="Item Name"
                            onChange={(valueOption) => {
                              setFieldValue("taxItemName", valueOption);
                            }}
                            placeholder="Item Name"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="partnerName"
                            options={
                              [{ value: 0, label: "All" }, ...partnerNameDDL] ||
                              []
                            }
                            value={values?.partnerName}
                            onChange={(valueOption) => {
                              setFieldValue("partnerName", valueOption);
                            }}
                            errors={errors}
                            touched={touched}
                            label="Customer Name"
                            placeholder="Customer Name"
                          />
                        </div>
                        <div className="mt-2 col d-flex justify-content-end align-items-center">
                          <button
                            disabled={
                              !values?.shipmentName ||
                              !values?.partnerName ||
                              !values?.taxItemName
                            }
                            className="btn btn-primary"
                            onClick={() =>
                              getTaxSalesReport_api(
                                selectedBusinessUnit?.value,
                                values?.taxItemName?.value,
                                values?.shipmentName?.value,
                                values?.fromDate,
                                values?.toDate,
                                values?.partnerName?.value,
                                setRowDto,
                                setLoading
                              )
                            }
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                    {loading && <Loading />}
                    {rowDto?.length > 0 && (
                      <>
                        <div className="reportTopInfo">
                          <div className="my-5">
                            <div className="text-center my-2">
                              <h3>
                                <b> {selectedBusinessUnit?.label} </b>
                              </h3>
                              <h6>
                                <b> {selectedBusinessUnit?.address} </b>
                              </h6>
                              <h3>
                                <b>Sales Report</b>
                              </h3>
                              <div className="d-flex justify-content-center">
                                <h5>
                                  From Date:{" "}
                                  {moment(values?.fromDate).format(
                                    "DD-MM-YYYY"
                                  )}
                                </h5>
                                <h5 className="ml-5">
                                  To Date:{" "}
                                  {moment(values?.toDate).format("DD-MM-YYYY")}
                                </h5>
                              </div>
                            </div>
                          </div>
                          <div className="">
                            <p className="mr-3 mb-0">
                              <b>Ship Point:</b> {values?.shipmentName?.label}
                            </p>
                            <p className="mr-3  mb-0">
                              <b>Customer Name:</b> {values?.partnerName?.label}
                            </p>
                            <p className="mr-3  mb-0">
                              <b>Item Name:</b> {values?.taxItemName?.label}
                            </p>
                          </div>
                        </div>
                        <TableGird rowDto={rowDto} values={values} />
                      </>
                    )}
                  </>
                )}
              </Formik>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
