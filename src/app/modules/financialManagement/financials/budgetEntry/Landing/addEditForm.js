/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";
import { getBudgetEntryLanding, getFinYearDDLAction } from "../helper";
import Loading from "../../../../_helper/_loading";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

let initData = {
  financialYear: "",
  sbu: "",
};

export function BudgetEntryLanding() {
  const history = useHistory();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [finYear, setFinYear] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [loader, setLoader] = useState(false);
  const [sbu, getSbu, sbuLoading] = useAxiosGet();

  useEffect(() => {
    getSbu(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`
    );
    getFinYearDDLAction(selectedBusinessUnit?.value, setFinYear);
  }, [selectedBusinessUnit]);

  useEffect(() => {
    if (sbu?.[0]?.value && finYear?.[0]?.value) {
      getBudgetEntryLanding(
        sbu?.[0]?.value,
        finYear?.[0]?.value,
        setLoader,
        setRowDto
      );
    }
  }, [sbu, finYear]);

  

  return (
    <ICustomCard
      title={"Budget Entry"}
      createHandler={() =>
        history.push(`/financial-management/financials/budget-entry/create`)
      }
    >
      <div className="mt-0">
        {(loader || sbuLoading) && <Loading />}
        <Form
          rowDto={rowDto}
          initData={initData}
          sbu={sbu}
          setLoader={setLoader}
          setRowDto={setRowDto}
          finYear={finYear}
        />
      </div>
    </ICustomCard>
  );
}
