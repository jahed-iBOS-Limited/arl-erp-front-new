//
import React, { useState, useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import Form from './form';
import {
  editCreditNote,
  GetCreditNoteSingleData,
  getFiscalYearDDL_api,
  getItemNameDDL_api,
  getPartnerNameDDL_api,
  // getSalesInvoiceByBranchIdDDL_api,
  saveCreditNote,
} from '../helper';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loading from '../../../../_helper/_loading';
import { _todayDate } from '../../../../_helper/_todayDate';
import IForm from '../../../../_helper/_form';

const initData = {
  partnerName: '',
  branchName: '',
  fiscalYear: '',
  salesInvoice: '',
  itemName: '',
  allItem: false,
  salesAmount: '',
  salesSd: '',
  salesVat: '',
};

export default function CreditNoteCreateForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const [partnerNameDDL, setPartnerNameDDL] = useState([]);
  const [fiscalYear, setFiscalYear] = useState([]);

  const { state } = useLocation();

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPartnerNameDDL_api(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setPartnerNameDDL
    );
  }, [profileData?.accountId, selectedBusinessUnit?.value]);

  //SingleData to view
  const [singleData, setSingleData] = useState('');
  useEffect(() => {
    if (params?.id) {
      GetCreditNoteSingleData(params?.id, setSingleData, setRowDto);
    }
  }, [params?.id]);

  // Fiscal Year
  useEffect(() => {
    getFiscalYearDDL_api(setFiscalYear);
  }, []);

  //rowDtoHandler
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === 'returnQty' || 'returnVat' || 'returnSd') {
      _sl[name] = value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (+params?.id) {
        const editRowDto = rowDto?.map((item, index) => ({
          rowId: item?.rowId || 0,
          taxSalesHeaderId: +params?.id,
          taxItemGroupId: item?.itemName?.value,
          taxItemGroupName: item?.itemName?.label,
          uomid: item?.uomid,
          uomname: item?.uomname,
          salesUomid: values?.salesInvoice?.value,
          salesUomname: values?.salesInvoice?.label,
          quantity: +item?.returnQty,
          basePrice: 0,
          sdtotal: +item?.returnSd,
          vatTotal: +item?.returnVat,
          surchargeTotal: 0,
          grandTotal: 0,
          isFree: true,
          salesId: values?.salesInvoice?.value,
        }));
        const payload = {
          objHeader: {
            taxSalesId: +params?.id,
          },
          objRowList: editRowDto,
        };
        if (rowDto?.length === 0) {
          toast.warn('Please add transaction');
        } else {
          editCreditNote(payload, setDisabled);
        }
      } else {
        const newRowDto = rowDto?.map((item, index) => {
          return {
            uomid: item?.uomid,
            uomname: item?.uomname,
            taxItemGroupId: item?.itemName?.value,
            taxItemGroupName: item?.itemName?.label,
            salesUomid: values?.salesInvoice?.value,
            salesUomname: values?.salesInvoice?.label,
            quantity: +item?.returnQty,
            basePrice: 0,
            sdtotal: +item?.returnSd,
            vatTotal: +item?.returnVat,
            surchargeTotal: 0,
            grandTotal: 0,
            isFree: true,
          };
        });
        const payload = {
          objHeader: {
            taxYear: 0,
            accountId: profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            businessUnitName: selectedBusinessUnit?.label,
            taxBranchId: state?.transferoutLandingInitData?.value,
            taxBranchName: state?.transferoutLandingInitData?.label,
            taxBranchAddress: state?.transferoutLandingInitData?.address,
            actionBy: profileData?.userId,
            isReceive: true,
            referenceDate: _todayDate(),
            fisaclYear: `${values?.fiscalYear.value}`,
            referenceNo: values?.salesInvoice?.value,
            salesId: values?.salesInvoice?.value,
          },
          objRowList: newRowDto,
        };
        if (rowDto?.length === 0) {
          toast.warn('Please add transaction');
        } else {
          console.log('Payload => ', payload);
          saveCreditNote(payload, cb, setDisabled);
        }
      }
    } else {
      setDisabled(false);
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm, index) => index !== payload);
    setRowDto([...filterArr]);
  };

  return (
    <IForm
      title="Create Credit Note"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData?.objHeader : initData}
        saveHandler={saveHandler}
        //disableHandler={disableHandler}
        accountId={profileData?.accountId}
        isEdit={id || false}
        rowDto={rowDto}
        remover={remover}
        setRowDto={setRowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        fiscalYear={fiscalYear}
        rowDtoHandler={rowDtoHandler}
        partnerNameDDL={partnerNameDDL}
      />
    </IForm>
  );
}
