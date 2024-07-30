import React, { useMemo } from "react";
import { useHtmlClassService } from "../../_core/MetronicLayout";

export function Footer() {
  const today = new Date().getFullYear();
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      footerClasses: uiService.getClasses("footer", true),
      footerContainerClasses: uiService.getClasses("footer_container", true),
    };
  }, [uiService]);

  // const chatAppUserInfo = useSelector((state) => state?.authData?.chatAppInfo)

  // const currentChatUser = useSelector((state) => {
  //   return state?.chatApp?.currentChatUser
  // }, shallowEqual)

  // useEffect(() => {
  //   let socket = io(process.env.REACT_APP_CHAT_BACKEND_URL, {
  //     withCredentials: true,
  //     extraHeaders: {
  //       'my-custom-header': 'abcd',
  //     },
  //   })
  //   socket.emit('activeUser', chatAppUserInfo)

  //   // listen active user
  //   socket.on('activeUser', (activeUser) => {
  //     console.log('activeUser', activeUser)
  //   })

  //   socket.on(`${chatAppUserInfo?._id}newMessage`, (newMessage, fromUser) => {
  //     setNotificationsFrom(fromUser)
  //   })

  //   return () => {
  //     socket.emit('inActive', chatAppUserInfo)
  //   }
  // }, [])

  // useEffect(() => {
  //   if (notificationsFrom?._id !== currentChatUser?._id) {
  //     dispatch(
  //       setNotificationsAction({ status: true, from: notificationsFrom })
  //     )
  //     let audio = new Audio('/sharp.mp3')
  //     audio.volume = 0.3
  //     audio.play()
  //   }
  // }, [notificationsFrom])

  return (
    <div
      className={`footer bg-white py-4 d-flex flex-lg-column  ${layoutProps.footerClasses}`}
      id="kt_footer"
    >
      <div
        className={`${layoutProps.footerContainerClasses} d-flex flex-column flex-md-row align-items-center justify-content-between`}
      >
        <div className="text-dark order-2 order-md-1">
          <span className="text-muted font-weight-bold mr-2">
            {today.toString()}
          </span>{" "}
          &copy;{" "}
          <a
            href="https://ibos.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-dark-75 text-hover-primary"
          >
            AKIJ iBOS Limited
          </a>
        </div>
        <div className="nav nav-dark order-1 order-md-2">
          <a
            href="https://ibos.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pr-3 pl-0 pt-0 pb-0"
          >
            About
          </a>
          <a
            href="https://ibos.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link px-3 pt-0 pb-0"
          >
            Team
          </a>
          <a
            href="https://ibos.io/"
            target="_blank"
            rel="noopener noreferrer"
            className="nav-link pl-3 pr-0 pt-0 pb-0"
          >
            Contact
          </a>
          {/* <div
            onClick={() => history.push("/chat/personal")}
            className="ml-3 pointer"
          >
            <i style={{ fontSize: "25px" }} className="fas fa-comment-alt"></i>
          </div> */}
          {/* if user already chat with that user, then don't need to show notification */}
          {/* {notifications?.status && (
            <div
              style={{
                position: 'absolute',
                marginTop: '-80px',
                background: '#28BEF1',
                width: '200px',
                padding: '10px 5px',
                cursor: 'pointer',
              }}
              onClick={() => {
                if (notificationsFrom?.name) {
                  dispatch(setNotificationsAction({ status: false, from: '' }))
                  // wentFrom means, user click notification, and view that message, we will use this wentFrom status in messagebox component
                  dispatch(
                    setCurrentChatUserAction({
                      ...notificationsFrom,
                      wentFrom: 'notifications',
                    })
                  )
                  history.push('/chat/personal')
                }
              }}
            >
              <p className="text-white">
                You have received a message from {notifications?.from?.name}
              </p>
              <div
                onClick={(e) => {
                  e.stopPropagation()
                  dispatch(setNotificationsAction({ status: false, from: '' }))
                }}
                className="text-white pointer"
                style={{
                  position: 'absolute',
                  right: '2px',
                  top: '0',
                  fontSize: '18px',
                  zIndex: '9999',
                }}
              >
                X
              </div>
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
}
