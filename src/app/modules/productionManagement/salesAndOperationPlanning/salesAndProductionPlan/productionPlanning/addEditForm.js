/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import Loading from "./../../../../_helper/_loading";
import {
  getPlantDDL,
  createProductionEntry,
  getProductionPlanning,
} from "../helper";
import { toast } from "react-toastify";

const initData = {
  plant: "",
  year: "",
  horizon: "",
  startDate: "",
  endDate: "",
  itemName: "",
  qty: "",
  planningHorizonId: "",
  monthId: "",
  itemPlanQty: "",
};
export default function ProductionPlanningForm({
  history,
  match: {
    params: { id },
  },
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [gridData, setGridData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState({});
  // DDL state
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [horizonDDL, setHorizonDDL] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const params = useParams();
  const location = useLocation();
  useEffect(() => {
    if (id) {
      // getPurchaseRequestbyId(id, setSingleData, setDisabled);
    }
  }, [id]);
  // api useEffect
  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
    // getYearDDL(setYearDDL);
  }, []);

  const inputHandler = (item, value, name, rowDto, setRowDto) => {
    item[name] = value;
    setRowDto([...rowDto]);
  };

  const saveHandler = (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      const payload = {
        objHeader: {
          salesPlanId: +params?.salesPlanId,
          monthId: values?.horizon.value,
          yearId: singleData?.year.value,
          startDateTime: values?.startDate,
          endDateTime: values?.endDate,
          accountId: +profileData?.accountId,
          plantId: values?.plant?.value,
          businessUnitId: +selectedBusinessUnit?.value,
          isActive: true,
          actionBy: +profileData?.userId,
        },
        objRow: gridData,
        // objRow: [
        //   {
        //     "itemId": 0,
        //     "itemName": "string",
        //     "uoMid": 0,
        //     "productionPlanQty": 0,
        //     "rate": 0,
        //     "isActive": true
        //   }
        // ],
      };
      createProductionEntry(payload, cb);
    }
  };

  useEffect(() => {
    var rowData = [];
    for (let i = 0; i < rowDto.length; i++) {
      rowData.push({
        itemId: rowDto[i].itemId,
        itemName: rowDto[i].itemName,
        uoMid: rowDto[i].uoMid,
        productionPlanQty: +rowDto[i].productionPlanningQty || 0,
        rate: 0,
        isActive: true,
        productionPlanningRowId: +rowDto[i].productionPlanningRowId || 0,
      });
    }
    setGridData(rowData);
  }, [rowDto]);

  useEffect(() => {
    getProductionPlanning(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      params?.plantId,
      params?.salesPlanId,
      setSingleData,
      setRowDto
    );
  }, [params?.plantId, params?.salesPlanId]);

  const [objProps, setObjprops] = useState({});

  const remover = (index) => {
    const data = [...rowDto];
    data[index].isActive = false;
    setRowDto(data);
  };
  const rowDtoHandler = (values) => {
    const findDuplicate = rowDto?.find(
      (item) => item?.itemId === values?.itemName?.value
    );
    if (findDuplicate) {
      toast.warning("Item already added");
    } else {
      let rowDataValues = {
        itemId: values?.itemName?.value,
        itemName: values?.itemName?.label,
        uoMid: values?.itemName?.baseUomid,
        numItemPlanQty: values?.qty,
        numRate: 0,
      };
      setRowDto([...rowDto, rowDataValues]);
    }
  };

  return (
    <IForm
      title={params?.id ? "Production Plan Edit" : "Production Plan Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.plantId && params?.salesPlanId ? singleData : initData
        }
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        singleData={singleData}
        setRowDto={setRowDto}
        remover={remover}
        location={location}
        plantDDL={plantDDL}
        yearDDL={yearDDL}
        rowDtoHandler={rowDtoHandler}
        itemNameDDL={itemNameDDL}
        setItemNameDDL={setItemNameDDL}
        horizonDDL={horizonDDL}
        setHorizonDDL={setHorizonDDL}
        inputHandler={inputHandler}
      />
    </IForm>
  );
}
