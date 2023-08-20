import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import InputField from "../../../_helper/_inputField";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";

function MonthlyModal({
  singleData,
  setSingleData,
  montList,
  setMontList,
  setisShowModal,
  getSubGlRow,
  setSubGlRow,
}) {
  const [, saveHandler] = useAxiosPost();
  const [multipyData, getMultipyData] = useAxiosGet();
  const { profileData, selectedBusinessUnit } = useSelector((state) => {
    return state.authData;
  }, shallowEqual);

  useEffect(() => {
    if (singleData?.item?.overheadType?.value === 2) {
      getMultipyData(
        `/mes/SalesPlanning/GetMonthlyConversion?accountId=${
          profileData?.accountId
        }&businessUnitId=${selectedBusinessUnit?.value}&year=${singleData?.item
          ?.intYear || singleData?.values?.year?.value}&typeId=${
          singleData?.values?.gl?.intGeneralLedgerId === 93 ? 1 : 2
        }`,
        (res) => {
          const data = montList?.map((item, index) => {
            return {
              ...item,
              monthlyConversionValue: res.find(
                (resItem) => resItem.intMonthId === item?.intMonthId
              )?.monthlyConversionValue,
            };
          });
          setMontList(data);
        }
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  console.log("singleData", singleData);

  return (
    <>
      <div className="d-flex justify-content-end">
        <button
          onClick={() => {
            saveHandler(
              `/mes/SalesPlanning/CreateManufacturingOverheadPlanningMolthly`,
              {
                header: {
                  intMopplanId: singleData?.item?.intMopplanId || 0,
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
                    singleData?.item?.intYear ||
                    singleData?.values?.year?.value,
                  intAccountId: profileData?.accountId,
                  intBusinessUnitId: selectedBusinessUnit?.value,
                  numUniversalAmount: +singleData?.item?.universalAmount,
                  isActive: true,
                  intActionBy: profileData?.userId,
                },
                rows: montList?.map((item) => ({
                  intMopplanRowId: item?.intMopplanRowId || 0,
                  intMopplanId: item?.intMopplanId || 0,
                  intMonthId: item?.intMonthId,
                  strMonthName: item?.strMonthName,
                  intMonthLyValue: +item?.intMonthLyValue || 0,
                  isActive: item?.isActive,
                })),
              },
              () => {
                setisShowModal(false);
                getSubGlRow(
                  `/mes/SalesPlanning/GetBusinessTransactionsAsync?accountId=${profileData?.accountId}&businessUnitId=${selectedBusinessUnit?.value}&generalLedgerId=${singleData?.values?.gl?.intGeneralLedgerId}`,
                  (data) => {
                    let modiFyRow = data?.map((item) => ({
                      ...item,
                      overheadType:
                        item?.overheadTypeId && item?.overheadTypeName
                          ? {
                              value: item?.overheadTypeId,
                              label: item?.overheadTypeName,
                            }
                          : "",
                    }));
                    setSubGlRow(modiFyRow);
                  }
                );
              }
            );
          }}
          type="button"
          className="btn btn-primary"
        >
          Save
        </button>
      </div>
      <div className="row">
        <div className="col-lg-12">
          <table className="table table-striped table-bordered  global-table">
            <thead>
              <tr>
                <th>Month Name</th>

                <th>Monthly Value</th>
                {singleData?.item?.overheadType?.value === 2 ? (
                  <th>Monthly Conversion Value</th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {montList?.length > 0 &&
                montList?.map((item, i) => (
                  <tr>
                    <td>{item?.strMonthName}</td>
                    <td style={{ minWidth: "70px" }}>
                      <InputField
                        value={
                          singleData?.item?.overheadType?.value === 1
                            ? +item?.intMonthLyValue ||
                              +singleData?.item?.universalAmount ||
                              ""
                            : (+singleData?.item?.universalAmount || 0) *
                                (+item?.monthlyConversionValue || 0) || ""
                        }
                        type="number"
                        onChange={(e) => {
                          if (+e.target.value < 0) return;
                          let modiFyRow = [...singleData?.item?.monthList];
                          modiFyRow[i]["intMonthLyValue"] =
                            +e.target.value || "";
                          setSingleData({
                            ...singleData,
                            item: { ...item, monthList: modiFyRow },
                          });
                        }}
                      />
                    </td>
                    {singleData?.item?.overheadType?.value === 2 ? (
                      <td className="text-center">
                        {item?.monthlyConversionValue}
                      </td>
                    ) : null}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

export default MonthlyModal;
