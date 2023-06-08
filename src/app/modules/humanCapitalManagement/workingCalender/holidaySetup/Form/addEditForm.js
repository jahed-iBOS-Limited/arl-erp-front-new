/* eslint-disable no-unreachable */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { toast } from "react-toastify";
import {
  saveHolidaySetup_Action,
  getSingleDataById,
  saveEditedHolidaySetup,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { isUniq } from "../../../../_helper/uniqChecker";

const initData = {
  holidayGroupName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  description: "",
};

export default function HolidaySetupForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getSingleDataById(id, setSingleData);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      const newData = singleData?.rowData?.map((item) => ({
        ...item,
        fromDate: _dateFormatter(item?.dteFromDate),
        toDate: _dateFormatter(item?.dteToDate),
        description: item?.strHolidayRowName,
      }));

      setRowDto(newData);
    } else {
      setRowDto([]);
    }
  }, [singleData]);

  const addItemToTheGrid = (values) => {
    let fromDate = rowDto.find((data) => data?.fromDate === values?.fromDate);
    let toDate = rowDto.find((data) => data?.toDate === values?.toDate);
    if (fromDate && toDate) {
      toast.error("Item already added");
    } else {
      let itemRow = {
        fromDate: _dateFormatter(values?.fromDate),
        toDate: _dateFormatter(values?.toDate),
        description: values?.description,
        rowId: values?.intHolidaySetupRowId,
      };
      setRowDto([...rowDto, itemRow]);
    }
  };

  const setter = (payload) => {
    if (isUniq("fromDate", payload.dteFromDate, rowDto)) {
      setRowDto([...rowDto, payload]);
    }
  };

  const remover = (i) => {
    const filterData = rowDto.filter((item, index) => i !== index);
    setRowDto(filterData);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create
      if (id) {
        const payload = rowDto?.map((item) => ({
          intHolidaySetupRowId: +item?.rowId || 0,
          intHolidaySetupHeaderId: singleData?.headerId,
          strHolidayRowName: item?.description,
          dteFromDate: item?.fromDate,
          dteToDate: item?.toDate,
          intActionBy: profileData?.userId,
        }));

        saveEditedHolidaySetup(payload, setDisabled);
      } else {
        if (rowDto?.length < 1)
          return toast.warn("Please add atleast one holiday");
        let objRow = rowDto?.map((item) => ({
          strHolidayRowName: item?.description,
          dteFromDate: _dateFormatter(item?.fromDate),
          dteToDate: _dateFormatter(item?.toDate),
        }));
        const payload = {
          objHeader: {
            intAccountId: profileData?.accountId,
            strHolidayName: values?.holidayGroupName,
            intActionBy: profileData?.accountId,
          },
          objRow: objRow,
        };
        saveHolidaySetup_Action(payload, cb, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };
  const [objProps, setObjprops] = useState({});

  return (
    <IForm
      title="Create Holiday Setup"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
        addItemToTheGrid={addItemToTheGrid}
        isEdit={id}
      />
    </IForm>
  );
}
