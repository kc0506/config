// ? Shortcut key: Ctrl + Shift + t

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {



    // const t = Date.now();
    const [
        record,
        config,
        [currentTabId],
    ] = await Promise.all([
        ACtl.pubVar('clipboardRecord'),
        ACtl.pubVar('clipboardConfig'),
        ACtl.getTabIds('#currentTab'),
        // ACtl.getTabIds('#currWinTabs'),
    ])
    // alert(Date.now() - t)
    // return;

    /** @type {string|undefined} */
    const selection = await Promise.race([
        new Promise((res) => setTimeout(() => res(undefined), 150)),
        ACtl.expand('<selection>', '#targetTabs')
    ])


    const searchOrUrl = selection?.trim() || record?.searchOrUrl?.trim();
    console.log('searchOrUrl', searchOrUrl)

    const url = searchOrUrl && (searchOrUrl.startsWith('http')
        // const url = (searchOrUrl.startsWith('http')
        ? searchOrUrl
        : 'http://google.com/search?q=' + encodeURIComponent(searchOrUrl + '中文'));

    if (url) {
        const [id] = await ACtl.openURL(url, { rightOf: currentTabId });
        await ACtl.setTabState(id, 'active', true);
    } else {
        // alert('never')
        const [id] = await ACtl.openURL('chrome://new-tab-page', { rightOf: currentTabId });
        await ACtl.setTabState(id, 'active', true);
    }
    await ACtl.pubVar('clipboardRecord', null);

}


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(_ACtl);