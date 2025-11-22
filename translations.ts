

export type Language = 'ru' | 'en';

export const translations = {
  ru: {
    appTitle: "BELIARG",
    appSubtitle: "Менеджер Вечной Кузницы",
    summonSpell: "Bel’iarg, Dominar Infernalis • Ignis Ultimus surgat • Veni ad vocem Throni",
    footerSpell: "Exure vivos donec sol taceat",
    
    // Stats
    treasury: "Казна",
    
    // Nav
    navChains: "Цепи",
    navTreasury: "Казна",
    navAsh: "Пепел",
    navAnalytics: "Суд",
    navGrimoire: "Гримуар",
    
    // Active View
    activeHeader: "Приказы Кузницы",
    ritualsHeader: "Ежедневные Ритуалы",
    newChain: "+ Новая Цепь",
    newRitual: "+ Ритуал",
    emptyStateTitle: "Кузница остывает...",
    emptyStateDesc: "Дай мне работу, Господин.",
    searchPlaceholder: "Взор Бездны (Поиск)...",
    
    // Grimoire View
    grimoireHeader: "Свитки Мудрости",
    newScroll: "+ Новый Свиток",
    emptyGrimoire: "Страницы пусты. Знание ждет начертания.",
    modalGrimoireTitle: "Начертать Свиток",
    labelNoteTitle: "Заголовок Мысли",
    labelNoteContent: "Содержание",
    placeholderNoteTitle: "Озаглавь...",
    placeholderNoteContent: "Излей разум в бездну...",

    // Finance View
    financeHeader: "Золотые Потоки",
    balance: "Баланс",
    addRecord: "+ Запись",
    tableDate: "Дата",
    tableDesc: "Суть",
    tableGold: "Золото",
    emptyFinance: "Книга пуста. Золото любит счет.",
    tribute: "Дань (Доход)",
    sacrifice: "Жертва (Расход)",
    recurring: "Вечная Мука (Ежемесячно до конца года)",

    // Analytics View
    analyticsHeader: "Весы Суда",
    year: "Год",
    month: "Месяц",
    income: "Дань",
    expense: "Жертвы",
    net: "Остаток",
    yearlySurplus: "Профицит Бездны",
    yearlyDebt: "Кровавый Долг",
    noTransInMonth: "В этом месяце тишина...",
    chartTitle: "Ритм Бездны",
    heatmapTitle: "Пекло Активности",
    less: "Меньше",
    more: "Больше",
    
    // Filters
    filterDiff: "Сложность:",
    filterAll: "Все",
    sortDeadline: "Сначала Срочные",
    sortNewest: "Сначала Новые",
    sortManual: "Ручная (Цепи)",
    sortGoldDesc: "Богатые",
    sortGoldAsc: "Бедные",
    
    // History View
    historyHeader: "Склеп Исполненного",
    burnArchive: "Сжечь Архив",
    sealStamped: "Печать Поставлена",
    
    // Task Card
    overdue: "ПРОСРОЧЕНО",
    execute: "ИСПОЛНИТЬ",
    confirmDelete: "Развеять эту цепь в пепел?",
    subtasks: "Звенья Цепи",
    slideDelete: "Уничтожить",
    slideComplete: "Исполнить",
    
    // Modals
    modalEditTitle: "Перековать Цепи",
    modalNewTitle: "Новый Контракт",
    modalRitualTitle: "Новый Ритуал",
    modalEditFinanceTitle: "Переписать Судьбу", 
    modalConfirmTitle: "Уничтожение Записи",
    labelTitle: "Суть Обязательства",
    labelDesc: "Условия Пытки",
    labelDeadline: "Час Расплаты",
    labelDifficulty: "Тяжесть Бремя",
    labelSubtask: "Звено Цепи",
    labelSigil: "Сигил (Метка)",
    noSigil: "Без Метки",
    createSigil: "+ Начертать Сигил",
    newSigilName: "Имя Сигила",
    addSubtask: "+ Добавить Звено",
    placeholderTitle: "Например: Покорить вершину (Сходить в зал)",
    btnRefuse: "ОТКАЗАТЬСЯ",
    btnCancel: "ОСТАВИТЬ",
    btnDelete: "УНИЧТОЖИТЬ",
    btnForge: "ПЕРЕКОВАТЬ",
    btnSeal: "СКРЕПИТЬ",
    btnCreate: "СОЗДАТЬ",
    btnUpdate: "ОБНОВИТЬ",
    
    financeSource: "Источник / Назначение",
    financeAmount: "Сумма (Золото)",
    financeDate: "Время Деяния",
    financeClose: "ЗАКРЫТЬ",
    financeSave: "ЗАПИСАТЬ",
    
    // Rituals
    streak: "Серия",
    ritualDone: "Ритуал исполнен",
    ritualCooldown: "Жди нового цикла",

    demonDefault: "Кузница ждет твоих приказов, Повелитель.",
    deleteTransConfirm: "Вы уверены, что хотите удалить эту запись безвозвратно?",
    deleteNoteConfirm: "Сжечь этот свиток навсегда?",

    // Critical Success
    critSuccess: "БЛАГОСЛОВЕНИЕ БЕЗДНЫ",
    critDesc: "Кузница ревет от восторга! Критический успех!",
    
    // Settings
    settingsTitle: "Настройки Кузницы",
    settingsVisual: "Облик Мира",
    settingsData: "Сосуд Души (Данные)",
    themeLight: "СВЕТ (ПЕПЕЛ)",
    themeDark: "ТЬМА (ОБСИДИАН)",
    langRu: "РУССКИЙ",
    langEn: "ENGLISH",
    backupDesc: "Сохрани свою душу в файл, чтобы воскресить её позже.",
    btnExport: "ИЗВЛЕЧЬ ДУШУ (Скачать)",
    btnImport: "ВОСКРЕСИТЬ (Загрузить)",
    importSuccess: "Душа успешно возвращена в тело.",
    importError: "Файл поврежден. Ритуал провален.",

    // Market
    marketTitle: "Рынок Душ",
    marketDesc: "Обменяй золото на новые эффекты",
    effectFire: "Огонь",
    effectSoul: "Душа",
    effectVoid: "Пустота",
    effectBlood: "Кровь",
    effectGold: "Золото",
    cost: "Цена",
    equipped: "ЭКИПИРОВАНО",
    equip: "НАДЕТЬ",
    buy: "КУПИТЬ",
    insufficientFunds: "НЕТ ЗОЛОТА",

    // Altars
    modalAltarTitle: "Возвести Алтарь",
    labelTarget: "Цель (Золото)",
    contribute: "ВНЕСТИ",
    altarFull: "АЛТАРЬ ПОЛОН",
  },
  en: {
    appTitle: "BELIARG",
    appSubtitle: "Eternal Forge Manager",
    summonSpell: "Bel’iarg, Dominar Infernalis • Let the Last Fire rise • Come to the Throne",
    footerSpell: "Burn the living until the sun falls silent",
    
    // Stats
    treasury: "Treasury",
    
    // Nav
    navChains: "Chains",
    navTreasury: "Treasury",
    navAsh: "Ash",
    navAnalytics: "Judgment",
    navGrimoire: "Grimoire",
    
    // Active View
    activeHeader: "Forge Orders",
    ritualsHeader: "Daily Rituals",
    newChain: "+ New Chain",
    newRitual: "+ Ritual",
    emptyStateTitle: "The Forge grows cold...",
    emptyStateDesc: "Give me work, Master.",
    searchPlaceholder: "Eye of the Abyss (Search)...",

    // Grimoire View
    grimoireHeader: "Scrolls of Wisdom",
    newScroll: "+ New Scroll",
    emptyGrimoire: "The pages are blank. Knowledge awaits inscription.",
    modalGrimoireTitle: "Inscribe Scroll",
    labelNoteTitle: "Thought Title",
    labelNoteContent: "Content",
    placeholderNoteTitle: "Title...",
    placeholderNoteContent: "Pour your mind into the abyss...",
    
    // Finance View
    financeHeader: "Golden Streams",
    balance: "Balance",
    addRecord: "+ Record",
    tableDate: "Date",
    tableDesc: "Essence",
    tableGold: "Gold",
    emptyFinance: "The book is empty. Gold demands counting.",
    tribute: "Tribute (Income)",
    sacrifice: "Sacrifice (Expense)",
    recurring: "Eternal Torment (Monthly until year end)",

    // Analytics View
    analyticsHeader: "Scales of Judgment",
    year: "Year",
    month: "Month",
    income: "Tribute",
    expense: "Sacrifice",
    net: "Net",
    yearlySurplus: "Abyssal Surplus",
    yearlyDebt: "Blood Debt",
    noTransInMonth: "Silence in this month...",
    chartTitle: "Rhythm of the Abyss",
    heatmapTitle: "The Inferno",
    less: "Less",
    more: "More",
    
    // Filters
    filterDiff: "Difficulty:",
    filterAll: "All",
    sortDeadline: "Deadline First",
    sortNewest: "Newest First",
    sortManual: "Manual (Chains)",
    sortGoldDesc: "Richest",
    sortGoldAsc: "Poorest",
    
    // History View
    historyHeader: "Crypt of the Fulfilled",
    burnArchive: "Burn Archive",
    sealStamped: "Seal Stamped",
    
    // Task Card
    overdue: "OVERDUE",
    execute: "EXECUTE",
    confirmDelete: "Dispel this chain into ash?",
    subtasks: "Chain Links",
    slideDelete: "Destroy",
    slideComplete: "Execute",
    
    // Modals
    modalEditTitle: "Reforge Chains",
    modalNewTitle: "New Contract",
    modalRitualTitle: "New Ritual",
    modalEditFinanceTitle: "Rewrite Fate",
    modalConfirmTitle: "Destroy Record",
    labelTitle: "Essence of Obligation",
    labelDesc: "Torture Conditions",
    labelDeadline: "Hour of Reckoning",
    labelDifficulty: "Burden Weight",
    labelSubtask: "Chain Link",
    labelSigil: "Sigil (Tag)",
    noSigil: "No Sigil",
    createSigil: "+ Inscribe Sigil",
    newSigilName: "Sigil Name",
    addSubtask: "+ Add Link",
    placeholderTitle: "Ex: Conquer the summit (Go to gym)",
    btnRefuse: "REFUSE",
    btnCancel: "KEEP",
    btnDelete: "DESTROY",
    btnForge: "REFORGE",
    btnSeal: "BIND",
    btnCreate: "CREATE",
    btnUpdate: "UPDATE",
    
    financeSource: "Source / Purpose",
    financeAmount: "Amount (Gold)",
    financeDate: "Time of Deed",
    financeClose: "CLOSE",
    financeSave: "RECORD",
    
    // Rituals
    streak: "Streak",
    ritualDone: "Ritual Performed",
    ritualCooldown: "Wait for new cycle",
    
    demonDefault: "The Forge awaits your command, Master.",
    deleteTransConfirm: "Are you sure you want to delete this record permanently?",
    deleteNoteConfirm: "Burn this scroll forever?",

    // Critical Success
    critSuccess: "ABYSSAL BLESSING",
    critDesc: "The Forge roars in delight! Critical Success!",
    
    // Settings
    settingsTitle: "Forge Settings",
    settingsVisual: "World Aspect",
    settingsData: "Soul Vessel (Data)",
    themeLight: "LIGHT (ASH)",
    themeDark: "DARK (OBSIDIAN)",
    langRu: "RUSSIAN",
    langEn: "ENGLISH",
    backupDesc: "Save your soul to a file to resurrect it later.",
    btnExport: "EXTRACT SOUL (Download)",
    btnImport: "RESURRECT (Upload)",
    importSuccess: "Soul successfully returned to the body.",
    importError: "File corrupted. Ritual failed.",

    // Market
    marketTitle: "Soul Market",
    marketDesc: "Exchange gold for visual effects",
    effectFire: "Fire",
    effectSoul: "Soul",
    effectVoid: "Void",
    effectBlood: "Blood",
    effectGold: "Gold",
    cost: "Cost",
    equipped: "EQUIPPED",
    equip: "EQUIP",
    buy: "BUY",
    insufficientFunds: "NO GOLD",

    // Altars
    modalAltarTitle: "Erect Altar",
    labelTarget: "Target (Gold)",
    contribute: "CONTRIBUTE",
    altarFull: "ALTAR FULL",
  }
};