import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import IForm from "../../../../_helper/_form";
import Loading from "../../../../_helper/_loading";
import {
  // businessunitDDL,
  createWorkplace,
  saveEditWorkplace,
  // eslint-disable-next-line no-unused-vars
  workPlaceById,
  workPlaceGroupById,
  workplaceGroupDDL,
} from "../Helper/Actions";
import WorkPlaceForm from "./Form";
import { useSelector, shallowEqual } from "react-redux";
import { toast } from "react-toastify";
let initData = {
  id: undefined,
  workplaceGroupName: "",
  // businessUnitName: "",
  workplaceName: "",
  workplaceCode: "",

  accountId: "",
  actionBy: "",
  workplaceGroupId: "",
  workplaceGroupCode: "",
  businessUnitId: "",
  businessUnitCode: "",
};

export default function WorkplaceForm() {
  const { id } = useParams();
  const [isDisabled, setDisabled] = useState(false);
  const [workplaceDDLData, setWorkplaceDDLData] = useState([]);
  // const [businessDDLData, setBusinessDDLData] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [singleWorkplaceData, setSingleWorkplaceData] = useState([]);
  const [rowData, setRowData] = useState([]);
  const [objProps, setObjprops] = useState({});
  const location = useLocation();
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    workplaceGroupDDL(setWorkplaceDDLData);
    // businessunitDDL(setBusinessDDLData);
  }, []);

  // useEffect(() => {
  //   if (id) {
  //     workPlaceById(id, setSingleWorkplaceData);
  //   }
  // }, [profileData, selectedBusinessUnit, id]);

  // if (id && singleWorkplaceData) {
  //   initData = {
  //     ...singleWorkplaceData[0],
  //   };
  // }
  // useEffect for row data
  useEffect(() => {
    workPlaceGroupById(
      location?.state?.workplaceGroupId,
      profileData?.accountId,
      setRowData
    );
  }, [location, profileData, selectedBusinessUnit]);
  //
  const saveHandler = async (data, cb) => {
    if (data) {
      if (id) {
        const modifiedData = rowData.map((item) => ({
          workplaceId: item?.workplaceId || 0,
          workplaceName: item?.workplaceName,
          workplaceCode: item?.workplaceCode,
          workplaceGroupId: +item?.workplaceGroupId,
          accountId: +profileData?.accountId,
          businessUnitId: +selectedBusinessUnit?.value,
          actionBy: +profileData?.userId,
        }));

        saveEditWorkplace(modifiedData, setDisabled);
      } else {
        if (rowData.length > 0) {
          createWorkplace(rowData, setDisabled, cb);
        } else {
          toast.warning("You must have to add atleast one item");
        }
      }
    } else {
      setDisabled(false);
    }
  };

  const rowDataAddHandler = (values, setFieldValue) => {
    // const foundData = rowData?.some(
    //   (item) => values?.workplaceName === item?.workplaceName
    // );
    const foundData = rowData?.some(
      (item) =>
        item?.workplaceName === values?.workplaceName ||
        item?.workplaceCode === values?.workplaceCode
    );

    if (foundData) {
      return toast.warn("workplace name or workplace code Already Added");
    } else {
      setRowData([
        ...rowData,
        {
          workplaceName: values?.workplaceName,
          workplaceCode: values?.workplaceCode,
          workplaceGroupId: values?.workplaceGroupName?.value,
          businessUnitName: selectedBusinessUnit?.label,
          accountId: profileData?.accountId,
          businessUnitId: selectedBusinessUnit?.value,
          actionBy: profileData?.userId,
          workplaceId: 0,
        },
      ]);
    }
  };
  return (
    <IForm
      title="Create Workplace"
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <WorkPlaceForm
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        id={id}
        workplaceDDLData={workplaceDDLData}
        // businessDDLData={businessDDLData}
        isEdit={id ? id : false}
        setRowData={setRowData}
        rowData={rowData}
        rowDataAddHandler={rowDataAddHandler}
        location={location}
      />
    </IForm>
  );
}
