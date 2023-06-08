/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { getMonthName } from "../../../../_helper/monthIdToMonthName";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { getBudgetEntryGetById, saveBudgetUpdated } from "../helper";
import Form from "./form";

let initData = {
  month: "",
  monthId: "",
  yearId: "",
};

export function BudgetEntryEdit() {
  const [isDisabled, setDisabled] = useState(false);
  const params = useParams();
  const { state } = useLocation();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    if (params?.id) {
      getBudgetEntryGetById(+params?.id, setDisabled, setRowDto);
    }
  }, [params?.id]);

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    const modifyRowData = rowDto.map((item, index) => {
      let nameQty = item?.levelVariableQty;
      let nameAmount = item?.levelVariableAmount;
      return {
        intRowId: item?.intRowId,
        intBudgetId: state?.intBudgetId,
        intElementId: item?.intElementId,
        strElementCode: item?.strElementCode,
        strElementName: item?.strElementName,
        numBudgetQty:
          state?.intBudgetTypeId === 4 ? +item[nameQty] : +item[nameAmount],
        numBudgetValue: +item[nameAmount],
      };
    });

    // const isValueZeroForSales = modifyRowData?.filter(
    //   (itm) => itm?.numBudgetQty <= 0 || itm?.numBudgetValue <= 0
    // );

    // const isValueZeroForOthers = modifyRowData?.filter(
    //   (itm) => itm?.numBudgetValue <= 0
    // );

    let payload = {
      intBudgetId: state?.intBudgetId,
      intBusinessUnitId: selectedBusinessUnit?.value,
      intBudgetTypeId: state?.intBudgetTypeId,
      strBudgetTypeName: state?.strBudgetTypeName,
      strFiscalYear: state?.strFiscalYear,
      intYear: state?.intYear,
      intMonth: state?.intMonth,
      dteFromDate: state?.dteFromDate,
      dteToDate: state?.dteToDate,
      intLastActionBy: profileData?.userId,
      isActive: state?.isActive,
      dteServerDatetime: state?.dteServerDatetime,
      dteLastActionDatetime: state?.dteLastActionDatetime,
      budgetRowDTO: modifyRowData,
    };

    const callback = () => {
      cb();
      getBudgetEntryGetById(+params?.id, setDisabled, setRowDto);
    };

    if (state?.intBudgetTypeId === 4) {
      // if (isValueZeroForSales?.length > 0) {
      //   return toast.warning("Please provide valid number in quantity & value");
      // } else {
      //   saveBudgetUpdated(payload, setDisabled, callback);
      // }
      saveBudgetUpdated(payload, setDisabled, callback);
    } else {
      // if (isValueZeroForOthers?.length > 0) {
      //   return toast.warning("Please provide valid amount");
      // } else {
      //   saveBudgetUpdated(payload, setDisabled, callback);
      // }
      saveBudgetUpdated(payload, setDisabled, callback);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={`Edit Budget Entry of ${getMonthName(state?.intMonth)}, ${
        state?.intYear
      }`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          setRowDto={setRowDto}
          rowDto={rowDto}
          rowDtoHandler={rowDtoHandler}
          buId={selectedBusinessUnit?.value}
          setLoading={setDisabled}
          state={state}
        />
      </div>
    </IForm>
  );
}
