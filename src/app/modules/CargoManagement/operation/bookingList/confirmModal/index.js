import _ from "lodash";
import { Form, Formik } from 'formik';
import moment from 'moment';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPut from '../../../../_helper/customHooks/useAxiosPut';
import './style.css';
import SearchAsyncSelect from '../../../../_helper/SearchAsyncSelect';
import axios from 'axios';
const validationSchema = Yup.object().shape({
  // bookingAmount: Yup.number().required('Booking Amount is required'),
  // airWaybillNumber: Yup.string().required("This field is required"),
  departureDateTime: Yup.date().required('Departure Date & Time is required'),
  arrivalDateTime: Yup.date().required('Arrival Date & Time is required'),
  flightNumber: Yup.string().required('This field is required'),

  transitInformation: Yup.object()
    .shape({
      value: Yup.number(),
      label: Yup.string(),
    })
    .nullable()
    .when('transportPlanningType', {
      is: 'Sea',
      then: (schema) => schema.notRequired(),
      otherwise: (schema) =>
        schema
          .shape({
            value: Yup.number().required('Transit Information is required'),
            label: Yup.string().required('Transit Information is required'),
          })
          .typeError('Transit Information is required'),
    }),
  confTransportMode: Yup.object()
    .shape({
      value: Yup.number().required('Transport Mode is required'),
      label: Yup.string().required('Transport Mode is required'),
    })
    .nullable()
    .typeError('Transport Mode is required'),

  // Consignee Information
  consigneeName: Yup.object().shape({
    value: Yup.number().required('Consignee’s Name is required'),
    label: Yup.string().required('Consignee’s Name is required'),
  }),
  consigneeCountry: Yup.object().shape({
    value: Yup.number().required('Country is required'),
    label: Yup.string().required('Country is required'),
  }),
  consigneeDivisionAndState: Yup.object().shape({
    value: Yup.number().required('State/Province/Region is required'),
    label: Yup.string().required('State/Province/Region is required'),
  }),
  consignCity: Yup.object().shape({
    value: Yup.number().required('City is required'),
    label: Yup.string().required('City is required'),
  }),
  consignPostalCode: Yup.string().required('Zip/Postal Code is required'),
  consigneeAddress: Yup.string().required(
    'State/Province & Postal Code is required',
  ),
  consigneeContactPerson: Yup.string().required('Contact Person is required'),
  consigneeContact: Yup.number().required('Contact Number is required'),
  consigneeEmail: Yup.string()
    .email('Email is invalid')
    .required('Email is required'),
  notifyParty: Yup.object().shape({
    value: Yup.number().required('Notify Party is required'),
    label: Yup.string().required('Notify Party is required'),
  }),
  negotiationParty: Yup.string().required('Negotiation Party is required'),
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
  const bookingRequestId = rowClickData?.bookingRequestId;
  const [, SaveBookingConfirm, bookingConfirmLoading, ,] = useAxiosPut();
  const [transportModeDDL, setTransportModeDDL] = useAxiosGet();
  const [
    shipBookingRequestGetById,
    setShipBookingRequestGetById,
    shipBookingRequestLoading,
  ] = useAxiosGet();

  const [
    consigneeNameList,
    getConsigneeName,
    ,
    setConsigneeName,
  ] = useAxiosGet();
  const [
    deliveryAgentDDL,
    getDeliveryAgentDDL,
    ,
    setDeliveryAgentDDL,
  ] = useAxiosGet();
  const formikRef = React.useRef(null);

  const [consigneeCountryList, getConsigneeCountryList] = useAxiosGet();
  const [notifyPartyDDL, GetNotifyPartyDDL, , setNotifyParty] = useAxiosGet();
  const [stateDDL, setStateDDL] = useAxiosGet();
  const [cityDDL, setCityDDL] = useAxiosGet();

  const debouncedGetCityList = _.debounce((value) => {
    setCityDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousCityDDL?search=${value}`
    );
  }, 300);

  const debouncedGetStateList = _.debounce((value) => {
    setStateDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousStateDDL?search=${value}`
    );
  }, 300);
  useEffect(() => {
    if (bookingRequestId) {
      setShipBookingRequestGetById(
        `${imarineBaseUrl}/domain/ShippingService/ShipBookingRequestGetById?BookingId=${bookingRequestId}`,
        (resData) => {
          if (formikRef.current) {
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
              data?.consigStateId
                ? {
                  value: data?.consigStateId || 0,
                  label: data?.consigState || '',
                }
                : '',
            );
            formikRef.current.setFieldValue(
              'consigneeAddress',
              data?.consigneeAddress || '',
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
              'notifyParty',
              data?.notifyParty
                ? {
                  value: 0,
                  label: data?.notifyParty || '',
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
                  value: 0,
                  label: data?.freightAgentReference || '',
                }
                : '',
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
          }
        },
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingRequestId]);

  useEffect(() => {
    setTransportModeDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetModeOfTypeListDDL?categoryId=${4}`,
    );
    getConsigneeName(
      `${imarineBaseUrl}/domain/ShippingService/GetShipperPartnerDDL`,
      (redData) => {
        console.log(redData, 'redData');
        const modifyList =
          redData?.map((i) => {
            return {
              ...i,
              label: i?.valueName || '',
              value: i?.code || 0,
              email: i?.email || '',
              address: i?.address || '',
              contactPerson: i?.contactPerson || '',
              contactNumber: i?.contactNumber || '',
            };
          }) || [];
        const setConsigneeListFilter =
          modifyList?.filter((i) => i?.partnerTypeId === 15) || [];
        setConsigneeName(setConsigneeListFilter);
      },
    );

    getConsigneeCountryList(
      `${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`,
    );

    GetNotifyPartyDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetNotifyPartyDDL`,
      (resData) => {
        const modifyData =
          resData?.map((i) => {
            return {
              ...i,
              label: i?.valueName || '',
              value: i?.code || 0,
            };
          }) || [];
        setNotifyParty(modifyData);
      },
    );
    getDeliveryAgentDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetDeliveryAgentDDL`,
      (resData) => {
        const modifyData =
          resData?.map((i) => {
            return {
              ...i,
              label: i?.valueName || '',
              value: i?.code || 0,
            };
          }) || [];
        setDeliveryAgentDDL(modifyData);
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bookingData = shipBookingRequestGetById || {};


  const saveHandler = (values, cb) => {
    const payload = {
      bookingRequestId: bookingRequestId || 0,
      departureDateTime:
        moment(values?.departureDateTime).format('YYYY-MM-DDTHH:mm:ss') ||
        new Date(),
      arrivalDateTime:
        moment(values?.arrivalDateTime).format('YYYY-MM-DDTHH:mm:ss') ||
        new Date(),
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

      // Consignee Information
      freightAgentReference: values?.freightAgentReference?.label || '',
      consigneeId: values?.consigneeName?.value || 0,
      consigneeName: values?.consigneeName?.label || '',
      consigneeAddress: values?.consigneeAddress || '',
      consigneeContactPerson: values?.consigneeContactPerson || '',
      consigneeContact: values?.consigneeContact || '',
      consigneeEmail: values?.consigneeEmail || '',
      consigCountryId: values?.consigneeCountry?.value || 0,
      consigCountry: values?.consigneeCountry?.label || '',
      consigStateId: values?.consigneeDivisionAndState?.value || 0,
      consigState: values?.consigneeDivisionAndState?.label || '',
      notifyParty: values?.notifyParty?.label || '',
      negotiationParty: values?.negotiationParty || '',
      userId: rowClickData?.createdBy || 0,
      confirmBy: profileData?.userId,
      shipperId: rowClickData?.shipperId || 0,
      consignCity: values?.consignCity?.label || '',
      consignPostalCode: values?.consignPostalCode || '',
    };

    if (payload) {
      SaveBookingConfirm(
        `${imarineBaseUrl}/domain/ShippingService/SaveBookingConfirm`,
        payload,
        CB,
      );
    }
  };

  const loadEmp = (v) => {
    if (v?.length < 2) return [];
    return axios
      .get(
        `/hcm/HCMDDL/EmployeeInfoDDLSearch?AccountId=${profileData?.accountId
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

          // Consignee Information
          consigneeName: '',
          consigneeCountry: '',
          consigneeDivisionAndState: '',
          consigneeAddress: '',
          consigneeContactPerson: '',
          consigneeContact: '',
          consigneeEmail: '',
          notifyParty: '',
          negotiationParty: '',
          freightAgentReference: '',
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
                    type="datetime-local"
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
                    type="datetime-local"
                    onChange={(e) =>
                      setFieldValue('arrivalDateTime', e.target.value)
                    }
                  />
                </div>
                {/* Flight Number */}
                <div className="col-lg-3">
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
                </div>
                {/* Transit Information */}
                {values?.transportPlanningType !== 'Sea' && (
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
                )}
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
                <div className="col-lg-3">
                  <NewSelect
                    name="confTransportMode"
                    options={
                      transportModeDDL?.filter((item) => {
                        if (values?.transportPlanningType === 'Sea') {
                          return [17, 18].includes(item?.value);
                        } else {
                          return [19, 20].includes(item?.value);
                        }
                      }) || []
                    }
                    value={values?.confTransportMode}
                    label="Transport Mode"
                    onChange={(valueOption) => {
                      setFieldValue('confTransportMode', valueOption);
                    }}
                    placeholder="Transport Mode"
                    errors={errors}
                    touched={touched}
                  />
                </div>
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
                        label: valueOption?.label || "",
                      }
                      setFieldValue("consigneeDivisionAndState", value);

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
                  />
                </div>
                {/* Notify Party ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="notifyParty"
                    options={notifyPartyDDL || []}
                    value={values?.notifyParty}
                    label="Notify Party"
                    onChange={(valueOption) => {
                      setFieldValue('notifyParty', valueOption);
                    }}
                    placeholder="Notify Party"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Negotiation Party input */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.negotiationParty}
                    label="Negotiation Party"
                    name="negotiationParty"
                    type="text"
                    onChange={(e) =>
                      setFieldValue('negotiationParty', e.target.value)
                    }
                  />
                </div>
                {/* Delivery Agent ddl  */}
                <div className="col-lg-3">
                  <NewSelect
                    name="freightAgentReference"
                    options={deliveryAgentDDL || []}
                    value={values?.freightAgentReference}
                    label="Delivery Agent"
                    onChange={(valueOption) => {
                      setFieldValue('freightAgentReference', valueOption);
                    }}
                    placeholder="Delivery Agent"
                    errors={errors}
                    touched={touched}
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
