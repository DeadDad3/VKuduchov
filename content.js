let muteConfig = [];

function getCurrentConvoId() {
  const match = window.location.pathname.match(/\/im\/convo\/(\d+)/);
  return match ? match[1] : null;
}

function extractVkId(input) {
  // Превращаем ссылку вида https://vk.com/xxx в просто xxx
  if (input.startsWith("https://vk.com/")) {
    return input.replace("https://vk.com/", "").split(/[/?#]/)[0];
  }
  return input;
}

function isTargetForMute(senderName, senderId, convoId) {
  return muteConfig.some(entry => {
    const expectedId = extractVkId(entry.userId || "");
    const matchesName = entry.name && entry.name === senderName;
    const matchesId = entry.userId ? expectedId === senderId : true;
    const matchesConvo = entry.allConvos || (entry.convoIds?.split(',').map(id => id.trim()).includes(convoId));
    return matchesName && matchesId && matchesConvo;
  });
}

function hideMessages() {
  const convoId = getCurrentConvoId();
  if (!convoId || convoId.length < 7) return; // Пропускаем личку

  const wrappers = document.querySelectorAll(".ConvoHistory__messageWrapper");
  let lastMessageWasMuted = false;

  wrappers.forEach(wrapper => {
    const nameElem = wrapper.querySelector(".PeerTitle__title");
    const senderName = nameElem?.innerText.trim();

    const avatarElem = wrapper.querySelector('a[href^="/"][href*="/"]');
    const senderId = avatarElem?.getAttribute("href")?.substring(1); // убираем "/"

    const shouldMute = senderName && isTargetForMute(senderName, senderId, convoId);

    if (shouldMute || (!nameElem && lastMessageWasMuted)) {
      wrapper.style.display = "none";
      lastMessageWasMuted = true;
    } else {
      lastMessageWasMuted = false;
    }
  });
}

// Загружаем настройки и запускаем мут
chrome.storage.local.get("vkSimpleMuter", result => {
  muteConfig = result.vkSimpleMuter || [];
  setInterval(hideMessages, 1000);
});