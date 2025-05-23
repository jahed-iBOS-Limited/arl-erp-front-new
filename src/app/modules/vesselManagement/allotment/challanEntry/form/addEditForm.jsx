import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router';
import { toast } from 'react-toastify';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import {
  // getMotherVesselDDL,
  GetShipPointDDL,
} from '../../loadingInformation/helper';
import {
  EditLighterChallanInfo,
  GetLighterChallanInfoById,
  getLightersForChallan,
  getVehicleDDL,
} from '../helper';
import Form from './form';

const initData = {
  deliveryCode: '',
  godown: '',
  soldToPartner: '',
  transportZone: '',
  deliveryDate: _todayDate(),
  shipPoint: '',
  address: '',
  plant: '',
  collectionDate: '',
  totalLogisticFare: '',
  advanceLogisticFare: '',
  dueFare: '',
  paymentDate: '',
  cashAmount: '',
  creditAmount: '',
  cardNo: '',
  shippingCharge: '',
  emptyBag: '',
  item: '',
  uom: '',
  quantity: '',
  itemPrice: '',
  deliveryValue: '',
  totalDiscountValue: '',
  totalShippingValue: '',
  totalTax: '',
  netValue: '',
  transportRate: '',
  logisticBy: '',
  shippingChallanNo: '',
  programNo: '',
  vehicle: '',
  motherVessel: '',
  supplier: '',
  type: 'badc',
  port: '',
  deliveryType: '',
  dumpDeliveryRate: '',
  directRate: '',
  localRevenueRate: 0,
  internationalRevenueRate: 0,
  transportRevenueRate: 0,
};

