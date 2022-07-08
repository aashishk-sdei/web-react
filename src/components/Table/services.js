export const setMultiInput = (value) => {
    localStorage.setItem("multiInput", value);
}

export const getMultiInput = () => {
    return localStorage.getItem("multiInput");
}