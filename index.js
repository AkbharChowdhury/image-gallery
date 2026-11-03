function getTemplateClone(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}
function renderImage(randomImageBlob){
    const img = new Image();
    img.src = URL.createObjectURL(randomImageBlob);
    img.onload = () => {
        const imageTemplate = getTemplateClone("template");
        imageTemplate.querySelector("img").setAttribute("src", img.src);
        document.getElementById("image-gallery").appendChild(imageTemplate);
    };
}
document.addEventListener('DOMContentLoaded', async ()=>{
    const props = {
        grayscale: false,
    }

    const url = buildPicsumUrl(props);
    const randomImageBlob = await getRandomImage(url.href);
    renderImage(randomImageBlob);

    
});
function buildPicsumUrl({
    width = 200,
    height = 200,
    grayscale = false,
    blur = false
} = {}){

    const IMAGE_BASE_URL = "https://picsum.photos";
    const url = new URL(`${width}/${height}`, IMAGE_BASE_URL + "/");

    if (grayscale) {
        //`?grayscale`
        url.searchParams.set("grayscale", ""); 
    }
    
    if (blur === true) {
        // `?blur`
        url.searchParams.set("blur", "");
    } else if (blur) {
        url.searchParams.set("blur", blur);
    }

   
    console.log("Fetching:", url.href);
    return url;

}
async function getRandomImage(imageUrl) {
    
    try {
      
        const res = await fetch(imageUrl);
        if (!res.ok)  throw new Error(`HTTP ${res.status}: ${res.statusText}`);

        const blob = await res.blob();
        return blob;

    } catch (error) {
        console.error('there was a problem fetching random image', error.message);
        throw error;

    }

}


// document.querySelector("form").addEventListener("submit", async (e) => {
//     e.preventDefault();
//     const url  = buildPicsumUrl({ grayscale:true, blur:true});
//     const randomImageBlob =  await getRandomImage(url.href);
//     renderImage(randomImageBlob);

// });



// Update slider state when checkbox changes
document.getElementById("blurToggle").addEventListener("change", (e) => {
  const slider = document.getElementById("blurSlider");
  const isEnabled = e.target.checked;
  
  slider.disabled = !isEnabled;
});

// Show live slider value
document.getElementById("blurSlider").addEventListener("input", (e) => {
//   document.getElementById("blurValue").textContent = e.target.value;
});

// Load image from controls
document.querySelector("form").addEventListener("submit", async (e) => {
    e.preventDefault();

  const blurToggle = document.getElementById("blurToggle");
  const blurSlider = document.getElementById("blurSlider");
  const grayscaleToggle = document.getElementById("grayscaleToggle");

  // Determine blur value: true (plain) or number
  let blurOption;
  if (blurToggle.checked) {
    // Use slider value if enabled
    blurOption = parseInt(blurSlider.value, 10);
    // Optional: uncomment below to send just "?blur" instead of "?blur=2"
    // blurOption = true;
  } else {
    blurOption = false;
  }

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