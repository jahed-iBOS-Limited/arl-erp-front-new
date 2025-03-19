import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../_helper/iButton";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import { GetLighterVesselDDL, getMotherVesselDDL, getShippointDDL } from "./helper";

const DayByDayUnloadAndDelivery = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const getReportId = (values) => {
    const reportId = [1].includes(values?.reportType?.value) ? `00aa2f41-2520-40ad-9644-fe75486f5a20` : [2].includes(values?.reportType?.value) ? `03f654d8-b8e5-45c7-80c4-959d731953ec` : "";

    return reportId;

  }
  const [showReport, setShowReport] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [shippointDDL, setShippointDDL] = useState([]);

  const initData = {
    fromDate: _todayDate(),
    toDate: _todayDate(),
    shippoint: "",
    motherVessel: "",
    lighterVessel: "",
    reportType: { value: 1, label: "Data base Recieve N Delivery" },
    port: "",
    viewType: ""
  };

  const parameterValues = (values, buId) => {
    // console.log(values?.fromDate);
    return [1].includes(values?.reportType?.value) ? [
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
      { name: "intshippingPointid", value: `${+values?.shippoint?.value}` },
      { name: "intMotherVesselId", value: `${+values?.motherVessel?.value}` },
      { name: "intlighterid", value: `${+values?.lighterVessel?.value}` },
      { name: "intUnitid", value: `${buId}` },
    ] : [2].includes(values?.reportType?.value) ? [
      { name: "intMothervesselid", value: `${+values?.motherVessel?.value}` },
      { name: "intPortId", value: `${+values?.port?.value}` },
      { name: "intUnitid", value: `${buId}` },
      { name: "intPartId", value: `${values?.viewType?.value}` },
    ] : [];
  };

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getShippointDDL(accId, buId, setShippointDDL);
    getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Date Base Receive and Delivery Report">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: "Data base Recieve N Delivery" },
                      { value: 2, label: "G2G Challan Reconcile Report" }
                    ]}
                    label="Report Type"
                    value={values?.reportType}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("reportType", valueOption);
                    }}
                    placeholder="Shippoint"
                  />
                </div>
                {[1].includes(values?.reportType?.value) && (<div className="col-lg-3">
                  <NewSelect
                    name="shippoint"
                    options={[
                      { value: 0, label: "All" },
                      ...shippointDDL
                    ] || []}
                    label="Shippoint"
                    value={values?.shippoint}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("shippoint", valueOption);
                    }}
                    placeholder="Shippoint"
                  />
                </div>)}
                <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={[
                      { value: 0, label: "All" },
                      ...motherVesselDDL
                    ] || []}
                    value={values?.motherVessel}
                    label="Mother Vessel"
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("motherVessel", valueOption);
                      valueOption &&
                        GetLighterVesselDDL(
                          valueOption?.value,
                          setLighterVessel
                        );
                      setFieldValue("lighterVessel", "");
                    }}
                    placeholder="Mother Vessel"
                  />
                </div>
                {[1].includes(values?.reportType?.value) && (<div className="col-lg-3">
                  <NewSelect
                    name="lighterVessel"
                    options={[
                      { value: 0, label: "All" },
                      ...lighterVessel
                    ] || []}
                    label="Lighter Vessel"
                    value={values?.lighterVessel}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("lighterVessel", valueOption);
                    }}
                    placeholder="Lighter Vessel"
                  />
                </div>)}
                {[2].includes(values?.reportType?.value) && (<>
                  <div className="col-lg-3">
                    <NewSelect
                      name="port"
                      options={[
                        { value: 4, label: "Mongla" },
                        { value: 1, label: "Chattogram" }
                      ]}
                      label="Port"
                      value={values?.port}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue("port", valueOption);
                      }}
                      placeholder="Shippoint"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="viewType"
                      options={[
                        { value: 1, label: "Summary" },
                        { value: 2, label: "Details" }
                      ]}
                      label="View Type"
                      value={values?.viewType}
                      onChange={(valueOption) => {
                        setShowReport(false);
                        setFieldValue("viewType", valueOption);
                      }}
                      placeholder="Shippoint"
                    />
                  </div>
                </>)}
                {[1].includes(values?.reportType?.value) && (<FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                    colSize: "col-lg-3",
                  }}
                />)}
                <IButton
                  colSize={"col-lg-1"}
                  onClick={() => {
                    setShowReport(false);
                    setShowReport(true);
                  }}
                />
              </div>
            </form>
            {showReport && (
              <PowerBIReport
                reportId={getReportId(values)}
                groupId={groupId}
                parameterValues={parameterValues(values, buId)}
                parameterPanel={false}
              />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default DayByDayUnloadAndDelivery;
