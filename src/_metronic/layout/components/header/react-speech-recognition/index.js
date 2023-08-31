import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import Commands from "./commands";

function ReactSpeechRecognition() {
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    alert(
      "Your browser does not support speech recognition software! Try Chrome desktop, maybe?"
    );
    return null;
  }


  return (
    <>
      <div className='microphone d-flex align-items-center mr-6'>
        <Commands
          listening={listening}
          transcript={transcript}
          resetTranscript={resetTranscript}
        />
        <i
          class='fa fa-microphone pointer'
          aria-hidden='true'
          style={{ fontSize: "15px", color: listening ? "red" : "" }}
          onClick={() => {
            if (!listening) {
              SpeechRecognition.startListening();
            } else {
              resetTranscript();
            }
          }}
        ></i>
      </div>
    </>
  );
}

export default ReactSpeechRecognition;
