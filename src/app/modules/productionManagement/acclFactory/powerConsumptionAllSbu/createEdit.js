import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { _todayDate } from "../../../_helper/_todayDate";
// import IClose from '../../../_helper/_helperIcons/_close';

const initData = {
  dteDate: "",
  strShift: "",
  intPowerConsumptionId: "",
  intBusinessUnitId: "",
  intConsumptionBusinessUnit: "",
  strConsumptionBusinessUnitName: "",
  startTime: "",
  endTime: "",
  numPreviousReading: "",
  numPreviousReadingM1: "",
  numPreviousReadingM2: "",
  numPreviousReadingM3: "",
  numPresentReading: "",
  numPresentReadingM1: "",
  numPresentReadingM2: "",
  numPresentReadingM3: "",
  numTotalConsumption: "",
  numTotalConsumptionM1: "",
  numTotalConsumptionM2: "",
  numTotalConsumptionM3: "",
  dteInsertDateTime: "",
  intInsertBy: "",
  dteLastActionDateTime: "",
};

const PowerConsumptionAllSbuCreate = () => {
  const [, getRowData, rowDataLoader] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveDataLoader] = useAxiosPost();
  const { id } = useParams();
  const location = useLocation();
  const history = useHistory();
  const [modifyData, setModifyData] = useState(initData);
  const [
    tableData,
    getTableData,
    tableDataLoader,
    setTableData,
  ] = useAxiosGet();

  const [
    detailsData,
    getDetailsData,
    detailsDataLoader,
    setDetailsData,
  ] = useAxiosGet();

  const { profileData } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  useEffect(() => {
    if (id) {
      setModifyData({
        dteDate: _dateFormatter(location?.state?.dteDate),
        strShift: {
          value: location?.state?.strShift,
          label: location?.state?.strShift,
        },
        intPowerConsumptionId: location?.state?.intPowerConsumptionId,
        intBusinessUnitId: location?.state?.intBusinessUnitId,
        intConsumptionBusinessUnit: {
          value: location?.state?.intConsumptionBusinessUnit,
          label: location?.state?.strConsumptionBusinessUnitName,
        },
        numPreviousReading: location?.state?.numPreviousReading,
        numPreviousReadingM1: location?.state?.numPreviousReadingM1,
        numPreviousReadingM2: location?.state?.numPreviousReadingM2,
        numPreviousReadingM3: location?.state?.numPreviousReadingM3,
        numPresentReading: location?.state?.numPresentReading,
        numPresentReadingM1: location?.state?.numPresentReadingM1,
        numPresentReadingM2: location?.state?.numPresentReadingM2,
        numPresentReadingM3: location?.state?.numPresentReadingM3,
        numTotalConsumption: location?.state?.numTotalConsumption,
        numTotalConsumptionM1: location?.state?.numTotalConsumptionM1,
        numTotalConsumptionM2: location?.state?.numTotalConsumptionM2,
        numTotalConsumptionM3: location?.state?.numTotalConsumptionM3,
        dteInsertDateTime: location?.state?.dteInsertDateTime,
        intInsertBy: location?.state?.intInsertBy,
        dteLastActionDateTime: location?.state?.dteLastActionDateTime,
      });
    }
  }, [id, location]);

  const totalGeneratorHour =
    detailsData?.data?.totalGenerationRunningHour +
    detailsData?.data?.totalRebConsumption;

  const saveHandler = async (values, cb) => {
    const postDatapayload = [
      {
        dteDate: values?.dteDate,
        strShift: values?.strShift?.value,
        intPowerConsumptionId: 0,
        intBusinessUnitId: selectedBusinessUnit.value,
        intConsumptionBusinessUnit: +values?.intConsumptionBusinessUnit?.value,
        strConsumptionBusinessUnitName:
          values?.intConsumptionBusinessUnit?.label,
        tmStartTime: values?.startTime || null,
        tmEndTime: values?.endTime || null,
        numPreviousReading: values?.numPreviousReading || null,
        numPreviousReadingM1: values?.numPreviousReadingM1 || null,
        numPreviousReadingM2: values?.numPreviousReadingM2 || null,
        numPreviousReadingM3: values?.numPreviousReadingM3 || null,
        numPresentReading: values?.numPresentReading,
        numPresentReadingM1: values?.numPresentReadingM1 || null,
        numPresentReadingM2: values?.numPresentReadingM2 || null,
        numPresentReadingM3: values?.numPresentReadingM3 || null,
        numTotalConsumption:
          (values?.intConsumptionBusinessUnit?.value === 4
            ? (values?.numPresentReading || 0) -
              (values?.numPreviousReading || 0)
            : values?.numTotalConsumption) || null,
        numTotalConsumptionM1: values?.numTotalConsumptionM1 || null,
        numTotalConsumptionM2: values?.numTotalConsumptionM2 || null,
        numTotalConsumptionM3: values?.numTotalConsumptionM3 || null,
        dteInsertDateTime: _todayDate(),
        intInsertBy: profileData?.userId,
        dteLastActionDateTime: "",
      },
    ];
    saveData(
      `/mes/MSIL/CreateEditPowerCosumptionAllSBU`,
      postDatapayload,
      cb,
      true
    );
    // remove comments after 1 month
    // if (id) {
    //     saveData(
    //         "/mes/MSIL/CreateEditPowerCosumptionAllSBU",
    //         [{
    //             dteDate: values?.dteDate,
    //             strShift: values?.strShift?.value,
    //             intPowerConsumptionId: values?.intPowerConsumptionId,
    //             intBusinessUnitId: selectedBusinessUnit.value,
    //             intConsumptionBusinessUnit: location?.state?.intConsumptionBusinessUnit,
    //             numPreviousReading: values?.numPreviousReading,
    //             numPresentReading: values?.numPresentReading,
    //             numTotalConsumption: values?.numTotalConsumption,
    //             dteInsertDateTime: _todayDate(),
    //             intInsertBy: profileData?.userId,
    //             dteLastActionDateTime: "",
    //         }],
    //         cb,
    //         true
    //     );
    // } else {
    //     saveData(`/mes/MSIL/CreateEditPowerCosumptionAllSBU`, payloadData, id ? "" : cb, true);
    // }
  };
  // remove comments after 1 month
  // const addHandler = (values) => {
  //     setPayloadData(
  //         [...payloadData,
  //         {
  //             dteDate: values?.dteDate,
  //             strShift: values?.strShift?.value,
  //             intPowerConsumptionId: 0,
  //             intBusinessUnitId: selectedBusinessUnit.value,
  //             intConsumptionBusinessUnit: +values?.intConsumptionBusinessUnit?.value,
  //             strConsumptionBusinessUnitName: values?.intConsumptionBusinessUnit?.label,
  //             numPreviousReading: values?.numPreviousReading,
  //             numPresentReading: values?.numPresentReading,
  //             numTotalConsumption: values?.numPresentReading - values?.numPreviousReading,
  //             dteInsertDateTime: _todayDate(),
  //             intInsertBy: profileData?.userId,
  //             dteLastActionDateTime: "",
  //         }]
  //     );
  // };

  return (
    <IForm
      title={
        id
          ? "Edit Power Consumption All SBU"
          : "Create Power Consumption All SBU"
      }
      getProps={setObjprops}
    >
      {(rowDataLoader ||
        tableDataLoader ||
        saveDataLoader ||
        detailsDataLoader) && <Loading />}
      <>
        <Formik
          enableReinitialize={true}
          initialValues={id ? modifyData : initData}
          onSubmit={(values, { resetForm }) => {
            saveHandler(values, () => {
              if (id) {
                history.goBack();
              } else {
                resetForm(initData);
                setTableData([]);
              }
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            setFieldValue,
            setValues,
            errors,
            touched,
          }) => (
            <>
              <Form className="form form-label-right">
                {false && <Loading />}
                <div className="form-group  global-form">
                  <div className="row">
                    <div className="col-md-3">
                      <InputField
                        value={values?.dteDate}
                        label="Date"
                        name="dteDate"
                        type="date"
                        onChange={(e) => {
                          if (e.target.value) {
                            setFieldValue("dteDate", e.target.value);
                            setFieldValue("intConsumptionBusinessUnit", "");
                          } else {
                            setFieldValue("dteDate", "");
                            setFieldValue("strShift", "");
                            setFieldValue("intConsumptionBusinessUnit", "");
                          }
                        }}
                        disabled={id}
                      />
                    </div>
                    <div className="col-md-2">
                      <NewSelect
                        name="strShift"
                        options={[
                          { value: "A", label: "A" },
                          { value: "B", label: "B" },
                          { value: "C", label: "C" },
                        ]}
                        value={values?.strShift}
                        label="Shift"
                        onChange={(valueOption) => {
                          getDetailsData(
                            `/mes/MSIL/GetTotalGenerationForAllSBU?BusinessUnitId=${selectedBusinessUnit?.value}&Date=${values?.dteDate}&Shift=${valueOption?.value}`,
                            (data) => {
                              values?.intConsumptionBusinessUnit?.value === 4
                                ? setFieldValue(
                                    "numPresentReading",
                                    data?.data?.totalRebConsumption +
                                      data?.data?.totalGenerationRunningHour -
                                      data?.data?.totalAllSbuConsumption || 0
                                  )
                                : setFieldValue("numPresentReading", "");
                            }
                          );
                          setFieldValue("strShift", valueOption);
                          setFieldValue("intConsumptionBusinessUnit", "");
                          setFieldValue("strConsumptionBusinessUnitName", "");
                          setFieldValue("numPresentReading", "");
                          setFieldValue("numPresentReadingM1", "");
                          setFieldValue("numPresentReadingM2", "");
                          setFieldValue("numPresentReadingM3", "");
                          setFieldValue("numPreviousReading", "");
                          setFieldValue("numPreviousReadingM1", "");
                          setFieldValue("numPreviousReadingM2", "");
                          setFieldValue("numPreviousReadingM3", "");
                          setFieldValue("numTotalConsumption", "");
                          setFieldValue("numTotalConsumptionM1", "");
                          setFieldValue("numTotalConsumptionM2", "");
                          setFieldValue("numTotalConsumptionM3", "");
                          setTableData([]);
                        }}
                        errors={errors}
                        touched={touched}
                        isDisabled={id || !values?.dteDate}
                      />
                    </div>
                    {values?.strShift ? (
                      <div className="col-md-3">
                        <NewSelect
                          name="intConsumptionBusinessUnit"
                          options={[
                            { value: 4, label: "Akij Cement Company Ltd" },
                            {
                              value: 8,
                              label: "Akij Poly Fibre Industries Ltd",
                            },
                            { value: 17, label: "Akij Shipping Lines Ltd" },
                            {
                              value: 94,
                              label: "Akij Poly Fibre Industries Ltd(Chiller)",
                            },
                            {
                              value: 175,
                              label: "Akij Ready Mix Concrete Ltd",
                            },
                            { value: 53, label: "Akij Flour Mills Ltd" },
                            { value: -10, label: "ACCL_Power Plant" },
                          ]}
                          value={values?.intConsumptionBusinessUnit}
                          label="BusinessUnit"
                          onChange={(valueOption) => {
                            if (valueOption) {
                              getDetailsData(
                                `/mes/MSIL/GetTotalGenerationForAllSBU?BusinessUnitId=${selectedBusinessUnit?.value}&Date=${values?.dteDate}&Shift=${values?.strShift?.value}`,
                                (data) => {
                                  valueOption?.value === 4
                                    ? setFieldValue(
                                        "numPresentReading",
                                        data?.data?.totalRebConsumption +
                                          data?.data
                                            ?.totalGenerationRunningHour -
                                          data?.data?.totalAllSbuConsumption ||
                                          0
                                      )
                                    : setFieldValue("numPresentReading", "");
                                }
                              );
                              getRowData(
                                `/mes/MSIL/GetPreviousPowerConsumptionReading?BusinessUnitId=${selectedBusinessUnit?.value}&ConsumptionBusinessUnitId=${valueOption?.value}&Date=${values?.dteDate}`,
                                (data) => {
                                  setFieldValue(
                                    "numPreviousReadingM1",
                                    data?.numPreviousReadingM1 || 0
                                  );
                                  setFieldValue(
                                    "numPreviousReadingM2",
                                    data?.numPreviousReadingM2 || 0
                                  );
                                  setFieldValue(
                                    "numPreviousReadingM3",
                                    data?.numPreviousReadingM3 || 0
                                  );
                                  setFieldValue(
                                    "numPreviousReading",
                                    data?.numPreviousReading || 0
                                  );
                                }
                              );
                              getTableData(
                                `/mes/MSIL/GetDateWisePowerCosumptionAllSBU?BusinessUnitId=${selectedBusinessUnit?.value}&Date=${values?.dteDate}&ConsumptionBusinessUnitId=${valueOption?.value}`
                              );
                              setFieldValue(
                                "intConsumptionBusinessUnit",
                                valueOption
                              );
                              setFieldValue(
                                "intConsumptionBusinessUnitName",
                                valueOption?.label
                              );
                            } else {
                              resetForm(initData);
                              setFieldValue("dteDate", values?.dteDate);
                              setFieldValue("strShift", values?.strShift);
                              setTableData([]);
                              setDetailsData({});
                            }
                          }}
                          errors={errors}
                          touched={touched}
                          isDisabled={id || !values?.dteDate}
                        />
                      </div>
                    ) : null}
                    <div className="col-lg-4">
                      <p>
                        Total Generator:{" "}
                        {values?.intConsumptionBusinessUnit !== 4
                          ? totalGeneratorHour || 0
                          : totalGeneratorHour -
                              detailsData?.data?.totalAllSbuConsumption || 0}
                      </p>
                      <p>
                        Total Consumption:{" "}
                        {detailsData?.data?.totalAllSbuConsumption || 0}
                      </p>
                    </div>
                  </div>

                  {values?.strShift && values?.intConsumptionBusinessUnit ? (
                    <>
                      <div className="row">
                        {values?.intConsumptionBusinessUnit?.value === -10 ? (
                          <div className="col-md-1 d-flex justify-content-center align-items-center">
                            <label>Meter-1</label>
                          </div>
                        ) : (
                          <></>
                        )}
                        {values?.intConsumptionBusinessUnit?.value !== -10 ? (
                          <>
                            <div className="col-lg-2">
                              <InputField
                                value={values?.startTime}
                                label="Start Time"
                                name="startTime"
                                type="time"
                                onChange={(e) => {
                                  if (!values?.dteDate)
                                    return toast.warn("Please select date");
                                  setFieldValue("startTime", e.target.value);
                                }}
                              />
                            </div>
                            <div className="col-lg-2">
                              <InputField
                                value={values?.endTime}
                                label="End Time"
                                name="endTime"
                                type="time"
                                onChange={(e) => {
                                  if (!values?.startTime)
                                    return toast.warn(
                                      "Please Select Start Time"
                                    );
                                  setFieldValue("endTime", e.target.value);
                                }}
                              />
                            </div>
                          </>
                        ) : null}
                        <div className="col-md-2">
                          <InputField
                            value={values?.numPreviousReading}
                            label="Previous Reading"
                            name="numPreviousReading"
                            type="number"
                            disabled={true}
                          />
                        </div>
                        <div className="col-md-2">
                          <InputField
                            value={values?.numPresentReading}
                            label="Present Reading"
                            name="numPresentReading"
                            type="number"
                            onChange={(e) => {
                              if (+e.target.value) {
                                setFieldValue(
                                  "numPresentReading",
                                  +e.target.value
                                );
                                setFieldValue(
                                  "numTotalConsumption",
                                  (+e.target.value || 0) -
                                    values?.numPreviousReading
                                );
                              } else {
                                setFieldValue("numPresentReading", "");
                                setFieldValue("numTotalConsumption", "");
                              }
                            }}
                            disabled={
                              values?.intConsumptionBusinessUnit?.value === 4
                            }
                          />
                        </div>
                        <div className="col-md-2">
                          <InputField
                            value={
                              values?.intConsumptionBusinessUnit?.value === 4
                                ? (values?.numPresentReading || 0) -
                                  (values?.numPreviousReading || 0)
                                : values?.numTotalConsumption
                            }
                            label="Total Consumption"
                            name="numTotalConsumption"
                            type="number"
                            disabled={true}
                          />
                        </div>
                      </div>
                      {values?.intConsumptionBusinessUnit?.value === -10 ? (
                        <>
                          <div className="row">
                            <div className="col-md-1 d-flex justify-content-center align-items-center">
                              <label>Meter-2</label>
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numPreviousReadingM1}
                                label="Previous Reading "
                                name="numPreviousReading"
                                type="number"
                                disabled={true}
                              />
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numPresentReadingM1}
                                label="Present Reading"
                                name="numPresentReading"
                                type="number"
                                onChange={(e) => {
                                  if (+e.target.value) {
                                    setFieldValue(
                                      "numPresentReadingM1",
                                      +e.target.value
                                    );
                                    setFieldValue(
                                      "numTotalConsumptionM1",
                                      (+e.target.value || 0) -
                                        values?.numPreviousReadingM1
                                    );
                                  } else {
                                    setFieldValue("numPresentReadingM1", "");
                                    setFieldValue("numTotalConsumptionM1", "");
                                  }
                                }}
                              />
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numTotalConsumptionM1}
                                label="Total Consumption"
                                name="numTotalConsumption"
                                type="number"
                                disabled={true}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-1 d-flex justify-content-center align-items-center">
                              <label>Meter-3</label>
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numPreviousReadingM2}
                                label="Previous Reading "
                                name="numPreviousReading"
                                type="number"
                                disabled={true}
                              />
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numPresentReadingM2}
                                label="Present Reading"
                                name="numPresentReading"
                                type="number"
                                onChange={(e) => {
                                  if (+e.target.value) {
                                    setFieldValue(
                                      "numPresentReadingM2",
                                      +e.target.value
                                    );
                                    setFieldValue(
                                      "numTotalConsumptionM2",
                                      (+e.target.value || 0) -
                                        values?.numPreviousReadingM2
                                    );
                                  } else {
                                    setFieldValue("numPresentReadingM2", "");
                                    setFieldValue("numTotalConsumptionM2", "");
                                  }
                                }}
                              />
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numTotalConsumptionM2}
                                label="Total Consumption"
                                name="numTotalConsumption"
                                type="number"
                                disabled={true}
                              />
                            </div>
                          </div>
                          <div className="row">
                            <div className="col-md-1 d-flex justify-content-center align-items-center">
                              <label>Meter-4</label>
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numPreviousReadingM3}
                                label="Previous Reading "
                                name="numPreviousReading"
                                type="number"
                                disabled={true}
                              />
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numPresentReadingM3}
                                label="Present Reading"
                                name="numPresentReading"
                                type="number"
                                onChange={(e) => {
                                  if (+e.target.value) {
                                    setFieldValue(
                                      "numPresentReadingM3",
                                      +e.target.value
                                    );
                                    setFieldValue(
                                      "numTotalConsumptionM3",
                                      (+e.target.value || 0) -
                                        values?.numPreviousReadingM3
                                    );
                                  } else {
                                    setFieldValue("numPresentReadingM3", "");
                                    setFieldValue("numTotalConsumptionM3", "");
                                  }
                                }}
                              />
                            </div>
                            <div className="col-md-2">
                              <InputField
                                value={values?.numTotalConsumptionM3}
                                label="Total Consumption"
                                name="numTotalConsumption"
                                type="number"
                                disabled={true}
                              />
                            </div>
                          </div>
                        </>
                      ) : (
                        <></>
                      )}
                      {/* remove comments after 1 month */}
                      {/* <div className="col-lg-2">
                                                        {!id && (<button
                                                            style={{ marginTop: "18px" }}
                                                            className="btn btn-primary ml-2"
                                                            disabled={
                                                                !values?.dteDate ||
                                                                !values?.strShift ||
                                                                !values?.intConsumptionBusinessUnit ||
                                                                !values?.numPresentReading ||
                                                                !values?.numTotalConsumption
                                                            }
                                                            type="button"
                                                            onClick={() => {
                                                                addHandler(values);
                                                                setFieldValue("numPresentReading", "");
                                                                setFieldValue("numTotalConsumption", "");
                                                            }}
                                                        >
                                                            Add
                                                        </button>)}
                                                    </div> */}
                    </>
                  ) : null}
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
                  onSubmit={() => {
                    setTableData([]);
                    resetForm(initData);
                  }}
                ></button>
              </Form>
              {/* {
                                !id && payloadData?.length > 0 ? (
                                    <div className="table-responsive">
                                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th>SL</th>
                                                    <th>Shift</th>
                                                    <th>Business Unit</th>
                                                    <th>Previous Reading</th>
                                                    <th>Present Reading</th>
                                                    <th>Total Consumption</th>
                                                    <th>Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {payloadData?.map((data, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className='text-center'>{data?.strShift}</td>
                                                        <td className='text-center'>{data?.intConsumptionBusinessUnit}</td>
                                                        <td className='text-center'>{data?.numPreviousReading}</td>
                                                        <td className='text-center'>{data?.numPresentReading}</td>
                                                        <td className='text-center'>{data?.numTotalConsumption}</td>
                                                        <td className='text-center'>
                                                            <IClose
                                                                id={index}
                                                                closer={(index) => {
                                                                    let filteredData = payloadData.filter((data, dataIndex) => dataIndex !== index);
                                                                    setPayloadData(filteredData);
                                                                }}
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : null
                            } */}
              {tableData?.data?.length > 0 ? (
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                        <thead>
                          <tr>
                            <th colSpan={4} style={{ width: "30px" }}>
                              SL
                            </th>
                            <th colSpan={4}>Date</th>
                            <th colSpan={4}>Shift</th>
                            <th colSpan={4}>Unit Name</th>
                            <th colSpan={4}>Previous Reading</th>
                            <th colSpan={4}>Present Reading</th>
                            <th colSpan={4}>Total Consumption</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tableData?.data?.map((data, index) => (
                            <tr key={index}>
                              <td colSpan={4}>{index + 1}</td>
                              <td colSpan={4} className="text-center">
                                {_dateFormatter(data?.dteDate)}
                              </td>
                              <td colSpan={4} className="text-center">
                                {data?.strShift}
                              </td>
                              <td colSpan={4} className="text-center">
                                {data?.strConsumptionBusinessUnitName ||
                                  values?.strConsumptionBusinessUnitName}
                              </td>
                              {data?.numPreviousReadingM1 ||
                              data?.numPreviousReadingM2 ||
                              data?.numPreviousReadingM3 ? (
                                <>
                                  <td className="text-center">
                                    M1 : {data?.numPreviousReading}
                                  </td>
                                  <td className="text-center">
                                    M2 : {data?.numPreviousReadingM1}
                                  </td>
                                  <td className="text-center">
                                    M3 : {data?.numPreviousReadingM2}
                                  </td>
                                  <td className="text-center">
                                    M4 : {data?.numPreviousReadingM3}
                                  </td>
                                </>
                              ) : (
                                <td colSpan={4} className="text-center">
                                  {data?.numPreviousReading}
                                </td>
                              )}
                              {data?.numPresentReadingM1 ||
                              data?.numPresentReadingM2 ||
                              data?.numPresentReadingM3 ? (
                                <>
                                  <td className="text-center">
                                    M1 : {data?.numPresentReading}
                                  </td>
                                  <td className="text-center">
                                    M2 : {data?.numPresentReadingM1}
                                  </td>
                                  <td className="text-center">
                                    M3 : {data?.numPresentReadingM2}
                                  </td>
                                  <td className="text-center">
                                    M4 : {data?.numPresentReadingM3}
                                  </td>
                                </>
                              ) : (
                                <td colSpan={4} className="text-center">
                                  {data?.numPresentReading}
                                </td>
                              )}
                              {data?.numTotalConsumptionM1 ||
                              data?.numTotalConsumptionM2 ||
                              data?.numTotalConsumptionM3 ? (
                                <>
                                  <td className="text-center">
                                    M1 : {data?.numTotalConsumption}
                                  </td>
                                  <td className="text-center">
                                    M2 : {data?.numTotalConsumptionM1}
                                  </td>
                                  <td className="text-center">
                                    M3 : {data?.numTotalConsumptionM2}
                                  </td>
                                  <td className="text-center">
                                    M4 : {data?.numTotalConsumptionM3}
                                  </td>
                                </>
                              ) : (
                                <td colSpan={4} className="text-center">
                                  {data?.numTotalConsumption}
                                </td>
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <></>
              )}
            </>
          )}
        </Formik>
      </>
    </IForm>
  );
};

export default PowerConsumptionAllSbuCreate;
