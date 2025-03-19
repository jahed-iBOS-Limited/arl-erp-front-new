/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useEffect } from "react";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "./form";
import {
  saveEditedPurchaseOrg,
  getPurchaseOrgById,
  setPurchaseOrgSingleEmpty,
  savePurchaseOrgData,
} from "../_redux/Actions";
import IForm from "../../../../_helper/_form";
import { isUniq } from "../../../../_helper/uniqChecker";
import { getBUDDLAction } from "../../../../_helper/_redux/Actions";
import Loading from "./../../../../_helper/_loading";

const initData = {
  id: undefined,
  organizationName: "",
};

export default function PurchaseOrgAddForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [rowDtos, setRowDtos] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // get emplist ddl from store
  const businessUnitDDL = useSelector((state) => {
    return state?.commonDDL?.buDDL;
  }, shallowEqual);

  // get single controlling  unit from store
  const singleData = useSelector((state) => {
    return state.purchaseOrg?.singleData;
  }, shallowEqual);
  const dispatch = useDispatch();
  useEffect(() => {
    if (id) {
      dispatch(getPurchaseOrgById(id));
    } else {
      dispatch(setPurchaseOrgSingleEmpty());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (profileData?.accountId) {
      dispatch(
        getBUDDLAction(profileData?.accountId, selectedBusinessUnit?.value)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData]);

  useEffect(() => {
    if (singleData?.objRow?.length) {
      setRowDtos([...singleData.objRow]);
    } else {
      setRowDtos([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleData?.objRow]);

  const saveHandler = async (values, cb) => {
    if (values && profileData?.accountId) {
      if (id) {
        const payload = rowDtos.map((itm) => {
          return {
            configId: itm.configId || 0,
            accountId: profileData.accountId,
            businessUnitId: itm.businessUnitId,
            businessUnitName: itm.businessUnitName,
            accountName: profileData.accountName,
            purchaseOrganizationid:
              singleData?.objHeader?.purchaseOrganizationid,
            purchaseOrganization: singleData?.objHeader?.purchaseOrganization,
            lastActionDateTime: "2020-08-25T09:37:13.146Z",
            actionBy: profileData.userId,
            active: true,
          };
        });
        dispatch(saveEditedPurchaseOrg(payload, setDisabled));
      } else {
        // For Create
        const payload = {
          purchaseOrganization: values.organizationName,
          accountId: profileData.accountId,
          isActive: true,
        };

        dispatch(savePurchaseOrgData({ data: payload, cb, setDisabled }));
      }
    } else {
      setDisabled(false);
    }
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const remover = (id) => {
    let ccdata = rowDtos.filter((itm) => itm.businessUnitId !== id);
    setRowDtos(ccdata);
  };

  let setter = (param) => {
    if (isUniq("businessUnitId", param.businessUnitId, rowDtos)) {
      setRowDtos([...rowDtos, param]);
    }
  };
  const [objProps, setObjprops] = useState({});
  return (
    <IForm
      getProps={setObjprops}
      isDisabled={isDisabled}
      title={id ? "Edit Organization Name" : "Create Organization Name"}
    >
      {isDisabled && <Loading />}
      <Form
        {...objProps}
        initData={initData}
        saveHandler={saveHandler}
        disableHandler={disableHandler}
        accountId={profileData?.accountId}
        selectedBusinessUnit={selectedBusinessUnit}
        businessUnitDDL={businessUnitDDL}
        isEdit={id || false}
        objHeader={singleData.objHeader}
        rowData={singleData.objRow}
        rowDtos={rowDtos}
        setter={setter}
        remover={remover}
      />
    </IForm>
  );
}
