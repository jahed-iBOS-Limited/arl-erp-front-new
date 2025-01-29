import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveAdjustmentJournal,
  saveEditedAdjustmentJournal,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import Loading from "./../../../../_helper/_loading";
import { confirmAlert } from "react-confirm-alert";
import { getAdjustmentJournalById } from "../helper";
import { getPartnerTypeDDL } from "../../bankJournal/helper";

const initData = {
  id: undefined,
  sbu: "",
  transactionDate: _todayDate(),
  headerNarration: "",
  transaction: "",
  debitCredit: "",
  amount: "",
  partnerType: "",
  revenueElement: "",
  revenueCenter: "",
  costCenter: "",
  costElement: "",
  attachment:"",
};

export default function AdjustmentJournalCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState({});

  const [partnerTypeDDL, setPartnerTypeDDL] = useState([]);

  const location = useLocation();
  const { id } = useParams();

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state?.authData;
  }, shallowEqual);

  useEffect(() => {
    getPartnerTypeDDL(setPartnerTypeDDL);
  }, [profileData, selectedBusinessUnit]);

  const dispatch = useDispatch();

  useEffect(() => {
    if (id) {
      getAdjustmentJournalById(id, setSingleData, setRowDto);
    }
  }, [id]);

  //save event Modal (code see)
  const IConfirmModal = (props) => {
    const { title, message, noAlertFunc } = props;
    return confirmAlert({
      title: title,
      message: message,
      buttons: [
        {
          label: "Ok",
          onClick: () => noAlertFunc(),
        },
      ],
    });
  };
  const saveHandler = async (values, cb) => {
    if(!values?.headerNarration) return toast.warn("Narration is required")
    if(!rowDto?.length) return toast.warn("Please add at least one transaction")
    const { accountId, userId: actionBy } = profileData;
    const { value: businessunitid } = selectedBusinessUnit;

    let newData = rowDto.map((item) => ({
      ...item,
      amount: item?.debitCredit === "Credit" ? item?.amount : +item?.amount,
    }));

  /*  if (values?.profitCenter && !values?.costRevenue) {
      return toast.warn("Please Select Cost Revenue ");
    } else {
      if (values?.costRevenue === "revenue") {
        if (!(values?.revenueCenter && values?.revenueElement)) {
          return toast.warn("Please add Revenue center and Revenue element");
        }
      } else if (values?.costRevenue === "cost") {
        if (!(values?.costCenter && values?.costElement)) {
          return toast.warn("Please add Cost center and Cost element");
        }
      }
    }
*/
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // let debit = newData
      //   .filter((itm) => itm.debitCredit === "Debit")
      //   .reduce((sum, current) => {
      //     return (sum += current.amount);
      //   }, 0);
      // let credit = newData
      //   .filter((itm) => itm.debitCredit === "Credit")
      //   .reduce((sum, current) => {
      //     return (sum += current.amount);
      //   }, 0);

      const debitCalc = () => {
        const debit = rowDto
          .filter((itm) => itm.debitCredit === "Debit")
          .map((itm) => Math.abs(itm.amount))
          .reduce((sum, curr) => {
            return (sum += curr);
          }, 0);
        return (debit || 0).toFixed(4);
      };

      const creditCalc = () => {
        let credit = rowDto
          .filter((itm) => itm.debitCredit === "Credit")
          .map((itm) => Math.abs(itm.amount))
          .reduce((sum, curr) => {
            return (sum += curr);
          }, 0);
        return (credit || 0).toFixed(4);
      };


      // const newDebit = (debit || 0).toFixed(4)
      // const newCredit = (credit || 0).toFixed(4)

      if (id) {
        if (debitCalc() !== creditCalc())
          return toast.warning("Debit & Credit must be equal");

        const objRowList = newData.map((itm) => {
          return {
            rowId: itm?.rowId || 0,
            adjustmentJournalId: +id,
            generalLedgerId: itm?.gl?.value || 0,
            generalLedgerCode: itm?.gl?.code || "",
            generalLedgerName: itm?.gl?.label || "",
            narration: itm?.headerNarration,
            amount:
              itm?.debitCredit === "Credit" ? -1 * itm?.amount : +itm?.amount,
            businessTransactionId: itm?.transaction?.value || 0,
            businessTransactionCode: itm?.transaction?.code || "",
            businessTransactionName: itm?.transaction?.label || "",
            businessPartnerId:
              itm?.partnerType?.label === "Others"
                ? 0
                : itm?.transaction?.value,
            businessPartnerCode:
              itm?.partnerType?.label === "Others"
                ? ""
                : itm?.transaction?.code,
            businessPartnerName:
              itm?.partnerType?.label === "Others"
                ? ""
                : itm?.transaction?.label,
            partnerTypeName: itm?.partnerType?.label || "",
            partnerTypeId: itm?.partnerType?.reffPrtTypeId || 0,
            subGLId: itm?.transaction?.value,
            subGlCode: itm?.transaction?.code,
            subGLName: itm?.transaction?.label,
            subGLTypeId: itm?.partnerType?.reffPrtTypeId,
            subGLTypeName: itm?.partnerType?.label,
            profitCenterId: itm?.profitCenterId || 0,
            costRevenueName: itm?.costRevenueName || "",
            costRevenueId: itm?.costRevenueId || 0,
            elementName: itm?.elementName || "",
            elementId: itm?.elementId || 0,
            controlType: itm?.controlType || "",
          };
        });
        const editAdjustmentJournalData = {
          objHeader: {
            journalDate: _dateFormatter(values?.transactionDate),
            adjustmentJournalId: +id,
            amount: +debitCalc(),
            narration: values?.headerNarration,
            actionBy: actionBy,
            controlType: values?.costRevenue || "",
            costRevenueName:
              values?.costRevenue === "revenue"
                ? values?.revenueCenter?.label
                : values?.costCenter?.label || "",
            costRevenueId:
              values?.costRevenue === "revenue"
                ? values?.revenueCenter?.value
                : values?.costCenter?.value || 0,
            elementName:
              values?.costRevenue === "revenue"
                ? values?.revenueElement?.label
                : values?.costElement?.label || "",
            elementId:
              values?.costRevenue === "revenue"
                ? values?.revenueElement?.value
                : values?.costElement?.value || 0,
            ProfitCenterId: values?.profitCenter?.value,
          },
          objRow: objRowList,
        };
        dispatch(
          saveEditedAdjustmentJournal(editAdjustmentJournalData, setDisabled)
        );
      } else {
        const objRow = newData?.map((itm) => {
          return {
            rowId: 0,
            generalLedgerId: itm?.gl?.value || 0,
            generalLedgerCode: itm?.gl?.code || "",
            generalLedgerName: itm?.gl?.label || "",
            narration: itm?.headerNarration,
            amount:
              itm?.debitCredit === "Credit" ? -1 * itm?.amount : +itm?.amount,
            businessTransactionId: itm?.transaction?.value || 0,
            businessTransactionCode: itm?.transaction?.code || "",
            businessTransactionName: itm?.transaction?.label || "",
            businessPartnerId:
              itm?.partnerType?.label === "Others"
                ? 0
                : itm?.transaction?.value,
            businessPartnerCode:
              itm?.partnerType?.label === "Others"
                ? ""
                : itm?.transaction?.code,
            businessPartnerName:
              itm?.partnerType?.label === "Others"
                ? ""
                : itm?.transaction?.label,
            partnerTypeName: itm?.partnerType?.label || "",
            partnerTypeId: itm?.partnerType?.reffPrtTypeId || 0,
            subGLId: itm?.transaction?.value,
            subGlCode: itm?.transaction?.code,
            subGLName: itm?.transaction?.label,
            subGLTypeId: itm?.partnerType?.reffPrtTypeId,
            subGLTypeName: itm?.partnerType?.label,
            profitCenterId: itm?.profitCenterId || 0,
            costRevenueName: itm?.costRevenueName || "",
            costRevenueId: itm?.costRevenueId || 0,
            elementName: itm?.elementName || "",
            elementId: itm?.elementId || 0,
            controlType: itm?.controlType || "",
          };
        });
        if (debitCalc() !== creditCalc())
          return toast.warning("Debit & Credit must be equal");

        const saveAdjustmentJournalData = {
          objHeader: {
            journalDate: _dateFormatter(values?.transactionDate),
            accountId: accountId,
            businessUnitId: businessunitid,
            sbuId: location?.state?.selectedSbu?.value,
            amount: +debitCalc(),
            narration: values?.headerNarration,
            posted: false,
            accountingJournalTypeId: 7,
            directPosting: true,
            actionBy: actionBy,
            controlType: values?.costRevenue || "",
            costRevenueName:
              values?.costRevenue === "revenue"
                ? values?.revenueCenter?.label
                : values?.costCenter?.label || "",
            costRevenueId:
              values?.costRevenue === "revenue"
                ? values?.revenueCenter?.value
                : values?.costCenter?.value || 0,
            elementName:
              values?.costRevenue === "revenue"
                ? values?.revenueElement?.label
                : values?.costElement?.label || "",
            elementId:
              values?.costRevenue === "revenue"
                ? values?.revenueElement?.value
                : values?.costElement?.value || 0,
            ProfitCenterId: values?.profitCenter?.value,
            attachment:values?.attachment?.[0]?.id
          },
          objRowList: objRow,
        };
        dispatch(
          saveAdjustmentJournal({
            data: saveAdjustmentJournalData,
            cb,
            setDisabled,
            IConfirmModal,
          })
        );
      }
    } else {
      setDisabled(false);
    }
  };

  const rowDtoHandler = (index, name, value) => {
    const data = [...rowDto];
    data[index][name] = value;
    setRowDto(data);
  };

  const setter = (payload, values) => {
    let data = [...rowDto];
    data.push({
      ...payload,
      adjustmentJournalId: 0,
      adjustmentJournalCode: "string",
      // new field add row
      controlType: payload?.costRevenue || "",
      profitCenterId: payload?.profitCenter?.value || 0,
      costRevenueName:
        payload?.revenueCenter?.label || payload?.costCenter?.label || "",
      costRevenueId:
        payload?.revenueCenter?.value || payload?.costCenter?.value || 0,
      elementName:
        payload?.revenueElement?.label || payload?.costElement?.label || "",
      elementId:
        payload?.revenueElement?.value || payload?.costElement?.value || 0,
    });
    setRowDto(data);
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title={
        id
          ? `Create Adjustment Journal(${singleData?.adjustmentJournalCode ||
              ""})`
          : "Create Adjustment Journal"
      }
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        state={location?.state || ""}
        isEdit={id || false}
        setRowDto={setRowDto}
        partnerTypeDDL={partnerTypeDDL}
        rowDtoHandler={rowDtoHandler}
      />
    </IForm>
  );
}
