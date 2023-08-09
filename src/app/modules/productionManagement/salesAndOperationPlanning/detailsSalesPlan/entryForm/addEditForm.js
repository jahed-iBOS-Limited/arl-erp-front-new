/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import {
  editSalesPlanning,
  getPlantDDL,
  getSalesPlanById,
  saveItemRequest,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  plant: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  year: "",
  horizon: "",
  startDate: "",
  endDate: "",
  itemName: "",
  qty: "",
  planningHorizonId: "",
  monthId: "",
  itemId: "",
  itemPlanQty: "",
};
export default function DetailsSalesPlanEntry({
  history,
  match: {
    params: { id },
  },
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState({});
  const [objProps, setObjprops] = useState({});

  // DDL state
  const [plantDDL, setPlantDDL] = useState([]);
  const [channelDDL, getChannelDDL] = useAxiosGet();
  const [regionDDL, getRegionDDL, , setRegionDDL] = useAxiosGet();
  const [areaDDL, getAreaDDL, , setAreaDDL] = useAxiosGet();
  const [territoryDDL, getTerritoryDDL, , setTerritoryDDL] = useAxiosGet();
  const [yearDDL, setYearDDL] = useState([]);
  const [horizonDDL, setHorizonDDL] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState([]);

  const [numItemPlanQty, setNumItemPlanQty] = useState(0);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    if (id) {
      getSalesPlanById(params?.id, setSingleData, setRowDto);
    }
  }, [params?.id]);

  // api useEffect
  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
    getChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${profileData?.accountId}&BUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);

  const createSalesPlanItem = () => {
    let itemData = [];
    for (let i = 0; i < rowDto?.data?.length; i++) {
      if (rowDto.data[i].itemPlanQty > 0) {
        itemData.push({
          ...rowDto.data[i],
          intDetailSalesPlanRowId: 0,
          intSalesPlanId: location?.state?.monthlyItem?.salesPlanId,
          intDetailSalesPlanId: 0,
          intItemId: rowDto.data[i]?.itemId,
          strItemName: rowDto.data[i]?.itemName,
          intUoMid: rowDto.data[i]?.uomid,
          numItemPlanQty: rowDto.data[i].entryItemPlanQty,
          numEntryItemPlanQty: 0,
          numRate: id
            ? (+rowDto.data[i].entryItemPlanQty || 0) *
              (+rowDto.data[i].rate || 0)
            : (+rowDto.data[i].itemPlanQty || 0) * (+rowDto.data[i].rate || 0),
          intBomid: rowDto.data[i]?.isMultiple ? rowDto.data[i].bom?.value : 0,
          strBomname: rowDto.data[i]?.isMultiple
            ? rowDto.data[i].bom?.label
            : rowDto.data[i]?.bomname,
          isActive: true,
        });
      }
    }
    return itemData;
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      if (params?.id) {
        // eslint-disable-next-line no-unused-vars

        const payload = {
          header: {
            salesPlanId: location?.state?.monthlyItem?.salesPlanId,
            actionBy: profileData?.userId,
          },
          row: await rowDto.data?.map((item) => {
            return {
              ...item,
              itemPlanQty: item?.entryItemPlanQty,
            };
          }),
        };
        editSalesPlanning(payload);
      } else {
        const payload = {
          header: {
            intDetailSalesPlanId:
              location?.state?.monthlyItem?.detailSalesPlanId || 0, // bind from location details table
            intSalesPlanId: location?.state?.monthlyItem?.salesPlanId,
            intPlanningHorizonId: location?.state?.monthlyItem?.horizonId,
            intPlanningHorizonRowId:
              location?.state?.monthlyItem?.planningHorizonRowId,
            dteStartDateTime: values?.startDate,
            dteEndDateTime: values?.endDate,
            intYearId: values?.year?.value,
            intMonthId: values?.horizon?.value,
            intAccountId: profileData?.accountId,
            intBusinessUnitId: selectedBusinessUnit?.value,
            intPlantId: values?.plant?.value,
            intDistributionChannelId: values?.channel?.value || 0,
            strDistributionChannelName: values?.channel?.label || "",
            intRegoinId: values?.region?.value || 0,
            strRegionName: values?.region?.label || "",
            intAreaId: values?.area?.value || 0,
            strAreaName: values?.area?.label || "",
            intTeritoryId: values?.territory?.value || 0,
            strTeritoryName: values?.territory?.label || "",
            isProductionPlanned: false, // bind from location details table
            intActionBy: profileData?.userId,
            isMrp: false, // bind from location details table
          },
          row: createSalesPlanItem(),
        };

        if (rowDto?.length === 0) {
          toast.warning("Please add Item and quantity");
        } else {
          saveItemRequest(payload);
          cb();
        }
      }
    }
  };

  const remover = (index) => {
    let filterArr = rowDto?.data?.filter((item, id) => id !== index);
    setRowDto({
      ...rowDto,
      data: [...filterArr],
    });
  };

  const dataHandler = (name, item, value, setRowDto, rowDto) => {
    item[name] = value;
    setRowDto({ ...rowDto });
  };

  return (
    <IForm
      title={params?.id ? " Sales Plan" : "Sales Plan Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.id
            ? singleData
            : {
                ...initData,
                ...location?.state?.monthlyValues,
                horizon: {
                  value: location?.state?.monthlyItem?.horizonId,
                  label: location?.state?.monthlyItem?.horizonName,
                  planningHorizonRowId:
                    location?.state?.monthlyItem?.planningHorizonRowId,
                },
                startDate: _dateFormatter(
                  location?.state?.monthlyItem?.startDate
                ),
                endDate: _dateFormatter(location?.state?.monthlyItem?.endDate),
              }
        }
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        location={location}
        plantDDL={plantDDL}
        yearDDL={yearDDL}
        setYearDDL={setYearDDL}
        itemNameDDL={itemNameDDL}
        setItemNameDDL={setItemNameDDL}
        horizonDDL={horizonDDL}
        setHorizonDDL={setHorizonDDL}
        numItemPlanQty={numItemPlanQty}
        setNumItemPlanQty={setNumItemPlanQty}
        id={params?.id}
        dataHandler={dataHandler}
        channelDDL={channelDDL}
        regionDDL={regionDDL}
        areaDDL={areaDDL}
        territoryDDL={territoryDDL}
        getRegionDDL={getRegionDDL}
        setRegionDDL={setRegionDDL}
        getAreaDDL={getAreaDDL}
        setAreaDDL={setAreaDDL}
        getTerritoryDDL={getTerritoryDDL}
        setTerritoryDDL={setTerritoryDDL}
      />
    </IForm>
  );
}
