import axios from "axios";
import { Formik } from "formik";
import React from "react";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import NewSelect from "../../../../_helper/_select";
import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import { useHistory } from "react-router-dom";

export default function _Form({
  buId,
  accId,
  rowData,
  initData,
  setRowData,
  addHandler,
  saveHandler,
  removeHandler,
  partnerGroups,
}) {
  const history = useHistory();
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ resetForm, values, setFieldValue }) => (
          <ICustomCard
            title="Business Partner Group Entry"
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={() => {
              resetForm();
              setRowData([]);
            }}
            saveHandler={() => {
              saveHandler(values, () => {
                resetForm();
              });
            }}
          >
            <form className="form form-label-right">
              {/* Form */}
              <div className="global-form">
                <div className="row">
                  <RATForm
                    obj={{
                      values,
                      setFieldValue,
                      region: false,
                      area: false,
                      territory: false,
                    }}
                  />
                  <div className="col-lg-3">
                    <label>Business Partner</label>
                    <SearchAsyncSelect
                      selectedValue={values?.customer}
                      handleChange={(valueOption) => {
                        setFieldValue("customer", valueOption);
                      }}
                      isDisabled={!values?.channel}
                      placeholder="Search Business Partner"
                      loadOptions={(v) => {
                        const searchValue = v.trim();
                        if (searchValue?.length < 3) return [];
                        return axios
                          .get(
                            `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${accId}&BusinessUnitId=${buId}&ChannelId=${values?.channel?.value}`
                          )
                          .then((res) => res?.data);
                      }}
                    />
                  </div>

                  <div className="col-lg-3">
                    <NewSelect
                      name="partnerGroup"
                      label="Partner Group"
                      placeholder="Partner Group"
                      options={partnerGroups || []}
                      value={values?.partnerGroup}
                      onChange={(valueOption) => {
                        setFieldValue("partnerGroup", valueOption);
                      }}
                    />
                  </div>
                  <IButton
                    disabled={
                      !values?.channel ||
                      !values?.customer ||
                      !values?.partnerGroup
                    }
                    onClick={() => {
                      addHandler(values, () => {
                        setFieldValue("customer", "");
                      });
                    }}
                  >
                    + Add
                  </IButton>
                </div>
              </div>

              {/* Table */}

              <div className="row">
                <div className="col-lg-6">
                  {rowData?.length > 0 && (
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered global-table">
                      <thead>
                        <tr>
                          {" "}
                          <th style={{ width: "50px" }}>SL</th>
                          <th>Partner Name</th>
                          <th>Group Name</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rowData?.map((item, i) => (
                          <tr key={i + 1}>
                            <td>{i + 1}</td>
                            <td>{item?.businessPartnerName}</td>
                            <td>{item?.businessPartnerGroupName}</td>
                            <td className="text-center">
                              <IDelete id={i} remover={removeHandler} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
