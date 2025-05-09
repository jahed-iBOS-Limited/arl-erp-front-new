import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../../../_metronic/_partials/controls';
import Axios from 'axios';
import Form from './form';

import shortid from 'shortid';
import { useLocation, useParams } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { isUniq } from '../../../../../../_helper/uniqChecker';
import { toast } from 'react-toastify';

const initData = {
  plant: '',
  warehouse: '',
  inventoryLocation: '',
  numGrossWeight: '',
  numNetWeight: '',
  baseUom: '',
  isMultipleUom: false,
  alternateUom: '',
  conversionBaseUom: '',
};

export default function ConfigItemPlantWareHouse({ isViewPage, onSuccess }) {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(true);

  const location = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [rowDto, setRowDto] = useState([]);
  const [defaultRowDto, setDefaultRowDto] = useState([]);
  const [isConfigItemPlant, setIsConfigItemPlant] = useState(false);
  const [singleInitData, setSingleInitData] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (id) {
      getItemPlantWarehouseInfoByItemId(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        id
      );
    }
  }, [profileData, selectedBusinessUnit, id]);

  const getItemPlantWarehouseInfoByItemId = async (accid, buid, id) => {
    try {
      const res = await Axios.get(
        `/wms/ItemPlantWarehouse/GetItemPlantWarehouseInfoByItemId?accountId=${accid}&businessUnitId=${buid}&itemID=${id}`
      );
      const { data, status } = res;
      if (status === 200 && data) {
        if (
          data[0]?.getItemPlantWHDTO?.length > 0 ||
          data[0]?.createItemUOMConvertionDTO?.length > 0
        ) {
          const singleObj = {
            plant: {
              value: data[0]?.getItemPlantWHDTO[0]?.plantId,
              label: data[0]?.getItemPlantWHDTO[0]?.plantName,
            },
            numGrossWeight:
              data[0]?.getItemPlantWarehouseNetGrossWeightDTO?.numGrossWeight,
            numNetWeight:
              data[0]?.getItemPlantWarehouseNetGrossWeightDTO?.numNetWeight,
          };
          setSingleInitData(singleObj);
          setIsConfigItemPlant(true);
          setIsEdit(true);
          setDefaultRowDto(data[0]?.getItemPlantWHDTO);
          setRowDto(data[0]?.createItemUOMConvertionDTO);
        }
      }
    } catch (error) {}
  };

  // save business unit data to DB
  const saveData = async (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid, label: businessunitLabel } =
        selectedBusinessUnit;

      if (isConfigItemPlant === true) {
        if (defaultRowDto.length > 0) {
          const editDefaultRowDto = defaultRowDto.map((itm) => {
            return {
              configId: itm?.configId || 0,
              itemId: +id,
              itemName: location?.state?.item?.itemName,
              accountId: accountId,
              businessUnitId: businessunitid,
              businessUnitName: businessunitLabel,
              plantId: itm?.plantId,
              plantName: itm?.plantName,
              warehouseId: itm?.warehouseId,
              wareHouseName: itm?.wareHouseName,
              inventoryLocationId: itm?.inventoryLocationId,
              baseUomid: values?.baseUom?.value,
              baseUom: values?.baseUom?.label,
              actionBy: actionBy,
            };
          });
          const editConfigPlantWarehouseData = {
            isMultipleUom: values?.isMultipleUom || false,
            itemId: +id,
            itemName: location?.state?.item?.itemName,
            accountId: accountId,
            businessUnitId: businessunitid,
            uomId: values?.baseUom?.value,
            actionBy: actionBy,
            editItemPlantWHDTO: editDefaultRowDto,
            editItemUOMConvertionDTO: rowDto,
          };
          try {
            window.editData = editConfigPlantWarehouseData;
            setDisabled(true);
            const res = await Axios.put(
              '/wms/ItemPlantWarehouse/EditConfigItemPlantWarehouse',
              editConfigPlantWarehouseData
            );
            getItemPlantWarehouseInfoByItemId(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              id
            );
            toast.success(res.data?.message || 'Submitted successfully', {
              toastId: shortid(),
            });
            setDisabled(false);
            if (onSuccess) onSuccess();
          } catch (error) {
            toast.error(error?.response?.data?.message, { toastId: shortid() });
          }
          setDisabled(false);
        }
      } else {
        const defaultObjRow = defaultRowDto.map((itm) => {
          return {
            itemName: location?.state?.item?.itemName,
            accountId: accountId,
            businessUnitId: businessunitid,
            businessUnitName: businessunitLabel,
            plantId: itm?.plantId,
            plantName: itm?.plantName,
            warehouseId: itm?.warehouseId,
            wareHouseName: itm?.wareHouseName,
            inventoryLocationId: itm?.inventoryLocationId,
            inventoryLocationName: itm?.inventoryLocationName,
            baseUomid: values?.baseUom?.value,
            baseUom: values?.baseUom?.label,
          };
        });
        const filterDefaultObjRow = [
          ...defaultObjRow.map((itm, i) => {
            return {
              itemName: location?.state?.item?.itemName,
              accountId: accountId,
              businessUnitId: businessunitid,
              businessUnitName: businessunitLabel,
              plantId: itm?.plantId,
              plantName: itm?.plantName,
              warehouseId: itm?.warehouseId,
              wareHouseName: itm?.wareHouseName,
              inventoryLocationId: itm?.inventoryLocationId,
              baseUomid: values?.baseUom?.value,
              baseUom: values?.baseUom?.label,
            };
          }),
        ];
        const objRow = rowDto.map((itm) => {
          return {
            baseUomId: itm?.baseUomId,
            baseUomName: itm?.baseUomName,
            convertedUom: itm?.convertedUom || itm?.baseUomId,
            convertedUomName: itm?.convertedUomName || itm?.baseUomName,
            numConversionRate: itm?.numConversionRate || 1,
            actionBy: actionBy,
          };
        });
        const configPlantWarehouseData = {
          isMultipleUom: values?.isMultipleUom || false,
          itemId: +id,
          itemName: location?.state?.item?.itemName,
          accountId: accountId,
          businessUnitId: businessunitid,
          grossWeight: values?.numGrossWeight,
          netWeight: values?.numNetWeight,
          uomId: values?.baseUom?.value,
          actionBy: actionBy,
          createItemPlantWHDTO: filterDefaultObjRow,
          createItemUOMConvertionDTO: objRow,
        };
        try {
          console.log('create data', configPlantWarehouseData);
          window.createData = configPlantWarehouseData;
          setDisabled(true);
          const res = await Axios.post(
            '/wms/ItemPlantWarehouse/CreateConfigItemPlantWarehouse',
            configPlantWarehouseData
          );
          getItemPlantWarehouseInfoByItemId(
            profileData?.accountId,
            selectedBusinessUnit?.value,
            id
          );
          toast.success(res.data?.message || 'Submitted successfully', {
            toastId: shortid(),
          });
          setDisabled(false);
          if (onSuccess) onSuccess();
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
          setDisabled(false);
        }
      }
    } else {
      toast.error('Submit Unsuccesful!', { toastId: shortid() });
    }
  };

  const baseSetter = (payload) => {
    if (isUniq('convertedUom', payload?.convertedUom, rowDto)) {
      const { userId: actionBy } = profileData;
      setRowDto([
        {
          ...payload,
          actionBy: actionBy,
        },
      ]);
    }
  };

  const setter = (payload) => {
    if (isUniq('convertedUom', payload?.convertedUom, rowDto)) {
      const { userId: actionBy } = profileData;
      setRowDto([
        ...rowDto,
        {
          ...payload,
          actionBy: actionBy,
        },
      ]);
    }
  };

  const defaultSetter = (payload) => {
    if (
      isUniq('inventoryLocationId', payload.inventoryLocationId, defaultRowDto)
    ) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid, label: businessunitLabel } =
        selectedBusinessUnit;
      setDefaultRowDto([
        ...defaultRowDto,
        {
          itemName: location?.state?.itemName,
          accountId: accountId,
          businessUnitId: businessunitid,
          businessUnitName: businessunitLabel,
          ...payload,
        },
      ]);
    }
  };

  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm.convertedUom !== payload);
    setRowDto(filterArr);
  };
  const defaultRemover = (payload) => {
    const filterArr = defaultRowDto.filter((itm, index) => payload !== index);
    setDefaultRowDto(filterArr);
  };

  const saveBtnRef = useRef();

  const resetBtnRef = useRef();
  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  return (
    <Card>
      <CardHeader
        title={
          isViewPage
            ? 'Config Item Plant Warehouse'
            : 'Edit Config Item Plant Warehouse'
        }
      />
      <CardBody>
        <Form
          isViewPage={isViewPage}
          productData={singleInitData || initData}
          saveBtnRef={saveBtnRef}
          saveData={saveData}
          resetBtnRef={resetBtnRef}
          businessUnitName={false}
          businessUnitCode={true}
          isDisabledCode={true}
          disableHandler={disableHandler}
          setter={setter}
          defaultSetter={defaultSetter}
          remover={remover}
          defaultRemover={defaultRemover}
          selectedBusinessUnit={selectedBusinessUnit}
          accountId={profileData.accountId}
          rowDto={rowDto}
          defaultRowDto={defaultRowDto}
          userId={profileData?.userId}
          baseSetter={baseSetter}
          isEdit={isEdit}
        />
      </CardBody>
    </Card>
  );
}
