import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { isUniq } from "./../../../../_helper/uniqChecker";
import {
  CreateItemProfileConfig_api,
  GetItemProfileConfigById_api,
} from "../helper";
import { toast } from "react-toastify";
import Loading from "./../../../../_helper/_loading";
import { EditItemProfileConfig_api } from "./../helper";
const initData = {
  id: undefined,
  sectionName: "",
  attributeName: "",
  isMendatory: false,
  controlName: "",
};

export default function ItemProfileSetupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [objProps, setObjprops] = useState({});
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [ddlOptionRow, setDdlOptionRow] = useState([]);
  const [singleData, setSingleData] = useState("");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  console.log(rowDto);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const modifiRow = rowDto?.map((itm) => ({
          controlerTypeId: itm?.controlId,
          controlerTypeName: itm?.controlName,
          attributeName: itm?.attributeName,
          isMendatory: itm?.isMendatory,
          attributeId: itm?.attributeId,
          itemProfileId: +id,
          businessUnitId: selectedBusinessUnit.value,
          objAttributeDetailsList: itm?.optionList,
        }));
        const payload = {
          objConfig: {
            itemProfileId: +id,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            itemProfileName: values?.sectionName,
            actionBy: profileData.userId,
          },
          objAttributeList: modifiRow,
        };

        if (rowDto?.length > 0) {
          EditItemProfileConfig_api(payload, setDisabled).then(itm => {
            GetItemProfileConfigById_api(
              profileData.accountId,
              selectedBusinessUnit.value,
              id,
              setSingleData,
              setDisabled
            );
          });
        } else {
          toast.warning("You must have to add atleast one item");
        }
      } else {
        //objAttributeList
        const modifiRow = rowDto?.map((itm) => ({
          controlerTypeId: itm?.controlId,
          controlerTypeName: itm?.controlName,
          attributeName: itm?.attributeName,
          isMendatory: itm?.isMendatory,
          objAttributeDetailsList: itm?.optionList,
        }));
        const payload = {
          objConfig: {
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            itemProfileName: values?.sectionName,
            actionBy: profileData.userId,
          },
          objAttributeList: modifiRow,
        };

        if (rowDto?.length > 0) {
          CreateItemProfileConfig_api(payload, cb, setDisabled);
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId && id) {
      GetItemProfileConfigById_api(
        profileData.accountId,
        selectedBusinessUnit.value,
        id,
        setSingleData,
        setDisabled
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData, id]);

  const setter = (obj) => {
    if (isUniq("attributeName", obj?.attributeName, rowDto)) {
      setRowDto([...rowDto, obj]);
      setDdlOptionRow([]);
    }
  };
  //ddlOptionsRemoveFunc
  const ddlOptionsRemoveFunc = (id, createTableRowItm) => {
    if (createTableRowItm?.controlName) {
      //=====if row DDL Click Event===============
      //rowDto optionList arry remove
      const romoveRowDto = rowDto[createTableRowItm?.index].optionList.filter(
        (itm, idx) => idx !== id
      );
      const coppyRowDto = [...rowDto];
      coppyRowDto[createTableRowItm?.index].optionList = romoveRowDto;
      setRowDto(coppyRowDto);
      //ddlOptionRow
      setDdlOptionRow(ddlOptionRow.filter((itm, idx) => idx !== id));
    } else {
      setDdlOptionRow(ddlOptionRow.filter((itm, idx) => idx !== id));
    }
  };
  //addDdlOptionFuc
  const addDdlOptionFuc = (obj, createTableRowItm) => {
    if (isUniq("attributeValue", obj?.attributeValue, ddlOptionRow)) {
      if (createTableRowItm?.controlName) {
        const coppyRowDto = [...rowDto];
        coppyRowDto[createTableRowItm?.index].optionList = [
          ...ddlOptionRow,
          obj,
        ];
        setRowDto(coppyRowDto);
        setDdlOptionRow([...ddlOptionRow, obj]);
      } else {
        setDdlOptionRow([...ddlOptionRow, obj]);
      }
    }
  };

  useEffect(() => {
    if (singleData?.header) {
      const modifiRow = singleData?.rowDto.map((itm) => ({
        attributeName: itm?.attributeName,
        isMendatory: itm?.isMendatory,
        controlName: itm?.controlerTypeName,
        controlId: itm?.controlerTypeId,
        optionList: itm?.objDetailList,
        attributeId: itm?.attributeId,
      }));
      setRowDto(modifiRow);
    }
  }, [singleData]);
  return (
    <IForm
      title={"Item Profile Setup"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={singleData?.header || initData}
        saveHandler={saveHandler}
        profileData={profileData?.accountId}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setter={setter}
        ddlOptionRow={ddlOptionRow}
        setDdlOptionRow={setDdlOptionRow}
        ddlOptionsRemoveFunc={ddlOptionsRemoveFunc}
        addDdlOptionFuc={addDdlOptionFuc}
      />
    </IForm>
  );
}
