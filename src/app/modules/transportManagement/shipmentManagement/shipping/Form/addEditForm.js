import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import {
  getDistributionChannelDDLAction,
  getItemSaleDDLAction,
  getPlantDDLAction,
  getSalesOrgDDLAction,
} from "../../../../_helper/_redux/Actions";
import { _todayDate } from "../../../../_helper/_todayDate";
import { isUniq } from "../../../../_helper/uniqChecker";
import {
  GetPendingDeliveryDDLAction,
  getDeliveryItemVolumeInfoAction,
  getIsSubsidyRunningAction,
  getPaymentTermsDDLAction,
  getSalesContactById,
  getSoldToPPIdAction,
  getVehicleSingleDatabyVehicleIdAction,
  saveShipment,
  setSalesContactSingleEmpty,
} from "../_redux/Actions";
import { shipmentInfoUpdate } from "../helper";
import Loading from "./../../../../_helper/_loading";
import { getLoadingPointDDLAction } from "./../_redux/Actions";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const initData = {
  id: undefined,
  Vehicle: "",
  vehicleId: "",
  route: "",
  transportMode: "",
  transportZone: "",
  shipPoint: "",
  shipmentType: "",
  loadingPoint: "",
  pendingDelivery: "",
  startDate: _todayDate(),
  shipmentdate: _todayDate(),
  estimatedTimeofArrival: _todayDate(),
  planedLoadingTime: _todayDate(),
  driverName: "",
  driverContactNo: "",
  driverId: "",
  supplierName: "",
  truckTrallerSupplier: {
    label: "M/S Shawan Enterprise [13282]",
    value: 13282,
  },
  isLaborImpart: { value: false, label: "No" },
  laborSupplierName: "",
  totalBundle: "",
  totalPieces: "",
  veichleEntry: "",
  strCardNo: "",
  pump: "",
  lastDistance: 0,
  packer: 0,
};

