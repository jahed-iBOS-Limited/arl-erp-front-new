import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import IViewModal from "../../../_helper/_viewModal";
import HealthSummaryModal from "./healthSummaryModal";
const initData = {
  businessUnit: "",
  plant: "",
  shopfloor: "",
  employee: "",
  formDate: "",
};
export default function HealthSummary() {
  const { profileData, selectedBusinessUnit, businessUnitList } = useSelector(
    (state) => {
      return state.authData;
    },
    shallowEqual
  );
  const [plantDDL, getPlantDDL, plantDDLLloader, setPlantDDL] = useAxiosGet();
  const [
    shopfloorDDL,
    getShopfloorDDL,
    shopfloorDDLLoader,
    setShopfloorDDL,
  ] = useAxiosGet();
  // const [singleData, setSingleData] = useState({});
  const [rowData, getRowData, loading] = useAxiosGet();
  const [healthSummaryModal, setHealthSummaryModal] = useState(false);
  const [clickRowData, setClickRowData] = useState({});
  // const [isShowModal, setIsShowModal] = useState(false);

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
          {(loading || plantDDLLloader || shopfloorDDLLoader) && <Loading />}
          <IForm title="Health Summary" isHiddenReset isHiddenBack isHiddenSave>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.fromDate}
                    label="Date"
                    name="fromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("fromDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="businessUnit"
                    options={businessUnitList || []}
                    value={values?.businessUnit}
                    label="Business Unit"
                    onChange={(valueOption) => {
                      setFieldValue("businessUnit", valueOption || "");
                      setFieldValue("plant", "");
                      setFieldValue("shopfloor", "");
                      setFieldValue("employee", "");
                      setPlantDDL([]);
                      setShopfloorDDL([]);
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
                      setFieldValue("shopfloor", "");
                      setShopfloorDDL([]);
                      getShopfloorDDL(
                        `/mes/MesDDL/GetShopfloorDDL?AccountId=${profileData?.accountId}&BusinessUnitid=${values?.businessUnit?.value}&PlantId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopfloor"
                    options={shopfloorDDL || []}
                    value={values?.shopfloor}
                    label="Shopfloor"
                    onChange={(valueOption) => {
                      setFieldValue("shopfloor", valueOption || "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                {/* <div className="col-lg-3">
                  <label>Checked By Enroll</label>
                  <SearchAsyncSelect
                    selectedValue={values?.employee}
                    handleChange={(valueOption) => {
                      setFieldValue("employee", valueOption || "");
                    }}
                    loadOptions={(v) => {
                      if (v?.length < 2) return [];
                      return axios
                        .get(
                          `/asset/DropDown/GetEmployeeByEmpIdDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${values?.businessUnit?.value}&searchTearm=${v}`
                        )
                        .then((res) => {
                          return res?.data?.map((itm) => ({
                            ...itm,
                            value: itm?.value,
                            label: `${itm?.level} [${itm?.employeeCode}]`,
                          }));
                        })
                        .catch((err) => []);
                    }}
                    placeholder="Search by Enroll/ID No/Name (min 3 letter)"
                  />
                  <FormikError
                    name="employee"
                    errors={errors}
                    touched={touched}
                  />
                </div> */}
                <div>
                  <button
                    type="button"
                    disabled={
                      !values?.businessUnit ||
                      !values?.plant ||
                      !values?.fromDate
                    }
                    onClick={() => {
                      getRowData(
                        `/asset/AssetMaintanance/GetMachineHealthSummeryReport?FromDate=${values?.fromDate}&BusinessUnitId=${values?.businessUnit?.value}&PlantId=${values?.plant?.value}&ShopfloorId=${values?.shopfloor?.value}`
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
                      <th rowSpan={2}>Machine Section</th>
                      <th rowSpan={2}>Total Checkpoint</th>
                      <th colSpan={2}>No of Health Check Fill Up</th>
                      <th colSpan={2}>No of Health Check Pending</th>
                      <th colSpan={2}>Health Check %</th>
                      <th colSpan={4}>Machine Health Scenario</th>
                    </tr>
                    <tr>
                      <th>Production </th>
                      <th>Maintenance </th>
                      <th>Production </th>
                      <th>Maintenance </th>
                      <th>Production </th>
                      <th>Maintenance </th>
                      <th>Total Number of Machine </th>
                      <th>
                        Number of Unfit Machine ( Below 80% Health Condition )
                      </th>
                      <th>Unfit Machine %</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.length
                      ? rowData.map((item, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>{item?.strSectionName}</td>
                              <td className="text-center">
                                {item?.totalChcekPoint}
                              </td>
                              <td className="text-center">{item?.pWorking}</td>
                              <td className="text-center">{item?.mWorking}</td>
                              <td className="text-center">
                                {item?.totalChcekPoint - item?.pWorking}
                              </td>
                              <td className="text-center">
                                {item?.totalChcekPoint - item?.mWorking}
                              </td>
                              <td className="text-center">
                                {item?.totalChcekPoint !== 0
                                  ? Math.round(
                                      (item?.pWorking / item?.totalChcekPoint) *
                                        100
                                    )
                                  : 0}
                                %
                              </td>

                              <td className="text-center">
                                {item?.totalChcekPoint !== 0
                                  ? Math.round(
                                      (item?.mWorking / item?.totalChcekPoint) *
                                        100
                                    )
                                  : 0}
                                %
                              </td>

                              <td className="text-center">
                                {item?.totalMachineCount}
                              </td>
                              <td>{}</td>
                              <td>{}</td>
                              <td>
                                <div>
                                  <span
                                    onClick={() => {
                                      setHealthSummaryModal(true);
                                      setClickRowData({
                                        ...values,
                                        ...item,
                                      });
                                    }}
                                  >
                                    <IView />
                                  </span>
                                </div>
                              </td>
                              {/* <td className="text-center">
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
                              </td> */}
                            </tr>
                          );
                        })
                      : null}
                  </tbody>
                </table>
              </div>
            </Form>
          </IForm>
          {healthSummaryModal && (
            <>
              <IViewModal
                show={healthSummaryModal}
                onHide={() => {
                  setClickRowData({});
                  setHealthSummaryModal(false);
                }}
                title={"Health details"}
              >
                <HealthSummaryModal clickRowData={clickRowData} />
              </IViewModal>
            </>
          )}
          {/* <div>
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
          </div> */}
        </>
      )}
    </Formik>
  );
}
