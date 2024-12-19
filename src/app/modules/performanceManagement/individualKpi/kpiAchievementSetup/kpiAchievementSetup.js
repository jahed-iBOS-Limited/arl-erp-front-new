import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { getEMP } from '../../../financialManagement/expense/advanceForInternalExp/helper';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import YearMonthForm from '../../../_helper/commonInputFieldsGroups/yearMonthForm';
import IButton from '../../../_helper/iButton';
import ICustomCard from '../../../_helper/_customCard';
import NewSelect from '../../../_helper/_select';
import { getDepartmentDDL, getEmployeesByDepartmentId } from './helper';

const initData = {
  year: '',
  month: '',
  employee: '',
  department: '',
  reportType: '',
};

const reportTypes = [
  { value: 0, label: 'Achievement Complete & Pending Report' },
  { value: 1, label: 'Achievement Complete Report' },
  { value: 2, label: 'Achievement Pending Report' },
];

const KPIAchievementSetup = () => {
  const [showReport, setShowReport] = useState(false);
  const [employeeList, setEmployeeList] = useState([]);
  const [departmentList, setDepartmentList] = useState([]);

  const {
    selectedBusinessUnit: { value: buId },
    profileData: { accountId: accId },
  } = useSelector((state) => state.authData, shallowEqual);

  useEffect(() => {
    getEMP(accId, buId, setEmployeeList);
    getDepartmentDDL(accId, buId, setDepartmentList);
  }, [accId, buId]);

  const groupId = 'e3ce45bb-e65e-43d7-9ad1-4aa4b958b29a';
  const reportId = '2290427f-3ebe-4ef9-80db-2de2bc70f350';

  const parameterValues = (values) => {
    return [
      { name: 'intUnitid', value: `${buId}` },
      { name: 'intYearid', value: `${values?.year?.value}` },
      { name: 'intMonthid', value: `${values?.month?.value}` },
      { name: 'intEmployeeId', value: `${values?.employee?.value}` },
      { name: 'intDepartmentId', value: `${values?.department?.value}` },
      { name: 'intRpatType', value: `${values?.reportType?.value}` },
    ];
  };

  const getEmployees = (values) => {
    getEmployeesByDepartmentId(
      accId,
      buId,
      values?.department?.value,
      setEmployeeList,
    );
  };

  return (
    <Formik enableReinitialize={true} initialValues={initData}>
      {({ values, setFieldValue }) => (
        <ICustomCard title="KPI Achievement Setup">
          <form className="form form-label-right">
            <div className="form-group row global-form">
              <div className="col-lg-2">
                <NewSelect
                  name="reportType"
                  options={reportTypes}
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
                <NewSelect
                  name="department"
                  options={[{ value: 0, label: 'All' }, ...departmentList]}
                  value={values?.department}
                  label="Department"
                  onChange={(valueOption) => {
                    setFieldValue('department', valueOption);
                    getEmployees({ ...values, department: valueOption });
                    setShowReport(false);
                  }}
                  placeholder="Department"
                />
              </div>
              <div className="col-lg-2">
                <NewSelect
                  name="employee"
                  options={[{ value: 0, label: 'All' }, ...employeeList] || []}
                  value={values?.employee}
                  label="Employee"
                  onChange={(valueOption) => {
                    setFieldValue('employee', valueOption);
                    setShowReport(false);
                  }}
                  placeholder="Employee"
                />
              </div>
              <YearMonthForm
                obj={{
                  values,
                  setFieldValue,
                  onChange: () => {
                    setShowReport(false);
                  },
                  year: false,
                  colSize: 'col-lg-2',
                }}
              />
              <div className="col-lg-2">
                <NewSelect
                  name="year"
                  options={[
                    { label: '2021', value: '12' },
                    { label: '2022', value: '13' },
                    { label: '2023', value: '14' },
                  ]}
                  value={values?.year}
                  label="Year"
                  onChange={(valueOption) => {
                    setFieldValue('year', valueOption);
                    setShowReport(false);
                  }}
                  placeholder="Year"
                />
              </div>
              <IButton
                colSize={'col-lg-2'}
                onClick={() => {
                  setShowReport(true);
                }}
              />
            </div>
          </form>
          {showReport && (
            <PowerBIReport
              reportId={reportId}
              groupId={groupId}
              parameterValues={parameterValues(values)}
              parameterPanel={false}
            />
          )}
        </ICustomCard>
      )}
    </Formik>
  );
};

export default KPIAchievementSetup;
