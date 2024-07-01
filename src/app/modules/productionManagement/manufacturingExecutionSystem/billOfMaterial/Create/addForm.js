/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  getSingleDataById,
  saveEditedBillofMaterial,
  getPlantDDL,
  getPreviousBomName,
  getShopFloorDDL,
  getProductDDL,
  getMaterialDDL,
  getCostElementDDL,
  getCostCenterDDL,
  getCostTypeDDL,
  saveBillofMaterial,
  getBomTypeDDL,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _timeFormatter } from "../../../../_helper/_timeFormatter";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import moment from "moment";
import IConfirmModal from "../../../../_helper/_confirmModal";

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
  costCenter: "",
  headerUOM: "",
  costType: "",
};

export default function BillofMaretialCreateForm() {
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
  const [confirmModal, setConfirmModal] = useState(false);
  const [copyfrombomname, setCopyfrombomname] = useState([]);
  const [UOMDDL, setUOMDDL] = useState([]);
  const [headerItemUomDDL, setHeaderItemUomDDL] = useState([]);
  const [costTypeDDL, setCostTypeDDL] = useState([]);
  const [confirm, checkConfirmation, loader, set] = useAxiosPost();
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
  const [costCenterDDL, setCostCenterDDL] = useState([]);

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
      getCostCenterDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setCostCenterDDL
      );
      getCostTypeDDL(setCostTypeDDL);
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
          bommainItem: item?.bommainItem,
          isActive: true,
        }));
        const payload = {
          editHeaderBOM: {
            billOfMaterialId: +params?.id,
            billOfMaterialCode: "", // values?.bomCode,
            billOfTypeId: values?.bomType?.value || 0, // new addition by miraj bhai
            billOfTypeName: values?.bomType?.label || "", // new addition by miraj bhai
            billOfMaterialName: values?.bomName,
            boMItemVersionName: values?.bomVersion,
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
          bommainItem: item?.bommainItem,
          isActive: true,
        }));
        const payload = {
          createHeaderBOM: {
            billOfMaterialCode: "", // values?.bomCode,
            billOfMaterialName: values?.bomName,
            boMName: values?.copyfrombomname?.boMName,
            boMItemVersionName: values?.bomVersion,
            billOfTypeId: values?.bomType?.value || 0, // new addition by miraj bhai
            billOfTypeName: values?.bomType?.label || "", // new addition by miraj bhai
            itemId: +values?.product?.value,
            itemCode: values?.product?.code || singleData?.itemCode,
            itemName: values?.product?.label,
            lotSize: +values?.lotSize,
            boMuoMid: +values?.headerUOM?.value,
            numWastagePercentage: +values?.wastage,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            plantId: +values?.plant?.value,
            shopFloorId: +values?.shopFloor?.value,
            isStandardBoM: values?.isStandardBoM || false,
            actionBy: +profileData?.userId,
          },
          createRowBOM: objRow,
          createRowBOE: costElementRowData,
        };
        if (objRow.length === 0) {
          toast.warning("Please add material");
        } else {
          const temp = rowDto?.map((item) => ({
            itemId: +item?.material?.value,
            quantity: item?.quantity,
            monthId: +`${moment(_todayDate()).format("MM")}`,
            yearId: +`${moment(_todayDate()).format("YYYY")}`,
          }));
          checkConfirmation(
            `/procurement/PurchaseOrder/IsPossibleBOMAutoApproval`,
            temp,
            (res) => {
              if (res[0]?.isPossible) {
                saveBillofMaterial(payload, cb, setDisabled);
              } else {
                updatePoppup(payload, cb);
              }
            }
          );
        }
      }
    }
  };

  // Row Data Setter
  const setter = (payload, type, setFieldValue) => {
    // Set Material Row Data
    if (type === "M") {
      const foundData = rowDto?.some(
        (item) => item?.material?.value === payload?.material?.value
      );
      if (foundData) {
        toast.warn("Duplicate Data Not Allowed");
      } else {
        setRowDto([...rowDto, payload]);
        setFieldValue("quantity", "");
        setFieldValue("UOM", "");
        setFieldValue("material", "");
      }
    }
    // Set Cost Element Row Data
    else if (type === "C") {
      const foundData = costElementRowData?.some(
        (item) =>
          item?.costElementId === payload?.costElementId &&
          item?.costCenterId === payload?.costCenterId
      );
      if (foundData) {
        toast.warn("Duplicate Data Not Allowed");
      } else {
        setCostElementRowData([...costElementRowData, payload]);
        setFieldValue("costCenter", "");
        setFieldValue("costElement", "");
        setFieldValue("costElementAmount", "");
        setFieldValue("costType", "");
      }
    }
  };

  // Row Data Remover
  const remover = (bomRowId) => {
    // console.log("rowDto", rowDto);
    const filterArr = rowDto?.filter((itm, idx) => itm?.boMrowId !== bomRowId);
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

  const dataHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = value;
    setRowDto([...xData]);
  };
  const updatePoppup = (payload, cb) => {
    let confirmObject = {
      title: "Confirm Action",
      closeOnClickOutside: false,
      message: "Are You Sure You Want this action? ",
      yesAlertFunc: () => {
        saveBillofMaterial(payload, cb, setDisabled);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };
  return (
    <IForm
      title={"Create Bill of Material"}
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
        costCenterDDL={costCenterDDL}
        headerItemUomDDL={headerItemUomDDL}
        setHeaderItemUomDDL={setHeaderItemUomDDL}
        costTypeDDL={costTypeDDL}
        dataHandler={dataHandler}
        accountId={profileData?.accountId}
        businessUnitId={selectedBusinessUnit?.value}
        bomTypeDDL={bomTypeDDL}
      />
    </IForm>
  );
}
