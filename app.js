/* ---------------- STATE ---------------- */
let currentFloor = 'terreo';
let selectedRoom = null;
let editMode = false;
let idleTimer = null;
let isDragging = false;
let draggedElement = null;

const urlParams = new URLSearchParams(window.location.search);
const tvParam = urlParams.get('tv'); 

/* ---------------- INIT ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  if (tvParam === 'terreo' || tvParam === 'andar1') {
    currentFloor = tvParam;
    document.querySelectorAll('.floor-toggle button').forEach(b => b.classList.remove('active'));
    document.querySelector(`[data-floor="${tvParam}"]`).classList.add('active');
  }

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
  
  if(!plan.querySelector('img') || plan.querySelector('img').getAttribute('src') !== imagePath) {
    plan.innerHTML = `<img src="${imagePath}" alt="Mapa ${floorLabel[currentFloor]}">`;
  }
  
  plan.querySelectorAll('.dot, .landmark, .you-are-here').forEach(el => el.remove());
  
  if (selectedRoom && !editMode) {
    plan.classList.add('has-selection');
  } else {
    plan.classList.remove('has-selection');
  }
  
  rooms.filter(r => r.floor === currentFloor).forEach(room => {
    const dot = document.createElement('div');
    const isSelected = (selectedRoom && selectedRoom.id === room.id);
    
    dot.className = `dot ${room.floor} room-${room.id} ${isSelected ? 'selected' : ''} ${editMode ? 'editmode' : ''}`;
    dot.style.left = `${room.x}%`;
    dot.style.top = `${room.y}%`;
    dot.style.width = `${room.w}%`;  
    dot.style.height = `${room.h}%`; 
    dot.dataset.room = room.id;
    
    if (isSelected) {
      dot.innerHTML = `<div class="pulse-bullet"></div><span>${room.name}</span>`;
    } else {
      dot.innerHTML = `<span>${room.name}</span>`;
    }
    
    plan.appendChild(dot);
  });
  
  landmarks.filter(l => l.floor === currentFloor).forEach(landmark => {
    const mark = document.createElement('div');
    mark.className = `landmark ${editMode ? 'editmode' : ''}`;
    mark.style.left = `${landmark.x}%`;
    mark.style.top = `${landmark.y}%`;
    
    if (landmark.rotate) {
      mark.style.transform = `translate(-50%, -50%) rotate(${landmark.rotate}deg)`;
    }
    
    mark.dataset.mark = landmark.id;
    mark.textContent = landmark.name;
    plan.appendChild(mark);
  });

  // Renderiza o pino "Você está aqui"
  if (tvParam === currentFloor && tvLocations[currentFloor]) {
    const loc = tvLocations[currentFloor];
    const marker = document.createElement('div');
    // Adiciona classe de edição se o modo calibração estiver ativo
    marker.className = `you-are-here ${editMode ? 'editmode' : ''}`;
    marker.style.left = `${loc.x}%`;
    marker.style.top = `${loc.y}%`;
    marker.dataset.tv = currentFloor; // Identificador para o JS saber qual TV estamos movendo
    marker.innerHTML = `<div class="pin"></div><div class="label">Você está aqui</div>`;
    plan.appendChild(marker);
  }
}

/* ---------------- EVENTS ---------------- */
function bindEvents() {
  document.getElementById('searchInput').addEventListener('input', renderRoomList);
  
  document.querySelectorAll('.floor-toggle button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.floor-toggle button').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFloor = btn.dataset.floor;
      selectedRoom = null;
      document.getElementById('sizeControls').style.display = 'none';
      renderRoomList();
      renderMap();
      resetIdle();
    });
  });
  
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
    
    selectedRoom = (selectedRoom && selectedRoom.id === room.id) ? null : room;
    renderRoomList();
    renderMap();
    resetIdle();
  });
  
  document.getElementById('plan').addEventListener('click', (e) => {
    if (isDragging) return;
    
    const dot = e.target.closest('.dot');
    
    if (!dot) {
      selectedRoom = null;
      document.getElementById('sizeControls').style.display = 'none';
      renderRoomList();
      renderMap();
      resetIdle();
      return;
    }
    
    const roomId = dot.dataset.room;
    const room = rooms.find(r => r.id === roomId);
    
    if (editMode) {
      selectedRoom = room;
      showSizeControls(room);
    } else {
      selectedRoom = (selectedRoom && selectedRoom.id === room.id) ? null : room;
    }
    
    renderRoomList();
    renderMap();
    resetIdle();
  });
  
  document.getElementById('editToggle').addEventListener('click', () => {
    editMode = !editMode;
    document.getElementById('editToggle').classList.toggle('on', editMode);
    document.getElementById('calibPanel').classList.toggle('show', editMode);
    
    if (editMode) {
      selectedRoom = null;
      document.getElementById('sizeControls').style.display = 'none';
      enableDrag();
      updateCalibOutput();
    } else {
      disableDrag();
    }
    
    renderMap();
    resetIdle();
  });
  
  document.getElementById('wSlider').addEventListener('input', (e) => {
    if(!selectedRoom) return;
    selectedRoom.w = parseFloat(e.target.value);
    const dot = document.querySelector(`.dot[data-room="${selectedRoom.id}"]`);
    if(dot) dot.style.width = `${selectedRoom.w}%`;
    updateCalibOutput();
  });
  
  document.getElementById('hSlider').addEventListener('input', (e) => {
    if(!selectedRoom) return;
    selectedRoom.h = parseFloat(e.target.value);
    const dot = document.querySelector(`.dot[data-room="${selectedRoom.id}"]`);
    if(dot) dot.style.height = `${selectedRoom.h}%`;
    updateCalibOutput();
  });

  document.getElementById('copyCoords').addEventListener('click', () => {
    const textarea = document.getElementById('coordOutput');
    textarea.select();
    document.execCommand('copy');
    const btn = document.getElementById('copyCoords');
    const originalText = btn.textContent;
    btn.textContent = 'Copiado!';
    setTimeout(() => btn.textContent = originalText, 2000);
  });
  
  ['click', 'touchstart', 'mousemove'].forEach(evt => {
    document.addEventListener(evt, resetIdle);
  });
}

