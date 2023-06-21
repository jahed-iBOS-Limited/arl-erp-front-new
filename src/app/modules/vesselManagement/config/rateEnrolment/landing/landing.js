/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import { PortAndMotherVessel } from "../../../common/components";

const initData = {
  port: "",
  motherVessel: "",
  year: "",
};

const RateEnrolmentLanding = () => {
  const history = useHistory();
  const [rowData, getRowData, isLoading] = useAxiosGet();

  // get user profile data from store
  const {
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values) => {
    const url = `/tms/VehicleExpenseRegister/GetMOPCosting?businessUnitId=${buId}&mVesselId=${values
      ?.motherVessel?.value || 0}&costingYear=${values?.year?.value}`;

    getRowData(url);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue }) => (
          <>
            <ICustomCard
              title={"Rate Enrolment"}
              createHandler={() => {
                history.push(
                  "/vessel-management/configuration/rateenrollment/config"
                );
              }}
            >
              {isLoading && <Loading />}

              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <PortAndMotherVessel obj={{ values, setFieldValue }} />
                    <YearMonthForm
                      obj={{ values, setFieldValue, month: false }}
                    />
                    <IButton
                      onClick={() => {
                        getData(values);
                      }}
                    />
                  </div>
                </div>
                {rowData?.length > 0 && (
                  <div className="loan-scrollable-table inventory-statement-report">
                    <div
                      style={{ maxHeight: "500px" }}
                      className="scroll-table _table"
                    >
                      <table
                        className={
                          "table table-striped table-bordered bj-table bj-table-landing "
                        }
                      >
                        <thead>
                          <tr>
                            <th style={{ minWidth: "30px" }} rowSpan={2}>
                              SL
                            </th>
                            <th style={{ minWidth: "200px" }} rowSpan={2}>
                              Description of Route
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Distance (km)
                            </th>
                            <th style={{ minWidth: "500px" }} colSpan={5}>
                              Rate per Kilo
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Total Rate <br />
                              17.30
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Tax & Vat <br />
                              17.50%
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Invoice <br />
                              10 tk
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Labour Bill
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Transport Cost
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Additional Cost (ReBag + short)
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Total Cost
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Total Received
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Quantity
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Bill Amount
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Cost Amount
                            </th>
                            <th style={{ minWidth: "100px" }} rowSpan={2}>
                              Profit Amount
                            </th>
                          </tr>
                          <tr>
                            <th style={{ minWidth: "100px" }}>
                              0-100 <br /> (10.00)
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              101-200 <br />
                              (3.00)
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              201-300 <br />
                              (1.50)
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              301-400 <br /> (1.50)
                            </th>
                            <th style={{ minWidth: "100px" }}>
                              401-500 <br />
                              (1.30)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {rowData?.map((item, i) => {
                            return (
                              <tr key={i}>
                                <td className="text-center">{i + 1}</td>
                                <td>{item?.routeDescription}</td>
                                <td>{item?.distance}</td>
                                <td className="text-right">
                                  {item?.costDistance1to100}
                                </td>
                                <td className="text-right">
                                  {item?.costDistance101to200}
                                </td>
                                <td className="text-right">
                                  {item?.costDistance201to300}
                                </td>
                                <td className="text-right">
                                  {item?.costDistance301to400}
                                </td>
                                <td className="text-right">
                                  {item?.costDistance401to500}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.totalDistanceCost, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.taxVat, false, 2)}
                                </td>
                                <td className="text-right">{item?.invoice || ""}</td>
                                <td className="text-right">{item?.labourBill}</td>
                                <td className="text-right">{item?.transportationCost}</td>
                                <td className="text-right">{item?.additionalCost}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.totalCost, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.totalReceived, true)}
                                </td>
                                <td className="text-right">{item?.quantity}</td>
                                <td className="text-right">
                                  {_fixedPoint(item?.billAmount, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.costAmount, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(item?.profitAmount, true)}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default RateEnrolmentLanding;
