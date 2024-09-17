import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { imarineBaseUrl } from "../../../../App";
import { useHistory } from "react-router";

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
                        <th>Code</th>
                        <th>Schedule To Send</th>
                        <th>Voyage Type</th>
                        <th>Voyage No</th>
                        <th>Voyage Commenced</th>
                        <th>Voyage Completion</th>
                        <th>Voyage Duration (Days)</th>
                        <th>Charterer Name</th>
                        <th>Broker Name</th>
                        <th>Broker Email</th>
                        <th>CP Date</th>
                        <th>Account Name</th>
                        <th>Cargo</th>
                        <th>Cargo Quantity (Mts)</th>
                        <th>Freight per Mt</th>
                        <th>Load Port</th>
                        <th>Laycan</th>
                        <th>Load Rate</th>
                        <th>Demurrage/Dispatch</th>
                        <th>ETA Load Port</th>
                        <th>Discharge Port</th>
                        <th>Discharge Rate</th>
                        <th>Freight</th>
                        <th>Load Port DA</th>
                        <th>Discharge Port DA</th>
                        <th>Ballast</th>
                        <th>Steaming</th>
                        <th>Additional Distance</th>
                        <th>Ballast Speed</th>
                        <th>Laden Speed</th>
                        <th>Extra Days</th>
                        <th style={{ minWidth: "300px" }}>
                          Shipper Email for Vessel Nomination
                        </th>
                        <th>Bunker Agent</th>
                        <th style={{ minWidth: "300px" }}>
                          Expenditures for PI Survey
                        </th>
                        <th>Place of Delivery</th>
                        <th style={{ minWidth: "300px" }}>
                          Discharge Port Agent Email
                        </th>
                        <th>PI Survey Email Sent</th>
                        <th style={{ minWidth: "300px" }}>
                          Vessel Nomination Email Sent
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {gridData?.data?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.strCode}</td>
                          <td>{item.dteScheduleToSend}</td>
                          <td>{item.strVoyageType}</td>
                          <td>{item.intVoyageNo}</td>
                          <td>{item.dteVoyageCommenced}</td>
                          <td>{item.dteVoyageCompletion}</td>
                          <td>{item.intVoyageDurationDays}</td>
                          <td>{item.strChartererName}</td>
                          <td>{item.strBrokerName}</td>
                          <td>{item.strBrokerEmail}</td>
                          <td>{item.dteCpdate}</td>
                          <td>{item.strAccountName}</td>
                          <td>{item.strCargo}</td>
                          <td>{item.intCargoQuantityMts}</td>
                          <td>{item.numFreightPerMt}</td>
                          <td>{item.strNameOfLoadPort}</td>
                          <td>{item.strLaycan}</td>
                          <td>{item.intLoadRate}</td>
                          <td>{item.numDemurrageDispatch}</td>
                          <td>{item.dteEtaloadPort}</td>
                          <td>{item.strDischargePort}</td>
                          <td>{item.intDischargeRate}</td>
                          <td>{item.numFreight}</td>
                          <td>{item.numLoadPortDa}</td>
                          <td>{item.numDischargePortDa}</td>
                          <td>{item.numBallast}</td>
                          <td>{item.numSteaming}</td>
                          <td>{item.numAdditionalDistance}</td>
                          <td>{item.numBallastSpeed}</td>
                          <td>{item.numLadenSpeed}</td>
                          <td>{item.intExtraDays}</td>
                          <td>{item.strShipperEmailForVesselNomination}</td>
                          <td>{item.strBunkerAgent}</td>
                          <td>{item.strExpendituresForPisurvey}</td>
                          <td>{item.strPlaceOfDelivery}</td>
                          <td>{item.strDischargePortAgentEmail}</td>
                          <td>{item.isPisurveyEmailSent ? "Yes" : "No"}</td>
                          <td>
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
