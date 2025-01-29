import React, { useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import ICard from "../../../../_helper/_card";
import { Formik, Form } from "formik";
import NewSelect from "../../../../_helper/_select";
import * as Yup from "yup";
import { IInput } from "../../../../_helper/_input";
import Loading from "../../../../_helper/_loading";
import {
  // getShipPointDDL,
  getSalesCommissionReportData,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("Date is required"),
  toDate: Yup.date().required("Date is required"),
  shipPoint: Yup.object().shape({
    label: Yup.string().required("Ship Point is required"),
    value: Yup.string().required("Ship Point is required"),
  }),
  type: Yup.object().shape({
    label: Yup.string().required("Report Type is required"),
    value: Yup.string().required("Report Type is required"),
  }),
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
  // shipPoint: { value: 0, label: "All" },
  type: {
    value: 0,
    label: "Pending",
  },
};

export default function SalesCommissionReportLanding() {
  const printRef = useRef();
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState();
  // const [shipPointDDL, setShipPointDDL] = useState([]);

  // Get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  // useEffect(() => {
  //   if (profileData?.accountId && selectedBusinessUnit?.value) {
  //     getShipPointDDL(
  //       profileData?.accountId,
  //       selectedBusinessUnit?.value,
  //       setShipPointDDL
  //     );
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profileData?.accountId, selectedBusinessUnit?.value]);

  const viewHandler = async (values) => {
    console.log("Called");
    getSalesCommissionReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      // values?.shipPoint?.value,
      values?.type?.value,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading
    );
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title="Sales Commission Report"
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
          pageStyle="@page { size: 10in 15in !important; margin: 0mm; } @media print { body { -webkit-print-color-adjust: exact;} }"
        >
          <div>
            {loading && <Loading />}
            <div className="mx-auto">
              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  viewHandler(values);
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
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
                        <div className="col-lg-2">
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

                        {/* <div className="col-lg-3">
                          <NewSelect
                            name="shipPoint"
                            options={[
                              { value: 0, label: "All" },
                              ...shipPointDDL,
                            ]}
                            value={values?.shipPoint}
                            label="Ship Point"
                            onChange={(valueOption) => {
                              setFieldValue("shipPoint", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Ship Point"
                            errors={errors}
                            touched={touched}
                          />
                        </div> */}

                        <div className="col-lg-3">
                          <NewSelect
                            name="type"
                            options={[
                              { value: 0, label: "Pending" },
                              { value: 1, label: "Complete" },
                            ]}
                            value={values?.type}
                            label="Report Type"
                            onChange={(valueOption) => {
                              setFieldValue("type", valueOption);
                              setRowDto([]);
                            }}
                            placeholder="Report Type"
                            errors={errors}
                            touched={touched}
                          />
                        </div>

                        <div className="col-lg-3">
                          <button
                            // type="submit"
                            onClick={() => {
                              viewHandler(values);
                            }}
                            className="btn btn-primary mt-5"
                          >
                            View
                          </button>
                        </div>
                      </div>
                    </Form>

                    <div className="table-responsive">
                      <table
                        ref={printRef}
                        className="table table-striped table-bordered bj-table bj-table-landing table-font-size-sm"
                      >
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Ship Point</th>
                            <th>Challan Code</th>
                            <th>Delivery Date</th>
                            <th>Supplier Name</th>
                            <th>Partner Name</th>
                            <th>Commission Amount</th>
                          </tr>
                        </thead>

                        <tbody>
                          {rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.shipPointName}</td>
                              <td>{item?.challanCode}</td>
                              <td className="text-center">
                                {_dateFormatter(item?.deliveryDate)}
                              </td>
                              <td>{item?.supplierName}</td>
                              <td>{item?.customerName}</td>
                              <td className="text-right">{item?.amount}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
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
