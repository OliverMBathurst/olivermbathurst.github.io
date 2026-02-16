class ClipboardService {
    async setClipboard(text: string) {
        const type = "text/plain"
        const clipboardItemData: Record<string, string> = {
            [type]: text,
        }
        const clipboardItem = new ClipboardItem(clipboardItemData)
        await navigator.clipboard.write([clipboardItem])
    }
}

export default ClipboardService