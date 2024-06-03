// export function setEmail(email) {
//   window.userEmail = email; // Store email in the global scope
//   console.log("Email address entered:", email);
// }
// document.addEventListener("DOMContentLoaded", function () {
//   document
//     .getElementById("loginForm")
//     .addEventListener("submit", function (event) {
//       var email = document.getElementById("email").value;
//       setEmail(email);
//       console.log("Email address entered:", email);
//     });
// });

// login.js
let userEmail = ""; // Variable to store email

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("loginForm")
    .addEventListener("submit", function (event) {
      var email = document.getElementById("email").value;
      userEmail = email; // Assign the value to userEmail
      console.log("Email address entered:", email);
    });
});

export { userEmail }; // Exporting the userEmail variable
