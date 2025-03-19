import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import PowerBIReport from "../../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import { GetCarrierDDL, GetDomesticPortDDL, GetLighterVesselDDL, getMotherVesselDDL, getShippointDDL, getSupplierDDL } from "../../BIReports/helper";

const VesselCostInfo = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `b6697f59-9892-49a5-ac61-c98ccc846152`;

  const [showReport, setShowReport] = useState(false);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [lighterVessel, setLighterVessel] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [shippointDDL, setShippointDDL] = React.useState([]);
  const [supplierDDL, setSupplierDDL] = useState([]);
  const [carrierDDL, setCarrierDDL] = useState([]);

  const initData = {
    type: '',
    port: "",
    shippoint: "",
    motherVessel: "",
    lighterVessel: "",
    supplier: "",
    carrier: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
  };

  const parameterValues = (values) => {
    return [
      { name: "PartId", value: `${+values?.type?.value}` },
      { name: "PortId", value: `${+values?.port?.value}` },
      { name: "intShipPointId", value: `${+values?.shippoint?.value}` },
      { name: "intMothervesselid", value: `${+values?.motherVessel?.value}` },
      { name: "intliightervessel", value: `${+values?.lighterVessel?.value}` },
      { name: "intSupplierId", value: `${+values?.supplier?.value}` },
      { name: "intLocalAgentId", value: `${+values?.carrier?.value}` },
      { name: "FromDate", value: `${values?.fromDate}` },
      { name: "ToDate", value: `${values?.toDate}` },
    ];
  };

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getShippointDDL(accId, buId, setShippointDDL);
    getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    GetDomesticPortDDL(setPortDDL);
    getSupplierDDL(accId, buId, setSupplierDDL);
    GetCarrierDDL(accId, buId, 0, setCarrierDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Vessel Cost Info">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Pay to Truck Supplier" },
                      { value: 2, label: "Collection Bill From Government" },
                      { value: 3, label: "Payment to Carrier Agent" },
                    ]}
                    label="Type"
                    value={values?.type}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("type", valueOption);
                    }}
                    placeholder="Type"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="port"
                    options={[
                      { value: 0, label: "All" },
                      ...portDDL
                    ] || []}
                    label="Port"
                    value={values?.port}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("port", valueOption);
                    }}
                    placeholder="Port"
                  />
                </div>
                <div className="col-lg-3">
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
                </div>

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
                <div className="col-lg-3">
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
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="supplier"
                    options={[
                      { value: 0, label: "All" },
                      ...supplierDDL
                    ] || []}
                    label="Supplier"
                    value={values?.supplier}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("supplier", valueOption);
                    }}
                    placeholder="Supplier"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="carrier"
                    options={
                      [
                        { value: 0, label: "All" },
                        ...carrierDDL
                      ]
                    }
                    label="Local Agent"
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("carrier", valueOption);
                    }}
                    placeholder="Local Agent"
                  />
                </div>
                <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                      setShowReport(false);
                    },
                    colSize: "col-lg-3",
                  }}
                />
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
                reportId={reportId}
                groupId={groupId}
                parameterValues={parameterValues(values)}
                parameterPanel={false}
              />
            )}
          </ICustomCard>
        )}
      </Formik>
    </>
  );
};

export default VesselCostInfo;
