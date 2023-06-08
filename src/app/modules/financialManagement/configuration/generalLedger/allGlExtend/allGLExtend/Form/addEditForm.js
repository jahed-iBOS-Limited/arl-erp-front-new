// /* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { getPermissionBuID_api, saveAllGlExtend } from "../../helper";
import IForm from "../../../../../../_helper/_form";
import Loading from "../../../../../../_helper/_loading";

const initData = {
  id: undefined,
  businessUnitName: "",
  type: false,
};

export default function AllextendGLForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [objProps, setObjprops] = useState({});

  const [rowDto, setRowDto] = useState([]);
  const params = useParams();
  const location = useLocation();
  // const [gridData, setGridData] = useState({});
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    getPermissionBuID_api(
      profileData?.userId,
      profileData?.accountId,
      setBusinessUnitDDL
    );
  }, [profileData]);

  //SingleData to view
  // eslint-disable-next-line no-unused-vars
  const [singleData, setSingleData] = useState("");

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId) {
      const modifyFilterRowDto = rowDto.filter((itm) => itm.itemCheck === true);

      const payload = modifyFilterRowDto?.map((item, index) => ({
        intAccountId: profileData?.accountId,
        intBusinessUnitId: values?.businessUnitName?.value,
        intGeneralLedgerId: item?.intGeneralLedgerId,
        strGeneralLedgerCode: +item?.strGeneralLedgerCode,
        strGeneralLedgerName: item?.strGeneralLedgerName,
        numCurrentBalance: 0,
        intActionBy: 0,
      }));

      if (rowDto?.length === 0) {
        toast.warn("Please add transaction");
      } else {
        const callBackFunc = () => {
          cb();
          window.location.reload();
        };
        saveAllGlExtend(payload, callBackFunc, setDisabled);
      }
    } else {
      setDisabled(false);
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((itm, idx) => idx !== index);
    setRowDto(filterArr);
  };

  const rowDtoHandler = (name, value, sl) => {
    const xData = [...rowDto];
    xData[sl][name] = +value;
    setRowDto([...xData]);
  };

  return (
    <IForm title="All GL Extend" getProps={setObjprops} isDisabled={isDisabled}>
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={params?.id ? singleData : initData}
        saveHandler={saveHandler}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        rowDtoHandler={rowDtoHandler}
        rowDto={rowDto}
        remover={remover}
        setRowDto={setRowDto}
        state={location.state}
        businessUnitDDL={businessUnitDDL}
      />
    </IForm>
  );
}
