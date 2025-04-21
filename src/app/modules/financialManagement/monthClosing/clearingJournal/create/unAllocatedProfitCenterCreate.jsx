import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import IForm from '../../../../_helper/_form';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import IDelete from '../../../../_helper/_helperIcons/_delete';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import {
  unAllocatedProfitCenterAddButtonDisabled,
  unallocatedProfitCenterInitData,
  unAllocatedProfitCenterSaveButtonDisabled,
} from '../helper';

const UnAllocatedProfitCenterCreate = ({ obj }) => {
  // destructure
  const {
    values: landingValues,
    showUnallocatedPCModalAndState,
    setShowUnallocatedPCModalAndState,
    resetForm: resetLandingValues,
    setUnallocatedProfitCenterData,
  } = obj;

  // state
  const [profitCenterData, setProfitCenterData] = useState([]);

  // api action
  const [
    profitCenterDDL,
    getProfitCenterDDL,
    getProfitCenterDDLLoading,
    setProfitCenterDDL,
  ] = useAxiosGet();

  const [, saveUnallocatedProfitCenter, saveUnallocatedProfitCenterLoading] =
    useAxiosPost();

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
  }, []);

  // save handler
  const saveHandler = (values, cb) => {
    // un allocated profit center modal values
    const { profitCenter } = values;
    const { allocationType } = landingValues;

    // landing unallocated item state
    const { state } = showUnallocatedPCModalAndState;

    // unallocatated profit center can be created single or multiple
    let payload = {};

    // allocation 1 is for single profit center (can be single or multiple journal)
    if (allocationType?.value === 1) {
      payload = {
        journalList: state?.map((item) => ({
          journalId: item?.intAccountingJournalId || 0,
          journalCode: item?.strAccountingJournalCode || '',
          journalTypeId: item?.intAccountingJournalTypeId || 0,
        })),
        profitCenter: [
          {
            profitCenterId: profitCenter?.profitCenterId || 0,
            profitPercentage: null,
          },
        ],
      };
    } else {
      const journalObj = state[0];

      payload = {
        // first item of journal list
        // only can 1 journal list
        journalList: [
          {
            journalId: journalObj?.intAccountingJournalId || 0,
            journalCode: journalObj?.strAccountingJournalCode || '',
            journalTypeId: journalObj?.intAccountingJournalTypeId || 0,
          },
        ],
        // profit center can be single or multiple
        profitCenter: profitCenterData?.map((item) => ({
          profitCenterId: item?.profitCenterId || 0,
          profitPercentage: +item?.profitProportion || 0,
        })),
      };
    }

    // save unallocated profit center
    saveUnallocatedProfitCenter(
      `/fino/ClearingJournal/UpdateUnAllocatedProfitCenterJournal`,
      payload,
      cb,
      true
    );
  };

  // is loading
  const isLoading =
    getProfitCenterDDLLoading || saveUnallocatedProfitCenterLoading;

  // table data calculation
  const totalProfitPoportion = profitCenterData?.reduce(
    (acc, item) => (acc += +item?.profitProportion),
    0
  );

  // profitCenterRemoveHandler
  const profitCenterRemoveHandler = (id) => {
    const modifyArr = profitCenterData?.filter((_, index) => index !== id);
    setProfitCenterData(modifyArr);
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={unallocatedProfitCenterInitData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm();
          setShowUnallocatedPCModalAndState((prevState) => ({
            ...prevState,
            state: {},
            isModalOpen: false,
          }));
          resetLandingValues();
          setUnallocatedProfitCenterData([]);
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
                  disabled={unAllocatedProfitCenterSaveButtonDisabled({
                    values,
                    landingValues,
                    totalProfitPoportion,
                  })}
                  onClick={() => handleSubmit()}
                >
                  Save
                </button>
              </>
            )}
          >
            <Form>
              <section className="form-group global-form row">
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

                {/* Profit Allocation Section is for Multiple Profit Allocation Type */}
                {landingValues?.allocationType?.value !== 1 ? (
                  <>
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
                    <div className="col-lg-1 mt-5">
                      <button
                        className="btn btn-primary"
                        type="button"
                        disabled={unAllocatedProfitCenterAddButtonDisabled(
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
                  </>
                ) : (
                  <></>
                )}
              </section>

              {/* Profit Table Section is for Multiple Profit Allocation Type */}
              {landingValues?.allocationType?.value !== 1 ? (
                profitCenterData?.length > 0 && (
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
                        {profitCenterData?.map((item, index) => (
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
                )
              ) : (
                <></>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default UnAllocatedProfitCenterCreate;
