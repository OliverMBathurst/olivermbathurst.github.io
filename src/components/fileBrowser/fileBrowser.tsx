import {
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState
} from "react"
import {
    BRANCHING_CONTEXT_DETERMINER
} from "../../constants"
import {
    FileSystemContext,
    WindowsContext
} from "../../contexts"
import { IWindowRenderProps } from "../../interfaces/fs"
import { BranchingContext } from "../../types/fs"
import { FileBrowserTabContent } from "./components/fileBrowserTabContent"
import { FileBrowserTabs } from "./components/fileBrowserTabs"

const FileBrowser = (props: IWindowRenderProps) => {
    const { context, windowId, setWindowTopBar, arguments: _arguments } = props

    const { root } = useContext(FileSystemContext)
    const { removeWindow, setWindowContext } = useContext(WindowsContext)

    const resolvedContext =
        BRANCHING_CONTEXT_DETERMINER in context ? context : root

    const [tabs, setTabs] = useState<BranchingContext[]>([resolvedContext])
    const [selectedTabIndex, setSelectedTabIndex] = useState<number>(0)
    const [tabContents, setTabContents] = useState<{ key: number, context: BranchingContext }[]>([
        {
            key: Date.now(),
            context: resolvedContext
        }
    ])

    const previousTabContentSize = useRef<number>(1)

    useEffect(() => {
        if (resolvedContext !== context) {
            setWindowContext(windowId, resolvedContext)
        }
    }, [resolvedContext, context, setWindowContext, windowId])

    useEffect(() => {
        if (selectedTabIndex < 0 || selectedTabIndex > tabs.length - 1) {
            return
        }

        const selectedContext = tabs[selectedTabIndex]
        if (context !== selectedContext) {
            setWindowContext(windowId, selectedContext)
        }
    }, [selectedTabIndex, tabs, context, setWindowContext, windowId])

    const setTabContext = (index: number, context: BranchingContext) => {
        setTabs(ts => {
            const tabsCopy = [...ts]
            tabsCopy[index] = context
            return tabsCopy
        })
    }

    const onTabOpened = () => {
        setTabContents(tc => [
            ...tc,
            {
                key: Date.now(),
                context: root
            }
        ])
        setTabs(ts => [...ts, root])
    }

    const onTabClosed = (index: number) => {
        setTabs(ts => {
            const tabsCopy = [...ts]
            tabsCopy.splice(index, 1)
            return tabsCopy
        })
        setTabContents(tc => {
            const contentCopy = [...tc]
            contentCopy.splice(index, 1)
            return contentCopy
        })
    }

    const onTabSelected = (index: number) => {
        setSelectedTabIndex(index)
    }

    const WindowTopBarContent = useMemo(() => {
        return (
            <FileBrowserTabs
                contexts={tabs}
                selectedTabIndex={selectedTabIndex}
                onTabSelected={onTabSelected}
                onTabOpened={onTabOpened}
                onTabClosed={onTabClosed}
            />
        )
    }, [tabs, selectedTabIndex, onTabSelected, onTabOpened, onTabClosed])

    useEffect(() => {
        setWindowTopBar(WindowTopBarContent)
    }, [setWindowTopBar, WindowTopBarContent])

    useEffect(() => {
        if (tabs.length === 0) {
            removeWindow(windowId)
        }
    }, [tabs, removeWindow, windowId])

    useEffect(() => {
        const tabLength = tabContents.length

        if (tabLength > previousTabContentSize.current
            || (previousTabContentSize.current > tabLength && selectedTabIndex >= tabLength)) {
            setSelectedTabIndex(tabLength - 1)
        }

        previousTabContentSize.current = tabLength
    }, [tabContents, selectedTabIndex, setSelectedTabIndex])

    return (
        <>
            {tabContents.map((tc, i) => {
                const { key, context } = tc
                return (
                    <FileBrowserTabContent
                        key={key}
                        context={context}
                        selected={i === selectedTabIndex}
                        arguments={i === 0 ? _arguments : undefined}
                        setTabContext={(c) => setTabContext(i, c)}
                    />
                )
            })}
        </>
    )
}

export default FileBrowser
