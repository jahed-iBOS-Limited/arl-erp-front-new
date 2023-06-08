import { toast } from "react-toastify";

export const getLandingAction = ({ selectedBusinessUnit, getBankLimitData }) => {
  getBankLimitData(`/fino/BankBranch/GetBankLimitLanding?businessUnitId=${selectedBusinessUnit?.value}`);
};

export const addButtonHandler = ({ values, rowDto, setRowDto }) => {
  const found = rowDto.filter((item) => item?.bankId === values?.bankName?.value);
  if (found.length > 0) return toast.warn("Bank Name Already exists");

  let obj = {
    date: values?.date,
    bankName: values?.bankName?.label,
    bankId: values?.bankName?.value,
    limitType: values?.limitType?.label,
    limitTypeId: values?.limitType?.value,
    type: values?.type?.label,
    amount: values?.amount,
  };
  setRowDto([...rowDto, obj]);
};

export const saveHandler = ({ cb, selectedBusinessUnit, rowDto, setDisabled, saveData }) => {
  setDisabled(true);
  const payload = rowDto?.map((item) => ({
    intId: 0,
    intBusinessUnitId: selectedBusinessUnit?.value,
    dteTransaction: item?.date,
    intBankId: item?.bankId,
    intLimitId: item?.limitTypeId,
    strLimit: item?.limitType,
    strType: item?.type,
    numAmount: +item?.amount || 0,
  }));
  saveData(
    `/fino/BankBranch/CreateBankLimitList`,
    payload,
    () => {
      cb();
    },
    true
  );
};
