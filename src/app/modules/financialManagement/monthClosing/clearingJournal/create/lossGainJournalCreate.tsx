import { Formik } from 'formik';
import { useEffect } from 'react';
import { Tab, Tabs } from 'react-bootstrap';
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import {
  isLossGainSaveButtonDisabled,
  lossGainJournalInitData,
} from '../helper';

const LossGainJournalCreate = ({ obj }) => {
  // destructure
  const {
    values: landingValues,

    setShowUnallocatedPCAndLossGainJournalModalAndState,
    resetForm: resetLandingValues,
    setLossGainJournalData,
  } = obj;

  // redux
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

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

  const [, saveLossGainJournal, saveLossGainJournalLoading] = useAxiosPost();

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
    saveLossGainJournal(``, null, cb, true);
  };

  // is loading
  const isLoading =
    getProfitCenterDDLLoading ||
    saveLossGainJournalLoading ||
    getGeneralLedgerDDLLoading ||
    getBusinessTransactionDDLLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={lossGainJournalInitData}
      onSubmit={(values, { resetForm }) => {
        saveHandler(values, () => {
          resetForm();
          setShowUnallocatedPCAndLossGainJournalModalAndState((prevState) => ({
            ...prevState,
            state: {},
            isModalOpen: false,
          }));
          resetLandingValues();
          setLossGainJournalData([]);
        });
      }}
    >
      {({ handleSubmit, values, setFieldValue, errors, touched }) => (
        <>
          {isLoading && <Loading />}

          <IForm
            isHiddenReset
            isHiddenBack
            isHiddenSave
            isPositionRight
            renderProps={() => (
              <>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLossGainSaveButtonDisabled(values)}
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
                  <div className="form-group global-form row">
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
                  </div>
                </Tab>
                <Tab
                  unmountOnExit
                  eventKey="multipleProfitCenter"
                  title="Multiple Profit Center"
                >
                  <h3>Multiple</h3>
                </Tab>
              </Tabs>
            </form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default LossGainJournalCreate;
