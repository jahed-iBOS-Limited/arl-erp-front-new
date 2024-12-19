import React, { useEffect, useState } from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import useAxiosGet from '../../../../_helper/customHooks/useAxiosGet';
import useAxiosPost from '../../../../_helper/customHooks/useAxiosPost';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import Form from './form';
import { getBankDDL_api } from '../helper';

const initData = {
  depositMode: '',
  bank: '',
  branch: '',
  referenceNo: '',
  date: _todayDate(),
  amount: '',
};

export default function MoneyReceiptSubmitForm() {
  const { type } = useParams();
  const [isDisabled] = useState(false);
  const [, postData, loading] = useAxiosPost();
  const [bankList, setBankList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [, getGridData] = useAxiosGet();
  const [rowData, setRowData] = useState([]);
  const [addDisable, setAddDisable] = useState(false);

  const { state } = useLocation();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  const getRowData = () => {
    const url = `/oms/SalesInformation/GetChequeSubmitPendingChallan?intPartid=1&intCustomerId=${state?.customer?.value}&intBusinessUnitId=${buId}`;
    getGridData(url, (resData) => {
      setRowData(resData?.map((item) => ({ ...item, amount: 0 })));
    });
  };

  useEffect(() => {
    getBankDDL_api(setBankList);
    getRowData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId]);

  const rowDataHandler = (values) => {
    let _data = [...rowData];
    let tempAmount = values?.amount;
    for (let i = 0; i < _data?.length; i++) {
      const item = _data[i];
      if (item?.monSalesForceDues <= tempAmount) {
        _data[i].amount = item.monSalesForceDues;
        tempAmount = tempAmount - item?.monSalesForceDues;
        _data[i].monSalesForceDues = 0;
      } else if (tempAmount) {
        _data[i].amount = tempAmount;
        _data[i].monSalesForceDues = item?.monSalesForceDues - tempAmount;
        tempAmount = 0;
      } else {
        break;
      }
    }
    setAddDisable(true);
    setRowData(_data);
  };

  const saveHandler = async (values, cb) => {
    const payload = {
      headerObject: {
        customerId: state?.customer?.value,
        accountId: accId,
        businessUnitId: buId,
        actionBy: userId,
      },
      rowObjectList: rowData?.map((item) => {
        return {
          bankId: values?.bank?.value || 0,
          bankName: values?.bank?.label || '',
          branchId: values?.branch?.value || 0,
          branchName: values?.branch?.label || '',
          depositMode: values?.depositMode?.label,
          refNo: values?.referenceNo,
          depositDate: values?.date,
          amount: item?.amount,
          deliveryId: item?.intDeliveryId,
          deliveryCode: item?.strdeliverycode,
          attachmentPkid: 0,
          attachment: '',
          shipmentRowId: item?.intshipmentrowid,
        };
      }),
    };
    postData(
      `/wms/CustomerDeposit/CreateCustomerDeposit`,
      payload,
      () => {
        cb();
        getRowData();
      },
      true,
    );
  };

  const title = `Money Collection`;

  return (
    <>
      {(isDisabled || loading) && <Loading />}
      <Form
        type={type}
        title={title}
        rowDataHandler={rowDataHandler}
        addDisable={addDisable}
        rowData={rowData}
        initData={initData}
        bankList={bankList}
        branchList={branchList}
        saveHandler={saveHandler}
        setBranchList={setBranchList}
      />
    </>
  );
}
