import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import IForm from './../../../_helper/_form';
import Loading from './../../../_helper/_loading';
import PlannedAssetSchedule from './plannedAssetSchedule';
import PlannedFundRequirement from './plannedFundRequirement';
const initData = {
  enterpriseDivision: '',
  subDivision: '',
  businessUnit: '',
  reportType: '',
  year: '',
  fromDate: '',
  toDate: '',
};
export default function PlanningReport() {
  const saveHandler = (values, cb) => {};
  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const [rowData, getRowData, loading, setRowData] = useAxiosGet();

  const [enterpriseDivisionDDL, getEnterpriseDivisionDDL] = useAxiosGet();

  const [businessUnitDDL, getBusinessUnitDDL] = useAxiosGet();
  const [yearDDL, getYearDDL] = useAxiosGet();

  useEffect(() => {
    getEnterpriseDivisionDDL(
      `/hcm/HCMDDL/GetBusinessUnitGroupByAccountDDL?AccountId=${profileData?.accountId}`,
    );
    getYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  const [subDivisionDDL, getSubDivisionDDL, ,] = useAxiosGet([]);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={{}}
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
        setFieldValue,
        setValues,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {loading && <Loading />}
          <IForm
            title="Planning Report"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: 'Planned Asset Schedule' },
                      { value: 2, label: 'Planned Fund Requirement' },
                      { value: 3, label: 'Planned Financing Cost' },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setRowData([]);
                      setFieldValue('reportType', valueOption);
                      setValues({
                        ...initData,
                        reportType: valueOption,
                      });
                    }}
                    placeholder="Report Type"
                  />
                </div>
                {[1, 2, 3]?.includes(values?.reportType?.value) ? (
                  <>
                    <div className="col-md-3">
                      <NewSelect
                        name="enterpriseDivision"
                        options={enterpriseDivisionDDL || []}
                        value={values?.enterpriseDivision}
                        label="Enterprise Division"
                        onChange={(valueOption) => {
                          setFieldValue('enterpriseDivision', valueOption);
                          setFieldValue('subDivision', '');
                          setFieldValue('businessUnit', '');
                          if (valueOption?.value) {
                            getSubDivisionDDL(
                              `/hcm/HCMDDL/GetBusinessUnitSubGroup?AccountId=${profileData?.accountId}&BusinessUnitGroup=${valueOption?.label}`,
                            );
                          }
                        }}
                        placeholder="Enterprise Division"
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="subDivision"
                        options={subDivisionDDL || []}
                        value={values?.subDivision}
                        label="Sub Division"
                        onChange={(valueOption) => {
                          setFieldValue('subDivision', valueOption);
                          setFieldValue('businessUnit', '');

                          if (valueOption) {
                            getBusinessUnitDDL(
                              `/hcm/HCMDDL/GetBusinessUnitByBusinessUnitGroupDDL?AccountId=${
                                profileData?.accountId
                              }&BusinessUnitGroup=${
                                values?.enterpriseDivision?.value
                              }${
                                valueOption
                                  ? `&SubGroup=${valueOption?.value}`
                                  : ''
                              }`,
                            );
                          }
                        }}
                        placeholder="Sub Division"
                        isDisabled={!values?.enterpriseDivision}
                      />
                    </div>
                    <div className="col-md-3">
                      <NewSelect
                        name="businessUnit"
                        options={businessUnitDDL || []}
                        value={values?.businessUnit}
                        label="Business Unit"
                        onChange={(valueOption) => {
                          setFieldValue('businessUnit', valueOption);
                        }}
                        placeholder="Business Unit"
                        isDisabled={!values?.subDivision}
                      />
                    </div>
                  </>
                ) : null}
                {[2]?.includes(values?.reportType?.value) ? (
                  <div className="col-md-3">
                    <NewSelect
                      name="year"
                      options={yearDDL || []}
                      value={values?.year}
                      label="Year"
                      onChange={(valueOption) => {
                        setFieldValue('year', valueOption);
                      }}
                      placeholder="Year"
                    />
                  </div>
                ) : null}
                {[1]?.includes(values?.reportType?.value) ? (
                  <>
                    {' '}
                    <div className="col-lg-3">
                      <InputField
                        value={values?.fromDate}
                        label="From Date"
                        name="fromDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('fromDate', e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.toDate}
                        label="To Date"
                        name="toDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue('toDate', e.target.value);
                        }}
                      />
                    </div>
                  </>
                ) : null}
                <div style={{ marginTop: '17px' }}>
                  <button
                    type="button"
                    onClick={() => {
                      let url = [1]?.includes(values?.reportType?.value)
                        ? `/fino/Report/GetAssetSchedulePlanned?accountId=${profileData?.accountId}&businessUnitId=${values?.businessUnit?.value}&dteFromDate=${values?.fromDate}&dteToDate=${values?.toDate}`
                        : [2]?.includes(values?.reportType?.value)
                        ? `/fino/Report/GetPlannedFundRequirement?businessUnitId=${values?.businessUnit?.value}&strYear=${values?.year?.label}`
                        : '';
                      getRowData(url);
                    }}
                    className="btn btn-primary"
                  >
                    Show
                  </button>
                </div>
              </div>
              <div>
                {[1]?.includes(values?.reportType?.value) ? (
                  <PlannedAssetSchedule rowData={rowData} />
                ) : null}
                {[2]?.includes(values?.reportType?.value) ? (
                  <PlannedFundRequirement rowData={rowData} />
                ) : null}
              </div>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