export default function ShipmentForm({
  history,
  match: {
    params: { id },
  },
}) {
  const dispatch = useDispatch();
  const { state: headerData } = useLocation();
  const [isDisabled, setDisabled] = useState(false);
  // const [vehicleDDLLoding, setvehicleDDLLoding] = useState(false);
  const [costlaborRateStatus, setCostlaborRateStatus] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [routeListDDL, setRouteListDDL] = useState([]);
  const [packerList, getPackerList, , setPackerList] = useAxiosGet();

  // get user profile data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  /*======================
  get All DDL start*/
  const {
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    itemSaleDDL,
    shippointDDL: ShippointDDL,
  } = useSelector((state) => {
    return state?.commonDDL;
  }, shallowEqual);

  const {
    shipmentTypeDDL: ShipmentTypeDDL,
    pendingDeliveryDDL,
    deliverydata: deliveryeDatabydata,
    singleData,
    loadingPointDDL,
    vehicleSingeData: vehicleSingleData,
    deliveryItemVolumeInfo,
    stockStatusOnShipment,
    vehicleNo,
    isSubsidyRunning,
  } = useSelector((state) => {
    return state?.shipment;
  }, shallowEqual);

  const {
    salesOfficeDDL,
    soldToPartyDDL,
    BUsalesOrgIncotermDDL,
    paymentTermsDDL,
  } = useSelector((state) => {
    return state?.salesContact;
  }, shallowEqual);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getSalesContactById(accId, buId, id, setDisabled));
    } else {
      dispatch(setSalesContactSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId, id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (buId && accId) {
      dispatch(getIsSubsidyRunningAction(accId, buId));
      dispatch(getPlantDDLAction(userId, accId, buId));
      dispatch(getSalesOrgDDLAction(accId, buId));

      dispatch(getDistributionChannelDDLAction(accId, buId));
      dispatch(getSoldToPPIdAction(accId, buId));
      dispatch(getPaymentTermsDDLAction());
      dispatch(getItemSaleDDLAction(accId, buId));
      getPackerList(
        `/mes/WorkCenter/GetWorkCenterListByTypeId?WorkCenterTypeId=1&AccountId=${accId}&BusinessUnitId=${buId}`,
        (resData) => {
          setPackerList(
            resData?.map((item) => ({
              ...item,
              value: item?.workCenterId,
              label: item?.workCenterName,
            }))
          );
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);

  const vehicleSingeDataView = (id, accId, buId, setter) => {
    dispatch(getVehicleSingleDatabyVehicleIdAction(id, accId, buId, setter));
  };

  const deliveryItemVolume = (id) => {
    dispatch(getDeliveryItemVolumeInfoAction(id));
  };
  const saveHandler = async (values, cb) => {
    if (rowDto?.length < 1) {
      return toast.warn("Please add at least one item");
    }

    if ((buId === 4 || buId === 144) && Boolean(values?.packer)) {
      toast.warn("Please add packer");
    }
    if (values && accId && buId) {
      if (id) {
        const payload = {
          userId: userId,
          shipmentHeader: {
            shipmentId: +id,
            accountId: accId,
            businessUnitId: buId,
            businessUnitName: buName,
            supplierId: values?.supplierName?.value || 0,
            supplierName: values?.supplierName?.label || "",
            shipmentDate: values?.shipmentdate,
            routeId: values?.route?.value,
            routeName: values?.route?.label,
            planedLoadingTime: values?.planedLoadingTime,
            vehicleId: +values?.vehicleId || 0,
            vehicleName: values?.Vehicle?.label,
            shipmentCostId: values?.Vehicle?.value,
            lastDestinationKm: +values?.lastDistance,
            lastDestinationKmCustomerId:
              +values?.lastDestinationKmCustomerId || 0,
            departureDateTime: values?.estimatedTimeofArrival,
            actualDepartureDateTime: values?.estimatedTimeofArrival,
            driverId: values?.driverId,
            driverName: values?.driverName,
            driverContactNo: values?.driverContactNo,
            actionBy: userId,
            lastActionDateTime: "2023-01-18T07:12:29.402Z",
            unloadVehicleWeight: vehicleSingleData?.weight,
            unloadVehicleVolume: vehicleSingleData?.volume,
            itemTotalGrowssWeight:
              deliveryItemVolumeInfo?.grossWeight ||
              singleData?.shipmentHeader?.itemTotalGrowssWeight,
            itemTotalNetWeight:
              deliveryItemVolumeInfo?.netWeight ||
              singleData?.shipmentHeader?.itemTotalGrowssWeight,
            itemTotalVolume:
              deliveryItemVolumeInfo?.volume ||
              singleData?.shipmentHeader?.itemTotalVolume,
            isLaborImpart: values?.isLaborImpart?.value || false,
            transportZoneId: values.transportZone.value || 0,
            laborSupplierId: values?.laborSupplierName?.value || 0,
            loadingLabourSupplierId: values?.truckTrallerSupplier?.value || 0,
            laborSupplierName: values?.laborSupplierName?.label || 0,
            totalBundel: values?.totalBundle || 0,
            totalPieces: values?.totalPieces || 0,
            veichleEntryId: values.veichleEntry?.value || 0,
            veichleEntryCode: values.veichleEntry?.label || "",
            pumpModelId: values?.pump?.value || 0,
            pumpModelName: values?.pump?.label || "",
            pumpGroupHeadEnroll: values?.pump?.pumpGroupHeadEnroll || 0,
          },
          shipmentRowEntryList: rowDto.map((itm) => {
            return {
              deliveryId: itm.deliveryId,
              deliveryCode: itm.deliveryCode,
              shipToPartnerId: itm.shipToPartnerId,
              shipToPartnerName: itm.shipToPartnerName,
              shipToPartnerAddress: itm.shipToPartnerAddress,
              loadingPointId: itm.loadingPointId,
              distanceKm: +values.lastDistance,
              eta: values.estimatedTimeofArrival,
              transportZoneId: itm.transportZoneId,
              itemTotalGrowssWeight: itm.itemTotalGrowssWeight,
              itemTotalNetWeight: itm.itemTotalNetWeight,
              itemTotalVolume: itm.itemTotalVolume,
              unloadVehicleWeight: itm.unloadVehicleWeight,
              unloadVehicleVolume: itm.unloadVehicleVolume,
              rowId: itm?.rowId || 0,
              soldToPartnerId: 0,
            };
          }),
        };
        shipmentInfoUpdate(payload, setDisabled, () => {});
        // dispatch(saveEditedShipment(payload, setDisabled));
      } else {
        const shipmentRowEntryList = rowDto.map((itm) => {
          return {
            deliveryId: itm?.deliveryId,
            deliveryCode: itm?.deliveryCode,
            shipToPartnerId: itm?.shipToPartnerId,
            shipToPartnerName: itm?.shipToPartnerName,
            shipToPartnerAddress: itm?.shipToPartnerAddress,
            loadingPointId: itm?.loadingPointId,
            distanceKm: +values.lastDistance,
            eta: values.estimatedTimeofArrival,
            transportZoneId: itm?.transportZoneId,
            itemTotalGrowssWeight: itm?.itemTotalGrowssWeight,
            itemTotalNetWeight: itm?.itemTotalNetWeight,
            itemTotalVolume: itm?.itemTotalVolume,
            unloadVehicleWeight: itm?.unloadVehicleWeight,
            unloadVehicleVolume: itm?.unloadVehicleVolume,
            rowId: itm?.rowId || 0,
            laborSupplierId: values?.laborSupplierName?.value || 0,
            laborSupplierName: values?.laborSupplierName?.label || 0,
          };
        });
        const payload = {
          shipmentRowEntryList: shipmentRowEntryList,
          shipmentHeader: {
            veichleEntryId: values.veichleEntry?.value || 0,
            veichleEntryCode: values.veichleEntry?.label || "",
            supplierId: values?.supplierName?.value || 0,
            supplierName: values?.supplierName?.label || 0,
            shipmentId: values.shipPoint.value,
            accountId: accId,
            businessUnitId: buId,
            businessUnitName: buName,
            shipmentDate: values.shipmentdate,
            routeId: values.route.value,
            //
            planedLoadingTime: values.planedLoadingTime,
            routeName: values.route.label,
            vehicleId: +values?.vehicleId || 0,
            vehicleName: values.Vehicle.label,
            shipmentCostId: values.Vehicle.value,
            lastDestinationKm: +values.lastDistance,
            departureDateTime: values.estimatedTimeofArrival,
            actualDepartureDateTime: values.estimatedTimeofArrival,
            driverId: values.driverId,
            driverName: values.driverName,
            driverContactNo: values.driverContactNo,
            actionBy: userId,
            active: true,
            totalBundel: values?.totalBundle || 0,
            totalPieces: values?.totalPieces || 0,
            lastActionDateTime: _todayDate(),
            itemTotalGrowssWeight: rowDto
              .map((itm) => itm?.itemTotalGrowssWeight)
              .reduce((sum, curr) => {
                return (sum += curr);
              }, 0),
            // itemTotalNetWeight: deliveryItemVolumeInfo?.netWeight,
            itemTotalNetWeight: rowDto
              .map((itm) => itm?.itemTotalNetWeight)
              .reduce((sum, curr) => {
                return (sum += curr);
              }, 0),
            itemTotalVolume: rowDto
              .map((itm) => itm?.itemTotalVolume)
              .reduce((sum, curr) => {
                return (sum += curr);
              }, 0),
            unloadVehicleWeight: vehicleSingleData?.weight,
            unloadVehicleVolume: vehicleSingleData?.volume,
            lastDestinationKmCustomerId:
              +values?.lastDestinationKmCustomerId || 0,
            isLaborImpart: values?.isLaborImpart?.value || false,
            laborSupplierId: values?.laborSupplierName?.value || 0,
            laborSupplierName: values?.laborSupplierName?.label || 0,
            loadingLabourSupplierId: values?.truckTrallerSupplier?.value || 0,
            transportZoneId: values?.transportZone?.value || 0,
            pumpModelId: values?.pump?.value || 0,
            pumpModelName: values?.pump?.label || "",
            pumpGroupHeadEnroll: values?.pump?.pumpGroupHeadEnroll || 0,
            packerId: values?.packer?.value,
          },
        };
        dispatch(saveShipment({ data: payload, cb, setDisabled }));
        setRowDto([]);
      }
    } else {
      setDisabled(false);
    }
  };
  //addBtnHandler
  const addBtnHandler = (values, setFieldValue) => {
    // dispatch(getDeliveryeDatabyId(values.pendingDelivery.value));
    if (deliveryeDatabydata) {
      if (+deliveryItemVolumeInfo?.netWeight <= 0) {
        toast.warn(
          "Please configure item unit of measurement [UOM] using Configuration>Item Management>Item Profile"
        );
        return;
      }
      const { routeInfo } = deliveryeDatabydata;
      const newData = [
        {
          deliveryId: deliveryeDatabydata.deliveryId,
          deliveryCode: deliveryeDatabydata.deliveryCode,
          shipToPartnerId: deliveryeDatabydata.shipToPartnerId,
          shipToPartnerName: deliveryeDatabydata.shipToPartnerName,
          shipToPartnerAddress: deliveryeDatabydata.shipToPartnerAddress,
          transportZoneId: routeInfo?.[0]?.zoneId,
          transportZoneName: routeInfo?.[0]?.zoneName,
          loadingPointId: values.loadingPoint.value,
          loadingPointName: values.loadingPoint.label,
          lastKM: deliveryeDatabydata.LastKm,
          shipPointId: values.shipPoint.value,
          shipPointName: values.shipPoint.label,
          itemTotalGrowssWeight: deliveryItemVolumeInfo?.grossWeight,
          itemTotalNetWeight: deliveryItemVolumeInfo?.netWeight,
          itemTotalVolume: deliveryItemVolumeInfo?.volume,
          unloadVehicleWeight: vehicleSingleData?.weight,
          unloadVehicleVolume: vehicleSingleData?.volume,
          rowId: 0,
          costlaborRateStatus: costlaborRateStatus,
          quantity: deliveryeDatabydata?.numQuantity,
          pumpName: values?.pump?.label,
        },
      ];

      if (isUniq("deliveryCode", values.pendingDelivery?.label, rowDto)) {
        // route ddl options set
        const newRouteList = routeInfo?.map((item) => ({
          value: item?.routeId,
          label: item?.routeName,
        }));
        const routeListJoin = [...routeListDDL, ...newRouteList];
        const unique = [
          ...new Map(
            [...routeListJoin].map((item) => [item["value"], item])
          ).values(),
        ];

        setRouteListDDL(unique);
        // stockStatusOnShipment true check
        if (stockStatusOnShipment) {
          const rowDtoArry = [...rowDto, ...newData];
          // formik value set
          setFieldValue("route", unique?.[0]?.value ? unique?.[0] : "");
          setFieldValue(
            "transportZone",
            routeInfo?.[0]?.zoneId
              ? {
                  value: routeInfo?.[0]?.zoneId,
                  label: routeInfo?.[0]?.zoneName,
                }
              : ""
          );
          const isCostlaborRateStatus = rowDtoArry?.some(
            (itm) => itm?.costlaborRateStatus
          );
          setFieldValue(
            "isLaborImpart",
            isCostlaborRateStatus
              ? { value: true, label: "Yes" }
              : { value: false, label: "No" }
          );

          // rowdto set
          const uniqueTwo = [
            ...new Map(
              [...rowDtoArry].map((item) => [item["deliveryCode"], item])
            ).values(),
          ];
          setRowDto(uniqueTwo);
        }
      }
      if (deliveryeDatabydata.distanceKM > values.lastDistance) {
        setFieldValue("lastDistance", deliveryeDatabydata.distanceKM);
        setFieldValue(
          "lastDestinationKmCustomerId",
          deliveryeDatabydata.shipToPartnerId || 0
        );
      } else {
        setFieldValue("lastDistance", values.lastDistance);
        setFieldValue(
          "lastDestinationKmCustomerId",
          values?.lastDestinationKmCustomerId || 0
        );
      }
    } else {
      toast.warning("Data not found");
    }
  };
  // row remove
  const remover = (id, setFieldValue) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);

    const isCostlaborRateStatus = ccdata?.some(
      (itm) => itm?.costlaborRateStatus
    );
    setFieldValue(
      "isLaborImpart",
      isCostlaborRateStatus
        ? { value: true, label: "Yes" }
        : { value: false, label: "No" }
    );
  };

  useEffect(() => {
    if (id) {
      setRowDto(
        singleData?.shipmentRowList?.map((itm) => ({
          ...itm,
          costlaborRateStatus: singleData?.shipmentHeader?.isLaborImpart?.value,
        }))
      );
      if (singleData?.shipmentHeader?.Vehicle?.label)
        vehicleSingeDataView(
          singleData?.shipmentHeader?.Vehicle?.label,
          accId,
          buId,
          null
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData?.shipmentRowList]);

  useEffect(() => {
    return () => {
      dispatch(setSalesContactSingleEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (headerData?.pgiShippoint?.value) {
      dispatch(
        getLoadingPointDDLAction(accId, buId, headerData?.pgiShippoint?.value)
      );
      dispatch(
        GetPendingDeliveryDDLAction(
          headerData?.pgiShippoint?.value,
          buId,
          accId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);
  return (
    <IForm
      title={id ? "Edit Shipment" : "Create Shipment"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        headerData={headerData}
        {...objProps}
        initData={
          singleData?.shipmentHeader || {
            ...initData,
            shipPoint: headerData?.pgiShippoint?.value
              ? headerData?.pgiShippoint
              : "",
          }
        }
        saveHandler={saveHandler}
        accId={accId}
        buId={buId}
        plantDDL={plantDDL}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        salesOrgDDL={salesOrgDDL}
        distributionChannelDDL={distributionChannelDDL}
        salesOfficeDDL={salesOfficeDDL}
        ShipmentTypeDDL={ShipmentTypeDDL}
        ShippointDDL={ShippointDDL}
        PendingDeliveryDDL={pendingDeliveryDDL}
        soldToPartyDDL={soldToPartyDDL}
        BUsalesOrgIncotermDDL={BUsalesOrgIncotermDDL}
        paymentTermsDDL={paymentTermsDDL}
        itemSaleDDL={itemSaleDDL}
        addBtnHandler={addBtnHandler}
        remover={remover}
        vehicleSingeDataView={vehicleSingeDataView}
        vehicleSingleData={vehicleSingleData}
        deliveryItemVolume={deliveryItemVolume}
        deliveryItemVolumeInfo={deliveryItemVolumeInfo}
        loadingPointDDL={loadingPointDDL}
        stockStatusOnShipment={stockStatusOnShipment}
        vehicleNo={vehicleNo}
        routeListDDL={routeListDDL}
        setCostlaborRateStatus={setCostlaborRateStatus}
        isSubsidyRunning={isSubsidyRunning}
        setDisabled={setDisabled}
        deliveryeDatabydata={deliveryeDatabydata}
        packerList={packerList}
      />
    </IForm>
  );
}
