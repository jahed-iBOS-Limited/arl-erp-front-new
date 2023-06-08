import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import {
  saveHolidaySetup_Action,
  getSingleDataById,
  saveEditedHolidaySetup,
} from "../helper";
import Loading from "../../../../_helper/_loading";
import { _todayDate } from "../../../../_helper/_todayDate";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { isUniq } from "../../../../_helper/uniqChecker";
import ICustomCard from "../../../../_helper/_customCard";

const initData = {
  holidayGroupName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  description: "",
};

export default function HolidaySetupViewForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      getSingleDataById(id, setSingleData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  console.log(singleData, "singleData");

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData]);

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
          intHolidaySetupRowId: +item?.intHolidaySetupRowId,
          intAccountId: +profileData?.accountId,
          strHolidayRowName: item?.description,
          dteFromDate: item?.fromDate,
          dteToDate: item?.toDate,
          intActionBy: profileData?.userId,
        }));

        saveEditedHolidaySetup(payload, setDisabled);
      } else {
        let objRow = rowDto?.map((item) => ({
          intAccountId: profileData?.accountId,
          strHolidayRowName: item?.description,
          dteFromDate: _dateFormatter(item?.fromDate),
          dteToDate: _dateFormatter(item?.toDate),
        }));
        const payload = {
          objHeader: {
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
    <ICustomCard
      title={"View Holiday Setup"}
      backHandler={() => {
        history.goBack();
      }}
      renderProps={() => {}}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={id ? singleData : initData}
        isEdit={id}
        saveHandler={saveHandler}
        rowDto={rowDto}
        setRowDto={setRowDto}
        remover={remover}
        setter={setter}
      />
    </ICustomCard>
  );
}
