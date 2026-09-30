const Auth = {

    signup(name, email, password) {

        name = name.trim();
        email = email.trim().toLowerCase();
        password = password.trim();

        if (!name || !email || !password) {
            return {
                success: false,
                message: "Please fill all fields."
            };
        }

        if (password.length < 6) {
            return {
                success: false,
                message: "Password must contain at least 6 characters."
            };
        }

        const accounts = Storage.getAccounts();

        const existingUser = accounts.find(
            account => account.email === email
        );

        if (existingUser) {
            return {
                success: false,
                message: "An account with this email already exists."
            };
        }

        /*
         * NEW USER STARTS WITH EMPTY DATA.
         */

        const newUser = {

            id: crypto.randomUUID(),

            name: name,

            email: email,

            password: password,

            profile: {
                role: "",
                location: "",
                bio: "",
                github: "",
                linkedin: ""
            },

            skills: [],

            projects: [],

            achievements: []
        };

        accounts.push(newUser);

        Storage.saveAccounts(accounts);

        Storage.setSession(newUser.id);

        return {
            success: true,
            user: newUser
        };
    },


    login(email, password) {

        email = email.trim().toLowerCase();
        password = password.trim();

        if (!email || !password) {
            return {
                success: false,
                message: "Please enter email and password."
            };
        }

        const accounts = Storage.getAccounts();

        const user = accounts.find(
            account =>
                account.email === email &&
                account.password === password
        );

        if (!user) {
            return {
                success: false,
                message: "Invalid email or password."
            };
        }

        Storage.setSession(user.id);

        return {
            success: true,
            user: user
        };
    },


    logout() {

        Storage.clearSession();

        window.location.hash = "login";
    },


    isLoggedIn() {

        return Storage.getCurrentUser() !== null;
    },


    getUser() {

        return Storage.getCurrentUser();
    }
};