import React, { useEffect, useState } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { useLocation, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { saveBankJournal } from '../../../../../_helper/_commonApi';
import IForm from '../../../../../_helper/_form';
import Loading from '../../../../../_helper/_loading';
import useAxiosGet from '../../../../../_helper/customHooks/useAxiosGet';
import { setBankJournalCreateAction } from '../../../../../_helper/reduxForLocalStorage/Actions';
import Form from './form';
import './style.css';

export default function BankReceiptForJounal() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [instrumentNoByResponse, setInstrumentNoByResponse] = useState('');
  const location = useLocation();
  let { selectedJournalTypeId, selectedFormValues, transferRowItem } =
    location?.state || {}; // For Bank Transfer Only
  let { intRequestByUnitId } = transferRowItem || {}; // For Bank Transfer Only
  const params = useParams();
  const [attachmentFile, setAttachmentFile] = useState('');
  const [sbuList, getSbuList] = useAxiosGet();
  const history = useHistory();

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);
  const { profileData, selectedBusinessUnit } = storeData;

  // Handle `selectedBusinessUnit` value separately
  const adjustedSelectedBusinessUnit = {
    ...selectedBusinessUnit,
    value:
      selectedJournalTypeId === 4
        ? intRequestByUnitId
        : selectedBusinessUnit?.value,
  };

  // const { bankJournalCreate } = useSelector(
  //   (state) => state?.localStorage || {},
  //   shallowEqual
  // );

  useEffect(() => {
    if (intRequestByUnitId) {
      getSbuList(
        `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${intRequestByUnitId}&Status=true`
      );
    }
  }, [intRequestByUnitId]);

  let netAmount = rowDto?.reduce((total, value) => total + +value?.amount, 0);

  //save event Modal (code see)
  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: 'Ok',
          onClick: () => {
            history.goBack();
            noAlertFunc();
          },
        },
      ],
    });
  };

  const dispatch = useDispatch();

  const saveHandler = async (values, cb) => {
    if (selectedJournalTypeId === 5 && !params?.id && !attachmentFile) {
      return toast.warn('Attachment Required');
    }
    if (values?.profitCenter?.value) {
      if (selectedJournalTypeId === 4) {
        if (!values?.revenueCenter || !values?.revenueElement) {
          return toast.warn('Please add Revenue center or Revenue element');
        }
      } else {
        if (!values?.costCenter || !values?.costElement) {
          return toast.warn('Please add Cost center or Cost element');
        }
      }
    }
    /*
     // previous code
     if (selectedJournalTypeId === 4) {
      if (values?.revenueCenter || values?.revenueElement) {
        if (!(values?.revenueCenter && values?.revenueElement)) {
          return toast.warn("Please add Revenue center or Revenue element");
        }
      }
    } else {
      if (values?.costCenter || values?.costElement) {
        if (!(values?.costCenter && values?.costElement)) {
          return toast.warn("Please add Cost center or Cost element");
        }
      }
    } */

    // dispatch values for localStorageSlice
    dispatch(setBankJournalCreateAction(values));
    // setDisabled(true);

    // const chequeNo = await genarateChequeNo(
    //   profileData?.accountId,
    //   selectedBusinessUnit?.value,
    //   +values?.bankAcc?.bankId,
    //   +values?.bankAcc?.bankBranch_Id,
    //   +values?.bankAcc?.value,
    //   values?.bankAcc?.label,
    //   +values?.instrumentType?.value
    // );

    if (
      values &&
      profileData?.accountId &&
      adjustedSelectedBusinessUnit?.value
      // chequeNo?.currentChequeNo
    ) {
      // if id , then this is for edit , else this is for create
      if (params?.id) {
      } else {
        // obj row for bank receipt and bank payment
        let objRow = rowDto?.map((item) => ({
          rowId: 0,
          businessTransactionId: +item?.transaction?.value,
          businessTransactionCode: item?.transaction?.code,
          businessTransactionName: item?.transaction?.label,
          generalLedgerId: +item?.gl?.value,
          generalLedgerCode: item?.gl?.code,
          generalLedgerName: item?.gl?.label,
          amount: +item?.amount,
          narration: item?.narration,
          bankAcId: +values?.bankAcc?.value,
          bankAcNo: values?.bankAcc?.bankAccNo,
          partnerTypeName: item?.partnerType?.label || '',
          partnerTypeId: item?.partnerType?.reffPrtTypeId || 0,
          businessPartnerId:
            item?.partnerType?.label === 'Others'
              ? 0
              : item?.transaction?.value,
          businessPartnerCode:
            item?.partnerType?.label === 'Others'
              ? ''
              : item?.transaction?.code,
          businessPartnerName:
            item?.partnerType?.label === 'Others'
              ? ''
              : item?.transaction?.label,
          subGLId: item?.transaction?.value,
          subGlCode: item?.transaction?.code,
          subGLName: item?.transaction?.label,
          subGLTypeId: item?.partnerType?.reffPrtTypeId,
          subGLTypeName: item?.partnerType?.label,
          controlType:
            selectedJournalTypeId === 4
              ? 'Revenue'
              : selectedJournalTypeId === 5
                ? 'Cost'
                : '',
          profitCenterId: item?.profitCenter?.value || 0,
          costRevenueName:
            item?.revenueCenter?.label || item?.costCenter?.label || '',
          costRevenueId:
            item?.revenueCenter?.value || item?.costCenter?.value || 0,
          elementName:
            item?.revenueElement?.label || item?.costElement?.label || '',
          elementId:
            item?.revenueElement?.value || item?.costElement?.value || 0,
          partnerBankId: item?.partnerBankAccount?.bankId || 0,
          partnerBankBranchId: item?.partnerBankAccount?.bankBranchId || 0,
          partnerBankAccountNo: item?.partnerBankAccount?.bankAccountNo || '',
          partnerBankAccountName: item?.partnerBankAccount?.bankName || '',
          partnerBankRoutingNumber: item?.partnerBankAccount?.routingNo || '',
        }));

        let transferRow = [
          {
            rowId: 0,
            businessTransactionId: 0,
            businessTransactionCode: '',
            businessTransactionName: '',
            generalLedgerId:
              values?.transferTo?.value === 1
                ? +values?.sendToGLBank?.value
                : +values?.bankAcc?.generalLedgerId,
            generalLedgerCode:
              values?.transferTo?.value === 1
                ? values?.sendToGLBank?.generalLedgerCode
                : values?.bankAcc?.generalLedgerCode,
            generalLedgerName:
              values?.transferTo?.value === 1
                ? values?.sendToGLBank?.label
                : values?.bankAcc?.generalLedgerName,
            amount: +values?.transferAmount,
            narration: values?.headerNarration,
            bankAcId:
              values?.transferTo?.value === 2 ? values?.sendToGLBank?.value : 0,
            bankAcNo:
              values?.transferTo?.value === 2
                ? values?.sendToGLBank?.bankAccNo
                : '',
            subGLId:
              values?.transferTo?.value === 2
                ? +values?.sendToGLBank?.value
                : 0, // bankaccId
            subGlCode: values?.sendToGLBank?.bankAccNo, // bankacc number
            subGLName:
              values?.transferTo?.value === 2
                ? values?.sendToGLBank?.label
                : '',
            subGLTypeId: 6, // 6
            subGLTypeName: 'Bank Account', // "Bank Account"
          },
        ];
        const isRevenue =
          selectedJournalTypeId === 4 &&
          values?.revenueCenter &&
          values?.revenueElement;
        const isCostCenter =
          selectedJournalTypeId !== 4 &&
          values?.costCenter &&
          values?.costElement;
        const payload = {
          objHeader: {
            bankJournalId: 0,
            voucherDate: values?.transactionDate,
            accountId: +profileData?.accountId,
            businessUnitId: +intRequestByUnitId,
            sbuId: +sbuList[0]?.value || 0,
            bankId: +values?.bankAcc?.bankId,
            bankName: values?.bankAcc?.bankName,
            bankBranchId: +values?.bankAcc?.bankBranch_Id,
            bankBranchName: values?.bankAcc?.bankBranchName,
            bankAccountId: +values?.bankAcc?.value,
            bankAccountNumber: values?.bankAcc?.bankAccNo,
            receiveFrom: values?.receiveFrom || '',
            paidTo: values?.paidTo || '',
            transferTo: values?.transferTo?.label || '',
            placedInBank: values?.placedInBank || false,
            placingDate: values?.placingDate || '',
            //values?.placedInBank ? values?.placingDate : ""
            generalLedgerId: +values?.bankAcc?.generalLedgerId,
            generalLedgerCode: values?.bankAcc?.generalLedgerCode,
            generalLedgerName: values?.bankAcc?.generalLedgerName,
            amount:
              selectedJournalTypeId === 6
                ? +values?.transferAmount
                : +netAmount,
            narration: values?.headerNarration || '',
            posted: false,
            partnerTypeName: values?.partnerType?.label || '',
            partnerTypeId: values?.partnerType?.value || 0,
            businessPartnerId:
              values?.partnerType?.label === 'Others'
                ? 0
                : values?.transaction?.value,
            businessPartnerCode:
              values?.partnerType?.label === 'Others'
                ? ''
                : values?.transaction?.code,
            businessPartnerName:
              values?.partnerType?.label === 'Others'
                ? ''
                : values?.transaction?.label,
            instrumentId: +values?.instrumentType?.value || 0,
            instrumentName: values?.instrumentType?.label || '',
            instrumentNo: values?.instrumentNo || '',
            instrumentDate: values?.instrumentDate || '',
            accountingJournalTypeId: selectedJournalTypeId,
            directPosting: true,
            actionBy: +profileData?.userId,
            // Last Added
            chequeNo: values?.instrumentNo || '',
            controlType: isRevenue
              ? 'revenue'
              : isCostCenter
                ? 'cost'
                : '' || '',
            costRevenueName: isRevenue
              ? values?.revenueCenter?.label
              : isCostCenter
                ? values?.costCenter?.label
                : '',
            costRevenueId: isRevenue
              ? values?.revenueCenter?.value
              : isCostCenter
                ? values?.costCenter?.value
                : 0,
            elementName: isRevenue
              ? values?.revenueElement?.label
              : isCostCenter
                ? values?.costElement?.label
                : '',
            elementId: isRevenue
              ? values?.revenueElement?.value
              : isCostCenter
                ? values?.costElement?.value
                : 0,
            ProfitCenterId: values?.profitCenter?.value,
            attachment: attachmentFile || '',
          },
          objRowList: selectedJournalTypeId === 6 ? transferRow : objRow,
        };
        // if jorunal  selectedJournalTypeId is bank transfer , don't need to check rowdto length
        if (selectedJournalTypeId === 6) {
          saveBankJournal(payload, cb, setRowDto, setDisabled, IConfirmModal);
        } else {
          if (rowDto?.length === 0) {
            toast.warn('Please add transaction');
          } else {
            saveBankJournal(payload, cb, setRowDto, setDisabled, IConfirmModal);
          }
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const setter = (values) => {
    const count = rowDto?.filter(
      (item) => item?.transaction?.value === values?.transaction?.value
    ).length;

    if ([4]?.includes(selectedJournalTypeId)) {
      if (rowDto?.length >= 1) {
        return toast.warn("Cann't add multiple");
      }

      setRowDto([...rowDto, values]);
    } else {
      if (count === 0) {
        setRowDto([...rowDto, values]);
      } else {
        toast.warn('Not allowed to duplicate transaction');
      }
    }
  };
  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  return (
    <IForm
      title={
        selectedJournalTypeId === 4
          ? `Create Bank Receipt`
          : selectedJournalTypeId === 5
            ? `Create Bank Payments`
            : `Create Bank Transfer`
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        // initData={{ ...bankJournalCreate, ...selectedFormValues }}
        initData={{
          ...selectedFormValues,
          partnerType: {
            value: 4,
            label: 'Investment Partner',
            reffPrtTypeId: 4,
          },
        }}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={adjustedSelectedBusinessUnit}
        jorunalType={selectedJournalTypeId}
        netAmount={netAmount}
        instrumentNoByResponse={instrumentNoByResponse}
        setInstrumentNoByResponse={setInstrumentNoByResponse}
        rowDtoHandler={rowDtoHandler}
        attachmentFile={attachmentFile}
        setAttachmentFile={setAttachmentFile}
        isEdit={params?.id || false}
        transferRowItem={transferRowItem}
      />
    </IForm>
  );
}
