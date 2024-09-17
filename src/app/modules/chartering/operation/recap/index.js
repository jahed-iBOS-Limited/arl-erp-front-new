import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { imarineBaseUrl } from "../../../../App";
import { useHistory } from "react-router";
import { _dateFormatter } from "../../_chartinghelper/_dateFormatter";

const initData = {};
export default function Recap() {
  const [gridData, getGridData, loading] = useAxiosGet();
  const history = useHistory();

  useEffect(() => {
    getGridData(
      `${imarineBaseUrl}/domain/VesselNomination/GetVesselNominationRecapeData`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {};
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
            title="Recap"
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
                      history.push("/chartering/operation/recap/create");
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
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
