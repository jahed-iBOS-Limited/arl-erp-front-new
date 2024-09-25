import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICustomTable from "../../_chartinghelper/_customTable";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import { getVesselDDL, getVoyageDDLNew } from "../../helper";
import FormikSelect from "../../_chartinghelper/common/formikSelect";
import customStyles from "../../../selectCustomStyle";

const initData = {
  voyageFlagLicenseAtt: "",
};

const headers = [
  { name: "SL" },
  { name: "Code" },
  { name: "Vessel Name" },
  { name: "Current Position" },
  { name: "Load Port" },
  { name: "Ballast Eco Max" },
  { name: "Ballast Distance" },
  { name: "Ballast Speed" },
  { name: "Ballast VLSFO Consumption (Mt)" },
  { name: "Ballast LSMGO Consumption (Mt)" },
  { name: "Ballast Passage VLSFO Consumption (Mt)" },
  { name: "Ballast Passage LSMGO Consumption (Mt)" },
  { name: "Discharge Port" },
  { name: "Laden Eco Max" },
  { name: "Laden Distance" },
  { name: "Laden Speed" },
  { name: "Laden VLSFO Consumption (Mt)" },
  { name: "Laden LSMGO Consumption (Mt)" },
  { name: "Laden Passage VLSFO Consumption (Mt)" },
  { name: "Laden Passage LSMGO Consumption (Mt)" },
  { name: "Load Rate" },
  { name: "Cargo Quantity (Mt)" },
  { name: "Load Port Stay" },
  { name: "Discharge Rate" },
  { name: "Discharge Port Stay" },
  { name: "Load Port Stay VLSFO Consumption (Mt)" },
  { name: "Load Port Stay LSMGO Consumption (Mt)" },
  { name: "Discharge Port Stay VLSFO Consumption (Mt)" },
  { name: "Discharge Port Stay LSMGO Consumption (Mt)" },
  { name: "Total VLSFO Consumption (Mt)" },
  { name: "Total LSMGO Consumption (Mt)" },
  { name: "Tolerance VLSFO Percentage" },
  { name: "Net Total Consumable VLSFO (Mt)" },
  { name: "Bunker Port ID" },
  { name: "Bunker Port" },
  { name: "Bunker Trader" },
  { name: "Bunker Type" },
  // { name: "Action" },
];

export default function BunkerCalculatorLanding() {
  const saveHandler = (values, cb) => {};
  const [show, setShow] = useState(false);
  const onHide = () => setShow(false);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [landingData, getLandingData, loading] = useAxiosGet();
  const [vesselDDL, setVesselDDL] = useState([]);
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [loading2, setLoading] = useState(false);

  const [singleRowData, setSingleRowData] = useState({});
  const history = useHistory();

  const getGridData = (values) => {
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
    getLandingData(
      `${imarineBaseUrl}/domain/VesselNomination/GetBunkerCalculatorLanding?${shipTypeSTR}${voyageTypeSTR}${vesselNameSTR}${voyageNoSTR}`
    );
  };

  useEffect(() => {
    getGridData();
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
            title="Bunker Calculator"
            isHiddenReset
            isHiddenBack
            isHiddenSave
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
                      setFieldValue("vesselName", "");
                      setFieldValue("voyageType", "");
                      setFieldValue("voyageNo", "");
                      setVesselDDL([]);
                      if (valueOption) {
                        getVesselDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          setVesselDDL,
                          valueOption?.value === 2 ? 2 : ""
                        );
                      }else{
                        getGridData()
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
                      getGridData(values);
                    }}
                    style={{ marginTop: "18px" }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>
              <div className="mt-5">
                {landingData?.length > 0 && (
                  <ICustomTable
                    ths={headers}
                    style={{ minWidth: "100px!important" }}
                    scrollable={true}
                  >
                    {landingData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td style={{ minWidth: "100px" }}>{index + 1}</td>
                          <td>{item?.strCode}</td>
                          <td>{item?.strNameOfVessel}</td>
                          <td>{item?.strCurrentPosition}</td>
                          <td>{item?.strLoadPort}</td>
                          <td>{item?.strBallastEcoMax}</td>
                          <td>{item?.numBallastDistance}</td>
                          <td>{item?.numBallastSpeed}</td>
                          <td>{item?.numBallastVlsfoConsumptionMt}</td>
                          <td>{item?.numBallastLsmgoConsumptionMt}</td>
                          <td>{item?.numBallastPassageVlsfoConsumptionMt}</td>
                          <td>{item?.numBallastPassageLsmgoConsumptionMt}</td>
                          <td>{item?.strDischargePort}</td>
                          <td>{item?.strLadenEcoMax}</td>
                          <td>{item?.numLadenDistance}</td>
                          <td>{item?.numLadenSpeed}</td>
                          <td>{item?.numLadenVlsfoConsumptionMt}</td>
                          <td>{item?.numLadenLsmgoConsumptionMt}</td>
                          <td>{item?.numLadenPassageVlsfoConsumptionMt}</td>
                          <td>{item?.numLadenPassageLsmgoConsumptionMt}</td>
                          <td>{item?.intLoadRate}</td>
                          <td>{item?.numCargoQty}</td>
                          <td>{item?.numLoadPortStay}</td>
                          <td>{item?.intDischargeRate}</td>
                          <td>{item?.numDischargePortStay}</td>
                          <td>{item?.numLoadPortStayVlsfoConsumptionMt}</td>
                          <td>{item?.numLoadPortStayLsmgoConsumptionMt}</td>
                          <td>
                            {item?.numDischargePortStayVlsfoConsumptionMt}
                          </td>
                          <td>
                            {item?.numDischargePortStayLsmgoConsumptionMt}
                          </td>
                          <td>{item?.numTotalVlsfoConsumptionMt}</td>
                          <td>{item?.numTotalLsmgoConsumptionMt}</td>
                          <td>{item?.numToleranceVlsfoPercentage}</td>
                          <td>{item?.numNetTotalConsumableVlsfoMt}</td>
                          <td>{item?.intBunkerPortId}</td>
                          <td>{item?.strBunkerPort}</td>
                          <td>{item?.strBunkerTrader}</td>
                          <td>{item?.strBunkerType}</td>
                          {/* <td>
                                <div className="d-flex" style={{ justifyContent: 'space-evenly' }}>
                                    <IView
                                        title="View"
                                        clickHandler={() => {
                                            history.push("/chartering/operation/bunkerManagement/create",{
                                                landingData: item
                                              });
                                        }}
                                    />
                                    <IEdit
                                        title="Edit"
                                        clickHandler={() => {
                                            history.push("/chartering/operation/bunkerManagement/create",{
                                                landingData: item
                                              });
                                        }}
                                    />
                                </div>
                            </td> */}
                        </tr>
                      );
                    })}
                  </ICustomTable>
                )}
              </div>
            </Form>
          </IForm>
          {/* <IViewModal show={show} onHide={onHide}>
            <VoyageLicenseFlagAttachment values={values} setFieldValue={setFieldValue} item={singleRowData} getGridData={getGridData} setShow={setShow} />
          </IViewModal> */}
        </>
      )}
    </Formik>
  );
}
