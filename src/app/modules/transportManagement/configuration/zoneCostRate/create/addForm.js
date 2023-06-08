import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import {
  createZoneCostSetup,
  editZoneCostSetup,
  getZoneCostSetupById,
  getZoneDDL,
  getShipPointDDL,
  getIsSubsidyRunningApi,
  getIsAmountBase,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

const initData = {
  checkPostName: "",
  zone: "",
  shipPoint: "",
  num1TonRate: 0,
  num1point5TonRate: 0,
  num2TonRate: 0,
  num3tonRate: 0,
  num5tonRate: 0,
  num7tonRate: 0,
  num14TonRate: 0,
  num20TonRate: 0,
  distanceKm: "",
  additionalAmount: 0,
  handlingCost: 0,
  labourCost: 0,
  labourCostLess6Ton: 0,
  isAmountBase: false, // Checkbox
  isAmountBase2: true, // Checkbox
  isSlabProgram: false, // Checkbox
  rangeFrom: "",
  rangeTo: "",
  slabRate: "",
  categoryName: "",
  subsidiaryRate: 0,
};

export default function ZoneCostRateForm() {
  const [isSubsidyRunning, setIsSubsidyRunning] = useState(false);
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const [rows, setRows] = useState([]);
  const params = useParams();
  const [isAmountBase, setIsAmountBase] = useState(false);

  const [zoneDDL, setZoneDDL] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);

  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (params?.id || params?.viewId) {
      getZoneCostSetupById(
        params?.id || params?.viewId,
        setSingleData,
        setRows,
        setDisabled
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  useEffect(() => {
    getIsSubsidyRunningApi(accId, buId, setIsSubsidyRunning);
    getZoneDDL(accId, buId, setZoneDDL);
    getShipPointDDL(accId, buId, setShipPointDDL);
    getIsAmountBase(buId, setIsAmountBase);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const addRows = (values, setFieldValue) => {
    const {
      rangeFrom,
      rangeTo,
      slabRate,
      categoryName,
      // isAmountBase2,
    } = values;
    if (!rangeFrom) return toast.error("Please enter Range From");
    if (!rangeTo) return toast.error("Please enter Range To");
    if (!slabRate) return toast.error("Please enter Slab Rate");
    const row = {
      slabRateId: 0,
      zoneCostId: 0,
      categoryId: categoryName?.value || 0,
      rangeFrom: rangeFrom,
      rangeTo: rangeTo,
      slabRate: slabRate,
      categoryName: buId === 171 || buId === 224 ? categoryName?.label : categoryName,
      isAmountBase: isAmountBase,
    };
    setRows([...rows, row]);
    setFieldValue("rangeFrom", "");
    setFieldValue("rangeTo", "");
    setFieldValue("slabRate", "");
    setFieldValue("categoryName", "");
    // setFieldValue("isAmountBase2", true);
  };

  const remover = (idx) => {
    const data = rows.filter((item, index) => index !== idx);
    setRows(data);
  };

  const saveHandler = async (values, cb) => {
    if (isAmountBase === null) {
      return toast.error("Business unit operation not configured!");
    }
    if (accId && buId) {
      const payload = {
        zoneCostId: +params?.id,
        accountId: !params?.id ? accId : undefined,
        businessUnitId: !params?.id ? buId : undefined,
        shipPointId: +values?.shipPoint?.value,
        shipPointName: values?.shipPoint?.label,
        zoneId: +values?.zone?.value,
        zoneName: values?.zone?.label,
        num3tonRate: +values?.num3tonRate,
        num5tonRate: +values?.num5tonRate,
        num7tonRate: +values?.num7tonRate,
        num1point5TonRate: +values?.num1point5TonRate,
        num1TonRate: +values?.num1TonRate,
        num14TonRate: +values?.num14TonRate,
        num2TonRate: +values?.num2TonRate,
        num20TonRate: +values?.num20TonRate,
        isAmountBase: isAmountBase,
        // isAmountBase: values?.isAmountBase,
        distanceKm: +values?.distanceKm,
        additionalAmount: +values?.additionalAmount,
        handlingCost: +values?.handlingCost,
        labourCost: +values?.labourCost,
        labourCostLess6: +values?.labourCostLess6Ton,
        subsidiaryRate: +values?.subsidiaryRate,
        actionBy: userId,

        /* Without This 3 field Can't Edit */
        lastActionDateTime: values?.lastActionDateTime,
        serverDateTime: values?.serverDateTime,
        isActive: values?.isActive,
        isSlabProgram: values?.isSlabProgram,
        rateSalbs: rows,
      };
      if (values?.isSlabProgram && rows?.length < 1) {
        return toast.warn("Please add at least one row");
      } else if (params?.id) {
        editZoneCostSetup(payload, setDisabled);
      } else {
        createZoneCostSetup(payload, cb, setDisabled);
      }
    }
  };

  return (
    <IForm
      title={"Create Zone Cost Rate"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={params?.viewId}
      isHiddenSave={params?.viewId}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.id || params?.viewId
            ? { ...singleData, isAmountBase2: true }
            : initData
        }
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setSingleData={setSingleData}
        isEdit={params?.id || false}
        isView={params?.viewId || false}
        zoneDDL={zoneDDL}
        shipPointDDL={shipPointDDL}
        rows={rows}
        setRows={setRows}
        addRows={addRows}
        remover={remover}
        isSubsidyRunning={isSubsidyRunning}
        isAmountBase={isAmountBase}
        buId={buId}
      />
    </IForm>
  );
}
