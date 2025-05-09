import React, { useEffect } from 'react';
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition';

function ReactSpeechRecognition({ setSearchInput, searchHandlerCB }) {
  const [componetRender, setComponetRender] = React.useState(false);
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert(
      'Your browser does not support speech recognition software! Try Chrome desktop, maybe?'
    );
    return null;
  }

  console.log(listening, componetRender);
  return (
    <>
      <div className="microphone d-flex align-items-center mr-6 ml-1">
        <i
          class="fa fa-microphone pointer"
          aria-hidden="true"
          style={{
            fontSize: '15px',
            color: listening && componetRender ? 'red' : '',
          }}
          onClick={() => {
            setSearchInput('');
            if (!listening) {
              SpeechRecognition.startListening();
              setComponetRender(true);
            } else {
              resetTranscript();
              setComponetRender(false);
            }
          }}
        ></i>
        {componetRender && (
          <TranscriptSet
            transcript={transcript}
            setSearchInput={setSearchInput}
            listening={listening}
            resetTranscript={resetTranscript}
            searchHandlerCB={searchHandlerCB}
          />
        )}
      </div>
    </>
  );
}

export default ReactSpeechRecognition;

function TranscriptSet({
  listening,
  transcript,
  resetTranscript,
  setSearchInput,
  searchHandlerCB,
}) {
  useEffect(() => {
    if (!listening && transcript) {
      setSearchInput(transcript);
      resetTranscript();
      searchHandlerCB(transcript);
    }
  }, [listening, transcript]);

  return <></>;
}
