import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';
import React, { memo, useEffect, useState } from 'react';
import './styles.scss';

interface IPDFViewerProps {
    uri: string
}

//Credit to Mozilla and this tutorial:
//https://code.tutsplus.com/tutorials/how-to-create-a-pdf-viewer-in-javascript--cms-32505

const PDFViewer = (props: IPDFViewerProps) => {
    const { uri } = props
    const [pageNumber, setPageNumber] = useState<number>(1)
    const [pdf, setPdf] = useState(null)
    const [maxPages, setMaxPages] = useState(1)

    const getPageAndRender = (pdfPageNumber: number, pdfFile: any) =>
        pdfFile.getPage(pdfPageNumber).then((fetchedPage: any) => {
            setPageNumber(pdfPageNumber)
            render(fetchedPage)
        })

    useEffect(() => {
        GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.8.335/pdf.worker.min.js`;
        getDocument(uri).promise.then((fetchedPdf: any) => {
            setMaxPages(fetchedPdf._pdfInfo.numPages)
            setPdf(fetchedPdf)
            fetchedPdf.getPage(1).then((fetchedPage: any) => render(fetchedPage))
        });
    }, [uri])

    const render = (pageToRender: any) => {
        var canvas = document.getElementById("pdf-renderer") as HTMLCanvasElement;
        if (canvas && pageToRender) {
            var ctx = canvas.getContext('2d')
            var viewport = pageToRender.getViewport({ scale: 1 })

            canvas.width = viewport.width
            canvas.height = viewport.height

            pageToRender.render({
                canvasContext: ctx,
                viewport: viewport
            })
        }
    }

    

    return (
        <div id="pdf-viewer">
            <div id="canvas-container">
                <canvas id="pdf-renderer" />
            </div>
            <div id="pdf-viewer-footer">
                <div id="navigation-controls">
                    <button id="go-previous" disabled={pageNumber - 1 < 1} onClick={() => getPageAndRender(pageNumber - 1, pdf)}>Previous</button>
                    <button id="go-next" disabled={pageNumber + 1 > maxPages} onClick={() => getPageAndRender(pageNumber + 1, pdf)}>Next</button>
                </div>
            </div>
        </div>)
}

export default memo(PDFViewer)