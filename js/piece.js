var ENQUIRY_EMAIL = "hilmarsnaer05@gmail.com";

var id = window.PIECE_ID || new URLSearchParams(location.search).get("id");
var work = WORKS.find(function (w) { return w.id === id; }) || WORKS[0];

document.title = work.title + " — Hilmar Isdal";

document.getElementById("piece").innerHTML =
  '<figure class="piece-image">' +
    '<img src="/' + work.image + '" width="' + work.w + '" height="' + work.h + '" alt="' + work.title + ' — ' + work.medium + '">' +
  '</figure>' +
  '<div class="piece-info">' +
    '<h1>' + work.title + '</h1>' +
    '<div class="meta">' + work.year + ' — ' + work.medium + '</div>' +
    '<div class="meta">' + work.size + '</div>' +
    '<p class="description">' + work.description + '</p>' +
    '<section class="enquiry">' +
      '<h2>Enquire about this piece</h2>' +
      '<form id="enquiry-form">' +
        '<label>Name' +
          '<input type="text" name="name" required autocomplete="name">' +
        '</label>' +
        '<label>Email' +
          '<input type="email" name="email" required autocomplete="email">' +
        '</label>' +
        '<label>Why do you want this?' +
          '<textarea name="why" required></textarea>' +
        '</label>' +
        '<button type="submit" id="enquiry-send">Send Enquiry</button>' +
      '</form>' +
      '<p class="sent" id="sent">Thank you — your enquiry has been sent.</p>' +
      '<p class="sent" id="send-error">Something went wrong — please email <a href="mailto:' + ENQUIRY_EMAIL + '">' + ENQUIRY_EMAIL + '</a> directly.</p>' +
    '</section>' +
    '<a class="back-link" href="/">&larr; All works</a>' +
  '</div>';

document.getElementById("enquiry-form").addEventListener("submit", function (e) {
  e.preventDefault();
  var f = e.target;
  var button = document.getElementById("enquiry-send");
  var sent = document.getElementById("sent");
  var error = document.getElementById("send-error");

  button.disabled = true;
  button.textContent = "Sending…";
  sent.style.display = "none";
  error.style.display = "none";

  fetch("https://formsubmit.co/ajax/" + ENQUIRY_EMAIL, {
    method: "POST",
    headers: { "Content-Type": "application/json", "Accept": "application/json" },
    body: JSON.stringify({
      _subject: "Enquiry: " + work.title + " (" + work.year + ")",
      _template: "table",
      _captcha: "false",
      piece: work.title + ", " + work.year + " — " + work.medium,
      name: f.name.value,
      email: f.email.value,
      why: f.why.value
    })
  })
    .then(function (res) {
      if (!res.ok) throw new Error("send failed");
      return res.json();
    })
    .then(function (data) {
      if (String(data.success) !== "true") throw new Error("send failed");
      f.reset();
      f.style.display = "none";
      sent.style.display = "block";
    })
    .catch(function () {
      error.style.display = "block";
    })
    .finally(function () {
      button.disabled = false;
      button.textContent = "Send Enquiry";
    });
});
