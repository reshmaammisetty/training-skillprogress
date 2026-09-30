const UI = {

    sidebar() {

        return `
            <aside class="sidebar" id="sidebar">

                <div class="logo">
                    Skill<span>Flow</span>
                </div>

                <div class="nav-title">
                    Workspace
                </div>

                <nav>

                    <div class="nav-item">
                        <a href="#dashboard"
                           class="nav-link"
                           data-page="dashboard">
                            <span class="nav-icon">⌂</span>
                            Dashboard
                        </a>
                    </div>

                    <div class="nav-item">
                        <a href="#profile"
                           class="nav-link"
                           data-page="profile">
                            <span class="nav-icon">◯</span>
                            Profile
                        </a>
                    </div>

                    <div class="nav-item">
                        <a href="#skills"
                           class="nav-link"
                           data-page="skills">
                            <span class="nav-icon">◆</span>
                            Skills
                        </a>
                    </div>

                    <div class="nav-item">
                        <a href="#projects"
                           class="nav-link"
                           data-page="projects">
                            <span class="nav-icon">▣</span>
                            Projects
                        </a>
                    </div>

                    <div class="nav-item">
                        <a href="#achievements"
                           class="nav-link"
                           data-page="achievements">
                            <span class="nav-icon">★</span>
                            Achievements
                        </a>
                    </div>

                    <div class="nav-item">
                        <a href="#settings"
                           class="nav-link"
                           data-page="settings">
                            <span class="nav-icon">⚙</span>
                            Settings
                        </a>
                    </div>

                </nav>

                <div class="sidebar-bottom">

                    <button
                        class="logout-btn"
                        id="logoutButton">
                        Logout
                    </button>

                </div>

            </aside>
        `;
    },


    topbar(user) {

        const firstLetter =
            user.name
                ? user.name.charAt(0).toUpperCase()
                : "?";

        return `
            <header class="topbar">

                <button
                    class="menu-button"
                    id="menuButton">
                    ☰
                </button>

                <div></div>

                <div class="user-mini">

                    <div class="avatar">
                        ${firstLetter}
                    </div>

                    <div class="user-mini-info">

                        <strong>
                            ${UI.escape(user.name)}
                        </strong>

                        <span>
                            ${user.profile.role
                                ? UI.escape(user.profile.role)
                                : "Learner"}
                        </span>

                    </div>

                </div>

            </header>
        `;
    },


    layout(content, user) {

        return `
            <div class="app-layout">

                ${UI.sidebar()}

                <div
                    class="mobile-overlay"
                    id="mobileOverlay">
                </div>

                <main class="main">

                    ${UI.topbar(user)}

                    <section class="page-content">
                        ${content}
                    </section>

                </main>

            </div>
        `;
    },


    escape(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
};