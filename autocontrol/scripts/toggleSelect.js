// ? Shortcut key: Ctrl + v, Ctrl + Shift + v
// ? Called by other scripts: Yes

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const curTab = Object.values(await ACtl.getTabInfo(await ACtl.getTabIds("#currentTab")))[0];

    const curStartSelectTab = await ACtl.pubVar("startSelectTab");
    const sameWindowTabs = await ACtl.getTabIds({ sameWinAs: curTab.id });

    const enterSelectMode =
        !curStartSelectTab || !sameWindowTabs.includes(curStartSelectTab?.id);


    if (!enterSelectMode) {
        offSelectMode(ACtl);
        console.log("reset select");
        return;
    }

    await ACtl.setTabState("#allTabs", "selected", false);
    console.log("start select");
    console.log("setting startSelectTab", curTab);
    await ACtl.pubVar("startSelectTab", curTab);

    const curTimestamp = Date.now();
    await ACtl.pubVar('lastSelectActivity', curTimestamp);
    setTimeout(async () => {
        if ((await ACtl.pubVar('lastSelectActivity')) === curTimestamp) {
            await offSelectMode(ACtl);
        } else {
            console.log(await ACtl.pubVar('lastSelectActivity'), curTimestamp);
        }
    }, await ACtl.pubVar("selectModeTimeout") || 1000);


}


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(_ACtl);

/**
 * @param {import('./types.ts').ACtlType} ACtl 
 */
async function offSelectMode(ACtl) {
    console.log("off select");
    await ACtl.setTabState("#selectedTabs", "selected", false);
    await ACtl.pubVar("startSelectTab", null);
    await ACtl.pubVar('lastSelectActivity', null);
};
