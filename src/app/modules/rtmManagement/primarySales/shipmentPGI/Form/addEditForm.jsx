/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveShipment,
  getSalesContactById,
  getSalesOfficeDDLAction,
  getSoldToPPIdAction,
  getBUsalesOrgIncotermDDLAction,
  getPaymentTermsDDLAction,
  setSalesContactSingleEmpty,
  saveEditedShipment,
  GetVehicleDDLAction,
  GetRouteListDDLAction,
  GetTransportModeDDLAction,

  GetPendingDeliveryDDLAction,
  getVehicleSingleDatabyVehicleIdAction,
  getDeliveryItemVolumeInfoAction,
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
};

export default function RtmShipmentCreateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [LastKM, setLastKM] = useState("");
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

  const salesOfficeDDL = useSelector((state) => {
    return state?.salesContact?.salesOfficeDDL;
  }, shallowEqual);

  const vehicleDDL = useSelector((state) => {
    return state?.shipment?.vehicleDDL;
  }, shallowEqual);

  const RouteListDDL = useSelector((state) => {
    return state?.shipment?.routeListDDL;
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
  const ShippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
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

  // get single sales contact  unit from store

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(
        getSalesContactById(
          profileData.accountId,
          selectedBusinessUnit.value,
          id
        )
      );
    } else {
      dispatch(setSalesContactSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData.accountId, selectedBusinessUnit.value, id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      dispatch(
        getPlantDDLAction(
          profileData.userId,
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(getSalesOrgDDLAction(profileData.accountId, selectedBusinessUnit.value));
      dispatch(
        getDistributionChannelDDLAction(
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
      dispatch(
        getSoldToPPIdAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(getPaymentTermsDDLAction());
      dispatch(
        getItemSaleDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        GetVehicleDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
      dispatch(
        GetRouteListDDLAction(
          profileData?.accountId,
          selectedBusinessUnit?.value
        )
      );
      dispatch(GetTransportModeDDLAction());
      //dispatch(GetShipmentTypeDDLAction(selectedBusinessUnit.value));
      dispatch(
        GetPendingDeliveryDDLAction(
          profileData.accountId,
          profileData.accountId,
          selectedBusinessUnit.value
        )
      );
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
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const shipmentRowEntryList = rowDto.map((itm) => {
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
          };
        });
        const payload = {
          shipmentHeader: {
            shipmentId: +id,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
            shipmentDate: values.shipmentdate,
            routeId: values.route.value,
            routeName: values.route.label,
            //
            planedLoadingTime: values.planedLoadingTime,
            vehicleId: +values?.vehicleId || 0,
            vehicleName: values.Vehicle.label,
            shipmentCostId: values.Vehicle.value,
            lastDestinationKm: +values.lastDistance,
            departureDateTime: values.estimatedTimeofArrival,
            actualDepartureDateTime: values.estimatedTimeofArrival,
            driverId: values.driverId,
            driverName: values.driverName,
            driverContactNo: values.driverContactNo,
            actionBy: profileData.userId,
            active: true,
            lastActionDateTime: _todayDate(),
          },
          shipmentRowEntryList: shipmentRowEntryList,
        };
        dispatch(saveEditedShipment(payload, setDisabled));
      } else {
        const shipmentRowEntryList = rowDto.map((itm) => {
          return {
            deliveryid: itm.deliveryId,
            deliverycode: itm.deliveryCode,
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
          };
        });
        const payload = {
          shipmentRowEntryList: shipmentRowEntryList,
          shipmentHeader: {
            shipmentId: values.shipPoint.value,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
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
            actionBy: profileData.userId,
            active: true,
            lastActionDateTime: _todayDate(),
            itemTotalGrowssWeight: deliveryItemVolumeInfo?.grossWeight,
            itemTotalNetWeight: deliveryItemVolumeInfo?.netWeight,
            itemTotalVolume: deliveryItemVolumeInfo?.volume,
            unloadVehicleWeight: vehicleSingleData?.weight,
            unloadVehicleVolume: vehicleSingleData?.volume,
          },
        };

        dispatch(saveShipment({ data: payload, cb, setDisabled }));
        setRowDto([]);
      }
    } else {
      setDisabled(false);
    }
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };

  //dispatch salesOfficeDDLDispatcher
  const salesOfficeDDLDispatcher = (SalesOrgId) => {
    dispatch(
      getSalesOfficeDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        SalesOrgId
      )
    );
    dispatch(
      getBUsalesOrgIncotermDDLAction(
        profileData.accountId,
        selectedBusinessUnit.value,
        SalesOrgId
      )
    );
  };
  //addBtnHandler
  const addBtnHandler = (values) => {
    // dispatch(getDeliveryeDatabyId(values.pendingDelivery.value));
    if (deliveryeDatabydata) {
      const newData = [
        {
          deliveryId: deliveryeDatabydata.deliveryId,
          deliveryCode: deliveryeDatabydata.deliveryCode,
          shipToPartnerId: deliveryeDatabydata.shipToPartnerId,
          shipToPartnerName: deliveryeDatabydata.shipToPartnerName,
          shipToPartnerAddress: deliveryeDatabydata.shipToPartnerAddress,
          transportZoneId: values.transportZone.value,
          transportZoneName: values.transportZone.label,
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
        },
      ];

      if (isUniq("deliveryCode", values.pendingDelivery?.label, rowDto)) {
        setRowDto([...rowDto, ...newData]);
      }

      if (deliveryeDatabydata.distanceKM > values.lastDistance) {
        setLastKM(deliveryeDatabydata.distanceKM);
      } else {
        setLastKM(values.lastDistance);
      }
    }
  };
  // row remove
  const remover = (id) => {
    let ccdata = rowDto.filter((itm, index) => index !== id);
    setRowDto(ccdata);
  };

  //Total Qty & Total Amount calculation
  // useEffect(() => {
  //   let totalQty = 0;
  //   let totalAmount = 0;
  //   if (rowDto.length) {
  //     for (let i = 0; i < rowDto.length; i++) {
  //       totalQty += +rowDto[i].contactQuantity;
  //       totalAmount += +rowDto[i].contactValue;
  //     }
  //   }
  //   setTotal({ totalQty, totalAmount });
  // }, [rowDto]);

  useEffect(() => {
    if (id) {
      setRowDto(singleData?.shipmentRowList);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData?.shipmentRowList]);

  useEffect(() => {
    return () => {
      dispatch(setSalesContactSingleEmpty());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IForm
      title={id ? "Edit Shipment" : "Create Shipment"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={singleData?.shipmentHeader || initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        plantDDL={plantDDL}
        isEdit={id || false}
        rowDto={rowDto}
        lastDistance={LastKM}
        setRowDto={setRowDto}
        salesOrgDDL={salesOrgDDL}
        distributionChannelDDL={distributionChannelDDL}
        salesOfficeDDL={salesOfficeDDL}
        vehicleDDL={vehicleDDL}
        RouteListDDL={RouteListDDL}
        TransportModeDDL={TransportModeDDL}
        TransportZoneDDL={TransportZoneDDL}
        ShipmentTypeDDL={ShipmentTypeDDL}
        ShippointDDL={ShippointDDL}
        PendingDeliveryDDL={PendingDeliveryDDL}
        soldToPartyDDL={soldToPartyDDL}
        BUsalesOrgIncotermDDL={BUsalesOrgIncotermDDL}
        paymentTermsDDL={paymentTermsDDL}
        itemSaleDDL={itemSaleDDL}
        salesOfficeDDLDispatcher={salesOfficeDDLDispatcher}
        addBtnHandler={addBtnHandler}
        remover={remover}
        vehicleSingeDataView={vehicleSingeDataView}
        vehicleSingleData={vehicleSingleData}
        deliveryItemVolume={deliveryItemVolume}
        deliveryItemVolumeInfo={deliveryItemVolumeInfo}
        loadingPointDDL={loadingPointDDL}
      />
    </IForm>
  );
}
