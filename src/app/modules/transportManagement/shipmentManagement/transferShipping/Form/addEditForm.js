import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveShipment,
  getSalesContactById,
  getSoldToPPIdAction,
  getPaymentTermsDDLAction,
  setSalesContactSingleEmpty,
  saveEditedShipment,
  GetVehicleDDLAction,
  GetRouteListDDLAction,
  GetTransportModeDDLAction,
  GetPendingDeliveryDDLAction,
  getVehicleSingleDatabyVehicleIdAction,
  getDeliveryItemVolumeInfoAction,
  getDeliveryeDatabyId,
  getStockStatusOnShipmentAction,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import {
  getPlantDDLAction,
  getSalesOrgDDLAction,
  getDistributionChannelDDLAction,
  getItemSaleDDLAction,
} from "../../../../_helper/_redux/Actions";
import { isUniq } from "../../../../_helper/uniqChecker";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation } from "react-router-dom";
import { getLoadingPointDDLAction } from "../_redux/Actions";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
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
  lastDistance: "",
  estimatedTimeofArrival: _todayDate(),
  planedLoadingTime: _todayDate(),
  driverName: "",
  driverContactNo: "",
  driverId: "",
  supplierName: "",
  isLaborImpart: true,
  laborSupplierName: "",
  gateEntryCode: "",
  strCardNo: "",
  isRequiredLbrSplrName: true,
  packer: "",
};

