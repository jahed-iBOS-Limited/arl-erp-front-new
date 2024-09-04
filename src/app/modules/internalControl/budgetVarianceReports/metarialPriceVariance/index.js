/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

import Loading from "../../../_helper/_loading";
import numberWithCommas from "../../../_helper/_numberWithCommas";
import NewSelect from "../../../_helper/_select";
import { _getCurrentMonthYearForInput } from "../../../_helper/_todayDate";
// import { fromDateFromApi } from "../../../_helper/_formDateFromApi";

const initData = {
  monthYear: _getCurrentMonthYearForInput(),
  currentBusinessUnit: "",
  isForecast: false,

};
function MaterialPriceVariance() {
  const [rowDto, getRowDto, rowDtoLoader, setrowDto] = useAxiosGet();
  // const [fromDateFApi, setFromDateFApi] = useState("");

  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  // useEffect(() => {
  //   fromDateFromApi(selectedBusinessUnit?.value, setFromDateFApi);
  // }, [selectedBusinessUnit]);

  const getData = (values) => {
    const [year, month] = values?.monthYear.split("-").map(Number);
    const startDate = new Date(Date.UTC(year, month - 1, 1));
    const endDate = new Date(Date.UTC(year, month, 0));
    const formattedStartDate = startDate.toISOString().split("T")[0];
    const formattedEndDate = endDate.toISOString().split("T")[0];
    getRowDto(
      `/fino/Report/GetRawMaterialPriceVarianceReport?intUnitId=${values?.currentBusinessUnit?.value}&fromDate=${formattedStartDate}&toDate=${formattedEndDate}&isForecast=${values?.isForecast}`
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, errors, touched, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Material Price Variance Report"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {rowDtoLoader && <Loading />}
                <div className="global-form row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="currentBusinessUnit"
                      options={businessUnitList}
                      value={values?.currentBusinessUnit}
                      label="Business Unit"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("currentBusinessUnit", valueOption);
                          setrowDto([]);
                        } else {
                          setrowDto([]);
                        }
                      }}
                      placeholder="Business Unit"
                      errors={errors}
                      touched={touched}
                      required={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Month-Year</label>
                    <InputField
                      value={values?.monthYear}
                      name="monthYear"
                      placeholder="From Date"
                      type="month"
                      onChange={(e) => {
                        setrowDto([]);
                        setFieldValue("monthYear", e?.target?.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-1 mt-4">
                    <div className="d-flex align-items-center">
                    <p className="pr-1 pt-3">
                      <input
                        type="checkbox"
                        checked={values?.isForecast} 
                      onChange={(e)=>{
                        setFieldValue("isForecast", e.target.checked);
                      }}
                      />
                    </p>
                    <p>
                      <label>Is Forecast</label>
                    </p>
                  </div>
                    </div>
                  <div>
                    <button
                      style={{ marginTop: "18px" }}
                      type="button"
                      class="btn btn-primary"
                      disabled={!values?.monthYear}
                      onClick={() => {
                        console.log("values", values);
                        getData(values);
                      }}
                    >
                      Show
                    </button>
                  </div>
                </div>
                <div className="row mt-5">
                  <div className="col-lg-12">
                    <div className="table-responsive">
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
                                  {numberWithCommas(
                                    item?.BudgetPrice.toFixed(2)
                                  )}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(
                                    item?.ActualPrice.toFixed(2)
                                  )}
                                </td>
                                <td className="text-right">
                                  {numberWithCommas(item?.Variance.toFixed(2))}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
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
