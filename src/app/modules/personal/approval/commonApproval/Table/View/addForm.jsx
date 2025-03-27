


import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getSingleDataById
} from "./helper";

import { useHistory } from "react-router-dom";
import Loading from "../../../../../_helper/_loading";
import ICustomCard from "../../../../../_helper/_customCard";

const initData = {
  copyfrombomname: "",
  plant: "",
  shopFloor: "",
  bomName: "",
  bomVersion: "",
  bomCode: "",
  product: "",
  lotSize: "",
  netWeight: "",
  wastage: "",
  material: "",
  quantity: "",
  uom: "",
  isStandardBoM: false,
  itemCode: "",
  UOM: "",
  costElement: "",
  costElementAmount: "",
};

export default function BillofMaretialViewApproval({id}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  // const params = useParams();
  const [plant] = useState([]);
  const [shopFloor, setShopFloor] = useState([]);
  const [product, setProduct] = useState([]);
  const [netWeight, setNetWeight] = useState([]);
  const [material, setMaterial] = useState([]);
  const [copyfrombomname] = useState([]);
  const [UOMDDL, setUOMDDL] = useState([]);
  const history = useHistory();


  // Cost Element state
  const [costElementDDL, setCostElementDDL] = useState([]);
  const [costElementRowData, setCostElementRowData] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (id) {
      getSingleDataById(
        id,
        setSingleData,
        setRowDto,
        setCostElementRowData,
        setDisabled
      );
    }
  }, [id]);

  // Row Data Setter
  const setter = (payload, type) => {
    // Set Material Row Data
    if (type === "M") {
      const foundData = rowDto?.some(
        (item) => item?.material?.value === payload?.material?.value
      );
      foundData
        ? toast.warn("Duplicate Data Not Allowed")
        : setRowDto([...rowDto, payload]);
    }
    // Set Cost Element Row Data
    else if (type === "C") {
      const foundData = costElementRowData?.some(
        (item) => item?.costElementId === payload?.costElementId
      );
      foundData
        ? toast.warn("Duplicate Data Not Allowed")
        : setCostElementRowData([...costElementRowData, payload]);
    }
  };

  // Row Data Remover
  const remover = (index) => {
    const filterArr = rowDto?.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // Row Data Remover Cost Element
  const removerCostElement = (index) => {
    const filterArr = costElementRowData?.filter((itm, idx) => idx !== index);
    setCostElementRowData(filterArr);
  };

  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  return (
    <ICustomCard
      title={"View of Bill of Material"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        remover={remover}
        rowDto={rowDto}
        setter={setter}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        plant={plant}
        bomId={id}
        shopFloor={shopFloor}
        setShopFloor={setShopFloor}
        product={product}
        material={material}
        setMaterial={setMaterial}
        setProduct={setProduct}
        setNetWeight={setNetWeight}
        netWeight={netWeight}
        copyfrombomname={copyfrombomname}
        plantId={location?.state?.plantId}
        singleData={singleData}
        setSingleData={setSingleData}
        itemSelectHandler={itemSelectHandler}
        isEdit={id}
        setRowDto={setRowDto}
        id={id}
        UOMDDL={UOMDDL}
        setUOMDDL={setUOMDDL}
        setDisabled={setDisabled}
        // Cost Element Props
        costElementDDL={costElementDDL}
        costElementRowData={costElementRowData}
        setCostElementRowData={setCostElementRowData}
        removerCostElement={removerCostElement}
      />
    </ICustomCard>
  );
}
