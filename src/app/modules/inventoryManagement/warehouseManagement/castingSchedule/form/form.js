import React, { useState } from "react";
import { Formik, Form } from "formik";
import Loading from "../../../../_helper/_loading";
import NewSelect from "../../../../_helper/_select";
import { getItemList } from "../helper";
import InputField from "../../../../_helper/_inputField";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import axios from "axios";
import FormikError from "../../../../_helper/_formikError";
import { removeRowData, rowDataAddHandler } from "../landing/utils";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import { useParams } from "react-router-dom";

export default function _Form({
  btnRef,
  initData,
  saveHandler,
  distributionChannelDDL,
  rowData,
  setRowData,
  loading,
  dataChangeHandler,
  salesOrgs,
  profileData,
  selectedBusinessUnit,
  setLoading,
  validationSchema,
  shipPointDDL,
}) {
  const [itemList, setItemList] = useState([]);
  const params = useParams();

  const loadUserList = (v) => {
    if (v?.length < 3) return [];
    return axios
      .get(
        `/domain/CreateUser/GetUserListSearchDDL?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&searchTerm=${v}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
          label: item?.label + ` [${item?.value}]`,
        }));
        return updateList;
      });
  };

  const totalMaker = React.useMemo(() => {
    let total = rowData?.reduce((acc, obj) => acc + +obj?.numQuantity, 0);
    return total || 0;
  }, [rowData]);

  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{ ...initData }}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          saveHandler(values);
        }}
      >
        {({ values, errors, touched, setFieldValue, handleSubmit }) => (
          <>
            <Form className="form form-label-right">
              <div className="row mt-2">
                <div className="col-lg-12">
                  <div className="row global-form">
                    <div className="col-lg-3">
                      <label>Information Date</label>
                      <InputField
                        value={values?.dteInformationDate}
                        name="dteInformationDate"
                        type="datetime-local"
                        disabled={true}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Casting Demand Date</label>
                      <InputField
                        value={values?.dteDemandDate}
                        name="dteDemandDate"
                        type="date"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Casting Date/Time</label>
                      <InputField
                        value={values?.dteCastingDate}
                        name="dteCastingDate"
                        type="datetime-local"
                      />
                    </div>

                    {params?.id ? null : (
                      <div className="col-lg-3">
                        <NewSelect
                          name="channel"
                          options={distributionChannelDDL || []}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);

                            if (values?.salesOrg?.value) {
                              getItemList(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                values?.salesOrg?.value,
                                setItemList,
                                setLoading
                              );
                            }
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}

                    <div className="col-lg-3">
                      <div>
                        <label>Customer</label>
                        <SearchAsyncSelect
                          selectedValue={values?.customer}
                          handleChange={(valueOption) => {
                            setFieldValue("customer", valueOption);
                          }}
                          isDisabled={!values?.channel}
                          placeholder="Search Customer"
                          loadOptions={(v) => {
                            const searchValue = v.trim();
                            if (searchValue?.length < 3) return [];
                            return axios
                              .get(
                                `/partner/PManagementCommonDDL/GetCustomerNameDDLByChannelId?SearchTerm=${searchValue}&AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&ChannelId=${values?.channel?.value}`
                              )
                              .then((res) => res?.data);
                          }}
                        />
                      </div>
                      <FormikError
                        errors={errors}
                        name="customer"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Project Address </label>
                      <InputField
                        value={values?.strAddress}
                        name="strAddress"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Contact Person of Project</label>
                      <InputField
                        value={values?.strContactPerson}
                        name="strContactPerson"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Phone</label>
                      <InputField
                        value={values?.phone}
                        name="phone"
                        type="text"
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="workType"
                        options={[
                          { value: 1, label: "Slab" },
                          { value: 2, label: "Basement" },
                          { value: 3, label: "Column" },
                          { value: 4, label: "Retaining Wall" },
                          { value: 5, label: "Floor" },
                          { value: 6, label: "Cast in situ pile" },
                          { value: 7, label: "Pre-cast pile" },
                          { value: 8, label: "Footing" },
                          { value: 9, label: "Pile Cap" },
                          { value: 10, label: "Padstone Floor" },
                          { value: 11, label: "Ramp" },
                          { value: 12, label: "Foundation" },
                          { value: 13, label: "Others" },
                        ]}
                        value={values?.workType}
                        label="Type of Work"
                        onChange={(valueOption) => {
                          setFieldValue("workType", valueOption);
                        }}
                        placeholder="Type of Work"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPointDDL || []}
                        value={values?.shipPoint}
                        label="Ship Point"
                        onChange={(valueOption) => {
                          setFieldValue("shipPoint", valueOption);
                        }}
                        placeholder="Ship Point"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="buetTestReportDay"
                        options={[
                          { value: 0, label: "0 Days" },
                          { value: 1, label: "7 Days" },
                          { value: 2, label: "14 Days" },
                          { value: 3, label: "21 Days" },
                          { value: 4, label: "28 Days" },
                        ]}
                        value={values?.buetTestReportDay}
                        label="BUET Test Report Day"
                        onChange={(valueOption) => {
                          setFieldValue("buetTestReportDay", valueOption);
                        }}
                        placeholder="BUET Test Report Day"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Select Marketing Concern</label>
                      <SearchAsyncSelect
                        selectedValue={values?.castingProcedure}
                        handleChange={(valueOption) => {
                          setFieldValue("castingProcedure", valueOption);
                        }}
                        loadOptions={loadUserList}
                        disabled={true}
                      />
                      <FormikError
                        errors={errors}
                        name="castingProcedure"
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Remarks</label>
                      <InputField
                        value={values?.strRemarks}
                        name="strRemarks"
                        type="text"
                      />
                    </div>
                    {/* Header End */}

                    <div className="col-lg-12 mt-4"></div>

                    {/* Row Start */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesOrg"
                        options={salesOrgs || []}
                        value={values?.salesOrg}
                        label="Sales Organization"
                        onChange={(valueOption) => {
                          setFieldValue("salesOrg", valueOption);

                          if (values?.channel?.value) {
                            getItemList(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              values?.channel?.value,
                              valueOption?.value,
                              setItemList,
                              setLoading
                            );
                          }
                        }}
                        placeholder="Sales Organization"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    {!params?.id ? null : (
                      <div className="col-lg-3">
                        <NewSelect
                          name="channel"
                          options={distributionChannelDDL || []}
                          value={values?.channel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setFieldValue("channel", valueOption);

                            if (values?.salesOrg?.value) {
                              getItemList(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                valueOption?.value,
                                values?.salesOrg?.value,
                                setItemList,
                                setLoading
                              );
                            }
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                    )}

                    <div className="col-lg-3">
                      <NewSelect
                        name="item"
                        options={itemList || []}
                        value={values?.item}
                        label="PSI Item"
                        onChange={(valueOption) => {
                          setFieldValue("item", valueOption);
                        }}
                        placeholder="PSI"
                        errors={errors}
                        touched={touched}
                        isDisabled={!values?.salesOrg?.value}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>PSI Quantity</label>
                      <InputField
                        value={values?.numQuantity}
                        name="numQuantity"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="strShift"
                        options={[
                          // { value: 1, label: "Day" },
                          // { value: 2, label: "Night" },
                          { value: 1, label: "A Shift" },
                          { value: 2, label: "B Shift" },
                          { value: 3, label: "C Shift" },
                        ]}
                        value={values?.strShift}
                        label="Shift"
                        onChange={(valueOption) => {
                          setFieldValue("strShift", valueOption);
                        }}
                        placeholder="Shift"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>No Of Pump</label>
                      <InputField
                        value={values?.intNumberOfPump}
                        name="intNumberOfPump"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Non Pump</label>
                      <InputField
                        value={values?.nonPump}
                        name="nonPump"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Pipe (Feet)</label>
                      <InputField
                        value={values?.intPipeFeet}
                        name="intPipeFeet"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Large Tyre</label>
                      <InputField
                        value={values?.intLargeTyre}
                        name="intLargeTyre"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Small Tyre</label>
                      <InputField
                        value={values?.intSmallTyre}
                        name="intSmallTyre"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>

                    <div className="col-lg-3">
                      <label>Bag Cement Use</label>
                      <InputField
                        value={values?.intBagCementUse}
                        name="intBagCementUse"
                        type="number"
                        touched={touched}
                        errors={errors}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="waterproof"
                        options={[
                          { value: 1, label: "Yes" },
                          { value: 2, label: "No" },
                        ]}
                        value={values?.waterproof}
                        label="Waterproof"
                        onChange={(valueOption) => {
                          setFieldValue("waterproof", valueOption);
                        }}
                        placeholder="Waterproof"
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="col-lg-3 d-flex align-items-center">
                      <button
                        type="button"
                        className="btn btn-primary mt-4 mr-4"
                        disabled={
                          !values?.item?.value || values?.numQuantity <= 0
                        }
                        onClick={() => {
                          rowDataAddHandler(rowData, setRowData, values);
                          setFieldValue("numQuantity", "");
                        }}
                      >
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Table Start */}
              {rowData?.length > 0 && (
                <div className="table-responsive">
                  <table className="table table-striped table-bordered global-table">
                    <thead>
                      <tr>
                        <th style={{ width: "30px" }}>SL</th>
                        <th>PSI Item</th>
                        <th>PSI Qty</th>
                        <th>Shift</th>
                        <th>Waterproof</th>
                        <th>No. Of Pump</th>
                        <th>Pipe (Feet)</th>
                        <th>Large Tyre</th>
                        <th>Small Tyre</th>
                        <th>Cement use (Bag)</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rowData?.map((td, index) => (
                        <tr key={index}>
                          <td className="text-center">{index + 1}</td>
                          <td>{td?.strItemName}</td>
                          <td>{td?.numQuantity}</td>
                          <td>{td?.strShift}</td>
                          <td>{td?.isWaterProof ? "Yes" : "No"}</td>
                          <td>{td?.intNumberOfPump}</td>
                          <td>{td?.intPipeFeet}</td>
                          <td>{td?.intLargeTyre}</td>
                          <td>{td?.intSmallTyre}</td>
                          <td>{td?.intBagCementUse}</td>
                          <td className="text-center">
                            {params?.type === "view" ? (
                              "-"
                            ) : (
                              <span
                                onClick={() => {
                                  removeRowData(index, rowData, setRowData);
                                }}
                              >
                                <IDelete />
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="2"></td>
                        <td colSpan="1" className="text-right">
                          {totalMaker || 0}
                        </td>
                        <td colSpan="10"></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <button
                type="submit"
                style={{ display: "none" }}
                ref={btnRef}
                onSubmit={() => handleSubmit()}
              ></button>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
}
