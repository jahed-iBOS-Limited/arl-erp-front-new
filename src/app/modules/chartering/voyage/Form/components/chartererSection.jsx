import React from 'react';
import FormikInput from '../../../_chartinghelper/common/formikInput';
import FormikSelect from '../../../_chartinghelper/common/formikSelect';
import customStyles from '../../../_chartinghelper/common/selectCustomStyle';

export default function ChartererSection({
  values,
  setFieldValue,
  viewType,
  errors,
  touched,
  chartererDDL,
  brokerDDL,
  portDDL,
  componentType,
  setTotalAmountHandler,
  fileObjects,
  setFileObjects,
  setUploadedFile,
}) {
  // const [open, setOpen] = useState(false);

  return (
    <>
      <div className="marine-form-card-content mt-4">
        <div className="row">
          <div className="col-lg-3">
            <FormikSelect
              name="charterName"
              value={values?.charterName}
              isSearchable={true}
              options={chartererDDL}
              styles={customStyles}
              placeholder="Charterer Name"
              label="Charterer Name"
              onChange={(valueOption) => {
                setFieldValue('charterName', valueOption);
              }}
              isDisabled={viewType === 'view' || componentType}
              errors={errors}
              touched={touched}
            />
          </div>
          <div className="col-lg-3">
            <label>CP Date</label>
            <FormikInput
              value={values?.cpDate}
              name="cpDate"
              placeholder="dd-mm-yyyy"
              type="date"
              errors={errors}
              touched={touched}
              disabled={viewType === 'view'}
            />
          </div>
          {values?.voyageType?.value !== 1 && (
            <div className="col-lg-3">
              <FormikSelect
                value={values?.brokerName || ''}
                isSearchable={true}
                options={brokerDDL || []}
                styles={customStyles}
                name="brokerName"
                placeholder="Broker Name"
                label="Broker Name"
                onChange={(valueOption) => {
                  setFieldValue('brokerName', valueOption);
                }}
                isDisabled={viewType === 'view'}
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          <div className="col-lg-3">
            <label>Broker Commission (%)</label>
            <FormikInput
              value={values?.brokerCommission}
              name="brokerCommission"
              placeholder="Broker Commission (%)"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === 'view'}
              onChange={(e) => {
                setFieldValue('brokerCommission', e?.target?.value);

                if (!componentType) {
                  /* Func For Total Amount Value Handler */
                  setTotalAmountHandler(
                    {
                      ...values,
                      brokerCommission: e?.target?.value,
                    },
                    setFieldValue,
                  );
                }
              }}
            />
          </div>
          <div className="col-lg-3">
            <label>Address Commission (%)</label>
            <FormikInput
              value={values?.addressCommission}
              name="addressCommission"
              placeholder="Address Commission (%)"
              type="number"
              errors={errors}
              touched={touched}
              disabled={viewType === 'view'}
              onChange={(e) => {
                setFieldValue('addressCommission', e?.target?.value);

                if (!componentType) {
                  /* Func For Total Amount Value Handler */
                  setTotalAmountHandler(
                    {
                      ...values,
                      addressCommission: e?.target?.value,
                    },
                    setFieldValue,
                  );
                }
              }}
            />
          </div>
          {values?.voyageType?.value !== 1 && (
            <div className="col-lg-3">
              <label>Freight Percentage (%)</label>
              <FormikInput
                value={values?.freightPercentage}
                name="freightPercentage"
                placeholder="Freight Percentage (%)"
                type="number"
                errors={errors}
                touched={touched}
                disabled={viewType === 'view'}
              />
            </div>
          )}

          {values?.voyageType?.value === 1 && (
            <div className="col-lg-3">
              <label>Delivery Date (GMT)</label>
              <FormikInput
                value={values?.deliveryDate}
                name="deliveryDate"
                placeholder="Delivery Date (GMT)"
                type="datetime-local"
                errors={errors}
                touched={touched}
                disabled={viewType === 'view'}
              />
            </div>
          )}

          {values?.voyageType?.value === 1 && (
            <div className="col-lg-3">
              <FormikSelect
                value={values?.startPort}
                isSearchable={true}
                options={portDDL || []}
                styles={customStyles}
                name="startPort"
                placeholder={
                  'Delivery Place'
                  // values?.voyageType?.value === 1
                  //   ? // ? "Delivery Position"
                  // "Delivery Place"
                  // : "Load Port"
                }
                label={
                  'Delivery Place'
                  // values?.voyageType?.value === 1
                  //   ? // ? "Delivery Position"
                  // "Delivery Place"
                  // : "Load Port"
                }
                onChange={(valueOption) => {
                  setFieldValue('startPort', valueOption);
                }}
                isDisabled={viewType === 'view'}
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          {values?.voyageType?.value === 1 && (
            <div className="col-lg-3">
              <label>ReDelivery Date (GMT)</label>
              <FormikInput
                value={values?.reDeliveryDate}
                name="reDeliveryDate"
                placeholder="ReDelivery Date (GMT)"
                type="datetime-local"
                errors={errors}
                touched={touched}
                disabled={viewType === 'view'}
              />
            </div>
          )}

          {values?.voyageType?.value === 1 && (
            <div className="col-lg-3">
              <FormikSelect
                value={values?.endPort}
                isSearchable={true}
                options={portDDL || []}
                styles={customStyles}
                name="endPort"
                onChange={(valueOption) => {
                  setFieldValue('endPort', valueOption);
                }}
                placeholder={
                  'Redelivery Place'
                  // values?.voyageType?.value === 1
                  //   ? "Redelivery Place"
                  //   : // ? "Redelivery Position"
                  //     "Discharge Port"
                }
                label={
                  'Redelivery Place'
                  // values?.voyageType?.value === 1
                  //   ? "Redelivery Place"
                  //   : // ? "Redelivery Position"
                  //     "Discharge Port"
                }
                isDisabled={viewType === 'view'}
                errors={errors}
                touched={touched}
              />
            </div>
          )}

          {values?.voyageType?.value !== 1 && (
            <>
              <div className="col-lg-3">
                <label>Lay Can From Date</label>
                <FormikInput
                  value={values?.layCanFrom}
                  name="layCanFrom"
                  placeholder="CP Date"
                  type="date"
                  errors={errors}
                  touched={touched}
                  disabled={viewType === 'view'}
                />
              </div>
              <div className="col-lg-3">
                <label>Lay Can To Date</label>
                <FormikInput
                  value={values?.layCanTo}
                  name="layCanTo"
                  placeholder="CP Date"
                  type="date"
                  errors={errors}
                  touched={touched}
                  disabled={viewType === 'view'}
                />
              </div>
            </>
          )}
          <div className="col-lg-3"></div>
          {/* {viewType !== "view" && (
            <div className="col-lg-3 text-right mt-5">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => {}}
              >
                <i className="fas  fa-file-download"></i>
                Download CP format
              </button>
            </div>
          )}
          {viewType !== "view" && (
            <div className="col-lg-3 mt-5 text-left">
              <button
                className="btn btn-primary"
                type="button"
                onClick={() => setOpen(true)}
              >
                <i class="fas fa-file-upload"></i>
                Upload CP Clause
              </button>

              <DropzoneDialogBase
                filesLimit={1}
                acceptedFiles={[
                  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                  "application/msword",
                  "application/docx",
                ]}
                fileObjects={fileObjects || []}
                cancelButtonText={"cancel"}
                submitButtonText={"submit"}
                maxFileSize={1000000}
                open={open}
                onAdd={(newFileObjs) => {
                  setFileObjects([].concat(newFileObjs));
                }}
                onDelete={(deleteFileObj) => {
                  const newData = fileObjects?.filter(
                    (item) => item.file.name !== deleteFileObj.file.name
                  );
                  setFileObjects(newData);
                }}
                onClose={() => setOpen(false)}
                onSave={() => {
                  setOpen(false);
                  empAttachment_action(fileObjects).then((data) => {
                    setUploadedFile(data);
                  });
                }}
                showPreviews={true}
                showFileNamesInPreview={true}
              />
            </div>
          )} */}
        </div>
      </div>
    </>
  );
}
