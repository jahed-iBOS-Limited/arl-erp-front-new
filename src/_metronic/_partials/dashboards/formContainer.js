/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  CardFooter,
} from "../controls";
import { Modal } from "react-bootstrap";
import { ModalProgressBar } from "../controls";
import Form from "./initBusinessUnitForm";
import Axios from "axios";
import { useSelector, shallowEqual, useDispatch } from "react-redux";
import {
  Logout,
  SetBusinessUnitTrue,
} from "../../../app/modules/Auth/_redux/Auth_Actions";
import { isObject } from "lodash";
import { toast } from "react-toastify";
import { clearLocalStorageAction } from './../../../app/modules/_helper/reduxForLocalStorage/Actions';

const initData = {
  id: undefined,
  businessUnitName: "",
  businessUnitCode: "",
  languageName: "",
  currencyName: "",
  businessUnitAddress: "",
};

export default function FormContainer() {
  const dispatch = useDispatch();
  const [isDisabled, setDisabled] = useState(true);
  const [isRender, setRender] = useState(true);
  // Get profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const haveBusinessUnit = useSelector((state) => {
    return state.authData.haveBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    setTimeout(() => {
      setRender(haveBusinessUnit);
    }, 1500);
  }, [haveBusinessUnit]);

  const saveBusinessUnit = async (values, cb) => {
    setDisabled(true);

    if (values && isObject(profileData) && Object.keys(profileData).length) {
      const { userId, accountId } = profileData;
      const businessData = {
        objCreateBusinessUnitDomainDTO: {
          accountId: accountId,
          businessUnitCode: values.businessUnitCode,
          businessUnitName: values.businessUnitName,
          businessUnitAddress: values.businessUnitAddress,
          actionBy: userId,
        },
        objCreateBusinessUnitCurrencyDTO: {
          currencyId: values.currencyName.value,
          isBaseCurrency: true,
          actionBy: userId,
        },
        objCreateBusinessUnitLanguageDTO: {
          languageId: values.languageName.value,
          languageName: values.languageName.label,
          actionBy: userId,
        },
        objHeaderDTO: {
          accountId: profileData?.accountId,
          userId: profileData?.userId,
          actionBy: profileData?.userId,
        },
        emailAddress: profileData?.emailAddress,
        loginId: profileData?.loginId,
      };
      // console.log(businessData)

      try {
        setDisabled(true);
        await Axios.post(
          "/domain/BusinessUnitDomain/CreateBUandUserPermissionDomain",
          businessData
        );
        cb(initData);
        setDisabled(false);
        dispatch(SetBusinessUnitTrue());
        toast.success("Proccesing", { toastId: 113 });
      } catch (error) {
        setDisabled(false);
        toast.error(error?.response?.data?.message, { toastId: 112 });
      }
    } else {
      setDisabled(false);
      
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

  const disableHandler = (cond) => {
    setDisabled(cond);
  };

  const jsx = (
    <Modal show={true} size="xl" aria-labelledby="example-modal-sizes-title-xl">
      {true && <ModalProgressBar variant="query" />}
      <Modal.Body id="example-modal-sizes-title-xl">
        <Card>
          <CardHeader title="You have to create a business unit ">
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
            <div className="mt-0">
              <Form
                product={initData}
                btnRef={btnRef}
                saveBusinessUnit={saveBusinessUnit}
                resetBtnRef={resetBtnRef}
                disableHandler={disableHandler}
              />
            </div>
          </CardBody>
          <CardFooter className="p-0 m-0 text-center">
            <p
              onClick={() => {
                dispatch(Logout());
                dispatch(clearLocalStorageAction())
              }}
              className="back_2_login d-inline-block"
            >
              Back to Login
            </p>
          </CardFooter>
        </Card>
      </Modal.Body>
    </Modal>
  );
  return <div>{!isRender && jsx}</div>;
}
