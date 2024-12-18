import moment from 'moment';
import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import IAdd from '../../../../_helper/_helperIcons/_add';
import InputField from '../../../../_helper/_inputField';
import IViewModal from '../../../../_helper/_viewModal';
import { PurchaseOrderViewTableRow } from '../../../../procurement/purchase-management/purchaseOrder/report/tableRow';
import BillForm from './billForm';
import POPreview from './poPreview';
import './rowTable.css';
function RowTable({ rowDto, setRowDto, editId, widthOutModfifyRowDto }) {
  const [isBillModal, isShowBillModal] = React.useState(false);
  const [showViewModal, setShowViewModal] = React.useState(false);
  const [clickRowData, setClickRowData] = React.useState({});
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div className="table-responsive estimatePDARowTable">
      <table className="table table-striped table-bordered global-table">
        <thead>
          <tr>
            <th>SL</th>
            <th>Category</th>
            <th>Expense Particulars</th>
            <th
              style={{
                width: '150px',
              }}
            >
              Estimated Amount
            </th>
            <th
              style={{
                width: '150px',
              }}
            >
              Customer Final Amount
            </th>
            <th>Actual Amount</th>
            <th>Bill Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rowDto?.map((item, index) => {
            const billRowDto = item?.estimatePDABillCreateDtos || [];

            const billTotal =
              billRowDto?.reduce((acc, cur) => acc + (+cur?.total || 0), 0) ||
              0;

            return (
              <tr key={index}>
                <td className="text-center"> {index + 1}</td>
                <td>{item?.category}</td>
                <td>
                  {item?.isEditExpPart ? (
                    <InputField
                      value={item?.particularName}
                      name="particularName"
                      type="text"
                      onChange={(e) => {
                        const copyRowDto = [...rowDto];
                        copyRowDto[index].particularName = e.target.value;
                        setRowDto(copyRowDto);
                      }}
                    />
                  ) : (
                    item?.particularName
                  )}
                  {!item?.isEditExpPart && (
                    <span
                      onClick={() => {
                        const copyRowDto = [...rowDto];
                        copyRowDto[index].isEditExpPart = !item?.isEditExpPart;
                        setRowDto(copyRowDto);
                      }}
                      style={{
                        paddingLeft: '6px',
                        display: 'inline-block',
                      }}
                      className="pointer isEditExpPartIcon"
                    >
                      <i class="fa fa-pencil-square-o" aria-hidden="true"></i>
                    </span>
                  )}
                </td>
                <td>
                  <InputField
                    value={item?.estimatedAmount}
                    name="estimatedAmount"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].estimatedAmount = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                </td>
                <td>
                  <InputField
                    value={item?.customerFinalAmount}
                    name="customerFinalAmount"
                    type="number"
                    onChange={(e) => {
                      const copyRowDto = [...rowDto];
                      copyRowDto[index].customerFinalAmount = e.target.value;
                      setRowDto(copyRowDto);
                    }}
                  />
                </td>
                <td className="text-right">{item?.actualAmount}</td>
                <td className="text-right">
                  <OverlayTrigger
                    overlay={
                      <Tooltip className="mytooltip" id="info-tooltip">
                        <div>
                          {item?.estimatePDABillCreateDtos?.map((itm, idx) => {
                            return (
                              <>
                                <div>
                                  <p
                                    style={{
                                      margin: '0',
                                      color:
                                        itm?.status === 'Paid'
                                          ? 'green'
                                          : 'orange',
                                    }}
                                  >
                                    <b>
                                      {idx + 1}{' '}
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          padding: '0 5px',
                                        }}
                                      >
                                        |
                                      </span>{' '}
                                      {moment(itm?.billDate).format(
                                        'YYYY-MM-DD',
                                      )}{' '}
                                      <span
                                        style={{
                                          display: 'inline-block',
                                          padding: '0 5px',
                                        }}
                                      >
                                        |
                                      </span>{' '}
                                      {itm?.total}
                                    </b>
                                  </p>
                                </div>
                              </>
                            );
                          })}
                        </div>
                      </Tooltip>
                    }
                  >
                    <b
                      style={{
                        color: 'blue',
                        textDecoration: 'underline',
                        cursor: 'pointer',
                      }}
                    >
                      {item?.estimatePDABillCreateDtos?.length > 0 && billTotal}
                    </b>
                  </OverlayTrigger>
                </td>
                <td className="text-center">
                  <span
                    className="pointer"
                    onClick={() => {
                      isShowBillModal(true);
                      setClickRowData({
                        ...item,
                        rowIdx: index,
                      });
                    }}
                  >
                    <IAdd title={'Bill Add'} />
                  </span>
                  {editId && !item?.isPo && (
                    <>
                      <span className="ml-2">
                        <OverlayTrigger
                          overlay={<Tooltip id="cs-icon">PO Create</Tooltip>}
                        >
                          <span
                            onClick={() => {
                              setModalShow(true);
                              // const prvRow = JSON.stringify(
                              //   widthOutModfifyRowDto
                              // );
                              // const prvRowDto =JSON.stringify(rowDto);

                              // if (prvRow !== prvRowDto) {
                              //   return toast.error(
                              //     "Please Save Previous Row First"
                              //   );
                              // }

                              let list = [];

                              if (item?.category === 'Operation') {
                                list =
                                  rowDto?.filter(
                                    (itm) =>
                                      itm?.category === 'Operation' &&
                                      +itm?.estimatedAmount > 0,
                                  ) || [];
                              } else {
                                list = [item];
                              }
                              console.log(list);
                              setClickRowData(list);
                            }}
                          >
                            <i class="fa fa-share" aria-hidden="true"></i>
                          </span>
                        </OverlayTrigger>
                      </span>
                    </>
                  )}

                  {item?.isPo && (
                    <span className="ml-2">
                      <OverlayTrigger
                        overlay={<Tooltip id="cs-icon">View PO</Tooltip>}
                      >
                        <span
                          onClick={() => {
                            setShowViewModal(true);
                            setClickRowData(item);
                          }}
                        >
                          <i class="fa fa-eye" aria-hidden="true"></i>
                        </span>
                      </OverlayTrigger>
                    </span>
                  )}
                </td>
              </tr>
            );
          })}
          <tr>
            <td colSpan={3}>
              <b>Total</b>
            </td>
            <td>
              <b>
                {rowDto?.reduce(
                  (acc, cur) => acc + (+cur?.estimatedAmount || 0),
                  0,
                ) || 0}
              </b>
            </td>
            <td>
              <b>
                {rowDto?.reduce(
                  (acc, cur) => acc + (+cur?.customerFinalAmount || 0),
                  0,
                ) || 0}
              </b>
            </td>
            <td className="text-right">
              <b>
                {rowDto?.reduce(
                  (acc, cur) => acc + (+cur?.actualAmount || 0),
                  0,
                ) || 0}
              </b>
            </td>
            <td className="text-right">
              <b>
                {rowDto?.reduce(
                  (acc, cur) =>
                    acc +
                    (cur?.estimatePDABillCreateDtos?.reduce(
                      (acc, cur) => acc + (+cur?.total || 0),
                      0,
                    ) || 0),
                  0,
                ) || 0}
              </b>
            </td>
            <td></td>
          </tr>
        </tbody>
      </table>

      {// Bill Modal
      isBillModal && (
        <>
          <IViewModal
            show={isBillModal}
            onHide={() => {
              isShowBillModal(false);
              setClickRowData({});
            }}
          >
            <BillForm
              clickRowData={clickRowData}
              estimatePDABillAddHandler={({ billRowDto, cb }) => {
                const copyRowDto = [...rowDto];
                copyRowDto[
                  clickRowData?.rowIdx
                ].estimatePDABillCreateDtos = billRowDto;
                setRowDto(copyRowDto);
                isShowBillModal(false);
                setClickRowData({});
              }}
            />
          </IViewModal>
        </>
      )}
      {modalShow && (
        <>
          <IViewModal
            show={modalShow}
            onHide={() => {
              setModalShow(false);
              setClickRowData({});
            }}
          >
            <POPreview estimatePDAList={clickRowData} />
          </IViewModal>
        </>
      )}

      {showViewModal && (
        <IViewModal
          show={showViewModal}
          onHide={() => {
            setShowViewModal(false);
            setClickRowData({});
          }}
          title="View Purchase Order"
        >
          <PurchaseOrderViewTableRow
            poId={clickRowData?.poId}
            orId={clickRowData?.poTypeId}
            isHiddenBackBtn={true}
          />
        </IViewModal>
      )}
    </div>
  );
}

export default RowTable;
