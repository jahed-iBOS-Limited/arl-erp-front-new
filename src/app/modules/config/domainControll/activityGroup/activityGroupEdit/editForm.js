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
  activityGroupName: "",
  moduleName: "",
};

export default function ActivityGroupEditForm({
  history,
  match: {
    params: { id },
  },
}) {
  const [isDisabled, setDisabled] = useState(false);
  const [headerDto, setHeaderDto] = useState("");
  const [rowDto, setRowDto] = useState([]);

  useEffect(() => {
    getBusinessUnitById(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const getBusinessUnitById = async (id, accountId) => {
    const res = await Axios.get(
      `/domain/CreateActivityGroup/GetActivityGroupInformationByActivityGroupId?ActivityGroupHeaderId=${id}`
    );
    const { data, status } = res;
    if (status === 200 && data) {
      const {
        getActivityGroupInformationHeader,
        getActivityGroupInformationRow,
      } = data[0];
      setHeaderDto(getActivityGroupInformationHeader);
      setRowDto(getActivityGroupInformationRow);
    }
  };

  // Check duplicate for show warning
  function hasDuplicates(a) {
    return (
      uniqBy(a, function(itm) {
        return itm.activityId;
      }).length !== a.length
    );
  }

  // Remove duplicate from alternateuom list
  const setDataToState = (payload) => {
    const duplicate = hasDuplicates([...rowDto, payload]);
    if (duplicate) {
      toast.warn("Not allow duplicate attribute", {
        toastId: "attribute_duplicate",
      });
    } else {
      var uniq = uniqBy([...rowDto, payload], function(itm) {
        return itm.activityId;
      });
      setRowDto(uniq);
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
    
    if (
      values &&
      rowDto &&
      rowDto.length &&
      profileData.userId &&
      selectedBusinessUnit.value
    ) {
      setDisabled(true);
      const formData = {
        editActivityGroupHeader: {
          activityGroupCode: values.activityGroupName,
          activityGroupName: values.activityGroupName,
          accountId: profileData.accountId,
          actionBy: profileData.userId,
          businessUnitId: selectedBusinessUnit?.value,
          lastActionDateTime: "2020-08-09T11:16:57.939Z",
          isActive: true,
          activityGroupId: +id,
          moduleId: values.moduleName?.value,
        },
        editActivityGroupRow: rowDto.map((itm) => {
          return {
            activityId: itm.activityId,
            configId: itm.configId || 0,
            actionBy: profileData.userId,
            lastActionDateTime:
              itm.lastActionDateTime || "2020-08-09T11:16:57.939Z",
            isActive: itm.isActive || true,
            activityGroupId: +id,
          };
        }),
      };

      try {
        setDisabled(true);
        const res = await Axios.put(
          "/domain/CreateActivityGroup/EditActivityGroup",
          formData
        );
        cb(initData);
        setDisabled(false);
        toast.success(res.data?.message || "Submitted successfully", {
          toastId: shortid(),
        });
        backHandler();
        setHeaderDto(initData);
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
    history.push(`/config/domain-controll/activity-group/`);
  };

  const disableHandler = (cond) => {
    setDisabled(cond);
  };
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm.activityId !== payload);
    setRowDto(filterArr);
  };
  return (
    <Card>
      {true && <ModalProgressBar />}
      <CardHeader title="Edit Activity Group">
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
            initData={headerDto || initData}
            tableData={rowDto}
            btnRef={btnRef}
            saveBusinessUnit={saveBusinessUnit}
            resetBtnRef={resetBtnRef}
            disableHandler={disableHandler}
            setDataToState={setDataToState}
            accountId={profileData?.accountId}
            selectedBusinessUnit={selectedBusinessUnit}
            remover={remover}
            isEdit={true}
          />
        </div>
      </CardBody>
    </Card>
  );
}
