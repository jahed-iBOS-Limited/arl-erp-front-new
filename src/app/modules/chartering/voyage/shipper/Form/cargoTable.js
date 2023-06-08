import React from "react";
import { toast } from "react-toastify";
import FormikInput from "../../../_chartinghelper/common/formikInput";
import ICustomTable from "../../../_chartinghelper/_customTable";
import IDelete from "../../../_chartinghelper/_delete";

export const addCargoShipper = (
  values,
  setFieldValue,
  cargoList,
  setCargoList
) => {
  if (!values?.cargo?.value) {
    toast.warn("Please select a cargo");
    return;
  }

  if (cargoList?.find((item) => item?.cargoId === values?.cargo?.value)) {
    toast.warn("Item already added");
    return;
  } else {
    const newItem = {
      chartererId: values?.charterName?.value,
      cargoId: values?.cargo?.value,
      cargoName: values?.cargo?.label,
      cargoQty: "",
      freightRate: "",
      totalFreight: "",
      numVoyageCargoQty: values?.cargo?.cargoQty,
      loadPortId: values?.cargo?.cargoLoadPortId || 0,
      loadPortName: values?.cargo?.cargoLoadPortName || "",
      dischargePortId: values?.cargo?.cargoDischargePortId || 0,
      dischargePortName: values?.cargo?.cargoDischargePortName || "",
    };
    setCargoList([...cargoList, newItem]);
    setFieldValue("cargo", "");
  }
};

export default function CargoTable({
  cargoList,
  viewType,
  errors,
  touched,
  values,
  setFieldValue,
  setCargoList,
}) {
  const cargoRowDataHandler = (key, value, index, cargoList, setCargoList) => {
    let newItemList = [...cargoList];
    newItemList[index][key] = +value;
    const freightValue =
      key === "freightRate"
        ? value * (+newItemList[index]["cargoQty"] || 0)
        : value * (+newItemList[index]["freightRate"] || 0);
    newItemList[index]["totalFreight"] = +freightValue;

    setCargoList(newItemList);
  };

  const removeCargo = (index, cargoList, setCargoList) => {
    setCargoList(cargoList.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="voyageStatement mt-2">
        {cargoList?.length > 0 && (
          <>
            <h6 className="">Cargo List</h6>
            <ICustomTable
              ths={[
                { name: "SL" },
                { name: "Cargo Name" },
                { name: "Cargo Qty" },
                { name: "Start Port" },
                { name: "End Port" },
                // { name: "Freight/MT" },
                // { name: "Freight Value" },
                { name: "Action", isHide: viewType === "View" },
              ]}
            >
              {cargoList?.map((item, index) => (
                <tr key={index}>
                  <td className="text-center" style={{ maxWidth: "30px" }}>
                    {index + 1}
                  </td>
                  <td>{item?.cargoName}</td>
                  <td>
                    <FormikInput
                      value={item?.cargoQty}
                      name="cargoQty"
                      placeholder="Cargo Qty"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "View" || item?.rowId}
                      onChange={(e) => {
                        if (item?.numVoyageCargoQty < e?.target?.value) {
                        } else {
                          cargoRowDataHandler(
                            "cargoQty",
                            e?.target?.value,
                            index,
                            cargoList,
                            setCargoList
                          );
                        }
                      }}
                    />
                  </td>
                  <td>{item?.loadPortName || ""}</td>
                  <td>{item?.dischargePortName || ""}</td>
                  {/* <td>
                    <FormikInput
                      value={item?.freightRate}
                      name="freightRate"
                      placeholder="Freight/MT"
                      type="number"
                      errors={errors}
                      touched={touched}
                      disabled={viewType === "View" || item?.rowId}
                      onChange={(e) => {
                        cargoRowDataHandler(
                          "freightRate",
                          e?.target?.value,
                          index,
                          cargoList,
                          setCargoList
                        );
                      }}
                    />
                  </td>
                  <td className="text-right">{item?.totalFreight}</td> */}
                  {viewType !== "View" ? (
                    <td className="text-center">
                      <p
                        onClick={() => {
                          removeCargo(index, cargoList, setCargoList);
                        }}
                      >
                        <IDelete />
                      </p>
                    </td>
                  ) : null}
                </tr>
              ))}
              <tr className="font-weight-bold">
                <td colSpan={2} className="text-right">
                  Total
                </td>
                <td>
                  <p className="ml-1">
                    {cargoList?.reduce(
                      (acc, cur) => acc + Number(cur?.cargoQty),
                      0
                    )}
                  </p>
                </td>

                {/* <td>
                  <p className="ml-3">
                    {cargoList?.reduce(
                      (acc, cur) => acc + Number(cur?.freightRate),
                      0
                    )}
                  </p>
                </td>
                <td className="text-right">
                  {cargoList?.reduce((acc, cur) => acc + cur?.totalFreight, 0)}
                </td> */}

                <td colSpan={viewType !== "View" ? "3" : "2"}></td>
              </tr>
            </ICustomTable>
          </>
        )}
      </div>
    </>
  );
}
