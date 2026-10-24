// ==========================================
// BlogSpace - Main JavaScript
// ==========================================

document.addEventListener("DOMContentLoaded", function () {
console.log("BlogSpace application loaded successfully!");

// Highlight the current navigation link
const navLinks = document.querySelectorAll(".nav-links a");

navLinks.forEach(function (link) {
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const linkPage = link.getAttribute("href");

    if (linkPage === currentPage) {
        link.classList.add("active");
    }
});

// Smooth scrolling for links that point to sections on the same page
const sectionLinks = document.querySelectorAll('a[href^="#"]');

sectionLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        const targetId = link.getAttribute("href");

        if (targetId && targetId.length > 1) {
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                event.preventDefault();

                targetElement.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        }
    });
});

// Show a friendly message when a placeholder link is clicked
const readLinks = document.querySelectorAll(".read-link");

readLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
        if (link.getAttribute("href") === "#") {
            event.preventDefault();
            alert("This story will be available soon!");
        }
    });
});

});

// ==========================================
// Utility: Save and retrieve blog posts
// ==========================================

function getBlogPosts() {
try {
return JSON.parse(localStorage.getItem("blogspace_posts")) || [];
} catch (error) {
console.error("Could not load blog posts:", error);
return [];
}
}

function saveBlogPost(post) {
if (!post || !post.title || !post.content) {
console.error("A blog post requires a title and content.");
return false;
}

const posts = getBlogPosts();

const newPost = {
    id: Date.now(),
    title: post.title.trim(),
    content: post.content.trim(),
    category: (post.category || "General").trim(),
    author: (post.author || "BlogSpace User").trim(),
    createdAt: new Date().toISOString()
};

posts.unshift(newPost);

try {
    localStorage.setItem("blogspace_posts", JSON.stringify(posts));
    return true;
} catch (error) {
    console.error("Could not save the blog post:", error);
    return false;
}

}

// ==========================================
// Utility: Display a message on the page
// ==========================================

function showMessage(message, type) {
let messageBox = document.getElementById("app-message");

if (!messageBox) {
    messageBox = document.createElement("div");
    messageBox.id = "app-message";
    messageBox.setAttribute("role", "status");
    messageBox.setAttribute("aria-live", "polite");

    document.body.appendChild(messageBox);
}

messageBox.textContent = message;
messageBox.className = "app-message " + (type || "info");
messageBox.style.display = "block";

window.setTimeout(function () {
    messageBox.style.display = "none";
}, 3500);

}