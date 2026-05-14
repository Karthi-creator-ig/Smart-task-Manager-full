const API = "http://localhost:5000";

/* =========================
   SIDEBAR NAVIGATION (UPDATED)
========================= */
// This function actually hides/shows sections instead of scrolling
window.showSection = function(sectionId) {
    // 1. Array of all your section IDs
    const allSections = [
        'dashboardSection', 
        'taskSection', 
        'analyticsSection', 
        'calendarSection'
    ];

    // 2. Hide all sections first
    allSections.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            section.style.display = "none";
        }
    });

    // 3. Show only the clicked section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = "block";
    }
};

// Initialize by showing ONLY the Dashboard when the page loads
window.showSection('dashboardSection');


/* =========================
   REGISTER
========================= */
const registerBtn = document.getElementById("registerBtn");
if (registerBtn) {
    registerBtn.addEventListener("click", async () => {
        const username = document.getElementById("registerUsername").value;
        const password = document.getElementById("registerPassword").value;

        if (username === "" || password === "") {
            alert("Fill all fields");
            return;
        }

        try {
            const response = await fetch(`${API}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            alert(data.message);

            if (data.success) {
                window.location.href = "login.html";
            }
        } catch (error) {
            console.error("Registration error:", error);
        }
    });
}

/* =========================
   LOGIN
========================= */
const loginBtn = document.getElementById("loginBtn");
if (loginBtn) {
    loginBtn.addEventListener("click", async () => {
        const username = document.getElementById("loginUsername").value;
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(`${API}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem("username", username);
                window.location.href = "dashboard.html";
            } else {
                alert("Invalid Login");
            }
        } catch (error) {
            console.error("Login error:", error);
        }
    });
}

/* =========================
   DASHBOARD GLOBALS
========================= */
const username = localStorage.getItem("username");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closeModal");
const taskModal = document.getElementById("taskModal");

/* OPEN MODAL */
if (openModal) {
    openModal.addEventListener("click", () => {
        taskModal.style.display = "flex";
    });
}

/* CLOSE MODAL */
if (closeModal) {
    closeModal.addEventListener("click", () => {
        taskModal.style.display = "none";
    });
}

/* =========================
   SAVE TASK
========================= */
const saveTask = document.getElementById("saveTask");
if (saveTask) {
    saveTask.addEventListener("click", async () => {
        const title = document.getElementById("taskTitle").value;
        const description = document.getElementById("taskDescription").value;
        const priority = document.getElementById("taskPriority").value;
        const due_date = document.getElementById("taskDate").value;

        if (title === "") {
            alert("Enter Task Title");
            return;
        }

        try {
            const response = await fetch(`${API}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    description,
                    priority,
                    due_date,
                    status: "Pending",
                    username
                })
            });

            const data = await response.json();

            if (data.success) {
                alert("Task Added");
                taskModal.style.display = "none";
                
                // Clear form inputs
                document.getElementById("taskTitle").value = "";
                document.getElementById("taskDescription").value = "";
                document.getElementById("taskDate").value = "";
                
                loadTasks();
            } else {
                alert("Task Not Added");
            }
        } catch (error) {
            console.error("Error saving task:", error);
        }
    });
}

/* =========================
   LOAD TASKS & ANALYTICS
========================= */
async function loadTasks() {
    if (!username) return;

    try {
        const response = await fetch(`${API}/tasks/${username}`);
        const tasks = await response.json();

        const taskContainer = document.getElementById("taskContainer");
        if (!taskContainer) return;

        taskContainer.innerHTML = "";

        /* UPDATE ANALYTICS CARDS */
        const totalEl = document.getElementById("totalTasks");
        const compEl = document.getElementById("completedTasks");
        const pendEl = document.getElementById("pendingTasks");

        if (totalEl) totalEl.innerText = tasks.length;
        if (compEl) compEl.innerText = tasks.filter(task => task.status === "Completed").length;
        if (pendEl) pendEl.innerText = tasks.filter(task => task.status === "Pending").length;

        /* RENDER TASKS */
        tasks.forEach(task => {
            const div = document.createElement("div");
            div.className = "task-card";
            div.innerHTML = `
                <h3>${task.title}</h3>
                <p>${task.description}</p>
                <p><strong>Priority:</strong> ${task.priority}</p>
                <p><strong>Status:</strong> ${task.status}</p>
                <p><strong>Due Date:</strong> ${new Date(task.due_date).toLocaleDateString()}</p>
                
                <div class="task-buttons" style="margin-top: 15px;">
                    ${task.status !== "Completed" ? 
                        `<button class="btn" style="background:var(--success);" onclick="updateTask(${task.id})">Complete</button>` 
                        : ''}
                    <button class="btn danger" style="background:var(--danger);" onclick="deleteTask(${task.id})">Delete</button>
                </div>
            `;
            taskContainer.appendChild(div);
        });

    } catch (error) {
        console.error("Error loading tasks:", error);
    }
}

/* =========================
   COMPLETE TASK
========================= */
window.updateTask = async function(id) {
    try {
        await fetch(`${API}/tasks/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status: "Completed" })
        });
        loadTasks();
    } catch (error) {
        console.error("Error updating task:", error);
    }
};

/* =========================
   DELETE TASK
========================= */
window.deleteTask = async function(id) {
    if(confirm("Are you sure you want to delete this task?")) {
        try {
            await fetch(`${API}/tasks/${id}`, { method: "DELETE" });
            loadTasks();
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }
};

/* =========================
   CALENDAR INIT
========================= */
const todayDate = document.getElementById("todayDate");
if (todayDate) {
    const today = new Date();
    todayDate.innerText = today.toDateString();
}

/* =========================
   LOGOUT
========================= */
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("username");
        window.location.href = "login.html";
    });
}

/* INITIAL LOAD */
if (window.location.pathname.includes('dashboard.html')) {
    loadTasks();
}