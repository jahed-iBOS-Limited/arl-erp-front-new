import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useLocation } from "react-router-dom";
import { values } from "lodash";
import { toast } from "react-toastify";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";

const initData = {
  productName: "",
  rawMaterial: "",
};

const validationSchema = Yup.object().shape({
  //   productName: Yup.string().required("Product Name is required"),
  //   rawMaterial: Yup.string().required("Raw Material is required"),
});

const ProductToRM = () => {
  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  console.log(location?.state, "location.state");

  const saveHandler = (values) => {
    console.log(values, "values");
    console.log(rowData, "rowData");
  };

  const addNewRawMaterialHandler = (values) => {
    let foundData = [];
    if (foundData?.length > 0) {
      toast.warning("Raw Material already exists", { toastId: "RMe" });
    } else {
      const timestamp = Date.now(); // Current timestamp in milliseconds
      const randomNum = Math.random()
        .toString(36)
        .substring(2); // Generate a random number and convert it to base 36
      const uniqueId = `${timestamp}-${randomNum}`;
      let payload = {
        materialId: 2,
        rawMaterial: uniqueId,
        isSelect: true,
        isCreate: false,
        isEdit: false,
        isView: false,
        isClose: false,
      };
      console.log(payload, "payload");
      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (rmValue) => {
    const filterData = rowData.filter((item) => item.rawMaterial !== rmValue);
    setRowData(filterData);
  };

  return (
    <>
      <IForm title={"Product to RM Configuration"} getProps={setObjprops}>
        <Formik
          enableReinitialize={true}
          initialValues={initData}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting, resetForm }) => {
            saveHandler(values, () => {
              console.log(values, "values");
              resetForm(initData);
            });
          }}
        >
          {({
            handleSubmit,
            resetForm,
            values,
            errors,
            touched,
            setFieldValue,
            isValid,
          }) => (
            <>
              {console.log("rr0", errors)}
              <Form className="global-form form form-label-right">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <label>Product Name</label>
                    <InputField
                      value={"testing"}
                      name="Product Name"
                      placeholder="Product Name"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  {
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="rawMaterial"
                          options={[
                            { value: 1, label: "Raw Material 1" },
                            { value: 2, label: "Raw Material 2" },
                          ]}
                          value={values?.rawMaterial}
                          label="Raw Material"
                          onChange={(valueOption) => {
                            setFieldValue("rawMaterial", valueOption);
                          }}
                          placeholder="Raw Material"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3 pt-6">
                        <button
                          type="button"
                          disabled={!values?.rawMaterial}
                          className="btn btn-primary"
                          onClick={() => {
                            addNewRawMaterialHandler(values);
                          }}
                        >
                          Add
                        </button>
                      </div>
                    </>
                  }
                </div>

                <button
                  type="submit"
                  style={{ display: "none" }}
                  ref={objProps.btnRef}
                  onSubmit={() => handleSubmit()}
                ></button>

                <button
                  type="reset"
                  style={{ display: "none" }}
                  ref={objProps.resetBtnRef}
                  onSubmit={() => resetForm(initData)}
                ></button>
              </Form>
              <div className="table-responsive pt-5">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  {rowData?.length > 0 && (
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Raw Material</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {rowData?.length > 0 &&
                      rowData?.map((item, index) => {
                        return (
                          <tr key={index}>
                            <td
                              style={{ width: "15px" }}
                              className="text-center"
                            >
                              {index + 1}
                            </td>
                            <td>
                              <span className="pl-2 text-center">
                                {item?.rawMaterial}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleDelete(item?.rawMaterial);
                                }}
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
            </>
          )}
        </Formik>
      </IForm>
    </>
  );
};

export default ProductToRM;
