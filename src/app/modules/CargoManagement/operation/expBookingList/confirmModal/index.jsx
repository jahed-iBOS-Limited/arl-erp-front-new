import axios from 'axios';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import './style.css';
const validationSchema = Yup.object().shape({
  departureDateTime: Yup.date().required('Departure Date & Time is required'),
  arrivalDateTime: Yup.date().required('Arrival Date & Time is required'),
  wareHouse: Yup.object()
    .shape({
      value: Yup.string().required('Warehouse is required'),
      label: Yup.string().required('Warehouse is required'),
    })
    .nullable()
    .typeError('Warehouse is required'),
  consigneeName: Yup.object().shape({
    value: Yup.number().required('Consignee’s Name is required'),
    label: Yup.string().required('Consignee’s Name is required'),
  }),
  consigneeEmail: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  notifyParty: Yup.object().shape({
    value: Yup.number().required('Notify Party is required'),
    label: Yup.string().required('Notify Party is required'),
  }),
  freightAgentReference: Yup.object().shape({
    value: Yup.number().required('Delivery Agent is required'),
    label: Yup.string().required('Delivery Agent is required'),
  }),
});
function ConfirmModal({ rowClickData, CB }) {
  const { profileData } = useSelector(
    (state) => state?.authData || {},
    shallowEqual,
  );
  const tradeTypeId = rowClickData?.tradeTypeId || 1;
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, SaveBookingConfirm, bookingConfirmLoading, ,] = useAxiosPut();
  // const [transportModeDDL, setTransportModeDDL] = useAxiosGet();
  const [buyerBankAddressDDL, setBuyerBankAddressDDL] = React.useState([]);
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();

  const [consigneeNameList, setConsigneeName] = React.useState();
  const [deliveryAgentDDL, setDeliveryAgentDDL] = React.useState([]);
  const [notifyPartyDDL, setNotifyParty] = React.useState([]);
  const formikRef = React.useRef(null);

  const [consigneeCountryList, getConsigneeCountryList] = useAxiosGet();
  const [getBankListDDL, setBankListDDL] = useAxiosGet();
  const [, setBlobalBankAddressDDL] = useAxiosGet();
  const [, GetParticipantsWithShipper] = useAxiosGet();
  const [stateDDL, setStateDDL] = useAxiosGet();
  const [cityDDL, setCityDDL] = useAxiosGet();
  const [warehouseDDL, getWarehouseDDL] = useAxiosGet();

  const getGlobalBankAddress = (id) => {
    setBuyerBankAddressDDL([]);
    if (!id) return;
    setBlobalBankAddressDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetBlobalBankAddressDDL?gBankId=${id}`,
      (data) => {
        // formikRef.current.setFieldValue('bankAddress', data?.primaryAddress || '');
        setBuyerBankAddressDDL(data);
      },
    );
  };

  const debouncedGetCityList = _.debounce((value) => {
    setCityDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousCityDDL?search=${value}`,
    );
  }, 300);

  const debouncedGetStateList = _.debounce((value) => {
    setStateDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousStateDDL?search=${value}`,
    );
  }, 300);

  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (resData) => {
          if (formikRef.current) {
            const tradeTypeId = rowClickData?.tradeTypeId || 1;
            // tradeType = 1  export
            if (tradeTypeId === 1) {
              consigneeOnChangeHandler(resData?.shipperId, tradeTypeId);
            }
            // tradeType = 2  import
            if (tradeTypeId === 2) {
              consigneeOnChangeHandler(resData?.consigneeId, tradeTypeId);
            }

            const data = resData || {};
            formikRef.current.setFieldValue(
              'transportPlanningType',
              data?.modeOfTransport,
            );

            //  consignee Information set value
            formikRef.current.setFieldValue(
              'consigneeName',
              data?.consigneeId
                ? {
                    value: data?.consigneeId || 0,
                    label: data?.consigneeName || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'consigneeCountry',
              data?.consigCountryId
                ? {
                    value: data?.consigCountryId || 0,
                    label: data?.consigCountry || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'consigneeDivisionAndState',
              data?.consigState
                ? {
                    value: 0,
                    label: data?.consigState || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'consigneeAddress',
              data?.consigneeAddress || '',
            );
            formikRef.current.setFieldValue(
              'consigneeAddress2',
              data?.buyerAddress2 || '',
            );
            formikRef.current.setFieldValue(
              'consigneeContactPerson',
              data?.consigneeContactPerson || '',
            );
            formikRef.current.setFieldValue(
              'consigneeContact',
              data?.consigneeContact || '',
            );
            formikRef.current.setFieldValue(
              'consigneeEmail',
              data?.consigneeEmail || '',
            );

            formikRef.current.setFieldValue(
              'bankAddress',
              data?.notifyBankAddr
                ? {
                    value: 0,
                    label: data?.notifyBankAddr || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'notifyParty',
              data?.notifyParty
                ? {
                    value: 0,
                    label: data?.notifyParty || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'buyerBank',
              data?.buyerBank
                ? {
                    value: 0,
                    label: data?.buyerBank || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'notifyParty2',
              data?.notifyParty2
                ? {
                    value: 0,
                    label: data?.notifyParty2 || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'negotiationParty',
              data?.negotiationParty || '',
            );
            formikRef.current.setFieldValue(
              'freightAgentReference',
              data?.freightAgentReference
                ? {
                    value: data?.freightAgentReferenceId || 0,
                    label: data?.freightAgentReference || '',
                  }
                : '',
            );
            formikRef.current.setFieldValue(
              'freightAgentReference2',
              data?.freightAgentReference2
                ? {
                    value: data?.freightAgentReferenceId2 || 0,
                    label: data?.freightAgentReference2 || '',
                  }
                : '',
            );
            //shippingMark
            formikRef.current.setFieldValue(
              'shippingMark',
              data?.shippingMark || data?.shippingMark || '',
            );
            formikRef.current.setFieldValue(
              'consignCity',
              data?.consignCity
                ? { value: 0, label: data?.consignCity || '' }
                : '',
            );
            formikRef.current.setFieldValue(
              'consignPostalCode',
              data?.consignPostalCode || '',
            );

            // placeOfReceive
            formikRef.current.setFieldValue(
              'placeOfReceive',
              data?.originAddress || '',
            );
          }
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  useEffect(() => {
    // setTransportModeDDL(
    //   `${imarineBaseUrl}/domain/ShippingService/GetModeOfTypeListDDL?categoryId=${4}`,
    // );
    setBankListDDL(`${imarineBaseUrl}/domain/ShippingService/GetBlobalBankDDL`);
    getConsigneeCountryList(
      `${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`,
    );
    getWarehouseDDL(`${imarineBaseUrl}/domain/ShippingService/GetWareHouseDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const consigneeOnChangeHandler = async (shipperOrConsigneeId) => {
    // if tradeType 1 = Export
    if (tradeTypeId === 1) {
      GetParticipantsWithShipper(
        `${imarineBaseUrl}/domain/ShippingService/GetParticipantsWithShipper?shipperId=${shipperOrConsigneeId}`,
        (data) => {
          if (data?.deliveryAgentList) {
            const modifyData = data?.deliveryAgentList?.map((i) => {
              return {
                ...i,
                label: i?.participantsName || '',
                value: i?.participantId || 0,
              };
            });
            setDeliveryAgentDDL(modifyData || []);
          }
          if (data?.notifyPartyList) {
            const modifyData = data?.notifyPartyList?.map((i) => {
              return {
                ...i,
                label: i?.participantsName || '',
                value: i?.participantId || 0,
              };
            });
            setNotifyParty(modifyData || []);
          }
          if (data?.consineList) {
            const modifyData = data?.consineList?.map((i) => {
              return {
                ...i,
                label: i?.participantsName || '',
                value: i?.participantId || 0,
              };
            });
            setConsigneeName(modifyData || []);
          }
        },
      );
    }

    // if tradeType 2 = Import
    if (tradeTypeId === 2) {
      GetParticipantsWithShipper(
        `${imarineBaseUrl}/domain/ShippingService/GetParticipantsWithConsignee?consigneeId=${shipperOrConsigneeId}`,
        (data) => {
          if (data?.deliveryAgentList) {
            const modifyData = data?.deliveryAgentList?.map((i) => {
              return {
                ...i,
                label: i?.participantsName || '',
                value: i?.participantId || 0,
              };
            });
            setDeliveryAgentDDL(modifyData || []);
          }
          if (data?.notifyPartyList) {
            const modifyData = data?.notifyPartyList?.map((i) => {
              return {
                ...i,
                label: i?.participantsName || '',
                value: i?.participantId || 0,
              };
            });
            setNotifyParty(modifyData || []);
          }
          if (data?.consineList) {
            const modifyData = data?.consineList?.map((i) => {
              return {
                ...i,
                label: i?.participantsName || '',
                value: i?.participantId || 0,
              };
            });
            setConsigneeName(modifyData || []);
          }
        },
      );
    }
  };

  const saveHandler = (values, cb) => {
    const payload = {
      bookingRequestId: bookingRequestId || 0,
      departureDateTime:
        moment(values?.departureDateTime).format('YYYY-MM-DD') || new Date(),
      arrivalDateTime:
        moment(values?.arrivalDateTime).format('YYYY-MM-DD') || new Date(),
      flightNumber: values?.flightNumber || '',
      transitInformation: values?.transitInformation?.label || '',
      awbnumber: values?.airWaybillNumber || '',
      bookingAmount: values?.bookingAmount || 0,
      primaryContactPerson: values?.freightForwarderRepresentative?.label || '',
      primaryContactPersonId:
        values?.freightForwarderRepresentative?.value || 0,
      concernSalesPerson: values?.concernSalesPerson?.label || '',
      concernSalesPersonId: values?.concernSalesPerson?.value || 0,
      isConfirm: true,
      confirmDate: new Date(),
      confTransportMode: values?.confTransportMode?.label || 0,
      warehouseName: values?.wareHouse?.label || '',
      warehouseId: values?.wareHouse?.value || 0,
      // Consignee Information
      freightAgentReference: values?.freightAgentReference?.label || '',
      freightAgentReferenceId: values?.freightAgentReference?.value || 0,
      freightAgentReference2: values?.freightAgentReference2?.label || '',
      freightAgentReferenceId2: values?.freightAgentReference2?.value || 0,
      shippingMark: values?.shippingMark || '',
      consigneeId: values?.consigneeName?.value || 0,
      consigneeName: values?.consigneeName?.label || '',
      consigneeAddress: values?.consigneeAddress || '',
      buyerAddress2: values?.consigneeAddress2 || '',
      consigneeContactPerson: values?.consigneeContactPerson || '',
      consigneeContact: values?.consigneeContact || '',
      consigneeEmail: values?.consigneeEmail || '',
      notifyBankAddr: values?.bankAddress.label || '',
      buyerBank: values?.buyerBank?.label || '',
      buyerBankId: values?.buyerBank?.value || 0,
      consigCountryId: values?.consigneeCountry?.value || 0,
      consigCountry: values?.consigneeCountry?.label || '',
      consigStateId: values?.consigneeDivisionAndState?.value || 0,
      consigState: values?.consigneeDivisionAndState?.label || '',
      notifyParty: values?.notifyParty?.label || '',
      notifyPartyId: values?.notifyParty?.value || 0,
      notifyParty2: values?.notifyParty2?.label || '',
      notifyParty2Id: values?.notifyParty2?.value || 0,
      negotiationParty: values?.negotiationParty || '',
      userId: rowClickData?.createdBy || 0,
      confirmBy: profileData?.userId,
      shipperId: shipBookingRequestGetById?.shipperId || 0,
      consignCity: values?.consignCity?.label || '',
      consignPostalCode: values?.consignPostalCode || '',
      tradeTypeId: tradeTypeId,
      hblNo: values?.hblNo || '',
    };
    // console.log(payload)
    // return

    if (payload) {
      SaveBookingConfirm(
        `${imarineBaseUrl}/domain/ShippingService/SaveBookingConfirm`,
        payload,
        () => {
          // createHblFcrNumberApiCall();
          CB();
        },
        'true',
      );
    }
  };

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${
          profileData?.accountId
        }&BusinessUnitId=${225}&Search=${v}`,
      )
      .then((res) => {
        return res?.data;
      });
  };
  return (
    <div className="confirmModal">
      {(bookingConfirmLoading || shipBookingRequestLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          bookingAmount: '',
          airWaybillNumber: '',
          departureDateTime: '',
          arrivalDateTime: '',
          flightNumber: '',
          transitInformation: '',
          freightForwarderRepresentative: '',
          concernSalesPerson: '',
          confTransportMode: '',
          wareHouse: '',
          hblNo: '',

          // Consignee Information
          consigneeName: '',
          consigneeCountry: '',
          consigneeDivisionAndState: '',
          consigneeAddress: '',
          consigneeAddress2: '',
          consigneeContactPerson: '',
          consigneeContact: '',
          consigneeEmail: '',
          bankAddress: '',
          buyerBank: '',
          notifyParty: '',
          notifyParty2: '',
          negotiationParty: '',
          freightAgentReference: '',
          freightAgentReference2: '',
          shippingMark: '',
        }}
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
            {console.log(values, 'values')}
            {console.log(errors, 'errors')}
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                {/*  Booking Amount*/}
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.bookingAmount}
                    label="Booking Amount"
                    name="bookingAmount"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('bookingAmount', e.target.value)
                    }
                  />
                </div> */}
                {/* Departure Date & Time */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.departureDateTime}
                    label="Departure Date & Time"
                    name="departureDateTime"
                    type="date"
                    onChange={(e) =>
                      setFieldValue('departureDateTime', e.target.value)
                    }
                  />
                </div>
                {/* Arrival Date & Time */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.arrivalDateTime}
                    label="Arrival Date & Time"
                    name="arrivalDateTime"
                    type="date"
                    onChange={(e) =>
                      setFieldValue('arrivalDateTime', e.target.value)
                    }
                  />
                </div>
                {/* Flight Number */}
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.flightNumber}
                    label={
                      values?.transportPlanningType === 'Sea'
                        ? 'SI Number'
                        : 'MAWB Number'
                    }
                    name="flightNumber"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('flightNumber', e.target.value)
                    }
                  />
                </div> */}
                {/* Transit Information */}
                {/* {values?.transportPlanningType !== 'Sea' && (
                  <>
                    {' '}
                    <div className="col-lg-3">
                      <NewSelect
                        name="transitInformation"
                        options={[
                          {
                            value: 1,
                            label: 'Direct Flight',
                          },
                          {
                            value: 2,
                            label: 'No Transits',
                          },
                        ]}
                        value={values?.transitInformation}
                        label="Transit Information"
                        onChange={(valueOption) => {
                          setFieldValue('transitInformation', valueOption);
                        }}
                        placeholder="Transit Information"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )} */}
                {/* freight forwarder representative */}
                <div className="col-lg-3">
                  <label>Freight Forwarder Representative</label>
                  <SearchAsyncSelect
                    selectedValue={values?.freightForwarderRepresentative}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue(
                        'freightForwarderRepresentative',
                        valueOption,
                      );
                    }}
                    loadOptions={loadEmp}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Concern Sales Person</label>
                  <SearchAsyncSelect
                    selectedValue={values?.concernSalesPerson}
                    isSearchIcon={true}
                    handleChange={(valueOption) => {
                      setFieldValue('concernSalesPerson', valueOption);
                    }}
                    loadOptions={loadEmp}
                  />
                </div>
                {/* Transport Mode */}
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="confTransportMode"
                    options={transportModeDDL}
                    value={values?.confTransportMode}
                    label="Transport Mode"
                    onChange={(valueOption) => {
                      setFieldValue('confTransportMode', valueOption);
                    }}
                    placeholder="Transport Mode"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {/* warehouse */}
                <div className="col-lg-3">
                  <NewSelect
                    name="wareHouse"
                    options={[...warehouseDDL]}
                    value={values?.wareHouse}
                    label="CNF"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue('wareHouse', valueOption);
                      } else {
                        setFieldValue('wareHouse', '');
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/*  Place Of Receive input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.placeOfReceive}
                    label="Place Of Receive"
                    name="placeOfReceive"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('placeOfReceive', e.target.value)
                    }
                    disabled
                  />
                </div>
                {tradeTypeId === 2 && (
                  <>
                    {/* hblNo */}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.hblNo || ''}
                        label="HBL No"
                        name="hblNo"
                        type="text"
                        onChange={(e) => {
                          setFieldValue('hblNo', e.target.value);
                        }}
                      />
                    </div>
                  </>
                )}

                <div className="col-lg-12">
                  <hr />
                  <h6>Consignee Information</h6>
                </div>
                {/* ====== Consignee Information======== */}
                {/* Consignee’s Name */}
                <div className="col-lg-3">
                  <NewSelect
                    name="consigneeName"
                    options={consigneeNameList || []}
                    value={values?.consigneeName}
                    label="Consignee’s Name"
                    onChange={(valueOption) => {
                      setFieldValue('consigneeName', valueOption);
                    }}
                    placeholder="Consignee’s Name"
                    errors={errors}
                    touched={touched}
                    isDisabled={tradeTypeId === 2}
                  />
                </div>
                {/* Country ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="consigneeCountry"
                    options={consigneeCountryList || []}
                    value={values?.consigneeCountry}
                    label="Country"
                    onChange={(valueOption) => {
                      setFieldValue('consigneeCountry', valueOption);
                      // setFieldValue("consigneeDivisionAndState", "");
                      // getConsigneeDivisionAndStateApi(valueOption?.value);
                    }}
                    placeholder="Country"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* State/Province/Region ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="consigneeDivisionAndState"
                    options={stateDDL || []}
                    value={values?.consigneeDivisionAndState}
                    label="State/Province/Region"
                    onChange={(valueOption) => {
                      let value = {
                        ...valueOption,
                        value: 0,
                        label: valueOption?.label || '',
                      };
                      setFieldValue('consigneeDivisionAndState', value);
                    }}
                    placeholder="Select or Create New Option"
                    errors={errors}
                    touched={touched}
                    isCreatableSelect={true}
                    onInputChange={(inputValue) => {
                      debouncedGetStateList(inputValue);
                    }}
                  />
                </div>
                {/* city */}
                <div className="col-lg-3">
                  <NewSelect
                    name="consignCity"
                    options={cityDDL || []}
                    value={values?.consignCity}
                    label="City"
                    onChange={(valueOption) => {
                      let value = {
                        ...valueOption,
                        value: 0,
                        label: valueOption?.label || '',
                      };
                      setFieldValue('consignCity', value);
                    }}
                    placeholder="Select or Create New Option"
                    errors={errors}
                    touched={touched}
                    isCreatableSelect={true}
                    onInputChange={(inputValue) => {
                      debouncedGetCityList(inputValue);
                    }}
                  />
                </div>
                {/* Zip/Postal Code */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.consignPostalCode}
                    label="Zip/Postal Code"
                    name="consignPostalCode"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('consignPostalCode', e.target.value)
                    }
                  />
                </div>
                {/*  consigneeAddress */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.consigneeAddress}
                    label="Address"
                    name="consigneeAddress"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('consigneeAddress', e.target.value)
                    }
                  />
                </div>
                {/*  consigneeAddress2 */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.consigneeAddress2}
                    label="Address 2"
                    name="consigneeAddress2"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('consigneeAddress2', e.target.value)
                    }
                  />
                </div>
                {/* Contact Person */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.consigneeContactPerson}
                    label="Contact Person"
                    name="consigneeContactPerson"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('consigneeContactPerson', e.target.value)
                    }
                  />
                </div>
                {/* Contact Number  */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.consigneeContact}
                    label="Contact Number"
                    name="consigneeContact"
                    type="number"
                    onChange={(e) =>
                      setFieldValue('consigneeContact', e.target.value)
                    }
                  />
                </div>
                {/* Email */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.consigneeEmail}
                    label="Email"
                    name="consigneeEmail"
                    type="email"
                    onChange={(e) =>
                      setFieldValue('consigneeEmail', e.target.value)
                    }
                    isDisabled={tradeTypeId === 2}
                  />
                </div>
                {/* Buyer Bank */}
                <div className="col-lg-3">
                  <NewSelect
                    name="buyerBank"
                    options={getBankListDDL || []}
                    value={values?.buyerBank}
                    label="Buyer Bank"
                    onChange={(valueOption) => {
                      setFieldValue('buyerBank', valueOption);
                      setFieldValue('bankAddress', '');
                      getGlobalBankAddress(valueOption?.value);
                    }}
                    placeholder="Buyer Bank"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/*bank Address*/}
                <div className="col-lg-3">
                  <NewSelect
                    name="bankAddress"
                    options={buyerBankAddressDDL || []}
                    value={values?.bankAddress}
                    label="Bank Address"
                    onChange={(valueOption) => {
                      setFieldValue('bankAddress', valueOption);
                    }}
                    placeholder="Bank Address"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Notify Party ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="notifyParty"
                    options={
                      notifyPartyDDL?.filter((i) => {
                        return i?.value !== (values?.notifyParty2?.value || 0);
                      }) || []
                    }
                    value={values?.notifyParty}
                    label="Notify Party"
                    onChange={(valueOption) => {
                      let valueOptionModify = {
                        ...valueOption,
                        label: valueOption?.label || '',
                      };
                      setFieldValue('notifyParty', valueOptionModify);
                    }}
                    placeholder="Notify Party"
                    errors={errors}
                    touched={touched}
                    isCreatableSelect={true}
                  />
                </div>
                {/* Notify Party 2 ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="notifyParty2"
                    options={
                      notifyPartyDDL?.filter((i) => {
                        return i?.value !== (values?.notifyParty?.value || 0);
                      }) || []
                    }
                    value={values?.notifyParty2}
                    label="Notify Party 2"
                    onChange={(valueOption) => {
                      let valueOptionModify = {
                        ...valueOption,
                        value: 0,
                        label: valueOption?.label || '',
                      };
                      setFieldValue('notifyParty2', valueOptionModify);
                    }}
                    placeholder="Notify Party 2"
                    errors={errors}
                    touched={touched}
                    isCreatableSelect={true}
                  />
                </div>
                {/* Negotiation Party input */}
                {/* <div className="col-lg-3">
                  <InputField
                    value={values?.negotiationParty}
                    label="Negotiation Party"
                    name="negotiationParty"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('negotiationParty', e.target.value)
                    }
                  />
                </div> */}
                {/* Delivery Agent ddl  */}
                <div className="col-lg-3">
                  <NewSelect
                    name="freightAgentReference"
                    options={deliveryAgentDDL || []}
                    value={values?.freightAgentReference}
                    label={
                      shipBookingRequestGetById?.modeOfTransportId === 3
                        ? 'Delivery Agent (Sea)'
                        : 'Delivery Agent'
                    }
                    onChange={(valueOption) => {
                      setFieldValue('freightAgentReference', valueOption);
                    }}
                    placeholder={
                      shipBookingRequestGetById?.modeOfTransportId === 3
                        ? 'Delivery Agent (Sea)'
                        : 'Delivery Agent'
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* Delivery Agent ddl2  */}
                {shipBookingRequestGetById?.modeOfTransportId === 3 && (
                  <div className="col-lg-3">
                    <NewSelect
                      name="freightAgentReference2"
                      options={deliveryAgentDDL || []}
                      value={values?.freightAgentReference2}
                      label="Delivery Agent (Air)"
                      onChange={(valueOption) => {
                        setFieldValue('freightAgentReference2', valueOption);
                      }}
                      placeholder="Delivery Agent (Air)"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {/* shipping Marks input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.shippingMark}
                    label="Shipping Marks"
                    name="shippingMark"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('shippingMark', e.target.value)
                    }
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default ConfirmModal;
