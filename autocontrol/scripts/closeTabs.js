// ? Shortcut key: None

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const targetTabs = Object.values(await ACtl.getTabInfo('#targetTabs'));
    if (!targetTabs.length) return;

    const windowGroups = (await ACtl.getTabIds('windowGroups', false));

    /**@type number[][] */
    const targetTabGroups = windowGroups.map(() => []);
    for (const tab of targetTabs) {
        const groupIndex = windowGroups.findIndex((group) => group.includes(tab.id));
        if (groupIndex === -1) {
            throw new Error("Tab is not in any group");
        }

        targetTabGroups[groupIndex].push(tab.id);
    }

    // console.log(targetTabs);
    // console.log(targetTabGroups);

    /** @type {import('./types.ts').CloseRecord[]} */
    const closeRecords = await Promise.all(
        targetTabGroups
            .filter(arr => !!arr.length)
            .map(async (tabIds) => {
                const tabInfos = Object.values(await ACtl.getTabInfo(tabIds));
                const sameWindowTabIds = await ACtl.getTabIds({ sameWinAs: tabIds[0] });
                const activeIndex = tabInfos.findIndex(tab => tab.active);

                return {
                    tabInfos,
                    sameWindowTabIds,
                    activeIndex: activeIndex === -1 ? null : activeIndex,
                };
            })
    );

    // const sameWindowTabs = await ACtl.getTabIds({ sameWinAs: targetTabs.map(tab => tab.id) });
    // const curWindowTabs = await ACtl.getTabIds("#currWinTabs");
    // if (sameWindowTabs.length !== curWindowTabs.length) {
    //     throw new Error("Tabs are not in the same window");
    // }

    // const activeIndex = targetTabs.findIndex(tab => tab.active);

    // await ACtl.pubVar('closeRecords', [{
    //     tabInfos: targetTabs,
    //     sameWindowTabIds: sameWindowTabs,
    //     activeIndex: activeIndex === -1 ? null : activeIndex,
    // }]);

    const st = Date.now();
    const currentTabId = (await ACtl.getTabIds('#currentTab'))[0];
    const t1 = Date.now() - st;
    const prevId = (await ACtl.getTabIds('#prevUsedTab'))[0];
    const t2 = Date.now() - st - t1;
    const targetIds = targetTabs.map(tab => tab.id);

    await ACtl.pubVar('closeRecords', closeRecords);
    // await ACtl.closeTab(targetIds);
    return;

    await ACtl.closeTab(targetIds);
    const t3 = Date.now() - st - t1 - t2;

    if (targetIds.includes(currentTabId) && !targetIds.includes(prevId)) {
        await ACtl.setTabState(prevId, 'active', true);
    }
    const t4 = Date.now() - st - t1 - t2 - t3;

    alert(`t1: ${t1}, t2: ${t2}, t3: ${t3}, t4: ${t4}`);
}


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;


// @ts-ignore
await main(ACtl);