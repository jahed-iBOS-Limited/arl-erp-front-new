/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";

export default function MoistureDataView({ viewShift, viewDate, viewRemarks }) {
  console.log("viewShift", viewShift);
  const [modifyData, setmodifyData] = useState();
  const [objProps, setObjprops] = useState({});
  const { id } = useParams();
  const [itemData, getItemData, itemDataLoader] = useAxiosGet();
  const [machineDDL, getMachineDDL, machineDDLloader] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [tableData, setTableData] = useState([]);
  const saveHandler = (values, cb) => {};
  useEffect(() => {
    if (viewShift && viewDate) {
      getMachineDDL(
        `/hcm/QCTest/GetTransactionMachineNameDDL?BusinessUnitId=${selectedBusinessUnit?.value}`
      );
      getItemData(
        `/hcm/QCTest/GetMoistureQCItemConfigData?Date=${_dateFormatter(
          viewDate
        )}&Shift=${viewShift}&BusinessUnitId=${selectedBusinessUnit?.value}`,
        (data) => {
          const updatedData = data?.data?.map((itm) => {
            return {
              ...itm,
              createdAt: "",
              createdby: "",
              qcParameterName: "",
              qcTestType: "MoistureTest",
            };
          });
          setTableData(updatedData);
        }
      );
    }
    setmodifyData({
      date: _dateFormatter(viewDate),
      shift: { value: viewShift, label: viewShift },
      remarks: viewRemarks,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={modifyData}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values, () => {});
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
          {false && <Loading />}
          <IForm
            isHiddenReset
            isHiddenBack
            isHiddenSave
            title={"View Moisture Data"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.date}
                    label="Date"
                    name="date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("date", e.target.value);
                    }}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shift"
                    options={[
                      { value: 1, label: "A" },
                      { value: 2, label: "B" },
                      { value: 3, label: "C" },
                    ]}
                    value={values?.shift}
                    label="Shift"
                    onChange={(valueOption) => {
                      setFieldValue("shift", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.remarks}
                    label="Remarks"
                    name="remarks"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("remarks", e.target.value);
                    }}
                    disabled={true}
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-lg-12">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th>Sl</th>
                          <th>Item Type</th>
                          <th>Item Name</th>
                          <th>Machine Name</th>
                          <th>Uom</th>
                          <th>Moisture</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tableData?.map((itm, idx) => (
                          <tr key={idx}>
                            <td>{idx + 1}</td>
                            <td>{itm?.itemTypeName}</td>
                            <td>{itm?.itemName}</td>
                            <td>
                              {itm?.itemTypeName === "Finished Products" ? (
                                <NewSelect
                                  options={machineDDL}
                                  value={{
                                    value: itm?.machineId,
                                    label: itm?.machineName,
                                  }}
                                  onChange={(valueOption) => {
                                    if (valueOption) {
                                      const data = [...tableData];
                                      data[idx].machineId = valueOption?.value;
                                      data[idx].machineName =
                                        valueOption?.label;
                                      setTableData(data);
                                    } else {
                                      const data = [...tableData];
                                      data[idx].machineId = 0;
                                      data[idx].machineName = "";
                                      setTableData(data);
                                    }
                                  }}
                                  errors={errors}
                                  touched={touched}
                                  isDisabled={true}
                                />
                              ) : null}
                            </td>
                            <td>{itm?.uomName}</td>
                            <td>
                              <InputField
                                disabled={true}
                                value={itm?.quantity}
                                name={`moisture${idx}`}
                                type="number"
                                onChange={(e) => {
                                  const data = [...tableData];
                                  data[idx].quantity = +e.target.value;
                                  setTableData(data);
                                }}
                              />
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
                onSubmit={() => resetForm()}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
