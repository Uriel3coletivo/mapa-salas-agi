/* ---------------- DATA ----------------
   Coordenadas x/y e tamanho w/h calibrados (% da imagem). */

const rooms = [
  // TÉRREO
  { id:'T1', floor:'terreo', name:'T1', x:96.1, y:88.1, w:4.4, h:13 },
  { id:'T2', floor:'terreo', name:'T2', x:90.1, y:88.2, w:7.5, h:12.7 },
  { id:'T3', floor:'terreo', name:'T3', x:85, y:91.5, w:2.7, h:6.4 },
  { id:'T4', floor:'terreo', name:'T4', x:85, y:85, w:2.7, h:7 },
  { id:'T5', floor:'terreo', name:'T5', x:79.2, y:82.4, w:3.9, h:10.4 },
  { id:'T6', floor:'terreo', name:'T6', x:75.4, y:82.4, w:3.8, h:10.3 },
  { id:'T7', floor:'terreo', name:'T7', x:6, y:88.3, w:8.6, h:12.9 },
  
  // NOVAS SALAS TÉRREO (Use o calibrador para ajustar X, Y, W e H)
  { id:'UA1', floor:'terreo', name:'Uni Agi 1', x:60, y:50, w:8, h:8 },
  { id:'UA2', floor:'terreo', name:'Uni Agi 2', x:70, y:50, w:8, h:8 },
  { id:'TREIN', floor:'terreo', name:'Treinamento', x:85, y:50, w:12, h:10 },
  
  // 1º ANDAR
  { id:'S01', floor:'andar1', name:'Sala 01', x:64.6, y:32.6, w:9.2, h:14.4 },
  { id:'S2',  floor:'andar1', name:'Sala 02', x:73, y:16.2, w:5, h:19.6 },
  { id:'S3',  floor:'andar1', name:'Sala 03', x:78.3, y:11.2, w:5.4, h:9.9 },
  { id:'S4',  floor:'andar1', name:'Sala 04', x:76.9, y:22.8, w:2.6, h:6.5 },
  { id:'S5',  floor:'andar1', name:'Sala 05', x:79.5, y:22.8, w:2.9, h:6.4 },
  { id:'S6',  floor:'andar1', name:'Sala 06', x:95.7, y:88, w:3.8, h:13.1 },
  { id:'S7',  floor:'andar1', name:'Sala 07', x:91.6, y:87.8, w:4.4, h:12.9 },
  { id:'S8',  floor:'andar1', name:'Sala 08', x:87.8, y:87.8, w:3.3, h:12.8 },
  { id:'S9',  floor:'andar1', name:'Sala 09', x:84.8, y:90.9, w:2.8, h:6.7 },
  { id:'S10', floor:'andar1', name:'Sala 10', x:84.7, y:84.5, w:2.9, h:5.9 },
  { id:'S11', floor:'andar1', name:'Sala 11', x:79.2, y:82.4, w:3.8, h:10.3 },
  { id:'S12', floor:'andar1', name:'Sala 12', x:75.5, y:82.4, w:4, h:10.2 },
  { id:'S13', floor:'andar1', name:'Sala 13', x:22.8, y:83.5, w:7.7, h:12.2 },
  { id:'S14', floor:'andar1', name:'Sala 14', x:15.7, y:91.3, w:2.6, h:6.3 },
  { id:'S15', floor:'andar1', name:'Sala 15', x:15.8, y:84.8, w:2.8, h:6.8 },
  { id:'S16', floor:'andar1', name:'Sala 16', x:12.5, y:88, w:4, h:13.4 },
  { id:'S17', floor:'andar1', name:'Sala 17', x:6.4, y:87.8, w:8.1, h:13.8 },
  { id:'S18', floor:'andar1', name:'Sala 18', x:21.2, y:13.6, w:4.6, h:13.9 },
  { id:'S19', floor:'andar1', name:'Sala 19', x:34.3, y:33.1, w:4.7, h:13.5 },
  { id:'S20', floor:'andar1', name:'Sala 20', x:38.5, y:33, w:4.2, h:13.5 },
  { id:'S21', floor:'andar1', name:'Sala 21', x:42.1, y:36.3, w:3, h:6.8 },
  { id:'S22', floor:'andar1', name:'Sala 22', x:42.1, y:30, w:3, h:6 },
  { id:'S23', floor:'andar1', name:'Sala 23', x:42, y:23.8, w:2.7, h:6.3 },
];

const landmarks = [
  { id:'recep', floor:'terreo', name:'Recepção', x:49.7, y:14.2 },
  { id:'cafe', floor:'terreo', name:'Agi Café', x:30, y:28.8, rotate: -90 },
  { id:'estudio', floor:'andar1', name:'Estúdio', x:50.1, y:69.5 }, // Desci o Y do estúdio
];

const floorLabel = { terreo:'Térreo', andar1:'1º Andar' };
