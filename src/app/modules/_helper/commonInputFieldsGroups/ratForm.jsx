/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { getRegionAreaTerritory } from "../../salesManagement/report/customerSalesTargetReport/helper";
import useAxiosGet from "../customHooks/useAxiosGet";
import Loading from "../_loading";
import NewSelect from "../_select";

// A common form for Channel, Region, Area, Territory and zone
const RATForm = ({ obj }) => {
  const {
    setFieldValue,
    values,
    setGridData,
    channel,
    region,
    area,
    territory,
    columnSize,
    onChange,
    zone,
    channelDisable,
    regionDisable,
    areaDisable,
    territoryDisable,
    zoneDisable,
    allElement,
  } = obj;
  // get user data from store
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const [channelList, getChannelList] = useAxiosGet();
  const [regionList, setRegionList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [territoryList, setTerritoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [zoneList, setZoneList] = useState([]);

  useEffect(() => {
    getChannelList(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // getTransportZoneDDL(accId, buId, setZoneDDL);
  }, [accId, buId]);

  const col = columnSize ? columnSize : "col-lg-3";

  const channels =
    allElement !== false
      ? [{ value: 0, label: "All" }, ...channelList] || []
      : channelList || [];

  const regions =
    allElement !== false
      ? [{ value: 0, label: "All" }, ...regionList] || []
      : regionList || [];

  const areas =
    allElement !== false
      ? [{ value: 0, label: "All" }, ...areaList] || []
      : areaList || [];

  const territories =
    allElement !== false
      ? [{ value: 0, label: "All" }, ...territoryList] || []
      : territoryList || [];

  const zones =
    allElement !== false
      ? [{ value: 0, label: "All" }, ...zoneList] || []
      : zoneList || [];

  return (
    <>
      {loading && <Loading />}
      {channel !== false && (
        <div className={col}>
          <NewSelect
            name="channel"
            options={channels}
            value={values?.channel}
            label="Distribution Channel"
            onChange={(valueOption) => {
              setFieldValue("channel", valueOption);
              setFieldValue("region", "");
              setFieldValue("area", "");
              setFieldValue("territory", "");
              setGridData && setGridData([]);
              if (valueOption && region !== false) {
                getRegionAreaTerritory({
                  channelId: valueOption?.value,
                  setter: setRegionList,
                  setLoading: setLoading,
                  value: "regionId",
                  label: "regionName",
                });
              }
              onChange &&
                onChange({ ...values, channel: valueOption }, "channel");
            }}
            placeholder="Select Distribution Channel"
            isDisabled={channelDisable}
          />
        </div>
      )}
      {region !== false && (
        <div className={col}>
          <NewSelect
            name="region"
            options={regions}
            value={values?.region}
            label="Region"
            onChange={(valueOption) => {
              setFieldValue("region", valueOption);
              setFieldValue("area", "");
              setFieldValue("territory", "");
              if (valueOption && valueOption?.value !== 0) {
                getRegionAreaTerritory({
                  channelId: values?.channel?.value,
                  regionId: valueOption?.value,
                  setter: setAreaList,
                  setLoading: setLoading,
                  value: "areaId",
                  label: "areaName",
                });
              }
              onChange &&
                onChange({ ...values, region: valueOption }, "region");
            }}
            placeholder="Region"
            isDisabled={!values?.channel || regionDisable}
          />
        </div>
      )}

      {area !== false && (
        <div className={col}>
          <NewSelect
            name="area"
            options={areas}
            value={values?.area}
            label="Area"
            onChange={(valueOption) => {
              setFieldValue("area", valueOption);
              setFieldValue("territory", "");
              if (valueOption && valueOption?.value !== 0) {
                getRegionAreaTerritory({
                  channelId: values?.channel?.value,
                  regionId: values?.region?.value,
                  areaId: valueOption?.value,
                  setter: setTerritoryList,
                  setLoading: setLoading,
                  value: "territoryId",
                  label: "territoryName",
                });
              }
              onChange && onChange({ ...values, area: valueOption }, "area");
            }}
            placeholder="Area"
            isDisabled={!values?.region || areaDisable}
          />
        </div>
      )}

      {territory !== false && (
        <div className={col}>
          <NewSelect
            name="territory"
            options={territories}
            value={values?.territory}
            label="Territory"
            onChange={(valueOption) => {
              setFieldValue("territory", valueOption);
              getRegionAreaTerritory({
                channelId: values?.channel?.value,
                regionId: values?.region?.value,
                areaId: values?.area?.value,
                territoryId: valueOption?.value,
                setter: setZoneList,
                setLoading: setLoading,
                value: "zoneId",
                label: "zoneName",
              });
              onChange &&
                onChange({ ...values, territory: valueOption }, "territory");
            }}
            placeholder="Territory"
            isDisabled={!values?.area || territoryDisable}
          />
        </div>
      )}
      {zone && (
        <div className={col}>
          <NewSelect
            name="zone"
            options={zones}
            value={values?.zone}
            label="Zone"
            onChange={(valueOption) => {
              setFieldValue("zone", valueOption);
              onChange && onChange({ ...values, zone: valueOption }, "zone");
            }}
            placeholder="Zone"
            isDisabled={zoneDisable}
          />
        </div>
      )}
    </>
  );
};

export default RATForm;