export default function TransferShipmentForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const { state: headerData } = useLocation();
  const [routeListDDL, setRouteListDDL] = useState([]);
  const [packerList, getPackerList, , setPackerList] = useAxiosGet();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  /*======================
  get All DDL start*/
  const plantDDL = useSelector((state) => {
    return state?.commonDDL?.plantDDL;
  }, shallowEqual);
  const salesOrgDDL = useSelector((state) => {
    return state?.commonDDL?.salesOrgDDL;
  }, shallowEqual);

  const distributionChannelDDL = useSelector((state) => {
    return state?.commonDDL?.distributionChannelDDL;
  }, shallowEqual);
  const itemSaleDDL = useSelector((state) => {
    return state?.commonDDL?.itemSaleDDL;
  }, shallowEqual);
  const ShippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const salesOfficeDDL = useSelector((state) => {
    return state?.salesContact?.salesOfficeDDL;
  }, shallowEqual);

  const vehicleDDL = useSelector((state) => {
    return state?.shipment?.vehicleDDL;
  }, shallowEqual);

  const TransportModeDDL = useSelector((state) => {
    return state?.shipment?.transportModeDDL;
  }, shallowEqual);
  const TransportZoneDDL = useSelector((state) => {
    return state?.shipment?.transportZoneDDL;
  }, shallowEqual);
  const ShipmentTypeDDL = useSelector((state) => {
    return state?.shipment?.shipmentTypeDDL;
  }, shallowEqual);

  const PendingDeliveryDDL = useSelector((state) => {
    return state?.shipment?.pendingDeliveryDDL;
  }, shallowEqual);
  const deliveryeDatabydata = useSelector((state) => {
    return state?.shipment?.deliverydata;
  }, shallowEqual);
  const singleData = useSelector((state) => {
    return state.shipment?.singleData;
  }, shallowEqual);
  const loadingPointDDL = useSelector((state) => {
    return state.shipment?.loadingPointDDL;
  }, shallowEqual);

  const vehicleSingleData = useSelector((state) => {
    return state?.shipment?.vehicleSingeData;
  }, shallowEqual);

  const deliveryItemVolumeInfo = useSelector((state) => {
    return state?.shipment?.deliveryItemVolumeInfo;
  }, shallowEqual);

  const soldToPartyDDL = useSelector((state) => {
    return state?.salesContact?.soldToPartyDDL;
  }, shallowEqual);
  const BUsalesOrgIncotermDDL = useSelector((state) => {
    return state?.salesContact?.BUsalesOrgIncotermDDL;
  }, shallowEqual);
  const paymentTermsDDL = useSelector((state) => {
    return state?.salesContact?.paymentTermsDDL;
  }, shallowEqual);
  const stockStatusOnShipment = useSelector((state) => {
    return state?.shipment?.stockStatusOnShipment;
  }, shallowEqual);

  // get single sales contact  unit from store

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(
        getSalesContactById(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          id
        )
      );
    } else {
      dispatch(setSalesContactSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData?.accountId, selectedBusinessUnit?.value, id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getPlantDDLAction(
          profileData?.userId,
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getSalesOrgDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getDistributionChannelDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        getSoldToPPIdAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(getPaymentTermsDDLAction());
      dispatch(
        getItemSaleDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(
        GetVehicleDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
      dispatch(
        GetRouteListDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(GetTransportModeDDLAction());
      getPackerList(
        `/mes/WorkCenter/GetWorkCenterListByTypeId?WorkCenterTypeId=1&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
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
      //dispatch(GetShipmentTypeDDLAction(selectedBusinessUnit?.value));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const vehicleSingeDataView = (id, accId, buId, setter) => {
    dispatch(getVehicleSingleDatabyVehicleIdAction(id, accId, buId, setter));
  };

  const deliveryItemVolume = (id) => {
    dispatch(getDeliveryItemVolumeInfoAction(id));
  };

  const saveHandler = async (values, cb) => {
    if (values?.isRequiredLbrSplrName && !values?.laborSupplierName) {
      return toast.warn("Labor Supplier Name is required");
    }
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (rowDto?.length === 0) {
        toast.warning("Please add atleast one");
        return;
      }
      if (id) {
        const shipmentRowEntryList = rowDto?.map((itm) => {
          return {
            rowId: itm?.rowId,
            deliveryId: itm?.deliveryId,
            deliveryCode: itm?.deliveryCode,
            shipToPartnerId: itm?.shipToPartnerId,
            shipToPartnerName: itm?.shipToPartnerName,
            shipToPartnerAddress: itm?.shipToPartnerAddress,
            // inventoryTrnasctionId: itm?.deliveryId,
            // inventoryTrnasctionCode: itm?.deliveryCode,
            // toWarehouseId: itm?.shipToPartnerId,
            // toWarehouseName: itm?.shipToPartnerName,
            // toWarehouseAddress: itm?.shipToPartnerAddress,
            loadingPointId: itm?.loadingPointId,
            distanceKm: +values?.lastDistance,
            eta: values?.estimatedTimeofArrival,
            transportZoneId: itm?.transportZoneId,
            itemTotalGrowssWeight: itm?.itemTotalGrowssWeight,
            itemTotalNetWeight: itm?.itemTotalNetWeight,
            itemTotalVolume: itm?.itemTotalVolume,
            unloadVehicleWeight: itm?.unloadVehicleWeight,
            unloadVehicleVolume: itm?.unloadVehicleVolume,
          };
        });
        const payload = {
          shipmentHeader: {
            inventoryTransactionId: +id,
            lastDestinationKmCustomerId: 0,
            supplierId: values?.supplierName?.value || 0,
            supplierName: values?.supplierName?.label || 0,
            shipmentId: +id,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            shipmentDate: values?.shipmentdate,
            routeId: values?.route?.value,
            routeName: values?.route?.label,
            planedLoadingTime: values?.planedLoadingTime,
            vehicleId: +values?.vehicleId || 0,
            vehicleName: values?.Vehicle?.label,
            shipmentCostId: values?.Vehicle?.value,
            lastDestinationKm: +values?.lastDistance,
            departureDateTime: values?.estimatedTimeofArrival,
            actualDepartureDateTime: values?.estimatedTimeofArrival,
            driverId: values?.driverId,
            driverName: values?.driverName,
            driverContactNo: values?.driverContactNo,
            actionBy: profileData?.userId,
            active: true,
            lastActionDateTime: _todayDate(),
            itemTotalGrowssWeight:
              deliveryItemVolumeInfo?.grossWeight ||
              singleData?.shipmentHeader?.itemTotalGrowssWeight,
            itemTotalNetWeight:
              deliveryItemVolumeInfo?.netWeight ||
              singleData?.shipmentHeader?.itemTotalGrowssWeight,
            itemTotalVolume:
              deliveryItemVolumeInfo?.volume ||
              singleData?.shipmentHeader?.itemTotalVolume,
            unloadVehicleWeight: vehicleSingleData?.weight,
            unloadVehicleVolume: vehicleSingleData?.volume,
            isLaborImpart: true,
            transportZoneId: values?.transportZone?.value,
            laborSupplierId: values?.laborSupplierName?.value || 0,
            laborSupplierName: values?.laborSupplierName?.label || "",
            vehicleEntryId: values?.gateEntryCode?.value || 0,
            vehicleEntryCode: values?.gateEntryCode?.label || "",
          },
          shipmentRowEntryList: shipmentRowEntryList,
        };
        dispatch(
          saveEditedShipment(payload, setDisabled, () => {
            // Called Pending List DDL Again
            dispatch(
              GetPendingDeliveryDDLAction(
                values?.shipPoint?.value,
                selectedBusinessUnit?.value,
                profileData?.accountId
              )
            );
          })
        );
      } else {
        const shipmentRowEntryList = rowDto?.map((itm) => {
          return {
            inventoryTrnasctionId: itm?.deliveryId,
            inventoryTrnasctionCode: itm?.deliveryCode,
            toWarehouseId: itm?.shipToPartnerId,
            toWarehouseName: itm?.shipToPartnerName,
            toWarehouseAddress: itm?.shipToPartnerAddress,
            loadingPointId: itm?.loadingPointId,
            distanceKm: +values?.lastDistance,
            eta: values?.estimatedTimeofArrival,
            transportZoneId: itm?.transportZoneId,
            itemTotalGrowssWeight: itm?.itemTotalGrowssWeight,
            itemTotalNetWeight: itm?.itemTotalNetWeight,
            itemTotalVolume: itm?.itemTotalVolume,
            unloadVehicleWeight: itm?.unloadVehicleWeight,
            unloadVehicleVolume: itm?.unloadVehicleVolume,
          };
        });
        const payload = {
          shipmentRowEntryList: shipmentRowEntryList,
          shipmentHeader: {
            supplierId: values?.supplierName?.value || 0,
            supplierName: values?.supplierName?.label || 0,
            shipmentId: values?.shipPoint?.value,

            inventoryTransactionId: values?.pendingDelivery?.value,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            shipmentDate: values?.shipmentdate,
            routeId: values?.route?.value,
            planedLoadingTime: values?.planedLoadingTime,
            routeName: values?.route?.label,
            vehicleId: +values?.vehicleId || 0,
            vehicleName: values?.Vehicle?.label,
            shipmentCostId: values?.Vehicle?.value,
            lastDestinationKm: +values?.lastDistance,
            departureDateTime: values?.estimatedTimeofArrival,
            actualDepartureDateTime: values?.estimatedTimeofArrival,
            driverId: values?.driverId,
            driverName: values?.driverName,
            driverContactNo: values?.driverContactNo,
            actionBy: profileData?.userId,
            active: true,
            lastActionDateTime: _todayDate(),
            itemTotalGrowssWeight: rowDto
              .map((itm) => itm?.itemTotalGrowssWeight)
              .reduce((sum, curr) => {
                return (sum += curr);
              }, 0),
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
            isLaborImpart: true,
            laborSupplierId: values?.laborSupplierName?.value || 0,
            laborSupplierName: values?.laborSupplierName?.label || "",
            transportZoneId: values?.transportZone?.value || 0,
            vehicleEntryId: values?.gateEntryCode?.value || 0,
            vehicleEntryCode: values?.gateEntryCode?.label || "",
            packerId: values?.packer?.value,
          },
        };
        dispatch(saveShipment({ data: payload, cb, setDisabled }));
        setRowDto([]);
      }
    }
  };

  //addBtnHandler
  const addBtnHandler = (values, setFieldValue) => {
    if (deliveryeDatabydata) {
      if (values?.pendingDelivery?.routeInfo?.[0]?.zoneId) {
        const newData = [
          {
            deliveryId: deliveryeDatabydata?.transferId,
            deliveryCode: deliveryeDatabydata?.tranferCode,
            shipToPartnerId: deliveryeDatabydata?.shipToWarehouseId,
            shipToPartnerName: deliveryeDatabydata?.shipToWarehouseName,
            shipToPartnerAddress: deliveryeDatabydata?.shipToWarehouseAddress,
            transportZoneId:
              values?.pendingDelivery?.routeInfo?.[0]?.zoneId || 0,
            transportZoneName:
              values?.pendingDelivery?.routeInfo?.[0]?.zoneName || "",
            loadingPointId: values?.loadingPoint?.value,
            loadingPointName: values?.loadingPoint?.label,
            lastKM: deliveryeDatabydata?.distanceKM,
            shipPointId: values?.shipPoint?.value,
            shipPointName: values?.shipPoint?.label,
            itemTotalGrowssWeight: deliveryItemVolumeInfo?.grossWeight,
            itemTotalNetWeight: deliveryItemVolumeInfo?.netWeight,
            itemTotalVolume: deliveryItemVolumeInfo?.volume,
            unloadVehicleWeight: vehicleSingleData?.weight,
            unloadVehicleVolume: vehicleSingleData?.volume,
          },
        ];
        if (isUniq("deliveryCode", values?.pendingDelivery?.label, rowDto)) {
          if (stockStatusOnShipment) {
            const rowDtoArry = [...rowDto, ...newData];
            // rowdto set
            const uniqueTwo = [
              ...new Map(
                [...rowDtoArry].map((item) => [item["deliveryCode"], item])
              ).values(),
            ];
            setRowDto(uniqueTwo);

            // route ddl options set
            const newRouteList = values?.pendingDelivery?.routeInfo
              ?.filter((item) => item?.routeId !== 0)
              ?.map((item) => ({
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

            setFieldValue("route", unique?.[0]?.value ? unique?.[0] : "");
            setFieldValue(
              "transportZone",
              values?.pendingDelivery?.routeInfo?.[0]?.zoneId
                ? {
                    value: values?.pendingDelivery?.routeInfo?.[0]?.zoneId,
                    label: values?.pendingDelivery?.routeInfo?.[0]?.zoneName,
                  }
                : ""
            );
          }
        }
        if (deliveryeDatabydata?.distanceKM > values?.lastDistance) {
          setFieldValue("lastDistance", deliveryeDatabydata?.distanceKM);
          setFieldValue(
            "lastDestinationKmCustomerId",
            deliveryeDatabydata?.shipToWarehouseId || 0
          );
        } else {
          setFieldValue("lastDistance", values?.lastDistance);
          setFieldValue(
            "lastDestinationKmCustomerId",
            values?.lastDestinationKmCustomerId || 0
          );
        }
      } else {
        toast.warning("Transport Zone Not Setup");
      }
    } else {
      toast.warning("Data not found");
    }
  };
  // row remove
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  useEffect(() => {
    if (id) {
      setRowDto(singleData?.shipmentRowList);
      if (singleData?.shipmentHeader?.Vehicle?.label)
        vehicleSingeDataView(
          singleData?.shipmentHeader?.Vehicle?.label,
          profileData?.accountId,
          selectedBusinessUnit?.value,
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
        getLoadingPointDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          headerData?.pgiShippoint?.value
        )
      );
      dispatch(
        GetPendingDeliveryDDLAction(
          headerData?.pgiShippoint?.value,
          selectedBusinessUnit?.value,
          profileData?.accountId
        )
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerData]);

  // pendingDeliveryOnchangeHandler
  const pendingDeliveryOnchangeHandler = (setFieldValue, valueOption) => {
    setFieldValue("pendingDelivery", valueOption);
    dispatch(getDeliveryItemVolumeInfoAction(valueOption?.value));
    dispatch(
      getDeliveryeDatabyId(
        valueOption?.value,
        valueOption?.routeInfo?.[0]?.zoneId
      )
    );
    dispatch(
      getStockStatusOnShipmentAction(
        valueOption?.value,
        selectedBusinessUnit?.value
      )
    );
  };
  return (
    <IForm
      title={id ? "Edit Transfer Shipping" : "Create Transfer Shipping"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        headerData={headerData}
        {...objProps}
        initData={singleData?.shipmentHeader || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        plantDDL={plantDDL}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        salesOrgDDL={salesOrgDDL}
        distributionChannelDDL={distributionChannelDDL}
        salesOfficeDDL={salesOfficeDDL}
        vehicleDDL={vehicleDDL}
        routeListDDL={routeListDDL}
        TransportModeDDL={TransportModeDDL}
        TransportZoneDDL={TransportZoneDDL}
        ShipmentTypeDDL={ShipmentTypeDDL}
        ShippointDDL={ShippointDDL}
        PendingDeliveryDDL={PendingDeliveryDDL}
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
        pendingDeliveryOnchangeHandler={pendingDeliveryOnchangeHandler}
        packerList={packerList}
      />
    </IForm>
  );
}
