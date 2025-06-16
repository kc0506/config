
/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const repeat = (await ACtl.pubVar("repeat")) || 1;
    await ACtl.pubVar("repeat", 0);

    const currentTabId = (await ACtl.getTabIds("#currentTab"))[0];
    const tabInfo = (await ACtl.getTabInfo(currentTabId))[currentTabId];

    const selectedTabIds = await ACtl.getTabIds("#selectedTabs");
    if (!selectedTabIds.includes(currentTabId))
        selectedTabIds.push(currentTabId);

    console.log('selectedTabIds', selectedTabIds);

    const tabIndexs = Object.values(await ACtl.getTabInfo(selectedTabIds)).map(tab => tab.index - 1);
    const minIndex = Math.min(...tabIndexs);

    const allTabIds = Object.values(await ACtl.getTabInfo("#currWinTabs")).sort((a, b) => a.index - b.index).map(tab => (tab.id));

    if (minIndex === 0) {
        const [newTabId] = await ACtl.openURL(['actl://insertTarget'], { rightOf: allTabIds[allTabIds.length - 1] });
        await ACtl.execAction('insertLeft', selectedTabIds);
        await ACtl.closeTab(newTabId);
        return;
    }

    // console.log('targetTabId', targetTabId);
    const targetTabId = allTabIds[(minIndex - repeat + allTabIds.length) % allTabIds.length];
    const [newTabId] = await ACtl.openURL(['actl://insertTarget'], { leftOf: targetTabId });
    await ACtl.execAction('insertLeft', selectedTabIds);
    await ACtl.closeTab(newTabId);
}

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
(async function (ACtl) {
    // const repeat = (await ACtl.pubVar("repeat")) || 1;
    // await ACtl.pubVar("repeat", 0);

    // for (let i = 0; i < repeat; i++) {
    await main(ACtl);
    // }
})(_ACtl);

async function waitUntil(condition, timeout = 1000) {
    const start = Date.now();
    while (!condition()) {
        if (Date.now() - start > timeout) {
            throw new Error("Timeout");
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
