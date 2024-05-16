import axios from "axios";
import { Field, Form, Formik } from "formik";
import React from "react";
import { toast } from "react-toastify";
import SearchAsyncSelect from "../../../../_helper/SearchAsyncSelect";
import ICustomCard from "../../../../_helper/_customCard";
import FormikError from "../../../../_helper/_formikError";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";
import Select from "react-select";

// there are some import issue thats why i write the code here
const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "30px",
    height: "30px",
  }),

  valueContainer: (provided, state) => ({
    ...provided,
    height: "30px",
    padding: "0 6px",
  }),

  input: (provided, state) => ({
    ...provided,
    margin: "0px",
  }),
  indicatorSeparator: (state) => ({
    display: "none",
  }),
  indicatorsContainer: (provided, state) => ({
    ...provided,
    height: "26px",
  }),
  clearIndicator: (provided, state) => ({
    ...provided,
    paddingRight: 2,
  }),
  dropdownIndicator: (provided, state) => ({
    ...provided,
    paddingLeft: 0,
  }),
  option: (provided, state) => ({
    ...provided,
    padding: 1,
    fontSize: 12.5,
    paddingLeft: 7,
    zIndex: 99999999,
    paddingRight: 7,
  }),
  multiValue: (provided, state) => ({
    ...provided,
    height: "18px",
    marginTop: "1px",
    paddingRight: "6px",
  }),
  multiValueRemove: (provided, state) => ({
    ...provided,
    paddingTop: "2px",
  }),
  placeholder: (provided, state) => ({
    ...provided,
    fontSize: 11.5,
    textOverflow: "ellipsis",
    maxWidth: "95%",
    whiteSpace: "nowrap",
    overflow: "hidden",
  }),
  menu: (provided, state) => ({
    ...provided,
    backgroundColor: "#ffffff",
    minWidth: "max-content",
    width: "100%",
    borderRadius: "2px",
    zIndex: 99999999999999,
  }),
};

