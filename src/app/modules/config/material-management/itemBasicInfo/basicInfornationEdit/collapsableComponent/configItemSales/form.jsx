import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { Input } from "../../../../../../../../_metronic/_partials/controls";
import Axios from "axios";
import Select from "react-select";
import customStyles from "../../../../../../selectCustomStyle";
import NewSelect from "./../../../../../../_helper/_select";

const DataValiadtionSchema = Yup.object().shape({
  minOrderQuantity: Yup.number()
    .integer()
    .min(1)
    .required("Minimum order quantity is required")
    .integer()
    .min(1, "Minimum order quantity is required"),
  lotSize: Yup.number()
    .integer()
    .min(1)
    .required("Lot Size is required")
    .integer()
    .min(1, "Lot Size is required"),
  org: Yup.object().shape({
    label: Yup.string().required("Sales Organization is required"),
    value: Yup.string().required("Sales Organization is required"),
  }),
  profitCenter: Yup.object().shape({
    label: Yup.string().required("Profit Center is required"),
    value: Yup.string().required("Profit Center is required"),
  }),
  revenueGL: Yup.object().shape({
    label: Yup.string().required("Revenue GL is required"),
    value: Yup.string().required("Revenue GL is required"),
  }),
  productDivision: Yup.object().shape({
    label: Yup.string().required("Product Division is required"),
    value: Yup.string().required("Product Division is required"),
  }),
  cogsGL: Yup.object().shape({
    label: Yup.string().required("COGS GL is required"),
    value: Yup.string().required("COGS GL is required"),
  }),
  accroedCogsGL: Yup.object().shape({
    label: Yup.string().required("Accroed COGS GL is required"),
    value: Yup.string().required("Accroed COGS GL is required"),
  }),
  distributionChannel: Yup.array().required("Distribution Channel"),
});
const initValue = {
  org: { label: "", value: "" },
  profitCenter: "",
  productDivision: { label: "", value: "" },
  cogsGL: { label: "", value: "" },
  distributionChannel: "",
  accroedCogsGL: { label: "", value: "" },
  revenueGL: { label: "", value: "" },
  salesDescription: "",
  minOrderQuantity: 0,
  volume: "",
  isMrp: false,
  hsCode: "",
  lotSize: 0,
  vatItem: "",
  conversionRatePcs: "",
};

