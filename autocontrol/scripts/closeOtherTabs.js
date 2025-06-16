// ? Shortcut key: Ctrl + Alt + w

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {

    // const tabInfos = Object.values(await ACtl.getTabInfo('#otherTabs'));

    const excludeTabs = (await ACtl.getTabIds(['#selectedTabs', '#currentTab'])).flat();
    const allTabs = (await ACtl.getTabIds('#currWinTabs'));
    const targetIds = allTabs.filter(tabId => !excludeTabs.includes(tabId));


    await ACtl.execAction('closeTabs', targetIds);

    // const sameWindowTabs = await ACtl.getTabIds({ sameWinAs: tabInfos.map(tab => tab.id) });
    // const curWindowTabs = await ACtl.getTabIds("#currWinTabs");
    // if (sameWindowTabs.length !== curWindowTabs.length) {
    //     throw new Error("Tabs are not in the same window");
    // }

    // const activeIndex = null;

    // await ACtl.pubVar('closeRecord', {
    //     tabInfos,
    //     sameWindowTabs,
    //     activeIndex,
    // });
    // await ACtl.closeTab(tabInfos.map(tab => tab.id));



}

// @ts-ignore
await main(ACtl);


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;
