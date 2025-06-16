// todo: focus, ctrl alt w (focus, not continuous)
// todo: alt q

// todo: ctrl t after close


/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    const closeRecords = await ACtl.pubVar("closeRecords");
    await ACtl.pubVar("closeRecords", undefined);
    if (!closeRecords)
        return;

    await Promise.all(closeRecords.map(async (closeRecord) => {

        const { sameWindowTabIds, tabInfos, activeIndex } = closeRecord;

        console.log('sameWindowTabs', sameWindowTabIds);
        console.log('tabInfos', tabInfos);
        console.log('activeIndex', activeIndex);


        if (sameWindowTabIds.length === tabInfos.length) {
            const newTabIds = await ACtl.openURL(tabInfos.map(tab => tab.url), { newWindow: 'normal' });
            if (activeIndex !== null) {
                // await ACtl.execAction('tabActivate', tabInfos[activeIndex].id);
                await ACtl.setTabState(newTabIds[activeIndex], 'active', true);
                await ACtl.setTabState(newTabIds[activeIndex], 'focused', true);
            }

            return;
        }

        /** @type {Record<number, number>} */
        const tabIndexMap = sameWindowTabIds.reduce((map, tabId, index) => {
            map[tabId] = index;
            return map;
        }, {});

        const notClosedTabIds = sameWindowTabIds.filter(tabId => !tabInfos.find(tab => tab.id === tabId));
        const notClosedInfos = Object.values(await ACtl.getTabInfo(notClosedTabIds));

        if (notClosedInfos.length !== notClosedTabIds.length) {
            console.error(notClosedTabIds.filter(tabId => !notClosedInfos.find(tab => tab.id === tabId)));
            throw new Error("Not all tabs are found");
        }

        const tabIndexs = tabInfos
            .sort((a, b) => a.index - b.index)
            .map(tab => tabIndexMap[tab.id]);

        /** @type{Record<'tabIndex'|'arrIndex',[number, number]>[]} */
        const _initialValue = [];
        const segments = tabIndexs.reduce((segments, tabIndex, i) => {
            // console.log(i, JSON.stringify(segments));
            if (i == 0) {
                segments.push({ tabIndex: [tabIndex, tabIndex], arrIndex: [i, i] });
                return segments;
            }

            const lastSegment = segments[segments.length - 1];
            if (lastSegment.tabIndex[1] + 1 === tabIndex) {
                lastSegment.tabIndex[1] = tabIndex;
                lastSegment.arrIndex[1] = i;
            } else {
                segments.push({ tabIndex: [tabIndex, tabIndex], arrIndex: [i, i] });
            }
            return segments;
        }, _initialValue);


        console.log('segments', segments);


        // const openSegmentPromisesr= segments.map(async ({
        //     tabIndex: [tabStart, tabEnd],
        //     arrIndex: [arrStart, arrEnd],
        // }) => {
        for (const segment of segments) {
            const {
                tabIndex: [tabStart, tabEnd],
                arrIndex: [arrStart, arrEnd],
            } = segment;

            // const minIndex = Math.min(...tabInfos.map(tab => tabIndexMap[tab.id]));
            // const maxIndex = Math.max(...tabInfos.map(tab => tabIndexMap[tab.id]));
            // if (maxIndex - minIndex + 1 !== tabInfos.length)
            //     throw new Error('not continuous');

            const minIndex = tabStart;
            const maxIndex = tabEnd;
            console.log('tabIndex', minIndex, maxIndex);

            // const urls = tabInfos.map(tab => tab.url);
            const urls = tabInfos.slice(arrStart, arrEnd + 1).map(tab => tab.url);

            const delay = 100;

            if (maxIndex !== sameWindowTabIds.length - 1) {
                const leftOf = notClosedTabIds.find(tabId => tabIndexMap[tabId] === maxIndex + 1);
                if (!leftOf)
                    throw new Error("Can't find a tab to open left to");
                // console.log('leftOf', tabIndexMap[leftOf]);
                // console.log('leftOf', tabIndexMap[leftOf], Object.values(await ACtl.getTabInfo(leftOf))[0].url);
                await sleep(delay);
                await ACtl.openURL(urls, { leftOf });
            } else if (minIndex !== 0) {
                const rightOf = notClosedTabIds.find(tabId => tabIndexMap[tabId] === minIndex - 1);
                if (!rightOf)
                    throw new Error("Can't find a tab to open right to");
                // console.log('rightOf', tabIndexMap[rightOf], Object.values(await ACtl.getTabInfo(rightOf))[0].url);
                await sleep(delay);
                await ACtl.openURL(urls, { rightOf });
            } else {
                throw new Error("Shouldn't happen");
            }
        };
        // });

        // await Promise.all();
        // for (const p of openSegmentPromises) {
        //     await p;
        // }


        const updatedTabIds = await ACtl.getTabIds({ sameWinAs: notClosedTabIds });
        // if (updatedTabIds.length !== sameWindowTabIds.length) {
        //     console.error(updatedTabIds.length, sameWindowTabIds.length);
        //     throw new Error("Not all tabs are found");
        // }

        if (activeIndex !== null) {
            console.log('activeIndex', activeIndex);
            const activeTabId = updatedTabIds[tabIndexMap[tabInfos[activeIndex].id]];
            await ACtl.setTabState(activeTabId, 'active', true);
            await ACtl.setTabState(activeTabId, 'focused', true);
        }
    }))
}

/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

// @ts-ignore
await main(ACtl);


async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}