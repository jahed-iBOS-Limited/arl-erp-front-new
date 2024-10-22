import React, { useState } from "react";
import IForm from "../../../../_helper/_form";
import * as Yup from "yup";
import { Formik, Form } from "formik";
import { useLocation, useHistory } from "react-router-dom";
import { values } from "lodash";
import { toast } from "react-toastify";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import { useEffect } from "react";
import { shallowEqual, useSelector } from "react-redux";
import Loading from "../../../../_helper/_loading";
import useAxiosPost from "../../../../_helper/customHooks/useAxiosPost";
import axios from "axios";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import { CardHeaderToolbar } from "../../../../../../_metronic/_partials/controls";

const initData = {
  productName: "",
  finishedGood: "",
};

const validationSchema = Yup.object().shape({
  //   productName: Yup.string().required("Product Name is required"),
  //   finishedGood: Yup.string().required("Finished Good is required"),
});
const ProductToFG = () => {
  const [, saveData, tagFGloading] = useAxiosPost();
  const [productInfo, getProductInfo, productInfoLoading] = useAxiosGet();
  const [
    productLanding,
    getProductLanding,
    productLandingLandingLoading,
  ] = useAxiosGet();
  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  const location = useLocation();

  const history = useHistory();

  const [pageNo, setPageNo] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  useEffect(() => {
    getProductInfo(`costmgmt/Precosting/ProductGetById?productId=0`, (data) => {
      setRowData(data?.commonCostElement || []);
    });
  }, [selectedBusinessUnit?.value]);

  console.log(location?.state, "location.state");

  const saveHandler = (values) => {
    console.log(values, rowData, "values ===>");
    const costElemtList = [];

    // Use forEach instead of map for side effects (pushing data)
    // eslint-disable-next-line no-unused-expressions
    rowData?.forEach((data) => {
      if (data?.costElementName) {
        costElemtList.push({
          costElementId: data?.costElementId || 0,
          costElementName: data?.costElementName,
        });
      } else {
        console.error("Invalid data in rowData: ", data);
      }
    });

    const payload = {
      actionBy: profileData?.userId,
      mappingType: "commonCostElement",
      finishGoodMappings: [],
      materialMappings: [],
      commonCostElement: [...costElemtList],
    };
    saveData(
      `/costmgmt/Precosting/ProductItemMaterialElementConfigure`,
      payload,
      (res) => {
        if (res.statuscode === 200) {
          toast.success("Created Successfully");
        } else {
          toast.error("Failed!");
        }
      }
    );
  };

  const addNewFeatureHandler = (values) => {
    console.log(values, rowData, "values");
    let foundData = rowData?.filter(
      (item) => item?.costElementName === values?.costElementName
    );
    if (foundData?.length > 0) {
      toast.warning("Finished Good already exist", { toastId: "Fae" });
    } else {
      let payload = {
        costElementName: values?.costElementName,
      };
      console.log(payload, "payload");
      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (fgValue) => {
    const filterData = rowData.filter(
      (item) => item.costElementName !== fgValue
    );
    setRowData(filterData);
  };
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
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
          errors,
          touched,
          setFieldValue,
          isValid,
        }) => (
          <>
            {(tagFGloading || productInfoLoading) && <Loading />}
            <Form className="global-form form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <InputField
                    value={values?.costElementName}
                    label="Cost Element Name"
                    name="costElementName"
                    type="text"
                    onChange={(e) =>
                      setFieldValue("costElementName", e.target.value)
                    }
                  />
                </div>

                <div className="col-lg-3 pt-6">
                  <button
                    type="button"
                    disabled={!values?.costElementName}
                    className="btn btn-primary"
                    onClick={() => {
                      addNewFeatureHandler(values);
                    }}
                  >
                    Add
                  </button>
                </div>
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
            <CardHeaderToolbar>
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => saveHandler()}
              >
                Save
              </button>
            </CardHeaderToolbar>
            <div className="table-responsive pt-5">
              <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                {rowData?.length > 0 && (
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Cost Element</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                )}
                <tbody>
                  {rowData?.length > 0 &&
                    rowData?.map((item, index) => {
                      console.log(item, "item");
                      return (
                        <tr key={index}>
                          <td style={{ width: "15px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>
                            <span className="pl-2 text-center">
                              {item?.costElementName}
                            </span>
                          </td>
                          <td>
                            <span
                              style={{ cursor: "pointer" }}
                              onClick={() => {
                                handleDelete(item?.costElementName);
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
    </>
  );
};

export default ProductToFG;
