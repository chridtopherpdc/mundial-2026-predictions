import { useState, useEffect, useRef } from "react";

const C = {
  green:"#4CAF50", greenL:"#E8F5E9", greenD:"#2E7D32",
  blue:"#29B6F6",  blueL:"#E1F5FE",  blueD:"#0277BD",
  gray:"#607D8B",  grayL:"#ECEFF1",  grayD:"#37474F",
  white:"#FFFFFF", bg:"#F5F7F8",
  text:"#1C2B33",  textS:"#455A64",  textM:"#90A4AE",
  border:"#CFD8DC", borderL:"#ECEFF1",
};

const bg4 = c => c===C.green?C.greenL:c===C.blue?C.blueL:C.grayL;

// ✅ GRUPOS OFICIALES FIFA MUNDIAL 2026
const GROUPS = {
  A:{teams:["México","Sudáfrica","Corea del Sur","Chequia"],color:C.green},
  B:{teams:["Canadá","Bosnia y Herzegovina","Qatar","Suiza"],color:C.blue},
  C:{teams:["Brasil","Alemania","Curazao","Costa de Marfil"],color:C.green},
  D:{teams:["Estados Unidos","Australia","Paraguay","Turquía"],color:C.blue},
  E:{teams:["Países Bajos","Japón","Suecia","Túnez"],color:C.green},
  F:{teams:["Bélgica","Nueva Zelanda","Irán","Egipto"],color:C.blue},
  G:{teams:["Escocia","Marruecos","Haití","Senegal"],color:C.green},
  H:{teams:["España","Cabo Verde","Arabia Saudita","Uruguay"],color:C.blue},
  I:{teams:["Francia","Irak","Senegal","Noruega"],color:C.green},
  J:{teams:["Argentina","Argelia","Austria","Jordania"],color:C.blue},
  K:{teams:["Portugal","RD del Congo","Uzbekistán","Colombia"],color:C.green},
  L:{teams:["Inglaterra","Croacia","Ghana","Panamá"],color:C.blue},
};

const FLAGS = {
  "México":"🇲🇽","Sudáfrica":"🇿🇦","Corea del Sur":"🇰🇷","Chequia":"🇨🇿",
  "Canadá":"🇨🇦","Bosnia y Herzegovina":"🇧🇦","Qatar":"🇶🇦","Suiza":"🇨🇭",
  "Brasil":"🇧🇷","Alemania":"🇩🇪","Curazao":"🇨🇼","Costa de Marfil":"🇨🇮",
  "Estados Unidos":"🇺🇸","Australia":"🇦🇺","Paraguay":"🇵🇾","Turquía":"🇹🇷",
  "Países Bajos":"🇳🇱","Japón":"🇯🇵","Suecia":"🇸🇪","Túnez":"🇹🇳",
  "Bélgica":"🇧🇪","Nueva Zelanda":"🇳🇿","Irán":"🇮🇷","Egipto":"🇪🇬",
  "Escocia":"🏴󠁧󠁢󠁳󠁣󠁴󠁿","Marruecos":"🇲🇦","Haití":"🇭🇹","Senegal":"🇸🇳",
  "España":"🇪🇸","Cabo Verde":"🇨🇻","Arabia Saudita":"🇸🇦","Uruguay":"🇺🇾",
  "Francia":"🇫🇷","Irak":"🇮🇶","Nigeria":"🇳🇬","Noruega":"🇳🇴",
  "Argentina":"🇦🇷","Argelia":"🇩🇿","Austria":"🇦🇹","Jordania":"🇯🇴",
  "Portugal":"🇵🇹","RD del Congo":"🇨🇩","Uzbekistán":"🇺🇿","Colombia":"🇨🇴",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Croacia":"🇭🇷","Ghana":"🇬🇭","Panamá":"🇵🇦",
};

