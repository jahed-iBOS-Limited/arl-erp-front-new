/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { useParams, useLocation } from "react-router";
import {
  getDistributionChannelDDL_api,
  getRegionAreaTerritory,
} from "../../../../salesManagement/report/customerSalesTargetReport/helper";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../../_helper/_loading";
import {
  editMarketShareEntry,
  getCompanyList,
  getMarketShareByTerritoryId,
} from "../helper";
import Form from "./form";

const initData = {
  channel: "",
  region: "",
  area: "",
  territory: "",
  month: "",
  year: "",
  company: "",
  salesQty: "",
};

export default function MarketShareEntryForm() {
  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const { id, type } = useParams();
  const { state } = useLocation();
  const [objProps] = useState({});
  const [loading, setLoading] = useState(false);
  const [, postData, isLoading] = useAxiosPost();
  const [singleData, setSingleData] = useState({});
  const [channelList, setChannelList] = useState([]);
  const [regionList, setRegionList] = useState([]);
  const [areaList, setAreaList] = useState([]);
  const [territoryList, setTerritoryList] = useState([]);
  // const [companyList, setCompanyList] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    if (!type || type !== "view") {
      getDistributionChannelDDL_api(accId, buId, setChannelList);
      getCompanyList(buId, setRowData, setLoading);
    }
    if (id) {
      getMarketShareByTerritoryId(
        accId,
        buId,
        state?.territoryId,
        setRowData,
        setSingleData,
        setLoading
      );
    }
  }, [accId, buId, type]);

  const rowDtoHandler = (index, key, value) => {
    let _data = [...rowData];
    _data[index][key] = value;
    setRowData(_data);
  };

  const saveHandler = (values, cb) => {
    if (!type) {
      const payload = rowData?.map((item) => {
        return {
          accountId: accId,
          businessUnitId: buId,
          companyId: item?.value,
          companyName: item?.label,
          quantity: +item?.quantity || 0,
          monthId: values?.month?.value,
          yearId: values?.year?.value,
          territoryId: values?.territory?.value,
          totalOutlet: 0,
          akijOutlet: 0,
          coverage: 0,
          sharePerCentage: 0,
          actionby: userId,
        };
      });
      postData(
        `/tms/LigterLoadUnload/CreateMarketShareSalesContribution`,
        payload,
        () => {
          cb();
        },
        true
      );
    } else {
      const payload = rowData?.map((item) => {
        return {
          intId: item?.intId,
          companyId: item?.companyId,
          companyName: item?.companyName,
          quantity: item?.quantity,
          monthId: item?.monthId,
          yearId: item?.yearId,
          territoryId: item?.territoryId,
          totalOutlet: item?.totalOutlet,
          akijOutlet: item?.akijOutlet,
          coverage: item?.coverage,
          sharePerCentage: item?.sharePerCentage,
        };
      });
      editMarketShareEntry(payload, setLoading);
    }
  };

  const onChangeHandler = (fieldName, values, currentValue, setFieldValue) => {
    switch (fieldName) {
      case "channel":
        setFieldValue("channel", currentValue);
        setFieldValue("region", "");
        setFieldValue("area", "");
        setFieldValue("territory", "");
        if (currentValue) {
          getRegionAreaTerritory({
            channelId: currentValue?.value,
            setter: setRegionList,
            setLoading: setLoading,
            value: "regionId",
            label: "regionName",
          });
        }
        break;

      case "region":
        setFieldValue("region", currentValue);
        setFieldValue("area", "");
        setFieldValue("territory", "");
        if (currentValue) {
          getRegionAreaTerritory({
            channelId: values?.channel?.value,
            regionId: currentValue?.value,
            setter: setAreaList,
            setLoading: setLoading,
            value: "areaId",
            label: "areaName",
          });
        }
        break;

      case "area":
        setFieldValue("area", currentValue);
        setFieldValue("territory", "");
        if (currentValue) {
          getRegionAreaTerritory({
            channelId: values?.channel?.value,
            regionId: values?.region?.value,
            areaId: currentValue?.value,
            setter: setTerritoryList,
            setLoading: setLoading,
            value: "territoryId",
            label: "territoryName",
          });
        }
        break;

      default:
        break;
    }
  };

  return (
    <>
      {(loading || isLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          id={id}
          state={state}
          viewType={type}
          rowData={rowData}
          areaList={areaList}
          regionList={regionList}
          setLoading={setLoading}
          saveHandler={saveHandler}
          setAreaList={setAreaList}
          channelList={channelList}
          rowDtoHandler={rowDtoHandler}
          territoryList={territoryList}
          onChangeHandler={onChangeHandler}
          setTerritoryList={setTerritoryList}
          initData={id ? singleData : initData}
        />
      </div>
    </>
  );
}
