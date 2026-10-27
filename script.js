
const API_URL = `${window.location.origin}/api`;

// ==========================================
// BlogSpace - Main JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
    console.log("BlogSpace application loaded successfully!");

    // Highlight active navigation link
    const currentPage = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a, .nav-menu a").forEach(function (link) {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    // Registration form
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
        registerForm.addEventListener("submit", handleRegistration);
    }

    // Login form
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
        loginForm.addEventListener("submit", handleLogin);
    }

    // Create blog form
    const createBlogForm = document.getElementById("createBlogForm");
    if (createBlogForm) {
        createBlogForm.addEventListener("submit", handleCreateBlog);
    }

    // Display blogs if a blog list exists
    if (document.getElementById("blogList")) {
        loadBlogs();
    }
});

// ==========================================
// Show Message
// ==========================================

function showMessage(message, type = "info") {
    let box = document.getElementById("app-message");

    if (!box) {
        box = document.createElement("div");
        box.id = "app-message";
        box.setAttribute("role", "status");
        box.setAttribute("aria-live", "polite");

        const form = document.querySelector("form");

        if (form) {
            form.before(box);
        } else {
            document.body.prepend(box);
        }
    }

    box.textContent = message;
    box.className = "app-message " + type;
    box.style.display = "block";
}

// ==========================================
// Registration
// ==========================================

async function handleRegistration(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const name = form.querySelector('[name="name"]')?.value.trim();
    const email = form.querySelector('[name="email"]')?.value.trim();
    const password = form.querySelector('[name="password"]')?.value;

    if (!name || !email || !password) {
        showMessage("Please fill in all fields.", "error");
        return;
    }

    const button = form.querySelector('button[type="submit"]');

    if (button) button.disabled = true;

    try {
        const response = await fetch(`${API_URL}/register`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Registration failed.", "error");
            return;
        }

        showMessage("Registration successful! Redirecting to login...", "success");
        form.reset();

        setTimeout(function () {
            window.location.href = "login.html";
        }, 1000);

    } catch (error) {
        console.error("Registration error:", error);
        showMessage("Cannot connect to backend. Please check whether the server is running.", "error");
    } finally {
        if (button) button.disabled = false;
    }
}

// ==========================================
// Login
// ==========================================

async function handleLogin(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const email = form.querySelector('[name="email"]')?.value.trim();
    const password = form.querySelector('[name="password"]')?.value;
    const button = form.querySelector('button[type="submit"]');

    if (!email || !password) {
        showMessage("Please enter your email and password.", "error");
        return;
    }

    if (button) button.disabled = true;

    try {
        const response = await fetch(`${API_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Login failed.", "error");
            return;
        }

        localStorage.removeItem("blogspace_currentUser");
        localStorage.removeItem("blogspace_user");

        showMessage("Login successful! Opening dashboard...", "success");
        window.location.href = "dashboard.html";

    } catch (error) {
        console.error("Login error:", error);
        showMessage("Cannot connect to backend. Please check whether the server is running.", "error");
    } finally {
        if (button) button.disabled = false;
    }
}

// ==========================================
// Create Blog
// ==========================================

async function handleCreateBlog(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const title = form.querySelector('[name="title"]')?.value.trim();
    const content = form.querySelector('[name="content"]')?.value.trim();
    const category =
        form.querySelector('[name="category"]')?.value.trim() || "General";

    try {
        const authResponse = await fetch(`${API_URL}/auth/me`, {
            credentials: "include"
        });

        if (authResponse.status === 401) {
            showMessage("Please log in before creating a blog.", "error");
            setTimeout(function () {
                window.location.href = "login.html";
            }, 1000);
            return;
        }

        const authData = await authResponse.json();
        if (!authResponse.ok || !authData.user) {
            throw new Error(authData.message || "Unable to verify your account.");
        }
    } catch (error) {
        console.error("Create blog authentication error:", error);
        showMessage(error.message || "Unable to verify your account.", "error");
        return;
    }

    if (!title || !content) {
        showMessage("Please enter a title and content.", "error");
        return;
    }

    const button = form.querySelector('button[type="submit"]');
    if (button) button.disabled = true;

    try {
        const response = await fetch(`${API_URL}/blogs`, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title,
                category,
                content
            })
        });

        const data = await response.json();

        if (!response.ok) {
            showMessage(data.message || "Could not create blog.", "error");
            return;
        }

        showMessage("Blog created successfully!", "success");
        form.reset();

        setTimeout(function () {
            window.location.href = "dashboard.html";
        }, 1000);

    } catch (error) {
        console.error("Create blog error:", error);
        showMessage("Cannot connect to backend. Please check whether the server is running.", "error");
    } finally {
        if (button) button.disabled = false;
    }
}

// ==========================================
// Load Blogs
// ==========================================

async function loadBlogs() {
    const blogList = document.getElementById("blogList");
    if (!blogList) return;

    try {
        const response = await fetch(`${API_URL}/blogs`, {
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Could not fetch blogs.");
        }

        const blogs = await response.json();
        blogList.replaceChildren();

        if (!Array.isArray(blogs) || blogs.length === 0) {
            blogList.textContent = "No blogs yet. Be the first to create one!";
            return;
        }

        blogs.forEach(function (blog) {
            const article = document.createElement("article");
            const title = document.createElement("h3");
            const content = document.createElement("p");
            const author = document.createElement("small");

            title.textContent = blog.title || "Untitled Blog";
            content.textContent = blog.content || "";
            author.textContent = "By " + (blog.author || "Anonymous");

            article.append(title, content, author);

            // MongoDB ID
            const blogId = blog._id || blog.id;

            if (blogId) {
                article.dataset.blogId = blogId;

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.type = "button";

                deleteButton.addEventListener("click", function () {
                    deleteBlog(blogId, article, deleteButton);
                });

                article.appendChild(deleteButton);
            } else {
                console.warn("Blog has no ID:", blog);
            }

            blogList.appendChild(article);
        });

    } catch (error) {
        console.error("Load blogs error:", error);
        blogList.textContent = "Unable to load blogs. Please try again.";
    }
}

// ==========================================
// Delete Blog
// ==========================================

async function deleteBlog(blogId, article, button) {
    if (!blogId) {
        showMessage("This blog has no ID and cannot be deleted.", "error");
        return;
    }

    if (!window.confirm("Are you sure you want to delete this blog?")) {
        return;
    }

    button.disabled = true;

    try {
        const response = await fetch(
            `${API_URL}/blogs/${encodeURIComponent(blogId)}`,
            { method: "DELETE", credentials: "include" }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Could not delete blog.");
        }

        article.remove();
        showMessage("Blog deleted successfully!", "success");

        const blogList = document.getElementById("blogList");

        if (blogList && !blogList.querySelector("article")) {
            blogList.textContent = "No blogs yet. Be the first to create one!";
        }

    } catch (error) {
        console.error("Delete blog error:", error);
        showMessage(error.message || "Could not delete blog.", "error");
        button.disabled = false;
    }
}