export default function _Form({
  type,
  accId,
  buId,
  addRow,
  removeRow,
  title,
  rowDto,
  typeList,
  vessels,
  history,
  setRowDto,
  portDDL,
  initData,
  lighters,
  saveHandler,
  shipPointDDL,
  destinationDDL,
  onChangeHandler,
  shipPointData,
  getShipPoientData,
  shipPointDataLoader,
  setShipPointData,
  supplierDDL,
  getSupplierDDL,
  supplierDDLLoader,
  shipPointSaveHandler,
  toatlData,
}) {
  const loadOptions = async (v) => {
    await [];
    if (v.length < 3) return [];
    return axios
      .get(
        `/procurement/PurchaseOrder/GetSupplierListDDL?Search=${v}&AccountId=${accId}&UnitId=${buId}&SBUId=${0}`
      )
      .then((res) => {
        const updateList = res?.data.map((item) => ({
          ...item,
        }));
        return [...updateList];
      });
  };

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, errors, touched, resetForm }) => (
          <ICustomCard
            title={title}
            // saveDisabled={
            //   !values?.reportType?.value === 1 &&
            //   (!values?.reportType?.value === 2 ||
            //     !shipPointData?.some((item) => item?.isSelected))
            // }
            backHandler={() => {
              history.goBack();
            }}
            resetHandler={
              type === "view"
                ? false
                : () => {
                    resetForm(initData);
                  }
            }
            saveHandler={
              type === "view"
                ? false
                : () => {
                    if (values?.reportType?.value === 1) {
                      saveHandler(values, () => {
                        resetForm(initData);
                        setRowDto([]);
                      });
                    }
                    if (values?.reportType?.value === 2) {
                      if (
                        shipPointData?.length &&
                        shipPointData?.some((item) => item?.isSelected)
                      ) {
                        shipPointSaveHandler(shipPointData, values);
                      } else {
                        toast.warn("Select minimum one row");
                      }
                    }
                  }
            }
          >
            <Form className="form form-label-right">
              <div className="row global-form global-form-custom">
                <div className="col-lg-3">
                  <NewSelect
                    name="reportType"
                    options={[
                      { label: "Ghat Cost Information", value: 1 },
                      { label: "Vehicle Demand Info", value: 2 },
                    ]}
                    value={values?.reportType}
                    label="Report Type"
                    onChange={(valueOption) => {
                      setFieldValue("reportType", valueOption);
                      setShipPointData([]);
                      if (valueOption?.value) {
                        getSupplierDDL(
                          `/wms/TransportMode/GetTransportMode?intParid=2&intBusinessUnitId=${buId}`
                        );
                      } else {
                        setShipPointData([]);
                      }
                    }}
                    placeholder="Type"
                  />
                </div>
                {[1]?.includes(values?.reportType?.value) && (
                  <>
                    <div className="col-lg-3">
                      <NewSelect
                        name="destination"
                        options={destinationDDL}
                        value={values?.destination}
                        label="Lighter Destination"
                        onChange={(e) => {
                          onChangeHandler(
                            "destination",
                            values,
                            e,
                            setFieldValue
                          );
                        }}
                        placeholder="Lighter Destination"
                        isDisabled={type === "view"}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="port"
                        options={portDDL || []}
                        value={values?.port}
                        label="Port"
                        onChange={(e) => {
                          onChangeHandler("port", values, e, setFieldValue);
                        }}
                        placeholder="Port"
                        errors={errors}
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="motherVessel"
                        options={vessels || []}
                        value={values?.motherVessel}
                        label="Mother Vessel"
                        onChange={(e) => {
                          onChangeHandler(
                            "motherVessel",
                            values,
                            e,
                            setFieldValue
                          );
                        }}
                        placeholder="Mother Vessel"
                        errors={errors}
                        touched={touched}
                        isDisabled={
                          type === "view" ||
                          !values?.port ||
                          !values?.destination
                        }
                      />
                    </div>

                    <div className="col-lg-3">
                      <NewSelect
                        name="lighterVessel"
                        options={lighters}
                        value={values?.lighterVessel}
                        label="Lighter Vessel"
                        onChange={(e) => {
                          onChangeHandler(
                            "lighterVessel",
                            values,
                            e,
                            setFieldValue
                          );
                        }}
                        placeholder="Lighter"
                        errors={errors}
                        touched={touched}
                        isDisabled={type === "view" || !values?.motherVessel}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Supplier Name</label>
                      <SearchAsyncSelect
                        selectedValue={values?.supplier}
                        handleChange={(valueOption) => {
                          setFieldValue("supplier", valueOption);
                        }}
                        loadOptions={loadOptions}
                      />
                      <FormikError
                        errors={errors}
                        name="supplier"
                        touched={touched}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="shipPoint"
                        options={shipPointDDL}
                        value={values?.shipPoint}
                        label="Ship Point"
                        onChange={(e) => {
                          onChangeHandler(
                            "shipPoint",
                            values,
                            e,
                            setFieldValue
                          );
                        }}
                        placeholder="Ship Point"
                        errors={errors}
                        touched={touched}
                        isDisabled={type === "view"}
                      />
                    </div>
                    <YearMonthForm obj={{ values, setFieldValue }} />
                  </>
                )}
                {[2]?.includes(values?.reportType?.value) && (
                  <>
                    <div className="col-lg-3">
                      <InputField
                        label="Demand Date"
                        value={values?.demandDate}
                        name="demandDate"
                        type="date"
                        // disabled={disableHandler()}
                      />
                    </div>
                    <div className="col-lg-3">
                      <label>Supplier Name</label>
                      <Field
                        name="supplier"
                        component={() => (
                          <Select
                            options={supplierDDL || []}
                            placeholder="Select Supplier Name"
                            value={values.supplier}
                            onChange={(valueOption) => {
                              setFieldValue("supplier", valueOption);
                            }}
                            styles={{
                              ...customStyles,
                              control: (provided, state) => ({
                                ...provided,
                                minHeight: "30px",
                                height: "auto",
                              }),
                              valueContainer: (provided, state) => ({
                                ...provided,
                                height: "auto",
                                padding: "0 6px",
                              }),
                            }}
                            name="supplier"
                            isMulti
                          />
                        )}
                        placeholder="Supplier Name"
                        label="Supplier Name"
                      />
                      {/* <NewSelect
                        name="supplier"
                        options={supplierDDL}
                        value={values?.supplier}
                        label="Supplier Name"
                        onChange={(valueOption) => {
                            setFieldValue("supplier", valueOption);
                            setShipPointData([]);
                        }}
                        placeholder="Supplier Name"
                      /> */}
                    </div>
                    <div>
                      <button
                        type="button"
                        style={{ marginTop: "20px" }}
                        className="btn btn-primary ml-2"
                        disabled={
                          !values?.demandDate || !values?.supplier?.length
                        }
                        onClick={() => {
                          getShipPoientData(
                            `/wms/ShipPoint/GetShipPointDDL?accountId=${accId}&businessUnitId=${buId}`
                          );
                        }}
                      >
                        Show
                      </button>
                    </div>
                  </>
                )}
              </div>

              {!type === "view" && (
                <div className="row global-form global-form-custom">
                  <div className="col-lg-3">
                    <NewSelect
                      name="type"
                      options={typeList}
                      value={values?.type}
                      label="Type"
                      onChange={(e) => {
                        onChangeHandler("type", values, e, setFieldValue);
                      }}
                      placeholder="Type"
                      errors={errors}
                      touched={touched}
                      isDisabled={type === "view"}
                    />
                  </div>
                  <div className="col-lg-2">
                    <NewSelect
                      name="soldToPartner"
                      options={[
                        { value: 73244, label: "G2G BADC" },
                        { value: 73245, label: "G2G BCIC" },
                      ]}
                      value={values?.soldToPartner}
                      label="Business Partner"
                      onChange={(e) => {
                        setFieldValue("soldToPartner", e);
                      }}
                      placeholder="Business Partner"
                    />
                  </div>
                  <div className="col-lg-2">
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
                            `/wms/FertilizerOperation/GetItemListDDL?AccountId=${accId}&BusinessUinitId=${buId}&CorporationType=${values?.soldToPartner?.value}&SearchTerm=${searchValue}`
                          )
                          .then((res) => res?.data);
                      }}
                      isDisabled={!values?.soldToPartner}
                    />
                    <FormikError
                      errors={errors}
                      name="item"
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="quantity"
                      label="Quantity"
                      type="number"
                      placeholder="Quantity"
                      value={values?.quantity}
                    />
                  </div>
                  <div className="col-lg-2">
                    <InputField
                      name="rate"
                      label="Rate"
                      type="number"
                      placeholder="Rate"
                      value={values?.rate}
                    />
                  </div>
                  <IButton
                    colSize={"col-lg-1"}
                    onClick={() => {
                      addRow(values, () => {
                        setFieldValue("item", "");
                        setFieldValue("quantity", "");
                        setFieldValue("rate", "");
                        setFieldValue("type", "");
                        setFieldValue("soldToPartner", "");
                      });
                    }}
                    disabled={
                      !values?.type || !values?.rate || !values?.quantity
                    }
                  >
                    Add
                  </IButton>
                </div>
              )}
              <>
                {[1]?.includes(values?.reportType?.value) &&
                  rowDto?.length > 0 && (
                    <div className="scroll-table _table">
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered global-table mt-0">
                          <thead>
                            <tr>
                              <th style={{ width: "30px" }}>SL</th>
                              <th>Description</th>
                              <th>Item</th>
                              <th>Quantity</th>
                              <th>Rate</th>
                              <th>Amount</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {rowDto?.map((item, i) => {
                              return (
                                <tr>
                                  <td>{i + 1}</td>
                                  <td>{item?.typeName}</td>
                                  <td>{item?.itemName}</td>
                                  <td className="text-right">
                                    {item?.quantity}
                                  </td>
                                  <td className="text-right">{item?.rate}</td>
                                  <td className="text-right">{item?.amount}</td>
                                  <td className="text-center">
                                    <IDelete id={i} remover={removeRow} />
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                {[2]?.includes(values?.reportType?.value) &&
                  shipPointData?.length > 0 && (
                    <>
                      <div className="row mt-4">
                        <div
                          style={{ display: "flex", gap: "10px" }}
                          className="col-lg-12"
                        >
                          <div
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="text-bold"
                          >
                            <span>
                              Total Demand Vehicle :{" "}
                              <span style={{ color: "red" }}>
                                {toatlData?.toatlValueDemandVehicle}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="text-bold"
                          >
                            <span>
                              Total PackingMt :{" "}
                              <span style={{ color: "red" }}>
                                {" "}
                                {toatlData?.toatlValuePackingMt}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="text-bold"
                          >
                            <span>
                              Total Dump Qty Ton :{" "}
                              <span style={{ color: "red" }}>
                                {" "}
                                {toatlData?.toatlValueBufferQty}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="text-bold"
                          >
                            <span>
                              Total LabourRequirement :{" "}
                              <span style={{ color: "red" }}>
                                {" "}
                                {toatlData?.toatlValueLabourRequirement}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="text-bold"
                          >
                            <span>
                              Total LabourPresent :{" "}
                              <span style={{ color: "red" }}>
                                {" "}
                                {toatlData?.toatlValueLabourPresent}
                              </span>
                            </span>
                          </div>
                          <div
                            style={{ fontSize: "13px", fontWeight: "bold" }}
                            className="text-bold"
                          >
                            <span>
                              Total Lighter Waiting :{" "}
                              <span style={{ color: "red" }}>
                                {" "}
                                {toatlData?.toatlValueLighterWaiting}
                              </span>
                            </span>
                          </div>
                        </div>
                        <div className="col-lg-12">
                          <div className="table-responsive">
                            <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                              <thead>
                                <tr>
                                  <th style={{ width: "20px" }}>Sl</th>
                                  <th>
                                    <input
                                      type="checkbox"
                                      checked={
                                        shipPointData?.length > 0 &&
                                        shipPointData?.every(
                                          (item) => item?.isSelected
                                        )
                                      }
                                      onChange={(e) => {
                                        setShipPointData(
                                          shipPointData?.map((item) => {
                                            return {
                                              ...item,
                                              isSelected: e?.target?.checked,
                                            };
                                          })
                                        );
                                      }}
                                    />
                                  </th>
                                  <th>Ghat Name</th>
                                  <th>Demand Vehicle</th>
                                  {/* <th>Receive Vehicle</th>
                                <th>Truck Loaded</th> */}
                                  <th>Packing MT</th>
                                  <th>Dump Qty Ton</th>
                                  <th>Labour Requirement</th>
                                  <th>Labour Present</th>
                                  <th>Lighter Waiting</th>
                                </tr>
                              </thead>
                              <tbody>
                                {shipPointData?.length > 0 &&
                                  shipPointData?.map((item, index) => (
                                    <tr key={index}>
                                      <td>{index + 1}</td>
                                      <td>
                                        <input
                                          type="checkbox"
                                          value={item?.isSelected}
                                          checked={item?.isSelected}
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["isSelected"] =
                                              e.target.checked;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                      <td>{item?.label}</td>
                                      <td>
                                        <InputField
                                          value={item?.demandVehicle || 0}
                                          min="0"
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["demandVehicle"] = +e
                                              .target.value;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                      {/* <td>
                                      <InputField
                                        value={item?.receiveVehicle || 0}
                                        min="0"
                                        onChange={(e) => {
                                          const data = [...shipPointData];
                                          data[index]["receiveVehicle"] = +e
                                            .target.value;
                                          setShipPointData(data);
                                        }}
                                      />
                                    </td> */}
                                      {/* <td>
                                      <InputField
                                        value={item?.truckLoaded || 0}
                                        min="0"
                                        onChange={(e) => {
                                          const data = [...shipPointData];
                                          data[index]["truckLoaded"] = +e.target
                                            .value;
                                          setShipPointData(data);
                                        }}
                                      />
                                    </td> */}
                                      <td>
                                        <InputField
                                          value={item?.packingMt || 0}
                                          min="0"
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["packingMt"] = +e.target
                                              .value;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <InputField
                                          value={item?.bufferQty || 0}
                                          min="0"
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["bufferQty"] = +e.target
                                              .value;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <InputField
                                          value={item?.labourRequired || 0}
                                          min="0"
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["labourRequired"] = +e
                                              .target.value;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <InputField
                                          value={item?.labourPresent || 0}
                                          min="0"
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["labourPresent"] = +e
                                              .target.value;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                      <td>
                                        <InputField
                                          value={item?.lighterWaiting || 0}
                                          min="0"
                                          onChange={(e) => {
                                            const data = [...shipPointData];
                                            data[index]["lighterWaiting"] = +e
                                              .target.value;
                                            setShipPointData(data);
                                          }}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
              </>
            </Form>
          </ICustomCard>
        )}
      </Formik>
    </>
  );
}
