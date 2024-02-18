import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  CreateLighterAllotment,
  EditLighterAllotment,
  GetDomesticPortDDL,
  GetLighterAllotmentById,
  GetLighterCNFDDL,
  GetLighterDDL,
  GetLighterStevedoreDDL,
  GetShipPointDDL,
} from "../helper";
import Form from "./form";

const initData = {
  motherVessel: "",
  programNo: "",
  loadingPort: "",
  item: "",
  cnf: "",
  steveDore: "",
  allotmentDate: _todayDate(),
  lotNo: "",
  type: "badc",
  organization: "",
};

export default function GeneralInformationCreate() {
  const { id, type } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // All DDL
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [lighterDDL, setLightertDDL] = useState([]);
  const [lighterCNFDDL, setLighterCNFDDL] = useState([]);
  const [lighterStevedoreDDL, setLighterStevedoreDDL] = useState([]);
  const [domesticPortDDL, setDomesticPortDDL] = useState([]);
  const [lighterList, setLighterList] = useState([]);
  const [motherVesselDDL, setMotherVesselDDL] = useState([]);
  const [singleData, setSingleData] = useState({});
  const [, getTenderInfo] = useAxiosGet({});
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetLighterCNFDDL(setLighterCNFDDL);
    GetLighterStevedoreDDL(setLighterStevedoreDDL);
    GetDomesticPortDDL(setDomesticPortDDL);
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    GetShipPointDDL(accId, buId, setShipPointDDL);
    GetLighterDDL(accId, buId, setLightertDDL);
    // getMotherVesselDDL(accId, buId, setMotherVesselDDL);
    if (id) {
      GetLighterAllotmentById({
        id,
        setter: setSingleData,
        setRowDto,
        setDisabled,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = async (values, cb) => {
    if (values && accId && buId) {
      const selectedItems = lighterList?.filter((i) => i?.isSelected);
      const selectedItemsForEdit = rowDto?.filter((i) => i?.isSelected);

      if (!id) {
        if (selectedItems?.length < 1) {
          return toast.warn("Please select at least one row!");
        } else if (
          selectedItems?.filter((item) => item?.surveyQty <= 0)?.length
        ) {
          return toast.warn(
            "Please fill up the quantity for all selected rows!"
          );
        }
      } else {
        if (selectedItemsForEdit?.length < 1) {
          return toast.warn("Please select at least one row!");
        }
      }
      const totalAmount = selectedItems?.reduce((a, b) => a + b?.total, 0);
      const payloadOfCreate = {
        headerObject: {
          allotmentNo: 0,
          accountId: accId,
          businessUnitId: buId,
          refNo: values?.generalRefNo || "",
          lotNo: values?.lotNo || "",
          award: values?.award || "",
          program: values?.programNo || "",
          allotmentDate: values?.allotmentDate,
          motherVesselId: values?.motherVessel?.value,
          motherVesselName: values?.motherVessel?.label,
          cnfid: values?.cnf?.value || 0,
          cnfname: values?.cnf?.label || "",
          stevdoreId: values?.steveDore?.value || 0,
          stevdoreName: values?.steveDore?.label || "",
          portId: values?.loadingPort?.value,
          portName: values?.loadingPort?.label,
          totalSurveyQnt: totalAmount,
          totalReceiveQnt: values?.quantity || 0,
          actionby: userId,
          narration: "",
        },
        rowObject: selectedItems?.map((itm) => ({
          shipPointId: itm?.unloadingPort?.value || 0,
          shipPointName: itm?.unloadingPort?.label || "",
          lighterDestinationId: itm?.lighterDestination?.value,
          lighterDestinationName: itm?.lighterDestination?.label,
          lighterVesselId: itm?.value,
          lighterVesselName: itm?.label,
          itemId: values?.item?.value,
          itemName: values?.item?.label,
          surveyQnt: +itm?.surveyQty || 0,
          itemRate: +itm?.rate || 0,
          total: itm?.total || 0,
          receiveQnt: 0,
        })),
      };
      const payloadOfEdit = {
        headerObject: {
          allotmentNo: id,
          refNo: values?.generalRefNo || "",
          lotNo: values?.lotNo || "",
          award: values?.award || "",
          allotmentDate: values?.allotmentDate,
          cnfid: values?.cnf?.value || 0,
          cnfname: values?.cnf?.label || "",
          stevdoreId: values?.steveDore?.value || 0,
          stevdoreName: values?.steveDore?.label || "",
          totalSurveyQnt: totalAmount,
          totalReceiveQnt: values?.quantity || 0,
          narration: "",
        },
        rowObject: selectedItemsForEdit?.map((item) => {
          return {
            rowId: item?.rowId,
            allotmentNo: item?.allotmentNo,
            // shipPointId: item?.unloadingPort?.value,
            // shipPointName: item?.unloadingPort?.label,
            shipPointId: item?.unloadingPort?.value || 0,
            shipPointName: item?.unloadingPort?.label || "",
            lighterDestinationId: item?.lighterDestination?.value,
            lighterDestinationName: item?.lighterDestination?.label,
            itemId: item?.itemId,
            itemName: item?.itemName,
            surveyQnt: +item?.surveyQty || 0,
            itemRate: +item?.itemRate,
            total: 0,
            receiveQnt: 0,
          };
        }),
      };
      if (id) {
        const callBack = () => {
          cb();
          // GetLighterAllotmentById(id, setSingleData, setRowDto);
        };
        EditLighterAllotment(payloadOfEdit, setDisabled, callBack);
      } else {
        CreateLighterAllotment(payloadOfCreate, setDisabled, cb);
      }
    }
  };

  const rowDataHandler = (name, index, value) => {
    if (id) {
      let _data = [...rowDto];
      _data[index][name] = value;
      setRowDto(_data);
    } else {
      let _data = [...lighterList];
      _data[index][name] = value;
      setLighterList(_data);
    }
  };

  const allSelect = (value) => {
    if (id) {
      let _data = [...rowDto];
      const modify = _data.map((item) => {
        return {
          ...item,
          isSelected: value,
        };
      });
      setRowDto(modify);
    } else {
      let _data = [...lighterList];
      const modify = _data.map((item) => {
        return {
          ...item,
          isSelected: value,
        };
      });
      setLighterList(modify);
    }
  };

  const selectedAll = () => {
    const create =
      lighterList?.length > 0 &&
      lighterList?.filter((item) => item?.isSelected)?.length ===
        lighterList?.length
        ? true
        : false;

    const edit =
      rowDto?.length > 0 &&
      rowDto?.filter((item) => item?.isSelected)?.length === rowDto?.length
        ? true
        : false;

    return id ? edit : create;
  };

  const title = `${
    type === "edit" ? "Edit" : type === "view" ? "View" : "Create"
  } General Information`;

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        buId={buId}
        type={type}
        title={title}
        accId={accId}
        organizationDDL={organizationDDL}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        shipPointDDL={shipPointDDL}
        lighterDDL={lighterDDL}
        lighterCNFDDL={lighterCNFDDL}
        lighterStevedoreDDL={lighterStevedoreDDL}
        domesticPortDDL={domesticPortDDL}
        lighterList={id ? rowDto : lighterList}
        motherVesselDDL={motherVesselDDL}
        setLighterList={setLighterList}
        rowDataHandler={rowDataHandler}
        setLoading={setDisabled}
        selectedAll={selectedAll}
        allSelect={allSelect}
        getTenderInfo={getTenderInfo}
        setMotherVesselDDL={setMotherVesselDDL}
      />
    </>
  );
}
