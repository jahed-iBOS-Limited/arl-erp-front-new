import { Formik } from 'formik';
import React, { FC, useEffect, useState } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../../_helper/_form';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import {
  clearingGLInitData,
  clearingGLProfitCenterAddButtonDisabled,
  isClearingGLSaveButtonDisabled,
} from '../helper';

type ClearingGLType = {
  obj: {
    values: any;
    showClearingGLModalAndState: { state: object; isModalOpen: boolean };
    setShowClearingGLModalAndState: React.Dispatch<
      React.SetStateAction<{ state: object; isModalOpen: boolean }>
    >;
    resetForm: () => void;
    setClearingGLData: React.Dispatch<React.SetStateAction<any[]>>;
  };
};

const ClearingGLCreate: FC<ClearingGLType> = ({ obj }) => {
  // destructure
  const {
    values: landingValues,
    setShowClearingGLModalAndState,
    resetForm: resetLandingValues,
    setClearingGLData,
  } = obj;

  // redux
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  // state
  const [profitCenterData, setProfitCenterData] = useState<any[]>([]);

  // api action
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    getProfitCenterDDLLoading,
    setProfitCenterDDL,
  ] = useAxiosGet();
  const [generalLedgerDDL, getGeneralLedgerDDL, getGeneralLedgerDDLLoading] =
    useAxiosGet();
  const [
    businessTransactionDDL,
    getBusinessTransactionDDL,
    getBusinessTransactionDDLLoading,
    setBusinessTransactionDDL,
  ] = useAxiosGet();

  const [, saveClearingGL, saveClearingGLLoading] = useAxiosPost();

  useEffect(() => {
    // if landing values found
    if (landingValues?.businessUnit) {
      // landing values
      const { businessUnit } = landingValues;
      getProfitCenterDDL(
        `/fino/CostSheet/ProfitCenterDetails?UnitId=${businessUnit?.value}`,
        function (res) {
          const modifyData = res?.map((item) => ({
            ...item,
            value: item?.profitCenterId,
            label: item?.profitCenterName,
          }));
          setProfitCenterDDL(modifyData);
        }
      );
    }

    // general ledger
    getGeneralLedgerDDL(
      `/fino/FinanceCommonDDL/GetGeneralLedegerDDL?AccountId=${profileData?.accountId}`
    );
  }, []);

  // save handler
  const saveHandler = (values, cb) => {
    console.log('values', values);
    // un allocated profit center modal values

    // landing unallocated item state

    // save unallocated profit center
    saveClearingGL(``, null, cb, true);
  };

  // is loading
  const isLoading =
    getProfitCenterDDLLoading ||
    saveClearingGLLoading ||
    getGeneralLedgerDDLLoading ||
    getBusinessTransactionDDLLoading;

  // table data calculation
  const totalProfitPoportion = profitCenterData?.reduce(
    (acc, item) => (acc += +item?.profitProportion),
    0
  );

  // profitCenterRemoveHandler
  const profitCenterRemoveHandler = (id) => {
    const modifyArr = profitCenterData?.filter(
      (_: any, index: number) => index !== id
    );
    setProfitCenterData(modifyArr);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={clearingGLInitData}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm();
          setShowClearingGLModalAndState((prevState) => ({
            ...prevState,
            state: {},
            isModalOpen: false,
          }));
          resetLandingValues();
          setClearingGLData([]);
        });
      }}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <>
          {isLoading && <Loading />}

          <IForm
            title=""
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => (
              <>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isClearingGLSaveButtonDisabled(values)}
                  onClick={() => handleSubmit()}
                >
                  Save
                </button>
              </>
            )}
          >
            <form onSubmit={handleSubmit}>
              <Tabs
                defaultActiveKey="singleProfitCenter"
                id="uncontrolled-tab-example"
                className="mb-3"
              >
                <Tab
                  unmountOnExit
                  eventKey="singleProfitCenter"
                  title="Single Profit Center"
                >
                  <section className="form-group global-form row">
                    <CommonGLAndSubGLFormField
                      obj={{
                        generalLedgerDDL,
                        values,
                        setFieldValue,
                        getBusinessTransactionDDL,
                        setBusinessTransactionDDL,
                        errors,
                        touched,
                        businessTransactionDDL,
                        profileData,
                        selectedBusinessUnit,
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        label="Profit Center"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        name="profitCenter"
                        onChange={(valueOption) => {
                          setFieldValue('profitCenter', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </section>
                </Tab>
                <Tab
                  unmountOnExit
                  eventKey="multipleProfitCenter"
                  title="Multiple Profit Center"
                >
                  <section className="form-group global-form row">
                    <CommonGLAndSubGLFormField
                      obj={{
                        generalLedgerDDL,
                        values,
                        setFieldValue,
                        getBusinessTransactionDDL,
                        setBusinessTransactionDDL,
                        errors,
                        touched,
                        businessTransactionDDL,
                        profileData,
                        selectedBusinessUnit,
                      }}
                    />
                    <div className="col-lg-3">
                      <NewSelect
                        label="Profit Center"
                        options={profitCenterDDL || []}
                        value={values?.profitCenter}
                        name="profitCenter"
                        onChange={(valueOption) => {
                          setFieldValue('profitCenter', valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.profitProportion}
                        name="profitProportion"
                        label="Profit Proportion"
                        type="number"
                        min={0}
                        max={100}
                        onChange={(e) => {
                          setFieldValue('profitProportion', e?.target?.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-1 mt-2">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={clearingGLProfitCenterAddButtonDisabled(
                          values,
                          totalProfitPoportion
                        )}
                        onClick={() => {
                          // destrcuture
                          const { profitCenter, profitProportion } = values;
                          // new data payload
                          const newData = {
                            profitCenterName: profitCenter?.label || '',
                            profitCenterId: profitCenter?.value || 0,
                            profitProportion: profitProportion || 0,
                          };

                          // setter
                          setProfitCenterData((prevState) => [
                            ...prevState,
                            newData,
                          ]);

                          // reset form field
                          setFieldValue('profitProportion', '');
                          setFieldValue('profitCenter', '');
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </section>

                  {/* Profit Center Data Table */}
                  {profitCenterData?.length > 0 && (
                    <section className="table-responsive mt-2">
                      <table className="table table-striped table-bordered bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>SL</th>
                            <th>Profit Center Name</th>
                            <th>Profit Center Proportion</th>
                            <th>Amount</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {profitCenterData?.map((item: any, index) => (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td className="text-center">
                                {item?.profitCenterName}
                              </td>
                              <td className="text-right">
                                {item?.profitProportion}
                              </td>
                              <td className="text-right">
                                {_formatMoney(item?.amount)}
                              </td>
                              <td className="text-center">
                                <IDelete
                                  remover={profitCenterRemoveHandler}
                                  id={index}
                                />
                              </td>
                            </tr>
                          ))}
                          <tr>
                            <td colSpan={2} className="font-weight-bold">
                              Total
                            </td>
                            <td
                              className={`text-right font-weight-bold ${totalProfitPoportion === 100 ? 'text-danger' : ''}`}
                            >
                              {totalProfitPoportion}
                            </td>
                            <td colSpan={2}></td>
                          </tr>
                        </tbody>
                      </table>
                    </section>
                  )}
                </Tab>
              </Tabs>
            </form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ClearingGLCreate;

// common gl and sub gl form field
type CommonGLAndSubGLFormFieldType = {
  obj: {
    generalLedgerDDL: any[];
    values: any;
    setFieldValue: any;
    getBusinessTransactionDDL: any;
    setBusinessTransactionDDL: React.Dispatch<React.SetStateAction<any[]>>;
    errors: any;
    touched: any;
    businessTransactionDDL: any[];
    profileData: {
      accountId?: string;
      [key: string]: any;
    };
    selectedBusinessUnit: Record<string, any>;
  };
};

export const CommonGLAndSubGLFormField: FC<CommonGLAndSubGLFormFieldType> = ({
  obj,
}) => {
  const {
    generalLedgerDDL,
    values,
    setFieldValue,
    getBusinessTransactionDDL,
    setBusinessTransactionDDL,
    errors,
    touched,
    businessTransactionDDL,
    profileData,
    selectedBusinessUnit,
  } = obj;

  return (
    <>
      <div className="col-lg-3">
        <NewSelect
          label="General Ledger"
          options={generalLedgerDDL || []}
          value={values?.gl}
          name="gl"
          onChange={(valueOption) => {
            setFieldValue('gl', valueOption);
            getBusinessTransactionDDL(
              `/fino/FinanceCommonDDL/GetBusinessTransactionDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${valueOption?.value}`,
              (res) => {
                const modifiedData = res?.map((item) => ({
                  ...item,
                  label: item?.buesinessTransactionName,
                  value: item?.buesinessTransactionId,
                }));
                setBusinessTransactionDDL(modifiedData);
              }
            );
          }}
          errors={errors}
          touched={touched}
        />
      </div>
      <div className="col-lg-3">
        <NewSelect
          label="Business Transaction"
          options={businessTransactionDDL || []}
          value={values?.businessTransaction}
          name="businessTransaction"
          onChange={(valueOption) => {
            setFieldValue('businessTransaction', valueOption);
          }}
          errors={errors}
          touched={touched}
        />
      </div>
    </>
  );
};
