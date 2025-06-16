// ? Shortcut key: Ctrl + Right Shift + x

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const repeat = await ACtl.pubVar('repeat') || 1;
    await ACtl.pubVar('repeat', undefined);

    const tabIds = await ACtl.getTabIds('#currWinTabs');
    const curTabId = (await ACtl.getTabIds('#currentTab'))[0];
    const curTabIndex = tabIds.indexOf(curTabId);

    const targetTabIds = tabIds.slice(
        curTabIndex + 1,
        Math.min(tabIds.length, curTabIndex + repeat + 1),
    );
    await ACtl.execAction('closeTabs', targetTabIds);
}

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(ACtl);
