import React, { useEffect, useState, useRef } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import Axios from "axios";
import Select from "react-select";
import { useSelector, shallowEqual } from "react-redux";
import { Input } from "../../../../../_metronic/_partials/controls";
import customStyles from "../../../selectCustomStyle";
import IViewModal from "./../../../_helper/_viewModal";
import { createPartnerBasic_api } from "../helper";

// Validation schema
const ProductEditSchema = Yup.object().shape({
  businessPartnerName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Partner Name is required"),
  businessPartnerType: Yup.object().shape({
    label: Yup.string().required("Partner Type is required"),
    value: Yup.string().required("Partner Type is required"),
  }),
  businessPartnerAddress: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(100, "Maximum 100 symbols")
    .required("Partner Address is required"),
  contactNumber: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Contact Number is required"),
  licenseNo: Yup.string()
    .min(2, "Minimum 2 symbols")
    .max(50, "Maximum 50 symbols")
    .required("License No is required"),
});

const initProduct = {
  id: undefined,
  businessPartnerName: "",
  businessPartnerAddress: "",
  contactNumber: "",
  bin: "",
  licenseNo: "",
  email: "",
  businessPartnerType: "",
};

export default function AddCustomerForm({ show, onHide, product }) {
  const [itemTypeList, setItemTypeList] = useState("");
  const [itemTypeOption, setItemTypeOption] = useState([]);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);
  useEffect(() => {
    getInfoData();
  }, []);

  const getInfoData = async () => {
    try {
      const res = await Axios.get(
        "/partner/BusinessPartnerBasicInfo/GetBusinessPartnerTypeList"
      );
      setItemTypeList(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const itemTypes = [];
    itemTypeList &&
      itemTypeList.forEach((item) => {
        let items = {
          value: item.businessPartnerTypeId,
          label: item.businessPartnerTypeName,
        };
        itemTypes.push(items);
      });
    setItemTypeOption(itemTypes);
  }, [itemTypeList]);

  const saveBussinessPartner = async (values, cb) => {
    if (values && selectedBusinessUnit && profileData) {
      const warehouseData = {
        accountId: profileData?.accountId,
        businessUnitId: selectedBusinessUnit?.value,
        businessPartnerCode: "abc",
        businessPartnerName: values.businessPartnerName,
        businessPartnerAddress: values.businessPartnerAddress,
        contactNumber: values.contactNumber,
        bin: values.bin,
        licenseNo: values.licenseNo,
        email: values.email,
        businessPartnerTypeId: values.businessPartnerType.value,
        partnerSalesType: values.businessPartnerType.label,
        actionBy: profileData?.userId,
        attachmentLink: "",
      };
      await createPartnerBasic_api(warehouseData, cb);
      await onHide();
    }
  };

  const btnRef = useRef();
  const resetBtnRef = useRef();

  return (
    <div className="adjustment-journal-modal">
      <IViewModal
        show={show}
        onHide={onHide}
        isShow={false}
        title="Create Business Partner Basic Info"
        style={{ fontSize: "1.2rem !important" }}
      >
        <>
          <Formik
            enableReinitialize={true}
            initialValues={initProduct}
            validationSchema={ProductEditSchema}
            // onSubmit={(values, { setSubmitting, resetForm }) => {
            //     saveBussinessPartner(values, () => {
            //        resetForm(product);
            //     });
            // }}
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
                <Form className="form form-label-right">
                  <div className="global-form">
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <Field
                          value={values.businessPartnerName || ""}
                          name="businessPartnerName"
                          component={Input}
                          placeholder="Business Partner Name"
                          label="Business Partner Name"
                        />
                      </div>
                      <div className="col-lg-4">
                        <label>Partner Type</label>
                        <Field
                          name="businessPartnerType"
                          component={() => (
                            <Select
                              options={itemTypeOption}
                              placeholder="Select Partner Type"
                              defaultValue={values.businessPartnerType}
                              onChange={(valueOption) => {
                                setFieldValue(
                                  "businessPartnerType",
                                  valueOption
                                );
                              }}
                              isSearchable={true}
                              styles={customStyles}
                              name="businessPartnerType"
                              label="Partner Type"
                            />
                          )}
                          placeholder="Select Partner Type"
                        />
                      </div>
                      <div className="col-lg-4">
                        <Field
                          value={values.businessPartnerAddress || ""}
                          name="businessPartnerAddress"
                          component={Input}
                          placeholder="Business Partner Address"
                          label="Business Partner Address"
                        />
                      </div>
                    </div>
                    <div className="form-group row">
                      <div className="col-lg-4">
                        <Field
                          value={values.contactNumber || ""}
                          name="contactNumber"
                          component={Input}
                          placeholder="Contact Number"
                          label="Contact Number"
                        />
                      </div>
                      <div className="col-lg-4">
                        <Field
                          value={values.email || ""}
                          name="email"
                          component={Input}
                          placeholder="Email"
                          label="Email (Optional)"
                        />
                      </div>
                      <div className="col-lg-4">
                        <Field
                          value={values.bin || ""}
                          name="bin"
                          component={Input}
                          placeholder="BIN"
                          label="BIN (Optional)"
                        />
                      </div>
                      <div className="col-lg-4">
                        <Field
                          value={values.licenseNo || ""}
                          name="licenseNo"
                          component={Input}
                          placeholder="Licence Number"
                          label="Licence Number"
                        />
                      </div>
                      <div className="col-lg-4">
                        <button
                          className="btn btn-primary mr-2 mt-6"
                          type="submit"
                          onClick={() => saveBussinessPartner(values)}
                        >
                          Save
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      style={{ display: "none" }}
                      ref={btnRef}
                      onSubmit={() => handleSubmit()}
                    ></button>

                    <button
                      type="reset"
                      style={{ display: "none" }}
                      ref={resetBtnRef}
                      onSubmit={() => resetForm(product)}
                    ></button>
                  </div>
                </Form>
              </>
            )}
          </Formik>
        </>
      </IViewModal>
    </div>
  );
}
