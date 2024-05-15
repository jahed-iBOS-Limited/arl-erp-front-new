import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";

export default function ViewStopageDetails({ modalInfo }) {
  const { engineName, fromDate, toDate } = modalInfo || {};
  const [
    stopageDetailsByEngine,
    getStopageDetailsByEngine,
    stopageDetailsByEngineLoading,
  ] = useAxiosGet();

  //redux store
  const { value: buId } = useSelector((state) => {
    return state?.authData?.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getStopageDetailsByEngine(
      `/mes/ShopFloor/GetStoppageDetailsByEngine?FromDate=${fromDate}&ToDate=${toDate}&BuId=${buId}&EngineName=${engineName}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromDate, toDate, engineName, buId]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      onSubmit={(values) => {}}
    >
      {() => (
        <IForm
          title="View Stopage Details"
          isHiddenReset
          isHiddenBack
          isHiddenSave
          renderProps={() => {}}
        >
          {stopageDetailsByEngineLoading && <Loading />}
          <form className="form form-label-right ">
            <div className="row">
              <div className="col-lg-12">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Date</th>
                        <th>Shift</th>
                        <th>Time</th>
                        <th>Stopage Details</th>
                        <th>Duration (Min)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stopageDetailsByEngine?.length > 0
                        ? stopageDetailsByEngine?.map((item, index) => (
                            <tr key={index}>
                              <td
                                style={{ width: "30px" }}
                                className="text-center"
                              >
                                {index + 1}
                              </td>
                              <td className="text-center">
                                {_dateFormatter(item?.dteDate)}
                              </td>
                              <td className="text-center">{item?.strShift}</td>
                              <td className="text-center">
                                {`${_timeFormatter(
                                  item?.tmStartTime
                                )} - ${_timeFormatter(item?.tmEndTime)}`}
                              </td>
                              <td>{item?.duration?.split(";")?.[1]}</td>
                              <td className="text-center">
                                {item?.tmTotalHour}
                              </td>
                            </tr>
                          ))
                        : null}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </form>
        </IForm>
      )}
    </Formik>
  );
}
