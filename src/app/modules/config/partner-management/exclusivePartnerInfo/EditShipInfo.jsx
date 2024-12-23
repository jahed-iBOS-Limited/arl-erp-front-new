import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import * as Yup from 'yup';
import { _dateFormatter } from '../../../_helper/_dateFormate';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import { getBankDDLAll } from '../../../financialManagement/banking/fundManagement/helper';

const initData = {
  managerNumber: '',
  account: '',
  accountName: '',
  bank: '',
  branch: '',
  routing: '',
  nid: '',
  bday: '',
  marriageDate: '',
  blood: '',
  shirtSize: '',
  jacketSize: '',
  panjabiSize: '',
  fb: '',
};
export default function EditShipInfo({
  config,
  getGridData,
  singleData,
  setSingleData,
  setIsShowUpdateModal,
}) {
  const {
    profileData: { userId },
  } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [, onSave, loader] = useAxiosPost();
  const [bankDDL, setBankDDL] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getBankDDLAll(setBankDDL, setLoading);
  }, []);

  const saveHandler = (values) => {
    const cb = () => {
      setSingleData(null);
      setIsShowUpdateModal(false);
      getGridData(
        `/partner/BusinessPartnerShippingAddress/GetShipToPartnerAndBankInfoById?shipToPartnerId=${config?.shop?.value}&businessPartnerId=${config?.customer?.value}`,
      );
    };
    const payload = {
      shiptoPartnerId: singleData?.shiptoPartnerId,
      businessUnitId: singleData?.businessUnitId,
      businessPartnerId: singleData?.businessPartnerId,
      facebookLink: values?.fb,
      nationalId: values?.nid,
      isExclusiveShop: true,
      managerContact: values?.managerNumber,
      birthDate: values?.bday,
      marriageDate: values?.marriageDate,
      bloodGroup: values?.blood,
      religionName: singleData?.religionName,
      shirtSize: values?.shirtSize,
      jacketSize: values?.jacketSize,
      panjabiSize: values?.panjabiSize,
      configId: singleData?.configId,
      bankId: values?.bank?.value,
      bankBranchId: singleData?.bankBranchId,
      routingNo: values?.routing,
      bankAccountNo: values?.account,
      bankAccountName: values?.accountName,
      isDefaultAccount: true,
      actionBy: userId,
    };

    onSave(
      `/partner/BusinessPartnerShippingAddress/UpdateExclusiveShipToPartner`,
      payload,
      cb,
      true,
    );
  };
  const validationSchema = Yup.object().shape({});
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        fb: singleData?.facebookLink,
        jacketSize: singleData?.jacketSize,
        shirtSize: singleData?.shirtSize,
        panjabiSize: singleData?.panjabiSize,
        branch: singleData?.strBranchName,
        bday: _dateFormatter(singleData?.birthDate),
        marriageDate: _dateFormatter(singleData?.marriageDate),
        blood: singleData?.bloodGroup,
        nid: singleData?.nationalId,
        managerNumber: singleData?.managerContact,
        accountName: singleData?.bankAccountName,
        account: singleData?.bankAccountNo,
        routing: singleData?.routingNo,
      }}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loader || loading) && <Loading />}

          <Form>
            <div className="form-group  global-form row">
              <div className="col-lg-3">
                <InputField
                  value={values?.managerNumber}
                  label="Manager Number"
                  name="managerNumber"
                  type="number"
                  onChange={(e) =>
                    setFieldValue('managerNumber', e.target.value)
                  }
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.account}
                  label="Account"
                  name="account"
                  type="number"
                  onChange={(e) => setFieldValue('account', e.target.value)}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.accountName}
                  label="Account Name"
                  name="accountName"
                  type="text"
                  onChange={(e) => setFieldValue('accountName', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <NewSelect
                  name="bank"
                  options={bankDDL || []}
                  value={values?.bank}
                  label="Bank"
                  onChange={(valueOption) => {
                    setFieldValue('bank', valueOption || '');
                  }}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.branch}
                  label="Branch"
                  name="branch"
                  type="text"
                  onChange={(e) => setFieldValue('branch', e.target.value)}
                />
              </div>

              <div className="col-lg-3">
                <InputField
                  value={values?.routing}
                  label="Routing"
                  name="routing"
                  type="text"
                  onChange={(e) => setFieldValue('routing', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.nid}
                  label="National Id"
                  name="nid"
                  type="Number"
                  onChange={(e) => setFieldValue('nid', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.bday}
                  label="Birth Date"
                  name="bday"
                  type="date"
                  onChange={(e) => {
                    setFieldValue('bday', e.target.value);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.marriageDate}
                  label="Marriage Date"
                  name="marriageDate"
                  type="date"
                  onChange={(e) => {
                    setFieldValue('marriageDate', e.target.value);
                  }}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.blood}
                  label="Blood Group"
                  name="blood"
                  type="text"
                  onChange={(e) => setFieldValue('blood', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.fb}
                  label="Facebook Link"
                  name="fb"
                  type="text"
                  onChange={(e) => setFieldValue('fb', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.shirtSize}
                  label="Shirt Size"
                  name="shirtSize"
                  type="Number"
                  onChange={(e) => setFieldValue('shirtSize', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.jacketSize}
                  label="Jacket Size"
                  name="jacketSize"
                  type="Number"
                  onChange={(e) => setFieldValue('jacketSize', e.target.value)}
                />
              </div>
              <div className="col-lg-3">
                <InputField
                  value={values?.panjabiSize}
                  label="Panjabi Size"
                  name="panjabiSize"
                  type="Number"
                  onChange={(e) => setFieldValue('panjabiSize', e.target.value)}
                />
              </div>

              <div className="col-lg-3">
                <button type="submit" className="btn  btn-primary mt-5">
                  Submit
                </button>
              </div>
            </div>
          </Form>
        </>
      )}
    </Formik>
  );
}
