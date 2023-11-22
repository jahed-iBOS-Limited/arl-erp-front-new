import { Field, Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import IForm from "../../../_helper/_form";
import NewSelect from "../../../_helper/_select";
import InputField from "../../../_helper/_inputField";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import { _todayDate } from "../../../_helper/_todayDate";
import { _monthFirstDate } from "../../../_helper/_monthFirstDate";
import { imarineBaseUrl } from "../../../../App";

const initData = {
  categoryType: "",
  vessel: "",
  particularsType: "",
  baseType: "",
  insuranceType: "",
  supplier: "",
  rate: "",
  fromDate: _monthFirstDate(),
  toDate: _todayDate(),
  profitCenter: "",
  costCenter: "",
  costElement: "",
  isTransfer: false,
  transferBusinessUnit: "",
  transferProfitCenter: "",
  transferRevenueCenter: "",
  transferRevenueElement: "",
  narration: "",
};

export default function BareboatAndInsuranceCreateEdit() {

  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);


  const [objProps, setObjprops] = useState({});
  const [vesselDDL, getVesselDDL, vesselDDLLoader] = useAxiosGet()
  const [profitCenterDDL, getProfitCenterDDL, profitCenterDDLloader, setProfitCenterDDL] = useAxiosGet()
  const [costCenterDDL, getCostCenterDDL, costCenterDDLloader] = useAxiosGet()
  const [costElementDDL, getCostElementDDL, costElementDDLloader] = useAxiosGet()
  const [transferBusinessUnitDDL, getTransferBusinessUnitDDL, transferBusinessUnitDDLloader] = useAxiosGet()
  const [transferProfitCenterDDL, getTransferProfitCenterDDL, transferProfitCenterDDLloader] = useAxiosGet()
  const [transferRevenueCenterDDL, getTransferRevenueCenterDDL, transferRevenueCenterDDLloader] = useAxiosGet();
  const [transferRevenueElementDDL, getTransferRevenueElementDDL, transferRevenueElementDDLloader] = useAxiosGet();
  const [baseTypeDDL, getBaseTypeDDL, baseTypeDDlloader] = useAxiosGet();
  const [supplierDDL, getSupplierDDL, supplierDDLloader, setSupplierDDL] = useAxiosGet()
  const { id } = useParams()

  const [tableData, setTableData] = useState([])

  // eslint-disable-next-line no-unused-vars
  const [, saveData, saveDataLoader] = useAxiosPost();
  useEffect(() => {
    getVesselDDL(`${imarineBaseUrl}/domain/Voyage/GetVesselDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}`)
    getProfitCenterDDL(`/fino/CostSheet/ProfitCenterDetails?UnitId=${selectedBusinessUnit?.value}`, (data) => {
      const newData = data?.map((itm) => {
        itm.value = itm?.profitCenterId;
        itm.label = itm?.profitCenterName;
        return itm;
      });
      setProfitCenterDDL(newData);
    })
    getCostCenterDDL(`/procurement/PurchaseOrder/GetCostCenter?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}`)
    // getTransferBusinessUnitDDL(`/procurement/PurchaseOrder/TransferPoBusinessUnit?UnitId=${selectedBusinessUnit?.value}`);
    getTransferBusinessUnitDDL(`/procurement/PurchaseOrder/TransferPoBusinessUnit_reverse?UnitId=${selectedBusinessUnit?.value}`);
    getBaseTypeDDL(`/fino/BareBoatManagement/GetBaseTypeDDL`);
    getSupplierDDL(`/procurement/PurchaseOrder/GetSupplierListDDL?AccountId=${profileData?.accountId}&UnitId=${selectedBusinessUnit?.value}&SBUId=0`, (data) => {
      const newData = data?.filter((itm) => itm?.value === 41845 || itm?.value === 69484 || itm?.value === 41811);
      setSupplierDDL(newData);
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {
    console.log("values", values);
    // saveData()
  };

  const addRowHandler = (values) => {
    const obj = {
      vessel: values?.vessel || "",
      particularsType: values?.particularsType || "",
      baseType: values?.baseType || "",
      insuranceType: values?.insuranceType || "",
      supplier: values?.supplier || "",
      rate: values?.rate || "",
      fromDate: values?.fromDate || "",
      toDate: values?.toDate || "",
      profitCenter: values?.profitCenter || "",
      costCenter: values?.costCenter || "",
      costElement: values?.costElement || "",
      isTransfer: values?.isTransfer || "",
      transferBusinessUnit: values?.transferBusinessUnit || "",
      transferProfitCenter: values?.transferProfitCenter || "",
      transferRevenueCenter: values?.transferRevenueCenter || "",
      transferRevenueElement: values?.transferRevenueElement || "",
      narration: values?.narration || "",
    }
    setTableData([...tableData, obj])
    console.log("tableData", tableData);
  };
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
          {(saveDataLoader ||
            vesselDDLLoader ||
            profitCenterDDLloader ||
            costCenterDDLloader ||
            costElementDDLloader ||
            transferBusinessUnitDDLloader ||
            transferProfitCenterDDLloader ||
            transferRevenueCenterDDLloader ||
            transferRevenueElementDDLloader ||
            baseTypeDDlloader ||
            supplierDDLloader
          ) && <Loading />}
          <IForm title={
            id ? "Edit Bareboat And Insurance" : "Create Bareboat And Insurance"
          } getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="categoryType"
                    options={[
                      { value: 1, label: 'Bareboat Management' },
                      { value: 2, label: 'Insurance' },
                    ]}
                    value={values?.categoryType}
                    label="Category Type"
                    onChange={(valueOption) => {
                      setFieldValue("categoryType", valueOption);
                      setFieldValue("isTransfer", valueOption?.value === 1 ? true : false);
                      setTableData([]);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={tableData?.length > 0}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselDDL || []}
                    value={values?.vessel}
                    label="Vessel"
                    onChange={(valueOption) => {
                      setFieldValue("vessel", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.categoryType}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="particularsType"
                    options={[
                      { value: 1, label: 'BARE BOAT' },
                      { value: 2, label: 'MANAGEMENT' },
                    ]}
                    value={values?.particularsType}
                    label="Particulars Type"
                    onChange={(valueOption) => {
                      setFieldValue("particularsType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {
                  values?.categoryType?.value === 2 ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="insuranceType"
                          options={[
                            {
                              value: 1,
                              label: 'H&M Insurance Policy',
                            },
                            { value: 2, label: 'P&I Coverage' },
                          ]}
                          value={values?.insuranceType}
                          label="Insurance Type"
                          onChange={(valueOption) => {
                            setFieldValue("insuranceType", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="supplier"
                          options={
                            supplierDDL || []
                          }
                          value={values?.supplier}
                          label="Supplier"
                          onChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>

                    </>
                  ) : null
                }
                <div className="col-lg-3">
                  <NewSelect
                    name="baseType"
                    options={baseTypeDDL || []}
                    value={values?.baseType}
                    label="Base Type"
                    onChange={(valueOption) => {
                      setFieldValue("baseType", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Rate</label>
                  <InputField
                    value={values?.rate}
                    name="rate"
                    placeholder="Rate"
                    type="text"
                    onChange={(e) => {
                      setFieldValue("rate", e?.target?.value);
                    }}
                    disabled={true}
                  />
                </div>
                <div className="col-lg-3">
                  <label>From Date</label>
                  <InputField
                    value={values?.fromDate}
                    name="fromDate"
                    placeholder="From Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <label>To Date</label>
                  <InputField
                    value={values?.toDate}
                    name="toDate"
                    placeholder="To Date"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e?.target?.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Profit Center"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="Cost Center"
                    options={costCenterDDL || []}
                    value={values?.costCenter}
                    label="Cost Center"
                    onChange={(valueOption) => {
                      setFieldValue("costCenter", valueOption);
                      getCostElementDDL(`/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${profileData?.accountId
                        }&UnitId=${selectedBusinessUnit?.value}&CostCenterId=${valueOption?.value}`)
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="costElement"
                    options={costElementDDL || []}
                    value={values?.costElement}
                    label="Cost Element"
                    onChange={(valueOption) => {
                      setFieldValue("costElement", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={!values?.costCenter}
                  />
                </div>

                {values?.categoryType?.value === 1 ? (<div className="col-lg-3">
                  <div
                    style={{ marginTop: "23px" }}
                    className="d-flex align-items-center"
                  >
                    <span className="mr-2">Is Transfer</span>
                    <Field
                      type="checkbox"
                      name="isTransfer"
                      checked={values?.isTransfer}
                      onChange={(e) => {
                        setFieldValue("isTransfer", e.target.checked);
                      }}
                      disabled={values?.categoryType?.value === 1}
                    />
                  </div>
                </div>) : null}
                {
                  values?.isTransfer ? (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="transferBusinessUnit"
                          options={transferBusinessUnitDDL || []}
                          value={values?.transferBusinessUnit}
                          label="Transfer Business Unit"
                          onChange={(valueOption) => {
                            setFieldValue("transferBusinessUnit", valueOption);
                            getTransferProfitCenterDDL(`/fino/CostSheet/ProfitCenterDetails?UnitId=${valueOption?.value}`)
                            getTransferRevenueCenterDDL(`/fino/AccountingConfig/GetRevenueCenterList?businessUnitId=${valueOption?.value}`)
                            getTransferRevenueElementDDL(`/fino/AccountingConfig/GetRevenueElementList?businessUnitId=${valueOption?.value}`)
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="transferProfitCenter"
                          options={transferProfitCenterDDL || []}
                          value={values?.transferProfitCenter}
                          label="Transfer Profit Center"
                          onChange={(valueOption) => {
                            setFieldValue("transferProfitCenter", valueOption);

                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="transferRevenueCenter"
                          options={transferRevenueCenterDDL || []}
                          value={values?.transferRevenueCenter}
                          label="Transfer Revenue Center"
                          onChange={(valueOption) => {
                            setFieldValue("transferRevenueCenter", valueOption);

                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="transferRevenueElement"
                          options={transferRevenueElementDDL || []}
                          value={values?.transferRevenueElement}
                          label="Transfer Revenue Element"
                          onChange={(valueOption) => {
                            setFieldValue("transferRevenueElement", valueOption);
                          }}
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <label>Narration</label>
                        <InputField
                          value={values?.narration}
                          name="narration"
                          placeholder="narration"
                          type="text"
                          onChange={(e) => {
                            setFieldValue("narration", e?.target?.value);
                          }}
                        />
                      </div>

                    </>
                  ) : null
                }
                <div className="col-lg-3">
                  <button
                    style={{ marginTop: "20px" }}
                    onClick={() => {
                      addRowHandler(values)
                    }}
                    className="btn btn-primary"
                    type="button"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="table-responsive mt-2">
                <table className="table table-striped table-bordered global-table mt-0">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Vassel Name</th>
                      <th>Particulars Type</th>
                      <th>Base Type</th>
                      <th>Rate</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Profit Center</th>
                      <th>Cost Center</th>
                      <th>Cost Element</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      tableData?.length > 0 && tableData?.map((item, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{item?.vessel?.label}</td>
                          <td>{item?.particularsType?.label}</td>
                          <td>{item?.baseType?.label}</td>
                          <td>{item?.rate}</td>
                          <td>{item?.fromDate}</td>
                          <td>{item?.toDate}</td>
                          <td>{item?.profitCenter?.label}</td>
                          <td>{item?.costCenter?.label}</td>
                          <td>{item?.costElement?.label}</td>
                        </tr>
                      ))
                    }
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