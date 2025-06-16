// ? Shortcut key: Ctrl + Alt + Right

/**
 * Closes all tabs to the right of the currently activated tab in the current window.
 * 
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const tabIds = await ACtl.getTabIds('#currWinTabs');
    const curTabId = (await ACtl.getTabIds('#currentTab'))[0];
    const curTabIndex = tabIds.indexOf(curTabId);

    // Get all tabs after the current one in the tab order
    const targetTabIds = tabIds.slice(curTabIndex + 1);

    if (targetTabIds.length > 0) {
        await ACtl.execAction('closeTabs', targetTabIds);
    }
}

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(ACtl); 