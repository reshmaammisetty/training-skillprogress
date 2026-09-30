const App = {

    init() {

        window.addEventListener(
            "hashchange",
            () => this.render()
        );

        this.render();
    },


    render() {

        const app = document.getElementById("app");

        const page = Router.getPage();

        /*
         * LOGIN / SIGNUP
         */

        if (page === "login" || page === "signup") {

            app.innerHTML = this.authPage(
                page === "signup"
            );

            this.bindAuthEvents();

            return;
        }


        /*
         * PROTECTED PAGES
         */

        if (!Auth.isLoggedIn()) {

            Router.navigate("login");

            return;
        }


        const user = Auth.getUser();

        let content = "";


        switch (page) {

            case "dashboard":
                content = this.dashboardPage(user);
                break;

            case "profile":
                content = this.profilePage(user);
                break;

            case "skills":
                content = this.skillsPage(user);
                break;

            case "projects":
                content = this.projectsPage(user);
                break;

            case "achievements":
                content = this.achievementsPage(user);
                break;

            case "settings":
                content = this.settingsPage(user);
                break;

            default:
                Router.navigate("dashboard");
                return;
        }


        app.innerHTML = UI.layout(
            content,
            user
        );

        this.bindLayoutEvents();

        this.highlightNavigation(page);

        this.bindPageEvents(page);
    },


    /* =========================
       AUTH PAGE
    ========================= */

    authPage(isSignup) {

        return `
            <div class="login-page">

                <div class="login-showcase">

                    <div class="showcase-logo">
                        Skill<span>Flow</span>
                    </div>

                    <div class="showcase-content">

                        <div class="eyebrow">
                            YOUR SKILLS. YOUR JOURNEY.
                        </div>

                        <h1>
                            Build skills.
                            Track progress.
                            Grow.
                        </h1>

                        <p>
                            SkillFlow helps you organize your
                            learning journey, track skills,
                            manage projects and celebrate
                            your achievements.
                        </p>

                    </div>

                </div>


                <div class="login-panel">

                    <div class="login-box">

                        <h2>
                            ${isSignup
                                ? "Create your account"
                                : "Welcome to SkillFlow"}
                        </h2>

                        <p class="subtitle">
                            ${isSignup
                                ? "Start your learning journey today."
                                : "Continue your learning journey."}
                        </p>

                        <div id="authMessage"></div>


                        ${
                            isSignup
                            ?
                            `
                            <div class="input-group">

                                <label>
                                    Full name
                                </label>

                                <input
                                    type="text"
                                    id="signupName"
                                    class="input"
                                    placeholder="Enter your name">
                            </div>
                            `
                            :
                            ""
                        }


                        <div class="input-group">

                            <label>
                                Email
                            </label>

                            <input
                                type="email"
                                id="authEmail"
                                class="input"
                                placeholder="you@example.com">

                        </div>


                        <div class="input-group">

                            <label>
                                Password
                            </label>

                            <input
                                type="password"
                                id="authPassword"
                                class="input"
                                placeholder="Minimum 6 characters">

                        </div>


                        <button
                            class="btn btn-primary btn-full"
                            id="authSubmit">

                            ${
                                isSignup
                                ? "Create Account"
                                : "Sign In"
                            }

                        </button>


                        <div class="auth-switch">

                            ${
                                isSignup
                                ?
                                `
                                Already have an account?
                                <button id="switchAuth">
                                    Sign in
                                </button>
                                `
                                :
                                `
                                Don't have an account?
                                <button id="switchAuth">
                                    Create account
                                </button>
                                `
                            }

                        </div>

                    </div>

                </div>

            </div>
        `;
    },


    bindAuthEvents() {

        const submit =
            document.getElementById("authSubmit");

        const switchButton =
            document.getElementById("switchAuth");

        const isSignup =
            Router.getPage() === "signup";


        submit.addEventListener("click", () => {

            const email =
                document.getElementById("authEmail").value;

            const password =
                document.getElementById("authPassword").value;


            let result;


            if (isSignup) {

                const name =
                    document.getElementById("signupName").value;

                result = Auth.signup(
                    name,
                    email,
                    password
                );

            } else {

                result = Auth.login(
                    email,
                    password
                );
            }


            const message =
                document.getElementById("authMessage");


            if (!result.success) {

                message.innerHTML = `
                    <div class="alert alert-error">
                        ${UI.escape(result.message)}
                    </div>
                `;

                return;
            }


            Router.navigate("dashboard");
        });


        switchButton.addEventListener("click", () => {

            if (isSignup) {
                Router.navigate("login");
            } else {
                Router.navigate("signup");
            }

        });


        /*
         * Press Enter to submit.
         */

        document
            .querySelectorAll(".input")
            .forEach(input => {

                input.addEventListener(
                    "keydown",
                    event => {

                        if (event.key === "Enter") {
                            submit.click();
                        }

                    }
                );

            });
    },


    /* =========================
       DASHBOARD
    ========================= */

    dashboardPage(user) {

        const skills = user.skills || [];
        const projects = user.projects || [];
        const achievements = user.achievements || [];


        const overallProgress =
            this.calculateOverallProgress(user);


        return `

            <div class="page-header">

                <div>
                    <h1>Dashboard</h1>

                    <p>
                        Your learning journey at a glance.
                    </p>
                </div>

            </div>


            <div class="card welcome-card">

                <h2>
                    Welcome, ${UI.escape(user.name)} 👋
                </h2>

                <p>
                    Keep learning, building and growing.
                </p>

                <div class="progress-large">

                    <div style="
                        display:flex;
                        justify-content:space-between;
                        margin-bottom:8px;
                    ">

                        <span>
                            Overall Progress
                        </span>

                        <strong>
                            ${overallProgress}%
                        </strong>

                    </div>

                    <div class="progress">

                        <div
                            class="progress-bar"
                            style="width:${overallProgress}%">
                        </div>

                    </div>

                </div>

            </div>


            <div class="grid grid-4 dashboard-grid">

                <div class="card stat-card">

                    <div class="stat-label">
                        Skills
                    </div>

                    <div class="stat-value">
                        ${skills.length}
                    </div>

                </div>


                <div class="card stat-card">

                    <div class="stat-label">
                        Projects
                    </div>

                    <div class="stat-value">
                        ${projects.length}
                    </div>

                </div>


                <div class="card stat-card">

                    <div class="stat-label">
                        Achievements
                    </div>

                    <div class="stat-value">
                        ${achievements.length}
                    </div>

                </div>


                <div class="card stat-card">

                    <div class="stat-label">
                        Progress
                    </div>

                    <div class="stat-value">
                        ${overallProgress}%
                    </div>

                </div>

            </div>


            <div class="grid grid-2 dashboard-section">


                <div class="card">

                    <div class="section-header">

                        <h2>
                            Your Skills
                        </h2>

                        <button
                            onclick="Router.navigate('skills')">
                            View all
                        </button>

                    </div>

                    ${
                        skills.length
                        ?
                        skills
                            .slice(0, 4)
                            .map(skill =>
                                this.skillRow(skill)
                            )
                            .join("")
                        :
                        this.emptyMini(
                            "No skills yet",
                            "Add your first skill to start tracking your progress.",
                            "skills"
                        )
                    }

                </div>


                <div class="card">

                    <div class="section-header">

                        <h2>
                            Your Projects
                        </h2>

                        <button
                            onclick="Router.navigate('projects')">
                            View all
                        </button>

                    </div>

                    ${
                        projects.length
                        ?
                        projects
                            .slice(0, 3)
                            .map(project =>
                                this.projectMini(project)
                            )
                            .join("")
                        :
                        this.emptyMini(
                            "No projects yet",
                            "Create your first project and track your progress.",
                            "projects"
                        )
                    }

                </div>

            </div>
        `;
    },


    skillRow(skill) {

        return `
            <div class="skill-row">

                <div class="skill-row-top">

                    <span>
                        ${UI.escape(skill.name)}
                    </span>

                    <span>
                        ${skill.progress}%
                    </span>

                </div>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${skill.progress}%">
                    </div>

                </div>

            </div>
        `;
    },


    projectMini(project) {

        return `
            <div class="skill-row">

                <div class="skill-row-top">

                    <span>
                        ${UI.escape(project.name)}
                    </span>

                    <span>
                        ${project.progress}%
                    </span>

                </div>

                <div class="progress">

                    <div
                        class="progress-bar"
                        style="width:${project.progress}%">
                    </div>

                </div>

            </div>
        `;
    },


    emptyMini(title, text, page) {

        return `
            <div style="
                padding:25px 5px;
                text-align:center;
            ">

                <p style="
                    font-weight:600;
                    margin-bottom:5px;
                ">
                    ${title}
                </p>

                <p style="
                    color:var(--text-secondary);
                    font-size:13px;
                    margin-bottom:12px;
                ">
                    ${text}
                </p>

                <button
                    class="btn btn-secondary"
                    onclick="Router.navigate('${page}')">
                    Get Started
                </button>

            </div>
        `;
    },


    /* =========================
       SKILLS
    ========================= */

    skillsPage(user) {

        const skills = user.skills || [];

        return `

            <div class="page-header">

                <div>

                    <h1>Skills</h1>

                    <p>
                        Track your technical and professional skills.
                    </p>

                </div>

                <button
                    class="btn btn-primary"
                    id="addSkillButton">
                    + Add Skill
                </button>

            </div>


            ${
                skills.length
                ?
                `
                <div class="grid grid-3">

                    ${skills
                        .map(skill => `

                            <div class="card skill-card">

                                <h3>
                                    ${UI.escape(skill.name)}
                                </h3>

                                <div class="skill-level">
                                    ${UI.escape(skill.level || "Beginner")}
                                </div>

                                <div class="skill-percentage">

                                    <span>
                                        Progress
                                    </span>

                                    <strong>
                                        ${skill.progress}%
                                    </strong>

                                </div>

                                <div class="progress">

                                    <div
                                        class="progress-bar"
                                        style="width:${skill.progress}%">
                                    </div>

                                </div>

                            </div>

                        `)
                        .join("")}

                </div>
                `
                :
                `
                <div class="card">

                    <div class="empty-state">

                        <div class="empty-icon">
                            ◆
                        </div>

                        <h3>
                            No skills added yet
                        </h3>

                        <p>
                            Add your first skill and start
                            tracking your learning progress.
                        </p>

                        <button
                            class="btn btn-primary"
                            id="emptyAddSkill">
                            Add Your First Skill
                        </button>

                    </div>

                </div>
                `
            }


            <div
                class="modal-overlay"
                id="skillModal">

                <div class="modal">

                    <div class="modal-header">

                        <h2>
                            Add Skill
                        </h2>

                        <button
                            class="modal-close"
                            id="closeSkillModal">
                            ×
                        </button>

                    </div>


                    <div class="input-group">

                        <label>
                            Skill name
                        </label>

                        <input
                            type="text"
                            id="skillName"
                            class="input"
                            placeholder="e.g. JavaScript">

                    </div>


                    <div class="input-group">

                        <label>
                            Level
                        </label>

                        <select
                            id="skillLevel"
                            class="input">

                            <option value="Beginner">
                                Beginner
                            </option>

                            <option value="Intermediate">
                                Intermediate
                            </option>

                            <option value="Advanced">
                                Advanced
                            </option>

                        </select>

                    </div>


                    <div class="input-group">

                        <label>
                            Progress: <span id="skillProgressValue">0</span>%
                        </label>

                        <input
                            type="range"
                            id="skillProgress"
                            min="0"
                            max="100"
                            value="0"
                            style="width:100%;">

                    </div>


                    <button
                        class="btn btn-primary btn-full"
                        id="saveSkill">
                        Add Skill
                    </button>

                </div>

            </div>
        `;
    },


    /* =========================
       PROJECTS
    ========================= */

    projectsPage(user) {

        const projects = user.projects || [];

        return `

            <div class="page-header">

                <div>

                    <h1>Projects</h1>

                    <p>
                        Build projects and track your progress.
                    </p>

                </div>

                <button
                    class="btn btn-primary"
                    id="addProjectButton">
                    + Add Project
                </button>

            </div>


            ${
                projects.length
                ?
                `
                <div class="grid grid-3">

                    ${projects.map(project => `

                        <div class="card project-card">

                            <h3>
                                ${UI.escape(project.name)}
                            </h3>

                            <p class="project-description">
                                ${UI.escape(project.description || "")}
                            </p>

                            <div class="project-tags">

                                ${
                                    (project.technologies || [])
                                    .map(technology => `
                                        <span class="tag">
                                            ${UI.escape(technology)}
                                        </span>
                                    `)
                                    .join("")
                                }

                            </div>

                            <div class="project-progress">

                                <div class="project-progress-top">

                                    <span>
                                        Progress
                                    </span>

                                    <strong>
                                        ${project.progress}%
                                    </strong>

                                </div>

                                <div class="progress">

                                    <div
                                        class="progress-bar"
                                        style="width:${project.progress}%">
                                    </div>

                                </div>

                            </div>

                        </div>

                    `).join("")}

                </div>
                `
                :
                `
                <div class="card">

                    <div class="empty-state">

                        <div class="empty-icon">
                            ▣
                        </div>

                        <h3>
                            No projects yet
                        </h3>

                        <p>
                            Create your first project
                            and showcase what you build.
                        </p>

                        <button
                            class="btn btn-primary"
                            id="emptyAddProject">
                            Create Your First Project
                        </button>

                    </div>

                </div>
                `
            }


            <div
                class="modal-overlay"
                id="projectModal">

                <div class="modal">

                    <div class="modal-header">

                        <h2>
                            Add Project
                        </h2>

                        <button
                            class="modal-close"
                            id="closeProjectModal">
                            ×
                        </button>

                    </div>


                    <div class="input-group">

                        <label>
                            Project name
                        </label>

                        <input
                            type="text"
                            id="projectName"
                            class="input"
                            placeholder="e.g. Portfolio Website">

                    </div>


                    <div class="input-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            id="projectDescription"
                            class="input"
                            placeholder="Describe your project">
                        </textarea>

                    </div>


                    <div class="input-group">

                        <label>
                            Technologies
                        </label>

                        <input
                            type="text"
                            id="projectTechnologies"
                            class="input"
                            placeholder="React, CSS, Node.js">

                    </div>


                    <div class="input-group">

                        <label>
                            Progress: <span id="projectProgressValue">0</span>%
                        </label>

                        <input
                            type="range"
                            id="projectProgress"
                            min="0"
                            max="100"
                            value="0"
                            style="width:100%;">

                    </div>


                    <button
                        class="btn btn-primary btn-full"
                        id="saveProject">
                        Add Project
                    </button>

                </div>

            </div>
        `;
    },


    /* =========================
       PROFILE
    ========================= */

    profilePage(user) {

        const letter =
            user.name.charAt(0).toUpperCase();


        return `

            <div class="page-header">

                <div>

                    <h1>Profile</h1>

                    <p>
                        Manage your personal information.
                    </p>

                </div>

            </div>


            <div class="card">

                <div class="profile-header">

                    <div class="profile-avatar">
                        ${letter}
                    </div>

                    <div>

                        <div class="profile-name">
                            ${UI.escape(user.name)}
                        </div>

                        <div class="profile-role">
                            ${
                                user.profile.role
                                ? UI.escape(user.profile.role)
                                : "Add your role"
                            }
                        </div>

                    </div>

                </div>


                <div class="form-grid">

                    <div class="input-group">

                        <label>
                            Full name
                        </label>

                        <input
                            id="profileName"
                            class="input"
                            value="${UI.escape(user.name)}">

                    </div>


                    <div class="input-group">

                        <label>
                            Role
                        </label>

                        <input
                            id="profileRole"
                            class="input"
                            value="${UI.escape(user.profile.role)}"
                            placeholder="e.g. Frontend Developer">

                    </div>


                    <div class="input-group">

                        <label>
                            Location
                        </label>

                        <input
                            id="profileLocation"
                            class="input"
                            value="${UI.escape(user.profile.location)}"
                            placeholder="Your location">

                    </div>


                    <div class="input-group">

                        <label>
                            GitHub
                        </label>

                        <input
                            id="profileGithub"
                            class="input"
                            value="${UI.escape(user.profile.github)}"
                            placeholder="GitHub profile">

                    </div>


                    <div class="input-group">

                        <label>
                            LinkedIn
                        </label>

                        <input
                            id="profileLinkedin"
                            class="input"
                            value="${UI.escape(user.profile.linkedin)}"
                            placeholder="LinkedIn profile">

                    </div>


                    <div class="input-group full">

                        <label>
                            Bio
                        </label>

                        <textarea
                            id="profileBio"
                            class="input"
                            placeholder="Tell us about yourself">${UI.escape(user.profile.bio)}</textarea>

                    </div>

                </div>


                <button
                    class="btn btn-primary"
                    id="saveProfile">
                    Save Profile
                </button>

            </div>
        `;
    },


    /* =========================
       ACHIEVEMENTS
    ========================= */

    achievementsPage(user) {

        const achievements =
            user.achievements || [];


        return `

            <div class="page-header">

                <div>

                    <h1>Achievements</h1>

                    <p>
                        Your learning milestones and achievements.
                    </p>

                </div>

            </div>


            ${
                achievements.length
                ?
                `
                <div class="grid grid-3">

                    ${achievements.map(item => `

                        <div class="card achievement-card">

                            <div class="achievement-icon">
                                ★
                            </div>

                            <h3>
                                ${UI.escape(item.title)}
                            </h3>

                            <p>
                                ${UI.escape(item.description || "")}
                            </p>

                        </div>

                    `).join("")}

                </div>
                `
                :
                `
                <div class="card">

                    <div class="empty-state">

                        <div class="empty-icon">
                            ★
                        </div>

                        <h3>
                            No achievements yet
                        </h3>

                        <p>
                            Keep learning and completing
                            milestones. Your achievements
                            will appear here.
                        </p>

                    </div>

                </div>
                `
            }

        `;
    },


    /* =========================
       SETTINGS
    ========================= */

    settingsPage(user) {

        return `

            <div class="page-header">

                <div>

                    <h1>Settings</h1>

                    <p>
                        Manage your SkillFlow account.
                    </p>

                </div>

            </div>


            <div class="card settings-section">

                <h2>
                    Account
                </h2>

                <div class="setting-row">

                    <div class="setting-info">

                        <strong>
                            Email
                        </strong>

                        <span>
                            ${UI.escape(user.email)}
                        </span>

                    </div>

                </div>


                <div class="setting-row">

                    <div class="setting-info">

                        <strong>
                            Account status
                        </strong>

                        <span>
                            Active
                        </span>

                    </div>

                </div>

            </div>


            <div class="card settings-section">

                <h2>
                    Data
                </h2>

                <div class="setting-row">

                    <div class="setting-info">

                        <strong>
                            Your data
                        </strong>

                        <span>
                            Your frontend data is currently
                            stored locally in this browser.
                        </span>

                    </div>

                </div>

            </div>


            <div class="card settings-section">

                <h2>
                    Account actions
                </h2>

                <div class="setting-row">

                    <div class="setting-info">

                        <strong>
                            Logout
                        </strong>

                        <span>
                            Sign out from this device.
                        </span>

                    </div>

                    <button
                        class="btn btn-danger"
                        id="settingsLogout">
                        Logout
                    </button>

                </div>

            </div>

        `;
    },


    /* =========================
       EVENTS
    ========================= */

    bindLayoutEvents() {

        const menuButton =
            document.getElementById("menuButton");

        const sidebar =
            document.getElementById("sidebar");

        const overlay =
            document.getElementById("mobileOverlay");


        if (menuButton) {

            menuButton.addEventListener("click", () => {

                sidebar.classList.toggle("open");

                overlay.classList.toggle("show");

            });
        }


        if (overlay) {

            overlay.addEventListener("click", () => {

                sidebar.classList.remove("open");

                overlay.classList.remove("show");

            });
        }


        document
            .querySelectorAll(".nav-link")
            .forEach(link => {

                link.addEventListener("click", () => {

                    sidebar.classList.remove("open");

                    overlay.classList.remove("show");

                });

            });


        const logout =
            document.getElementById("logoutButton");

        if (logout) {

            logout.addEventListener(
                "click",
                () => Auth.logout()
            );

        }
    },


    highlightNavigation(page) {

        document
            .querySelectorAll(".nav-link")
            .forEach(link => {

                link.classList.remove("active");

                if (
                    link.dataset.page === page
                ) {
                    link.classList.add("active");
                }

            });
    },


    bindPageEvents(page) {

        if (page === "skills") {
            this.bindSkillEvents();
        }

        if (page === "projects") {
            this.bindProjectEvents();
        }

        if (page === "profile") {
            this.bindProfileEvents();
        }

        if (page === "settings") {

            const logout =
                document.getElementById("settingsLogout");

            if (logout) {
                logout.addEventListener(
                    "click",
                    () => Auth.logout()
                );
            }
        }
    },


    /* =========================
       SKILL EVENTS
    ========================= */

    bindSkillEvents() {

        const modal =
            document.getElementById("skillModal");

        const openButtons = [
            document.getElementById("addSkillButton"),
            document.getElementById("emptyAddSkill")
        ];


        openButtons.forEach(button => {

            if (button) {

                button.addEventListener(
                    "click",
                    () => modal.classList.add("show")
                );

            }

        });


        const close =
            document.getElementById("closeSkillModal");

        if (close) {

            close.addEventListener(
                "click",
                () => modal.classList.remove("show")
            );
        }


        const progress =
            document.getElementById("skillProgress");

        const progressValue =
            document.getElementById("skillProgressValue");


        if (progress) {

            progress.addEventListener(
                "input",
                () => {

                    progressValue.textContent =
                        progress.value;

                }
            );
        }


        const save =
            document.getElementById("saveSkill");


        if (save) {

            save.addEventListener(
                "click",
                () => this.saveSkill()
            );
        }
    },


    saveSkill() {

        const name =
            document.getElementById("skillName")
                .value
                .trim();

        const level =
            document.getElementById("skillLevel")
                .value;

        const progress =
            Number(
                document.getElementById("skillProgress")
                    .value
            );


        if (!name) {

            alert("Please enter a skill name.");

            return;
        }


        const user = Auth.getUser();

        user.skills.push({

            id: crypto.randomUUID(),

            name: name,

            level: level,

            progress: progress

        });


        Storage.updateUser(user);

        Router.navigate("skills");
    },


    /* =========================
       PROJECT EVENTS
    ========================= */

    bindProjectEvents() {

        const modal =
            document.getElementById("projectModal");

        const openButtons = [
            document.getElementById("addProjectButton"),
            document.getElementById("emptyAddProject")
        ];


        openButtons.forEach(button => {

            if (button) {

                button.addEventListener(
                    "click",
                    () => modal.classList.add("show")
                );

            }

        });


        const close =
            document.getElementById("closeProjectModal");

        if (close) {

            close.addEventListener(
                "click",
                () => modal.classList.remove("show")
            );

        }


        const progress =
            document.getElementById("projectProgress");

        const progressValue =
            document.getElementById("projectProgressValue");


        if (progress) {

            progress.addEventListener(
                "input",
                () => {

                    progressValue.textContent =
                        progress.value;

                }
            );
        }


        const save =
            document.getElementById("saveProject");


        if (save) {

            save.addEventListener(
                "click",
                () => this.saveProject()
            );
        }
    },


    saveProject() {

        const name =
            document.getElementById("projectName")
                .value
                .trim();

        const description =
            document.getElementById("projectDescription")
                .value
                .trim();

        const technologyInput =
            document.getElementById("projectTechnologies")
                .value
                .trim();

        const progress =
            Number(
                document.getElementById("projectProgress")
                    .value
            );


        if (!name) {

            alert("Please enter a project name.");

            return;
        }


        const technologies =
            technologyInput
                ? technologyInput
                    .split(",")
                    .map(item => item.trim())
                    .filter(Boolean)
                : [];


        const user = Auth.getUser();


        user.projects.push({

            id: crypto.randomUUID(),

            name: name,

            description: description,

            technologies: technologies,

            progress: progress

        });


        Storage.updateUser(user);

        Router.navigate("projects");
    },


    /* =========================
       PROFILE EVENTS
    ========================= */

    bindProfileEvents() {

        const save =
            document.getElementById("saveProfile");


        if (!save) {
            return;
        }


        save.addEventListener(
            "click",
            () => {

                const user = Auth.getUser();


                user.name =
                    document
                        .getElementById("profileName")
                        .value
                        .trim();


                user.profile.role =
                    document
                        .getElementById("profileRole")
                        .value
                        .trim();


                user.profile.location =
                    document
                        .getElementById("profileLocation")
                        .value
                        .trim();


                user.profile.github =
                    document
                        .getElementById("profileGithub")
                        .value
                        .trim();


                user.profile.linkedin =
                    document
                        .getElementById("profileLinkedin")
                        .value
                        .trim();


                user.profile.bio =
                    document
                        .getElementById("profileBio")
                        .value
                        .trim();


                if (!user.name) {

                    alert("Name cannot be empty.");

                    return;
                }


                Storage.updateUser(user);

                alert("Profile updated successfully.");

                this.render();
            }
        );
    },


    /* =========================
       PROGRESS
    ========================= */

    calculateOverallProgress(user) {

        const skills = user.skills || [];
        const projects = user.projects || [];


        const skillProgress =
            skills.length
            ?
            skills.reduce(
                (sum, skill) =>
                    sum + Number(skill.progress || 0),
                0
            ) / skills.length
            :
            0;


        const projectProgress =
            projects.length
            ?
            projects.reduce(
                (sum, project) =>
                    sum + Number(project.progress || 0),
                0
            ) / projects.length
            :
            0;


        if (!skills.length && !projects.length) {
            return 0;
        }


        if (!skills.length) {
            return Math.round(projectProgress);
        }


        if (!projects.length) {
            return Math.round(skillProgress);
        }


        return Math.round(
            (skillProgress + projectProgress) / 2
        );
    }
};


document.addEventListener(
    "DOMContentLoaded",
    () => App.init()
);