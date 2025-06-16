

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    await ACtl.getTabIds('#currWinTabs');

    const repeat = (await ACtl.pubVar("repeat")) || 1;
    await ACtl.pubVar("repeat", 0);

    const currentTabInfo = Object.values(await ACtl.getTabInfo("#currentTab"))[0];

    const currentTabIndex = currentTabInfo.index - 1;
    const allTabs = Object.values(await ACtl.getTabInfo("#currWinTabs")).sort((a, b) => a.index - b.index).map(tab => (tab.id));

    const targetIndex = (currentTabIndex - repeat + allTabs.length) % allTabs.length;
    if (targetIndex === currentTabIndex) return;
    await ACtl.setTabState(allTabs[targetIndex], 'active');

}

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
// @ts-ignore
await(async function (ACtl) {
    await main(ACtl);
    console.log('switch left');
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
