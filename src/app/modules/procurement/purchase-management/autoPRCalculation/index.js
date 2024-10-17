import { Form, Formik } from "formik";
import React from "react";
import IConfirmModal from "../../../_helper/_confirmModal";
import NewSelect from "../../../_helper/_select";
import useAxiosGet from "../../../_helper/customHooks/useAxiosGet";
import useAxiosPost from "../../../_helper/customHooks/useAxiosPost";
import IForm from "./../../../_helper/_form";
import Loading from "./../../../_helper/_loading";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import styles from './Tooltip.module.css';


const initData = {
    purchaseOrganization: "",
};
export default function AutoPRCalculation() {
    const saveHandler = (values, cb) => { };
    const [autoPRData, getAutoPRData, loading, setAutoPRData] = useAxiosGet()
    const [, onCreatePRHandler, loader] = useAxiosPost()

    const getData = (values) => {
        const apiUrl = values?.purchaseOrganization?.value === 1 ? `/procurement/AutoPurchase/GetReorderStockSummaryData` : `/procurement/AutoPurchase/sprGetReorderStockSummaryForeign`
        getAutoPRData(apiUrl)
    }


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
                                                            getData(values)
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
                            <>
                                <div className="form-group  global-form row">
                                    <div className="col-lg-3">
                                        <NewSelect
                                            name="purchaseOrganization"
                                            options={[{ value: 1, label: "Local Procurement" }, { value: 2, label: "Forign Procurement" }]}
                                            value={values?.purchaseOrganization}
                                            label="Purchase Organization"
                                            onChange={(valueOption) => {
                                                setFieldValue("purchaseOrganization", valueOption || "");
                                                setAutoPRData([])
                                            }}
                                            errors={errors}
                                            touched={touched}
                                        />
                                    </div>
                                    <div>
                                        <button type="button" onClick={() => {
                                            getData(values)
                                        }} className="btn btn-primary mt-5">Show</button>
                                    </div>
                                </div>

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
                                                        <th>Current Stock</th>
                                                        <th>Open PR</th>
                                                        <th>Open PO</th>
                                                        <th>Ghat Stock</th>
                                                        <th>Port Stock</th>
                                                        <th>Reorder Level</th>
                                                        <th>PR Quantity</th>
                                                        <th>Action</th>

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
                                                            <td className="text-center">{item?.inventoryStock}</td>
                                                            <td className="text-center">{item?.purchaseRequestStock}</td>
                                                            <td className="text-center">{item?.purchaseOrderStock}</td>
                                                            <td className="text-center">{item?.balanceOnGhat || 0}</td>
                                                            <td className="text-center">{item?.portStock || 0}</td>
                                                            <td className="text-center">{item?.reorderLevel}</td>
                                                            <td className="text-center">{item?.reorderQuantity}</td>
                                                            <td className="text-center">
                                                                {values?.purchaseOrganization?.value === 2 && (
                                                                    <OverlayTrigger
                                                                        overlay={
                                                                            <Tooltip id="cs-icon">
                                                                                <table className={styles.table}>
                                                                                    <tbody>
                                                                                        {/* Top 3 fields with "+" sign */}
                                                                                        <tr>
                                                                                            <td><strong>Current Stock</strong></td>
                                                                                            <td>+ {item?.inventoryStock || 0}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td><strong>Port Stock</strong></td>
                                                                                            <td>+ {item?.portStock || 0}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td><strong>Ghat Stock</strong></td>
                                                                                            <td>+ {item?.balanceOnGhat || 0}</td>
                                                                                        </tr>

                                                                                        {/* Bottom 2 fields with "-" sign */}
                                                                                        <tr>
                                                                                            <td><strong>Open PO</strong></td>
                                                                                            <td>- {item?.purchaseOrderStock || 0}</td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td><strong>Open PR</strong></td>
                                                                                            <td>- {item?.purchaseRequestStock || 0}</td>
                                                                                        </tr>

                                                                                        {/* Final Total */}
                                                                                        <tr>
                                                                                            <td><strong>PR Quantity</strong></td>
                                                                                            <td>
                                                                                                {
                                                                                                    (
                                                                                                        (item?.inventoryStock || 0) +
                                                                                                        (item?.portStock || 0) +
                                                                                                        (item?.balanceOnGhat || 0)
                                                                                                    ) -
                                                                                                    (
                                                                                                        (item?.purchaseOrderStock || 0) +
                                                                                                        (item?.purchaseRequestStock || 0)
                                                                                                    )
                                                                                                }
                                                                                            </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </Tooltip>
                                                                        }
                                                                    >
                                                                        <span>
                                                                            <i className="fa fa-info-circle pointer"></i>
                                                                        </span>
                                                                    </OverlayTrigger>
                                                                )}
                                                            </td>









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