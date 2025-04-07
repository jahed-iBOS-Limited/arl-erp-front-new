import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
} from '../../../../../../../../_metronic/_partials/controls';
import Axios from 'axios';
import Form from './form';
import { uniqBy } from 'lodash';
import shortid from 'shortid';

import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { isUniq } from '../../../../../../_helper/uniqChecker';

const initData = {
  warehouse: '',
  isManualCosting: false,
  numCostPrice: 0,
};

export default function CreateItemPurchaseInfo({
  id,
  isViewPage,
  fetchCostWarehouse,
}) {
  const [isExist, setExist] = useState(false);
  const [, setDisabled] = useState(true);
  const [itemId, setItemId] = useState(null);
  const [alternateUomList, setAlterUOMList] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const params = useParams();
  useEffect(() => {
    setItemId(id || params.id);
    toast.dismiss(1);
  }, [id, params]);

  useEffect(() => {
    if (itemId && selectedBusinessUnit.value && profileData.accountId) {
      getDataById(itemId, profileData?.accountId, selectedBusinessUnit?.value);
    }
  }, [itemId, profileData, selectedBusinessUnit]);

  const setAlternateUomList = (data) => {
    var uniq = uniqBy([...alternateUomList, data], function (itm) {
      return itm.convertedUomName;
    });
    setAlterUOMList(uniq);
  };

  const getDataById = async (itemId, accountId, businessUnitId) => {
    try {
      const res = await Axios.get(
        `/wms/ItemWarehouseCost/GetItemWarehouseCostbyItemId?AccountId=${accountId}&UnitId=${businessUnitId}&ItemId=${itemId}`
      );
      const { data, status } = res;
      if (status === 200) {
        setExist(true);
        setRowDto(data);
      }
    } catch (error) { }
  };

  const saveData = async (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      if (isExist) {
        const editObjRow = rowDto.map((itm) => {
          return {
            itemCostId: itm?.itemCostId ? itm?.itemCostId : 0,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            itemId: +itemId,
            warehouseId: itm?.warehouseId,
            numCostPrice: itm?.numCostPrice,
            isManualCosting: itm?.isManualCosting,
            actionBy: profileData?.userId,
          };
        });
        try {
          const res = await Axios.put(
            '/wms/ItemWarehouseCost/EditItemWarehouseCost',
            editObjRow
          );
          toast.success(res.data?.message || 'Submitted successfully', {
            toastId: shortid(),
          });
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
        }
      } else {
        const ObjRow = rowDto.map((itm) => {
          return {
            itemCostId: 0,
            accountId: profileData?.accountId,
            businessUnitId: selectedBusinessUnit?.value,
            itemId: +itemId,
            warehouseId: itm?.warehouseId,
            numCostPrice: itm?.numCostPrice,
            isManualCosting: itm?.isManualCosting,
            actionBy: profileData?.userId,
          };
        });
        const payload = ObjRow;
        try {
          const res = await Axios.post(
            '/wms/ItemWarehouseCost/CreateItemWarehouseCost',
            payload
          );
          cb(payload);
          toast.success(res.data?.message || 'Submitted successfully', {
            toastId: shortid(),
          });
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
        }
      }
    } else {
      toast.error('Submit Unsuccessful!', { toastId: shortid() });
    }
  };

  const setter = (payload) => {
    if (isUniq('warehouseId', payload?.warehouseId, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  const saveBtnRef = useRef();

  const resetBtnRef = useRef();

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  return (
    <Card>
      <CardHeader
        title={isViewPage ? 'Costing Information' : 'Edit Costing Information'}
      />
      <CardBody>
        <Form
          fetchCostWarehouse={fetchCostWarehouse}
          isViewPage={isViewPage}
          initData={initData}
          saveBtnRef={saveBtnRef}
          saveData={saveData}
          resetBtnRef={resetBtnRef}
          businessUnitName={false}
          businessUnitCode={true}
          isEdit={true}
          isDisabledCode={true}
          disableHandler={disableHandler}
          alternateUomList={alternateUomList}
          setAlternateUomList={setAlternateUomList}
          accountId={profileData.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          itemId={itemId}
          setter={setter}
          rowDto={rowDto}
        />
      </CardBody>
    </Card>
  );
}
