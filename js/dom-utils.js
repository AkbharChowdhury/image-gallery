export function cloneTemplate(templateSelector='template') {
    const template = document.querySelector(templateSelector);
    const clone = template.content.cloneNode(true);
    return clone;
}