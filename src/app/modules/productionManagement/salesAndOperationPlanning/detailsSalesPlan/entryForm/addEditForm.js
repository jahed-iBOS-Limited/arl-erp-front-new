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
  profitCenter: "",
};
export default function DetailsSalesPlanEntry() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  const { actionType } = useParams();

  console.log("actionType", actionType);

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
  const [
    profitCenterDDl,
    getProfitCenterDDL,
    profitCenterDDLloader,
  ] = useAxiosGet();

  const [numItemPlanQty, setNumItemPlanQty] = useState(0);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const location = useLocation();
  useEffect(() => {
    if (location?.state?.detailsItem?.intDetailSalesPlanId) {
      getSalesPlanById(
        location?.state?.detailsItem?.plantId,
        location?.state?.detailsItem?.intDetailSalesPlanId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSingleData,
        setRowDto
      );
    }
  }, [location?.state?.detailsItem?.intDetailSalesPlanId]);

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

    getProfitCenterDDL(
      `/fino/CostSheet/ProfitCenterDDL?BUId=${selectedBusinessUnit?.value}`
    );
  }, []);

  const createSalesPlanItem = () => {
    let itemData = [];
    for (let i = 0; i < rowDto?.data?.length; i++) {
      if (actionType === "edit" || rowDto.data[i].itemPlanQty > 0) {
        itemData.push({
          // ...rowDto.data[i],
          intDetailSalesPlanRowId:
            rowDto?.data[i]?.intDetailSalesPlanRowId || 0,
          intSalesPlanId:
            rowDto.data[i]?.salesPlanId ||
            location?.state?.monthlyItem?.salesPlanId,
          intDetailSalesPlanId: rowDto.data[i]?.intDetailSalesPlanId || 0,
          intItemId: rowDto.data[i]?.itemId,
          strItemName: rowDto.data[i]?.itemName,
          intUoMid: rowDto.data[i]?.uomid,
          numItemPlanQty:
            rowDto.data[i].entryItemPlanQty || rowDto.data[i].itemPlanQty,
          numEntryItemPlanQty:
            rowDto.data[i].entryItemPlanQty || rowDto.data[i].itemPlanQty,
          numRate: location?.state?.detailsItem?.intDetailSalesPlanId
            ? (+rowDto.data[i].entryItemPlanQty || 0) *
              (+rowDto.data[i].rate || 0)
            : (+rowDto.data[i].itemPlanQty || 0) * (+rowDto.data[i].rate || 0),
          intBomid: rowDto.data[i]?.isMultiple ? rowDto.data[i].bom?.value : 0,
          strBomname: rowDto.data[i]?.isMultiple
            ? rowDto.data[i].bom?.label
            : rowDto.data[i]?.bomname,
          isActive:
            actionType === "edit" && rowDto.data[i].entryItemPlanQty < 0
              ? false
              : true,
        });
      }
    }
    return itemData;
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      if (location?.state?.detailsItem?.intDetailSalesPlanId) {
        // eslint-disable-next-line no-unused-vars

        const payload = {
          header: {
            detailSalesPlanId: values?.intDetailSalesPlanId,
            salesPlanId: values?.intSalesPlanId,
            actionById: profileData?.userId,
            intProfitCenterId: values?.profitCenter?.value,
          },
          row: createSalesPlanItem(),
        };
        editSalesPlanning(payload);
      } else {
        const payload = {
          header: {
            intProfitCenterId: values?.profitCenter?.value,
            intDetailSalesPlanId:
              location?.state?.detailsItem?.intDetailSalesPlanId || 0,
            intSalesPlanId:
              location?.state?.detailsItem?.salesPlanId ||
              location?.state?.monthlyItem?.salesPlanId,
            intPlanningHorizonId:
              values?.horizon?.value || location?.state?.monthlyItem?.horizonId,
            intPlanningHorizonRowId:
              values?.horizon?.intPlanningHorizonRowId ||
              location?.state?.monthlyItem?.planningHorizonRowId,
            dteStartDateTime: values?.startDate,
            dteEndDateTime: values?.endDate,
            intYearId: values?.year?.label,
            intMonthId: values?.horizon?.monthId,
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
            isProductionPlanned: false,
            intActionBy: profileData?.userId,
            isMrp: false,
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
      title={
        location?.state?.detailsItem?.intDetailSalesPlanId
          ? "Edit Details Sales Plan"
          : "Create Details Sales Plan"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          location?.state?.detailsItem?.intDetailSalesPlanId
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
        id={location?.state?.detailsItem?.intDetailSalesPlanId}
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
        profitCenterDDl={profitCenterDDl}
      />
    </IForm>
  );
}
