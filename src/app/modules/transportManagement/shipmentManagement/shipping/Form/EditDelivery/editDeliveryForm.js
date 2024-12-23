import React, { useEffect, useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { shallowEqual } from "react-redux";
import InputField from "../../../../../_helper/_inputField";
import { getDeliveryInfoById, saveDeliveryData } from "./deliveryApi";
import { _todayDate } from "../../../../../_helper/_todayDate";
import Loading from "../../../../../_helper/_loading";
import { toast } from "react-toastify";

// Validation schema
export const validationSchema = Yup.object().shape({
  itemLists: Yup.array().of(
    Yup.object().shape({
      quantity: Yup.number()
        .min(0, "Minimum 0 number")
        .test("quantity", "Invalid qty ", function(value) {
          return this.parent.quantity >= value;
        })
        .required("Item Qty required"),
    })
  ),
});

export default function EditDeliveryForm({
  saveLoading,
  setSaveLoading,
  closeModal,
  editDeliveryBtnRef,
  btnRef,
  refetchData,
  isEdit,
  delivery,
}) {
  // get user profile data from store
  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  // get selected business unit from store
  const selectedBusinessUnit = useSelector((state) => {
    return state.authData.selectedBusinessUnit;
  }, shallowEqual);

  //M/S The Successors businessUnit
  const isTransportRate = selectedBusinessUnit?.value === 94;

  const [deliveryData, setDeliveryData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (delivery) {
      (async () => {
        try {
          setLoading(true);
          let response = await getDeliveryInfoById(delivery?.deliveryId);
          setDeliveryData(response?.data);
          setLoading(false);
        } catch (error) {
          setLoading(false);
        }
      })();
    }
  }, [delivery]);

  const saveHandler = async (values) => {
    try {
      setSaveLoading(true);
      const payload = {
        headerData: {
          deliveryId: deliveryData?.objDeliveryHeaderLandingDTO?.deliveryId,
          shipToPartyId:
            deliveryData?.objDeliveryHeaderLandingDTO?.shipToPartnerId,
          shipToPartyName:
            deliveryData?.objDeliveryHeaderLandingDTO?.shipToPartnerName,
          shipPointId: deliveryData?.objDeliveryHeaderLandingDTO?.shipPointId,
          actionBy: profileData.userId,
          lastActionDateTime: _todayDate(),
          // territoryId: values?.soldToParty?.terriToryId || 0,
        },
        rowData: values.itemLists?.map((item) => ({
          ...item,
          quantity: Number(item?.quantity),
          UomName: item?.uom,
          IntUomId: item?.uomid,
          rowId: item?.deliveryRowId,
        })),
      };
      await saveDeliveryData(payload);
      refetchData();
      if (btnRef.current) {
        setTimeout(() => {
          btnRef.current.click();
        }, 300);
      }
      setSaveLoading(false);
      closeModal();
      toast.success("Quantity updated successful", { toastId: 110 });
    } catch (error) {
      setSaveLoading(false);
      toast.error(error?.response?.data?.message ?? "Something went wrong.", {
        toastId: 111,
      });
      // console.log(error.response, "from the error");
    }
  };
  const totalAmountCalFunc = (array, name) => {
    if (name === "itemPrice") {
      const totalQty = array?.reduce((acc, cur) => {
        return acc + +cur?.[name];
      }, 0);
      return Number(totalQty?.toFixed(2));
    } else {
      const totalQty = array?.reduce((acc, cur) => acc + +cur?.[name], 0);
      return Number(totalQty?.toFixed(2));
    }
  };
  return (
    <>
      {loading && <Loading />}
      <Formik
        enableReinitialize={true}
        initialValues={{
          itemLists: deliveryData?.objListDeliveryRowDetailsDTO,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          saveHandler(values, () => {
            resetForm({});
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
          setValues,
        }) => {
          return (
            <>
              <div className="delivery_Information">
                {
                  <ul
                    style={{
                      listStyle: "none",
                      display: "flex",
                      gap: "10px",
                      justifyContent: "center",
                      marginTop: "10px",
                    }}
                  >
                    <li>
                      <b>Delivery Code: </b>
                      {delivery?.deliveryCode}
                    </li>
                    <li>
                      <div>
                        <b className="">Delivery Amount: </b>
                        <span>
                          {totalAmountCalFunc(values?.itemLists, "itemPrice")}
                        </span>
                      </div>
                    </li>
                    <li>
                      <div>
                        <b>Delivery Qty: </b>
                        {totalAmountCalFunc(values?.itemLists, "quantity")}
                      </div>
                    </li>
                  </ul>
                }
              </div>
              <Form className="form form-label-right">
                {/* table */}
                <div className="row cash_journal bank-journal bank-journal-custom">
                  <div className="col-lg-12 pr-0 pl-0">
                    {values?.itemLists?.length > 0 && (
                      <div className="table-responsive">
                        <table className="table table-striped table-bordered mt-3 bj-table bj-table-landing sales_order_landing_table">
                          <thead>
                            <tr>
                              <th style={{ width: "75px" }}>Item Code</th>
                              <th style={{ width: "120px" }}>Specification</th>
                              <th style={{ width: "120px" }}>Ship to Party</th>
                              <th style={{ width: "120px" }}>Address</th>
                              <th style={{ width: "120px" }}>Item</th>
                              <th style={{ width: "20px" }}>Price</th>
                              <th style={{ width: "20px" }}>Available Stock</th>
                              <th style={{ width: "20px" }}>Order Qty</th>
                              <th style={{ width: "20px" }}>Pending Qty</th>
                              <th style={{ width: "120px" }}>Delivery Qty</th>
                              <th style={{ width: "10px" }}>Offers</th>
                            </tr>
                          </thead>
                          <tbody>
                            {values?.itemLists.map((itm, index) => {
                              let _numItemPrice = itm?.isVatPrice
                                ? itm?.vatItemPrice
                                : itm?.itemPrice;
                              return (
                                <>
                                  <tr key={index}>
                                    <td>
                                      <div className="pl-2">{itm.itemCode}</div>
                                    </td>
                                    <td>
                                      <div className="pl-2">
                                        {itm.specification}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="pl-2">
                                        {itm.shipToPartnerName}
                                      </div>
                                    </td>
                                    <td>
                                      <div className="pl-2">
                                        {itm.shipToPartnerAddress}
                                      </div>
                                    </td>
                                    <td style={{ width: "90px" }}>
                                      <div className="pl-2">{itm.itemName}</div>
                                    </td>
                                    <td style={{ width: "20px" }}>
                                      <div className="text-right pr-2">
                                        {_numItemPrice}
                                      </div>
                                    </td>
                                    <td style={{ width: "20px" }}>
                                      <div className="text-right pr-2">
                                        {itm?.availableStock}
                                      </div>
                                    </td>
                                    <td style={{ width: "20px" }}>
                                      <div className="text-right pr-2">
                                        {itm.orderQuantity}
                                      </div>
                                    </td>
                                    <td style={{ width: "20px" }}>
                                      <div className="text-right pr-2">
                                        {itm.pendingQty}
                                      </div>
                                    </td>
                                    <td
                                      style={{
                                        width: "150px",
                                        verticalAlign: "middle",
                                      }}
                                    >
                                      <div className="px-2">
                                        <InputField
                                          value={
                                            values?.itemLists[index]
                                              ?.quantity || ""
                                          }
                                          name={`itemLists.${index}.quantity`}
                                          placeholder="Delivery Qty"
                                          type="number"
                                          step="any"
                                          onChange={(e) => {
                                            setFieldValue(
                                              `itemLists.${index}.quantity`,
                                              e.target.value || ""
                                            );
                                          }}
                                          errors={errors}
                                          touched={touched}
                                          max={itm?.quantity}
                                        />
                                      </div>
                                    </td>
                                    <td style={{ width: "10px" }}>
                                      <div className="pl-2">
                                        {itm.freeItem ? "Yes" : "No"}
                                      </div>
                                    </td>
                                  </tr>
                                  {/* offer item show */}
                                  {itm?.offerItemList?.length > 0 ? (
                                    <>
                                      {itm?.offerItemList
                                        ?.filter((itm) => itm?.isItemShow)
                                        ?.map((OfferItm) => (
                                          <tr
                                            key={index}
                                            style={{ background: "#ffffa9" }}
                                          >
                                            <td>
                                              <div className="pl-2">
                                                {OfferItm?.itemCode}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="pl-2">
                                                {OfferItm?.specification}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="pl-2">
                                                {OfferItm?.shipToParty}
                                              </div>
                                            </td>
                                            <td>
                                              <div className="pl-2">
                                                {OfferItm?.shipToPartnerAddress}
                                              </div>
                                            </td>
                                            <td style={{ width: "90px" }}>
                                              <div className="pl-2">
                                                {OfferItm?.itemName}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                width: "75px",
                                                verticalAlign: "middle",
                                              }}
                                              className="locationRowFild"
                                            >
                                              {OfferItm?.selectLocation?.label}
                                            </td>
                                            <td style={{ width: "20px" }}>
                                              <div className="text-right pr-2">
                                                {_numItemPrice}
                                              </div>
                                            </td>
                                            {isTransportRate && (
                                              <td
                                                style={{ width: "20px" }}
                                                className="text-right"
                                              >
                                                {OfferItm?.transportRate || 0}
                                              </td>
                                            )}
                                            <td style={{ width: "20px" }}>
                                              <div className="text-right pr-2">
                                                {OfferItm?.numOrderQuantity}
                                              </div>
                                            </td>
                                            <td style={{ width: "20px" }}>
                                              <div className="text-right pr-2">
                                                {OfferItm?.pendingQty}
                                              </div>
                                            </td>
                                            <td
                                              style={{
                                                width: "150px",
                                                verticalAlign: "middle",
                                              }}
                                            >
                                              <div className="px-2">
                                                {OfferItm?.quantity}
                                              </div>
                                            </td>
                                            <td style={{ width: "10px" }}>
                                              <div className="pl-2">Yes</div>
                                            </td>

                                            {!isEdit && (
                                              <td className="text-center"></td>
                                            )}
                                          </tr>
                                        ))}
                                    </>
                                  ) : null}
                                </>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
                <button
                  type="submit"
                  ref={editDeliveryBtnRef}
                  style={{ display: "none" }}
                  onSubmit={() => handleSubmit()}
                ></button>
              </Form>
            </>
          );
        }}
      </Formik>
    </>
  );
}
