import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
// import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getHorizonDDL, getItemListSalesPlanDDL, getYearDDL } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { exportToCSV } from "./utils";
import { toast } from "react-toastify";
import IViewModal from "../../../../_helper/_viewModal";
import ViewModal from "../viewModal";

// Validation schema
const validationSchema = Yup.object().shape({
  profitCenter: Yup.object().shape({
    value: Yup.string().required("Profit Center is required"),
    label: Yup.string().required("Profit Center is required"),
  }),
  plant: Yup.object()
    .shape({
      value: Yup.string().required("Plant Name is required"),
      label: Yup.string().required("Plant Name is required"),
    })
    .required("Plant Name is required"),
  channel: Yup.object().shape({
    value: Yup.string().required("Distribution Channel is required"),
    label: Yup.string().required("Distribution Channel is required"),
  }),
  region: Yup.object().shape({
    value: Yup.string().required("Region is required"),
    label: Yup.string().required("Region is required"),
  }),
  area: Yup.object().shape({
    value: Yup.string().required("Area is required"),
    label: Yup.string().required("Area is required"),
  }),
  territory: Yup.object().shape({
    value: Yup.string().required("Territory is required"),
    label: Yup.string().required("Territory is required"),
  }),
  year: Yup.object().shape({
    value: Yup.string().required("Year is required"),
    label: Yup.string().required("Year is required"),
  }),
  horizon: Yup.object().shape({
    value: Yup.string().required("Planning Horizon is required"),
    label: Yup.string().required("Planning Horizon is required"),
  }),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  resetBtnRef,
  selectedBusinessUnit,
  profileData,
  rowDto,
  setRowDto,
  remover,
  plantDDL,
  yearDDL,
  setYearDDL,
  itemNameDDL,
  horizonDDL,
  setHorizonDDL,
  id,
  dataHandler,
  removeItem,
  channelDDL,
  regionDDL,
  areaDDL,
  territoryDDL,
  getRegionDDL,
  setRegionDDL,
  getAreaDDL,
  setAreaDDL,
  getTerritoryDDL,
  setTerritoryDDL,
  location,
  profitCenterDDl,
}) {
  const [fileObject, setFileObject] = useState("");
  const hiddenFileInput = React.useRef(null);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(20000);
  // eslint-disable-next-line no-unused-vars
  const [plant, setPlant] = React.useState({});
  const [isShowModal, setIsShowModal] = useState(false);

  useEffect(() => {
    if (fileObject) {
      ExcelRenderer(fileObject, (err, resp) => {
        if (err) {
        } else {
          let rowData = [];
          for (let i = 1; i < resp.rows.length; i++) {
            rowData.push({
              salesPlanRowId: resp.rows[i][0],
              salesPlanId: resp.rows[i][1],
              itemId: resp.rows[i][2],
              itemName: resp.rows[i][3],
              itemCode: resp.rows[i][4],
              bomname: resp.rows[i][5],
              bomid: resp.rows[i][6],
              uomName: resp.rows[i][7],
              uoMid: resp.rows[i][8],
              itemPlanQty: resp.rows[i][9],
              entryItemPlanQty: resp.rows[i][9],
              rate: resp.rows[i][10],
            });
          }

          setRowDto({
            ...rowDto,
            data: rowData,
            totalCount: rowDto?.totalCount,
          });
          toast.success("Successfully Uploaded!");
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileObject]);

  useEffect(() => {
    setRowDto(itemNameDDL.data);
    getItemListSalesPlanDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      initData?.plant?.value,
      pageNo,
      pageSize,
      setRowDto
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemNameDDL]);

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  //setPositionHandler
  const setPositionHandler = (pageNo, pageSize) => {
    getItemListSalesPlanDDL(
      profileData?.accountId,
      selectedBusinessUnit?.value,
      initData?.plant?.value,
      pageNo,
      pageSize,
      setRowDto
    );
  };

  console.log("row", rowDto);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            setRowDto([]);
            getItemListSalesPlanDDL(
              profileData?.accountId,
              selectedBusinessUnit?.value,
              values?.plant?.value,
              pageNo,
              pageSize,
              setRowDto
            );
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
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      isDisabled={true}
                      placeholder="Plant"
                      onChange={async (valueOption) => {
                        await setRowDto([]);
                        setFileObject("");
                        setFieldValue("plant", valueOption);
                        setPlant(valueOption);
                        getItemListSalesPlanDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          pageNo,
                          pageSize,
                          setRowDto
                        );
                        getYearDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          valueOption?.value,
                          setYearDDL
                        );
                        if (values?.year?.value) {
                          getHorizonDDL(
                            profileData?.accountId,
                            selectedBusinessUnit?.value,
                            valueOption?.value,
                            valueOption?.value,
                            setHorizonDDL
                          );
                        }
                      }}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  {console.log("errors", errors)}
                  <div className="col-lg-3">
                    <NewSelect
                      name="year"
                      options={yearDDL}
                      value={values?.year}
                      label="Year"
                      placeholder="Year"
                      onChange={(valueOption) => {
                        setFieldValue("year", valueOption);
                        setFileObject("");
                        setFieldValue("horizon", "");
                        getHorizonDDL(
                          profileData?.accountId,
                          selectedBusinessUnit?.value,
                          values?.plant?.value,
                          valueOption?.value,
                          setHorizonDDL
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL}
                      value={values?.horizon}
                      label="Planning Horizon"
                      placeholder="Planning Horizon"
                      onChange={(valueOption) => {
                        setFieldValue("horizon", valueOption);
                        setFieldValue(
                          "startDate",
                          _dateFormatter(valueOption?.startdatetime)
                        );
                        setFieldValue(
                          "endDate",
                          _dateFormatter(valueOption?.enddatetime)
                        );
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={true}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="profitCenter"
                      options={profitCenterDDl}
                      value={values?.profitCenter}
                      label="Profit Center"
                      placeholder="profit Center"
                      onChange={(valueOption) => {
                        setFieldValue("profitCenter", valueOption);
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={id}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="channel"
                      options={channelDDL || []}
                      value={values?.channel}
                      isDisabled={id}
                      label="Distribution Channel"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("channel", valueOption);
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          getRegionDDL(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${valueOption?.value ||
                              0}`,
                            (res) => {
                              const newDDL = res?.map((item) => ({
                                ...item,
                                value: item?.regionId,
                                label: item?.regionName,
                              }));
                              setRegionDDL(newDDL);
                            }
                          );
                          setAreaDDL([]);
                          setTerritoryDDL([]);
                        } else {
                          setFieldValue("channel", "");
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setRegionDDL([]);
                          setAreaDDL([]);
                          setTerritoryDDL([]);
                        }
                      }}
                      placeholder="Select Distribution Channel"
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="region"
                      options={regionDDL || []}
                      value={values?.region}
                      label="Region"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("region", valueOption);
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          getAreaDDL(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${
                              values?.channel?.value
                            }&regionId=${valueOption?.value || 0}`,
                            (res) => {
                              const newDDL = res?.map((item) => ({
                                ...item,
                                value: item?.areaId,
                                label: item?.areaName,
                              }));
                              setAreaDDL(newDDL);
                            }
                          );
                          setTerritoryDDL([]);
                        } else {
                          setFieldValue("region", "");
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setAreaDDL([]);
                          setTerritoryDDL([]);
                        }
                      }}
                      placeholder="Region"
                      isDisabled={!values?.channel || id}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="area"
                      options={areaDDL || []}
                      value={values?.area}
                      label="Area"
                      onChange={(valueOption) => {
                        if (valueOption) {
                          setFieldValue("area", valueOption);
                          setFieldValue("territory", "");
                          getTerritoryDDL(
                            `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${
                              values?.channel?.value
                            }&regionId=${
                              values?.region?.value
                            }&areaId=${valueOption?.value || 0}`,
                            (res) => {
                              const newDDL = res?.map((item) => ({
                                ...item,
                                value: item?.territoryId,
                                label: item?.territoryName,
                              }));
                              setTerritoryDDL(newDDL);
                            }
                          );
                        } else {
                          setFieldValue("area", "");
                          setFieldValue("territory", "");
                          setTerritoryDDL([]);
                        }
                      }}
                      placeholder="Area"
                      isDisabled={!values?.region || id}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="territory"
                      options={territoryDDL || []}
                      value={values?.territory}
                      label="Territory"
                      onChange={(valueOption) => {
                        setFieldValue("territory", valueOption);
                      }}
                      placeholder="Territory"
                      isDisabled={!values?.area || id}
                      errors={errors}
                      touched={touched}
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>Start Date</label>
                    <InputField
                      value={values?.startDate}
                      name="startDate"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-3">
                    <label>End Date</label>
                    <InputField
                      value={values?.endDate}
                      name="endDate"
                      type="text"
                      disabled
                    />
                  </div>
                </div>
              </div>

              <div className="global-form mt-4 d-flex">
                <div className="form-group row text-right">
                  <button
                    className="btn btn-primary"
                    onClick={handleClick}
                    type="button"
                    style={{
                      marginLeft: "10px",
                      height: "30px",
                    }}
                  >
                    Import Excel
                  </button>
                  <input
                    type="file"
                    onChange={(e) => {
                      setFileObject(e.target.files[0]);
                      e.target.value = "";
                    }}
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                  />
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    exportToCSV(rowDto?.data);
                  }}
                  type="button"
                  style={{
                    marginLeft: "20px",
                    height: "30px",
                  }}
                >
                  Export Excel
                </button>
                <div className="mt-5 ml-5">
                  <h4>
                    Monthly Total Sales Plan Quantity :{" "}
                    <span
                      onClick={() => {
                        setIsShowModal(true);
                      }}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                    >
                      {location?.state?.monthlyItem?.planQTY}
                    </span>
                  </h4>
                </div>
              </div>

              <div className="table-responsive">
<table className="global-table table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    <th>BOM</th>
                    <th>UoM Name</th>
                    <th>Sales Plan Quantity</th>
                    <th>Rate</th>
                    <th>Amount</th>
                    {/* <th>Action</th> */}
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.data?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="pl-2">{item?.itemName}</td>
                      <td className="pl-2">{item?.itemCode}</td>
                      <td style={{ width: "180px" }}>
                        {id ? (
                          item?.bomname || ""
                        ) : (
                          <>
                            {item?.isMultiple ? (
                              <NewSelect
                                name={`bom${index + 1}`}
                                options={item?.objBOMList}
                                value={item?.bom}
                                onChange={(valueOption) => {
                                  dataHandler(
                                    "bom",
                                    item,
                                    valueOption,
                                    setRowDto,
                                    rowDto
                                  );
                                }}
                                errors={errors}
                                touched={touched}
                                isDisabled={id ? true : false}
                              />
                            ) : (
                              item?.bomname
                            )}
                          </>
                        )}
                      </td>
                      <td className="text-center">{item?.uomName}</td>
                      <td style={{ width: "150px" }} className="text-center">
                        {id ? (
                          <input
                            type="number"
                            name="entryItemPlanQty"
                            value={+item?.entryItemPlanQty || ""}
                            onChange={(e) => {
                              if (+e.target.value < 0) {
                                return;
                              }
                              dataHandler(
                                "entryItemPlanQty",
                                item,
                                +e.target.value,
                                setRowDto,
                                rowDto
                              );
                            }}
                            className="quantity-field form-control"
                          />
                        ) : (
                          <input
                            type="number"
                            name="itemPlanQty"
                            value={+item?.itemPlanQty || ""}
                            onChange={(e) => {
                              if (+e.target.value < 0) {
                                return;
                              }
                              dataHandler(
                                "itemPlanQty",
                                item,
                                +e.target.value,
                                setRowDto,
                                rowDto
                              );
                            }}
                            className="quantity-field form-control"
                          />
                        )}
                      </td>
                      <td style={{ width: "150px" }} className="text-center">
                        <input
                          type="number"
                          name="rate"
                          value={+item?.rate || ""}
                          onChange={(e) => {
                            if (+e.target.value < 0) {
                              return;
                            }
                            dataHandler(
                              "rate",
                              item,
                              +e.target.value,
                              setRowDto,
                              rowDto
                            );
                          }}
                          className="quantity-field form-control"
                        />
                      </td>
                      <td className="text-center">
                        {id
                          ? (+item?.entryItemPlanQty || 0) * (+item?.rate || 0)
                          : (+item?.itemPlanQty || 0) * (+item?.rate || 0)}
                      </td>
                      {/* <td className="text-center">
                        <IDelete id={index} remover={() => remover(index)} />
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
</div>
              
              {!fileObject && !id && rowDto?.data?.length > 0 && (
                <PaginationTable
                  count={rowDto?.totalCount}
                  setPositionHandler={setPositionHandler}
                  paginationState={{
                    pageNo,
                    setPageNo,
                    pageSize,
                    setPageSize,
                  }}
                />
              )}
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
            <IViewModal
              show={isShowModal}
              backdrop={false}
              onHide={() => {
                setIsShowModal(false);
              }}
            >
              <ViewModal id={location?.state?.monthlyItem?.salesPlanId} />
            </IViewModal>
          </>
        )}
      </Formik>
    </>
  );
}
