import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getMonth } from "../../../../salesManagement/report/customerSalesTarget/utils";
import Loading from "../../../../_helper/_loading";
import {
  GetDomesticPortDDL,
  GetShipPointDDL,
} from "../../loadingInformation/helper";
import {
  GetLighterDestinationDDL,
  getLightersByVesselNLighterDestination,
} from "../../unLoadingInformation/helper";
import {
  getGhatCostInfoById,
  getMotherVesselDDL,
  ghatCostInfoEdit,
  ghatCostInfoEntry,
} from "../helper";
import Form from "./form";

const initData = {
  destination: "",
  port: "",
  motherVessel: "",
  lighterVessel: "",
  shipPoint: "",
  supplier: "",
  month: "",
  year: "",
  item: "",
  quantity: "",
  rate: "",
  type: "",
};

const typeList = [
  { value: 1, label: "Fertilizer Unload Per Ton" },
  { value: 2, label: "Ruphsa Ghat Dumping" },
  { value: 3, label: "Ship Sweeping" },
  { value: 4, label: "Packaging Sewing Dumping" },
  { value: 5, label: "Others" },
];

export default function GhatCostInfoForm() {
  const { id, type } = useParams();
  const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [destinationDDL, setDestinationDDL] = useState([]);
  const [lighters, setLighters] = useState([]);
  const [vessels, setVessels] = useState([]);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [portDDL, setPortDDL] = useState([]);
  const [singleData, setSingleData] = useState([]);

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    GetDomesticPortDDL(setPortDDL);
    GetShipPointDDL(accId, buId, setShipPointDDL);
    GetLighterDestinationDDL(accId, buId, setDestinationDDL);
    if (id) {
      getGhatCostInfoById(id, setDisabled, (resData) => {
        const {
          rowList,
          ligherVesselId,
          lighterVesselName,
          monthId,
          motherVesselId,
          motherVesselName,
          portId,
          portName,
          shipPointId,
          shipPointName,
          supplierId,
          supplierName,
          yearId,
          destinationId,
          destinationName,
        } = resData;
        setRowDto(
          rowList?.map((item) => ({
            ...item,
            amount: item?.rate * item?.quantity,
          }))
        );

        setSingleData({
          destination: { value: destinationId, label: destinationName },
          port: { value: portId, label: portName },
          motherVessel: { value: motherVesselId, label: motherVesselName },
          lighterVessel: { value: ligherVesselId, label: lighterVesselName },
          shipPoint: { value: shipPointId, label: shipPointName },
          supplier: { value: supplierId, label: supplierName },
          month: { value: monthId, label: getMonth(monthId) },
          year: { value: yearId, label: yearId },
        });
      });
    }
  }, [accId, buId, id]);

  const saveHandler = async (values, cb) => {
    const payload = {
      expenseHead: {
        id: id || 0,
        businessUnitId: buId,
        monthId: values?.month?.value,
        yearId: values?.year?.value,
        supplierId: values?.supplier?.value,
        supplierName: values?.supplier?.label,
        actionby: userId,
        motherVesselId: values?.motherVessel?.value,
        motherVesselName: values?.motherVessel?.label,
        portId: values?.port?.value,
        portName: values?.port?.label,
        ligherVesselId: values?.lighterVessel?.value,
        lighterVesselName: values?.lighterVessel?.label,
        shipPointId: values?.shipPoint?.value,
        shipPointName: values?.shipPoint?.label,
        destinationId: values?.destination?.value,
        destinationName: values?.destination?.label,
      },
      expenseRow: rowDto,
    };
    if (id) {
      ghatCostInfoEdit(payload, setDisabled);
    } else {
      ghatCostInfoEntry(payload, setDisabled, () => {
        cb();
      });
    }
  };

  const addRow = (values, cb) => {
    const exist = rowDto?.find((item) => item?.typeId === values?.type?.value);
    if (exist) {
      return toast.warn("Duplicate value not allowed! please change the type");
    }
    try {
      const newRow = {
        itemId: values?.item?.value,
        itemName: values?.item?.label,
        quantity: values?.quantity,
        rate: values?.rate,
        typeId: values?.type?.value,
        typeName: values?.type?.label,
        others: 0,
        amount: values?.quantity * values?.rate,
      };
      setRowDto([...rowDto, newRow]);
      cb();
    } catch (error) {}
  };

  const removeRow = (index) => {
    setRowDto(rowDto?.filter((_, i) => i !== index));
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "destination":
        setFieldValue("destination", currentValue);
        setFieldValue("lighterVessel", "");
        setFieldValue("motherVessel", "");
        break;

      case "port":
        setFieldValue("port", currentValue);
        setFieldValue("motherVessel", "");
        setFieldValue("lighterVessel", "");
        if (currentValue) {
          getMotherVesselDDL(accId, buId, setVessels, currentValue?.value);
        }
        break;

      case "motherVessel":
        setFieldValue("motherVessel", currentValue);
        setFieldValue("lighterVessel", "");

        if (currentValue) {
          getLightersByVesselNLighterDestination(
            values?.destination?.value,
            currentValue?.value,
            setLighters,
            setDisabled,
            (e) => {}
          );
        }
        break;

      case "lighterVessel":
        setFieldValue("lighterVessel", currentValue);
        break;

      case "shipPoint":
        setFieldValue("shipPoint", currentValue);
        break;

      case "type":
        setFieldValue("type", currentValue);
        break;

      default:
        break;
    }
  };

  const title = `${
    type === "view" ? "View " : type === "edit" ? "Update" : "Enter"
  } Ghat Cost Info`;

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        type={type}
        accId={accId}
        buId={buId}
        addRow={addRow}
        removeRow={removeRow}
        typeList={typeList}
        setRowDto={setRowDto}
        title={title}
        rowDto={rowDto}
        history={history}
        vessels={vessels}
        portDDL={portDDL}
        lighters={lighters}
        saveHandler={saveHandler}
        shipPointDDL={shipPointDDL}
        destinationDDL={destinationDDL}
        onChangeHandler={onChangeHandler}
        initData={id ? singleData : initData}
      />
    </>
  );
}
