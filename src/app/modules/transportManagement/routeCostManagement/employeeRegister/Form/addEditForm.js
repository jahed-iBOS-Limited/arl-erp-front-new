/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation } from "react-router-dom";
import {
  getExpenseForDDL,
  getSbuDDL,
  getCounteryDDL,
  getCurrencyDDL,
  getProjectNameDDL,
  CreateInternalTripCostTransferToExpRegister,
  getPaymentType,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";
export default function EmployeeRegisterForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const { state } = useLocation();

  const landingGridData = state?.landingData?.data;

  const initData = {
    expenseFor: "",
    sbu: "",
    country: "",
    currency: "",
    expenseCategory: "",
    experiencePeriodFrom: state?.values?.travelDateFrom,
    experiencePeriodTo: state?.values?.travelDateTo,
    costCenter: "",
    projectName: "",
    paymentType: "",
    disbursementCenter: "",
    reference: "",
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [expenseDDL, setExpenseDDL] = useState([]);
  const [sbuDDL, setSbuDDL] = useState([]);
  const [country, setCountry] = useState([]);
  const [currencyDDL, setCurrencyDDL] = useState([]);
  const [projectDDL, setProjectDDL] = useState([]);
  const [paymentType, setPaymentType] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  let TotalExpense = rowDto.reduce((acc, val) => acc + val.totalCost, 0);

  useEffect(() => {
    getExpenseForDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setExpenseDDL
    );
    getSbuDDL(profileData?.accountId, selectedBusinessUnit?.value, setSbuDDL);
    getCounteryDDL(setCountry);
    getCurrencyDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setCurrencyDDL
    );
    getProjectNameDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setProjectDDL
    );
    getPaymentType(setPaymentType);
  }, []);

  useEffect(() => {
    if (landingGridData?.length > 0) {
      setRowDto(landingGridData);
    } else {
      setRowDto([]);
    }
  }, [landingGridData]);
  // remove from rowDto
  const remover = (index) => {
    const filterArr = rowDto.filter((item, ind) => ind !== index);
    setRowDto(filterArr);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
      } else {
        let rowDtoFormet = rowDto.map((data) => {
          return {
            amount: data.totalCost,
            expenseDate: data.shipmentDate,
            expenseLocation: `${data.shipPointAddress} To ${data.partnerAddress}`,
            comments: "",
            shipmentId: data?.shipmentId || 0,
          };
        });
        let payload = {
          objHeader: {
            sbuid: values.sbu.value,
            sbuname: values.sbu.label,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            countryId: 0,
            countryName: "",
            currencyId: 0,
            currencyName: "",
            expenseForId: values.expenseFor.value,
            expenseForName: values.expenseFor.label,
            fromDate: values.experiencePeriodFrom,
            toDate: values.experiencePeriodTo,
            projectId: 0,
            projectName: "",
            costCenterId: values.costCenter.value,
            costCenterName: values.costCenter.label,
            disbursementCenterId: values.disbursementCenter.value,
            disbursementCenterName: values.disbursementCenter.label,
            vehicleId: 0,
            totalAmount: TotalExpense,
            comments: values.comments || "",
            paymentType: values.paymentType.value,
            actionBy: profileData?.accountId,
          },
          objRow: rowDtoFormet,
        };
        if (rowDtoFormet?.length > 0) {
          console.log(payload);
          CreateInternalTripCostTransferToExpRegister(payload, cb, history, setDisabled);
        } else {
          toast.warn("Please add at least one");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title='Create Employee Register'
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        expenseDDL={expenseDDL}
        sbuDDL={sbuDDL}
        country={country}
        currencyDDL={currencyDDL}
        projectDDL={projectDDL}
        rowDto={rowDto}
        remover={remover}
        TotalExpense={TotalExpense}
        paymentType={paymentType}
      />
    </IForm>
  );
}
