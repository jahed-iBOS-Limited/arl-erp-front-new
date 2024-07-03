import { Formik } from "formik";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
// import { getVoyageDDLFilter } from "../../helper";
import { getLayTime, validationSchema } from "../helper";
import { CreateHeaderForm } from "./components/createHeaderForm";
import CreateRowForm from "./components/createRowForm";
import LayTimeTableBody from "./components/layTimeTableBody";
import PrintView from "./components/printView";
import IViewModal from "../../../../chartering/_chartinghelper/_viewModal";
import { getVoyageDDLFilter } from "../../../../chartering/helper";
import PrintInvoiceView from "./components/printInvoiceView";

export default function _Form({
  title,
  initData,
  saveHandler,
  viewType,
  setLoading,
  id,

  /*  */
  rowData,
  setRowData,
  singleData,
  setId,
  setSingleData,

  /* DDL */
  vesselDDL,
  stackHolderTypeDDL,
  stackHolderNameDDL,
  setStackHolderNameDDL,
}) {
  const history = useHistory();
  const [voyageNoDDL, setVoyageNoDDL] = useState([]);
  const [show, setShow] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [valuesState, setValuesState] = useState(null);

  const { state: preData } = useLocation();

  useEffect(() => {
    if (preData?.vesselName?.value) {
      getVoyageDDLFilter({
        id: preData?.vesselName?.value,
        setter: setVoyageNoDDL,
        typeId: 2,
        setLoading: setLoading,
        isComplete: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preData?.vesselName?.value]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={
          id > 0
            ? singleData
            : valuesState || {
                ...initData,
                vesselName: preData?.vesselName,
                voyageNo: preData?.voyageNo,
              }
        }
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setShowInvoiceModal(true)
            if (!id) {
              resetForm(initData);
              setRowData([]);
            }

            if (id) {
              getLayTime(
                values?.vesselName?.value,
                values?.voyageNo?.value,
                values?.layTimeType?.value,
                values?.cargo?.value,
                values?.stackHolderType?.value,
                values?.stackHolderName?.value,
                setLoading,
                setSingleData,
                setRowData,
                setId
              );
            }

            /* When Next Button Clicked */
            preData?.vesselName?.value &&
              preData?.voyageNo?.value &&
              history.push({
                pathname: `/chartering/transaction/voyagecharter/create`,
                state: preData,
              });
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
          setTouched,
          setErrors,
          setValues,
        }) => (
          <>
            <form className="marine-form-card layTimeCreateCss">
              <div className="marine-form-card-heading">
                <p>{title}</p>
                <div>
                  {preData?.vesselName?.value && (
                    <button
                      type="button"
                      className={"btn btn-danger px-3 py-2 mr-2"}
                      onClick={() => {
                        history.push({
                          pathname: `/chartering/transaction/voyagecharter/create`,
                          state: preData,
                        });
                      }}
                    >
                      Skip
                    </button>
                  )}
                  {preData?.voyageNo?.value && (
                    <button
                      type="button"
                      onClick={() => {
                        history.goBack();
                      }}
                      className={"btn btn-secondary px-3 py-2"}
                    >
                      <i className="fa fa-arrow-left pr-1"></i>
                      Back
                    </button>
                  )}
                  {!id && (
                    <button
                      type="button"
                      onClick={() => {
                        resetForm(initData);
                        setRowData([]);
                      }}
                      className={"btn btn-info px-3 py-2 reset-btn ml-2"}
                    >
                      Reset
                    </button>
                  )}
                  {id ? (
                    <button
                      type="button"
                      className={"btn btn-primary px-3 py-2 ml-2"}
                      onClick={() => {
                        setShow(true);
                      }}
                    >
                      Print View
                    </button>
                  ) : null}

                  <>
                    {preData?.vesselName?.value && preData?.voyageNo?.value ? (
                      <>
                        <button
                          type="button"
                          className={"btn btn-success px-3 py-2 ml-2"}
                          onClick={handleSubmit}
                        >
                          Save & Next
                        </button>
                      </>
                    ) : (
                      <>
                        {viewType !== "view" ? (
                          <button
                            type="submit"
                            className={"btn btn-success px-3 py-2 ml-2"}
                            onClick={handleSubmit}
                          >
                            {"Save"}
                          </button>
                        ) : null}
                      </>
                    )}
                  </>
                </div>
              </div>

              <>
                <div className="my-4">
                  {id ? (
                    <h5 className="text-center">
                      { values?.portAt?.label
                        ? `LAYTIME STATEMENT AT ${ values?.portAt?.label}${
                            values?.portAt?.berthedPortCountry ||
                            values?.portAt?.country
                              ? `, ${values?.portAt?.berthedPortCountry ||
                                  values?.portAt?.country}`
                              : ""
                          }`
                        : ""}
                    </h5>
                  ) : null}

                  {/* Header Form */}
                  <CreateHeaderForm
                    /* Formik */
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    setTouched={setTouched}
                    setErrors={setErrors}
                    resetForm={resetForm}
                    setValues={setValues}
                    setValuesState={setValuesState}
                    /* DDL */
                    vesselDDL={vesselDDL}
                    voyageNoDDL={voyageNoDDL}
                    setVoyageNoDDL={setVoyageNoDDL}
                    stackHolderTypeDDL={stackHolderTypeDDL}
                    stackHolderNameDDL={stackHolderNameDDL}
                    setStackHolderNameDDL={setStackHolderNameDDL}
                    /* Others */
                    setLoading={setLoading}
                    viewType={viewType}
                    rowData={rowData}
                    setRowData={setRowData}
                    id={id}
                    setId={setId}
                    setSingleData={setSingleData}
                  />

                  {/* Form For Add Row Data */}
                  <CreateRowForm
                    /* Formik */
                    values={values}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                    setTouched={setTouched}
                    setErrors={setErrors}
                    /* Others */
                    rowData={rowData}
                    setRowData={setRowData}
                    viewType={id}
                  />

                  {/* Row Table | Total Column 9 */}
                  <LayTimeTableBody
                    rowData={rowData}
                    setRowData={setRowData}
                    values={values}
                    viewType={id}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </>
            </form>

            {/* Print View Modal */}
            <IViewModal show={show} onHide={() => setShow(false)}>
              <PrintView
                id={id}
                rowData={rowData}
                setRowData={setRowData}
                values={values}
                singleData={singleData}
                errors={errors}
                touched={touched}
              />
            </IViewModal>
            <IViewModal
              show={showInvoiceModal}
              onHide={() => setShowInvoiceModal(false)}
            >
              <PrintInvoiceView />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