// ✅ JUGADORES POR EQUIPO CLASIFICADO
const PLAYERS_BY_TEAM = {
  "México":["Guillermo Ochoa","Hirving Lozano","Santiago Giménez","Edson Álvarez","Andrés Guardado","Henry Martín","Orbelin Pineda","Roberto Alvarado","Alexis Vega","César Montes","Johan Vásquez"],
  "Sudáfrica":["Ronwen Williams","Percy Tau","Bafana Bafana","Themba Zwane","Lyle Foster","Teboho Mokoena","Bradley Cross","Evidence Makgopa","Keagan Dolly","Sipho Mbule","Sifiso Hlanti"],
  "Corea del Sur":["Son Heung-min","Kim Min-jae","Lee Kang-in","Hwang Hee-chan","Cho Gue-sung","Oh Hyeon-gyu","Seung-ho Paik","Kim Young-gwon","Hwang In-beom","Kim Jin-su","Lee Jae-sung"],
  "Chequia":["Tomáš Souček","Patrik Schick","Vladimír Coufal","Jiří Pavlenka","Ondřej Kolář","Lukáš Masopust","Jakub Jankto","Matěj Vydra","Ladislav Krejčí","David Zima","Tomáš Holeš"],
  "Canadá":["Alphonso Davies","Jonathan David","Cyle Larin","Milan Borjan","Atiba Hutchinson","Stephen Eustáquio","Tajon Buchanan","Jonathan Osorio","Mark-Anthony Kaye","Richie Laryea","Derek Cornelius"],
  "Bosnia y Herzegovina":["Edin Džeko","Miralem Pjanić","Asmir Begović","Rade Krunic","Sead Kolašinac","Ermedin Demirović","Armin Hodžić","Dženan Radončić","Haris Duljevic","Deni Jurić","Dario Špaić"],
  "Qatar":["Akram Afif","Almoez Ali","Saad Al Sheeb","Hassan Al-Haydos","Boualem Khoukhi","Karim Boudiaf","Pedro Miguel","Bassam Al-Rawi","Abdulaziz Hatem","Homam Al-Amin","Abdullah Al-Ahrak"],
  "Suiza":["Xherdan Shaqiri","Granit Xhaka","Manuel Akanji","Breel Embolo","Yann Sommer","Remo Freuler","Ricardo Rodríguez","Denis Zakaria","Haris Seferović","Fabian Schär","Ruben Vargas"],
  "Brasil":["Vinicius Jr.","Rodrygo","Casemiro","Alisson Becker","Marquinhos","Endrick","Raphinha","Lucas Paquetá","Gabriel Martinelli","Éder Militão","Danilo"],
  "Alemania":["Manuel Neuer","Jamal Musiala","Kai Havertz","Florian Wirtz","Joshua Kimmich","Leroy Sané","Antonio Rüdiger","İlkay Gündoğan","Niclas Füllkrug","Benjamin Henrichs","Thomas Müller"],
  "Curazao":["Cuco Martina","Jurickson Profar","Leandro Bacuna","Eloy Room","Giliano Wijnaldum","Riechedly Bazoer","Gevero Markiet","Denzell Dumfries","Myron Boadu","Darryl Lachman","Rangelo Janga"],
  "Costa de Marfil":["Didier Drogba Jr.","Nicolas Pépé","Wilfried Zaha","Sébastien Haller","Franck Kessié","Jean-Michaël Seri","Serge Aurier","Eric Bailly","Youssouf Koné","Abdallah Sima","Simon Adingra"],
  "Estados Unidos":["Christian Pulisic","Tyler Adams","Weston McKennie","Gio Reyna","Zack Steffen","Miles Robinson","Yunus Musah","Brenden Aaronson","Ricardo Pepi","Sergiño Dest","Matt Turner"],
  "Australia":["Mathew Ryan","Mathew Leckie","Martin Boyle","Jackson Irvine","Harry Souttar","Riley McGree","Awer Mabil","Mitchell Duke","Ajdin Hrustic","Aziz Behich","Craig Goodwin"],
  "Paraguay":["Alonso Solari","Gustavo Gómez","José Calderón","Antolín Alcaraz","Iván Torres","Braian Samudio","Ángel Cardozo","Damián Bobadilla","Alejandro Romero","Carlos González","Néstor Camacho"],
  "Turquía":["Hakan Çalhanoğlu","Arda Güler","Kenan Yıldız","Altay Bayındır","Çağlar Söyüncü","Merih Demiral","Zeki Çelik","Orkun Kökçü","Barış Alper Yılmaz","Kerem Aktürkoğlu","Ferdi Kadıoğlu"],
  "Países Bajos":["Virgil van Dijk","Frenkie de Jong","Cody Gakpo","Xavi Simons","Wout Weghorst","Jurriën Timber","Denzel Dumfries","Ryan Gravenberch","Nathan Aké","Donyell Malen","Steven Bergwijn"],
  "Japón":["Takumi Minamino","Wataru Endo","Daichi Kamada","Shuichi Gonda","Takehiro Tomiyasu","Ko Itakura","Ritsu Doan","Ao Tanaka","Kaoru Mitoma","Junya Ito","Yukinari Sugawara"],
  "Suecia":["Zlatan Ibrahimović","Alexander Isak","Victor Nilsson Lindelöf","Robin Olsen","Ludwig Augustinsson","Dejan Kulusevski","Emil Forsberg","Karl-Johan Johnsson","Pontus Jansson","Marcus Danielson","Sebastian Larsson"],
  "Túnez":["Youssef Msakni","Wahbi Khazri","Ellyes Skhiri","Aymen Dahmen","Montassar Talbi","Dylan Bronn","Mohamed Drager","Naim Sliti","Bassem Srarfi","Ali Maaloul","Hannibal Mejbri"],
  "Bélgica":["Kevin De Bruyne","Romelu Lukaku","Thibaut Courtois","Eden Hazard","Jan Vertonghen","Yannick Carrasco","Leandro Trossard","Charles De Ketelaere","Loïs Openda","Axel Witsel","Amadou Onana"],
  "Nueva Zelanda":["Chris Wood","Ryan Thomas","Liberato Cacace","Stefan Marinovic","Winston Reid","Sander van Hoeven","Oli Sail","Kosta Barbarouses","Marco Rojas","Matthew Ridenton","Dane Ingham"],
  "Irán":["Mehdi Taremi","Alireza Beiranvand","Sardar Azmoun","Saman Ghoddos","Milad Mohammadi","Majid Hosseini","Ali Gholizadeh","Ehsan Hajsafi","Morteza Pouraliganji","Ramin Rezaeian","Karim Ansarifard"],
  "Egipto":["Mohamed Salah","Ahmed Hegazi","Mohamed El-Shenawy","Omar Marmoush","Trézéguet","Amr El-Sulaya","Mahmoud Trezeguet","Zizo","Mostafa Mohamed","Hamdi Fathi","Karim El-Ahmadi"],
  "Escocia":["Andrew Robertson","Scott McTominay","Lyndon Dykes","Angus Gunn","Grant Hanley","Ryan Christie","John McGinn","Stuart Armstrong","Callum McGregor","Kenny McLean","Ryan Jack"],
  "Marruecos":["Hakim Ziyech","Achraf Hakimi","Yassine Bounou","Sofiane Boufal","Azzedine Ounahi","Youssef En-Nesyri","Noussair Mazraoui","Walid Cheddira","Selim Amallah","Romain Saïss","Nayef Aguerd"],
  "Haití":["Duckens Nazon","Frantzdy Pierrot","Steeven Saba","Mechack Jérôme","Kervens Belfort","Wilde-Donald Guerrier","Mickael Cantave","Bernadin Coriolan","James Cantave","Carlo Marcelin","James Léandre"],
  "Senegal":["Sadio Mané","Kalidou Koulibaly","Edouard Mendy","Ismaila Sarr","Idrissa Gueye","Boulaye Dia","Nicolas Jackson","Lamine Camara","Nampalys Mendy","Cheikhou Kouyaté","Pape Gueye"],
  "España":["Pedri","Lamine Yamal","Álvaro Morata","Unai Simón","Dani Carvajal","Rodri","Nico Williams","Mikel Merino","Gavi","Fabián Ruiz","Joselu"],
  "Cabo Verde":["Ryan Mendes","Garry Rodrigues","Stopira","Patrick Andrade","Jamiro Monteiro","Lisandro Semedo","Kevin Pina","Marco Soares","Diney","Ady Tavares","Steven Fortes"],
  "Arabia Saudita":["Salem Al-Dawsari","Mohammed Al-Owais","Saleh Al-Shehri","Ali Al-Bulayhi","Sami Al-Najei","Firas Al-Buraikan","Hassan Al-Tambakti","Mohammed Kanno","Riyadh Sharahili","Abdulelah Al-Malki","Sultan Al-Ghannam"],
  "Uruguay":["Federico Valverde","Darwin Núñez","José María Giménez","Sergio Rochet","Ronald Araújo","Rodrigo Bentancur","Facundo Pellistri","Luis Suárez","Maximiliano Gómez","Matías Vecino","Edinson Cavani"],
  "Francia":["Kylian Mbappé","Antoine Griezmann","Olivier Giroud","Theo Hernández","Mike Maignan","Eduardo Camavinga","Aurélien Tchouaméni","Marcus Thuram","Ousmane Dembélé","Adrien Rabiot","William Saliba"],
  "Irak":["Aymen Hussein","Amjed Attwan","Bashar Resan","Jalal Hassan","Ali Adnan","Mohanad Ali","Justin Meram","Saad Abdul-Amir","Humam Tariq","Alaa Abbas","Salam Shakir"],
  "Noruega":["Erling Haaland","Martin Ødegaard","Alexander Sørloth","Ørjan Nyland","Stefan Strandberg","Kristian Thorstvedt","Sander Berge","Mohamed Elyounoussi","Mats Møller Dæhli","Leo Skiri Østigård","Andreas Hanche-Olsen"],
  "Argentina":["Lionel Messi","Lautaro Martínez","Rodrigo De Paul","Emiliano Martínez","Nicolás Otamendi","Alexis Mac Allister","Julián Álvarez","Ángel Di María","Paulo Dybala","Leandro Paredes","Nahuel Molina"],
  "Argelia":["Riyad Mahrez","Islam Slimani","Ismaël Bennacer","Raïs M'Bolhi","Aïssa Mandi","Adam Ounas","Sofiane Feghouli","Said Benrahma","Haris Belkebla","Djamel Benlamri","Youcef Atal"],
  "Austria":["David Alaba","Marcel Sabitzer","Marko Arnautović","Patrick Pentz","Stefan Lainer","Florian Grillitsch","Konrad Laimer","Christoph Baumgartner","Xaver Schlager","Andreas Weimann","Sasa Kalajdzic"],
  "Jordania":["Musa Al-Taamari","Yazan Al-Naimat","Zaid Al-Bawab","Amer Shafi","Baha'a Faisal","Hamza Al-Dardour","Nour Al-Rawabdeh","Ahmad Harman","Abdallah Nasib","Mahmoud Alkharabsheh","Oday Dabbagh"],
  "Portugal":["Cristiano Ronaldo","Bruno Fernandes","Rúben Dias","Rafael Leão","Bernardo Silva","Diogo Costa","Vitinha","Pedro Neto","Diogo Jota","João Cancelo","Otávio"],
  "RD del Congo":["Yoane Wissa","Fiston Mayele","Chancel Mbemba","Hervé Koffi","Cédric Bakambu","Silas","Arthur Masuaku","Christian Luyindama","Théo Bongonda","Samuel Moutoussamy","Gaël Kakuta"],
  "Uzbekistán":["Eldor Shomurodov","Jaloliddin Masharipov","Hamza Karimov","Otabek Shukurov","Jasurbek Yakhshiboev","Abdukodir Khusanov","Doston Tursunov","Laziz Azimov","Bobir Abdixoliqov","Ildar Akhmetov","Rustam Yuldashev"],
  "Colombia":["James Rodríguez","Luis Díaz","Falcao García","David Ospina","Yerry Mina","Juan Cuadrado","Duván Zapata","Mateus Uribe","Miguel Ángel Borja","Rafael Santos Borré","Jhon Arias"],
  "Inglaterra":["Harry Kane","Jude Bellingham","Bukayo Saka","Phil Foden","Jordan Pickford","Declan Rice","Trent Alexander-Arnold","Marcus Rashford","Jack Grealish","John Stones","Kyle Walker"],
  "Croacia":["Luka Modrić","Mateo Kovačić","Dominik Livaković","Ivan Perišić","Marcelo Brozović","Andrej Kramarić","Bruno Petković","Joško Gvardiol","Borna Sosa","Nikola Vlašić","Dejan Lovren"],
  "Ghana":["Thomas Partey","Mohammed Salisu","Jordan Ayew","André Ayew","Joseph Wollacott","Alexander Djiku","Kamaldeen Sulemana","Inaki Williams","Mohammed Kudus","Daniel Amartey","Osman Bukari"],
  "Panamá":["Rolando Blackburn","Roderick Miller","Anibal Godoy","Fidel Escobar","Abdiel Arroyo","Édgar Bárcenas","José Fajardo","Adalberto Carrasquilla","Alberto Quintero","Harold Cummings","Valentín Pimentel"],
};

const ALL_PLAYERS = Object.entries(PLAYERS_BY_TEAM).flatMap(([team,players])=>players.map(p=>({name:p,team,flag:FLAGS[team]||"🏳️"})));
const ALL_TEAMS = Object.values(GROUPS).flatMap(g=>g.teams);

