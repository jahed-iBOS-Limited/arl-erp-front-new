import React, { useState, useRef, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  ModalProgressBar,
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../_metronic/_partials/controls";
import Loading from "../../../_helper/_loading";
import { _todayDate } from "../../../_helper/_todayDate";
import Form from "./form";
import {
  GetBusinessUnitTaxView,
  getRepresentative_api,
  getTaxCircle_api,
  getTaxZone_api,
  saveBusinessUnitTaxInfo,
} from "./helper";
import {
  getBuTaxConfigGridData,
  saveBuTaxConfigAction,
} from "./_redux/Actions";

const initData = {
  isCd: false,
  isRd: false,
  isSd: false,
  isVat: false,
  isSurcharge: false,
  isAit: false,
  isAtv: false,
  isVds: false,
  isTds: false,
  isAt: "",
  // init data new
  taxZoneDDL: "",
  taxCircleDDL: "",
  returnSubmissionDate: _todayDate(),
  representativeDDL: "",
  representativeRankDDL: "",
  representativeAddress: "",
  binNo: "",
  taxBracket: "",
  economicActivityName: "",
  businesUnitAddress: "",
  ownerShipType: "",
  vatDeductionSourceTax: false,
  surchargeType: "",
  businessNature: ''
};

export default function BsuTaxConfig() {
  const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);
  // new api's start
  const [taxCircleDDL, setTaxCircleDDL] = useState("");
  const [taxZoneDDL, setTaxZoneeDDL] = useState("");
  const [representativeDDL, setRepresentativeDDL] = useState("");
  const [singleData, setSingleData] = useState("");
  // new api's end
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  const [isDisabled, setDisabled] = useState(false);
  // get controlling unit list  from store
  const gridData = useSelector((state) => {
    return state.buTaxConfig?.gridData;
  }, shallowEqual);
  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      dispatch(
        getBuTaxConfigGridData(
          profileData?.accountId,
          selectedBusinessUnit?.value,
          setDisabled
        )
      );
      getTaxCircle_api(setTaxCircleDDL);
      getTaxZone_api(setTaxZoneeDDL);
      getRepresentative_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setRepresentativeDDL
      );
      GetBusinessUnitTaxView(selectedBusinessUnit?.value, setSingleData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  useEffect(() => {
    if (selectedBusinessUnit && profileData) {
      if (gridData?.length > 0) {
        const newData = gridData.map((item) => ({ ...item }));
        setRowDto(newData);
      } else {
        setRowDto([]);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gridData]);

  function createBuTaxInfo(values) {
    const payload = {
      actionBy: profileData.userId,
      // businessUnitTaxInfoId: +id,
      businessUnitId: selectedBusinessUnit.value,
      businessUnitName: selectedBusinessUnit.label,
      accountId: profileData.accountId,
      taxZoneId: +values?.taxZoneDDL.value,
      taxZoneName: values?.taxZoneDDL.label,
      taxCircleId: +values?.taxCircleDDL.value,
      taxCircleName: values?.taxCircleDDL.label,
      returnSubmissionDate: _todayDate(),
      representativeId: +values?.representativeDDL.value,
      representativeName: values?.representativeDDL.label,
      representativeRank: values?.representativeRankDDL.label,
      representativeAddress: values?.representativeAddress,
      binNo: values?.binNo,
      taxBracketId: values?.taxBracket?.value || 0,
      businessUnitAddress: values?.businesUnitAddress,
      typeOfOwnership: values?.ownerShipType?.value,
      typeOfOwnershipName: values?.ownerShipType?.label,
      economicActivityName: values?.economicActivityName,
      isVatDeductionSourceTax: values?.vatDeductionSourceTax,
      surchargeTypeId: values?.surchargeType?.value,
      businessNatureTypeId: values?.businessNature?.value
      
    };
    saveBusinessUnitTaxInfo(payload, setSingleData);
  }

  const saveBusTaxConfig = async (values, cb) => {
    setDisabled(true);
    if (values && selectedBusinessUnit && profileData) {
      const { accountId, userId: actionBy } = profileData;
      const { value: businessunitid } = selectedBusinessUnit;
      const newRowDto = rowDto.map((itm, index) => {
        return {
          ...itm,
          configId: itm?.configId || 0,
          accountId: accountId,
          businessUnitId: businessunitid,
          tradeTypeId: itm?.tradeTypeId,
          isCd: itm?.isCd,
          isRd: itm?.isRd,
          isSd: itm?.isSd,
          isVat: itm?.isVat,
          isSurcharge: itm?.isSurcharge,
          isAit: itm?.isAit,
          isAtv: itm?.isAtv,
          isVds: itm?.isVds,
          isTds: itm?.isTds,
          isAt: itm?.isAt,
          actionBy,
          lastActionDateTime: _todayDate(),
        };
      });
      dispatch(
        saveBuTaxConfigAction({
          data: newRowDto,
          createBuTaxInfo,
          values,
          setDisabled,
        })
      );
    } else {
      setDisabled(false);
    }
  };

  // Set and get value in rowdto
  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };
  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };
  return (
    <>
      <Card>
        {true && <ModalProgressBar />}
        <CardHeader title="Business Unit Tax Config">
          <CardHeaderToolbar>
            <button
              type="reset"
              onClick={ResetProductClick}
              ref={resetBtnRef}
              className="btn btn-light ml-2"
            >
              <i className="fa fa-redo"></i>
              Reset
            </button>
            <button
              type="submit"
              className="btn btn-primary ml-2"
              onClick={saveBtnClicker}
              ref={btnRef}
              disabled={isDisabled}
            >
              Save
            </button>
          </CardHeaderToolbar>
        </CardHeader>
        <CardBody>
          <div className="mt-0">
            {isDisabled && <Loading />}
            <Form
              initData={singleData || initData}
              btnRef={btnRef}
              saveBtnClicker={saveBtnClicker}
              resetBtnRef={resetBtnRef}
              //disableHandler={disableHandler}
              saveBusTaxConfig={saveBusTaxConfig}
              accountId={profileData.accountId}
              actionBy={profileData.userId}
              profileData={profileData}
              selectedBusinessUnit={selectedBusinessUnit}
              rowDto={rowDto}
              itemSelectHandler={itemSelectHandler}
              taxCircleDDL={taxCircleDDL}
              taxZoneDDL={taxZoneDDL}
              representativeDDL={representativeDDL}
              setDisabled={setDisabled}
            />
          </div>
        </CardBody>
      </Card>
    </>
  );
}
