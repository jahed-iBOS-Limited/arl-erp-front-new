import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Form from "./form";

import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
import {
  getBuDDL,
  getEmployeeGroupNameById,
  saveEmpGroupExtend,
} from "../helper";
import Loading from "../../../../_helper/_loading";

let initData = {
  employeeGroupName: "",
  businessUnit: "",
  allBusinessUnitCheck: false,
  businessUnitId: "",
  intExtendId: "",
};

export default function EmpGroupExtendCreateForm() {
  const { id } = useParams();
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(false);
  const [businessUnitDDL, setBusinessUnitDDL] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [singleWorkplaceData, setSingleWorkplaceData] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});
  const [allBusinessUnit, setAllBusinessUnit] = useState(false);

  const location = useLocation();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    getBuDDL(profileData?.userId, profileData?.accountId, setBusinessUnitDDL);
  }, [profileData]);

  // useEffect for row data
  useEffect(() => {
    getEmployeeGroupNameById(location?.state?.employeeGroupId, setRowDto);
  }, [location]);
  //
  const saveHandler = async (data, cb) => {
    if (profileData?.accountId && selectedBusinessUnit) {
      if (data) {
        const payload = rowDto.map((item) => ({
          intExtendId: +item?.intExtendId || 0,
          employeeGroupName: item?.employeeGroupName,
          employeeGroupId: +location?.state?.employeeGroupId,
          accountId: profileData?.accountId,
          businessUnitId: item?.businessUnitId,
          actionBy: profileData?.userId,
        }));
        if (rowDto.length > 0) {
          saveEmpGroupExtend(payload, cb, setDisabled);
        } else {
          toast.warning("You must have to add atleast one item");
        }
      } else {
        console.log(data);
      }
    }
  };

  const remover = (index) => {
    const filterArr = rowDto.filter((item, ind) => ind !== index);
    setRowDto(filterArr);
  };
  const rowDtoHandler = (values) => {
    const foundData = rowDto?.find(
      (item) => values?.businessUnit?.value === item?.businessUnitId
    );
    if (foundData) {
      toast.warn("Business Unit already added");
    } else {
      if (values.allBusinessUnitCheck) {
        // set rowDto if select all by checkbox
        let AllBusiness = businessUnitDDL.map((data) => {
          return {
            employeeGroupName: values?.employeeGroupName,
            businessUnit: data?.label,
            businessUnitId: data?.value,
          };
        });
        setRowDto(AllBusiness);
      } else {
        // set rowDto if select one by one
        let rowDataValues = {
          employeeGroupName: values?.employeeGroupName,
          businessUnit: values?.businessUnit?.label,
          businessUnitId: values?.businessUnit?.value,
        };
        setRowDto([...rowDto, rowDataValues]);
      }
    }
  };
  return (
    <IForm
      title="Extend Employee Group"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        id={id}
        businessUnitDDL={businessUnitDDL}
        setBusinessUnitDDL={setBusinessUnitDDL}
        isEdit={id ? id : false}
        setRowDto={setRowDto}
        rowDto={rowDto}
        rowDtoHandler={rowDtoHandler}
        location={location}
        allBusinessUnit={allBusinessUnit}
        setAllBusinessUnit={setAllBusinessUnit}
        remover={remover}
      />
    </IForm>
  );
}
