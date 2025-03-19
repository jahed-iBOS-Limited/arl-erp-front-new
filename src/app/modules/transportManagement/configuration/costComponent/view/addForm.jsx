import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {  useParams } from "react-router-dom";
import { getRouteCostComponent } from "../helper";
import Loading from "../../../../_helper/_loading";
import IViewModal from "../../../../_helper/_viewModal";
const initData = {
  transportRouteCostComponent: "",
  businessTransaction: "",
};

export default function CostComponentViewForm({ id, show, onHide }) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const params = useParams();

  // taxbranch ddl
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (params?.id) {
      getRouteCostComponent(
        profileData?.accountId,
        params?.id,
        setSingleData,
        setDisabled
      );
    }
  }, [profileData, params]);

  return (
    <IViewModal show={show} onHide={onHide} title={"View Cost Component"}>
      {isDisabled && <Loading />}
      <Form
        initData={params?.id ? singleData : initData}
        rowDto={rowDto}
        accountId={profileData?.accountId}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
      />
    </IViewModal>
  );
}
