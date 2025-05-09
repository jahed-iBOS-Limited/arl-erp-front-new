import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Form from './form';
import IForm from '../../../../_helper/_form';
import { toast } from 'react-toastify';
import {
  ExtendPartnerWiseRentSetup,
  getPartnerWiseRentSetupById,
} from '../helper';
// import ExtendPartnerWiseRentSetup from ""

const initData = {
  id: undefined,
  shipPoint: '',
  vehicle: '',
  rent: '',
  additionalRent: '',
  reason: '',
};

export default function PartnerWiseRentSetupExtendForm({
  history,
  match: {
    params: { id, type },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  useEffect(() => {
    // if (id) ExtendPartnerById(id, setSingleData);
    getPartnerWiseRentSetupById(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      id,
      setRowDto,
      setDisabled
    );
  }, [id]);

  const addItemToTheGrid = (values) => {
    if (values.quantity < 0) {
      return toast.warn('Quantity must be greater than 0');
    }

    let data = rowDto.find(
      (item) =>
        item?.intshippointId === values?.shipPoint?.value &&
        item?.vehicleCapcityId === values?.vehicle.value
    );
    if (data) {
      toast.error('Item already added');
    } else {
      let itemRow = {
        intAccountId: profileData?.accountId,
        intBusinessUnitid: selectedBusinessUnit?.value,
        intPartnerId: 1,
        intshippointId: values?.shipPoint.value,
        shippointName: values?.shipPoint.label,
        numRentAmount: +values?.rent,
        numAdditionalRentAmount: +values?.additionalRent || 0,
        strReason: values?.reason || '',
        dteLastActionDateTime: '2021-04-25T09:38:01.874Z',
        dteServerDateTime: '2021-04-25T09:38:01.874Z',
        isActive: true,
        vehicleCapcityId: values?.vehicle.value || 0,
        vehicheCapacity: values?.vehicle.label || '',
      };

      setRowDto([itemRow, ...rowDto]);
    }
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const payload = rowDto?.map((item) => ({
        intRowId: item?.intRowId || 0,
        intAccountId: item?.intAccountId,
        intBusinessUnitid: item?.intBusinessUnitid,
        intPartnerId: id,
        intshippointId: item?.intshippointId,
        intVehicleId: item?.vehicleCapcityId,
        numRentAmount: +item?.numRentAmount,
        numAditionalRentAmount:
          +item?.numAdditionalRentAmount || item?.numAditionalRentAmount || 0,
        strReason: item?.strReason || '',
        vehicleCapcityId: item?.vehicleCapcityId || 0,
        vehicheCapacity: item?.vehicheCapacity || '',
      }));

      if (payload?.length > 0) {
        ExtendPartnerWiseRentSetup(payload, cb, setDisabled);
      } else {
        toast.warning('You must have to add atleast one item');
      }
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Partner Wise Rent Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenSave={type === 'view'}
      isHiddenReset={type === 'view'}
    >
      <Form
        {...objProps}
        // initData={id ? singleData : initData}
        initData={initData}
        saveHandler={saveHandler}
        // disableHandler={disableHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        // tableDataGetFunc={tableDataGetFunc}
        rowDto={rowDto}
        setRowDto={setRowDto}
        addItemToTheGrid={addItemToTheGrid}
        remover={remover}
      />
    </IForm>
  );
}
