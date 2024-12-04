import { Divider } from '@material-ui/core';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../App';
import ICustomCard from '../../../_helper/_customCard';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import Loading from '../../../_helper/_loading';

const validationSchema = Yup.object().shape({
  participantType: Yup.object().shape({
    value: Yup.string().required('Type is required'),
  }),
  participantsName: Yup.string().required('This field is required'),
  country: Yup.object()
    .shape({
      value: Yup.string().required('Country is required'),
    })
    .nullable(),
  state: Yup.object()
    .shape({
      value: Yup.string().required('State is required'),
      label: Yup.string().required('State is required'),
    })
    .nullable(),
  city: Yup.object()
    .shape({
      value: Yup.string().required('City is required'),
      label: Yup.string().required('City is required'),
    })
    .nullable(),
  zipCode: Yup.string().required('Zip/Postal Code is required'),
  address: Yup.string().required('Address is required'),
  contactPerson: Yup.string().required('Contact Person is required'),
  contactNumber: Yup.string().required('Contact Number is required'),
  email: Yup.string()
    .email()
    .required('Email is required'),
});
function CreateBusinessPartner() {
  const history = useHistory();
  const { id } = useParams();
  const formikRef = React.useRef(null);
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [, SaveShippingParticipants, isLoading] = useAxiosPost();
  const [, setDeliveryAgentListById] = useAxiosGet();

  const [countryList, getCountryList] = useAxiosGet();
  const [stateDDL, setStateDDL] = useAxiosGet();
  const [cityDDL, setCityDDL] = useAxiosGet();
  const [
    participantTypeListDDL,
    GetParticipantTypeListDDL,
    ,
    setParticipantTypeList,
  ] = useAxiosGet();

  const saveHandler = (values, cb) => {
    const payload = {
      participantId: id || 0,
      participantCode: '',
      participantTypeId: values?.participantType?.value || 0,
      participantType: values?.participantType?.label || '',
      participantsName: values?.participantsName || '',
      companyName: values?.companyName || '',
      contactPerson: values?.contactPerson || '',
      contactNumber: values?.contactNumber || '',
      email: values?.email || '',
      countryId: values?.country?.value || 0,
      country: values?.country?.label || '',
      stateId: values?.state?.value || 0,
      state: values?.state?.label || '',
      cityId: values?.city?.value || 0,
      city: values?.city?.label || '',
      address: values?.address || '',
      zipCode: values?.zipCode || '',
      isActive: true,
      createdBy: userId,
      createdAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
    };
    console.log('payload', payload);
    SaveShippingParticipants(
      `${imarineBaseUrl}/domain/ShippingService/SaveShippingParticipants`,
      payload,
      () => {
        if (id) {
          history.push('/cargoManagement/configuration/assign');
        } else {
          cb();
        }
      },
      'post',
    );
  };
  React.useEffect(() => {
    if (!id) return;
    setDeliveryAgentListById(
      `${imarineBaseUrl}/domain/ShippingService/GetShippingParticipantsById?participantId=${id}`,
      (data) => {
        if (formikRef.current) {
          formikRef.current.setFieldValue(
            'participantType',
            data?.participantType
              ? {
                  value: data?.participantTypeId || 0,
                  label: data?.participantType || '',
                }
              : '',
          );
          formikRef.current.setFieldValue(
            'participantsName',
            data?.participantsName || '',
          );

          formikRef.current.setFieldValue(
            'contactPerson',
            data?.contactPerson || '',
          );
          formikRef.current.setFieldValue(
            'contactNumber',
            data?.contactNumber || '',
          );
          formikRef.current.setFieldValue('email', data?.email || '');
          formikRef.current.setFieldValue(
            'country',
            data?.country
              ? {
                  value: data?.countryId || 0,
                  label: data?.country || '',
                }
              : '',
          );
          formikRef.current.setFieldValue(
            'state',
            data?.state
              ? {
                  value: data?.stateId || 0,
                  label: data?.state || '',
                }
              : '',
          );
          formikRef.current.setFieldValue(
            'city',
            data?.city
              ? {
                  value: data?.cityId || 0,
                  label: data?.city || '',
                }
              : '',
          );
          formikRef.current.setFieldValue('zipCode', data?.zipCode || '');
          formikRef.current.setFieldValue('address', data?.address || '');
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    getCountryList(`${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`);
    GetParticipantTypeListDDL(
      `${imarineBaseUrl}/domain/ShippingService/GettblParticipantType`,
      (redData) => {
        const updatedData = redData?.filter((item) => item.value !== 4);
        setParticipantTypeList(updatedData);
      },
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
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
  return (
    <ICustomCard
      title={id ? 'Edit Consignee/Buyer Info' : 'Create Consignee/Buyer Info'}
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
      {isLoading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          participantType: '',
          participantsName: '',
          contactPerson: '',
          contactNumber: '',
          country: '',
          state: '',
          city: '',
          zipCode: '',
          email: '',
          address: '',
          companyName: '',
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
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    label="Type"
                    options={participantTypeListDDL || []}
                    name="participantType"
                    placeholder="Type"
                    value={values?.participantType}
                    onChange={(valueOption) => {
                      setFieldValue('participantType', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {values?.participantType?.label && (
                  <>
                    {' '}
                    <div className="col-lg-3">
                      <InputField
                        label={values?.participantType?.label}
                        placeholder={values?.participantType?.label}
                        type="text"
                        name="participantsName"
                        value={values?.participantsName}
                        onChange={(e) => {
                          setFieldValue('participantsName', e.target.value);
                        }}
                      />
                    </div>
                  </>
                )}

                {/* Country ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    name="country"
                    options={countryList || []}
                    value={values?.country}
                    label="Country"
                    onChange={(valueOption) => {
                      setFieldValue('country', valueOption);
                    }}
                    placeholder="Country"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* State/Province/Region ddl */}
                <div className="col-lg-3">
                  <NewSelect
                    options={stateDDL || []}
                    label="State/Province/Region"
                    placeholder="Select or Create New Option"
                    isCreatableSelect={true}
                    onInputChange={(inputValue) => {
                      debouncedGetStateList(inputValue);
                    }}
                    name="state"
                    value={values?.state}
                    onChange={(valueOption) => {
                      const obj = valueOption?.label
                        ? {
                            value: 0,
                            label: valueOption?.label || '',
                          }
                        : '';
                      setFieldValue('state', obj);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* city */}
                <div className="col-lg-3">
                  <NewSelect
                    options={cityDDL || []}
                    label="City"
                    placeholder="Select or Create New Option"
                    isCreatableSelect={true}
                    onInputChange={(inputValue) => {
                      debouncedGetCityList(inputValue);
                    }}
                    value={values?.city}
                    name="city"
                    onChange={(valueOption) => {
                      const obj = valueOption?.label
                        ? {
                            value: 0,
                            label: valueOption?.label || '',
                          }
                        : '';
                      setFieldValue('city', obj);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Zip/Postal Code */}
                <div className="col-lg-3">
                  <InputField
                    label="Zip/Postal Code"
                    type="number"
                    name="zipCode"
                    value={values?.zipCode}
                    onChange={(e) => {
                      setFieldValue('zipCode', e.target.value);
                    }}
                  />
                </div>
                {/*  Address */}
                <div className="col-lg-3">
                  <InputField
                    label="Address"
                    type="text"
                    name="address"
                    value={values?.address}
                    onChange={(e) => {
                      setFieldValue('address', e.target.value);
                    }}
                  />
                </div>
                {/* Contact Person */}
                <div className="col-lg-3">
                  <InputField
                    label="Contact Person"
                    type="text"
                    name="contactPerson"
                    value={values?.contactPerson}
                    onChange={(e) => {
                      setFieldValue('contactPerson', e.target.value);
                    }}
                  />
                </div>
                {/* Contact Number  */}
                <div className="col-lg-3">
                  <InputField
                    label="Contact Number"
                    type="number"
                    name="contactNumber"
                    value={values?.contactNumber}
                    onChange={(e) => {
                      setFieldValue('contactNumber', e.target.value);
                    }}
                  />
                </div>
                {/* Email */}
                <div className="col-lg-3">
                  <InputField
                    label="Email"
                    type="email"
                    name="email"
                    value={values?.email}
                    onChange={(e) => {
                      setFieldValue('email', e.target.value);
                    }}
                  />
                </div>
              </div>
              <Divider />
            </Form>
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default CreateBusinessPartner;