export default function _Form({
  initData,
  saveBtnRef,
  saveData,
  resetBtnRef,
  disableHandler,
  selectedBusinessUnit,
  accountId,
  basicItemInfo,
}) {
  const [orgListDDL, setOrgList] = useState("");
  const [profitCenterDDL, setProfitCenter] = useState("");
  const [productDivisionDDL, setproductDivision] = useState("");
  const [cogsGLDDL, setCogsGL] = useState("");
  // const [accroedCogsGLDDL, setAccroedCogsGL] = useState("");
  const [revenueGLDDL, setRevenueGL] = useState("");
  const [distributionChannelDDL, setdistributionChannel] = useState("");
  const [taxItemGroupDDL, setTaxItemGroupDDL] = useState([]);

  const getInfoData = async (buId, accId) => {
    try {
      const res = await Axios.get(
        `/oms/BusinessUnitSalesOrganization/GetPartnerGroupFromSalesOrgDDL?AccountId=${accId}&BUnitId=${buId}`
      );
      const { data: resData, status } = res;
      if (status === 200 && resData.length) {
        let orgs = [];
        resData.forEach((item) => {
          let items = {
            value: item.value,
            label: item.label,
          };
          orgs.push(items);
        });
        setOrgList(orgs);
        orgs = null;
      }
    } catch (error) {
      console.log(error);
    }
  };
  const getprofitCenter = async (buId, accId) => {
    const res = await Axios.get(
      `/costmgmt/ProfitCenter/GetProfitCenterInformation?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    if (res.status === 200 && res?.data) {
      const data = res?.data;

      const newData = data.map((item) => {
        return {
          value: item.profitCenterId,
          label: item.profitCenterName,
        };
      });
      setProfitCenter(newData);
    }
  };
  const getProductivision = async (buId, accId) => {
    const res = await Axios.get(
      `/oms/ProductDivision/GetProductDivisionDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    );
    const { status, data } = res;
    if (status === 200 && data.length) {
      let obj = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item.value,
            label: item.label,
          };
          obj.push(items);
        });
      setproductDivision(obj);
    }
  };
  const getCogsGL = async (buId, accId) => {
    // const res = await Axios.get(
    //   `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accId}&BusinessUnitId=${buId}`
    // );
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=${14}`
    );
    const { status, data } = res;
    if (status === 200 && data.length) {
      let obj = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.generalLedgerId,
            label: item?.generalLedgerName,
          };
          obj.push(items);
        });
      setCogsGL(obj);
    }
  };

  const getRevenueGL = async (buId, accId) => {
    const res = await Axios.get(
      `/domain/BusinessUnitGeneralLedger/GetGeneralLedgerDDL?AccountId=${accountId}&BusinessUnitId=${buId}&AccountGroupId=${9}`
    );
    const { status, data } = res;
    if (status === 200 && data.length) {
      let obj = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item?.generalLedgerId,
            label: item?.generalLedgerName,
          };
          obj.push(items);
        });
      setRevenueGL(obj);
    }
  };

  const getDistributionChannel = async (buId, accId) => {
    const res = await Axios.get(
      `/oms/DistributionChannel/GetDistributionChannelDDL?AccountId=${accId}&BUnitId=${buId}`
    );
    const { status, data } = res;
    if (status === 200 && data.length) {
      let obj = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item.value,
            label: item.label,
          };
          obj.push(items);
        });
      setdistributionChannel(obj);
    }
  };

  const getTaxItemGroupDDL_api = async (accId, buId) => {
    const res = await Axios.get(
      `/vat/TaxItemGroup/GetTaxItemGroupDDL?accountId=${accId}&businessUnitId=${buId}`
    );
    const { status, data } = res;
    if (status === 200 && data.length) {
      let obj = [];
      data &&
        data.forEach((item) => {
          let items = {
            value: item.value,
            label: `${item.label} [HS: ${item?.code}]`,
          };
          obj.push(items);
        });
      setTaxItemGroupDDL(obj);
    }
  };

  useEffect(() => {
    if (selectedBusinessUnit && accountId) {
      getInfoData(selectedBusinessUnit.value, accountId);
      getprofitCenter(selectedBusinessUnit.value, accountId);
      getProductivision(selectedBusinessUnit.value, accountId);
      getCogsGL(selectedBusinessUnit.value, accountId);
      // getAccroedCogsGL(selectedBusinessUnit.value, accountId);
      getRevenueGL(selectedBusinessUnit.value, accountId);
      getDistributionChannel(selectedBusinessUnit.value, accountId);
      getTaxItemGroupDDL_api(accountId, selectedBusinessUnit.value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, accountId]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          salesDescription: basicItemInfo
            ? basicItemInfo[0]?.itemName
            : initData?.salesDescription,
        }}
        validationSchema={DataValiadtionSchema}
        onSubmit={(values, { resetForm }) => {
          saveData(values, () => {
            resetForm(initData || initValue);
          });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          handleChange,
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row  global-form">
                <div className="col-lg-3">
                  <label>Select Sales Organization</label>
                  <Field
                    name="org"
                    component={() => (
                      <Select
                        options={orgListDDL || []}
                        placeholder="Select Sales Organization"
                        value={values.org || { value: "", label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("org", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="org"
                        isDisabled={!orgListDDL}
                      />
                    )}
                    placeholder="Select Plant"
                    label="Select Plant"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.org && touched && touched.org
                      ? errors.org.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Profit Center</label>
                  <Field
                    name="profitCenter"
                    component={() => (
                      <Select
                        options={profitCenterDDL || []}
                        placeholder="Select Profit Center"
                        value={values.profitCenter || { value: "", label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("profitCenter", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="profitCenter"
                        isDisabled={!profitCenterDDL}
                      />
                    )}
                    placeholder="Select Plant"
                    label="Select Plant"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.profitCenter &&
                    touched &&
                    touched.profitCenter
                      ? errors.profitCenter.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Product Division</label>
                  <Field
                    name="productDivision"
                    component={() => (
                      <Select
                        options={productDivisionDDL || []}
                        placeholder="Select Product Division"
                        value={
                          values.productDivision || { value: "", label: "" }
                        }
                        onChange={(valueOption) => {
                          setFieldValue("productDivision", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="productDivision"
                        isDisabled={!productDivisionDDL}
                      />
                    )}
                    placeholder="Select Product Division"
                    label="Select Product Division"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.productDivision &&
                    touched &&
                    touched.productDivision
                      ? errors.productDivision.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select COGS GL</label>
                  <Field
                    name="cogsGL"
                    component={() => (
                      <Select
                        options={cogsGLDDL || []}
                        placeholder="Select COGS GL"
                        value={values.cogsGL || { value: "", label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("cogsGL", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="cogsGL"
                        isDisabled={!cogsGLDDL}
                      />
                    )}
                    placeholder="Select Cogs GL"
                    label="Select Cogs GL"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.cogsGL && touched && touched.cogsGL
                      ? errors.cogsGL.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Accroed COGS GL</label>
                  <Field
                    name="accroedCogsGL"
                    component={() => (
                      <Select
                        options={cogsGLDDL || []}
                        placeholder="Select Accroed COGS GL"
                        value={values.accroedCogsGL || { value: "", label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("accroedCogsGL", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="accroedCogsGL"
                        isDisabled={!cogsGLDDL}
                      />
                    )}
                    placeholder="Select Accroed Cogs GL"
                    label="Select Accroed Cogs GL"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.accroedCogsGL &&
                    touched &&
                    touched.accroedCogsGL
                      ? errors.accroedCogsGL.value
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <label>Select Revenue GL</label>
                  <Field
                    name="revenueGL"
                    component={() => (
                      <Select
                        options={revenueGLDDL || []}
                        placeholder="Select Revenue GL"
                        value={values.revenueGL || { value: "", label: "" }}
                        onChange={(valueOption) => {
                          setFieldValue("revenueGL", valueOption);
                        }}
                        // isSearchable={true}

                        styles={customStyles}
                        name="revenueGL"
                        // isDisabled={!revenueGLDDL}
                      />
                    )}
                    placeholder="Select Revenue GL"
                    label="Select Revenue GL"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors && errors.revenueGL && touched && touched.revenueGL
                      ? errors.revenueGL.value
                      : ""}
                  </p>
                </div>

                <div className="col-lg-3">
                  <Field
                    value={values.lotSize || ""}
                    name="lotSize"
                    component={Input}
                    placeholder="lot Size"
                    label="Lot Size"
                    disabled={!orgListDDL}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.minOrderQuantity || ""}
                    name="minOrderQuantity"
                    component={Input}
                    placeholder="Minimum Order Qty."
                    label="Minimum Order Qty."
                    disabled={!orgListDDL}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.salesDescription || ""}
                    name="salesDescription"
                    component={Input}
                    placeholder="Sales Description (Optional)"
                    label="Sales Description (Optional)"
                    disabled={!orgListDDL}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.volume || ""}
                    name="volume"
                    component={Input}
                    placeholder="Volume(CFT)"
                    label="Volume(CFT)"
                    disabled={!orgListDDL}
                    type="number"
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="vatItem"
                    options={taxItemGroupDDL || []}
                    value={values?.vatItem}
                    label="VAT Item (optional)"
                    onChange={(valueOption) => {
                      setFieldValue("vatItem", valueOption);
                    }}
                    placeholder="VAT Item (optional)"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.mrp}
                    name="mrp"
                    component={Input}
                    placeholder="M.R.P"
                    label="M.R.P"
                    type="number"
                  />
                </div>
                <div className="col-lg-6">
                  <label>Select Distribution Channel</label>
                  <Field
                    name="distributionChannel"
                    component={() => (
                      <Select
                        options={distributionChannelDDL || []}
                        placeholder="Select Distribution Channel"
                        value={values.distributionChannel || ""}
                        onChange={(valueOption) => {
                          setFieldValue(
                            "distributionChannel",
                            valueOption || ""
                          );
                        }}
                        styles={{
                          ...customStyles,
                          control: (provided, state) => ({
                            ...provided,
                            minHeight: "30px",
                            height: "auto",
                          }),
                          valueContainer: (provided, state) => ({
                            ...provided,
                            height: "auto",
                            padding: "0 6px",
                          }),
                        }}
                        name="distributionChannel"
                        isDisabled={!distributionChannelDDL}
                        isMulti
                      />
                    )}
                    placeholder="Select Distribution Channel"
                    label="Select DistributionChannel"
                  />
                  <p
                    style={{
                      fontSize: "0.9rem",
                      fontWeight: 400,
                      width: "100%",
                      marginTop: "0.25rem",
                    }}
                    className="text-danger"
                  >
                    {errors &&
                    errors.distributionChannel &&
                    touched &&
                    touched.org
                      ? errors.distributionChannel
                      : ""}
                  </p>
                </div>
                <div className="col-lg-3">
                  <Field
                    value={values.conversionRatePcs}
                    name="conversionRatePcs"
                    component={Input}
                    placeholder="Conversion Rate Pcs"
                    label="Conversion Rate Pcs"
                    type="number"
                  />
                </div>
              </div>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={saveBtnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
