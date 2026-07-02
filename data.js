/* ---------------- DATA ----------------
   Coordenadas x/y são estimativas visuais iniciais (% da imagem).
   Use o "Modo calibração" para arrastar cada ponto até a posição exata. */

const rooms = [
  // TÉRREO
  { id:'T1', floor:'terreo', name:'T1', x:83.8, y:80.5 },
  { id:'T2', floor:'terreo', name:'T2', x:78.6, y:80.5 },
  { id:'T3', floor:'terreo', name:'T3', x:74.6, y:83.5 },
  { id:'T4', floor:'terreo', name:'T4', x:74.6, y:78.0 },
  { id:'T5', floor:'terreo', name:'T5', x:69.5, y:79.0 },
  { id:'T6', floor:'terreo', name:'T6', x:66.0, y:79.0 },
  { id:'T7', floor:'terreo', name:'T7', x:5.8,  y:80.5 },
  
  // 1º ANDAR
  { id:'S01', floor:'andar1', name:'Sala 01', x:57.0, y:46.0 },
  { id:'S2',  floor:'andar1', name:'Sala 02', x:64.0, y:35.0 },
  { id:'S3',  floor:'andar1', name:'Sala 03', x:69.0, y:32.0 },
  { id:'S4',  floor:'andar1', name:'Sala 04', x:68.0, y:39.5 },
  { id:'S5',  floor:'andar1', name:'Sala 05', x:70.5, y:39.5 },
  { id:'S6',  floor:'andar1', name:'Sala 06', x:84.0, y:80.0 },
  { id:'S7',  floor:'andar1', name:'Sala 07', x:80.5, y:80.0 },
  { id:'S8',  floor:'andar1', name:'Sala 08', x:77.5, y:80.0 },
  { id:'S9',  floor:'andar1', name:'Sala 09', x:74.6, y:86.0 },
  { id:'S10', floor:'andar1', name:'Sala 10', x:74.6, y:80.0 },
  { id:'S11', floor:'andar1', name:'Sala 11', x:69.6, y:78.5 },
  { id:'S12', floor:'andar1', name:'Sala 12', x:66.5, y:78.5 },
  { id:'S13', floor:'andar1', name:'Sala 13', x:20.8, y:78.5 },
  { id:'S14', floor:'andar1', name:'Sala 14', x:14.6, y:82.0 },
  { id:'S15', floor:'andar1', name:'Sala 15', x:14.6, y:79.0 },
  { id:'S16', floor:'andar1', name:'Sala 16', x:12.0, y:80.0 },
  { id:'S17', floor:'andar1', name:'Sala 17', x:6.8,  y:80.0 },
  { id:'S18', floor:'andar1', name:'Sala 18', x:19.5, y:33.0 },
  { id:'S19', floor:'andar1', name:'Sala 19', x:30.8, y:46.0 },
  { id:'S20', floor:'andar1', name:'Sala 20', x:34.5, y:46.0 },
  { id:'S21', floor:'andar1', name:'Sala 21', x:37.5, y:50.0 },
  { id:'S22', floor:'andar1', name:'Sala 22', x:37.5, y:45.0 },
  { id:'S23', floor:'andar1', name:'Sala 23', x:37.5, y:40.0 },
];

const landmarks = [
  { floor:'terreo', name:'Recepção', x:44.0, y:34.0 },
  { floor:'terreo', name:'Agi Café', x:26.4, y:43.5 },
  { floor:'andar1', name:'Estúdio', x:44.5, y:71.0 },
];

const floorLabel = { 
  terreo:'Térreo', 
  andar1:'1º Andar' 
};
