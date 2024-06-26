/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "./components/form";

import {
  getSingleDataById,
  saveEditedBillofMaterial,
  getPlantDDL,
  getPreviousBomName,
  getShopFloorDDL,
  getProductDDL,
  getMaterialDDL,
  getCostElementDDL,
  saveBillofMaterial,
} from "./helper";
import { useHistory } from "react-router-dom";
import ICustomCard from "../../../_helper/_customCard";
import Loading from "../../../_helper/_loading";

const initData = {
  copyfrombomname: "",
  plant: "",
  shopFloor: "",
  bomName: "",
  bomVersion: "",
  bomType: "",
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

export default function CreateEditProductAnalysis() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [plant, setPlant] = useState([]);
  const [shopFloor, setShopFloor] = useState([]);
  const [product, setProduct] = useState([]);
  const [netWeight, setNetWeight] = useState([]);
  const [material, setMaterial] = useState([]);
  const [copyfrombomname, setCopyfrombomname] = useState([]);
  const [UOMDDL, setUOMDDL] = useState([]);
  const history = useHistory();
  const bomTypeDDL = [
    {
      value: 1,
      label: "Main (Paddy to Rice)",
    },
    {
      value: 2,
      label: "Conversion (Rice to Rice)",
    },
    {
      value: 3,
      label: "Re-Process (Rice to Rice)",
    },
  ];

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
    if (params?.id) {
      getSingleDataById(
        params?.id,
        setSingleData,
        setRowDto,
        setCostElementRowData,
        setDisabled
      );
    }
  }, [params]);

  console.log(params?.id, "jj");

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getPlantDDL(
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setPlant
      );
      getPreviousBomName(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCopyfrombomname
      );
      getCostElementDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCostElementDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  //to show first rowData into fields in edit
  useEffect(() => {
    if (singleData) {
      getShopFloorDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.plant?.value,
        setShopFloor
      );
      getProductDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.plant?.value,
        setProduct
      );
      getMaterialDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        singleData?.plant?.value,
        setMaterial
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
        let objRow = rowDto?.map((item) => ({
          itemId: +item?.material?.value,
          itemCode: item?.material?.code || item?.rowItemCode,
          itemName: item?.material?.label,
          quantity: item?.quantity,
          uomid: +item?.material?.baseUomid || +item?.uoMid,
          isActive: true,
        }));
        const payload = {
          editHeaderBOM: {
            billOfMaterialId: +params?.id,
            billOfMaterialCode: values?.bomCode,
            billOfMaterialName: values?.bomName,
            lotSize: +values?.lotSize,
            numWastagePercentage: +values?.wastage,
            actionBy: +profileData?.userId,
          },

          editRowBOM: objRow,
          editRowBOE: costElementRowData,
        };
        saveEditedBillofMaterial(payload, setDisabled);
      } else {
        let objRow = rowDto?.map((item) => ({
          itemId: +item?.material?.value,
          itemCode: item?.material?.code || item?.rowItemCode,
          itemName: item?.material?.label,
          quantity: item?.quantity,
          // uomid: +item?.material?.baseUomid,
          uomid: +item?.material?.baseUomid || +item?.uoMid,
          isActive: true,
        }));
        const payload = {
          createHeaderBOM: {
            billOfMaterialCode: values?.bomCode,
            billOfMaterialName: values?.bomName,
            boMItemVersionName: values?.bomVersion,
            itemId: +values?.product?.value,
            itemCode: values?.product?.code || singleData?.itemCode,
            // itemCode: values?.product?.code,
            itemName: values?.product?.label,
            lotSize: +values?.lotSize,
            boMuoMid: +values?.product?.baseUomid || values?.billOfMaterialId,
            // boMuoMid: +values?.product?.baseUomid,
            numWastagePercentage: +values?.wastage,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            plantId: +values?.plant?.value,
            shopFloorId: +values?.shopFloor?.value,
            isStandardBoM: values?.isStandardBoM,
            actionBy: +profileData?.userId,
          },
          createRowBOM: objRow,
          createRowBOE: costElementRowData,
        };
        if (objRow.length === 0) {
          toast.warning("Please add material");
        } else {
          saveBillofMaterial(payload, cb, setDisabled);
          // console.log(" payload", payload);
        }
      }
    } else {
      setDisabled(false);
    }
  };

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
      title={"View of Cost of Product"}
      backHandler={() => {
        history.goBack();
      }}
      renderProps={() => {}}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        remover={remover}
        rowDto={rowDto}
        setter={setter}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        plant={plant}
        bomId={params?.id}
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
        isEdit={params?.id}
        setRowDto={setRowDto}
        id={params?.id}
        UOMDDL={UOMDDL}
        setUOMDDL={setUOMDDL}
        setDisabled={setDisabled}
        // Cost Element Props
        costElementDDL={costElementDDL}
        costElementRowData={costElementRowData}
        setCostElementRowData={setCostElementRowData}
        removerCostElement={removerCostElement}
        bomTypeDDL={bomTypeDDL}
      />
    </ICustomCard>
  );
}