// ✅ PARTIDOS OFICIALES FASE DE GRUPOS
const MATCHES = [
  // GRUPO A
  {id:1,group:"A",home:"México",away:"Sudáfrica",date:"11 Jun",time:"15:00",venue:"Estadio Azteca, CDMX"},
  {id:2,group:"A",home:"Corea del Sur",away:"Chequia",date:"11 Jun",time:"22:00",venue:"Estadio Akron, GDL"},
  {id:3,group:"A",home:"México",away:"Corea del Sur",date:"18 Jun",time:"21:00",venue:"Estadio Akron, GDL"},
  {id:4,group:"A",home:"Chequia",away:"Sudáfrica",date:"18 Jun",time:"12:00",venue:"Mercedes-Benz, Atlanta"},
  {id:5,group:"A",home:"Chequia",away:"México",date:"24 Jun",time:"21:00",venue:"Estadio Azteca, CDMX"},
  {id:6,group:"A",home:"Sudáfrica",away:"Corea del Sur",date:"24 Jun",time:"21:00",venue:"Estadio BBVA, Monterrey"},
  // GRUPO B
  {id:7,group:"B",home:"Canadá",away:"Bosnia y Herzegovina",date:"12 Jun",time:"18:00",venue:"BMO Field, Toronto"},
  {id:8,group:"B",home:"Qatar",away:"Suiza",date:"12 Jun",time:"21:00",venue:"BC Place, Vancouver"},
  {id:9,group:"B",home:"Canadá",away:"Qatar",date:"19 Jun",time:"18:00",venue:"BMO Field, Toronto"},
  {id:10,group:"B",home:"Suiza",away:"Bosnia y Herzegovina",date:"19 Jun",time:"21:00",venue:"Levi's Stadium, SF"},
  {id:11,group:"B",home:"Suiza",away:"Canadá",date:"25 Jun",time:"18:00",venue:"BC Place, Vancouver"},
  {id:12,group:"B",home:"Bosnia y Herzegovina",away:"Qatar",date:"25 Jun",time:"18:00",venue:"Levi's Stadium, SF"},
  // GRUPO C
  {id:13,group:"C",home:"Brasil",away:"Alemania",date:"12 Jun",time:"15:00",venue:"SoFi Stadium, LA"},
  {id:14,group:"C",home:"Curazao",away:"Costa de Marfil",date:"12 Jun",time:"21:00",venue:"NRG Stadium, Houston"},
  {id:15,group:"C",home:"Alemania",away:"Curazao",date:"14 Jun",time:"13:00",venue:"NRG Stadium, Houston"},
  {id:16,group:"C",home:"Costa de Marfil",away:"Brasil",date:"14 Jun",time:"19:00",venue:"Lincoln Financial, Philly"},
  {id:17,group:"C",home:"Ecuador",away:"Alemania",date:"25 Jun",time:"16:00",venue:"MetLife, NY"},
  {id:18,group:"C",home:"Curazao",away:"Costa de Marfil",date:"25 Jun",time:"16:00",venue:"Lincoln Financial, Philly"},
  // GRUPO D
  {id:19,group:"D",home:"Estados Unidos",away:"Paraguay",date:"12 Jun",time:"19:00",venue:"SoFi Stadium, LA"},
  {id:20,group:"D",home:"Australia",away:"Turquía",date:"13 Jun",time:"16:00",venue:"AT&T Stadium, Dallas"},
  {id:21,group:"D",home:"Estados Unidos",away:"Australia",date:"19 Jun",time:"19:00",venue:"SoFi Stadium, LA"},
  {id:22,group:"D",home:"Turquía",away:"Paraguay",date:"20 Jun",time:"16:00",venue:"Arrowhead, KC"},
  {id:23,group:"D",home:"Turquía",away:"Estados Unidos",date:"26 Jun",time:"20:00",venue:"AT&T Stadium, Dallas"},
  {id:24,group:"D",home:"Paraguay",away:"Australia",date:"26 Jun",time:"20:00",venue:"Arrowhead, KC"},
  // GRUPO E
  {id:25,group:"E",home:"Países Bajos",away:"Japón",date:"14 Jun",time:"16:00",venue:"AT&T Stadium, Dallas"},
  {id:26,group:"E",home:"Suecia",away:"Túnez",date:"14 Jun",time:"22:00",venue:"Estadio BBVA, Monterrey"},
  {id:27,group:"E",home:"Países Bajos",away:"Suecia",date:"20 Jun",time:"13:00",venue:"NRG Stadium, Houston"},
  {id:28,group:"E",home:"Túnez",away:"Japón",date:"20 Jun",time:"22:00",venue:"Estadio Akron, GDL"},
  {id:29,group:"E",home:"Japón",away:"Suecia",date:"25 Jun",time:"19:00",venue:"AT&T Stadium, Dallas"},
  {id:30,group:"E",home:"Túnez",away:"Países Bajos",date:"25 Jun",time:"19:00",venue:"Arrowhead, KC"},
  // GRUPO F
  {id:31,group:"F",home:"Bélgica",away:"Egipto",date:"15 Jun",time:"15:00",venue:"Lumen Field, Seattle"},
  {id:32,group:"F",home:"Irán",away:"Nueva Zelanda",date:"15 Jun",time:"21:00",venue:"SoFi Stadium, LA"},
  {id:33,group:"F",home:"Bélgica",away:"Irán",date:"21 Jun",time:"15:00",venue:"SoFi Stadium, LA"},
  {id:34,group:"F",home:"Nueva Zelanda",away:"Egipto",date:"21 Jun",time:"21:00",venue:"BC Place, Vancouver"},
  {id:35,group:"F",home:"Egipto",away:"Irán",date:"26 Jun",time:"23:00",venue:"Lumen Field, Seattle"},
  {id:36,group:"F",home:"Nueva Zelanda",away:"Bélgica",date:"26 Jun",time:"23:00",venue:"BC Place, Vancouver"},
  // GRUPO G
  {id:37,group:"G",home:"Escocia",away:"Marruecos",date:"15 Jun",time:"18:00",venue:"Hard Rock, Miami"},
  {id:38,group:"G",home:"Haití",away:"Senegal",date:"15 Jun",time:"22:00",venue:"Mercedes-Benz, Atlanta"},
  {id:39,group:"G",home:"Escocia",away:"Haití",date:"21 Jun",time:"18:00",venue:"Hard Rock, Miami"},
  {id:40,group:"G",home:"Marruecos",away:"Senegal",date:"21 Jun",time:"22:00",venue:"Mercedes-Benz, Atlanta"},
  {id:41,group:"G",home:"Senegal",away:"Escocia",date:"26 Jun",time:"20:00",venue:"Hard Rock, Miami"},
  {id:42,group:"G",home:"Marruecos",away:"Haití",date:"26 Jun",time:"20:00",venue:"Mercedes-Benz, Atlanta"},
  // GRUPO H
  {id:43,group:"H",home:"España",away:"Cabo Verde",date:"15 Jun",time:"12:00",venue:"Mercedes-Benz, Atlanta"},
  {id:44,group:"H",home:"Arabia Saudita",away:"Uruguay",date:"15 Jun",time:"18:00",venue:"Hard Rock, Miami"},
  {id:45,group:"H",home:"España",away:"Arabia Saudita",date:"21 Jun",time:"12:00",venue:"Mercedes-Benz, Atlanta"},
  {id:46,group:"H",home:"Uruguay",away:"Cabo Verde",date:"21 Jun",time:"18:00",venue:"Hard Rock, Miami"},
  {id:47,group:"H",home:"Cabo Verde",away:"Arabia Saudita",date:"26 Jun",time:"20:00",venue:"NRG Stadium, Houston"},
  {id:48,group:"H",home:"Uruguay",away:"España",date:"26 Jun",time:"20:00",venue:"Estadio Akron, GDL"},
  // GRUPO I
  {id:49,group:"I",home:"Francia",away:"Irak",date:"16 Jun",time:"16:00",venue:"MetLife, NY"},
  {id:50,group:"I",home:"Senegal",away:"Noruega",date:"16 Jun",time:"22:00",venue:"Gillette, Boston"},
  {id:51,group:"I",home:"Francia",away:"Senegal",date:"22 Jun",time:"16:00",venue:"MetLife, NY"},
  {id:52,group:"I",home:"Noruega",away:"Irak",date:"22 Jun",time:"22:00",venue:"Lincoln Financial, Philly"},
  {id:53,group:"I",home:"Irak",away:"Senegal",date:"27 Jun",time:"20:00",venue:"Hard Rock, Miami"},
  {id:54,group:"I",home:"Noruega",away:"Francia",date:"27 Jun",time:"20:00",venue:"MetLife, NY"},
  // GRUPO J
  {id:55,group:"J",home:"Argentina",away:"Argelia",date:"16 Jun",time:"22:00",venue:"Levi's Stadium, SF"},
  {id:56,group:"J",home:"Austria",away:"Jordania",date:"17 Jun",time:"00:00",venue:"BC Place, Vancouver"},
  {id:57,group:"J",home:"Argentina",away:"Austria",date:"23 Jun",time:"22:00",venue:"AT&T Stadium, Dallas"},
  {id:58,group:"J",home:"Jordania",away:"Argelia",date:"23 Jun",time:"22:00",venue:"Levi's Stadium, SF"},
  {id:59,group:"J",home:"Argelia",away:"Austria",date:"27 Jun",time:"20:00",venue:"AT&T Stadium, Dallas"},
  {id:60,group:"J",home:"Jordania",away:"Argentina",date:"27 Jun",time:"20:00",venue:"Levi's Stadium, SF"},
  // GRUPO K
  {id:61,group:"K",home:"Portugal",away:"RD del Congo",date:"17 Jun",time:"13:00",venue:"NRG Stadium, Houston"},
  {id:62,group:"K",home:"Uzbekistán",away:"Colombia",date:"17 Jun",time:"20:00",venue:"Estadio Azteca, CDMX"},
  {id:63,group:"K",home:"Portugal",away:"Uzbekistán",date:"23 Jun",time:"13:00",venue:"NRG Stadium, Houston"},
  {id:64,group:"K",home:"Colombia",away:"RD del Congo",date:"23 Jun",time:"20:00",venue:"Estadio Azteca, CDMX"},
  {id:65,group:"K",home:"RD del Congo",away:"Uzbekistán",date:"28 Jun",time:"20:00",venue:"NRG Stadium, Houston"},
  {id:66,group:"K",home:"Colombia",away:"Portugal",date:"28 Jun",time:"20:00",venue:"Estadio Azteca, CDMX"},
  // GRUPO L
  {id:67,group:"L",home:"Inglaterra",away:"Croacia",date:"17 Jun",time:"16:00",venue:"AT&T Stadium, Dallas"},
  {id:68,group:"L",home:"Ghana",away:"Panamá",date:"17 Jun",time:"22:00",venue:"Arrowhead, KC"},
  {id:69,group:"L",home:"Inglaterra",away:"Ghana",date:"23 Jun",time:"16:00",venue:"MetLife, NY"},
  {id:70,group:"L",home:"Panamá",away:"Croacia",date:"23 Jun",time:"22:00",venue:"Gillette, Boston"},
  {id:71,group:"L",home:"Croacia",away:"Ghana",date:"28 Jun",time:"20:00",venue:"MetLife, NY"},
  {id:72,group:"L",home:"Panamá",away:"Inglaterra",date:"28 Jun",time:"20:00",venue:"Lincoln Financial, Philly"},
];

