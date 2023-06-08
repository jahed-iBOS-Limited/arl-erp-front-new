/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import Loading from "../../../../_helper/_loading";
import {
  getPlantDDL,
  getSalesPlanById,
  editSalesPlanning,
  saveItemRequest,
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
  itemId: "",
  itemPlanQty: "",
};
export default function SalesAndProductionPlanCreateFormView({
  history,
  match: {
    params: { viewId: id },
  },
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [salesPlanData, setSalesPlanData] = useState([]);

  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState({});
  const [objProps, setObjprops] = useState({});

  // DDL state
  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [horizonDDL, setHorizonDDL] = useState([]);
  const [itemNameDDL, setItemNameDDL] = useState([]);

  const [numItemPlanQty, setNumItemPlanQty] = useState(0);
  const [quantityIndex, setQuantityIndex] = useState(0);

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
      getSalesPlanById(params?.viewId, setSingleData, setRowDto);
    }
  }, [params?.viewId]);

  // api useEffect
  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
  }, []);

  const createSalesPlanItem = () => {
    let itemData = [];
    for (let i = 0; i < rowDto?.data?.length; i++) {
      if (rowDto.data[i].itemPlanQty > 0) {
        itemData.push(rowDto.data[i]);
      }
    }
    return itemData;
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData.accountId && selectedBusinessUnit) {
      if (params?.viewId) {
        // eslint-disable-next-line no-unused-vars

        const payload = {
          header: {
            salesPlanId: params?.viewId,
          },
          row: await rowDto.data,
        };
        editSalesPlanning(payload);
      } else {
        const payload = {
          objHeader: {
            planningHorizonId: values?.year?.planningHorizonId,
            planningHorizonRowId: values?.horizon?.value,
            startDateTime: values?.startDate,
            endDateTime: values?.endDate,
            yearId: values?.year?.value,
            monthId: values?.horizon?.value,
            version: "string",
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            plantId: values?.plant?.value,
            actionBy: profileData?.userId,
          },
          objRow: createSalesPlanItem(),
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

  useEffect(() => {
    var rowData = [];
    for (let i = 0; i < rowDto?.length; i++) {
      rowData.push({
        salesPlanRowId: rowDto[i].salesPlanRowId,
        itemId: rowDto[i].itemId,
        itemName: rowDto[i].itemName,
        uoMid: rowDto[i].uoMid,
        itemPlanQty: rowDto[i].itemPlanQty,
        numRate: 0,
      });
    }
    setSalesPlanData(rowData);
  }, [rowDto?.length]);

  const dataHandler = (name, item, value, setRowDto, rowDto) => {
    item[name] = value;
    setRowDto({ ...rowDto });
  };

  return (
    <IForm
      title={"Sales Plan View"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={true}
      isHiddenReset={true}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.viewId ? singleData : initData}
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
        rowDtoHandler={rowDtoHandler}
        itemNameDDL={itemNameDDL}
        setItemNameDDL={setItemNameDDL}
        horizonDDL={horizonDDL}
        setHorizonDDL={setHorizonDDL}
        numItemPlanQty={numItemPlanQty}
        setNumItemPlanQty={setNumItemPlanQty}
        setQuantityIndex={setQuantityIndex}
        id={params?.viewId}
        dataHandler={dataHandler}
      />
    </IForm>
  );
}
