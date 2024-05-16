import axios from "axios";
import { Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import * as Yup from "yup";
import { imarineBaseUrl } from "../../../../../App";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { _todayDate } from "../../../../_helper/_todayDate";
import {
  createUpdateASLLAgencyRegistration,
  getASLLAgencyRegistrationById,
  getCargoDDL,
  getVesselDDL,
  getVesselTypeDDL,
} from "../helper";
const initData = {
  vesselName: "",
  vesselType: "",
  voyageNo: "",
  voyageOwnerName: "",
  regNo: "",
  loadPort: "",
  arrivedTime: moment().format("YYYY-MM-DDTHH:mm"),
  sailedTime: moment().format("YYYY-MM-DDTHH:mm"),
  cargoName: "",
  quantity: "",
  stevedore: "",
  cargoOwner: "",
  remarks: "",
  completionDate: _todayDate(),
  dischargePort: "",
  customSl: "",
};
const validationSchema = Yup.object().shape({
  vesselType: Yup.object().shape({
    label: Yup.string().required("Vessel Type is required"),
    value: Yup.string().required("Vessel Type is required"),
  }),
  vesselName: Yup.object().shape({
    label: Yup.string().required("Vessel Name is required"),
    value: Yup.string().required("Vessel Name is required"),
  }),
  voyageNo: Yup.string().required("Voyage No is required"),
  voyageOwnerName: Yup.string().required("Voyage Owner Name is required"),
  // regNo: Yup.string().required("REG No is required"),
  loadPort: Yup.object().shape({
    label: Yup.string().required("Load Port is required"),
    value: Yup.string().required("Load Port is required"),
  }),
  arrivedTime: Yup.string().required("Arrived Time is required"),
  sailedTime: Yup.string().required("Sailed Time is required"),

  // quantity: Yup.number().required("Quantity is required"),
  stevedore: Yup.string().required("Stevedore is required"),
  // cargoOwner: Yup.string().required("Cargo Owner is required"),
});
const EstimatePDACreate = () => {
  const [loading, setLoading] = useState(false);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [rowDto, setRowDto] = useState([]);
  const [vesselTypeDDL, setVesselTypeDDL] = useState([]);
  const [cargoDDL, setCargoDDL] = useState([]);
  const { editId, viewId } = useParams();

  // get user data from store
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);

  useEffect(() => {
    if (accId && buId) {
      getVesselDDL(accId, 0, setVesselDDL);
      getVesselTypeDDL(accId, buId, setVesselTypeDDL);
      getCargoDDL(setCargoDDL);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);

  const history = useHistory();

  const saveHandler = (values, cb) => {
    const payload = {
      registrationId: +editId || 0,
      accountId: accId,
      businessUnitId: buId,
      vesselTypeId: values?.vesselType?.value || 0,
      vesselType: values?.vesselType?.label || "",
      vesselId: values?.vesselName?.value || 0,
      vesselName: values?.vesselName?.label || "",
      voyageNo: +values?.voyageNo || 0,
      voyageOwnerName: values?.voyageOwnerName || "",
      registrationNumber: values?.regNo || "",
      loadPorteId: values?.loadPort?.value || 0,
      loadPortName: values?.loadPort?.label || "",
      arrivedDateTime: moment(values?.arrivedTime).format("YYYY-MM-DDTHH:mm"),
      sailedDateTime: moment(values?.sailedTime).format("YYYY-MM-DDTHH:mm"),
      cargoId: values?.cargoName?.value || 0,
      cargoName: values?.cargoName?.label || "",
      quantity: rowDto?.reduce((acc, cur) => acc + (+cur?.quantity || 0), 0),
      stevedore: values?.stevedore || "",
      cargoOwner: values?.cargoOwner || "",
      remarks: values?.remarks || "",
      actionBy: userId,
      customSl: values?.customSl || "",
      lastActionDateTime: moment().format("YYYY-MM-DDTHH:mm"),
      serverDateTime: moment().format("YYYY-MM-DDTHH:mm"),
      isActive: true,
      rowDtos:
        rowDto?.map((itm) => {
          return {
            ...itm,
            rowId: itm?.rowId || 0,
            registrationId: +editId || 0,
          };
        }) || [],
    };
    createUpdateASLLAgencyRegistration(payload, setLoading, () => {
      cb();
      if (editId) {
        commonGetById();
      }
    });
  };
  const formikRef = React.useRef(null);
  useEffect(() => {
    if (editId || viewId) {
      commonGetById();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId, viewId]);

  const commonGetById = async () => {
    getASLLAgencyRegistrationById(editId || viewId, setLoading, (resData) => {
      if (formikRef.current) {
        formikRef.current.setValues({
          customSl: resData?.customSl || "",
          vesselType: resData?.vesselTypeId
            ? {
                value: resData?.vesselTypeId,
                label: resData?.vesselType,
              }
            : "",
          vesselName: resData?.vesselId
            ? {
                value: resData?.vesselId,
                label: resData?.vesselName,
              }
            : "",
          voyageNo: resData?.voyageNo || "",
          voyageOwnerName: resData?.voyageOwnerName || "",
          regNo: resData?.registrationNumber || "",
          loadPort: resData?.loadPorteId
            ? {
                value: resData?.loadPorteId,
                label: resData?.loadPortName,
              }
            : "",

          arrivedTime:
            moment(resData?.arrivedDateTime).format("YYYY-MM-DDTHH:mm") || "",
          sailedTime:
            moment(resData?.sailedDateTime).format("YYYY-MM-DDTHH:mm") || "",
          cargoName: resData?.cargoId
            ? {
                value: resData?.cargoId,
                label: resData?.cargoName,
              }
            : "",
          stevedore: resData?.stevedore || "",
          cargoOwner: resData?.cargoOwner || "",
          remarks: resData?.remarks || "",
        });

        setRowDto(
          resData?.rowDtos?.map((item) => {
            return {
              ...item,
              completionDate: _dateFormatter(item?.completionDate),
            };
          }) || []
        );
      }
    });
  };

  return (
    <>
      {loading && <Loading />}
      <Formik
        innerRef={formikRef}
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
          });
        }}
        validationSchema={validationSchema}
      >
        {({
          values,
          setFieldValue,
          touched,
          errors,
          resetForm,
          handleSubmit,
        }) => (
          <>
            <ICustomCard
              title={`Registration ${
                editId ? "Edit" : viewId ? "View" : "Create"
              }`}
              backHandler={() => {
                history.goBack();
              }}
              saveHandler={
                viewId
                  ? false
                  : () => {
                      handleSubmit();
                    }
              }
              resetHandler={
                viewId
                  ? false
                  : () => {
                      resetForm(initData);
                    }
              }
            >
              <div className="row global-form my-3">
                <div className="col-lg-3">
                  <NewSelect
                    options={vesselTypeDDL || []}
                    name="vesselType"
                    onChange={(valueOption) => {
                      setFieldValue("vesselType", valueOption);
                    }}
                    placeholder="Vessel Type"
                    label="Vessel Type"
                    value={values?.vesselType}
                    errors={errors}
                    touched={touched}
                    isDisabled={viewId}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    value={values?.vesselName || ""}
                    options={vesselDDL || []}
                    name="vesselName"
                    placeholder="Vessel Name"
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("vesselName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={viewId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Voyage No</label>
                  <InputField
                    value={values?.voyageNo}
                    name="voyageNo"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("voyageNo", e.target.value);
                    }}
                    placeholder="Voyage No"
                    disabled={viewId}
                  />
                </div>{" "}
                <div className="col-lg-3">
                  <label>Voyage Owner Name</label>
                  <InputField
                    value={values?.voyageOwnerName}
                    placeholder="Voyage Owner Name"
                    name="voyageOwnerName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("voyageOwnerName", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>{" "}
                <div className="col-lg-3">
                  <label>REG No</label>
                  <InputField
                    value={values?.regNo}
                    placeholder="REG No"
                    name="regNo"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("regNo", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Custom SL</label>
                  <InputField
                    value={values?.customSl}
                    placeholder="Custom SL"
                    name="customSl"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("customSl", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>
                <div className="col-lg-3">
                  <div>
                    <label>Load Port</label>
                    <SearchAsyncSelect
                      selectedValue={values?.loadPort}
                      handleChange={(valueOption) => {
                        setFieldValue("loadPort", valueOption);
                      }}
                      placeholder="Search minimum 3 characters..."
                      loadOptions={(v) => {
                        if (v?.length < 3) return [];
                        return axios
                          .get(
                            `${imarineBaseUrl}/domain/Stakeholder/GetPortDDL?search=${v}`
                          )
                          .then((res) => res?.data);
                      }}
                      isDisabled={viewId}
                    />
                    <FormikError
                      errors={errors}
                      name="loadPort"
                      touched={touched}
                    />
                  </div>
                </div>
                <div className="col-lg-3">
                  <label>Arrived Time</label>
                  <InputField
                    value={values?.arrivedTime}
                    placeholder="Arrived Time"
                    name="arrivedTime"
                    type="datetime-local"
                    onChange={(e) => {
                      setFieldValue("arrivedTime", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Sailed Time</label>
                  <InputField
                    value={values?.sailedTime}
                    placeholder="Sailed Time"
                    name="sailedTime"
                    type="datetime-local"
                    onChange={(e) => {
                      setFieldValue("sailedTime", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Stevedore</label>
                  <InputField
                    value={values?.stevedore}
                    placeholder="Stevedore"
                    name="stevedore"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("stevedore", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>{" "}
                <div className="col-lg-3">
                  <label>Remarks</label>
                  <InputField
                    value={values?.remarks}
                    placeholder="Remarks"
                    name="remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                    disabled={viewId}
                  />
                </div>
                <div className="col-lg-12">
                  <hr />
                </div>
                {!viewId && (
                  <>
                    <div className="col-lg-3">
                      <label>Completion Date</label>
                      <InputField
                        value={values?.completionDate || ""}
                        placeholder="Completion Date"
                        name="completionDate"
                        type="date"
                        onChange={(e) => {
                          setFieldValue("completionDate", e.target.value);
                        }}
                      />
                    </div>
                    <div className="col-lg-3">
                      <div>
                        <label>Discharge Port</label>
                        <SearchAsyncSelect
                          selectedValue={values?.dischargePort}
                          handleChange={(valueOption) => {
                            setFieldValue("dischargePort", valueOption);
                          }}
                          placeholder="Search minimum 3 characters..."
                          loadOptions={(v) => {
                            if (v?.length < 3) return [];
                            return axios
                              .get(
                                `${imarineBaseUrl}/domain/Stakeholder/GetPortDDL?search=${v}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                        <FormikError
                          errors={errors}
                          name="dischargePort"
                          touched={touched}
                        />
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        value={values?.cargoName || ""}
                        options={cargoDDL}
                        name="cargoName"
                        placeholder="Cargo Name"
                        label="Cargo Name"
                        onChange={(valueOption) => {
                          setFieldValue("cargoName", valueOption);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={viewId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Cargo Owner</label>
                      <InputField
                        value={values?.cargoOwner}
                        placeholder="Cargo Owner"
                        name="cargoOwner"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("cargoOwner", e.target.value);
                        }}
                        disabled={viewId}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Quantity</label>
                      <InputField
                        value={values?.quantity}
                        placeholder="Quantity"
                        name="quantity"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("quantity", e.target.value);
                        }}
                        disabled={viewId}
                      />
                    </div>
                    <div className="col-lg-3 mt-3">
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => {
                          const obj = {
                            rowId: 0,
                            registrationId: 0,
                            completionDate: values?.completionDate,
                            dischargePortId: values?.dischargePort?.value,
                            dischargePortName: values?.dischargePort?.label,
                            cargoId: values?.cargoName?.value || 0,
                            cargoName: values?.cargoName?.label || "",
                            cargoOwner: values?.cargoOwner || "",
                            quantity: +values?.quantity || 0,
                          };
                          // duplicate check
                          const duplicateCheck = rowDto?.some(
                            (item) =>
                              item?.dischargePortId === obj?.dischargePortId &&
                              item?.cargoId === obj?.cargoId &&
                              item?.cargoOwner === obj?.cargoOwner
                          );
                          if (duplicateCheck)
                            return toast.warn("Duplicate data found");

                          setRowDto([...rowDto, obj]);
                        }}
                        disabled={
                          !values?.completionDate ||
                          !values?.dischargePort ||
                          !values?.cargoName ||
                          !values?.cargoOwner ||
                          !values?.quantity
                        }
                      >
                        Add
                      </button>
                    </div>
                  </>
                )}
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Completion Date</th>
                      <th>Discharge Port</th>
                      <th>Cargo Name</th>
                      <th>Cargo Owner</th>
                      <th>Quantity</th>
                      {!viewId && <th>Action</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.map((item, index) => (
                      <tr key={index}>
                        <td className="text-center"> {index + 1}</td>
                        <td>{_dateFormatter(item?.completionDate)}</td>
                        <td>{item?.dischargePortName}</td>
                        <td>{item?.cargoName}</td>
                        <td>{item?.cargoOwner}</td>
                        <td>{item?.quantity}</td>
                        {!viewId && (
                          <td>
                            <div
                              className="d-flex justify-content-around"
                              style={{
                                gap: "8px",
                              }}
                            >
                              <span
                                onClick={() => {
                                  const copyRowDto = [...rowDto];
                                  copyRowDto.splice(index, 1);
                                  setRowDto(copyRowDto);
                                }}
                              >
                                <IDelete />
                              </span>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                    <tr>
                      <td className="text-right" colSpan={5}>
                        <b>Total</b>
                      </td>
                      <td>
                        <b>
                          {rowDto?.reduce(
                            (acc, cur) => acc + (+cur?.quantity || 0),
                            0
                          )}
                        </b>
                      </td>
                      {!viewId && <td></td>}
                    </tr>
                  </tbody>
                </table>
              </div>
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default EstimatePDACreate;
