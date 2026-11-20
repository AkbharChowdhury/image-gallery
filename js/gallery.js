import { cloneTemplate } from './dom-utils.js';
import { buildPicsumUrl, fetchImage } from './picsum-api.js';

const MAX_BLUR = 10;
const blurToggle = document.querySelector('#blurToggle');
const blurSlider = document.querySelector('#blurSlider');
const grayscaleToggle = document.querySelector('#grayscaleToggle');

async function loadImages(images) {
    try {

        const gallery = document.getElementById('gallery');
        images.forEach(img => {

            const imageEl = document.createElement('img');

            // imageEl.src = img.download_url;
            imageEl.src = `https://picsum.photos/id/${img.id}/400/300`;
            imageEl.title = `Photo by ${img.author}`;
            imageEl.alt = `Photo by ${img.author}`;
            imageEl.loading = 'lazy'; // Performance: lazy load offscreen images
            imageEl.style.margin = '8px';
            gallery.appendChild(imageEl);
        });

    } catch (err) {
        console.error('Failed to load images:', err);
    }
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
    const blurOption = getBlurSetting({
        blurToggleIsOn: blurToggle.checked,
        blurAmount: parseInt(blurSlider.value)
    });

    try {
        const imageUrl = buildPicsumUrl({
            wantsGrayscale: grayscaleToggle.checked,
            blur: blurOption,
        });
        renderImage(await fetchImage(imageUrl.href));
    } catch (error) {
        console.warn(`Whoops, we had issues fetching you new image: ${error.message}`);
    }

}

document.addEventListener('DOMContentLoaded', initialiseGallery);
document.querySelector('form').addEventListener('submit', imageFormSubmitted);