/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import Form from "./form";
import { _todayDate } from "../../../../_helper/_todayDate";
import { getShipPointist } from "../../castingSchedule/helper";
import {
  ApproveCastingScheduleData,
  getCastingEntryListApprovePage,
  RejectCastingScheduleData,
} from "../helper";
import { Formik } from "formik";
import { toast } from "react-toastify";

const initData = {
  toDate: _todayDate(),
  fromDate: _todayDate(),
  shipPoint: "",
};

export default function CastingScheduleApproveLanding() {
  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [isDisabled, setIsDisabled] = useState(false);
  const [shipPointDDL, setShipPointDDL] = useState([]);
  const [rowData, setRowData] = useState([]);

  useEffect(() => {
    getShipPointist(
      profileData?.userId,
      profileData?.accountId,
      selectedBusinessUnit?.value,
      setShipPointDDL
    );
  }, [profileData, selectedBusinessUnit]);

  const saveHandler = async (values) => {
    const lData = rowData?.filter((item) => item?.isSelected);
    if (lData?.length === 0) return toast.warn("Please select atleast one row");

    const data = lData?.map((item) => {
      return {
        header: {
          intId: +item?.intId,
          strRemarks: item?.strRemarks,
          dteCastingDate: item?.dteCastingDate,
          numTotalApproveQuantity: item?.list?.reduce(
            (acc, obj) => acc + +obj?.numQuantity,
            0
          ),
        },
        row: item?.list?.map((nestedItem) => {
          return {
            rowId: +nestedItem?.intRowId,
            intCastingId: +nestedItem?.intCastingId,
            numApproveQuantity: +nestedItem?.numQuantity,
          };
        }),
      };
    });

    ApproveCastingScheduleData(data, setIsDisabled, () => {
      getLandingData(values, 0, 2000);
    });
  };

  const [objProps, setObjProps] = useState({});

  const dataChangeHandler = React.useCallback(
    (index, key, value, rowIndex) => {
      if (!rowIndex) {
        let _data = [...rowData];
        _data[index][key] = value;
        setRowData(_data);
      } else {
        let _data = [...rowData];
        _data[index].list[rowIndex][key] = value;
        setRowData(_data);
      }
    },
    [rowData]
  );

  const allSelect = React.useCallback(
    (value) => {
      let _data = [...rowData];
      const modify = _data.map((item) => {
        return { ...item, isSelected: value };
      });
      setRowData(modify);
    },
    [rowData]
  );

  const selectedAll = () => {
    return rowData?.filter((item) => item.isSelected)?.length ===
      rowData?.length && rowData?.length > 0
      ? true
      : false;
  };

  const getLandingData = (values, pgNo, pgSize) => {
    getCastingEntryListApprovePage(
      selectedBusinessUnit?.value,
      values,
      pgNo,
      pgSize,
      setRowData,
      setIsDisabled
    );
  };

  const rejectHandler = (values) => {
    const lData = rowData?.filter((item) => item?.isSelected);
    if (lData?.length === 0) return toast.warn("Please select atleast one row");

    const data = lData?.map((item) => {
      return {
        intId: +item?.intId,
        strRemarks: item?.strRemarks,
        dteCastingDate: item?.dteCastingDate,
        numTotalApproveQuantity: item?.list?.reduce(
          (acc, obj) => acc + +obj?.numQuantity,
          0
        ),
      };
    });

    RejectCastingScheduleData(data, setIsDisabled, () => {
      getLandingData(values, 0, 2000);
    });
  };

  const totalMaker = React.useMemo(() => {
    let total = 0;
    for (let item of rowData) {
      total += item?.list?.reduce((acc, obj) => acc + +obj?.numQuantity, 0);
    }

    return total;
  }, [rowData]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            <IForm
              isHiddenReset={true}
              title={"Casting Schedule Approve"}
              getProps={setObjProps}
              isDisabled={
                isDisabled ||
                rowData?.filter((item) => item.isSelected)?.length < 1
              }
              submitBtnText={"Approve"}
              renderProps={() => (
                <button
                  type="button"
                  disabled={
                    isDisabled ||
                    rowData?.filter((item) => item.isSelected)?.length < 1
                  }
                  className="btn btn-danger ml-2"
                  onClick={() => {
                    rejectHandler(values);
                  }}
                >
                  Reject
                </button>
              )}
            >
              {isDisabled && <Loading />}
              <Form
                {...objProps}
                formikprops={{
                  values,
                  errors,
                  touched,
                  setFieldValue,
                  handleSubmit,
                }}
                initData={initData}
                saveHandler={saveHandler}
                rowData={rowData}
                setRowData={setRowData}
                loading={isDisabled}
                getLandingData={getLandingData}
                dataChangeHandler={dataChangeHandler}
                shipPointDDL={shipPointDDL}
                profileData={profileData}
                selectedBusinessUnit={selectedBusinessUnit}
                setLoading={setIsDisabled}
                selectedAll={selectedAll}
                allSelect={allSelect}
                totalMaker={totalMaker}
              />
            </IForm>
          </>
        )}
      </Formik>
    </>
  );
}
