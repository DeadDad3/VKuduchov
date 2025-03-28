const mutedNames = [
  "Андрей Бутербродов",
  "Вотан Всемогущий",
  "Генератор цитат"
];

const targetConvoIds = ["2000000218"];

function isTargetChat() {
  const match = window.location.pathname.match(/\/im\/convo\/(\d+)/);
  return match && targetConvoIds.includes(match[1]);
}

function hideMessages() {
  if (!isTargetChat()) return;

  const wrappers = document.querySelectorAll(".ConvoHistory__messageWrapper");
  let lastMessageWasMuted = false;

  wrappers.forEach(wrapper => {
    const senderNameElem = wrapper.querySelector(".PeerTitle__title");
    const senderName = senderNameElem?.innerText.trim();

    const isMuted = senderName && mutedNames.includes(senderName);

    if (isMuted || (!senderNameElem && lastMessageWasMuted)) {
      wrapper.style.display = "none";
      lastMessageWasMuted = true;
    } else {
      lastMessageWasMuted = false;
    }
  });
}

setInterval(hideMessages, 1000);