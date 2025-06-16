// ? Shortcut key: None
// ? Called by other scripts

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const currentTabId = (await ACtl.getTabIds("#currentTab"))[0];
    const tabInfo = (await ACtl.getTabInfo(currentTabId))[currentTabId];

    const curStartSelectTab = await ACtl.pubVar("startSelectTab");
    const sameWindowTabs = await ACtl.getTabIds({ sameWinAs: currentTabId });

    const isSameWindow =
        curStartSelectTab &&
        (curStartSelectTab?.id === currentTabId || sameWindowTabs.includes(curStartSelectTab?.id));


    // console.log("makeSelect", isSameWindow);

    if (!isSameWindow) {
        await offSelectMode(ACtl);
        return;
    }

    const allTabIds = await ACtl.getTabIds("#currWinTabs");

    const st = Math.min(curStartSelectTab.index, tabInfo.index) - 1;
    const end = Math.max(curStartSelectTab.index, tabInfo.index) - 1;
    const selectedIds = allTabIds.slice(st, end + 1);

    const idx = tabInfo.index;

    console.log(await ACtl.pubVar('selectModeTimeout'));

    await sleep(await ACtl.pubVar("selectDelay"));
    if ((await ACtl.getTabIds("#currentTab"))[0] !== currentTabId) {
        const id1 = (await ACtl.getTabIds("#currentTab"))[0], id2 = currentTabId;
        const index1 = (await ACtl.getTabInfo(id1))[id1].index, index2 = tabInfo.index;
        console.log("cancel select");
        console.log(index1, index2);
        return;
    }

    await ACtl.setTabState(selectedIds, "selected");

    const curTimestamp = Date.now();
    await ACtl.pubVar('lastSelectActivity', curTimestamp);
    setTimeout(async () => {
        if ((await ACtl.pubVar('lastSelectActivity')) === curTimestamp)
            await offSelectMode(ACtl);
    }, await ACtl.pubVar("selectModeTimeout"));
}


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(_ACtl);

/**
 * @param {number} t
 */
async function sleep(t) {
    await new Promise((resolve) => setTimeout(resolve, t));
}

/**
 * @param {import('./types.ts').ACtlType} ACtl 
 */
async function offSelectMode(ACtl) {
    console.log("off select");
    await ACtl.setTabState("#selectedTabs", "selected", false);
    await ACtl.pubVar('lastSelectActivity', null);
};
