import React from 'react';
import { Formik } from 'formik';
import { useHistory } from 'react-router';
import { validationSchema } from '../helper';
import FormikSelect from '../../../../_chartinghelper/common/formikSelect';
import customStyles from '../../../../_chartinghelper/common/selectCustomStyle';
import FormikInput from '../../../../_chartinghelper/common/formikInput';

export default function FormCmp({
  title,
  initData,
  saveHandler,
  viewType,
  preData,
}) {
  const history = useHistory();

  //  difference between two dates with date and time
  const getDifference = (date1, date2) => {
    const diff = Math.abs(new Date(date2) - new Date(date1));
    return (diff / (1000 * 60 * 60 * 24)).toFixed(2);
  };

  const {
    lsmgoRate: lsmgoPrice,
    lsfo1Rate: lsifoPrice,
    dailyHire,
    cve30Days: cve30days,
    addressCommission,
    brokerCommission,
  } = preData;

  const setData = (values, setFieldValue) => {
    const diff = getDifference(
      values?.offHireStartDateTime,
      values?.offHireEndDateTime
    );
    const offHireFinalDuration = (diff / 100) * values?.durationPercentage;

    const offHireCost = (offHireFinalDuration * dailyHire).toFixed(2);
    setFieldValue('offHireDuration', diff);
    setFieldValue('finalOffHireDuration', offHireFinalDuration);
    setFieldValue('offHireCostAmount', offHireCost);
    setFieldValue(
      'offHireCve',
      (offHireFinalDuration * (cve30days / 30)).toFixed(2)
    );
    setFieldValue(
      'offHireLsmgoqty',
      offHireFinalDuration * values?.perDayLsmgoQty
    );
    setFieldValue(
      'offHireLsmgovalue',
      (
        offHireFinalDuration *
        values?.perDayLsmgoQty *
        (lsmgoPrice || 1)
      ).toFixed(2)
    );
    setFieldValue(
      'offHireLsfoqty',
      offHireFinalDuration * values?.perDayLsfoQty
    );
    setFieldValue(
      'offHireLsfovalue',
      (
        offHireFinalDuration *
        values?.perDayLsfoQty *
        (lsifoPrice || 1)
      ).toFixed(2)
    );
    // setFieldValue("offHireDuration", diff);,
    setFieldValue(
      'offHireBrokerCommission',
      (((offHireFinalDuration * dailyHire) / 100) * brokerCommission).toFixed(2)
    );
    setFieldValue(
      'offHireAddressCommission',
      (((offHireFinalDuration * dailyHire) / 100) * addressCommission).toFixed(
        2
      )
    );
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          setValues,
        }) => (
          <>
            <form className="marine-form-card">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      history.push({
                        pathname: `/chartering/transaction/timecharter/create`,
                        state: preData,
                      });
                    }}
                    className="btn btn-danger px-3 py-2"
                  >
                    Skip
                  </button>
                  {/* <button
                    type="button"
                    onClick={() => {
                      history.goBack();
                    }}
                    className={"btn btn-secondary"}
                  >
                    <i className="fa fa-arrow-left pr-1"></i>
                    Back
                  </button> */}
                  {viewType !== 'view' && (
                    <button
                      type="button"
                      onClick={() => resetForm(initData)}
                      className={'btn btn-info reset-btn ml-2 px-3 py-2'}
                    >
                      Reset
                    </button>
                  )}
                  {viewType !== 'view' && (
                    <button
                      type="submit"
                      className={'btn btn-primary ml-2 px-3 py-2'}
                      onClick={handleSubmit}
                      disabled={false}
                    >
                      Save & Next
                    </button>
                  )}
                </div>
              </div>
              <div className="marine-form-card-content">
                <div className="row">
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.vesselName || ''}
                      isSearchable={true}
                      styles={customStyles}
                      name="vesselName"
                      placeholder="Vessel Name"
                      label="Vessel Name"
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <FormikSelect
                      value={values?.voyageNo || ''}
                      isSearchable={true}
                      styles={customStyles}
                      name="voyageNo"
                      placeholder="Voyage No"
                      label="Voyage No"
                      isDisabled={true}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire Reason</label>
                    <FormikInput
                      value={values?.offHireReason}
                      name="offHireReason"
                      placeholder="Off Hire Reason"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === 'view'}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire Start Date-Time</label>
                    <FormikInput
                      value={values?.offHireStartDateTime}
                      name="offHireStartDateTime"
                      placeholder="Off Hire Start Date-Time"
                      onChange={(e) => {
                        setFieldValue('offHireStartDateTime', e.target.value);
                        setData(
                          { ...values, offHireStartDateTime: e?.target?.value },
                          setFieldValue
                        );
                      }}
                      type="datetime-local"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === 'view'}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire End Date-Time</label>
                    <FormikInput
                      value={values?.offHireEndDateTime}
                      name="offHireEndDateTime"
                      placeholder="Off Hire End Date-Time"
                      min={values?.offHireStartDateTime}
                      onChange={(e) => {
                        setFieldValue('offHireEndDateTime', e.target.value);
                        setData(
                          { ...values, offHireEndDateTime: e?.target?.value },
                          setFieldValue
                        );
                      }}
                      type="datetime-local"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === 'view'}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire Duration</label>
                    <FormikInput
                      value={values?.offHireDuration}
                      name="offHireDuration"
                      placeholder="Off Hire Duration"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label> Duration Percentage</label>
                    <FormikInput
                      value={values?.durationPercentage}
                      name="durationPercentage"
                      placeholder="Duration Percentage"
                      type="number"
                      onChange={(e) => {
                        setFieldValue('durationPercentage', e.target.value);
                        setData(
                          {
                            ...values,
                            durationPercentage: e.target.value,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={
                        viewType === 'view' ||
                        !values?.voyageNo ||
                        !values?.offHireDuration
                      }
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Final Off Hire Duration</label>
                    <FormikInput
                      value={values?.finalOffHireDuration}
                      name="finalOffHireDuration"
                      placeholder="Final Off Hire Duration"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire Cost Amount</label>
                    <FormikInput
                      value={values?.offHireCostAmount}
                      name="offHireCostAmount"
                      placeholder="Off Hire Cost Amount"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Per Day LSMGO QTY</label>
                    <FormikInput
                      value={values?.perDayLsmgoQty}
                      name="perDayLsmgoQty"
                      placeholder="Per Day LSMGO QTY"
                      type="number"
                      onChange={(e) => {
                        setFieldValue('perDayLsmgoQty', e.target.value);
                        setData(
                          {
                            ...values,
                            perDayLsmgoQty: e.target.value,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === 'view'}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire LSMGO QTY</label>
                    <FormikInput
                      value={values?.offHireLsmgoqty}
                      name="offHireLsmgoqty"
                      placeholder="Off Hire LSMGO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire LSMGO Rate</label>
                    <FormikInput
                      value={values?.offHireLsmgorate}
                      // value={values?.offHireLsmgorate}
                      name="offHireLsmgorate"
                      placeholder="Off Hire LSMGO Rate"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire LSMGO Value</label>
                    <FormikInput
                      value={values?.offHireLsmgovalue}
                      name="offHireLsmgovalue"
                      placeholder="Off Hire LSMGO Value"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Per Day LSFO QTY</label>
                    <FormikInput
                      value={values?.perDayLsfoQty}
                      name="perDayLsfoQty"
                      placeholder="Per Day LSFO QTY"
                      type="number"
                      onChange={(e) => {
                        setFieldValue('perDayLsfoQty', e.target.value);
                        setData(
                          {
                            ...values,
                            perDayLsfoQty: e.target.value,
                          },
                          setFieldValue
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      disabled={viewType === 'view'}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire LSFO QTY</label>
                    <FormikInput
                      value={values?.offHireLsfoqty}
                      name="offHireLsfoqty"
                      placeholder="Off Hire LSFO QTY"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire LSFO Rate</label>
                    <FormikInput
                      value={values?.offHireLsforate}
                      // value={values?.offHireLsforate}
                      name="offHireLsforate"
                      placeholder="Off Hire LSFO Rate"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire LSFO Value</label>
                    <FormikInput
                      value={values?.offHireLsfovalue}
                      name="offHireLsfovalue"
                      placeholder="Off Hire LSFO Value"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire C/V/E</label>
                    <FormikInput
                      value={values?.offHireCve}
                      name="offHireCve"
                      placeholder="Off Hire C/V/E"
                      type="text"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Off Hire Broker Commission</label>
                    <FormikInput
                      value={values?.offHireBrokerCommission}
                      name="offHireBrokerCommission"
                      placeholder="Off Hire Broker Commission"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Off Hire Address Commission</label>
                    <FormikInput
                      value={values?.offHireAddressCommission}
                      name="offHireAddressCommission"
                      placeholder="Off Hire Address Commission"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Other Cost</label>
                    <FormikInput
                      value={values?.otherCost}
                      name="otherCost"
                      placeholder="Other Cost"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === 'view'}
                    />
                  </div>
                </div>
              </div>
            </form>
          </>
        )}
      </Formik>
    </>
  );
}
