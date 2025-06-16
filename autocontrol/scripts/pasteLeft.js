

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const currentTabInfo = Object.values(await ACtl.getTabInfo("#currentTab"))[0];
    const targetTabId = currentTabInfo.id;

    const cutTabIds = (await ACtl.pubVar('cutTabs')) || [];
    const cutTabActiveId = (await ACtl.pubVar('cutTabActiveId'));
    await ACtl.pubVar('cutTabs', undefined);
    await ACtl.pubVar('cutTabActiveId', undefined);

    const closeRecords = (await ACtl.pubVar('closeRecords'));
    await ACtl.pubVar('closeRecords', undefined);

    if (cutTabIds.includes(targetTabId)) {
        console.warn('Target tab is included in cutTabs');
        return;
    }

    if (cutTabIds.length) {
        if (!cutTabActiveId)
            throw new Error('cutTabActiveId is not set');

        const [newTabId] = await ACtl.openURL(['actl://insertTarget'], { leftOf: targetTabId });
        await ACtl.execAction('insertLeft', cutTabIds);
        await ACtl.closeTab(newTabId);

        await ACtl.setTabState(cutTabActiveId, 'active', true);
        console.log(`paste ${cutTabIds.length} tabs`);
    } else if (closeRecords) {
        await Promise.all(
            closeRecords.map(async (closeRecord) => {
                const newTabIds = await ACtl.openURL(closeRecord.tabInfos.map(tab => tab.url), { leftOf: targetTabId });
                if (closeRecord.activeIndex)
                    await ACtl.setTabState(newTabIds[closeRecord.activeIndex], 'active', true);
            }))
    }
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

/**
 * @param {boolean} condition
 * @param {string} message
 */
function assert(condition, message) {
    if (!condition) {
        throw new Error(message);
    }
}