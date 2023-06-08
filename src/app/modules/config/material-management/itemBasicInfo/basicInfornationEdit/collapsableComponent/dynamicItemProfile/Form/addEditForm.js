import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "./../../../../../../../_helper/_form";
import { _todayDate } from "./../../../../../../../_helper/_todayDate";
import Loading from "./../../../../../../../_helper/_loading";
import { CreateItemProfile_api } from "./../../../../helper";
import { useParams } from "react-router-dom";
import { _dateFormatter } from "./../../../../../../../_helper/_dateFormate";

export default function DynamicItemProfileForm({
  profileConfigList,
  singleProfileList,
  title,
  itemProfileInfoByItemID,
  ItemProfileInfoByItemIDFunc,
  loadingTwo
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [initData, setInitData] = useState({});
  const [singleData, setSingleData] = useState("");
  const { id } = useParams();
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  console.log(itemProfileInfoByItemID);
  const saveHandler = async (values, cb) => {
    const itemProfileId = singleProfileList?.objConfig?.itemProfileId;
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const objProfileDetailList = singleProfileList?.objAttrbt?.map(
        (itm, inx) => {
          const ddlId =
            itm?.controlerTypeName === "DDL" ? values[`${inx}`]?.value : "";
          const Text =
            itm?.controlerTypeName === "TextBox" ? values[`${inx}`] : "";
          const Date =
            itm?.controlerTypeName === "Date" ? values[`${inx}`] : "";
          const Number =
            itm?.controlerTypeName === "Number" ? values[`${inx}`] : 0;
          const rowId = itemProfileInfoByItemID?.objRowList
            ? itemProfileInfoByItemID?.objRowList[inx]?.rowId
            : 0;
          const configId = itemProfileInfoByItemID?.objRowList
            ? itemProfileInfoByItemID?.objRowList[inx]?.configId
            : 0;
          return {
            rowId: rowId,
            configId: configId,
            attributeId: itm?.attributeId,
            controlerTypeId: itm?.controlerTypeId,
            attributeValueId: ddlId,
            valueText: Text,
            valueDate: Date,
            valueNumber: Number,
          };
        }
      );
      const payload = {
        objProfile: {
          configId: itemProfileInfoByItemID?.objHeader?.configId || 0,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          itemId: +id,
          itemProfileId: itemProfileId,
          actionBy: profileData?.userId,
        },
        objProfileDetailList: objProfileDetailList,
      };
      console.log(payload);
      CreateItemProfile_api(
        payload,
        cb,
        setDisabled,
        ItemProfileInfoByItemIDFunc,
        itemProfileId
      );
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (singleProfileList?.objAttrbt?.length > 0) {
      let obj = {};
      singleProfileList.objAttrbt.forEach((itm, idx) => {
        obj = {
          ...obj,
          [idx]: itm?.controlerTypeName === "Date" ? _todayDate() : "",
        };
      });
      setInitData(obj);
    }
  }, [singleProfileList]);

  useEffect(() => {
    if (itemProfileInfoByItemID?.objRowList?.length > 0 && id) {
      let obj = {};

      itemProfileInfoByItemID.objRowList.forEach((itm, idx) => {
        const data =
          itm?.controlerTypeName === "Number"
            ? itm?.valueNumber
            : itm?.controlerTypeName === "Date"
            ? _dateFormatter(itm?.valueDate)
            : itm?.controlerTypeName === "TextBox"
            ? itm?.valueText
            : { value: itm?.attributeValueId, label: itm?.attributeValueName };
        obj = {
          ...obj,
          [idx]: data,
        };
      });
      setSingleData(obj);
    } else {
      setSingleData("");
    }
  }, [itemProfileInfoByItemID, id]);

  return (
    <IForm
      title={`Create ${title}`}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {(isDisabled || loadingTwo) && <Loading />}

      <Form
        {...objProps}
        initData={singleData || initData}
        saveHandler={saveHandler}
        profileData={profileData?.accountId}
        singleProfileList={singleProfileList}
      />
    </IForm>
  );
}
