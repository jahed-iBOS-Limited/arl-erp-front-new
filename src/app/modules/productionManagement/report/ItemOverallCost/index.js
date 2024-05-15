import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import IForm from "../../../_helper/_form";
import { _formatMoney } from "../../../_helper/_formatMoney";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
const initData = {};
const ItemOverallCost = () => {
  const [isDisabled] = useState(false);
  const [, setObjprops] = useState({});

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  const [plantDDL, getPlantDDL] = useAxiosGet();
  const [shopFloorDDL, getShopFloorDDL] = useAxiosGet();
  const [gridData, getGridData] = useAxiosGet();
  const [materialData, setMaterialData] = useState([]);
  const [overCostData, setOverCostData] = useState([]);
  const [lotSize] = useState(500);

  const perUnitCost =
    lotSize > 0
      ? overCostData.reduce((total, current) => total + current?.Amount, 0) /
        lotSize
      : 0;

  const grandTotal = gridData.reduce(
    (total, current) => total + current?.Amount,
    0
  );

  const materialTotal = materialData.reduce(
    (total, current) => total + current?.Amount,
    0
  );
  const overCostTotal = overCostData.reduce(
    (total, current) => total + current?.Amount,
    0
  );

  useEffect(() => {
    getPlantDDL(
      `/wms/BusinessUnitPlant/GetOrganizationalUnitUserPermission?UserId=${profileData.userId}&AccId=${profileData.accountId}&BusinessUnitId=${selectedBusinessUnit.value}&OrgUnitTypeId=7`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    getGridData(
      `/mes/ShopFloor/GetItemOverallCostReport?billOfMaterialId=307&warehouseId=28`
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profileData, selectedBusinessUnit]);

  useEffect(() => {
    const data = [...gridData]?.filter((item) => item?.IsMaterialCost);
    setMaterialData([...data]);
    const dataTwo = [...gridData]?.filter((item) => !item?.IsMaterialCost);
    setOverCostData([...dataTwo]);
  }, [gridData]);

  return (
    <IForm
      title="Item Overall Cost"
      getProps={setObjprops}
      isDisabled={isDisabled}
      isHiddenReset={true}
      isHiddenSave={true}
      isHiddenBack={true}
    >
      {isDisabled && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          // saveHandler(values, () => {
          //   resetForm(initData);
          // });
        }}
      >
        {({
          handleSubmit,
          resetForm,
          values,
          setFieldValue,
          isValid,
          errors,
          touched,
        }) => (
          <>
            <Form className="form form-label-right">
              {false && <Loading />}
              <div className="form-group row global-form">
                <div className="col-lg-3">
                  <NewSelect
                    name="plant"
                    options={plantDDL || []}
                    value={values?.plant}
                    label="Plant"
                    onChange={(valueOption) => {
                      setFieldValue("plant", valueOption);
                      getShopFloorDDL(
                        `/mes/MesDDL/GetShopfloorDDL?AccountId=${profileData.accountId}&BusinessUnitid=${selectedBusinessUnit.value}&PlantId=${valueOption?.value}`
                      );
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="shopFloor"
                    options={shopFloorDDL || []}
                    value={values?.shopFloor}
                    label="Shop Floor"
                    onChange={(valueOption) => {
                      setFieldValue("shopFloor", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="itemName"
                    options={[]}
                    value={values?.itemName}
                    label="Item Name"
                    onChange={(valueOption) => {
                      setFieldValue("itemName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div className="col-lg-3">
                  <NewSelect
                    name="bomName"
                    options={[]}
                    value={values?.bomName}
                    label="BoM Name"
                    onChange={(valueOption) => {
                      setFieldValue("bomName", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                    isDisabled={false}
                  />
                </div>
                <div style={{ marginTop: "19px" }} className="col-lg-8">
                  <div className="d-flex justify-content-between">
                    <div>
                      <b>Item Name: </b>
                    </div>
                    <div>
                      <b>UoM: </b>
                    </div>
                    <div>
                      <b>Lot Size: {lotSize}</b>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: "15px" }} className="col-lg-1 ml-5">
                  <button className="btn btn-primary">Show</button>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-lg-12">
                  <h5>
                    <b>Material Cost:</b>
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Material Code</th>
                          <th>Material Name</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {materialData.length > 0 &&
                          materialData.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td className="text-center">
                                {item?.MaterialCode}
                              </td>
                              <td>{item?.MaterialName}</td>
                              <td className="text-center">
                                {_formatMoney(item?.Amount)}
                              </td>
                            </tr>
                          ))}
                        {materialData.length > 0 && (
                          <>
                            <tr>
                              <td colspan="3">
                                <b>Total</b>
                              </td>
                              <td className="text-center">
                                {materialTotal.toFixed(4)}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="row mt-5">
                <div className="col-lg-12">
                  <h5>
                    <b>Overhead Cost:</b>
                  </h5>
                  <div className="table-responsive">
                    <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing">
                      <thead>
                        <tr>
                          <th style={{ width: "30px" }}>SL</th>
                          <th>Cost Center</th>
                          <th>Cost of Element</th>
                          <th>Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        {overCostData.length > 0 &&
                          overCostData.map((item, index) => (
                            <tr>
                              <td className="text-center">{index + 1}</td>
                              <td>{item?.CostCenter}</td>
                              <td>{item?.CostElement}</td>
                              <td className="text-center">
                                {_formatMoney(item?.Amount)}
                              </td>
                            </tr>
                          ))}
                        {overCostData.length > 0 && (
                          <>
                            <tr>
                              <td colspan="3">
                                <b>Total</b>
                              </td>
                              <td className="text-center">
                                {overCostTotal.toFixed(4)}
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">
                                <b>Grand Total</b>
                              </td>
                              <td className="text-center">
                                {grandTotal.toFixed(4)}
                              </td>
                            </tr>
                            <tr>
                              <td colspan="3">
                                <b>Per Unit Cost</b>
                              </td>
                              <td className="text-center">
                                {perUnitCost.toFixed(4)}
                              </td>
                            </tr>
                          </>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Form>
          </>
        )}
      </Formik>
    </IForm>
  );
};

export default ItemOverallCost;
