const MAX_BLUR = 10;
const IMAGE_BASE_URL = 'https://picsum.photos/';
const paramKeys = Object.freeze({
    grayscale: 'grayscale',
    blur: 'blur',
});

const blurToggle = document.querySelector('#blurToggle');
const blurSlider = document.querySelector('#blurSlider');
const form = document.querySelector('form');

function cloneTemplate(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}

function renderImage(blob) {
    const img = new Image();
    const gallery = document.querySelector('#image-gallery');
    const galleryItem = cloneTemplate('template');
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
        galleryItem.querySelector('img').src = img.src;
        gallery.appendChild(galleryItem);
        URL.revokeObjectURL(img.src);
    };
}


document.addEventListener('DOMContentLoaded', async () => {
  try {
    
    // Set up UI constants first
    blurSlider.setAttribute('max', MAX_BLUR);
    // Load and display initial image
    const url = buildPicsumUrl();
    const blob = await fetchImageBlob(url.href);
    renderImage(blob);

  } catch (err) {
    console.error('Failed to initialise gallery:', err);
    
  }
});


function buildPicsumUrl({
    width = 200,
    height = 200,
    wantsGrayscale = false,
    blur = false
} = {}) {
    const url = new URL(`${width}/${height}`, IMAGE_BASE_URL);
    const params = url.searchParams;
    
    // Empty string = ?grayscale without value (Picsum standard pattern)
    if (wantsGrayscale){
        params.set(paramKeys.grayscale, '');
    }
    const hasBlur = blur !==false;

    if(hasBlur){
        const blurAmount = (blur === true) ? '': blur;
        params.set(paramKeys.blur, blurAmount)
    }

    console.log('Fetching:', url.href);
    return url;
}

async function fetchImageBlob(url = '') {

    try {
        const res = await fetch(url);
        if (!res.ok){
            throw new Error(`HTTP ${res.status}: ${res.statusText}`)
        }
        return await res.blob();
    } catch (error) {
        console.error('there was a problem fetching random image', error.message);
        throw error;

    }

}

blurToggle.addEventListener('change', (e) => {
    const isEnabled = e.target.checked;
    blurSlider.disabled = !isEnabled;
});


function getBlurSetting({blurToggleIsOn=false, blurAmount=0} = {}) {
    if (!blurToggleIsOn) return false;
    return (blurAmount === 0) ? true : blurAmount;
}

form.addEventListener('submit', async (e) => {

    e.preventDefault();

    const grayscaleToggle = document.querySelector('#grayscaleToggle');

    const blurOption = getBlurSetting({
        blurToggleIsOn: blurToggle.checked,
        blurAmount: parseInt(blurSlider.value)
    });

    const props = Object.freeze({
        width: 400,
        height: 300,
        wantsGrayscale: grayscaleToggle.checked,
        blur: blurOption,
    });
    
    try {
        const url = buildPicsumUrl(props);
        const blob = await fetchImageBlob(url.href);
        renderImage(blob);
    } catch (err) {
        console.error('Whoops, we had issues fetching you new image:', err.message);
    }
});