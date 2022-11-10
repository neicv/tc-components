import _ from 'lodash';

const globalExcludes = ['creation', 'handler'];

export const objectType = (obj) => {
    return Object.prototype.toString.call(obj).slice(8, -1);
}

export const isDefined = (param) => {
    return typeof param != "undefined";
}

export const isUndefined = (param) => {
    return typeof param == "undefined";
}

export const isFunction = (param) => {
    return typeof param == "function";
}

export const isNumber = (param) => {
    return typeof param == "number" && !isNaN(param);
}

export const isString = (str) => {
    return objectType(str) === "String";
}

export const isArray = (arr) => {
    return objectType(arr) === "Array";
}

export const closest = (target, selector) => {
    // closest(e.target, '.field')
    while (target) {
        if (target.matches && target.matches(selector)) return target;
        target = target.parentNode;
    }
    return null;
}

export const getOffsetRect = (elem) => {
    let box     = elem.getBoundingClientRect(),
        body    = document.body,
        docElem = document.documentElement,
        top, left;

    const scrollTop  = window.pageYOffset || docElem.scrollTop || body.scrollTop,
          scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft,
          clientTop  = docElem.clientTop || body.clientTop || 0,
          clientLeft = docElem.clientLeft || body.clientLeft || 0;

    top  = box.top + scrollTop - clientTop;
    left = box.left + scrollLeft - clientLeft;

    return { top: Math.round(top), left: Math.round(left) };
}

export const getTotalScroll = (elem) => {
    let top  = 0,
        left = 0;

    while ((elem = elem.parentNode)) {
        top  += elem.scrollTop || 0;
        left += elem.scrollLeft || 0;
    }

    return { top, left };
}

export const getTransformProps = (x, y) => {
    return {
        transform: "translate(" + x + "px, " + y + "px)",
    }
}

export const listWithChildren = (list, childrenProp) => {
    return list.map((item) => {
        return {
            ...item,
            [childrenProp]: item[childrenProp]
                ? listWithChildren(item[childrenProp], childrenProp)
                : [],
        }
    })
}

export const getAllNonEmptyNodesIds = (items, { idProp, childrenProp }) => {
    let childrenIds = [];
    let ids = items
        .filter((item) => item[childrenProp].length)
        .map((item) => {
            childrenIds = childrenIds.concat(
                getAllNonEmptyNodesIds(item[childrenProp], {
                    idProp,
                    childrenProp,
                })
            );
            return item[idProp];
        });

    return ids.concat(childrenIds);
}

// simplified version shallowCompare from 'react-addons-shallow-compare';
export const shallowCompare = (props, nextProps) => {
    const oldProps = _.omit(props, globalExcludes)
    const newProps = _.omit(nextProps, globalExcludes)
    const keys = Object.keys(props)
    return shallowEqualJS(oldProps, newProps, keys)
}

export const shallowCompareWithState = (data, nextProps, nextState) => {
    const { props = {}, state = {} } = data
    const stateKeys = Object.keys(state)

    for (let i = 0; i < stateKeys.length; i++) {
        const key = stateKeys[i]
        if (state[key] !== nextState[key]) {
            return true
        }
    }

    return shallowCompare(props, nextProps)
}

const shallowEqualJS = (props, nextProps, keys) => {
    const shouldUpdate = false

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i]

        let oldValue   = props[key]
        const newValue = nextProps[key]

        if (typeof newValue === 'function') {
            continue;
        }

        const isImmutable = !!(newValue && newValue.get && newValue.getIn)

        if (isImmutable) {
            oldValue = oldValue || new Map()
            if (!_.isEqual(newValue, oldValue)) {

                return true
            }
        }

        if (typeof newValue !== 'undefined' && oldValue === 'undefined') {

            return true;
        }

        if (typeof newValue === 'object') {
            if (!_.isEqual(newValue, oldValue)) {

                return true;
            }
        }

        if (typeof newValue === 'string'
            || typeof newValue === 'number'
            || typeof newValue === 'boolean'
        ) {
            if (newValue !== oldValue) {

                return true;
            }
        }

        if (newValue !== oldValue) {

            return true;
        }
    }

    return shouldUpdate;
}
