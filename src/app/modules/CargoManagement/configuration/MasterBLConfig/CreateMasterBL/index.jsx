import { Divider } from '@mui/material';
import { Form, Formik } from 'formik';
import moment from 'moment';
import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { useHistory, useLocation } from 'react-router-dom';
import * as Yup from 'yup';
import { imarineBaseUrl } from '../../../../../../App';
import ICustomCard from '../../../../_helper/_customCard';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';

const validationSchema = Yup.object().shape({
  masterBLType: Yup.object().shape({
    value: Yup.string().required('Type is required'),
    label: Yup.string().required('Type is required'),
  }),
  shippingLineName: Yup.object()
    .nullable()
    .when('masterBLType.value', {
      is: '1',
      then: Yup.object().shape({
        value: Yup.number().required('ShippingLine is required'),
        label: Yup.string().required('ShippingLine is required'),
      }),
      otherwise: Yup.object().nullable(),
    }),
  airLineName: Yup.object()
    .nullable()
    .when('masterBLType.value', {
      is: '2',
      then: Yup.object().shape({
        value: Yup.number().required('AirLine is required'),
        label: Yup.string().required('AirLine is required'),
      }),
      otherwise: Yup.object().nullable(),
    }),
  masterBL: Yup.string().required('Master BL is required'),
  gsaName: Yup.object().shape({
    value: Yup.string().required('GSA is required'),
    label: Yup.string().required('GSA is required'),
  }),
});

