const WEDDING = {
  groom: "حامد شجاع",
  bride: "ماهگل زمانی",
  date: "",
  time: "",
  datetime: "",
  venue: "",
  address: "",
  mapGoogleUrl: "",
  mapBaladUrl: "",
  mapNeshanUrl: "",
  images: [
    "assets/images/image-1.jpg",
    "assets/images/image-2.jpg",
    "assets/images/image-3.jpg"
  ]
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

function applyConfig() {
  $("#date").textContent = WEDDING.date || "تاریخ به‌زودی اعلام می‌شود";
  $("#time").textContent = WEDDING.time || "ساعت به‌زودی اعلام می‌شود";
  $("#venue").textContent = WEDDING.venue || "نام محل برگزاری";
  $("#address").textContent = WEDDING.address || "آدرس محل برگزاری پس از تکمیل اطلاعات نمایش داده می‌شود.";

  const maps = [
    ["#mapGoogle", WEDDING.mapGoogleUrl],
    ["#mapBalad", WEDDING.mapBaladUrl],
    ["#mapNeshan", WEDDING.mapNeshanUrl]
  ];
  let mapCount = 0;
  maps.forEach(([selector, url]) => {
    const button = $(selector);
    if (!url) return;
    button.href = url;
    button.hidden = false;
    mapCount++;
  });
  $("#map-links").hidden = mapCount === 0;

  $$("[data-photo]").forEach(el => {
    const src = WEDDING.images[Number(el.dataset.photo)];
    if (!src) return;
    el.style.backgroundImage = `url("${src}")`;
    el.classList.add("has-image");
  });
}

function setupCountdown() {
  const countdown = $("#countdown");
  const section = $("#countdown-section");
  if (!WEDDING.datetime) {
    section.hidden = true;
    return;
  }

  const target = new Date(WEDDING.datetime);
  if (Number.isNaN(target.getTime())) {
    section.hidden = true;
    return;
  }

  countdown.hidden = false;

  function update() {
    const difference = Math.max(0, target.getTime() - Date.now());
    const total = Math.floor(difference / 1000);
    $("#days").textContent = String(Math.floor(total / 86400)).padStart(2, "0");
    $("#hours").textContent = String(Math.floor((total % 86400) / 3600)).padStart(2, "0");
    $("#minutes").textContent = String(Math.floor((total % 3600) / 60)).padStart(2, "0");
    $("#seconds").textContent = String(total % 60).padStart(2, "0");
  }

  update();
  setInterval(update, 1000);
}

function setupReveal() {
  const items = $$(".reveal");
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach(el => el.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.12 });

  items.forEach(el => observer.observe(el));
}

function openInvitation() {
  const envelope = $("#envelope");
  const opening = $("#opening");
  const invitation = $("#invitation");
  if (envelope.classList.contains("opened")) return;

  envelope.classList.add("opened");

  setTimeout(() => {
    invitation.classList.add("is-visible");
    invitation.setAttribute("aria-hidden", "false");
  }, 700);

  setTimeout(() => {
    opening.classList.add("is-hidden");
    document.body.style.overflowY = "auto";
    setupReveal();
  }, 1650);
}

applyConfig();
setupCountdown();
$("#envelope").addEventListener("click", openInvitation);
document.body.style.overflowY = "hidden";
