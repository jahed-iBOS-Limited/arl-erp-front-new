/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { _formatMoney } from "../../../_helper/_formatMoney";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import { fromDateFromApi } from "../../../_helper/_formDateFromApi";

const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
function MaterialPriceVariance() {
  const [rowDto, getRowDto] = useAxiosGet();
  const [fromDateFApi, setFromDateFApi] = useState("");

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(()=>{
    fromDateFromApi(selectedBusinessUnit?.value, setFromDateFApi)

  },[selectedBusinessUnit])

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{...initData, fromDate: fromDateFApi}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Material Price Variance"}>
                <CardHeaderToolbar>
                  {/* <button
                    onClick={() => {
                      history.push({
                        pathname: `/financial-management/invoicemanagement-system/salesInvoice/create`,
                        state: values,
                      });
                    }}
                    className="btn btn-primary ml-2"
                    type="button"
                  >
                    Create
                  </button> */}
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {false && <Loading />}
                <div className="global-form row">
                  <div className="col-lg-3">
                    <label>From Date</label>
                    <InputField
                      value={values?.fromDate}
                      name="fromDate"
                      placeholder="From Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("fromDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>To Date</label>
                    <InputField
                      value={values?.toDate}
                      name="toDate"
                      placeholder="To Date"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("toDate", e?.target?.value);
                      }}
                    />
                  </div>
                  <div>
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={!values?.fromDate || !values?.toDate}
                      onClick={() => {
                        getRowDto(
                          `/fino/Report/GetRawMaterialPriceVarianceReport?intUnitId=${selectedBusinessUnit?.value}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`
                        );
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Materials</th>
                          <th>UOM</th>
                          <th> Budget Price(Rate)</th>
                          <th> Actual Price(Rate)</th>
                          <th>Variance</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDto?.length > 0 &&
                          rowDto?.map((item, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.ItemName}</td>
                              <td>{item?.UoM}</td>
                              <td className="text-right">
                                {_formatMoney(item?.BudgetPrice)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.ActualPrice)}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.Variance)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}

export default MaterialPriceVariance;
