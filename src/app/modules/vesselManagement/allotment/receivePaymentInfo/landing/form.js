/* eslint-disable react-hooks/exhaustive-deps */
import React from "react";
import NewSelect from "../../../../_helper/_select";
import IButton from "../../../../_helper/iButton";
import { PortAndMotherVessel } from "../../../common/components";

const ReceivePaymentInfoLandingForm = ({ obj }) => {
  const {
    buId,
    values,
    gridData,
    godownDDL,
    setGridData,
    getGodownDDL,
    updateStatus,
    setFieldValue,
    setLandingData,
    soldToPartnerDDL,
  } = obj;

  return (
    <>
      <form className="form form-label-right">
        <div className="global-form row">
          <PortAndMotherVessel obj={{ values, setFieldValue, onChange: () => {
            setGridData([]);
          } }} />
          <div className="col-lg-3">
            <NewSelect
              name="soldToPartner"
              options={soldToPartnerDDL || []}
              value={values?.soldToPartner}
              label="Organization"
              onChange={(valueOption) => {
                setFieldValue("soldToPartner", valueOption);
                setFieldValue("shipToPartner", "");
                setGridData([]);
                getGodownDDL(
                  `/tms/LigterLoadUnload/GetShipToPartnerG2GDDL?BusinessUnitId=${buId}&BusinessPartnerId=${valueOption?.value}`
                );
              }}
              placeholder="Organization"
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="shipToPartner"
              options={[{ value: 0, label: "All" }, ...godownDDL]}
              value={values?.shipToPartner}
              label="Ship to Partner"
              placeholder="Ship to Partner"
              onChange={(e) => {
                setFieldValue("shipToPartner", e);
                setGridData([]);
              }}
            />
          </div>
          <div className="col-lg-3">
            <NewSelect
              name="status"
              options={[
                { value: 0, label: "Pending for Godown Clearance" },
                { value: 1, label: "Pending for Receipt Certificate" },
                { value: 2, label: "Pending for Bill Submit" },
                { value: 3, label: "Bill Submitted" },
              ]}
              value={values?.status}
              label="Status"
              onChange={(valueOption) => {
                setFieldValue("status", valueOption);
                setGridData([])
              }}
              placeholder="Status"
            />
          </div>

          <IButton
            colSize={"col-lg-3"}
            onClick={() => {
              setLandingData(values);
            }}
            disabled={
              !values?.motherVessel ||
              !values?.soldToPartner ||
              !values?.shipToPartner ||
              !values?.status
            }
          />
          {gridData?.length > 0 && [0, 1, 2].includes(values?.status?.value) && (
            <IButton
              className={"btn-info"}
              onClick={() => {
                updateStatus(values);
              }}
              disabled={
                gridData?.filter((item) => item?.isSelected)?.length < 1
              }
            >
              {`${
                values?.status?.value === 0
                  ? "Godown Clearance Gotten"
                  : values?.status?.value === 1
                  ? "Receipt Certificate Gotten"
                  : values?.status?.value === 2
                  ? "Bill Submitted"
                  : ""
              }`}
            </IButton>
          )}
        </div>
      </form>
    </>
  );
};

export default ReceivePaymentInfoLandingForm;
