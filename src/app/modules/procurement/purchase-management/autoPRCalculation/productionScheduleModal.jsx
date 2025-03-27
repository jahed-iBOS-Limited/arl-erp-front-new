import { Form, Formik } from 'formik';
import React, { useEffect } from 'react';
import IForm from '../../../_helper/_form';
import Loading from '../../../_helper/_loading';
import useAxiosGet from '../../../_helper/customHooks/useAxiosGet';
import ReactHTMLTableToExcel from "react-html-table-to-excel";


export default function ProductionScheduleModal({ buId, fromData, toDate }) {

    const [productionScheduleData, getProductionScheduleData, loading] = useAxiosGet();

    useEffect(() => {
        getProductionScheduleData(`/mes/ProductionEntry/GetDetailFromProductionSchedule?intBusinessUnitId=${buId}&isForecast=true&fromDate=${fromData}&toDate=${toDate}`)

    }, [])


    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
            // validationSchema={{}}
            onSubmit={(values, { setSubmitting, resetForm }) => {
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
                    {(loading) && <Loading />}
                    <IForm
                        title=""
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                    <ReactHTMLTableToExcel
                                        id="mrp-table-xls-button-att-reports"
                                        className="btn btn-primary"
                                        table="mrp-table-to-xlsx"
                                        filename={"Report"}
                                        sheet={"Report"}
                                        buttonText="Export Excel"
                                    />
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <>
                                <div>
                                    {productionScheduleData?.length > 0 && (
                                        <div className="table-responsive">
                                            <table id='mrp-table-to-xlsx' className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                                <thead>
                                                    <tr>
                                                        <th>Item Code</th>
                                                        <th>Item Name</th>
                                                        <th>Production Plan Qty</th>
                                                        <th>Item Code</th>
                                                        <th>Item Name</th>
                                                        <th>Base UOM</th>
                                                        <th>BOM Qty</th>
                                                        <th>Total Qty</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {productionScheduleData?.map((item, index) => (
                                                        <tr key={index}>
                                                            <td className="text-center">{item.strItemCode}</td>
                                                            <td className="">{item.strItemName}</td>
                                                            <td className="text-center">{item.numProdPlanQty.toFixed(2)}</td>
                                                            <td className="text-center">{item.strItemCode1}</td>
                                                            <td className="">{item.strItemName1}</td>
                                                            <td className="">{item.strBaseUomName}</td>
                                                            <td className="text-center">{item.numBomQty.toFixed(6)}</td>
                                                            <td className="text-center">{item.numTotalQty.toFixed(2)}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                </div>
                            </>
                        </Form>


                    </IForm>
                </>
            )}
        </Formik>
    );
}
