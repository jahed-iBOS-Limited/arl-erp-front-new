import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";

import { getProductionMasterSchedulingPlant, saveItemRequest } from "../helper";

const initData = {
  id: undefined,
  plant: '',
  year: '',
  horizon: ''
};

export default function ProductionMasterSchedulelFrom({
  history,
  match: {
    params: { id },
  },
}) {
  const [rowDto, setRowDto] = useState([]);
  const [shedulingPlantDDL, setShedulingPlantDDL] = useState([]);
  const [shedulingYearDDL, setShedulingYearDDL] = useState({});
  const [shedulingHorizonDDL, setShedulingHorizonDDL] = useState({});
  const [plant, setPlant] = useState("");
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [item, setItem] = useState("");
  const [itemsDDL, setItemsDDL] = useState([]);
  const [workCenters, setWorkCenters] = useState([]);
  const [boMs, setBoMs] = useState([]);
  const [productionPlanQty, setProductionPlanQty] = useState("");
  const [uomId, setUomId] = useState("");
  const [productionPlanningId, setProductionPlanningId] = useState("");
  const [dateData, setDateData] = useState({});
  const params = useParams();

console.log('productionPlanQty: ', productionPlanQty)
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.costControllingUnit?.singleData;
  }, shallowEqual);

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.id) {
      } else {
        const payload = {
          objHeader: {
            productionPlanningId: productionPlanningId,
            startDateTime: dateData.startDate,
            endDateTime: dateData.endDate,
            yearId: values?.year?.value,
            monthId: values?.horizon?.value,
            accountId: profileData?.accountId,
            plantId: values?.plant?.value,
            businessUnitId: selectedBusinessUnit?.value,
            actionBy: profileData?.userId,
          },
          objRow: rowDto,
        };
        if (rowDto.length === 0) {
          toast.warning("Please add Item and quantity");
        } else {
          saveItemRequest(payload);
          cb();
        }
      }
    }
  };


  //Get Master Sheduling Plant DDL
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getProductionMasterSchedulingPlant(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setShedulingPlantDDL
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const remover = (index) => {
    const filterArr = rowDto.filter((item, ind) => ind !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Production Master Schedule"
      getProps={setObjprops}
    >
      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setShedulingYearDDL={setShedulingYearDDL}
        setShedulingHorizonDDL={setShedulingHorizonDDL}
        shedulingPlantDDL={shedulingPlantDDL}
        shedulingYearDDL={shedulingYearDDL}
        shedulingHorizonDDL={shedulingHorizonDDL}
        profileData={profileData}
        plant={plant}
        year={year}
        month={month}
        item={item}
        setPlant={setPlant}
        setYear={setYear}
        setMonth={setMonth}
        setItem={setItem}
        itemsDDL={itemsDDL}
        setItemsDDL={setItemsDDL}
        workCenters={workCenters}
        boMs={boMs}
        productionPlanQty={productionPlanQty}
        setWorkCenters={setWorkCenters}
        setBoMs={setBoMs}
        setProductionPlanQty={setProductionPlanQty}
        remover={remover}
        setUomId={setUomId}
        uomId={uomId}
        setProductionPlanningId={setProductionPlanningId}
        setDateData={setDateData}
      />
    </IForm>
  );
}
