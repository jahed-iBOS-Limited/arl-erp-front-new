/* eslint-disable no-unused-vars */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid,jsx-a11y/role-supports-aria-props */
import React, { useEffect, useState, useRef } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
} from "../../../../../../_metronic/_partials/controls";
import { ModalProgressBar } from "../../../../../../_metronic/_partials/controls";
import Form from "./form";
import Axios from "axios";
import { useSelector, shallowEqual } from "react-redux";
import Loading from "../../../../_helper/_loading";

const initData = {
  userId: "",
  userGroupName: "",
  userGroupCode: "",
  warehouseName: "",
};

export default function UserGroupViewFrom({
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
  };

  const btnRef = useRef();

  const backHandler = () => {
    history.push(`/config/domain-controll/user-group/`);
  };

 
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="View User Group">
        <CardHeaderToolbar>
          <button type="button" onClick={backHandler} className="btn btn-light">
            <i className="fa fa-arrow-left"></i>
            Back
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
            //resetBtnRef={resetBtnRef}
            // disableHandler={disableHandler}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            isEdit={true}
          />
        </div>
      </CardBody>
    </Card>
  );
}
