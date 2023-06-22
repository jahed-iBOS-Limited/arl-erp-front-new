/* eslint-disable jsx-a11y/no-distracting-elements */
import { Formik } from "formik";
import React from "react";
import NewSelect from "../../../../_helper/_select";
import ICustomCard from "../../../../_helper/_customCard";
import { validationSchema } from "../helper";
import Loading from "../../../../_helper/_loading";

export default function Form({ obj }) {
  const {
    id,
    buId,
    accId,
    title,
    history,
    zoneDDL,
    loading,
    routeDDL,
    initData,
    getRouteDDL,
    saveHandler,
    shipPointDDL,
    wareHouseDDL,
    getWareHouseDDL,
  } = obj;

  return (
    <Formik
      enableReinitialize={true}
      validationSchema={validationSchema}
      initialValues={initData}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        values,
        setFieldValue,
        errors,
        touched,
        resetForm,
        handleSubmit,
      }) => (
        <ICustomCard
          title={title}
          saveHandler={() => {
            handleSubmit();
          }}
          resetHandler={
            !id
              ? () => {
                  resetForm(initData);
                }
              : ""
          }
          backHandler={() => {
            history.goBack();
          }}
        >
          {loading && <Loading />}
          {!id && (
            <marquee
              direction="left"
              style={{ fontSize: "15px", fontWeight: "bold", color: "red" }}
            >
              Note: Firstly configure WareHouse
            </marquee>
          )}
          <form>
            <div className="form-group  global-form row">
              <div className="col-lg-3">
                <NewSelect
                  name="shippingPoint"
                  options={shipPointDDL}
                  value={values?.shippingPoint}
                  label="Shipping Point"
                  onChange={(valueOption) => {
                    setFieldValue("shippingPoint", valueOption);
                    setFieldValue("transportZone", "");
                    if (valueOption) {
                      getWareHouseDDL(
                        `/wms/ShipPoint/GetTransportShipPointWareHouseDDL?accountId=${accId}&businessUnitId=${buId}&ShipPointid=${valueOption?.value}`
                      );
                    }
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={id}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="transportZone"
                  options={zoneDDL}
                  value={values?.transportZone}
                  label="Transport Zone"
                  onChange={(valueOption) => {
                    setFieldValue("transportZone", valueOption);
                    setFieldValue("route", "");
                    if (valueOption) {
                      getRouteDDL(
                        `/wms/ShipPoint/GetTransportZoneRouteDDL?accountId=${accId}&businessUnitId=${buId}&TransportZoneId=${valueOption?.value}`
                      );
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
                      if (!id) {
                        setFieldValue("wareHouse", "");
                      }
                    }
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={id || !values?.transportZone}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="wareHouse"
                  options={wareHouseDDL}
                  value={values?.wareHouse}
                  label="WareHouse"
                  onChange={(valueOption) => {
                    setFieldValue("wareHouse", valueOption);
                  }}
                  errors={errors}
                  touched={touched}
                  isDisabled={!values?.shippingPoint || id}
                />
              </div>
            </div>
          </form>
        </ICustomCard>
      )}
    </Formik>
  );
}
