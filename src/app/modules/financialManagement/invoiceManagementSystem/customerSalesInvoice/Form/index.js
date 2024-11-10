/* eslint-disable no-lone-blocks */
import React, { useState, useEffect } from "react";
// import { StandardPOForm } from "./standardPo/createForm";
import { useSelector, shallowEqual } from "react-redux";
// import { getEmpDDLAction, saveControllingUnit } from "../../_redux/Actions";
import IForm from "../../../../_helper/_form";
import SPOCreateForm from "./standardPo/createForm";
import AssetPOCreateForm from "./assetPo/createForm";
import { IQueryParser } from "../../../../_helper/_queryParser";

export function POFormByOrderType() {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(true);
  const [title, setTitle] = useState(null);
  const [poForm, setPoForm] = useState(<></>);

  const potype = IQueryParser("potype");
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Dispatch Get emplist action for get emplist ddl
  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      //   dispatch(
      //      getEmpDDLAction(profileData.accountId, selectedBusinessUnit.value)
      //   );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);

  const [objProps, setObjprops] = useState({});
  useEffect(() => {
    switch (+potype) {
      case 1:
        {
          setPoForm(<SPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Standard PO)");
        }
        break;
      case 2:
        {
          setPoForm(<SPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Purchase Contract PO)");
        }
        break;
      case 3:
        {
          setPoForm(<SPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Subcontracting PO)");
        }
        break;
      case 4:
        {
          setPoForm(<SPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Stock Transfer PO)");
        }
        break;
      case 5:
        {
          setPoForm(<SPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Service PO)");
        }
        break;
      case 6:
        {
          setPoForm(<AssetPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Asset PO)");
        }
        break;
      case 8:
        {
          setPoForm(<AssetPOCreateForm {...objProps} />);
          setTitle("Create Purchase Order (Return PO)");
        }
        break;
      default:
        setPoForm(<AssetPOCreateForm {...objProps} />);
        setTitle("Create Purchase ordetestr (Return PO)");
        break;
    }
  }, [potype, objProps]);

  return (
    <IForm title={title} getProps={setObjprops} isDisabled={isDisabled}>
      {poForm}
    </IForm>
  );
}
