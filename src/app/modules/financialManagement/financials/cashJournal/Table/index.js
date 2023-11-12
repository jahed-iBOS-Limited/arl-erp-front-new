import React, { useState, useEffect } from "react";
import HeaderForm from "./form";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getCashJournalGridData,
  saveCancel_action,
  saveCompleted_action,
} from "../_redux/Actions";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";
export default function CashJournalLanding() {
  const [rowDto, setRowDto] = useState([]);
  const [approval, Setapproval] = useState(true);
  const [loading, setLoading] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(500);
  const [totalCountRowDto, setTotalCountRowDto] = React.useState(0);
  const dispatch = useDispatch();
  // get salesOrder list  from store
  const gridData = useSelector((state) => {
    return state.cashJournal?.gridData;
  }, shallowEqual);

  let cashJournal = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        cashJournalLanding: state?.localStorage?.cashJournalLanding,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit, cashJournalLanding } = cashJournal;

  useEffect(() => {
    if (gridData?.length > 0) {
      const newRowDto = gridData?.map((itm) => ({
        ...itm,
        itemCheck: false,
      }));
      setRowDto(newRowDto);
      setTotalCountRowDto(gridData?.[0]?.totalRows);
    } else {
      setRowDto([]);
      setTotalCountRowDto(0);
    }
  }, [gridData]);

  // one item select
  const itemSlectedHandler = (value, index) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index].itemCheck = !copyRowDto[index].itemCheck;
    setRowDto(copyRowDto);

    const approval = copyRowDto.some((itm) => itm.itemCheck === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  // All item select
  const allGridCheck = (value) => {
    const modifyGridData = gridData?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
    const approval = modifyGridData?.some((itm) => itm.itemCheck === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };
  // complete btn submit handler
  const approvalHandler = (date, journalTypeValue) => {
    const modifyFilterRowDto = rowDto.filter((itm) => itm.itemCheck === true);
    const updateRowDto = rowDto.filter((itm) => itm.itemCheck !== true);

    // complete date should be greather than equal to all row journal date
    const isInvalid = modifyFilterRowDto.filter(
      (item) => date < _dateFormatter(item?.journalDate)
    );

    if (isInvalid.length > 0)
      return toast.warn(
        `Complete date should be greather than or equal to journal date for ${isInvalid[0]?.code}`
      );
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected journals on ${date}?`,
      yesAlertFunc: () => {
        const payload = modifyFilterRowDto.map((itm) => ({
          businessUnitId: selectedBusinessUnit.value,
          accountingJournalId: itm.journalId,
          journalTypeId: journalTypeValue,
          transactionDate: date,
          actionBy: profileData.userId,
        }));
        dispatch(saveCompleted_action(payload, updateRowDto, setRowDto));
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);

    //
  };

  const gridDataLoad = (
    sbu,
    journalType,
    formDate,
    toDate,
    type,
    pageNo,
    pageSize
  ) => {
    if (type === "notComplated") {
      dispatch(
        getCashJournalGridData(
          selectedBusinessUnit.value,
          sbu,
          journalType,
          false,
          true,
          formDate,
          toDate,
          setLoading,
          pageNo,
          pageSize
        )
        //isPosted, isActive, fromdate, todate, voucherCode
      );
    }
    if (type === "complated") {
      dispatch(
        getCashJournalGridData(
          selectedBusinessUnit.value,
          sbu,
          journalType,
          true,
          true,
          formDate,
          toDate,
          setLoading,
          pageNo,
          pageSize
        )
        //isPosted, isActive, fromdate, todate, voucherCode
      );
    }
    if (type === "canceled") {
      dispatch(
        getCashJournalGridData(
          selectedBusinessUnit.value,
          sbu,
          journalType,
          false,
          false,
          formDate,
          toDate,
          setLoading,
          pageNo,
          pageSize
        )
        //isPosted, isActive, fromdate, todate, voucherCode
      );
    }
  };

  useEffect(() => {
    if (cashJournalLanding?.sbu?.value) {
      gridDataLoad(
        cashJournalLanding.sbu.value,
        cashJournalLanding?.accountingJournalTypeId?.value,
        cashJournalLanding?.fromDate,
        cashJournalLanding?.toDate,
        cashJournalLanding?.type,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const remover = (id, journalTypeValue) => {
    const singleData = [rowDto?.[id]];
    const updateRowDto = rowDto.filter((itm, idx) => idx !== id);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to cancel the journal?`,
      yesAlertFunc: () => {
        const payload = singleData.map((itm) => ({
          journalId: itm?.journalId,
          journalTypeId: journalTypeValue,
          actionBy: profileData?.userId,
          journalCode: itm?.code,
          businessUnitId: selectedBusinessUnit?.value,
          typeId: 2,
        }));
        dispatch(saveCancel_action(payload, updateRowDto, setRowDto));
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
  };

  const singleApprovalndler = (index, date, journalTypeValue) => {
    const singleData = [rowDto?.[index]];
    const updateRowDto = rowDto.filter((itm, idx) => idx !== index);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected journals on ${date}?`,
      yesAlertFunc: () => {
        const payload = singleData.map((itm) => ({
          businessUnitId: selectedBusinessUnit?.value,
          accountingJournalId: itm?.journalId,
          journalTypeId: journalTypeValue,
          transactionDate: date,
          actionBy: profileData?.userId,
        }));
        dispatch(saveCompleted_action(payload, updateRowDto, setRowDto));
      },
      noAlertFunc: () => {
        //alert("Click No");
      },
    };
    IConfirmModal(confirmObject);
  };

  return (
    <>
      <HeaderForm
        cashJournalLanding={cashJournalLanding}
        approval={approval}
        approvalHandler={approvalHandler}
        singleApprovalndler={singleApprovalndler}
        gridDataLoad={gridDataLoad}
        rowDto={rowDto}
        allGridCheck={allGridCheck}
        itemSlectedHandler={itemSlectedHandler}
        remover={remover}
        loading={loading}
        setLoading={setLoading}
        paginationState={{
          pageNo,
          setPageNo,
          pageSize,
          setPageSize,
          totalCountRowDto,
        }}
        setRowDto={setRowDto}
        selectedBusinessUnit={selectedBusinessUnit}
        profileData={profileData}
      />
    </>
  );
}
