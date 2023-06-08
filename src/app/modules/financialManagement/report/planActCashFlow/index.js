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
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import { _formatMoney } from "../../../_helper/_formatMoney";

const currentYear = new Date()
  .getFullYear()
  .toString()
  .slice(-2);

function PlanActCashFlow() {
  const [rowDato, getRowData, loader] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/fino/FundManagement/GetFundPlanVsActualCashflow?BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);

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

  // const getTarget = () => {
  //   const target = rowDato?.reduce(
  //     (acc, item) =>
  //       acc +
  //       item?.numTgtMonthOne +
  //       item?.numTgtMonthTwo +
  //       item?.numTgtMonthThree,
  //     0
  //   );
  //   return target || 0;
  // };

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
        initialValues={{}}
        // validationSchema={{}}
        onSubmit={() => {}}
      >
        {({ values }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader title={"Plan Vs Act. Cashflow"}>
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
                {loader && <Loading />}
                <div className="plan-act-cashFlow-wrapper loan-scrollable-table  mt-5">
                  <div className="scroll-table _table">
                    <table className="table table-bordered bj-table bj-table-landing">
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

export default PlanActCashFlow;
