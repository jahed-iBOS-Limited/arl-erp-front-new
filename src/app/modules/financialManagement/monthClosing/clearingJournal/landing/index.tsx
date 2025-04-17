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
import UnAllocatedProfitCenterCreate from '../create/unAllocatedProfitCenterCreate';
import {
  clearingJournalLandingData,
  commonDataReset,
  isUnallowcatedShowButtonDisbaled,
  selectedCount,
  typeDDL,
} from '../helper';
import LossGainJournalCreate from '../create/lossGainJournalCreate';

const ClearningJournalLandingPage = () => {
  // redux
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  // state
  const [
    showUnallocatedPCAndLossGainJournalModalAndState,
    setShowUnallocatedPCAndLossGainJournalModalAndState,
  ] = useState({
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
    lossGainJournalData,
    getLossGainJournalData,
    getLossGainJournalDataLoading,
    setLossGainJournalData,
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

    // getLossGainJournalData
    if (type?.value === 2) {
      getLossGainJournalData(
        `/fino/Report/GetUnAllocatedLossGainJournal?businessUnitId=${businessUnit?.value}&fromDate=${fromDate}&toDate=${toDate}`
      );
    }
  };

  // is loading
  const isLoading =
    getUnallocatedProfitCenterDataLoading || getLossGainJournalDataLoading;

  // disable unallocatedProfitCenterData create button
  const isUnallocatedPCSaveButtonDisabled =
    selectedCount(unallocatedProfitCenterData) !== 1;

  // disable unallocatedProfitCenterData create button
  const isLossGainJournalSaveButtonDisabled =
    selectedCount(lossGainJournalData) !== 1;

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
                            disabled={isUnallocatedPCSaveButtonDisabled}
                            onClick={() => {
                              setShowUnallocatedPCAndLossGainJournalModalAndState(
                                (prevState) => ({
                                  ...prevState,
                                  // set which item is selected from unallocated profit center data
                                  state: unallocatedProfitCenterData?.filter(
                                    (item) => Boolean(item?.isSelected)
                                  )[0],
                                  isModalOpen: true,
                                })
                              );
                            }}
                          >
                            Create
                          </button>
                        ) : // Loss Gain Journal Create Button
                        type?.value === 2 ? (
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={isLossGainJournalSaveButtonDisabled}
                            onClick={() => {
                              setShowUnallocatedPCAndLossGainJournalModalAndState(
                                (prevState) => ({
                                  ...prevState,
                                  // set which item is selected from unallocated profit center data
                                  state: lossGainJournalData?.filter((item) =>
                                    Boolean(item?.isSelected)
                                  )[0],
                                  isModalOpen: true,
                                })
                              );
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
                        setLossGainJournalData,
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
                        setLossGainJournalData,
                        setUnallocatedProfitCenterData,
                      });
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    label="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('fromDate', e?.target?.value);
                      commonDataReset({
                        setLossGainJournalData,
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
                        setLossGainJournalData,
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
                  />
                ) : /* loss gain journal data table */
                values?.type?.value === 2 && lossGainJournalData?.length > 0 ? (
                  <LossGainJournalDataTable
                    arr={lossGainJournalData}
                    setter={setLossGainJournalData}
                  />
                ) : (
                  <></>
                )}
              </section>
            </form>

            {/* Create Unallocated Profit Center */}
            <IViewModal
              title="Create Unallocated Profit Center"
              show={
                showUnallocatedPCAndLossGainJournalModalAndState?.isModalOpen
              }
              onHide={() =>
                setShowUnallocatedPCAndLossGainJournalModalAndState(
                  (prevState) => ({
                    ...prevState,
                    state: {},
                    isModalOpen: false,
                  })
                )
              }
            >
              <UnAllocatedProfitCenterCreate
                obj={{
                  values,
                  showUnallocatedPCAndLossGainJournalModalAndState,
                  setShowUnallocatedPCAndLossGainJournalModalAndState,
                  resetForm,
                  setUnallocatedProfitCenterData,
                }}
              />
            </IViewModal>

            {/* Create Loss Gain Journal */}
            <IViewModal
              title="Create Loss Gain Journal"
              show={
                showUnallocatedPCAndLossGainJournalModalAndState?.isModalOpen
              }
              onHide={() =>
                setShowUnallocatedPCAndLossGainJournalModalAndState(
                  (prevState) => ({
                    ...prevState,
                    state: {},
                    isModalOpen: false,
                  })
                )
              }
            >
              <LossGainJournalCreate
                obj={{
                  values,
                  showUnallocatedPCAndLossGainJournalModalAndState,
                  setShowUnallocatedPCAndLossGainJournalModalAndState,
                  resetForm,
                  setLossGainJournalData,
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

/* loss gain journal data table */
const LossGainJournalDataTable = ({
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
