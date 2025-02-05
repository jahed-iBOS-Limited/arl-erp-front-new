import axios from 'axios';
import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import FormikError from '../../../_helper/_formikError';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import SearchAsyncSelect from '../../../_helper/SearchAsyncSelect';
const INCOTERMS_OPTIONS = [
  { label: 'EXW', value: 'exw' },
  { label: 'FCA', value: 'fca' },
  { label: 'FOB', value: 'fob' },
  { label: 'CIF', value: 'cif' },
  { label: 'CPT', value: 'cpt' },
  { label: 'DAP', value: 'dap' },
  { label: 'DDP', value: 'ddp' },
  { label: 'CFR', value: 'cfr' },
  { label: 'DDU', value: 'ddu' },
  { label: 'Other', value: 'other' },
];
const initData = {
  // top section
  impExpType: 1,
  hblOrHawb: '',
  mblOrMawb: '',
  transportMode: '',
  carrier: '',
  customer: '',
  ffw: '',
  shipper: '',
  fclOrLcl: '',
  portOfReceive: '',
  consignee: '',
  incoterm: '',
  portOfLoading: '',
  thirdPartyPay: '',
  depoOrPlace: '',
  portOfDelivery: '',
  csSalesPic: '',
  commodity: '',
  placeOfDelivery: '',
  containerQty: '',
  currency: '',
  exchangeRate: '',
  // middle section
  copyDocReceived: '',
  invoiceValue: '',
  commercialInvoiceNo: '',
  invoiceDate: '',
  originCountry: '',
  assessed: '',
  assessedDate: '',
  exp: '',
  expDate: '',
  remarks: '',
  quantity: '',
  billOfEntry: '',
  billOfEntryDate: '',
  dischargingVesselNo: '',
  netWeight: '',
  grossWeight: '',
  volumetricWeight: '',
  etaDate: '',
  ataDate: '',
  cbmWeight: '',
  lcDate: '',
  lcNo: '',
};

