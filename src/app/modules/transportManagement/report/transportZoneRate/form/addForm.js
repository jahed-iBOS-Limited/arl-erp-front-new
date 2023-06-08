import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useParams } from "react-router-dom";
import { EditTransportZoneRate, getZoneCostReportById } from "../helper";

const initData = {
  checkPostName: "",
  zone: "",
  shipPoint: "",
  num1TonRate: "",
  num1point5TonRate: "",
  num2TonRate: "",
  num3tonRate: "",
  num5tonRate: "",
  num7tonRate: "",
  num14TonRate: "",
  num20TonRate: "",
  distanceKm: "",
  additionalAmount: "",
  handlingCost: "",
  labourCost: "",
  isAmountBase: false, // Checkbox
};

export default function TransportZoneRateReportForm() {
  const [loading, setLoading] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps] = useState({});
  const params = useParams();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  useEffect(() => {
    if (params?.id || params?.viewId) {
      getZoneCostReportById(
        params?.id || params?.viewId,
        setSingleData,
        setLoading
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const saveHandler = async (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      const data = {
        zoneCostId: +params?.id,
        num3tonRate: +values?.num3tonRate,
        num5tonRate: +values?.num5tonRate,
        num7tonRate: +values?.num7tonRate,
        num1point5TonRate: +values?.num1point5TonRate,
        num1TonRate: +values?.num1TonRate,
        num14TonRate: +values?.num14TonRate,
        num2TonRate: +values?.num2TonRate,
        num20TonRate: +values?.num20TonRate,
        isAmountBase: values?.isAmountBase,
        distanceKm: +values?.distanceKm,
        additionalAmount: +values?.additionalAmount,
        actionBy: profileData?.userId,
        handlingCost: +values?.handlingCost,
        labourCost: +values?.labourCost,
      };
      if (params?.id) {
        EditTransportZoneRate(data, setLoading);
      }
    }
  };

  return (
    <Form
      {...objProps}
      initData={params?.id || params?.viewId ? singleData : initData}
      saveHandler={saveHandler}
      rowDto={rowDto}
      accountId={profileData?.accountId}
      profileData={profileData}
      selectedBusinessUnit={selectedBusinessUnit}
      setRowDto={setRowDto}
      setSingleData={setSingleData}
      isEdit={params?.id || false}
      isView={params?.viewId || false}
      loading={loading}
    />
  );
}
