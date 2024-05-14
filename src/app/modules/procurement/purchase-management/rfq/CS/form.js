import React from "react";
import { Formik, Form, Field } from "formik";
import Select from "react-select";
import customStyles from "../../../../selectCustomStyle";
import toArray from "lodash/toArray";

// import { useLocation } from 'react-router-dom'

export default function _Form({
  btnRef,
  saveHandler,
  resetBtnRef,
  disableHandler,
  rowDto,
  supplierDDL,
  rowDtoHandler,
  initData,
  setSupplier,
  supplier,
  csGridData,
  rfqSupplier,
}) {
  // const { state: usersDDLdata } = useLocation()

  // useEffect(() => {
  //   console.log("hello")
  //   getSupplierNameDDLAction(profileData?.accountId, selectedBusinessUnit?.value, usersDDLdata?.sbu?.value, setsupplierNameDDL)
  // }, [profileData?.accountId, selectedBusinessUnit?.value])
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler({ ...values }, () => {
            // resetForm(initData);
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
            {disableHandler(!isValid)}
            <Form className="form form-label-right">
              {/* Row d tos one */}
              <div className="table-responsive">
                <table className="table table-striped table-bordered myTable">
                  <thead>
                    <tr className="align-middle">
                      <th rowSpan="2">SL</th>
                      <th rowSpan="2">Item name</th>
                      <th rowSpan="2">RFQ Qty.</th>
                      <th rowSpan="2">Select Supplier</th>
                      {rfqSupplier?.map((itm, index) => {
                        return <th colSpan="2">Supplier : {itm?.label}</th>;
                      })}
                      {/* {csGridData?.map((itm, index) => {
                      return (
                        <th colSpan="2">
                          Supplier : {itm?.supplierName},{itm?.supplierRefNo},{" "}
                          {itm?.supplierRefDate}
                        </th>
                      );
                    })} */}
                    </tr>
                    <tr className="align-middle">
                      {rfqSupplier?.map((itm, index) => {
                        return (
                          <>
                            <th>Rate</th>
                            <th>Value</th>
                          </>
                        );
                      })}
                    </tr>
                    {/* <th>
                        <Field
                          name="supplier"
                          placeholder="Select supplier"
                          label="Select supplier"
                          component={() => (
                            <Select
                              options={supplierDDL || []}
                              defaultValue={supplier}
                              onChange={(valueOption) => {
                                setFieldValue("supplier", valueOption);
                                setSupplier([valueOption]);
                              }}
                              isSearchable={true}
                              styles={customStyles}
                            />
                          )}
                        />
                      </th> */}
                  </thead>
                  <tbody>
                    {toArray(rowDto)?.map((td, index) => {
                      return index === rowDto.length - 1 ? (
                        <>
                          <tr key={index}>
                            <td> {rowDto.length} </td>
                            <td colSpan="3"> Total </td>
                            {/* <td> {td?.itemName} </td>
                        <td> {td?.rfqQty} </td>
                        <td>
                          <Field
                            name="supplier"
                            placeholder="Select supplier"
                            component={() => (
                              <Select
                                options={rfqSupplier || []}
                                defaultValue={rowDto[index]?.supplier}
                                onChange={(valueOption) => {
                                  setFieldValue("supplier", valueOption);
                                  rowDtoHandler("supplier", valueOption, index);
                                }}
                                isSearchable={true}
                                styles={customStyles}
                              />
                            )}
                          />
                        </td> */}
                            {td?.supplierList.map((sup, index) => {
                              return (
                                <>
                                  {sup?.isLowestRate ? (
                                    <>
                                      <td
                                        style={{
                                          background: "#87F86B",
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {" "}
                                        {sup?.rate}{" "}
                                      </td>
                                      <td
                                        style={{
                                          background: "#87F86B",
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {" "}
                                        {sup?.value}{" "}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td> {sup?.rate} </td>
                                      <td> {sup?.value} </td>
                                    </>
                                  )}
                                </>
                              );
                            })}

                            {/* <td
                          style={{ transform: "translateY(4px)" }}
                          className="disable-border"
                        >
                          <IInput
                            value={rowDto[index]?.comments}
                            name="comments"
                            onChange={(e) => {
                              rowDtoHandler("comments", e.target.value, index);
                            }}
                          />
                        </td> */}
                          </tr>
                        </>
                      ) : (
                        <>
                          <tr key={index}>
                            <td> {td?.sl} </td>
                            <td> {td?.itemName} </td>
                            <td> {td?.rfqQty} </td>
                            <td>
                              <Field
                                name="supplier"
                                placeholder="Select supplier"
                                component={() => (
                                  <Select
                                    options={rfqSupplier || []}
                                    defaultValue={rowDto[index]?.supplier}
                                    onChange={(valueOption) => {
                                      setFieldValue("supplier", valueOption);
                                      rowDtoHandler(
                                        "supplier",
                                        valueOption,
                                        index
                                      );
                                    }}
                                    isSearchable={true}
                                    styles={customStyles}
                                  />
                                )}
                              />
                            </td>
                            {td?.supplierList.map((sup, index) => {
                              return (
                                <>
                                  {sup?.isLowestRate ? (
                                    <>
                                      <td
                                        style={{
                                          background: "#87F86B",
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {" "}
                                        {sup?.rate}{" "}
                                      </td>
                                      <td
                                        style={{
                                          background: "#87F86B",
                                          color: "black",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        {" "}
                                        {sup?.value}{" "}
                                      </td>
                                    </>
                                  ) : (
                                    <>
                                      <td> {sup?.rate} </td>
                                      <td> {sup?.value} </td>
                                    </>
                                  )}
                                </>
                              );
                            })}

                            {/* <td
                          style={{ transform: "translateY(4px)" }}
                          className="disable-border"
                        >
                          <IInput
                            value={rowDto[index]?.comments}
                            name="comments"
                            onChange={(e) => {
                              rowDtoHandler("comments", e.target.value, index);
                            }}
                          />
                        </td> */}
                          </tr>
                        </>
                      );
                    })}
                  </tbody>
                </table>
              </div>

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
