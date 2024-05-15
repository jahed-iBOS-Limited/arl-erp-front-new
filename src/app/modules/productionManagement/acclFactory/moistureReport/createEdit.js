/* eslint-disable no-unused-vars */
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import IForm from "./../../../_helper/_form";
import InputField from "./../../../_helper/_inputField";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
const initData = {
  dteDate: "",
  shift: "",
  remarks: "",
};
export default function MoustureCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const [modifyData, setmodifyData] = useState();
  const { id } = useParams();
  const location = useLocation();
  const [machineDDL, getMachineDDL, machineDDLloader] = useAxiosGet();
  const [itemData, getItemData, itemDataLoader] = useAxiosGet();

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [, saveMoistureData, moistureDataLoader] = useAxiosPost();
  const [tableData, setTableData] = useState([]);
  const saveHandler = (values, cb) => {
    if (!values?.dteDate) {
      return toast.warn("Date is required");
    }
    if (!values?.shift) {
      return toast.warn("Shift is required");
    }
    if (!tableData?.length) {
      return toast.warn("Item is required");
    }
    const modiFiedRowData = tableData?.map((itm) => {
      return {
        ...itm,
        createdBy: profileData?.userId,
      };
    });
    const payload = {
      qcTransactionHeaderId: 0,
      date: values?.dteDate,
      shiftId: values?.shift?.value,
      shiftName: values?.shift?.label,
      businessUnitId: selectedBusinessUnit?.value,
      comments: values?.remarks,
      createdby: profileData?.userId,
      row: modiFiedRowData,
    };
    saveMoistureData(
      id
        ? `/hcm/QCTest/MoistureQcTransactionEdit`
        : `/hcm/QCTest/CreateMoistureTest`,
      payload,
      cb,
      true
    );
  };
  useEffect(() => {
    if (selectedBusinessUnit) {
      getMachineDDL(
        `/hcm/QCTest/GetTransactionMachineNameDDL?BusinessUnitId=${selectedBusinessUnit?.value}`
      );
    }
    if (id) {
      getItemData(
        `/hcm/QCTest/GetMoistureQCItemConfigData?Date=${location?.state?.date}&Shift=${location?.state?.shiftName}&BusinessUnitId=${selectedBusinessUnit?.value}`,
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
      setmodifyData({
        dteDate: _dateFormatter(location?.state?.date),
        shift: {
          value: location?.state?.shiftId,
          label: location?.state?.shiftName,
        },
        remarks: location?.state?.comments,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? modifyData : initData}
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
          {(moistureDataLoader || machineDDLloader || itemDataLoader) && (
            <Loading />
          )}
          <IForm
            title={id ? "Edit Moisture Test" : "Create Moisture Test"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.dteDate}
                    label="Date"
                    name="dteDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("dteDate", e.target.value);
                      setFieldValue("shift", "");
                      setFieldValue("remarks", "");
                      setTableData([]);
                    }}
                    disabled={id ? true : false}
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
                      if (valueOption) {
                        setFieldValue("shift", valueOption);
                        setFieldValue("remarks", "");
                        getItemData(
                          `/hcm/QCTest/GetMoistureQCItemConfigData?Date=${values?.dteDate}&Shift=${valueOption?.label}&BusinessUnitId=${selectedBusinessUnit?.value}`,
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
                      } else {
                        setFieldValue("shift", "");
                        setFieldValue("remarks", "");
                        setTableData([]);
                      }
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.dteDate || id ? true : false}
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
                    disabled={id ? true : false}
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
                                  isDisabled={id ? true : false}
                                />
                              ) : null}
                            </td>
                            <td>{itm?.uomName}</td>
                            <td>
                              <InputField
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}
