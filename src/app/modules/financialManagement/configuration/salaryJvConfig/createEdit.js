import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import NewSelect from "./../../../_helper/_select";
import { useLocation, useParams } from "react-router-dom";
import { ISelect } from "../../../_helper/_inputDropDown";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IDelete from "../../../_helper/_helperIcons/_delete";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { toast } from "react-toastify";

const initData = {
  strType: "Without Factory",
  sbu: "",
  costCenter: "",
  costElement: "",
  profitCenter: "",
  debitGeneralLedger: "",
  debitSubGeneralLedger: "",
  creditGeneralLedger: "",
  creditSubGeneralLedger: "",
  salaryComponent: "",
};

export default function SalaryJvConfigCreateEdit() {
  const [objProps, setObjprops] = useState({});
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  const { id } = useParams();
  const location = useLocation();

  const [sbuDDL, getSbuDDL, sbuDDLloader] = useAxiosGet();
  const [costCenterDDL, getCostCenterDDL, costCenterDDLloader] = useAxiosGet();
  const [
    costElementDDL,
    getCostElementDDL,
    CostElementDDLloader,
  ] = useAxiosGet();
  const [
    profitCenterDDl,
    getProfitCenterDDL,
    profitCenterDDLloader,
  ] = useAxiosGet();
  const [
    debitGeneralLedgerDDL,
    getDebitGeneralLedgerDDL,
    debitGeneralLedgerDDLloader,
  ] = useAxiosGet();
  const [
    debitSubGeneralLedgerDDL,
    getDebitSubGeneralLedgerDDL,
    debitSubGeneralLedgerDDLloader,
    setDebitSubGeneralLedgerDDL,
  ] = useAxiosGet();
  const [creditGeneralLedgerDDL, , , setCreditGeneralLedgerDDL] = useAxiosGet();
  const [
    creditSubGeneralLedgerDDL,
    getCreditSubGeneralLedgerDDL,
    creditSubGeneralLedgerDDLloader,
    setCreditSubGeneralLedgerDDL,
  ] = useAxiosGet();
  const [
    salaryComponentDDL,
    getSalaryComponentDDL,
    salaryComponentDDLloader,
    setSalaryComponentDDL,
  ] = useAxiosGet();

  const [, getOldConfigData, oldConfigDataLoader] = useAxiosGet();

  const [tableData, setTableData] = useState([]);

  const [, createSalaryJvConfig, createSalaryJvConfigLoader] = useAxiosPost();

  const saveHandler = (values, cb) => {
    if (tableData?.length < 1)
      return toast.warn("Please add at least one item");
    createSalaryJvConfig(
      `/fino/AdjustmentJournal/CreateNUpdateDebitCreditGlConfig?BusinessUnitId=${selectedBusinessUnit?.value}`,
      tableData,
      cb,
      true
    );
  };

  const addHandler = (values) => {
    const isExist = tableData?.find((item) => {
      return (
        item?.intCostCenterId === values?.costCenter?.value &&
        item?.intCostElementId === values?.costElement?.value &&
        item?.intProfitCenterId === values?.profitCenter?.value &&
        item?.intDebitGlid === values?.debitGeneralLedger?.value &&
        item?.intDebitBusinessTransactionId ===
          values?.debitSubGeneralLedger?.value &&
        item?.intCreditGlid === values?.creditGeneralLedger?.value &&
        item?.intCreditBusinessTransactionId ===
          values?.creditSubGeneralLedger?.value &&
        item?.strSalaryTableColumnName === values?.salaryComponent?.name &&
        item?.strType === values?.strType
      );
    });
    if (isExist) {
      return toast.warn("Already Exist");
    } else {
      const rowObj = {
        intAutoId: 0,
        intBusinessUnitId: selectedBusinessUnit?.value,
        strCostCenterName: values?.costCenter?.label,
        intCostCenterId: values?.costCenter?.value,
        intCostElementId: values?.costElement?.value,
        strCostElementName: values?.costElement?.label,
        strProfitCenterName: values?.profitCenter?.label,
        intProfitCenterId: values?.profitCenter?.value,
        strSalaryTableColumnName: values?.salaryComponent?.name,
        strSalaryTableColumnNameForView: values?.salaryComponent?.label,

        intDebitGlid: values?.debitGeneralLedger?.value,
        strDebitGlcode: values?.debitGeneralLedger?.code,
        strDebitGlname: values?.debitGeneralLedger?.label,

        intDebitBusinessTransactionId: values?.debitSubGeneralLedger?.value,
        strDebitBusinessTransactionCode: values?.debitSubGeneralLedger?.code,
        strDebitBusinessTransactionName: values?.debitSubGeneralLedger?.label,

        intCreditGlid: values?.creditGeneralLedger?.value,
        strCreditGlcode: values?.creditGeneralLedger?.code,
        strCreditGlname: values?.creditGeneralLedger?.label,

        intCreditBusinessTransactionId: values?.creditSubGeneralLedger?.value,
        strCreditBusinessTransactionCode: values?.creditSubGeneralLedger?.code,
        strCreditBusinessTransactionName: values?.creditSubGeneralLedger?.label,
        strType: values?.strType,
        isActive: true,
      };
      setTableData([...tableData, rowObj]);
    }
  };

  const removeHandler = (index) => {
    const filterArr = tableData.filter((itm, idx) => idx !== index);
    setTableData(filterArr);
  };

  useEffect(() => {
    if (location?.state?.isEdit === true) {
      getOldConfigData(
        `/fino/AdjustmentJournal/GetAllDebitCreditGLConfig?BusinessUnitId=${selectedBusinessUnit?.value}`,
        (data) => {
          console.log("data", data);
          setTableData(data);
        }
      );
    }
    getSbuDDL(
      `/costmgmt/SBU/GetSBUListDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&Status=true`
    );
    getDebitGeneralLedgerDDL(
      `/fino/CommonFino/GetGeneralLedgerListScheduleView`,
      (data) => setCreditGeneralLedgerDDL(data)
    );
    getSalaryComponentDDL(
      `/fino/AdjustmentJournal/GetSalaryComponentDDL`,
      (data) => {
        const newData = data?.map((item) => ({
          value: item?.intSalaryComponentId,
          label: item?.strComponentViewName,
          name: item?.strComponentName,
        }));
        setSalaryComponentDDL(newData);
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit]);
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
          {(costCenterDDLloader ||
            sbuDDLloader ||
            CostElementDDLloader ||
            profitCenterDDLloader ||
            debitGeneralLedgerDDLloader ||
            debitSubGeneralLedgerDDLloader ||
            salaryComponentDDLloader ||
            creditSubGeneralLedgerDDLloader ||
            createSalaryJvConfigLoader ||
            oldConfigDataLoader) && <Loading />}
          <IForm
            title={
              id
                ? "Edit Salary JV Configuration"
                : "Create Salary JV Configuration"
            }
            getProps={setObjprops}
            submitBtnText={location?.state?.isEdit ? "Update" : "Save"}
          >
            <Form>
              <>
                <div className="col-lg-4 mb-2 mt-5">
                  <label className="mr-3">
                    <input
                      type="radio"
                      name="strType"
                      checked={values?.strType === "Without Factory"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setFieldValue("strType", "Without Factory");
                      }}
                    />
                    Without Factory
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="strType"
                      checked={values?.strType === "Factory"}
                      className="mr-1 pointer"
                      style={{ position: "relative", top: "2px" }}
                      onChange={(e) => {
                        setFieldValue("strType", "Factory");
                      }}
                    />
                    Factory
                  </label>
                </div>
              </>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="sbu"
                    options={sbuDDL}
                    value={values?.sbu}
                    label="Select SBU"
                    onChange={(valueOption) => {
                      setFieldValue("sbu", valueOption);
                      getCostCenterDDL(
                        `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&SBUId=${valueOption?.value}`
                      );
                    }}
                    placeholder="SBU"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Select Cost Center"
                    options={costCenterDDL}
                    value={values?.costCenter}
                    name="costCenter"
                    onChange={(valueOption) => {
                      if (valueOption) {
                        setFieldValue("costCenter", valueOption);
                        getCostElementDDL(
                          `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&CostCenterId=${valueOption?.value}`
                        );
                        getProfitCenterDDL(
                          `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${valueOption?.value}&businessUnitId=${selectedBusinessUnit?.value}`
                        );
                      } else {
                        setFieldValue("costElement", "");
                        setFieldValue("profitCenter", "");
                      }
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="costElement"
                    options={costElementDDL}
                    value={values?.costElement}
                    label="Select Cost Element"
                    onChange={(valueOption) => {
                      setFieldValue("costElement", valueOption);
                    }}
                    placeholder="Select Cost Element"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterDDl}
                    value={values?.profitCenter}
                    label="Select Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    placeholder="Select Profit Center"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="debitGeneralLedger"
                    options={debitGeneralLedgerDDL}
                    value={values?.debitGeneralLedger}
                    label="Debit General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("debitGeneralLedger", valueOption);
                      getDebitSubGeneralLedgerDDL(
                        `/fino/FinanceCommonDDL/GetBusinessTransactionDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${valueOption?.value}`,
                        (data) => {
                          const newData = data?.map((item) => ({
                            value: item?.buesinessTransactionId,
                            label: item?.buesinessTransactionName,
                            code: item?.buesinessTransactionCode,
                          }));
                          setDebitSubGeneralLedgerDDL(newData);
                        }
                      );
                    }}
                    placeholder="Debit General Ledger"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="debitSubGeneralLedger"
                    options={debitSubGeneralLedgerDDL}
                    value={values?.debitSubGeneralLedger}
                    label="Debit Sub General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("debitSubGeneralLedger", valueOption);
                    }}
                    placeholder="Debit Sub General Ledger"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="creditGeneralLedger"
                    options={creditGeneralLedgerDDL}
                    value={values?.creditGeneralLedger}
                    label="Credit General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("creditGeneralLedger", valueOption);
                      getCreditSubGeneralLedgerDDL(
                        `/fino/FinanceCommonDDL/GetBusinessTransactionDDL?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${valueOption?.value}`,
                        (data) => {
                          const newData = data?.map((item) => ({
                            value: item?.buesinessTransactionId,
                            label: item?.buesinessTransactionName,
                            code: item?.buesinessTransactionCode,
                          }));
                          setCreditSubGeneralLedgerDDL(newData);
                        }
                      );
                    }}
                    placeholder="Credit General Ledger"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="creditSubGeneralLedger"
                    options={creditSubGeneralLedgerDDL}
                    value={values?.creditSubGeneralLedger}
                    label="Credit Sub General Ledger"
                    onChange={(valueOption) => {
                      setFieldValue("creditSubGeneralLedger", valueOption);
                    }}
                    placeholder="Credit Sub General Ledger"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="salaryComponent"
                    options={salaryComponentDDL}
                    value={values?.salaryComponent}
                    label="Salary Component"
                    onChange={(valueOption) => {
                      setFieldValue("salaryComponent", valueOption);
                    }}
                    placeholder="Salary Component"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    style={{ marginTop: "17px" }}
                    onClick={() => addHandler(values)}
                    disabled={
                      !values?.sbu ||
                      !values?.costCenter ||
                      !values?.costElement ||
                      !values?.profitCenter ||
                      !values?.debitGeneralLedger ||
                      !values?.debitSubGeneralLedger ||
                      !values?.creditGeneralLedger ||
                      !values?.creditSubGeneralLedger ||
                      !values?.salaryComponent ||
                      !values?.strType
                    }
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Cost Center Name</th>
                      <th>Cost Element Name</th>
                      <th>Profit Center Name</th>
                      <th>Salary Component</th>
                      <th>Debit Gl Name</th>
                      <th>Debit Business Transaction Name</th>
                      <th>CreditGlname</th>
                      <th>Credit Business Transaction Name</th>
                      <th>Type</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tableData?.length > 0 &&
                      tableData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "30px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>{item?.strCostCenterName}</td>
                            <td>{item?.strCostElementName}</td>
                            <td>{item?.strProfitCenterName}</td>
                            <td>{item?.strSalaryTableColumnNameForView}</td>
                            <td>{item?.strDebitGlname}</td>
                            <td>{item?.strDebitBusinessTransactionName}</td>
                            <td>{item?.strCreditGlname}</td>
                            <td>{item?.strCreditBusinessTransactionName}</td>
                            <td>{item?.strType}</td>
                            <td
                              style={{ width: "100px" }}
                              className="text-center"
                            >
                              <span
                                className="edit"
                                onClick={() => removeHandler(index)}
                              >
                                <IDelete />
                              </span>
                            </td>
                          </tr>
                        );
                      })}
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
