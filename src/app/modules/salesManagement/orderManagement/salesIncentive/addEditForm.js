import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import * as Yup from 'yup';
import IView from '../../../_helper/_helperIcons/_view';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../_helper/customHooks/useAxiosPost';
import IForm from './../../../_helper/_form';
import InputField from './../../../_helper/_inputField';
import Loading from './../../../_helper/_loading';
import NewSelect from './../../../_helper/_select';
import AkijEssentialLandingDataTable from './AkijEssentialsSpecific/AkijEssentialLandingDataTable';

const initData = {
  channel: '',
  fromDate: '',
  toDate: '',
  salesOrganization:"",
};

const validationSchema = Yup.object().shape({
  item: Yup.object()
    .shape({
      label: Yup.string().required('Item is required'),
      value: Yup.string().required('Item is required'),
    })
    .typeError('Item is required'),

  remarks: Yup.string().required('Remarks is required'),
  amount: Yup.number().required('Amount is required'),
  date: Yup.date().required('Date is required'),
});

export default function SalesIncentiveForm() {
  const [objProps, setObjprops] = useState({});
  const [channelDDL, getChannelDDL, , setChannelDDL] = useAxiosGet();
  const [essentialLandingData, getEssentialLandingData] = useAxiosGet();
  const {
    profileData: { accountId: accId, userId: actionBy },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [incentiveData, getIncentiveData, loadIncentiveData, setIncentiveData] = useAxiosGet();
  const [, incentiveSave, loadIncentiveSave] = useAxiosPost();
  // DDL
  const [boninessUnitDDL, getBusinessUnitDDL] = useAxiosGet();
  const[salesOrganizationList, getSalesOrganizationList] = useAxiosGet()

  console.log({ channelDDL });

  const saveHandler = (values, cb) => {
    const newData = incentiveData?.filter((item)=> item?.isSelected);
    if(!newData?.length){
      return toast.warn("Select at least one row");
    }

    const payload = newData?.map((item) => ({
      businessId: buId,
      region: item?.strRegoin,
      area: item?.strArea,
      territory: item?.strTeritory,
      employeeId: item?.intEmployeeId,
      employeeName: item?.strEmployeeName,
      monthId: +values?.toDate?.split('-')[1],
      yearId: +values?.toDate?.split('-')[0],
      salesAmount: item?.numSalesAmount,
      targetAmount: item?.numTargetAmount || 0,
      achievement: item?.numAchievement,
      incentiveAmount: item?.numIncentiveAmount,
      regionId: item?.intRegionId,
      areaId: item?.intAreaId,
      territoryId: item?.intTerritoryId,
      zoneId: item?.intZoneId,
      channelId: item?.intChannelid,
      salesQnt: item?.numSalesQnt,
      targetQnt: item?.numTargetQuantity
    }));
    incentiveSave(
      `/oms/IncentiveConfig/SaveIncentiveConfig?intActionBy=${actionBy}`,
      payload,
      () => {},
      true,
    );
  };

  useEffect(() => {
    getBusinessUnitDDL(
      `/hcm/HCMDDL/GetBusinessUnitByAccountDDL?AccountId=${accId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps

    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`,
      (res) => {
        const ddl = res.map((item) => {
          return {
            value: item.value,
            label: item.label,
          };
        });
        setChannelDDL(ddl);
      },
    );

    getSalesOrganizationList(`/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`)
  }, [accId, buId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      //   validationSchema={validationSchema}
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
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(loadIncentiveData || loadIncentiveSave) && <Loading />}
          <IForm title="Sales Incentive" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                {/* <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={boninessUnitDDL}
                    value={values?.item}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue('businessUnit', valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                {![144].includes(buId) && ( <div className="col-lg-3">
                  <NewSelect
                    name="salesOrganization"
                    options={salesOrganizationList}
                    value={values?.salesOrganization}
                    label="Sales Organization"
                    onChange={(valueOption) => {
                      setFieldValue('salesOrganization', valueOption);
                      setIncentiveData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>)}
                <div className="col-lg-3">
                  <NewSelect
                    name="channel"
                    options={channelDDL}
                    value={values?.channel}
                    label="Channel"
                    onChange={(valueOption) => {
                      setFieldValue('channel', valueOption);
                      setIncentiveData([]);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    name="fromDate"
                    value={values?.fromDate}
                    label="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue('fromDate', e.target.value);
                      setIncentiveData([]);
                    }}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    name="toDate"
                    value={values?.toDate}
                    label="To Date"
                    type="date"
                    min={values?.fromDate}
                    onChange={(e) => {
                      setFieldValue('toDate', e.target.value);
                      setIncentiveData([]);
                    }}
                  />
                </div>
                <div>
                  <button
                    disabled={
                      !values?.channel?.value ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    onClick={() => {
                      console.log('clicked', buId);
                      // const api = `/oms/IncentiveConfig/GetIncenttiveView?businessUnitId=${buId}&certainDate=${values?.toDate}&fromDate=${values?.fromDate}&toDate=${values?.toDate}`;
                      const api = `/oms/IncentiveConfig/GetIncenttiveViewByDesignation?intunitid=4&fromdate=${values?.fromDate}&todate=${values?.toDate}&intSalesOrganizationId=${values?.salesOrganization?.value}&intChannelId=${values?.channel?.value}&intRATId=0&intLevelid=0`;


                      const essentialRowDataApi = `/oms/OMSPivotReport/GetEmployeeTargetVsAchForCommission?PartId=${1}&BusinessUnitId=${buId}&ChannelId=${
                        values.channel.value
                      }&RegionId=0&AreaId=0&FromDate=${
                        values.fromDate
                      }&ToDate=${values.toDate}`;

                      if (buId === 144) {
                        console.log('scope');
                        getEssentialLandingData(essentialRowDataApi, (data) =>
                          console.log({ dataaa: data }),
                        );
                      } else {
                        getIncentiveData(api, (data) =>
                          console.log({ api: data }),
                        );
                      }
                    }}
                    style={{ marginTop: '17px' }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Show
                  </button>
                </div>
              </div>

              <div>
                {buId === 144 ? (
                  <AkijEssentialLandingDataTable rowData = {essentialLandingData} />
                ) : (
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th>
                         <input
                          type="checkbox"
                          checked={incentiveData?.length > 0 && incentiveData.every(item => item?.isSelected)}
                          onChange={(e) => {
                            const data = incentiveData.map((item)=> ({...item, isSelected: e.target.checked}))
                            setIncentiveData(data);
                          }}
                        />
                        </th>
                        <th>Sl</th>
                        <th>Employee</th>
                        <th>Region</th>
                        <th>Area</th>
                        <th>Territory</th>
                        <th>Zone</th>
                        <th>Target Quantity</th>
                        <th>Sales Quantity</th>
                        <th>Achievement %</th>
                        <th>Incentive Amount</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incentiveData?.length > 0 &&
                        incentiveData?.map((item, index) => (
                          <tr key={index}>
                             <td>
                         <input
                          type="checkbox"
                          checked={item?.isSelected}
                          onChange={(e) => {
                            const data = [...incentiveData]
                            data[index]["isSelected"] = e.target.checked;
                            setIncentiveData(data);
                          }}
                        />
                        </td>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">
                              {item?.strEmployeeName}
                            </td>
                            <td className="text-center">{item?.strRegoin}</td>
                            <td className="text-center">{item?.strArea}</td>
                            <td className="text-center">{item?.strTeritory}</td>
                            <td className="text-center">{item?.strZoneName}</td>
                            <td className="text-center">
                              {item?.numTargetQuantity}
                            </td>
                            <td className="text-center">
                              {item?.numSalesQnt}
                            </td>
                            <td className="text-center">
                              {item?.numAchievement}
                            </td>
                            <td className="text-center">
                              {item?.numIncentiveAmount}
                            </td>
                            <td className="text-center">
                              {' '}
                              <IView
                                title="View"
                                clickHandler={() => alert('hello')}
                              />
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                )}
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => {
                  if (incentiveData?.length > 0) {
                    handleSubmit();
                  } else {
                    toast.warn('No Data found');
                  }
                }}
              ></button>

              <button
                type="reset"
                style={{ display: 'none' }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
