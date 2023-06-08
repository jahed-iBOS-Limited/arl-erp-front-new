import moment from "moment";
import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CreateExpenceRegister,
  editExpenseRegister,
  getExpenseById,
  getFuelLogCash,
} from "../helper";
import { _todayDate } from "../../../../_helper/_todayDate";
import Loading from "./../../../../_helper/_loading";
import { useHistory } from "react-router-dom";
import { _dateFormatter } from "./../../../../_helper/_dateFormate";
const endOfMonth = moment(_todayDate())
  .endOf("month")
  .format();
const monthDDL = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

const initData = {
  expenseCategory: "",
  projectName: "",
  expenseFrom: _todayDate(),
  expenseTo: _dateFormatter(endOfMonth),
  costCenter: "",
  quantity: "",
  vehicle: "",
  comments1: "",
  expenseDate: _todayDate(),
  transaction: "",
  expenseAmount: "",
  location: "",
  comments2: "",
  disbursmentCenter: "",
  paymentType: "",
  file: "",
  driverExp: false,
  expenseGroup: "",
  year: {
    value: new Date().getFullYear(),
    label: `${new Date().getFullYear()}`,
  },
  month: monthDDL[new Date().getMonth()],
};

export default function ExpenseRegisterCreateForm() {
  const history = useHistory();
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [total, setTotal] = useState({ totalAmount: 0 });
  // attach
  const [fileObjects, setFileObjects] = useState([]);
  const [uploadImage, setUploadImage] = useState("");
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if (params?.id || params?.approval) {
      getExpenseById(
        params?.id || params?.approval,
        setSingleData,
        setRowDto,
        setDisabled
      );
    }
  }, [params]); // location

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (params?.id || params?.approval) {
        const {
          expenseCode,
          sbuid,
          sbuname,
          countryId,
          countryName,
          currencyId,
          currencyName,
          plantId,
          expenseForId,
          internalAccountId,
        } = singleData?.objHeader;
        //obj row
        let objRow = rowDto?.map((item, i) => ({
          rowId: item.expenseRowId ? item.expenseRowId : 0,
          dteExpenseDate: item.expenseDate,
          businessTransactionId: item?.transaction?.value,
          businessTransactionName: item?.transaction?.label,
          numQuantity: +item.quantity,
          numRate: +item.expenseAmount / +item.quantity,
          numAmount: +item.expenseAmount || 0,
          expenseLocation: item.location,
          comments: item.comments2,
          attachmentLink: item?.attachmentLink || "",
          driverName: item?.driverName || "",
          driverId: item?.driverId || 0,
        }));
        const payload = {
          objHeader: {
            expenseId: +params?.id || +params?.approval,
            expenseCode: expenseCode,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            sbuid: sbuid,
            sbuname: sbuname,
            countryId: countryId,
            countryName: countryName,
            currencyId: currencyId,
            currencyName: currencyName,
            dteFromDate: values.expenseFrom,
            dteToDate: values.expenseTo,
            projectId: values.projectName.value || 0,
            projectName: values.projectName.label || "",
            costCenterId: values.costCenter.value || 0,
            costCenterName: values.costCenter.label || "",
            instrumentId: values.paymentType.value,
            instrumentName: values.paymentType.label,
            disbursementCenterId: values?.disbursmentCenter?.value,
            disbursementCenterName: values?.disbursmentCenter?.label,
            // vehicle ddl
            vehicleId:
              values.vehicle?.value === 1 ? "" : values.vehicle?.label || "",
            numTotalAmount: total?.totalAmount,
            comments: values?.comments1,
            numTotalApprovedAmount: 0,
            actionBy: +profileData?.userId,
            willApproved: location?.state?.isApproval ? true : false,
            plantId: plantId,
            expenseGroup: values?.expenseGroup?.value,
            expenseForId: expenseForId,
            internalAccountId: internalAccountId,
          },
          objRow: objRow,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please add transaction");
        } else {
          editExpenseRegister(payload, setDisabled, history);
        }
      } else {
        // obj row for expense register
        let objRow = rowDto?.map((item, i) => ({
          dteExpenseDate: item.expenseDate,
          businessTransactionId: item.transaction.value,
          businessTransactionName: item.transaction.label,
          numQuantity: +item.quantity,
          numRate: +item.expenseAmount / +item.quantity,
          numAmount: +item.expenseAmount || 0,
          expenseLocation: item.location,
          comments: item.comments2,
          attachmentLink: item?.attachmentLink || "",
          driverName: item?.driverName || "",
          driverId: item?.driverId || 0,
        }));

        const payload = {
          objHeader: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            actionBy: +profileData?.userId,
            businessUnitName: selectedBusinessUnit?.label,
            sbuid: location?.state?.selectedSbu.value,
            sbuname: location?.state?.selectedSbu.label,
            countryId: location?.state?.selectedCountry.value,
            countryName: location?.state?.selectedCountry.label,
            currencyId: location?.state?.selectedCurrency.value,
            currencyName: location?.state?.selectedCurrency.label,
            expenseForId: location?.state?.internalAccount
              ? 0
              : location?.state?.selectedExpense.value,
            dteFromDate: values.expenseFrom,
            dteToDate: values.expenseTo,
            projectId: values.projectName.value || 0,
            projectName: values.projectName.label || "",
            costCenterId: values.costCenter.value || 0,
            costCenterName: values.costCenter.label || "",
            instrumentId: values.paymentType.value,
            instrumentName: values.paymentType.label,
            disbursementCenterId: values.disbursmentCenter.value,
            disbursementCenterName: values.disbursmentCenter.label,
            // vehicle ddl
            vehicleId:
              values.vehicle?.value === 1 ? "" : values.vehicle?.label || "",
            numTotalAmount: total?.totalAmount,
            comments: values.comments1,
            numTotalApprovedAmount: 0,
            adjustmentAmount: 0,
            pendingAmount: 0,
            plantId: location?.state?.selectedPlant?.value || 0,
            expenseGroup: values?.expenseGroup?.value,
            internalAccountId: location?.state?.internalAccount
              ? location?.state?.selectedExpense.value
              : 0,
          },
          objRow: objRow,
        };
        if (values.costCenter || values.projectName) {
          if (rowDto?.length === 0) {
            toast.warn("Please add transaction");
          } else {
            CreateExpenceRegister(payload, cb, setDisabled);
          }
        } else {
          toast.warn("Either select Cost center or Project name");
        }
      }
    } else {
      setDisabled(false);
    }
  };
  const setter = async (values) => {
    let fuelLogCash = 0;
    if (rowDto?.length === 0) {
      fuelLogCash = await getFuelLogCash(
        location?.state?.checkPublic
          ? location?.state?.selectedExpense?.value
          : profileData?.employeeId,
        values?.expenseDate,
        setDisabled
      );
    }

    const duplicateCheck = rowDto?.some(
      (itm) =>
        itm?.transaction?.value === values?.transaction?.value &&
        itm?.comments2 === values?.comments2 &&
        +itm?.expenseAmount === +values?.expenseAmount &&
        itm?.location === values?.location &&
        itm?.expenseDate === values?.expenseDate
    );

    const newobj = {
      ...values,
      quantity: 1,
      attachmentLink: uploadImage[0]?.id || "",
      driverId: values?.driverExp ? values?.userNmae?.value || 0 : 0,
      driverName: values?.driverExp ? values?.userNmae?.label || "" : "",
    };

    if (duplicateCheck) {
      toast.warning("Item already exists");
    } else {
      //Expense Period From  and Expense Period To check
      if (
        new Date(values?.expenseFrom) <= new Date(values?.expenseDate) &&
        new Date(values?.expenseTo) >= new Date(values?.expenseDate)
      ) {
        const newRowDto = [...rowDto, newobj];
        if (fuelLogCash > 0) {
          newRowDto.unshift({
            ...values,
            expenseAmount: fuelLogCash,
            comments2: "Fuel Log Cash",
            quantity: 1,
          });
        }
        setRowDto(newRowDto);
        setUploadImage("");
      } else {
        toast.warn(
          'Expense Date must be in between "Exp Period From & Exp Period To" '
        );
      }
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };
  //total amount calculation
  useEffect(() => {
    let totalAmount = 0;
    if (rowDto.length) {
      for (let i = 0; i < rowDto.length; i++) {
        totalAmount += +rowDto[i].expenseAmount;
      }
    }
    setTotal({ totalAmount });
  }, [rowDto]);

  return (
    <IForm
      title={
        location?.state?.isApproval
          ? "Internal Expense Approval"
          : "Create Internal Expense"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
      submitBtnText={location?.state?.isApproval ? "Approval" : "Save"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.id || params?.approval ? singleData?.objHeader : initData
        }
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        sbu={location?.state?.selectedSbu}
        total={total}
        isEdit={params?.id || params?.approval || false}
        setRowDto={setRowDto}
        fileObjects={fileObjects}
        setFileObjects={setFileObjects}
        setUploadImage={setUploadImage}
        location={location}
        monthDDL={monthDDL}
      />
    </IForm>
  );
}
