import { Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import * as Yup from "yup";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import FromDateToDateForm from "../../../../_helper/commonInputFieldsGroups/dateForm";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import SalesCommissionConfigureFormTable from "./table";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const ValidationSchema = Yup.object().shape({});

export default function _Form({
  saveData,
  initData,
  getAreas,
  rowData,
  setRowData,
  commissionTypes,
  desginationList,
}) {
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={ValidationSchema}
        onSubmit={() => { }}
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
                      area: [14, 16, 20, 23, 17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40].includes(
                        values?.commissionType?.value
                      ),
                      territory: false,
                      allElement: false,
                      onChange: () => {
                        if (
                          ![17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40].includes(
                            values?.commissionType?.value
                          )
                        ) {
                          setRowData([]);
                        }
                      },
                    }}
                  />

                  <FromDateToDateForm obj={{ values, setFieldValue }} />

                  {[17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40].includes(values?.commissionType?.value) && (
                    <>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="From Achievement"
                          value={values?.fromAchievement}
                          name="fromAchievement"
                          placeholder="From Achievement"
                          type={`text`}
                        />
                      </div>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="To Achievement"
                          value={values?.toAchievement}
                          name="toAchievement"
                          placeholder="To Achievement"
                          type={`text`}
                        />
                      </div>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="From Quantity"
                          value={values?.fromQuantity}
                          name="fromQuantity"
                          placeholder="From Quantity"
                          type={`text`}
                        />
                      </div>
                      <div className={`col-lg-3`}>
                        <InputField
                          label="To Quantity"
                          value={values?.toQuantity}
                          name="toQuantity"
                          placeholder="To Quantity"
                          type={`text`}
                        />
                      </div>
                    </>
                  )}

                  <div className={`col-lg-3`}>
                    <InputField
                      label="Common Rate"
                      value={values?.commonRate}
                      name="commonRate"
                      placeholder="Common Rate"
                      type={`text`}
                    />
                  </div>
                  {[35, 36, 37, 38, 39, 40].includes(values?.commissionType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="itemGroup"
                        options={[
                          {
                            "value": 1,
                            "label": "Atta"
                          },
                          {
                            "value": 2,
                            "label": "Suji"
                          }
                        ]}
                        value={values?.itemGroup}
                        label="Item Group"
                        onChange={(e) => {
                          setFieldValue("itemGroup", e);
                        }}
                      />
                    </div>
                  )}
                  {[40].includes(values?.commissionType?.value) && (
                    <div className="col-lg-3">
                      <NewSelect
                        name="designation"
                        options={desginationList || []}
                        value={values?.designation}
                        label="Designation"
                        onChange={(e) => {
                          setFieldValue("designation", e);
                        }}
                      />
                    </div>
                  )}
                  <IButton
                    title={
                      [17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40].includes(values?.commissionType?.value)
                        ? "Add"
                        : "Show"
                    }
                    onClick={() => {
                      getAreas(values, () => {
                        if (
                          [17, 18, 25, 27, 22, 35, 36, 37, 38, 39, 40].includes(
                            values?.commissionType?.value
                          )
                        ) {
                          setFieldValue("area", "");
                          setFieldValue("fromAchievement", "");
                          setFieldValue("toAchievement", "");
                          setFieldValue("fromQuantity", "");
                          setFieldValue("toQuantity", "");
                        }
                      });
                    }}
                  />
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
