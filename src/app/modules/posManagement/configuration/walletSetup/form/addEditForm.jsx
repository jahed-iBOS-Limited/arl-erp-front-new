/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import Form from "./form";
import { useSelector, shallowEqual } from "react-redux";
import IForm from "./../../../../_helper/_form";

import { CreateWalletSetup, getWalletSetupLanding, getWalletSetupById } from "../helper";

const initData = {
  strWalletName: "",
  strWalletType: "",
  strBankAccountId: "",
  strBankAccountNo: "",
  strBankName: "",
  numCommissionPercentage: 0,
};

const WalletSetupForm = () => {
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});
  const [id, setId] = useState("");
  const [walletId, setWalletId] = useState("");
  const [singleData, setSingleData] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveHandler = async (values) => {
    if (profileData?.accountId && selectedBusinessUnit?.value && values) {
      if(walletId){
        const updatedRowDto=rowDto.filter(data=>data.isUpdated===true)
        await CreateWalletSetup(updatedRowDto)
        getWalletSetupLanding(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          "",
          setRowDto
        );
      }else{
        const payload = {
          id: singleData?.id || 0,
          intAccountId: profileData.accountId,
          intUnitId: selectedBusinessUnit?.value,
          strWalletName: values?.strWalletName,
          strWalletType: values?.strWalletType?.label,
          strBankAccountId: values?.strBankAccountId,
          strBankAccountNo: values?.strBankAccountNo,
          strBankName: values?.strBankName,
          numCommissionPercentage: +values?.numCommissionPercentage,
          isActive: singleData?.isActive || true,
        };
        await CreateWalletSetup([payload]);
        getWalletSetupLanding(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          "",
          setRowDto
        );
      }
    }
  };

  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWalletSetupLanding(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        "",
        "",
        setRowDto
      );
    }
  }, [profileData, selectedBusinessUnit]);

  const remover = (itemName) => {
    const filterData = rowDto.filter((item) => item.itemName !== itemName);
    setRowDto(filterData);
  };

  useEffect(() =>{
    if(id){
      getWalletSetupById(id, setSingleData)
    }
  }, [id])

  const updateStatus = (value, index) => {
    const rowData = [...rowDto];
    rowData[index].isActive = value;
    rowData[index].isUpdated = true;
    setRowDto(rowData);
  };

  const paginationSearchHandler = (searchValue) => {
    getWalletSetupLanding(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      "",
      searchValue,
      setRowDto
    );
  };

  console.log(rowDto)

  return (
    <>
      <IForm title={"Wallet Setup"} getProps={setObjprops}>
        <Form
          {...objProps}
          initData={id?singleData:initData}
          saveHandler={saveHandler}
          rowDto={rowDto}
          setRowDto={setRowDto}
          remover={remover}
          updateStatus={updateStatus}
          setWalletId={setWalletId}
          setId={setId}
          paginationSearchHandler={paginationSearchHandler}
        />
      </IForm>
    </>
  );
};

export default WalletSetupForm;
