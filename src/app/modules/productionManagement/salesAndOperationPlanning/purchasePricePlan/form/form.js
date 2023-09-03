import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { ExcelRenderer } from "react-excel-renderer";
import * as Yup from "yup";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import IDelete from "../../../../_helper/_helperIcons/_delete";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { getHorizonDDL, getItemListSalesPlanDDL, getYearDDL } from "../helper";
import PaginationTable from "./../../../../_helper/_tablePagination";
import { exportToCSV } from "./utils";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";
import Loading from "../../../../_helper/_loading";
import { toast } from "react-toastify";

// Validation schema
const validationSchema = Yup.object().shape({
  plant: Yup.object().shape({
    value: Yup.string().required("Plant Name is required"),
    label: Yup.string().required("Plant Name is required"),
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
  setItemNameDDL,
  horizonDDL,
  setHorizonDDL,
  id,
  dataHandler,
  removeItem,
}) {
  const [fileObject, setFileObject] = useState("");
  const hiddenFileInput = React.useRef(null);
  const [pageNo, setPageNo] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(50);
  const [plant, setPlant] = React.useState({});
  const [, getMrpPlanningInfo, mrpPlanningInfoLoader] = useAxiosGet();
  const [, getHeaderRowInfo, headerRowInfoLoader] = useAxiosGet();
  useEffect(() => {
    if (fileObject) {
      ExcelRenderer(fileObject, (err, resp) => {
        if (err) {
        } else {
          let rowData = [];
          for (let i = 1; i < resp.rows.length; i++) {
            rowData.push({
              salesPlanRowId: 0,
              bomid: resp.rows[i][4],
              bomname: resp.rows[i][3],
              itemCode: resp.rows[i][2],
              itemId: resp.rows[i][0],
              itemName: resp.rows[i][1],
              itemPlanQty: resp.rows[i][7],
              rate: resp.rows[i][8],
              uomName: resp.rows[i][5],
              uomid: resp.rows[i][6],
            });
          }
          setRowDto({
            ...rowDto,
            data: rowData,
            totalCount: rowDto?.totalCount,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileObject]);

  useEffect(() => {
    setRowDto(itemNameDDL.data);
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
      plant?.value,
      pageNo,
      pageSize,
      setRowDto
    );
  };

  const updateRequiredQuantity = (values, valueOption) => {
    getMrpPlanningInfo(

      // `/mes/SalesPlanning/GetMrplanningInfoDetail?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value}&PlantId=${values?.plant?.value}&PlanningHorizonId=${values?.year?.planningHorizonId}&PlanningHorizonRowId=${valueOption?.value}`

      `/fino/BudgetFinancial/GetMaterialRequirementPlanningByMonth?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&yearId=${values?.year?.value}&monthId=${valueOption?.monthId}`
      
      ,(resMrplanningInfo) => {
        // let actualItemMonthWise = resMrplanningInfo
        // console.log("actualItemMonthWise", actualItemMonthWise)
        getHeaderRowInfo(`/mes/SalesPlanning/GetPurchaseRateDetails?AccountId=${profileData?.accountId}&BusinessUnitId=${selectedBusinessUnit?.value
          }&PlantId=${values?.plant?.value}&PlanningHorizonId=${values?.year?.planningHorizonId}&PlanningHorizonRowId=${valueOption?.value}`, (resPurchaseRate) => {
            const modifiedRowDto = rowDto?.data?.map(itm => {
              const actualItemMonthWiseMathch = resMrplanningInfo.find(itm2 => itm2?.intItemId === itm?.itemId)
              const resPurchaseRateMatch = resPurchaseRate.find(itm2 => itm2?.itemId === itm?.itemId)
              return {
                ...itm,
                itemPlanQty: actualItemMonthWiseMathch?.numMRPQty || 0,
                entryItemPlanQty: resPurchaseRateMatch?.purchaseQuantity || 0,
                intPurchasePlanId: resPurchaseRateMatch?.intPurchasePlanId || 0,
                intPurchasePlanRowId: resPurchaseRateMatch?.intPurchasePlanRowId || 0,
                rate: resPurchaseRateMatch?.numRate || 0,
              }
            })
            setRowDto({ ...rowDto, data: modifiedRowDto })

          }, (err) => {
            // if GetPurchaseRateDetails error
            const modifiedRowDto = rowDto?.data?.map(itm => {
              const actualItemMonthWiseMathch = resMrplanningInfo.find(itm2 => itm2?.intItemId === itm?.itemId)
              return {
                ...itm,
                itemPlanQty: actualItemMonthWiseMathch?.numMRPQty || 0,
                entryItemPlanQty: 0,
                intPurchasePlanId: 0,
                intPurchasePlanRowId: 0,
                rate: 0,
              }
            })
            setRowDto({ ...rowDto, data: modifiedRowDto })
          })

      },
      (err) => {
        // if GetMrplanningInfoDetail error
        toast.error(err?.response?.data?.message);
        const modifiedRowDto = rowDto?.data?.map(itm => {
          return {
            ...itm,
            itemPlanQty: 0,
            entryItemPlanQty: 0,
            intPurchasePlanId: 0,
            intPurchasePlanRowId: 0,
            rate: 0,
          }
        })
        setRowDto({ ...rowDto, data: modifiedRowDto })

      }
    );


  };

  return (
    <div>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm(initData);
            setRowDto([]);
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
            {(mrpPlanningInfoLoader || headerRowInfoLoader) && <Loading />}
            {/* {console.log("values: ", values)} */}
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  <div className="col-lg-4">
                    <NewSelect
                      name="plant"
                      options={plantDDL}
                      value={values?.plant}
                      label="Plant"
                      placeholder="Plant"
                      onChange={async (valueOption) => {
                        if (valueOption) {
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
                        } else {
                          setYearDDL([])
                        }

                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={id ? true : false}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="year"
                      options={yearDDL}
                      value={values?.year}
                      label="Year"
                      placeholder="Year"
                      onChange={(valueOption) => {
                        if (valueOption) {
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
                        } else {
                          setHorizonDDL([])
                        }
                      }}
                      errors={errors}
                      touched={touched}
                      isDisabled={(id || !rowDto?.data?.length) ? true : false}
                    />
                  </div>
                  <div className="col-lg-4">
                    <NewSelect
                      name="horizon"
                      options={horizonDDL}
                      value={values?.horizon}
                      label="Planning Horizon"
                      placeholder="Planning Horizon"
                      onChange={(valueOption) => {
                        updateRequiredQuantity(values, valueOption)
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
                      isDisabled={(id || !values?.year) ? true : false}
                    />
                  </div>
                  <div className="col-lg-4">
                    <label>Start Date</label>
                    <InputField
                      value={values?.startDate}
                      name="startDate"
                      type="text"
                      disabled
                    />
                  </div>
                  <div className="col-lg-4">
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
                    exportToCSV(rowDto?.data)
                  }}
                  type="button"
                  style={{
                    marginLeft: "20px",
                    height: "30px",
                  }}
                >
                  Export Excel
                </button>
              </div>

              <table className="global-table table">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Item Name</th>
                    <th>Item Code</th>
                    {/* <th>BOM</th> */}
                    <th>UoM Name</th>
                    <th>MRP Quantity</th>
                    <th>Purchase Quantity</th>
                    <th>Rate</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {rowDto?.data?.map((item, index) => (
                    <tr key={index}>
                      <td className="text-center">{index + 1}</td>
                      <td className="pl-2">{item?.itemName}</td>
                      <td className="pl-2">{item?.itemCode}</td>
                      <td className="text-center">{item?.uomName}</td>
                      <td className="text-center">{item?.itemPlanQty}</td>
                      <td style={{ width: "150px" }} className="text-center">
                        <input
                          type="number"
                          name="entryItemPlanQty"
                          value={+item?.entryItemPlanQty || ""}
                          onChange={(e) => {
                            if (+e.target.value < 0) {
                              return
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
                          disabled={item?.itemPlanQty > 0 ? false : true}
                        />
                      </td>
                      <td style={{ width: "150px" }} className="text-center">
                        <input
                          type="number"
                          name="rate"
                          value={+item?.rate || ""}
                          onChange={(e) => {
                            if (+e.target.value < 0) {
                              return
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
                          disabled={item?.itemPlanQty > 0 ? false : true}
                        />
                      </td>
                      <td className="text-center">
                        <IDelete id={index} remover={() => remover(index)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
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
          </>
        )}
      </Formik>
    </div>
  );
}
