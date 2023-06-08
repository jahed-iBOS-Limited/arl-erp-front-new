/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  getWarehouseDDLAction,
  setShippingPointSingleEmpty,
  saveShippingPoint,
  getShippingPointById,
  saveExtendShippingPoint,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import Loading from "../../../../_helper/_loading";

const initData = {
  id: undefined,
  shipPointName: "",
  address: "",
};

export default function ShippingPointForm({
  history,
  match: {
    params: { extendId },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [rowDto, setRowDto] = useState([]);
  const [objProps, setObjprops] = useState({});
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get emplist ddl from store
  const warehouseDDL = useSelector((state) => {
    return state?.shippingPoint?.warehouseDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.shippingPoint?.singleData;
  }, shallowEqual);

  useEffect(() => {
    if (singleData.objRow) {
      setRowDto([...singleData.objRow]);
    }
  }, [singleData]);
  const dispatch = useDispatch();
  //Dispatch single data action and empty single data for create
  useEffect(() => {
    if (extendId) {
      dispatch(getShippingPointById(extendId));
    } else {
      dispatch(setShippingPointSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [extendId]);

  //Dispatch Get selectedBusinessUnit action for get selectedBusinessUnit ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      dispatch(
        getWarehouseDDLAction(profileData.accountId, selectedBusinessUnit.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const backToWarehouseList = () => {
    history.push(`/inventory-management/configuration/shippingpoint`);
  };

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      if (extendId) {
        const wearHouseId = rowDto.map((item) => {
          return {
            warehouseId: item.wearHouseId,
            configId: item?.configId ? item.configId : 0,
          };
        });
        const payload = {
          objHeader: {
            shipPointId: singleData?.objHeader?.shipPointId,
            shipPointName: values.shipPointName,
            address: values.address,
            accountId: profileData.accountId,
            businessUnitId: selectedBusinessUnit.value,
            businessUnitName: selectedBusinessUnit.label,
            actionBy: profileData.userId,
          },
          objRow: wearHouseId,
        };
        dispatch(saveExtendShippingPoint(payload, backToWarehouseList,setDisabled));
      } else {
        const payload = {
          shipPointName: values.shipPointName,
          address: values.address,
          accountId: profileData.accountId,
          businessUnitId: selectedBusinessUnit.value,
          businessUnitName: selectedBusinessUnit.label,
          actionBy: profileData.userId,
        };
        dispatch(saveShippingPoint({ data: payload, cb },setDisabled));
      }
    } else {
      console.log(values)
    }
  };

  const addHandler = (param) => {
    if (isUniq("wearHouseId", param.wearHouseId, rowDto)) {
      setRowDto([param, ...rowDto]);
    }
  };
  const remover = (id) => {
    let ccdata = rowDto.filter((itm) => itm.wearHouseId !== id);
    console.log(id);
    setRowDto(ccdata);
  };

  return (
    <IForm
      title={extendId ? "Extend Shipping Point" : "Create Shipping Point"}
      getProps={setObjprops}
      isDisabled={isDisabled}
    >
      {isDisabled && <Loading />}
      <div className="mt-0">
        <Form
          {...objProps}
          initData={singleData || initData}
          saveHandler={saveHandler}
          accountId={profileData?.accountId}
          selectedBusinessUnit={selectedBusinessUnit}
          warehouseDDL={warehouseDDL}
          isEdit={extendId ? true : false}
          id={extendId}
          addHandler={addHandler}
          rowDto={rowDto}
          remover={remover}
          objHeader={singleData.objHeader}
          objRow={singleData.objRow}
        />
      </div>
    </IForm>
  );
}