function calcStandings(groupLetter, matchResults) {
  const teams = GROUPS[groupLetter].teams;
  const stats = {};
  teams.forEach(t=>{ stats[t]={pj:0,g:0,e:0,p:0,gf:0,gc:0,pts:0} });
  MATCHES.filter(m=>m.group===groupLetter).forEach(m=>{
    const r = matchResults[m.id];
    if(!r||r.home===""||r.away==="") return;
    const h=Number(r.home), a=Number(r.away);
    if(isNaN(h)||isNaN(a)) return;
    if(!stats[m.home]||!stats[m.away]) return;
    stats[m.home].pj++; stats[m.away].pj++;
    stats[m.home].gf+=h; stats[m.home].gc+=a;
    stats[m.away].gf+=a; stats[m.away].gc+=h;
    if(h>a){stats[m.home].g++;stats[m.home].pts+=3;stats[m.away].p++;}
    else if(h<a){stats[m.away].g++;stats[m.away].pts+=3;stats[m.home].p++;}
    else{stats[m.home].e++;stats[m.home].pts+=1;stats[m.away].e++;stats[m.away].pts+=1;}
  });
  return teams.map(t=>({team:t,...stats[t],dif:stats[t].gf-stats[t].gc}))
    .sort((a,b)=>b.pts-a.pts||b.dif-a.dif||b.gf-a.gf);
}

const SK="wc2026_v7", UK="wc2026_usr_v7";
const loadData=()=>{try{return JSON.parse(localStorage.getItem(SK)||"{}")}catch{return{}}};
const saveData=d=>{try{localStorage.setItem(SK,JSON.stringify(d))}catch{}};
const loadUser=()=>{try{const u=JSON.parse(localStorage.getItem(UK)||"null");return u||{name:"",favTeam:"",favPlayer:"",id:Math.random().toString(36).slice(2)}}catch{return{name:"",favTeam:"",favPlayer:"",id:"u1"}}};
const saveUser=u=>{try{localStorage.setItem(UK,JSON.stringify(u))}catch{}};

function GradBar(){return <div style={{height:5,background:`linear-gradient(90deg,${C.green},${C.blue},${C.gray},${C.green},${C.blue})`}}/>}
function Div(){return <div style={{height:4,background:`linear-gradient(90deg,${C.green},${C.blue})`,borderRadius:2,marginBottom:16}}/>}

function TrophySVG({size=60}){
  return(
    <svg width={size} height={size*1.2} viewBox="0 0 80 96" fill="none">
      <ellipse cx="40" cy="90" rx="20" ry="5" fill={C.grayL}/>
      <rect x="31" y="75" width="18" height="10" rx="2" fill="#C8A04A"/>
      <rect x="25" y="71" width="30" height="6" rx="3" fill="#A07830"/>
      <path d="M22 16 Q11 20 13 36 Q15 50 27 56 L31 60 L49 60 L53 56 Q65 50 67 36 Q69 20 58 16 Z" fill="#D4A017"/>
      <path d="M31 16 L49 16 L53 60 Q45 64 35 64 Q25 64 27 60 Z" fill="#E8C040"/>
      <ellipse cx="40" cy="16" rx="14" ry="5" fill="#F5D060"/>
      <path d="M27 28 Q20 26 20 20 Q20 14 27 16" stroke="#A07830" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <path d="M53 28 Q60 26 60 20 Q60 14 53 16" stroke="#A07830" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
      <text x="40" y="40" textAnchor="middle" fill="#7A5C10" fontSize="7" fontWeight="bold" fontFamily="Arial">FIFA</text>
      <text x="40" y="51" textAnchor="middle" fill="#7A5C10" fontSize="5" fontFamily="Arial">WORLD CUP</text>
    </svg>
  );
}