export default function ChallanEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: {
      value: buId,
      label: buName,
      buShortName,
      address: buAddress,
    },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { id, type } = useParams();
  const { state } = useLocation();
  const [objProps] = useState({});
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const [shipPointDDL, setShipPointDDL] = useState([]);
  // const [godownDDL, setGodownDDL] = useState([]);
  const [vehicleDDL, setVehicleDDL] = useState([]);
  const [isTransportBill, getIsTransportBill] = useAxiosGet();
  // const [allotmentDDL, setAllotmentDDL] = useState([]);
  const [motherVesselDDL, getMotherVesselDDL, , setMotherVesselDDL] =
    useAxiosGet();
  const [lighterDDL, setLighterDDL] = useState([]);
  const [itemList, getItemList] = useAxiosGet();
  const [organizationDDL, getOrganizationDDL] = useAxiosGet();
  const [destinationDDL, getDestinationDDL] = useAxiosGet();

  const history = useHistory();

  const getDestinationList = (partnerId, portId, motherVesselId) => {
    getDestinationDDL(
      `/tms/LigterLoadUnload/GetShipToPartnerAllotmentDDL?businessUnitId=${buId}&businessPartnerId=${partnerId}&portId=${portId}&motherVesselId=${motherVesselId}`
    );
  };

  useEffect(() => {
    getOrganizationDDL(
      `/tms/LigterLoadUnload/GetG2GBusinessPartnerDDL?BusinessUnitId=${buId}&AccountId=${accId}`
    );
    if (!type || type !== 'view') {
      GetShipPointDDL(accId, buId, setShipPointDDL);
      // getMotherVesselDDL(accId, buId, setMotherVesselDDL);
      if (buId === 94) {
        // getGodownDDL(
        //   buId,
        //   state?.type === "badc" ? 73244 : 73245,
        //   setGodownDDL,
        //   setLoading
        // );
      }
    }
  }, [accId, buId, type]);

  const addRow = (values, callBack) => {
    const exists = rowData?.filter(
      (item) => item?.itemId === values?.item?.value
    );
    if (exists?.length > 0) {
      return toast.warn('Duplicate Item not allowed!');
    }
    try {
      const newRow = {
        rowId: values?.rowId || 0,
        deliveryCode: '',
        itemId: values?.item?.value,
        itemSalesCode: '',
        itemSalesName: '',
        itemCode: '',
        itemName: values?.item?.label,
        uom: 0,
        uomName: '',
        quantity: values?.quantity,
        itemPrice: +values?.itemPrice || 0,
        deliveryValue: 0,
        totalDiscountValue: 0,
        totalShipingValue: 0,
        totalTax: 0,
        netValue: 0,
        locationId: 0,
        locationName: '',
        shipToPartnerContactNo: '',
        // transportRate: 0,
        emptyBag: +values?.emptyBag,
        transportRate: isTransportBill?.hasTransport
          ? values?.transportRate
          : 0,
        // transportRate:  values?.transportRate,
        ghatLoadUnloadLabourRate:
          values?.deliveryType?.label === 'Direct'
            ? values?.directRate
            : values?.dumpDeliveryRate,
        goDownUnloadLabourRate: values?.goDownUnloadLabourRate,
        localRevenueRate: +values?.localRevenueRate,
        internationalRevenueRate: +values?.internationalRevenueRate,
        transportRevenueRate: +values?.transportRevenueRate,
      };
      setRowData([...rowData, newRow]);
      callBack([...rowData, newRow]);
    } catch (e) {}
  };

  const deleteRow = (index, cb) => {
    const newRow = [...rowData];
    newRow.splice(index, 1);
    setRowData(newRow);
    cb(newRow);
  };

  const saveHandler = (values, cb) => {
    const payload = {
      objectHeader: {
        deliveryId: values?.deliveryId || 0,
        accountId: accId,
        businessUnitId: buId,
        businessUnitCode: buShortName,
        businessUnitName: buName,
        businessUnitAddress: buAddress,
        shipToPartnerId: values?.godown?.value,
        shipToPartnerName: values?.godown?.label,
        soldToPartnerId:
          buId === 94
            ? state?.type === 'badc'
              ? 73244
              : 73245
            : values?.organization?.value,
        soldToPartnerName:
          buId === 94
            ? state?.type === 'badc'
              ? 'BADC'
              : 'BCIC'
            : values?.organization?.label,
        shipToPartnerAddress: '',
        transportZoneId: 0,
        transportZoneName: '',
        deliveryDate: values?.deliveryDate,
        shipPointId: values?.shipPoint?.value,
        shipPointName: values?.shipPoint?.label,
        address: values?.address,
        plantId: 0,
        plantName: '',
        totalDeliveryQuantity: 1,
        totalDeliveryValue: 1,
        actionBy: userId,
        collectionDate: '2022-09-05T04:16:51.962Z',
        totalLogsticFare: +values?.logisticAmount || 0,
        advanceLogisticeFare: +values?.advanceAmount || 0,
        dueFare: +values?.dueAmount || 0,
        paymentDate: '2022-09-05T04:16:51.962Z',
        cashAmount: 0,
        creditAmount: 0,
        cardNo: '',
        shippingCharge: 0,
        emptyBag: +values?.emptyBag,
        shippingChallanNo: values?.shippingChallanNo,
        salesOrderCode: values?.shippingChallanNo,
        salesOrderId: 0,
        vehicleRegNo: values?.vehicle?.label,
        vehicleId: values?.vehicle?.value,
        driverName: values?.driver,
        driverPhone: values?.mobileNo,
        motherVesselId: values?.motherVessel?.value,
        lighterVesselId: values?.lighterVessel?.value,
        program: values?.programNo,
        allotmentId: 0,
        ownerTypeId: values?.logisticBy?.value,
        ownerTypeName: values?.logisticBy?.label,
        supplierId: values?.supplier?.value,
        supplierName: values?.supplier?.label,
        isDirectDelivery: values?.deliveryType?.value,
        portId: values?.port?.value,
        transportRate: isTransportBill?.hasTransport
          ? values?.transportRate
          : 0,
        // transportRate: values?.transportRate,
        // ghatLoadUnloadLabourRate: values?.labourRate,
        ghatLoadUnloadLabourRate:
          values?.deliveryType?.label === 'Direct'
            ? values?.directRate
            : values?.dumpDeliveryRate,
        goDownUnloadLabourRate: values?.goDownUnloadLabourRate,
      },
      objectRow: rowData,
    };
    if (id) {
      EditLighterChallanInfo(payload, () => {
        history.goBack();
      });
    } else {
      postData(
        `/tms/LigterLoadUnload/CreateLighterChallanInfo`,
        payload,
        () => {
          cb();
        },
        true
      );
    }
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    const organizationId =
      buId === 94
        ? values?.type === 'badc'
          ? 73244
          : 73245
        : values?.organization?.value;

    switch (fieldName) {
      case 'shipPoint':
        setFieldValue('shipPoint', currentValue);
        setFieldValue('motherVessel', '');
        break;

      case 'port':
        if (currentValue) {
          setFieldValue('port', currentValue);
          setFieldValue('motherVessel', '');
          getMotherVesselDDL(
            `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${currentValue?.value}&businessUnitId=${buId}`
          );
          // getDestinationList(
          //   organizationId,
          //   currentValue?.value,
          //   values?.motherVessel?.value || 0
          // );
        } else {
          setFieldValue('port', '');
          setFieldValue('motherVessel', '');
          setMotherVesselDDL([]);
        }
        break;

      case 'motherVessel':
        setFieldValue('motherVessel', currentValue);

        setFieldValue('lighterVessel', '');
        setFieldValue('godown', '');

        if (currentValue) {
          setFieldValue('programNo', currentValue?.programNo);
          getIsTransportBill(
            `/tms/LigterLoadUnload/CheckTransportForChallan?businessUnitId=${buId}&motherVesselId=${currentValue?.value}&portId=${values?.port?.value}`,
            (resData) => {
              if (!resData?.hasTransport) {
                // setFieldValue("logisticBy", { value: 3, label: "Customer" });
                // setFieldValue("supplier", { value: 0, label: "N/A" });
                setFieldValue('transportRate', 0);
                getVehicleDDL(accId, buId, 3, setVehicleDDL, setLoading);
              } else {
                // setFieldValue("logisticBy", "");
                // setFieldValue("supplier", "");
                setFieldValue('transportRate', '');
              }
            }
          );
          getDestinationList(
            organizationId,
            values?.port?.value,
            currentValue?.value
          );
          setFieldValue('item', {
            value: currentValue?.itemId,
            label: currentValue?.itemName,
            // value: currentValue?.intProductId,
            // label: currentValue?.strProductName,
          });
          getLightersForChallan(
            values?.shipPoint?.value,
            currentValue?.value,
            values?.port?.value,
            setLighterDDL,
            setLoading
          );
        } else {
          setFieldValue('programNo', '');
        }
        // is edit  & Mother Vessel onChnage than rowData itemName update
        rowDataItemNameUpdate({
          value: currentValue?.intProductId,
          label: currentValue?.strProductName,
        });

        break;

      case 'lighterVessel':
        setFieldValue('lighterVessel', currentValue);
        // setFieldValue("item", {
        //   value: currentValue?.itemId,
        //   label: currentValue?.itemName,
        // });
        // if (currentValue) {
        //   getItemList(
        //     `/tms/LigterLoadUnload/GetItemFromAllotmentDDL?AllotmentNo=${values?.program?.value}&LighterVesselId=${currentValue?.value}`
        //   );
        // }
        break;

      // case "program":
      //   setFieldValue("program", currentValue);
      //   break;

      case 'supplier':
        setFieldValue('supplier', currentValue);
        break;

      case 'logisticBy':
        setFieldValue('logisticBy', currentValue);
        setFieldValue('vehicle', '');
        setFieldValue('supplier', '');

        if (currentValue) {
          // if (currentValue?.value === 3) {
          //   setFieldValue("supplier", { value: 0, label: "N/A" });
          // }
          getVehicleDDL(
            accId,
            buId,
            currentValue?.value,
            setVehicleDDL,
            setLoading
          );
        }
        break;

      case 'vehicle':
        setFieldValue('vehicle', currentValue);
        setFieldValue('driver', currentValue?.driverName);
        setFieldValue('mobileNo', currentValue?.driverContact);
        break;

      case 'godown':
        setFieldValue('godown', currentValue);
        setFieldValue('address', currentValue?.partnerShippingAddress);
        break;

      case 'logisticAmount':
        setFieldValue('logisticAmount', currentValue?.target?.value);
        setFieldValue(
          'dueAmount',
          +currentValue?.target?.value - (+values?.advanceAmount || 0)
        );
        break;

      case 'advanceAmount':
        setFieldValue('advanceAmount', currentValue?.target?.value);
        setFieldValue(
          'dueAmount',
          +values?.logisticAmount - (+currentValue?.target?.value || 0)
        );
        break;

      case 'emptyBag':
        setFieldValue('emptyBag', currentValue?.target?.value);
        break;

      case 'quantity':
        setFieldValue('quantity', Number(currentValue?.target?.value));
        // setFieldValue('emptyBag', Number(currentValue?.target?.value / 100));
        break;

      case 'item':
        setFieldValue('item', currentValue);
        break;

      case 'type':
        setFieldValue('type', currentValue);
        // getGodownDDL(
        //   buId,
        //   currentValue === "badc" ? 73244 : 73245,
        //   setGodownDDL,
        //   setLoading
        // );
        getDestinationList(
          // currentValue === "badc" ? 73244 : 73245,
          organizationId,
          values?.port?.value,
          values?.motherVessel?.value
        );
        break;

      case 'organization':
        setFieldValue('organization', currentValue);
        setFieldValue('port', '');
        setFieldValue('motherVessel', '');
        if (currentValue) {
          // getDestinationList(
          //   currentValue?.value,
          //   values?.port?.value,
          //   values?.motherVessel?.value
          // );
          // getGodownDDL(buId, currentValue?.value, setGodownDDL, setLoading);
        }

        break;

      default:
        break;
    }
  };

  useEffect(() => {
    if (id) {
      GetLighterChallanInfoById(id, '', (values) => {
        const organizationId =
          buId === 94
            ? values?.type === 'badc'
              ? 73244
              : 73245
            : values?.soldToPartnerId;
        // console.log(values?.rowList?.[0].transportRate);
        const data = {
          deliveryCode: '',
          transportZone: '',
          plant: '',
          totalLogisticFare: '',
          advanceLogisticFare: '',
          cashAmount: 0,
          creditAmount: 0,
          cardNo: '',
          shippingCharge: 0,
          uom: '',
          itemPrice: '',
          deliveryValue: '',

          totalDiscountValue: '',
          totalShippingValue: '',
          totalTax: '',
          netValue: '',
          transportRate: values?.rowList?.[0].transportRate || '',
          goDownUnloadLabourRate: values?.rowList?.[0].godownLabourRate || '',
          // nEED tO Confirm
          emptyBag: values?.rowList?.[0].emptyBag || '',

          godown: values?.shipToPartnerId
            ? {
                value: values?.shipToPartnerId,
                label: values?.shipToPartnerName,
              }
            : '',
          soldToPartner: values?.soldToPartnerId
            ? {
                value: values?.soldToPartnerId,
                label: values?.soldToPartnerName,
              }
            : '',
          organization: values?.soldToPartnerId
            ? {
                value: values?.soldToPartnerId,
                label: values?.soldToPartnerName,
              }
            : '',
          deliveryDate: _dateFormatter(values?.deliveryDate),
          shipPoint: values?.shipPointId
            ? {
                value: values?.shipPointId,
                label: values?.shipPointName,
              }
            : '',
          address: values?.address,
          collectionDate: new Date(),
          paymentDate: new Date(),

          logisticBy: values?.ownerTyprId
            ? {
                value: values?.ownerTyprId,
                label: values?.ownerTypeName,
              }
            : '',
          programNo: values?.program,
          vehicle: values?.vehicleId
            ? {
                value: values?.vehicleId,
                label: values?.vehicleRegNo,
              }
            : '',
          motherVessel: values?.motherVesselId
            ? {
                value: values?.motherVesselId,
                label: values?.mothetrVesselName,
              }
            : '',
          lighterVessel: values?.lighterVesselId
            ? {
                value: values?.lighterVesselId,
                label: values?.lighterVesselName,
              }
            : '',
          supplier: values?.supplierId
            ? {
                value: values?.supplierId,
                label: values?.supplierName,
              }
            : '',
          type: '',
          port: values?.portId
            ? {
                value: values?.portId,
                label: values?.portName,
              }
            : '',
          deliveryType: values?.isDirectDelivery
            ? { value: true, label: 'Direct' }
            : { value: false, label: 'Indirect' },
          dueFare: values?.dueFare,

          shippingChallanNo: values?.shippingChallanNo || '',
          driver: values?.driverName,
          mobileNo: values?.driverPhone,
          item: values?.lighterVesselId
            ? {
                value: values?.rowList[0]?.itemId,
                label: values?.rowList[0]?.itemName,
              }
            : '',
          quantity: values?.lighterVesselId ? values?.rowList[0]?.quantity : '',
          deliveryId: values?.deliveryId,
        };
        getMotherVesselDDL(
          `/wms/FertilizerOperation/GetMotherVesselProgramInfo?PortId=${values?.portId}`
        );
        getDestinationList(
          // state?.type === "badc" ? 73244 : 73245,
          organizationId,
          values?.motherVesselId,
          values?.portId
        );
        getLightersForChallan(
          values?.shipPointId,
          values?.motherVesselId,
          values?.portId,
          setLighterDDL,
          setLoading
        );
        getVehicleDDL(
          accId,
          buId,
          values?.ownerTyprId,
          setVehicleDDL,
          setLoading
        );
        setSingleData(data);
        setRowData(
          values?.rowList?.map((itm) => ({
            ...itm,
            deliveryCode: '',
            itemId: itm?.itemId,
            itemSalesCode: '',
            itemSalesName: '',
            itemCode: '',
            itemName: itm?.itemName,
            uom: 0,
            uomName: '',
            quantity: itm?.quantity,
            itemPrice: +itm?.itemPrice || 0,
            deliveryValue: 0,
            totalDiscountValue: 0,
            totalShipingValue: 0,
            totalTax: 0,
            netValue: 0,
            locationId: 0,
            locationName: '',
            shipToPartnerContactNo: '',
            transportRate: itm?.transportRate,
            emptyBag: +values?.emptyBag,
          }))
        );
      });
    }
  }, [id]);

  // is edit  & Mother Vessel onChnage than rowData itemName update
  const rowDataItemNameUpdate = (valueOption) => {
    const newRowData = rowData?.map((itm) => ({
      ...itm,
      itemName: valueOption?.label || '',
      itemId: valueOption?.value || 0,
    }));
    setRowData(newRowData);
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          id={id}
          buId={buId}
          state={state}
          accId={accId}
          viewType={type}
          addRow={addRow}
          rowData={rowData}
          itemList={itemList}
          deleteRow={deleteRow}
          // godownDDL={godownDDL}
          lighterDDL={lighterDDL}
          vehicleDDL={vehicleDDL}
          setRowData={setRowData}
          setLoading={setLoading}
          saveHandler={saveHandler}
          getItemList={getItemList}
          shipPointDDL={shipPointDDL}
          // setGodownDDL={setGodownDDL}
          setVehicleDDL={setVehicleDDL}
          destinationDDL={destinationDDL}
          organizationDDL={organizationDDL}
          motherVesselDDL={motherVesselDDL}
          onChangeHandler={onChangeHandler}
          isTransportBill={isTransportBill}
          initData={id ? singleData : initData}
        />
      </div>
    </>
  );
}
