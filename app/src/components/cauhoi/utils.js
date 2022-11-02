export const decodeCauHoi = (cauHoi) => {
    return cauHoi.split(/(\$\[[\s\S]*?\])/);
};
export const isAnswerPlaceholder = (str) => /^\$\[[\s\S]*?\]$/.test(str);
export const getIndexFromPlaceholder = (str) => {
    const arr = /^\$\[(.*)\]$/.exec(str);
    if (!arr) {
        return -1;
    }
    return parseInt(arr[1]);
};
