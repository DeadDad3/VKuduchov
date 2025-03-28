function createMuterPanel(data = {}) {
    const panel = document.createElement('div');
    panel.className = 'muter-panel';
  
    panel.innerHTML = `
      <button class="remove-btn">×</button>
      <label>Имя:
        <input type="text" class="muter-name" value="${data.name || ''}">
      </label>
      <label>Ссылка на страницу того, кто в муте:
        <input type="text" class="muter-id" value="${data.userId || ''}">
      </label>
      <div class="checkbox-container">
        <input type="checkbox" class="all-convos" ${data.allConvos ? 'checked' : ''}>
        <label>Работать во всех беседах</label>
      </div>
      <label>ID бесед (через запятую):
        <input type="text" class="convo-ids" value="${data.convoIds || ''}" ${data.allConvos ? 'disabled' : ''}>
      </label>
    `;
  
    panel.querySelector('.remove-btn').addEventListener('click', () => {
      panel.remove();
      const container = document.getElementById('muter-list');
      if (container.children.length === 0) {
        addMuterPanel(); // хотя бы одна панель должна быть
      }
      saveAll();
    });
  
    // Сохраняем при изменении любого поля
    panel.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', saveAll);
      input.addEventListener('change', e => {
        if (e.target.classList.contains('all-convos')) {
          const convoInput = panel.querySelector('.convo-ids');
          convoInput.disabled = e.target.checked;
        }
        saveAll();
      });
    });
  
    return panel;
  }
  
  function addMuterPanel(data = {}) {
    const container = document.getElementById('muter-list');
    const panel = createMuterPanel(data);
    container.appendChild(panel);
    saveAll();
  }
  
  function getAllMuters() {
    const panels = document.querySelectorAll('.muter-panel');
    return Array.from(panels).map(panel => ({
      name: panel.querySelector('.muter-name')?.value.trim() || '',
      userId: panel.querySelector('.muter-id')?.value.trim() || '',
      allConvos: panel.querySelector('.all-convos')?.checked || false,
      convoIds: panel.querySelector('.convo-ids')?.value.trim() || ''
    }));
  }
  
  function saveAll() {
    const data = getAllMuters();
    chrome.storage.local.set({ vkSimpleMuter: data }, () => {
      console.log("✅ Список сохранён", data);
    });
  }
  
  function loadAll() {
    chrome.storage.local.get('vkSimpleMuter', result => {
      const saved = result.vkSimpleMuter || [];
      const container = document.getElementById('muter-list');
      container.innerHTML = '';
      if (saved.length === 0) {
        addMuterPanel();
      } else {
        saved.forEach(data => addMuterPanel(data));
      }
    });
  }
  
  // Инициализация
  window.onload = () => {
    loadAll();
    document.getElementById('add-btn').addEventListener('click', () => addMuterPanel());
  };  