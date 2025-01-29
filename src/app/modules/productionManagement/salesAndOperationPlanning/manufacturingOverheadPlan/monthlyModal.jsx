import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import Loading from "../../../_helper/_loading";
import { monthData } from "./helper";
const initData = {
  profitCenter: "",
};

function MonthlyModal({
  singleData,
  setSingleData,
  setisShowModal,
  profitCenterDDL,
  landingValues,
  landingCB,
}) {
  const [modifiedData, setModifiedData] = useState(null);
  const [objProps, setObjprops] = useState({});
  const [, saveData, saveLoading] = useAxiosPost();
  const [, getMultipyData] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  console.log("landingValues", landingValues);
  let defoultProfitCenter =
    landingValues?.profitCenter?.value === 0 ? "" : landingValues?.profitCenter;
  useEffect(() => {
    const profitCenter = singleData?.item?.intProfitCenterId
      ? {
          value: singleData?.item?.intProfitCenterId,
          label: singleData?.item?.strProfitCenterName,
        }
      : defoultProfitCenter;
    if (singleData?.item) {
      setModifiedData({
        profitCenter: profitCenter,
      });
    }
    if (singleData?.item?.overheadType?.value === 2) {
      getMultipyData(
        // `/mes/SalesPlanning/GetMonthlyConversion?accountId=${
        //   profileData?.accountId
        // }&businessUnitId=${selectedBusinessUnit?.value}&year=${singleData?.item
        //   ?.intYear || singleData?.values?.fiscalYear?.value}&typeId=${
        //   singleData?.values?.gl?.intGeneralLedgerId === 93 ? 1 : 2
        // }&ProfitCenterId=${profitCenter?.value}`,
        `/fino/BudgetFinancial/GetMonthlyConversion?accountId=${
          profileData?.accountId
        }&businessUnitId=${selectedBusinessUnit?.value}&year=${singleData?.item
          ?.intYear || singleData?.values?.fiscalYear?.value}&typeId=${
          singleData?.values?.gl?.intGeneralLedgerId === 93 ? 1 : 2
        }&ProfitCenterId=${profitCenter?.value}&PlantId=${
          landingValues?.plant?.value
        }`,
        (res) => {
          const data = singleData?.item?.monthList?.map((item, index) => {
            return {
              ...item,
              year: res?.find((month) => month?.intMonthId === item?.intMonthId)
                ?.intYearId,
              monthlyConversionValue:
                res.find((resItem) => resItem.intMonthId === item?.intMonthId)
                  ?.monthlyConversionValue || 0,
              strManagementUomName:
                res.find((resItem) => resItem.intMonthId === item?.intMonthId)
                  ?.strManagementUomName || "",
            };
          });
          setSingleData({
            ...singleData,
            item: { ...singleData?.item, monthList: data },
          });
        }
      );
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveHandler = (values, cb) => {
    if (!values?.profitCenter?.label) {
      return toast.warn("Please Select Profit Center");
    }

    // const matchingItem = singleData?.item?.monthList?.find(item => +item.monthlyConversionValue === 0);

    // if (matchingItem && singleData?.item?.overheadType?.value === 2) {
    //   return toast.warn(`Management UM not configured. Please Configure for ${matchingItem?.strMonthName}`);
    // }

    saveData(
      `/mes/SalesPlanning/CreateManufacturingOverheadPlanningMolthly`,
      {
        header: {
          intProfitCenterId: values?.profitCenter?.value,
          intMopplanId: singleData?.item?.intMopplanId || 0,
          intPlantId:
            singleData?.item?.intPlantId || singleData?.values?.plant?.value,
          intGlid:
            singleData?.item?.subGLId ||
            singleData?.values?.gl?.intGeneralLedgerId,
          intGlcode:
            singleData?.item?.intGlcode ||
            singleData?.values?.gl?.strGeneralLedgerCode,
          strGlname:
            singleData?.item?.strGlname ||
            singleData?.values?.gl?.strGeneralLedgerName,
          intOverheadTypeId: singleData?.item?.overheadType?.value,
          intOverheadTypeName: singleData?.item?.overheadType?.label,
          intSubGlid: singleData?.item?.businessTransactionId,
          intSubGlcode: singleData?.item?.businessTransactionCode,
          strSubGlname: singleData?.item?.businessTransactionName,
          intYear:
            singleData?.item?.intYear || singleData?.values?.fiscalYear?.value,
          intAccountId: profileData?.accountId,
          intBusinessUnitId: selectedBusinessUnit?.value,
          numUniversalAmount: +singleData?.item?.universalAmount,
          strFiscalYear: singleData?.values?.fiscalYear?.label,
          isActive: true,
          intActionBy: profileData?.userId,
        },
        rows: singleData?.item?.monthList?.map((item, index) => ({
          intMopplanRowId: item?.intMopplanRowId || 0,
          intMopplanId: item?.intMopplanId || 0,
          intMonthId: item?.intMonthId,
          IntYearId:
            index < 6
              ? singleData?.values?.fiscalYear?.label?.split("-")[0]
              : singleData?.values?.fiscalYear?.label?.split("-")[1],
          strMonthName: monthData.find(
            (month) => month.intMonthId === item?.intMonthId
          )?.strMonthName,
          intMonthLyValue: +item?.intMonthLyValue || 0,
          numProductionQty:
            (+item?.intMonthLyValue || 0) *
            (+item?.monthlyConversionValue || 0),
          numMultiplication: +item?.monthlyConversionValue || 0,
          isActive: item?.isActive,
        })),
      },
      () => {
        setisShowModal(false);
        landingCB();
      },
      true
    );
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={
        singleData?.item
          ? {
              ...modifiedData,
            }
          : {
              initData,
              profitCenter: defoultProfitCenter,
            }
      }
      onSubmit={(values, { setSubmitting, resetForm }) => {
        saveHandler(values);
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
          {saveLoading && <Loading />}
          <IForm
            title=""
            getProps={setObjprops}
            isHiddenBack={true}
            isHiddenReset={true}
          >
            <Form>
              <div className="form-group  global-form row">
                <div className="col-lg-3">
                  <NewSelect
                    name="profitCenter"
                    options={profitCenterDDL}
                    value={values?.profitCenter}
                    label="Profit Center"
                    onChange={(valueOption) => {
                      setFieldValue("profitCenter", valueOption);
                    }}
                    errors={errors}
                    touched={touched}
                  />
                </div>
              </div>

              <>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered  global-table">
                        <thead>
                          <tr>
                            <th>Year</th>
                            <th>Month Name</th>
                            <th>Monthly Value</th>
                            {singleData?.item?.overheadType?.value === 2 ? (
                              <>
                                <th>
                                  {singleData?.values?.gl
                                    ?.intGeneralLedgerId === 93
                                    ? "Production Quantity"
                                    : "Sales Quantity"}
                                </th>
                                <th>UM</th>
                                <th>Multiplication Result</th>
                              </>
                            ) : null}
                          </tr>
                        </thead>
                        <tbody>
                          {singleData?.item?.monthList?.length > 0 &&
                            singleData?.item?.monthList?.map((item, i) => (
                              <tr key={i}>
                                <td className="text-center">{item?.year}</td>
                                <td>
                                  {
                                    monthData.find(
                                      (month) =>
                                        month.intMonthId === item?.intMonthId
                                    )?.strMonthName
                                  }
                                </td>
                                <td style={{ minWidth: "70px" }}>
                                  <InputField
                                    value={+item?.intMonthLyValue || ""}
                                    type="number"
                                    onChange={(e) => {
                                      if (+e.target.value < 0) return;
                                      let modiFyRow = [
                                        ...singleData?.item?.monthList,
                                      ];
                                      modiFyRow[i]["intMonthLyValue"] =
                                        +e.target.value || "";
                                      setSingleData({
                                        ...singleData,
                                        item: {
                                          ...singleData?.item,
                                          monthList: modiFyRow,
                                        },
                                      });
                                    }}
                                  />
                                </td>

                                {singleData?.item?.overheadType?.value === 2 ? (
                                  <>
                                    <td className="text-center">
                                      {item?.monthlyConversionValue}
                                    </td>
                                    <td>{item?.strManagementUomName}</td>
                                    <td className="text-center">
                                      {(+item?.intMonthLyValue || 0) *
                                        (+item?.monthlyConversionValue || 0) ||
                                        ""}
                                    </td>
                                  </>
                                ) : null}
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>

              <button
                type="submit"
                style={{ display: "none" }}
                ref={objProps?.btnRef}
                onSubmit={() => handleSubmit()}
              ></button>

              <button
                type="reset"
                style={{ display: "none" }}
                ref={objProps?.resetBtnRef}
                onSubmit={() => resetForm(initData)}
              ></button>
            </Form>
          </IForm>
        </>
      )}
    </Formik>
  );
}

export default MonthlyModal;
