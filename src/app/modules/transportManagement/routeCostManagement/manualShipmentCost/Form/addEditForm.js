import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  editShipment,
  getDownTripData,
  getBUMilageAllowance,
  GetFuelConstInfoById_api,
  GetVehicleDDL,
  getRouteNameDDL,
  getWareHouseDDL,
} from "../helper";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { GetShipmentCostEntryStatus_api } from "./../helper";
import { _currentTime } from "./../../../../_helper/_currentTime";
import moment from "moment";
const initData = {
  whName: "",
  shipPoint: "",
  vehicle: "",
  vehicleNo: "",
  customerName: "",
  driverName: "",
  routeName: "",
  distanceKm: "",
  shipmentDate: _todayDate(),
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
  Supplier: "",
  fuelStationName: "",
  fuelType: "",
  fuelQty: "",
  fuelAmount: "",
  fuelMemoNo: "",
  fuelDate: _todayDate(),
  purchaseType: "",
  cash: "",
  credit: "",
  totalActual: "",
  extraMillage: "",
  vehicleInDate: _todayDate(),
  vehicleInTime: _currentTime(),
  profitCenter: "",
  costElement: "",
  costCenter: "",
};

export default function ManualShipmentCostForm() {
  const [isDisabled, setDisabled] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [fuleCost, setFuleCost] = useState([]);
  const { id } = useParams();
  const [entryStatus, setEntryStatus] = useState("");
  const [downTripData, setDownTripData] = useState("");
  const [buMilage, setBuMilage] = useState("");
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState("");
  const [netPayable, setNetPayable] = useState(0);
  const [dicrementNetPayable, setDicrementNetPayable] = useState(0);
  const [advanceAmount, setAdvanceAmount] = useState(0);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [routeNameDDL, setRouteNameDDL] = useState([]);

  const [vehicleId, setVehicleId] = useState("");
  const [whNameDDL, setWhNameDDL] = useState([]);
  //const location = useLocation();
  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const shipPointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (id) {
      GetFuelConstInfoById_api(id, setFuleCost);
      GetShipmentCostEntryStatus_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        id,
        setEntryStatus
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const totalStandardCost_TotalActualCalFunc = (arry) => {
    let totalStandardCost = 0;
    let totalActual = 0;
    if (arry.length) {
      for (let i = 0; i < arry.length; i++) {
        totalStandardCost += +arry[i].standardCost;
        totalActual += +arry[i].actualCost;
      }
    }
    return { totalStandardCost, totalActual };
  };
  //netPayableCalculatorFunc
  const netPayableCalculatorFunc = (
    fuleCost,
    rowDto,
    downTripCredit,
    downTripCash
  ) => {
    const totalCashAmount = fuleCost?.reduce(
      (acc, cur) => (acc += +cur?.purchaseCashAmount),
      0
    );
    const totalCreditAmount = fuleCost?.reduce(
      (acc, cur) => (acc += +cur?.purchaseCreditAmount),
      0
    );
    const totalActualCost = rowDto?.reduce(
      (acc, cur) => (acc += +cur?.actualCost),
      0
    );
    const cal =
      totalActualCost + totalCashAmount - (+downTripCash + +totalCreditAmount);
    setDicrementNetPayable(cal);
    setNetPayable(cal - +advanceAmount);
  };
  useEffect(() => {
    if (vehicleId) {
      getDownTripData(
        vehicleId,
        profileData.accountId,
        selectedBusinessUnit.value,
        setDownTripData
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicleId]);

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getBUMilageAllowance(
        profileData.accountId,
        selectedBusinessUnit.value,
        setBuMilage
      );
      GetVehicleDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setVehicleDDL
      );
      getRouteNameDDL(
        profileData.accountId,
        selectedBusinessUnit.value,
        setRouteNameDDL
      );
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setWhNameDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    const vehicleInDate = moment(
      `${values?.vehicleInDate} ${values?.vehicleInTime}`
    ).format("YYYY-MM-DDTHH:mm:ss");

    const row = rowDto.map((item) => {
      return {
        actualCost: +item.actualCost,
        standardCost: +item.standardCost,
        transportRouteCostComponent: item.transportRouteCostComponent,
        transportRouteCostComponentId: item.transportRouteCostComponentId,
        intShipmentCostId: 0,
      };
    });

    // if (fuleCost?.length === 0) {
    //   toast.warning("Please add at least one fuel cost ");
    //   return;
    // }
    if (row?.length === 0) {
      toast.warning("Please add at least one Allowance");
      return;
    }
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = {
        objHeader: {
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          sl: 0,
          shipmentCostId: 0,
          shipmentId: 0,
          shipmentCode: "",
          shipmentDate: values?.shipmentDate,
          vehicleId: values?.vehicle?.value,
          vehicleNo: values?.vehicle?.label,
          driverId: values?.vehicle?.driverId,
          startMillage: +values?.startMillage || 0,
          extraMillageReason: values?.extraMillageReason || "",
          extraMillage: +values?.extraMillage || 0,
          endMillage: +values?.endMillage || 0,
          routeId: values?.routeName?.value || 0,
          routeName: values?.routeName?.label || "",
          totalStandardCost: +values?.totalStandardCost || 0,
          advanceAmount: +values?.advanceAmount || 0,
          totalActualCost: +values?.totalActualCost || 0,
          distanceKm: +values?.distanceKm || 0,
          isAdvanceRequested: false,
          isExpenseEntered: true,
          isClose: true,
          strInOutStatus: "in",
          isBillSubmited: false,
          vehicleShippingCost: 0,
          expenseRegisterId: 0,
          expenseRegisterCode: "",
          expenseEntryDate: _todayDate(),
          isAccountsEntry: false,
          accountsEntryDate: _todayDate(),
          isAuditApprove: false,
          auditApproveDate: _todayDate(),
          actionBy: profileData?.userId,
          downTripCash: +values?.downTripCash || 0,
          downTripCredit: +values?.downTripCredit || 0,
          downTripUnitId: +values?.businessUnitName?.value || 0,
          netPayable: +netPayable || 0,
          billSubmitDate: _todayDate(),
          billSubmitBy: profileData?.userId,
          shippointId: values?.shipPoint?.value,
          wareHouseId: values?.whName?.value,
          vehicleRent: values?.vehicleRent,
          fuelCost: 0,
          customerName: values?.customerName || "",
          vehicleInDate: vehicleInDate || "",
          profitCenterId: values?.profitCenter?.value,
          costElementId: values?.costElement?.value,
          costCeneterId: values?.costCenter?.value,
        },
        objRowList: row,
        fuelCostInfo: fuleCost || [],
        objCreateShipmentCostAttachment: [],
      };
      await editShipment(payload, setDisabled);
      cb();
    }
  };

  const setter = (obj, cb, setFieldValue) => {
    const foundData = rowDto?.filter(
      (item) =>
        item?.transportRouteCostComponent === obj?.transportRouteCostComponent
    );
    if (foundData?.length >= 1)
      return toast.warn("Not allowed to duplicate items");
    setRowDto([...rowDto, obj]);
    cb();

    if (setFieldValue) {
      const {
        totalStandardCost,
        totalActual,
      } = totalStandardCost_TotalActualCalFunc([...rowDto, obj]);
      setFieldValue("totalActualCost", totalActual);
      setFieldValue("totalStandardCost", totalStandardCost);
    }
  };

  const remover = (index, setFieldValue) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);

    if (setFieldValue) {
      const {
        totalStandardCost,
        totalActual,
      } = totalStandardCost_TotalActualCalFunc(filterArr);
      setFieldValue("totalActualCost", totalActual);
      setFieldValue("totalStandardCost", totalStandardCost);
    }
  };
  const removerTwo = (index) => {
    const filterArr = fuleCost.filter((itm, idx) => idx !== index);
    setFuleCost(filterArr);
  };

  const dataHandler = (name, value, sl, setFieldValue) => {
    const xData = [...rowDto];
    xData[sl][name] = value;
    setRowDto([...xData]);
    if (setFieldValue) {
      const {
        totalStandardCost,
        totalActual,
      } = totalStandardCost_TotalActualCalFunc([...xData]);
      setFieldValue("totalActualCost", totalActual);
      setFieldValue("totalStandardCost", totalStandardCost);
    }
  };

  const fuleCostHandler = (values) => {
    const purchaseAmount =
      +(values?.cash ? values?.cash : 0) +
      +(values?.credit ? values?.credit : 0);
    const obj = {
      fueslCostId: 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      shipmentCostId: 0,
      fuelStationId: values?.fuelStationName?.value,
      fuelStationName: values?.fuelStationName?.label,
      supplierId: values?.supplier?.value,
      supplierName: values?.supplier?.label,
      fuelType: values?.fuelType?.value,
      fuelTypeName: values?.fuelType?.label,
      fuelQty: values?.fuelQty,
      fuelAmount: +values?.fuelAmount,
      fuelDate: values?.fuelDate,
      purchaseType: 0,
      purchaseTypeName: values?.purchaseType,
      purchaseCashAmount: +values?.cash,
      purchaseCreditAmount: +values?.credit,
      actionBy: profileData?.userId,
      vehicleId: values?.vehicle?.value,
      vehicleNumber: values?.vehicle?.label,
      attachmentFileId: uploadImage?.id,
      fuelMemoNo: values?.fuelMemoNo,
      billSubmit: false,
      intBillNo: 0,
    };

    if (+values?.fuelAmount === purchaseAmount) {
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

    if (setFieldValue) {
      const {
        totalStandardCost,
        totalActual,
      } = totalStandardCost_TotalActualCalFunc([...copyRowDto]);
      setFieldValue("totalActualCost", totalActual);
      setFieldValue("totalStandardCost", totalStandardCost);
    }
  };

  return (
    <>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
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
        setFuleCost={setFuleCost}
        removerTwo={removerTwo}
        fuleCostHandler={fuleCostHandler}
        extraMillageOnChangeHandler={extraMillageOnChangeHandler}
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        uploadImage={uploadImage}
        setUploadImage={setUploadImage}
        setNetPayable={setNetPayable}
        entryStatus={entryStatus}
        netPayable={netPayable}
        dicrementNetPayable={dicrementNetPayable}
        setAdvanceAmount={setAdvanceAmount}
        netPayableCalculatorFunc={netPayableCalculatorFunc}
        vehicleDDL={vehicleDDL}
        routeNameDDL={routeNameDDL}
        shipPointDDL={shipPointDDL}
        setVehicleId={setVehicleId}
        whNameDDL={whNameDDL}
        setDicrementNetPayable={setDicrementNetPayable}
        totalStandardCost_TotalActualCalFunc={
          totalStandardCost_TotalActualCalFunc
        }
      />
    </>
  );
}
