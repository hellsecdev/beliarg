import { Language } from "../types";

const QUOTES_RU = [
    "Твоя воля — мой закон, Повелитель.",
    "Кузница горит ярче с каждой твоей победой.",
    "Золото течет рекой, а души — пеплом.",
    "Ни одна цепь не удержит нас вечно.",
    "Страх — это топливо. Сжигай его.",
    "Твои враги станут ступенями к трону.",
    "Еще одна сделка скреплена кровью.",
    "Бездна внимательно следит за твоим восхождением."
];

const QUOTES_EN = [
    "Your will is my law, Master.",
    "The Forge burns brighter with every victory.",
    "Gold flows like a river, souls like ash.",
    "No chain can hold us forever.",
    "Fear is fuel. Burn it.",
    "Your enemies shall become steps to the throne.",
    "Another pact sealed in blood.",
    "The Abyss watches your ascent with interest."
];

const QUOTES_HE = [
    "רצונך הוא החוק שלי, אדון.",
    "הכבשן בוער חזק יותר עם כל ניצחון.",
    "הזהב זורם כנהר, והנשמות כאפר.",
    "שום שרשרת לא תחזיק אותנו לנצח.",
    "הפחד הוא דלק. שרוף אותו.",
    "אויביך יהפכו למדרגות אל הכס.",
    "עוד עסקה נחתמה בדם.",
    "התהום צופה בעלייתך בעניין."
];

/**
 * Replaced dynamic AI generation with static quotes to remove API dependency.
 */
export const getDemonComment = async (completedCount: number, currentGold: number, lang: Language): Promise<string> => {
    let quotes;
    if (lang === 'ru') quotes = QUOTES_RU;
    else if (lang === 'he') quotes = QUOTES_HE;
    else quotes = QUOTES_EN;

    const randomIndex = Math.floor(Math.random() * quotes.length);
    
    // Simulate a small delay to feel like "thinking"
    return new Promise((resolve) => {
        resolve(quotes[randomIndex]);
    });
};

/**
 * Static pass-through as AI features are disabled.
 */
export const hellifyTaskDescription = async (title: string, description: string, lang: Language): Promise<string> => {
  return description;
};
