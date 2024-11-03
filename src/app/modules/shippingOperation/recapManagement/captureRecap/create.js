import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../App";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import ChartererComponent from "./chartererComponent";
import IDelete from "../../../_helper/_helperIcons/_delete";
import IViewModal from "../../../_helper/_viewModal";
import IView from "../../../_helper/_helperIcons/_view";
import NominationCargosList from "./nominationCargosList";



const initData = {
  voyageType: "",
  shipType: "",
  vesselName: "",
  deliveryPort: "",
  laycanFrom: "",
  laycanTo: "",
  dteVoyageCommenced: "",
  dteVoyageCompletion: "",
  loadRate: "",
  demurrageDispatch: "",
  numDispatch: "",
  etaLoadPort: "",
  dischargeRate: "",
  freight: "",
  loadPortDA: "",
  dischargePortDA: "",
  shipperEmail: "",
  brokerName: "",
  brokerEmail: "",
  strRemarks: "",

  // =====================
  strChartererName: "",
  numFreightRate: "",
  strShipperName: "",
  strShipperEmailForVesselNomination: "",
  // =============
  cargoName: "",
  cargoQuantity: "",
  loadPort: "",
  dischargePort: "",
};


const validationSchema = Yup.object().shape({
  voyageType: Yup.object()
    .shape({
      value: Yup.string().required("Voyage Type is required"),
      label: Yup.string().required("Voyage Type is required"),
    })
    .typeError("Voyage Type is required"),

  shipType: Yup.object()
    .shape({
      value: Yup.string().required("Ship Type is required"),
      label: Yup.string().required("Ship Type is required"),
    })
    .typeError("Ship Type is required"),
  vesselName: Yup.object()
    .shape({
      value: Yup.string().required("Vessel is required"),
      label: Yup.string().required("Vessel is required"),
    })
    .typeError("Vessel is required"),
  // accountName: Yup.string().required("Account Name is required"),
  // cargoName: Yup.object()
  //   .shape({
  //     value: Yup.string().required("Cargo is required"),
  //     label: Yup.string().required("Cargo is required"),
  //   })
  //   .typeError("Cargo is required"),
  // cargoQuantity: Yup.string().required("Cargo Quantity is required"),
  deliveryPort: Yup.object()
    .shape({
      value: Yup.string().required("Delivery Port is required"),
      label: Yup.string().required("Delivery Port is required"),
    })
    .typeError("Delivery Port is required"),
  // loadPort: Yup.object()
  //   .shape({
  //     value: Yup.string().required("Load Port Name is required"),
  //     label: Yup.string().required("Load Port Name is required"),
  //   })
  //   .typeError("Load Port Name is required"),
  laycanFrom: Yup.date().required("Laycan From Date is required"),
  laycanTo: Yup.date().required("Laycan To Date is required"),
  // dteVoyageCompletion: Yup.date().required(
  //   "Voyage Completion Date is required"
  // ),
  dteVoyageCommenced: Yup.date().required("Voyage Commenced Date is required"),
  loadRate: Yup.string().required("Load Rate is required"),
  demurrageDispatch: Yup.string().required("Demurrage is required"),
  numDispatch: Yup.string().required("Dispatch is required"),
  etaLoadPort: Yup.date().required("ETA Load Port Date is required"),
  // dischargePort: Yup.string().required("Discharge Port Name is required"),
  dischargeRate: Yup.string().required("Discharge Rate is required"),
  // shipperEmail: Yup.string()
  //   .required("Shipper Email is required")
  //   .test("is-valid-email-list", "Invalid email format", function (value) {
  //     if (!value) return true; // If no email is provided, Yup.required will handle the error.
  //     const emails = value.split(",").map((email) => email.trim());
  //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  //     for (let email of emails) {
  //       if (!emailRegex.test(email)) {
  //         return false; // Return false if any email is invalid.
  //       }
  //     }
  //     return true; // Return true if all emails are valid.
  //   }),
});

