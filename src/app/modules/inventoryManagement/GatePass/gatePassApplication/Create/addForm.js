/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { getSingleData, createGetPaseData, updateGetPassData } from "../helper";
import { toast } from "react-toastify";
import Loading from "../../../../_helper/_loading";
import { _dateFormatter } from "../../../../_helper/_dateFormate";

const initData = {
  date: _dateFormatter(new Date()),
  fromAddress: "",
  toAddress: "",
  item: "",
  receiversName: "",
  contactNo: "",
  remarks: "",
  quantity: "",
  uom: "",
  reason: "",
  vehicle: "",
  others: "",
  fromGateEntry: "",
  returnable: false,
  rowRemarks: "",
  intVehicleEntryId: "",
};

export default function AddEditFrom({
  history,
  match: {
    params: { pId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [initDataForEdit, setInitDataForEdit] = useState({});

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (pId) {
      getSingleData(pId, setRowDto, setInitDataForEdit, setDisabled);
    }
  }, []);
  const setter = (values, setFieldValue) => {
    // Check Same Data already in list
    // console.log("rowDto", values);
    const foundData = rowDto?.filter(
      (item) =>
        item?.item?.trim().toLowerCase() === values?.item?.trim().toLowerCase()
    );
    if (foundData.length > 0) {
      return toast.warn("Item already exits");
    } else {
      const newValue = {
        item: values?.item,
        uom: values?.uom,
        quantity: values?.quantity,
        returnable: values?.returnable ? true : false,        
        strRemarks: values?.rowRemarks || ""
      };
      setRowDto([...rowDto, newValue]);
      setFieldValue("item", "");
      setFieldValue("quantity", "");
      setFieldValue("uom", "");
      setFieldValue("rowRemarks", "");
      setFieldValue("returnable", false);
    }
  };

  const remover = (i) => {
    const filterData = rowDto.filter((item, index) => i !== index);
    setRowDto(filterData);
  };

  const saveHandler = (values, cb) => {
    if (rowDto.length > 0) {
      if (pId) {
        return updateGetPassData(
          values,
          rowDto,
          profileData?.userId,
          profileData?.accountId,
          selectedBusinessUnit?.value,
          setDisabled,
          pId,
          pId ? null : cb
        );
      }
      return createGetPaseData(
        values,
        rowDto,
        profileData?.userId,
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setDisabled,
        cb
      );
    } else {
      toast.warn("Please add row");
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={pId ? "Edit Get Pass" : "Create Gate Pass"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={pId ? initDataForEdit : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
        // warehouseList={warehouseList}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        history={history?.location?.state}
        pId={pId}
      />
    </IForm>
  );
}
