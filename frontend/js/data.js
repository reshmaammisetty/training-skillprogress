const Storage = {

    accountsKey: "skillflow_accounts",
    sessionKey: "skillflow_session",

    getAccounts() {
        const accounts = localStorage.getItem(this.accountsKey);

        if (!accounts) {
            return [];
        }

        try {
            return JSON.parse(accounts);
        } catch {
            return [];
        }
    },

    saveAccounts(accounts) {
        localStorage.setItem(
            this.accountsKey,
            JSON.stringify(accounts)
        );
    },

    getSession() {
        return localStorage.getItem(this.sessionKey);
    },

    setSession(userId) {
        localStorage.setItem(this.sessionKey, userId);
    },

    clearSession() {
        localStorage.removeItem(this.sessionKey);
    },

    getCurrentUser() {

        const userId = this.getSession();

        if (!userId) {
            return null;
        }

        const accounts = this.getAccounts();

        return accounts.find(
            account => account.id === userId
        ) || null;
    },

    updateUser(updatedUser) {

        const accounts = this.getAccounts();

        const index = accounts.findIndex(
            account => account.id === updatedUser.id
        );

        if (index === -1) {
            return false;
        }

        accounts[index] = updatedUser;

        this.saveAccounts(accounts);

        return true;
    }
};