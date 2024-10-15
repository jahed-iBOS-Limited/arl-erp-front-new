import { Form, Formik } from "formik";
import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IConfirmModal from "../../../_helper/_confirmModal";
const initData = {};
export default function AutoPRCalculation() {
    const saveHandler = (values, cb) => { };
    const [autoPRData, getAutoPRData, loading] = useAxiosGet()
    const [, onCreatePRHandler, loader] = useAxiosPost()

    const getData = () => {
        getAutoPRData(`/procurement/AutoPurchase/GetReorderStockSummaryData`)
    }

    useEffect(() => {
        getData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    return (
        <Formik
            enableReinitialize={true}
            initialValues={{}}
            // validationSchema={{}}
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
                setFieldValue,
                isValid,
                errors,
                touched,
            }) => (
                <>
                    {(loading || loader) && <Loading />}
                    <IForm
                        title="Auto PR Calculation"
                        isHiddenReset
                        isHiddenBack
                        isHiddenSave
                        renderProps={() => {
                            return (
                                <div>
                                    <button
                                        type="button"
                                        disabled={!autoPRData?.length}
                                        className="btn btn-primary"
                                        onClick={() => {
                                            IConfirmModal({
                                                message: `Are you sure to create PR ?`,
                                                yesAlertFunc: () => {
                                                    onCreatePRHandler(
                                                        `/procurement/AutoPurchase/GetFormatedItemListForAutoPRCreate`,
                                                        autoPRData,
                                                        () => {
                                                            getData()
                                                        },
                                                        true
                                                    );
                                                },
                                                noAlertFunc: () => { },
                                            });
                                        }}
                                    >
                                        Create PR
                                    </button>
                                </div>
                            );
                        }}
                    >
                        <Form>
                            <div>
                                {autoPRData?.length > 0 && (
                                    <div className="table-responsive">
                                        <table className="table table-striped mt-2 table-bordered bj-table bj-table-landing">
                                            <thead>
                                                <tr>
                                                    <th>SL</th>
                                                    <th>Item Code</th>
                                                    <th>Item Name</th>
                                                    <th>UOM</th>
                                                    <th>Warehouse</th>
                                                    <th>Business Unit</th>
                                                    <th>Reorder Level</th>
                                                    <th>Current Total Stock</th>
                                                    <th>Purchase Request Stock</th>
                                                    <th>Purchase Order Stock</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {autoPRData?.length > 0 && autoPRData?.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{index + 1}</td>
                                                        <td className="text-center">{item?.itemCode}</td>
                                                        <td>{item?.itemName}</td>
                                                        <td className="text-center">{item?.uomName}</td>
                                                        <td className="text-center">{item?.warehouseName}</td>
                                                        <td>{item?.businessUnitName}</td>
                                                        <td className="text-center">{item?.reorderLevel}</td>
                                                        <td className="text-center">{item?.currentTotalStock}</td>
                                                        <td className="text-center">{item?.purchaseRequestStock}</td>
                                                        <td className="text-center">{item?.purchaseOrderStock}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                            </div>
                        </Form>
                    </IForm>
                </>
            )}
        </Formik>
    );
}