function showSizeControls(room) {
  document.getElementById('sizeControls').style.display = 'block';
  document.getElementById('wSlider').value = room.w;
  document.getElementById('hSlider').value = room.h;
}

/* ---------------- DRAG (MODO CALIBRAÇÃO) ---------------- */
function enableDrag() {
  const plan = document.getElementById('plan');
  plan.addEventListener('mousedown', startDrag);
  plan.addEventListener('mousemove', doDrag);
  plan.addEventListener('mouseup', endDrag);
}

function disableDrag() {
  const plan = document.getElementById('plan');
  plan.removeEventListener('mousedown', startDrag);
  plan.removeEventListener('mousemove', doDrag);
  plan.removeEventListener('mouseup', endDrag);
}

function startDrag(e) {
  if (!editMode) return;
  // Agora o script permite clicar no pino da TV (.you-are-here) também
  const target = e.target.closest('.dot, .landmark, .you-are-here');
  if (!target) return;
  
  isDragging = true;
  draggedElement = target;
  target.classList.add('dragging');
  
  if (target.classList.contains('dot')) {
    const roomId = target.dataset.room;
    selectedRoom = rooms.find(r => r.id === roomId);
    showSizeControls(selectedRoom);
    
    document.querySelectorAll('.dot').forEach(d => d.classList.remove('selected'));
    target.classList.add('selected');
  } else {
    document.getElementById('sizeControls').style.display = 'none';
  }
  
  e.preventDefault();
}

function doDrag(e) {
  if (!isDragging || !draggedElement) return;
  
  const plan = document.getElementById('plan');
  const rect = plan.getBoundingClientRect();
  
  const clientX = e.clientX;
  const clientY = e.clientY;
  
  const x = ((clientX - rect.left) / rect.width) * 100;
  const y = ((clientY - rect.top) / rect.height) * 100;
  
  draggedElement.style.left = `${x}%`;
  draggedElement.style.top = `${y}%`;
  
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
  } else if (draggedElement.classList.contains('you-are-here')) {
    const floor = draggedElement.dataset.tv;
    if (tvLocations[floor]) {
      tvLocations[floor].x = Math.round(x * 10) / 10;
      tvLocations[floor].y = Math.round(y * 10) / 10;
    }
  }
  
  updateCalibOutput();
  e.preventDefault();
}

function endDrag() {
  if (draggedElement) {
    draggedElement.classList.remove('dragging');
  }
  setTimeout(() => isDragging = false, 50);
  draggedElement = null;
}

function updateCalibOutput() {
  const roomsOutput = rooms.map(r => `  { id:'${r.id}', floor:'${r.floor}', name:'${r.name}', x:${r.x}, y:${r.y}, w:${r.w}, h:${r.h} },`).join('\n');
  const marksOutput = landmarks.map(l => {
    const rot = l.rotate ? `, rotate: ${l.rotate}` : '';
    return `  { id:'${l.id}', floor:'${l.floor}', name:'${l.name}', x:${l.x}, y:${l.y}${rot} },`;
  }).join('\n');
  
  // Agora a caixinha também gera o código do tvLocations
  const tvsOutput = `const tvLocations = {\n  terreo: { x: ${tvLocations.terreo.x}, y: ${tvLocations.terreo.y} },\n  andar1: { x: ${tvLocations.andar1.x}, y: ${tvLocations.andar1.y} }\n};`;
  
  document.getElementById('coordOutput').value = `const rooms = [\n${roomsOutput}\n];\n\nconst landmarks = [\n${marksOutput}\n];\n\n${tvsOutput}`;
}

/* ---------------- IDLE STATE ---------------- */
function startIdleTimer() {
  clearTimeout(idleTimer);
  document.getElementById('stage').classList.remove('idle');
  document.getElementById('idleOverlay').classList.remove('show');
  
  idleTimer = setTimeout(() => {
    selectedRoom = null;
    document.getElementById('sizeControls').style.display = 'none';
    renderRoomList();
    renderMap();
    document.getElementById('stage').classList.add('idle');
    document.getElementById('idleOverlay').classList.add('show');
  }, 30000);
}

function resetIdle() {
  startIdleTimer();
}
