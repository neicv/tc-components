let content = {},
    locale  = "";

function mergeContent(content1, content2) {
    let out = {};

    for (let k1 in content1) {
        if (content1.hasOwnProperty(k1)) {
            out[k1] = content1[k1];
        }
    }

    for (let k2 in content2) {
        if (content2.hasOwnProperty(k2)) {
            if (!out.hasOwnProperty(k2)) {
                out[k2] = content2[k2];
            } else if (
                (typeof out[k2] === 'object')
                && (out[k2] !== null)
                && (out[k2].constructor === Object)
                && (typeof content2[k2] === 'object')
                && (content2[k2].constructor === Object)
            ) {
                out[k2] = mergeContent(out[k2], content2[k2]);
            }
        }
    }

    return out;
}

export function setLocale(_locale) {
    locale = _locale;
}

export function getLocale() {
    return locale;
}

export function setContent() {
    Array.prototype.forEach.call(arguments, _content => {
        content = mergeContent(content, _content);
    });
}

export function getContent() {
    return content[getLocale()];
}

export function translate(path) {
    let index = (obj, i) => obj[i];

    return path.split('.').reduce(index, getContent());
}

export default { setLocale, getLocale, setContent, getContent, translate };
