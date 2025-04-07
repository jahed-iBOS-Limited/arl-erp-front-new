import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import IDelete from './_helperIcons/_delete';

export const TableAction = (
  cellContent,
  row,
  rowIndex,
  {
    openExtendPage,
    openViewDialog,
    openChartPage,
    key,
    yearId,
    empId,
    isView,
    isEdit,
    isDelete,
    isExtend,
    isChart,
    shipmentCode,
    openEditPage,
    isViewEditText,
    deleteHandler,
  }
) => {
  return (
    <div className="d-flex justify-content-center">
      <div className={isEdit ? '' : 'd-none'}>
        <OverlayTrigger
          overlay={<Tooltip id="products-edit-tooltip">Edit product</Tooltip>}
        >
          <span
            onClick={() => openEditPage(row[key])}
            style={{ paddingRight: '15px', cursor: 'pointer' }}
          >
            <i className="far fa-edit"></i>
          </span>
        </OverlayTrigger>
      </div>

      <div className={isView ? '' : 'd-none'}>
        <OverlayTrigger
          overlay={
            <Tooltip id="products-delete-tooltip">
              {isViewEditText ? 'View/Edit' : 'View'}
            </Tooltip>
          }
        >
          <a
            className="view-icon"
            onClick={() => openViewDialog(row[key], row[shipmentCode])}
          >
            <span className="svg-icon svg-icon-md svg-icon-success">
              <i className="view_fa fa fa-eye view_fa" aria-hidden="true"></i>
            </span>
          </a>
        </OverlayTrigger>
      </div>
      <div
        className={isDelete ? '' : 'd-none'}
        onClick={() => {
          deleteHandler(row);
        }}
      >
        <IDelete />
      </div>

      <div className={isExtend ? '' : 'd-none'}>
        <OverlayTrigger
          overlay={<Tooltip id="products-delete-tooltip">Extend</Tooltip>}
        >
          <a className="view-icon" onClick={() => openExtendPage(row[key])}>
            <span className="svg-icon svg-icon-md svg-icon-success">
              <i className="fa fa-arrows-alt" aria-hidden="true"></i>
            </span>
          </a>
        </OverlayTrigger>
      </div>

      {/* Chart Icon */}
      <div className={isChart ? '' : 'd-none'}>
        <OverlayTrigger
          overlay={<Tooltip id="chart-tooltip">Dashboard Setup</Tooltip>}
        >
          <a className="view-icon" onClick={() => openChartPage(row[empId])}>
            <span className="svg-icon svg-icon-md svg-icon-success">
              <i className="fas fa-chart-bar"></i>
            </span>
          </a>
        </OverlayTrigger>
      </div>
    </div>
  );
};
