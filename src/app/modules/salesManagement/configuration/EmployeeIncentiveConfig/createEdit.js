import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import IDelete from "../../../_helper/_helperIcons/_delete";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import AttachmentUploaderNew from "../../../_helper/attachmentUploaderNew";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import { employeeIncentiveValidationSchema } from "./helper";
const initData = {
  salesOrganization: "",
  distributionChannel: "",
  incentiveOn: "",
  calculation: "",
  effectiveFromDate: "",
  effectiveToDate: "",
  basedOn: "",
  fromSlab: "",
  toSlab: "",
  incentive: "",
};

export default function KeyRegisterLanding() {
  const { id } = useParams();
  const [objProps, setObjprops] = useState({});
  const [attachmentList, setAttachmentList] = useState([]);
  const [rowDto, setRowDto] = useState([]);

  const {
    profileData: {
      accountId: accId,
      userId: actionById,
      userName: actionByName,
    },
    selectedBusinessUnit: { value: buId, label: buName },
  } = useSelector((state) => state?.authData, shallowEqual);

  // All DDL
  const [salesOrganizationDDL, getSalesOrganizationDDL] = useAxiosGet();
  const [distributionChannelDDL, getDistributionChannelDDL] = useAxiosGet();
  const [, saveIncentive, loadIncentive] = useAxiosPost();

  //prepare initData based on BusinessUnitId
  const parsedInitData =
    buId === 144 ? { initData, incentiveOn: 0, calculation: 0 } : initData;

  const saveHandler = (values, cb) => {
    if (!id) {
      const payload = {
        header: {
          incentiveConfigId: 0,
          accountId: accId,
          businessUnitId: buId,
          businessUnitName: buName,
          incentiveTypeId: 1, //hard coded entry order by hussain vai
          incentiveTypename: "Sales", //hard coded entry order by hussain vai
          salesOrganizationId: values?.salesOrganization?.value,
          salesOrganizationName: values?.salesOrganization?.label,
          distributionChannelId: values?.distributionChannel?.value,
          distributionChannelName: values?.distributionChannel?.label,
          incentiveOnId: values?.incentiveOn?.value,
          incentiveOnName: values?.incentiveOn?.label,
          calculationById: values?.calculation?.value,
          calculationByName: values?.calculation?.label,
          attachment: attachmentList[0]?.id || "",
          fromDate: values?.effectiveFromDate,
          toDate: values?.effectiveToDate,
          actionById: actionById,
          actionByName: actionByName,
        },
        row: rowDto,
      };
      saveIncentive(
        `/oms/IncentiveConfig/CreateIncentiveConfig`,
        payload,
        () => {
          setRowDto([]);
        },
        true
      );
    }
  };

  const handleAddRowDto = (values, setFieldValue) => {
    const findData = rowDto?.find(
      (item) =>
        item?.strbasedOnName === values?.basedOn?.label &&
        item?.fromSlabNum === +values?.fromSlab &&
        item?.toSlabNum === +values?.toSlab &&
        item?.incentiveNum === +values?.incentive
    );

    if (findData) {
      return toast.warn("Duplicate Data");
    } else {
      const item = {
        incentiveConfigRowId: 0,
        incentiveConfigHeaderId: 0,
        basedOn: values?.basedOn?.label,
        fromSlab: +values?.fromSlab,
        toSlab: +values?.toSlab,
        incentivePercentage: +values?.incentive,
        calculation: values?.calculation?.label,
      };
      setRowDto([...rowDto, item]);
      setFieldValue("basedOn", "");
      setFieldValue("fromSlab", "");
      setFieldValue("toSlab", "");
      setFieldValue("incentive", "");
    }
  };

  const handleRowDelete = (index) => {
    const newDato = [...rowDto];
    newDato.splice(index, 1);
    setRowDto(newDato);
  };

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
      initialValues={parsedInitData}
      validationSchema={employeeIncentiveValidationSchema}
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
          {loadIncentive && <Loading />}
          <IForm title="Create Employee Incentive" getProps={setObjprops}>
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="salesOrganization"
                    options={salesOrganizationDDL || []}
                    value={values?.salesOrganization}
                    label="Sales Organization"
                    onChange={(valueOption) => {
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
                {buId !== 144 && ( //this section will not visible for Akij Essensial businessUnitId = 144
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="incentiveOn"
                        options={[
                          { label: "Basic", value: 1 },
                          { label: "Fixed Amount", value: 2 },
                        ]}
                        value={values?.incentiveOn}
                        label="Incentive On"
                        onChange={(valueOption) => {
                          if (valueOption) {
                            setFieldValue("incentiveOn", valueOption);
                            if (valueOption?.value === 1) {
                              setFieldValue("calculation", {
                                label: "Percentage",
                                value: 1,
                              });
                            }
                            if (valueOption?.value === 2) {
                              setFieldValue("calculation", {
                                label: "Amount",
                                value: 2,
                              });
                            }
                          } else {
                            setFieldValue("incentiveOn", "");
                            setFieldValue("calculation", "");
                          }
                        }}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="calculation"
                        options={[
                          { label: "Percentage", value: 1 },
                          { label: "Amount", value: 2 },
                        ]}
                        value={values?.calculation}
                        label="Calculate By"
                        onChange={(valueOption) => {
                          setFieldValue("calculation", valueOption);
                        }}
                        isDisabled={true}
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                  </>
                )}
                <div className="col-lg-3">
                  <InputField
                    value={values?.effectiveFromDate}
                    label="Effective Form Date"
                    name="effectiveFromDate"
                    type="date"
                    onChange={(e) => {
                      setFieldValue("effectiveFromDate", e.target.value);
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
                <div className="col-lg-2 mt-5">
                  <AttachmentUploaderNew
                    CBAttachmentRes={(attachmentData) => {
                      if (Array.isArray(attachmentData)) {
                        setAttachmentList(attachmentData);
                      }
                    }}
                  />
                </div>
              </div>

              {buId !== 144 && ( //this section will not visible for Akij Essensial businessUnitId = 144
                <div className="form-group  global-form row">
                  <div className="col-lg-2">
                    <NewSelect
                      name="basedOn"
                      options={[{ label: "Achievement", value: 1 }]}
                      value={values?.basedOn}
                      label="Based On"
                      onChange={(valueOption) => {
                        setFieldValue("basedOn", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="fromSlab"
                      value={values?.fromSlab}
                      type="number"
                      label="From Slab"
                      onChange={(e) => {
                        if (+e.target.value < 0) {
                          setFieldValue("fromSlab", "");
                        } else {
                          setFieldValue("fromSlab", e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="toSlab"
                      value={values?.toSlab}
                      type="number"
                      label="To Slab"
                      onChange={(e) => {
                        if (+e.target.value < 0) {
                          setFieldValue("toSlab", "");
                        } else {
                          setFieldValue("toSlab", e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="incentive"
                      value={values?.incentive}
                      type="number"
                      label={`Incentive(${
                        values?.calculation?.value === 1
                          ? "%"
                          : values?.calculation?.value === 2
                          ? "Amount"
                          : ""
                      })`}
                      pattern="^\d+$"
                      onChange={(e) => {
                        if (+e.target.value < 0) {
                          setFieldValue("incentive", "");
                        } else {
                          setFieldValue("incentive", e.target.value);
                        }
                      }}
                    />
                  </div>
                  <div className="col-lg-2">
                    <button
                      type="button"
                      className="btn btn-primary mt-5"
                      disabled={
                        !values?.basedOn ||
                        !values?.fromSlab ||
                        !values?.toSlab ||
                        !values?.incentive
                      }
                      onClick={() => {
                        handleAddRowDto(values, setFieldValue);
                      }}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <div className="">
                <div className="table-responsive">
                  <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Based On</th>
                        <th>From Slab</th>
                        <th>To Slab</th>
                        <th>Incentive</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowDto?.length > 0 &&
                        rowDto?.map((item, index) => (
                          <tr key={index}>
                            <td className="text-center">{index + 1}</td>
                            <td className="text-center">{item?.basedOn}</td>
                            <td className="text-center">{item?.fromSlab}</td>
                            <td className="text-center">{item?.toSlab}</td>
                            <td className="text-center">
                              {item?.incentivePercentage}
                              {item?.calculation === "Percentage" ? "%" : ""}
                            </td>
                            <td className="text-center">
                              <span
                                onClick={() => {
                                  handleRowDelete(index);
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
              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => {
                  if (loadIncentive?.length > 0) {
                    handleSubmit();
                  } else {
                    toast.warn("Add Minimum One Data");
                  }
                }}
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
