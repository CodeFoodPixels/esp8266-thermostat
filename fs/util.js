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
    }
}
