import React, { useState } from "react";
import Form from "./form";
import Loading from "../../../_helper/_loading";
import { updateEmpBankInfo } from "./helper";

const initData = {
  employee: "",
  accountName: "",
  accountNumber: "",
  bank: "",
  bankBranch: "",
  routingNumber: "",
  employeeBankInfoId: "",
};

export default function BankInformationUpdate() {
  const [isDisabled, setDisabled] = useState(false);

  const saveHandler = async (values, cb) => {
    updateEmpBankInfo(values, setDisabled);
  };

  return (
    <div className="employeeInformation">
      {isDisabled && <Loading />}
      <Form
        initData={initData}
        setDisabled={setDisabled}
        saveHandler={saveHandler}
        isDisabled={isDisabled}
      />
    </div>
  );
}
