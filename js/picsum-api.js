const IMAGE_BASE_URL = 'https://picsum.photos/';
const paramKeys = Object.freeze({
    grayscale: 'grayscale',
    blur: 'blur',
});

export function buildPicsumUrl({
    width = 200,
    height = 200,
    wantsGrayscale = false,
    blur = false
} = {}) {
    const url = new URL(`${width}/${height}`, IMAGE_BASE_URL);
    const params = url.searchParams;

    // Empty string = ?grayscale without value
    if (wantsGrayscale) {
        params.set(paramKeys.grayscale, '');
    }

    const hasBlur = blur !== false;
    if (hasBlur) {
        const blurAmount = (blur === true) ? '' : blur;
        params.set(paramKeys.blur, blurAmount);
    }

    console.log(`Fetching: ${url.href}`);
    return url;
}

export async function fetchImage(url) {
    try {

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: Failed to fetch image`, {
                cause: response.statusText
            });

        }
        return await response.blob();

    } catch (error) {
        console.warn('There was an issue fetching the image:', error.message);
        throw error;

    }
}
