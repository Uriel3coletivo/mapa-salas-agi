const rooms = [
  // TÉRREO
  { id:'T1', floor:'terreo', name:'T1', x:96, y:76.9, w:5, h:5 },
  { id:'T2', floor:'terreo', name:'T2', x:90.2, y:76.6, w:5, h:5 },
  { id:'T3', floor:'terreo', name:'T3', x:84.9, y:79, w:5, h:5 },
  { id:'T4', floor:'terreo', name:'T4', x:84.9, y:74.6, w:5, h:5 },
  { id:'T5', floor:'terreo', name:'T5', x:79.2, y:72.9, w:5, h:5 },
  { id:'T6', floor:'terreo', name:'T6', x:75.7, y:72.9, w:5, h:5 },
  { id:'T7', floor:'terreo', name:'T7', x:6, y:77.1, w:5, h:5 },
  
  // 1º ANDAR
  { id:'S01', floor:'andar1', name:'Sala 01', x:64.7, y:37.7, w:5, h:5 },
  { id:'S2',  floor:'andar1', name:'Sala 02', x:73.3, y:24.2, w:5, h:5 },
  { id:'S3',  floor:'andar1', name:'Sala 03', x:78.3, y:20.6, w:5, h:5 },
  { id:'S4',  floor:'andar1', name:'Sala 04', x:76.9, y:29.3, w:5, h:5 },
  { id:'S5',  floor:'andar1', name:'Sala 05', x:79.6, y:29.4, w:5, h:5 },
  { id:'S6',  floor:'andar1', name:'Sala 06', x:95.6, y:76.6, w:5, h:5 },
  { id:'S7',  floor:'andar1', name:'Sala 07', x:91.7, y:76.6, w:5, h:5 },
  { id:'S8',  floor:'andar1', name:'Sala 08', x:87.7, y:76.6, w:5, h:5 },
  { id:'S9',  floor:'andar1', name:'Sala 09', x:84.8, y:78.7, w:5, h:5 },
  { id:'S10', floor:'andar1', name:'Sala 10', x:84.8, y:74.4, w:5, h:5 },
  { id:'S11', floor:'andar1', name:'Sala 11', x:79.1, y:72.6, w:5, h:5 },
  { id:'S12', floor:'andar1', name:'Sala 12', x:75.7, y:72.5, w:5, h:5 },
  { id:'S13', floor:'andar1', name:'Sala 13', x:22.8, y:73.2, w:5, h:5 },
  { id:'S14', floor:'andar1', name:'Sala 14', x:15.8, y:78.9, w:5, h:5 },
  { id:'S15', floor:'andar1', name:'Sala 15', x:15.8, y:74.3, w:5, h:5 },
  { id:'S16', floor:'andar1', name:'Sala 16', x:12.5, y:76.2, w:5, h:5 },
  { id:'S17', floor:'andar1', name:'Sala 17', x:6.6, y:76.2, w:5, h:5 },
  { id:'S18', floor:'andar1', name:'Sala 18', x:21.3, y:25, w:5, h:5 },
  { id:'S19', floor:'andar1', name:'Sala 19', x:34.3, y:38.1, w:5, h:5 },
  { id:'S20', floor:'andar1', name:'Sala 20', x:38.4, y:38.1, w:5, h:5 },
  { id:'S21', floor:'andar1', name:'Sala 21', x:42, y:40.3, w:5, h:5 },
  { id:'S22', floor:'andar1', name:'Sala 22', x:42, y:36, w:5, h:5 },
  { id:'S23', floor:'andar1', name:'Sala 23', x:42, y:31.8, w:5, h:5 },
];

const landmarks = [
  { id:'recep', floor:'terreo', name:'Recepção', x:49.8, y:24.9 },
  { id:'cafe', floor:'terreo', name:'Agi Café', x:29.9, y:35.4 },
  { id:'estudio', floor:'andar1', name:'Estúdio', x:50.1, y:65.5 },
];

const floorLabel = { terreo:'Térreo', andar1:'1º Andar' };
