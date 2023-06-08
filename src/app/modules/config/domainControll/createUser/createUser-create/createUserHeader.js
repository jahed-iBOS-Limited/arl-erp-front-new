/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import CreateUserForm from "./createUserForm";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as actions from "../_redux/createUserActions";
import shortid from "shortid";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";

import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";

var userValues = {
  businessunit: "",
  name: "",
  email: "",
  country: {
    value: 18,
    label: "Bangladesh",
  },
  contactnumber: "",
  type: "",
  reference: "",
};
export default function CreateUserEdit({
  history,
  match: {
    params: { id, e, v },
  },
}) {
  const [title, setTitle] = useState("");
  const [showMsg, setShowMsg] = useState(true);
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.CountryList());
    dispatch(actions.UserTypeList());
  }, [dispatch]);

  const {
    selectedBusinessUnit,
    profileData,
    userForEdit,
    statusCode,
    msg,
    actionsLoading,
  } = useSelector(
    (state) => ({
      userForEdit: state.user.userForEdit,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
      profileData: state.authData.profileData,
      statusCode: state.user.statusCode,
      msg: state.user.msg,
      actionsLoading: state.user.actionsLoading,
    }),
    shallowEqual
  );

  useEffect(() => {
    dispatch(actions.resetController());

    dispatch(
      actions.UserInfoByUserId(
        id,
        v,
        profileData?.accountId,
        selectedBusinessUnit?.value
      )
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, dispatch]);

  useEffect(() => {
    let _title = e ? "Edit User" : v ? "View User" : "Create New User";
    setTitle(_title);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userForEdit, id]);

  const saveUser = (values, cb) => {
    const userdata = {
      userName: values.name,
      accountId: profileData.accountId,
      defaultBusinessUnit: selectedBusinessUnit.value,
      loginId: values.email,
      password: "ibos@123",
      emailAddress: values.email,
      defaultPassword: true,
      contact: values.contactnumber,
      countryId: values.country.value,
      countryName: values.country.label,
      passwordExpDate: "2050-07-04",
      userType: values.type.value,
      userReferenceId: values.reference.value,
      userReferenceNo: values.reference.code,
      superUser: false,
      actionBy: profileData?.userId,
      lastActionDateTime: "2020-07-04",
    };

    if (id) {
      userdata.userId = id;
      // dispatch(actions.UserEdit(userdata)); //entry
      //dispatch(actions.createProduct(values)).then(() => backHandler());
    } else {
      dispatch(actions.UserCreate({ userdata, cb, setLoading })).then((e) => {
        resetBtnRef.current.click();

        setShowMsg(true);
        setTimeout(() => {
          setShowMsg(false);
        }, 3000);
      });

      // dispatch(actions.UserCreate(userdata)).then(() => {
      //   console.log('user,',statusCode)

      //   setShowMsg(true);
      //   setTimeout(() => {
      //     setShowMsg(false)
      //   }, 3000);

      // });
      //dispatch(actions.updateProduct(values)).then(() => backHandler());
    }
  };

  const btnRef = useRef();
  const saveUserClick = () => {
    if (btnRef && btnRef.current) {
      btnRef.current.click();
    }
  };

  const backToProductsList = () => {
    history.push(`/config/domain-controll/create-user/`);
  };

  const resetBtnRef = useRef();
  const ResetProductClick = () => {
    if (resetBtnRef && resetBtnRef.current) {
      resetBtnRef.current.click();
    }
  };

  useEffect(() => {
    // console.log("sdd", msg, statusCode);
    if (msg?.length > 0) {
      if (statusCode === 200) {
        toast.success(msg, { toastId: shortid() });
      } else {
        toast.error(msg, { toastId: shortid() });
      }
    }
  }, [msg, statusCode]);

  return (
    <Card>
      {/* {msg?.length > 0 && (
        <div className={`alert alert-${statusCode === 200 ? "success" : "danger"} ${showMsg ? " " : "d-none"}`}>{msg}</div>
      )} */}

      {false && <ModalProgressBar />}
      <CardHeader title={title}>
        <CardHeaderToolbar>
          <button
            type="button"
            onClick={backToProductsList}
            className="btn btn-light"
          >
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
            onClick={saveUserClick}
            //ref={btnRef}
            // style={{ display: "none" }}
            // disabled={e ? false : v ? true : false}
            disabled={loading}
          >
            Save
          </button>
        </CardHeaderToolbar>
      </CardHeader>
      <CardBody>
        <div>
          <CreateUserForm
            users={userForEdit[0] || userValues}
            btnRef={btnRef}
            SaveUserData={saveUser}
            resetBtnRef={resetBtnRef}
            statusCode={statusCode}
            // goBack={backToProductsList}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            loading={loading}
            v={v}
          />
        </div>
      </CardBody>
    </Card>
  );
}
