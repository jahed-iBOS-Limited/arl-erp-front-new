import React from "react";
import { Redirect, Switch } from "react-router-dom";
import { LayoutSplashScreen, ContentRoute } from "../../../_metronic/layout";
import { Suspense } from "react";
import ChatApps from "./chats/chatsApp";

export function ChatPages() {
  return (
    <Suspense fallback={<LayoutSplashScreen />}>
      <Switch>
        <Redirect exact={true} from="/chat" to="/chat/personal" />
        <ContentRoute path="/chat/personal" component={ChatApps} />
      </Switch>
    </Suspense>
  );
}
export default ChatPages;
