import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "./../../../../_helper/_todayDate";
import { isUniq } from "./../../../../_helper/uniqChecker";
import { postPrivilegeScheme_api } from "../helper";
import { toast } from "react-toastify";
const initData = {
  id: undefined,
  outletName: "",
  nameOfScheme: "",
  conditionType: "",
  itemGroup: "",
  customerGroup: "",
  schemeStartDate: _todayDate(),
  schemeEndDate: _todayDate(),
  offerBasedOn: "",
  schemeType: "",
  customersPurchaseType: "",
  minimumQuantity: "",
  maximumQuantity: "",
  offerItem: "",
  itemUoM: "",
  maximumAmount: "",
  discountFormat: "",
  discountAmount: "",
  offerQuantity: "",
  minimumAmount: "",
  durationType: "",
  monthDuration: "",
  basedOn: "",
};

export default function CustomerPrivilegeSchemeForm({
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
            customersPrivilegeSchemeId: 0,
            accountId: profileData?.accountId,
            bussinessUnitId: selectedBusinessUnit?.value,
            warehouseId: [values?.outletName?.value],
            nameOfScheme: values?.nameOfScheme || "",
            conditionTypeId: values?.conditionType?.value || 0,
            itemOrItemGroupId: values?.itemGroup?.value || 0,
            customerOrCustomerGroupId: values?.customerGroup?.value || 0,
            startDate: values?.schemeStartDate || "",
            endDate: values?.schemeEndDate || "",
            offerBasedOnId: values?.offerBasedOn?.value || 0,
            customersPurchaseTypeId: values?.customersPurchaseType?.value || 0,
            schemeTypeId: values?.schemeType?.value || 0,
            serverDateTime: _todayDate(),
            actionDateTime: _todayDate(),
            isActive: true,
          },
          row: rowDto,
        };
        if (rowDto?.length === 0) {
          toast.warn("Please select at least one item");
          return false;
        }
       postPrivilegeScheme_api(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    const ob = {
      rowId: 0,
      customersPrivilegeSchemeHeaderId: 0,
      minimumQuantityOrAmount:
        +values?.minimumQuantity || +values?.minimumAmount || 0,
      maximumQuantityOrAmount:
        +values?.maximumQuantity || +values?.maximumAmount || 0,
      itemId: values?.offerItem?.value || 0,
      itemName: values?.offerItem?.label || "",
      itemUomName: values?.itemUoM?.label || "",
      offerQuantity: +values?.offerQuantity || 0,
      discountFormatId: values?.discountFormat?.value || 0,
      discountFormatName: values?.discountFormat?.label || "",
      discountAmount: +values?.discountAmount || 0,
      durationTypeId: +values?.durationType?.value || 0,
      durationTypeName: values?.durationType?.label || "",
      monthDuration: +values?.monthDuration || 0,
      basedOnId: +values?.basedOn?.value || 0,
      basedOnName: values?.basedOn?.label || "",
      serverDateTime: _todayDate(),
      actionDateTime: _todayDate(),
      isActive: true,
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
      title={"Create Customers Privilege Scheme"}
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
