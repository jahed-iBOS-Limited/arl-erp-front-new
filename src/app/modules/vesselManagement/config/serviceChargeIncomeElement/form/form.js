/* eslint-disable react-hooks/exhaustive-deps */
import axios from "axios";
import { Formik } from "formik";
import React from "react";
import { useHistory } from "react-router-dom";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { PortAndMotherVessel } from "../../../common/components";
import Table from "./table";

const Form = ({ obj }) => {
  const {
    loader,
    buId,
    accId,
    initData,
    allSelect,
    selectedAll,
    rowDataHandler,
    allSelect2,
    selectedAll2,
    rowDataHandler2,
    saveHandler,
    costs,
    revenues,
    shipPointDDL,
  } = obj;
  const history = useHistory();

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <>
            <ICustomCard
              title={"Service Charge and Income Element Configuration"}
              backHandler={() => history.goBack()}
              resetHandler={() => resetForm()}
              saveHandler={() => saveHandler(values)}
              saveDisabled={loader}
            >
              {loader && <Loading />}

              <form className="form form-label-right">
                <div className="global-form">
                  <div className="row">
                    <PortAndMotherVessel
                      obj={{
                        port: false,
                        values,
                        setFieldValue,
                        onChange: (fieldName, allValues) => {
                          if (fieldName === "motherVessel") {
                            if (allValues?.motherVessel?.value === 0) {
                              toast.warn(
                                "Please select a specific mother Vessel"
                              );
                              setFieldValue("motherVessel", "");
                            } else {
                              setFieldValue(
                                "programNo",
                                allValues?.motherVessel?.programNo
                              );
                              setFieldValue("item", {
                                value: allValues?.motherVessel?.itemId,
                                label: allValues?.motherVessel?.itemName,
                              });
                            }
                          }
                        },
                      }}
                    />
                    <div className="col-lg-3">
                      <InputField
                        label="Tender no"
                        placeholder="Tender no"
                        type="text"
                        name="programNo"
                        value={values?.programNo}
                        disabled
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="warehouse"
                        options={
                          [{ value: 0, label: "All" }, ...shipPointDDL] || []
                        }
                        value={values?.warehouse}
                        label="Warehouse"
                        onChange={(e) => {
                          setFieldValue("warehouse", e);
                        }}
                        placeholder="Warehouse"
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="businessPartner"
                        options={[
                          { value: 73244, label: "G2G BADC" },
                          { value: 73245, label: "G2G BCIC" },
                        ]}
                        value={values?.businessPartner}
                        label="Business Partner"
                        onChange={(e) => {
                          setFieldValue("businessPartner", e);
                        }}
                        placeholder="Business Partner"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Item</label>
                      <SearchAsyncSelect
                        selectedValue={values?.item}
                        handleChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="Search Item"
                        loadOptions={(v) => {
                          const searchValue = v.trim();
                          if (searchValue?.length < 3) return [];
                          return axios
                            .get(
                              `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${values?.businessPartner?.value}&SearchTerm=${searchValue}`
                            )
                            .then((res) => res?.data);
                        }}
                        // isDisabled={type}
                      />
                    </div>
                  </div>
                </div>
              </form>
              <Table
                obj={{
                  costs,
                  revenues,
                  allSelect,
                  selectedAll,
                  rowDataHandler,
                  allSelect2,
                  selectedAll2,
                  rowDataHandler2,
                }}
              />
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
};

export default Form;
