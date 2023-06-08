/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { isObject } from "lodash";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import Form from "../common/formadd";
import Axios from "axios";
import { toast } from "react-toastify";
import shortid from "shortid";
import { setBuList } from "../../../../Auth/_redux/Auth_Actions";
import Loading from "../../../../_helper/_loading";

const initProduct = {
  id: undefined,
  businessunit: "",
  employee: "",
  orgtype: "",
  orgname: "",
};
export function RoleAddForm({
  initData,
  history,
  match: {
    params: { id },
  },
}) {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(false);

  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);
  // Get Selected Business unit data from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const saveBusinessUnit = async (values, cb) => {
    setDisabled(true);
    if (!id && isObject(values) && Object.keys(values).length && profileData) {
      if (values?.rowDto.length) {
        const { header: empid, rowDto } = values;
        const { accountId, userId: actionBy } = profileData;
        const businessData = {
          objHeaderDTO: {
            accountId,
            userId: empid,
            actionBy,
          },
          objListRowDTO: [],
        };
        rowDto.forEach((itm) => {
          let myObj = {
            accountId,
            userId: empid,
            organizationUnitTypeId: itm.orgtypeid, //orgtypeid
            organizationUnitReffId: itm.orgid,
            organizationUnitReffName: itm.orgname, //orgname
            actionBy,
          };
          businessData.objListRowDTO.push(myObj);
        });
        try {
          setDisabled(true);
          const res = await Axios.post(
            "/domain/RoleExtension/CreateRoleExtension",
            businessData
          );
          cb(initProduct);
          toast.success(res.data?.message || "Submitted successfully", {
            toastId: shortid(),
          });
          setDisabled(false);
          dispatch(setBuList(profileData.userId, profileData.accountId));
        } catch (error) {
          toast.error(error?.response?.data?.message, { toastId: shortid() });
          setDisabled(false);
        }
        // setDisabled(false);
        
      } else {
        toast.warn("Please add atleast one entity!", { toastId: shortid() });
      }
    }
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

  const backHandler = () => {
    history.push(`/config/domain-controll/role-extension/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };
  // console.log("render test");

  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Create Role Extension">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
          </button>
          {`  `}
          <button
            type="reset"
            onClick={ResetProductClick}
            ref={resetBtnRef}
            className="btn btn-light ml-2"
          >
            <i className="fa fa-redo"></i>
            Reset
          </button>
          {`  `}
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
        {isDisabled && <Loading/>}
        <div className="mt-0">
          <Form
            // actionsLoading={actionsLoading}
            product={initProduct}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            accountId={profileData.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
          />
        </div>
      </CardBody>
    </Card>
  );
}
