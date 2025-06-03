export function compareDatesAndFormat(date1, date2) {
    // Convert to Date objects if they aren't already
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    // Get the absolute difference in milliseconds
    const diffMs = Math.abs(d1 - d2);

    // Convert to minutes and seconds
    const totalSeconds = Math.floor(diffMs / 1000);
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
}