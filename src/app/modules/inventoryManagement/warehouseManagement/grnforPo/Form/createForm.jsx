import React, { useState } from "react";
import { Formik, Form, Field } from "formik";
import { validationSchema, initData } from "./helper";
import { shallowEqual, useSelector } from "react-redux";
import RowDtoTable from "./rowDtoTable";
import { toast } from "react-toastify";
import { ISelect } from "../../../../_helper/_inputDropDown";
import InputField from "../../../../_helper/_inputField";
import ICustomCard from "../../../../_helper/_customCard";

export default function ReceiveInvCreateForm({
  btnRef,
  resetBtnRef,
  disableHandler,
  landingData,
  history,
  isEdit,
}) {
  // eslint-disable-next-line no-unused-vars
  const [isDisabled, setDisabled] = useState(true);
  // const dispatch = useDispatch();
  const [rowDto, setRowDto] = useState([]);

  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  // redux store data
  const {
    referenceTypeDDL,
    referenceNoDDL,
    transactionTypeDDL,
    busiPartnerDDL,
    personelDDL,
    itemDDL,
    stockDDL,
    locationTypeDDL,
  } = useSelector((state) => state?.invTransa);

  //dispatch action creators
  // useEffect(() => {
  //   dispatch(getreferenceTypeDDLAction(landingData?.transGrup?.value));
  //   dispatch(
  //     getBusinessPartnerDDLAction(
  //       profileData.accountId,
  //       selectedBusinessUnit.value
  //     )
  //   );
  //   dispatch(
  //     getpersonnelDDLAction(profileData.accountId, selectedBusinessUnit.value)
  //   );
  //   dispatch(getStockDDLAction());
  //   dispatch(
  //     getLocationTypeDDLAction(
  //       profileData.accountId,
  //       selectedBusinessUnit.value,
  //       landingData?.plant?.value,
  //       landingData?.warehouse?.value
  //     )
  //   );
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [profileData.accountId, selectedBusinessUnit.value]);

  // const onChaneForRefType = (refTyp) => {
  //   dispatch(
  //     getreferenceNoDDLAction(
  //       refTyp.label,
  //       profileData.accountId,
  //       selectedBusinessUnit.value,
  //       landingData?.sbu?.value,
  //       landingData?.plant?.value,
  //       landingData?.warehouse?.value
  //     )
  //   );
  //   dispatch(
  //     getTransactionTypeDDLAction(landingData?.transGrup?.value, refTyp.value)
  //   );
  //   if(refTyp.label === "NA (Without Reference)"){
  //     dispatch(
  //       getItemDDLAction(
  //         profileData.accountId,
  //         selectedBusinessUnit.value,
  //         landingData?.plant?.value,
  //         landingData?.warehouse?.value
  //       )
  //     );
  //   }
  // };

  // const onChangeForRefNo = (refNo,values) =>{
  //     dispatch(getItemforReftypeAction(values.refType.label,refNo.value))
  // }

  //add row Dto Data
  const addRowDtoData = (values) => {
    if (values.isAllItem === false) {
      let data = rowDto?.find((data) => data?.itemId === values?.item?.value);
      if (data) {
        alert("Item Already added");
      } else {
        setRowDto([
          ...rowDto,
          {
            itemId: values.item.value,
            itemName: values.item.label,
            itemCode: values.item.code,
            uoMid: values.item.baseUoMId,
            uoMname: values.item.baseUoMName,
            refQty: values.item.refQty || 0,
            restQty: values.item.restQty || 0,
            location: "",
            stockType: "",
            quantity: "",
          },
        ]);
      }
    } else {
      let data = itemDDL?.map((data) => {
        return {
          itemId: data?.value,
          itemName: data.label,
          uoMid: data.baseUoMId,
          uoMname: data.baseUoMName,
          itemCode: data.code,
          refQty: data.refQty || 0,
          restQty: data.restQty || 0,
          location: "",
          stockType: "",
          quantity: "",
        };
      });
      setRowDto(data);
    }
  };

  // remove single data from rowDto
  const remover = (payload) => {
    const filterArr = rowDto.filter((itm) => itm?.itemId !== payload);
    setRowDto([...filterArr]);
  };

  // rowdto handler for catch data from row's input field in rowTable
  const rowDtoHandler = (name, value, sl) => {
    let data = [...rowDto];
    let _sl = data[sl];
    if (name === "quantity") {
      _sl[name] = +value;
    } else {
      _sl[name] = value;
    }
    setRowDto(data);
  };

  const saveHandler = async (values, cb) => {
    if (rowDto.length === 0) {
      toast.error("Please Add Item");
    } else {
      setDisabled(true);
      if (values && profileData?.accountId && selectedBusinessUnit?.value) {
      } else {
        setDisabled(false);
      }
    }
  };

  return (
    <ICustomCard title="Create GRN For PO" backHandler={() => history.goBack()}>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
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
            {disableHandler && disableHandler(!isValid)}
            <Form className="form form-label-right">
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Reference Type"
                    options={referenceTypeDDL}
                    value={values?.refType}
                    name="refType"
                    onChange={(value) => {
                      setFieldValue("refType", value);
                      // onChaneForRefType(value);
                      setFieldValue("refNo", "");
                      setFieldValue("transType", "");
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Reference No"
                    options={referenceNoDDL}
                    defaultValue={values?.refNo}
                    name="refNo"
                    onChange={(data) => {
                      setFieldValue("refNo", data);
                      // onChangeForRefNo(data,values)
                    }}
                    // setFieldValue={setFieldValue}
                    isDisabled={
                      values.refType.label === "NA (Without Reference)"
                    }
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Transaction Type"
                    options={transactionTypeDDL}
                    value={values?.transType}
                    name="transType"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Business Partner"
                    options={busiPartnerDDL}
                    value={values?.busiPartner}
                    name="busiPartner"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <ISelect
                    label="Personnel"
                    options={personelDDL}
                    value={values?.personnel}
                    name="personnel"
                    setFieldValue={setFieldValue}
                    errors={errors}
                    touched={touched}
                  />
                </div>
                <div className="col-lg-3">
                  <label>Comments</label>
                  <InputField
                    value={values?.remarks}
                    placeholder="Comments"
                    name="remarks"
                  />
                </div>
              </div>
              <div className="form-group row">
                <div className="col-lg-3">
                  <ISelect
                    label="Item"
                    options={itemDDL}
                    value={values.item}
                    name="item"
                    setFieldValue={setFieldValue}
                    isDisabled={values.isAllItem === true}
                    errors={errors}
                    touched={touched}
                  />
                </div>

                <div className="col-lg">
                  <Field
                    name={values.isAllItem}
                    component={() => (
                      <input
                        style={{
                          position: "absolute",
                          top: "36px",
                          left: "65px",
                        }}
                        disabled={
                          values.refType.label === "NA (Without Reference)"
                        }
                        id="poIsAllItem"
                        type="checkbox"
                        className="ml-2"
                        value={values.isAllItem || ""}
                        checked={values.isAllItem}
                        name="isAllItem"
                        onChange={(e) => {
                          setFieldValue("isAllItem", e.target.checked);
                          setFieldValue("item", "");
                        }}
                      />
                    )}
                    label="isAllItem"
                  />
                  <label
                    style={{
                      position: "absolute",
                      top: "28px",
                    }}
                  >
                    All Item
                  </label>

                  <button
                    type="button"
                    style={{ marginTop: "28px", transform: "translateX(95px)" }}
                    className="btn btn-primary ml-2"
                    onClick={() => addRowDtoData(values)}
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* RowDto table */}
              <RowDtoTable
                rowDtoHandler={rowDtoHandler}
                remover={remover}
                rowDto={rowDto}
                setRowDto={setRowDto}
                stockDDL={stockDDL}
                locationTypeDDL={locationTypeDDL}
                values={values}
              />

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
    </ICustomCard>
  );
}
