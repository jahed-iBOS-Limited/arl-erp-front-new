/* eslint-disable jsx-a11y/no-distracting-elements */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
const initData = {
  shippingPoint: "",
  route: "",
  wareHouse: "",
  transportZone: "",
};

export default function KeyRegisterLanding() {
  const { id } = useParams();
  const location = useLocation();
  const [objProps, setObjprops] = useState({});
  const [shipPointDDL, getShipPointDDL, shipPointDDLLodar] = useAxiosGet();
  const [
    TransportZoneDDL,
    getTransportZoneDDL,
    TransportZoneDDLLodar,
  ] = useAxiosGet();
  const [routeDDL, getRouteDDL, routeDDLLoader] = useAxiosGet();
  const [wareHouseDDL, getWareHouseDDL, wareHouseDDLLoader] = useAxiosGet();
  const [, saveData, saveDataLoader] = useAxiosPost();
  const [modiFyData, setModiFyData] = useState({});
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const saveHandler = (values, cb) => {
    console.log("values", values);
    if (!values?.shippingPoint?.value)
      return toast.warn("Please select shipping point");
    if (!values?.route?.value) return toast.warn("Please select route");
    if (!values?.wareHouse?.value) return toast.warn("Please select warehouse");
    if (!values?.transportZone?.value)
      return toast.warn("Please select transport zone");
    const payload = {
      intAutoId: id ? +id : 0,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intAccountId: profileData?.accountId,
      intShipPointId: values?.shippingPoint?.value,
      intWhid: values?.wareHouse?.value,
      intTransportZoneId: values?.transportZone?.value,
      intRouteId: values?.route?.value,
      userId: id ? profileData?.userId : null,
    };
    saveData(
      id
        ? `/oms/POSDamageEntry/EditWareHouseZone`
        : `/oms/POSDamageEntry/CreateWareHouseZone`,
      payload,
      cb,
      true
    );
  };
  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    getTransportZoneDDL(
      `/tms/TransportZone/GetTransportZoneDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
    if (location?.state) {
      getWareHouseDDL(
        `/wms/ShipPoint/GetTransportShipPointWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&ShipPointid=${location?.state?.intShipPointId}`
      );
      getRouteDDL(
        `/wms/ShipPoint/GetTransportZoneRouteDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&TransportZoneId=${location?.state?.intTransportZoneId}`
      );
      setModiFyData({
        shippingPoint: {
          value: location?.state?.intShipPointId,
          label: location?.state?.shipPointName,
        },
        route: {
          value: location?.state?.intRouteId,
          label: location?.state?.routeName,
        },
        wareHouse: {
          value: location?.state?.intWhid,
          label: location?.state?.wareHouseName,
        },
        transportZone: {
          value: location?.state?.intTransportZoneId,
          label: location?.state?.transPortZoneName,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modiFyData : initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          !id && resetForm(initData);
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
          {(saveDataLoader ||
            TransportZoneDDLLodar ||
            shipPointDDLLodar ||
            routeDDLLoader ||
            wareHouseDDLLoader) && <Loading />}
          <IForm
            title={
              id
                ? "Edit Shipping Point Transport Zone"
                : "Create Shipping Point Transport Zone"
            }
            getProps={setObjprops}
          >
            {!id && (
              <marquee
                direction="left"
                style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
              >
                Note: Firstly configure WareHouse
              </marquee>
            )}
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="shippingPoint"
                    options={shipPointDDL}
                    value={values?.shippingPoint}
                    label="Shipping Point"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("shippingPoint", valueOption);
                        setFieldValue("transportZone", "");
                        getWareHouseDDL(
                          `/wms/ShipPoint/GetTransportShipPointWareHouseDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&ShipPointid=${valueOption?.value}`
                        );
                      } else {
                        setFieldValue("shippingPoint", "");
                        setFieldValue("transportZone", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id ? true : false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="transportZone"
                    options={TransportZoneDDL}
                    value={values?.transportZone}
                    label="Transport Zone"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("transportZone", valueOption);
                        !id && setFieldValue("route", "");
                        !id &&
                          getRouteDDL(
                            `/wms/ShipPoint/GetTransportZoneRouteDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&TransportZoneId=${valueOption?.value}`
                          );
                      } else {
                        setFieldValue("transportZone", "");
                        !id && setFieldValue("route", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="route"
                    options={routeDDL}
                    value={values?.route}
                    label="Route"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("route", valueOption);
                        !id && setFieldValue("wareHouse", "");
                      } else {
                        setFieldValue("route", "");
                        !id && setFieldValue("wareHouse", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id ? true : false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="wareHouse"
                    options={wareHouseDDL}
                    value={values?.wareHouse}
                    label="WareHouse"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("wareHouse", valueOption);
                      } else {
                        setFieldValue("wareHouse", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={id ? true : false}
                  />
                </div>
              </div>
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
