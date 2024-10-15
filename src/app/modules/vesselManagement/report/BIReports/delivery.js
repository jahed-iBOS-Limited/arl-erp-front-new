import { Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import PowerBIReport from "../../../_helper/commonInputFieldsGroups/PowerBIReport";
import IButton from "../../../_helper/iButton";
import ICustomCard from "../../../_helper/_customCard";
import NewSelect from "../../../_helper/_select";
import {
  GetLighterVesselDDL,
  // getMotherVesselDDL,
  getShippointDDL,
} from "./helper";
import FromDateToDateForm from "../../../_helper/commonInputFieldsGroups/dateForm";
import { _todayDate } from "../../../_helper/_todayDate";
import { PortAndMotherVessel } from "../../common/components";

const DeliveryReportRDLC = () => {
  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const reportId = `cf508add-c97b-4925-b5ba-3a3d9d170e61`;

  const [showReport, setShowReport] = React.useState(false);
  // const [motherVesselDDL, setMotherVesselDDL] = React.useState([]);
  const [lighterVessel, setLighterVessel] = React.useState([]);
  const [shippointDDL, setShippointDDL] = React.useState([]);

  const initData = {
    type: "",
    shippoint: "",
    motherVessel: "",
    lighterVessel: "",
    port: "",
    soldToPartner: "",
    fromDate: _todayDate(),
    toDate: _todayDate(),
  };

  const parameterValues = (values) => {
    return [
      { name: "intpartid", value: `${+values?.type?.value}` },
      {
        name: "intshippingPointid",
        value: `${values?.shippoint?.value?.toString()}`,
      },
      { name: "intMotherVesselId", value: `${+values?.motherVessel?.value}` },
      { name: "intlighterid", value: `${+values?.lighterVessel?.value}` },
      { name: "dteFromdDate", value: `${values?.fromDate}` },
      { name: "dteToDate", value: `${values?.toDate}` },
      {
        name: "intSoldToPartnerId",
        value: `${values?.soldToPartner?.value?.toString()}`,
      },
      { name: "IntPortId", value: `${values?.port?.value}` },
    ];
  };

  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getShippointDDL(accId, buId, setShippointDDL);
    // getMotherVesselDDL(accId, buId, 0, setMotherVesselDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Delivery Report">
            
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="type"
                    options={[
                      { value: 1, label: "Top Sheet" },
                      { value: 2, label: "Delivery with Last Day" },
                      { value: 3, label: "Details" },
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
                <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => {
                      setShowReport(false);
                    },
                  }}
                />
                <div className="col-lg-3">
                  <NewSelect
                    name="soldToPartner"
                    options={[
                      { value: 73244, label: "G2G BADC" },
                      { value: 73245, label: "G2G BCIC" },
                    ]}
                    value={values?.soldToPartner}
                    label="Business Partner"
                    onChange={(e) => {
                      setFieldValue("soldToPartner", e);
                      setShowReport(false);
                    }}
                    placeholder="Business Partner"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shippoint"
                    options={
                      [{ value: 0, label: "All" }, ...shippointDDL] || []
                    }
                    label="Shippoint"
                    value={values?.shippoint}
                    onChange={(valueOption) => {
                      setShowReport(false);
                      setFieldValue("shippoint", valueOption);
                    }}
                    placeholder="Shippoint"
                  />
                </div>
                <PortAndMotherVessel
                  obj={{
                    values,
                    setFieldValue,
                    onChange: (fieldName, allValues) => {
                      setShowReport(false);

                      if (fieldName === "motherVessel") {
                        GetLighterVesselDDL(
                          allValues?.motherVessel?.value,
                          setLighterVessel
                        );
                        setFieldValue("lighterVessel", "");
                      }
                    },
                  }}
                />
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="motherVessel"
                    options={
                      [{ value: 0, label: "All" }, ...motherVesselDDL] || []
                    }
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
                </div> */}
                <div className="col-lg-3">
                  <NewSelect
                    name="lighterVessel"
                    options={
                      [{ value: 0, label: "All" }, ...lighterVessel] || []
                    }
                    label="Lighter Vessel"
                    value={values?.lighterVessel}
                    onChange={(valueOption) => {
                      setFieldValue("lighterVessel", valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Lighter Vessel"
                  />
                </div>
                <IButton
                  // colSize={"col-lg-1"}
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

export default DeliveryReportRDLC;
