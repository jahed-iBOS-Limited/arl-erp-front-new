import React, { useState, useEffect } from "react";
import moment from "moment";
import { GetHSCodeByTarrifSchedule_api } from "../helper";
import Loading from "./../../../../../_helper/_loading";
function HSCodeInfoModel({ rowClickData }) {
  const [tarrifScheduleInfoOne, setTarrifScheduleInfoOne] = useState([]);
  const [tarrifScheduleInfoTwo, setTarrifScheduleInfoTwo] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    GetHSCodeByTarrifSchedule_api(
      rowClickData?.hsCode,
      1,
      setTarrifScheduleInfoOne,
      setLoading
    );
    GetHSCodeByTarrifSchedule_api(
      rowClickData?.hsCode,
      2,
      setTarrifScheduleInfoTwo,
      setLoading
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowClickData]);
  return (
    <>
      <>
        {loading && <Loading />}
        {/* part One */}
        <div className="form-group row global-form pt-1 mt-1">
          <div className="col-lg-4 d-flex">
            <div className="mr-8">
              <label style={{ display: "block" }}>
                <span style={{ fontWeight: "bold" }}>HSCode: </span>{" "}
                {rowClickData?.hsCode}
              </label>
            </div>
            {tarrifScheduleInfoOne?.length > 0 && (
              <div className="">
                <label style={{ display: "block" }}>
                  <span style={{ fontWeight: "bold" }}>Unit: </span>{" "}
                  {tarrifScheduleInfoOne?.[0]?.strUnit}
                </label>
              </div>
            )}
          </div>
          <div className="col-lg-8">
            <label style={{ display: "block" }}>
              <span style={{ fontWeight: "bold" }}>Description: </span>{" "}
              {rowClickData?.description}
            </label>
          </div>
          {tarrifScheduleInfoOne?.length > 0 && (
            <>
              <div className="col-12 text-center" style={{ fontSize: "14px" }}>
                <b>Tarrif Schedule</b>
              </div>
              <div className="d-flex justify-content-between w-100 px-4">
                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>CD: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.cd}
                  </label>
                </div>
                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>RD: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.rd}
                  </label>
                </div>

                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>SD: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.sd}
                  </label>
                </div>
                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>Vat: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.vat}
                  </label>
                </div>
                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>AIT: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.ait}
                  </label>
                </div>

                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>AT: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.atv}
                  </label>
                </div>
                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>TTI: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.tti}
                  </label>
                </div>
                <div className="">
                  <label style={{ display: "block" }}>
                    <span style={{ fontWeight: "bold" }}>EXD: </span>{" "}
                    {tarrifScheduleInfoOne?.[0]?.exd}
                  </label>
                </div>
              </div>
            </>
          )}
        </div>
        {/* part Two */}
        {tarrifScheduleInfoTwo?.length > 0 && (
          <div className="form-group row global-form mt-1 pt-1">
            <div className="col-lg-12 text-center" style={{ fontSize: "14px" }}>
              <b>Tafsil</b>
            </div>

            <div className="table-responsive">
              <table className="table table-striped table-bordered global-table mt-1">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Tafsil</th>
                    <th>SD</th>
                    <th>Vat</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  {tarrifScheduleInfoTwo?.map((item, idx) => (
                    <tr key={idx}>
                      <td>{idx + 1}</td>
                      <td>{item?.scheduleType}</td>
                      <td>{item?.sd}</td>
                      <td>{item?.vat}</td>
                      <td>
                        {`${moment(item?.fiscalYear).format("YYYY")}-${+moment(
                          item?.fiscalYear
                        ).format("YYYY") + 1}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </>
    </>
  );
}

export default HSCodeInfoModel;
