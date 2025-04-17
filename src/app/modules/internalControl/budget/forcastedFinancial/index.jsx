import { Form, Formik } from 'formik';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';

const initData = {
  businessUnit: '',
  month: '',
  salesQtyGrowth: '',
  salesPriceGrowth: '',
  perPriceGrowth: '',
  oHGrowthRate: '',
};

const ForcastedFinancialLandingPage = () => {
  const businessUnitList = useSelector((state) => {
    return state.authData.businessUnitList;
  }, shallowEqual);

  // CONST
  const GROUP_ID = '218e3d7e-f3ea-4f66-8150-bb16eb6fc606';
  const REPORT_ID = '741cc961-792e-48e8-b230-305dd586a1f0';

  const parameterValues = (values) => {
    const {
      businessUnit,
      month,
      salesQtyGrowth,
      salesPriceGrowth,
      perPriceGrowth,
      oHGrowthRate,
    } = values;

    return [
      { name: 'intUnitId', value: `${businessUnit?.value}` },
      { name: 'intMonth', value: `${month}` },
      { name: 'numSlesQtyGrowth', value: `${salesQtyGrowth}` },
      { name: 'numSalesPriceGrowth', value: `${salesPriceGrowth}` },
      { name: 'numPurPriceGrowth', value: `${perPriceGrowth}` },
      { name: 'numOhGrowthRate', value: `${oHGrowthRate}` },
    ];
  };

  const [showRDLC, setShowRDLC] = useState(false);

  const isLoading = false;

  const disabledShowBtn = (values) => {
    const {
      businessUnit,
      month,
      salesQtyGrowth,
      salesPriceGrowth,
      perPriceGrowth,
      oHGrowthRate,
    } = values;

    return (
      !businessUnit ||
      !month ||
      !salesPriceGrowth ||
      !salesQtyGrowth ||
      !perPriceGrowth ||
      !oHGrowthRate
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={(values, { setSubmitting, resetForm }) => {}}
    >
      {({
        handleSubmit,
        resetForm,
        values,
        setFieldValue,
        errors,
        touched,
      }) => (
        <>
          {isLoading && <Loading />}
          <IForm
            title="Forcasted Financial"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                      setShowRDLC(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.month}
                    name="month"
                    type="number"
                    label="Month"
                    onChange={(e) => {
                      setFieldValue('month', e.target.value);
                      setShowRDLC(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.salesQtyGrowth}
                    name="salesQtyGrowth"
                    type="number"
                    label="Sales Qty Growth"
                    onChange={(e) => {
                      setFieldValue('salesQtyGrowth', e.target.value);
                      setShowRDLC(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.salesPriceGrowth}
                    name="salesPriceGrowth"
                    type="number"
                    label="Sales Price Growth"
                    onChange={(e) => {
                      setFieldValue('salesPriceGrowth', e.target.value);
                      setShowRDLC(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.perPriceGrowth}
                    name="perPriceGrowth"
                    type="number"
                    label="Purchase Price Growth"
                    onChange={(e) => {
                      setFieldValue('perPriceGrowth', e.target.value);
                      setShowRDLC(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.oHGrowthRate}
                    name="oHGrowthRate"
                    type="number"
                    label="Growth Rate"
                    onChange={(e) => {
                      setFieldValue('oHGrowthRate', e.target.value);
                      setShowRDLC(false);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    className="btn btn-primary mt-5"
                    type="button"
                    disabled={disabledShowBtn(values)}
                    onClick={() => setShowRDLC(true)}
                  >
                    View
                  </button>
                </div>
              </div>

              {showRDLC && (
                <div>
                  <PowerBIReport
                    reportId={REPORT_ID}
                    groupId={GROUP_ID}
                    parameterValues={parameterValues(values)}
                    parameterPanel={false}
                  />
                </div>
              )}
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
};

export default ForcastedFinancialLandingPage;
