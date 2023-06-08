/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation } from "react-router";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "../../../../_helper/_loading";
import {
  GetDomesticPortDDL,
  getMotherVesselDDL,
} from "../../loadingInformation/helper";
import { editMotherVesselVoyageInfo } from "../helper";
import Form from "./form";

const initData = {
  voyageCode: "",
  motherVessel: "",
  lcNumber: "",
  blQty: "",
  narration: "",
  loadingPort: "",
  dischargingPort: "",
  cnf: "",
  stevedore: "",
  eta: "",
};

export default function MotherVesselVoyageInfoForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { state } = useLocation();
  const { id, type } = useParams();
  const [objProps] = useState({});
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [cnfDDL, getCnfDDL] = useAxiosGet();
  const [steveDoreDDL, getSteveDoreDDL] = useAxiosGet();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!type || type !== "view") {
      GetDomesticPortDDL(setDomesticPortDDL);
      getMotherVesselDDL(accId, buId, setMotherVesselDDL);
      getCnfDDL(`wms/FertilizerOperation/GetLighterCNFDDL`);
      getSteveDoreDDL(`/wms/FertilizerOperation/GetLighterStevedoreDDL`);
    }
    if (id) {
      const {
        blqnt,
        cnfId,
        cnfName,
        dischargingPortId,
        dischargingPortName,
        eta,
        lcnumber,
        loadingPortId,
        loadingPortName,
        motherVesselId,
        motherVesselName,
        narration,
        stebdoreId,
        stebdoreName,
        voyageCode,
      } = state;
      const singleInfo = {
        voyageCode: voyageCode,
        motherVessel: {
          value: motherVesselId,
          label: motherVesselName,
        },
        lcNumber: lcnumber,
        blQty: blqnt,
        narration: narration,
        loadingPort: {
          value: loadingPortId,
          label: loadingPortName,
        },
        dischargingPort: {
          value: dischargingPortId,
          label: dischargingPortName,
        },
        cnf: {
          value: cnfId,
          label: cnfName,
        },
        stevedore: {
          value: stebdoreId,
          label: stebdoreName,
        },
        eta: _dateFormatter(eta),
      };
      setSingleData(singleInfo);
    }
  }, [accId, buId, type]);

  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = {
        voyageCode: values?.voyageCode || "",
        accountId: accId,
        businessUnitId: buId,
        motherVesselId: values?.motherVessel?.value,
        motherVesselName: values?.motherVessel?.label,
        lcnumber: values?.lcNumber,
        blqnt: values?.blQty || 1,
        eta: values?.eta,
        actionby: userId,
        narration: values?.narration,
        loadingPortId: values?.loadingPort?.value,
        loadingPortName: values?.loadingPort?.label,
        dischargingPortId: values?.dischargingPort?.value,
        dischargingPortName: values?.dischargingPort?.label,
        cnfId: values?.cnf?.value || 0,
        cnfName: values?.cnf?.label || "",
        stebdoreId: values?.stevedore?.value || 0,
        stebdoreName: values?.stevedore?.label || "",
      };
      postData(
        `/tms/LigterLoadUnload/CreateMotherVesselVoyageInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    } else {
      const payload = {
        voyageNo: id,
        voyageCode: values?.voyageCode || "",
        motherVesselId: values?.motherVessel?.value,
        motherVesselName: values?.motherVessel?.label,
        lcnumber: values?.lcNumber,
        blqnt: values?.blQty || 1,
        eta: values?.eta,
        narration: values?.narration,
        loadingPortId: values?.loadingPort?.value,
        loadingPortName: values?.loadingPort?.label,
        dischargingPortId: values?.dischargingPort?.value,
        dischargingPortName: values?.dischargingPort?.label,
        cnfId: values?.cnf?.value || 0,
        cnfName: values?.cnf?.label || "",
        stebdoreId: values?.stevedore?.value || 0,
        stebdoreName: values?.stevedore?.label || "",
      };
      editMotherVesselVoyageInfo(payload, setLoading);
    }
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "motherVessel":
        setFieldValue("motherVessel", currentValue);
        break;

      case "loadingPort":
        setFieldValue("loadingPort", currentValue);
        break;

      case "dischargingPort":
        setFieldValue("dischargingPort", currentValue);
        break;

      case "cnf":
        setFieldValue("cnf", currentValue);
        break;

      case "stevedore":
        setFieldValue("stevedore", currentValue);
        break;

      default:
        break;
    }
  };

  const title = `${
    type === "view" ? "View" : type === "edit" ? "Edit" : "Enter"
  } Mother Vessel Voyage Information`;

  return (
    <>
      {(isLoading || loading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          title={title}
          viewType={type}
          saveHandler={saveHandler}
          domesticPortDDL={domesticPortDDL}
          motherVesselDDL={motherVesselDDL}
          onChangeHandler={onChangeHandler}
          initData={id ? singleData : initData}
          cnfDDL={cnfDDL}
          steveDoreDDL={steveDoreDDL}
        />
      </div>
    </>
  );
}