const validationSchema = Yup.object().shape({
  hblOrHawb: Yup.string().required('HBL/HAWB is required'),
  transportMode: Yup.object().shape({
    value: Yup.string().required('Transport Mode is required'),
  }),
  customer: Yup.object().shape({
    value: Yup.string().required('Customer is required'),
  }),
  fclOrLcl: Yup.object().shape({
    value: Yup.string().required('FCL/LCL is required'),
  }),
  commodity: Yup.object().shape({
    value: Yup.string().required('Commodity is required'),
  }),
  // containerQty: Yup.number().required("Container Quantity is required"),
  currency: Yup.object().shape({
    value: Yup.string().required('Currency is required'),
  }),
  copyDocReceived: Yup.string().required('Copy Doc Received is required'),
  invoiceValue: Yup.number().required('Invoice Value is required'),
  commercialInvoiceNo: Yup.string().required(
    'Commercial Invoice No is required',
  ),
  invoiceDate: Yup.string().required('Invoice Date is required'),
  exp: Yup.string().required('EXP is required'),
  // etaDate: Yup.string().required("ETA Date is required"),
  grossWeight: Yup.number().required('Gross Weight is required'),
  // ataDate: Yup.string().required("ATA Date is required"),
});
function CreateChaShipmentBooking() {
  const formikRef = React.useRef(null);
  const [
    ,
    SaveOrUpdateChaShipmentBooking,
    saveOrUpdateChaShipmentLoading,
    ,
  ] = useAxiosPost();
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const [
    airServiceProviderDDLData,
    getAirServiceProviderDDL,
    ,
    setAirServiceProviderDDL,
  ] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();
  const [commodityDDL, getCommodityDDL] = useAxiosGet();
  const [consigneeCountryList, getConsigneeCountryList] = useAxiosGet();
  const [currencyList, GetBaseCurrencyList, , setCurrencyList] = useAxiosGet();
  const [
    singleChaShipmentBooking,
    getSingleChaShipmentBooking,
    singleChaShipmentBookingLoading,
  ] = useAxiosGet();
  const { id } = useParams();
  const history = useHistory();

  const saveHandler = (values, cb) => {
    const payload = {
      bookingId: singleChaShipmentBooking?.chabookingId || 0,
      accountId: profileData?.accountId,
      businessUnitId: selectedBusinessUnit?.value,
      hblNo: values?.hblOrHawb || '',
      mblNo: values?.mblOrMawb || '',
      hablNo: '',
      mawblNo: '',
      impExpId: values?.impExpType,
      impExp: values?.impExpType === 1 ? 'Export' : 'Import',
      carrierId: values?.carrier?.value || 0,
      carrierName: values?.carrier?.label || '',
      customerId: values?.customer?.value || 0,
      customerName: values?.customer?.label || '',
      modeOfTransportId: values?.transportMode?.value || 0,
      modeOfTransportName: values?.transportMode?.label || '',
      ffw: values?.ffw?.label || '',
      ffwId: 0,
      shipperId: 0,
      shipperName: values?.shipper?.label || '',
      consigneeId: 0,
      incotermId: 0,
      incotermName: values?.incoterm?.label || '',
      consignee: values?.consignee?.label || '',
      fcllclId: values?.fclOrLcl?.value || 0,
      fcllclName: values?.fclOrLcl?.label || '',
      portOfReceive: values?.portOfReceive?.label || '',
      portOfLoading: values?.portOfLoading?.label || '',
      portOfDelivery: values?.portOfDelivery?.label || '',
      placeOfDelivery: values?.placeOfDelivery || '',
      depoPlaceId: values?.depoOrPlace?.value || 0,
      depoPlaceName: values?.depoOrPlace?.label || '',
      commodityId: values?.commodity?.value || 0,
      commodityName: values?.commodity?.label || '',
      thirdPartyId: 0,
      thirdPartyName: values?.thirdPartyPay?.label || '',
      csSalesPic: values?.csSalesPic?.label || '',
      cssalesPicId: 0,
      containerQty: values?.containerQty || 0,
      copyDocReceived: values?.copyDocReceived || '',
      originCountryId: values?.originCountry?.value || 0,
      originCountry: values?.originCountry?.label || '',
      remarks: values?.remarks || '',
      dischargingVesselNo: values?.dischargingVesselNo || '',
      invoiceValue: values?.invoiceValue || '',
      commercialInvoiceNo: values?.commercialInvoiceNo || '',
      ...(values?.invoiceDate ? { invoiceDate: values?.invoiceDate } : {}),
      assessed: values?.assessed || '',
      ...(values?.assessedDate ? { assessedDate: values?.assessedDate } : {}),
      exporter: '',
      quantity: values?.quantity || 0,
      billOfEntry: values?.billOfEntry || '',
      ...(values?.billOfEntryDate
        ? { billOfEntryDate: values?.billOfEntryDate }
        : {}),
      grossWeight: values?.grossWeight || 0,
      cbmWeight: values?.cbmWeight || 0,
      netWeight: values?.netWeight || 0,
      volumetricWeight: values?.volumetricWeight || 0,
      exchangeRate: values?.exchangeRate || 0,
      exp: values?.exp || '',
      ...(values?.expDate ? { expDate: values?.expDate } : {}),
      currency: values?.currency?.label || '',
      ...(values?.etaDate ? { eta: values?.expDate } : {}),
      ...(values?.ataDate ? { ata: values?.ataDate } : {}),
      lcNo: values?.lcNo || '',
      ...(values?.lcDate ? { lcDate: values?.lcDate } : {}),
      isActive: true,
      createdBy: profileData?.userId,
      updatedAt: new Date(),
      createdAt: new Date(),
    };
    SaveOrUpdateChaShipmentBooking(
      `${imarineBaseUrl}/domain/CHAShipment/SaveOrUpdateCHAShipmentBooking`,
      payload,
      () => {
        if (id) {
        } else {
          cb();
        }
      },
      true,
    );
  };

  const transportModeHandelar = (typeId, tradeTypeId) => {
    // tradeTypeId  = 1 export
    if (tradeTypeId === 1) {
      getAirServiceProviderDDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?shipperId=${0}&participntTypeId=${typeId}`,
        (res) => {
          setAirServiceProviderDDL(res);
        },
      );
    }

    // tradeTypeId  = 2 import
    if (tradeTypeId === 2) {
      getAirServiceProviderDDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?consigneeId=${0}&participntTypeId=${typeId}`,
        (res) => {
          setAirServiceProviderDDL(res);
        },
      );
    }
  };

  useEffect(() => {
    getWarehouseDDL(`${imarineBaseUrl}/domain/ShippingService/GetWareHouseDDL`);
    getCommodityDDL(`${imarineBaseUrl}/domain/CHAShipment/GetCommodityDDL`);
    GetBaseCurrencyList(
      `${imarineBaseUrl}/domain/Purchase/GetBaseCurrencyList`,
      (res) => {
        const modifyData = res?.map((item) => {
          return {
            ...item,
            label: item?.code,
          };
        });
        setCurrencyList(modifyData);
      },
    );
    getConsigneeCountryList(
      `${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getSingleChaShipmentBooking(
        `${imarineBaseUrl}/domain/CHAShipment/GetChaShipmentBookingById?ChaShipmentbookingId=${id}`,
        (resData) => {
          const valuesObj = {
            // top section
            impExpType: resData?.impExpId,
            hblOrHawb: resData?.hblNo,
            mblOrMawb: resData?.mblNo,
            transportMode: resData?.modeOfTransportId
              ? {
                  value: resData?.modeOfTransportId,
                  label: resData?.modeOfTransportName,
                }
              : '',
            carrier: resData?.carrierName
              ? {
                  value: resData?.carrierId,
                  label: resData?.carrierName,
                }
              : '',
            customer: resData?.customerId
              ? {
                  value: resData?.customerId,
                  label: resData?.customerName,
                }
              : '',
            ffw: resData?.ffw
              ? {
                  value: resData?.ffw,
                  label: resData?.ffw,
                }
              : '',
            shipper: resData?.shipperName
              ? {
                  value: resData?.shipperId || 0,
                  label: resData?.shipperName,
                }
              : '',
            fclOrLcl: resData?.fcllclId
              ? {
                  value: resData?.fcllclId,
                  label: resData?.fcllclName,
                }
              : '',
            portOfReceive: resData?.portOfReceive
              ? {
                  value: resData?.portOfReceiveId || 0,
                  label: resData?.portOfReceive,
                }
              : '',
            consignee: resData?.consignee
              ? {
                  value: resData?.consigneeId,
                  label: resData?.consignee,
                }
              : '',
            incoterm: resData?.incotermName
              ? {
                  value: 0,
                  label: resData?.incotermName,
                }
              : '',
            portOfLoading: resData?.portOfLoading
              ? {
                  value: 1,
                  label: resData?.portOfLoading,
                }
              : '',
            thirdPartyPay: resData?.thirdPartyName
              ? {
                  value: resData?.thirdPartyId,
                  label: resData?.thirdPartyName,
                }
              : '',
            depoOrPlace: resData?.depoPlaceId
              ? {
                  value: resData?.depoPlaceId,
                  label: resData?.depoPlaceName,
                }
              : '',
            portOfDelivery: resData?.portOfDelivery
              ? {
                  value: resData?.portOfDeliveryId || 0,
                  label: resData?.portOfDelivery,
                }
              : '',
            csSalesPic: resData?.csSalesPic
              ? { value: resData?.cssalesPicId, label: resData?.csSalesPic }
              : '',
            commodity: resData?.commodityName
              ? {
                  value: resData?.commodityId || 0,
                  label: resData?.commodityName,
                }
              : '',
            placeOfDelivery: resData?.placeOfDelivery || '',
            containerQty: resData?.containerQty || '',
            currency: resData?.currency
              ? {
                  value: 0,
                  label: resData?.currency,
                }
              : '',
            exchangeRate: resData?.exchangeRate || '',
            // middle section

            copyDocReceived: resData?.copyDocReceived
              ? _dateFormatter(resData?.copyDocReceived)
              : '',
            invoiceValue: resData?.invoiceValue || '',
            commercialInvoiceNo: resData?.commercialInvoiceNo || '',
            invoiceDate: resData?.invoiceDate
              ? _dateFormatter(resData?.invoiceDate)
              : '',
            originCountry: resData?.originCountryId
              ? {
                  value: resData?.originCountryId,
                  label: resData?.originCountry,
                }
              : '',
            assessed: resData?.assessed || '',
            assessedDate: resData?.assessedDate
              ? _dateFormatter(resData?.assessedDate)
              : '',
            exp: resData?.exp || '',
            expDate: resData?.expDate ? _dateFormatter(resData?.expDate) : '',
            remarks: resData?.remarks || '',
            quantity: resData?.quantity || '',
            billOfEntry: resData?.billOfEntry || '',
            billOfEntryDate: resData?.billOfEntryDate
              ? _dateFormatter(resData?.billOfEntryDate)
              : '',
            dischargingVesselNo: resData?.dischargingVesselNo || '',
            netWeight: resData?.netWeight || '',
            grossWeight: resData?.grossWeight || '',
            volumetricWeight: resData?.volumetricWeight || '',
            etaDate: resData?.eta ? _dateFormatter(resData?.eta) : '',
            ataDate: resData?.ata ? _dateFormatter(resData?.ata) : '',
            cbmWeight: resData?.cbmWeight || '',
            lcDate: resData?.lcDate ? _dateFormatter(resData?.lcDate) : '',
            lcNo: resData?.lcNo || '',
          };

          formikRef.current.setValues(valuesObj);
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <ICustomCard
      title={id ? 'Edit CHA Shipment Booking' : 'Create CHA Shipment Booking'}
      backHandler={() => {
        history.goBack();
      }}
      saveHandler={(values) => {
        formikRef.current.submitForm();
      }}
      resetHandler={() => {
        formikRef.current.resetForm();
      }}
    >
      {/* {(bookingGlobalBankLoading || isLoading) && <Loading />} */}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
        innerRef={formikRef}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            {/* <h1>{JSON.stringify(errors)}</h1> */}
            {(saveOrUpdateChaShipmentLoading ||
              singleChaShipmentBookingLoading) && <Loading />}
            <Form className="form form-label-right">
              <div>
                <div className="form-group row global-form">
                  <div className="col-lg-12">
                    <div>
                      <label className="mr-3">
                        <input
                          type="radio"
                          name="impExpType"
                          checked={values?.impExpType === 1}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setFieldValue('impExpType', 1);
                          }}
                          disabled={id}
                        />
                        Export
                      </label>
                      <label>
                        <input
                          type="radio"
                          name="impExpType"
                          checked={values?.impExpType === 2}
                          className="mr-1 pointer"
                          style={{ position: 'relative', top: '2px' }}
                          onChange={(e) => {
                            setFieldValue('impExpType', 2);
                          }}
                          disabled={id}
                        />
                        Import
                      </label>
                    </div>
                  </div>

                  {/* HBL/HAWB input */}
                  <div className="col-lg-3">
                    <InputField
                      label="HBL/HAWB"
                      type="text"
                      name="hblOrHawb"
                      value={values?.hblOrHawb}
                      onChange={(e) => {
                        setFieldValue('hblOrHawb', e.target.value);
                      }}
                    />
                  </div>

                  {/* MBL/MAWB */}
                  <div className="col-lg-3">
                    <InputField
                      label="MBL/MAWB"
                      type="text"
                      name="mblOrMawb"
                      value={values?.mblOrMawb}
                      onChange={(e) => {
                        setFieldValue('mblOrMawb', e.target.value);
                      }}
                    />
                  </div>

                  {/* Transport Mode */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={'Transport Mode'}
                      options={[
                        {
                          value: 1,
                          label: 'Air',
                        },
                        {
                          value: 2,
                          label: 'Sea',
                        },
                        {
                          value: 3,
                          label: 'Land',
                        },
                      ]}
                      value={values?.transportMode}
                      name="transportMode"
                      onChange={(valueOption) => {
                        setFieldValue('transportMode', valueOption || '');
                        setFieldValue('carrier', '');
                        setFieldValue('containerQty', '');
                        const typeId = valueOption?.label === 'Air' ? 6 : 5;
                        if ([1, 2].includes(valueOption?.value)) {
                          transportModeHandelar(typeId, values?.impExpType);
                        }
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={id}
                    />
                  </div>

                  {[1, 2].includes(values?.transportMode?.value) && (
                    <>
                      {' '}
                      {/* Carrier */}
                      <div className="col-lg-3">
                        <NewSelect
                          isCreatableSelect={true}
                          placeholder=" "
                          label={'Carrier'}
                          options={airServiceProviderDDLData || []}
                          value={values?.carrier}
                          name="carrier"
                          onChange={(valueOption) => {
                            setFieldValue('carrier', valueOption || '');
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}

                  {[3].includes(values?.transportMode?.value) && (
                    <>
                      <div className="col-lg-3">
                        <InputField
                          label="Carrier"
                          type="text"
                          name="carrier"
                          value={values?.carrier?.label}
                          onChange={(e) => {
                            setFieldValue('carrier', { label: e.target.value });
                          }}
                        />
                      </div>
                    </>
                  )}

                  {/* Customer */}
                  <div className="col-lg-3">
                    <label>Customer</label>
                    <SearchAsyncSelect
                      selectedValue={values?.customer}
                      handleChange={(valueOption) => {
                        setFieldValue('customer', valueOption);
                      }}
                      placeholder="Select Customer"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/Stakeholder/GetBusinessPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                    />
                    <FormikError
                      errors={errors}
                      touched={touched}
                      name="customer"
                    />
                  </div>

                  {/* FFW */}
                  <div className="col-lg-3">
                    <label>FFW</label>
                    <SearchAsyncSelect
                      selectedValue={values?.ffw}
                      handleChange={(valueOption) => {
                        setFieldValue('ffw', valueOption);
                      }}
                      placeholder="Select ffw"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/CHAShipment/GetALLTypeChaShipmentCommonDDL?typeId=1&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                  {/* Shipper */}
                  <div className="col-lg-3">
                    <label>Shipper</label>
                    <SearchAsyncSelect
                      selectedValue={values?.shipper}
                      handleChange={(valueOption) => {
                        setFieldValue('shipper', valueOption);
                      }}
                      placeholder="Select Shipper"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/CHAShipment/GetALLTypeChaShipmentCommonDDL?typeId=2&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                  {/* FCL/LCL */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={'FCL/LCL'}
                      options={[
                        {
                          value: 1,
                          label: 'FCL',
                        },
                        {
                          value: 2,
                          label: 'LCL',
                        },
                      ]}
                      value={values?.fclOrLcl}
                      name="fclOrLcl"
                      onChange={(valueOption) => {
                        setFieldValue('fclOrLcl', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* POR */}
                  <div className="col-lg-3">
                    <label>Place of Receipt</label>
                    <SearchAsyncSelect
                      selectedValue={values?.portOfReceive}
                      handleChange={(valueOption) => {
                        setFieldValue('portOfReceive', valueOption);
                      }}
                      placeholder="Select Place of Receipt"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/CHAShipment/GetALLTypeChaShipmentCommonDDL?typeId=6&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                  {/* Consignee */}
                  <div className="col-lg-3">
                    <label>Consignee</label>
                    <SearchAsyncSelect
                      isCreatableSelect
                      selectedValue={values?.consignee}
                      handleChange={(valueOption) => {
                        setFieldValue('consignee', valueOption);
                      }}
                      placeholder="Select Consignee"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/CHAShipment/GetALLTypeChaShipmentCommonDDL?typeId=3&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>
                  {/* Incoterm */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={'Incoterm'}
                      options={INCOTERMS_OPTIONS || []}
                      value={values?.incoterm}
                      name="incoterm"
                      onChange={(valueOption) => {
                        setFieldValue('incoterm', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* POL */}
                  <div className="col-lg-3">
                    <label>Port of Loading</label>
                    <SearchAsyncSelect
                      selectedValue={values?.portOfLoading}
                      handleChange={(valueOption) => {
                        setFieldValue('portOfLoading', valueOption);
                      }}
                      placeholder="Select Port of Loading"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/CHAShipment/GetALLTypeChaShipmentCommonDDL?typeId=4&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                  {/* Third Party Pay */}
                  <div className="col-lg-3">
                    <label>Third Party Pay</label>
                    <SearchAsyncSelect
                      isCreatableSelect
                      selectedValue={values?.thirdPartyPay}
                      handleChange={(valueOption) => {
                        setFieldValue('thirdPartyPay', valueOption);
                      }}
                      placeholder="Select Third Party Pay"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/Stakeholder/GetBusinessPartnerDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Depo/Place */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={'Depo/Place'}
                      options={warehouseDDL || []}
                      value={values?.depoOrPlace}
                      name="depoOrPlace"
                      onChange={(valueOption) => {
                        setFieldValue('depoOrPlace', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* POD */}
                  <div className="col-lg-3">
                    <label>Port of Delivery</label>
                    <SearchAsyncSelect
                      selectedValue={values?.portOfDelivery}
                      handleChange={(valueOption) => {
                        setFieldValue('portOfDelivery', valueOption);
                      }}
                      placeholder="Select Port of Delivery"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/CHAShipment/GetALLTypeChaShipmentCommonDDL?typeId=5&search=${searchValue}`,
                          )
                          .then((res) => res?.data);
                      }}
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                  {/* CS/Sales PIC */}
                  <div className="col-lg-3">
                    <label>CS/Sales PIC</label>
                    <SearchAsyncSelect
                      isCreatableSelect
                      selectedValue={values?.csSalesPic}
                      handleChange={(valueOption) => {
                        setFieldValue('csSalesPic', valueOption);
                      }}
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        return axios
                          .get(
                            `/domain/CreateUser/GetUserListSearchDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`,
                          )
                          .then((res) => {
                            const updateList = res?.data.map((item) => ({
                              ...item,
                              label: item?.label + ` [${item?.value}]`,
                            }));
                            return updateList;
                          });
                      }}
                      placeholder="Select CS/Sales PIC"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* Commodity */}
                  <div className="col-lg-3">
                    <NewSelect
                      label="Commodity"
                      options={commodityDDL || []}
                      name="commodity"
                      value={values?.commodity}
                      onChange={(valueOption) => {
                        const modifyData = {
                          value: 0,
                          label: valueOption?.label || '',
                        };
                        setFieldValue('commodity', modifyData);
                      }}
                      placeholder="Commodity Name"
                      errors={errors}
                      touched={touched}
                      isCreatableSelect={true}
                    />
                  </div>
                  {/* DEL */}
                  <div className="col-lg-3">
                    <InputField
                      label="DEL"
                      type="text"
                      name="placeOfDelivery"
                      value={values?.placeOfDelivery}
                      onChange={(e) => {
                        setFieldValue('placeOfDelivery', e.target.value);
                      }}
                      placeholder="Place of Delivery"
                    />
                  </div>
                  {[2].includes(values?.transportMode?.value) && (
                    <>
                      {/* Container Qty */}
                      <div className="col-lg-3">
                        <InputField
                          label="Container quantity"
                          type="number"
                          name="containerQty"
                          value={values?.containerQty}
                          onChange={(e) => {
                            setFieldValue('containerQty', e.target.value);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    </>
                  )}

                  {/* curency DDl */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={'Currency'}
                      options={currencyList || []}
                      value={values?.currency}
                      name="currency"
                      onChange={(valueOption) => {
                        setFieldValue('currency', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {/* Exchange Rate Input */}
                  <div className="col-lg-3">
                    <InputField
                      label="Exchange  Rate"
                      type="number"
                      name="exchangeRate"
                      value={values?.exchangeRate}
                      onChange={(e) => {
                        setFieldValue('exchangeRate', e.target.value);
                      }}
                    />
                  </div>

                  <div className="col-lg-12">
                    <hr />
                  </div>
                  {/* Copy Doc Rcv */}
                  <div className="col-lg-3">
                    <InputField
                      label="Copy Doc RCV"
                      type="date"
                      name="copyDocReceived"
                      value={values?.copyDocReceived}
                      onChange={(e) => {
                        setFieldValue('copyDocReceived', e.target.value);
                      }}
                    />
                  </div>
                  {/* Inv Value */}
                  <div className="col-lg-3">
                    <InputField
                      label="Invoice Value"
                      type="number"
                      name="invoiceValue"
                      value={values?.invoiceValue}
                      onChange={(e) => {
                        setFieldValue('invoiceValue', e.target.value);
                      }}
                    />
                  </div>

                  {/* Com Invoice */}
                  <div className="col-lg-3">
                    <InputField
                      label="Com. Invoice No"
                      type="text"
                      name="commercialInvoiceNo"
                      value={values?.commercialInvoiceNo}
                      onChange={(e) => {
                        setFieldValue('commercialInvoiceNo', e.target.value);
                      }}
                    />
                  </div>
                  {/* Com Invoice Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Invoice Date"
                      type="date"
                      name="invoiceDate"
                      value={values?.invoiceDate}
                      onChange={(e) => {
                        setFieldValue('invoiceDate', e.target.value);
                      }}
                    />
                  </div>
                  {/* Origin Country */}
                  <div className="col-lg-3">
                    <NewSelect
                      placeholder=" "
                      label={'Origin Country'}
                      options={consigneeCountryList || []}
                      value={values?.originCountry}
                      name="originCountry"
                      onChange={(valueOption) => {
                        setFieldValue('originCountry', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  {/* Assessed */}
                  <div className="col-lg-3">
                    <InputField
                      label="Assessed Value"
                      type="text"
                      name="assessed"
                      value={values?.assessed}
                      onChange={(e) => {
                        setFieldValue('assessed', e.target.value);
                      }}
                    />
                  </div>
                  {/* Assessed Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Assessed Date"
                      type="date"
                      name="assessedDate"
                      value={values?.assessedDate}
                      onChange={(e) => {
                        setFieldValue('assessedDate', e.target.value);
                      }}
                    />
                  </div>

                  {/* Exp */}
                  <div className="col-lg-3">
                    <InputField
                      label={values?.impExpType === 2 ? 'IP' : 'EXP'}
                      type="text"
                      name="exp"
                      value={values?.exp}
                      onChange={(e) => {
                        setFieldValue('exp', e.target.value);
                      }}
                    />
                  </div>
                  {/* Exp Date */}
                  <div className="col-lg-3">
                    <InputField
                      label={values?.impExpType === 2 ? 'IP Date' : 'EXP Date'}
                      type="date"
                      name="expDate"
                      value={values?.expDate}
                      onChange={(e) => {
                        setFieldValue('expDate', e.target.value);
                      }}
                    />
                  </div>

                  {/* Remarks */}
                  <div className="col-lg-3">
                    <InputField
                      label="Remarks"
                      type="text"
                      name="remarks"
                      value={values?.remarks}
                      onChange={(e) => {
                        setFieldValue('remarks', e.target.value);
                      }}
                    />
                  </div>
                  {/* Quantity */}
                  <div className="col-lg-3">
                    <InputField
                      label="Quantity"
                      type="text"
                      name="quantity"
                      value={values?.quantity}
                      onChange={(e) => {
                        setFieldValue('quantity', e.target.value);
                      }}
                    />
                  </div>
                  {/* Bill of E */}
                  <div className="col-lg-3">
                    <InputField
                      label="Bill of /E"
                      type="text"
                      name="billOfEntry"
                      value={values?.billOfEntry}
                      onChange={(e) => {
                        setFieldValue('billOfEntry', e.target.value);
                      }}
                    />
                  </div>
                  {/* Bill of E Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="Bill of /E Date"
                      type="date"
                      name="billOfEntryDate"
                      value={values?.billOfEntryDate}
                      onChange={(e) => {
                        setFieldValue('billOfEntryDate', e.target.value);
                      }}
                    />
                  </div>
                  {/* Dischargeing Vsl Name */}
                  <div className="col-lg-3">
                    <InputField
                      label="Dischargeing VSL"
                      type="text"
                      name="dischargingVesselNo"
                      value={values?.dischargingVesselNo}
                      onChange={(e) => {
                        setFieldValue('dischargingVesselNo', e.target.value);
                      }}
                      placeholder="Name & Voy"
                    />
                  </div>
                  {/* NW */}
                  <div className="col-lg-3">
                    <InputField
                      label="Net Weight"
                      type="number"
                      name="netWeight"
                      value={values?.netWeight}
                      onChange={(e) => {
                        setFieldValue('netWeight', e.target.value);
                      }}
                    />
                  </div>
                  {/* GW */}
                  <div className="col-lg-3">
                    <InputField
                      label="Gross Weight"
                      type="number"
                      name="grossWeight"
                      value={values?.grossWeight}
                      onChange={(e) => {
                        setFieldValue('grossWeight', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="Volumetric Weight"
                      type="number"
                      name="volumetricWeight"
                      value={values?.volumetricWeight}
                      onChange={(e) => {
                        setFieldValue('volumetricWeight', e.target.value);
                      }}
                    />
                  </div>

                  {/* ETA/ATA Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="ETA Date"
                      type="date"
                      name="etaDate"
                      value={values?.etaDate}
                      onChange={(e) => {
                        setFieldValue('etaDate', e.target.value);
                      }}
                    />
                  </div>
                  {/* ETA/ATA 2 Date */}
                  <div className="col-lg-3">
                    <InputField
                      label={`ATA Date`}
                      type="date"
                      name="ataDate"
                      value={values?.ataDate}
                      onChange={(e) => {
                        setFieldValue('ataDate', e.target.value);
                      }}
                    />
                  </div>
                  {/* CBM */}
                  <div className="col-lg-3">
                    <InputField
                      label="CBM"
                      type="text"
                      name="cbmWeight"
                      value={values?.cbmWeight}
                      onChange={(e) => {
                        setFieldValue('cbmWeight', e.target.value);
                      }}
                    />
                  </div>

                  {/* Lc Date */}
                  <div className="col-lg-3">
                    <InputField
                      label="LC Date"
                      type="date"
                      name="lcDate"
                      value={values?.lcDate}
                      onChange={(e) => {
                        setFieldValue('lcDate', e.target.value);
                      }}
                    />
                  </div>

                  {/* Lc No */}
                  <div className="col-lg-3">
                    <InputField
                      label="LC No"
                      type="text"
                      name="lcNo"
                      value={values?.lcNo}
                      onChange={(e) => {
                        setFieldValue('lcNo', e.target.value);
                      }}
                    />
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default CreateChaShipmentBooking;
