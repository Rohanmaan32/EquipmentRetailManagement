export const saveToLocalStorage = (key, value) => {
    if (!localStorage.getItem(key)){
    localStorage.setItem(key, JSON.stringify(value));}
};

export const getFromLocalStorage = (key) => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
};

export const removeFromLocalStorage = (key) => {
    localStorage.removeItem(key);
};