import React, { useEffect } from "react";
import { Formik } from "formik";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { getUserSearchForGroupCreate } from "../../../api";
import { shallowEqual, useSelector, useDispatch } from "react-redux";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import { toast } from "react-toastify";
import { ChatAppSocket } from "../../..";
import IConfirmModal from "../../../../_helper/_confirmModal";
import SingleMember from "./singleMember";
import moment from "moment";
import {
  setSelectedGroupDataAction,
  setPopUpStateAction,
} from "../../../redux/Action";

export default function _Form({
  initData,
  saveHandler,
  rowData,
  setRowData,
  isDisabled,
  isEdit,
  setDisabled,
}) {
  const { selectedBusinessUnit, profileData } = useSelector((state) => {
    return {
      profileData: state.authData.profileData,
      selectedBusinessUnit: state.authData.selectedBusinessUnit,
    };
  }, shallowEqual);
  const dispatch = useDispatch();

  useEffect(() => {
    ChatAppSocket.on("addGroupMember", (res) => {
      if (res?.message) {
        toast.success(res?.message, { toastId: 100 });
        setDisabled(false);
        setRowData((oldData) => [
          ...oldData,
          {
            ...res?.payload,
          },
        ]);
      }
    });

    ChatAppSocket.on("removeGroupMember", (res) => {
      if (res?.payload?.isUserLeave && res?.message) {
        toast.success("Leaved Successfully", { toastId: 100 });
        dispatch(setSelectedGroupDataAction(null));
        dispatch(setPopUpStateAction("groupInbox"));
      }
      if (res?.message && !res?.payload?.isUserLeave) {
        toast.success(res?.message, { toastId: 100 });
        setRowData((rowData) =>
          rowData?.filter((itm, i) => res?.payload?.index !== i)
        );
        setDisabled(false);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const removeHandler = (index, item) => {
    if (rowData?.length > 2) {
      let confirmObject = {
        title: "Are you sure to remove?",
        closeOnClickOutside: false,
        yesAlertFunc: () => {
          setDisabled(true);
          ChatAppSocket.emit("removeGroupMember", {
            ownerId: +item?.intUserId,
            actionByName: profileData?.employeeFullName,
            ownerName: item?.strUserName,
            groupId: +isEdit,
            actionBy: profileData?.userId,
            index: +index,
          });
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
    } else {
      toast.warning("Group must need two person!");
    }
  };

  const removeHandlerCreate = (index, item) => {
    setRowData((rowData) => rowData?.filter((itm, i) => index !== i));
  };

  const leaveHandler = (index) => {
    if (rowData?.length > 2) {
      let confirmObject = {
        title: "Want to leave?",
        closeOnClickOutside: false,
        yesAlertFunc: () => {
          setDisabled(true);
          ChatAppSocket.emit("removeGroupMember", {
            ownerId: profileData?.userId,
            actionByName: profileData?.employeeFullName,
            ownerName: profileData?.employeeFullName,
            groupId: +isEdit,
            isUserLeave: true,
            actionBy: profileData?.userId,
            index: +index,
          });
        },
        noAlertFunc: () => {},
      };
      IConfirmModal(confirmObject);
    } else {
      toast.warning("Group must need two person!");
    }
  };

  const deleteGroupHandler = () => {
    let confirmObject = {
      title: "Are you sure to delete this group?",
      closeOnClickOutside: false,
      yesAlertFunc: () => {
        const payload = {
          groupId: +isEdit,
          actionBy: profileData?.userId,
          actionByName: profileData?.employeeFullName,
        };

        ChatAppSocket.emit("deleteGroup", payload);
      },
      noAlertFunc: () => {},
    };
    IConfirmModal(confirmObject);
  };

  const addHandler = (values) => {
    const duplicate = rowData?.some(
      (item) => item?.intUserId === values?.user?.value
    );
    if (duplicate) {
      toast.warning("User Already Exits");
      return;
    }

    if (+values?.user?.intUserId === profileData?.userId) {
      toast.warning("You are already in this group");
      return;
    }

    if (!isEdit) {
      const payload = {
        ...values?.user,
      };
      setRowData([...rowData, payload]);
    } else {
      const payload = {
        ownerId: values?.user?.value,
        groupId: +isEdit,
        actionBy: profileData?.userId,
        actionByName: profileData?.employeeFullName,
        ownerName: values?.user?.strUserName,
        dateTime: `${moment().format("YYYY-MM-DD HH:mm:ss")}`,
        ...values?.user,
      };
      setDisabled(true);
      ChatAppSocket.emit("addGroupMember", payload);
    }
  };

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    const data = getUserSearchForGroupCreate(v, selectedBusinessUnit?.value);
    return data;
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            <from className="form form-label-right">
              <div className="form-group row global-form">
                <div className="col-lg-6">
                  <InputField
                    value={values?.groupName}
                    label="Group Name"
                    placeholder="Group Name"
                    onChange={(e) => {
                      if (e?.target?.value?.length <= 255) {
                        setFieldValue("groupName", e.target.value);
                      }
                    }}
                    type="text"
                    name="groupName"
                    disabled={
                      isEdit && +values?.groupOwner !== profileData?.userId
                    }
                  />
                </div>

                <div className="col-lg-6">
                  <label>User Full Name</label>
                  <div style={{ position: "relative" }}>
                    <SearchAsyncSelect
                      selectedValue={values?.user}
                      handleChange={(valueOption) => {
                        setFieldValue("user", valueOption);
                      }}
                      loadOptions={loadUserList}
                      name="user"
                    />
                  </div>
                </div>
                <div className="col-lg-12">
                  <button
                    onClick={() => {
                      addHandler(values);
                      setFieldValue("user", "");
                    }}
                    disabled={
                      isDisabled || !values?.user?.value || !values?.groupName
                    }
                    type="button"
                    className="btn btn-primary mt-5"
                  >
                    Add
                  </button>
                  {!isEdit ? (
                    <button
                      onClick={() => saveHandler(values)}
                      type="button"
                      disabled={!values?.groupName}
                      className="btn btn-primary mt-5 ml-2"
                    >
                      {"Create group"}
                    </button>
                  ) : null}

                  {isEdit ? (
                    <>
                      {+values?.groupOwner === profileData?.userId ? (
                        <>
                          <button
                            onClick={() => saveHandler(values)}
                            type="button"
                            disabled={!values?.groupName}
                            className="btn btn-primary mt-5 ml-2"
                          >
                            {"Change Group Name"}
                          </button>

                          <button
                            onClick={() => deleteGroupHandler()}
                            type="button"
                            className="btn btn-danger mt-5 ml-2"
                          >
                            <i className="fa fa-trash"></i> Delete Group
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => leaveHandler(values)}
                          type="button"
                          className="btn btn-danger mt-5 ml-2"
                        >
                          Leave Group
                        </button>
                      )}
                    </>
                  ) : null}
                </div>
              </div>

              <div style={{ maxHeight: "280px" }} className="table-responsive">
                {rowData?.map((item, index) => (
                  <SingleMember
                    index={index}
                    item={item}
                    removeHandler={removeHandler}
                    removeHandlerCreate={removeHandlerCreate}
                    leaveHandler={leaveHandler}
                    values={values}
                    isEdit={isEdit}
                  />
                ))}
              </div>
            </from>
          </>
        )}
      </Formik>
    </>
  );
}
