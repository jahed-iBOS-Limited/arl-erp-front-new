import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
// import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _timeFormatter } from "../../../_helper/_timeFormatter";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  date: _todayDate(),
  shift: "",
  name: "",
  designation: "",
  postPlace: "",
  inTime: "",
  outTime: "",
  comments: "",
};
export default function MSILSecurityPostAssignCreate() {
  const [objProps, setObjprops] = useState({});
  const [itemList, setItemList] = useState([]);
  const [postPlaceDDL, setPostPlaceDDL] = useAxiosGet();
  const [, getRowData, ,] = useAxiosGet();
  const [nameDDL, setNameDDL] = useAxiosGet();
  const [, saveData] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  //const [modifyData, setModifyData] = useState(initData);

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    setPostPlaceDDL(
      `/mes/MesDDL/GetSecurityPostDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    setNameDDL(
      `/mes/MesDDL/GetEmployeeAndDesignationDDL?IntBusinessUnitId=${selectedBusinessUnit?.value}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      getRowData(
        `/mes/MSIL/GetSecurityPostAssignListByDateShift?date=${_dateFormatter(
          location?.state?.dteDate
        )}&ShiftId=${location?.state?.intShiftId}&BusinessunitId=${
          selectedBusinessUnit?.value
        }`,
        (data) => {
          setItemList(data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, location]);

  const saveHandler = async (values, cb) => {
    if (!itemList?.length) return toast.warn("Please add at least one item");

    saveData(
      `/mes/MSIL/SecurityPostAssignCreateAndEdit?date=${
        id ? _dateFormatter(location?.state?.dteDate) : values?.date
      }&ShiftId=${id ? location?.state?.intShiftId : values?.shift?.value}`,
      itemList,
      id ? "" : cb,
      true
    );
  };

  const addHandler = (values, resetForm, setFieldValue) => {
    if (!values?.date) return toast.warn("Item is required");
    setItemList([
      {
        intGateSecurityPostAssignId: 0,
        dteDate: values?.date || "",
        intBusinessUnitId: selectedBusinessUnit?.value || 0,
        intShiftId: values?.shift?.value || 0,
        strShiftName: values?.shift?.label || "",
        intEmployeeId: values?.name?.value || 0,
        strEmployeeName: values?.name?.label || "",
        intDesignationId: values?.name?.intDesignationId || 0,
        strDesignation: values?.name?.strDesignationName || "",
        intPostId: values?.postPlace?.value || 0,
        strPostName: values?.postPlace?.label || "",
        tmInTime: values?.inTime || "",
        tmOutTime: values?.outTime || "",
        strRemarks: values?.comments || "",
        intActionBy: profileData?.userId,
        dteInsertDate: _todayDate(),
        isActive: true,
      },
      ...itemList,
    ]);
  };

  // const removeHandler = (index) => {
  //   const data = itemList?.filter((item, i) => i !== index);
  //   setItemList([...data]);
  // };

  console.log("itemList", itemList);

  return (
    <IForm title="Create Security Post Assign" getProps={setObjprops}>
      {false && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={
            id
              ? {
                  ...initData,
                  date: _dateFormatter(location?.state?.dteDate),
                  shift: {
                    value: location?.state?.intShiftId,
                    label: location?.state?.strShiftName,
                  },
                }
              : initData
          }
          onSubmit={(values, { setSubmitting, resetForm, setFieldValue }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setItemList([]);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            isValid,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-lg-3">
                      <InputField
                        value={values?.date}
                        label="তারিখ"
                        name="date"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("date", e.target.value);
                          setItemList([]);
                        }}
                        disabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shift"
                        options={[
                          { value: 1, label: "Shift - A" },
                          { value: 2, label: "Shift - B" },
                          { value: 3, label: "Shift - C" },
                          { value: 4, label: "General Shift" },
                        ]}
                        value={values?.shift}
                        label="শিফট"
                        onChange={(valueOption) => {
                          setFieldValue("shift", valueOption);
                          setItemList([]);
                        }}
                        errors={errors}
                        isDisabled={id}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="name"
                        options={nameDDL}
                        value={values?.name}
                        label="নাম"
                        onChange={(valueOption) => {
                          setFieldValue("name", valueOption);
                          setFieldValue(
                            "designation",
                            valueOption?.strDesignationName
                          );
                        }}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.designation}
                        label="পদবী"
                        name="designation"
                        type="text"
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="postPlace"
                        options={postPlaceDDL}
                        value={values?.postPlace}
                        label="পোস্ট/স্থান"
                        onChange={(valueOption) => {
                          setFieldValue("postPlace", valueOption);
                        }}
                        errors={errors}
                      />
                      {/* <InputField
                        value={values?.postPlace}
                        label="Post Place"
                        name="postPlace"
                        type="text"
                      /> */}
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.inTime}
                        label="প্রবেশের সময়"
                        name="inTime"
                        type="time"
                      />
                    </div>
                    <div className="col-lg-2">
                      <InputField
                        value={values?.outTime}
                        label="বহির্গমনের সময়"
                        name="outTime"
                        type="time"
                      />
                    </div>

                    <div className="col-lg-3">
                      <InputField
                        value={values?.comments}
                        label="মন্তব্য"
                        name="comments"
                        type="text"
                      />
                    </div>

                    <div style={{ marginTop: "15px" }} className="col-lg-1">
                      <button
                        type="button"
                        onClick={() => {
                          addHandler(values, resetForm, setFieldValue);
                        }}
                        className="btn btn-primary"
                      >
                        ADD
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th>তারিখ </th>
                            <th>শিফট </th>
                            <th>নাম </th>
                            <th>পদবী</th>
                            <th>পোস্ট/স্থান</th>
                            <th>প্রবেশের সময়</th>
                            <th>বহির্গমনের সময়</th>
                            <th>মন্তব্য</th>
                            <th style={{ width: "50px" }}>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {itemList?.length > 0 &&
                            itemList?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center">
                                  {_dateFormatter(item?.dteDate)}
                                </td>
                                <td>{item?.strShiftName}</td>
                                <td>{item?.strEmployeeName}</td>
                                <td>{item?.strDesignation}</td>
                                <td>{item?.strPostName}</td>
                                <td className="text-center">
                                  {_timeFormatter(item?.tmInTime || "")}
                                </td>
                                <td className="text-center">
                                  <InputField
                                    value={item?.tmOutTime || ""}
                                    type="time"
                                    onChange={(e) => {
                                      const data = [...itemList];
                                      data[index]["tmOutTime"] = e.target.value;
                                      setItemList(data);
                                    }}
                                  />
                                </td>
                                <td className="text-center">
                                  {item?.strRemarks}
                                </td>
                                <td className="text-center">
                                  {/* <OverlayTrigger
                                  overlay={
                                    <Tooltip id="cs-icon">{"Remove"}</Tooltip>
                                  }
                                >
                                  <span>
                                    <i
                                      className={`fa fa-trash`}
                                      onClick={() => {
                                        removeHandler(index);
                                      }}
                                    ></i>
                                  </span>
                                </OverlayTrigger> */}
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps?.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps?.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
}
