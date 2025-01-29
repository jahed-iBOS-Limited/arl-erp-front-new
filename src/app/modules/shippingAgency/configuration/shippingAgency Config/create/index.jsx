import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../../_helper/_form";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import {
  createShippingAgency,
  getVesselDDL,
  getVesselTypeDDL,
  shippingAgencyValidation,
  updateShippingAgency,
} from "../helper";

const initData = {
  vesselType: "",
  vessel: "",
  costCenter: "",
  transferCostCenter: "",
  costElement: "",
  transferBusinessUnit: "",
  profitCenter: "",
  transferProfitCenter: "",
  businessTransaction: "",
  revenueCenter: "",
  revenueElement: "",
};

export default function ShippingAgencyCreateEditForm() {
  const [singleData, setSingleData] = useState({});
  const [objProps, setObjprops] = useState({});
  const [loading, setLoading] = useState(false);
  const [rowData, setRowData] = useState([]);
  const [vesselTypeDDL, setVesselTypeDDL] = useState([]);
  const [vesselDDL, setVesselDDL] = useState([]);
  const [transferCostCenter, getTransferCostCenter] = useAxiosGet();
  const [costCenterDDL, getCostCenterDDL] = useAxiosGet();
  const [costElementDDL, getConstElementDDL] = useAxiosGet();
  const [profitCenterDDL, getProfitCenterDDL] = useAxiosGet();
  const [transferProfitCenterDDL, getTransferProfitCenterDDL] = useAxiosGet();
  const [revenueCenterDDL, getRevenueCenterDDL] = useAxiosGet();
  const [revenueElementDDL, getRevenueElementDDL] = useAxiosGet();
  const [businessTransactionDDL, getBusinessTransactionDDL] = useAxiosGet();
  const { state } = useLocation();
  const { id } = useParams();
  const {
    profileData: { accountId: accId, userId },
    selectedBusinessUnit: { value: buId },
    businessUnitList,
  } = useSelector((state) => state?.authData, shallowEqual);

  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = [...rowData];
      createShippingAgency(payload, setLoading, () => {});
    }
    if (id) {
      const payload = {
        id: state?.id,
        vesselId: values?.vessel?.value || 0,
        vesselName: values?.vessel?.label || "",
        vesselTypeId: values?.vesselType?.value || 0,
        vesselTypeName: values?.vesselType?.label || "",
        profitCenterId: values?.profitCenter?.value || 0,
        revenueCenterId: values?.revenueCenter?.value || 0,
        revenueElementId: values?.revenueElement?.value || 0,
        transferBusinessId: values?.transferBusinessUnit?.value || 0,
        transferProfitCenterId: values?.transferProfitCenter?.value || 0,
        transferCostCenterId: values?.transferCostCenter?.value || 0,
        transferCostCenterName: values?.transferCostCenter?.label || "",
        transferCostElementId: values?.costElement?.value || 0,
        transferCostElementName: values?.costElement?.label || "",
        actionById: userId,
        businessTransactionId: values?.businessTransaction?.value || 0,
        businessTransactionName: values?.businessTransaction?.label,
      };
      updateShippingAgency(payload, setLoading, () => {});
    }
    !id && cb && cb();
    setRowData([]);
  };

  const rowAddHandler = (values) => {
    const isRowAlreadyAdded = rowData.find(
      (item) =>
        item?.vesselId === values?.vessel?.value &&
        item?.vesselTypeId === values?.vesselType?.value &&
        item?.profitCenterId === values?.profitCenter?.value &&
        item?.revenueCenterId === values?.revenueCenter?.value &&
        item?.revenueElementId === values?.revenueElement?.value &&
        item?.transferBusinessId === values?.transferBusinessUnit?.value &&
        item?.transferProfitCenterId === values?.transferProfitCenter?.value &&
        item?.transferCostCenterId === values?.transferCostCenter?.value &&
        item?.transferCostElementId === values?.costElement?.value &&
        item?.businessTransactionId === values?.businessTransaction?.value
    );

    if (isRowAlreadyAdded) {
      toast.warn("Duplicate Data");
    } else {
      const data = {
        businessUnitId: buId,
        vesselId: values?.vessel?.value || 0,
        vesselName: values?.vessel?.label || "",
        vesselTypeId: values?.vesselType?.value || 0,
        vesselTypeName: values?.vesselType?.label || "",
        profitCenterId: values?.profitCenter?.value || 0,
        revenueCenterId: values?.revenueCenter?.value || 0,
        revenueElementId: values?.revenueElement?.value || 0,
        transferBusinessId: values?.transferBusinessUnit?.value || 0,
        transferProfitCenterId: values?.transferProfitCenter?.value || 0,
        costCenterId: values?.costCenter?.value,
        consCenterName: values?.costCenter?.label,
        transferCostCenterId: values?.transferCostCenter?.value || 0,
        transferCostCenterName: values?.transferCostCenter?.label || "",
        transferCostElementId: values?.costElement?.value || 0,
        transferCostElementName: values?.costElement?.label || "",
        actionById: userId,
        businessTransactionId: values?.businessTransaction?.value || 0,
        businessTransactionName: values?.businessTransaction?.label,
      };

      setRowData([...rowData, data]);
    }
  };
  const handleDelete = (index) => {
    const data = [...rowData];
    data.splice(index, 1);
    setRowData(data);
  };
  useEffect(() => {
    getVesselTypeDDL(setVesselTypeDDL, setLoading);
    getBusinessTransactionDDL(
      `/costmgmt/BusinessTransaction/GetBusinessTransactionDDLForExpense?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (buId && accId) {
      getCostCenterDDL(
        `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${buId}&SBUId=0`
      );
      getVesselDDL(buId, accId, setVesselDDL, setLoading);
      getRevenueCenterDDL(
        `/costmgmt/Revenue/GetRevenueCenterDDL?accountId=${accId}&businessUnitId=${buId}`
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [buId, accId]);
  useEffect(() => {
    if (id && state) {
      const modifiedData = {
        vesselType: {
          label: state?.vesselTypeName,
          value: state?.vesselTypeId,
        },
        vessel: { label: state?.vesselName, value: state?.vesselId },
        transferCostCenter: {
          label: state?.transferCostCenterName,
          value: state?.transferCostCenterId,
        },
        costElement: {
          label: state?.transferCostElementName,
          value: state?.transferCostElementId,
        },
        transferBusinessUnit: {
          label: state?.transferBusinessName,
          value: state?.transferBusinessId,
        },
        profitCenter: {
          label: state?.profitCenterName,
          value: state?.profitCenterId,
        },
        transferProfitCenter: {
          label: state?.transferProfitCenterName,
          value: state?.transferProfitCenterId,
        },
        businessTransaction: {
          label: state?.businessTransactionName,
          value: state?.businessTransactionId,
        },
        revenueCenter: {
          label: state?.revenueCenterName,
          value: state?.revenueCenterId,
        },
        revenueElement: {
          label: state?.revenueElementName,
          value: state?.revenueElementId,
        },
      };
      setSingleData(modifiedData);
      getProfitCenterDDL(
        `costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${state?.transferCostCenterId}&businessUnitId=${state?.transferBusinessId}&employeeId=0`
      ); // employee id will be hardcoded 0 ensure by Nasir Bhai
      getConstElementDDL(
        `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accId}&UnitId=${state?.transferBusinessId}&CostCenterId=${state?.transferCostCenterId}`
      );
      getTransferCostCenter(
        `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${state?.transferBusinessId}&SBUId=0`
      );
      getTransferProfitCenterDDL(
        `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${state?.transferCostCenterId}&businessUnitId=${state?.transferBusinessId}&employeeId=0`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, state]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={id ? singleData : initData}
      validationSchema={shippingAgencyValidation}
      onSubmit={(values, { setSubmitting, resetForm }) => {
        if (rowData?.length < 1 && !id) {
          toast.warn("Add minimum one item");
        } else {
          saveHandler(values, () => {
            resetForm(initData);
          });
        }
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
          {loading && <Loading />}
          <IForm
            title={` Shipping Agency ${!id ? "Create" : ""}`}
            getProps={setObjprops}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="vesselType"
                    options={vesselTypeDDL}
                    value={values?.vesselType}
                    label="Vessel Type"
                    onChange={(valueOption) => {
                      setFieldValue("vesselType", valueOption);
                    }}
                    isDisabled={id}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vessel"
                    options={vesselDDL}
                    value={values?.vessel}
                    label="Vessel Name"
                    onChange={(valueOption) => {
                      setFieldValue("vessel", valueOption);
                    }}
                    isDisabled={id}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* {
                  console.log("Error",errors)
                  
                }
                {
                  console.log("touched",touched)
                } */}
                <div className="col-lg-3">
                  <NewSelect
                    name="revenueCenter"
                    options={revenueCenterDDL || []}
                    value={values?.revenueCenter}
                    label="Revenue Center"
                    onChange={(valueOption) => {
                      setFieldValue("revenueElement", "");
                      setFieldValue("revenueCenter", valueOption);
                      if (!valueOption) return;
                      getRevenueElementDDL(
                        `/costmgmt/Revenue/GetRevenueElementDDL?accountId=${accId}&businessUnitId=${buId}&revenueCenterId=0`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="revenueElement"
                    options={revenueElementDDL || []}
                    value={values?.revenueElement}
                    label="Revenue Element"
                    onChange={(valueOption) => {
                      setFieldValue("revenueElement", valueOption);
                    }}
                    isDisabled={!values?.revenueCenter}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="costCenter"
                    options={costCenterDDL || []}
                    value={values?.costCenter}
                    label="Cost Center"
                    placeholder="Cost Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", "");
                      setFieldValue("costCenter", valueOption);
                      if (!valueOption) return;
                      getProfitCenterDDL(
                        `costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${valueOption?.value}&businessUnitId=${buId}&employeeId=0`
                      ); // employee id will be hardcoded 0 ensure by Nasir Bhai
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                {/* {console.log("values",values)} */}
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterDDL || []}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    isDisabled={!values?.costCenter}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="transferBusinessUnit"
                    options={businessUnitList || []}
                    value={values?.transferBusinessUnit}
                    label="Transfer Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("transferCostCenter", "");
                      setFieldValue("transferBusinessUnit", valueOption);
                      if (!valueOption) return;
                      getTransferCostCenter(
                        `/costmgmt/CostCenter/GetCostCenterDDL?AccountId=${accId}&BusinessUnitId=${valueOption?.value}&SBUId=0`
                      );
                    }}
                    placeholder="Transfer Business Unit"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="transferCostCenter"
                    options={transferCostCenter || []}
                    value={values?.transferCostCenter}
                    label="Transfer Cost Center"
                    placeholder="Transfer Cost Center"
                    onChange={(valueOption) => {
                      setFieldValue("transferProfitCenter", "");
                      setFieldValue("costElement", "");
                      setFieldValue("transferCostCenter", valueOption);
                      if (!valueOption) return;
                      getConstElementDDL(
                        `/procurement/PurchaseOrder/GetCostElementByCostCenter?AccountId=${accId}&UnitId=${values?.transferBusinessUnit?.value}&CostCenterId=${valueOption?.value}`
                      );
                      getTransferProfitCenterDDL(
                        `/costmgmt/ProfitCenter/GetProfitcenterDDLByCostCenterId?costCenterId=${valueOption?.value}&businessUnitId=${values?.transferBusinessUnit?.value}&employeeId=0`
                      );
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
                    isDisabled={!values?.transferCostCenter}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <NewSelect
                    name="costElement"
                    options={costElementDDL || []}
                    value={values?.costElement}
                    label="Transfer Cost Element"
                    onChange={(valueOption) => {
                      setFieldValue("costElement", valueOption);
                    }}
                    isDisabled={!values?.transferCostCenter}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="businessTransaction"
                    options={businessTransactionDDL || []}
                    value={values?.businessTransaction}
                    label="Business Transaction"
                    onChange={(valueOption) => {
                      setFieldValue("businessTransaction", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {!id && (
                  <div className="col-lg-3 ">
                    <button
                      type="button"
                      onClick={() => rowAddHandler(values)}
                      className="btn btn-primary mt-5"
                      disabled={
                        !values?.transferBusinessUnit ||
                        !values?.vesselType ||
                        !values?.vessel ||
                        !values?.costCenter ||
                        !values?.profitCenter ||
                        !values?.transferProfitCenter ||
                        !values?.costElement ||
                        !values?.businessTransaction ||
                        !values?.revenueCenter ||
                        !values?.revenueElement
                      }
                    >
                      Add
                    </button>
                  </div>
                )}
              </div>

              {!id && (
                <div className="mt-7">
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm">
                      <thead>
                        <tr className="cursor-pointer">
                          <th>Sl</th>
                          <th>Business Transaction Name</th>
                          <th>Vessel Type</th>
                          <th>Vessel Name</th>
                          <th>Cost Center</th>
                          <th>Cost Element</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, index) => (
                          <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item?.businessTransactionName}</td>
                            <td>{item?.vesselTypeName}</td>
                            <td>{item?.vesselName}</td>
                            <td>{item?.transferCostCenterName}</td>
                            <td>{item?.transferCostElementName}</td>
                            <td className="text-center">
                              <span
                                onClick={() => {
                                  handleDelete(index);
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
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit(resetForm)}
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
