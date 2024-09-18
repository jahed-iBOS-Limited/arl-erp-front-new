import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { imarineBaseUrl, marineBaseUrlPythonAPI } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICustomTable from "../../_chartinghelper/_customTable";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
 

const initData = {
  voyageFlagLicenseAtt: "",
};

const headers = [
    { name: "SL" },
    { name: "Code" },
    { name: "Vessel Name" },
    { name: "Current Position" },
    { name: "Load Port" },
    { name: "Ballast Eco Max"},
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
  
  const [landingData, getLandingData, loading, ] = useAxiosGet()

  const [singleRowData, setSingleRowData] = useState({});
  const history = useHistory();


  const getGridData = () => {
    getLandingData(
      `${imarineBaseUrl}/domain/VesselNomination/GetBunkerCalculatorLanding `
    );
  };

 useEffect(()=> {
    getGridData();
 },[])


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
            {landingData?.length > 0 && (
                <ICustomTable ths={headers} style={{minWidth: "100px!important"}} scrollable={true}>
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
                            <td>{item?.numDischargePortStayVlsfoConsumptionMt}</td>
                            <td>{item?.numDischargePortStayLsmgoConsumptionMt}</td>
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
                    )   
                  })}
                </ICustomTable>
              )}
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
