
const BLOCK_LIST = [
    'threads.net',
    'instagram.com',
    'facebook.com',
    'youtube.com',
    'jable.tv',
];

/**
 * @type {[string, number][]}
 */
const LIMIT_LIST_WITH_INTERVAL = [
    ['wmail1.cc.ntu.edu.tw', 1000 * 60 * 60 * 4],
    ['mail.google.com', 1000 * 60 * 60 * 4],
]


/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const curTab = Object.values(await ACtl.getTabInfo("#currentTab"))[0];
    const curUrl = new URL(curTab.url);

    const match = (/** @type {string}*/ url) => curUrl.hostname.replace(/^www\./, '') == url;


    if (BLOCK_LIST.some(match)) {
        await ACtl.closeTab(curTab.id);
        return;
    }

    const limitedUrl = LIMIT_LIST_WITH_INTERVAL.find(([url]) => match(url));
    if (limitedUrl) {
        const [url, interval] = limitedUrl;
        const timestampRecord = (await ACtl.pubVar('limitedSiteTimestamp') || {});
        const lastTime = timestampRecord[url] || 0;
        if (Date.now() - lastTime < interval) {
            await ACtl.closeTab(curTab.id);
            return;
        }
        timestampRecord[url] = Date.now();
        await ACtl.pubVar('limitedSiteTimestamp', timestampRecord);
    }
}


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(_ACtl);
