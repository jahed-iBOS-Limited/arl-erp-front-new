/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { toast } from "react-toastify";
import {
  createTaxShipmentExtend,
  GetTaxBranchById,
  getTaxShipmentExtendByBranchId,
} from "../helper";
import Loading from "../../../../_helper/_loading";
const initData = {
  shipPointNames: "",
  taxBranchName: "",
  taxBranchAddress: "",
};
export default function ExtendCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const params = useParams();

  // get user profile data from store
  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;

  useEffect(() => {
    if (params?.extendId) {
      GetTaxBranchById(params?.extendId, setSingleData);
      getTaxShipmentExtendByBranchId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        params?.extendId,
        setRowDto
      );
    }
  }, [params]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (params?.extendId) {
        const newRowDto = rowDto.map((data) => {
          return {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            taxBranchId: +params?.extendId,
            shipPointId: +data.shipPointId || 0,
          };
        });
        if (newRowDto.length > 0) {
          const payload = newRowDto;
          createTaxShipmentExtend(payload, cb, setDisabled);
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    } else {
      setDisabled(false);
    }
  };
  const setter = (values) => {
    const foundData = rowDto.filter(
      (item) => item?.shipPointId === +values?.shipPointNames.value
    );
    if (foundData.length > 0) {
      toast.warning("Data Already Exists");
    } else {
      const obj = {
        shipPointId: +values?.shipPointNames.value,
        shipPointNames: values?.shipPointNames?.label,
      };
      setRowDto([...rowDto, obj]);
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  // Set and get value in rowdto
  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };
  return (
    <IForm
      title="Extend Create"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.extendId ? singleData : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={params?.extendId || false}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
        rowDto={rowDto}
        itemSelectHandler={itemSelectHandler}
      />
    </IForm>
  );
}
