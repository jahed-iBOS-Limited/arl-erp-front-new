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

const ClearningJournalLandingPage = () => {
  // redux
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  // api action
  const [
    unallocatedProfitCenterData,
    getUnallocatedProfitCenterData,
    getUnallocatedProfitCenterDataLoading,
  ] = useAxiosGet();

  // save handler
  const saveHandler = (values, cb) => {
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

  return (
    <Formik
      enableReinitialize={true}
      initialValues={clearingJournalLandingData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(clearingJournalLandingData);
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
            title="Clearing Journal"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return <div></div>;
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
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ClearningJournalLandingPage;
