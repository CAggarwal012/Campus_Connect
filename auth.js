const SESSION_KEY = "campusConnectSession";
const ACTIVITY_KEY = "campusConnectActivity";

// Keep a small JSON activity log. Passwords are never added to it.
function saveActivity(action, email) {
  const savedActivity = localStorage.getItem(ACTIVITY_KEY);
  const activity = savedActivity ? JSON.parse(savedActivity) : [];

  if (!Array.isArray(activity)) {
    throw new Error("The saved activity log is not a list.");
  }

  const entry = {
    action: action,
    email: email,
    time: new Date().toISOString()
  };

  activity.push(entry);
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity.slice(-20)));
  console.log("CampusConnect activity (passwords are not stored):");
  console.log(JSON.stringify(entry, null, 2));
}

function getCurrentUser() {
  const savedSession = localStorage.getItem(SESSION_KEY);
  const session = savedSession ? JSON.parse(savedSession) : null;

  if (session && typeof session.email === "string") {
    return session;
  }

  return null;
}

function updateAccountLink() {
  const accountLink = document.querySelector("[data-auth-link]");

  if (!accountLink) {
    return;
  }

  let user;

  try {
    user = getCurrentUser();
  } catch (error) {
    console.error("Could not read the demo session.", error);
    return;
  }

  if (user) {
    accountLink.href = "../auth/logout.html";
    accountLink.textContent = "Log out";
  } else {
    accountLink.href = "../auth/login.html";
    accountLink.textContent = "Log in";
  }
}

function handleLogin() {
  const form = document.querySelector("#login-form");

  if (!form) {
    return;
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector("#email").value.trim();
    const password = document.querySelector("#password").value;
    const message = document.querySelector("#login-message");

    if (!email || !password) {
      message.textContent = "Please enter your email and password.";
      return;
    }

    try {
      saveActivity("login", email);
      localStorage.setItem(SESSION_KEY, JSON.stringify({
        email: email,
        loggedInAt: new Date().toISOString()
      }));
      window.location.href = "../index/index.html";
    } catch (error) {
      console.error("Could not save the demo login.", error);
      message.textContent = "Could not save your demo login. Check that browser storage is enabled.";
    }
  });
}

function handleLogout() {
  const button = document.querySelector("#logout-button");

  if (!button) {
    return;
  }

  button.addEventListener("click", function () {
    const message = document.querySelector("#logout-message");

    try {
      const user = getCurrentUser();

      if (!user) {
        message.textContent = "You are already logged out.";
        button.disabled = true;
        return;
      }

      saveActivity("logout", user.email);
      localStorage.removeItem(SESSION_KEY);
      message.textContent = "You are logged out. Your activity log stays in this browser.";
      button.disabled = true;
      updateAccountLink();
    } catch (error) {
      console.error("Could not log out of the demo.", error);
      message.textContent = "Could not finish logging out. Check that browser storage is enabled.";
    }
  });
}

updateAccountLink();
handleLogin();
handleLogout();
