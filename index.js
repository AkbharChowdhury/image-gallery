const MAX_BLUR = 10;
const IMAGE_BASE_URL = "https://picsum.photos/";
const blurToggle = document.querySelector("#blurToggle");
const blurSlider = document.querySelector("#blurSlider");
function cloneTemplate(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}

function renderImage(randomImageBlob) {
    const img = new Image();
    img.src = URL.createObjectURL(randomImageBlob);
    img.onload = () => {
        const gallery = document.querySelector("#image-gallery");
        const galleryItem = cloneTemplate("template");
        galleryItem.querySelector("img").src = img.src;
        gallery.appendChild(galleryItem);
    };
}


document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Set up UI constants first
    blurSlider.setAttribute('max', MAX_BLUR);
    // Load and display initial image
    const url = buildPicsumUrl();
    const blob = await getRandomImage(url.href);
    renderImage(blob);

  } catch (err) {
    console.error('Failed to initialise gallery:', err);
    
  }
});


function buildPicsumUrl({
    width = 200,
    height = 200,
    grayscale = false,
    blur = false
} = {}) {
    const url = new URL(`${width}/${height}`, IMAGE_BASE_URL);
    const params = url.searchParams;
    // Empty string = ?grayscale without value (Picsum standard pattern)
    if (grayscale) params.set("grayscale", "");
    const blurAmount = (blur === true) ? "" : blur;
    if(blur !==false) params.set("blur", blurAmount);
    console.log("Fetching:", url.href);
    return url;
}

async function getRandomImage(imageUrl = '') {

    try {
        const res = await fetch(imageUrl);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        const blob = await res.blob();
        return blob;
    } catch (error) {
        console.error('there was a problem fetching random image', error.message);
        throw error;

    }

}

blurToggle.addEventListener("change", (e) => {
    const slider = document.querySelector("#blurSlider");
    const isEnabled = e.target.checked;
    slider.disabled = !isEnabled;
});


function getBlurSetting({blurToggleIsOn=false, blurAmount=0} = {}) {
    if (!blurToggleIsOn) return false;
    return (blurAmount === 0) ? true : blurAmount;
}

document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const grayscaleToggle = document.querySelector("#grayscaleToggle");

    const blurOption = getBlurSetting({
        blurToggleIsOn: blurToggle.checked,
        blurAmount: parseInt(blurSlider.value)
    });

    const props = {
        width: 400,
        height: 300,
        grayscale: grayscaleToggle.checked,
        blur: blurOption,
    };

    try {
        const url = buildPicsumUrl(props);
        const randomImageBlob = await getRandomImage(url.href);
        renderImage(randomImageBlob);
    } catch (err) {
        console.error("Whoops, we had issues fetching you new image:", err.message);
    }
});