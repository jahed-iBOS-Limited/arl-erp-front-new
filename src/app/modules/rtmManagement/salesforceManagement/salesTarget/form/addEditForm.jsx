/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";
import IForm from "./../../../../_helper/_form";
import { getMonthDDL } from "./../../../accountReceivable/outletBillProcess/helper";
import { editSalesTargetSetup, getTerritoryTypeDDL } from "./../helper";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { toast } from "react-toastify";
import { createSalesTargetSetup } from "./../helper";
import { YearDDL } from "../../../../_helper/_yearDDL";

const initData = {
  territoryType: "",
  territory: "",
  route: "",
  parentTerritory: "",
  parentTerritoryId: "",
  targetMonth: "",
  targetYear: "",
  fromDate: "",
  toDate: "",
  chanel: "",
  region: "",
  area: "",
  point: "",
  section: "",
};

const SalesTargetSetupForm = () => {
  const [isDisabled, setDisabled] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [secondRowData, setSecondRowData] = useState([]);

  // All DDL
  const [territoryTypeDDL, setTerritoryTypeDDL] = useState([]);
  const [territoryDDL, setTerritoryDDL] = useState([]);
  const [targetMonthDDL, setTargetMonthDDL] = useState([]);
  const [targetYearDDL, setTargetYearDDL] = useState([]);
  const [routeDDL, setRouteDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // Fetch All DDL
  useEffect(() => {
    getMonthDDL(setTargetMonthDDL);
    getTerritoryTypeDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setTerritoryTypeDDL
    );
    setTargetYearDDL(YearDDL());
  }, [profileData?.accountId && selectedBusinessUnit?.value]);

  // All totalAmount Count when row Data updated
  let totalTargetAmount = rowData?.reduce(
    (acc, obj) => obj?.totalAmount + +acc,
    0
  );

  // Save Handler
  const saveHandler = (values, cb) => {
    const modifyPlyload = rowData?.map((itm) => ({
      itemId: itm?.itemId,
      quantity: itm?.quantity,
      price: itm?.price,
      totalAmount: +itm?.caseQty * +itm?.tprate,
      itemCode: itm?.itemCode,
      caseQty: +itm?.caseQty || 0,
      tprate: +itm?.tprate || 0,
      targetId: itm?.targetId || 0,
    }));
    if (rowData?.length > 0) {
      if (totalTargetAmount > 0) {
        let foundData = rowData?.filter((item) => +item?.targetId > 0);

        if (foundData?.length === 0) {
          // Create
          const payload = {
            objCreateHeader: {
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
              targetMonth: values?.targetMonth?.value,
              targetYear: values?.targetYear?.value,
              territoryId: values?.section?.value,
              parentTerritoryId: values?.point?.value,
              actionBy: profileData?.userId,
              currentDate: _todayDate(),
              fromDate: values?.fromDate,
              toDate: values?.toDate,
              routeId: values?.route?.value,
              channelId: values?.chanel?.value,
            },
            objCreateRowList: modifyPlyload,
          };
          createSalesTargetSetup(payload, cb);
        } else {
          // Edit
          const payload = {
            objHeader: {
              accountId: profileData?.accountId,
              businessUnitId: selectedBusinessUnit?.value,
              targetMonth: values?.targetMonth?.value,
              targetYear: values?.targetYear?.value,
              territoryId: values?.section?.value,
              parentTerritoryId: values?.point?.value,
              actionBy: profileData?.userId,
              currentDate: _todayDate(),
              fromDate: values?.fromDate,
              toDate: values?.toDate,
              routeId: values?.route?.value,
              channelId: values?.chanel?.value,
            },
            objRowList: modifyPlyload,
          };
          editSalesTargetSetup(payload);
        }
      } else {
        toast.warning("Please update some quantity", {
          toastId: "Please update some quantity",
        });
      }
    } else {
      toast.warning("Please setup your sales target");
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <>
      <IForm
        title={"Sales Target Setup"}
        getProps={setObjprops}
        isDisabled={isDisabled}
      >
        {isDisabled && <Loading />}
        <Form
          {...objProps}
          initData={initData}
          saveHandler={saveHandler}
          selectedBusinessUnit={selectedBusinessUnit}
          accountId={profileData?.accountId}
          buId={selectedBusinessUnit?.value}
          // All DDL
          territoryTypeDDL={territoryTypeDDL}
          territoryDDL={territoryDDL}
          setTerritoryDDL={setTerritoryDDL}
          targetMonthDDL={targetMonthDDL}
          targetYearDDL={targetYearDDL}
          routeDDL={routeDDL}
          setRouteDDL={setRouteDDL}
          // Other
          totalTargetAmount={totalTargetAmount}
          rowData={rowData}
          setRowData={setRowData}
          secondRowData={secondRowData}
          setSecondRowData={setSecondRowData}
          setDisabled={setDisabled}
        />
      </IForm>
    </>
  );
};

export default SalesTargetSetupForm;
