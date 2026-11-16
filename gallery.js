const MAX_BLUR = 10;
const FALLBACK_BASE_URL = 'https://source.unsplash.com/random/';
const IMAGE_BASE_URL = 'https://picsum.photos/';
const paramKeys = Object.freeze({
    grayscale: 'grayscale',
    blur: 'blur',
});

const blurToggle = document.querySelector('#blurToggle');
const blurSlider = document.querySelector('#blurSlider');

function cloneTemplate(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}

function renderImage(blob) {
    const gallery = document.querySelector('#image-gallery');
    const galleryItem = cloneTemplate('#gallery-item');
    const imgEl = galleryItem.querySelector('img');
    const objUrl = URL.createObjectURL(blob);

    imgEl.crossOrigin = 'anonymous';
    imgEl.src = objUrl;
    imgEl.onload = () => URL.revokeObjectURL(objUrl);
    imgEl.onerror = () => URL.revokeObjectURL(objUrl);

    gallery.appendChild(galleryItem);
}

async function initialiseGallery() {
    try {
        blurSlider.max = MAX_BLUR;
        const imageUrl = buildPicsumUrl();
        const blob = await fetchImage(imageUrl.href);

        if (!blob) {
            console.warn('Could not load initial image');
            return;
        }

        renderImage(blob);

    } catch (error) {
        console.warn('Failed to initialise gallery:', error.message);
    }
}

function buildPicsumUrl({
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
        params.set(paramKeys.blur, blurAmount)
    }

    console.log(`Fetching: ${url.href}`);
    return url;
}

async function fetchImage(url) {
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



blurToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    blurSlider.disabled = !isEnabled;
});

function getBlurSetting({ blurToggleIsOn = false, blurAmount = 0 } = {}) {
    if (!blurToggleIsOn) return false;
    return (blurAmount === 0) ? true : blurAmount;
}

async function imageFormSubmitted(e) {
    e.preventDefault();
    const grayscaleToggle = document.querySelector('#grayscaleToggle');
    const blurOption = getBlurSetting({
        blurToggleIsOn: blurToggle.checked,
        blurAmount: parseInt(blurSlider.value)
    });

    try {
        const url = buildPicsumUrl({
            wantsGrayscale: grayscaleToggle.checked,
            blur: blurOption,
        });
        renderImage(await fetchImage(url.href));
    } catch (err) {
        console.warn(`Whoops, we had issues fetching you new image: ${err.message}`);
    }

}

document.addEventListener('DOMContentLoaded', initialiseGallery);
document.querySelector('form').addEventListener('submit', imageFormSubmitted);