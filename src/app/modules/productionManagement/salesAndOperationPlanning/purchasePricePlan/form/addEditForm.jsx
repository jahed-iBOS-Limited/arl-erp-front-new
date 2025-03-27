

import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import {
  editSalesPlanning,
  getSalesPlanById,
  saveItemRequest,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import Form from "./form";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { getPlantDDL } from "../../../../_helper/_commonApi";

const initData = {
  plant: "",
  fiscalYear: "",
  horizon: "",
  startDate: "",
  endDate: "",
};
export default function PurchasePlanCreateForm({
  history,
  match: {
    params: { id },
  },
}) {

  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, getRowDto, rowDtoLoading, setRowDto] = useAxiosGet();
  // const [salesPlanData, setSalesPlanData] = useState([]);


  const [singleData, setSingleData] = useState({});
  const [objProps, setObjprops] = useState({});

  const [plantDDL, setPlantDDL] = useState([]);
  const [yearDDL, setYearDDL] = useState([]);
  const [horizonDDL, setHorizonDDL] = useState([]);

  const [numItemPlanQty, setNumItemPlanQty] = useState(0);
  const [fiscalYearDDL, getFiscalYearDDL] = useAxiosGet();

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [loading, setLoading] = useState(false);

  const params = useParams();
  const location = useLocation();
  // useEffect(() => {
  //   if (id) {
  //     getSalesPlanById(params?.id, setSingleData, setRowDto);
  //   }
  // }, [params?.id]);

  // api useEffect
  useEffect(() => {
    getPlantDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPlantDDL
    );
    getFiscalYearDDL(`/vat/TaxDDL/FiscalYearDDL`);
  }, []);

  const saveHandler = (values, cb) => {
    if (rowDto?.length === 0) {
      toast.warning("Please add Item and quantity");
    }

    if (values && profileData.accountId && selectedBusinessUnit) {
      if (params?.id) {
        const payload = {
          header: {
            salesPlanId: params?.id,
            actionBy: profileData?.userId,
          },
          row: rowDto.data?.map((item) => ({
            ...item,
            itemPlanQty: item?.purchaseQty,
          })),
        };
        editSalesPlanning(payload, setLoading);
      } else {
        const payload = {
          objHeader: {
            planningHorizonId: 0,
            planningHorizonRowId: 0,
            startDateTime: values?.startDate,
            endDateTime: values?.endDate,
            yearId:
              values?.horizon?.monthId > 6
                ? values?.fiscalYear?.value
                : values?.fiscalYear?.value + 1,
            strFiscalYear: values?.fiscalYear?.label,
            monthId: values?.horizon?.monthId,
            version: "string",
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            plantId: values?.plant?.value,
            actionBy: profileData?.userId,
            purchasePlanId: 0,
            productionPlanned: true,
            isActive: true,
            isMrp: true,
          },
          objRow: rowDto
            ?.filter((item) => +item?.numRate > 0)
            ?.map((item) => ({
              intPurchasePlanRowId: item?.intPurchasePlanRowId || 0,
              intPurchasePlanId: item?.intPurchasePlanId || 0,
              itemId: item?.intItemId,
              itemName: item?.strItemName,
              uoMid: 0,
              itemPlanQty: +item?.purchaseQty || 0,
              entryItemPlanQty: +item?.purchaseQty || 0,
              rate: +item?.numRate || 0,
              bomid: 0,
              bomname: "",
            })),
        };
        if (payload?.objRow?.length > 0) {
          saveItemRequest(payload, cb, setLoading);
        } else {
          toast.warning("You have to add purchase quantity and rate");
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
    // setRowDto([...filterArr]);
  };

  const dataHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  return (
    <IForm
      title={params?.id ? "Procurement Plan" : "Procurement Plan Create"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {(isDisabled || rowDtoLoading || loading) && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        rowDto={rowDto}
        setRowDto={setRowDto}
        getRowDto={getRowDto}
        remover={remover}
        location={location}
        plantDDL={plantDDL}
        yearDDL={yearDDL}
        setYearDDL={setYearDDL}
        horizonDDL={horizonDDL}
        setHorizonDDL={setHorizonDDL}
        numItemPlanQty={numItemPlanQty}
        setNumItemPlanQty={setNumItemPlanQty}
        id={params?.id}
        dataHandler={dataHandler}
        fiscalYearDDL={fiscalYearDDL}
      />
    </IForm>
  );
}
