import React, { useState, useRef } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Plot from 'react-plotly.js';
import { Formik, Form } from "formik";
import * as Yup from "yup";
import "react-pivottable/pivottable.css";
import PivotTableUI from "react-pivottable/PivotTableUI";
import TableRenderers from "react-pivottable/TableRenderers";
import "./style.css"
import ICard from "../../../_helper/_card";
import { _todayDate } from "../../../_helper/_todayDate";
import createPlotlyRenderers from 'react-pivottable/PlotlyRenderers';
import { IInput } from "../../../_helper/_input";
import {
  getDateWiseDeliveryReportData
} from "../helper";
import Loading from "../../../_helper/_loading";


// Validation schema
const validationSchema = Yup.object().shape({
  fromDate: Yup.date().required("From Date is required"),
  toDate: Yup.date().required("To Date is required")
});

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate()
};

export default function DateWiseDeliveryReport() {
  const printRef = useRef();
  const PlotlyRenderers = createPlotlyRenderers(Plot);


  const [rowDto, setRowDto] = useState([]);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    vals: ["totalDeliveryQuantity"],
    aggregatorName: "Sum",
    cols: ["itemCode"],
    renderers: Object.assign({}, TableRenderers, PlotlyRenderers),
    rows: ["deliveryDates"],
  });

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const setPositionHandler = (values) => {
    getDateWiseDeliveryReportData(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      values?.fromDate,
      values?.toDate,
      setRowDto,
      setLoading
    )
  };

  return (
    <Formik>
      <>
        <ICard
          printTitle="Print"
          title=""
          isPrint={true}
          isShowPrintBtn={true}
          componentRef={printRef}
        >
          <div ref={printRef}>
            <div className="mx-auto">
              <div className="text-center my-2">
                <h3>
                  <b className=""> DATE WISE DELIVERY REPORT </b>
                </h3>
                <h4>
                  <b className=""> {selectedBusinessUnit?.label} </b>
                </h4>
              </div>

              <Formik
                enableReinitialize={true}
                initialValues={initData}
                validationSchema={validationSchema}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  // saveHandler(values, () => {
                  //   resetForm(initData);
                  // });
                }}
              >
                {({ values, errors, touched, setFieldValue }) => (
                  <>
                    <Form className="form form-label-right">
                      <div className="form-group row global-form printSectionNone">
                        <div className="col-lg-2">
                          <IInput
                            value={values?.fromDate}
                            label="From date"
                            name="fromDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("fromDate", e?.target?.value);
                            }}
                          />
                        </div>

                        <div className="col-lg-2">
                          <IInput
                            value={values?.toDate}
                            label="To date"
                            name="toDate"
                            type="date"
                            onChange={(e) => {
                              setFieldValue("toDate", e?.target?.value);
                            }}
                          />
                        </div>
                        <div style={{ marginTop: "18px" }} className="col-lg-1">
                          <button
                            disabled={!values?.fromDate || !values?.toDate}
                            className="btn btn-primary"
                            onClick={() => {
                              setPositionHandler(values)
                            }}
                            type="button"
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
              <div className=" my-5">
                  {
                    rowDto?.length>0 && 
                    <div className="pivoteTable-sales-order-Report overflow-auto my-3">
                      <PivotTableUI
                        data={rowDto}
                        onChange={(s) => setData(s)}
                        renderers={Object.assign(
                          {},
                          TableRenderers,
                          PlotlyRenderers
                        )}
                        {...data}
                      />
                    </div>  
                  }
              </div>
            </div>
          </div>
        </ICard>
      </>
    </Formik>
  );
}
