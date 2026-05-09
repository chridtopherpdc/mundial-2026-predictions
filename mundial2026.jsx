import { useState, useEffect, useRef } from "react";

const FIFA_COLORS = {
  red:"#E8262D", green:"#00A651", blue:"#0066B3", yellow:"#FDD835",
  purple:"#7B3FA0", orange:"#F47920", pink:"#EE2E7C", teal:"#00AEAC",
  black:"#0A0A0A", white:"#FFFFFF",
};
const RAINBOW = [FIFA_COLORS.red,FIFA_COLORS.orange,FIFA_COLORS.yellow,FIFA_COLORS.green,FIFA_COLORS.teal,FIFA_COLORS.blue,FIFA_COLORS.purple,FIFA_COLORS.pink];

const GROUPS = {
  A:{teams:["México","Ecuador","Croacia","Marruecos"],color:FIFA_COLORS.red},
  B:{teams:["España","Turquía","Senegal","Serbia"],color:FIFA_COLORS.blue},
  C:{teams:["Alemania","Japón","Costa Rica","Eslovenia"],color:FIFA_COLORS.green},
  D:{teams:["Portugal","Italia","Uruguay","Arabia Saudita"],color:FIFA_COLORS.orange},
  E:{teams:["Francia","Polonia","Australia","Nigeria"],color:FIFA_COLORS.purple},
  F:{teams:["Argentina","Chile","Eslovaquia","China"],color:FIFA_COLORS.teal},
  G:{teams:["Brasil","Colombia","Argelia","Nueva Zelanda"],color:FIFA_COLORS.yellow},
  H:{teams:["Inglaterra","Países Bajos","Ghana","Panamá"],color:FIFA_COLORS.pink},
  I:{teams:["Estados Unidos","Canadá","Venezuela","Georgia"],color:FIFA_COLORS.red},
  J:{teams:["Bélgica","Suiza","Camerún","Tanzania"],color:FIFA_COLORS.blue},
  K:{teams:["Corea del Sur","Irán","Kenia","Guatemala"],color:FIFA_COLORS.green},
  L:{teams:["Perú","República Checa","Indonesia","Bosnia"],color:FIFA_COLORS.orange},
};

const FLAGS = {
  "México":"🇲🇽","Ecuador":"🇪🇨","Croacia":"🇭🇷","Marruecos":"🇲🇦",
  "España":"🇪🇸","Turquía":"🇹🇷","Senegal":"🇸🇳","Serbia":"🇷🇸",
  "Alemania":"🇩🇪","Japón":"🇯🇵","Costa Rica":"🇨🇷","Eslovenia":"🇸🇮",
  "Portugal":"🇵🇹","Italia":"🇮🇹","Uruguay":"🇺🇾","Arabia Saudita":"🇸🇦",
  "Francia":"🇫🇷","Polonia":"🇵🇱","Australia":"🇦🇺","Nigeria":"🇳🇬",
  "Argentina":"🇦🇷","Chile":"🇨🇱","Eslovaquia":"🇸🇰","China":"🇨🇳",
  "Brasil":"🇧🇷","Colombia":"🇨🇴","Argelia":"🇩🇿","Nueva Zelanda":"🇳🇿",
  "Inglaterra":"🏴󠁧󠁢󠁥󠁮󠁧󠁿","Países Bajos":"🇳🇱","Ghana":"🇬🇭","Panamá":"🇵🇦",
  "Estados Unidos":"🇺🇸","Canadá":"🇨🇦","Venezuela":"🇻🇪","Georgia":"🇬🇪",
  "Bélgica":"🇧🇪","Suiza":"🇨🇭","Camerún":"🇨🇲","Tanzania":"🇹🇿",
  "Corea del Sur":"🇰🇷","Irán":"🇮🇷","Kenia":"🇰🇪","Guatemala":"🇬🇹",
  "Perú":"🇵🇪","República Checa":"🇨🇿","Indonesia":"🇮🇩","Bosnia":"🇧🇦",
};

