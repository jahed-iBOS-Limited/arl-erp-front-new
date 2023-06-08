/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import {
  getBudgetEntryLanding,
  getBudgetTypeDDLAction,
  getFinYearDDLAction,
} from "../helper";
import Form from "./form";

let initData = {
  financialYear: "",
  budgetType: "",
};

export function BudgetEntryLanding() {
  const dispatch = useDispatch();

  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const { internalControlBudgetInitData: localStorageData } = useSelector(
    (state) => state.localStorage
  );

  const [finYear, setFinYear] = useState([]);
  const [budgetTypeDDL, setBudgetTypeDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);

  useEffect(() => {
    getFinYearDDLAction(selectedBusinessUnit?.value, setFinYear);
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getBudgetTypeDDLAction(setBudgetTypeDDL);
  }, [selectedBusinessUnit]);

  useEffect(() => {
    getBudgetEntryLanding(
      localStorageData?.financialYear?.label,
      localStorageData?.budgetType?.value,
      selectedBusinessUnit?.value,
      setLoader,
      setRowDto
    );
  }, [selectedBusinessUnit]);

  return (
    <div className="mt-0">
      {loader && <Loading />}
      <Form
        rowDto={rowDto}
        initData={initData}
        setLoader={setLoader}
        setRowDto={setRowDto}
        dispatch={dispatch}
        localStorageData={localStorageData}
        budgetTypeDDL={budgetTypeDDL}
        buId={selectedBusinessUnit?.value}
        finYear={finYear}
      />
    </div>
  );
}
