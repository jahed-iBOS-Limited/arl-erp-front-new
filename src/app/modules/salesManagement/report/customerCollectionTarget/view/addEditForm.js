/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
// import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import { isUniq } from "../../../../_helper/uniqChecker";
import { getSalesTargetById } from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import ICustomCard from "../../../../_helper/_customCard";

const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "Sepetember" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

var date = new Date(),
  targetYearsDDL = [];

let year = date.getFullYear();
let max = year + 10;

for (var i = year - 10; i <= max; i++) {
  targetYearsDDL.push({ value: i, label: i });
}

export function CustomerSalesTargetViewForm({
  history,
  match: {
    params: { viewid },
  },
}) {
  // eslint-disable-next-line no-unused-vars
  const location = useLocation();

  let initData = {
    targetStartDate: _todayDate(),
    targetEndDate: _todayDate(),
    item: "",
    uom: "",
    quantity: "",
    itemName: "",
    itemCode: "",
  };

  const [isDisabled, setDisabled] = useState(true);
  const [generalLedgerRowDto, setGeneralLedgerRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [singleRowData, setSingleRowData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getSalesTargetById(setSingleData, setSingleRowData, viewid, setDisabled);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getSalesTargetById]);

  const setter = (payload) => {
    if (
      isUniq("generalLedgerId", payload.generalLedgerId, generalLedgerRowDto)
    ) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      setGeneralLedgerRowDto([
        ...generalLedgerRowDto,
        {
          accountId: accountId,
          businessUnitId: businessunitid,
          actionBy: actionBy,
          ...payload,
        },
      ]);
    }
  };

  const remover = (payload) => {
    const filterArr = generalLedgerRowDto.filter(
      (itm) => itm.generalLedgerId !== payload
    );
    setGeneralLedgerRowDto(filterArr);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <ICustomCard
      title="Customer Sales Target"
      backHandler={() => history.goBack()}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <div className="mt-0">
        <Form
          {...objProps}
          initData={viewid ? singleData : initData}
          isEdit={viewid}
          targetYearsDDL={targetYearsDDL}
          profileData={profileData}
          selectedBusinessUnit={selectedBusinessUnit}
          singleRowData={singleRowData}
          generalLedgerRowDto={generalLedgerRowDto}
          disableHandler={disableHandler}
          setter={setter}
          remover={remover}
          monthDDL={monthDDL}
          // isEdit={id || false}
        />
      </div>
    </ICustomCard>
  );
}