const PLAYERS_BY_TEAM = {
  "Portugal":["Cristiano Ronaldo","Bruno Fernandes","Rúben Dias","João Cancelo","Rafael Leão","Bernardo Silva","Diogo Costa","Vitinha","Otávio","Pedro Neto","Diogo Jota"],
  "España":["Pedri","Gavi","Lamine Yamal","Álvaro Morata","Unai Simón","Dani Carvajal","Rodri","Nico Williams","Mikel Merino","Joselu","Nacho"],
  "Francia":["Kylian Mbappé","Antoine Griezmann","Olivier Giroud","Paul Pogba","Kingsley Coman","Theo Hernández","Mike Maignan","Eduardo Camavinga","Aurélien Tchouaméni","Marcus Thuram","Ousmane Dembélé"],
  "Argentina":["Lionel Messi","Ángel Di María","Lautaro Martínez","Rodrigo De Paul","Emiliano Martínez","Nicolás Otamendi","Alexis Mac Allister","Julián Álvarez","Paulo Dybala","Leandro Paredes","Nahuel Molina"],
  "Brasil":["Vinicius Jr.","Neymar Jr.","Rodrygo","Casemiro","Alisson Becker","Marquinhos","Endrick","Raphinha","Lucas Paquetá","Gabriel Martinelli","Éder Militão"],
  "Alemania":["Manuel Neuer","Thomas Müller","Jamal Musiala","Kai Havertz","Toni Kroos","Joshua Kimmich","Florian Wirtz","İlkay Gündoğan","Leroy Sané","Niclas Füllkrug","Antonio Rüdiger"],
  "Inglaterra":["Harry Kane","Jude Bellingham","Bukayo Saka","Phil Foden","Jordan Pickford","Declan Rice","Trent Alexander-Arnold","Marcus Rashford","Jack Grealish","Raheem Sterling","John Stones"],
  "Italia":["Gianluigi Donnarumma","Federico Chiesa","Nicolò Barella","Lorenzo Pellegrini","Giorgio Scalvini","Giacomo Raspadori","Ciro Immobile","Marco Verratti","Alessandro Bastoni","Matteo Darmian","Federico Dimarco"],
  "México":["Guillermo Ochoa","Hirving Lozano","Raúl Jiménez","Edson Álvarez","Andrés Guardado","Carlos Vela","Orbelin Pineda","Roberto Alvarado","Alexis Vega","Henry Martín","Johan Vásquez"],
  "Uruguay":["Luis Suárez","Darwin Núñez","Federico Valverde","José María Giménez","Sergio Rochet","Ronald Araújo","Rodrigo Bentancur","Edinson Cavani","Matías Vecino","Facundo Pellistri","Maximiliano Gómez"],
  "Países Bajos":["Virgil van Dijk","Memphis Depay","Frenkie de Jong","Cody Gakpo","Xavi Simons","Wout Weghorst","Jurriën Timber","Denzel Dumfries","Ryan Gravenberch","Davy Klaassen","Steven Bergwijn"],
  "Bélgica":["Kevin De Bruyne","Romelu Lukaku","Thibaut Courtois","Eden Hazard","Jan Vertonghen","Axel Witsel","Yannick Carrasco","Dries Mertens","Leandro Trossard","Charles De Ketelaere","Loïs Openda"],
  "Croacia":["Luka Modrić","Ivan Perišić","Mateo Kovačić","Dominik Livaković","Dejan Lovren","Marcelo Brozović","Andrej Kramarić","Bruno Petković","Joško Gvardiol","Borna Sosa","Nikola Vlašić"],
  "Colombia":["James Rodríguez","Falcao García","David Ospina","Luis Díaz","Juan Cuadrado","Yerry Mina","Duván Zapata","Mateus Uribe","Edwin Cardona","Miguel Ángel Borja","Rafael Santos Borré"],
  "Corea del Sur":["Son Heung-min","Kim Min-jae","Lee Kang-in","Hwang Hee-chan","Cho Gue-sung","Oh Hyeon-gyu","Jung Woo-young","Kim Young-gwon","Hwang In-beom","Kim Jin-su","Lee Jae-sung"],
  "Japón":["Takumi Minamino","Wataru Endo","Daichi Kamada","Shuichi Gonda","Takehiro Tomiyasu","Ko Itakura","Ritsu Doan","Ao Tanaka","Kaoru Mitoma","Junya Ito","Hiroki Sakai"],
  "Marruecos":["Hakim Ziyech","Achraf Hakimi","Romain Saïss","Yassine Bounou","Sofiane Boufal","Azzedine Ounahi","Youssef En-Nesyri","Noussair Mazraoui","Jawad El Yamiq","Walid Cheddira","Selim Amallah"],
  "Senegal":["Sadio Mané","Kalidou Koulibaly","Edouard Mendy","Ismaila Sarr","Cheikhou Kouyaté","Pape Gueye","Idrissa Gueye","Boulaye Dia","Nicolas Jackson","Lamine Camara","Nampalys Mendy"],
  "Ecuador":["Enner Valencia","Moisés Caicedo","Piero Hincapié","Byron Castillo","Hernán Galíndez","Ángel Mena","Jeremy Sarmiento","Pervis Estupiñán","Gonzalo Plata","Michael Estrada","José Cifuentes"],
  "Australia":["Mathew Ryan","Aaron Mooy","Mathew Leckie","Awer Mabil","Mitchell Duke","Jackson Irvine","Jamie Maclaren","Brad Smith","Ajdin Hrustic","Harry Souttar","Martin Boyle"],
  "Ghana":["Thomas Partey","Mohammed Salisu","Jordan Ayew","André Ayew","Joseph Wollacott","Alexander Djiku","Kamaldeen Sulemana","Inaki Williams","Daniel Amartey","Osman Bukari","Mohammed Kudus"],
  "Polonia":["Robert Lewandowski","Wojciech Szczęsny","Piotr Zieliński","Kamil Glik","Grzegorz Krychowiak","Arkadiusz Milik","Bartosz Bereszyński","Matty Cash","Jakub Moder","Sebastian Szymański","Karol Świderski"],
  "Serbia":["Aleksandar Mitrović","Dušan Tadić","Dušan Vlahović","Predrag Rajković","Nikola Milenković","Nemanja Gudelj","Filip Kostić","Andrija Živković","Ivan Ilić","Saša Lukić","Strahinja Pavlović"],
  "Turquía":["Çağlar Söyüncü","Hakan Çalhanoğlu","Arda Güler","Kenan Yıldız","Altay Bayındır","Merih Demiral","Zeki Çelik","Yusuf Yazıcı","Orkun Kökçü","Barış Alper Yılmaz","Serdar Dursun"],
  "Arabia Saudita":["Salem Al-Dawsari","Mohammed Al-Owais","Saleh Al-Shehri","Yasser Al-Shahrani","Ali Al-Bulayhi","Sami Al-Najei","Firas Al-Buraikan","Abdulelah Al-Malki","Hassan Al-Tambakti","Mohammed Kanno","Riyadh Sharahili"],
  "Estados Unidos":["Christian Pulisic","Tyler Adams","Weston McKennie","Josh Sargent","Zack Steffen","Miles Robinson","Yunus Musah","Gio Reyna","Brenden Aaronson","Ricardo Pepi","Sergiño Dest"],
  "Canadá":["Alphonso Davies","Jonathan David","Cyle Larin","Milan Borjan","Atiba Hutchinson","Junior Hoilett","Stephen Eustáquio","Tajon Buchanan","Jonathan Osorio","Mark-Anthony Kaye","Liam Fraser"],
  "Chile":["Alexis Sánchez","Arturo Vidal","Claudio Bravo","Gary Medel","Ben Brereton","Charles Aránguiz","Marcelo Díaz","Sebastián Vegas","Felipe Mora","Paulo Díaz","Eugenio Mena"],
  "Perú":["Paolo Guerrero","André Carrillo","Pedro Gallese","Renato Tapia","Christian Cueva","Edison Flores","Gianluca Lapadula","Luis Advíncula","Carlos Zambrano","Sergio Peña","Alexander Callens"],
  "Nigeria":["Victor Osimhen","Wilfred Ndidi","Ahmed Musa","Francis Uzoho","Leon Balogun","Alex Iwobi","Emmanuel Dennis","Kelechi Iheanacho","Oghenekaro Etebo","Samuel Chukwueze","Joe Aribo"],
  "Argelia":["Riyad Mahrez","Islam Slimani","Yacine Brahimi","Aïssa Mandi","Raïs M'Bolhi","Ismaël Bennacer","Djamel Benlamri","Adam Ounas","Sofiane Feghouli","Haris Belkebla","Said Benrahma"],
  "Irán":["Mehdi Taremi","Alireza Beiranvand","Sardar Azmoun","Saman Ghoddos","Milad Mohammadi","Majid Hosseini","Karim Ansarifard","Ali Gholizadeh","Ehsan Hajsafi","Morteza Pouraliganji","Ramin Rezaeian"],
  "Bosnia":["Edin Džeko","Miralem Pjanić","Asmir Begović","Rade Krunic","Sead Kolašinac","Ermedin Demirović","Armin Hodžić","Vedad Ibišević","Haris Duljevic","Deni Jurić","Sven Botman"],
  "Costa Rica":["Keylor Navas","Bryan Ruiz","Joel Campbell","Celso Borges","Francisco Calvo","Kendall Waston","Marco Ureña","David Guzmán","Ronald Matarrita","Álvaro Zamora","Manfred Ugalde"],
  "Eslovenia":["Jan Oblak","Benjamin Šeško","Josip Iličić","Jaka Bijol","Jon Gorenc Stanković","Miha Blažič","Andraž Šporar","Adam Gnezda Čerin","Timi Elsnik","Petar Stojanović","Rene Krhin"],
  "Eslovaquia":["Milan Škriniar","Stanislav Lobotka","Lukáš Haraslín","Martin Dúbravka","Ján Greguš","Róbert Boženík","Ondrej Duda","Dávid Hancko","Peter Pekarík","Tomáš Suslov","Marek Hamšík"],
  "República Checa":["Tomáš Souček","Vladimír Coufal","Patrik Schick","Jiří Pavlenka","Ondřej Kolář","Lukáš Masopust","Jakub Jankto","Matěj Vydra","Ladislav Krejčí","David Zima","Tomáš Holeš"],
  "Suiza":["Xherdan Shaqiri","Granit Xhaka","Manuel Akanji","Breel Embolo","Yann Sommer","Remo Freuler","Ricardo Rodríguez","Denis Zakaria","Haris Seferović","Fabian Schär","Steven Zuber"],
  "Camerún":["Eric Maxim Choupo-Moting","André Onana","Vincent Aboubakar","Karl Toko Ekambi","Michael Ngadeu-Ngadjui","Jean-Charles Castelletto","Nicolas Moumi Ngamaleu","Zambo Anguissa","Martin Hongla","Stéphane Bahoken","Pierre Kunde"],
  "Georgia":["Giorgi Mamardashvili","Khvicha Kvaratskhelia","Georges Mikautadze","Guram Kashia","Otar Kakabadze","Giorgi Chakvetadze","Levan Shengelia","Saba Lobjanidze","Giorgi Arabidze","Lasha Dvali","Giorgi Loria"],
  "Venezuela":["Salomón Rondón","Yangel Herrera","Darwin Machís","Wuilker Faríñez","Tomás Rincón","Yeferson Soteldo","Roberto Rosales","Jhon Murillo","Junior Moreno","Christian Makoun","Eric Ramírez"],
  "Indonesia":["Marcelino Ferdinan","Egy Maulana Vikri","Witan Sulaeman","Ernando Ari","Justin Hubner","Pratama Arhan","Rafael Struick","Nathan Tjoe-A-On","Kevin Diks","Jay Idzes","Marc Klok"],
  "China":["Wu Lei","Jiang Guangtai","Yan Junling","Xu Xin","Liu Yang","Jin Jingdao","Zhang Linpeng","Zheng Long","Wei Shihao","Hao Junmin","Luo Guofu"],
  "Tanzania":["Mbwana Samatta","Nizar Khalfan","Simon Msuva","Aishi Manula","Shomari Kapombe","Thomas Ulimwengu","Dickson Job","Yusuf Msuya","John Bocco","Bernard Morrison","Emmanuel Okwi"],
  "Kenia":["Michael Olunga","Ayub Timbe","Victor Wanyama","Patrick Matasi","Joash Onyango","Cliff Nyakeya","Kenneth Muguna","Francis Kahata","Lawrence Juma","David Owino","Eric Johanna"],
  "Guatemala":["José Contreras","Rubio Rubín","Kevin Hernández","José Pinto","Marcos Figueroa","Jonathan González","Oscar Castellanos","Darwin Lom","Luis Martínez","Eloy Room","Carlos Ruiz"],
  "Nueva Zelanda":["Chris Wood","Ryan Thomas","Liberato Cacace","Stefan Marinovic","Winston Reid","Sander van Hoeven","Oli Sail","Kosta Barbarouses","Marco Rojas","Matthew Ridenton","Dane Ingham"],
  "Panamá":["Rolando Blackburn","Roderick Miller","Anibal Godoy","Fidel Escobar","Abdiel Arroyo","Édgar Bárcenas","José Fajardo","Adalberto Carrasquilla","Alberto Quintero","Valentín Pimentel","Harold Cummings"],
};

