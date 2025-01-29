import React, { useEffect, useState } from "react";
import { Formik } from "formik";
import { shallowEqual, useSelector } from "react-redux";
import customStyles from "../../_chartinghelper/common/selectCustomStyle";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import { getVesselDDL } from "../../helper";
import { OutstandingAdjustReport } from "./helper";
import Loading from "../../_chartinghelper/loading/_loading";

const initData = {
  vesselName: "",
};

const AdjustmentReport = () => {
const [loading, setLoading] = useState(false)
  const [rowDto, setRowDto] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  // const userRole = useSelector(
  //   (state) => state?.authData?.userRole,
  //   shallowEqual
  // );

  //OutstandingAdjustReport;

  const getLanding = (values) => {
    const payload = {
      intVesselId: values?.vesselName?.value,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intCertificateTypeId: 0,
    };
    OutstandingAdjustReport(payload, setRowDto, setLoading, () => {});
  };
  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL,
      ""
    );
    getLanding();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {}, []);

  // let adjustmentReportPermission = null;
  // for (let i = 0; i < userRole.length; i++) {
  //   if (userRole[i]?.intFeatureId === 652) {
  //     adjustmentReportPermission = userRole[i];
  //   }
  // }

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
                <p>Adjustment Report</p>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ""}
                      isSearchable={true}
                      options={vesselDDL || []}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      onChange={(valueOption) => {
                        setFieldValue("vesselName", valueOption);
                        const payload = {
                          intVesselId: valueOption?.value,
                          intAccountId: profileData?.accountId,
                          intBusinessUnitId: selectedBusinessUnit?.value,
                          intCertificateTypeId: 0,
                        };
                        OutstandingAdjustReport(
                          payload,
                          setRowDto,
                          setLoading,
                          () => {}
                        );
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>
              </div>
              <div className=" mt-3">
                <div style={{overflow:"auto"}} className="">
                 <div className="table-responsive">
                 <table className="table table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th  style={{ minWidth: "30px" }}>
                          SI
                        </th>
                        <th style={{ minWidth: "90px" }}>
                          Vessele Name
                        </th>
                        <th style={{ minWidth: "90px" }}>
                          Voyage No
                        </th>
                        <th colspan="2" style={{ minWidth: "190px" }}>
                          Dispute With Charterer
                        </th>
                        <th style={{ minWidth: "90px" }}>Freight</th>
                        <th colspan="2" style={{ minWidth: "190px" }}>
                          LP & DP
                        </th>
                        <th style={{ minWidth: "90px" }}>Charter/Shipper</th>
                        <th colspan="2" style={{ minWidth: "190px" }}>
                          Brokerage
                        </th>
                        <th colspan="4" style={{ minWidth: "360px" }}>
                          PDA
                        </th>
                        <th style={{ minWidth: "90px" }}>PnI/TCL</th>
                        <th style={{ minWidth: "90px" }}>Weather Routing</th>
                        <th style={{ minWidth: "90px" }}>Survey</th>
                        <th style={{ minWidth: "90px" }}>AP/Guard</th>
                        <th style={{ minWidth: "90px" }}>Other</th>
                      </tr>
                      <tr>
                        <th style={{ minWidth: "30px" }}></th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "95px" }}>Charterer</th>
                        <th style={{ minWidth: "95px" }}>Owner</th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "95px" }}>Despatch</th>
                        <th style={{ minWidth: "95px" }}>Demurage</th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "95px" }}>Amount</th>
                        <th style={{ minWidth: "95px" }}>Party</th>
                        <th style={{ minWidth: "90px" }}>LP</th>
                        <th style={{ minWidth: "90px" }}>DP</th>
                        <th style={{ minWidth: "90px" }}>Bunker Port</th>
                        <th style={{ minWidth: "90px" }}>OPA</th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "90px" }}></th>
                        <th style={{ minWidth: "90px" }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">
                              {item?.strVesselName}
                            </td>
                            <td className="text-center">{item?.intVoyageNo}</td>
                            <td className="text-center">
                              {item?.numDisputeWithCharter}
                            </td>
                            <td className="text-center">
                              {item?.numDisputeWithOwner}
                            </td>
                            <td className="text-center">{item?.numFreight}</td>
                            <td className="text-center">
                              {item?.numLpDpDespatch}
                            </td>
                            <td className="text-center">
                              {item?.numLpDpDemurrage}
                            </td>
                            <td className="text-center">
                              {item?.strCharterOrShipper}
                            </td>
                            <td className="text-center">
                              {item?.numBrokerageAmount}
                            </td>
                            <td className="text-center">
                              {item?.strBrokerageParty}
                            </td>
                            <td className="text-center">{item?.numPDA_LP}</td>
                            <td className="text-center">{item?.numPDA_DP}</td>
                            <td className="text-center">
                              {item?.strPDABunkerPort}
                            </td>
                            <td className="text-center">{item?.numPDA_OPA}</td>
                            <td className="text-center">{item?.numPnlTcl}</td>
                            <td className="text-center">
                              {item?.numWeatherRouting}
                            </td>
                            <td className="text-center">{item?.numSurvey}</td>
                            <td className="text-center">{item?.numApGuard}</td>
                            <td className="text-center">{item?.numOther}</td>
                          </tr>
                        ))}
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

export default AdjustmentReport;
