import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../_helper/_form';
import InputField from '../../../_helper/_inputField';
import Loading from '../../../_helper/_loading';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import {
  adviceTypeDDL,
  fetchBankAsParterDDL,
  fetchSCFLandingData,
  initData,
  validation,
} from './helper';

const SCFAdviceLanding = () => {
  // redux
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  // state
  const [objProps, setObjprops] = useState({});

  // api action
  const [
    scfLandingData,
    getSCFLandingData,
    getSCFLandingDataLoading,
    setSCFLandingData,
  ] = useAxiosGet();
  const [bankAsPartnerDDL, getBankAsPartnerDDL, getBankAsPartnerDDLLoading] =
    useAxiosGet([]);

  const [, saveSCFAdvice, saveSCFAdviceLoading] = useAxiosPost();

  // use effect
  useEffect(() => {
    fetchBankAsParterDDL({ getBankAsPartnerDDL, selectedBusinessUnit });
  }, []);

  // save handler
  const saveHandler = (values, cb) => {
    // filter which is selected & not complete & making payload
    const payload = scfLandingData
      ?.filter(
        (item) => Boolean(item?.isSelected) && !Boolean(item?.isPaymentComplete)
      )
      .map((upItem) => ({
        bankAccountId: values?.bankAccount?.bankAccountId,
        voucherId: upItem?.intAdjustmentJournalId,
        voucherCode: upItem?.strAdjustmentJournalCode,
        billRegisterId: upItem?.intBillRegisterId,
        billRegisterCode: upItem?.strBillRegisterCode,
        businessPartnerId: upItem?.intBusinessPartnerId,
        businessPartnerName: upItem?.strBusinessPartnerName,
        seller_Tin: upItem?.strSellerTin,
        net_Payable_Amount: upItem?.numAmount,
      }));

    // save scf
    saveSCFAdvice(`/fino/Disburse/SendPaymenEblScf`, payload, cb, true);
  };

  // commmon form field change handler
  const commonFormFieldChangeHandler = (obj) => {
    // destrcuture
    const { setFieldValue, propertyName, value } = obj;
    setFieldValue(propertyName, value);
  };

  // form field
  function FormFields({ obj }) {
    const { values, setFieldValue, errors, touched } = obj;
    return (
      <>
        <div className="col-lg-3">
          <label>Date</label>
          <InputField
            value={values?.date || ''}
            name="date"
            placeholder="Date"
            type="date"
            onChange={(e) => {
              commonFormFieldChangeHandler({
                setFieldValue,
                propertyName: 'date',
                value: e.target?.value,
              });
            }}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            isSearchable={true}
            options={bankAsPartnerDDL || []}
            name="bankAccount"
            placeholder="Bank Account"
            value={values?.bankAccount || ''}
            onChange={(valueOption) => {
              commonFormFieldChangeHandler({
                setFieldValue,
                propertyName: 'bankAccount',
                value: valueOption,
              });
            }}
            errors={errors}
            touched={touched}
          />
        </div>
        <div className="col-lg-3">
          <NewSelect
            options={adviceTypeDDL}
            name="adviceType"
            label="Adive Type"
            value={values?.adviceType || ''}
            onChange={(valueOption) => {
              commonFormFieldChangeHandler({
                setFieldValue,
                propertyName: 'adviceType',
                value: valueOption,
              });
            }}
            errors={errors}
            touched={touched}
          />
        </div>
      </>
    );
  }

  // is loading
  const isLoading =
    getSCFLandingDataLoading ||
    getBankAsPartnerDDLLoading ||
    saveSCFAdviceLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      validationSchema={validation}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          setSCFLandingData([]);
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
          {isLoading && <Loading />}
          <IForm title="SCF Advice" isHiddenBack getProps={setObjprops}>
            <Form>
              <div className="row global-form">
                <FormFields obj={{ values, setFieldValue, errors, touched }} />

                <div className="col-lg-2 mt-5">
                  <button
                    className="btn btn-primary"
                    type="button"
                    disabled={!values?.bankAccount?.value}
                    onClick={() => {
                      fetchSCFLandingData({
                        getSCFLandingData,
                        selectedBusinessUnit,
                        profileData,
                        values,
                      });
                    }}
                  >
                    Show
                  </button>
                </div>
              </div>

              <section>
                {scfLandingData?.length > 0 && (
                  <GenericTable
                    data={scfLandingData}
                    columns={scfAdviceTableHeader({
                      scfLandingData,
                      setSCFLandingData,
                    })}
                  />
                )}
              </section>

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
                onClick={console.log('Reset')}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default SCFAdviceLanding;

// function generic table
const GenericTable = ({ data, columns, key = 'index' }) => {
  // console.log(data);
  return (
    <table className="table table-striped table-bordered global-table mt-0">
      <thead>
        <tr>
          {columns?.map((colItem, colIndex) => (
            <th key={colIndex}>{colItem.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.length > 0 &&
          data?.map((rowItem, rowIndex) => (
            <tr key={rowItem[key] || key}>
              {columns?.map((colItem, colIndex) => (
                <td key={colIndex} className={colItem?.className || ''}>
                  {colItem?.render
                    ? colItem?.render(rowItem, rowIndex)
                    : rowItem[colItem?.key]}
                </td>
              ))}
            </tr>
          ))}
      </tbody>
    </table>
  );
};

// table header
export const scfAdviceTableHeader = (obj) => {
  const { scfLandingData, setSCFLandingData } = obj;
  return [
    {
      header: (
        <div className="d-flex flex-row justify-content-around align-items-center">
          <input
            type="checkbox"
            checked={
              scfLandingData?.length > 0
                ? scfLandingData?.every((item) => item?.isSelected)
                : false
            }
            onChange={(e) => {
              setSCFLandingData(
                scfLandingData.map((item) => ({
                  ...item,
                  isSelected: e?.target?.checked,
                }))
              );
            }}
          />
          <p>Select</p>
        </div>
      ),
      render: (item, index) => {
        return item?.isPaymentComplete === false ? (
          <input
            type="checkbox"
            checked={item?.isSelected}
            onChange={(e) => {
              const data = [...scfLandingData];
              data[index]['isSelected'] = e?.target?.checked;
              setSCFLandingData(data);
            }}
          />
        ) : undefined;
      },
    },
    { header: 'SL', render: (_i, index) => index + 1 },
    { header: 'Business Partner', key: 'strBusinessPartnerName' },
    { header: 'Business Partner Code', key: 'strBusinessPartnerCode' },
    { header: 'Journal Code', key: 'strAdjustmentJournalCode' },
    {
      header: 'Payment Status',
      key: 'isPaymentComplete',
      render: (item) => (item?.isPaymentComplete ? 'Yes' : 'No'),
    },
    { header: 'Amount', key: 'numAmount' },
  ];
};
