import { Formik } from 'formik';
import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import IForm from '../../../../_helper/_form';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import InputField from '../../../../_helper/_inputField';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import IViewModal from '../../../../_helper/_viewModal';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import ClearingGLCreate from '../create/clearingGLCreate';
import UnAllocatedProfitCenterCreate from '../create/unAllocatedProfitCenterCreate';
import {
  allocationTypeDDL,
  clearingJournalLandingData,
  commonDataReset,
  isUnallocatedPCSaveButtonDisabled,
  isUnallowcatedShowButtonDisbaled,
  selectedCount,
  singleOrMultipleRowSelection,
  typeDDL,
} from '../helper';

const ClearningJournalLandingPage = () => {
  // redux
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  // state
  const [showUnallocatedPCModalAndState, setShowUnallocatedPCModalAndState] =
    useState<{ state: object; isModalOpen: boolean }>({
      state: {},
      isModalOpen: false,
    });
  const [showClearingGLModalAndState, setShowClearingGLModalAndState] =
    useState<{ state: object; isModalOpen: boolean }>({
      state: {},
      isModalOpen: false,
    });

  // api action
  const [
    unallocatedProfitCenterData,
    getUnallocatedProfitCenterData,
    getUnallocatedProfitCenterDataLoading,
    setUnallocatedProfitCenterData,
  ] = useAxiosGet();
  const [
    clearingGLData,
    getClearingGLData,
    getClearingGLDataLoading,
    setClearingGLData,
  ] = useAxiosGet();

  // save handler
  const saveHandler = (values) => {
    // destrcuture
    const { type, businessUnit, fromDate, toDate } = values;

    // unallocatedProfitCenterData
    if (type?.value === 1) {
      getUnallocatedProfitCenterData(
        `/fino/Report/GetUnAllocatedProfitCenter?businessUnitId=${businessUnit?.value}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }

    // getClearingGLData
    if (type?.value === 2) {
      getClearingGLData(
        `/fino/Report/GetUnAllocatedLossGainJournal?businessUnitId=${businessUnit?.value}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }
  };

  // is loading
  const isLoading =
    getUnallocatedProfitCenterDataLoading || getClearingGLDataLoading;

  // disable unallocatedProfitCenterData create button
  const isClearingGLSaveButtonDisabled = selectedCount(clearingGLData) !== 1;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={clearingJournalLandingData}
      onSubmit={(values) => {
        saveHandler(values);
      }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue }) => (
        <>
          {isLoading && <Loading />}
          <IForm
            title="Clearing Journal"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <section>
                  {((values) => {
                    // destrcuture
                    const { type } = values;

                    return (
                      <>
                        {type?.value === 1 ? (
                          // Unallocated Profit Center Create Button
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={isUnallocatedPCSaveButtonDisabled(
                              unallocatedProfitCenterData,
                              values?.allocationType
                            )}
                            onClick={() => {
                              setShowUnallocatedPCModalAndState(
                                (prevState) => ({
                                  ...prevState,
                                  // set which item is selected from unallocated profit center data
                                  state: unallocatedProfitCenterData?.filter(
                                    (item) => Boolean(item?.isSelected)
                                  ),
                                  isModalOpen: true,
                                })
                              );
                            }}
                          >
                            Create
                          </button>
                        ) : // Clearing GL Create Button
                        type?.value === 2 ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={isClearingGLSaveButtonDisabled}
                            onClick={() => {
                              setShowClearingGLModalAndState((prevState) => ({
                                ...prevState,
                                // set which item is selected from unallocated profit center data
                                state: clearingGLData?.filter((item) =>
                                  Boolean(item?.isSelected)
                                )[0],
                                isModalOpen: true,
                              }));
                            }}
                          >
                            Create
                          </button>
                        ) : (
                          <></>
                        )}
                      </>
                    );
                  })(values)}
                </section>
              );
            }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    label="Type"
                    options={typeDDL || []}
                    value={values?.type}
                    name="type"
                    onChange={(valueOption) => {
                      setFieldValue('type', valueOption);
                      commonDataReset({
                        setClearingGLData,
                        setUnallocatedProfitCenterData,
                      });
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    label="Business Unit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    name="businessUnit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                      commonDataReset({
                        setClearingGLData,
                        setUnallocatedProfitCenterData,
                      });
                    }}
                  />
                </div>
                {values?.type?.value === 1 ? (
                  <div className="col-lg-3">
                    <NewSelect
                      label="Allocation Type"
                      options={allocationTypeDDL || []}
                      value={values?.allocationType}
                      name="allocationType"
                      onChange={(valueOption) => {
                        setFieldValue('allocationType', valueOption);
                        commonDataReset({
                          setClearingGLData,
                          setUnallocatedProfitCenterData,
                        });
                      }}
                    />
                  </div>
                ) : (
                  <></>
                )}
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    label="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('fromDate', e?.target?.value);
                      commonDataReset({
                        setClearingGLData,
                        setUnallocatedProfitCenterData,
                      });
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    label="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('toDate', e?.target?.value);
                      commonDataReset({
                        setClearingGLData,
                        setUnallocatedProfitCenterData,
                      });
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: '18px',
                    }}
                    className="btn btn-primary"
                    type="submit"
                    disabled={isUnallowcatedShowButtonDisbaled(values)}
                    // onSubmit={() => handleSubmit()}
                  >
                    Show
                  </button>
                </div>
              </div>

              <section className="table-responsive mt-2">
                {/* unallocated profit center data table */}
                {values?.type?.value === 1 &&
                unallocatedProfitCenterData?.length > 0 ? (
                  <UnallocatedProfitCenterDataTable
                    arr={unallocatedProfitCenterData}
                    setter={setUnallocatedProfitCenterData}
                    values={values}
                  />
                ) : /* clearing gl data table */
                values?.type?.value === 2 && clearingGLData?.length > 0 ? (
                  <ClearingGLDataTable
                    arr={clearingGLData}
                    setter={setClearingGLData}
                  />
                ) : (
                  <></>
                )}
              </section>
            </form>

            {/* Create Unallocated Profit Center */}
            <IViewModal
              title="Create Unallocated Profit Center"
              show={showUnallocatedPCModalAndState?.isModalOpen}
              onHide={() =>
                setShowUnallocatedPCModalAndState((prevState) => ({
                  ...prevState,
                  state: {},
                  isModalOpen: false,
                }))
              }
            >
              <UnAllocatedProfitCenterCreate
                obj={{
                  values,
                  showUnallocatedPCModalAndState,
                  setShowUnallocatedPCModalAndState,
                  resetForm,
                  setUnallocatedProfitCenterData,
                }}
              />
            </IViewModal>

            {/* Create Clearing General Ledger */}
            <IViewModal
              title="Clearing General Ledger"
              show={showClearingGLModalAndState?.isModalOpen}
              onHide={() =>
                setShowClearingGLModalAndState((prevState) => ({
                  ...prevState,
                  state: {},
                  isModalOpen: false,
                }))
              }
            >
              <ClearingGLCreate
                obj={{
                  values,
                  showClearingGLModalAndState,
                  setShowClearingGLModalAndState,
                  resetForm,
                  setClearingGLData,
                }}
              />
            </IViewModal>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ClearningJournalLandingPage;

