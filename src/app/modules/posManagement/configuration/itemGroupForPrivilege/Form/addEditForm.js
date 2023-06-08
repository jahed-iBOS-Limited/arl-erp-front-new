import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { isUniq } from "./../../../../_helper/uniqChecker";
import { saveItemGroupForPrivilege_api } from "../helper";
import { toast } from "react-toastify";
const initData = {
  id: undefined,
  outletName: "",
  itemGroupName: "",
  item: "",
};

export default function ItemGroupForPrivilegeForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
      } else {
        const payload = {
          head: {
            itemGroupName: values?.itemGroupName || "",
            actionById: profileData?.userId || 0,
            actionByName: profileData?.userName || "",
            createUserDate: _todayDate(),
            createServerDate: _todayDate(),
            isActive: true,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuId: profileData?.sbuId,
            plantId: profileData?.plantId,
            warehouseId: values?.outletName?.value || 0,
            warehouseName: values?.outletName?.label,
          },
          row: rowDto,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please select at least one item");
          return false;
        }
        saveItemGroupForPrivilege_api(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    const ob = {
      dteRowCreateServerDate: _todayDate(),
      itemId: values?.item?.value,
      isActive: true,
      itemName: values?.item?.label,
      uomName: values?.item?.uomName,
      itemCategoryName: values?.item?.itemCategoryName,
    };

    if (isUniq("itemId", values?.item?.value, rowDto)) {
      setRowDto([...rowDto, ob]);
    }
  };

  const remover = (idx) => {
    const filterArr = rowDto?.filter((itm, index) => idx !== index);
    setRowDto(filterArr);
  };

  return (
    <IForm
      title={"Create Item Group For Privilege		"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
