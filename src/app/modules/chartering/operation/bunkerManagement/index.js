import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { imarineBaseUrl } from "../../../../App";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import ICustomTable from "../../_chartinghelper/_customTable";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import IView from "../../_chartinghelper/icons/_view";
import IEdit from "../../_chartinghelper/icons/_edit";
 

const initData = {
  voyageFlagLicenseAtt: "",
};

const headers = [
    { name: "SL" },
    { name: "Code" },
    { name: "Vessel Name" },
    { name: "Current Position" },
    { name: "Load Port" },
    { name: "Discharge Port" },
    { name: "Cargo Quantity(Mt)" },
    { name: "Action" },
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
                <ICustomTable ths={headers}scrollable={true}>
                  {landingData?.map((item, index) => {
                    return (
                        <tr key={index}>
                            <td style={{width:"90px"}}>{index + 1}</td>
                            <td>{item?.strCode}</td>
                            <td>{item?.strNameOfVessel}</td>
                            <td>{item?.strCurrentPosition}</td>
                            <td>{item?.strLoadPort}</td>
                            <td>{item?.strDischargePort}</td>
                            <td>{item?.numCargoQty}</td>
                            <td>
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
                            </td>
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
