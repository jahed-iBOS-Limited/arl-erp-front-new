/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveCompetencyAction,
  saveEditedCompetencyAction,
  getCompetencyIdAction,
  setCompetencyEmpty,
  getEmployeeClusterListAction,
} from "../_redux/Actions";
import { toast } from "react-toastify";
import { isUniq } from "../../../_helper/uniqChecker";
import IForm from "../../../_helper/_form";

const initData = {
  id: undefined,
  competencyType: "",
  competencyName: "",
  competencyDefinition: "",
  demonstratedBehaviour: "",
  desiredValue: "",
  isPositive: true
};

export default function CompetencyForm({
  history,
  match: {
    params: { EditId },
  },
}) {
  const [isDisabled, setDisabled] = useState(true);
  const [rowDto, setRowDto] = useState([]);
  const [rowDtoTwo, setRowDtoTwo] = useState([]);
  const [objProps, setObjprops] = useState({});
  // if we get it as id, it will make our Edit title small letter , so we make id as EditId
  const id = EditId;

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.competencyTwo?.singleData;
  }, shallowEqual);

  const objValueMap = useSelector((state) => {
    return state.competencyTwo?.singleData?.objValueMap;
  }, shallowEqual);

  // get single controlling  unit from store
  const empClusterList = useSelector((state) => {
    return state.competencyTwo?.empClusterList;
  }, shallowEqual);

  const dispatch = useDispatch();

  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (id) {
      dispatch(getCompetencyIdAction(id));
    } else {
      dispatch(setCompetencyEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (objValueMap && id) {
      let data = objValueMap?.map((itm, index) => {
        return {
          ...itm,
        };
      });
      setRowDtoTwo([...data]);
    } else {
      setRowDtoTwo([]);
    }
  }, [objValueMap, id]);

  useEffect(() => {
    if (singleData && id) {
      let newData = singleData?.objDemo?.map(item => ({...item, isPositive : item?.isPositive}))
      setRowDto(newData);
    } else {
      setRowDto([]);
    }
  }, [singleData, id]);

  // //empClusterList data
  useEffect(() => {
    if (!id) {
      let data = empClusterList?.map((itm, index) => {
        return {
          ...itm,
          desiredValue: "",
        };
      });
      setRowDtoTwo([...data]);
    }
  }, [empClusterList, id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(getEmployeeClusterListAction());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const saveHandler = async (values, cb) => {
    setDisabled(true);
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (id) {
        const rowDtoTwoNew = rowDtoTwo.map((itm) => ({
          employeeClusterId:
            +itm.employeeClusterId || +itm.employeeCompetencyClusterId,
          desirValue: +itm.desiredValue,
          competencyDesireValueMapId: +itm.competencyDesiredValueMapingId,
        }));
        const payload = {
          objCompetency: {
            competencyId: values.competencyId,
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            competencyName: values.competencyName,
            competencyDefination: values.competencyDefinition,
            isFunctionalCompetency: values.competencyType.value,
            actionBy: +profileData.userId,
          },
          objValueMap: rowDtoTwoNew,
          objDemo: rowDto,
        };

        dispatch(saveEditedCompetencyAction(payload, cb));
      } else {
        const rowDtoTwoNew = rowDtoTwo.map((itm) => ({
          employeeClusterId: +itm.employeeCompetencyClusterId,
          desirValue: +itm.desiredValue,
        }));
        const payload = {
          objCompetency: {
            accountId: +profileData?.accountId,
            businessUnitId: +selectedBusinessUnit?.value,
            competencyName: values.competencyName,
            competencyDefination: values.competencyDefinition,
            isFunctionalCompetency: values.competencyType.value,
            actionBy: +profileData.userId,
          },
          objValueMap: rowDtoTwoNew,
          objDemBehav: rowDto,
        };
        if (!rowDto.length) {
          toast.warning("Demonstrated behaviour adds");
        } else {
          dispatch(saveCompetencyAction({ data: payload, cb }));
          setRowDtoTwo([]);
          setRowDto([]);
        }

        //
      }
    } else {
      setDisabled(false);
      
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDtoTwo];
    let _sl = data[sl];
    _sl[name] = value;
    setRowDtoTwo(data);
  };
  const setter = (values) => {
    if (
      isUniq("demonstratedBehaviour", values?.demonstratedBehaviour, rowDto)
    ) {
      let obj = {
        demonstratedBehaviour: values?.demonstratedBehaviour,
        configId: 0,
        isPositive: true,
      };
      setRowDto([...rowDto, obj]);
    }
  };
  const remover = (demonstratedBehaviour) => {
    const filterArr = rowDto.filter(
      (itm) => itm.demonstratedBehaviour !== demonstratedBehaviour
    );
    setRowDto(filterArr);
  };

  return (
    <IForm
      title={id ? "EDIT COMPETENCY" : "CREATE COMPETENCY"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      <Form
        {...objProps}
        initData={singleData.objCompetency || initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        isEdit={id || false}
        setter={setter}
        remover={remover}
        rowDto={rowDto}
        rowDtoTwo={rowDtoTwo}
        rowDtoHandler={rowDtoHandler}
        id={id}
        setRowDto={setRowDto}
      />
    </IForm>
  );
}