const ALL_PLAYERS = Object.entries(PLAYERS_BY_TEAM).flatMap(([team,players])=>players.map(p=>({name:p,team,flag:FLAGS[team]||"🏳️"})));
const ALL_TEAMS = Object.values(GROUPS).flatMap(g=>g.teams);

const MATCHES = [
  {id:1,group:"A",home:"México",away:"Marruecos",date:"11 Jun",time:"18:00",venue:"SoFi Stadium, LA"},
  {id:2,group:"A",home:"Croacia",away:"Ecuador",date:"11 Jun",time:"21:00",venue:"MetLife, NY"},
  {id:3,group:"A",home:"México",away:"Croacia",date:"15 Jun",time:"18:00",venue:"AT&T, Dallas"},
  {id:4,group:"A",home:"Ecuador",away:"Marruecos",date:"15 Jun",time:"21:00",venue:"Levi's, SF"},
  {id:5,group:"A",home:"Ecuador",away:"México",date:"19 Jun",time:"18:00",venue:"Azteca, CDMX"},
  {id:6,group:"A",home:"Marruecos",away:"Croacia",date:"19 Jun",time:"18:00",venue:"BC Place, Vancouver"},
  {id:7,group:"B",home:"España",away:"Serbia",date:"12 Jun",time:"15:00",venue:"MetLife, NY"},
  {id:8,group:"B",home:"Turquía",away:"Senegal",date:"12 Jun",time:"18:00",venue:"Arrowhead, KC"},
  {id:9,group:"B",home:"España",away:"Turquía",date:"16 Jun",time:"15:00",venue:"Rose Bowl, LA"},
  {id:10,group:"B",home:"Serbia",away:"Senegal",date:"16 Jun",time:"18:00",venue:"Gillette, Boston"},
  {id:11,group:"B",home:"España",away:"Senegal",date:"20 Jun",time:"18:00",venue:"Hard Rock, Miami"},
  {id:12,group:"B",home:"Serbia",away:"Turquía",date:"20 Jun",time:"18:00",venue:"NRG, Houston"},
  {id:13,group:"C",home:"Alemania",away:"Eslovenia",date:"12 Jun",time:"21:00",venue:"Levi's, SF"},
  {id:14,group:"C",home:"Japón",away:"Costa Rica",date:"13 Jun",time:"12:00",venue:"Empower, Denver"},
  {id:15,group:"C",home:"Alemania",away:"Japón",date:"17 Jun",time:"15:00",venue:"Lincoln Financial, Philly"},
  {id:16,group:"C",home:"Costa Rica",away:"Eslovenia",date:"17 Jun",time:"18:00",venue:"Akron, GDL"},
  {id:17,group:"C",home:"Alemania",away:"Costa Rica",date:"21 Jun",time:"18:00",venue:"BC Place, Vancouver"},
  {id:18,group:"C",home:"Eslovenia",away:"Japón",date:"21 Jun",time:"18:00",venue:"SoFi, LA"},
  {id:19,group:"D",home:"Portugal",away:"Italia",date:"13 Jun",time:"15:00",venue:"Hard Rock, Miami"},
  {id:20,group:"D",home:"Uruguay",away:"Arabia Saudita",date:"13 Jun",time:"18:00",venue:"AT&T, Dallas"},
  {id:21,group:"D",home:"Portugal",away:"Uruguay",date:"17 Jun",time:"21:00",venue:"MetLife, NY"},
  {id:22,group:"D",home:"Arabia Saudita",away:"Italia",date:"18 Jun",time:"12:00",venue:"Arrowhead, KC"},
  {id:23,group:"D",home:"Portugal",away:"Arabia Saudita",date:"22 Jun",time:"18:00",venue:"Rose Bowl, LA"},
  {id:24,group:"D",home:"Italia",away:"Uruguay",date:"22 Jun",time:"18:00",venue:"NRG, Houston"},
  {id:25,group:"E",home:"Francia",away:"Nigeria",date:"13 Jun",time:"21:00",venue:"Levi's, SF"},
  {id:26,group:"E",home:"Polonia",away:"Australia",date:"14 Jun",time:"15:00",venue:"Empower, Denver"},
  {id:27,group:"F",home:"Argentina",away:"Chile",date:"14 Jun",time:"18:00",venue:"AT&T, Dallas"},
  {id:28,group:"F",home:"Eslovaquia",away:"China",date:"14 Jun",time:"21:00",venue:"Rose Bowl, LA"},
  {id:29,group:"G",home:"Brasil",away:"Nueva Zelanda",date:"15 Jun",time:"12:00",venue:"NRG, Houston"},
  {id:30,group:"G",home:"Colombia",away:"Argelia",date:"15 Jun",time:"15:00",venue:"Hard Rock, Miami"},
  {id:31,group:"H",home:"Inglaterra",away:"Panamá",date:"16 Jun",time:"12:00",venue:"MetLife, NY"},
  {id:32,group:"H",home:"Países Bajos",away:"Ghana",date:"16 Jun",time:"21:00",venue:"Arrowhead, KC"},
  {id:33,group:"I",home:"Estados Unidos",away:"Venezuela",date:"17 Jun",time:"12:00",venue:"SoFi, LA"},
  {id:34,group:"I",home:"Canadá",away:"Georgia",date:"17 Jun",time:"15:00",venue:"BC Place, Vancouver"},
  {id:35,group:"J",home:"Bélgica",away:"Tanzania",date:"18 Jun",time:"15:00",venue:"AT&T, Dallas"},
  {id:36,group:"J",home:"Suiza",away:"Camerún",date:"18 Jun",time:"18:00",venue:"NRG, Houston"},
];

