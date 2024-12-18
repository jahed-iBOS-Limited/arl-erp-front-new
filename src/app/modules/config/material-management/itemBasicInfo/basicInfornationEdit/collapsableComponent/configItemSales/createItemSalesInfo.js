import React, { useRef, useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from '../../../../../../../../_metronic/_partials/controls';
import Axios from 'axios';
import Form from './form.js';
import { isObject, uniqBy } from 'lodash';

import { useParams } from 'react-router-dom';
import { useSelector, shallowEqual } from 'react-redux';
import { toast } from 'react-toastify';
import { getItemBasicinfoAction } from './helper';

const initData = {
  org: { label: '', value: '' },
  profitCenter: '',
  productDivision: { label: '', value: '' },
  cogsGL: { label: '', value: '' },
  distributionChannel: '',
  accroedCogsGL: { label: '', value: '' },
  revenueGL: { label: '', value: '' },
  salesDescription: '',
  minOrderQuantity: 0,
  volume: '',
  isMrp: false,
  hsCode: '',
  lotSize: 0,
  vatItem: '',
  conversionRatePcs: '',
};

export default function CreateItemPurchaseInfo({ isViewPage }) {
  const { id } = useParams();
  const [data, setData] = useState('');
  const [isExist, setExist] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [itemId, setItemId] = useState(null);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemId, profileData, selectedBusinessUnit]);

  // Remove duplicate from alternateuom list
  const setAlternateUomList = (data) => {
    var uniq = uniqBy([...alternateUomList, data], function(itm) {
      return itm.convertedUomName;
    });
    setAlterUOMList(uniq);
  };

  const getDataById = async (id, accountId, businessUnitId) => {
    try {
      const res = await Axios.get(
        `/item/ItemSales/GetItemSalesById?ItemSalesId=${id}`,
      );

      const { data } = res;
      if (data?.length > 0) {
        const meta = data[0];
        setExist(meta ? true : false); //set exist property
        setData({
          ...meta,
          org: {
            value: meta.salesOrganizationId,
            label: meta.salesOrganizationName,
          },
          productDivision: {
            value: meta.productDivisionId,
            label: meta.productDivisionName,
          },
          profitCenter: {
            value: meta.profitCenterId,
            label: meta.profitCenterName,
          },
          distributionChannel:
            data?.map((itm) => ({
              value: itm?.distributionChannelId,
              label: itm?.distributionChannelName,
              configId: itm?.configId || 0,
            })) || '',
          accroedCogsGL: {
            value: meta?.accruedCOGSGLId,
            label: meta?.accruedCOGSGLName,
          },
          revenueGL: {
            value: meta.revenueGLId || '',
            label: meta.revenueGLName || '',
          },
          cogsGL: { value: meta.cogsglId, label: meta.cogsglName },
          vatItem: {
            value: meta?.taxItemId,
            label: meta?.taxGroupName,
          },
        });
      } else {
        setData('');
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
        isMrp: true,
        conversionRatePcs: '',
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
      if (values?.distributionChannel?.length > 0) {
        if (selectedBusinessUnit.value === 144 && !values.conversionRatePcs) {
          toast.warning('Conversion Rate Pcs is required', {
            toastId: 1,
          });
          return;
        }
        const payload = values?.distributionChannel?.map((itm, idx) => ({
          id: ++idx,
          configId: itm?.configId || 0,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          salesOrganizationId: values.org.value,
          profitCenterId: values.profitCenter.value,
          productDivisionId: values.productDivision.value,
          itemId: +itemId,
          salesDescription: values.salesDescription,
          cogsglId: values.cogsGL.value,
          accruedCOGSGLId: values.accroedCogsGL.value,
          revenueGLId: values.revenueGL.value,
          DistributionChannelId: itm.value,
          distributionChannelId: itm.value,
          minOrderQuantity: +values.minOrderQuantity,
          lotSize: +values.lotSize,
          monVolume: +values.volume,
          actionBy: profileData.userId,
          taxItemId: values.vatItem?.value || 0,
          mrp: +values?.mrp || 0,
          conversionRatePcs: values.conversionRatePcs,
        }));
        try {
          const url = isExist
            ? '/item/ItemSales/EditteItemSales'
            : '/item/ItemSales/CreateItemSales';
          const method = isExist ? 'put' : 'post';

          const res = await Axios[method](url, payload);
          cb(data);
          getDataById(
            itemId,
            profileData.accountId,
            selectedBusinessUnit.value,
          );

          toast.success(res.data?.message || 'Submitted successfully', {
            toastId: 1,
          });
        } catch (error) {
          getDataById(
            itemId,
            profileData.accountId,
            selectedBusinessUnit.value,
          );
          toast.error(error?.response?.data?.message, { toastId: 1 });
        }
      } else {
        return toast.warning('Distribution Channel is required', {
          toastId: 1,
        });
      }
    }
  };

  const saveBtnRef = useRef();
  const saveDataClick = () => {
    if (saveBtnRef && saveBtnRef.current) {
      saveBtnRef.current.click();
    }
  };

  const resetBtnRef = useRef();
  const resetBtnClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  return (
    <Card>
      <CardHeader
        title={isViewPage ? 'Sales Information' : 'Edit Sales Information'}
      >
        <CardHeaderToolbar>
          {!isViewPage && (
            <>
              <button
                type="reset"
                onClick={resetBtnClick}
                ref={resetBtnRef}
                className="btn btn-light ml-2"
              >
                <i className="fa fa-redo"></i>
                Reset
              </button>
              <button
                type="submit"
                className="btn btn-primary ml-2"
                onClick={saveDataClick}
                ref={saveBtnRef}
                disabled={isDisabled}
              >
                Save
              </button>
            </>
          )}
        </CardHeaderToolbar>
      </CardHeader>
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
