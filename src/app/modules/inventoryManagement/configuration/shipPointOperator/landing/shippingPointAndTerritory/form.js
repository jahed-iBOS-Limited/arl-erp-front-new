import React, { useEffect } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import NewSelect from '../../../../../_helper/_select';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';

const ShipPointAndTerritoryForm = ({ values, setFieldValue }) => {
  const {
    profileData: { accountId: accId },
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
  }, [buId]);

  return (
    <>
      {/* {(loading || loader) && <Loading />} */}
      
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
              handleGetAreaDDL(values.channel?.value, valueOption.value);
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
    </>
  );
};

export default ShipPointAndTerritoryForm;
