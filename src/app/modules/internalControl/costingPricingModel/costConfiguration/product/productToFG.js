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

  const [objProps, setObjprops] = useState({});
  const [rowData, setRowData] = useState([]);
  const location = useLocation();
  const history = useHistory();

  const { item } = location?.state;
  const { selectedBusinessUnit, profileData } = useSelector(
    (state) => state.authData,
    shallowEqual
  );
  useEffect(() => {
    getProductInfo(
      `costmgmt/Precosting/ProductGetById?productId=${item?.productId}`,
      (data) => {
        setRowData(data?.finishGoodMappings || []);
      }
    );
  }, [selectedBusinessUnit?.value, item?.productId]);

  const saveHandler = (values) => {
    const finishGoodMappings = [];

    // Use forEach instead of map for side effects (pushing data)
    // eslint-disable-next-line no-unused-expressions
    rowData?.forEach((data) => {
      if (data?.fgItemName && data?.fgItemId) {
        finishGoodMappings.push({
          autoId: data?.autoId || 0,
          businessUnitId: selectedBusinessUnit?.value,
          fgItemId: data?.fgItemId,
          fgItemName: data?.fgItemName,
          productId: item?.productId,
          conversion: data?.conversion || 0,
          uomId: item?.uomId,
          uomName: item?.uomName,
        });
      } else {
        console.error("Invalid data in rowData: ", data);
      }
    });

    const payload = {
      productId: item?.productId,
      productName: item?.productName,
      businessUnitId: selectedBusinessUnit?.value,
      uomId: item?.uomId,
      uomName: item?.uomName,
      actionBy: profileData?.userId,
      mappingType: "finishGoodMappings",
      finishGoodMappings: [...finishGoodMappings],
      materialMappings: [],
      commonCostElement: [],
    };
    saveData(
      `/costmgmt/Precosting/ProductItemMaterialElementConfigure`,
      payload,
      (res) => {
        if (res.statuscode === 200) {
          history.push("/internal-control/costing/costingconfiguration");
        }
      }
    );
  };

  const addNewFeatureHandler = (values) => {
    let foundData = rowData?.filter(
      (item) => item?.fgItemId === values?.finishedGood?.value
    );
    if (foundData?.length > 0) {
      toast.warning("Finished Good already exist", { toastId: "Fae" });
    } else {
      let payload = {
        fgItemId: values?.finishedGood?.value,
        fgItemName: values?.finishedGood?.label,
        conversion: values?.conversion,
      };
      setRowData([...rowData, payload]);
    }
  };

  const handleDelete = (fgValue) => {
    const filterData = rowData.filter((item) => item.fgItemId !== fgValue);
    setRowData(filterData);
  };
  return (
    <>
      <IForm title={"Product to FG Configuration"} getProps={setObjprops}>
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
                    <label>Product Name</label>
                    <InputField
                      value={item?.productName}
                      name="Product Name"
                      placeholder="Product Name"
                      type="text"
                      disabled={true}
                    />
                  </div>

                  <div className="col-lg-3">
                    <label>Finished Good</label>
                    <SearchAsyncSelect
                      selectedValue={values?.finishedGood}
                      handleChange={(valueOption) => {
                        setFieldValue("finishedGood", valueOption);
                      }}
                      // isDisabled={!values?.channel}
                      placeholder="Search Finished Good"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/costmgmt/Precosting/GetPrecostingItemDDL?businessUnitId=${selectedBusinessUnit?.value}&itemTypeId=4&search=${searchValue}`
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Convertion Rate</label>
                    <InputField
                      value={values?.conversion}
                      name="conversion"
                      onChange={(e) => {
                        setFieldValue("conversion", e.target.value);
                      }}
                      placeholder="Convertion Rate"
                      type="number"
                    />
                  </div>
                  <div className="col-lg-3 pt-6">
                    <button
                      type="button"
                      disabled={!values?.finishedGood || !values?.conversion}
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
              <div className="table-responsive pt-5">
                <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                  {rowData?.length > 0 && (
                    <thead>
                      <tr>
                        <th>SL</th>
                        <th>Finished Good</th>
                        <th>Conversion Rate</th>
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
                                {item?.fgItemName}
                              </span>
                            </td>
                            <td>
                              <span className="pl-2 text-center">
                                {item?.conversion}
                              </span>
                            </td>
                            <td>
                              <span
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                  handleDelete(item?.fgItemId);
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

export default ProductToFG;
