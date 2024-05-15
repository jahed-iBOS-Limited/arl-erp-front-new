/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import { getPrevThreeMonth } from "./helper";
import "./style.css";
import useAxiosGet from "./../../../_helper/customHooks/useAxiosGet";
// import { useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _formatMoney } from "../../../_helper/_formatMoney";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { _todayDate } from "../../../_helper/_todayDate";

const currentYear = new Date()
  .getFullYear()
  .toString()
  .slice(-2);

const initData = {
  type: { value: 1, label: "Quaterly" },
  fromDate: _todayDate(),
  toDate: _todayDate(),
};


function PlanActCashFlow() {
  const [rowDato, getRowData, loader, setRowData] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // useEffect(() => {
  //   getRowData(
  //     `/fino/FundManagement/GetFundPlanVsActualCashflow?BusinessUnitId=${selectedBusinessUnit?.value}`
  //   );
  // }, []);

  const totalObj = useMemo(() => {
    let obj = {
      totalTgtForMonthOne: 0,
      totalTgtForMonthTwo: 0,
      totalTgtForMonthThree: 0,
      totalActForMonthOne: 0,
      totalActForMonthTwo: 0,
      totalActForMonthThree: 0,
    };

    // eslint-disable-next-line no-unused-expressions
    rowDato?.forEach((item) => {
      obj["totalTgtForMonthOne"] += item?.numTgtMonthOne;
      obj["totalTgtForMonthTwo"] += item?.numTgtMonthTwo;
      obj["totalTgtForMonthThree"] += item?.numTgtMonthThree;
      obj["totalActForMonthOne"] += item?.numActMonthOne;
      obj["totalActForMonthTwo"] += item?.numActMonthTwo;
      obj["totalActForMonthThree"] += item?.numActMonthThree;
    });

    return obj;
  }, [rowDato]);

  const getTarget = (item) => {
    const totalRowTarget =
      item?.numTgtMonthOne + item?.numTgtMonthTwo + item?.numTgtMonthThree;

    return totalRowTarget || 0;
  };

  const getActual = (item) => {
    const totalRowTarget =
      item?.numActMonthOne + item?.numActMonthTwo + item?.numActMonthThree;

    return totalRowTarget || 0;
  };

  const finalTotalTarget = (itemOne, itemTwo, itemThree) => {
    const total = itemOne + itemTwo + itemThree;
    return total || 0;
  };

  const finalTotalActual = (itemOne, itemTwo, itemThree) => {
    const total = itemOne + itemTwo + itemThree;
    return total || 0;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => { }}
      >
        {({ values, setFieldValue }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Plan Vs Act. Cashflow"}>
                <CardHeaderToolbar></CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {loader && <Loading />}
                <div className="row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={[
                        { value: 1, label: "Quaterly" },
                        { value: 2, label: "Date Wise" }]
                      }
                      value={values?.type}
                      label="Type"
                      onChange={(valueOption) => {
                        setRowData([]);
                        setFieldValue("type", valueOption);
                      }}
                      placeholder="Type"
                    />
                  </div>
                  {
                    values?.type?.value === 2 && (
                      <>
                        <div className="col-lg-3">
                          <InputField
                            label="From Date"
                            value={values?.fromDate}
                            name="fromDate"
                            placeholder="Date"
                            type='date'
                            onChange={(e) => {
                              setRowData([]);
                              setFieldValue("fromDate", e.target.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            label="To Date"
                            value={values?.toDate}
                            name="toDate"
                            placeholder="Date"
                            type='date'
                            onChange={(e) => {
                              setRowData([]);
                              setFieldValue("toDate", e.target.value);
                            }}
                          />
                        </div>
                      </>
                    )
                  }
                  <div style={{ marginTop: "17px" }} className="col-lg">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() => {
                        values?.type?.value === 1 ?
                          getRowData(`/fino/FundManagement/GetFundPlanVsActualCashflow?BusinessUnitId=${selectedBusinessUnit?.value}&TypeId=${values?.type?.value}`)
                          : getRowData(`/fino/FundManagement/GetFundPlanVsActualCashflow?BusinessUnitId=${selectedBusinessUnit?.value}&TypeId=${values?.type?.value
                            }&FromDate=${values?.fromDate}&ToDate=${values?.toDate}`)
                      }}
                      disabled={
                        !values?.type || (
                          values?.type?.value === 2 && (!values?.fromDate || !values?.toDate)
                        )
                      }
                    >
                      View
                    </button>
                  </div>
                </div>

                <div className="plan-act-cashFlow-wrapper loan-scrollable-table  mt-5">
                  <div className="scroll-table _table">
                    {values?.type?.value === 1 ? (<table className="table table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th
                            rowspan="2"
                            style={{ minWidth: "180px" }}
                            className="zIndex"
                          >
                            Description
                          </th>
                          <th colspan="3">{`${getPrevThreeMonth(3)?.slice(
                            0,
                            3
                          )}'${currentYear}`}</th>
                          <th colspan="3">{`${getPrevThreeMonth(2)?.slice(
                            0,
                            3
                          )}'${currentYear}`}</th>
                          <th colspan="3">{`${getPrevThreeMonth(1)?.slice(
                            0,
                            3
                          )}'${currentYear}`}</th>

                          <th colspan="3">Quarter Total</th>
                        </tr>
                        <tr className="plan-act-second-row">
                          <th style={{ minWidth: "80px" }} className="target">
                            Target
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Actual
                          </th>
                          <th style={{ minWidth: "80px" }} className="variance">
                            Variance
                          </th>
                          <th style={{ minWidth: "80px" }} className="target">
                            Target
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Actual
                          </th>
                          <th style={{ minWidth: "80px" }} className="variance">
                            Variance
                          </th>
                          <th style={{ minWidth: "80px" }} className="target">
                            Target
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Actual
                          </th>
                          <th style={{ minWidth: "80px" }} className="variance">
                            Variance
                          </th>
                          <th style={{ minWidth: "80px" }} className="target">
                            Target
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Actual
                          </th>
                          <th style={{ minWidth: "80px" }} className="variance">
                            Variance
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowDato?.length > 0 &&
                          rowDato?.map((item, index) => (
                            <tr>
                              <td className="text-left">
                                {item?.strDescription}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numTgtMonthOne, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numActMonthOne, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(
                                  (item?.numTgtMonthOne || 0) -
                                  (item?.numActMonthOne || 0),
                                  0
                                )}
                              </td>

                              <td className="text-center">
                                {_formatMoney(item?.numTgtMonthTwo, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numActMonthTwo, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(
                                  (item?.numTgtMonthTwo || 0) -
                                  (item?.numActMonthTwo || 0),
                                  0
                                )}
                              </td>

                              <td className="text-center">
                                {_formatMoney(item?.numTgtMonthThree, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numActMonthThree, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(
                                  (item?.numTgtMonthThree || 0) -
                                  (item?.numActMonthThree || 0),
                                  0
                                )}
                              </td>

                              <td className="text-center">
                                {_formatMoney(getTarget(item), 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(getActual(item), 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(
                                  getTarget(item) - getActual(item),
                                  0
                                )}
                              </td>
                            </tr>
                          ))}
                        <tr>
                          <td className="cash-background text-left">
                            Closing Cash in Hand
                          </td>
                          <td className="text-center">
                            {_formatMoney(totalObj?.totalTgtForMonthOne, 0)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(totalObj?.totalActForMonthOne, 0)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(
                              (totalObj?.totalTgtForMonthOne || 0) -
                              (totalObj?.totalActForMonthOne || 0),
                              0
                            )}
                          </td>
                          <td className="text-center">
                            {_formatMoney(totalObj?.totalTgtForMonthTwo, 0)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(totalObj?.totalActForMonthTwo, 0)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(
                              (totalObj?.totalTgtForMonthTwo || 0) -
                              (totalObj?.totalActForMonthTwo || 0),
                              0
                            )}
                          </td>
                          <td className="text-center">
                            {_formatMoney(totalObj?.totalTgtForMonthThree, 0)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(totalObj?.totalActForMonthThree, 0)}
                          </td>
                          <td className="text-center">
                            {_formatMoney(
                              (totalObj?.totalTgtForMonthThree || 0) -
                              (totalObj?.totalActForMonthThree || 0),
                              0
                            )}
                          </td>
                          <td className="text-center">
                            {_formatMoney(
                              finalTotalTarget(
                                totalObj?.totalTgtForMonthOne,
                                totalObj?.totalTgtForMonthTwo,
                                totalObj?.totalTgtForMonthThree
                              ),
                              0
                            )}
                          </td>
                          <td className="text-center">
                            {_formatMoney(
                              finalTotalActual(
                                totalObj?.totalActForMonthOne,
                                totalObj?.totalActForMonthTwo,
                                totalObj?.totalActForMonthThree
                              ),
                              0
                            )}
                          </td>
                          <td className="text-center">
                            {_formatMoney(
                              finalTotalTarget(
                                totalObj?.totalTgtForMonthOne,
                                totalObj?.totalTgtForMonthTwo,
                                totalObj?.totalTgtForMonthThree
                              ) -
                              finalTotalActual(
                                totalObj?.totalActForMonthOne,
                                totalObj?.totalActForMonthTwo,
                                totalObj?.totalActForMonthThree
                              ),
                              0
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>) : (
                      <div className="table-responsive">
 <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>Description</th>
                            <th>Target</th>
                            <th>Actual</th>
                            <th>Variance</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowDato?.length > 0 &&
                            rowDato?.map((item, index) => (
                              <tr>
                                <td className="text-left">
                                  {item?.strDescription}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(item?.numTgtMonthOne, 0)}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(item?.numActMonthOne, 0)}
                                </td>
                                <td className="text-center">
                                  {_formatMoney(
                                    (item?.numTgtMonthOne || 0) -
                                    (item?.numActMonthOne || 0),
                                    0
                                  )}
                                </td>
                              </tr>
                            ))}
                          <tr>
                            <td className="cash-background text-left">
                              Closing Cash in Hand
                            </td>
                            <td className="text-center">
                              {_formatMoney(totalObj?.totalTgtForMonthOne, 0)}
                            </td>
                            <td className="text-center">
                              {_formatMoney(totalObj?.totalActForMonthOne, 0)}
                            </td>
                            <td className="text-center">
                              {_formatMoney(
                                (totalObj?.totalTgtForMonthOne || 0) -
                                (totalObj?.totalActForMonthOne || 0),
                                0
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                      </div>
                     
                    )}
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

export default PlanActCashFlow;
