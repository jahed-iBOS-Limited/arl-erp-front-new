import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import { getModifyData, initData, makePayload } from '../helper';
import '../style.css';
import BankGuarantee from './bankGuarantee';
import DepositRegister from './depositRegister';

export default function BankGuaranteeEntry() {
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [objProps, setObjprops] = useState({});
  const { entryType, typeId } = useParams();
  const [attachmentFile, setAttachmentFile] = useState('');
  const [bankDDL, getBankDDL] = useAxiosGet();
  const [bankAccDDL, getBankAccDDL, , setBankAccDDL] = useAxiosGet();
  const [sbuDDL, getSbuDDL] = useAxiosGet();
  const [, createHandler, saveLoading] = useAxiosPost();
  const location = useLocation();
  const [modifyData, setModifyData] = useState({});
  const history = useHistory();

  useEffect(() => {
    if (location?.state?.intId && entryType !== 'create') {
      setModifyData(getModifyData({ location }));

      setAttachmentFile(location?.state?.strAttachment || '');
      getBankAccDDL(
        `/costmgmt/BankAccount/GetBankAccountDDLByBankId?AccountId=${profileData?.accountId}&BusinssUnitId=${selectedBusinessUnit?.value}&BankId=${location?.state?.intBankId}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    getBankDDL(`/hcm/HCMDDL/GetBankDDL`);
    getSbuDDL(
      `/fino/Disbursement/GetSbuDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = (values, cb) => {
    createHandler(
      `/fino/CommonFino/CreateBankGuaranteeSecurityRegister`,
      makePayload({
        values,
        entryType,
        attachmentFile,
        selectedBusinessUnit,
        typeId,
        userId: profileData?.userId,
        location,
      }),
      entryType === 'create'
        ? () => {
            cb();
            setAttachmentFile('');
            history.push(`/financial-management/banking/BankGuarantee`);
          }
        : null,
      true,
    );
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={entryType === 'create' ? initData : modifyData}
      // validationSchema={{}}
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
          {saveLoading && <Loading />}
          <IForm
            title={`${entryType?.toUpperCase()} ${
              +typeId === 1
                ? 'BANK GUARANTEE'
                : +typeId === 2
                ? 'SECURITY DEPOSIT REGISTER'
                : ''
            }`}
            getProps={setObjprops}
          >
            <div className="bank-guarantee-entry">
              {[1].includes(+typeId) ? (
                <BankGuarantee
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  bankDDL={bankDDL}
                  bankAccDDL={bankAccDDL}
                  getBankAccDDL={getBankAccDDL}
                  setBankAccDDL={setBankAccDDL}
                  sbuDDL={sbuDDL}
                  profileData={profileData}
                  selectedBusinessUnit={selectedBusinessUnit}
                />
              ) : [2].includes(+typeId) ? (
                <DepositRegister
                  values={values}
                  setFieldValue={setFieldValue}
                  errors={errors}
                  touched={touched}
                  bankDDL={bankDDL}
                  bankAccDDL={bankAccDDL}
                  getBankAccDDL={getBankAccDDL}
                  setBankAccDDL={setBankAccDDL}
                  attachmentFile={attachmentFile}
                  setAttachmentFile={setAttachmentFile}
                  accId={profileData?.accountId}
                  sbuDDL={sbuDDL}
                  profileData={profileData}
                  selectedBusinessUnit={selectedBusinessUnit}
                />
              ) : null}
            </div>
            <Form>
              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
