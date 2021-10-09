import m from 'mithril';

export const SearchIcon = {
    view: () =>
    <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
        <circle fill="none" stroke="#000" stroke-width="1.1" cx="9" cy="9" r="7"></circle>
        <path fill="none" stroke="#000" stroke-width="1.1" d="M14,14 L18,18 L14,14 Z"></path>
    </svg>
}

export const ContentCopyIcon = {
    view: ({attrs}) =>
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill={attrs.fill || "#000000"}>
        <path d="M0 0h24v24H0V0z" fill="none"/>
        <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
    </svg>
}
