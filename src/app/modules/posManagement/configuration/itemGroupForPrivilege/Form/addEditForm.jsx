import React, { useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { saveItemGroupForPrivilege_api } from '../helper';
import { _todayDate } from './../../../../_helper/_todayDate';
import { isUniq } from './../../../../_helper/uniqChecker';
import Form from './form';
const initData = {
  id: undefined,
  outletName: '',
  itemGroupName: '',
  item: '',
};

export default function ItemGroupForPrivilegeForm({
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  const [rowDto, setRowDto] = useState([]);

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
      } else {
        const payload = {
          head: {
            itemGroupName: values?.itemGroupName || '',
            actionById: profileData?.userId || 0,
            actionByName: profileData?.userName || '',
            createServerDate: _todayDate(),
            createUserDate: _todayDate(),
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
          toast.warn('Please select at least one item');
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

    if (isUniq('itemId', values?.item?.value, rowDto)) {
      setRowDto([...rowDto, ob]);
    }
  };

  const remover = (idx) => {
    const filterArr = rowDto?.filter((itm, index) => idx !== index);
    setRowDto(filterArr);
  };

  return (
    <IForm
      getProps={setObjprops}
      title={'Create Item Group For Privilege'}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        saveHandler={saveHandler}
        initData={initData}
        rowDto={rowDto}
        setter={setter}
        remover={remover}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
