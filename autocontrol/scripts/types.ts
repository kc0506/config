/* -------------------------------- Tab Types ------------------------------- */

type ACtlWindowType = "normal" | "popup" | "app" | "devtools";
type ACtlWindowState = "normal" | "minimized" | "maximized" | "fullscreen" | "hidden";
type ACtlWindow = {
    type: ACtlWindowType;
    state: ACtlWindowState;
    focused: boolean;
    alwaysOnTop: boolean;
    left: number;
    top: number;
    width: number;
    height: number;
};

export type { ACtlWindowType, ACtlWindowState, ACtlWindow };

type TabInfo = {
    id: number;
    index: number;
    title: string;
    url: string;
    favIconUrl: string;
    openerTabId: number;
    status: "loading" | "loaded" | "unloaded";
    active: boolean;
    selected: boolean;
    pinned: boolean;
    audible: boolean;
    muted: boolean;
    incognito: boolean;
    width: number;
    height: number;
    window: ACtlWindow;
};

type TabPreset =
    | "#targetTabs"
    | "#currentTab"
    | "#newestTab"
    | "#openerTab"
    | "#prevUsedTab"
    | "#prevUsedTabAnyWin"
    | "#nextUsedTab"
    | "#nextUsedTabAnyWin"
    | "#activeTabs"
    | "#selectedTabs"
    | "#hoveredTabs"
    | "#pinnedTabs"
    | "#audibleTabs"
    | "#nonMinimTabs"
    | "#leftTab"
    | "#leftTabWrap"
    | "#allLeftTabs"
    | "#leftmostTab"
    | "#rightTab"
    | "#rightTabWrap"
    | "#allRightTabs"
    | "#rightmostTab"
    | "#otherTabs"
    | "#otherTabsAllWins"
    | "#currWinTabs"
    | "#mruTabs"
    | "#mruTabsAllWins"
    | "#allTabs";

type TabSpec =
    | number
    | TabPreset
    | ACtlCustomTabSpec
    | { not: TabSpec }
    | { sameWinAs: TabSpec }
    | TabSpec[];

type ClipboardFormat = "text" | "html" | "files" | "image" | "unknown";

type PlaceholderKeyword = "selection";
type Placeholder = `<${PlaceholderKeyword}>`;
type OtherChar = Exclude<string, PlaceholderKeyword>;

// type TemplateType = `${OtherChar}${Placeholder}${OtherChar}`;
type TemplateType = Placeholder;

export type { TabInfo, TabPreset, TabSpec, ClipboardFormat, PlaceholderKeyword as Placeholder };

/* -------------------------------- Main API -------------------------------- */

type ACtlEventType =
    | "tabOpen"
    | "tabClose"
    | "tabActivate"
    | "tabDeactivate"
    | "tabFocus"
    | "tabUnfocus"
    | "tabLoadBegin"
    | "tabLoadEnd"
    | "tabUnload"
    | "tabUrlChange"
    | "tabAudioBegin"
    | "tabAudioEnd"
    | "winOpen"
    | "winClose"
    | "winFocus"
    | "winUnfocus"
    | "winMinimize"
    | "winUnminimize"
    | "clipboardChange";

type ACtlEvent = { type: ACtlEventType; tabId: number; clipFormat?: string };

type SetACtlTabState = "active" | "pinned" | "selected" | "muted";

type SetACtlWindowState =
    | "focused"
    | "minimized"
    | "restored"
    | "hidden"
    | "topmost"
    | "maximized"
    | "fullscreen";

export type { ACtlEventType, ACtlEvent, SetACtlTabState, SetACtlWindowState };

type ACtlType = {
    openURL: (
        url: string | string[],
        tab?:
            | TabSpec
            | { newWindow: "normal" | "popup" | "incognito" }
            | { rightOf: TabSpec }
            | { leftOf: TabSpec }
    ) => Promise<number[]>;
    closeTab: (tab: TabSpec) => Promise<number>;

    getTabInfo: (tab?: TabSpec, mergeGroups?: boolean) => Promise<{ [key: number]: TabInfo }>;
    // todo: fix muilti groups
    getTabIds: ((tab: TabSpec, mergeGroups?: true) => Promise<number[]>) &
        ((tab: TabSpec, mergeGroups: false) => Promise<number[][]>);
    setTabState: (
        tab: TabSpec,
        state: SetACtlTabState | SetACtlWindowState,
        value?: boolean | -1
    ) => Promise<void>;

    execAction: (actionName: ACtlCustomAction, tab?: TabSpec) => Promise<number[]>;

    getClipboard: ((s: "format") => Promise<ClipboardFormat>) & ((s: "text") => Promise<string>);

    expand: (template: TemplateType, tab?: TabSpec) => Promise<string>;

    switchState: (switchName: SwitchName, state?: true | false | -1) => Promise<boolean>;

    pubVar: <T extends keyof PubVarTypeMap>(
        name: T,
        value?: PubVarTypeMap[T] | (T extends RequiredPubVar ? never : null)
    ) => Promise<PubVarTypeMap[T] | (T extends RequiredPubVar ? never : null)>;

    on: (
        event: ACtlEventType,
        tabSpec?: TabSpec,
        callback?: (ev: ACtlEvent) => void
    ) => Promise<ACtlEvent>;
    off: (event: ACtlEventType, callback?: (ev: ACtlEvent) => void) => Promise<ACtlEvent>;
};

export type { ACtlType };

/* --------------------------------- Custom --------------------------------- */

type ACtlCustomAction = "closeTabs" | "insertRight" | "insertLeft";

type ACtlCustomTabSpec = "windowGroups";

type CloseRecord = {
    tabInfos: TabInfo[];
    sameWindowTabIds: number[];
    activeIndex: number | null;
};

type ClipboardRecord = {
    searchOrUrl: string;
    timestamp: number;
};

type PubVarTypeMap = {
    startSelectTab: TabInfo;
    lastSelectActivity: number;
    selectModeTimeout: number | null;
    selectDelay: number | null;

    repeat: number;
    repeatTimeout: number;
    repeatTimeoutId: number;

    cutTabs: number[];
    cutTabActiveId: number;
    closeRecords: CloseRecord[];

    clipboardRecord: ClipboardRecord;
    clipboardConfig: { timeout: number; maxSearchLength: number };

    limitedSiteTimestamp: Record<string, number>;

    loopIntervalId: number;
};

type RequiredPubVar = keyof Pick<
    PubVarTypeMap,
    "selectModeTimeout" | "selectDelay" | "clipboardConfig"
>;

type SwitchName = "Devtool" | "Open new tab";

export type { ACtlCustomAction, ACtlCustomTabSpec, CloseRecord, ClipboardRecord, PubVarTypeMap };
