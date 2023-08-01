import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
// import * as Yup from 'yup';
import Loading from '../../../_helper/_loading';
import IForm from '../../../_helper/_form';
import NewSelect from '../../../_helper/_select';
import InputField from '../../../_helper/_inputField';
import { shallowEqual, useSelector } from 'react-redux';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';

const initData = {
  channel: '',
  region: '',
  area: '',
  territory: '',
  transportType: '',
  fromDate: '',
  toDate: '',
  month: '',
};

export default function DistributionPlanCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, , setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, , setAreaDDl] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, , setTerritoryDDL] = useAxiosGet();

  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  // handle channel change
  const handleChannelChange = (valueOption) => {
    const channelId = valueOption?.value || 0;
    getRegionDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.regionId,
          label: item?.regionName,
        }));
        setRegionDDL(newDDL);
      }
    );
  };

  // handle region change
  const handleRegionChange = (values, valueOption) => {
    const regionId = valueOption?.label ? `&regionId=${valueOption?.value}` : '';
    getAreaDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.channel?.value}${regionId}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.areaId,
          label: item?.areaName,
        }));
        setAreaDDl(newDDL);
      }
    );
  };

  // handle Area change
  const handleAreaChange = (values, valueOption) => {
    const areaId = valueOption?.label ? `&areaId=${valueOption?.value}` : '';
    getTerritoryDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.channel?.value}&regionId=${values?.region?.value}${areaId}`,
      (res) => {
        const newDDL = res?.map((item) => ({
          ...item,
          value: item?.territoryId,
          label: item?.territoryName,
        }));
        setTerritoryDDL(newDDL);
      }
    );
  };

  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const saveHandler = (values, cb) => {
    console.log(values);
    cb();
  };
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
      // validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {
          resetForm(initData);
        });
      }}
    >
      {({ handleSubmit, resetForm, values, setFieldValue, isValid, errors, touched }) => (
        <>
          {false && <Loading />}
          <IForm title="Page title here..." getProps={setObjprops}>
            <Form>
              <div className="row global-form">
                <div className="col-lg-12 row m-0 p-0">
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(channelDDL) ? channelDDL : []),
                      ]}
                      value={values?.channel}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        setFieldValue('channel', valueOption);
                        setFieldValue('region', '');
                        setFieldValue('area', '');
                        setFieldValue('territory', '');
                        handleChannelChange(valueOption);
                      }}
                      placeholder="Select Distribution Channel"
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="region"
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(regionDDL) ? regionDDL : []),
                      ]}
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        setFieldValue('region', valueOption);
                        setFieldValue('area', '');
                        setFieldValue('territory', '');
                        handleRegionChange(values, valueOption);
                      }}
                      placeholder="Region"
                      isDisabled={!values?.channel}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(areaDDL) ? areaDDL : []),
                      ]}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setFieldValue('area', valueOption);
                        setFieldValue('territory', '');
                        handleAreaChange(values, valueOption);
                      }}
                      placeholder="Area"
                      isDisabled={!values?.region}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      options={[
                        { value: 0, label: 'All' },
                        ...(Array.isArray(territoryDDL) ? territoryDDL : []),
                      ]}
                      value={values?.territory}
                      label="Territory"
                      onChange={(valueOption) => {
                        setFieldValue('territory', valueOption);
                      }}
                      placeholder="Territory"
                      isDisabled={!values?.area}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="transportType"
                      options={[{ value: 0, label: 'All' }]}
                      value={values?.type}
                      label="Transport Type"
                      onChange={(valueOption) => {
                        setFieldValue('transportType', valueOption);
                      }}
                      placeholder="Transport Type"
                      isDisabled={!values?.territory}
                    />
                  </div>
                  <div className="col-lg-3">
                    <InputField
                      label="Month"
                      placeholder="Month"
                      name="month"
                      type="month"
                      value={values?.month}
                      onChange={(e) => {
                        setFieldValue('month', e.target.value);
                        setFieldValue('fromDate' `${e.target.value}-01`)
                        setFieldValue('toDate' `${e.target.value}-31`)
                        console.log(e.target.value);
                      }}
                      disabled={!values?.transportType}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                style={{ display: 'none' }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
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
