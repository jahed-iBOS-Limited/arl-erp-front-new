import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation } from "react-router";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
  castingDate: _todayDate(),
  shipPoint: "",
  shift: { value: 1, label: "Day" },
  avlTransitMixture: 0,
  transitMixtureExplain: "",
  avlConcretePump: 0,
  concretePumpExplain: "",
  avlPickUp: 0,
  pickUpExplain: "",
  avlPipeLine: 0,
  pipeLineExplain: "",

  totalTransitMixture: 0,
  totalConcretePump: 0,
  totalPickUp: 0,
  totalPipeLine: 0,
};

export default function LogisticEquipmentEntry() {
  const [objProps, setObjprops] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  const [shipPointList, getShipPointList, shipPointLoader] = useAxiosGet();

  const [formList, setFormList] = useState([]);
  const [, onSaveHandler, loading] = useAxiosPost();
  const location = useLocation();

  useEffect(() => {
    getShipPointList(
      `/wms/ShipPoint/GetShipPointDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}`
    );
    if (location?.state?.item) {
      setFormList([{ ...location?.state?.item }]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, selectedBusinessUnit]);

  const saveHandler = async (values, cb) => {
    if (!formList?.length) {
      return toast.warn("Add at least One row!");
    }
    onSaveHandler(
      `/oms/CastingSchedule/CreateAndUpdateCastingScheduleToolsInfo`,
      formList,
      cb,
      true
    );
  };

  return (
    <IForm
      title="Create Logistic Equipment Availability"
      getProps={setObjprops}
      isHiddenReset={true}
    >
      {(shipPointLoader || loading) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          // validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              resetForm(initData);
              setFormList([]);
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
                <div className="form-group  global-form row">
                  <div className="col-lg-3">
                    <InputField
                      value={values?.castingDate}
                      label="Casting Date"
                      name="castingDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("castingDate", e.target.value);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shipPoint"
                      options={shipPointList || []}
                      value={values?.shipPoint}
                      label="Select Ship Point"
                      onChange={(valueOption) => {
                        setFieldValue("shipPoint", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="shift"
                      options={[
                        { value: 1, label: "Day" },
                        { value: 2, label: "Night" },
                      ]}
                      value={values?.shift}
                      label="Select Shift"
                      onChange={(valueOption) => {
                        setFieldValue("shift", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                </div>

                <div className="form-group  global-form row">
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.totalTransitMixture}
                        label="Total TM"
                        name="totalTransitMixture"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("totalTransitMixture", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.avlTransitMixture}
                        label="Available TM"
                        name="avlTransitMixture"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("avlTransitMixture", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.transitMixtureExplain}
                        label="Explanations"
                        name="transitMixtureExplain"
                        type="text"
                        onChange={(e) => {
                          setFieldValue(
                            "transitMixtureExplain",
                            e.target.value
                          );
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.totalConcretePump}
                        label="Total Concrete Pump"
                        name="totalConcretePump"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("totalConcretePump", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.avlConcretePump}
                        label="Available Concrete"
                        name="avlConcretePump"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("avlConcretePump", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.concretePumpExplain}
                        label="Explanations"
                        name="concretePumpExplain"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("concretePumpExplain", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.totalPickUp}
                        label="Total PickUp"
                        name="totalPickUp"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("totalPickUp", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.avlPickUp}
                        label="Available Pickup(Nos)"
                        name="avlPickUp"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("avlPickUp", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.pickUpExplain}
                        label="Explanations"
                        name="pickUpExplain"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("pickUpExplain", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                  <>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.totalPipeLine}
                        label="Total PipeLine"
                        name="totalPipeLine"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("totalPipeLine", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.avlPipeLine}
                        label="Available PipeLine(RFT)"
                        name="avlPipeLine"
                        type="number"
                        onChange={(e) => {
                          setFieldValue("avlPipeLine", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <InputField
                        value={values?.pipeLineExplain}
                        label="Explanations"
                        name="pipeLineExplain"
                        type="text"
                        onChange={(e) => {
                          setFieldValue("pipeLineExplain", e.target.value);
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>

                  <div className="col-lg-3">
                    <button
                      disabled={
                        !values?.castingDate ||
                        !values?.shipPoint ||
                        !values?.shift
                      }
                      type="button"
                      className="btn btn-primary mt-5"
                      onClick={() => {
                        const payload = {
                          ...values,
                          autoId: 0,
                          castingDate: values?.castingDate,
                          dayId: +values?.castingDate?.split("-")[2],
                          monthId: +values?.castingDate?.split("-")[1],
                          yearId: +values?.castingDate?.split("-")[0],
                          accountId: profileData?.accountId,
                          unitId: values?.selectedBusinessUnit?.value,
                          shipPointId: values?.shipPoint?.value,
                          shiftId: values?.shift?.value,
                        };
                        setFormList((prev) => [...prev, payload]);
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="table-responsive">
                  <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                    <thead>
                      <tr>
                        <th>Total Transit Mixture</th>
                        <th>Available TM</th>
                        <th>Explanations</th>
                        <th>Total Concrete Pump</th>
                        <th>Available Concrete</th>
                        <th>Explanations</th>
                        <th>Total PickUp</th>
                        <th>Available Pickup(Nos)</th>
                        <th>Explanations</th>
                        <th>Total PipeLine</th>
                        <th>Available PipeLine(RFT)</th>
                        <th>Explanations</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formList.map((item, index) => (
                        <tr key={index}>
                          <td>
                            <InputField
                              value={item?.totalTransitMixture}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["totalTransitMixture"] =
                                  e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.avlTransitMixture}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["avlTransitMixture"] =
                                  e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.transitMixtureExplain}
                              type="text"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["transitMixtureExplain"] =
                                  e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.totalConcretePump}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["totalConcretePump"] =
                                  e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.avlConcretePump}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["avlConcretePump"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.concretePumpExplain}
                              type="text"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["concretePumpExplain"] =
                                  e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.totalPickUp}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["totalPickUp"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.avlPickUp}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["avlPickUp"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.pickUpExplain}
                              type="text"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["pickUpExplain"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.totalPipeLine}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["totalPipeLine"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.avlPipeLine}
                              type="number"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["avlPipeLine"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.pipeLineExplain}
                              type="text"
                              onChange={(e) => {
                                const data = [...formList];
                                data[index]["pipeLineExplain"] = e.target.value;
                                setFormList(data);
                              }}
                            />
                          </td>

                          <td className="text-center">
                            <span
                              onClick={() => {
                                const data = formList?.filter(
                                  (itm, i) => i !== index
                                );
                                setFormList(data);
                              }}
                            >
                              <IDelete />
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
