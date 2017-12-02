load("api_math.js");

let Util = {
    indexOf: function(haystack, needle) {
        for (let i = 0; i < haystack.length; i++) {
            if (haystack[i] === needle) {
                return i;
            }
        }

        return -1;
    },

    split: function(str, delimiter) {
        let start = 0;
        let parts = 0;
        let splitArray = [];

        for (let i = 0; i < str.length; i++) {
            if (str[i + 1] === delimiter || i === str.length - 1) {
                splitArray[parts] = str.slice(start, i + 1);
                parts++;
                start = i + 2;
            }
        }

        return splitArray;
    },

    parseInt: function(str) {
        let numbers = "0123456789";
        let int = 0;
        for (let i = 0; i < str.length; i++) {
            if (str[i] === "0") {
                continue;
            }

            for (let a = 0; a < 10; a++) {
                if (str[i] === numbers[a]) {
                    let multiplier = Math.pow(10, ((str.length - i) - 1));

                    int += a * multiplier;
                    break;
                }
            }
        }

        return int;
    }
}