const SK="wc2026_v3",UK="wc2026_usr_v3";
const loadData=()=>{try{return JSON.parse(localStorage.getItem(SK)||"{}")}catch{return{}}};
const saveData=d=>{try{localStorage.setItem(SK,JSON.stringify(d))}catch{}};
const loadUser=()=>{try{return JSON.parse(localStorage.getItem(UK)||"null")||{name:"",favTeam:"Portugal",favPlayer:"Cristiano Ronaldo",id:Math.random().toString(36).slice(2)}}catch{return{name:"",favTeam:"Portugal",favPlayer:"Cristiano Ronaldo",id:"u1"}}};
const saveUser=u=>{try{localStorage.setItem(UK,JSON.stringify(u))}catch{}};

function RainbowStripe({h=4}){
  return <div style={{display:"flex",height:h}}>{RAINBOW.map((c,i)=><div key={i} style={{flex:1,background:c}}/>)}</div>;
}

function Logo26({size=50}){
  const rings=RAINBOW;
  return(
    <div style={{position:"relative",width:size,height:size,flexShrink:0}}>
      {rings.map((c,i)=>(
        <div key={i} style={{position:"absolute",inset:i*(size/18),borderRadius:"50%",border:`${Math.max(2,size/22)}px solid ${c}`,opacity:0.9}}/>
      ))}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:size*0.28}}>🏆</div>
    </div>
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
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&family=Barlow:wght@400;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-track{background:#0a0a0a}
        ::-webkit-scrollbar-thumb{background:#333;border-radius:2px}
        .card-hover{transition:transform .15s,box-shadow .15s}
        .card-hover:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,.5)}
        .drop-row:hover{background:#1c1c1c!important}
        .nav-tab:hover{background:rgba(255,255,255,.05)!important}
        .arrow-btn:hover{background:#2a2a2a!important;color:#fff!important}
        .bracket-btn:hover{background:#222!important}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.03)}}
        .fadein{animation:fadeUp .35s ease both}
        .pulse{animation:pulse 2.8s ease infinite}
        @keyframes spin{to{transform:rotate(360deg)}}
      `}</style>

      {showSetup&&<SetupModal user={user} setUser={setUser} onClose={()=>setShowSetup(false)}/>}
      {toast&&<div style={S.toast}>{toast}</div>}

      {/* HEADER */}
      <header style={S.header}>
        <RainbowStripe h={5}/>
        <div style={S.hInner}>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <Logo26 size={54}/>
            <div>
              <div style={S.hTitle}>MUNDIAL 2026</div>
              <div style={S.hSub}>WE ARE 26 · USA · MÉXICO · CANADÁ</div>
            </div>
          </div>
          <button style={S.userPill} onClick={()=>setShowSetup(true)}>
            <span style={{fontSize:22}}>🇵🇹</span>
            <div>
              <div style={{fontSize:12,fontWeight:700,color:"#fff",lineHeight:1.2,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5}}>{user.name||"Mi Perfil"}</div>
              <div style={{fontSize:9,color:FIFA_COLORS.yellow,letterSpacing:1}}>🐐 CR7</div>
            </div>
          </button>
        </div>
      </header>

      {/* NAV */}
      <nav style={S.nav}>
        {TABS.map(t=>(
          <button key={t.id} className="nav-tab"
            style={{...S.navTab,...(tab===t.id?S.navActive:{})}}
            onClick={()=>setTab(t.id)}>
            <span style={{fontSize:15}}>{t.icon}</span>
            <span style={{fontSize:9,fontWeight:900,letterSpacing:1}}>{t.label}</span>
            {tab===t.id&&<div style={S.navBar}/>}
          </button>
        ))}
      </nav>

      <main style={S.main} className="fadein" key={tab}>
        {tab==="home"&&<HomeTab preds={data.predictions||{}} updatePred={updatePred} user={user}/>}
        {tab==="calendar"&&<CalendarTab data={data} setData={setData} showToast={showToast}/>}
        {tab==="groups"&&<GroupsTab data={data} setData={setData}/>}
        {tab==="bracket"&&<BracketTab data={data} setData={setData} showToast={showToast}/>}
        {tab==="ranking"&&<RankingTab data={data} user={user}/>}
      </main>
    </div>
  );
}

function SetupModal({user,setUser,onClose}){
  const [name,setName]=useState(user.name||"");
  return(
    <div style={S.modalBg}>
      <div style={S.modal}>
        <RainbowStripe h={5}/>
        <div style={{padding:28}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:16}}><Logo26 size={80}/></div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,textAlign:"center",color:"#fff",letterSpacing:2,marginBottom:4}}>MUNDIAL 2026</div>
          <div style={{fontSize:12,color:"#666",textAlign:"center",marginBottom:24,letterSpacing:1}}>WE ARE 26 · APP DE PREDICCIONES</div>
          <label style={{fontSize:11,color:"#888",fontWeight:700,letterSpacing:1.5,display:"block",marginBottom:6}}>TU NOMBRE</label>
          <input style={S.inp} placeholder="Escribe tu nombre..." value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>{if(e.key==="Enter"&&name.trim()){setUser(u=>({...u,name:name.trim()}));onClose()}}}/>
          <div style={{display:"flex",gap:8,margin:"14px 0"}}>
            {["🇵🇹 Portugal","🐐 Cristiano Ronaldo"].map(x=>(
              <div key={x} style={{flex:1,background:"#111",border:"1px solid #222",borderRadius:8,padding:"8px 10px",fontSize:12,color:"#888",textAlign:"center",fontWeight:600}}>{x}</div>
            ))}
          </div>
          <button style={S.btnMain} onClick={()=>{if(name.trim()){setUser(u=>({...u,name:name.trim()}));onClose()}}}>
            ¡EMPEZAR A PREDECIR! 🚀
          </button>
        </div>
      </div>
    </div>
  );
}

const PRED_CATS=[
  {key:"champion",label:"Campeón Mundial",icon:"🏆",type:"team",color:FIFA_COLORS.yellow},
  {key:"surprise_team",label:"Equipo Sorpresa",icon:"⚡",type:"team",color:FIFA_COLORS.green},
  {key:"surprise_player",label:"Jugador Sorpresa",icon:"🌟",type:"player",color:FIFA_COLORS.blue},
  {key:"disappointment_player",label:"Jugador Decepción",icon:"😞",type:"player",color:FIFA_COLORS.red},
  {key:"disappointment_team",label:"Equipo Decepción",icon:"💔",type:"team",color:FIFA_COLORS.pink},
  {key:"top_scorer",label:"Goleador del Torneo",icon:"⚽",type:"player",color:FIFA_COLORS.orange},
  {key:"top_assist",label:"Asistidor del Torneo",icon:"🎯",type:"player",color:FIFA_COLORS.purple},
  {key:"best_keeper",label:"Portero del Torneo",icon:"🧤",type:"player",color:FIFA_COLORS.teal},
];

function HomeTab({preds,updatePred,user}){
  const filled=PRED_CATS.filter(c=>preds[c.key]).length;
  const pct=Math.round(filled/PRED_CATS.length*100);
  return(
    <div>
      {/* HERO */}
      <div style={S.hero}>
        {/* Decorative diagonal color bands */}
        <div style={{position:"absolute",inset:0,overflow:"hidden",borderRadius:16}}>
          {RAINBOW.map((c,i)=>(
            <div key={i} style={{position:"absolute",top:0,bottom:0,left:`${i*12.5}%`,width:"12.5%",background:c,opacity:0.18,transform:"skewX(-8deg)"}}/>
          ))}
        </div>
        <div style={{position:"relative",zIndex:1}}>
          <div style={{fontSize:10,letterSpacing:4,color:"rgba(255,255,255,.6)",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:700,marginBottom:6}}>FIFA WORLD CUP 2026™</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:52,fontWeight:900,color:"#fff",letterSpacing:3,lineHeight:.9,marginBottom:10}}>MIS<br/><span style={{color:FIFA_COLORS.yellow}}>PREDICCIONES</span></div>
          <div style={{fontSize:13,color:"rgba(255,255,255,.75)",marginBottom:14}}>Hola <strong style={{color:"#fff"}}>{user.name}</strong>! 🇵🇹 Portugal va por todo</div>
          <div style={{background:"rgba(0,0,0,.35)",borderRadius:8,padding:"8px 12px"}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"rgba(255,255,255,.6)",marginBottom:5}}>
              <span>{filled}/{PRED_CATS.length} completadas</span>
              <span style={{color:FIFA_COLORS.yellow,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",fontSize:14}}>{pct}%</span>
            </div>
            <div style={{background:"rgba(255,255,255,.15)",borderRadius:999,height:6,overflow:"hidden"}}>
              <div style={{width:`${pct}%`,height:"100%",background:`linear-gradient(90deg,${FIFA_COLORS.yellow},${FIFA_COLORS.orange})`,borderRadius:999,transition:"width .5s"}}/>
            </div>
          </div>
        </div>
      </div>

      {/* CR7 card */}
      <div style={S.cr7Card}>
        <div style={{fontSize:36}}>🐐</div>
        <div style={{flex:1}}>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:FIFA_COLORS.yellow,letterSpacing:1}}>CRISTIANO RONALDO</div>
          <div style={{fontSize:11,color:"#666"}}>Tu jugador favorito · Portugal 🇵🇹 · GOAT del fútbol mundial</div>
        </div>
        <div style={{fontSize:30}}>🇵🇹</div>
      </div>

      {/* Grid */}
      <div style={S.predGrid}>
        {PRED_CATS.map((cat,i)=>(
          <div key={cat.key} className="fadein" style={{animationDelay:`${i*.04}s`}}>
            <PredCard cat={cat} value={preds[cat.key]} onSave={v=>updatePred(cat.key,v)}/>
          </div>
        ))}
      </div>
    </div>
  );
}

function PredCard({cat,value,onSave}){
  const [q,setQ]=useState("");
  const [open,setOpen]=useState(false);
  const ref=useRef(null);
  const items=cat.type==="team"
    ?ALL_TEAMS.filter(t=>t.toLowerCase().includes(q.toLowerCase()))
    :ALL_PLAYERS.filter(p=>p.name.toLowerCase().includes(q.toLowerCase())||p.team.toLowerCase().includes(q.toLowerCase()));
  useEffect(()=>{
    const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};
    document.addEventListener("mousedown",h);return()=>document.removeEventListener("mousedown",h);
  },[]);
  const getN=v=>cat.type==="team"?v:(typeof v==="object"?v.name:v);
  const getF=v=>cat.type==="team"?(FLAGS[v]||"🏳️"):(typeof v==="object"?v.flag:"⚽");
  return(
    <div className="card-hover" ref={ref} style={{...S.predCard,borderLeft:`4px solid ${cat.color}`}}>
      <div style={{display:"flex",alignItems:"center",gap:9,marginBottom:10}}>
        <div style={{width:34,height:34,borderRadius:8,background:cat.color+"22",border:`1px solid ${cat.color}44`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,flexShrink:0}}>{cat.icon}</div>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:14,fontWeight:700,color:"#ddd",letterSpacing:.3}}>{cat.label}</span>
      </div>
      {value&&(
        <div style={{background:cat.color+"15",border:`1px solid ${cat.color}44`,borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
          <span style={{fontSize:22}}>{getF(value)}</span>
          <div style={{flex:1}}>
            <div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{getN(value)}</div>
            {cat.type==="player"&&typeof value==="object"&&<div style={{fontSize:10,color:"#777"}}>{value.team}</div>}
          </div>
          <div style={{width:7,height:7,borderRadius:"50%",background:cat.color}}/>
        </div>
      )}
      <div style={{position:"relative"}}>
        <input style={S.srch} placeholder={`🔍 Buscar ${cat.type==="team"?"equipo":"jugador"}...`}
          value={q} onChange={e=>{setQ(e.target.value);setOpen(true)}} onFocus={()=>setOpen(true)}/>
        {open&&q.length>0&&items.length>0&&(
          <div style={S.drop}>
            {items.slice(0,8).map((item,i)=>{
              const isT=cat.type==="team";
              return(
                <div key={i} className="drop-row" style={S.dropRow} onClick={()=>{onSave(isT?item:item);setQ("");setOpen(false)}}>
                  <span style={{fontSize:20,flexShrink:0}}>{isT?(FLAGS[item]||"🏳️"):item.flag}</span>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#eee"}}>{isT?item:item.name}</div>
                    {!isT&&<div style={{fontSize:10,color:"#666"}}>{item.team}</div>}
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
  const setR=(id,h,a)=>{setData(d=>({...d,matchResults:{...(d.matchResults||{}),[id]:{home:h,away:a}}}));showToast("⚽ ¡Predicción guardada!")};
  const share=()=>{
    const lines=MATCHES.filter(m=>res[m.id]).slice(0,10).map(m=>`${FLAGS[m.home]}${m.home} ${res[m.id].home}-${res[m.id].away} ${m.away}${FLAGS[m.away]}`).join("\n");
    navigator.clipboard?.writeText("🏆 Mis picks del #Mundial2026:\n"+lines+"\n\n⚽ ¡Únete!");
    showToast("📋 ¡Copiado!");
  };
  return(
    <div>
      <div style={S.pH}>
        <div>
          <div style={S.pT}>Calendario de Partidos</div>
          <div style={S.pS}>{Object.keys(res).length} de {MATCHES.length} predichos</div>
        </div>
        <button style={S.btnGreen} onClick={share}>📤 Compartir picks</button>
      </div>
      <RainbowStripe h={3}/><div style={{height:12}}/>
      <div style={S.filters}>
        {["all",...grps].map(g=>(
          <button key={g} style={{...S.fBtn,...(filter===g?S.fActive:{})}} onClick={()=>setFilter(g)}>
            {g==="all"?"Todos":`Gr. ${g}`}
          </button>
        ))}
      </div>
      {shown.map(m=><MatchCard key={m.id} match={m} result={res[m.id]} onSave={(h,a)=>setR(m.id,h,a)}/>)}
    </div>
  );
}

function MatchCard({match,result,onSave}){
  const [h,setH]=useState(result?.home??"");
  const [a,setA]=useState(result?.away??"");
  const gc=GROUPS[match.group]?.color||FIFA_COLORS.blue;
  const saved=result!==undefined;
  return(
    <div className="card-hover" style={{...S.mCard,borderLeft:`4px solid ${gc}`}}>
      <div style={{display:"flex",gap:8,marginBottom:10,flexWrap:"wrap",alignItems:"center"}}>
        <span style={{fontSize:10,fontWeight:900,padding:"2px 8px",borderRadius:99,background:gc+"22",color:gc,border:`1px solid ${gc}44`,letterSpacing:.5}}>GRUPO {match.group}</span>
        <span style={{fontSize:11,color:"#666"}}>📅 {match.date} · {match.time}</span>
        <span style={{fontSize:10,color:"#444"}}>📍 {match.venue}</span>
      </div>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:6}}>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:30}}>{FLAGS[match.home]||"🏳️"}</span>
          <span style={{fontSize:11,fontWeight:600,color:"#aaa",textAlign:"center"}}>{match.home}</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <input type="number" min={0} max={20} style={{...S.sInp,borderColor:saved?gc:"#2a2a2a"}} value={h} onChange={e=>setH(e.target.value)} placeholder="0"/>
          <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color:"#444"}}>-</span>
          <input type="number" min={0} max={20} style={{...S.sInp,borderColor:saved?gc:"#2a2a2a"}} value={a} onChange={e=>setA(e.target.value)} placeholder="0"/>
        </div>
        <div style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4}}>
          <span style={{fontSize:30}}>{FLAGS[match.away]||"🏳️"}</span>
          <span style={{fontSize:11,fontWeight:600,color:"#aaa",textAlign:"center"}}>{match.away}</span>
        </div>
      </div>
      <button style={{marginTop:10,width:"100%",border:"none",borderRadius:8,padding:"9px",color:"#fff",fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5,background:saved?`linear-gradient(135deg,${gc}dd,${gc}88)`:"#1a1a1a",transition:"background .3s"}}
        onClick={()=>onSave(Number(h),Number(a))}>
        {saved?`✓ ${match.home} ${h} - ${a} ${match.away} guardado`:"GUARDAR PREDICCIÓN"}
      </button>
    </div>
  );
}

function GroupsTab({data,setData}){
  const st=data.groupStandings||{};
  const setGO=(g,o)=>setData(d=>({...d,groupStandings:{...(d.groupStandings||{}),[g]:o}}));
  return(
    <div>
      <div style={S.pH}>
        <div><div style={S.pT}>Fase de Grupos</div><div style={S.pS}>Ordena con ▲▼ según tu predicción</div></div>
      </div>
      <RainbowStripe h={3}/><div style={{height:12}}/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(235px,1fr))",gap:10}}>
        {Object.entries(GROUPS).map(([l,{teams,color}])=>(
          <GroupTable key={l} letter={l} color={color} order={st[l]||teams} onReorder={o=>setGO(l,o)}/>
        ))}
      </div>
    </div>
  );
}

function GroupTable({letter,color,order,onReorder}){
  const move=(i,d)=>{
    const j=i+d;if(j<0||j>=order.length)return;
    const a=[...order];[a[i],a[j]]=[a[j],a[i]];onReorder(a);
  };
  const medals=["🥇","🥈","🥉","4️⃣"];
  const mc=[FIFA_COLORS.yellow,"#94a3b8","#cd7f32","#475569"];
  return(
    <div className="card-hover" style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:12,borderTop:`4px solid ${color}`,overflow:"hidden"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10,paddingBottom:8,borderBottom:"1px solid #1a1a1a"}}>
        <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:20,fontWeight:900,color,letterSpacing:1}}>GRUPO {letter}</span>
        <div style={{width:20,height:20,borderRadius:"50%",background:color+"30",border:`2px solid ${color}60`}}/>
      </div>
      {order.map((team,i)=>(
        <div key={team} style={{display:"flex",alignItems:"center",gap:7,padding:"5px 4px",marginBottom:2,borderRadius:6,background:i<2?color+"12":"transparent",borderBottom:"1px solid #111",transition:"background .15s"}}>
          <span style={{fontSize:16,width:20,color:mc[i],flexShrink:0}}>{medals[i]}</span>
          <span style={{fontSize:18}}>{FLAGS[team]||"🏳️"}</span>
          <span style={{flex:1,fontSize:12,fontWeight:600,color:i<2?"#ddd":"#777"}}>{team}</span>
          <div style={{display:"flex",flexDirection:"column",gap:1}}>
            <button className="arrow-btn" style={{background:"#1a1a1a",border:"none",color:"#555",cursor:"pointer",fontSize:9,padding:"2px 5px",borderRadius:3,lineHeight:1,transition:"all .15s"}} onClick={()=>move(i,-1)}>▲</button>
            <button className="arrow-btn" style={{background:"#1a1a1a",border:"none",color:"#555",cursor:"pointer",fontSize:9,padding:"2px 5px",borderRadius:3,lineHeight:1,transition:"all .15s"}} onClick={()=>move(i,1)}>▼</button>
          </div>
        </div>
      ))}
      <div style={{marginTop:6,fontSize:10,color:"#333",textAlign:"center"}}>Top 2 clasifican automáticamente ✓</div>
    </div>
  );
}

function BracketTab({data,setData,showToast}){
  const br=data.bracket||{};
  const g=data.groupStandings||{};
  const g1=x=>(g[x]||GROUPS[x]?.teams||[])[0]||`1º Gr.${x}`;
  const g2=x=>(g[x]||GROUPS[x]?.teams||[])[1]||`2º Gr.${x}`;
  const pick=(id,w)=>{setData(d=>({...d,bracket:{...(d.bracket||{}),[id]:w}}));showToast(`🏆 ${w} avanza!`)};

  const r32=[
    {id:"r32_1",home:g1("A"),away:g2("B")},{id:"r32_2",home:g1("C"),away:g2("D")},
    {id:"r32_3",home:g1("E"),away:g2("F")},{id:"r32_4",home:g1("G"),away:g2("H")},
    {id:"r32_5",home:g1("I"),away:g2("J")},{id:"r32_6",home:g1("K"),away:g2("L")},
    {id:"r32_7",home:g1("B"),away:g2("A")},{id:"r32_8",home:g1("D"),away:g2("C")},
    {id:"r32_9",home:g1("F"),away:g2("E")},{id:"r32_10",home:g1("H"),away:g2("G")},
    {id:"r32_11",home:g1("J"),away:g2("I")},{id:"r32_12",home:g1("L"),away:g2("K")},
  ];
  const qf=[
    {id:"qf_1",home:br.r32_1||"?",away:br.r32_2||"?"},{id:"qf_2",home:br.r32_3||"?",away:br.r32_4||"?"},
    {id:"qf_3",home:br.r32_5||"?",away:br.r32_6||"?"},{id:"qf_4",home:br.r32_7||"?",away:br.r32_8||"?"},
    {id:"qf_5",home:br.r32_9||"?",away:br.r32_10||"?"},{id:"qf_6",home:br.r32_11||"?",away:br.r32_12||"?"},
  ];
  const sf=[
    {id:"sf_1",home:br.qf_1||"?",away:br.qf_2||"?"},{id:"sf_2",home:br.qf_3||"?",away:br.qf_4||"?"},
    {id:"sf_3",home:br.qf_5||"?",away:br.qf_6||"?"},
  ];
  const f3={id:"3rd",home:br.sf_2||"?",away:br.sf_3||"?"};
  const fn={id:"final",home:br.sf_1||"?",away:br.sf_2||"?"};
  const champ=br.final||null;

  return(
    <div>
      <div style={S.pH}>
        <div><div style={S.pT}>Bracket del Mundial</div><div style={S.pS}>Elige al campeón paso a paso</div></div>
      </div>
      <RainbowStripe h={3}/><div style={{height:12}}/>

      {champ&&(
        <div className="pulse" style={{background:`linear-gradient(135deg,${FIFA_COLORS.red},${FIFA_COLORS.blue})`,border:`2px solid ${FIFA_COLORS.yellow}`,borderRadius:16,padding:20,display:"flex",alignItems:"center",justifyContent:"center",gap:16,marginBottom:20}}>
          <span style={{fontSize:44}}>{FLAGS[champ]||"🏆"}</span>
          <div style={{textAlign:"center"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:11,letterSpacing:4,color:"rgba(255,255,255,.6)"}}>CAMPEÓN MUNDIAL 2026</div>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:34,fontWeight:900,color:FIFA_COLORS.yellow,letterSpacing:2}}>{champ}</div>
            <div style={{fontSize:10,color:"rgba(255,255,255,.4)",letterSpacing:2}}>WE ARE 26 🏆 FIFA</div>
          </div>
          <span style={{fontSize:44}}>{FLAGS[champ]||"🏆"}</span>
        </div>
      )}

      {[
        {label:"OCTAVOS DE FINAL",color:FIFA_COLORS.blue,matches:r32,cols:2},
        {label:"CUARTOS DE FINAL",color:FIFA_COLORS.green,matches:qf,cols:2},
        {label:"SEMIFINALES",color:FIFA_COLORS.orange,matches:sf,cols:1},
        {label:"🥉 TERCER LUGAR",color:FIFA_COLORS.teal,matches:[f3],cols:1},
        {label:"🏆 GRAN FINAL",color:FIFA_COLORS.yellow,matches:[fn],cols:1,isFinal:true},
      ].map(r=>(
        <div key={r.label} style={{marginBottom:22}}>
          <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{height:3,width:20,background:r.color,borderRadius:2}}/>
            <span style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:13,fontWeight:900,color:r.color,letterSpacing:2}}>{r.label}</span>
            <div style={{flex:1,height:1,background:"#1a1a1a"}}/>
          </div>
          <div style={{display:"grid",gridTemplateColumns:`repeat(${r.cols},1fr)`,gap:8}}>
            {r.matches.map(m=>(
              <div key={m.id} style={{background:"#0d0d0d",border:`1px solid ${r.isFinal?r.color+"66":"#1a1a1a"}`,borderRadius:10,padding:10,display:"flex",flexDirection:"column",gap:4,...(r.isFinal?{background:r.color+"08"}:{})}}>
                {[m.home,m.away].map((team,ti)=>(
                  <button key={ti} className="bracket-btn" style={{display:"flex",alignItems:"center",gap:8,padding:"8px 10px",background:br[m.id]===team?r.color+"30":"#141414",border:`1px solid ${br[m.id]===team?r.color:"#222"}`,borderRadius:8,cursor:team==="?"?"default":"pointer",color:br[m.id]===team?"#fff":"#888",fontFamily:"'Barlow',sans-serif",width:"100%",transition:"all .15s",opacity:team==="?"?.4:1}}
                    onClick={()=>team!=="?"&&pick(m.id,team)}>
                    <span style={{fontSize:16}}>{FLAGS[team]||(team==="?"?"❓":"🏳️")}</span>
                    <span style={{fontSize:12,fontWeight:600,flex:1,textAlign:"left"}}>{team}</span>
                    {br[m.id]===team&&<span style={{fontSize:10,color:r.color}}>✓ AVANZA</span>}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function RankingTab({data,user}){
  const preds=data.predictions||{};
  const filled=PRED_CATS.filter(c=>preds[c.key]).length;
  const matches=Object.keys(data.matchResults||{}).length;
  const bracketPicks=Object.keys(data.bracket||{}).length;
  const share=()=>{navigator.clipboard?.writeText(window.location.href+"?ref="+(user.id||"amigo"));alert("🔗 Link copiado! Comparte con tus amigos para el #Mundial2026 🏆⚽")};

  return(
    <div>
      <div style={S.pH}>
        <div><div style={S.pT}>Ranking de Amigos</div><div style={S.pS}>Tus predicciones y estadísticas</div></div>
        <button style={S.btnGreen} onClick={share}>🔗 Invitar</button>
      </div>
      <RainbowStripe h={3}/><div style={{height:12}}/>

      {/* Profile */}
      <div style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:14,padding:18,marginBottom:12}}>
        <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:16}}>
          <div style={{width:54,height:54,borderRadius:"50%",background:`linear-gradient(135deg,${FIFA_COLORS.red},${FIFA_COLORS.blue})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>
            {FLAGS["Portugal"]}
          </div>
          <div style={{flex:1}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:24,fontWeight:900,color:"#fff",letterSpacing:1}}>{user.name||"Tú"}</div>
            <div style={{fontSize:11,color:"#666"}}>🐐 Cristiano Ronaldo · Portugal 🇵🇹</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:30,fontWeight:900,color:FIFA_COLORS.yellow}}>{filled}/{PRED_CATS.length}</div>
            <div style={{fontSize:9,color:"#555",letterSpacing:1}}>CATEGORÍAS</div>
          </div>
        </div>
        <div style={{display:"flex",gap:8}}>
          {[
            {n:filled,l:"Predicciones",c:FIFA_COLORS.blue},
            {n:matches,l:"Partidos",c:FIFA_COLORS.green},
            {n:bracketPicks,l:"Bracket",c:FIFA_COLORS.orange},
          ].map(s=>(
            <div key={s.l} style={{flex:1,background:s.c+"18",border:`1px solid ${s.c}33`,borderRadius:10,padding:"10px 0",textAlign:"center"}}>
              <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:s.c}}>{s.n}</div>
              <div style={{fontSize:10,color:"#666"}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Predictions list */}
      <div style={{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:14,padding:16,marginBottom:12}}>
        <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:15,fontWeight:900,color:"#fff",letterSpacing:1.5,marginBottom:12}}>MIS PREDICCIONES</div>
        {PRED_CATS.map((cat,i)=>{
          const val=preds[cat.key];
          const name=val?(cat.type==="team"?val:(typeof val==="object"?val.name:val)):null;
          const flag=val?(cat.type==="team"?(FLAGS[val]||"🏳️"):(typeof val==="object"?val.flag:"⚽")):null;
          return(
            <div key={cat.key} style={{display:"flex",alignItems:"center",gap:10,padding:"9px 8px",borderBottom:"1px solid #111",borderLeft:`3px solid ${val?cat.color:"#1a1a1a"}`,marginBottom:2,borderRadius:"0 4px 4px 0",background:val?cat.color+"08":"transparent"}}>
              <span style={{fontSize:17}}>{cat.icon}</span>
              <div style={{flex:1}}>
                <div style={{fontSize:10,color:"#555",fontWeight:700,letterSpacing:.5}}>{cat.label.toUpperCase()}</div>
                <div style={{fontSize:13,fontWeight:600,color:val?"#e2e8f0":"#2a2a2a"}}>
                  {val?<span>{flag} {name}</span>:"Sin predicción"}
                </div>
              </div>
              <div style={{width:7,height:7,borderRadius:"50%",background:val?cat.color:"#1a1a1a"}}/>
            </div>
          );
        })}
      </div>

      {/* Invite */}
      <div style={{background:"#0a0a0a",border:"1px solid #1a1a1a",borderRadius:14,overflow:"hidden"}}>
        <RainbowStripe h={4}/>
        <div style={{padding:22,textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:8}}>👥⚽</div>
          <div style={{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#fff",letterSpacing:2,marginBottom:4}}>INVITA A TUS AMIGOS</div>
          <div style={{fontSize:12,color:"#555",marginBottom:16}}>Comparte el link y compara sus predicciones</div>
          <button style={{...S.btnMain,maxWidth:300}} onClick={share}>📤 COPIAR LINK DE INVITACIÓN</button>
        </div>
      </div>
    </div>
  );
}

