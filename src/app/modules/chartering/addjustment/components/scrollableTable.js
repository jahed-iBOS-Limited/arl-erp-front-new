import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import InputField from "../../../_helper/_inputField";
import IConfirmModal from "../../../_helper/_confirmModal";
import AdjustmentFilter from "./form";
import { shallowEqual, useSelector } from "react-redux";
import { getVesselDDL } from "../../helper";
import {
  createOutstandingAdjust,
  getPayload,
  outstandingAdjustLanding,
} from "../helper";

const initData = {
  vesselName: "",
  voyageNo: "",
};

const ScrollableTable = ({ setLoading }) => {
  const [rowDto, setRowDto] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const getLanding = (values) => {
    const payload = {
      intVesselId: values?.vesselName?.value,
      intVoyageId: values?.voyageNo?.value,
      intAccountId: profileData?.accountId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intCertificateTypeId: 0,
    };
    outstandingAdjustLanding(payload, setRowDto, setLoading, () => {});
  };

  useEffect(() => {
    getVesselDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setVesselDDL,
      ""
    );
  }, [profileData, selectedBusinessUnit]);

  const rowDtoHandler = (name, value, i) => {
    let data = [...rowDto];
    data[i].isChange = true;
    data[i][name] = value;
    setRowDto(data);
  };

  const clickHandler = (i, values) => {
    let result = rowDto.findIndex((value) => value.isChange);
    if (result !== i && result !== -1) {
      submitHandler(result, values);
    }
  };

  // submitHandler btn submit handler
  const submitHandler = (index, values) => {
    let changedItem = rowDto.filter((item) => item.isChange);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to save row no: ${index + 1}`,
      yesAlertFunc: () => {
        createOutstandingAdjust(
          getPayload(changedItem[0], values, profileData, selectedBusinessUnit),
          setLoading,
          () => {
            getLanding(values);
          }
        );
      },
      noAlertFunc: () => {
        getLanding(values);
      },
    };
    IConfirmModal(confirmObject);
    //
  };

  const submitHandlerVoyager = (item, values) => {
    createOutstandingAdjust(
      getPayload(item, values, profileData, selectedBusinessUnit),
      setLoading,
      () => {
        getLanding(values);
      }
    );
  };

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
            <Form>
              <AdjustmentFilter
                objProps={{
                  setFieldValue,
                  errors,
                  touched,
                  values,
                  vesselDDL,
                  voyageNoDDL,
                  setVoyageNoDDL,
                  setLoading,
                  getLanding,
                }}
              />
              <div className="loan-scrollable-table mt-3">
                <div style={{}} className="scroll-table _table">
                  <table className="table table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th rowspan="2" style={{ minWidth: "30px" }}>
                          SL
                        </th>
                        <th rowspan="2" style={{ minWidth: "90px" }}>
                          Voyage No
                        </th>
                        <th colspan="2" style={{ minWidth: "240px" }}>
                          Dispute With Charterer
                        </th>
                        <th rowspan="2" style={{ minWidth: "120px" }}>
                          Freight
                        </th>
                        <th colspan="2" style={{ minWidth: "240px" }}>
                          LP & DP
                        </th>
                        <th rowspan="2" style={{ minWidth: "220px" }}>
                          Charter/Shipper
                        </th>
                        <th colspan="2" style={{ minWidth: "250px" }}>
                          Brokerage
                        </th>
                        <th colspan="4" style={{ minWidth: "450px" }}>
                          PDA
                        </th>
                        <th style={{ minWidth: "120px" }} rowspan="2">
                          PnI/TCL
                        </th>
                        <th style={{ minWidth: "120px" }} rowspan="2">
                          Weather Routing
                        </th>
                        <th style={{ minWidth: "120px" }} rowspan="2">
                          Survey
                        </th>
                        <th style={{ minWidth: "120px" }} rowspan="2">
                          AP/Guard
                        </th>
                        <th style={{ minWidth: "120px" }} rowspan="2">
                          Other
                        </th>
                        <th style={{ minWidth: "80px" }} rowspan="2">
                          Action
                        </th>
                      </tr>
                      <tr>
                        <th style={{ minWidth: "120px" }}>Charterer</th>
                        <th style={{ minWidth: "120px" }}>Owner</th>
                        <th style={{ minWidth: "120px" }}>Despatch</th>
                        <th style={{ minWidth: "120px" }}>Demurage</th>
                        <th style={{ minWidth: "100px" }}>Amount</th>
                        <th style={{ minWidth: "150px" }}>Party</th>
                        <th style={{ minWidth: "100px" }}>LP</th>
                        <th style={{ minWidth: "100px" }}>DP</th>
                        <th style={{ minWidth: "150px" }}>Bunker Port</th>
                        <th style={{ minWidth: "100px" }}>OPA</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td className="text-center">{item?.intVoyageNo}</td>
                            <td className="text-center">
                              <InputField
                                value={item?.numDisputeWithCharter}
                                name="numDisputeWithCharter"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numDisputeWithCharter",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numDisputeWithOwner}
                                name="numDisputeWithOwner"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numDisputeWithOwner",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numFreight}
                                name="numFreight"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numFreight",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numLpDpDespatch}
                                name="numLpDpDespatch"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numLpDpDespatch",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numLpDpDemurrage}
                                name="numLpDpDemurrage"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numLpDpDemurrage",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.strCharterOrShipper || ""}
                                name="strCharterOrShipper"
                                type="text"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "strCharterOrShipper",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numBrokerageAmount}
                                name="numBrokerageAmount"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numBrokerageAmount",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.strBrokerageParty}
                                name="strBrokerageParty"
                                type="text"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "strBrokerageParty",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numPDA_LP}
                                name="numPDA_LP"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numPDA_LP",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numPDA_DP}
                                name="numPDA_DP"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numPDA_DP",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.strPDABunkerPort}
                                name="strPDABunkerPort"
                                type="text"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "strPDABunkerPort",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numPDA_OPA}
                                name="numPDA_OPA"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numPDA_OPA",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numPnlTcl}
                                name="numPnlTcl"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numPnlTcl",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numWeatherRouting}
                                name="numWeatherRouting"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numWeatherRouting",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numSurvey}
                                name="numSurvey"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numSurvey",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numApGuard}
                                name="numApGuard"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numApGuard",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <InputField
                                value={item?.numOther}
                                name="numOther"
                                type="number"
                                onChange={(e) => {
                                  rowDtoHandler(
                                    "numOther",
                                    e.target.value,
                                    index
                                  );
                                }}
                                onClick={(e) => {
                                  clickHandler(index, values);
                                }}
                              />
                            </td>
                            <td className="text-center">
                              <button
                                onClick={() => {
                                  submitHandlerVoyager(item, values);
                                }}
                                type="submit"
                                className="btn btn-sm btn-primary"
                              >
                                Save
                              </button>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default ScrollableTable;
