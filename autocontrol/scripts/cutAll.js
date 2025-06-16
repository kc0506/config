
/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const currentTabInfo = Object.values(await ACtl.getTabInfo("#currentTab"))[0];
    const curWindowTabIds = await ACtl.getTabIds('#currWinTabs');

    await ACtl.pubVar('cutTabs', curWindowTabIds);
    await ACtl.pubVar('cutTabActiveId', currentTabInfo.id);
    console.log(`cut ${curWindowTabIds.length} tabs`);
}

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function entry(ACtl) {
    await main(ACtl);
}

// @ts-ignore
await entry(_ACtl);

async function waitUntil(condition, timeout = 1000) {
    const start = Date.now();
    while (!condition()) {
        if (Date.now() - start > timeout) {
            throw new Error("Timeout");
        }
        await new Promise((resolve) => setTimeout(resolve, 100));
    }
}
