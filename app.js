/* ---------------- STATE ---------------- */
let currentFloor = 'terreo';
let selectedRoom = null;
let editMode = false;
let idleTimer = null;
let isDragging = false;
let draggedElement = null;

/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderRoomList();
  renderMap();
  bindEvents();
  startIdleTimer();
});

/* ---------------- RENDER ROOM LIST ---------------- */
function renderRoomList() {
  const list = document.getElementById('roomList');
  const search = document.getElementById('searchInput').value.toLowerCase();
  
  const terreoRooms = rooms.filter(r => r.floor === 'terreo' && r.name.toLowerCase().includes(search));
  const andar1Rooms = rooms.filter(r => r.floor === 'andar1' && r.name.toLowerCase().includes(search));
  
  list.innerHTML = '';
  
  if (terreoRooms.length > 0) {
    list.innerHTML += `<div class="group-label">Térreo</div>`;
    terreoRooms.forEach(room => {
      list.innerHTML += `
        <div class="room-row ${selectedRoom?.id === room.id ? 'active' : ''}" data-room="${room.id}">
          <div class="room-dot ${room.floor}"></div>
          <div class="name">${room.name}</div>
          <div class="floor-tag">${floorLabel[room.floor]}</div>
        </div>
      `;
    });
  }
  
  if (andar1Rooms.length > 0) {
    list.innerHTML += `<div class="group-label">1º Andar</div>`;
    andar1Rooms.forEach(room => {
      list.innerHTML += `
        <div class="room-row ${selectedRoom?.id === room.id ? 'active' : ''}" data-room="${room.id}">
          <div class="room-dot ${room.floor}"></div>
          <div class="name">${room.name}</div>
          <div class="floor-tag">${floorLabel[room.floor]}</div>
        </div>
      `;
    });
  }
  
  if (terreoRooms.length === 0 && andar1Rooms.length === 0) {
    list.innerHTML = '<div class="empty-state">Nenhuma sala encontrada</div>';
  }
}

/* ---------------- RENDER MAP ---------------- */
function renderMap() {
  const plan = document.getElementById('plan');
  // Ajustado para o nome exato das imagens que você subiu
  const imagePath = currentFloor === 'terreo' ? 'assets/Mapa_Terreo.jpg' : 'assets/Mapa_Andar1.jpg';
  
  plan.innerHTML = `<img src="${imagePath}" alt="Mapa ${floorLabel[currentFloor]}">`;
  
  // Renderizar pontos das salas
  rooms.filter(r => r.floor === currentFloor).forEach(room => {
    const dot = document.createElement('div');
    dot.className = `dot ${room.floor} ${selectedRoom?.id === room.id ? 'selected' : ''} ${editMode ? 'editmode' : ''}`;
    dot.style.left = `${room.x}%`;
    dot.style.top = `${room.y}%`;
    dot.dataset.room = room.id;
    dot.innerHTML = `<div class="dot-label">${room.name}</div>`;
    plan.appendChild(dot);
  });
  
  // Renderizar landmarks (Agi Café, Recepção, etc)
  landmarks.filter(l => l.floor === currentFloor).forEach(landmark => {
    const mark = document.createElement('div');
    mark.className = `landmark ${editMode ? 'editmode' : ''}`;
    mark.style.left = `${landmark.x}%`;
    mark.style.top = `${landmark.y}%`;
    mark.dataset.mark = landmark.id;
    mark.textContent = landmark.name;
    plan.appendChild(mark);
  });
}

