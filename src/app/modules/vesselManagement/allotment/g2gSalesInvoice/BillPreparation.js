import { DropzoneDialogBase } from "material-ui-dropzone";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { _dateFormatter } from "../../../_helper/_dateFormate";
import { _fixedPoint } from "../../../_helper/_fixedPoint";
import InputField from "../../../_helper/_inputField";
import { empAttachment_action } from "./helper";
const BillPreparationReport = ({
  printRef,
  gridData,
  buUnName,
  values,
  userPrintBtnClick,
  setFieldValue,
}) => {
  const [open, setOpen] = useState(false);
  const [fileObjects, setFileObjects] = useState({});
  const motherVessel = values?.motherVessel?.label || "";
  const motherVesselName = motherVessel?.split("(")?.[0].trim();
  const dispatch = useDispatch();

  return (
    <>
      <div ref={printRef}>
        <div>
          <div className="row">
            <div className="col-lg-12 text-center">
              <h4 className="m-0">{buUnName}</h4>
              <p>
                <span>
                  {values?.organization?.label} Godown: {values?.godown?.label}{" "}
                </span>
                <br />
                <span>
                  Mother Vessel MV: {motherVesselName}({values?.item?.label})
                </span>
                <br />
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  Program No: {values?.programNo}, Date:{" "}
                  {userPrintBtnClick ? (
                    values?.godownWiseDeliveryDate
                  ) : (
                    <InputField
                      value={values?.godownWiseDeliveryDate}
                      className="printFormat"
                      name="fromDate"
                      type="date"
                      onChange={(e) => {
                        setFieldValue("godownWiseDeliveryDate", e.target.value);
                      }}
                    />
                  )}{" "}
                </span>
                <br />
                <span>{values?.item?.label}</span>
              </p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="scroll-table-auto asset_list">
              <table className="table table-striped table-bordered global-table table-font-size-sm">
                <thead>
                  <tr>
                    <th>SL</th>
                    <th>Date</th>
                    <th>Truck No</th>
                    <th>Challan No</th>
                    <th>Quantity(MT)</th>
                    <th>Quantity(BAG)</th>
                    <th>Epmty Bag</th>
                    <th>Remarks</th>
                  </tr>
                </thead>

                <tbody>
                  {gridData?.map((item, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
                      <td>{_dateFormatter(item?.deliveryDate)}</td>
                      <td>{item?.vehicleRegNo}</td>
                      <td>{item?.deliveryCode}</td>
                      <td className="text-right">
                        {item?.totalDeliveryQuantityTon}
                      </td>
                      <td className="text-right">
                        {item?.totalDeliveryQuantityBag}
                      </td>
                      <td className="text-right">{item?.emptyBag}</td>
                      <td>{item?.remarks}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4}>
                      <b>Total</b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.totalDeliveryQuantityTon || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.totalDeliveryQuantityBag || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td className="text-right">
                      <b>
                        {_fixedPoint(
                          gridData?.reduce((acc, cur) => {
                            return (acc += +cur?.emptyBag || 0);
                          }, 0)
                        )}
                      </b>
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      <DropzoneDialogBase
        filesLimit={5}
        acceptedFiles={["image/*"]}
        fileObjects={fileObjects}
        cancelButtonText={"cancel"}
        submitButtonText={"submit"}
        maxFileSize={1000000}
        open={open}
        onAdd={(newFileObjs) => {
          setFileObjects([].concat(newFileObjs));
        }}
        onDelete={(deleteFileObj) => {
          const newData = fileObjects.filter(
            (item) => item.file.name !== deleteFileObj.file.name
          );
          setFileObjects(newData);
        }}
        onClose={() => setOpen(false)}
        onSave={() => {
          setOpen(false);
          empAttachment_action(fileObjects).then((data) => {
            setFieldValue("godownsEntryAttachment", data[0]?.id);
          });
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </>
  );
};
export default BillPreparationReport;
