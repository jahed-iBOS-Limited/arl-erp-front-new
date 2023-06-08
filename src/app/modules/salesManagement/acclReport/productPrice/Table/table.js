/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Form, Formik } from "formik";
import React, { useState, useEffect, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICard from "../../../../_helper/_card";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import {
  GetDistributionChannelDDL,
  getPartnerProductPrice,
  GetSbuDDL,
} from "../helper";

export default function ProductPrice() {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const initData = {
    reportType: "",
    customerName: "",
    channelName: "",
    sbu: "",
  };

  const [allData, setAllData] = useState([]);
  const [gridData, setGridData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);

  useEffect(() => {
    GetSbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
  }, []);

  const loadCustomerList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/partner/PManagementCommonDDL/GetCustomerNameDDL?SearchTerm=${v}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
      )
      .then((res) => res?.data);
  };

  const GetTransferChallanReport = (values) => {
    getPartnerProductPrice(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.reportType?.value,
      values?.channelName?.value,
      values?.customerName?.value,
      setGridData,
      setLoading,
      setHeaders,
      setAllData
    );
  };

  const printRef = useRef();

  const reportTypeDDL = [
    { value: 0, label: "All" },
    { value: 1, label: "Channel Base" },
    { value: 2, label: "Customer Base" },
  ];

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          GetTransferChallanReport(values);
        }}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <ICard
              printTitle="Print"
              isPrint={true}
              isShowPrintBtn={true}
              componentRef={printRef}
              isExcelBtn={true}
              excelFileNameWillbe="Product Price"
              title="Product Price"
            >
              <Form className="form form-label-right">
                <div className="form-group row global-form printSectionNone">
                  <div className="col-lg-3">
                    <NewSelect
                      name="reportType"
                      options={reportTypeDDL}
                      value={values?.reportType}
                      label="Report Type"
                      onChange={(valueOption) => {
                        setFieldValue("reportType", valueOption);
                      }}
                      placeholder="Report Type"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {values?.reportType?.value === 1 && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="SBU"
                          options={sbuDDL || []}
                          value={values?.sbu}
                          label="SBU"
                          onChange={(valueOption) => {
                            setFieldValue("sbu", valueOption);
                            setFieldValue("channelName", "");
                            setDistributionChannelDDL([]);
                            GetDistributionChannelDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              setDistributionChannelDDL
                            );
                          }}
                          placeholder="sbu"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="channelName"
                          options={distributionChannelDDL || []}
                          value={values?.channelName}
                          label="Channel Name"
                          onChange={(valueOption) => {
                            setFieldValue("channelName", valueOption);
                          }}
                          placeholder="Channel Name"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}
                  {values?.reportType?.value === 2 && (
                    <div className="col-lg-3">
                      <div>
                        <label>Customer Name</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customerName}
                          handleChange={(valueOption) => {
                            setFieldValue("customerName", valueOption);
                          }}
                          placeholder="Search By Code Number"
                          loadOptions={loadCustomerList}
                        />
                      </div>
                    </div>
                  )}
                  <div channelName="text-right">
                    <button
                      disabled={!values?.reportType}
                      type="submit"
                      className="btn btn-primary mt-5 "
                    >
                      View
                    </button>
                  </div>
                </div>
              </Form>
              {loading && <Loading />}
              {gridData?.length ? (
                <div className="react-bootstrap-table table-responsive pendingDeliveryReport">
                  <div className="product-wise-shipment-report">
                    <div className="loan-scrollable-table scroll-table-auto">
                      <div
                        style={{ maxHeight: "540px" }}
                        className="scroll-table _table scroll-table-auto"
                      >
                        <div className="productPriceTable">
                          <table
                            ref={printRef}
                            id="table-to-xlsx"
                            className="table table-striped table-bordered global-table table-font-size-sm"
                          >
                            <thead>
                              <tr>
                                <th style={{ minWidth: "30px" }}>SL</th>
                                <th style={{ minWidth: "130px" }}>
                                  Partner Name
                                </th>
                                <th>Region</th>
                                <th style={{ minWidth: "85px" }}>Area</th>
                                <th>Territory</th>
                                <th>Sales Office</th>
                                {headers?.map((item) => (
                                  <th> {item?.itemName} </th>
                                ))}
                                <th style={{ minWidth: "65px" }}>
                                  Insert Date
                                </th>
                                <th>Insert By</th>
                              </tr>
                            </thead>
                            <tbody>
                              {gridData?.map((itm, i) => {
                                let prices = [];
                                let assArray = [];
                                let isValid = true;
                                headers.map((element, index) => {
                                  let isShowed = false;

                                  return allData.map((elem, idx) => {
                                    if (
                                      elem.itemId === element.itemId &&
                                      itm.businessPartnerId ===
                                        elem.businessPartnerId
                                    ) {
                                      isShowed = true;
                                      if (
                                        assArray[
                                          `${itm.businessPartnerId}_${element.itemId}`
                                        ]
                                      ) {
                                        isValid = false;
                                      } else {
                                        assArray[
                                          `${itm.businessPartnerId}_${element.itemId}`
                                        ] = 1;
                                      }

                                      prices.push(elem.numPrice);
                                    }
                                    if (allData.length === idx + 1) {
                                      if (!isShowed) {
                                        prices.push(0);
                                      }
                                    }
                                    return null;
                                  });
                                });

                                return (
                                  <tr
                                    style={
                                      !isValid
                                        ? { backgroundColor: "red" }
                                        : null
                                    }
                                    key={i}
                                  >
                                    <td className="text-center">{i + 1}</td>
                                    <td>{itm?.businessPartnerName} </td>
                                    <td>{itm?.region} </td>
                                    <td>{itm?.area} </td>
                                    <td>{itm?.territory} </td>
                                    <td>{itm?.salesOffice} </td>
                                    {prices?.map((item, inx) => {
                                      return (
                                        <td
                                          className="text-right"
                                          style={
                                            inx > headers.length - 1
                                              ? { display: "none" }
                                              : null
                                          }
                                        >
                                          {item}
                                        </td>
                                      );
                                    })}

                                    <td>
                                      {_dateFormatter(itm?.insertedDate)}{" "}
                                    </td>
                                    <td>{itm?.insertedBy} </td>
                                    {(prices = [])}
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </ICard>
          </>
        )}
      </Formik>
    </>
  );
}
