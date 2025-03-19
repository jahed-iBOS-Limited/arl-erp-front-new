/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import HeaderForm from "./form";
import ICard from "../../../../_helper/_card";
import IConfirmModal from "../../../../_helper/_confirmModal";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getCashJournalGridData,
  saveCompletedAdjustmentJournal,
  saveCancelAdjustmentJournal,
} from "../_redux/Actions";
import { toast } from "react-toastify";

export default function AddJustmentJournalLanding() {
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
    return state.adjustmentJournal?.gridData;
  }, shallowEqual);

  let adjustmentJournal = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        adjustmentJournalLanding: state?.localStorage?.adjustmentJournalLanding,
      };
    },
    { shallowEqual }
  );

  let {
    profileData,
    selectedBusinessUnit,
    adjustmentJournalLanding,
  } = adjustmentJournal;

  useEffect(() => {
    if (gridData?.length > 0) {
      const newRowDto = gridData?.map((itm) => ({
        ...itm,
        itemCheck: false,
      }));
      setRowDto(newRowDto);
      setTotalCountRowDto(gridData?.[0].totalRows);
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
    const modifyGridData = gridData?.data?.map((itm) => ({
      ...itm,
      itemCheck: value,
    }));
    setRowDto(modifyGridData);
    const approval = modifyGridData.some((itm) => itm.itemCheck === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
    }
  };

  const approvalHandler = (values) => {
    const { accountId, userId: actionBy } = profileData;
    const {
      value: businessunitid,
      label: businessunitLabel,
    } = selectedBusinessUnit;
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      const approval = rowDto.filter((itm) => itm.itemCheck === true);

      // complete date should be greather than equal to all row journal date
      const isInvalid = approval.filter(
        (item) => values?.completeDate < _dateFormatter(item?.journaldate)
      );

      if (isInvalid.length > 0)
        return toast.warn(
          `Complete date should be greather than or equal to journal date for ${isInvalid[0]?.code}`
        );

      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to post the selected journals on ${_dateFormatter(
          approval[0]?.journaldate
        )}?`,
        yesAlertFunc: async () => {
          if (approval) {
            const adjustmentJournalComplete = approval.map((itm) => {
              return {
                businessUnitId: selectedBusinessUnit?.value,
                accountingJournalId: itm?.journlaId,
                journalTypeId: 7,
                transactionDate: values?.completeDate,
                actionBy: actionBy,
              };
            });
            const modifyFilterRowDto = rowDto.filter(
              (itm) => itm.itemCheck !== true
            );
            // setRowDto(modifyFilterRowDto);
            dispatch(
              saveCompletedAdjustmentJournal(
                adjustmentJournalComplete,
                modifyFilterRowDto,
                setRowDto
              )
            );
          }
        },
        noAlertFunc: () => {
          alert("Click No");
        },
      };
      IConfirmModal(confirmObject);
    } else {
    }
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
          7,
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
          7,
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
          7,
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
    if (adjustmentJournalLanding?.sbu?.value) {
      gridDataLoad(
        adjustmentJournalLanding?.sbu.value,
        7,
        adjustmentJournalLanding?.fromDate,
        adjustmentJournalLanding?.toDate,
        adjustmentJournalLanding?.type,
        pageNo,
        pageSize
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onChangeCheckHandler = (type) => {
    if (type === "notComplated") {
    } else if (type === "notComplated") {
    }
  };

  const remover = (id) => {
    const { accountId, userId: actionBy } = profileData;
    const {
      value: businessunitid,
      label: businessunitLabel,
    } = selectedBusinessUnit;
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to cancel this journal?`,
        yesAlertFunc: async () => {
          const approvalCancel = rowDto.filter((itm, index) => index === id);
          if (approvalCancel) {
            const adjustmentJournalCancel = approvalCancel.map((itm) => {
              return {
                journalId: itm?.journlaId,
                journalTypeId: 7,
                actionBy: actionBy,
                journalCode: itm?.code,
                businessUnitId: selectedBusinessUnit?.value,
                // typeId = 2 cancel ,hardcord instructed by backend
                typeId: 2,
              };
            });
            let modifiedData = rowDto.filter((itm, index) => index !== id);
            dispatch(
              saveCancelAdjustmentJournal(
                adjustmentJournalCancel,
                modifiedData,
                setRowDto
              )
            );
          }
        },
        noAlertFunc: () => {
          // alert("Click No");
        },
      };
      IConfirmModal(confirmObject);
    } else {
    }
  };

  const singleApprovalndler = (index, completeDate) => {
    const { accountId, userId: actionBy } = profileData;
    const {
      value: businessunitid,
      label: businessunitLabel,
    } = selectedBusinessUnit;

    if (profileData?.accountId && selectedBusinessUnit?.value) {
      let confirmObject = {
        title: "Are you sure?",
        message: `Do you want to post the selected journals on ${_dateFormatter(
          completeDate
        )}?`,
        yesAlertFunc: () => {
          let singleData = gridData?.filter((itm, idx) => idx === index);
          if (singleData) {
            const adjustmentJournalComplete = singleData.map((itm) => {
              return {
                businessUnitId: selectedBusinessUnit?.value,
                accountingJournalId: itm?.journlaId,
                journalTypeId: 7,
                transactionDate: completeDate,
                actionBy: actionBy,
              };
            });
            const modifyFilterRowDto = rowDto.filter(
              (itm, idx) => idx !== index
            );
            dispatch(
              saveCompletedAdjustmentJournal(
                adjustmentJournalComplete,
                modifyFilterRowDto,
                setRowDto
              )
            );
          }
        },
        noAlertFunc: () => {
          alert("Click No");
        },
      };
      IConfirmModal(confirmObject);
    } else {
    }
  };

  return (
    <>
      <HeaderForm
        approval={approval}
        approvalHandler={approvalHandler}
        singleApprovalndler={singleApprovalndler}
        onChangeCheckHandler={onChangeCheckHandler}
        adjustmentJournalLanding={adjustmentJournalLanding}
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
        selectedBusinessUnit={selectedBusinessUnit}
        profileData={profileData}
        setRowDto={setRowDto}
      />
    </>
  );
}
