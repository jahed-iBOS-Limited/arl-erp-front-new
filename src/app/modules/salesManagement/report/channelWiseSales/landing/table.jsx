import React, { useEffect, useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import ICustomTable from "../../../../_helper/_customTable";
import { Formik, Form } from "formik";
import { _todayDate } from "../../../../_helper/_todayDate";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import Loading from "../../../../_helper/_loading";
import numberWithCommas from "../../../../_helper/_numberWithCommas";
import {
  getDistributionChannelDDL,
  getChannelWiseSalesReportLandingData,
} from "../helper";
import { _currentTime } from "../../../../_helper/_currentTime";
import { TimeFormatter24Hour } from "../../../../_helper/currentDateTime24HourFormat";

// Table Header
const ths = ["Sl", "Product Code", "Product Name", "UoM", "QTY", "Amount"];

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required"),
  fromTime: Yup.string().required("Time is required"),
  toTime: Yup.string().required("Time is required"),
  distributionChannel: Yup.object().shape({
    label: Yup.string().required("Distribution Channel is required"),
    value: Yup.string().required("Distribution Channel is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  fromTime: _currentTime(),
  toTime: _currentTime(),
  distributionChannel: "",
};

export default function ChannelWiseSalesReportLanding() {
  const printRef = useRef();

  const [rowDto, setRowDto] = useState([]);
  const [distributionChannelDDL, setDistributionChannelDDL] = useState([]);
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
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getDistributionChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDistributionChannelDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = async (values, setter) => {
    getChannelWiseSalesReportLandingData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.distributionChannel?.value,
      values?.fromDate,
      values?.toDate,
      TimeFormatter24Hour(values?.fromTime),
      TimeFormatter24Hour(values?.toTime),
      setLoading,
      setter
    );
  };

  // Grand Total
  let totalAmount = 0;
  let totalProductQTY = 0;

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title=""
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <div className="text-center my-2">
                <h3>
                  <b>CHANNEL WISE SALES REPORT</b>
                </h3>
                <h4>
                  <b>{selectedBusinessUnit?.label}</b>
                </h4>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  viewHandler(values, setRowDto);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-4 d-flex">
                          <div className="w-50">
                            <IInput
                              value={values?.fromDate}
                              label="From Date"
                              name="fromDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("fromDate", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>
                          <div className="w-50">
                            <IInput
                              value={values?.fromTime}
                              label="From Time"
                              name="fromTime"
                              type="time"
                              onChange={(e) => {
                                setFieldValue("fromTime", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-lg-4 d-flex">
                          <div className="w-50">
                            <IInput
                              value={values?.toDate}
                              label="To Date"
                              name="toDate"
                              type="date"
                              onChange={(e) => {
                                setFieldValue("toDate", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>
                          <div className="w-50">
                            <IInput
                              value={values?.toTime}
                              label="To Time"
                              name="toTime"
                              type="time"
                              onChange={(e) => {
                                setFieldValue("toTime", e?.target?.value);
                                setRowDto([]);
                              }}
                            />
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <NewSelect
                            name="distributionChannel"
                            options={[
                              { value: 0, label: "All" },
                              ...distributionChannelDDL,
                            ]}
                            value={values?.distributionChannel}
                            label="Distribution Channel"
                            onChange={(valueOption) => {
                              setFieldValue("distributionChannel", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Distribution Channel"
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div>
                          <button
                            type="submit"
                            className="btn btn-primary mt-5"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>
                  </>
                )}
              </Formik>
              {loading && <Loading />}
              <div>
                <ICustomTable ths={ths}>
                  {rowDto?.map((itm, i) => {
                    totalAmount += +itm?.amount;
                    totalProductQTY += +itm?.productQTY;
                    return (
                      <tr key={i}>
                        <td className="text-center"> {i + 1}</td>
                        <td> {itm?.productCode}</td>
                        <td> {itm?.productName}</td>
                        <td> {itm?.uom}</td>
                        <td className="text-center">
                          {" "}
                          {numberWithCommas(itm?.productQTY)}
                        </td>
                        <td className="text-right">
                          {numberWithCommas(itm?.amount?.toFixed(2))}
                        </td>
                      </tr>
                    );
                  })}
                  <tr>
                    <td colSpan="4">
                      <b>Grand Total </b>
                    </td>
                    <td className="text-center">
                      <b>{numberWithCommas(Math.round(totalProductQTY))}</b>
                    </td>
                    <td className="text-right">
                      <b>{numberWithCommas(totalAmount?.toFixed(2))}</b>
                    </td>
                  </tr>
                </ICustomTable>
              </div>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
