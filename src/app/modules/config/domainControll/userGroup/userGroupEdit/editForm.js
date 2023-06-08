/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "../common/form";
import Axios from "axios";
import shortid from "shortid";

import { toast } from "react-toastify";
import { useSelector, shallowEqual } from "react-redux";
import { uniqBy } from "lodash";
import Loading from "../../../../_helper/_loading";

const initData = {
  userId: "",
  userGroupName: "",
  userGroupCode: "",
  warehouseName: "",
};

export default function UserGroupEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);

  const [data, setData] = useState("");
  const [headerDto, setHeaderDto] = useState("");

  useEffect(() => {
    getBusinessUnitById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBusinessUnitById = async (id, accountId) => {
    const res = await Axios.get(`/domain/CreateUserGroup/GetUserGroupInformationByGroupId?UserGroupId=${id}
        `);
    const { data, status } = res;
    if (status === 200 && data) {
      const { userGroupHeaderDTO, listUserGroupRowDTO } = data[0];
      setData(listUserGroupRowDTO);
      setHeaderDto(userGroupHeaderDTO);
    }
  };

  // Check duplicate for show warning
  function hasDuplicates(a) {
    return (
      uniqBy(a, function(itm) {
        return itm.userId;
      }).length !== a.length
    );
  }

  // Remove duplicate from alternateuom list
  const setDataToState = (payload) => {
    const duplicate = hasDuplicates([...data, payload]);
    if (duplicate) {
      toast.warn("Not allow duplicate attribute", {
        toastId: "attribute_duplicate",
      });
    } else {
      var uniq = uniqBy([...data, payload], function(itm) {
        return itm.userId;
      });
      setData(uniq);
    }
  };

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //Test
  // save business unit data to DB
  const saveBusinessUnit = async (values, cb) => {
    if (values && data && data.length) {
      setDisabled(true);
      const formData = {
        editUserGroupHeaderDTO: {
          userGroupCode: values.userGroupCode,
          userGroupName: values.userGroupName,
          accountId: profileData.accountId,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit.value,
          lastActionDateTime: "2020-08-09T11:16:57.939Z",
          isActive: true,
          userGroupId: +id,
        },
        editUserGroupRowListDTO: data.map((itm) => {
          return {
            userId: itm.userId,
            configId: itm.configId || 0,
            actionBy: profileData.userId,
            userGroupId: itm.userGroupId || +id,
            lastActionDateTime:
              itm.lastActionDateTime || "2020-08-09T11:16:57.939Z",
            isActive: itm.isActive || true,
          };
        }),
      };

      try {
        setDisabled(true);
        const res = await Axios.put(
          "/domain/CreateUserGroup/EditUserGroup",
          formData
        );
        cb(initData);
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        backHandler();
        setData(initData);
      } catch (error) {
        toast.error(error?.response?.data?.message, { toastId: shortid() });
        setDisabled(false);
      }
    }
  };

  const btnRef = useRef();
  const saveBtnClicker = () => {
    // console.log("entered");
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
    history.push(`/config/domain-controll/user-group/`);
  };

  // const disableHandler = (cond) => {
  //   setDisabled(cond);
  // };
  const remover = (payload) => {
    const filterArr = data.filter((itm) => itm.userId !== payload);
    setData(filterArr);
  };
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit User Group">
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
        {isDisabled && <Loading />}
        <div className="mt-0">
          <Form
            // actionsLoading={actionsLoading}
            initData={headerDto || initData}
            tableData={data}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            setDataToState={setDataToState}
            accountId={profileData?.accountId}
            profileData={profileData}
            selectedBusinessUnit={selectedBusinessUnit}
            remover={remover}
            isEdit={true}
          />
        </div>
      </CardBody>
    </Card>
  );
}
