/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../_metronic/_partials/controls";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import useAxiosGet from "./../../../_helper/customHooks/useAxiosGet";
import "./style.css";

function DeletableReport() {
  const [rowDato, getRowData, loader] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getRowData(
      `/fino/FundManagement/GetFundPlanVsActualCashflow?BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);

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
              <CardHeader title={"Payable Ageing Report"}>
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
                            Supplier ID
                          </th>
                          <th
                            rowspan="2"
                            style={{ minWidth: "180px" }}
                            className="zIndex"
                          >
                            Supplier Name
                          </th>
                          <th
                            rowspan="2"
                            style={{ minWidth: "180px" }}
                            className="zIndex"
                          >
                            Present Status/Balance
                          </th>
                          <th colspan="2">30 Days</th>
                          <th colspan="2">60 Days</th>
                          <th colspan="2">90 Days</th>
                          <th colspan="2">180 Days</th>
                        </tr>
                        <tr className="plan-act-second-row">
                          <th style={{ minWidth: "80px" }} className="target">
                            Qty
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Value
                          </th>
                          <th style={{ minWidth: "80px" }} className="target">
                            Qty
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Value
                          </th>
                          <th style={{ minWidth: "80px" }} className="target">
                            Qty
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Value
                          </th>
                          <th style={{ minWidth: "80px" }} className="target">
                            Qty
                          </th>
                          <th style={{ minWidth: "80px" }} className="actual">
                            Value
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
                              <td className="text-left">
                                {item?.strDescription}
                              </td>
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
                                {_formatMoney(item?.numTgtMonthTwo, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numActMonthTwo, 0)}
                              </td>

                              <td className="text-center">
                                {_formatMoney(item?.numTgtMonthThree, 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(item?.numActMonthThree, 0)}
                              </td>

                              <td className="text-center">
                                {_formatMoney(getTarget(item), 0)}
                              </td>
                              <td className="text-center">
                                {_formatMoney(getActual(item), 0)}
                              </td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="row">
                  <div className="col-lg-12">
                    <table className="table table-striped table-bordered global-table mt-5">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>PO No.</th>
                          <th>MRR No/Arrival No.</th>
                          <th>MRR Date</th>
                          <th>Value</th>
                          <th>Payment Date as per PO</th>
                          <th>Actual Payment Date</th>
                          <th>No. of Days Count</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[1, 2, 3]?.map((item, index) => (
                          <tr>
                            <td>{index + 1}</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
                            <td>1</td>
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

export default DeletableReport;
