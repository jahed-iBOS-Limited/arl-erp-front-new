/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  getShipmentByID,
  editShipment,
  getDownTripData,
  getBUMilageAllowance,
  GetShipToPartnerDistanceByShipmentId_api,
  GetPartnerShippingInformation_api,
  EditVehiclePartnerRentAmount_api,
  CreateFuelConstInfo_api,
  GetFuelConstInfoById_api,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { EditVehiclePartnerDistenceKM_api } from "./../helper";
import { GetShipmentCostEntryStatus_api } from "./../helper";

const initData = {
  vehicleNo: "",
  driverName: "",
  routeName: "",
  distanceKm: "",
  shipmentDate: "",
  startMillage: "",
  endMillage: "",
  totalStandardCost: "",
  advanceAmount: "",
  totalActualCost: "",
  costComponent: "",
  daQuantity: "",
  daAmount: "",
  downTraip: false,
  downTripAllowns: "",
  date: _todayDate(),
  reason: "",
  downTripCash: "",
  downTripCredit: "",
  businessUnitName: "",
};

export default function ShipmentCostForm() {
  const [isDisabled, setDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [fuleCost, setFuleCost] = useState([]);
  const [attachmentGrid, setAttachmentGrid] = useState([]);
  const [distanceKM, setDistanceKM] = useState([]);
  const [vehicleReant, setVehicleReant] = useState([]);
  const { id } = useParams();
  const [singleData, setSingleData] = useState("");
  const [entryStatus, setEntryStatus] = useState("");
  const [downTripData, setDownTripData] = useState("");
  const [buMilage, setBuMilage] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState("");
  const [uploadImageTwo, setUploadImageTwo] = useState("");
  const [netPayable, setNetPayable] = useState(0);
  const [dicrementNetPayable, setDicrementNetPayable] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const location = useLocation();
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  //
  const distanceKM_AllUpdateBtnClickCheck = distanceKM?.every(
    (item) => item?.isUpdateBtnClick
  );
  const vehicleReant_AllUpdateBtnClickCheck = vehicleReant?.every(
    (item) => item?.isUpdateBtnClick
  );
  const reportTypeComplete =
    location?.state?.values?.reportType?.label === "Complete";

  useEffect(() => {
    if (id) {
      GetFuelConstInfoById_api(id, setFuleCost);
      GetShipmentCostEntryStatus_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        id,
        setEntryStatus
      );
      if (reportTypeComplete) {
        getShipmentByID(
          id,
          setSingleData,
          setRowDto,
          setDisabled,
          setAttachmentGrid
        );
      } else {
        getShipmentByID(id, setSingleData, null, setDisabled, null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //netPayableCalculatorFunc
  const netPayableCalculatorFunc = (
    fuleCost,
    rowDto,
    downTripCredit,
    downTripCash
  ) => {
    const totalCost = fuleCost?.reduce(
      (acc, cur) => (acc += +cur?.purchaseCreditAmount),
      0
    );
    const totalActualCost = rowDto?.reduce(
      (acc, cur) => (acc += +cur?.actualCost),
      0
    );
    const cal = totalActualCost - totalCost + (downTripCredit - downTripCash);
    setDicrementNetPayable(cal);
    setNetPayable(cal - +advanceAmount);
  };

  useEffect(() => {
    if (fuleCost?.length > 0 || rowDto?.length > 0) {
      netPayableCalculatorFunc(
        fuleCost,
        rowDto,
        singleData?.downTripCredit,
        singleData?.downTripCash
      );
    }
  }, [fuleCost, rowDto, singleData]);

  useEffect(() => {
    if (location) {
      getDownTripData(
        location?.state?.vehicleId,
        profileData.accountId,
        selectedBusinessUnit.value,
        setDownTripData
      );
    }
  }, [location]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBUMilageAllowance(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBuMilage
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const fuleCostSaveCB = () => {
    CreateFuelConstInfo_api(fuleCost);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const row = rowDto.map((item) => {
          return {
            actualCost: +item.actualCost,
            standardCost: +item.standardCost,
            transportRouteCostComponent: item.transportRouteCostComponent,
            transportRouteCostComponentId: item.transportRouteCostComponentId,
            id: 0,
          };
        });
        const payload = {
          objHeader: {
            shipmentCostId: +id,
            startMillage: +values.startMillage,
            endMillage: +values.endMillage,
            advanceAmount: +values.advanceAmount,
            extraMillageReason: values.extraMillageReason || "",
            extraMillage: +values.extraMillage || 0,
            inOutStatus: values.handleType,
            downTripCash: +values?.downTripCash || 0,
            downTripCredit: +values?.downTripCredit || 0,
            netPayable: +netPayable,
            downTripUnitId: +values?.businessUnitName?.value || 0,
            isClose: true,
          },
          objRowList: row,
          objCreateShipmentCostAttachment: attachmentGrid,
        };
        if (reportTypeComplete) {
          //reportTypeComplete true
          if (attachmentGrid?.length > 0) {
            editShipment(payload, setDisabled);
          } else {
            toast.warning("You Must Attach The File");
          }
        } else {
          //reportTypeComplete false
          if (
            distanceKM_AllUpdateBtnClickCheck &&
            vehicleReant_AllUpdateBtnClickCheck
          ) {
            editShipment(payload, setDisabled, fuleCostSaveCB);
          } else {
            toast.warning(
              'You have must All "Distance KM & Vehicle Reant" update btn click '
            );
          }
        }
      }
    }
  };

  const setter = (obj, cb) => {
    const foundData = rowDto?.filter(
      (item) =>
        item?.transportRouteCostComponent === obj?.transportRouteCostComponent
    );
    if (foundData?.length >= 1)
      return toast.warn("Not allowed to duplicate items");

    setRowDto([...rowDto, obj]);
    cb();
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };
  const removerTwo = (index) => {
    const filterArr = fuleCost.filter((itm, idx) => idx !== index);
    setFuleCost(filterArr);
  };
  const removerAttachmentGridRow = (index) => {
    const filterArr = attachmentGrid.filter((itm, idx) => idx !== index);
    setAttachmentGrid(filterArr);
  };
  const dataHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = value;
    setRowDto([...xData]);
  };

  // if Report type panding
  useEffect(() => {
    if (!reportTypeComplete && buMilage?.configid) {
      let amount =
        +singleData?.distanceKm < +buMilage?.milage
          ? +singleData?.distanceKm * +buMilage?.minimumAmount
          : +singleData?.distanceKm * +buMilage?.maximumAmount;
      let obj = {
        transportRouteCostComponentId: buMilage?.configid,
        transportRouteCostComponent: buMilage?.componentName,
        standardCost: amount,
        actualCost: amount,
      };
      setRowDto([obj]);
    }
  }, [buMilage, singleData]);

  useEffect(() => {
    if (singleData?.shipmentId) {
      GetShipToPartnerDistanceByShipmentId_api(
        singleData?.shipmentId,
        setDistanceKM
      );
      GetPartnerShippingInformation_api(
        singleData?.shipmentId,
        setVehicleReant
      );
    }
  }, [singleData]);
  // ==========vehicleReant function==================
  const vehicleReantUpdateCB = (idx) => {
    const copyvehicleReant = [...vehicleReant];
    copyvehicleReant[idx].isUpdateBtnClick = true;
    setVehicleReant(copyvehicleReant);
  };
  const vehicleReantUpdateFunc = (item, index) => {
    if (+item?.rentAmount === 0) {
      return toast.warn("Minimum 1 number input");
    } else {
      EditVehiclePartnerRentAmount_api(
        singleData?.shipmentId,
        singleData?.shipPointId,
        singleData?.shipToPartnerId,
        selectedBusinessUnit?.value,
        item?.rentAmount,
        index,
        vehicleReantUpdateCB
      );
    }
  };
  const vehicleReantOnChangeFunc = (value, inx) => {
    const copyvehicleReant = [...vehicleReant];
    copyvehicleReant[inx].rentAmount = value;
    copyvehicleReant[inx].isUpdateBtnClick = false;
    setVehicleReant(copyvehicleReant);
  };

  // ==========distanceKMO function==================
  const millageAllowanceRowValueChange = (
    changeValue,
    values,
    setFieldValue
  ) => {
    // const chaeckdistanceKmBig = +changeValue > +values?.distanceKm;
    // if (chaeckdistanceKmBig) {

    // }
    setFieldValue("distanceKm", changeValue);
    // amount calculation
    let amount =
      changeValue < buMilage?.milage
        ? changeValue * buMilage?.minimumAmount
        : changeValue * buMilage?.maximumAmount;

    // millageAllowance index find
    let foundMilage = rowDto?.findIndex(
      (item) => item?.transportRouteCostComponent === "Millage Allowance"
    );
    const copyRowDto = [...rowDto];
    copyRowDto[foundMilage] = {
      ...copyRowDto[foundMilage],
      standardCost: amount.toFixed(2),
      actualCost: amount.toFixed(2),
    };
    setRowDto([...copyRowDto]);
  };

  const distanceKMOUpdateCB = (idx, values) => {
    const copyvehicleReant = [...distanceKM];
    copyvehicleReant[idx].isUpdateBtnClick = true;
    setDistanceKM(copyvehicleReant);
  };
  const distanceKMOUpdateFunc = (item, index, values, setFieldValue) => {
    if (+item?.numDistanceKM === 0) {
      return toast.warn("Minimum 1 number input");
    } else {
      EditVehiclePartnerDistenceKM_api(
        singleData?.shipmentId,
        singleData?.shipPointId,
        singleData?.shipToPartnerId,
        selectedBusinessUnit?.value,
        item?.numDistanceKM,
        index,
        distanceKMOUpdateCB,
        values,
        millageAllowanceRowValueChange,
        setFieldValue
      );
    }
  };

  const distanceKMOnChangeFunc = (value, inx) => {
    const copydistanceKM = [...distanceKM];
    copydistanceKM[inx].numDistanceKM = value === 0 ? 1 : value;
    copydistanceKM[inx].isUpdateBtnClick = false;
    setDistanceKM(copydistanceKM);
  };

  const fuleCostHandler = (values) => {
    // const duplicateCheck = fuleCost?.filter(
    //   (itm) =>
    //     itm.supplierId === values?.supplier?.value &&
    //     itm.fuelStationId === values?.fuelStationName?.value &&
    //     itm.fuelType === values?.fuelType?.value
    // );
    const purchaseAmount = +values?.cash + +values?.credit;
    const obj = {
      fuelCostId: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      shipmentCostId: id,
      fuelStationId: values?.fuelStationName?.value,
      fuelStationName: values?.fuelStationName?.label,
      supplierId: values?.supplier?.value,
      fuelType: values?.fuelType?.value,
      fuelTypeName: values?.fuelType?.label,
      fuelQty: values?.fuelQty,
      fuelAmount: values?.fuelAmount,
      fuelDate: values?.fuelDate,
      purchaseType: 0,
      purchaseTypeName: values?.purchaseType,
      purchaseCashAmount: values?.cash,
      purchaseCreditAmount: values?.credit,
      actionBy: profileData?.userId,
      vehicleId: singleData?.vehicleId,
      vehicleNumber: singleData?.vehicleNo,
      attachmentFileId: uploadImage?.id || "",
    };
    // if (duplicateCheck?.length > 0) {
    //   toast.warning("Not allow duplicate ");
    // } else {
    if (values?.fuelAmount >= purchaseAmount) {
      setFuleCost([...fuleCost, obj]);
      setUploadImage("");
    } else {
      toast.warning("You have must increase amount ");
    }
    // }
  };

  const extraMillageOnChangeHandler = (setFieldValue, changeValue) => {
    // amount calculation
    let amount =
      changeValue < buMilage?.milage
        ? changeValue * buMilage?.minimumAmount
        : changeValue * buMilage?.maximumAmount;

    // millageAllowance index find
    let foundMilage = rowDto?.findIndex(
      (item) => item?.transportRouteCostComponent === "Millage Allowance"
    );
    const copyRowDto = [...rowDto];
    copyRowDto[foundMilage] = {
      ...copyRowDto[foundMilage],
      standardCost: amount.toFixed(2),
      actualCost: amount.toFixed(2),
    };
    setRowDto([...copyRowDto]);
  };

  /// setAttachmentGridFunc
  const setAttachmentGridFunc = (values) => {
    const duplicateCheck = attachmentGrid?.find(
      (itm) => itm?.reason.trim() === values?.reason.trim()
    );
    if (!duplicateCheck) {
      const obj = {
        autoId: 0,
        attachmentFileId: uploadImageTwo?.map((itm) => itm?.id),
        reason: values?.reason,
        isActive: true,
      };
      setAttachmentGrid([...attachmentGrid, obj]);
      setUploadImageTwo("");
    } else {
      toast.warn("Not allowed to duplicate item!", { toastId: 456 });
    }
  };
  return (
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          id
            ? {
                ...singleData,
                downTripAllowns: downTripData?.downTripAllowance,
              }
            : initData
        }
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        rowDto={rowDto}
        dataHandler={dataHandler}
        downTripData={downTripData}
        fuleCost={fuleCost}
        removerTwo={removerTwo}
        distanceKM={distanceKM}
        vehicleReant={vehicleReant}
        vehicleReantUpdateFunc={vehicleReantUpdateFunc}
        vehicleReantOnChangeFunc={vehicleReantOnChangeFunc}
        distanceKMOnChangeFunc={distanceKMOnChangeFunc}
        distanceKMOUpdateFunc={distanceKMOUpdateFunc}
        fuleCostHandler={fuleCostHandler}
        shipmentId={singleData?.shipmentId}
        extraMillageOnChangeHandler={extraMillageOnChangeHandler}
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        uploadImage={uploadImage}
        setUploadImage={setUploadImage}
        uploadImageTwo={uploadImageTwo}
        setUploadImageTwo={setUploadImageTwo}
        setAttachmentGridFunc={setAttachmentGridFunc}
        attachmentGrid={attachmentGrid}
        removerAttachmentGridRow={removerAttachmentGridRow}
        setNetPayable={setNetPayable}
        entryStatus={entryStatus}
        netPayable={netPayable}
        dicrementNetPayable={dicrementNetPayable}
        setAdvanceAmount={setAdvanceAmount}
        netPayableCalculatorFunc={netPayableCalculatorFunc}
      />
    </>
  );
}
