import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import Loading from "../../../../_helper/_loading";
import { getMonth } from "../../../report/salesanalytics/utils";
import Form from "./form";
import { useLocation } from "react-router";

const initData = {
  year: "",
  month: "",
  salesman: "",
  designation: "",
  channel: "",
  region: "",
  area: "",
  territory: "",
  monthYear: "",
  totalPlanTaka: "",
  workingDays: "",
};

export default function MonthlyCollectionPlanEntryForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [loading, setLoading] = useState(false);
  const [objProps] = useState({});
  const [singleData] = useState({});
  const [rowData, setRowData] = useState([]);
  const [, postData, isLoading] = useAxiosPost();
  const location = useLocation();
  const { landingValues } = location || {};
  const [dailyCollectionData, setDailyCollectionData] = useState([]);
  const [, onSave, loadar] = useAxiosPost();
  const [monthlyCollectionData, setMonthlyCollectionData] = useState([]);

  // get user data from store
  const {
    profileData: {
      accountId: accId,
      userId,
      employeeFullName: fullName,
      employeeId: empId,
      designationName,
      designationId,
    },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (!type || type !== "view") {
    }
  }, [accId, buId, type]);

  const saveHandler = async (values, cb) => {
    if ([1].includes(landingValues?.type?.value)) {
      const selectedRow = dailyCollectionData?.filter(
        (item) => item?.isSelected
      );
      if (!selectedRow.length) {
        return toast.warn("Select at least one row");
      }

      const payload = selectedRow?.map((item) => ({
        collectionPlanId: 0,
        accountId: accId,
        businessUnitId: buId,
        salesManId: empId,
        targetDate: item?.date,
        salesManeName: fullName,
        areaId: values?.area?.value,
        areaName: values?.area?.label,
        totalAmount: item?.targetAmount,
        actionBy: userId,
      }));

      onSave(
        `/oms/CustomerSalesTarget/DailyCollectionPlanEntry?typeId=3&typeName=${`AreaBaseDailyCollectionPlan`}`,
        payload,
        () => {
          setDailyCollectionData([]);
        },
        true
      );
    } else if ([4].includes(landingValues?.type?.value)) {
      const selectedRow = monthlyCollectionData?.filter(
        (item) => item?.isSelected
      );
      if (!selectedRow.length) {
        return toast.warn("Select at least one row");
      }

      const payload = selectedRow?.map((item) => ({
        collectionPlanId: 0,
        accountId: accId,
        businessUnitId: buId,
        monthId: item?.monthId,
        monthName: item?.monthName,
        yearId: values?.year?.value,
        actionBy: userId,
        budgetedSalesQnt: item?.budgetedSalesQnt || 0,
        budgetedSalesAmount: item?.budgetedSalesAmount,
      }));

      onSave(
        `/oms/CustomerSalesTarget/CreateMonthlySalesCollectionNBudgetPlan?typeId=2&typeName=MonthlyBudgetedSales`,
        payload,
        () => {
          setMonthlyCollectionData([]);
        },
        true
      );
    } else {
      const selectedItems = rowData?.filter((item) => item?.isSelected);
      if (selectedItems?.length < 1) {
        return toast.warn("Please select at least one row!");
      }
      const check = selectedItems.filter(
        (item) => !(item?.week1 && item?.week2 && item?.week3 && item?.week4)
      );
      if (check?.length > 0) {
        return toast.warn("Please fill up all the fields of selected rows!");
      }
      const payload = selectedItems?.map((item) => {
        return {
          accountId: accId,
          businessUnitId: buId,
          yearId: values?.year?.value,
          monthId: values?.month?.value,
          monthName: getMonth(values?.month?.value),
          salesManId: values?.salesman?.value,
          salesManeName: values?.salesman?.label,
          customerId: item?.intBusinessPartnerId,
          customerName: item?.strBusinessPartnerName,
          areaId: values?.area?.value,
          areaName: values?.area?.label,
          territoryId: values?.territory?.value,
          territoryName: values?.territory?.label,
          totalDues: +item?.dueAmount,
          overDue: +item?.overDue,
          overDuePercentage: +item?.od || 0,
          week1: item?.week1,
          week2: item?.week2,
          week3: item?.week3,
          week4: item?.week4,
          totalAmount: +item?.total,
          collectionPercentage: +item?.percent || 0,
          actionBy: userId,
        };
      });
      postData(
        `/oms/CustomerSalesTarget/CreateMonthlySalesCollectionNBudgetPlan?typeId=1&typeName=MonthlyCollectionPlan`,
        payload,
        () => {
          cb();
        },
        true
      );
    }
  };

  const rowDataHandler = (name, i, value) => {
    let _data = [...rowData];
    _data[i][name] = +value;
    const total =
      name === "week1"
        ? +value + Number(_data[i].week2) + +_data[i].week3 + +_data[i].week4
        : name === "week2"
        ? +value + +_data[i].week1 + +_data[i].week3 + +_data[i].week4
        : name === "week3"
        ? +value + +_data[i].week1 + +_data[i].week2 + +_data[i].week4
        : name === "week4"
        ? +value + +_data[i].week1 + +_data[i].week3 + +_data[i].week2
        : 0;
    const percent = _fixedPoint(
      (total / (+_data[i].dueAmount || 10)) * 100,
      true,
      3
    );
    _data[i].total = total;
    _data[i].percent = percent;

    setRowData(_data);
  };

  const allSelect = (value) => {
    let _data = [...rowData];
    const modify = _data.map((item) => {
      return {
        ...item,
        isSelected: value,
      };
    });
    setRowData(modify);
  };

  const selectedAll = () => {
    return rowData?.length > 0 &&
      rowData?.filter((item) => item?.isSelected)?.length === rowData?.length
      ? true
      : false;
  };

  const title = [1].includes(landingValues?.type?.value)
    ? `Daily Collection Plan`
    : `${
        type === "view" ? "View" : type === "edit" ? "Edit" : "Enter"
      } Monthly Collection Plan`;

  return (
    <>
      {(loading || isLoading || loadar) && <Loading />}
      <Form
        {...objProps}
        type={type}
        accId={accId}
        buId={buId}
        setLoading={setLoading}
        history={history}
        title={title}
        rowData={rowData}
        setRowData={setRowData}
        selectedAll={selectedAll}
        allSelect={allSelect}
        saveHandler={saveHandler}
        rowDataHandler={rowDataHandler}
        initData={
          id
            ? singleData
            : {
                ...initData,
                salesman: {
                  value: empId,
                  label: fullName,
                },
                designation: {
                  value: designationId,
                  label: designationName,
                },
              }
        }
        landingValues={landingValues}
        dailyCollectionData={dailyCollectionData}
        setDailyCollectionData={setDailyCollectionData}
        userId={userId}
        monthlyCollectionData={monthlyCollectionData}
        setMonthlyCollectionData={setMonthlyCollectionData}
      />
    </>
  );
}
