const blurToggle = document.querySelector("#blurToggle");
const MAX_BLUR = 10;

function cloneTemplate(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}

function renderImage(randomImageBlob) {
    const img = new Image();
    img.src = URL.createObjectURL(randomImageBlob);
    img.onload = () => {
        const galleryItem = cloneTemplate("template");
        galleryItem.querySelector("img").setAttribute("src", img.src);
        document.querySelector("#image-gallery").appendChild(galleryItem);
    };
}

document.addEventListener('DOMContentLoaded', async () => {

    const url = buildPicsumUrl();
    const randomImageBlob = await getRandomImage(url.href);
    renderImage(randomImageBlob);
});
function buildPicsumUrl({
    width = 200,
    height = 200,
    grayscale = false,
    blur = false
} = {}) {

    const IMAGE_BASE_URL = "https://picsum.photos";
    const url = new URL(`${width}/${height}`, IMAGE_BASE_URL + "/");

    // note "" =  url.searchParams.set("paramName", "") = ?paramName

    grayscale && url.searchParams.set("grayscale", "");
    const blurAmount = (blur === true) ? '' : blur;   
    if (blur) url.searchParams.set('blur', blurAmount)
        
    console.log("Fetching:", url.href);
    return url;

}
async function getRandomImage(imageUrl) {

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
    const slider = document.getElementById("blurSlider");
    const isEnabled = e.target.checked;
    slider.disabled = !isEnabled;
});


function getBlurSetting(blurSlider) {

    if (!blurToggle.checked) return false;    
    const sliderVal = parseInt(blurSlider.value, MAX_BLUR);
    const blurOption = sliderVal === 0 ? true : sliderVal;
    return blurOption;


}


document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const blurSlider = document.querySelector("#blurSlider");
    const grayscaleToggle = document.querySelector("#grayscaleToggle");
    blurSlider.setAttribute('max', MAX_BLUR);
    const blurOption = getBlurSetting(blurSlider);
    
    try {

        const props = {
            width: 400,
            height: 300,
            grayscale: grayscaleToggle.checked,
            blur: blurOption
        }
        const url = buildPicsumUrl(props);

        const randomImageBlob = await getRandomImage(url.href);
        renderImage(randomImageBlob);


    } catch (err) {
        console.error("Error:", err);
    }
});