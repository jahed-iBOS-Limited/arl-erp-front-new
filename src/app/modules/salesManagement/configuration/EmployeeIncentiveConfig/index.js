import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { _dateFormatterTwo } from "../../../_helper/_dateFormate";
import IForm from "../../../_helper/_form";
import IView from "../../../_helper/_helperIcons/_view";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import IViewModal from "../../../_helper/_viewModal";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IncentiveModal from "./IncentiveModal";
const initData = {
  salesOrganization: "",
  distributionChannel: "",
  incentiveOn: "",
  effectiveFormDate: "",
  effectiveToDate: "",
};
export default function CommonLanding() {
  const [isShowModal, setisShowModal] = useState(false);
  const [incentiveConfigId, setIncentiveConfigId] = useState("");
  const {
    profileData: { accountId: accId },
    selectedBusinessUnit: { value: buId },
  } = useSelector((state) => state?.authData, shallowEqual);
  // All DDL
  const [salesOrganizationDDL, getSalesOrganizationDDL] = useAxiosGet();
  const [distributionChannelDDL, getDistributionChannelDDL] = useAxiosGet();
  const [rowData, getRowData, loadRowData] = useAxiosGet();
  const saveHandler = (values, cb) => {};
  const history = useHistory();

  useEffect(() => {
    getSalesOrganizationDDL(
      `/oms/SalesOrganization/GetSalesOrganizationByUnitIdDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    getDistributionChannelDDL(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accId, buId]);
  return (
    <Formik
      enableReinitialize={true}
      initialValues={initData}
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
          {loadRowData && <Loading />}
          <IForm
            title="Employee Incentive Configuration"
            isHiddenReset
            isHiddenBack
            isHiddenSave
            renderProps={() => {
              return (
                <div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      history.push(
                        "/sales-management/configuration/EmployeeIncentiveConfig/create"
                      );
                    }}
                  >
                    Create
                  </button>
                </div>
              );
            }}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOrganization"
                    options={
                      [{ label: "All", value: 0 }, ...salesOrganizationDDL] ||
                      []
                    }
                    value={values?.salesOrganization}
                    label="Sales Organization"
                    onChange={(valueOption) => {
                      if (valueOption?.value === 0) {
                        getRowData(
                          `/oms/IncentiveConfig/GetIncentiveLanding?AccountId=${accId}&BusinessUnitId=${buId}&IntSalesOrganizationId=${0}&IntDistributionChannelId=${0}&IntIncentiveOnId=${0}`
                        );
                      }
                      setFieldValue("salesOrganization", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="distributionChannel"
                    options={distributionChannelDDL || []}
                    value={values?.distributionChannel}
                    label="Distribution Channel"
                    onChange={(valueOption) => {
                      setFieldValue("distributionChannel", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="incentiveOn"
                    options={[
                      { label: "Basic", value: 1 },
                      { label: "Fixed Amount", value: 2 },
                    ]}
                    value={values?.incentiveOn}
                    label="IncentiveOn On"
                    onChange={(valueOption) => {
                      setFieldValue("incentiveOn", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.effectiveFormDate}
                    label="Effective Form Date"
                    name="effectiveFormDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("effectiveFormDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-3">
                  <InputField
                    value={values?.effectiveToDate}
                    label="Effective To Date"
                    name="effectiveToDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("effectiveToDate", e.target.value);
                    }}
                  />
                </div>
                <div className="col-lg-2">
                  <button
                    type="button"
                    className="btn btn-primary mt-5"
                    disabled={
                      !values?.salesOrganization ||
                      !values?.distributionChannel ||
                      !values?.incentiveOn ||
                      !values?.effectiveFormDate ||
                      !values?.effectiveToDate
                    }
                    onClick={() => {
                      getRowData(
                        `/oms/IncentiveConfig/GetIncentiveLanding?AccountId=${accId}&BusinessUnitId=${buId}&IntSalesOrganizationId=${values?.salesOrganization?.value}&IntDistributionChannelId=${values?.distributionChannel?.value}&IntIncentiveOnId=${values?.incentiveOn?.value}&fromDate=${values?.effectiveFormDate}&toDate=${values?.effectiveToDate}`
                      );
                    }}
                  >
                    View
                  </button>
                </div>
              </div>
              <div>
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Distribution Channel</th>
                        <th>Effective From</th>
                        <th>Effective To</th>
                        <th>Incentive On</th>
                        <th>Calculation By</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((item, index) => (
                        <tr>
                          <td className="text-center">{index + 1}</td>
                          <td className="text-center">
                            {item?.distributionChannelName}
                          </td>
                          <td className="text-center">
                            {_dateFormatterTwo(item?.fromDate)}
                          </td>
                          <td className="text-center">
                            {_dateFormatterTwo(item?.toDate)}
                          </td>
                          <td className="text-center">
                            {item?.incentiveOnName}
                          </td>
                          <td className="text-center">
                            {item?.calculationByName}
                          </td>
                          <td className="text-center">
                            <span>
                              <IView
                                clickHandler={() => {
                                  setisShowModal(true);
                                  setIncentiveConfigId(item?.incentiveConfigId);
                                }}
                              />
                              {/* <IEdit
                            classes="ml-3"
                            onClick={()=>{
                              history.push(`/sales-management/configuration/EmployeeIncentiveConfig/edit/${item?.incentiveConfigId}`)
                            }}
                            /> */}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Form>
          </IForm>

          <IViewModal
            show={isShowModal}
            onHide={() => {
              setisShowModal(false);
              setIncentiveConfigId("");
            }}
          >
            <IncentiveModal incentiveConfigId={incentiveConfigId} />
          </IViewModal>
        </>
      )}
    </Formik>
  );
}
