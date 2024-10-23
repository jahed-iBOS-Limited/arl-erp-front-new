import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";

const validationSchema = Yup.object().shape({
  productName: Yup.string().required("Product Name is required"),
  productUOM: Yup.object().shape({
    label: Yup.string().required("UOM is required"),
    value: Yup.string().required("UOM is required"),
  }),
});

function CreateCostModal({ uomDDL, CB }) {
  // get user profile data and business data from store
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  const [, saveData, createloading] = useAxiosPost();

  const saveHandler = (values) => {
    const paylaod = {
      productId: 0,
      productName: values?.productName,
      uomId: values?.productUOM?.value,
      uomName: values?.productUOM?.label,
      businessUnitId: selectedBusinessUnit?.value,
      actionBy: profileData?.userId,
    };

    if (paylaod) {
      saveData(`/costmgmt/Precosting/CreateProduct`, paylaod, CB);
    }
  };

  useEffect(() => {}, []);

  return (
    <div className="confirmModal">
      {createloading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          productName: "",
          productUOM: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm();
          });
        }}
      >
        {({ errors, touched, setFieldValue, isValid, values, resetForm }) => (
          <>
            <Form className="form form-label-right">
              <div className="">
                {/* Save button add */}
                <div className="d-flex justify-content-end my-1">
                  <button type="submit" className="btn btn-primary">
                    Save
                  </button>
                </div>
              </div>
              <div className="form-group row global-form mt-0">
                {/*  Product Name*/}
                <div className="col-lg-3">
                  <InputField
                    value={values?.productName}
                    label="Product Name"
                    name="productName"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("productName", e.target.value)
                    }
                  />
                </div>

                {/* product UOM */}
                <div className="col-lg-3">
                  <NewSelect
                    name="productUOM"
                    options={uomDDL || []}
                    value={values?.productUOM}
                    label="Product UOM"
                    onChange={(valueOption) => {
                      setFieldValue("productUOM", valueOption);
                    }}
                    placeholder="Product UOM"
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </div>
  );
}

export default CreateCostModal;
