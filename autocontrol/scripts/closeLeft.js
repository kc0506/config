// ? Shortcut key: Ctrl + Left Shift + x

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

    // console.log(curTabIndex);
    // return;
    console.log(curTabIndex, repeat)

    const targetTabIds = tabIds.slice(Math.max(0, curTabIndex - repeat), curTabIndex);
    await ACtl.execAction('closeTabs', targetTabIds);
}

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(ACtl);
