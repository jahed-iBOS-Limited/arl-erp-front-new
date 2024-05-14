import React, { useMemo, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { HeaderMenuWrapper } from "./header-menu/HeaderMenuWrapper";
import { AnimateLoading } from "../../../_partials/controls";
import { shallowEqual, useSelector } from "react-redux";

export function Header() {
  const uiService = useHtmlClassService();
  const commonDDL = useSelector((state) => {
    return state?.commonDDL;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const manualClickHandler = () => {
    window.open(
      "https://docs.google.com/document/d/1h8N-fjk3yXEkk1_orlHhBna9VqQT4NqlQER9PEfBzVc/view"
    );
  };

  const layoutProps = useMemo(() => {
    return {
      headerClasses: uiService.getClasses("header", true),
      headerAttributes: uiService.getAttributes("header"),
      headerContainerClasses: uiService.getClasses("header_container", true),
      menuHeaderDisplay: objectPath.get(
        uiService.config,
        "header.menu.self.display"
      ),
    };
  }, [uiService]);

  return (
    <>
      {/*begin::Header*/}
      <div
        className={`header ${layoutProps.headerClasses}`}
        id="kt_header"
        {...layoutProps.headerAttributes}
      >
        {/*begin::Container*/}
        {window?.location?.origin !== "https://erp.ibos.io" && (
          <b  style={{ marginLeft: "23px" }} className="mt-3 danger development-env">
            Development
          </b>
        )}

        <div
          style={{
            display: "flex",
            gap: "15px",
            minWidth: '100%',
            alignItems: "center",
            marginLeft: "10px",
          }}
          clsasName="user-basic-info"
        >
          <p className="m-0">
            <b>OID: {commonDDL?.OID}</b>
          </p>
          <p className="m-0">
            <b>Enroll No: {profileData?.employeeId}</b>
          </p>
          <p
            onClick={() => manualClickHandler()}
            className="m-0 pointer text-primary"
          >
            <b>Manual</b>
          </p>
        </div>
        <div
          className={` ${layoutProps.headerContainerClasses} d-flex align-items-stretch justify-content-between`}
        >
          <AnimateLoading />
          {/*begin::Header Menu Wrapper*/}
          {layoutProps.menuHeaderDisplay && <HeaderMenuWrapper />}
          {!layoutProps.menuHeaderDisplay && <div />}
          {/*end::Header Menu Wrapper*/}

          {/*begin::Topbar*/}

          <Topbar />

          {/*end::Topbar*/}
        </div>
        {/*end::Container*/}
      </div>
      {/*end::Header*/}
    </>
  );
}