export default function RecapCreate() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [objProps, setObjprops] = useState({});
  const [, onSave, loader] = useAxiosPost();
  const [vesselDDL, getVesselDDL] = useAxiosGet();
  const [portDDL, getPortDDL] = useAxiosGet();
  const [cargoDDL, getCargoDDL] = useAxiosGet();
  const [chartererDDL, getChartererDDL] = useAxiosGet();
  const [brokerList, getbrokerList] = useAxiosGet();
  const [shipperNameList, getshipperNameList] = useAxiosGet();
  const [viewData, getViewData] = useAxiosGet()
  const { viewId } = useParams();
  const [modifyInitData, setModifyInitData] = useState(initData)
  const [chartererList, setChartererList] = useState([]);
  const [isShowModal, setIsShowModal] = useState(false)
  const [singleData, setSingleData] = useState(null)



  useEffect(() => {
    if (viewId) {
      getViewData(`${imarineBaseUrl}/domain/VesselNomination/GetByIdVesselNomination?VesselNominationId=${viewId}`, (res) => {
        const data = {
          voyageType: res?.intVoyageTypeId ? { value: res.intVoyageTypeId, label: res.strVoyageType } : "",
          shipType: res?.intShipTyeId ? { value: res.intShipTyeId, label: res.strShipType } : "",
          vesselName: res?.intVesselId ? { value: res.intVesselId, label: res.strNameOfVessel } : "",
          deliveryPort: res?.strPlaceOfDelivery ? { label: res.strPlaceOfDelivery } : "",
          laycanFrom: _dateFormatter(res.dteLaycanFrom) || "",
          laycanTo: _dateFormatter(res.dteLaycanTo) || "",
          dteVoyageCommenced: _dateFormatter(res.dteVoyageCommenced) || "",
          dteVoyageCompletion: _dateFormatter(res.dteVoyageCompletion) || "",
          loadRate: res.intLoadRate || "",
          demurrageDispatch: res.numDemurrageDispatch || "",
          numDispatch: res.numDispatch || "",
          etaLoadPort: _dateFormatter(res.dteEtaloadPort) || "",
          dischargeRate: res.intDischargeRate || "",
          freight: res.numFreight || "",
          loadPortDA: res.numLoadPortDa || "",
          dischargePortDA: res.numDischargePortDa || "",
          brokerName: res?.intBrokerId ? { value: res.intBrokerId, label: res.strBrokerName } : "",
          brokerEmail: res.strBrokerEmail || "",
          strRemarks: res.strRemarks || "",
        }
        setModifyInitData(data);
        setChartererList(res?.chartererList || [])
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewId])


  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}
`);
    getPortDDL(`${imarineBaseUrl}/domain/Stakeholder/GetPortDDL`);
    getCargoDDL(`${imarineBaseUrl}/domain/HireOwner/GetCargoDDL
`);
    getChartererDDL(
      `${imarineBaseUrl}/domain/PortPDA/GetCharterParty?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    getbrokerList(`${imarineBaseUrl}/domain/VesselNomination/GetBrokerDDL`);
    getshipperNameList(`${imarineBaseUrl}/domain/VesselNomination/GetShipperDDL`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);



  const saveHandler = async (values, cb) => {

    if (chartererList.length < 1) {
      toast.warn("At least one charterer is required.");
      return;
    }

    const isValid = chartererList.every((charterer, index) => {
      // Check if required fields are filled and if nominationCargosList has at least one item
      const hasRequiredFields = (
        charterer.strChartererName &&
        charterer.numFreightRate &&
        charterer.strShipperName &&
        charterer.strShipperEmailForVesselNomination &&
        charterer.nominationCargosList?.length > 0
      );

      if (!hasRequiredFields) {
        toast.warn(`Please fill out all required fields for charterer at index ${index + 1}.`);
      }

      return hasRequiredFields; // Return true if all required fields are filled
    });

    if (!isValid) {
      return; // Prevent submission if any validation failed
    }

    const hasNominationCargos = chartererList.every(charterer => {
      return charterer.nominationCargosList && charterer.nominationCargosList.length > 0;
    });

    if (!hasNominationCargos) {
      toast.warn("Each charterer must have at least one nomination cargo.");
      return; // Prevent form submission
    }

    const payload = {
      intVoyageTypeId: values?.voyageType?.value || 0,
      IsActive: 1,
      intAccountId: profileData?.accountId,
      strVoyageType: values.voyageType?.label || "",
      intShipTyeId: values?.shipType?.value || 0,
      strShipType: values?.shipType?.label || "",
      strNameOfVessel: values.vesselName?.label || "",
      intVesselId: values.vesselName?.value || "",
      strPlaceOfDelivery: values?.deliveryPort?.label || "",
      strLaycan: values.laycanFrom || "",
      dteVoyageCompletion: values?.dteVoyageCompletion,
      dteVoyageCommenced: values?.dteVoyageCommenced,
      dteLaycanFrom: values?.laycanFrom || "",
      dteLaycanTo: values?.laycanTo,
      intLoadRate: +values.loadRate || 0,
      numDemurrageDispatch: +values.demurrageDispatch || 0,
      numDispatch: +values.numDispatch || 0,
      dteETALoadPort: values.etaLoadPort || "",
      intDischargeRate: +values.dischargeRate || 0,
      numFreight: +values.freight || 0,
      numLoadPortDA: +values.loadPortDA || 0,
      numDischargePortDA: +values.dischargePortDA || 0,
      intBrokerId: values.brokerName.value || 0,
      strBrokerName: values.brokerName.label || "",
      strBrokerEmail: values.brokerEmail || "",
      intUserEnrollId: profileData?.employeeId || 0,
      chartererList: chartererList,
      intBusinessUnitId: selectedBusinessUnit?.value,
      strBusinessUnitName: selectedBusinessUnit?.label,
      strRemarks: values?.strRemarks || "",
      intLastActionBy: profileData?.userId
    };

    onSave(`${imarineBaseUrl}/domain/VesselNomination/CreateVesselNominationRecape`, payload, cb, true);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={viewId ? modifyInitData : initData}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
          setChartererList([])
        });
        setSubmitting(false);
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        errors,
        touched,
      }) => (
        <IForm
          title={viewId ? "Capture Recap View" : "Capture Recap"}
          getProps={setObjprops}
          isHiddenReset={true}
          isHiddenSave
          isPositionRight
          renderProps={() => {
            return (
              <div>
                <button
                  disabled={viewId}
                  type="submit"
                  className="btn btn-primary ml-3"
                  onClick={() => {
                    handleSubmit();
                  }}
                >
                  Save
                </button>
              </div>
            );
          }}
        >
          {loader && <Loading />}
          <Form className="form form-label-right">
            <div className="form-group global-form row mt-5">
              <div className="col-lg-3">
                <NewSelect
                  name="voyageType"
                  options={[
                    { value: 1, label: "Time Charter" },
                    { value: 2, label: "Voyage Charter" },
                  ]}
                  value={values.voyageType}
                  label="Voyage Type"
                  onChange={(valueOption) =>
                    setFieldValue("voyageType", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={viewId}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="shipType"
                  options={[
                    { value: 1, label: "Own Ship" },
                    { value: 2, label: "Charterer Ship" },
                  ]}
                  value={values.shipType}
                  label="Ship Type"
                  onChange={(valueOption) =>
                    setFieldValue("shipType", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={viewId}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="vesselName"
                  options={vesselDDL}
                  value={values.vesselName}
                  label="Vessel Name"
                  onChange={(valueOption) =>
                    setFieldValue("vesselName", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={viewId}

                />
              </div>

              <div className="col-lg-3">
                <NewSelect
                  name="deliveryPort"
                  options={portDDL}
                  value={values.deliveryPort}
                  label="Delivery Port"
                  onChange={(valueOption) =>
                    setFieldValue("deliveryPort", valueOption)
                  }
                  errors={errors}
                  touched={touched}
                  isDisabled={viewId}

                />
              </div>


              <div className="col-lg-3">
                <InputField
                  value={values.laycanFrom}
                  label="Laycan From Date"
                  name="laycanFrom"
                  type="date"
                  onChange={(e) => setFieldValue("laycanFrom", e.target.value)}
                  errors={errors}
                  disabled={viewId}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.laycanTo}
                  label="Laycan To Date"
                  name="laycanTo"
                  type="date"
                  onChange={(e) => setFieldValue("laycanTo", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dteVoyageCommenced}
                  label="Voyage Commenced Date"
                  name="dteVoyageCommenced"
                  type="date"
                  onChange={(e) =>
                    setFieldValue("dteVoyageCommenced", e.target.value)
                  }
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dteVoyageCompletion}
                  label="Estimated Voyage Completion Date"
                  name="dteVoyageCompletion"
                  type="date"
                  onChange={(e) =>
                    setFieldValue("dteVoyageCompletion", e.target.value)
                  }
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadRate}
                  label="Load Rate (Mts)
"
                  name="loadRate"
                  type="number"
                  onChange={(e) => setFieldValue("loadRate", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.demurrageDispatch}
                  label="Demurrage"
                  name="demurrageDispatch"
                  type="number"
                  onChange={(e) => {
                    setFieldValue("demurrageDispatch", e.target.value);
                    setFieldValue("numDispatch", +e.target.value / 2);
                  }}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.numDispatch}
                  label="Dispatch"
                  name="numDispatch"
                  type="number"
                  onChange={(e) => setFieldValue("numDispatch", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.etaLoadPort}
                  label="ETA Load Port Date"
                  name="etaLoadPort"
                  type="date"
                  onChange={(e) => setFieldValue("etaLoadPort", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values.dischargeRate}
                  label="Discharge Rate (Mts)"
                  name="dischargeRate"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("dischargeRate", e.target.value)
                  }
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.freight}
                  label="Freight"
                  name="freight"
                  type="number"
                  onChange={(e) => setFieldValue("freight", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.loadPortDA}
                  label="Load Port D/A"
                  name="loadPortDA"
                  type="number"
                  onChange={(e) => setFieldValue("loadPortDA", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.dischargePortDA}
                  label="Discharge Port D/A"
                  name="dischargePortDA"
                  type="number"
                  onChange={(e) =>
                    setFieldValue("dischargePortDA", e.target.value)
                  }
                  errors={errors}
                  disabled={viewId}

                />
              </div>

              <div className="col-lg-3">
                <NewSelect
                  name="brokerName"
                  options={brokerList}
                  value={values?.brokerName}
                  label="Broker Name"
                  onChange={(valueOption) => {
                    setFieldValue("brokerName", valueOption);
                    setFieldValue("brokerEmail", valueOption?.email || "");
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.brokerEmail}
                  label="Broker Email (if multiple email use comma)"
                  name="brokerEmail"
                  type="email"
                  onChange={(e) => setFieldValue("brokerEmail", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values.strRemarks}
                  label="Remarks"
                  name="strRemarks"
                  type="test"
                  onChange={(e) => setFieldValue("strRemarks", e.target.value)}
                  errors={errors}
                  disabled={viewId}

                />
              </div>
            </div>

            {chartererList?.length > 0 && (<div className="row mt-3">
              <div className="col-12">
                {chartererList.length > 0 && (
                  <div className="table-responsive">
                    <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>SL</th>
                          <th>Charterer Name</th>
                          <th>Freight Rate</th>
                          <th>Shipper Name</th>
                          <th>Shipper Email</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {chartererList.map((charterer, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{charterer.strChartererName}</td>
                            <td className="text-center">{charterer.numFreightRate}</td>
                            <td>{charterer.strShipperName}</td>
                            <td className="text-center">{charterer.strShipperEmailForVesselNomination}</td>
                            <td className="text-center d-flex justify-content-around">
                              {!viewId && (<span onClick={() => {
                                const deletedChartererList = chartererList?.filter((item, index) => index !== idx);
                                setChartererList(deletedChartererList)
                              }}>
                                <IDelete />
                              </span>)}
                              <span onClick={(e) => {
                                e.stopPropagation();
                                setIsShowModal(true);
                                setSingleData(charterer)
                              }}>
                                <IView />
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>)}

            {!viewId && (<div className="my-3">
              <ChartererComponent
                viewId={viewId}
                chartererList={chartererList}
                setChartererList={setChartererList}
                chartererDDL={chartererDDL}
                cargoDDL={cargoDDL}
                portDDL={portDDL}
                values={values}
                setFieldValue={setFieldValue}
                errors={errors}
                touched={touched}
                shipperNameList={shipperNameList}
              />
            </div>)}

            {isShowModal && (
              <IViewModal
                show={isShowModal}
                onHide={() => {
                  setIsShowModal(false);
                  setSingleData(null);
                }}
                title="Cargo List"
              >
                <NominationCargosList nominationCargosList={singleData?.nominationCargosList} isModalView={true} />
              </IViewModal>
            )}

          </Form>
        </IForm>
      )}
    </Formik>
  );
}
