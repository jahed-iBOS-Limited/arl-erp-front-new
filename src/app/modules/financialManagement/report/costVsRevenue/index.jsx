import axios from 'axios';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import ICustomCard from '../../../_helper/_customCard';
import NewSelect from '../../../_helper/_select';
import { YearDDL } from '../../../_helper/_yearDDL';
import PowerBIReport from '../../../_helper/commonInputFieldsGroups/PowerBIReport';
import IButton from '../../../_helper/iButton';

export const getBuDDL = async (userId, accountId, setter) => {
  try {
    const res = await axios.get(
      `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${userId}&ClientId=${accountId}`,
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;
      const newData = data.map((item) => {
        return {
          value: item.organizationUnitReffId,
          label: item.organizationUnitReffName,
        };
      });
      setter(newData);
    }
  } catch (error) {}
};

const monthDDL = [
  { value: 1, label: 'January' },
  { value: 2, label: 'February' },
  { value: 3, label: 'March' },
  { value: 4, label: 'April' },
  { value: 5, label: 'May' },
  { value: 6, label: 'June' },
  { value: 7, label: 'July' },
  { value: 8, label: 'August' },
  { value: 9, label: 'September' },
  { value: 10, label: 'October' },
  { value: 11, label: 'November' },
  { value: 12, label: 'December' },
];

const CostVsRevenuePBR = () => {
  const groupId = `218e3d7e-f3ea-4f66-8150-bb16eb6fc606`;
  const reportId = `18afa283-8055-4d2c-943b-79fba418b54e`;

  const [showReport, setShowReport] = React.useState(false);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  const initData = {
    businessUnit: '',
    month: '',
    year: '',
  };
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  useEffect(() => {
    getBuDDL(profileData?.userId, profileData?.accountId, setBusinessUnitDDL);
  }, [profileData]);

  const parameterValues = (values) => {
    return [
      {
        name: 'intBusinessUnitId',
        value: `${values?.businessUnit?.value || 0}`,
      },
      { name: 'yearid', value: `${values?.year?.value}` },
      { name: 'monthid', value: `${values?.month?.value}` },
    ];
  };

  return (
    <>
      <Formik enableReinitialize={true} initialValues={initData}>
        {({ values, setFieldValue }) => (
          <ICustomCard title="Cost vs Revenue Comparison">
            <form className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-md-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitDDL || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Business Unit"
                  />
                </div>
                <div className="col-md-3">
                  <NewSelect
                    name="year"
                    options={YearDDL() || []}
                    label="Year"
                    value={values?.year}
                    onChange={(valueOption) => {
                      setFieldValue('year', valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Year"
                  />
                </div>
                <div className="col-md-3">
                  <NewSelect
                    name="month"
                    options={monthDDL || []}
                    label="Month"
                    value={values?.month}
                    onChange={(valueOption) => {
                      setFieldValue('month', valueOption);
                      setShowReport(false);
                    }}
                    placeholder="Month"
                  />
                </div>

                {/* <FromDateToDateForm
                  obj={{
                    values,
                    setFieldValue,
                    onChange: () => setShowReport(false),
                    colSize:"col-md-2"
                  }}
                /> */}
                <IButton
                  colSize={'col-md-1'}
                  onClick={() => {
                    setShowReport(false);
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
    </>
  );
};

export default CostVsRevenuePBR;
