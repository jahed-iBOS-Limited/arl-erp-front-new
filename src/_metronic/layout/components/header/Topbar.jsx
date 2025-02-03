import objectPath from 'object-path';
import React, { useMemo } from 'react';
import { useHtmlClassService } from '../../_core/MetronicLayout';
import { QuickUserToggler } from '../extras/QuiclUserToggler';
import ChatBoat from './chat-boat';
import ReactSpeechRecognition from './react-speech-recognition';

export function Topbar() {
  const uiService = useHtmlClassService();

  const layoutProps = useMemo(() => {
    return {
      viewUserDisplay: objectPath.get(uiService.config, 'extras.user.display'),
    };
  }, [uiService]);

  return (
    <>
      <div className="topbar">
        <ChatBoat />
        <ReactSpeechRecognition />
        {layoutProps.viewUserDisplay && <QuickUserToggler />}
      </div>
    </>
  );
}
