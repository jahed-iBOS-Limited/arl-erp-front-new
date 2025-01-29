import React, { useState, useEffect } from "react";
import HeaderForm from "./form";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  getBankJournalGridData,
  // saveCancel_action,
  saveCompleted_action,
} from "../_redux/Actions";
import IConfirmModal from "./../../../../_helper/_confirmModal";
import "../style.css";
import { cancelJournal } from "../helper";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { toast } from "react-toastify";

export default function BankJournalLanding() {
  const [rowDto, setRowDto] = useState([]);
  const [approval, Setapproval] = useState(true);
  const [landing, setLanding] = useState(false);
  //paginationState
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(500);
  const [totalCountRowDto, setTotalCountRowDto] = React.useState(0);
  const [typeStatus, setTypeStatus] = React.useState("");
  const dispatch = useDispatch();
  // get salesOrder list  from store
  const gridData = useSelector((state) => {
    return state.bankJournal?.gridData;
  }, shallowEqual);

  let bankJournal = useSelector(
    (state) => {
      return {
        profileData: state.authData.profileData,
        selectedBusinessUnit: state.authData.selectedBusinessUnit,
        bankJournalLanding: state?.localStorage?.bankJournalLanding,
      };
    },
    { shallowEqual }
  );

  let { profileData, selectedBusinessUnit, bankJournalLanding } = bankJournal;

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
    const approval = modifyGridData.some((itm) => itm.itemCheck === true);
    if (approval) {
      Setapproval(false);
    } else {
      Setapproval(true);
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
        getBankJournalGridData(
          selectedBusinessUnit.value,
          sbu,
          journalType,
          false,
          true,
          formDate,
          toDate,
          setLanding,
          pageNo,
          pageSize
        )
        //isPosted, isActive, fromdate, todate, voucherCode
      );
    }
    if (type === "complated") {
      dispatch(
        getBankJournalGridData(
          selectedBusinessUnit.value,
          sbu,
          journalType,
          true,
          true,
          formDate,
          toDate,
          setLanding,
          pageNo,
          pageSize
        )
        //isPosted, isActive, fromdate, todate, voucherCode
      );
    }
    if (type === "canceled") {
      dispatch(
        getBankJournalGridData(
          selectedBusinessUnit.value,
          sbu,
          journalType,
          false,
          false,
          formDate,
          toDate,
          setLanding,
          pageNo,
          pageSize
        )
        //isPosted, isActive, fromdate, todate, voucherCode
      );
    }
  };

  useEffect(() => {
    if (bankJournalLanding?.sbu?.value) {
      gridDataLoad(
        bankJournalLanding?.sbu.value,
        bankJournalLanding?.accountingJournalTypeId?.value,
        bankJournalLanding?.fromDate,
        bankJournalLanding?.toDate,
        bankJournalLanding?.type,
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
  // complete btn submit handler
  const approvalHandler = (date, journalType) => {
    const modifyFilterRowDto = rowDto.filter((itm) => itm.itemCheck === true);
    const updateRowDto = rowDto.filter((itm) => itm.itemCheck !== true);

    // complete date should be greather than equal to all row journal date
    const isInvalid = modifyFilterRowDto.filter(
      (item) => date < _dateFormatter(item?.journalDate)
    );

    if (isInvalid.length > 0 && journalType?.label?.trim() !== "Bank Receipts")
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
          journalTypeId: journalType?.value,
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

  //singleApprovalndler
  const singleApprovalndler = (index, date, accountingJournalTypeId) => {
    const singleData = [gridData?.[index]];
    const updateRowDto = rowDto.filter((itm, idx) => idx !== index);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to post the selected journals on ${date}?`,
      yesAlertFunc: () => {
        const payload = singleData.map((itm) => ({
          businessUnitId: selectedBusinessUnit.value,
          accountingJournalId: itm.journalId,
          journalTypeId: accountingJournalTypeId,
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
  };

  const remover = (id, journalTypeValue) => {
    const singleData = rowDto?.[id];
    const updateRowDto = rowDto.filter((itm, idx) => idx !== id);
    let confirmObject = {
      title: "Are you sure?",
      message: `Do you want to cancel the journal?`,
      yesAlertFunc: () => {
        cancelJournal(
          singleData?.code,
          journalTypeValue,
          selectedBusinessUnit?.value,
          profileData?.userId,
          typeStatus.toLowerCase() === "complated" ? 1 : 2,
          () => {
            setRowDto(updateRowDto);
          }
        );
        // dispatch(saveCancel_action(payload, updateRowDto, setRowDto));
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
        setRowDto={setRowDto}
        approval={approval}
        bankJournalLanding={bankJournalLanding}
        approvalHandler={approvalHandler}
        onChangeCheckHandler={onChangeCheckHandler}
        singleApprovalndler={singleApprovalndler}
        gridDataLoad={gridDataLoad}
        rowDto={rowDto}
        allGridCheck={allGridCheck}
        itemSlectedHandler={itemSlectedHandler}
        remover={remover}
        landing={landing}
        paginationState={{
          pageNo,
          setPageNo,
          pageSize,
          setPageSize,
          totalCountRowDto,
        }}
        setLanding={setLanding}
        setTypeStatus={setTypeStatus}
      />

      {/* <Route path="/financial-management/financials/bank/view/:id">
        {({ history, match }) => (
          <ViewForm
            show={match != null}
            id={match && match.params.id}
            history={history}
            onHide={() => {
              history.push("/financial-management/financials/bank/");
            }}
          />
        )}
      </Route> */}
    </>
  );
}