export default function App(){
  const [tab,setTab]=useState("home");
  const [user,setUser]=useState(loadUser);
  const [data,setData]=useState(loadData);
  const [showSetup,setShowSetup]=useState(false);
  const [toast,setToast]=useState(null);
  useEffect(()=>{saveData(data)},[data]);
  useEffect(()=>{saveUser(user)},[user]);
  useEffect(()=>{if(!user.name)setShowSetup(true)},[]);
  const showToast=msg=>{setToast(msg);setTimeout(()=>setToast(null),2500)};
  const updatePred=(key,val)=>{setData(d=>({...d,predictions:{...(d.predictions||{}),[key]:val}}));showToast("✅ ¡Guardado!")};
  const TABS=[
    {id:"home",icon:"🏠",label:"INICIO"},
    {id:"calendar",icon:"📅",label:"PARTIDOS"},
    {id:"groups",icon:"🗂",label:"GRUPOS"},
    {id:"bracket",icon:"🏅",label:"BRACKET"},
    {id:"ranking",icon:"👥",label:"RANKING"},
  ];
  return(
    <div style={S.app}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;600;700;900&family=Barlow:wght@400;500;600&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#F5F7F8}
        ::-webkit-scrollbar-thumb{background:#B0BEC5;border-radius:2px}
        .hvr{transition:transform .15s,box-shadow .15s}
        .hvr:hover{transform:translateY(-2px);box-shadow:0 6px 18px rgba(0,0,0,.1)}
        .nb:hover{background:#ECEFF1!important}
        .arr:hover{background:#CFD8DC!important}
        .bkt:hover{background:#F5F7F8!important}
        .dr:hover{background:#F5F7F8!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes champPulse{0%,100%{box-shadow:0 0 0 0 rgba(76,175,80,0)}50%{box-shadow:0 0 0 8px rgba(76,175,80,.12)}}
        .fi{animation:fadeUp .3s ease both}
        .champ{animation:champPulse 2.5s ease infinite}
        input:focus{outline:2px solid ${C.blue}!important;border-color:${C.blue}!important}
        input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
        table{border-collapse:collapse;width:100%}
      `}</style>
      {showSetup&&<SetupModal user={user} setUser={u=>{setUser(u);saveUser(u)}} onClose={()=>setShowSetup(false)}/>}
      {toast&&<div style={S.toast}>{toast}</div>}
      <header style={S.header}>
        <GradBar/>
        <div style={S.hRow}>
          <div style={{display:"flex",alignItems:"center",gap:14}}>
            <TrophySVG size={50}/>
            <div>
              <div style={S.hTitle}>MUNDIAL 2026</div>
              <div style={S.hSub}>FIFA WORLD CUP · USA · MÉXICO · CANADÁ</div>
            </div>
          </div>
          <button style={S.pill} onClick={()=>setShowSetup(true)}>
            <span style={{fontSize:22}}>{FLAGS[user.favTeam]||"👤"}</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:C.text,lineHeight:1.2,fontFamily:"'Barlow Condensed',sans-serif"}}>{user.name||"Mi perfil"}</div>
              {user.favTeam&&<div style={{fontSize:10,color:C.blue,fontWeight:600}}>{user.favTeam}</div>}
            </div>
          </button>
        </div>
      </header>
      <nav style={S.nav}>
        {TABS.map(t=>(
          <button key={t.id} className="nb" style={{...S.navTab,...(tab===t.id?{color:C.green,borderBottomColor:C.green,background:C.greenL}:{})}} onClick={()=>setTab(t.id)}>
            <span style={{fontSize:16}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:900,letterSpacing:.8}}>{t.label}</span>
          </button>
        ))}
      </nav>
      <main style={S.main} className="fi" key={tab}>
        {tab==="home"&&<HomeTab preds={data.predictions||{}} updatePred={updatePred} user={user}/>}
        {tab==="calendar"&&<CalendarTab data={data} setData={setData} showToast={showToast}/>}
        {tab==="groups"&&<GroupsTab data={data} setData={setData}/>}
        {tab==="bracket"&&<BracketTab data={data} setData={setData} showToast={showToast}/>}
        {tab==="ranking"&&<RankingTab data={data} user={user} showToast={showToast}/>}
      </main>
    </div>
  );
}

function SetupModal({user,setUser,onClose}){
  const [name,setName]=useState(user.name||"");
  const [team,setTeam]=useState(user.favTeam||"");
  const [player,setPlayer]=useState(user.favPlayer||"");
  const [tq,setTq]=useState(""); const [pq,setPq]=useState("");
  const [tOpen,setTOpen]=useState(false); const [pOpen,setPOpen]=useState(false);
  const tRef=useRef(); const pRef=useRef();
  useEffect(()=>{
    const h=e=>{
      if(tRef.current&&!tRef.current.contains(e.target))setTOpen(false);
      if(pRef.current&&!pRef.current.contains(e.target))setPOpen(false);
    };
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  const fT=ALL_TEAMS.filter(t=>t.toLowerCase().includes(tq.toLowerCase()));
  const fP=ALL_PLAYERS.filter(p=>p.name.toLowerCase().includes(pq.toLowerCase())||p.team.toLowerCase().includes(pq.toLowerCase()));
  const save=()=>{if(!name.trim())return;setUser({...user,name:name.trim(),favTeam:team,favPlayer:player});onClose()};
  return(
    <div style={S.modalBg}>
      <div style={S.modal}>
        <GradBar/>
        <div style={{padding:"28px 24px"}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><TrophySVG size={80}/></div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,textAlign:"center",color:C.text,letterSpacing:2,marginBottom:2}}>MUNDIAL 2026</div>
          <div style={{fontSize:11,color:C.textM,textAlign:"center",marginBottom:24,letterSpacing:1}}>APP DE PREDICCIONES · WE ARE 26 · 48 EQUIPOS</div>
          <Lbl>TU NOMBRE</Lbl>
          <input style={S.inp} placeholder="¿Cómo te llaman?" value={name} onChange={e=>setName(e.target.value)} onKeyDown={e=>e.key==="Enter"&&save()}/>
          <Lbl mt>TU EQUIPO FAVORITO</Lbl>
          <div style={{position:"relative"}} ref={tRef}>
            <input style={S.inp} placeholder="Busca entre los 48 equipos..." value={team||tq} onChange={e=>{setTq(e.target.value);setTeam("");setTOpen(true)}} onFocus={()=>setTOpen(true)}/>
            {tOpen&&<div style={S.drop}>{fT.slice(0,8).map((t,i)=><div key={i} className="dr" style={S.dRow} onClick={()=>{setTeam(t);setTq("");setTOpen(false)}}><span style={{fontSize:20}}>{FLAGS[t]||"🏳️"}</span><span style={{fontSize:13,fontWeight:600,color:C.text}}>{t}</span></div>)}</div>}
          </div>
          <Lbl mt>TU JUGADOR FAVORITO</Lbl>
          <div style={{position:"relative"}} ref={pRef}>
            <input style={S.inp} placeholder="Busca tu jugador..." value={player||pq} onChange={e=>{setPq(e.target.value);setPlayer("");setPOpen(true)}} onFocus={()=>setPOpen(true)}/>
            {pOpen&&<div style={S.drop}>{fP.slice(0,8).map((p,i)=><div key={i} className="dr" style={S.dRow} onClick={()=>{setPlayer(p.name);setPq("");setPOpen(false)}}><span style={{fontSize:20}}>{p.flag}</span><div><div style={{fontSize:13,fontWeight:600,color:C.text}}>{p.name}</div><div style={{fontSize:10,color:C.textM}}>{p.team}</div></div></div>)}</div>}
          </div>
          <button style={{...S.btnMain,marginTop:22}} onClick={save}>¡EMPEZAR A PREDECIR! →</button>
        </div>
      </div>
    </div>
  );
}

function Lbl({children,mt}){return <div style={{fontSize:10,color:C.textM,fontWeight:700,letterSpacing:1.5,marginBottom:6,marginTop:mt?14:0}}>{children}</div>}

const PRED_CATS=[
  {key:"champion",label:"Campeón Mundial",icon:"🏆",type:"team",color:C.green},
  {key:"surprise_team",label:"Equipo Sorpresa",icon:"⚡",type:"team",color:C.blue},
  {key:"surprise_player",label:"Jugador Sorpresa",icon:"🌟",type:"player",color:C.blue},
  {key:"disappointment_player",label:"Jugador Decepción",icon:"😞",type:"player",color:C.gray},
  {key:"disappointment_team",label:"Equipo Decepción",icon:"💔",type:"team",color:C.gray},
  {key:"top_scorer",label:"Goleador del Torneo",icon:"⚽",type:"player",color:C.green},
  {key:"top_assist",label:"Asistidor del Torneo",icon:"🎯",type:"player",color:C.blue},
  {key:"best_keeper",label:"Portero del Torneo",icon:"🧤",type:"player",color:C.green},
];

function HomeTab({preds,updatePred,user}){
  const filled=PRED_CATS.filter(c=>preds[c.key]).length;
  const pct=Math.round(filled/PRED_CATS.length*100);
  const favFlag=FLAGS[user.favTeam]||"";
  return(
    <div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,overflow:"hidden",marginBottom:16,boxShadow:"0 2px 10px rgba(0,0,0,.06)"}}>
        <div style={{background:`linear-gradient(135deg,${C.greenL},${C.blueL})`,padding:"28px 24px",display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
          <TrophySVG size={88}/>
          <div style={{flex:1,minWidth:180}}>
            <div style={{fontSize:9,letterSpacing:4,color:C.gray,fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,marginBottom:4}}>FIFA WORLD CUP 2026™ · 48 SELECCIONES</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:46,fontWeight:900,color:C.text,letterSpacing:2,lineHeight:.95,marginBottom:8}}>
              {user.name?<><span style={{color:C.gray}}>HOLA,</span><br/><span style={{color:C.green}}>{user.name.toUpperCase()}</span></>:<span style={{color:C.green}}>MIS PREDICCIONES</span>}
            </div>
            {user.favTeam&&<div style={{fontSize:13,color:C.textS}}>{favFlag} {user.favTeam}{user.favPlayer?` · ⭐ ${user.favPlayer}`:""}</div>}
          </div>
        </div>
        <div style={{padding:"14px 24px",borderTop:`1px solid ${C.border}`}}>
          <div style={{display:"flex",justifyContent:"space-between",fontSize:12,color:C.textS,marginBottom:7}}>
            <span>{filled}/{PRED_CATS.length} categorías completadas</span>
            <span style={{fontWeight:700,color:C.green,fontFamily:"'Barlow Condensed',sans-serif",fontSize:16}}>{pct}%</span>
          </div>
          <div style={{background:C.grayL,borderRadius:999,height:8,overflow:"hidden"}}>
            <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${C.green},${C.blue})`,borderRadius:999,transition:"width .6s"}}/>
          </div>
        </div>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(270px,1fr))",gap:12}}>
        {PRED_CATS.map((cat,i)=>(
          <div key={cat.key} className="fi" style={{animationDelay:`${i*.04}s`}}>
            <PredCard cat={cat} value={preds[cat.key]} onSave={v=>updatePred(cat.key,v)}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function PredCard({cat,value,onSave}){
  const [q,setQ]=useState(""); const [open,setOpen]=useState(false);
  const ref=useRef();
  const items=cat.type==="team"?ALL_TEAMS.filter(t=>t.toLowerCase().includes(q.toLowerCase())):ALL_PLAYERS.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.team.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h)},[]);
  const getName=v=>cat.type==="team"?v:(typeof v==="object"?v.name:v);
  const getFlag=v=>cat.type==="team"?(FLAGS[v]||"🏳️"):(typeof v==="object"?v.flag:"⚽");
  return(
    <div className="hvr" ref={ref} style={{background:C.white,border:`1px solid ${C.border}`,borderLeft:`4px solid ${cat.color}`,borderRadius:12,padding:16,boxShadow:"0 1px 5px rgba(0,0,0,.05)"}}>
      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>
        <div style={{width:36,height:36,borderRadius:9,background:bg4(cat.color),border:`1px solid ${cat.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{cat.icon}</div>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:C.text,letterSpacing:.3}}>{cat.label}</span>
      </div>
      {value&&(
        <div style={{background:bg4(cat.color),border:`1px solid ${cat.color}44`,borderRadius:9,padding:"9px 12px",display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
          <span style={{fontSize:24}}>{getFlag(value)}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:C.text}}>{getName(value)}</div>
            {cat.type==="player"&&typeof value==="object"&&<div style={{fontSize:10,color:C.textM}}>{value.team}</div>}
          </div>
          <div style={{width:8,height:8,borderRadius:"50%",background:cat.color}}/>
        </div>
      )}
      <div style={{position:"relative"}}>
        <input style={S.srch} placeholder={`Buscar ${cat.type==="team"?"equipo":"jugador"}...`} value={q} onChange={e=>{setQ(e.target.value);setOpen(true)}} onFocus={()=>setOpen(true)}/>
        {open&&q.length>0&&items.length>0&&(
          <div style={S.drop}>
            {items.slice(0,8).map((item,i)=>{
              const isT=cat.type==="team";
              return(
                <div key={i} className="dr" style={S.dRow} onClick={()=>{onSave(isT?item:item);setQ("");setOpen(false)}}>
                  <span style={{fontSize:20,flexShrink:0}}>{isT?(FLAGS[item]||"🏳️"):item.flag}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:C.text}}>{isT?item:item.name}</div>
                    {!isT&&<div style={{fontSize:10,color:C.textM}}>{item.team}</div>}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function CalendarTab({data,setData,showToast}){
  const [filter,setFilter]=useState("all");
  const res=data.matchResults||{};
  const grps=[...new Set(MATCHES.map(m=>m.group))];
  const shown=filter==="all"?MATCHES:MATCHES.filter(m=>m.group===filter);
  const setR=(id,h,a)=>{setData(d=>({...d,matchResults:{...(d.matchResults||{}),[id]:{home:h,away:a}}}));showToast("⚽ ¡Resultado guardado!")};
  const share=()=>{
    const lines=MATCHES.filter(m=>res[m.id]).slice(0,12).map(m=>`${FLAGS[m.home]||""}${m.home} ${res[m.id].home}-${res[m.id].away} ${m.away}${FLAGS[m.away]||""}`).join("\n");
    navigator.clipboard?.writeText("🏆 Mis picks #Mundial2026:\n\n"+lines+"\n\n"+window.location.href);
    showToast("📋 ¡Copiado!");
  };
  return(
    <div>
      <PH title="Calendario de Partidos" sub={`${Object.keys(res).length} de ${MATCHES.length} predichos · Puntos automáticos`}>
        <button style={S.btnG} onClick={share}>📤 Compartir</button>
      </PH>
      <Div/>
      <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap"}}>
        {[{l:"🏆 Victoria",c:C.green},{l:"🤝 Empate",pts:"1 pt",c:C.blue},{l:"❌ Derrota",pts:"0",c:C.gray}].map((x,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:5,background:C.white,border:`1px solid ${C.border}`,borderRadius:7,padding:"4px 10px",fontSize:11,color:C.textS}}>
            <div style={{width:7,height:7,borderRadius:"50%",background:x.c}}/>{x.l}
          </div>
        ))}
        <div style={{marginLeft:"auto",fontSize:11,color:C.textM}}>Victoria = 3pts · Empate = 1pt · Derrota = 0pts</div>
      </div>
      <div style={{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"}}>
        {["all",...grps].map(g=>(
          <button key={g} style={{...S.fBtn,...(filter===g?{background:C.green,borderColor:C.green,color:"#fff"}:{})}} onClick={()=>setFilter(g)}>{g==="all"?"Todos":`Gr. ${g}`}</button>
        ))}
      </div>
      {shown.map(m=><MatchCard key={m.id} match={m} result={res[m.id]} onSave={(h,a)=>setR(m.id,h,a)}/>)}
    </div>
  );
}

function MatchCard({match,result,onSave}){
  const [h,setH]=useState(result?.home??"");
  const [a,setA]=useState(result?.away??"");
  const gc=GROUPS[match.group]?.color||C.blue;
  const saved=result!==undefined&&result.home!=="";
  return(
    <div className="hvr" style={{background:C.white,border:`1px solid ${C.border}`,borderLeft:`4px solid ${gc}`,borderRadius:12,padding:14,marginBottom:8,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:10,fontWeight:700,padding:"3px 9px",borderRadius:99,background:bg4(gc),color:gc,border:`1px solid ${gc}55`,letterSpacing:.5}}>GRUPO {match.group}</span>
        <span style={{fontSize:11,color:C.textM}}>📅 {match.date} · {match.time}</span>
        <span style={{fontSize:10,color:C.textM}}>📍 {match.venue}</span>
        {saved&&<span style={{marginLeft:"auto",fontSize:10,padding:"2px 8px",borderRadius:99,background:C.greenL,color:C.greenD,fontWeight:700}}>✓ guardado</span>}
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:32}}>{FLAGS[match.home]||"🏳️"}</span>
          <span style={{fontSize:11,fontWeight:600,color:C.textS,textAlign:"center"}}>{match.home}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <input type="number" min={0} max={20} style={{...S.sInp,borderColor:saved?gc:C.border}} value={h} onChange={e=>setH(e.target.value)} placeholder="0"/>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:C.border}}>–</span>
          <input type="number" min={0} max={20} style={{...S.sInp,borderColor:saved?gc:C.border}} value={a} onChange={e=>setA(e.target.value)} placeholder="0"/>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:32}}>{FLAGS[match.away]||"🏳️"}</span>
          <span style={{fontSize:11,fontWeight:600,color:C.textS,textAlign:"center"}}>{match.away}</span>
        </div>
      </div>
      <button style={{marginTop:10,width:"100%",border:"none",borderRadius:9,padding:"10px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:12,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5,background:saved?gc:`linear-gradient(135deg,${C.green},${C.blue})`,transition:"opacity .2s"}}
        onClick={()=>onSave(Number(h),Number(a))}>
        {saved?`✓ ${match.home} ${h}–${a} ${match.away}`:"GUARDAR RESULTADO"}
      </button>
    </div>
  );
}

function GroupsTab({data}){
  const res=data.matchResults||{};
  return(
    <div>
      <PH title="Fase de Grupos" sub="Puntos calculados automáticamente según tus predicciones · 3=Victoria 1=Empate 0=Derrota"/>
      <Div/>
      <div style={{background:C.blueL,border:`1px solid ${C.blue}44`,borderRadius:10,padding:"10px 14px",marginBottom:14,fontSize:12,color:C.blueD}}>
        💡 Ve a <strong>PARTIDOS</strong>, guarda los resultados que predices y la tabla se actualiza sola con los puntos reales.
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(310px,1fr))",gap:14}}>
        {Object.entries(GROUPS).map(([letter,{color}])=>(
          <GroupTable key={letter} letter={letter} color={color} matchResults={res}/>
        ))}
      </div>
    </div>
  );
}

function GroupTable({letter,color,matchResults}){
  const standings=calcStandings(letter,matchResults);
  const medals=["🥇","🥈","🥉","4️⃣"];
  return(
    <div className="hvr" style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:12,overflow:"hidden",boxShadow:"0 1px 5px rgba(0,0,0,.05)"}}>
      <div style={{background:color,padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:18,fontWeight:900,color:"#fff",letterSpacing:1}}>GRUPO {letter}</span>
        <span style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>Top 2 + mejores 3° clasifican</span>
      </div>
      <table style={{fontSize:11}}>
        <thead>
          <tr style={{background:C.bg}}>
            <th style={{padding:"6px 8px",textAlign:"left",color:C.textM,fontWeight:700,width:28}}>#</th>
            <th style={{padding:"6px 4px",textAlign:"left",color:C.textM,fontWeight:700}}>EQUIPO</th>
            <th style={{padding:"6px 5px",textAlign:"center",color:C.textM,fontWeight:700,width:28}}>PJ</th>
            <th style={{padding:"6px 5px",textAlign:"center",color:C.textM,fontWeight:700,width:28}}>G</th>
            <th style={{padding:"6px 5px",textAlign:"center",color:C.textM,fontWeight:700,width:28}}>E</th>
            <th style={{padding:"6px 5px",textAlign:"center",color:C.textM,fontWeight:700,width:28}}>P</th>
            <th style={{padding:"6px 5px",textAlign:"center",color:C.textM,fontWeight:700,width:34}}>DIF</th>
            <th style={{padding:"6px 8px",textAlign:"center",color:C.textM,fontWeight:700,width:36}}>PTS</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row,i)=>(
            <tr key={row.team} style={{background:i<2?bg4(color):"transparent",borderBottom:`1px solid ${C.borderL}`}}>
              <td style={{padding:"7px 8px",textAlign:"center",fontSize:15}}>{medals[i]}</td>
              <td style={{padding:"7px 4px"}}>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  <span style={{fontSize:17}}>{FLAGS[row.team]||"🏳️"}</span>
                  <span style={{fontSize:11,fontWeight:i<2?700:400,color:i<2?C.text:C.textS}}>{row.team}</span>
                </div>
              </td>
              <td style={{padding:"7px 5px",textAlign:"center",color:C.textS}}>{row.pj}</td>
              <td style={{padding:"7px 5px",textAlign:"center",color:C.green,fontWeight:700}}>{row.g}</td>
              <td style={{padding:"7px 5px",textAlign:"center",color:C.gray}}>{row.e}</td>
              <td style={{padding:"7px 5px",textAlign:"center",color:"#E53935"}}>{row.p}</td>
              <td style={{padding:"7px 5px",textAlign:"center",color:row.dif>0?C.green:row.dif<0?"#E53935":C.gray,fontWeight:700}}>{row.dif>0?"+":""}{row.dif}</td>
              <td style={{padding:"7px 8px",textAlign:"center"}}>
                <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:17,fontWeight:900,color:i<2?color:C.gray}}>{row.pts}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BracketTab({data,setData,showToast}){
  const br=data.bracket||{};
  const res=data.matchResults||{};
  const ranked=(g,pos)=>{const st=calcStandings(g,res);return st[pos]?.team||`${pos===0?"1°":"2°"} Gr.${g}`;};
  const g1=g=>ranked(g,0); const g2=g=>ranked(g,1);
  const pick=(id,w)=>{setData(d=>({...d,bracket:{...(d.bracket||{}),[id]:w}}));showToast(`✅ ${w} avanza!`)};

  const avos=[
    {id:"a1",home:g1("A"),away:g2("C"),label:"P1"},
    {id:"a2",home:g1("B"),away:g2("D"),label:"P2"},
    {id:"a3",home:g1("C"),away:g2("A"),label:"P3"},
    {id:"a4",home:g1("D"),away:g2("B"),label:"P4"},
    {id:"a5",home:g1("E"),away:g2("G"),label:"P5"},
    {id:"a6",home:g1("F"),away:g2("H"),label:"P6"},
    {id:"a7",home:g1("G"),away:g2("E"),label:"P7"},
    {id:"a8",home:g1("H"),away:g2("F"),label:"P8"},
    {id:"a9",home:g1("I"),away:g2("K"),label:"P9"},
    {id:"a10",home:g1("J"),away:g2("L"),label:"P10"},
    {id:"a11",home:g1("K"),away:g2("I"),label:"P11"},
    {id:"a12",home:g1("L"),away:g2("J"),label:"P12"},
    {id:"a13",home:"Mejor 3° A/B/C",away:"Mejor 3° D/E/F",label:"P13"},
    {id:"a14",home:"Mejor 3° G/H/I",away:"Mejor 3° J/K/L",label:"P14"},
    {id:"a15",home:"Mejor 3° A/C/D",away:"Mejor 3° B/E/F",label:"P15"},
    {id:"a16",home:"Mejor 3° G/I/J",away:"Mejor 3° H/K/L",label:"P16"},
  ];
  const octavos=[
    {id:"o1",home:br.a1||"?",away:br.a2||"?"},
    {id:"o2",home:br.a3||"?",away:br.a4||"?"},
    {id:"o3",home:br.a5||"?",away:br.a6||"?"},
    {id:"o4",home:br.a7||"?",away:br.a8||"?"},
    {id:"o5",home:br.a9||"?",away:br.a10||"?"},
    {id:"o6",home:br.a11||"?",away:br.a12||"?"},
    {id:"o7",home:br.a13||"?",away:br.a14||"?"},
    {id:"o8",home:br.a15||"?",away:br.a16||"?"},
  ];
  const cuartos=[
    {id:"c1",home:br.o1||"?",away:br.o2||"?"},
    {id:"c2",home:br.o3||"?",away:br.o4||"?"},
    {id:"c3",home:br.o5||"?",away:br.o6||"?"},
    {id:"c4",home:br.o7||"?",away:br.o8||"?"},
  ];
  const semis=[
    {id:"s1",home:br.c1||"?",away:br.c2||"?"},
    {id:"s2",home:br.c3||"?",away:br.c4||"?"},
  ];
  const f3={id:"t3",home:br.s1_l||"?",away:br.s2_l||"?"};
  const fn={id:"fin",home:br.s1||"?",away:br.s2||"?"};
  const champ=br.fin||null;

  const rounds=[
    {label:"16AVOS DE FINAL",icon:"⚡",color:C.blue,matches:avos,cols:2,note:"16 partidos — Round of 32"},
    {label:"OCTAVOS DE FINAL",icon:"🔵",color:C.blue,matches:octavos,cols:2,note:"8 partidos — Round of 16"},
    {label:"CUARTOS DE FINAL",icon:"🟢",color:C.green,matches:cuartos,cols:2,note:"4 partidos"},
    {label:"SEMIFINALES",icon:"🔶",color:C.gray,matches:semis,cols:2,note:"2 partidos"},
    {label:"TERCER LUGAR",icon:"🥉",color:C.gray,matches:[f3],cols:1,note:"3° y 4° puesto"},
    {label:"GRAN FINAL",icon:"🏆",color:C.green,matches:[fn],cols:1,isFinal:true,note:"El campeón"},
  ];

  return(
    <div>
      <PH title="Bracket del Mundial" sub="16avos → Octavos → Cuartos → Semis → Final"/>
      <Div/>
      {champ&&(
        <div className="champ" style={{background:C.greenL,border:`2px solid ${C.green}`,borderRadius:16,padding:20,display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:20,flexWrap:"wrap"}}>
          <TrophySVG size={50}/>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:10,letterSpacing:4,color:C.gray}}>MI CAMPEÓN MUNDIAL 2026</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:900,color:C.green,letterSpacing:2}}>{FLAGS[champ]||""} {champ}</div>
            <div style={{fontSize:9,color:C.textM,letterSpacing:2}}>WE ARE 26 · FIFA WORLD CUP™</div>
          </div>
          <TrophySVG size={50}/>
        </div>
      )}
      {rounds.map(r=>(
        <div key={r.label} style={{marginBottom:24}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{height:3,width:20,background:r.color,borderRadius:2}}/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:900,color:r.color,letterSpacing:1.5}}>{r.icon} {r.label}</span>
            <div style={{flex:1,height:1,background:C.border}}/>
            <span style={{fontSize:10,color:C.textM,background:C.grayL,padding:"2px 8px",borderRadius:99,border:`1px solid ${C.border}`}}>{r.note}</span>
          </div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${r.cols},1fr)`,gap:8}}>
            {r.matches.map(m=>(
              <div key={m.id} style={{background:C.white,border:`1px solid ${r.isFinal?r.color:C.border}`,borderRadius:10,padding:10,display:"flex",flexDirection:"column",gap:4,boxShadow:"0 1px 4px rgba(0,0,0,.04)"}}>
                {m.label&&<div style={{fontSize:10,color:C.textM,fontWeight:700,marginBottom:2}}>{m.label}</div>}
                {[m.home,m.away].map((team,ti)=>{
                  const na=!team||team==="?"||team.startsWith("Mejor");
                  const win=br[m.id]===team;
                  return(
                    <button key={ti} className="bkt" style={{display:"flex",alignItems:"center",gap:8,padding:"9px 10px",background:win?bg4(r.color):(na?C.grayL:C.bg),border:`1px solid ${win?r.color:C.border}`,borderRadius:8,cursor:na?"default":"pointer",fontFamily:"'Barlow',sans-serif",width:"100%",transition:"all .2s",opacity:na?.35:1}}
                      onClick={()=>!na&&pick(m.id,team)}>
                      <span style={{fontSize:17}}>{FLAGS[team]||(team==="?"?"❓":"🏳️")}</span>
                      <span style={{fontSize:12,fontWeight:win?700:500,flex:1,textAlign:"left",color:win?r.color:C.text}}>{team||"Por definir"}</span>
                      {win&&<span style={{fontSize:9,color:r.color,fontWeight:700,background:bg4(r.color),padding:"2px 6px",borderRadius:99}}>✓ AVANZA</span>}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingTab({data,user,showToast}){
  const preds=data.predictions||{};
  const filled=PRED_CATS.filter(c=>preds[c.key]).length;
  const matches=Object.keys(data.matchResults||{}).length;
  const bracketPicks=Object.keys(data.bracket||{}).length;
  const favFlag=FLAGS[user.favTeam]||"⚽";
  const share=()=>{
    const txt=`🏆 Mis predicciones #Mundial2026\n👤 ${user.name}${user.favTeam?`\n${favFlag} ${user.favTeam}`:""}${user.favPlayer?`\n⭐ ${user.favPlayer}`:""}\n\n📊 ${filled}/${PRED_CATS.length} categorías · ${matches} partidos\n🔗 ${window.location.href}`;
    navigator.clipboard?.writeText(txt);showToast("📋 ¡Copiado!");
  };
  return(
    <div>
      <PH title="Mi Perfil y Ranking" sub="Tus predicciones y estadísticas"><button style={S.btnG} onClick={share}>📤 Compartir</button></PH>
      <Div/>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:20,marginBottom:12,boxShadow:"0 1px 5px rgba(0,0,0,.05)"}}>
        <div style={{display:"flex",alignItems:"center",gap:16,marginBottom:16}}>
          <div style={{width:54,height:54,borderRadius:"50%",background:C.greenL,border:`2px solid ${C.green}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>{favFlag||"👤"}</div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:C.text,letterSpacing:1}}>{user.name||"Sin nombre"}</div>
            {user.favTeam&&<div style={{fontSize:12,color:C.textM}}>{favFlag} {user.favTeam}{user.favPlayer?` · ⭐ ${user.favPlayer}`:""}</div>}
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[{n:filled,l:"Categorías",c:C.green,bg:C.greenL},{n:matches,l:"Partidos",c:C.blue,bg:C.blueL},{n:bracketPicks,l:"Bracket",c:C.gray,bg:C.grayL}].map(s=>(
            <div key={s.l} style={{flex:1,background:s.bg,border:`1px solid ${s.c}44`,borderRadius:10,padding:"12px 0",textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:s.c}}>{s.n}</div>
              <div style={{fontSize:10,color:C.textM}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:18,marginBottom:12,boxShadow:"0 1px 5px rgba(0,0,0,.05)"}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,color:C.text,letterSpacing:1.5,marginBottom:14}}>MIS PREDICCIONES</div>
        {PRED_CATS.map(cat=>{
          const val=preds[cat.key];
          const name=val?(cat.type==="team"?val:(typeof val==="object"?val.name:val)):null;
          const flag=val?(cat.type==="team"?(FLAGS[val]||"🏳️"):(typeof val==="object"?val.flag:"⚽")):null;
          return(
            <div key={cat.key} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 10px",borderBottom:`1px solid ${C.borderL}`,borderLeft:`4px solid ${val?cat.color:C.border}`,marginBottom:3,borderRadius:"0 6px 6px 0",background:val?bg4(cat.color):"transparent"}}>
              <span style={{fontSize:18}}>{cat.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:C.textM,fontWeight:700,letterSpacing:.5}}>{cat.label.toUpperCase()}</div>
                <div style={{fontSize:13,fontWeight:600,color:val?C.text:C.border}}>{val?<span>{flag} {name}</span>:"Sin predicción"}</div>
              </div>
              <div style={{width:8,height:8,borderRadius:"50%",background:val?cat.color:C.border}}/>
            </div>
          );
        })}
      </div>
      <div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,overflow:"hidden",boxShadow:"0 1px 5px rgba(0,0,0,.05)"}}>
        <div style={{height:5,background:`linear-gradient(90deg,${C.green},${C.blue},${C.gray})`}}/>
        <div style={{padding:24,textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:10}}>👥⚽</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:C.text,letterSpacing:2,marginBottom:4}}>INVITA A TUS AMIGOS</div>
          <div style={{fontSize:13,color:C.textM,marginBottom:18}}>Comparte el link y comparen sus predicciones</div>
          <button style={{...S.btnMain,maxWidth:300,margin:"0 auto"}} onClick={share}>📤 COPIAR LINK DE INVITACIÓN</button>
        </div>
      </div>
    </div>
  );
}

function PH({title,sub,children}){
  return(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:12}}>
      <div>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:28,fontWeight:900,color:C.text,letterSpacing:1.5}}>{title}</div>
        {sub&&<div style={{fontSize:11,color:C.textM,marginTop:2}}>{sub}</div>}
      </div>
      {children}
    </div>
  );
}

const S={
  app:{minHeight:"100vh",background:C.bg,fontFamily:"'Barlow','Trebuchet MS',sans-serif",color:C.text,overflowX:"hidden"},
  header:{background:C.white,borderBottom:`1px solid ${C.border}`,position:"sticky",top:0,zIndex:100,boxShadow:"0 2px 10px rgba(0,0,0,.06)"},
  hRow:{maxWidth:960,margin:"0 auto",padding:"12px 16px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:12},
  hTitle:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:C.text,letterSpacing:3,lineHeight:1},
  hSub:{fontSize:9,color:C.textM,letterSpacing:2,marginTop:2},
  pill:{background:C.bg,border:`1px solid ${C.border}`,borderRadius:10,padding:"7px 14px",display:"flex",alignItems:"center",gap:10,cursor:"pointer",transition:"all .2s"},
  nav:{background:C.white,borderBottom:`1px solid ${C.border}`,display:"flex",overflowX:"auto",position:"sticky",top:74,zIndex:99,boxShadow:"0 1px 4px rgba(0,0,0,.04)"},
  navTab:{background:"none",border:"none",borderBottom:"3px solid transparent",padding:"12px 14px",color:C.textM,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,minWidth:64,transition:"all .2s",fontFamily:"'Barlow Condensed',sans-serif"},
  main:{maxWidth:960,margin:"0 auto",padding:"20px 14px 56px"},
  inp:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"11px 14px",color:C.text,fontSize:13,outline:"none",display:"block",marginBottom:2,transition:"border-color .2s"},
  srch:{width:"100%",background:C.bg,border:`1px solid ${C.border}`,borderRadius:9,padding:"9px 12px",color:C.text,fontSize:13,outline:"none",transition:"border-color .2s"},
  drop:{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,zIndex:200,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,maxHeight:220,overflowY:"auto",boxShadow:"0 8px 24px rgba(0,0,0,.12)"},
  dRow:{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",cursor:"pointer",borderBottom:`1px solid ${C.borderL}`},
  fBtn:{background:C.white,border:`1px solid ${C.border}`,borderRadius:7,padding:"5px 11px",color:C.textS,cursor:"pointer",fontSize:11,fontWeight:700,letterSpacing:.5,fontFamily:"'Barlow Condensed',sans-serif",transition:"all .2s"},
  sInp:{width:48,height:48,background:C.bg,border:"2px solid",borderRadius:9,color:C.green,fontSize:20,fontWeight:900,textAlign:"center",outline:"none",fontFamily:"'Barlow Condensed',sans-serif",transition:"border-color .2s"},
  btnMain:{display:"block",background:`linear-gradient(135deg,${C.green},${C.blue})`,border:"none",borderRadius:10,padding:"13px 20px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:13,width:"100%",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1},
  btnG:{background:C.green,border:"none",borderRadius:8,padding:"9px 16px",color:"#fff",fontWeight:700,cursor:"pointer",fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5,boxShadow:`0 2px 8px ${C.green}44`},
  modalBg:{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20,overflowY:"auto"},
  modal:{background:C.white,border:`1px solid ${C.border}`,borderRadius:16,maxWidth:400,width:"100%",overflow:"hidden",boxShadow:"0 24px 60px rgba(0,0,0,.18)"},
  toast:{position:"fixed",bottom:24,left:"50%",transform:"translateX(-50%)",background:C.text,color:"#fff",padding:"10px 22px",borderRadius:999,fontWeight:600,fontSize:13,zIndex:9999,boxShadow:"0 6px 20px rgba(0,0,0,.2)",whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif"},
};
