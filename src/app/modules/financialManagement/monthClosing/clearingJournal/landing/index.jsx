import { Form, Formik } from 'formik';
import { clearingJournalLandingData } from '../helper';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import InputField from '../../../../_helper/_inputField';
import IForm from '../../../../_helper/_form';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { _dateFormatter } from '../../../../_helper/_dateFormate';
import { _formatMoney } from '../../../../_helper/_formatMoney';
import _allRowDataCheckHandler from '../../../../_helper/_allRowDataCheckHandler';
import _singleRowDataCheckHandler from '../../../../_helper/_singleRowDataCheckHandler';
import IViewModal from '../../../../_helper/_viewModal';
import { useState } from 'react';
import UnAllocatedProfitCenterCreate from '../create/unAllocatedProfitCenterCreate';

const ClearningJournalLandingPage = () => {
  // redux
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  // state
  const [showUnallocatedPCModalAndState, setShowUnallocatedPCModalAndState] =
    useState({
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
  };

  // is loading
  const isLoading = getUnallocatedProfitCenterDataLoading;

  // disable unallocatedProfitCenterData create button
  const selectedCount =
    unallocatedProfitCenterData?.filter((item) => item?.isSelected)?.length ||
    0;
  const isUnallocatedPCSaveButtonDisabled = selectedCount !== 1;

  // disable unallowcated show button
  const isUnallowcatedShowButtonDisbaled = (values) => {
    const { type, businessUnit, fromDate, toDate } = values;

    return !type?.value === 1 || !businessUnit || !fromDate || !toDate;
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={clearingJournalLandingData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values);
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
                        {type?.value === 1 && (
                          <button
                            type="button"
                            className="btn btn-primary"
                            disabled={isUnallocatedPCSaveButtonDisabled}
                            onClick={() => {
                              setShowUnallocatedPCModalAndState(
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
                        )}
                      </>
                    );
                  })(values)}
                </section>
              );
            }}
          >
            <Form>
              <div className="form-group global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    label="Type"
                    options={[]}
                    value={values?.type}
                    name="type"
                    onChange={(valueOption) => {
                      setFieldValue('type', valueOption);
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
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    style={{
                      marginTop: '18px',
                    }}
                    className="btn btn-primary"
                    submit="button"
                    disabled={isUnallowcatedShowButtonDisbaled(values)}
                    onSubmit={() => handleSubmit()}
                  >
                    Show
                  </button>
                </div>
              </div>

              <section className="table-responsive mt-2">
                {/* unallocated profit center data table */}
                {values?.type?.value === 1 &&
                unallocatedProfitCenterData?.length > 0 ? (
                  <table className="table table-striped table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th></th>
                        <th>SL</th>
                        <th>Accounting Journal Code</th>
                        <th>General Ledger Name</th>
                        <th>Transaction Date</th>
                        <th>Amount</th>
                        <th>Narration</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unallocatedProfitCenterData?.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <input
                              type="checkbox"
                              checked={item?.isSelected}
                              onChange={(e) => {
                                const value = e?.target?.checked;
                                const modifyArr =
                                  unallocatedProfitCenterData?.map(
                                    (item, itemIndex) => ({
                                      ...item,
                                      isSelected:
                                        index === itemIndex ? value : false,
                                    })
                                  );
                                setUnallocatedProfitCenterData(modifyArr);
                              }}
                            />
                          </td>
                          <td>{index + 1}</td>
                          <td className="text-center">
                            {item?.strAccountingJournalCode}
                          </td>
                          <td>{item?.strGeneralLedgerName}</td>
                          <td className="text-center">
                            {_dateFormatter(item?.dteTransactionDate)}
                          </td>
                          <td className="text-right">
                            {_formatMoney(item?.numAmount)}
                          </td>
                          <td>{item?.strNarration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <></>
                )}
              </section>
            </Form>

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
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ClearningJournalLandingPage;
