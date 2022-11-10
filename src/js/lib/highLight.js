import m from "mithril";

function getIntervals(content, regExps) {
    let globalRegExps = convertRegExToGlobal(regExps),
        mapIntervals  = getMapIntervals(globalRegExps, content);

    return calcIntervals(mapIntervals);
}

function convertRegExToGlobal(regExps) {
    let globalRegExps = [];

    regExps.forEach(regExp => {
        let source = regExp instanceof RegExp ? regExp.source : regExp;

        globalRegExps.push(new RegExp(source, "gi"));
    });

    return globalRegExps;
}

function getMapIntervals(regExps, content) {
    let lengthContent = content.length,
        mapIntervals  = Array.from({ length: lengthContent + 1 }, () => 0);

    regExps.forEach(regExp => {
        let match = regExp.exec(content);

        while (match) {
            let part       = match[0],
                partLength = part.length,
                startIndex = match.index,
                endIndex   = startIndex + partLength;

            mapIntervals[startIndex] = mapIntervals[startIndex] + 1;
            mapIntervals[endIndex]   = mapIntervals[endIndex] - 1;

            match = regExp.exec(content);
        }
    });

    return mapIntervals;
}

function calcIntervals(mapIntervals) {
    let intervals          = [],
        lengthMapIntervals = mapIntervals.length,
        startPosition, endPosition;

    for (let index = 0; index < lengthMapIntervals; index++) {
        if (index > 0) {
            mapIntervals[index] = mapIntervals[index] + mapIntervals[index - 1];
        }

        if (startPosition !== undefined && mapIntervals[index] === 0) {
            endPosition = index;

            intervals.push({ startPosition, endPosition });

            startPosition = undefined;
            endPosition   = undefined;
        } else if (startPosition === undefined && mapIntervals[index] === 1) {
            startPosition = index;
        }
    }

    return intervals;
}

export const setHighLight = function(content, regExps = []) {
    let parts = [],
        intervals, start, end;

    if (!content) {
        return "";
    }

    intervals = getIntervals(content, regExps);
    start     = 0;

    intervals.forEach(interval => {
        end = interval.startPosition;

        parts.push(content.substring(start, end));

        start = end;
        end   = interval.endPosition;

        parts.push("<span class='bg-dark-yellow'>");
        parts.push(content.substring(start, end));
        parts.push("</span>");

        start = end;
    });

    end = content.length;

    parts.push(content.substring(start, end));

    return parts.join("");
};

export const setHighLightVnode = function(content, regExps = []) {
    let parts = [],
        intervals, start, end;

    if (!content) {
        return "";
    }

    intervals = getIntervals(content, regExps);
    start     = 0;

    intervals.forEach(interval => {
        end = interval.startPosition;

        parts.push(content.substring(start, end));

        start = end;
        end   = interval.endPosition;

        parts.push(m("span", {class: "bg-dark-yellow"}, content.substring(start, end)));

        start = end;
    });

    end = content.length;

    parts.push(content.substring(start, end));

    return parts;
};
