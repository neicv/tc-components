import {describe, it} from "mocha";
import {expect} from "chai";
import validateColor from "../../../src/js/lib/colors";

describe("validateColor", () => {
    it(" a Color should Passed on Validator", () => {
        const color    = 'primary'
        const actual   = validateColor(color);
        const expected = color;

        expect(actual).to.be.an("string");
        expect(actual).eql(expected);
    });

    it(" a Color should Disallow on Validator and change to 'inherit'", () => {
        const color    = 'magenta-prime'
        const actual   = validateColor(color);
        const expected = 'inherit';

        expect(actual).to.be.an("string");
        expect(actual).eql(expected);
    });
});
