/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import React from "react";
import { useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import SVG from "react-inlinesvg";
import { toAbsoluteUrl, checkIsActive } from "../../../../_helpers";

export function HeaderMenu({ layoutProps, logoutClick }) {
  const location = useLocation();
  const getMenuItemActive = (url) => {
    return checkIsActive(location, url) ? "menu-item-active" : "";
  };

  return (
    <div
      id="kt_header_menu"
      className={`header-menu header-menu-mobile ${layoutProps.ktMenuClasses}`}
      {...layoutProps.headerMenuAttributes}
    >
      <div className="d-flex">
        
        {/* <button
                className="btn btn-light-primary btn-bold"
                onClick={() => window.location.reload()}
              >
                Update
              </button> */}
      </div>
      {/*begin::Header Nav*/}
      <ul className={`menu-nav ${layoutProps.ulClasses}`}>
      <button
          className="btn btn-light-primary btn-bold mr-1 mt-5 ml-2"
          onClick={logoutClick}
        >
          Sign out
        </button>
        {/*begin::1 Level*/}
        <li
          className={`menu-item menu-item-rel ${getMenuItemActive(
            "/dashboard"
          )}`}
        >
          <NavLink className="menu-link" to="/dashboard">
            <span className="menu-text">Dashboard</span>
            {layoutProps.rootArrowEnabled && <i className="menu-arrow" />}
          </NavLink>
        </li>
        {/*end::1 Level*/}

        {/*Classic submenu*/}
        {/*begin::1 Level*/}
        {/* Procurement Management */}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup="true"
          className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive(
            "/procurement"
          )}`}
        >
          <NavLink className="menu-link menu-toggle" to="/procurement">
            <span className="menu-text">Procurement Management</span>
            <i className="menu-arrow"></i>
          </NavLink>
          <div className="menu-submenu menu-submenu-classic menu-submenu-left">
            <ul className="menu-subnav">
              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/procurement/purchase-management"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/procurement/purchase-management"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Purchase</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/purchase-request"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/purchase-request"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Purchase Request</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/purchase-organization"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/purchase-organization"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Purchase Organization</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/supplier-item-assignment"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/supplier-item-assignment"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">
                          Supplier Item Assignment
                        </span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/configpotype-itemtype"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/configpotype-itemtype"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">
                          Config PO Type Item Type
                        </span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/purchaseorder"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/purchaseorder"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Purchase Order</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/rfq"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/rfq"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Request For Quotation</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/maintain-rfq"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/maintain-rfq"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Maintain RFQ</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/procurement/purchase-management/comparative-statement"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/procurement/purchase-management/comparative-statement"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Comparative Statement</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*end::1 Level*/}

        {/*Classic submenu*/}
        {/*begin::1 Level*/}
        {/* Financial Management */}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup="true"
          className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive(
            "/financial-management"
          )}`}
        >
          <NavLink className="menu-link menu-toggle" to="/financial-management">
            <span className="menu-text">Accounts and Finance</span>
            <i className="menu-arrow"></i>
          </NavLink>
          <div className="menu-submenu menu-submenu-classic menu-submenu-left">
            <ul className="menu-subnav">
              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/financial-management/financials"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/financial-management/financials"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Financials</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/sbu"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/sbu"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">SBU</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/financial-management/configuration"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/financial-management/configuration"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Configuration</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/configuration/general-ladger"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/configuration/general-ladger"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">General Ladger</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/financial-management/invoicemanagement-system"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/financial-management/invoicemanagement-system"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Invoice Management System</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/invoicemanagement-system/purchaseinvoice"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/invoicemanagement-system/purchaseinvoice"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Purchase Invoice</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/invoicemanagement-system/postpurchaseinvoice"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/invoicemanagement-system/postpurchaseinvoice"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Post Purchase Invoice</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/invoicemanagement-system/reconsilepurchase-invoicewith-advance"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/invoicemanagement-system/reconsilepurchase-invoicewith-advance"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">
                          Reconsile Purchase Invoice
                        </span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/financial-management/cost-controlling"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/financial-management/cost-controlling"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Cost Controlling</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/controlling-unit"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/controlling-unit"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Controlling Unit</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/profit-center-group"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/profit-center-group"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Profit Center Group</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/profitcenter"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/profitcenter"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Profit Center</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/costcenter-group"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/costcenter-group"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Cost Center Group</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/costcenter-type"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/costcenter-type"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Cost Center Type</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/cost_center"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/cost_center"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Cost Center</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/financial-management/financials/costelement"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/financial-management/financials/costelement"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Cost Element</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*end::1 Level*/}

        {/*Classic submenu*/}
        {/*begin::1 Level*/}
        {/* Inventory Management */}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup="true"
          className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive(
            "/inventory-management"
          )}`}
        >
          <NavLink className="menu-link menu-toggle" to="/inventory-management">
            <span className="menu-text">Inventory Management</span>
            <i className="menu-arrow"></i>
          </NavLink>
          <div className="menu-submenu menu-submenu-classic menu-submenu-left">
            <ul className="menu-subnav">
              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/inventory-management/configuration"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/inventory-management/configuration"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Configuration</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/inventory-management/configuration/plant"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory-management/configuration/plant"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Plant</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/inventory-management/configuration/warehouse"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory-management/configuration/warehouse"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Warehouse</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/inventory-management/configuration/conf-plant-warehouse"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory-management/configuration/conf-plant-warehouse"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">
                          Config Plant Warehouse
                        </span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/inventory-management/configuration/inventory-location"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory-management/configuration/inventory-location"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Inventory Location</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/inventory-management/warehouse-management"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/inventory-management/warehouse-management"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Warehouse Management</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/inventory-management/configuration/inventorytransaction"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/inventory-management/configuration/inventorytransaction"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Inventory Transaction</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*end::1 Level*/}

        {/*Classic submenu*/}
        {/*begin::1 Level*/}
        {/* Configuration */}
        <li
          data-menu-toggle={layoutProps.menuDesktopToggle}
          aria-haspopup="true"
          className={`menu-item menu-item-submenu menu-item-rel ${getMenuItemActive(
            "/config"
          )}`}
        >
          <NavLink className="menu-link menu-toggle" to="/config">
            <span className="menu-text">Configuration</span>
            <i className="menu-arrow"></i>
          </NavLink>
          <div className="menu-submenu menu-submenu-classic menu-submenu-left">
            <ul className="menu-subnav">
              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/config/domain-controll"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/config/domain-controll"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Design/PenAndRuller.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Basic Configuration</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/domain-controll/business-unit"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/domain-controll/business-unit"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Business Unit</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/domain-controll/create-user"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/domain-controll/create-user"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">User</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/domain-controll/user-group"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/domain-controll/user-group"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">User Group</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/domain-controll/activity-group"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/domain-controll/activity-group"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Activity Group</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/domain-controll/role-manager"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/domain-controll/role-manager"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">User Role Manager</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/domain-controll/role-extension"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/domain-controll/role-extension"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">User Role Extension</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/config/material-management"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/config/material-management"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Navigation/Arrow-from-left.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Item Management</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/item-basic-info"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/item-basic-info"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Item Profile</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/item-category"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/item-category"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Item Category</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/item-sub-category"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/item-sub-category"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Item Sub-Category</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/item-attribute"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/item-attribute"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Item Attribute</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/unit-of-measurement"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/unit-of-measurement"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Unit Of Measurement</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/config-item-type-gl"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/config-item-type-gl"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Config Item Type GL</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/price-component"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/price-component"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Price Component</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/material-management/price-structure"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/material-management/price-structure"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Price Structure</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}

              {/*begin::2 Level*/}
              <li
                className={`menu-item menu-item-submenu ${getMenuItemActive(
                  "/config/partner-management"
                )}`}
                data-menu-toggle="hover"
                aria-haspopup="true"
              >
                <NavLink
                  className="menu-link menu-toggle"
                  to="/config/partner-management"
                >
                  <span className="svg-icon menu-icon">
                    <SVG
                      src={toAbsoluteUrl(
                        "/media/svg/icons/Layout/Layout-left-panel-1.svg"
                      )}
                    />
                  </span>
                  <span className="menu-text">Partner Management</span>
                  <i className="menu-arrow" />
                </NavLink>
                <div
                  className={`menu-submenu menu-submenu-classic menu-submenu-right`}
                >
                  <ul className="menu-subnav">
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/partner-management/partner-basic-info"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/partner-management/partner-basic-info"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Partner Profile</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}

                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/partner-management/partner-purchase-info"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/partner-management/partner-purchase-info"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Partner Purchase Info</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                    {/*begin::3 Level*/}
                    <li
                      className={`menu-item ${getMenuItemActive(
                        "/config/partner-management/partner-bank-info"
                      )}`}
                    >
                      <NavLink
                        className="menu-link"
                        to="/config/partner-management/partner-bank-info"
                      >
                        <i className="menu-bullet menu-bullet-dot">
                          <span />
                        </i>
                        <span className="menu-text">Partner Bank Info</span>
                      </NavLink>
                    </li>
                    {/*end::3 Level*/}
                  </ul>
                </div>
              </li>
              {/*end::2 Level*/}
            </ul>
          </div>
        </li>
        {/*end::1 Level*/}
      </ul>
      {/*end::Header Nav*/}
    </div>
  );
}
