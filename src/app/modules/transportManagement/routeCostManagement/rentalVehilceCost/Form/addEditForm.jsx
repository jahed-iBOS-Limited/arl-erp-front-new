import Axios from "axios";
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import {
  EditShipmentStandardCost_api,
  getDistanceKm,
  getShippingInfo,
  getSupplierDDL,
  UpdateZone,
} from "../helper";
import { useLocation, useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import { getZoneDDL } from "../../../configuration/zoneCostRate/helper";

const initData = {
  rentAmount: 0,
  additionalCost: 0,
  additionalCostReason: "",
  deductionCost: 0,
  deductionCostReason: "",
  supplier: "",
  zone: "",
};

export default function RentalVehicleEdit({ history, billId, isBtnHide }) {
  const [isDisabled, setDisabled] = useState(false);
  const { id, pending } = useParams();
  const ID = id || billId || pending;
  // redux store data
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => ({
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    }),
    shallowEqual
  );

  // state
  const [fuelTypeList] = useState([]);
  const [fuelStationDDL, setFuelStationDDL] = useState([]);
  const [fileObjects, setFileObjects] = useState([]);

  const [supplierDDL, setSupplierDDL] = useState([]);
  const [distanceKM, setDistanceKM] = useState([]);
  const [shippingInfo, setShippingInfo] = useState([]);
  const [chalanInfo, setChalanInfo] = useState("");
  const [zoneDDL, setZoneDDL] = useState([]);
  const [zoneRateInfo, setZoneRateInfo] = useState({});

  const { state: landingGridData } = useLocation();

  const isComplete = landingGridData?.data?.reportType?.value === 2;

  const getChalanInfoInfoById = async (ID) => {
    try {
      setDisabled(true);
      const res = await Axios.get(
        `/wms/Delivery/GetDeliveryPrintInfo?ShipmentId=${ID}`
      );
      if (res && res.data) {
        setChalanInfo(res.data);
      }
      setDisabled(false);
    } catch (error) {
      setDisabled(false);
    }
  };
  // get initial data
  useEffect(() => {
    if (ID) {
      getDistanceKm(ID, setDistanceKM);
      getShippingInfo(ID, setShippingInfo);
      getChalanInfoInfoById(ID, setChalanInfo);
    }
    getZoneDDL(profileData?.accountId, selectedBusinessUnit?.value, setZoneDDL);
  }, [ID, profileData, selectedBusinessUnit]);

  // useEffect(() => {
  //   const mergeTwoRow = [...distanceKM, ...shippingInfo];
  //   const invalidInputData = mergeTwoRow.filter((item) => item.oldValue <= 0);
  //   if (invalidInputData?.length > 0) {
  //     setDisabled(true);
  //   } else {
  //     setDisabled(false);
  //   }
  // }, [distanceKM, shippingInfo]);

  useEffect(() => {
    if (profileData.accountId && selectedBusinessUnit.value) {
      getSupplierDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSupplierDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    // const getZeroKMItems = distanceKM?.filter(item => item?.)

    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = [
        {
          tripId: values?.tripId || 0,
          additionalCost: +values?.additionalCost || 0,
          additionalCostReason: values?.additionalCostReason || "",
          deductionCost: +values?.deductionCost || 0,
          deductionCostReason: values?.deductionCostReason || "",
          actionBy: profileData?.userId,
          vehicleSupplierId: values?.supplier?.value || 0,
          vehicleSupplierName: values?.supplier?.label || "",
        },
      ];
      EditShipmentStandardCost_api(payload, cb, setDisabled);
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  // rowdto handler for catch data from row's input field in rowTable
  const distanceRowDtoHandler = (name, value, sl) => {
    let data = [...distanceKM];
    let _sl = data[sl];
    _sl[name] = value;
    setDistanceKM(data);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const shippingRowDtoHandler = (name, value, sl) => {
    let data = [...shippingInfo];
    let _sl = data[sl];
    _sl[name] = value;
    setShippingInfo(data);
  };

  console.log(landingGridData?.data?.supplierId, "ssssId");

  const zoneUpdateHandler = (values, item) => {
    const payload = [
      {
        businessUnitId: selectedBusinessUnit?.value,
        deliveryId: item?.deliveryId,
        deliveryCode: item?.deliveryCode,
        shipmentCode: "",
        supplierId: landingGridData?.data?.supplierId,
        actionBy: profileData?.userId,
        qnt: item?.quantity,
        updateZoneId: values?.zone?.value,
        updateZoneName: values?.zone?.label,
        zoneRate: zoneRateInfo?.updatetzRate,
        supportTypeId: 0,
        strProductType: "",
        netPayable: zoneRateInfo?.updateBillAmount,
        process: true,
      },
    ];
    UpdateZone(payload, setDisabled, () => {});
  };

  return (
    <IForm
      title=" Rental Vehilce Bill Generate"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={isBtnHide || isComplete || false}
      isHiddenBack={isBtnHide || false}
      isHiddenReset={isBtnHide || isComplete || false}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          {
            ...landingGridData.data,
            supplier:
              landingGridData.data?.supplierId ||
              landingGridData.data?.vehicleSupplierId
                ? {
                    value:
                      landingGridData.data?.supplierId ||
                      landingGridData.data?.vehicleSupplierId,
                    label: landingGridData.data?.supplierName,
                  }
                : "",
          } || initData
        }
        saveHandler={saveHandler}
        fuelTypeList={fuelTypeList}
        supplierDDL={supplierDDL}
        fuelStationDDL={fuelStationDDL}
        setFuelStationDDL={setFuelStationDDL}
        isEdit={ID ? true : false}
        setFileObjects={setFileObjects}
        fileObjects={fileObjects}
        distanceKM={distanceKM}
        shippingInfo={shippingInfo}
        distanceRowDtoHandler={distanceRowDtoHandler}
        shippingRowDtoHandler={shippingRowDtoHandler}
        selectedBusinessUnit={selectedBusinessUnit}
        chalanInfo={chalanInfo}
        billId={billId}
        isComplete={isComplete}
        zoneDDL={zoneDDL}
        setZoneRateInfo={setZoneRateInfo}
        setLoading={setDisabled}
        formType={landingGridData?.type}
        zoneUpdateHandler={zoneUpdateHandler}
        zoneRateInfo={zoneRateInfo}
      />
    </IForm>
  );
}
