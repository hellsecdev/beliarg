

export type Language = 'ru' | 'en' | 'he';

export const translations = {
  ru: {
    // Auth
    authTitle: "ВРАТА БЕЛИАРГА",
    loginBtn: "ВОЙТИ",
    registerBtn: "РЕГИСТРАЦИЯ",
    emailLabel: "Электронная почта",
    passwordLabel: "Пароль",
    confirmPasswordLabel: "Повторите пароль",
    authSubmit: "ОТКРЫТЬ ВРАТА",
    authSwitchToReg: "Нет контракта? Подписать",
    authSwitchToLogin: "Уже есть контракт? Войти",
    authError: "Ошибка: Неверные данные",
    passwordMismatch: "Ошибка: Пароли не совпадают",
    logout: "РАЗОРВАТЬ КОНТРАКТ",
    profile: "Профиль",
    socialGoogle: "Войти через Google",
    socialTelegram: "Войти через Telegram",
    devBy: "Разработано с 🔥",
    demoModeInfo: "Данное приложение находится в демо-режиме. Все данные предназначены для ознакомления.",
    demoModeWarning: "Вы можете вносить данные, но после перезагрузки страницы они обновятся.",
    demoModeCredentials: "Данные для входа:",
    demoModeEmail: "admin@demo.local",
    demoModePassword: "admin",
    
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
    navCalendar: "Календарь",
    navAchievements: "Достижения",
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
    errorContentTooLong: "Содержание не может превышать 300 символов",

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
    page: "Страница",
    of: "из",
    previous: "Предыдущая",
    next: "Следующая",

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
    
    // Difficulties
    diffAsh: "ПЕПЕЛ (Легко)",
    diffEmber: "УГЛИ (Средне)",
    diffInferno: "ИНФЕРНО (Тяжко)",
    
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
    themeLight: "СВЕТ (ПЕПЕЛ)",
    themeDark: "ТЬМА (ОБСИДИАН)",
    langRu: "РУССКИЙ",
    langEn: "ENGLISH",
    langHe: "עברית",
    
    // Market/Altar Stubs (To prevent errors)
    marketTitle: "",
    marketDesc: "",
    effectFire: "",
    effectSoul: "",
    effectVoid: "",
    effectBlood: "",
    effectGold: "",
    cost: "",
    buy: "",
    equip: "",
    equipped: "",
    insufficientFunds: "",
    modalAltarTitle: "",
    labelTarget: "",
    contribute: "",
    altarFull: ""
  },
  en: {
    // Auth
    authTitle: "GATES OF BELIARG",
    loginBtn: "ENTER",
    registerBtn: "SIGN CONTRACT",
    emailLabel: "Email",
    passwordLabel: "Password",
    confirmPasswordLabel: "Confirm Password",
    authSubmit: "OPEN GATES",
    authSwitchToReg: "No contract? Sign one",
    authSwitchToLogin: "Have a contract? Enter",
    authError: "Error: Invalid credentials",
    passwordMismatch: "Error: Passwords do not match",
    logout: "BREAK CONTRACT",
    profile: "Profile",
    socialGoogle: "Enter with Google",
    socialTelegram: "Enter with Telegram",
    devBy: "Developed with 🔥 by",
    demoModeInfo: "This application is in demo mode. All data is for preview purposes.",
    demoModeWarning: "You can enter data, but it will reset after page reload.",
    demoModeCredentials: "Login credentials:",
    demoModeEmail: "admin@demo.local",
    demoModePassword: "admin",

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
    navCalendar: "Calendar",
    navAchievements: "Achievements",
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
    errorContentTooLong: "Content cannot exceed 300 characters",
    
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
    page: "Page",
    of: "of",
    previous: "Previous",
    next: "Next",

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

    // Difficulties
    diffAsh: "ASH (Easy)",
    diffEmber: "EMBER (Medium)",
    diffInferno: "INFERNO (Hard)",
    
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
    themeLight: "LIGHT (ASH)",
    themeDark: "DARK (OBSIDIAN)",
    langRu: "RUSSIAN",
    langEn: "ENGLISH",
    langHe: "HEBREW",

    // Market/Altar Stubs
    marketTitle: "",
    marketDesc: "",
    effectFire: "",
    effectSoul: "",
    effectVoid: "",
    effectBlood: "",
    effectGold: "",
    cost: "",
    buy: "",
    equip: "",
    equipped: "",
    insufficientFunds: "",
    modalAltarTitle: "",
    labelTarget: "",
    contribute: "",
    altarFull: ""
  },
  he: {
    // Auth
    authTitle: "שערי בליארג",
    loginBtn: "הכנס",
    registerBtn: "חתום חוזה",
    emailLabel: "אימייל",
    passwordLabel: "סיסמה",
    confirmPasswordLabel: "אשר סיסמה",
    authSubmit: "פתח שערים",
    authSwitchToReg: "אין חוזה? חתום אחד",
    authSwitchToLogin: "יש חוזה? היכנס",
    authError: "שגיאה: פרטים שגויים",
    passwordMismatch: "שגיאה: הסיסמאות אינן תואמות",
    logout: "הפר חוזה",
    profile: "פרופיל",
    socialGoogle: "הכנס עם גוגל",
    socialTelegram: "הכנס עם טלגרם",
    devBy: "פותח עם 🔥 על ידי",
    demoModeInfo: "אפליקציה זו נמצאת במצב הדגמה. כל הנתונים מיועדים לצפייה בלבד.",
    demoModeWarning: "ניתן להזין נתונים, אך הם יתאפסו לאחר רענון הדף.",
    demoModeCredentials: "פרטי התחברות:",
    demoModeEmail: "admin@demo.local",
    demoModePassword: "admin",

    appTitle: "בליארג",
    appSubtitle: "מנהל הכבשן הנצחי",
    summonSpell: "בליארג, שליט התופת • האש האחרונה תקום • בוא לקול הכס",
    footerSpell: "שרוף את החיים עד שהשמש תשתתק",
    
    // Stats
    treasury: "אוצר",
    
    // Nav
    navChains: "שלשלאות",
    navTreasury: "אוצר",
    navAsh: "אפר",
    navAnalytics: "משפט",
    navCalendar: "לוח שנה",
    navAchievements: "הישגים",
    navGrimoire: "גרימואר",
    
    // Active View
    activeHeader: "פקודות הכבשן",
    ritualsHeader: "טקסים יומיים",
    newChain: "+ שלשלת חדשה",
    newRitual: "+ טקס",
    emptyStateTitle: "הכבשן מתקרר...",
    emptyStateDesc: "תן לי עבודה, אדון.",
    searchPlaceholder: "עין התהום (חיפוש)...",

    // Grimoire View
    grimoireHeader: "מגילות חוכמה",
    newScroll: "+ מגילה חדשה",
    emptyGrimoire: "הדפים ריקים. הידע ממתין לחריטה.",
    modalGrimoireTitle: "חרוט מגילה",
    labelNoteTitle: "כותרת המחשבה",
    labelNoteContent: "תוכן",
    placeholderNoteTitle: "כותרת...",
    placeholderNoteContent: "שפוך את דעתך אל התהום...",
    errorContentTooLong: "התוכן לא יכול לעלות על 300 תווים",
    
    // Finance View
    financeHeader: "זרמי זהב",
    balance: "מאזן",
    addRecord: "+ רשומה",
    tableDate: "תאריך",
    tableDesc: "מהות",
    tableGold: "זהב",
    emptyFinance: "הספר ריק. הזהב דורש ספירה.",
    tribute: "מנחה (הכנסה)",
    sacrifice: "קורבן (הוצאה)",
    recurring: "עינוי נצחי (חודשי עד סוף השנה)",
    page: "עמוד",
    of: "מתוך",
    previous: "הקודם",
    next: "הבא",

    // Analytics View
    analyticsHeader: "מאזני המשפט",
    year: "שנה",
    month: "חודש",
    income: "מנחה",
    expense: "קורבן",
    net: "נטו",
    yearlySurplus: "עודף תהומי",
    yearlyDebt: "חוב דמים",
    noTransInMonth: "שקט בחודש זה...",
    chartTitle: "קצב התהום",
    heatmapTitle: "התופת",
    less: "פחות",
    more: "יותר",
    
    // Filters
    filterDiff: "קושי:",
    filterAll: "הכל",
    sortDeadline: "דדליין תחילה",
    sortNewest: "חדש תחילה",
    sortManual: "ידני (שלשלאות)",
    sortGoldDesc: "העשירים",
    sortGoldAsc: "העניים",

    // Difficulties
    diffAsh: "אפר (קל)",
    diffEmber: "גחלת (בינוני)",
    diffInferno: "תופת (קשה)",
    
    // History View
    historyHeader: "קריפטת המושלמים",
    burnArchive: "שרוף ארכיון",
    sealStamped: "חותם הוטבע",
    
    // Task Card
    overdue: "באיחור",
    execute: "בצע",
    confirmDelete: "להפיג את השרשרת הזו לאפר?",
    subtasks: "חוליות השרשרת",
    slideDelete: "השמד",
    slideComplete: "בצע",
    
    // Modals
    modalEditTitle: "חשול מחדש",
    modalNewTitle: "חוזה חדש",
    modalRitualTitle: "טקס חדש",
    modalEditFinanceTitle: "שכתב גורל",
    modalConfirmTitle: "השמד רשומה",
    labelTitle: "מהות ההתחייבות",
    labelDesc: "תנאי העינוי",
    labelDeadline: "שעת הדין",
    labelDifficulty: "כובד הנטל",
    labelSubtask: "חוליה",
    labelSigil: "סימן (תג)",
    noSigil: "ללא סימן",
    createSigil: "+ חרוט סימן",
    newSigilName: "שם הסימן",
    addSubtask: "+ הוסף חוליה",
    placeholderTitle: "למשל: לכבוש את הפסגה (ללכת למכון)",
    btnRefuse: "סרב",
    btnCancel: "השאר",
    btnDelete: "השמד",
    btnForge: "חשול מחדש",
    btnSeal: "חתום",
    btnCreate: "צור",
    btnUpdate: "עדכן",
    
    financeSource: "מקור / מטרה",
    financeAmount: "סכום (זהב)",
    financeDate: "זמן המעשה",
    financeClose: "סגור",
    financeSave: "רשום",
    
    // Rituals
    streak: "רצף",
    ritualDone: "הטקס בוצע",
    ritualCooldown: "המתן למחזור חדש",
    
    demonDefault: "הכבשן ממתין לפקודותיך, אדון.",
    deleteTransConfirm: "האם אתה בטוח שברצונך למחוק רשומה זו לצמיתות?",
    deleteNoteConfirm: "לשרוף את המגילה הזו לנצח?",

    // Critical Success
    critSuccess: "ברכת התהום",
    critDesc: "הכבשן שואג בהנאה! הצלחה קריטית!",
    
    // Settings
    settingsTitle: "הגדרות הכבשן",
    settingsVisual: "מראה העולם",
    themeLight: "אור (אפר)",
    themeDark: "חושך (אובסידיאן)",
    langRu: "רוסית",
    langEn: "אנגלית",
    langHe: "עברית",

    // Market/Altar Stubs
    marketTitle: "",
    marketDesc: "",
    effectFire: "",
    effectSoul: "",
    effectVoid: "",
    effectBlood: "",
    effectGold: "",
    cost: "",
    buy: "",
    equip: "",
    equipped: "",
    insufficientFunds: "",
    modalAltarTitle: "",
    labelTarget: "",
    contribute: "",
    altarFull: ""
  }
};