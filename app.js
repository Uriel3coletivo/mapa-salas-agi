/* ---------------- STATE ---------------- */
let currentFloor = 'terreo';
let selectedRoom = null;
let idleTimer = null;

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
  
  const terreoRooms = rooms.filter(r => r.floor === 'terreo' && r.name.toLowerCase().indexOf(search) !== -1);
  const andar1Rooms = rooms.filter(r => r.floor === 'andar1' && r.name.toLowerCase().indexOf(search) !== -1);
  
  list.innerHTML = '';
  
  if (terreoRooms.length > 0) {
    list.innerHTML += '<div class="group-label">Térreo</div>';
    terreoRooms.forEach(room => {
      const isActive = (selectedRoom && selectedRoom.id === room.id) ? 'active' : '';
      list.innerHTML += `
        <div class="room-row ${isActive}" data-room="${room.id}">
          <div class="room-dot ${room.floor}"></div>
          <div class="name">${room.name}</div>
          <div class="floor-tag">${floorLabel[room.floor]}</div>
        </div>
      `;
    });
  }
  
  if (andar1Rooms.length > 0) {
    list.innerHTML += '<div class="group-label">1º Andar</div>';
    andar1Rooms.forEach(room => {
      const isActive = (selectedRoom && selectedRoom.id === room.id) ? 'active' : '';
      list.innerHTML += `
        <div class="room-row ${isActive}" data-room="${room.id}">
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
  const imagePath = currentFloor === 'terreo' ? 'assets/Mapa_Terreo.jpg' : 'assets/Mapa_Andar1.jpg';
  
  plan.innerHTML = `<img src="${imagePath}" alt="Mapa ${floorLabel[currentFloor]}">`;
  
  // Adiciona a classe de foco no mapa se houver sala selecionada
  if (selectedRoom) {
    plan.classList.add('has-selection');
  } else {
    plan.classList.remove('has-selection');
  }
  
  // Renderizar plaquinhas das salas
  rooms.filter(r => r.floor === currentFloor).forEach(room => {
    const dot = document.createElement('div');
    const isSelected = (selectedRoom && selectedRoom.id === room.id) ? 'selected' : '';
    
    dot.className = `dot ${room.floor} ${isSelected}`;
    dot.style.left = `${room.x}%`;
    dot.style.top = `${room.y}%`;
    dot.dataset.room = room.id;
    dot.textContent = room.name; // O nome vai direto na plaquinha agora
    
    plan.appendChild(dot);
  });
  
  // Renderizar landmarks
  landmarks.filter(l => l.floor === currentFloor).forEach(landmark => {
    const mark = document.createElement('div');
    mark.className = 'landmark';
    mark.style.left = `${landmark.x}%`;
    mark.style.top = `${landmark.y}%`;
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
      selectedRoom = null; // Limpa a seleção ao trocar de andar
      renderRoomList();
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
    
    // Se clicar na mesma sala, desmarca. Se clicar em outra, marca a nova.
    selectedRoom = (selectedRoom && selectedRoom.id === room.id) ? null : room;
    
    renderRoomList();
    renderMap();
    resetIdle();
  });
  
  // Click em plaquinha no mapa ou no fundo
  document.getElementById('plan').addEventListener('click', (e) => {
    const dot = e.target.closest('.dot');
    
    if (!dot) {
      // Se clicou no fundo do mapa, limpa a seleção
      selectedRoom = null;
      renderRoomList();
      renderMap();
      resetIdle();
      return;
    }
    
    // Se clicou em uma plaquinha
    const roomId = dot.dataset.room;
    const room = rooms.find(r => r.id === roomId);
    
    // Toggle de seleção
    selectedRoom = (selectedRoom && selectedRoom.id === room.id) ? null : room;
    
    renderRoomList();
    renderMap();
    resetIdle();
  });
  
  // Reset idle em qualquer interação
  ['click', 'touchstart', 'mousemove'].forEach(evt => {
    document.addEventListener(evt, resetIdle);
  });
}

/* ---------------- IDLE STATE ---------------- */
function startIdleTimer() {
  clearTimeout(idleTimer);
  document.getElementById('stage').classList.remove('idle');
  document.getElementById('idleOverlay').classList.remove('show');
  
  idleTimer = setTimeout(() => {
    selectedRoom = null; // Limpa a seleção quando a tela entra em repouso
    renderRoomList();
    renderMap();
    document.getElementById('stage').classList.add('idle');
    document.getElementById('idleOverlay').classList.add('show');
  }, 30000); // Aumentei para 30 segundos de inatividade
}

function resetIdle() {
  startIdleTimer();
}
