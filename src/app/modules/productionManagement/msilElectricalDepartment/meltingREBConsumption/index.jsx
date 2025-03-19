/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import ICustomCard from "../../../_helper/_customCard";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";
import "./style.css";

const initData = {
  date: _todayDate(),
};

export default function MeltingREBConsumption() {
  const [landingData, getLandingData, lodar, setRowDto] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = (values, cb) => {
    // console.log("values", values);
  };

  console.log("landingData", landingData);

  const pushData = () => {
    const modifiedArray = landingData.map((item) => {
      return {
        ...item,
        intActionBy: profileData?.userId,
        dteActionDate: _todayDate(),
        isActive: true,
      };
    });

    saveData(
      `/mes/MSIL/CreateEditElectricalMeltingRebConsumption`,
      modifiedArray,
      "",
      true
    );
  };

  const dataHandler = (name, value, sl) => {
    const xData = [...landingData];
    xData[sl][name] = value;
    setRowDto([...xData]);
  };

  const meltingTotalREBUsed = (
    MpanelNo,
    meltingPanelEndKwh,
    meltingPanelStartKwh,
    i,
    name
  ) => {
    // if (MpanelNo === 2) {
    //   const data = [...landingData];
    //   data[i][name] = +(
    //     (meltingPanelEndKwh - meltingPanelStartKwh) *
    //     1000000
    //   ).toFixed(2);
    //   return ((meltingPanelEndKwh - meltingPanelStartKwh) * 1000000).toFixed(2);
    // }
    const data = [...landingData];
    data[i][name] = +(meltingPanelEndKwh - meltingPanelStartKwh).toFixed(2);
    return (meltingPanelEndKwh - meltingPanelStartKwh).toFixed(2);
  };

  const sinteringTotalREBUsed = (
    MpanelNo,
    sinteringPanelEndKwh,
    sinteringPanelStartKwh,
    i,
    name
  ) => {
    // if (MpanelNo === 2) {
    //   const data = [...landingData];
    //   data[i][name] = +(
    //     (sinteringPanelEndKwh - sinteringPanelStartKwh) *
    //     1000
    //   ).toFixed(2);
    //   return ((sinteringPanelEndKwh - sinteringPanelStartKwh) * 1000).toFixed(
    //     2
    //   );
    // }
    const data = [...landingData];
    data[i][name] = +(sinteringPanelEndKwh - sinteringPanelStartKwh).toFixed(2);
    return (sinteringPanelEndKwh - sinteringPanelStartKwh).toFixed(2);
  };

  const grandTotal = (
    MpanelNo,
    meltingPanelEndKwh,
    meltingPanelStartKwh,
    sinteringPanelEndKwh,
    sinteringPanelStartKwh,
    i,
    name
  ) => {
    // if (MpanelNo === 2) {
    //   const data = [...landingData];
    //   data[i][name] = +(
    //     (meltingPanelEndKwh - meltingPanelStartKwh) * 1000000 +
    //     (sinteringPanelEndKwh - sinteringPanelStartKwh) * 1000
    //   ).toFixed(2);
    //   return (
    //     (meltingPanelEndKwh - meltingPanelStartKwh) * 1000000 +
    //     (sinteringPanelEndKwh - sinteringPanelStartKwh) * 1000
    //   ).toFixed(2);
    // }
    const data = [...landingData];
    data[i][name] = +(
      meltingPanelEndKwh -
      meltingPanelStartKwh +
      (sinteringPanelEndKwh - sinteringPanelStartKwh)
    ).toFixed(2);
    return (
      meltingPanelEndKwh -
      meltingPanelStartKwh +
      (sinteringPanelEndKwh - sinteringPanelStartKwh)
    ).toFixed(2);
  };

  return (
    <div>
      <ICustomCard
        title="Melting REB Consumption Report"
        renderProps={() =>
          !!landingData?.length && (
            <button className="btn btn-primary" onClick={pushData}>
              Save
            </button>
          )
        }
      >
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {});
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {lodar && <Loading />}
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.date}
                      label="Date"
                      name="date"
                      type="date"
                    />
                  </div>

                  <div style={{ marginTop: "15px" }} className="col-lg-1">
                    <button
                      type="button"
                      onClick={() => {
                        setRowDto([]);
                        getLandingData(
                          `/mes/MSIL/GetElectricalMeltingRebConsumption?userDate=${values?.date}
                          `
                        );
                      }}
                      className="btn btn-primary mt-1"
                      disabled={!values?.date}
                    >
                      Show
                    </button>
                  </div>
                </div>

                <div style={{ marginTop: "15px" }}>
                  <div className="reb-consumption-report-table">
                    {landingData.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table">
                          <thead>
                            <tr>
                              <th colSpan={8}></th>
                              <th colSpan={3}>Melting Panel REB</th>
                              <th colSpan={3}>Sintering Panel REB</th>
                              <th rowSpan={2}>Grand Total REB Used</th>
                            </tr>
                            <tr>
                              <th style={{ minWidth: "25px" }}>SL</th>
                              <th>Heat No</th>
                              <th>M. Panel No</th>
                              <th>Curcible No</th>
                              <th>Curcible Lining Heat No</th>
                              <th>Start Time</th>
                              <th>Stop Time</th>
                              <th>Total Time Hour</th>
                              <th>Start KWH Meter Reading</th>
                              <th>End KWH Meter Reading</th>
                              <th>Total REB Used</th>
                              <th>Start KWH Meter Reading</th>
                              <th>End KWH Meter Reading</th>
                              <th>Total REB Used</th>
                            </tr>
                          </thead>
                          <tbody>
                            {landingData.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">{index + 1}</td>
                                <td className="text-center">
                                  {item?.strHeatNo}
                                </td>
                                <td className="text-center">
                                  {item?.intMpanelNo}
                                </td>
                                <td className="text-center">
                                  {item?.intCrucibleNo}
                                </td>
                                <td className="text-center">
                                  {item?.intCrucibleLiningHeatNo}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmHeatStartTime)}
                                </td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmHeatEndTime)}
                                </td>
                                <td className="text-center">
                                  {item?.tmTotalHeatTime &&
                                    item?.tmTotalHeatTime?.split(":")?.[0] +
                                      "H"}{" "}
                                  {item?.tmTotalHeatTime &&
                                    item?.tmTotalHeatTime?.split(":")?.[1] +
                                      "M"}
                                </td>
                                <td className="text-center">
                                  <div className="text-center">
                                    <input
                                      onChange={(e) => {
                                        dataHandler(
                                          "numMeltingPanelStartKwh",
                                          Math.abs(e.target.value),
                                          index
                                        );
                                      }}
                                      step={"any"}
                                      min="0"
                                      required
                                      className="form-control"
                                      type="number"
                                      name="numMeltingPanelStartKwh"
                                      defaultValue={
                                        item?.numMeltingPanelStartKwh >= 0
                                          ? item?.numMeltingPanelStartKwh
                                          : ""
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="text-center">
                                  <div className="text-center">
                                    <input
                                      onChange={(e) => {
                                        dataHandler(
                                          "numMeltingPanelEndKwh",
                                          Math.abs(e.target.value),
                                          index
                                        );
                                      }}
                                      step={"any"}
                                      min="0"
                                      className="form-control"
                                      type="number"
                                      name="numMeltingPanelEndKwh"
                                      defaultValue={
                                        item?.numMeltingPanelEndKwh >= 0
                                          ? item?.numMeltingPanelEndKwh
                                          : ""
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="text-center">
                                  {meltingTotalREBUsed(
                                    item?.intMpanelNo,
                                    item?.numMeltingPanelEndKwh,
                                    item?.numMeltingPanelStartKwh,
                                    index,
                                    "numMeltingPanelTotalKwhcal"
                                  )}
                                </td>
                                <td>
                                  <div className="text-center">
                                    <input
                                      onChange={(e) => {
                                        dataHandler(
                                          "numSinteringPanelStartKwh",
                                          Math.abs(e.target.value),
                                          index
                                        );
                                      }}
                                      step={"any"}
                                      min="0"
                                      required
                                      className="form-control"
                                      type="number"
                                      name="numSinteringPanelStartKwh"
                                      defaultValue={
                                        item?.numSinteringPanelStartKwh >= 0
                                          ? item?.numSinteringPanelStartKwh
                                          : ""
                                      }
                                    />
                                  </div>
                                </td>
                                <td>
                                  <div className="text-center">
                                    <input
                                      onChange={(e) => {
                                        dataHandler(
                                          "numSinteringPanelEndKwh",
                                          Math.abs(e.target.value),
                                          index
                                        );
                                      }}
                                      step={"any"}
                                      min="0"
                                      required
                                      className="form-control"
                                      type="number"
                                      name="numSinteringPanelEndKwh"
                                      defaultValue={
                                        item?.numSinteringPanelEndKwh >= 0
                                          ? item?.numSinteringPanelEndKwh
                                          : ""
                                      }
                                    />
                                  </div>
                                </td>
                                <td className="text-center">
                                  {sinteringTotalREBUsed(
                                    item?.intMpanelNo,
                                    item?.numSinteringPanelEndKwh,
                                    item?.numSinteringPanelStartKwh,
                                    index,
                                    "numSinteringPanelTotalKwhcal"
                                  )}
                                </td>
                                <td className="text-center">
                                  {grandTotal(
                                    item?.intMpanelNo,
                                    item?.numMeltingPanelEndKwh,
                                    item?.numMeltingPanelStartKwh,
                                    item?.numSinteringPanelEndKwh,
                                    item?.numSinteringPanelStartKwh,
                                    index,
                                    "numGrandTotalRebUsedKwhcal"
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </ICustomCard>
    </div>
  );
}
