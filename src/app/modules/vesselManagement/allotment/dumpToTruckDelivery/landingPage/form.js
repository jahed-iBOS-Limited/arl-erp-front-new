/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import { PortAndMotherVessel } from "../../../common/components";
import IButton from "../../../../_helper/iButton";

const DumpToTruckDeliveryLandingForm = ({ obj }) => {
  const {
    values,
    pageNo,
    getData,
    pageSize,
    isLoading,
    lighterDDL,
    shipPointDDL,
    getLighterDDL,
    setFieldValue,
  } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form">
          <div className="row">
            <div className="col-lg-3">
              <NewSelect
                name="shipPoint"
                options={shipPointDDL}
                value={values?.shipPoint}
                label="ShipPoint"
                onChange={(e) => {
                  setFieldValue("shipPoint", e);
                }}
                placeholder="ShipPoint"
              />
            </div>
            <PortAndMotherVessel
              obj={{
                values,
                setFieldValue,
                allElement: false,
                onChange: (fieldName, allValues) => {
                  if (fieldName === "motherVessel") {
                    getLighterDDL(
                      `/wms/FertilizerOperation/GetLighterVesselDDL?MotherVesselId=${allValues?.motherVessel?.value}`
                    );
                  }
                },
              }}
            />
            <div className="col-lg-3">
              <NewSelect
                name="lighterVessel"
                options={lighterDDL}
                value={values?.lighterVessel}
                label="Lighter Vessel"
                onChange={(e) => {
                  setFieldValue("lighterVessel", e);
                }}
                placeholder="Lighter"
                isDisabled={!values?.motherVessel}
              />
            </div>
            <FromDateToDateForm obj={{ values, setFieldValue }} />
            <div className="col-lg-3">
              <NewSelect
                name="status"
                value={values?.status}
                label="Status"
                placeholder="Status"
                options={[
                  { value: 0, label: "All" },
                  { value: 1, label: "Pending" },
                  { value: 2, label: "Approved" },
                ]}
                onChange={(e) => {
                  setFieldValue("status", e);
                }}
              />
            </div>

            <IButton
              onClick={() => {
                getData(values, pageNo, pageSize);
              }}
              disabled={
                !values?.shipPoint ||
                !values?.lighterVessel ||
                !values?.status ||
                isLoading
              }
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default DumpToTruckDeliveryLandingForm;
