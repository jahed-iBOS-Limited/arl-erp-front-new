import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
// import RATForm from "../../../../_helper/commonInputFieldsGroups/ratForm";
import YearMonthForm from "../../../../_helper/commonInputFieldsGroups/yearMonthForm";
import IButton from "../../../../_helper/iButton";
import ICustomCard from "../../../../_helper/_customCard";
import InputField from "../../../../_helper/_inputField";
import NewSelect from "../../../../_helper/_select";
import {
  getEmployeeRAT,
  getMonthlyCollectionPlanData,
  weekList,
} from "../helper";
import { generateDataset } from "./helper";
import useAxiosGet from "../../../../_helper/customHooks/useAxiosGet";

export default function _Form({
  type,
  buId,
  accId,
  title,
  history,
  rowData,
  initData,
  allSelect,
  setLoading,
  selectedAll,
  saveHandler,
  setRowData,
  rowDataHandler,
  landingValues,
  dailyCollectionData,
  setDailyCollectionData,
  userId,
}) {
  const [perDayCollect, setPerDayCollect] = useState(0);
  const [regionList, getRegionList, , setRegionList] = useAxiosGet();
  const [areaList, getAreaList, , setAreaList] = useAxiosGet();
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const total = dailyCollectionData.reduce(
      (total, item) => (item.isSelected ? total + item.targetAmount : total),
      0
    );
    setTotal(total || 0);
  }, [dailyCollectionData]);

  useEffect(() => {
    getRegionList(
      `/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${buId}&userId=${userId}&typeName=Region`,
      (res) => {
        const data = res.map((item) => ({
          ...item,
          value: item?.regionId,
          label: item?.regionName,
        }));

        setRegionList(data);
      }
    );
  }, []);

  useEffect(() => {
    if (dailyCollectionData?.length > 0) {
      const data = [...dailyCollectionData];
      const modifyData = data.map((item) => ({
        ...item,
        targetAmount: item?.isHoliday ? 0 : +perDayCollect || 0,
      }));
      setDailyCollectionData(modifyData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [perDayCollect]);
  return (
    <>
      <Formik
        enableReinitialize={true}
        initialValues={initData}
        onSubmit={() => {}}
      >
        {({ resetForm, values, errors, touched, setFieldValue }) => (
          <>
            <ICustomCard
              title={title}
              backHandler={() => {
                history.goBack();
              }}
              resetHandler={() => {
                resetForm();
              }}
              saveHandler={() => {
                saveHandler(values, () => {
                  resetForm();
                  setRowData([]);
                });
              }}
            >
              <Form className="form form-label-right">
                {[1].includes(landingValues?.type?.value) ? (
                  <>
                    <div className="global-form global-form-custom">
                      <div className="row">
                        <div className="col-lg-3">
                          <NewSelect
                            name="region"
                            options={regionList || []}
                            value={values?.region}
                            label="Region"
                            onChange={(valueOption) => {
                              setFieldValue("region", valueOption || "");
                              setFieldValue("area", "");
                              setAreaList([]);
                              if (valueOption) {
                                getAreaList(
                                  `/oms/SalesInformation/GetUserWiseRegionAreaTerritoryDDL?businessUnitId=${buId}&userId=${userId}&typeName=Area&regionId=${valueOption?.value}`,
                                  (res) => {
                                    const data = res.map((item) => ({
                                      ...item,
                                      value: item?.areaId,
                                      label: item?.areaName,
                                    }));

                                    setAreaList(data);
                                  }
                                );
                              }
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <NewSelect
                            name="area"
                            options={areaList || []}
                            value={values?.area}
                            label="Area"
                            onChange={(valueOption) => {
                              setFieldValue("area", valueOption || "");
                            }}
                            errors={errors}
                            touched={touched}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            value={values?.monthYear}
                            name="monthYear"
                            label="Month & Year"
                            type="month"
                            onChange={(e) => {
                              setFieldValue("monthYear", e?.target?.value);
                            }}
                          />
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-lg-3">
                          <InputField
                            disabled={!dailyCollectionData?.length}
                            value={values?.totalPlanTaka}
                            name="totalPlanTaka"
                            label="Total Plan Taka"
                            type="number"
                            onChange={(e) => {
                              if (+e.target.value < 0) return;
                              setFieldValue("totalPlanTaka", e?.target?.value);
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <InputField
                            disabled={
                              !dailyCollectionData?.length ||
                              !values?.totalPlanTaka
                            }
                            value={values?.workingDays}
                            name="workingDays"
                            label="Working Days"
                            type="number"
                            onChange={(e) => {
                              if (
                                +e.target.value < 0 ||
                                values?.totalPlanTaka?.value < +e.target.value
                              )
                                return;
                              setFieldValue("workingDays", e?.target?.value);
                              setPerDayCollect(
                                values?.totalPlanTaka > 0 && +e.target.value > 0
                                  ? +values?.totalPlanTaka / +e.target.value
                                  : 0
                              );
                            }}
                          />
                        </div>
                        <div className="col-lg-3">
                          <p className="text-bold mt-5 text-primary">
                            Per Day Collect :{perDayCollect}
                          </p>
                        </div>
                      </div>

                      <div className="col-lg-3">
                        <button
                          disabled={!values?.monthYear}
                          type="button"
                          onClick={() => {
                            if (!values?.monthYear) return;
                            const data = generateDataset(
                              values?.monthYear?.split("-")[1],
                              values?.monthYear?.split("-")[0],
                              ["Friday", "Saturday"]
                            );
                            setDailyCollectionData(data);
                          }}
                          className="btn btn-primary mt-5"
                        >
                          View
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="text-right">Total: {total}</h4>
                    </div>
                    {dailyCollectionData.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                          <thead>
                            <tr>
                              <th>
                                <input
                                  type="checkbox"
                                  checked={
                                    dailyCollectionData?.length > 0
                                      ? dailyCollectionData?.every(
                                          (item) => item?.isSelected
                                        )
                                      : false
                                  }
                                  onChange={(e) => {
                                    setDailyCollectionData(
                                      dailyCollectionData?.map((item) => {
                                        return {
                                          ...item,
                                          isSelected: e?.target?.checked,
                                        };
                                      })
                                    );
                                  }}
                                />
                              </th>
                              <th>SL</th>
                              <th>Date</th>
                              <th>Day</th>
                              <th>Target Amount</th>
                            </tr>
                          </thead>
                          <tbody>
                            {dailyCollectionData?.map((item, index) => (
                              <tr key={index}>
                                <td className="text-center align-middle">
                                  <input
                                    type="checkbox"
                                    checked={item?.isSelected}
                                    onChange={(e) => {
                                      item["isSelected"] = e.target.checked;
                                      setDailyCollectionData([
                                        ...dailyCollectionData,
                                      ]);
                                    }}
                                  />
                                </td>
                                <td>{index + 1}</td>
                                <td className="text-center">{item?.date}</td>
                                <td
                                  className={
                                    item?.isHoliday ? "bg-dark text-danger" : ""
                                  }
                                >
                                  {item?.dayName}
                                </td>
                                <td className="text-center">
                                  <InputField
                                    disabled={item?.isHoliday}
                                    value={item?.targetAmount || ""}
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      const data = [...dailyCollectionData];
                                      data[index]["targetAmount"] = +e.target
                                        .value;
                                      setDailyCollectionData(data);
                                    }}
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="row global-form global-form-custom">
                    <div className="col-lg-3">
                      <NewSelect
                        name="salesman"
                        options={[]}
                        value={values?.salesman}
                        label="Salesman Name"
                        onChange={(e) => {}}
                        placeholder="Salesman Name"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="designation"
                        options={[]}
                        value={values?.designation}
                        label="Designation"
                        onChange={(e) => {}}
                        placeholder="Designation"
                        errors={errors}
                        touched={touched}
                        isDisabled={true}
                      />
                    </div>
                    <YearMonthForm
                      obj={{ values, setFieldValue, setRowData }}
                    />
                    {/* <RATForm obj={{ values, setFieldValue }} /> */}
                    <div className="col-lg-3">
                      <NewSelect
                        name="area"
                        value={values?.area}
                        label="Area"
                        placeholder="Area"
                        isDisabled={true}
                      />
                    </div>
                    <div className="col-lg-3">
                      <NewSelect
                        name="territory"
                        value={values?.territory}
                        label="Territory"
                        placeholder="Territory"
                        isDisabled={true}
                      />
                    </div>
                    <IButton
                      onClick={() => {
                        getEmployeeRAT(
                          values?.salesman?.value,
                          setLoading,
                          (RAT) => {
                            getMonthlyCollectionPlanData(
                              1,
                              accId,
                              buId,
                              values?.salesman?.value,
                              setRowData,
                              setLoading,
                              RAT
                            );
                            setFieldValue("area", {
                              value: RAT?.areaId,
                              label: RAT?.areaName,
                            });
                            setFieldValue("territory", {
                              value: RAT?.territoryId,
                              label: RAT?.territoryName,
                            });
                          }
                        );
                      }}
                      disabled={!values?.month}
                    />
                  </div>
                )}
              </Form>

              {rowData?.length > 0 && (
                <table
                  id="table-to-xlsx"
                  className={
                    "table table-striped table-bordered mt-3 bj-table bj-table-landing table-font-size-sm"
                  }
                >
                  <thead>
                    <tr className="cursor-pointer">
                      <th
                        onClick={() => allSelect(!selectedAll())}
                        style={{ width: "30px" }}
                        rowSpan={2}
                      >
                        <input
                          type="checkbox"
                          value={selectedAll()}
                          checked={selectedAll()}
                          onChange={() => {}}
                        />
                      </th>
                      <th rowSpan={2}>SL</th>
                      <th rowSpan={2}>Client ID</th>
                      <th rowSpan={2}>Client Name</th>
                      <th rowSpan={2}>Area</th>
                      <th rowSpan={2}>Territory</th>
                      <th rowSpan={2}>Total Dues</th>
                      <th rowSpan={2}>Overdue</th>
                      <th rowSpan={2}>OD %</th>
                      <th colSpan={6}>Collection Plan</th>
                    </tr>
                    <tr>
                      {values?.month &&
                        weekList(values?.month?.value)?.map((item, i) => {
                          return (
                            <th style={{ width: "120px" }} key={i}>
                              {item}
                            </th>
                          );
                        })}
                      <th>Total</th>
                      <th>%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rowData?.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td
                            onClick={() => {
                              rowDataHandler(
                                "isSelected",
                                index,
                                !item.isSelected
                              );
                            }}
                            className="text-center"
                            style={
                              item?.isSelected
                                ? {
                                    backgroundColor: "#aacae3",
                                    width: "30px",
                                  }
                                : { width: "30px" }
                            }
                          >
                            <input
                              type="checkbox"
                              value={item?.isSelected}
                              checked={item?.isSelected}
                              onChange={() => {}}
                            />
                          </td>

                          <td style={{ width: "30px" }} className="text-center">
                            {index + 1}
                          </td>
                          <td>{item?.intBusinessPartnerId}</td>
                          <td>{item?.strBusinessPartnerName}</td>
                          <td>{item?.area}</td>
                          <td>{item?.territory}</td>
                          <td className="text-right">{item?.dueAmount}</td>
                          <td className="text-right">{item?.overDue}</td>
                          <td className="text-right" style={{ width: "60px" }}>
                            {item?.od || 0}
                          </td>
                          <td>
                            <InputField
                              value={item?.week1}
                              name="week1"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week1",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.week2}
                              name="week2"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week2",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.week3}
                              name="week3"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week3",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td>
                            <InputField
                              value={item?.week4}
                              name="week4"
                              type="number"
                              onChange={(e) => {
                                rowDataHandler(
                                  "week4",
                                  index,
                                  e?.target?.value
                                );
                              }}
                            />
                          </td>
                          <td className="text-right" style={{ width: "90px" }}>
                            {item?.total}
                          </td>
                          <td className="text-right" style={{ width: "60px" }}>
                            {item?.percent}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </ICustomCard>
          </>
        )}
      </Formik>
    </>
  );
}
