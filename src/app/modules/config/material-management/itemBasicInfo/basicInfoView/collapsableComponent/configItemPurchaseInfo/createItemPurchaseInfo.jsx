import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
} from '../../../../../../../../_metronic/_partials/controls';
import Axios from 'axios';
import Form from './form';
import { isObject, uniqBy } from 'lodash';

import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { getItemBasicinfoAction } from './helper';

const initData = {
  org: '',
  maxLeadDays: 0,
  minLeadDays: 0,
  minOrderQuantity: 0,
  desc: '',
  isMrp: false,
  hsCode: '',
  lotSize: 0,
  purchaseDescription: '',
};

export default function CreateItemPurchaseInfo({ isViewPage }) {
  const { id } = useParams();
  const [data, setData] = useState('');
  const [isExist, setExist] = useState(false);
  const [, setDisabled] = useState(true);
  const [itemId, setItemId] = useState(null);
  const [configId, setConfigId] = useState(null);
  const [alternateUomList, setAlterUOMList] = useState([]);
  const [basicItemInfo, setBasicItemInfo] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const params = useParams();
  useEffect(() => {
    setItemId(id || params.id);
    toast.dismiss(1);
  }, [id, params]);

  useEffect(() => {
    getItemBasicinfoAction(id, setBasicItemInfo);
  }, [id]);

  useEffect(() => {
    if (itemId && selectedBusinessUnit.value && profileData.accountId) {
      getDataById(itemId, profileData.accountId, selectedBusinessUnit.value);
    }
  }, [itemId, profileData, selectedBusinessUnit]);

  // Remove duplicate from alternateuom list
  const setAlternateUomList = (data) => {
    var uniq = uniqBy([...alternateUomList, data], function (itm) {
      return itm.convertedUomName;
    });
    setAlterUOMList(uniq);
  };

  const getDataById = async (id, accountId, businessUnitId) => {
    try {
      const res = await Axios.get(
        `/item/ItemPurchaseInfo/GetItemPurchaseInfoByItemID?accountId=${accountId}&businessUnitId=${businessUnitId}&itemID=${id}`
      );
      const { data, status } = res;
      if (status === 200) {
        const meta = data[0];
        setExist(meta ? true : false); //set exist property
        setConfigId(meta.configId); // set configid
        setData({
          ...meta,
          org: {
            value: meta.purchaseOrganizationId,
            label: meta.purchaseOrganizationName,
          },
        });
      } else {
        const tobj = {
          configId: 0,
          accountId: 0,
          businessUnitId: selectedBusinessUnit.value,
          org: { value: '', label: '' },
          itemId: +itemId,
          purchaseDescription: '',
          hscode: '',
          maxLeadDays: 0,
          minLeadDays: 0,
          minOrderQuantity: 0,
          lotSize: 0,
          isMrp: false,
        };
        setData(tobj);
      }
    } catch (err) {
      const tobj = {
        configId: 0,
        accountId: 0,
        businessUnitId: selectedBusinessUnit.value,
        org: { value: '', label: '' },
        itemId: +itemId,
        purchaseDescription: '',
        hscode: '',
        maxLeadDays: 0,
        minLeadDays: 0,
        minOrderQuantity: 0,
        lotSize: 0,
        isMrp: false,
      };
      setData(tobj);
    }
  };

  // save business unit data to DB
  const saveData = async (values, cb) => {
    toast.dismiss(1);

    if (
      isObject(values) &&
      Object.keys(values).length &&
      profileData &&
      selectedBusinessUnit
    ) {
      const data = {
        accountId: profileData.accountId,
        businessUnitId: selectedBusinessUnit.value,
        purchaseOrganizationId: values.org.value,
        itemId: +itemId,
        purchaseDescription: values.purchaseDescription,
        hscode: values.hscode,
        maxLeadDays: values.maxLeadDays,
        minLeadDays: 0,
        minOrderQuantity: values.minOrderQuantity,
        lotSize: values.lotSize,
        isMrp: values.isMrp,
        actionBy: profileData.userId,
      };
      if (isExist) {
        data.configId = configId;
      }
      try {
        const url = isExist
          ? '/item/ItemPurchaseInfo/EditItemPurchaseInfo'
          : '/item/ItemPurchaseInfo/CreateItemPurchaseInfo';
        const method = isExist ? 'put' : 'post';

        const res = await Axios[method](url, data);
        cb(data);
        getDataById(itemId, profileData.accountId, selectedBusinessUnit.value);
        toast.success(res.data?.message || 'Submitted successfully', {
          toastId: 1,
        });
      } catch (error) {
        getDataById(itemId, profileData.accountId, selectedBusinessUnit.value);

        toast.error(error?.response?.data?.message, { toastId: 1 });
      }
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
        title={
          isViewPage ? 'Purchase Information' : 'Edit Purchase Information'
        }
      ></CardHeader>
      <CardBody>
        <Form
          initData={data || initData}
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
          basicItemInfo={basicItemInfo}
        />
      </CardBody>
    </Card>
  );
}
