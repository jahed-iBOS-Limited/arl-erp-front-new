/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getBudgetTypeDDLAction,
  saveBudgetCreate,
} from "../helper";
import Form from "./form";

let initData = {
  month: "",
  monthId: "",
  yearId: "",
  budgetType: "",
  costRev: "",
};

export function BudgetEntryCreate() {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(false);
  const { state } = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const { internalControlBudgetInitData: localStorageData } = useSelector(
    (state) => state.localStorage
  );

  const [rowDto, setRowDto] = useState([]);
  const [budgetTypeDDL, setBudgetTypeDDL] = useState([]);

  const typeDDL = [
    {
      value: 1,
      label: "Yearly by Month",
    },
  ];

  const saveHandler = async (values, cb) => {
    if (rowDto?.length <= 0) {
      return toast.warning("Budget List empty!!!");
    }
    const modifyRowData = rowDto.map((item, index) => {
      let nameQty = item?.levelVariableQty;
      let nameAmount = item?.levelVariableAmount;
      return {
        intBudgetId: item?.intBudgetId,
        intBusinessUnitId: selectedBusinessUnit?.value,
        intBudgetTypeId: item?.intBudgetTypeId,
        strBudgetTypeName: item?.strBudgetTypeName,
        strFiscalYear: item?.strFiscalYear,
        intYear: item?.intYear,
        intMonth: item?.intMonth,
        dteFromDate: item?.dteFromDate,
        dteToDate: item?.dteToDate,
        intLastActionBy: profileData?.userId,
        isActive: item?.isActive,
        dteServerDatetime: item?.dteServerDatetime,
        dteLastActionDatetime: item?.dteLastActionDatetime,
        intRowId: item?.intRowId,
        intElementId: item?.intElementId,
        strElementCode: item?.strElementCode,
        strElementName: item?.strElementName,
        intCostRevCenterId: item?.intCostRevCenterId,
        numBudgetQty:
          item?.intBudgetTypeId === 4 ? +item[nameQty] : +item[nameAmount],
        numBudgetValue: +item[nameAmount],
      };
    });

    const filterData = modifyRowData?.filter(
      (itm) => itm?.intRowId <= 0 );

    // const isValueZeroForSales = filterData?.filter(
    //   (itm) => itm?.numBudgetQty <= 0 && itm?.numBudgetValue <= 0
    // );

    // const isValueZeroForOthers = filterData?.filter(
    //   (itm) => itm?.numBudgetValue <= 0
    // );

    if (filterData?.length <= 0) {
      return toast.warning("Budget List Empty");
    }

    if (state?.budgetType?.value === 4) {
      // if (isValueZeroForSales?.length > 0) {
      //   return toast.warning("Please provide valid number in quantity & value");
      // } else {
      //   saveBudgetCreate(filterData, setDisabled, cb);
      // }
      saveBudgetCreate(filterData, setDisabled, cb);
    } else {
      // if (isValueZeroForOthers?.length > 0) {
      //   return toast.warning("Please provide valid amount");
      // } else {
      //   saveBudgetCreate(filterData, setDisabled, cb);
      // }
      saveBudgetCreate(filterData, setDisabled, cb);
    }
  };

  const [objProps, setObjprops] = useState({});

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const totalAmount = useCallback(
    rowDto.reduce((acc, item) => +acc + +item?.amount, 0),
    [rowDto]
  );

  useEffect(() => {
    getBudgetTypeDDLAction(setBudgetTypeDDL);
  }, [selectedBusinessUnit]);

  return (
    <IForm
      title={`Create Budget Entry`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          typeDDL={typeDDL}
          initData={initData}
          saveHandler={saveHandler}
          setRowDto={setRowDto}
          rowDto={rowDto}
          rowDtoHandler={rowDtoHandler}
          totalAmount={totalAmount}
          buId={selectedBusinessUnit?.value}
          setLoading={setDisabled}
          state={state}
          budgetTypeDDL={budgetTypeDDL}
          localStorageData={localStorageData}
          dispatch={dispatch}
        />
      </div>
    </IForm>
  );
}
