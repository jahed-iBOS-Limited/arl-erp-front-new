import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  createShippmentTerritory,
  getAreaDDL,
  getShipPointDDL,
} from "../helper";
import Form from "./form";

const initData = {
  area: "",
  shipPoint: "",
  channel: "",
  region: "",
};

export default function ShippmentTerritoryForm() {
  const params = useParams();

  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, ] = useState({});
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [areaDDL, setAreaDDL] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    getChannelDDL(
      `/oms/TerritoryInfo/GetChannelListByBusinessUnitId?BusinessUnitId=${buId}`
    );
    getAreaDDL(accId, buId, setAreaDDL);
    getShipPointDDL(accId, buId, setShipPointDDL);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = async (values, cb) => {
    if (accId && buId) {
      const payload = {
        areaId: values?.area?.value,
        shippingPointId: values?.shipPoint?.value,
        active: true,
        insertBy: userId,
      };
      createShippmentTerritory(payload, cb, setDisabled);
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id || params?.viewId ? singleData : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        isView={params?.viewId || false}
        areaDDL={areaDDL}
        shipPointDDL={shipPointDDL}
        channelDDL={channelDDL?.map((item) => ({
          ...item,
          value: item?.distributionChannelId,
          label: item?.distributionChannelName,
        }))}
      />
    </>
  );
}
