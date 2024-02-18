import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import IForm from '../../../../../_helper/_form';
import Loading from '../../../../../_helper/_loading';
import NewSelect from '../../../../../_helper/_select';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../../_helper/customHooks/useAxiosPost';

const initData = {
  shipPoint: '',
  channel: '',
  area: '',
  region: '',
};

const ShippingPointAndTerritoryCreateForm = () => {
  // const [loading, setLoading] = useState(false);
  const [objProps, setObjprops] = useState();
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [channelDDL, getChannelDDL, isChannelDDLLoading] = useAxiosGet();
  const [
    regionDDL,
    getRegionDDL,
    isRegionDDLLoading,
    setRegionDDL,
  ] = useAxiosGet();
  const [areaDDL, getAreaDDL, isAreaDDLLoading, setAreaDDL] = useAxiosGet();
  const [shipPointDDL, getShipPointDDL, shipPointDDLLoading] = useAxiosGet();
  const [, saveShipPointAndTerritory] = useAxiosPost();

  const handleGetRegionDDL = (channelId) => {
    getRegionDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}`,
      (data) => {
        const ddl = data.map((item) => ({
          value: item.regionId,
          label: item.regionName,
        }));

        setRegionDDL(ddl);
      },
    );
  };

  const handleGetAreaDDL = (channelId, regionId) => {
    getAreaDDL(
      `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${channelId}&regionId=${regionId}`,
      (data) => {
        const ddl = data.map((item) => ({
          value: item.areaId,
          label: item.areaName,
        }));
        setAreaDDL(ddl);
      },
    );
  };

  //on-mount ddl loading
  useEffect(() => {
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);

  useEffect(() => {
    getShipPointDDL(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`,
    );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);

  const saveHandler = (values, cb) => {
    const payload = [
      {
        actionById: userId,
        areaid: values.area?.value,
        unitId: buId,
        shippingpointid: values.shipPoint?.value,
      },
    ];
    saveShipPointAndTerritory(
      `/wms/ShipPoint/SaveShippingPointNTerritoryBridge?actionBy=${userId}`,
      payload,
      null,
      true,
    );
  };

  return (
    <IForm
      title={'Shipping Point Operator & Territory'}
      getProps={setObjprops}
      // isDisabled={}
      isHiddenReset
    >
      <div className="mt-0">
        {(
          isChannelDDLLoading ||
          isRegionDDLLoading ||
          shipPointDDLLoading ||
          isAreaDDLLoading) && <Loading />}
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          onSubmit={(values, { resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              console.log({ values });
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
          }) => (
            <>
              <Form className="form form-label-right">
                <div className="form-group row global-form">
                  <div className="col-lg-3">
                    <NewSelect
                      name="Ship Point"
                      options={shipPointDDL || []}
                      value={values?.shipPoint}
                      label="Ship Point"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('shipPoint', valueOption);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="Channel"
                      options={channelDDL || []}
                      value={values?.channel}
                      label="Channel"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('channel', valueOption);
                          setFieldValue('region', '');
                          setFieldValue('area', '');
                          handleGetRegionDDL(valueOption.value);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="Region"
                      options={regionDDL || []}
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue('region', valueOption);
                          setFieldValue('area', '');
                          handleGetAreaDDL(
                            values.channel?.value,
                            valueOption.value,
                          );
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="Area"
                      options={areaDDL || []}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        setFieldValue('area', valueOption);
                      }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: 'none' }}
                  ref={objProps?.btnRef}
                  // disabled={
                  //   values.type?.value === 2 &&
                  //   (!values.channel?.value ||
                  //     !values.area?.value ||
                  //     !values.region?.value)
                  // }
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: 'none' }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </IForm>
  );
};

export default ShippingPointAndTerritoryCreateForm;
