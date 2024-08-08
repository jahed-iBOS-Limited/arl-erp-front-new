import React, { useEffect, useState } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import { useParams } from "react-router";
import { ExcelRenderer } from "react-excel-renderer";
import { toast } from "react-toastify";
import { APIUrl } from "../../../../../App";
import {
  getBusinessUnitSalesOrgApi,
  getItemSalesByChannelDDL,
  getRegionAreaTerritory,
  GetSalesTargetEntry,
  getUoMitemPlantWarehouseDDL_api,
} from "../helper";
import Table from "./table";
import { _dateFormatter } from "../../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../../_helper/_fixedPoint";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

const validationSchema = Yup.object().shape({
  targetMonth: Yup.object().shape({
    label: Yup.string().required("Target Month  is required"),
    value: Yup.string().required("Target Month  is required"),
  }),
  targetYear: Yup.object().shape({
    label: Yup.string().required("Target Year  is required"),
    value: Yup.string().required("Target Year  is required"),
  }),
  targetStartDate: Yup.string().required("Target Start Date is required"),

  targetEndDate: Yup.string().required("Target End Date is required"),
});

export default function _Form({
  initData,
  btnRef,
  saveHandler,
  singleRowData,
  resetBtnRef,
  targetYearsDDL,
  monthDDL,
  isEdit,
  setRowDto,
  rowDto,
  rate,
  itemListByPartner,
  distributionChannelDDL,
  selectedBusinessUnit,
  profileData,
  setLoading,
  buSetOne,
}) {
  const { approveid } = useParams();
  const hiddenFileInput = React.useRef(null);
  const [fileObject, setFileObject] = useState("");
  const [regionDDL, setRegionDDL] = useState([]);
  const [areaDDL, setAreaDDL] = useState([]);
  const [salesOrgDDL, setSalesOrgDDL] = useState([]);
  const [itemDDL, setItemDDL] = useState([]);
  const [territoryDDl, getTerritory, , setTerritory] = useAxiosGet();

  React.useEffect(() => {
    if (isEdit) {
      setRowDto(singleRowData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleRowData]);

  const removeHandler = (index) => {
    let newRowData = rowDto.filter((item, i) => index !== i);
    setRowDto(newRowData);
  };

  useEffect(() => {
    if (selectedBusinessUnit?.value && profileData?.accountId) {
      getBusinessUnitSalesOrgApi(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        setSalesOrgDDL
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBusinessUnit, profileData]);
  useEffect(() => {
    if (itemListByPartner.length > 0 && !isEdit) {
      const modifiedData = itemListByPartner?.map((itm) => ({
        itemId: itm?.itemId,
        itemName: itm?.itemName,
        itemCode: itm?.itemCode,
        uom: itm?.uomId,
        uomname: itm?.uomName,
        targetQuantity: 0,
        itemSalesRate: itm?.itemRate,
        amount: itm?.itemRate * 0,
        uomCode: itm?.uomCode,
      }));
      setRowDto(modifiedData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemListByPartner]);

  const rowDtoHandler = (e, sl) => {
    const cloneArray = [...rowDto];
    cloneArray[sl][e.target?.name] =
      e?.target?.name === "isSelected" ? e?.target?.checked : e.target?.value;
    // cloneArray[sl].amount = cloneArray[sl]?.itemSalesRate * e.target?.value;
    cloneArray[sl].amount =
      e?.target?.name === "isSelected"
        ? cloneArray[sl].amount
        : cloneArray[sl]?.itemSalesRate * e.target?.value;
    setRowDto([...cloneArray]);
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  useEffect(() => {
    if (fileObject) {
      ExcelRenderer(fileObject, (err, resp) => {
        if (err) {
          toast.warning("An unexpected error occurred");
        } else {
          const modify = resp.rows?.slice(1)?.map((itm, index) => {
            return {
              itemId: itm[1],
              itemName: itm[3],
              itemCode: itm[2],
              uom: itm[4],
              uomname: itm[6],
              targetQuantity: itm[7] || 0,
              itemSalesRate: itm[8] || 0,
              amount: itm[8] * itm[7] || 0,
              uomCode: itm[5],
            };
          });

          setRowDto(modify);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileObject]);

  useEffect(() => {
    if (isEdit && initData?.distributionChannel?.value) {
      getRegionAreaTerritory({
        channelId: initData?.distributionChannel?.value,
        setter: setRegionDDL,
        setLoading: setLoading,
        value: "regionId",
        label: "regionName",
      });
      getItemSalesByChannelDDL(
        profileData?.accountId,
        selectedBusinessUnit?.value,
        initData?.distributionChannel?.value,
        initData?.salesOrg?.value,
        setItemDDL
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit]);

  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={{
          ...initData,
          rate: rate,
          salesOrg: salesOrgDDL?.[0] || "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, rowDto, () => {
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
          isValid,
        }) => (
          <>
            <Form className="form form-label-right">
              <div className="global-form p-2">
                <div className="form-group row">
                  {approveid && (
                    <div
                      className="col-lg-2 offset-5 approvalChackBox d-flex"
                      style={{
                        marginTop: "-45px",
                        position: "absolute",
                      }}
                    >
                      <span className="mr-2" style={{ fontWeight: "bold" }}>
                        Approval
                      </span>
                      <Field
                        type="checkbox"
                        name="approval"
                        checked={values?.approval}
                        onChange={(e) => {
                          setFieldValue("approval", e.target.checked);
                        }}
                      />
                    </div>
                  )}

                  <div className="col-lg-3">
                    <InputField
                      value={values?.sbu?.label}
                      label="SBU"
                      name="sbu"
                      type="text"
                      disabled={true}
                    />
                  </div>
                  {!buSetOne && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.businessPartner}
                        label="Business Partner"
                        name="businessPartnerName"
                        type="text"
                        disabled={true}
                      />
                    </div>
                  )}
                  {!buSetOne ? (
                    <div className="col-lg-3">
                      <InputField
                        value={rowDto.reduce((a, b) => a + b.amount, 0)}
                        label="Total Target Amount"
                        name="totalTargetAmount"
                        type="text"
                        disabled={true}
                      />
                    </div>
                  ) : (
                    <div className="col-lg-3 mt-5">
                      <h6>
                        Total Target Qty:{" "}
                        {rowDto
                          ?.filter((element) => element?.isSelected)
                          ?.reduce((a, b) => a + +b.targetQty, 0)}
                      </h6>
                    </div>
                  )}
                </div>
                <div className="form-group row">
                  <div className="col-lg-3">
                    <NewSelect
                      name="targetMonth"
                      options={monthDDL || []}
                      value={values?.targetMonth}
                      label="Target Month"
                      onChange={(valueOption) => {
                        setFieldValue("targetMonth", valueOption);
                        // setRowDto([]);
                        setFieldValue(
                          "targetStartDate",
                          _dateFormatter(
                            new Date(
                              values?.targetYear?.label ||
                                new Date().getFullYear(),
                              valueOption?.value - 1,
                              1
                            )
                          )
                        );
                        setFieldValue(
                          "targetEndDate",
                          _dateFormatter(
                            new Date(
                              values?.targetYear?.label ||
                                new Date().getFullYear(),
                              valueOption?.value,
                              0
                            )
                          )
                        );
                      }}
                      placeholder="Target Month"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  <div className="col-lg-3">
                    <NewSelect
                      name="targetYear"
                      options={targetYearsDDL || []}
                      value={values?.targetYear}
                      label="Target Year"
                      onChange={(valueOption) => {
                        setFieldValue("targetYear", valueOption);
                        // setRowDto([]);
                        setFieldValue(
                          "targetStartDate",
                          _dateFormatter(
                            new Date(
                              valueOption?.label,
                              values?.targetMonth?.value - 1 ||
                                new Date().getMonth(),
                              1
                            )
                          )
                        );
                        setFieldValue(
                          "targetEndDate",
                          _dateFormatter(
                            new Date(
                              valueOption?.label,
                              values?.targetMonth?.value ||
                                new Date().getMonth(),
                              0
                            )
                          )
                        );
                      }}
                      placeholder="Select Target Year"
                      errors={errors}
                      touched={touched}
                      isDisabled={isEdit}
                    />
                  </div>
                  {!buSetOne && (
                    <>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.targetStartDate}
                          label="Target Start Date"
                          name="targetStartDate"
                          type="date"
                          disabled={isEdit}
                        />
                      </div>
                      <div className="col-lg-3">
                        <InputField
                          value={values?.targetEndDate}
                          label="Target End Date"
                          name="targetEndDate"
                          type="date"
                          disabled={isEdit}
                        />
                      </div>
                    </>
                  )}
                  {isEdit && (
                    <div className="col-lg-3">
                      <InputField
                        value={values?.distributionChannel?.label}
                        label="Distribution Channel"
                        name="distributionChannel"
                        type="text"
                        disabled
                      />
                    </div>
                  )}
                  {buSetOne && !isEdit && (
                    <>
                      <div className="col-lg-3">
                        <NewSelect
                          name="salesOrg"
                          options={salesOrgDDL}
                          value={values?.salesOrg}
                          label="Sales Org"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("salesOrg", valueOption);
                            setFieldValue("item", "");
                          }}
                          placeholder="Sales Org"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="distributionChannel"
                          options={distributionChannelDDL}
                          value={values?.distributionChannel}
                          label="Distribution Channel"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("distributionChannel", valueOption);
                            setFieldValue("region", "");
                            setFieldValue("area", "");
                            setFieldValue("item", "");
                            getRegionAreaTerritory({
                              channelId: valueOption?.value,
                              setter: setRegionDDL,
                              setLoading: setLoading,
                              value: "regionId",
                              label: "regionName",
                            });
                            getItemSalesByChannelDDL(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              valueOption?.value,
                              values?.salesOrg?.value,
                              setItemDDL
                            );
                          }}
                          placeholder="Distribution Channel"
                          errors={errors}
                          touched={touched}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="item"
                          options={itemDDL}
                          value={values?.item}
                          label="Item"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("item", valueOption);
                            getUoMitemPlantWarehouseDDL_api(
                              profileData?.accountId,
                              selectedBusinessUnit?.value,
                              0,
                              valueOption?.value,
                              setFieldValue
                            );
                          }}
                          placeholder="Item"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.distributionChannel}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="region"
                          options={regionDDL || []}
                          value={values?.region}
                          label="Region"
                          onChange={(valueOption) => {
                            setFieldValue("area", "");
                            setRowDto([]);
                            setFieldValue("region", valueOption);
                            if (valueOption) {
                              getRegionAreaTerritory({
                                channelId: values?.distributionChannel?.value,
                                regionId: valueOption?.value,
                                setter: setAreaDDL,
                                setLoading: setLoading,
                                value: "areaId",
                                label: "areaName",
                              });
                              getTerritory(
                                `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}&regionId=${valueOption?.value}&areaId=${values?.area?.value}`,
                                (data) => {
                                  const modifiedData = data?.map((item) => {
                                    return {
                                      ...item,
                                      value: item?.territoryId,
                                      label: item?.territoryName,
                                    };
                                  });
                                  setTerritory(modifiedData);
                                }
                              );
                            }
                          }}
                          placeholder="Region"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.distributionChannel}
                        />
                      </div>
                      <div className="col-lg-3">
                        <NewSelect
                          name="area"
                          options={areaDDL || []}
                          value={values?.area}
                          label="Area"
                          onChange={(valueOption) => {
                            setRowDto([]);
                            setFieldValue("area", valueOption);
                            getTerritory(
                              `/oms/TerritoryInfo/GetTerrotoryRegionAreaByChannel?channelId=${values?.distributionChannel?.value}&regionId=${values?.region?.value}&areaId=${valueOption?.value}`,
                              (data) => {
                                const modifiedData = data?.map((item) => {
                                  return {
                                    ...item,
                                    value: item?.territoryId,
                                    label: item?.territoryName,
                                  };
                                });
                                setTerritory(modifiedData);
                              }
                            );
                          }}
                          placeholder="Area"
                          errors={errors}
                          touched={touched}
                          isDisabled={!values?.region}
                        />
                      </div>
                      {selectedBusinessUnit?.value === 4 &&
                        values?.distributionChannel?.value !== 46 && (
                          <div className="col-lg-3">
                            <NewSelect
                              name="territory"
                              options={territoryDDl}
                              value={values?.territory}
                              label="Territory"
                              onChange={(valueOption) => {
                                setRowDto([]);
                                setFieldValue("territory", valueOption);
                              }}
                              placeholder="Territory"
                              errors={errors}
                              touched={touched}
                            />
                          </div>
                        )}
                      <div className="col-lg-3 mt-5">
                        <div className="d-flex">
                          <button
                            className="btn btn-primary"
                            type="button"
                            disabled={
                              !values?.area ||
                              !values?.salesOrg ||
                              !values?.uom ||
                              !values?.targetYear ||
                              !values?.targetMonth ||
                              !values?.sbu
                            }
                            onClick={() => {
                              setRowDto([]);
                              GetSalesTargetEntry(
                                profileData?.accountId,
                                selectedBusinessUnit?.value,
                                values,
                                setRowDto,
                                setLoading
                              );
                            }}
                          >
                            Target Entry
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                  <div className="col-lg-12"></div>
                  {!buSetOne && (
                    <div className="col-lg-5 mt-3 d-flex ">
                      <div className="mr-3">
                        <button
                          className="btn btn-primary "
                          onClick={handleClick}
                          type="button"
                          style={{
                            height: "30px",
                          }}
                        >
                          Import Excel
                        </button>
                        <input
                          type="file"
                          onChange={(e) => {
                            setFileObject(e.target.files[0]);
                            //getGenerateDataFormat_api(e.target.files)
                          }}
                          ref={hiddenFileInput}
                          style={{ display: "none" }}
                          accept=".csv, .ods, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                        />
                      </div>
                      <a
                        href={`${APIUrl}/domain/GenerateDataFormat/GenerateExcelDataFormat?name=Customer-Sales-Target&headlist=SL%2C%20Item%20Id%2C%20Item%20Code%2C%20Item%20Name%2C%20UoM%20Id%2C%20Uom%20Code%2C%20Uom%20Name%2C%20Target%20Quantity%2C%20%20Rate%20`}
                        alt=""
                        download
                      >
                        <button
                          className="btn btn-primary"
                          style={{
                            height: "30px",
                          }}
                          type="button"
                          onClick={(e) => {
                            setFileObject(e.target.files[0]);
                            // dispatch(
                            //   getGenerateExcelDataFormat_Action({
                            //     name: "string",
                            //     exexlHead: ["string"],
                            //   })
                            // );
                          }}
                        >
                          Export Excel
                        </button>
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <h4>
                Total Target Qty:{" "}
                {_fixedPoint(
                  rowDto
                    ?.filter((item) => item?.isSelected)
                    ?.reduce((a, b) => a + +b?.targetQuantity, 0),
                  true,
                  0
                )}
              </h4>

              {rowDto?.length > 0 && (
                <Table
                  removeHandler={removeHandler}
                  rowDto={rowDto}
                  rowDtoHandler={rowDtoHandler}
                  setRowDto={setRowDto}
                  buSetOne={buSetOne}
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
    </>
  );
}