/* ---------------- EVENTS ---------------- */
function bindEvents() {
  // Busca
  document.getElementById('searchInput').addEventListener('input', renderRoomList);
  
  // Toggle andar
  document.querySelectorAll('.floor-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.floor-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFloor = btn.dataset.floor;
      renderMap();
      resetIdle();
    });
  });
  
  // Click em sala da lista
  document.getElementById('roomList').addEventListener('click', (e) => {
    const row = e.target.closest('.room-row');
    if (!row) return;
    
    const roomId = row.dataset.room;
    const room = rooms.find(r => r.id === roomId);
    if (!room) return;
    
    if (room.floor !== currentFloor) {
      currentFloor = room.floor;
      document.querySelectorAll('.floor-toggle button').forEach(b => b.classList.remove('active'));
      document.querySelector(`[data-floor="${room.floor}"]`).classList.add('active');
    }
    
    selectedRoom = room;
    renderRoomList();
    renderMap();
    resetIdle();
  });
  
  // Click em ponto no mapa
  document.getElementById('plan').addEventListener('click', (e) => {
    if (isDragging) return;
    
    const dot = e.target.closest('.dot');
    if (!dot) {
      selectedRoom = null;
      renderRoomList();
      renderMap();
      resetIdle();
      return;
    }
    
    if (editMode) return; // No modo calibração, não seleciona
    
    const roomId = dot.dataset.room;
    selectedRoom = rooms.find(r => r.id === roomId);
    renderRoomList();
    renderMap();
    resetIdle();
  });
  
  // Modo calibração
  document.getElementById('editToggle').addEventListener('click', () => {
    editMode = !editMode;
    document.getElementById('editToggle').classList.toggle('on', editMode);
    document.getElementById('calibPanel').classList.toggle('show', editMode);
    
    if (editMode) {
      selectedRoom = null;
      enableDrag();
      updateCalibOutput(); // Mostra as coordenadas atuais ao abrir
    } else {
      disableDrag();
    }
    
    renderMap();
    resetIdle();
  });
  
  // Copiar coordenadas
  document.getElementById('copyCoords').addEventListener('click', () => {
    const textarea = document.getElementById('coordOutput');
    textarea.select();
    document.execCommand('copy');
    
    const btn = document.getElementById('copyCoords');
    const originalText = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
  
  // Reset idle em qualquer interação
  ['click', 'touchstart', 'mousemove'].forEach(evt => {
    document.addEventListener(evt, resetIdle);
  });
}

/* ---------------- DRAG (MODO CALIBRAÇÃO) ---------------- */
function enableDrag() {
  const plan = document.getElementById('plan');
  
  plan.addEventListener('mousedown', startDrag);
  plan.addEventListener('mousemove', doDrag);
  plan.addEventListener('mouseup', endDrag);
  
  plan.addEventListener('touchstart', startDrag, {passive: false});
  plan.addEventListener('touchmove', doDrag, {passive: false});
  plan.addEventListener('touchend', endDrag);
}

function disableDrag() {
  const plan = document.getElementById('plan');
  
  plan.removeEventListener('mousedown', startDrag);
  plan.removeEventListener('mousemove', doDrag);
  plan.removeEventListener('mouseup', endDrag);
  
  plan.removeEventListener('touchstart', startDrag);
  plan.removeEventListener('touchmove', doDrag);
  plan.removeEventListener('touchend', endDrag);
}

function startDrag(e) {
  if (!editMode) return;
  
  // Agora permite arrastar tanto as salas (.dot) quanto os marcos (.landmark)
  const target = e.target.closest('.dot, .landmark');
  if (!target) return;
  
  isDragging = true;
  draggedElement = target;
  target.classList.add('dragging');
  e.preventDefault();
}

function doDrag(e) {
  if (!isDragging || !draggedElement) return;
  
  const plan = document.getElementById('plan');
  const rect = plan.getBoundingClientRect();
  
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  
  draggedElement.style.left = `${x}%`;
  draggedElement.style.top = `${y}%`;
  
  // Atualizar data dependendo do que está sendo arrastado
  if (draggedElement.classList.contains('dot')) {
    const roomId = draggedElement.dataset.room;
    const room = rooms.find(r => r.id === roomId);
    if (room) {
      room.x = Math.round(x * 10) / 10;
      room.y = Math.round(y * 10) / 10;
    }
  } else if (draggedElement.classList.contains('landmark')) {
    const markId = draggedElement.dataset.mark;
    const mark = landmarks.find(l => l.id === markId);
    if (mark) {
      mark.x = Math.round(x * 10) / 10;
      mark.y = Math.round(y * 10) / 10;
    }
  }
  
  updateCalibOutput();
  e.preventDefault();
}

function endDrag() {
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
  }
  isDragging = false;
  draggedElement = null;
}

function updateCalibOutput() {
  const roomsOutput = rooms.map(r => `  { id:'${r.id}', floor:'${r.floor}', name:'${r.name}', x:${r.x}, y:${r.y} },`).join('\n');
  const marksOutput = landmarks.map(l => `  { id:'${l.id}', floor:'${l.floor}', name:'${l.name}', x:${l.x}, y:${l.y} },`).join('\n');
  
  document.getElementById('coordOutput').value = `const rooms = [\n${roomsOutput}\n];\n\nconst landmarks = [\n${marksOutput}\n];`;
}

/* ---------------- IDLE STATE ---------------- */
function startIdleTimer() {
  clearTimeout(idleTimer);
  document.getElementById('stage').classList.remove('idle');
  document.getElementById('idleOverlay').classList.remove('show');
  
  idleTimer = setTimeout(() => {
    document.getElementById('stage').classList.add('idle');
    document.getElementById('idleOverlay').classList.add('show');
  }, 20000); // 20 segundos
}

function resetIdle() {
  startIdleTimer();
}
