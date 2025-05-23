import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { shallowEqual, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { toast } from 'react-toastify';
import IForm from '../../../../_helper/_form';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import { createPI, getSingleData, updatePi } from '../helper';
import Form from './form';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
// import { setter } from "../utils";
const initData = {
  plant: '',
  purchaseOrganizationDDL: '',
  pinumber: '',
  beneficiaryNameDDL: '',
  // expireDate: _dateFormatter(addDaysToDate(new Date(), 180)),
  expireDate: _todayDate(),
  lcTypeDDL: '',
  // lastShipDate: _dateFormatter(addDaysToDate(new Date(), 180)),
  lastShipDate: _todayDate(),
  incoTermsDDL: '',
  materialTypeDDL: '',
  bankNameDDL: '',
  countryOriginDDL: '',
  loadingPort: '',
  finalDestinationDDL: '',
  currencyDDL: '',
  tolerance: '',
  usance: '',
  presentation: '',
  otherTerms: '',
  itemDDL: '',
  uomDDL: '',
  quantity: '',
  rate: '',
  sbu: '',
  purchaseRequestNo: '',
  isAllItem: false,
  referenceType: '',
  purchaseContractNo: '',
  etaDate: _todayDate(),
  dteEstimatedLaycanDate: _todayDate(),
  warehouse: '',
  strRemarks: '',
};

export default function AddEditForm() {
  const params = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});
  // get singleData
  const [singleData, setSingleData] = useState('');
  const [rowDto, setRowDto] = useState([]);
  const [purchaseRequestValidity, setPurchaseRequestValidity] = useState(null);

  // get data from store
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (params?.pid) {
      getSingleData(params?.pid, setSingleData, setRowDto, setDisabled);
    }
  }, []);

  const setDataToGrid = (values, cb) => {
    let data = [...rowDto];
    if (
      data?.find(
        (item) =>
          item?.itemId === values?.itemDDL?.value &&
          (values?.referenceType?.value === 1
            ? item?.referenceId === values?.purchaseContractNo?.value
            : item?.referenceId === values?.purchaseRequestNo?.value)
      )
    ) {
      return toast.error('Item is already added');
    } else {
      const obj = {
        referenceType: values?.referenceType?.label,
        referenceId:
          values?.referenceType?.value === 1
            ? values?.purchaseContractNo?.value
            : values?.purchaseRequestNo?.value,
        referenceCode:
          values?.referenceType?.value === 1
            ? values?.purchaseContractNo?.label
            : values?.purchaseRequestNo?.label,
        itemId: values?.itemDDL.value,
        label: values?.itemDDL.label,
        itemName: values?.itemDDL.label,
        refQty: values?.itemDDL.refQty,
        uom: { value: values?.itemDDL?.uomId, label: values?.itemDDL?.uomName },
        uomId: values?.itemDDL?.uomId,
        uomName: values?.itemDDL?.uomName,
        quantity: values?.quantity,
        rate: values?.rate,
        totalAmount: Number(values?.quantity) * Number(values?.rate),
        hscode: values?.itemDDL.hscode,
      };
      setRowDto([...rowDto, obj]);
    }
  };

  const remover = (index) => {
    let data = [...rowDto];
    data.splice(index, 1);
    setRowDto(data);
  };

  const checkItemValidity = () => {
    let validationMessage;
    rowDto.forEach((item) => {
      if (!item?.hscode || item.hscode === '0') {
        validationMessage = 'HS code not found';
      } else if (!item?.quantity) {
        validationMessage = 'Qty Will be grater than 0';
      } else if (!item?.rate) {
        validationMessage = 'Rate Will be grater than 0';
      }
    });
    return validationMessage;
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.warn('Please add at least one Item');
      return;
    }
    if (params?.pid) {
      const checkItemValidation = checkItemValidity();
      if (checkItemValidation) {
        return toast.warn(checkItemValidation);
      }
      return updatePi(setDisabled, values, rowDto);
    }
    if (!purchaseRequestValidity) {
      toast.warn('Purchase Request No is not valid');
      return;
    }

    const checkItemValidation = checkItemValidity();
    if (checkItemValidation) {
      return toast.warn(checkItemValidation);
    }

    return createPI(
      setDisabled,
      profileData,
      selectedBusinessUnit,
      values,
      rowDto,
      cb
    );
  };

  return (
    <IForm
      title={
        params?.type === 'edit'
          ? 'Edit Proforma Invoice'
          : params?.type === 'view'
            ? 'View Proforma Invoice'
            : 'Proforma Invoice'
      }
      getProps={setObjprops}
      isDisabled={params?.type === 'view' ? true : isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={
          params?.pid
            ? {
                ...singleData,
                warehouse: {
                  value: singleData?.warehouseId,
                  label: singleData?.warehouseName,
                },
              }
            : initData
        }
        saveHandler={saveHandler}
        viewType={params?.type}
        rowDto={rowDto}
        setRowDto={setRowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setDataToGrid={setDataToGrid}
        remover={remover}
        purchaseRequestValidity={purchaseRequestValidity}
        setPurchaseRequestValidity={setPurchaseRequestValidity}
        params={params}
        // setter={setter}
      />
    </IForm>
  );
}
