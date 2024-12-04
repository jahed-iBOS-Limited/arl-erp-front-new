import { Button, Divider } from '@material-ui/core';
import { Form, Formik } from 'formik';
import _ from 'lodash';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useHistory } from 'react-router-dom';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../App';
import ICustomCard from '../../../../_helper/_customCard';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
// import Loading from '../../../../_helper/_loading';

const validationSchema = Yup.object().shape({
  bankName: Yup.string().required('Bank Name is required'),
  primaryAddress: Yup.string().required('Primary Address is required'),
  country: Yup.string().required('Country is required'),
  city: Yup.string().required('City is required'),
  phoneNo: Yup.number().required('Phone No is required'),
  email: Yup.string()
    .required('Email is required')
    .email('Email is invalid'),
  website: Yup.string().url('Website is invalid'),
  currency: Yup.string().required('Currency is required'),
  swiftcode: Yup.string().required('Swift Code is required'),
});
function GlobalBankCreate() {
  const history = useHistory();
  const { id } = useParams();
  const formikRef = React.useRef(null);

  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [countryList, getCountryList] = useAxiosGet();
  const [cityDDL, setCityDDL] = useAxiosGet();
  const [, SaveGlobalBankConfirm, bookingGlobalBankLoading, ,] = useAxiosPost();
  const [, GetBankAddressById, isLoading] = useAxiosGet();
  const [currencyList, GetBaseCurrencyList, , setCurrencyList] = useAxiosGet();

  const saveHandler = (values, cb) => {
    // gbankAddress minimum  item required
    if (values?.gbankAddress?.length === 0)
      return toast.warn('At least one bank address is required');
    const payload = {
      bankId: id || 0,
      bankName: values?.bankName || '',
      primaryAddress: values?.primaryAddress || '',
      countryId: values?.country?.value || 0,
      country: values?.country?.label || '',
      city: values?.city?.label || '',
      phoneNo: values?.phoneNo || '',
      email: values?.email || '',
      website: values?.website || '',
      currency: values?.currency || '',
      swiftcode: values?.swiftcode || '',
      isActive: true,
      createdBy: userId,
      gbankAddress: values?.gbankAddress.map((item) => {
        return {
          ...item,
          bankName: item?.bankName,
          address: item?.address,
          createdBy: item?.createdBy || userId,
          bankAddrId: item?.bankAddrId || 0,
          bankId: item?.bankId || 0,
          isActive: true,
        };
      }),
    };
    SaveGlobalBankConfirm(
      `${imarineBaseUrl}/domain/ShippingService/SaveGlobalBank`,
      payload,
      () => {
        if (id) {
          history.goBack();
        } else {
          cb();
        }
      },

      'save',
    );
  };

  // Get City DDL
  const debouncedGetCityList = _.debounce((value) => {
    setCityDDL(
      `${imarineBaseUrl}/domain/ShippingService/GetPreviousCityDDL?search=${value}`,
    );
  }, 300);

  // Get ALL DDL
  React.useEffect(() => {
    getCountryList(`${imarineBaseUrl}/domain/CreateSignUp/GetCountryList`);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // get bank data by id for edit
  React.useEffect(() => {
    if (id) {
      GetBankAddressById(
        `${imarineBaseUrl}/domain/ShippingService/GetGlobalBankById?bankId=${id}`,
        (data) => {
          console.log(data);
          formikRef.current.setValues({
            bankName: data?.bankName || '',
            primaryAddress: data?.primaryAddress || '',
            country: data?.country
              ? {
                  value: data?.countryId || 0,
                  label: data?.country || '',
                }
              : '',
            city: data?.city
              ? {
                  value: 0,
                  label: data?.city || '',
                }
              : '',
            phoneNo: data?.phoneNo || '',
            email: data?.email || '',
            website: data?.website || '',
            currency: data?.currency || '',
            swiftcode: data?.swiftcode || '',
            bankName2: '',
            address2: '',
            gbankAddress: data?.gbankAddress || [],
          });
        },
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  return (
    <ICustomCard
      title={id ? 'Edit Global Bank' : 'Create Global Bank'}
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
      {(bookingGlobalBankLoading || isLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          bankName: '',
          primaryAddress: '',
          country: '',
          city: '',
          phoneNo: '',
          email: '',
          website: '',
          currency: '',
          swiftcode: '',

          bankName2: '',
          address2: '',
          gbankAddress: [],
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
            {/* <h1>
                            {JSON.stringify(errors)}
                        </h1> */}
            <Form className="form form-label-right">
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr',
                  gap: '10px',
                }}
              >
                <div className="form-group row global-form">
                  {/* bankName */}
                  <div className="col-lg-3">
                    <InputField
                      label="Bank Name"
                      type="text"
                      name="bankName"
                      value={values?.bankName}
                      onChange={(e) => {
                        setFieldValue('bankName', e.target.value);
                        setFieldValue('bankName2', e.target.value);
                      }}
                    />
                  </div>
                  {/* primaryAddress */}
                  <div className="col-lg-3">
                    <InputField
                      label="Primary Address"
                      type="text"
                      name="primaryAddress"
                      value={values?.primaryAddress}
                      onChange={(e) => {
                        setFieldValue('primaryAddress', e.target.value);
                      }}
                    />
                  </div>
                  {/* country */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={'Country'}
                      options={countryList || []}
                      value={values?.country}
                      name="country"
                      onChange={(valueOption) => {
                        setFieldValue('country', valueOption || '');
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {/* city */}
                  <div className="col-lg-3">
                    <NewSelect
                      name="city"
                      options={cityDDL || []}
                      value={values?.city}
                      label="City"
                      onChange={(valueOption) => {
                        let value = {
                          ...valueOption,
                          value: 0,
                          label: valueOption?.label || null,
                        };
                        setFieldValue('city', value);
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
                  {/* phoneNo */}
                  <div className="col-lg-3">
                    <InputField
                      label="Phone No"
                      type="number"
                      name="phoneNo"
                      value={values?.phoneNo}
                      onChange={(e) => {
                        setFieldValue('phoneNo', e.target.value);
                      }}
                    />
                  </div>
                  {/* email */}
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
                  {/* website */}
                  <div className="col-lg-3">
                    <InputField
                      label="Website"
                      type="text"
                      name="website"
                      value={values?.website}
                      onChange={(e) => {
                        setFieldValue('website', e.target.value);
                      }}
                    />
                  </div>
                  {/* currency */}
                  <div className="col-lg-3">
                    <NewSelect
                      label={'Currency'}
                      options={currencyList}
                      value={
                        values?.currency
                          ? { label: values?.currency, value: 0 }
                          : ''
                      }
                      name="currency"
                      onChange={(valueOption) => {
                        setFieldValue('currency', valueOption?.label || '');
                      }}
                    />
                  </div>
                  {/* swiftcode */}
                  <div className="col-lg-3">
                    <InputField
                      label="Swift Code"
                      type="text"
                      name="swiftcode"
                      value={values?.swiftcode}
                      onChange={(e) => {
                        setFieldValue('swiftcode', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-12">
                    <hr />
                  </div>

                  <div className="col-lg-3">
                    <InputField
                      label="Bank Name"
                      type="text"
                      name="bankName2"
                      value={values?.bankName2}
                      onChange={(e) => {
                        // setFieldValue('bankName2', e.target.value);
                      }}
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="Address"
                      type="text"
                      name="address2"
                      value={values?.address2}
                      onChange={(e) => {
                        setFieldValue('address2', e.target.value);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <button
                      type="button"
                      className="btn btn-primary  mt-5"
                      onClick={() => {
                        if (values.bankName2 === '') {
                          toast.warn('Bank Name is required');
                          return;
                        }
                        if (values.address2 === '') {
                          toast.warn('Address is required');
                          return;
                        }

                        setFieldValue('gbankAddress', [
                          ...values?.gbankAddress,
                          {
                            bankName: values?.bankName2,
                            address: values.address2,
                          },
                        ]);
                        setFieldValue('address2', '');
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
              <Divider />
            </Form>
            {values?.gbankAddress?.length > 0 && (
              <div className="table-responsive">
                <table className="table table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Bank Name</th>
                      <th>Address</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {values.gbankAddress?.map((item, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{item?.bankName}</td>
                        <td>{item?.address}</td>
                        <td>
                          <div className="d-flex justify-content-center">
                            <Button
                              onClick={() => {
                                const filterData = values.gbankAddress.filter(
                                  (itm, indx) => indx !== index,
                                );
                                setFieldValue('gbankAddress', filterData);
                              }}
                              color="error"
                              size="small"
                              title="Remove"
                            >
                              <IDelete />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </Formik>
    </ICustomCard>
  );
}

export default GlobalBankCreate;
