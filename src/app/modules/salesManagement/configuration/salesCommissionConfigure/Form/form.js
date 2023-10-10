import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import SalesCommissionConfigureFormTable from "./table";

const ValidationSchema = Yup.object().shape({});

export default function _Form({
  saveData,
  initData,
  getAreas,
  rowData,
  setRowData,
  commissionTypes,
}) {
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ValidationSchema}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, resetForm }) => (
          <ICustomCard
            title="Sales Commission Entry"
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm(initData);
            }}
            saveHandler={() => {
              saveData(values, () => {
                resetForm(initData);
              });
            }}
          >
            <div className="global-form">
              <form className="form form-label-right">
                <div className="form-group row ">
                  <div className="col-lg-3">
                    <NewSelect
                      name="commissionType"
                      options={commissionTypes}
                      value={values?.commissionType}
                      label="Commission Type"
                      placeholder="Commission Type"
                      onChange={(e) => {
                        setFieldValue("commissionType", e);
                        setRowData([]);
                      }}
                    />
                  </div>
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      area: false,
                      territory: false,
                      onChange: (allValues, fieldName) => {
                        setRowData([]);
                        if (fieldName === "region") {
                          getAreas({
                            channelId: allValues?.channel?.value,
                            regionId: allValues?.region?.value,
                          });
                        }
                      },
                    }}
                  />

                  <FromDateToDateForm obj={{ values, setFieldValue }} />
                </div>
              </form>
            </div>
            <SalesCommissionConfigureFormTable
              obj={{ rowData, setRowData, values }}
            />
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
