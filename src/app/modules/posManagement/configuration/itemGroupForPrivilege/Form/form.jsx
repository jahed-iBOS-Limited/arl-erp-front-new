import React, { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import NewSelect from "./../../../../_helper/_select";
import { useSelector, shallowEqual } from "react-redux";
import { getWareHouseDDL, GetSalesWiseItem_api } from "../helper";
import InputField from "./../../../../_helper/_inputField";
import IDelete from "./../../../../_helper/_helperIcons/_delete";
// Validation schema
const validationSchema = Yup.object().shape({
  outletName: Yup.object().shape({
    label: Yup.string().required("Outlet Name is required"),
    value: Yup.string().required("Outlet Name is required"),
  }),
  itemGroupName: Yup.string()
    .min(2, "Minimum 2 symbols")
    .required("Item Group Name no is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  rowDto,
  setter,
  remover,
  setRowDto
}) {
  const [WareHouseDDL, setWareHouseDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);
  useEffect(() => {
    if (profileData?.accountId && selectedBusinessUnit?.value) {
      getWareHouseDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        profileData?.plantId,
        profileData?.userId,
        setWareHouseDDL
      );
      GetSalesWiseItem_api(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setItemDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([])
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
            <Form className="form form-label-right mt-2">
              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="outletName"
                    options={WareHouseDDL || []}
                    value={values?.outletName}
                    label="Outlet Name"
                    onChange={(valueOption) => {
                      setFieldValue("outletName", valueOption);
                    }}
                    placeholder="Outlet Name"
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Item Group Name</label>
                  <InputField
                    value={values?.itemGroupName}
                    name="itemGroupName"
                    placeholder="Item Group Name"
                    type="text"
                  />
                </div>
              </div>

              <div className="row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="item"
                    options={itemDDL || []}
                    value={values?.item}
                    label="Item "
                    onChange={(valueOption) => {
                      setFieldValue("item", valueOption);
                    }}
                    placeholder="Item "
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3 d-flex  align-items-end">
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      setter(values);
                    }}
                    disabled={!values?.item}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="table-responsive">
                <table className="table table-striped table-bordered global-table">
                  <thead>
                    <tr>
                      <th>SL</th>
                      <th>Item Name</th>
                      <th>UoM</th>
                      <th>Item Category</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowDto?.length >= 0 &&
                      rowDto?.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx +1}</td>
                          <td>{item?.itemName}</td>
                          <td>{item?.uomName}</td>
                          <td>{item?.itemCategoryName}</td>
                          <td>
                            <div className="d-flex justify-content-center align-items-center">
                              <span
                                onClick={() => {
                                  remover(idx);
                                }}
                              >
                                <IDelete />
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
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
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
