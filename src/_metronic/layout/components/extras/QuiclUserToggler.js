/* eslint-disable no-restricted-imports */
/* eslint-disable no-script-url,jsx-a11y/anchor-is-valid */
import objectPath from "object-path";
import React, { useMemo } from "react";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { useSelector } from "react-redux";
import { AvaterImage } from "../../../../app/modules/_helper/_avaterImage";
import { useHtmlClassService } from "../../_core/MetronicLayout";
import { UserProfileDropdown } from "./dropdowns/UserProfileDropdown";

export function QuickUserToggler() {
  const { isAuth, profileData } = useSelector((state) => state.authData);
  const uiService = useHtmlClassService();
  const layoutProps = useMemo(() => {
    return {
      offcanvas:
        objectPath.get(uiService.config, "extras.user.layout") === "offcanvas",
    };
  }, [uiService]);

  return (
    <>
      {layoutProps.offcanvas && isAuth && (
        <OverlayTrigger
          placement="bottom"
          overlay={<Tooltip id="quick-user-tooltip">View user</Tooltip>}
        >
          <div className="topbar-item">
            <div
              className="btn btn-icon w-auto btn-clean d-flex align-items-center btn-lg px-2"
              id="kt_quick_user_toggle"
            >
              <>
                <span className="font-weight-bold font-size-base d-none d-md-inline mr-1">
                  Hi,
                </span>
                <span className="text-dark-50 font-weight-bolder font-size-base d-none d-md-inline mr-2 text-uppercase">
                  {profileData?.userName}
                </span>
                <span>
                  {profileData?.userImageFile ? (
                    <AvaterImage src={profileData?.userImageFile} />
                  ) : (
                    <i
                      className="fas fa-user-circle"
                      style={{ fontSize: "20px !important" }}
                    />
                  )}
                </span>
              </>
            </div>
          </div>
        </OverlayTrigger>
      )}

      {!layoutProps.offcanvas && <UserProfileDropdown />}
    </>
  );
}
