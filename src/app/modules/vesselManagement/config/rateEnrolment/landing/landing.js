/* eslint-disable react-hooks/exhaustive-deps */
import { Formik } from "formik";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../../_helper/_customCard";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import IApproval from "../../../../_helper/_helperIcons/_approval";
import IEdit from "../../../../_helper/_helperIcons/_edit";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import IButton from "../../../../_helper/iButton";
import ICon from "../../../../chartering/_chartinghelper/icons/_icon";
import { PortAndMotherVessel } from "../../../common/components";
import { splitNumber } from "../form/addEditForm";
import { rateEnrollmentUpdate } from "../helper";

const initData = {
  port: "",
  motherVessel: "",
  year: "",
};

const RateEnrolmentLanding = () => {
  const history = useHistory();
  const [rowData, getRowData, isLoading, setRowData] = useAxiosGet();
  const [tempRows, setTempRows] = useState([]);
  const [loading, setLoading] = useState(false);

  // get user profile data from store
  const {
    profileData: { userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getData = (values) => {
    const url = `/tms/VehicleExpenseRegister/GetMOPCosting?businessUnitId=${buId}&mVesselId=${values
      ?.motherVessel?.value || 0}&costingYear=${values?.year?.value}`;

    getRowData(url, (resData) => {
      const modifyData = resData?.map((item) => ({ ...item, isEdit: false }));
      setRowData(modifyData);
      setTempRows(modifyData.map((item) => ({ ...item, isTemp: true })));
    });
  };

  const updateRates = (values, item) => {
    const distanceSlabs = splitNumber(item?.distance);
    const totalRate =
      item?.costDistance1to100 +
      item?.costDistance101to200 +
      item?.costDistance201to300 +
      item?.costDistance301to400 +
      item?.costDistance401to500;

    const taxAndVat = totalRate * 0.175;
    const totalCost =
      taxAndVat +
      +item?.invoice +
      +item?.labourBill +
      +item?.transportationCost;
    // +item?.additionalCost;

    const billAmount = totalRate * +item?.quantity;
    const totalReceived = totalRate - totalCost;
    const costAmount = totalCost * +item?.quantity;
    const profitAmount = billAmount - costAmount;
    const payload = {
      id: item?.id,
      businessUnitId: buId,
      businessUnitName: buName,
      mvesselId: item?.mvesselId,
      mvesselName: item?.mvesselName,
      routeDescription: item?.routeDescription,
      distance: item?.distance,
      distance1to100: distanceSlabs[0],
      costDistance1to100: item?.costDistance1to100,
      distance101to200: distanceSlabs[1],
      costDistance101to200: item?.costDistance101to200,
      distance201to300: distanceSlabs[2],
      costDistance201to300: item?.costDistance201to300,
      distance301to400: distanceSlabs[3],
      costDistance301to400: item?.costDistance301to400,
      distance401to500: distanceSlabs[4],
      costDistance401to500: item?.costDistance401to500,
      totalDistanceCost: totalRate,
      taxVatpercentage: 17.5,
      taxVat: taxAndVat,
      invoice: item?.invoice,
      labourBill: item?.labourBill,
      transportationCost: item?.transportationCost,
      additionalCost: item?.additionalCost,
      totalCost: totalCost,
      totalReceived: totalReceived,
      quantity: item?.quantity,
      billAmount: billAmount,
      costAmount: costAmount,
      profitAmount: profitAmount,
      costingYear: item?.costingYear,
      isActive: true,
      insertBy: userId,
      insertDateTime: item?.insertDateTime,
      updateBy: userId,
      updateDateTime: new Date(),
    };

    rateEnrollmentUpdate(payload, setLoading, () => {
      getData(values);
    });
  };

  const editableUIHandler = ({ index, status, action, values, item }) => {
    if (action === "cancel") {
      setRowData(tempRows);
    } else if (action === "done") {
      updateRates(values, item);
    } else {
      let _data = [...rowData];
      _data[index].isEdit = status;
      setRowData(_data);
    }
  };

  const rowDataHandler = (name, index, value) => {
    let _data = [...rowData];
    _data[index][name] = value;
    if (name === "distance") {
      const distanceSlabs = splitNumber(value);
      _data[index].costDistance1to100 = distanceSlabs[0] * 10 || "";
      _data[index].costDistance101to200 = distanceSlabs[1] * 3 || "";
      _data[index].costDistance201to300 = distanceSlabs[2] * 1.5 || "";
      _data[index].costDistance301to400 = distanceSlabs[3] * 1.5 || "";
      _data[index].costDistance401to500 = distanceSlabs[4] * 1.3 || "";
    }

    setRowData(_data);
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
              {(isLoading || loading) && <Loading />}

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
                            <th style={{ minWidth: "60px" }} rowSpan={2}>
                              Action
                            </th>
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
                            const totalRate =
                              item?.costDistance1to100 +
                              item?.costDistance101to200 +
                              item?.costDistance201to300 +
                              item?.costDistance301to400 +
                              item?.costDistance401to500;

                            const taxAndVat = totalRate * 0.175;
                            const totalCost =
                              taxAndVat +
                              +item?.invoice +
                              +item?.labourBill +
                              +item?.transportationCost;
                            // +item?.additionalCost;

                            const billAmount = totalRate * +item?.quantity;
                            const totalReceived = totalRate - totalCost;
                            const costAmount = totalCost * +item?.quantity;
                            const profitAmount = billAmount - costAmount;
                            return (
                              <tr key={i}>
                                <td className="text-right">
                                  <div className="d-flex justify-content-around">
                                    {!item?.isEdit ? (
                                      <span
                                        className="cursor-pointer"
                                        onClick={() => {
                                          editableUIHandler({
                                            index: i,
                                            status: true,
                                          });
                                        }}
                                      >
                                        <IEdit />
                                      </span>
                                    ) : (
                                      <>
                                        <span
                                          className="cursor-pointer mr-2"
                                          onClick={() => {
                                            editableUIHandler({
                                              index: i,
                                              status: false,
                                              action: "cancel",
                                            });
                                          }}
                                        >
                                          <ICon title="Cancel">
                                            <i class="fas fa-times-circle"></i>
                                          </ICon>
                                        </span>
                                        <span
                                          onClick={() => {
                                            editableUIHandler({
                                              index: i,
                                              status: false,
                                              action: "done",
                                              values,
                                              item,
                                            });
                                          }}
                                        >
                                          <IApproval title="Done" />
                                        </span>
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="text-center">{i + 1}</td>
                                <td>{item?.routeDescription}</td>
                                <td>
                                  {item?.isEdit ? (
                                    <InputField
                                      name="distance"
                                      placeholder="Distance (km)"
                                      type="number"
                                      value={item?.distance}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "distance",
                                          i,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.distance
                                  )}
                                </td>
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
                                  {_fixedPoint(totalRate, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(taxAndVat, false, 2)}
                                </td>
                                <td className="text-right">
                                  {item?.isEdit ? (
                                    <InputField
                                      name="invoice"
                                      placeholder="Invoice"
                                      type="number"
                                      value={item?.invoice || ""}
                                      disabled={false}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "invoice",
                                          i,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.invoice || ""
                                  )}
                                </td>
                                <td className="text-right">
                                  {item?.isEdit ? (
                                    <InputField
                                      name="labourBill"
                                      placeholder="Labour Bill"
                                      type="number"
                                      value={item?.labourBill || ""}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "labourBill",
                                          i,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.labourBill
                                  )}
                                </td>
                                <td className="text-right">
                                  {item?.isEdit ? (
                                    <InputField
                                      name="transportationCost"
                                      placeholder="Transport Cost"
                                      type="number"
                                      value={item?.transportationCost || ""}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "transportationCost",
                                          i,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.transportationCost
                                  )}
                                </td>
                                <td className="text-right">
                                  {item?.isEdit ? (
                                    <InputField
                                      name="additionalCost"
                                      placeholder="Additional Cost"
                                      type="number"
                                      value={item?.additionalCost || ""}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "additionalCost",
                                          i,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.additionalCost
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(totalCost, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(totalReceived, true)}
                                </td>
                                <td className="text-right">
                                  {item?.isEdit ? (
                                    <InputField
                                      name="quantity"
                                      placeholder="Quantity"
                                      type="number"
                                      value={item?.quantity || ""}
                                      onChange={(e) => {
                                        rowDataHandler(
                                          "quantity",
                                          i,
                                          e?.target?.value
                                        );
                                      }}
                                    />
                                  ) : (
                                    item?.quantity
                                  )}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(billAmount, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(costAmount, true)}
                                </td>
                                <td className="text-right">
                                  {_fixedPoint(profitAmount, true)}
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
