import React, { useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import { isUniq } from "./../../../../_helper/uniqChecker";
import { createCustomerGroupForPrivilege } from "../helper";
import { toast } from 'react-toastify';
const initData = {
  id: undefined,
  outletName: "",
  customerGroupName: "",
  gender: "",
  customer: "",
  isSelect: "",
};

export default function CustomerGroupForPrivilegeForm({
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
    if (values && rowDto?.length > 0 && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
      } else {
        const objRow = rowDto?.map((item) => ({
          customerId: item?.customerId,
          customerCode: item?.customerCode,
          customerName: item?.customer,
          gender: item?.gender 
        }));

        const payload = {
          objHeader: {
            customerGroupName: values?.customerGroupName,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            sbuid: profileData?.sbuId,
            plantId: profileData?.plantId,
            warehouseId: values?.outletName?.value,
            actionById: profileData?.userId,
          },
          objRow: objRow
        };

        createCustomerGroupForPrivilege(payload, cb, setDisabled)
      }
    } else {
      toast.warn('Please add at least one customer')
      setDisabled(false);
    }
  };

  const setter = (values, customerDDL, isCheck) => {

    if(isCheck) {
      const obj = customerDDL?.map(info => ({
        customer: info?.label,
        customerId: info?.value,
        gender: info?.gendarName,
        customerCode: info?.code
      }))
      setRowDto(obj);
    }
    else{
      const obj = {
        customer: values?.customer?.label,
        customerId: values?.customer?.value,
        gender: values?.customer?.gendarName,
        customerCode: values?.customer?.code
      };
  
      if (isUniq("customerId", values?.customer?.value, rowDto)) {
        if(values?.customer?.label){
          setRowDto([...rowDto, obj]);
        }
        else{
          toast.warn('Please at least add one customer')
        }
      }
    }
  };

  const removeHandler = (index) => {
    let newRowData = rowDto.filter((item, i) => index !== i);
    setRowDto(newRowData);
  };

  return (
    <IForm
      title={"Create Customer Group For Privilege		"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        setter={setter}
        removeHandler={removeHandler}
        isDisabled={isDisabled}
      />
    </IForm>
  );
}
