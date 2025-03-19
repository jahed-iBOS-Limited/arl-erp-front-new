import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../_chartinghelper/loading/_loading";
import akijShippingLogo from "../../_chartinghelper/assets/images/logos/akijShippingText.svg";
import "./style.css";
// import { transform } from "lodash";

const initData = {
  vesselName: "",
};

const CertificateManagementReport = () => {
  const [loading] = useState(false);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  //OutstandingAdjustReport;

  const getLanding = (values) => {};
  useEffect(() => {
    getLanding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {}, []);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {}}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {loading && <Loading />}
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>Certificate Management Report</p>
              </div>
              <div>
                <div className="akij-shipping-logo">
                  <img src={akijShippingLogo} alt={akijShippingLogo} />
                </div>
                <div className="header-title">
                  <h6>OFFICER AND RATING CERTIFICATE STATUS</h6>
                  <p>
                    COMPANY CHECK LIST FOR VERIFICATION OF OFFICERS
                    CERTIFICATION UNDER STCW 78 AS AMENDED
                  </p>
                  <p>Date : 31/03/2022</p>
                </div>
              </div>
              <div className="certificate-due-report">
                <div className="loan-scrollable-table mt-3">
                  <div style={{}} className="scroll-table _table">
                    <table className="table table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th
                            style={{
                              minWidth: "70px",
                              writingMode: "",
                            }}
                          >
                            STCW
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Personal Survival Tech. (VI/1-1)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Basic Fire Fight (VI/1-2)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Elementary 1sr Aid (VI/1-3)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            PSSR (VI/1-4)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            PSCRB VI/2
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Advance Fire-fighting VI/3
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Medicare VI/4
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Officers COC's (II/1or2 or III/1 or 2 or 3)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            ECDIS
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            WECDIS TYPES
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            GMDSS GOC
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Bridge/Engine Room Resource Management
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            ISPS AWARNESS (SAT)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Designated Security Duties (DSD)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Ship Security Officer
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Flag Endorse of Off Certs Reg I/10
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Watch keeping Cert. for Deck / Engine Ratings (II/4)
                            & (III/4)
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Original Med Rep of Off/ Crew on Board
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Vaccination
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            CDC
                          </th>
                          <th
                            style={{
                              writingMode: "vertical-rl",
                              transform: "rotate(-180deg) translateX(-5px)",
                              minWidth: "70px",
                            }}
                          >
                            Passport
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {/* {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => ( */}
                        <tr key={1}>
                          <td className="text-center">
                            {" Master Master Master"}
                          </td>
                          <td className="text-center">{"27-Apr-26"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                          <td className="text-center">{"A"}</td>
                        </tr>
                        {/* ))} */}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
};

export default CertificateManagementReport;
