/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {

    await Promise.all([
        ACtl.pubVar('selectModeTimeout', 5000),
        ACtl.pubVar('selectDelay', 150),
        ACtl.pubVar('repeatTimeout', 500),
        ACtl.pubVar('clipboardConfig', { timeout: 3000, maxSearchLength: 100 }),
    ]);
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
