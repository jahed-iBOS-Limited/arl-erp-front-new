import React, { useMemo, useState } from "react";
import objectPath from "object-path";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { Topbar } from "./Topbar";
import { HeaderMenuWrapper } from "./header-menu/HeaderMenuWrapper";
import { AnimateLoading } from "../../../_partials/controls";
import { shallowEqual, useSelector } from "react-redux";
import IViewModal from "../../../../app/modules/_helper/_viewModal";

export function Header() {
  const uiService = useHtmlClassService();
  const commonDDL = useSelector((state) => {
    return state?.commonDDL;
  }, shallowEqual);

  const profileData = useSelector((state) => {
    return state.authData.profileData;
  }, shallowEqual);

  const [isOpenManual, setIsOpenManual] = useState(false);

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
        id='kt_header'
        {...layoutProps.headerAttributes}
      >
        {/*begin::Container*/}
        {window?.location?.origin !== "https://erp.ibos.io" && (
          <b style={{ marginLeft: "23px" }} className='mt-3 danger'>
            Development
          </b>
        )}

        <div
          style={{
            display: "flex",
            gap: "15px",
            width: '500px',
            alignItems: 'center',
            marginLeft: '10px',
          }}
        >
          <p className="m-0"><b>OID: {commonDDL?.OID}</b></p>
          <p className="m-0"><b>Enroll No: {profileData?.employeeId}</b></p>
          <p onClick={() => setIsOpenManual(true)} className="m-0 pointer text-primary"><b>Manual</b></p>
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
      <IViewModal
        show={isOpenManual}
        onHide={() => setIsOpenManual(false)}
      >
        {/* <iframe height="500" width="100%" src="https://jahed.netlify.app/" title="description"></iframe> */}
      </IViewModal>
      {/*end::Header*/}
    </>
  );
}
