import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import customStyles from "../../../selectCustomStyle";
import IForm from "../../../_helper/_form";
import Loading from "../../../_helper/_loading";
import FormikSelect from "../../../chartering/_chartinghelper/common/formikSelect";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import { imarineBaseUrl } from "../../../../App";

const initData = {};
export default function CaptureRecapCreate() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [gridData, getGridData, loading] = useAxiosGet();
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading2, setLoading] = useState(false);

  const history = useHistory();

  const getData = (values) => {
    const shipTypeSTR = values?.shipType
      ? `shipType=${values?.shipType?.label}`
      : "";
    const voyageTypeSTR = values?.voyageType
      ? `&voyageType=${values?.voyageType?.label}`
      : "";
    const vesselNameSTR = values?.vesselName
      ? `&vesselName=${values?.vesselName?.label}`
      : "";
    const voyageNoSTR = values?.voyageNo
      ? `&voyageNo=${values?.voyageNo?.label}`
      : "";
    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/GetVesselNominationRecapeData?${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`
    );
  };

  useEffect(() => {
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getVoyageDDL = (values) => {
    getVoyageDDLNew({
      accId: profileData?.accountId,
      buId: selectedBusinessUnit?.value,
      id: values?.vesselName?.value,
      setter: setVoyageNoDDL,
      setLoading: setLoading,
      shipType: 0,
      isComplete: 0,
      voyageTypeId: 0,
    });
  };

  const saveHandler = (values, cb) => { };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
      // validationSchema={{}}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
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
          {loading && <Loading />}
          <IForm
            title="Capture Recap"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push("/shippingOperation/recap-management/capture-recap/create");
                    }}
                  >
                    Capture
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group global-form row mb-5">
                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.shipType}
                    isSearchable={true}
                    options={[
                      { value: 1, label: "Own Ship" },
                      { value: 2, label: "Charterer Ship" },
                    ]}
                    styles={customStyles}
                    name="shipType"
                    placeholder="Ship Type"
                    label="Ship Type"
                    onChange={(valueOption) => {
                      setFieldValue("shipType", valueOption);
                      setFieldValue("voyageType", "");
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageNo", "");

                      setVesselDDL([]);
                      if (valueOption) {
                        getVesselDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setVesselDDL,
                          valueOption?.value === 2 ? 2 : ""
                        );
                      } else {
                        getData();
                      }
                    }}
                  />
                </div>

                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.voyageType}
                    isSearchable={true}
                    options={[
                      { value: 1, label: "Time Charter" },
                      { value: 2, label: "Voyage Charter" },
                    ]}
                    styles={customStyles}
                    name="voyageType"
                    placeholder="Voyage Type"
                    label="Voyage Type"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageNo", "");
                      setFieldValue("voyageType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.vesselName}
                    isSearchable={true}
                    options={vesselDDL || []}
                    styles={customStyles}
                    name="vesselName"
                    placeholder="Vessel Name"
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                      setFieldValue("voyageNo", "");
                      if (valueOption) {
                        getVoyageDDL({ ...values, vesselName: valueOption });
                      }
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <FormikSelect
                    value={values?.voyageNo || ""}
                    isSearchable={true}
                    options={voyageNoDDL || []}
                    styles={customStyles}
                    name="voyageNo"
                    placeholder="Voyage No"
                    label="Voyage No"
                    onChange={(valueOption) => {
                      setFieldValue("voyageNo", valueOption);
                    }}
                    isDisabled={!values?.vesselName}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    disabled={!values?.shipType}
                    onClick={() => {
                      getData(values);
                    }}
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>
              <div className="loan-scrollable-table">
                <div
                  className="scroll-table _table"
                  style={{ maxHeight: "540px" }}
                >
                  <table className="table table-striped mt-2 table-bordered">
                    <thead>
                      <tr>
                        <th style={{ minWidth: "120px" }}>Code</th>
                        <th style={{ minWidth: "120px" }}>Schedule To Send</th>
                        <th style={{ minWidth: "120px" }}>Voyage Type</th>
                        <th style={{ minWidth: "120px" }}>Voyage No</th>
                        <th style={{ minWidth: "120px" }}>Voyage Commenced</th>
                        <th style={{ minWidth: "120px" }}>Voyage Completion</th>
                        <th style={{ minWidth: "120px" }}>
                          Voyage Duration (Days)
                        </th>
                        <th style={{ minWidth: "120px" }}>Charterer Name</th>
                        <th style={{ minWidth: "120px" }}>Broker Name</th>
                        <th style={{ minWidth: "120px" }}>Broker Email</th>
                        <th style={{ minWidth: "120px" }}>CP Date</th>
                        <th style={{ minWidth: "120px" }}>Account Name</th>
                        <th style={{ minWidth: "120px" }}>Cargo</th>
                        <th style={{ minWidth: "120px" }}>
                          Cargo Quantity (Mts)
                        </th>
                        <th style={{ minWidth: "120px" }}>Freight per Mt</th>
                        <th style={{ minWidth: "120px" }}>Load Port</th>
                        <th style={{ minWidth: "120px" }}>Laycan</th>
                        <th style={{ minWidth: "120px" }}>Load Rate</th>
                        <th style={{ minWidth: "120px" }}>
                          Demurrage/Dispatch
                        </th>
                        <th style={{ minWidth: "120px" }}>ETA Load Port</th>
                        <th style={{ minWidth: "120px" }}>Discharge Port</th>
                        <th style={{ minWidth: "120px" }}>Discharge Rate</th>
                        <th style={{ minWidth: "120px" }}>Freight</th>
                        <th style={{ minWidth: "120px" }}>Load Port DA</th>
                        <th style={{ minWidth: "120px" }}>Discharge Port DA</th>
                        <th style={{ minWidth: "120px" }}>Ballast</th>
                        <th style={{ minWidth: "120px" }}>Steaming</th>
                        <th style={{ minWidth: "120px" }}>
                          Additional Distance
                        </th>
                        <th style={{ minWidth: "120px" }}>Ballast Speed</th>
                        <th style={{ minWidth: "120px" }}>Laden Speed</th>
                        <th style={{ minWidth: "120px" }}>Extra Days</th>
                        <th style={{ minWidth: "120px" }}>
                          Shipper Email for Vessel Nomination
                        </th>
                        <th style={{ minWidth: "120px" }}>Bunker Agent</th>
                        <th style={{ minWidth: "120px" }}>
                          Expenditures for PI Survey
                        </th>
                        <th style={{ minWidth: "120px" }}>Place of Delivery</th>
                        <th style={{ minWidth: "120px" }}>
                          Discharge Port Agent Email
                        </th>
                        <th style={{ minWidth: "120px" }}>
                          PI Survey Email Sent
                        </th>
                        <th style={{ minWidth: "120px" }}>
                          Vessel Nomination Email Sent
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{item.strCode}</td>
                          <td className="text-center">
                            {_dateFormatter(item.dteScheduleToSend)}
                          </td>
                          <td className="text-center">{item.strVoyageType}</td>
                          <td className="text-center">{item.intVoyageNo}</td>
                          <td className="text-center">
                            {_dateFormatter(item.dteVoyageCommenced)}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item.dteVoyageCompletion)}
                          </td>
                          <td className="text-center">
                            {item.intVoyageDurationDays}
                          </td>
                          <td className="text-center">
                            {item.strChartererName}
                          </td>
                          <td className="text-center">{item.strBrokerName}</td>
                          <td className="text-center">{item.strBrokerEmail}</td>
                          <td className="text-center">
                            {_dateFormatter(item.dteCpdate)}
                          </td>
                          <td className="text-center">{item.strAccountName}</td>
                          <td className="text-center">{item.strCargo}</td>
                          <td className="text-center">
                            {item.intCargoQuantityMts}
                          </td>
                          <td className="text-center">
                            {item.numFreightPerMt}
                          </td>
                          <td className="text-center">
                            {item.strNameOfLoadPort}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item.strLaycan)}
                          </td>
                          <td className="text-center">{item.intLoadRate}</td>
                          <td className="text-center">
                            {item.numDemurrageDispatch}
                          </td>
                          <td className="text-center">
                            {_dateFormatter(item.dteEtaloadPort)}
                          </td>
                          <td className="text-center">
                            {item.strDischargePort}
                          </td>
                          <td className="text-center">
                            {item.intDischargeRate}
                          </td>
                          <td className="text-center">{item.numFreight}</td>
                          <td className="text-center">{item.numLoadPortDa}</td>
                          <td className="text-center">
                            {item.numDischargePortDa}
                          </td>
                          <td className="text-center">{item.numBallast}</td>
                          <td className="text-center">{item.numSteaming}</td>
                          <td className="text-center">
                            {item.numAdditionalDistance}
                          </td>
                          <td className="text-center">
                            {item.numBallastSpeed}
                          </td>
                          <td className="text-center">{item.numLadenSpeed}</td>
                          <td className="text-center">{item.intExtraDays}</td>
                          <td className="text-center">
                            {item.strShipperEmailForVesselNomination}
                          </td>
                          <td className="text-center">{item.strBunkerAgent}</td>
                          <td className="text-center">
                            {item.strExpendituresForPisurvey}
                          </td>
                          <td className="text-center">
                            {item.strPlaceOfDelivery}
                          </td>
                          <td className="text-center">
                            {item.strDischargePortAgentEmail}
                          </td>
                          <td className="text-center">
                            {item.isPisurveyEmailSent ? "Yes" : "No"}
                          </td>
                          <td className="text-center">
                            {item.isVesselNominationEmailSent ? "Yes" : "No"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
