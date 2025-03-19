import React, { useEffect, useState } from "react";
import { useSelector, shallowEqual } from "react-redux";
import Form from "./form";
import IForm from "../../../../_helper/_form";
import { useLocation, useParams } from "react-router-dom";
import {
  getSingleData,
  GetVahicleDDL,
  saveAllowanceSetUp,
  GetComponentDDL,
  GetAllowanceSetUpPagination,
} from "../helper";
import Loading from "./../../../../_helper/_loading";
import { toast } from "react-toastify";

const initData = {
  vahicleCapacity: "",
  daamount: "",
  daComponent: "",
  downTripAllowance: "",
  allowance: "",
};

export default function AllowanceSetUpCreateForm() {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [singleData, setSingleData] = useState("");
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const params = useParams();
  const [vahicleCapacity, setVahicleCapacity] = useState([]);
  const [daComponent, setDaComponent] = useState([]);
  const [allowance, setAllowance] = useState([]);
  const [gridData, setGridData] = useState([]);

  const storeData = useSelector((state) => {
    return {
      profileData: state?.authData?.profileData,
      selectedBusinessUnit: state?.authData?.selectedBusinessUnit,
    };
  }, shallowEqual);

  const { profileData, selectedBusinessUnit } = storeData;
  useEffect(() => {
    if ((profileData?.accountId && selectedBusinessUnit?.value)) {
      GetVahicleDDL(setVahicleCapacity);
      GetComponentDDL(profileData.accountId, setDaComponent);
      GetComponentDDL(profileData.accountId, setAllowance);
      GetAllowanceSetUpPagination(
        profileData.accountId,
        selectedBusinessUnit?.value,
        setGridData
      );
    }
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    if (params?.id) {
      getSingleData(
        params?.id,
        selectedBusinessUnit?.value,
        setSingleData,
        setRowDto
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]); // location

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      // if id , then this is for edit , else this is for create

      const objAllowanceRow = gridData.map((itm) => {
        return {
          configId: +itm?.configId || 0,
          vehicleCapacityId: itm?.vehicleCapacityId,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          daamount: +itm?.daamount,
          downTripAllowance: +itm?.downTripAllowance,
          downTripAllowanceId: itm?.downTripAllowanceId,
          dacostComponentId: itm?.dacostComponentId,
        };
      });

      const payload = objAllowanceRow;

      saveAllowanceSetUp(payload, cb, setDisabled);
    } else {
      setDisabled(false);
    }
  };

  //input in table row for daamount and allowance amount
  const setDaAmount = (sl, value, name) => {
    const cloneArr = gridData;
    cloneArr[sl][name] = value;
    setGridData([...cloneArr]);
  };

  const setter = (payload) => {
    console.log(payload?.dacostComponentId, payload?.downTripAllowanceId )
    const duplicateCheck = gridData?.filter(
      (item) =>
        item?.dacostComponentId === payload?.dacostComponentId &&
        item?.downTripAllowanceId === payload?.downTripAllowanceId &&  item?.vehicleCapacityId === payload?.vehicleCapacityId
    );
    console.log(duplicateCheck)
    if (duplicateCheck?.length > 0) {
      toast.warning("Not Allowed Duplicate Item");
    } else {
      setGridData([payload, ...gridData]);
    }
  };

  const remover = (payload) => {
    const filterArr = gridData.filter((itm, idx) => idx !== payload);
    setGridData(filterArr);
  };

  const itemSelectHandler = (index, value, name) => {
    const copyRowDto = [...rowDto];
    copyRowDto[index][name] = !copyRowDto[index][name];
    setRowDto(copyRowDto);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  return (
    <IForm
      title={"Allowance Set-Up"}
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}

      <Form
        {...objProps}
        initData={params?.id ? singleData?.objHeader : initData}
        saveHandler={saveHandler}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        profileData={profileData}
        selectedBusinessUnit={selectedBusinessUnit}
        sbu={location?.state?.selectedSbu}
        vahicleCapacity={vahicleCapacity}
        setDaAmount={setDaAmount}
        daComponent={daComponent}
        allowance={allowance}
        gridData={gridData}
        itemSelectHandler={itemSelectHandler}
        isEdit={params?.id || false}
        setRowDto={setRowDto}
        disableHandler={disableHandler}
      />
    </IForm>
  );
}