/* unallocated profit center data table */
const UnallocatedProfitCenterDataTable = ({
  arr,
  setter,
  values,
}: {
  arr: any[];
  setter: React.Dispatch<React.SetStateAction<any[]>>;
  values: any;
}) => {
  return (
    <table className="table table-striped table-bordered bj-table bj-table-landing">
      <thead>
        <tr>
          <th></th>
          <th>SL</th>
          <th>Journal Code</th>
          <th>General Ledger Name</th>
          <th>Transaction Date</th>
          <th>Amount</th>
          <th>Narration</th>
        </tr>
      </thead>
      <tbody>
        {arr?.map((item, index) => (
          <tr key={index}>
            <td>
              <input
                type="checkbox"
                checked={item?.isSelected}
                onChange={(e) => {
                  singleOrMultipleRowSelection({
                    arr,
                    setter,
                    values,
                    index,
                    checkedValue: e?.target?.checked,
                  });
                }}
              />
            </td>
            <td>{index + 1}</td>
            <td className="text-center">{item?.strAccountingJournalCode}</td>
            <td>{item?.strGeneralLedgerName}</td>
            <td className="text-center">
              {_dateFormatter(item?.dteTransactionDate)}
            </td>
            <td className="text-right">{_formatMoney(item?.numAmount)}</td>
            <td>{item?.strNarration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

/* clearing gl data table */
const ClearingGLDataTable = ({
  arr,
  setter,
}: {
  arr: any[];
  setter: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  return (
    <table className="table table-striped table-bordered bj-table bj-table-landing">
      <thead>
        <tr>
          <th></th>
          <th>SL</th>
          <th>Journal Code</th>
          <th>General Ledger</th>
          <th>Sub GL</th>
          <th>Transaction Date</th>
          <th>Amount</th>
          <th>Narration</th>
        </tr>
      </thead>
      <tbody>
        {arr?.map((item, index) => (
          <tr key={index}>
            <td>
              <input
                type="checkbox"
                checked={item?.isSelected}
                onChange={(e) => {
                  // only one row can be selected
                  const value = e?.target?.checked;
                  const modifyArr = arr?.map((item, itemIndex) => ({
                    ...item,
                    isSelected: index === itemIndex ? value : false,
                  }));
                  setter(modifyArr);
                }}
              />
            </td>
            <td>{index + 1}</td>
            <td className="text-center">{item?.accountingJournalCode}</td>
            <td>{item?.generalLedgerName}</td>
            <td>{item?.subGlname}</td>
            <td className="text-center">
              {_dateFormatter(item?.transactionDate)}
            </td>
            <td className="text-right">{_formatMoney(item?.amount)}</td>
            <td>{item?.narration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
