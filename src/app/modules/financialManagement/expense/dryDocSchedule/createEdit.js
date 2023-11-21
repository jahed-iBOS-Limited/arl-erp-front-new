import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import { useParams } from "react-router-dom";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";

const initData = {
  vessel: "",
  dockyardName: "",
  fromDate: _todayDate(),
  toDate: _todayDate(),
  remarks: "",

  // for rowdto
  activity: "",
  supplier: "",
  currency: "",
  budgetAmount: "",
  attachment: "",
};

export default function DryDocCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const { id } = useParams();

  const { profileData, selectedBusinessUnit } = useSelector(
    (state) => state?.authData,
    shallowEqual
  );

  const [vesselDDL, getVesselDDL, vesselAssetLoader] = useAxiosGet();
  const [supplierDDL, getSupplierDDL, supplierLoader] = useAxiosGet();
  const [currencyDDL, getCurrencyDDL, currencyDDLloader] = useAxiosGet();

  const [rowData, setRowData] = useState([]);

  const saveHandler = (values, cb) => {
    alert("Working...");
  };

  useEffect(() => {
    getSupplierDDL(
      `/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`
    );
    getCurrencyDDL(`/domain/Purchase/GetBaseCurrencyList`);
    getVesselDDL(
      `https://imarine.ibos.io/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`
    );
  }, []);

  return (
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
        setFieldValue,
        isValid,
        errors,
        touched,
      }) => (
        <>
          {(vesselAssetLoader || supplierLoader || currencyDDLloader) && (
            <Loading />
          )}
          <IForm
            title={id ? "Edit Dry Doc Schedule" : "Create Dry Doc Schedule"}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselDDL}
                    value={values?.vessel}
                    label="Vessel"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("vessel", valueOption);
                      } else {
                        setFieldValue("vessel", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.dockyardName}
                    label="Dockyard Name"
                    name="dockyardName"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("dockyardName", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
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
                  />
                </div>
              </div>

              <div className="form-group  global-form row mt-2">
                <div className="col-lg-3">
                  <InputField
                    value={values?.activity}
                    label="Activity"
                    name="activity"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("activity", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="supplier"
                    options={supplierDDL}
                    value={values?.supplier}
                    label="Supplier"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("supplier", valueOption);
                      } else {
                        setFieldValue("supplier", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="currency"
                    options={currencyDDL}
                    value={values?.currency}
                    label="Currency"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("currency", valueOption);
                      } else {
                        setFieldValue("currency", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.budgetAmount}
                    label="Budget Amount"
                    name="budgetAmount"
                    type="number"
                    onChange={(e) => {
                      setFieldValue("budgetAmount", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">Attachment</div>
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "17px" }}
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setRowData([
                        ...rowData,
                        {
                          autoId: 0,
                          activity: values?.activity,
                          supplier: values?.supplier?.label,
                          currency: values?.currency?.label,
                          budgetAmount: values?.budgetAmount,
                          attachment: values?.attachment,
                        },
                      ]);
                    }}
                    disabled={
                      !values?.activity ||
                      !values?.supplier ||
                      !values?.currency ||
                      !values?.budgetAmount
                    }
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="mt-2">
                <table className="table table-striped table-bordered bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>Sl</th>
                      <th>Activity</th>
                      <th>Supplier</th>
                      <th>Currency</th>
                      <th>Budget Amount</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.length > 0 &&
                      rowData?.map((item, index) => (
                        <tr key={index}>
                          <td>{index + 1}</td>
                          <td>{item?.activity}</td>
                          <td>{item?.supplier}</td>
                          <td>{item?.currency}</td>
                          <td>{item?.budgetAmount}</td>
                          <td>
                            <span>
                              <i className="fa fa-trash"></i>
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
          </IForm>
        </>
      )}
    </Formik>
  );
}
