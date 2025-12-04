// Admin password
const ADMIN_PASSWORD = "admin123";
let isAdmin = false;
let db = null;

// Replace the values below with your Firebase project's config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  // ...other config values...
};

// Initialize Firebase and Firestore
try {
  firebase.initializeApp(firebaseConfig);
  db = firebase.firestore();
} catch (e) {
  console.error("Firebase init error:", e);
  alert("Firebase not configured. Replace firebaseConfig in script.js with your project config.");
}

// Helpers
function escapeHtml(str){
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// Send message
function send(){
  if (!db) return alert("Database not initialized.");
  let text = document.getElementById("msg").value.trim();
  if(text === "") return alert("Type something!");

  db.collection("feedback").add({
    msg: text,
    time: new Date()
  }).catch(err => {
    console.error("Write failed:", err);
    alert("Failed to send message.");
  });

  document.getElementById("msg").value = "";
}

// Live load messages for all users
if (db) {
  db.collection("feedback").orderBy("time","desc")
    .onSnapshot(snapshot=>{
      let html="";
      snapshot.forEach(doc=>{
        html += `<p>${escapeHtml(doc.data().msg)}</p>`;
      });
      document.getElementById("all").innerHTML = html;
    }, err => console.error("Snapshot error:", err));
}

// Admin login
function adminLogin(){
  let pass = document.getElementById("adminPass").value;
  document.getElementById("adminPass").value = "";
  if(pass === ADMIN_PASSWORD){
    isAdmin = true;
    alert("Admin logged in!");
    loadAdminMessages();
  } else {
    alert("Wrong password!");
  }
}

// Load messages for admin with delete button
function loadAdminMessages(){
  if (!db) return alert("Database not initialized.");
  db.collection("feedback").orderBy("time","desc")
  .onSnapshot(snapshot=>{
     let html="";
     snapshot.forEach(doc=>{
       html += `<p>${escapeHtml(doc.data().msg)}
       <button onclick="deleteMsg('${doc.id}')">Delete</button></p>`;
     });
     document.getElementById("adminMessages").innerHTML = html;
  }, err => console.error("Admin snapshot error:", err));
}

// Delete message
function deleteMsg(id){
  if(!isAdmin) return alert("Not admin!");
  db.collection("feedback").doc(id).delete()
    .catch(err => {
      console.error("Delete failed:", err);
      alert("Failed to delete.");
    });
}

// Wire up buttons after DOM loads
window.addEventListener('DOMContentLoaded', () => {
  document.getElementById("sendBtn").addEventListener("click", send);
  document.getElementById("adminLoginBtn").addEventListener("click", adminLogin);
});