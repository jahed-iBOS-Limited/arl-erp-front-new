import React, {useMemo} from "react";
import objectPath from "object-path";
import {Link, useHistory} from "react-router-dom";
import {toAbsoluteUrl} from "../../../../_helpers";
import {useHtmlClassService} from "../../../_core/MetronicLayout";
import {HeaderMenu} from "./HeaderMenu";
import { useDispatch } from "react-redux";
import { setResetDataAction } from "../../../../../app/modules/chatApp/redux/Action";
import { ChatAppPeer, ChatAppSocket } from "../../../../../app/modules/chatApp";
import { Logout } from "../../../../../app/modules/Auth/_redux/Auth_Actions";
import { clearLocalStorageAction } from "../../../../../app/modules/_helper/reduxForLocalStorage/Actions";

export function HeaderMenuWrapper() {
    const uiService = useHtmlClassService();
    const layoutProps = useMemo(() => {
        return {
            config: uiService.config,
            ktMenuClasses: uiService.getClasses("header_menu", true),
            rootArrowEnabled: objectPath.get(
                uiService.config,
                "header.menu.self.root-arrow"
            ),
            menuDesktopToggle: objectPath.get(uiService.config, "header.menu.desktop.toggle"),
            headerMenuAttributes: uiService.getAttributes("header_menu"),
            headerSelfTheme: objectPath.get(uiService.config, "header.self.theme"),
            ulClasses: uiService.getClasses("header_menu_nav", true),
            disabledAsideSelfDisplay:
                objectPath.get(uiService.config, "aside.self.display") === false
        };
    }, [uiService]);
    const getHeaderLogo = () => {
        let result = "logo-light.png";
        if (layoutProps.headerSelfTheme && layoutProps.headerSelfTheme !== "dark") {
            result = "logo-dark.png";
        }
        return toAbsoluteUrl(`/media/logos/${result}`);
    };

    const history = useHistory();
    const dispatch = useDispatch();

    const logoutClick = () => {
        const toggle = document.getElementById("kt_quick_user_toggle");
        if (toggle) {
          /* Disconnect Web Socket And Peer Connection For Chat And Others */
          dispatch(setResetDataAction());
          ChatAppSocket && ChatAppSocket.disconnect();
          ChatAppPeer && ChatAppPeer.disconnect();
    
          toggle.click();
          dispatch(Logout());
          dispatch(clearLocalStorageAction());
        }
    
        document.title = "iBOS | Web App"; // Clear the title
        history.push("/logout");
        setTimeout(() => {
          window.location.reload();
        }, 500);
      };

    return <>
        {/*begin::Header Menu Wrapper*/}
        <div className="header-menu-wrapper header-menu-wrapper-left" id="kt_header_menu_wrapper">
            {layoutProps.disabledAsideSelfDisplay && (
                <>
                    {/*begin::Header Logo*/}
                    <div className="header-logo">
                        <Link to="/">
                            <img alt="logo" src={getHeaderLogo()}/>
                        </Link>
                    </div>
                    {/*end::Header Logo*/}
                    
                </>
            )}
            {/*begin::Header Menu*/}
            <HeaderMenu logoutClick={logoutClick} layoutProps={layoutProps} />
            
            {/*end::Header Menu*/}
        </div>
        {/*Header Menu Wrapper*/}
    </>
}
