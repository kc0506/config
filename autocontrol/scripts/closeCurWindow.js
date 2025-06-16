// todo: handle ctrl + shift + w

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const tabInfos = Object.values(await ACtl.getTabInfo('#currWinTabs'));

    const sameWindowTabs = await ACtl.getTabIds({ sameWinAs: tabInfos.map(tab => tab.id) });
    const curWindowTabs = await ACtl.getTabIds("#currWinTabs");
    if (sameWindowTabs.length !== curWindowTabs.length) {
        throw new Error("Tabs are not in the same window");
    }

    const activeIndex = tabInfos.findIndex(tab => tab.active);

    await ACtl.pubVar('closeRecord', {
        tabInfos,
        sameWindowTabs,
        activeIndex,
    });

    // if (tabInfos.filter(tab => tab.window.type === 'devtools').length)
    //     return;
    // await ACtl.closeTab(tabInfos.map(tab => tab.id));
}

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
// @ts-ignore
await(async function (ACtl) {
    await main(ACtl);
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

