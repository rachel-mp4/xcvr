export function ansiToHex(ansiCode:number) {
    const rgb = ansiToRgb(ansiCode)
    return rgbToHex(rgb)
}

function ansiToRgb(ansiCode: number): [number, number, number] {
    // Define the standard and high-intensity colors
    const colors: Array<[number, number, number]> = [
        [0, 0, 0], [128, 0, 0], [0, 128, 0], [128, 128, 0],
        [0, 0, 128], [128, 0, 128], [0, 128, 128], [192, 192, 192],
        [128, 128, 128], [255, 0, 0], [0, 255, 0], [255, 255, 0],
        [0, 0, 255], [255, 0, 255], [0, 255, 255], [255, 255, 255]
    ];

    if (ansiCode >= 0 && ansiCode <= 15) {
        return colors[ansiCode];
    } else if (ansiCode >= 16 && ansiCode <= 231) {
        ansiCode -= 16;
        const r = Math.floor(ansiCode / 36) * 51;
        const g = Math.floor((ansiCode % 36) / 6) * 51;
        const b = (ansiCode % 6) * 51;
        return [r, g, b];
    } else if (ansiCode >= 232 && ansiCode <= 255) {
        const gray = (ansiCode - 232) * 10 + 8;
        return [gray, gray, gray];
    } else {
       return [255,255,255]
    }
}

// Function to convert RGB to Hex
function rgbToHex([r, g, b]: [number, number, number]) {
    return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()}`;
}