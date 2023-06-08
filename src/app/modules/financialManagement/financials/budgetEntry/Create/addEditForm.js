/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState, useCallback } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  getFinYearDDLAction,
  getGLDDL,
  getSBUDDL,
  saveBudgetEntry,
} from "../helper";
import { toast } from "react-toastify";
import { excelFileToArray } from "./excelFileToJSON";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

let initData = {
  sbu: "",
  type: "",
  gl: "",
  financialYear: "",
  fromDate: "",
  toDate: "",
  amount: "",
};

export function BudgetEntryCreate() {
  const [isDisabled, setDisabled] = useState(false);
  const { sbuId, sbuIdView, monthId, yearId } = useParams();
  const [
    singleData,
    getSingleData,
    singleDataLoading,
    setSingleData,
  ] = useAxiosGet();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([]);
  const [finYear, setFinYear] = useState([]);
  const [monthlyData, setMonthlyData] = useState([]);

  const date = new Date();
  const year = date.getFullYear();

  const typeDDL = [
    {
      value: 1,
      label: "Yearly by Month",
    },
  ];

  const saveHandler = async (values, cb) => {
    if (rowDtoTwo.length < 1) return toast.warn("Please add at least one row");

    let newData = [];

    if (sbuId) {
      newData = rowDtoTwo?.map((item) => ({
        sbuid: item?.sbu?.value,
        generalLedgerId: item?.gl?.value,
        generalLedgerName: item?.gl?.label,
        generalLedgerCode: item?.gl?.code || "",
        fromDate: item?.fromDate,
        toDate: item?.toDate,
        financialYear: item?.financialYear?.label,
        year: item?.intYear,
        amount: +item?.amount || 0,
        actionById: profileData?.userId,
        isCreate: false,
      }));
    } else {
      rowDtoTwo.forEach((item) => {
        item.rowDto.forEach((itemTwo) => {
          let obj = {
            sbuid: item?.sbu?.value,
            generalLedgerId: item?.gl?.value,
            generalLedgerName: item?.gl?.label,
            generalLedgerCode: item?.gl?.code || "",
            fromDate: itemTwo?.fromDate,
            toDate: itemTwo?.toDate,
            financialYear: item?.financialYear?.label,
            year: year,
            amount: +itemTwo?.amount || 0,
            actionById: profileData?.userId,
            isCreate: true,
          };

          if (itemTwo?.amount > 0) {
            newData.push(obj);
          }
        });
      });
    }

    saveBudgetEntry(newData, setDisabled, cb, true);
  };

  const reload = () => {
    setTimeout(() => {
      window.location.reload();
    }, 2000);
  };

  const fileUpload = async (file, values) => {
    if (!values?.sbu || !values?.financialYear) {
      reload();
      return toast.warn("Please Select Financial Year and SBU, then try again");
    }

    let isValid = true;
    const data = await excelFileToArray(file, "BudgetFinancial");
    console.log("data", data);
    let newData = data.map((item) => {
      if (
        !item?.GeneralLedgerName ||
        !item?.GeneralLedgerCode ||
        !item?.FromDate ||
        !item?.ToDate ||
        !item?.Amount
      ) {
        isValid = false;
      }
      return {
        sbuid: values?.sbu?.value,
        generalLedgerId: null,
        generalLedgerName: item?.GeneralLedgerName,
        generalLedgerCode: `${item?.GeneralLedgerCode}`,
        fromDate: _dateFormatter(item?.FromDate),
        toDate: _dateFormatter(item?.ToDate),
        financialYear: values?.financialYear?.label,
        year: year,
        amount: +item?.Amount || 0,
        actionById: profileData?.userId,
        isCreate: true,
      };
    });

    if (!isValid) {
      reload();
      return toast.warn("Please enter all fields in excel file");
    }

    const cb = () => {
      reload();
    };
    saveBudgetEntry(newData, setDisabled, cb, true);
  };

  const [objProps, setObjprops] = useState({});

  const [SBUDDL, setSBUDDL] = useState([]);
  const [GLDDL, setGLDDL] = useState([]);

  const rowDtoHandler = (name, index, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const totalAmount = useCallback(
    rowDto.reduce((acc, item) => +acc + +item?.amount, 0),
    [rowDto]
  );

  const addButtonHandler = (values) => {
    if (
      (!values?.sbu ||
        !values?.gl ||
        !values?.type ||
        !values?.financialYear) &&
      values?.type?.label === "Yearly by Month"
    )
      return toast.warn("Please select all fields", { toastId: "toastId" });
    if (
      (!values?.sbu ||
        !values?.gl ||
        !values?.type ||
        !values?.financialYear ||
        !values?.fromDate ||
        !values?.toDate) &&
      values?.type?.label === "Custom"
    )
      return toast.warn("Please select all fields", { toastId: "toastId" });

    let amount = sbuId ? values?.amount : totalAmount;

    if (amount < 1)
      return toast.warn("Total amount should be greater than zero", {
        toastId: "toastId",
      });

    const found = rowDtoTwo.filter(
      (item) => item?.gl?.label === values?.gl?.label
    );
    if (found.length > 0)
      return toast.warn("Already exists general ledger", { toastId: "toast" });

    let obj = {
      gl: values?.gl,
      financialYear: values?.financialYear,
      sbu: values?.sbu,
      fromDate: sbuId ? values?.fromDate : rowDto?.[0]?.fromDate,
      toDate: sbuId ? values?.toDate : rowDto[11]?.fromDate,
      amount: amount,
      rowDto,
    };

    setRowDtoTwo([...rowDtoTwo, obj]);
  };

  const remover = (ind) => {
    const data = rowDtoTwo.filter((item, index) => index !== ind);
    setRowDtoTwo(data);
  };

  useEffect(() => {
    getSBUDDL(profileData?.accountId, selectedBusinessUnit?.value, setSBUDDL);
    getGLDDL(selectedBusinessUnit?.value, setGLDDL);
    getFinYearDDLAction(selectedBusinessUnit?.value, setFinYear);
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (sbuId || sbuIdView) {
      getSingleData(
        `/fino/FinancialStatement/BudgetDetalisView?sbuId=${sbuId ||
          sbuIdView}&monthId=${monthId}&yearId=${yearId}`,
        (data) => {
          let modifiedRow = data.map((item) => ({
            fromDate: _dateFormatter(item?.dteFromDate),
            toDate: _dateFormatter(item?.dteToDate),
            gl: {
              value: item?.intGeneralLedgerId,
              label: item?.strGeneralLedgerName,
              code: item?.strGeneralLedgerCode,
            },
            amount: item?.numAmount,
            sbu: { value: item?.intSbuId, label: item?.strSbuname },
            financialYear: {
              value: item?.intFinancialYear,
              label: item?.strFinancialYear,
            },
            intYear: item?.intYear,
          }));
          setRowDtoTwo(modifiedRow);
          setSingleData({
            type: { value: 1, label: "Yearly by Month" },
            fromDate: modifiedRow?.[0]?.fromDate,
            toDate: modifiedRow?.[0]?.toDate,
            sbu: modifiedRow?.[0]?.sbu,
            financialYear: modifiedRow?.[0]?.financialYear,
          });
        }
      );
    }
  }, [sbuId, sbuIdView]);

  return (
    <IForm
      title={`${sbuId ? "Edit" : sbuIdView ? "View" : "Create"} Budget Entry`}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={sbuIdView}
      isHiddenReset={sbuIdView}
    >
      {(isDisabled || singleDataLoading) && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          SBUDDL={SBUDDL}
          typeDDL={typeDDL}
          initData={initData}
          saveHandler={saveHandler}
          setRowDto={setRowDto}
          rowDto={rowDto}
          monthlyData={monthlyData}
          rowDtoHandler={rowDtoHandler}
          GLDDL={GLDDL}
          addButtonHandler={addButtonHandler}
          totalAmount={totalAmount}
          rowDtoTwo={rowDtoTwo}
          setRowDtoTwo={setRowDtoTwo}
          remover={remover}
          fileUpload={fileUpload}
          finYear={finYear}
          setMonthlyData={setMonthlyData}
          sbuIdView={sbuIdView}
          monthId={monthId}
          sbuId={sbuId}
          singleData={singleData}
        />
      </div>
    </IForm>
  );
}
