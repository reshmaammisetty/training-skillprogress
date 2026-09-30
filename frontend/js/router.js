const Router = {

    getPage() {

        const hash = window.location.hash
            .replace("#", "")
            .trim();

        return hash || "dashboard";
    },


    navigate(page) {

        window.location.hash = page;
    }
};