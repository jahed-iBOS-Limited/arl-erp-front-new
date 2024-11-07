import { Form, Formik } from "formik";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { toast } from "react-toastify";
import IForm from "../../../_helper/_form";
import InputField from "../../../_helper/_inputField";
import Loading from "../../../_helper/_loading";
import NewSelect from "../../../_helper/_select";
import { YearDDL } from "../../../_helper/_yearDDL";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";

const initData = {
    businessUnit: "",
    year: "",
    isForecast: true,
    gl: "",
    businessTransaction: "",
    profitCenter: ""
};
const months = [
    { name: "July", key: "julAmount", id: 7 },
    { name: "August", key: "augAmount", id: 8 },
    { name: "September", key: "sepAmount", id: 9 },
    { name: "October", key: "octAmount", id: 10 },
    { name: "November", key: "novAmount", id: 11 },
    { name: "December", key: "decAmount", id: 12 },
    { name: "January", key: "janAmount", id: 1 },
    { name: "February", key: "febAmount", id: 2 },
    { name: "March", key: "marAmount", id: 3 },
    { name: "April", key: "aprAmount", id: 4 },
    { name: "May", key: "mayAmount", id: 5 },
    { name: "June", key: "junAmount", id: 6 }
];

export default function BreakdownEntry() {
    const formikRef = React.useRef(null);
    const [tableData, getTableData, tableDataLoader, setTableData] = useAxiosGet();
    const [, saveData, saveDataLoader] = useAxiosPost();
    const [objProps, setObjprops] = useState({});
    const [
        profitCenterDDL,
        getProfitCenterDDL,
        profitCenterLoder,
        setProfitCenterDDL,
    ] = useAxiosGet();

    const [buDDL, getBuDDL, buDDLloader, setBuDDL] = useAxiosGet();
    const [glList, getGLList] = useAxiosGet();
    const [businessTransactionList, getBusinessTransactionList, transLoader, setBusinessTransactionList] = useAxiosGet();
    const [budgetDataForPrevYear, getBudgetDataForPrevYear, budgetLoader] = useAxiosGet();
    const [budgetDataForNextYear, getBudgetDataForNextYear, budgetNextLoader] = useAxiosGet();

    const { profileData } = useSelector((state) => state.authData, shallowEqual);

    useEffect(() => {


        getBuDDL(
            `/domain/OrganizationalUnitUserPermission/GetBusinessUnitPermissionbyUser?UserId=${profileData?.userId}&ClientId=${profileData?.accountId}`,
            (data) => setBuDDL(data.map((item) => ({
                value: item?.organizationUnitReffId,
                label: item?.organizationUnitReffName
            })))
        );
        getGLList(`/fino/FinanceCommonDDL/GetGeneralLedegerDDL?accountId=${profileData?.accountId}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profileData]);

    const getLastDateOfMonth = (year, month) => {
        const fiscalYear = month >= 7 && month <= 12 ? year : year + 1;
        return moment(`${fiscalYear}-${month}-01`).endOf('month').format('YYYY-MM-DD');
    };

    const saveHandler = (values) => {
        if (tableData.length && values?.businessUnit && values?.year) {
            const payload = tableData.flatMap((item) => {
                return months.map((month) => ({
                    autoId: 0,
                    ProfitCenterId: values?.profitCenter?.value,
                    businessUnitId: values?.businessUnit?.value,
                    glId: item.generalLedgerId,
                    subGlId: values?.businessTransaction?.value,
                    accountHeadId: item.accountHeadId,
                    budget: +item[month.key],
                    budgetDate: getLastDateOfMonth(values?.year?.value, month.id),
                    yearId: month.id >= 7 && month.id <= 12 ? values?.year?.value : values?.year?.value + 1,
                    monthId: month.id,
                    isForecast: values?.isForecast,
                }));
            });

            saveData(
                `/fino/BudgetaryManage/CreateUpdateBudgetEntry`,
                payload,
                () => setTableData([]),
                true
            );
        } else {
            toast.warn("No data to save");
        }
    }

    const onViewButtonClick = (values) => {
        getTableData(
            `/fino/BudgetaryManage/GetSubGlAccountHead?GeneralLedgerId=${values?.gl?.value}&SubGlCode=${values?.businessTransaction?.buesinessTransactionCode}`,
            () => {
                getBudgetDataForPrevYear(`/fino/BudgetaryManage/GetBudgetOperatingExpenses?businessUnitId=${values?.businessUnit?.value}&generalLedgerId=${values?.gl?.value}&yearId=${values?.year?.value}&SubGlId=${values?.businessTransaction?.value}`)
                getBudgetDataForNextYear(`/fino/BudgetaryManage/GetBudgetOperatingExpenses?businessUnitId=${values?.businessUnit?.value}&generalLedgerId=${values?.gl?.value}&yearId=${values?.year?.value + 1}&SubGlId=${values?.businessTransaction?.value}`)
            }

        );
    }

    const getUpdatedRowObjectForManual = (data, newValue) => {
        const updatedRow = { ...data, fillAllManual: newValue };
        months.forEach((month) => updatedRow[month.key] = newValue);
        return updatedRow;
    };

    return (
        <Formik
            innerRef={formikRef}
            enableReinitialize={true}
            initialValues={initData}
            onSubmit={(values, { setSubmitting, resetForm }) => {
                saveHandler(values, () => {
                    resetForm(initData);
                    setTableData([])
                });
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
                    {(tableDataLoader || profitCenterLoder || transLoader || budgetLoader || budgetNextLoader || saveDataLoader || buDDLloader) && <Loading />}
                    <IForm
                        title={"Breakdown Entry"}
                        getProps={setObjprops}
                        isHiddenReset={true}
                    >
                        <Form>
                            {/* Form Fields */}
                            <div className="form-group  global-form row">
                                {/* Business Unit Select */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="businessUnit"
                                        options={buDDL || []}
                                        value={values?.businessUnit}
                                        label="Business Unit"
                                        onChange={(valueOption) => {
                                            setFieldValue("businessUnit", valueOption);
                                            setFieldValue("profitCenter", "");
                                            setFieldValue("gl", "");
                                            setFieldValue("businessTransaction", "");
                                            setProfitCenterDDL([])
                                            setBusinessTransactionList([]);
                                            setTableData([]);
                                            if (valueOption) {
                                                getProfitCenterDDL(
                                                    `/costmgmt/ProfitCenter/GetProfitCenterInformation?AccountId=${profileData?.accountId}&BusinessUnitId=${valueOption?.value}`,
                                                    (data) => {
                                                        const newData = data?.map((itm) => {
                                                            itm.value = itm?.profitCenterId;
                                                            itm.label = itm?.profitCenterName;
                                                            return itm;
                                                        });
                                                        setProfitCenterDDL(newData);
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
                                        name="profitCenter"
                                        options={profitCenterDDL || []}
                                        value={values?.profitCenter}
                                        label="Profit Center"
                                        onChange={(valueOption) => {
                                            setFieldValue("profitCenter", valueOption);
                                            setFieldValue("gl", "");
                                            setFieldValue("businessTransaction", "");
                                            setBusinessTransactionList([]);
                                            setTableData([]);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.businessUnit}
                                    />
                                </div>
                                {/* GL Select */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="gl"
                                        options={glList || []}
                                        value={values?.gl}
                                        label="GL"
                                        onChange={(valueOption) => {
                                            setFieldValue("gl", valueOption);
                                            setFieldValue("businessTransaction", "");
                                            setBusinessTransactionList([]);
                                            setTableData([]);
                                            if (valueOption) {
                                                getBusinessTransactionList(
                                                    `/fino/FinanceCommonDDL/GetBusinessTransactionDDL?accountId=${profileData?.accountId}&businessUnitId=${values?.businessUnit?.value}&generalLedgerId=${valueOption?.value}`,
                                                    (res) => {
                                                        const data = res.map((item) => ({
                                                            ...item,
                                                            value: item?.buesinessTransactionId,
                                                            label: item?.buesinessTransactionName
                                                        }));
                                                        setBusinessTransactionList(data);
                                                    }
                                                );
                                            }
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.businessUnit}
                                    />
                                </div>
                                {/* Business Transaction Select */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="businessTransaction"
                                        options={businessTransactionList || []}
                                        value={values?.businessTransaction}
                                        label="Business Transaction"
                                        onChange={(valueOption) => {
                                            setFieldValue("businessTransaction", valueOption);
                                            setTableData([]);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                        isDisabled={!values?.businessUnit || !values?.gl}
                                    />
                                </div>
                                {/* Year Select */}
                                <div className="col-lg-3">
                                    <NewSelect
                                        name="year"
                                        options={YearDDL() || []}
                                        value={values?.year}
                                        label="Year"
                                        onChange={(valueOption) => {
                                            setFieldValue("year", valueOption);
                                            setTableData([]);
                                        }}
                                        errors={errors}
                                        touched={touched}
                                    />
                                </div>
                                {/* Checkbox for Forecast */}
                                <div className="col-lg-1 mt-5">
                                    <div className="d-flex align-items-center">
                                        <input
                                            type="checkbox"
                                            checked={values?.isForecast}
                                            onChange={(e) => setFieldValue("isForecast", e.target.checked)}
                                        />
                                        <label className="pl-2">Is Forecast</label>
                                    </div>
                                </div>
                                {/* View Button */}
                                <div className="col-lg-3 mt-5">
                                    <button
                                        className="btn btn-primary"
                                        type="button"
                                        onClick={() => onViewButtonClick(values)}
                                        disabled={!values?.year || !values?.businessUnit || !values?.gl || !values?.businessTransaction || !values?.profitCenter}
                                    >
                                        View
                                    </button>
                                </div>
                            </div>
                            {/* Table Display */}
                            {values?.year?.value && tableData.length > 0 && (
                                <div className="common-scrollable-table two-column-sticky mt-2">
                                    <div style={{ maxHeight: "500px" }} className="scroll-table _table">
                                        <table className="table table-striped table-bordered bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th style={{ minWidth: "60px" }}>SL</th>
                                                    <th style={{ minWidth: "200px" }}>Element Name</th>
                                                    <th style={{ minWidth: "140px" }}>Value</th>
                                                    {months.map((month) => (
                                                        <th key={month.id} style={{ minWidth: "140px" }}>
                                                            {month.name} ({
                                                                // Check if the month ID is between July (7) and December (12)
                                                                (month.id >= 7 && month.id <= 12)
                                                                    ? // For July to December, get data from the previous year
                                                                    budgetDataForPrevYear?.find((item) => item?.monthId === month.id)?.amount || ""
                                                                    : // For January to June, get data from the next year
                                                                    budgetDataForNextYear?.find((item) => item?.monthId === month.id)?.amount || ""
                                                            })
                                                        </th>
                                                    ))}

                                                </tr>
                                            </thead>
                                            <tbody>
                                                {tableData.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td>{item?.accountHeadName}</td>
                                                        <td>
                                                            <InputField
                                                                value={item?.fillAllManual}
                                                                type="number"
                                                                name="fillAllManual"
                                                                onChange={(e) => {
                                                                    const newValue = e.target.value;
                                                                    setTableData(tableData.map((data, idx) =>
                                                                        idx === index ? getUpdatedRowObjectForManual(data, newValue) : data
                                                                    ));
                                                                }}
                                                            />
                                                        </td>
                                                        {months.map((month) => (
                                                            <td key={month.id}>
                                                                <InputField
                                                                    value={item[month.key]}
                                                                    type="number"
                                                                    name="entryTypeValue"
                                                                    onChange={(e) => {
                                                                        const updatedData = [...tableData];
                                                                        updatedData[index][month.key] = e.target.value;
                                                                        setTableData(updatedData);
                                                                    }}
                                                                />
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                            <button type="submit" style={{ display: "none" }} ref={objProps?.btnRef}></button>
                            <button type="reset" style={{ display: "none" }} ref={objProps?.resetBtnRef}></button>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}