const S={
  app:{minHeight:"100vh",background:"#080808",fontFamily:"'Barlow','Trebuchet MS',sans-serif",color:"#f1f5f9",overflowX:"hidden"},
  header:{background:"#050505",borderBottom:"1px solid #141414",position:"sticky",top:0,zIndex:100,boxShadow:"0 4px 24px rgba(0,0,0,.9)"},
  hInner:{maxWidth:960,margin:"0 auto",padding:"10px 14px",display:"flex",justifyContent:"space-between",alignItems:"center",gap:10},
  hTitle:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:22,fontWeight:900,color:"#fff",letterSpacing:3,lineHeight:1},
  hSub:{fontSize:9,color:"#444",letterSpacing:2.5,marginTop:2},
  userPill:{background:"#111",border:"1px solid #222",borderRadius:10,padding:"6px 12px",display:"flex",alignItems:"center",gap:8,cursor:"pointer"},
  nav:{background:"#050505",borderBottom:"1px solid #141414",display:"flex",overflowX:"auto",position:"sticky",top:72,zIndex:99,gap:0},
  navTab:{background:"none",border:"none",padding:"11px 12px",color:"#444",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:2,position:"relative",minWidth:60,borderBottom:"2px solid transparent",transition:"all .2s"},
  navActive:{color:"#fff",borderBottomColor:FIFA_COLORS.yellow},
  navBar:{position:"absolute",bottom:-2,left:"50%",transform:"translateX(-50%)",width:18,height:2,background:FIFA_COLORS.yellow,borderRadius:1},
  main:{maxWidth:960,margin:"0 auto",padding:"18px 12px 48px"},
  hero:{background:`linear-gradient(135deg,${FIFA_COLORS.red}dd,${FIFA_COLORS.blue}cc)`,borderRadius:16,padding:24,marginBottom:14,position:"relative",overflow:"hidden"},
  cr7Card:{background:"linear-gradient(135deg,#150800,#0a0a18)",border:"1px solid #2a1500",borderRadius:12,padding:"12px 16px",display:"flex",alignItems:"center",gap:12,marginBottom:14},
  predGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(275px,1fr))",gap:10},
  predCard:{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:14},
  srch:{width:"100%",background:"#141414",border:"1px solid #222",borderRadius:8,padding:"8px 12px",color:"#f1f5f9",fontSize:13,outline:"none"},
  drop:{position:"absolute",top:"100%",left:0,right:0,zIndex:200,background:"#141414",border:"1px solid #252525",borderRadius:8,maxHeight:240,overflowY:"auto",boxShadow:"0 12px 40px rgba(0,0,0,.9)"},
  dropRow:{display:"flex",alignItems:"center",gap:10,padding:"9px 12px",cursor:"pointer",borderBottom:"1px solid #1c1c1c"},
  pH:{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:12},
  pT:{fontFamily:"'Barlow Condensed',sans-serif",fontSize:26,fontWeight:900,color:"#fff",letterSpacing:1.5},
  pS:{fontSize:11,color:"#555"},
  btnGreen:{background:FIFA_COLORS.green,border:"none",borderRadius:8,padding:"8px 14px",color:"#fff",fontWeight:900,cursor:"pointer",fontSize:11,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5},
  filters:{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"},
  fBtn:{background:"#111",border:"1px solid #1a1a1a",borderRadius:6,padding:"4px 9px",color:"#555",cursor:"pointer",fontSize:10,fontWeight:900,letterSpacing:.5,fontFamily:"'Barlow Condensed',sans-serif"},
  fActive:{background:"#fff",borderColor:"#fff",color:"#000"},
  mCard:{background:"#0d0d0d",border:"1px solid #1a1a1a",borderRadius:12,padding:12,marginBottom:7,transition:"border-color .2s"},
  sInp:{width:44,height:44,background:"#141414",border:"2px solid",borderRadius:8,color:FIFA_COLORS.yellow,fontSize:19,fontWeight:900,textAlign:"center",outline:"none",fontFamily:"'Barlow Condensed',sans-serif"},
  modalBg:{position:"fixed",inset:0,background:"rgba(0,0,0,.95)",zIndex:999,display:"flex",alignItems:"center",justifyContent:"center",padding:20},
  modal:{background:"#080808",border:"1px solid #1a1a1a",borderRadius:16,maxWidth:370,width:"100%",overflow:"hidden",boxShadow:"0 32px 80px rgba(0,0,0,.95)"},
  inp:{width:"100%",background:"#111",border:"1px solid #222",borderRadius:8,padding:"10px 14px",color:"#f1f5f9",fontSize:14,outline:"none",marginBottom:4},
  btnMain:{display:"block",background:`linear-gradient(135deg,${FIFA_COLORS.red},${FIFA_COLORS.blue})`,border:"none",borderRadius:10,padding:"13px 20px",color:"#fff",fontWeight:900,cursor:"pointer",fontSize:13,width:"100%",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:1.5},
  toast:{position:"fixed",bottom:22,left:"50%",transform:"translateX(-50%)",background:"#111",border:"1px solid #2a2a2a",color:"#fff",padding:"9px 20px",borderRadius:999,fontWeight:700,fontSize:12,zIndex:9999,boxShadow:"0 8px 32px rgba(0,0,0,.7)",whiteSpace:"nowrap",fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:.5},
};
