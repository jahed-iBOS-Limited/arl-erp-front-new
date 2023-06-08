import React from "react";
import { Formik } from "formik";
import { useHistory } from "react-router";
import { validationSchema } from "../helper";
import {
  Card,
  CardBody,
  CardHeader,
  CardHeaderToolbar,
  ModalProgressBar,
} from "../../../../../../_metronic/_partials/controls";
import HeaderForm from "./headerForm";
import RowForm from "./rowForm";

export default function _Form({
  initData,
  saveHandler,
  customerDDL,
  productNameDDL,
  lcNoDDL,
  upozilaList,
  viewType,
  rowData,
  setRowData,
  rowDataAddHandler,
}) {
  const history = useHistory();

  /* Row Data Remove Handler */
  const removeHandler = (index) => {
    const remove = rowData?.filter((item, idx) => index !== idx);
    setRowData(remove);
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          if (viewType === "edit") {
            saveHandler(values, () => {
              resetForm(initData);
              setRowData([]);
            });
          } else {
            rowDataAddHandler(values);
          }
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          errors,
          touched,
          setFieldValue,
        }) => (
          <>
            <Card>
              {true && <ModalProgressBar />}
              <CardHeader
                title={`Partner Product Allocation ${
                  !viewType
                    ? "Create"
                    : viewType[0].toUpperCase() +
                      viewType?.slice(1)?.toLowerCase()
                }`}
              >
                <CardHeaderToolbar>
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className="btn btn-light"
                    >
                      <i className="fa fa-arrow-left"></i>
                      Back
                    </button>
                    <button
                      type="reset"
                      onClick={() => resetForm(initData)}
                      className="btn btn-light ml-2"
                      disabled={viewType === "view"}
                    >
                      <i className="fa fa-redo"></i>
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary ml-2"
                      onClick={() => {
                        if (viewType === "edit") {
                          handleSubmit();
                        } else {
                          saveHandler(values, () => {
                            resetForm(initData);
                            setRowData([]);
                          });
                        }
                      }}
                      disabled={viewType === "view"}
                    >
                      Save
                    </button>
                  </>
                </CardHeaderToolbar>
              </CardHeader>
              <CardBody>
                {/* Header Form */}
                <HeaderForm
                  customerDDL={customerDDL}
                  productNameDDL={productNameDDL}
                  lcNoDDL={lcNoDDL}
                  upozilaList={upozilaList}
                  viewType={viewType}
                  values={values}
                  errors={errors}
                  touched={touched}
                  setFieldValue={setFieldValue}
                  handleSubmit={handleSubmit}
                  rowData={rowData}
                ></HeaderForm>

                {/* Row Form */}
                {rowData?.map((item, index) => (
                  <RowForm
                    customerDDL={customerDDL}
                    productNameDDL={productNameDDL}
                    upozilaList={upozilaList}
                    viewType={viewType}
                    values={item}
                    index={index}
                    errors={errors}
                    touched={touched}
                    setFieldValue={setFieldValue}
                    removeHandler={removeHandler}
                  ></RowForm>
                ))}
              </CardBody>
            </Card>
          </>
        )}
      </Formik>
    </>
  );
}
