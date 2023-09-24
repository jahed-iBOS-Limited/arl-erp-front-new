import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { downloadFile } from "../../../_helper/downloadFile";
import InputField from "../../../_helper/_inputField";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { _todayDate } from "./../../../_helper/_todayDate";
import { filterHandler } from "./helper";
import "./style.css";
import IView from "../../../_helper/_helperIcons/_view";
import IViewModal from "../../../_helper/_viewModal";
import ViewStopageDetails from "./viewStopageDetails";
const initData = {
  fromDate: _todayDate(),
  toDate: _todayDate(),
};
export default function PowerPlantReport() {
  const [reportData, getReportData, getLoading, setReportData] = useAxiosGet();
  const [isLoading, setLoading] = useState(false);
  const [stoppageDetails, setStoppageDetails] = useState({});
  const [isShowModal, setIsShowModal] = useState(false);
  const [modalInfo, setModalInfo] = useState(null);
  const [powerGeneration, setPowerGeneration] = useState({});
  const [individualPowerConsumption, setIndividualPowerConsumption] = useState({});

  // redux store
  const { selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  // remove nullish data
  const removeNullishData = (res) => {
    const filteredData = res?.filter((item)=> item?.particularsName);
    setReportData(filteredData || []);
  }

  // separate data section wise
  useEffect(() => {
    const stoppageDetailsData = filterHandler(reportData, 3);
    setStoppageDetails(stoppageDetailsData);

    const individualPowerConsumption = {
      totalConsumptiom: filterHandler(reportData, 6),
      rebConsumptiom: filterHandler(reportData, 7),
    };
    setIndividualPowerConsumption(individualPowerConsumption);

    const powerGeneration = {
      partOne: filterHandler(reportData, 1),
      partTwo: filterHandler(reportData, 2),
      partThree: filterHandler(reportData, 8),
    };
    setPowerGeneration(powerGeneration);
  }, [reportData]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
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
          {(getLoading || isLoading) && <Loading />}
          <IForm
            title="Power Plant Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <>
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    type="date"
                    name="fromDate"
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    type="date"
                    name="toDate"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    disabled={!values?.fromDate || !values?.toDate}
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    onClick={() => {
                      getReportData(
                        `/mes/ShopFloor/PowerPlantReport?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BuId=${selectedBusinessUnit?.value}&isDownLoad=false`,
                        removeNullishData
                      );
                    }}
                  >
                    Show
                  </button>
                </div>
                <div className="ml-5">
                  <button
                    type="button"
                    disabled={
                      !values?.fromDate ||
                      !values?.toDate ||
                      !reportData?.length
                    }
                    style={{ marginTop: "17px" }}
                    className="btn btn-primary"
                    onClick={() => {
                      downloadFile(
                        `/mes/ShopFloor/PowerPlantReport?FromDate=${values?.fromDate}&ToDate=${values?.toDate}&BuId=${selectedBusinessUnit?.value}&isDownLoad=true`,
                        "Power Plant Report",
                        "xlsx",
                        setLoading
                      );
                    }}
                  >
                    Export Excel
                  </button>
                </div>
              </div>
              <div className="header-section">
                <h3 className="text-center">{selectedBusinessUnit?.label}</h3>
                <h6 className="text-center">
                  {selectedBusinessUnit?.businessUnitAddress}
                </h6>
                <h4 className="text-center">
                  Daily report-Power Generation and Consumption
                </h4>
                <h6 className="text-center border border-dark p-1">
                  <strong style={{ marginRight: "20px" }}>
                    {" "}
                    From Date: {values?.fromDate}
                  </strong>{" "}
                  <strong>To Date: {values?.toDate}</strong>
                </h6>
              </div>
              <div className="power-plant-report-wrapper">
                <div className="mt-5">
                  <div className="table-three border border-dark p-1">
                    <table>
                      <thead>
                        <tr>
                          <th>Individual Power Consumption</th>
                        </tr>
                      </thead>
                    </table>

                    <div className="d-flex justify-content-between">
                      <div className="left-table">
                        <table>
                          <thead>
                            <tr>
                              <th colSpan="4">Total Consumptiom</th>
                            </tr>
                            <tr>
                              <th>Plant</th>
                              <th>Pick</th>
                              <th>Off-Pick</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {individualPowerConsumption?.totalConsumptiom
                              ?.length ? (
                              individualPowerConsumption?.totalConsumptiom?.map(
                                (item, i) => (
                                  <tr key={i}>
                                    <td>{item?.particularsName}</td>
                                    <td className="text-center">
                                      {item?.particualarsAlpha}
                                    </td>
                                    <td className="text-center">
                                      {item?.particualarsBeta}
                                    </td>
                                    <td className="text-center">
                                      {item?.particualarsGamma}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan="4">.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                      <div className="right-table ml-5">
                        <table>
                          <thead>
                            <tr>
                              <th colSpan="4">REB Consumptiom</th>
                            </tr>
                            <tr>
                              <th>Plant</th>
                              <th>Pick</th>
                              <th>Off-Pick</th>
                              <th>Total</th>
                            </tr>
                          </thead>
                          <tbody>
                            {individualPowerConsumption?.rebConsumptiom
                              ?.length ? (
                              individualPowerConsumption?.rebConsumptiom?.map(
                                (item, i) => (
                                  <tr key={i}>
                                    <td>
                                      {item?.particularsName === "A--total--"
                                        ? ""
                                        : item?.particularsName}
                                    </td>
                                    <td className="text-center">
                                      {item?.particualarsAlpha}
                                    </td>
                                    <td className="text-center">
                                      {item?.particualarsBeta}
                                    </td>
                                    <td className="text-center">
                                      {item?.particualarsGamma}
                                    </td>
                                  </tr>
                                )
                              )
                            ) : (
                              <tr>
                                <td colSpan="4">.</td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="table-section mt-4 d-flex justify-content-between">
                  <div className="table-one">
                    <table>
                      <thead>
                        <tr>
                          <th colSpan="3">
                            Power Generation & Consumption Details
                          </th>
                        </tr>
                        <tr>
                          <th>Engine Name</th>
                          <th>Power Generation</th>
                          <th>Running Hour</th>
                        </tr>
                      </thead>
                      <tbody>
                        {powerGeneration?.partOne?.length ? (
                          powerGeneration?.partOne?.map((item, i) => (
                            <tr key={i}>
                              <td>{item?.particularsName}</td>
                              <td className="text-center">
                                {item?.particualarsAlpha}
                              </td>
                              <td className="text-center">
                                {item?.particualarsBeta}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">.</td>
                          </tr>
                        )}
                      </tbody>
                      <thead>
                        <tr>
                          <th>Particulars</th>
                          <th>Value</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {powerGeneration?.partTwo?.length ? (
                          powerGeneration?.partTwo?.map((item, i) => (
                            <tr key={i}>
                              <td>{item?.particularsName}</td>
                              <td className="text-center">
                                {item?.particualarsAlpha}
                              </td>
                              <td className="text-center">
                                {item?.particualarsBeta}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">.</td>
                          </tr>
                        )}
                      </tbody>
                      <thead>
                        <tr>
                          <th colSpan="3">Gas Consumption Details</th>
                        </tr>
                        <tr>
                          <th>Particulars</th>
                          <th>Value</th>
                          <th>Unit</th>
                        </tr>
                      </thead>
                      <tbody>
                        {powerGeneration?.partThree?.length ? (
                          powerGeneration?.partThree?.map((item, i) => (
                            <tr key={i}>
                              <td>{item?.particularsName}</td>
                              <td className="text-center">
                                {item?.particualarsAlpha}
                              </td>
                              <td className="text-center">
                                {item?.particualarsBeta}
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4">.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                  <div className="table-two">
                    <table>
                      <thead>
                        <tr>
                          <th colSpan="4">Stoppage Details</th>
                        </tr>
                        <tr>
                          <th>Engine Name</th>
                          <th>Remarks</th>
                          <th>Duration (Min)</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stoppageDetails?.length ? (
                          stoppageDetails?.map((item, index) => (
                            <tr key={index}>
                              <td>{item?.particularsName}</td>
                              <td className="text-center">
                                {item?.particualarsAlpha}
                              </td>
                              <td className="text-center">
                                {item?.particualarsGamma}
                              </td>
                              <td className="text-center">
                                <IView
                                  clickHandler={()=> {
                                    setIsShowModal(true);
                                    setModalInfo({
                                      engineName: item?.particularsName,
                                      fromDate: values?.fromDate,
                                      toDate: values?.toDate
                                    })
                                  }}
                                />
                              </td>
                            </tr>
                          ))
                        ) : null }
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </>
          </IForm>
          <IViewModal show={isShowModal} onHide={() => setIsShowModal(false)}>
            <ViewStopageDetails modalInfo={modalInfo}/>
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
