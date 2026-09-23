function toDateKey(value) {
    if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}/.test(value)) {
        return value.slice(0, 10);
    }

    const date = new Date(value);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}


function todayKey() {
    return toDateKey(new Date());
}


function dayDiff(laterKey, earlierKey) {
    const [laterYear, laterMonth, laterDay] = laterKey.split("-").map(Number);
    const [earlierYear, earlierMonth, earlierDay] = earlierKey.split("-").map(Number);

    const later = new Date(laterYear, laterMonth - 1, laterDay);
    const earlier = new Date(earlierYear, earlierMonth - 1, earlierDay);

    return Math.round((later - earlier) / 86400000);
}


function uniqueSortedDays(workoutDates) {
    return [...new Set(
        workoutDates
            .filter(Boolean)
            .map(toDateKey)
    )].sort();
}


function longestRun(days) {
    if (days.length === 0) {
        return 0;
    }

    let longest = 1;
    let run = 1;

    for (let i = 1; i < days.length; i++) {
        if (dayDiff(days[i], days[i - 1]) === 1) {
            run += 1;
            longest = Math.max(longest, run);
        } else {
            run = 1;
        }
    }

    return longest;
}


function currentRun(days, today) {
    if (days.length === 0) {
        return 0;
    }

    const lastWorkout = days[days.length - 1];
    const gapFromToday = dayDiff(today, lastWorkout);

    // Today or yesterday still counts. Two+ missed days breaks the streak.
    if (gapFromToday > 1) {
        return 0;
    }

    let current = 1;

    for (let i = days.length - 1; i > 0; i--) {
        if (dayDiff(days[i], days[i - 1]) === 1) {
            current += 1;
        } else {
            break;
        }
    }

    return current;
}


function calculateStreaks(workoutDates, today = todayKey()) {
    const days = uniqueSortedDays(workoutDates);

    return {
        currentStreak: currentRun(days, today),
        longestStreak: longestRun(days)
    };
}


module.exports = {
    calculateStreaks,
    toDateKey,
    todayKey
};
