import { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import ISpinner from './_spinner';

// Set up the worker for PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

type propsType = {
  url: string;
};
function PDFViewer({ url }: propsType) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [scale, setScale] = useState(1.0);

  const pdfUrl = url;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setIsLoading(false);
  }

  const goToPrevPage = () => {
    setPageNumber((prev) => Math.max(prev - 1, 1));
  };

  const goToNextPage = () => {
    setPageNumber((prev) => Math.min(prev + 1, numPages || prev));
  };

  const handleWheel = (event: WheelEvent) => {
    if (event.ctrlKey) {
      event.preventDefault();
      if (event.deltaY < 0) {
        setScale((prev) => Math.min(prev + 0.1, 3.0)); // Zoom in
      } else {
        setScale((prev) => Math.max(prev - 0.1, 0.5)); // Zoom out
      }
    }
  };

  useEffect(() => {
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }, []);

  return (
    <div className="">
      {isLoading && (
        <div className="flex items-center justify-center p-8">
          <ISpinner isShow={true} />
        </div>
      )}

      <div className="flex justify-center mb-4">
        <Document
          file={pdfUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={
            <div className="flex items-center justify-center p-8">
              <ISpinner isShow={true} />
            </div>
          }
          error={
            <div className="text-red-500 text-center p-4">
              Failed to load PDF. Please check if the URL is correct and
              accessible.
            </div>
          }
        >
          <Page
            pageNumber={pageNumber}
            renderTextLayer={true}
            renderAnnotationLayer={true}
            scale={scale}
            className="border d-flex justify-content-center"
          />
        </Document>
      </div>

      <div className="d-flex justify-content-center">
        <div className="d-flex align-items-center">
          <button
            onClick={goToPrevPage}
            disabled={pageNumber <= 1}
            className="btn btn-primary"
          >
            Previous
          </button>

          <span className="mx-4">
            Page {pageNumber} of {numPages}
          </span>

          <button
            onClick={goToNextPage}
            disabled={pageNumber >= (numPages || 1)}
            className="btn btn-primary"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default PDFViewer;
