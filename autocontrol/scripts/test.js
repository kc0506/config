


/** @type{import("./types.ts").ACtlType} */
// @ts-ignore
var _ACtl = ACtl;

/**
 * @param {import("./types.ts").ACtlType} ACtl
 * @returns
 */
async function main(ACtl) {
    await ACtl.runCommand("python new.py", "./");
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
