function getTemplateClone(templateSelector) {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}
document.addEventListener('DOMContentLoaded', ()=> loadImage());


async function loadImage() {
    const res = await fetch("https://picsum.photos/250/250");
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const img = new Image();
    img.src = url;
    img.onload = () => {
        const imageTemplate = getTemplateClone("template");
        imageTemplate.querySelector("img").setAttribute("src", img.src);
        document.getElementById("image-gallery").appendChild(imageTemplate);
    };
}
document.querySelector("form").addEventListener("submit", (e) => {
    e.preventDefault();
    loadImage();
});
