import axios from 'axios'
import React, { memo, useEffect, useState } from 'react'
import './styles.scss'

interface IWebBrowserProps {
    url: string
}

const WebBrowser = (props: IWebBrowserProps) => {
    const { url } = props
    const [body, setBody] = useState<string>('')

    const cancelTokenSource = axios.CancelToken.source();
    const proxyUrl = `https://api.allorigins.win/get?url=${url}`

    useEffect(() => {
        axios.get(proxyUrl, { cancelToken: cancelTokenSource.token }).then(res => {
            setBody(res.data.contents)
        })

        return () => cancelTokenSource.cancel()
    }, [cancelTokenSource, proxyUrl])

    return (
        <>
            <input readOnly className="url-bar" value={url} />
            <div dangerouslySetInnerHTML={{ __html: body }} className="web-browser" />
        </>
    )
}

export default memo(WebBrowser)