function CreateMasterBL() {
  const history = useHistory();
  const { id } = useParams();
  const location = useLocation();
  const { data } = location?.state || {};
  const formikRef = React.useRef(null);
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);
  const [, SaveMasterBL, isLoading] = useAxiosPost();
  //   const [, setMasterBLById] = useAxiosGet();
  const [gsaDDL, getGSADDL, gsaDDLLoading, setGSADDL] = useAxiosGet();
  const [
    airServiceProviderDDLData,
    getAirServiceProviderDDL,
    airServiceProviderLoading,
    setAirServiceProviderDDL,
  ] = useAxiosGet();

  const saveHandler = (values, cb) => {
    const payload = {
      mblConfigId: id || 0,
      shippingLineId: values?.shippingLineName?.value || 0,
      shippingLineName: values?.shippingLineName?.label || '',
      airLine: values?.airLineName?.value || 0,
      airLineName: values?.airLineName?.label || '',
      gsaId: values?.gsaName?.value || 0,
      gsaName: values?.gsaName?.label || '',
      masterBL: values?.masterBL || '',
      isActive: true,
      createdBy: userId,
      createdAt: moment().format('YYYY-MM-DDTHH:mm:ss'),
      tradeTypeId: values?.tradeType || 1,
    };
    SaveMasterBL(
      `${imarineBaseUrl}/domain/ShippingService/SaveMasterBLConfiguration`,
      payload,
      () => {
        if (id) {
          history.push('/cargoManagement/configuration/masterbl');
        } else {
          cb();
        }
      },
      'post'
    );
  };

  const GetAirServiceProviderDDLFunc = (typeId, tradeTypeId) => {
    // tradeTypeId  = 1 export
    if (tradeTypeId === 1) {
      getAirServiceProviderDDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?shipperId=${0}&participntTypeId=${typeId}`,
        (res) => {
          setAirServiceProviderDDL(res);
        }
      );
      getGSADDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeShipperDDL?shipperId=0&participntTypeId=7`
      );
    }
    // tradeTypeId  = 2 import
    if (tradeTypeId === 2) {
      getAirServiceProviderDDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?consigneeId=${0}&participntTypeId=${typeId}`,
        (res) => {
          setAirServiceProviderDDL(res);
        }
      );
      getGSADDL(
        `${imarineBaseUrl}/domain/ShippingService/ParticipntTypeCongineeDDL?consigneeId=0&participntTypeId=7`
      );
    }
  };

  React.useEffect(() => {
    if (!id) return;
    if (data && formikRef.current) {
      const getMasterBLType = () => {
        if (data?.shippingLineName) {
          return { value: 1, label: 'Sea' };
        }
        if (data?.airLineName) {
          return { value: 2, label: 'Air' };
        }
        return {
          value: 0,
          label: '',
        };
      };

      const typeId = getMasterBLType()?.value === 1 ? 5 : 6;
      const tradeTypeId = data?.tradeTypeId || 1;
      GetAirServiceProviderDDLFunc(typeId, tradeTypeId);

      formikRef.current.setFieldValue('masterBLType', getMasterBLType());
      formikRef.current.setFieldValue(
        'shippingLineName',
        data?.shippingLineName
          ? {
              value: data?.shippingLineId || 0,
              label: data?.shippingLineName || '',
            }
          : ''
      );
      formikRef.current.setFieldValue(
        'airLineName',
        data?.airLineName
          ? {
              value: data?.airLine || 0,
              label: data?.airLineName || '',
            }
          : ''
      );
      formikRef.current.setFieldValue('masterBL', data?.masterBL || '');
      formikRef.current.setFieldValue(
        'gsaName',
        data?.gsaName
          ? {
              value: data?.gsaId || 0,
              label: data?.gsaName || '',
            }
          : ''
      );
      formikRef.current.setFieldValue('tradeType', data?.tradeTypeId || 1);
    }
  }, [data, id]);

  // tradeType 1 = Export 2 = Import
  const tradeTypeHandler = ({ resetForm, values, setFieldValue }) => {
    const prvValues = {
      ...values,
    };
    resetForm();
    setFieldValue('tradeType', prvValues?.tradeType);
    setAirServiceProviderDDL([]);
    setGSADDL([]);
  };

  return (
    <ICustomCard
      title={id ? 'Edit Master BL ' : 'Create Master BL '}
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
      {(isLoading || airServiceProviderLoading || gsaDDLLoading) && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          masterBLType: '',
          airLineName: '',
          shippingLineName: '',
          masterBL: '',
          gsaName: '',
          tradeType: 1,
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
                <div className="col-lg-12">
                  <label className="mr-3 pointer">
                    <input
                      type="radio"
                      name="tradeType"
                      checked={values?.tradeType === 1}
                      className="mr-1 pointer"
                      style={{ position: 'relative', top: '2px' }}
                      onChange={(e) => {
                        setFieldValue('tradeType', 1);
                        tradeTypeHandler({
                          resetForm,
                          values: {
                            ...values,
                            tradeType: 1,
                          },
                          setFieldValue,
                        });
                      }}
                      disabled={id}
                    />
                    Export
                  </label>
                  <label className="pointer">
                    <input
                      type="radio"
                      name="tradeType"
                      checked={values?.tradeType === 2}
                      className="mr-1 pointer"
                      style={{ position: 'relative', top: '2px' }}
                      onChange={(e) => {
                        setFieldValue('tradeType', 2);
                        tradeTypeHandler({
                          resetForm,
                          values: {
                            ...values,
                            tradeType: 2,
                          },
                          setFieldValue,
                        });
                      }}
                      disabled={id}
                    />
                    Import
                  </label>
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Type"
                    options={[
                      {
                        label: 'Sea',
                        value: 1,
                      },
                      {
                        label: 'Air',
                        value: 2,
                      },
                    ]}
                    name="masterBLType"
                    placeholder="Type"
                    value={values?.masterBLType}
                    onChange={(valueOption) => {
                      setFieldValue('masterBLType', valueOption);
                      setFieldValue('shippingLineName', '');
                      setFieldValue('airLineName', '');
                      setAirServiceProviderDDL([]);
                      setGSADDL([]);
                      valueOption?.value &&
                        GetAirServiceProviderDDLFunc(
                          valueOption?.value === 1 ? 5 : 6,
                          values?.tradeType
                        );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* Shipping line */}
                {values?.masterBLType?.value === 1 && (
                  <div className="col-lg-3">
                    <NewSelect
                      options={airServiceProviderDDLData || []}
                      label="ShippingLine"
                      name={'shippingLineName'}
                      value={values?.shippingLineName}
                      onChange={(valueOption) => {
                        setFieldValue(`shippingLineName`, valueOption);
                      }}
                      placeholder="ShippingLine"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {/* air line */}
                {values?.masterBLType?.value === 2 && (
                  <div className="col-lg-3">
                    <NewSelect
                      options={airServiceProviderDDLData || []}
                      label="AirLine"
                      name={'airLineName'}
                      value={values?.airLineName}
                      onChange={(valueOption) => {
                        setFieldValue(`airLineName`, valueOption);
                      }}
                      placeholder="AirLine"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                )}
                {/* master BL */}
                <div className="col-lg-3">
                  <InputField
                    value={values?.masterBL}
                    label="Master BL"
                    name={'masterBL'}
                    placeholder="Master BL"
                    type="text"
                    onChange={(e) => setFieldValue('masterBL', e.target.value)}
                  />
                </div>
                {/* GSA */}
                <div className="col-lg-3">
                  <NewSelect
                    options={gsaDDL || []}
                    label="GSA"
                    name={'gsaName'}
                    value={values?.gsaName}
                    onChange={(valueOption) => {
                      setFieldValue(`gsaName`, valueOption);
                    }}
                    placeholder="GSA"
                    errors={errors}
                    touched={touched}
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

export default CreateMasterBL;
