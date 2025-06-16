console.log('broken')

/**
 * @param {ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {

    /** @type {Partial<Record<ACtlEventType, [TabSpec|undefined, (ACtl: ACtlType, ev: ACtlEvent) => void][]>>} */
    const listeners = {
        clipboardChange: [[undefined, onClipboardChange]],
        winFocus: [[undefined, onWinFocus]],
    };

    /** @type {[ACtlEventType, [TabSpec|undefined, (ACtl: ACtlType, ev: ACtlEvent) => void][]][]} */
    // @ts-ignore
    const entries = Object.entries(listeners);

    const promises = entries
        .map(async ([event, listenerPairs]) => {
            return await Promise.race([
                sleep(250),
                ACtl.off(event)
            ]).then(() => {
                return Promise.all(listenerPairs.map(([tabSpec, listener]) => {
                    console.log(event, tabSpec);
                    ACtl.on(event, tabSpec, (e) => listener(ACtl, e));
                }));
                // ACtl
            });
        });

    await Promise.all(promises);

    const prevId = await ACtl.pubVar('loopIntervalId');
    if (prevId) {
        clearInterval(prevId);
    }

    const id = setInterval(async () => {
        return;
        console.log();
        const tabId = (await ACtl.getTabIds('#currentTab'))[0];
        console.log(tabId);
        const selection = await ACtl.expand('<selection>', tabId);
        console.log(selection);
        return;
        // console.log(a)
        // const selection = await ACtl.expand('<selection>', '#currentTab');
        // console.log(selection);

        // const curSwitch = !!(await ACtl.pubVar('clipboardRecord'));
        // await ACtl.switchState('Open new tab', curSwitch || !!(await ACtl.expand('<selection>')).trim())
    }, 1000)
    ACtl.pubVar('loopIntervalId', id);

    return;

    // Does not work
    const windowCloseDelay = 500;

    await ACtl.off('tabClose');
    await ACtl.off('winClose');

    await ACtl.on('tabClose', undefined, async (e) => {
        console.log((await ACtl.getTabIds({ sameWinAs: e.tabId })).length)
        console.log('tabClose', e);
    });

    await ACtl.on('winClose', undefined, async (e) => {
        console.log('winClose', e);
    });
}



/**
 * @param {ACtlType} ACtl 
 * @param {ACtlEvent} event 
 */
async function onWinFocus(ACtl, event) {
    await ACtl.switchState(
        'Devtool',
        (await ACtl.getTabInfo(event.tabId))[event.tabId].window.type === 'devtools',
    );
}


/**
 * @param {ACtlType} ACtl
 * @param {ACtlEvent} event
 */
async function onTabUrlChange(ACtl, event) {
    await ACtl.setTabState("#selectedTabs", "selected", false);
    await ACtl.pubVar("startSelectTab", null);
}


// /**
//  * @param {ACtlType} ACtl 
//  * @param {ACtlEvent} event 
//  */
// async function onTabActivated(ACtl, event) {
//     await ACtl.switchState('Open new tab', !!(await ACtl.expand('<selection>')).trim());
// }


/**
 * @param {ACtlType} ACtl 
 * @param {ACtlEvent} event 
 */
async function onClipboardChange(ACtl, event) {
    // await Promise.race([
    //     sleep(500),
    //     ACtl.off('clipboardChange')
    // ]);
    console.log('listenClipboard');

    // ACtl.on('clipboardChange', undefined, async event => {
    if (event.clipFormat == 'text' || event.clipFormat == 'html') {
        const clipContent = await ACtl.getClipboard('text');
        const timestamp = Date.now();

        // const config = await ACtl.pubVar('clipboardConfig');
        const searchOrUrl = clipContent.trim();

        // const url =
        //     searchOrUrl.startsWith('http')
        //         ? searchOrUrl
        //         : 'http://google.com/search?q=' + encodeURIComponent(searchOrUrl.slice(0, config.maxSearchLength));


        await ACtl.pubVar('clipboardRecord', { searchOrUrl, timestamp });
        await ACtl.switchState('Open new tab', true);
        console.log('clipboard', searchOrUrl)

        setTimeout(async () => {
            if (timestamp == (await ACtl.pubVar('clipboardRecord'))?.timestamp) {
                await ACtl.pubVar('clipboardRecord', null);
                await ACtl.switchState('Open new tab', false);
            }
        }, (await ACtl.pubVar('clipboardConfig')).timeout);
    }
    // });

}

/** @typedef {import("./types.ts").ACtlType} ACtlType */
/** @typedef {import("./types.ts").TabSpec} TabSpec */
/** @typedef {import("./types.ts").ACtlEventType} ACtlEventType */
/** @typedef {import("./types.ts").ACtlEvent} ACtlEvent */

/** @type {ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(_ACtl);

/**
 * @param {number} ms
 */
async function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}