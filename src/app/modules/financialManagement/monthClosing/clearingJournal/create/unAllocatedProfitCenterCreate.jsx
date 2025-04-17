import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import IForm from '../../../../_helper/_form';
import { Tab, Tabs } from 'react-bootstrap';
import Loading from '../../../../_helper/_loading';
import NewSelect from '../../../../_helper/_select';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';

const UnAllocatedProfitCenterCreate = ({ obj }) => {
  // destructure
  const {
    values: landingValues,
    showUnallocatedPCModalAndState,
    setShowUnallocatedPCModalAndState,
    resetForm: resetLandingValues,
    setUnallocatedProfitCenterData,
  } = obj;

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

    // landing unallocated item state
    const { state } = showUnallocatedPCModalAndState;

    // save unallocated profit center
    saveUnallocatedProfitCenter(
      `/fino/ClearingJournal/UpdateUnAllocatedProfitCenter?AccountingJournalId=${state?.intAccountingJournalId}&ProfitCenterId=${profitCenter?.value}`,
      null,
      cb,
      true
    );
  };

  // is loading
  const isLoading =
    getProfitCenterDDLLoading || saveUnallocatedProfitCenterLoading;

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{}}
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
            isHiddenReset
            isHiddenBack
            isHiddenSave
            isPositionRight
            renderProps={() => (
              <>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!values?.profitCenter}
                  onClick={() => handleSubmit()}
                >
                  Save
                </button>
              </>
            )}
          >
            <Form>
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
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default UnAllocatedProfitCenterCreate;
