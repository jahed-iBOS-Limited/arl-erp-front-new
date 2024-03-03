import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../_helper/_viewModal";
import { DamageViewModal } from "./viewModal";
const initData = {
  businessUnit: "",
  plant: "",
  formDate: "",
  toDate: "",
};
export default function HealthCheckCondition() {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );
  const [plantDDL, getPlantDDL, plantDDLloader, setPlantDDL] = useAxiosGet();
  const [singleData, setSingleData] = useState({});
  const [rowData, getRowData, loading] = useAxiosGet();
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const saveHandler = (values, cb) => {};
  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        ...initData,
        businessUnit: {
          value: selectedBusinessUnit?.value,
          label: selectedBusinessUnit?.label,
        },
      }}
      // validationSchema={{}}
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
          {(loading || plantDDLloader) && <Loading />}
          <IForm
            title="Health Check Condition"
            isHiddenReset
            isHiddenBack
            isHiddenSave
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                      setFieldValue("plant", "");
                      setPlantDDL([]);
                      getPlantDDL(
                        `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData?.userId}&AccId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}&OrgUnitTypeId=7`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="From Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.toDate}
                    label="To Date"
                    name="toDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("toDate", e.target.value);
                    }}
                  />
                </div>
                <div>
                  <button
                    type="button"
                    disabled={
                      !values?.businessUnit ||
                      !values?.plant ||
                      !values?.fromDate ||
                      !values?.toDate
                    }
                    onClick={() => {
                      getRowData(
                        `/asset/AssetMaintanance/GetMachineHealthConditionReport?BusinessUnitId=${values
                          ?.businessUnit?.value || 0}&PlantId=${values?.plant
                          ?.value || 0}&FromDate=${values?.fromDate}&ToDate=${
                          values?.toDate
                        }`
                      );
                    }}
                    className="btn btn-primary mt-5 ml-4"
                  >
                    View
                  </button>
                </div>
              </div>
              <div className="table-responsive mt-5">
                <table className="table table-striped table-bordered global-table mt-0">
                  <thead>
                    <tr>
                      <th rowSpan={2}>SL</th>
                      <th rowSpan={2}>Plant Name</th>
                      <th rowSpan={2}>Shopfloor</th>
                      <th rowSpan={2}>Machine</th>
                      <th colSpan={2}>Production </th>
                      <th colSpan={2}>Maintenance </th>
                    </tr>
                    <tr>
                      <th>Working </th>
                      <th>Damage </th>
                      <th>Working </th>
                      <th>Damage </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.length
                      ? rowData.map((item, index) => {
                          return (
                            <tr key={index}>
                               <td>
                                {index + 1}
                              </td>
                              <td className="text-left">
                                {item?.strPlantname}
                              </td>
                              <td>{item?.strShopfloorName}</td>
                              <td>{item?.strMachineName}</td>
                              <td className="text-center">{item?.pWorking}</td>
                              <td className="text-center">
                                <span
                                  onClick={() => {
                                    setIsShowModal(true);
                                    setSingleData({
                                      ...item,
                                      SectionName: "Production",
                                    });
                                  }}
                                  className="text-primary pointer border-bottom border-primary"
                                >
                                  {item?.pDamage}
                                </span>
                              </td>
                              <td className="text-center">{item?.mWorking}</td>
                              <td className="text-center">
                                <span
                                  onClick={() => {
                                    setIsShowModal(true);
                                    setSingleData({
                                      ...item,
                                      SectionName: "Maintenance",
                                    });
                                  }}
                                  className="text-primary pointer border-bottom border-primary"
                                >
                                  {item?.mDamage}
                                </span>
                              </td>
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
          <div>
            <IViewModal
              title="Damage"
              show={isShowModal}
              onHide={() => {
                setIsShowModal(false);
                setSingleData({});
              }}
            >
              <DamageViewModal values={values} singleData={singleData} />
            </IViewModal>
          </div>
        </>
      )}
    </Formik>
  );
}
