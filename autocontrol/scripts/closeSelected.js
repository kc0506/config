// ? Shortcut key: Ctrl + w

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const currentTabInfo = Object.values(await ACtl.getTabInfo("#currentTab"))[0];

    const selectedTabInfos = Object.values(await ACtl.getTabInfo("#selectedTabs"));
    if (!selectedTabInfos.find(tab => tab.id === currentTabInfo.id))
        selectedTabInfos.push(currentTabInfo);

    await ACtl.execAction('closeTabs', selectedTabInfos.map(tab => tab.id));
}

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(ACtl);
