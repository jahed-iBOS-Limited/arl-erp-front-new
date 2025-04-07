import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import ICalendar from '../../../../_helper/_inputCalender';
import { ISelect } from '../../../../_helper/_inputDropDown';
import Loading from './../../../../_helper/_loading';
// import { _dateFormatter } from "../../../../_helper/_dateFormate";
import axios from 'axios';
import { Input } from '../../../../../../_metronic/_partials/controls';
import InputField from '../../../../_helper/_inputField';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import {
  GetPendingDeliveryDDLAction,
  getDeliveryItemVolumeInfoAction,
  getDeliveryeDatabyId,
  getStockStatusOnShipmentAction,
  getVehicleNo_action,
} from '../_redux/Actions';
import { getItemListForChallan, getTransportStatusAndInfo } from '../helper';
import SearchAsyncSelect from './../../../../_helper/SearchAsyncSelect';
import FormikError from './../../../../_helper/_formikError';
import NewSelect from './../../../../_helper/_select';
import { getLoadingPointDDLAction } from './../_redux/Actions';
import ChallanItemsPreview from './itemsPreview';
import QRCodeScanner from '../../../../_helper/qrCodeScanner';
// import InputField from "../../../../_helper/_inputField";
// Validation schema
const validationSchema = Yup.object().shape({
  Vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('route is required'),
    value: Yup.string().required('route is required'),
  }),

  transportZone: Yup.object().shape({
    label: Yup.string().required('Transport Zone is required'),
    value: Yup.string().required('Transport Zone is required'),
  }),
  shipPoint: Yup.object().shape({
    label: Yup.string().required('Ship Point is required'),
    value: Yup.string().required('Ship Point is required'),
  }),

  loadingPoint: Yup.object().shape({
    label: Yup.string().required('Loading Point is required'),
    value: Yup.string().required('Loading Point is required'),
  }),
  pendingDelivery: Yup.object().shape({
    label: Yup.string().required('Pending Delivery is required'),
    value: Yup.string().required('Pending Delivery is required'),
  }),
  supplierName: Yup.object().when('Vehicle', (Vehicle, Schema) => {
    if (Vehicle?.isRental)
      return Schema.required('Vehicle Supplier Name is required');
  }),
  laborSupplierName: Yup.object().when(
    'isLaborImpart',
    (isLaborImpart, Schema) => {
      if (isLaborImpart?.value)
        return Schema.required('Labor/Handling Supplier Name is required');
    }
  ),
  shipmentdate: Yup.date().required('Shipment Date required'),

  estimatedTimeofArrival: Yup.date().required(
    'Estimated Time of Arrival required'
  ),
});
const validationSchemaEdit = Yup.object().shape({
  lastDistance: Yup.number()
    .min(0, 'Minimum 0 strings')
    .max(1000000, 'Maximum 1000000 strings')
    .required('Last Distance is required'),

  Vehicle: Yup.object().shape({
    label: Yup.string().required('Vehicle is required'),
    value: Yup.string().required('Vehicle is required'),
  }),
  route: Yup.object().shape({
    label: Yup.string().required('route is required'),
    value: Yup.string().required('route is required'),
  }),

  shipmentdate: Yup.date().required('Shipment Date required'),
  supplierName: Yup.object().when('Vehicle', (Vehicle, Schema) => {
    if (Vehicle?.isRental) return Schema.required('Supplier Name is required');
  }),
  estimatedTimeofArrival: Yup.date().required(
    'Estimated Time of Arrival required'
  ),
  transportZone: Yup.object().shape({
    label: Yup.string().required('Transport Zone is required'),
    value: Yup.string().required('Transport Zone is required'),
  }),
  laborSupplierName: Yup.object().when(
    'isLaborImpart',
    (isLaborImpart, Schema) => {
      if (isLaborImpart?.value)
        return Schema.required('Labor Supplier Name is required');
    }
  ),
});
export default function FormCmp({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  isEdit,
  rowDto,
  plantDDL,
  vehicleDDL,
  ShipmentTypeDDL,
  salesOrgDDL,
  distributionChannelDDL,
  salesOfficeDDL,
  soldToPartyDDL,
  addBtnHandler,
  headerData,
  PendingDeliveryDDL,
  remover,
  vehicleSingeDataView,
  vehicleSingleData,
  accountId,
  buId,
  loadingPointDDL,
  ShippointDDL,
  vehicleNo,
  routeListDDL,
  setCostlaborRateStatus,
  isSubsidyRunning,
  setDisabled,
}) {
  const [QRCodeScannerModal, setQRCodeScannerModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingTwo, setLoadingTwo] = useState(false);
  const [controls, setControls] = useState([]);
  const [open, setOpen] = useState(false);
  const [previewItems, setPreviewItems] = useState([]);
  const [transportStatus, setTransportStatus] = useState([]);
  const [, getEntryCodeDDL, entryCodeDDLloader] = useAxiosGet();
  const [, getVehicleEntryDDL, vehicleEntryDDLloader] = useAxiosGet();
  const dispatch = useDispatch();
  const shippointDDL = useSelector((state) => {
    return state?.commonDDL?.shippointDDL;
  }, shallowEqual);
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setControls([
      {
        label: 'Select Ship Point',
        name: 'shipPoint',
        options: ShippointDDL,
        value: initData.shipPoint,
        isDisabled: true,
        dependencyFunc: (currentValue, values, setter) => {
          dispatch(GetPendingDeliveryDDLAction(currentValue, buId, accountId));
          dispatch(getLoadingPointDDLAction(accountId, buId, currentValue));
          setter('loadingPoint', '');
          setter('pendingDelivery', '');
        },
      },
      {
        label: 'Get Entry Card No',
        name: 'strCardNo',
        value: initData.strCardNo,
        type: 'cardInput',
        isDisabled: isEdit,
      },
      {
        label: 'Gate Entry Code',
        name: 'veichleEntry',
        value: initData.veichleEntry,
        type: 'asyncSelect',
        isDisabled: isEdit,
      },
      {
        label: 'Select Vehicle',
        name: 'Vehicle',
        options: vehicleDDL,
        value: initData.Vehicle,
        isDisabled: isEdit ? false : rowDto?.length,
        dependencyFunc: (currentValue, values, setter, label) => {
          vehicleSingeDataView(label, accountId, buId, setter);
          setter('supplierName', '');
          setter('laborSupplierName', '');
        },
      },
      {
        label: 'Select Route',
        name: 'route',
        options: routeListDDL || [],
        value: initData.route,
        isDisabled: !routeListDDL?.length,
      },
      {
        label: 'Loading Point',
        name: 'loadingPoint',
        options: loadingPointDDL,
        value: initData.loadingPoint,
        isDisabled: isEdit,
      },
    ]);
  }, [
    ShippointDDL,
    vehicleDDL,
    ShipmentTypeDDL,
    plantDDL,
    salesOrgDDL,
    distributionChannelDDL,
    salesOfficeDDL,
    soldToPartyDDL,
    loadingPointDDL,
    routeListDDL,
    rowDto,
  ]);

  const isGateMaintain = shippointDDL?.find(
    (i) => i.value === headerData?.pgiShippoint?.value
  )?.isGateMaintain;

  useEffect(() => {
    if (vehicleDDL?.length > 0 && document.getElementById('cardNoInput')) {
      document.getElementById('cardNoInput').focus();
    }
  }, [vehicleDDL]);

  const qurScanHandler = ({ setFieldValue, values }) => {
    document.getElementById('cardNoInput').disabled = true;
    getEntryCodeDDL(
      `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForShipment&BusinessUnitId=${selectedBusinessUnit?.value}&search=${values?.strCardNo}`,
      (data) => {
        if (data[0]?.strEntryCode) {
          setFieldValue('veichleEntry', isGateMaintain ? data?.[0] : '');
          getVehicleEntryDDL(
            `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accountId}&businessUnitId=${buId}&EntryCode=${data[0]?.strEntryCode}`,
            (data) => {
              const find = vehicleDDL?.find(
                (i) => i.veichleId === data[0]?.vehicleId
              );
              if (find) {
                setFieldValue('laborSupplierName', '');
                vehicleSingeDataView(
                  find?.label,
                  accountId,
                  buId,
                  setFieldValue
                );
                setFieldValue('Vehicle', find || '');
                setFieldValue('supplierName', '');
                setFieldValue('laborSupplierName', '');
                const controlsModify = [...controls];
                controlsModify[2].isDisabled = true;
                setControls(controlsModify);
              }
            }
          );
        } else {
          setFieldValue('strCardNo', '');
          setFieldValue('veichleEntry', '');
          document.getElementById('cardNoInput').disabled = false;
          document.getElementById('cardNoInput').focus();
          toast.warn('Card Number Not Found');
        }
      }
    );
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          isEdit
            ? initData
            : {
                ...initData,
                shipPoint: headerData?.pgiShippoint?.value
                  ? headerData?.pgiShippoint
                  : '',
                lastDistance: 0,
                loadingPoint: loadingPointDDL?.[0] || '',
              }
        }
        validationSchema={isEdit ? validationSchemaEdit : validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          if (isGateMaintain && !values?.veichleEntry?.value)
            return toast.warn('Veichle Entry is required ');
          saveHandler(values, () => {
            resetForm(initData);
            document.getElementById('cardNoInput').disabled = false;
            document.getElementById('cardNoInput').focus();
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {(loading || loadingTwo) && <Loading />}
            {isSubsidyRunning && (
              <marquee
                direction="left"
                style={{ fontSize: '15px', fontWeight: 'bold', color: 'red' }}
              >
                Transport subsidiary is running....
              </marquee>
            )}
            <Form className="form form-label-right">
              {(entryCodeDDLloader || vehicleEntryDDLloader) && <Loading />}
              <div className="row mt-1">
                <div className="col-lg-9 text-right"></div>
                {values?.Vehicle && (
                  <div
                    className="col-lg-3"
                    style={{ backgroundColor: 'yellow' }}
                  >
                    <h5>
                      {values?.Vehicle?.isRental
                        ? 'Rental Vehicle'
                        : 'Company Vehicle'}
                    </h5>
                  </div>
                )}
                <div className="col-lg-12 p-0 m-0">
                  <div
                    className="row global-form m-0"
                    style={{ paddingBottom: '10px' }}
                  >
                    <>
                      {controls.map((itm) => {
                        return itm?.type === 'asyncSelect' ? (
                          isGateMaintain && (
                            <>
                              <div className="col-lg-3">
                                <label>{itm?.label}</label>
                                <SearchAsyncSelect
                                  // isDisabled={itm?.isDisabled}
                                  selectedValue={values[itm?.name]}
                                  handleChange={(valueOption) => {
                                    setFieldValue(itm?.name, valueOption || '');
                                    const find = vehicleDDL?.find(
                                      (i) =>
                                        i.veichleId === valueOption?.vehicleId
                                    );
                                    if (find) {
                                      setFieldValue('laborSupplierName', '');
                                      vehicleSingeDataView(
                                        find?.label,
                                        accountId,
                                        buId,
                                        setFieldValue
                                      );
                                      setFieldValue('Vehicle', find || '');
                                      setFieldValue('supplierName', '');
                                      setFieldValue('laborSupplierName', '');
                                      const controlsModify = [...controls];
                                      controlsModify[2].isDisabled = true;
                                      setControls(controlsModify);
                                    }
                                  }}
                                  placeholder={itm?.label}
                                  loadOptions={(v) => {
                                    const searchValue = v.trim();
                                    if (searchValue?.length < 2) return [];
                                    return axios
                                      .get(
                                        `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accountId}&businessUnitId=${buId}&EntryCode=${v}`
                                      )
                                      .then((res) => res?.data);
                                  }}
                                  isDisabled={itm?.isDisabled}
                                />
                                <FormikError
                                  errors={errors}
                                  name="product"
                                  touched={touched}
                                />
                              </div>
                            </>
                          )
                        ) : itm?.type === 'cardInput' ? (
                          isGateMaintain && (
                            <div
                              className="col-lg-3 d-flex"
                              style={{
                                position: 'relative',
                              }}
                            >
                              <div
                                style={{
                                  position: 'absolute',
                                  right: 0,
                                  top: 0,
                                  cursor: 'pointer',
                                  color: 'blue',
                                  zIndex: '1',
                                }}
                                onClick={() => {
                                  setQRCodeScannerModal(true);
                                }}
                              >
                                QR Code{' '}
                                <i class="fa fa-qrcode" aria-hidden="true"></i>
                              </div>
                              <div style={{ width: 'inherit' }}>
                                <InputField
                                  disabled={itm?.isDisabled}
                                  id="cardNoInput"
                                  value={values?.strCardNo}
                                  label={itm?.label}
                                  name="strCardNo"
                                  type="text"
                                  onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                      document.getElementById(
                                        'cardNoInput'
                                      ).disabled = true;
                                      getEntryCodeDDL(
                                        `/mes/MSIL/GetAllMSIL?PartName=GetVehicleInfoByCardNumberForShipment&BusinessUnitId=${selectedBusinessUnit?.value}&search=${values?.strCardNo}`,
                                        (data) => {
                                          if (data[0]?.strEntryCode) {
                                            setFieldValue(
                                              'veichleEntry',
                                              isGateMaintain ? data?.[0] : ''
                                            );
                                            getVehicleEntryDDL(
                                              `/wms/ItemPlantWarehouse/GetVehicleEntryDDL?accountId=${accountId}&businessUnitId=${buId}&EntryCode=${data[0]?.strEntryCode}`,
                                              (data) => {
                                                const find = vehicleDDL?.find(
                                                  (i) =>
                                                    i.veichleId ===
                                                    data[0]?.vehicleId
                                                );
                                                if (find) {
                                                  setFieldValue(
                                                    'laborSupplierName',
                                                    ''
                                                  );
                                                  vehicleSingeDataView(
                                                    find?.label,
                                                    accountId,
                                                    buId,
                                                    setFieldValue
                                                  );
                                                  setFieldValue(
                                                    'Vehicle',
                                                    find || ''
                                                  );
                                                  setFieldValue(
                                                    'supplierName',
                                                    ''
                                                  );
                                                  setFieldValue(
                                                    'laborSupplierName',
                                                    ''
                                                  );
                                                  const controlsModify = [
                                                    ...controls,
                                                  ];
                                                  controlsModify[2].isDisabled = true;
                                                  setControls(controlsModify);
                                                }
                                              }
                                            );
                                          } else {
                                            setFieldValue('strCardNo', '');
                                            setFieldValue('veichleEntry', '');
                                            document.getElementById(
                                              'cardNoInput'
                                            ).disabled = false;
                                            document
                                              .getElementById('cardNoInput')
                                              .focus();
                                            toast.warn('Card Number Not Found');
                                          }
                                        }
                                      );
                                    }
                                  }}
                                  onChange={(e) => {
                                    setFieldValue('strCardNo', e.target.value);
                                  }}
                                />
                              </div>
                              {!isEdit && (
                                <span
                                  style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginLeft: '5px',
                                    cursor: 'pointer',
                                    marginTop: '20px',
                                  }}
                                  onClick={() => {
                                    setFieldValue('strCardNo', '');
                                    document.getElementById(
                                      'cardNoInput'
                                    ).disabled = false;
                                    document
                                      .getElementById('cardNoInput')
                                      .focus();
                                    resetForm(initData);
                                  }}
                                >
                                  <i
                                    style={{
                                      color: 'blue',
                                    }}
                                    className="fa fa-refresh"
                                    aria-hidden="true"
                                  ></i>
                                </span>
                              )}
                            </div>
                          )
                        ) : (
                          <div className="col-lg-3">
                            <ISelect
                              label={itm.label}
                              placeholder={itm.label}
                              options={itm.options}
                              value={values[itm.name]}
                              name={itm.name}
                              setFieldValue={setFieldValue}
                              errors={errors}
                              values={values}
                              touched={touched}
                              dependencyFunc={itm.dependencyFunc}
                              isDisabled={itm?.isDisabled}
                            />
                          </div>
                        );
                      })}
                      <div className="col-lg-3">
                        <InputField
                          value={values.lastDistance}
                          label="Last Distance (KM)"
                          name="lastDistance"
                          type="number"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="isLaborImpart"
                          options={[
                            { value: false, label: 'No' },
                            { value: true, label: 'Yes' },
                          ]}
                          value={values?.isLaborImpart}
                          label="Labor/Handling Provided"
                          onChange={(valueOption) => {
                            setFieldValue('isLaborImpart', valueOption);
                            setFieldValue('supplierName', '');
                            setFieldValue('laborSupplierName', '');
                          }}
                          placeholder="Labor/Handling Provided"
                          errors={errors}
                          touched={touched}
                          isDisabled={true}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Estimated of Arrival Date </label>
                        <ICalendar
                          value={values.estimatedTimeofArrival || ''}
                          name="estimatedTimeofArrival"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Planned Loading Time </label>
                        <ICalendar
                          value={values.planedLoadingTime || ''}
                          name="planedLoadingTime"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values.driverName || ''}
                          placeholder="Driver Name"
                          name="driverName"
                          label="Driver Name"
                          component={Input}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values.driverContactNo || ''}
                          placeholder="Driver Contact No"
                          name="driverContactNo"
                          label="Driver Contact No"
                          component={Input}
                          type="text"
                          disabled
                        />
                      </div>
                      <div className="col-lg-3" style={{ display: 'none' }}>
                        <InputField
                          value={values.driverId || ''}
                          placeholder="Driver Id"
                          name="driverId"
                          label="Driver Id"
                          component={Input}
                          type="text"
                        />
                      </div>
                      {!isEdit && (
                        <div className="col-lg-3">
                          <NewSelect
                            name="pendingDelivery"
                            placeholder="Pending Delivery List"
                            label="Pending Delivery List"
                            options={PendingDeliveryDDL || []}
                            value={values?.pendingDelivery}
                            isDisabled={!values?.Vehicle}
                            onChange={(valueOption) => {
                              setFieldValue('pendingDelivery', valueOption);
                              dispatch(
                                getDeliveryItemVolumeInfoAction(
                                  valueOption?.value,
                                  setDisabled
                                )
                              );
                              dispatch(
                                getDeliveryeDatabyId(
                                  valueOption?.value,
                                  values,
                                  buId,
                                  setCostlaborRateStatus,
                                  setLoading
                                )
                              );
                              dispatch(
                                getStockStatusOnShipmentAction(
                                  valueOption?.value,
                                  buId,
                                  setLoadingTwo
                                )
                              );
                              dispatch(
                                getVehicleNo_action(valueOption?.value, buId)
                              );
                              getTransportStatusAndInfo(
                                1,
                                buId,
                                valueOption?.value,
                                setTransportStatus,
                                setDisabled
                              );
                            }}
                          />
                        </div>
                      )}

                      <div className="col-lg-3 mt-5">
                        <button
                          className="btn btn-primary btn-sm"
                          type="button"
                          onClick={() => {
                            const payload = rowDto?.map((e) => e?.deliveryId);
                            getItemListForChallan(
                              accountId,
                              buId,
                              setPreviewItems,
                              payload,
                              setDisabled,
                              () => {
                                setOpen(true);
                              }
                            );
                          }}
                          disabled={!rowDto?.length}
                        >
                          Preview
                        </button>
                      </div>
                      {values?.Vehicle?.isRental && (
                        <div className="col-lg-3">
                          <label> Vehicle Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.supplierName}
                            handleChange={(valueOption) => {
                              setFieldValue('supplierName', valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${buId}&SBUId=${0}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                  }));
                                  return updateList;
                                });
                            }}
                          />
                          <FormikError
                            errors={errors}
                            name="supplierName"
                            touched={touched}
                          />
                        </div>
                      )}
                      {values?.isLaborImpart?.value && (
                        <div className="col-lg-3">
                          <label>Labor/Handling Supplier Name</label>
                          <SearchAsyncSelect
                            selectedValue={values.laborSupplierName}
                            handleChange={(valueOption) => {
                              setFieldValue('laborSupplierName', valueOption);
                            }}
                            loadOptions={(v) => {
                              if (v.length < 3) return [];
                              return axios
                                .get(
                                  `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${buId}&SBUId=${0}`
                                )
                                .then((res) => {
                                  const updateList = res?.data.map((item) => ({
                                    ...item,
                                  }));
                                  return updateList;
                                });
                            }}
                            // isDisabled={isEdit}
                          />
                          <FormikError
                            errors={errors}
                            name="laborSupplierName"
                            touched={touched}
                          />
                        </div>
                      )}
                      <div className="col-lg-3">
                        <label> CNF Supplier</label>
                        <SearchAsyncSelect
                          selectedValue={values.cnfSupplier}
                          handleChange={(valueOption) => {
                            setFieldValue('cnfSupplier', valueOption);
                          }}
                          loadOptions={(v) => {
                            if (v.length < 3) return [];
                            return axios
                              .get(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${buId}&SBUId=${0}`
                              )
                              .then((res) => {
                                const updateList = res?.data.map((item) => ({
                                  ...item,
                                }));
                                return updateList;
                              });
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="cnfSupplier"
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label> Freight Forwarder</label>
                        <SearchAsyncSelect
                          selectedValue={values.freightForwarder}
                          handleChange={(valueOption) => {
                            setFieldValue('freightForwarder', valueOption);
                          }}
                          loadOptions={(v) => {
                            if (v.length < 3) return [];
                            return axios
                              .get(
                                `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accountId}&UnitId=${buId}&SBUId=${0}`
                              )
                              .then((res) => {
                                const updateList = res?.data.map((item) => ({
                                  ...item,
                                }));
                                return updateList;
                              });
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="freightForwarder"
                          touched={touched}
                        />
                      </div>

                      {/* <div className="col-lg-12"></div> */}
                      <div
                        className={
                          values?.Vehicle?.isRental
                            ? 'col-lg-9 d-flex justify-content-between align-items-center'
                            : 'col-lg-11 d-flex justify-content-between align-items-center'
                        }
                        style={{ marginTop: '10px' }}
                      >
                        <div>
                          <b className="mr-2">
                            Vehicle Capacity : &nbsp;
                            {rowDto?.length
                              ? values?.unloadVehicleWeight ||
                                vehicleSingleData?.weight
                              : 0}
                            &nbsp; Ton,
                          </b>
                          <b>
                            {/* Volume Capacity : */}
                            {rowDto?.length
                              ? values.itemTotalNetWeight ||
                                // deliveryItemVolumeInfo.netWeight
                                vehicleSingleData?.volume
                              : 0}
                            &nbsp; CFT
                          </b>
                        </div>

                        <div>
                          <b className="mr-2">
                            Product Actual : &nbsp;
                            {rowDto?.length
                              ? values?.unloadVehicleVolume ||
                                // vehicleSingleData?.volume
                                rowDto
                                  .map((itm) => itm?.itemTotalGrowssWeight)
                                  .reduce((sum, curr) => {
                                    return (sum += curr);
                                  }, 0)
                              : 0}
                            &nbsp; Ton,
                          </b>
                          <b>
                            {rowDto?.length &&
                              rowDto
                                .map((itm) => itm?.itemTotalVolume)
                                .reduce((sum, curr) => {
                                  return (sum += curr);
                                }, 0)}
                            &nbsp; CFT
                          </b>
                        </div>

                        <div>
                          <b>Total Number Of Challan : {rowDto?.length}</b>{' '}
                        </div>
                        <div>
                          <b>
                            Total Quantity :{' '}
                            {rowDto?.reduce((acc, cur) => {
                              return acc + Number(cur?.quantity);
                            }, 0)}
                          </b>{' '}
                        </div>
                        {buId === 4 && (
                          <div>
                            <b>Request Vehicle No : {vehicleNo}</b>{' '}
                          </div>
                        )}
                      </div>

                      {!isEdit && (
                        <div className="col d-flex justify-content-end align-items-center">
                          <button
                            type="button"
                            className="btn btn-primary mt-2"
                            onClick={() => addBtnHandler(values, setFieldValue)}
                            disabled={
                              !values.pendingDelivery ||
                              !values.shipPoint ||
                              !values.loadingPoint
                            }
                          >
                            Add
                          </button>
                        </div>
                      )}
                      <div className="col-12 mt-3">
                        <p>
                          <strong>Narration: </strong>{' '}
                          <mark style={{ backgroundColor: 'yellow' }}>
                            {transportStatus[0]?.label}
                          </mark>{' '}
                          {[171, 224].includes(buId) && (
                            <>
                              , <strong> Unload by Company: </strong>{' '}
                              {transportStatus[0]?.labourstatus
                                ? 'Yes'
                                : 'No'}{' '}
                            </>
                          )}
                        </p>
                      </div>
                    </>
                  </div>
                </div>
              </div>
              <hr className="m-1"></hr>

              <div className="row cash_journal bank-journal bank-journal-custom">
                <div className="col-lg-12 pr-0 pl-0">
                  {rowDto?.length >= 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-1 bj-table bj-table-landing sales_order_landing_table">
                        <thead>
                          <tr>
                            <th style={{ width: '35px' }}>SL</th>
                            <th>Delivery Id</th>
                            <th>Delivery No</th>
                            <th>Ship To Party Name</th>
                            <th>Ship To Address</th>
                            <th>Transport Zone</th>
                            <th>Loading Point</th>
                            <th>Quantity</th>
                            <th>Net (KG)</th>
                            <th>Vol (CFT)</th>
                            {!isEdit && <th>Action</th>}
                          </tr>
                        </thead>
                        <tbody>
                          {rowDto.map((itm, index) => (
                            <tr key={index}>
                              <td className="text-center">{++index}</td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm.deliveryId}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm.deliveryCode}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.shipToPartnerName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.shipToPartnerAddress}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.transportZoneName}
                                </div>
                              </td>
                              <td>
                                <div className="pl-2">
                                  {itm.loadingPointName}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm?.quantity}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm?.itemTotalNetWeight}
                                </div>
                              </td>
                              <td>
                                <div className="text-right pr-2">
                                  {itm?.itemTotalVolume}
                                </div>
                              </td>
                              {!isEdit && (
                                <td className="text-center">
                                  <i
                                    className="fa fa-trash"
                                    onClick={() =>
                                      remover(--index, setFieldValue)
                                    }
                                  ></i>
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
              <IViewModal
                modelSize="md"
                title="Challan Items Preview"
                show={open}
                onHide={() => setOpen(false)}
              >
                <ChallanItemsPreview rowData={previewItems} />
              </IViewModal>
              {QRCodeScannerModal && (
                <>
                  <IViewModal
                    show={QRCodeScannerModal}
                    onHide={() => {
                      setQRCodeScannerModal(false);
                    }}
                  >
                    <QRCodeScanner
                      QrCodeScannerCB={(result) => {
                        setFieldValue('strCardNo', result);
                        setQRCodeScannerModal(false);
                        qurScanHandler({
                          setFieldValue,
                          values: {
                            ...values,
                            strCardNo: result,
                          },
                        });
                      }}
                    />
                  </IViewModal>
                </>
              )}
              <button
                // type="submit"
                type="button"
                style={{ display: 'none' }}
                ref={btnRef}
                // onSubmit={() => handleSubmit()}
                onClick={() => handleSubmit()}
              ></button>
              <button
                type="reset"
                style={{ display: 'none' }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
