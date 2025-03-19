import { Formik } from "formik";
import React from "react";
import ICustomCard from "../../../_helper/_customCard";
import { _fixedPoint } from "../../../_helper/_fixedPoint";

const JournalDetails = ({ obj }) => {
  const { rowData, buName, buAddress } = obj;

  return (
    <>
      <Formik enableReinitialize={true} initialValues={{}} onSubmit={() => {}}>
        {() => (
          <>
            <ICustomCard title="Journal Details">
              <form className="form form-label-right">
                <div id="pdf-section">
                  <div className="text-center">
                    <h2>{buName.toUpperCase()}</h2>
                    <h6
                      style={{
                        borderBottom: "2px solid #ccc",
                        paddingBottom: "10px",
                        fontSize: "12px",
                        fontWeight: "bold",
                      }}
                    >
                      {buAddress}
                    </h6>
                    {/* <h3 className="m-0">{tableItem?.strSubGlName}</h3> */}
                  </div>

                  <div className="react-bootstrap-table table-responsive">
                    <table
                      className="table table-striped table-bordered global-table"
                      id="table-to-xls"
                    >
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}> SL </th>
                          <th> Code </th>
                          <th> Gl Name </th>
                          <th>Business Transaction</th>
                          <th> Cost Center </th>
                          <th> Gl Narration </th>
                          <th> Amount </th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.strAccountingJournalCode}</td>
                              <td>{item?.strGeneralLedgerName}</td>
                              <td>{item?.strSubGlname}</td>
                              <td>{item?.strCostRevenueName}</td>
                              <td>{item?.strNarration}</td>
                              <td className="text-right">
                                {_fixedPoint(item?.numAmount, true)}
                              </td>
                            </tr>
                          );
                        })}
                        <tr>
                          <td className="text-right" colSpan="6">
                            <b>Total</b>
                          </td>
                          <td className="text-right">
                            <b>
                              {" "}
                              {_fixedPoint(
                                rowData?.reduce(
                                  (total, curr) => (total += curr?.numAmount),
                                  0
                                ),
                                true
                              )}
                            </b>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default JournalDetails;
