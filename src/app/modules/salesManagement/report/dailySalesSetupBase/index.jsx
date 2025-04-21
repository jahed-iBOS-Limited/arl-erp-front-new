import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ICustomCard from '../../../_helper/_customCard';
import { _firstDateofMonth } from '../../../_helper/_firstDateOfCurrentMonth';
import InputField from '../../../_helper/_inputField';
import NewSelect from '../../../_helper/_select';
import { _todayDate } from '../../../_helper/_todayDate';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import RATForm from '../../../_helper/commonInputFieldsGroups/ratForm';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

const initData = {
  reportType: '',
  fromDate: _firstDateofMonth(),
  toDate: _todayDate(),
  certainDate: _todayDate(),
  channel: '',
  region: '',
  area: '',
  territory: '',
};
export default function DailySalesSetupBase() {
  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId, employeeId },
  } = useSelector((state) => state.authData, shallowEqual);

  const [showReport, setShowReport] = useState(false);
  const [channelList, getChannelList] = useAxiosGet();
  const [employeeLoginInfo, getEmployeeLoginInfo] = useAxiosGet();
  const channels = [{ value: 0, label: 'All' }, ...channelList] || [];
  const stateDDL = [
    { value: 'All', label: 'All' },
    { value: 'East State', label: 'East State' },
    { value: 'West State', label: 'West State' },
  ];

  useEffect(() => {
    getEmployeeLoginInfo(
      `/hcm/RemoteAttendance/GetEmployeeLoginInfo?AccountId=${accountId}&BusinessUnitId=${buId}&EmployeeId=${employeeId}`
    );

    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accountId}&BUnitId=${buId}`
    );
  }, [buId]);

  const groupId = `e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a`;
  const getReportId = (values) => {
    if (values?.reportType?.value === 4) {
      return `deacdb48-2d61-4199-b2a5-35b16b294913`;
    } else {
      return `20289dbc-e43c-4428-b656-f23a6d3c0656`;
    }
  };
  const parameters = (values) => {
    console.log(values);
    if (values?.reportType?.value === 4) {
      const params = [
        { name: 'intunit', value: `${buId}` },
        { name: 'dteFromDateDaySales', value: `${values?.fromDate || ''}` },
        { name: 'dteToDateDaySales ', value: `${values?.toDate || ''}` },
        { name: 'intTotalDay', value: `${values?.totalDayOfMonth || 0}` },
        {
          name: 'intRunningThDay',
          value: `${values?.runningDayOfMonth || 0}`,
        },
        { name: 'intchannelid', value: `${values?.channel?.value || 0}` },
        { name: 'intEmployeeid ', value: `${employeeId}` },
        { name: 'RATId', value: `${employeeLoginInfo?.empTerritoryId || 0}` },
        { name: 'intLevelId', value: `${employeeLoginInfo?.empLevelId || 0}` },
        { name: 'state', value: `${values?.state?.value || 0}` },
      ];
      return params;
    } else {
      const params = [
        { name: 'intPartId', value: `${values?.reportType?.value || 0}` },
        { name: 'fromdate', value: `${values?.fromDate || ''}` },
        { name: 'todate', value: `${values?.toDate || ''}` },
        { name: 'certaindate', value: `${values?.certainDate || ''}` },
        { name: 'intunitid', value: `${buId}` },
        { name: 'intChannelId', value: `${values?.channel?.value || 0}` },
        { name: 'intRegionId', value: `${values?.region?.value || 0}` },
        { name: 'intAreaId', value: `${values?.area?.value || 0}` },
        { name: 'intTerritoryId', value: `${values?.territory?.value || 0}` },
        { name: 'intEmployeeId', value: `${employeeId}` },
        { name: 'RATId', value: `${employeeLoginInfo?.empTerritoryId || 0}` },
        { name: 'intLevelId', value: `${employeeLoginInfo?.empLevelId || 0}` },
      ];
      return params;
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      onSubmit={() => {}}
    >
      {({ values, setFieldValue, errors, touched }) => (
        <>
          <ICustomCard title="Daily Sales Setup Base">
            <Form>
              <div className="form-group row global-form printSectionNone">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { value: 1, label: 'Details' },
                      { value: 2, label: 'Cumulative Sales' },
                      { value: 3, label: 'Date Basis Target vs  Sales' },
                      { value: 4, label: 'Daily Sales Analysis Report' },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue('reportType', valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Report Type"
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type={'date'}
                    onChange={(e) => {
                      setFieldValue('fromDate', e?.target?.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type={'date'}
                    onChange={(e) => {
                      setFieldValue('toDate', e?.target?.value);
                      setShowReport(false);
                    }}
                  />
                </div>
                {values?.reportType?.value !== 4 && (
                  <div className="col-lg-2">
                    <InputField
                      value={values?.certainDate}
                      label="Certain Date"
                      name="certainDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue('certainDate', e?.target?.value);
                        setShowReport(false);
                      }}
                    />
                  </div>
                )}
                {values?.reportType?.value !== 4 && (
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      onChange: () => {
                        setShowReport(false);
                      },
                    }}
                  />
                )}

                {values?.reportType?.value === 4 && (
                  <>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.totalDayOfMonth}
                        label="Total Day of Month"
                        name="totalDayOfMonth"
                        type="number"
                        onChange={(e) => {
                          setFieldValue('totalDayOfMonth', e?.target?.value);
                          setShowReport(false);
                        }}
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.runningDayOfMonth}
                        label="Running Day of Month"
                        name="runningDayOfMonth"
                        type="number"
                        onChange={(e) => {
                          setFieldValue('runningDayOfMonth', e?.target?.value);
                          setShowReport(false);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="channel"
                        options={channels}
                        value={values?.channel}
                        label="Distribution Channel"
                        onChange={(valueOption) => {
                          setFieldValue('channel', valueOption);
                        }}
                        placeholder="Select Distribution Channel"
                      />
                    </div>
                    <div className="col-lg-2">
                      <NewSelect
                        name="state"
                        options={stateDDL}
                        value={values?.state}
                        label="State"
                        onChange={(valueOption) => {
                          setFieldValue('state', valueOption);
                        }}
                        placeholder="State"
                      />
                    </div>
                  </>
                )}

                <div>
                  <button
                    type="button"
                    className="btn btn-primary mt-5"
                    onClick={() => setShowReport(true)}
                  >
                    Show
                  </button>
                </div>
              </div>
              {showReport && (
                <PowerBIReport
                  reportId={getReportId(values)}
                  groupId={groupId}
                  parameterValues={parameters(values)}
                  parameterPanel={false}
                />
              )}
            </Form>
          </ICustomCard>
        </>
      )}
    </Formik>
  );
}
