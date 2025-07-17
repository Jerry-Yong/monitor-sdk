
export function getUserId() {
    const userId = localStorage.getItem("userId");
    if (!userId) {
        const newUserId = Math.random().toString(36).slice(2);
        localStorage.setItem("userId", newUserId);
        return newUserId;
    }
    return userId;
}

export function setUserId(userId) {
    localStorage.setItem("userId", userId);
}
