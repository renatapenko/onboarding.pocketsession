import { useState, useEffect, useRef } from "react";

/* ─── PALETA ─────────────────────────────────────────── */
const P = {
  bg:     "#F8F5F0",
  white:  "#FFFFFF",
  linen:  "#EDE8E0",
  border: "#DDD5C8",
  rose:   "#B5697A",
  plum:   "#5C3444",
  sage:   "#7A9480",
  gold:   "#C4A46B",
  text:   "#261820",
  muted:  "#7A6068",
  light:  "#A89098",
  blush:  "#EDD0D5",
};

/* ─── INSIGHTS ───────────────────────────────────────── */
const INS_MOTIVO = {
  rel:   "Padrões relacionais têm raízes muito antes de sermos adultas. Nomear isso já é o início de algo.",
  ans:   "A ansiedade raramente é o problema central — ela é o aviso de que algo mais fundo está pedindo atenção.",
  ident: "Perder-se de si mesma é um dos processos mais silenciosos que existem. Obrigada por trazer isso.",
  pat:   "Padrões que se repetem têm uma lógica emocional própria. Juntas, vamos entender essa linguagem.",
  sol:   "Às vezes a solidão não vem da ausência de pessoas — vem da ausência de conexão consigo mesma.",
  aut:   "A autossabotagem raramente é fraqueza — quase sempre é uma proteção muito antiga que perdeu o contexto.",
};
const INS_TEMPO = {
  rec:   "Algo recente ainda não teve tempo de ser processado. Faz sentido seu sistema ainda estar reagindo.",
  meses: "Alguns meses são suficientes para um padrão começar a se instalar. Você chegou antes que se solidifique.",
  ano:   "Um ano é tempo suficiente para o padrão se tornar familiar. Vamos trabalhar com a profundidade que merece.",
  anos:  "Quando algo nos acompanha por anos, já se misturou à nossa identidade. A mudança é possível — e pede gentileza.",
};

/* ─── EFT PONTOS ─────────────────────────────────────── */
const PONTOS = [
  { id:"karate",    nome:"Lado da mão",          x:16, y:52, dur:20, setup:true,
    onde:"O lado externo da mão — a faixa carnuda abaixo do dedo mínimo, como se fosse dar um golpe de caratê. Bata com os dedos da outra mão.",
    frase:"Mesmo sentindo tudo isso, eu me aceito profunda e completamente." },
  { id:"head",      nome:"Topo da cabeça",        x:50, y:3,  dur:14,
    onde:"O ponto mais alto do crânio — bem no centro. Use as pontas dos dedos de uma ou das duas mãos.",
    frase:"Eu reconheço esta emoção sem precisar lutar contra ela." },
  { id:"eyebrow",   nome:"Início da sobrancelha", x:41, y:13, dur:14,
    onde:"Na extremidade interna da sobrancelha — o ponto ossudo logo acima do canto interno do olho, pertinho do nariz.",
    frase:"Meu corpo pode começar a relaxar agora." },
  { id:"side_eye",  nome:"Lado do olho",          x:62, y:15, dur:14,
    onde:"No osso que contorna o canto externo do olho — a têmpora, do lado de fora. Toque com leveza, sem apertar.",
    frase:"Eu libero essa tensão do meu sistema aos poucos e com segurança." },
  { id:"under_eye", nome:"Abaixo do olho",        x:50, y:21, dur:14,
    onde:"Logo abaixo da pupila, no osso da maçã do rosto — dois dedos abaixo do olho, na parte mais proeminente da bochecha.",
    frase:"Não preciso permanecer em estado de alerta o tempo inteiro." },
  { id:"nose",      nome:"Abaixo do nariz",       x:50, y:27, dur:14,
    onde:"No centro do filtro labial — o espaço entre a base do nariz e o lábio superior. Um ponto só, no meio.",
    frase:"Posso sentir isso sem me perder de mim." },
  { id:"chin",      nome:"Queixo",                x:50, y:33, dur:14,
    onde:"Na dobra entre o lábio inferior e o queixo — aquela reentrância no centro. Na frente, não embaixo.",
    frase:"Estou ensinando meu corpo que este momento é seguro." },
  { id:"collar",    nome:"Clavícula",             x:50, y:38, dur:14,
    onde:"Logo abaixo da clavícula, cerca de 3 cm abaixo e para dentro do ombro. Pode bater dos dois lados ao mesmo tempo.",
    frase:"Eu permito que essa carga emocional deixe meu corpo agora." },
  { id:"underarm",  nome:"Lado do corpo",         x:24, y:47, dur:14,
    onde:"No lado do tronco, cerca de 10 cm abaixo da axila — na altura do sutiã. Use a mão oposta para bater.",
    frase:"A cada respiração, meu sistema nervoso encontra mais calma." },
];

/* ─── HAVENING ───────────────────────────────────────── */
const EMOCOES = [
  { val:"tristeza", label:"Tristeza ou luto",       icon:"🌧️", frase:"Posso acolher essa tristeza sem me abandonar dentro dela. Meu corpo merece cuidado enquanto sente." },
  { val:"raiva",    label:"Raiva ou frustração",    icon:"🔥", frase:"Posso sentir essa raiva sem deixar que ela tome conta de mim. Meu corpo não precisa continuar em defesa." },
  { val:"medo",     label:"Medo ou insegurança",    icon:"🫀", frase:"Neste momento, posso desacelerar um pouco. Agora, meu corpo pode respirar com mais segurança." },
  { val:"vergonha", label:"Vergonha ou culpa",      icon:"🌑", frase:"Não preciso continuar me punindo por isso. Posso me olhar com mais honestidade e menos dureza." },
  { val:"solidao",  label:"Solidão ou abandono",    icon:"🫧", frase:"Mesmo nos dias em que me sinto distante, posso continuar comigo mesma." },
  { val:"exaustao", label:"Esgotamento emocional",  icon:"🍂", frase:"Meu corpo não foi feito para sobreviver em tensão constante. Descansar também é cuidado." },
];
const HAVENING_PASSOS = [
  { id:"arms",  nome:"Acaricie os braços",      sub:"Do ombro até o cotovelo, devagar",  icon:"🤗", dur:30, cue:"Deslize as palmas pelos braços de cima para baixo. Lento. Como se estivesse aquecendo alguém que você ama." },
  { id:"face",  nome:"Acaricie o rosto",         sub:"Da testa até as maçãs do rosto",   icon:"🫶", dur:30, cue:"Com as pontas dos dedos, desça da testa pelas bochechas suavemente. Esse toque envia sinal de segurança ao cérebro." },
  { id:"eyes",  nome:"Abaixo dos olhos",         sub:"Toque gentil nos ossos",           icon:"😌", dur:20, cue:"Toque levemente abaixo dos olhos com os dedos médios. Repita sua frase enquanto toca." },
  { id:"arms2", nome:"Braços — uma última vez",  sub:"Devagar, com presença",            icon:"🌊", dur:25, cue:"Volte aos braços. Agora com mais calma. Sinta o calor das suas próprias mãos. Você está aqui." },
];

/* ─── COMPONENTES BASE ───────────────────────────────── */
const btn = (bg, color, extra={}) => ({
  width:"100%", background:bg, color, border:"none", borderRadius:100,
  padding:"17px", fontSize:15, fontWeight:600, cursor:"pointer",
  fontFamily:"system-ui", letterSpacing:"0.01em",
  WebkitTapHighlightColor:"transparent", userSelect:"none", ...extra,
});

function BtnP({ label, onClick, disabled }) {
  return <button onClick={onClick} disabled={disabled}
    style={btn(`linear-gradient(135deg,${P.plum},${P.rose})`, "white", { opacity:disabled?0.45:1 })}>{label}</button>;
}
function BtnG({ label, onClick }) {
  return <button onClick={onClick}
    style={btn("transparent", P.muted, { border:`1.5px solid ${P.border}` })}>{label}</button>;
}

function Divider({ label }) {
  return <div style={{ display:"flex", alignItems:"center", gap:12, fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:P.light, fontFamily:"system-ui" }}>
    <div style={{ flex:1, height:1, background:P.border }}/>{label}<div style={{ flex:1, height:1, background:P.border }}/>
  </div>;
}

function Eyebrow({ children, color }) {
  return <div style={{ fontSize:10, letterSpacing:"0.18em", textTransform:"uppercase", color:color||P.rose, fontFamily:"system-ui", fontWeight:600, marginBottom:10 }}>{children}</div>;
}

function Heading({ children, size }) {
  return <div style={{ fontFamily:"Georgia,serif", fontSize:size||"clamp(24px,6vw,34px)", color:P.text, lineHeight:1.3, fontWeight:400 }}>{children}</div>;
}

function Lead({ children }) {
  return <div style={{ fontSize:15, color:P.muted, lineHeight:1.75, fontFamily:"system-ui", fontWeight:300 }}>{children}</div>;
}

function Card({ children, style={} }) {
  return <div style={{ background:P.white, border:`1.5px solid ${P.border}`, borderRadius:14, padding:"18px 20px", ...style }}>{children}</div>;
}

function InsightCard({ text }) {
  return (
    <div style={{ background:`linear-gradient(135deg,#FDF5F7,#F9F1F4)`, border:`1px solid ${P.blush}`, borderRadius:12, padding:"16px 18px", display:"flex", gap:12, alignItems:"flex-start" }}>
      <span style={{ color:P.rose, fontSize:15, flexShrink:0, marginTop:2 }}>✦</span>
      <div style={{ fontFamily:"Georgia,serif", fontSize:14, color:P.muted, lineHeight:1.75, fontStyle:"italic" }}>{text}</div>
    </div>
  );
}

function AvisoMedico({ tipo="inicio" }) {
  const ok = tipo==="inicio";
  return (
    <div style={{ background:ok?"#FFF8F5":"#F5FAF5", border:`1px solid ${ok?"#EDD0C8":"#C0D8C0"}`, borderRadius:10, padding:"13px 16px" }}>
      <div style={{ display:"flex", gap:10 }}>
        <span style={{ fontSize:14, flexShrink:0 }}>{ok?"⚠️":"💚"}</span>
        <div style={{ fontSize:12, color:P.muted, fontFamily:"system-ui", lineHeight:1.7 }}>
          {ok ? <><strong style={{ color:P.rose }}>Alívio não é cura.</strong> Estes exercícios são ferramentas de regulação emocional — não substituem psicoterapia, tratamento psiquiátrico ou medicamentos prescritos. <strong style={{ color:P.rose }}>Não suspenda nenhum tratamento</strong> sem orientação médica.</> 
              : <><strong style={{ color:"#4A8A4A" }}>Lembre-se:</strong> o que você sentiu aqui é alívio, não cura. Continue rigorosamente com todo tratamento médico e psiquiátrico em andamento.</>}
        </div>
      </div>
    </div>
  );
}

function Err({ msg, show }) {
  return show ? <div style={{ fontSize:13, color:"#A03020", fontFamily:"system-ui" }}>{msg}</div> : null;
}

function OptCard({ icon, title, sub, selected, onClick, multi=true }) {
  return (
    <div onClick={onClick} style={{
      background: selected ? "#FDF0F3" : P.white,
      border: `1.5px solid ${selected ? P.rose : P.border}`,
      borderRadius:14, padding:"15px 18px", cursor:"pointer",
      display:"flex", alignItems:"center", gap:14, userSelect:"none",
      boxShadow: selected ? `0 2px 12px rgba(181,105,122,0.15)` : "none",
      transition:"all 0.18s",
    }}>
      <span style={{ fontSize:22, flexShrink:0 }}>{icon}</span>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:15, fontWeight:600, color:P.text, fontFamily:"system-ui", marginBottom:sub?2:0 }}>{title}</div>
        {sub && <div style={{ fontSize:13, color:P.light, fontFamily:"system-ui", fontWeight:300 }}>{sub}</div>}
      </div>
      {multi && <div style={{ width:20, height:20, borderRadius:"50%", flexShrink:0, border:`1.5px solid ${selected?P.rose:P.border}`, background:selected?P.rose:P.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white", transition:"all 0.18s" }}>{selected?"✓":""}</div>}
    </div>
  );
}

function GridCard({ icon, title, selected, onClick }) {
  return (
    <div onClick={onClick} style={{
      background:selected?"#FDF0F3":P.white, border:`1.5px solid ${selected?P.rose:P.border}`,
      borderRadius:12, padding:"14px", cursor:"pointer", display:"flex", flexDirection:"column", gap:8,
      userSelect:"none", WebkitTapHighlightColor:"transparent", transition:"all 0.18s",
    }}>
      <div style={{ display:"flex", justifyContent:"space-between" }}>
        <span style={{ fontSize:22 }}>{icon}</span>
        <div style={{ width:17, height:17, borderRadius:"50%", border:`1.5px solid ${selected?P.rose:P.border}`, background:selected?P.rose:P.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, color:"white" }}>{selected?"✓":""}</div>
      </div>
      <div style={{ fontSize:13, fontWeight:600, color:P.text, fontFamily:"system-ui" }}>{title}</div>
    </div>
  );
}

function Textarea({ value, onChange }) {
  return <div>
    <textarea value={value} onChange={onChange} rows={5} maxLength={500}
      placeholder="Sem filtro, sem julgamento — esse espaço é completamente seu."
      style={{ width:"100%", background:P.white, border:`1.5px solid ${P.border}`, borderRadius:12, padding:"15px 18px", fontSize:16, color:P.text, fontFamily:"system-ui", fontWeight:300, outline:"none", resize:"none", lineHeight:1.65, boxSizing:"border-box", WebkitAppearance:"none" }}/>
    <div style={{ fontSize:11, color:P.light, textAlign:"right", marginTop:5, fontFamily:"system-ui" }}>{value.length>0?`${value.length}/500`:"Opcional · até 500 caracteres"}</div>
  </div>;
}

/* ─── ESCALA DE ANSIEDADE ────────────────────────────── */
function Escala({ value, onChange }) {
  const labels = { 0:"Nenhuma", 1:"", 2:"", 3:"Leve", 4:"", 5:"Moderada", 6:"", 7:"Intensa", 8:"", 9:"", 10:"Extrema" };
  const msgs = { 0:"Você chegou tranquila.", 1:"Quase imperceptível.", 2:"Muito leve.", 3:"Levemente presente.", 4:"Presente mas suave.", 5:"Moderada — o corpo já percebe.", 6:"Considerável.", 7:"Intensa — seu sistema nervoso está ativado.", 8:"Muito intensa.", 9:"Muito alta — boa hora para cuidar disso.", 10:"No limite. Estamos aqui para isso." };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(11,1fr)", gap:5 }}>
        {[...Array(11)].map((_,i) => (
          <div key={i} onClick={()=>onChange(i)} style={{
            height:44, borderRadius:10, cursor:"pointer",
            display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
            background: value===i ? P.rose : value!==null&&i<=value ? "#F5DCE2" : P.white,
            border:`1.5px solid ${value===i?P.rose:P.border}`,
            color: value===i?"white":P.text,
            fontFamily:"system-ui", fontSize:14, fontWeight:value===i?700:400,
            transition:"all 0.15s", WebkitTapHighlightColor:"transparent", userSelect:"none",
          }}>
            {i}
          </div>
        ))}
      </div>
      <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, color:P.light, fontFamily:"system-ui" }}>
        <span>Nenhuma</span><span>Extrema</span>
      </div>
      {value!==null && (
        <div style={{ fontFamily:"Georgia,serif", fontSize:14, color:P.rose, fontStyle:"italic", textAlign:"center" }}>{msgs[value]}</div>
      )}
    </div>
  );
}

/* ─── EFT ────────────────────────────────────────────── */
function EFTSession({ onDone }) {
  const [screen, setScreen] = useState("intro");
  const [idx, setIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const [taps, setTaps] = useState(0);
  const [pulse, setPulse] = useState(false);
  const timerRef = useRef(null);
  const pulseRef = useRef(null);
  const pt = PONTOS[idx];
  const isLast = idx===PONTOS.length-1;
  const pct = tick/pt.dur;

  function start() { setIdx(0); setTick(0); setTaps(0); setScreen("tapping"); }

  useEffect(()=>{
    if(screen!=="tapping") return;
    timerRef.current=setInterval(()=>{
      setTick(t=>{ if(t+1>=pt.dur){ clearInterval(timerRef.current); if(isLast) setTimeout(()=>setScreen("done"),500); else setTimeout(()=>{setIdx(i=>i+1);setTick(0);setTaps(0);},500); return t+1; } return t+1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[screen,idx]);

  useEffect(()=>{
    if(screen!=="tapping") return;
    pulseRef.current=setInterval(()=>{ setPulse(true); setTimeout(()=>setPulse(false),280); setTaps(t=>t+1); },1400);
    return ()=>clearInterval(pulseRef.current);
  },[screen,idx]);

  if(screen==="intro") return (
    <div style={{ display:"flex", flexDirection:"column", gap:22 }}>
      <div>
        <Eyebrow>EFT · Técnica de alívio emocional</Eyebrow>
        <Heading>Uma técnica para quando<br/>a ansiedade apertar</Heading>
        <div style={{ marginTop:12 }}><Lead>O EFT (Emotional Freedom Technique) é uma técnica de regulação emocional que você pode usar sempre que precisar — agora, antes de dormir, num momento difícil. Ela combina toque em pontos específicos da pele com linguagem emocional. O toque ativa receptores sensoriais que enviam sinais ao cérebro reduzindo a ativação da amígdala — a região responsável pelo medo e pela ansiedade. Foi desenvolvida nos anos 90 e é utilizada com veteranos de guerra, sobreviventes de trauma e pacientes com TEPT em programas militares e clínicos ao redor do mundo.</Lead></div>
      </div>

      <div style={{ background:`linear-gradient(135deg,#FDF5F7,#F9F1F4)`, border:`1px solid ${P.blush}`, borderRadius:14, padding:"20px" }}>
        <div style={{ fontSize:11, letterSpacing:"0.13em", textTransform:"uppercase", color:P.rose, fontFamily:"system-ui", fontWeight:600, marginBottom:14 }}>✦ Sobre as frases que você vai repetir</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:15, color:P.text, lineHeight:1.8, fontStyle:"italic", marginBottom:10 }}>
          "Não precisa acreditar 100% nelas — só dizer. O cérebro não distingue o que você fala do que você sente: as palavras chegam antes da crença."
        </div>
        <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.65 }}>
          Cada frase foi escolhida para contrariar, com gentileza, o que o medo instalou. Dizer em voz alta potencializa o efeito.
        </div>
      </div>

      <Card>
        {[["🤲","Toque em 9 pontos do corpo, um por vez"],["🗣️","Repita as frases em voz alta — se puder"],["📍","Cada ponto tem instrução exata de onde tocar"],["⏱️","Leva cerca de 2 minutos no total"]].map(([i,t])=>(
          <div key={t} style={{ display:"flex", gap:12, alignItems:"center", marginBottom:10 }}>
            <span style={{ fontSize:17 }}>{i}</span>
            <span style={{ fontSize:14, color:P.muted, fontFamily:"system-ui" }}>{t}</span>
          </div>
        ))}
      </Card>
      <AvisoMedico tipo="inicio"/>
      <BtnP label="Iniciar EFT →" onClick={start}/>
      <BtnG label="Pular por agora" onClick={onDone}/>
    </div>
  );

  if(screen==="tapping") return (
    <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"flex", gap:5, justifyContent:"center", flexWrap:"wrap" }}>
        {PONTOS.map((p,i)=><div key={p.id} style={{ height:5, borderRadius:10, width:i===idx?22:6, background:i<=idx?P.rose:P.border, opacity:i<idx?0.4:1, transition:"all 0.35s" }}/>)}
      </div>

      <div style={{ textAlign:"center" }}>
        <Eyebrow>ponto {idx+1} de {PONTOS.length}</Eyebrow>
        <Heading size="clamp(20px,5vw,28px)">{pt.nome}</Heading>
      </div>

      <div style={{ background:"#FDF5F7", border:`1.5px solid ${P.blush}`, borderRadius:12, padding:"14px 16px" }}>
        <div style={{ fontSize:11, letterSpacing:"0.12em", textTransform:"uppercase", color:P.rose, fontFamily:"system-ui", fontWeight:600, marginBottom:7 }}>📍 Onde tocar</div>
        <div style={{ fontSize:14, color:P.text, fontFamily:"system-ui", lineHeight:1.7 }}>{pt.onde}</div>
      </div>

      <div style={{ background:P.white, border:`1.5px solid ${P.border}`, borderRadius:14, padding:"16px", display:"flex", flexDirection:"column", gap:16 }}>
        {/* boneco com pontos */}
        <div style={{ width:120, margin:"0 auto" }}>
          <svg viewBox="0 0 100 160" style={{ width:"100%", height:"auto" }}>
            {/* cabeça */}
            <ellipse cx="50" cy="22" rx="18" ry="20" fill={P.linen} stroke={P.border} strokeWidth="1.2"/>
            {/* olhos */}
            <circle cx="43" cy="19" r="2.5" fill="white" stroke={P.border} strokeWidth="0.8"/>
            <circle cx="57" cy="19" r="2.5" fill="white" stroke={P.border} strokeWidth="0.8"/>
            <circle cx="43" cy="19" r="1.2" fill={P.muted}/><circle cx="57" cy="19" r="1.2" fill={P.muted}/>
            {/* boca */}
            <path d="M44 27 Q50 31 56 27" fill="none" stroke={P.light} strokeWidth="1" strokeLinecap="round"/>
            {/* tronco */}
            <rect x="34" y="44" width="32" height="40" rx="7" fill={P.linen} stroke={P.border} strokeWidth="1.2"/>
            {/* braço esq */}
            <rect x="16" y="46" width="18" height="30" rx="7" fill={P.linen} stroke={P.border} strokeWidth="1.2"/>
            {/* braço dir */}
            <rect x="66" y="46" width="18" height="30" rx="7" fill={P.linen} stroke={P.border} strokeWidth="1.2"/>
            {/* pernas */}
            <rect x="35" y="83" width="12" height="34" rx="6" fill={P.linen} stroke={P.border} strokeWidth="1.2"/>
            <rect x="53" y="83" width="12" height="34" rx="6" fill={P.linen} stroke={P.border} strokeWidth="1.2"/>

            {/* PONTOS EFT */}
            {/* 1 karate - lado da mão, fora do braço */}
            <circle cx="8" cy="76" r={idx===0?8:6} fill={idx===0?P.rose:idx>0?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="8" y="79.5" textAnchor="middle" fontSize="7" fill={idx===0?"white":P.rose} fontFamily="system-ui" fontWeight="800">1</text>

            {/* 2 topo */}
            <circle cx="50" cy="4" r={idx===1?8:6} fill={idx===1?P.rose:idx>1?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="50" y="7.5" textAnchor="middle" fontSize="7" fill={idx===1?"white":P.rose} fontFamily="system-ui" fontWeight="800">2</text>

            {/* 3 sobrancelha */}
            <circle cx="36" cy="15" r={idx===2?8:6} fill={idx===2?P.rose:idx>2?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="36" y="18.5" textAnchor="middle" fontSize="7" fill={idx===2?"white":P.rose} fontFamily="system-ui" fontWeight="800">3</text>

            {/* 4 lado olho */}
            <circle cx="68" cy="17" r={idx===3?8:6} fill={idx===3?P.rose:idx>3?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="68" y="20.5" textAnchor="middle" fontSize="7" fill={idx===3?"white":P.rose} fontFamily="system-ui" fontWeight="800">4</text>

            {/* 5 abaixo olho */}
            <circle cx="50" cy="26" r={idx===4?8:6} fill={idx===4?P.rose:idx>4?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="50" y="29.5" textAnchor="middle" fontSize="7" fill={idx===4?"white":P.rose} fontFamily="system-ui" fontWeight="800">5</text>

            {/* 6 abaixo nariz */}
            <circle cx="50" cy="33" r={idx===5?8:6} fill={idx===5?P.rose:idx>5?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="50" y="36.5" textAnchor="middle" fontSize="7" fill={idx===5?"white":P.rose} fontFamily="system-ui" fontWeight="800">6</text>

            {/* 7 queixo */}
            <circle cx="50" cy="41" r={idx===6?8:6} fill={idx===6?P.rose:idx>6?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="50" y="44.5" textAnchor="middle" fontSize="7" fill={idx===6?"white":P.rose} fontFamily="system-ui" fontWeight="800">7</text>

            {/* 8 clavícula */}
            <circle cx="50" cy="50" r={idx===7?8:6} fill={idx===7?P.rose:idx>7?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="50" y="53.5" textAnchor="middle" fontSize="7" fill={idx===7?"white":P.rose} fontFamily="system-ui" fontWeight="800">8</text>

            {/* 9 lado corpo - lateral do tronco */}
            <circle cx="32" cy="63" r={idx===8?8:6} fill={idx===8?P.rose:idx>8?"#E8B0BC":P.white} stroke={P.rose} strokeWidth="1.2"/>
            <text x="32" y="66.5" textAnchor="middle" fontSize="7" fill={idx===8?"white":P.rose} fontFamily="system-ui" fontWeight="800">9</text>

            {idx===0 && <line x1="14" y1="74" x2="20" y2="72" stroke={P.rose} strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>}
            {idx===8 && <line x1="38" y1="63" x2="44" y2="62" stroke={P.rose} strokeWidth="1" strokeDasharray="2 2" opacity="0.5"/>}
          </svg>
        </div>

        {/* legenda */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:5 }}>
          {PONTOS.map((p,i)=>(
            <div key={p.id} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 8px", borderRadius:8, background:i===idx?"#FDF0F3":i<idx?"#FBF8F8":"transparent", transition:"all 0.25s" }}>
              <div style={{ width:20, height:20, borderRadius:"50%", background:i===idx?P.rose:i<idx?"#E8B0BC":P.linen, border:`1.5px solid ${i<=idx?P.rose:P.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:9, fontWeight:700, color:i===idx?"white":i<idx?P.rose:P.light, fontFamily:"system-ui", flexShrink:0 }}>{i+1}</div>
              <span style={{ fontSize:11, color:i===idx?P.rose:i<idx?P.light:P.muted, fontFamily:"system-ui", fontWeight:i===idx?600:400, lineHeight:1.3 }}>{p.nome}</span>
              {i===idx && <span style={{ fontSize:9, color:P.rose, fontFamily:"system-ui", marginLeft:"auto", whiteSpace:"nowrap" }}>←</span>}
              {i<idx && <span style={{ fontSize:9, color:P.light, fontFamily:"system-ui", marginLeft:"auto" }}>✓</span>}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display:"flex", alignItems:"center", gap:14, background:P.white, border:`1.5px solid ${P.border}`, borderRadius:14, padding:"13px 16px" }}>
        <div style={{ position:"relative", width:52, height:52, flexShrink:0, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="52" height="52" style={{ position:"absolute", top:0, left:0, transform:"rotate(-90deg)" }}>
            <circle cx="26" cy="26" r="21" fill="none" stroke={P.linen} strokeWidth="3.5"/>
            <circle cx="26" cy="26" r="21" fill="none" stroke={P.rose} strokeWidth="3.5" strokeLinecap="round"
              strokeDasharray={2*Math.PI*21} strokeDashoffset={2*Math.PI*21*(1-pct)} style={{ transition:"stroke-dashoffset 1s linear" }}/>
          </svg>
          <span style={{ fontSize:11, fontWeight:700, color:P.rose, fontFamily:"system-ui" }}>{Math.max(0,pt.dur-tick)}s</span>
        </div>
        <div>
          <div style={{ fontSize:13, fontWeight:600, color:P.text, fontFamily:"system-ui", marginBottom:3 }}>{pt.setup?"Repita 3 vezes enquanto toca":"Repita enquanto toca"}</div>
          <div style={{ fontSize:12, color:P.light, fontFamily:"system-ui" }}>{taps} toques ✦</div>
        </div>
      </div>

        <div style={{ background:pt.setup?"#FDF0F3":P.white, border:`1.5px solid ${pt.setup?P.rose:P.border}`, borderRadius:14, padding:"18px", textAlign:"center" }}>
          {pt.setup && <div style={{ fontSize:10, letterSpacing:"0.14em", textTransform:"uppercase", color:P.rose, fontFamily:"system-ui", fontWeight:600, marginBottom:10 }}>Repita 3 vezes</div>}
          <div style={{ fontFamily:"Georgia,serif", fontSize:"clamp(15px,4vw,18px)", color:P.text, lineHeight:1.75, fontStyle:"italic" }}>"{pt.frase}"</div>
        </div>
    </div>
  );

  if(screen==="done") return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#5A8A5A,#3A6A3A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, boxShadow:"0 8px 36px rgba(58,106,58,0.28)" }}>🌿</div>
      <div>
        <Eyebrow color="#5A8A5A">Preparação concluída</Eyebrow>
        <Heading>Seu sistema nervoso<br/>recebeu o sinal.</Heading>
        <div style={{ marginTop:12 }}><Lead>O que aconteceu aqui tem base fisiológica — não simbólica. Guarda essa técnica: ela funciona sempre que a ansiedade apertar.</Lead></div>
      </div>
      <AvisoMedico tipo="fim"/>
      <BtnP label="Continuar →" onClick={onDone}/>
    </div>
  );
  return null;
}

/* ─── HAVENING ───────────────────────────────────────── */
function HaveningSession({ onDone }) {
  const [screen, setScreen] = useState("intro");
  const [emocao, setEmocao] = useState(null);
  const [stepIdx, setStepIdx] = useState(0);
  const [tick, setTick] = useState(0);
  const timerRef = useRef(null);
  const step = HAVENING_PASSOS[stepIdx];
  const isLast = stepIdx===HAVENING_PASSOS.length-1;
  const pct = step?tick/step.dur:0;
  const emo = EMOCOES.find(e=>e.val===emocao);

  useEffect(()=>{
    if(screen!=="session") return;
    timerRef.current=setInterval(()=>{
      setTick(t=>{ if(t+1>=step.dur){ clearInterval(timerRef.current); if(isLast) setTimeout(()=>setScreen("done"),500); else setTimeout(()=>{setStepIdx(i=>i+1);setTick(0);},500); return t+1; } return t+1; });
    },1000);
    return ()=>clearInterval(timerRef.current);
  },[screen,stepIdx]);

  if(screen==="intro") return (
    <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
      <div>
        <Eyebrow color={P.sage}>Regulação emocional profunda · Havening</Eyebrow>
        <Heading>Para a dor que<br/>não é ansiedade</Heading>
        <div style={{ marginTop:12 }}><Lead>O Havening usa toque suave e repetitivo para gerar um estado de calma profunda no cérebro. Ele desativa a carga emocional sem exigir que você entenda ou explique o que sente.</Lead></div>
      </div>
      <AvisoMedico tipo="inicio"/>
      <Heading size="clamp(18px,4vw,22px)">O que está presente em você agora?</Heading>
      <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
        {EMOCOES.map(e=>(
          <div key={e.val} onClick={()=>setEmocao(e.val)} style={{ background:emocao===e.val?"#F0F5F0":P.white, border:`1.5px solid ${emocao===e.val?P.sage:P.border}`, borderRadius:12, padding:"14px 16px", cursor:"pointer", display:"flex", alignItems:"center", gap:12, userSelect:"none", transition:"all 0.18s" }}>
            <span style={{ fontSize:20 }}>{e.icon}</span>
            <span style={{ fontSize:15, fontWeight:600, color:P.text, fontFamily:"system-ui", flex:1 }}>{e.label}</span>
            <div style={{ width:19, height:19, borderRadius:"50%", border:`1.5px solid ${emocao===e.val?P.sage:P.border}`, background:emocao===e.val?P.sage:P.white, display:"flex", alignItems:"center", justifyContent:"center", fontSize:10, color:"white" }}>{emocao===e.val?"✓":""}</div>
          </div>
        ))}
      </div>
      {emocao && (
        <div style={{ background:"#F0F5F0", border:"1.5px solid #C0D8C0", borderRadius:12, padding:"16px 18px" }}>
          <div style={{ fontSize:12, color:"#4A7A5A", fontFamily:"system-ui", fontWeight:600, marginBottom:6 }}>Sua frase âncora</div>
          <div style={{ fontFamily:"Georgia,serif", fontSize:15, color:P.text, fontStyle:"italic", lineHeight:1.7 }}>"{emo?.frase}"</div>
        </div>
      )}
      <BtnP label="Iniciar Havening →" onClick={()=>setScreen("session")} disabled={!emocao}/>
      <BtnG label="Pular por agora" onClick={onDone}/>
    </div>
  );

  if(screen==="session") return (
    <div style={{ display:"flex", flexDirection:"column", gap:18 }}>
      <div style={{ display:"flex", gap:6, justifyContent:"center" }}>
        {HAVENING_PASSOS.map((s,i)=><div key={s.id} style={{ height:5, borderRadius:10, width:i===stepIdx?28:8, background:i<=stepIdx?P.sage:P.border, opacity:i<stepIdx?0.4:1, transition:"all 0.35s" }}/>)}
      </div>
      <div style={{ textAlign:"center" }}>
        <Eyebrow color={P.sage}>etapa {stepIdx+1} de {HAVENING_PASSOS.length}</Eyebrow>
        <Heading size="clamp(20px,5vw,28px)">{step.nome}</Heading>
        <div style={{ fontSize:13, color:P.light, fontFamily:"system-ui", marginTop:4 }}>{step.sub}</div>
      </div>
      <div style={{ display:"flex", justifyContent:"center" }}>
        <div style={{ position:"relative", width:110, height:110, display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="110" height="110" style={{ position:"absolute", top:0, left:0, transform:"rotate(-90deg)" }}>
            <circle cx="55" cy="55" r="46" fill="none" stroke={P.linen} strokeWidth="4"/>
            <circle cx="55" cy="55" r="46" fill="none" stroke={P.sage} strokeWidth="4" strokeLinecap="round"
              strokeDasharray={2*Math.PI*46} strokeDashoffset={2*Math.PI*46*(1-pct)} style={{ transition:"stroke-dashoffset 1s linear" }}/>
          </svg>
          <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:2 }}>
            <span style={{ fontSize:26 }}>{step.icon}</span>
            <span style={{ fontSize:12, fontWeight:700, color:P.sage, fontFamily:"system-ui" }}>{Math.max(0,step.dur-tick)}s</span>
          </div>
        </div>
      </div>
      <Card>
        <div style={{ fontSize:14, color:P.text, fontFamily:"system-ui", lineHeight:1.7, marginBottom:14 }}>{step.cue}</div>
        <div style={{ height:1, background:P.border, margin:"0 0 12px" }}/>
        <div style={{ fontSize:12, color:P.sage, fontFamily:"system-ui", fontWeight:600, marginBottom:6 }}>Enquanto toca, repita:</div>
        <div style={{ fontFamily:"Georgia,serif", fontSize:"clamp(14px,4vw,17px)", color:P.text, fontStyle:"italic", lineHeight:1.7 }}>"{emo?.frase}"</div>
      </Card>
    </div>
  );

  if(screen==="done") return (
    <div style={{ display:"flex", flexDirection:"column", gap:20, alignItems:"center", textAlign:"center" }}>
      <div style={{ width:80, height:80, borderRadius:"50%", background:"linear-gradient(135deg,#5A7A6A,#3A5A4A)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:36, boxShadow:"0 8px 36px rgba(58,90,74,0.28)" }}>🌊</div>
      <div>
        <Eyebrow color={P.sage}>Havening concluído</Eyebrow>
        <Heading>O toque fez seu trabalho.<br/>Você fez o seu também.</Heading>
        <div style={{ marginTop:12 }}><Lead>O que você sente agora não é coincidência. É o seu sistema nervoso respondendo ao cuidado que você acabou de dar a si mesma.</Lead></div>
      </div>
      <AvisoMedico tipo="fim"/>
      <BtnP label="Continuar →" onClick={onDone}/>
    </div>
  );
  return null;
}

/* ─── APP ────────────────────────────────────────────── */
const TOTAL_FORM = 6;

export default function App() {
  const [step, setStep]               = useState(0);
  const [nome, setNome]               = useState("");
  const [motivo, setMotivo]           = useState(new Set());
  const [tempo, setTempo]             = useState("");
  const [impacto, setImpacto]         = useState(new Set());
  const [tentou, setTentou]           = useState(new Set());
  const [intencao, setIntencao]       = useState(new Set());
  const [extra, setExtra]             = useState("");
  const [ansPre, setAnsPre]           = useState(null);
  const [ansPos, setAnsPos]           = useState(null);
  const [errs, setErrs]               = useState({});

  function goTo(n) { setErrs({}); setStep(n); window.scrollTo(0,0); }
  function err(k)  { return !!errs[k]; }
  function need(k,ok) { if(!ok){ setErrs(e=>({...e,[k]:true})); return false; } return true; }
  function tog(set,fn,v) { const n=new Set(set); n.has(v)?n.delete(v):n.add(v); fn(n); }

  const showBar = step>=1 && step<=TOTAL_FORM;
  const pct     = showBar ? Math.round((step/TOTAL_FORM)*100) : 0;
  const delta   = ansPre!==null && ansPos!==null ? ansPre-ansPos : null;

  const tL  = { rel:"Relacionamento", ans:"Ansiedade", ident:"Identidade", pat:"Padrão que repete", sol:"Solidão", aut:"Autoestima" };
  const tmL = { rec:"Menos de 1 mês", meses:"Alguns meses", ano:"Cerca de 1 ano", anos:"Mais de 1 ano" };
  const iL  = { clareza:"Clareza", alivio:"Alívio", direcao:"Direção", acolhida:"Acolhimento", coragem:"Coragem", plano:"Um próximo passo" };

  return (
    <div style={{ background:P.bg, minHeight:"100vh", fontFamily:"Georgia,serif", color:P.text }}>
      <div style={{ height:4, background:`linear-gradient(90deg,${P.plum},${P.rose},${P.blush})` }}/>

      {showBar && (
        <div style={{ background:P.bg, borderBottom:`1px solid ${P.border}`, padding:"13px 20px 11px", position:"sticky", top:0, zIndex:10 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:9 }}>
            <span style={{ fontSize:14, color:P.plum, fontStyle:"italic" }}>Sessão Pocket</span>
            <span style={{ fontSize:11, color:P.light, fontFamily:"system-ui" }}>{step} de {TOTAL_FORM}</span>
          </div>
          <div style={{ height:2, background:P.linen, borderRadius:10, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${pct}%`, background:`linear-gradient(90deg,${P.plum},${P.rose})`, borderRadius:10, transition:"width 0.5s ease" }}/>
          </div>
        </div>
      )}

      <div style={{ maxWidth:540, margin:"0 auto", padding:"32px 20px 64px", display:"flex", flexDirection:"column", gap:24 }}>

        {/* 0 ── ABERTURA */}
        {step===0 && (
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            <div style={{ width:62, height:62, borderRadius:"50%", background:P.linen, border:`2px solid ${P.border}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:26 }}>🌸</div>
            <div>
              <Eyebrow>Bem-vinda</Eyebrow>
              <Heading size="clamp(30px,8vw,44px)">Preparei este espaço<br/>para receber você.</Heading>
              <div style={{ marginTop:14 }}><Lead>Essas perguntas me ajudam a entender melhor o momento que você está vivendo.</Lead></div>
            </div>

            <Divider label="sua jornada"/>

            <div>
              <div style={{ fontSize:13, fontWeight:600, color:P.text, fontFamily:"system-ui", marginBottom:4 }}>Complete os 3 pilares na área de membros</div>
              <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", marginBottom:14, lineHeight:1.6 }}>São os 3 pilares que ajudam a revelar os padrões emocionais por trás do que você está vivendo — e me permitem conduzir sua sessão com mais precisão.</div>
              <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
                {[{n:"01",icon:"🧬",title:"Personalidade",sub:"Quem você é e como você funciona por dentro"},{n:"02",icon:"🌿",title:"Raiz Invisível",sub:"Os padrões que moldam suas relações sem você ver"},{n:"03",icon:"🧭",title:"Mapa Emocional",sub:"O território da sua vida emocional agora"}].map(p=>(
                  <div key={p.n} style={{ background:P.white, border:`1.5px solid ${P.border}`, borderRadius:14, padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
                    <div style={{ width:33, height:33, borderRadius:"50%", background:`linear-gradient(135deg,${P.plum},${P.rose})`, display:"flex", alignItems:"center", justifyContent:"center", color:"white", fontSize:10, fontWeight:700, fontFamily:"system-ui", flexShrink:0 }}>{p.n}</div>
                    <div>
                      <div style={{ fontSize:14, fontWeight:600, color:P.text, fontFamily:"system-ui" }}>{p.icon} {p.title}</div>
                      <div style={{ fontSize:12, color:P.light, fontFamily:"system-ui", marginTop:2 }}>{p.sub}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ background:`linear-gradient(135deg,#FDF5F7,#F9F1F4)`, border:`1px solid ${P.blush}`, borderRadius:14, padding:"20px" }}>
              <div style={{ fontSize:12, letterSpacing:"0.13em", textTransform:"uppercase", color:P.rose, fontFamily:"system-ui", fontWeight:600, marginBottom:14 }}>O que te espera aqui</div>
              <div style={{ display:"flex", flexDirection:"column", gap:14 }}>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>🧠</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:P.text, fontFamily:"system-ui", marginBottom:3 }}>Perguntas que revelam o que importa</div>
                    <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.6 }}>As perguntas abaixo me ajudam a entender com mais clareza o que você está vivendo hoje.</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>⚡</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:P.text, fontFamily:"system-ui", marginBottom:3 }}>Uma técnica usada com veteranos de guerra</div>
                    <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.6 }}>O EFT foi aplicado em militares com trauma severo — e você vai experimentar uma versão guiada agora, para chegar na sessão com o sistema nervoso preparado.</div>
                  </div>
                </div>
                <div style={{ display:"flex", gap:14, alignItems:"flex-start" }}>
                  <span style={{ fontSize:22, flexShrink:0 }}>🌊</span>
                  <div>
                    <div style={{ fontSize:14, fontWeight:600, color:P.text, fontFamily:"system-ui", marginBottom:3 }}>Regulação emocional profunda</div>
                    <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.6 }}>Uma segunda técnica somática para trabalhar dores que não são ansiedade — raiva, vergonha, luto, esgotamento.</div>
                  </div>
                </div>
              </div>
              <div style={{ background:P.linen, borderRadius:10, padding:"11px 14px", marginTop:14 }}>
                <div style={{ fontSize:12, color:P.muted, fontFamily:"system-ui", lineHeight:1.65 }}>✦ <strong style={{ color:P.rose }}>Alívio não é cura.</strong> Os exercícios aqui são ferramentas de regulação emocional — não substituem tratamento médico ou psiquiátrico.</div>
              </div>
            </div>

            <div style={{ background:`linear-gradient(135deg,#FDF5F7,#F9F1F4)`, border:`1px solid ${P.blush}`, borderRadius:14, padding:"18px" }}>
              <div style={{ fontSize:13, fontWeight:600, color:P.rose, fontFamily:"system-ui", marginBottom:6 }}>📅 Agende sua sessão</div>
              <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.65, marginBottom:14 }}>Quando terminar, me chama no WhatsApp para agendarmos sua sessão.</div>
              <a href="https://wa.me/5567981448229?text=Ol%C3%A1%2C%20acabei%20de%20fazer%20o%20onboarding%20e%20quero%20agendar%20minha%20Sess%C3%A3o%20Pocket!" target="_blank" rel="noopener noreferrer"
                style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", background:"#25D366", color:"white", borderRadius:100, padding:"14px", fontSize:15, fontWeight:600, textDecoration:"none", fontFamily:"system-ui", boxSizing:"border-box" }}>
                <svg width="17" height="17" viewBox="0 0 32 32" fill="white"><path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.773L0 32l8.489-2.001A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm8.07 22.43c-.34.956-1.99 1.826-2.724 1.942-.698.11-1.58.156-2.549-.16-.588-.19-1.343-.444-2.308-.869-4.063-1.754-6.714-5.84-6.916-6.112-.2-.27-1.634-2.173-1.634-4.146 0-1.973 1.034-2.944 1.4-3.347.367-.403.8-.504 1.067-.504.267 0 .534.002.768.014.246.013.577-.093.903.689.34.807 1.155 2.78 1.255 2.98.1.2.167.433.033.7-.133.267-.2.433-.4.667-.2.233-.42.52-.6.7-.2.2-.408.416-.175.816.233.4 1.034 1.706 2.218 2.763 1.523 1.358 2.806 1.778 3.206 1.978.4.2.633.167.867-.1.233-.267 1-1.167 1.267-1.567.267-.4.533-.333.9-.2.367.133 2.334 1.1 2.734 1.3.4.2.667.3.767.467.1.167.1.967-.24 1.923z"/></svg>
                Agendar no WhatsApp
              </a>
            </div>
            <BtnP label="Começar →" onClick={()=>goTo(1)}/>
          </div>
        )}

        {/* 1 ── NOME */}
        {step===1 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <Heading>Qual é o seu nome?</Heading>
            <div>
              <input value={nome} onChange={e=>{setNome(e.target.value);setErrs({});}} placeholder="Seu primeiro nome" maxLength={40}
                style={{ width:"100%", background:P.white, border:`1.5px solid ${P.border}`, borderRadius:12, padding:"15px 18px", fontSize:16, color:P.text, fontFamily:"system-ui", fontWeight:300, outline:"none", boxSizing:"border-box", WebkitAppearance:"none" }}/>
              {nome.length>0 && <div style={{ fontSize:11, color:P.light, textAlign:"right", marginTop:5, fontFamily:"system-ui" }}>{nome.length}/40</div>}
              <Err msg="Escreva seu nome para continuar" show={err("nome")}/>
            </div>
            <BtnP label="Continuar →" onClick={()=>{ if(!need("nome",nome.trim())) return; goTo(2); }}/>
            <BtnG label="← Voltar" onClick={()=>goTo(0)}/>
          </div>
        )}

        {/* 2 ── MOTIVO */}
        {step===2 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <Heading>O que mais tem pesado<br/>em você, {nome}?</Heading>
              <div style={{ fontSize:12, color:P.light, fontFamily:"system-ui", marginTop:8 }}>Pode marcar mais de uma ✦</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[{val:"rel",icon:"💛",title:"Meu relacionamento",sub:"Conflitos, dependência, distância emocional"},{val:"ans",icon:"🌊",title:"Ansiedade e angústia",sub:"O aperto que não passa, a cabeça que não para"},{val:"ident",icon:"🪞",title:"Me perdi de mim mesma",sub:"Não sei mais o que quero, quem sou fora dos outros"},{val:"pat",icon:"🔄",title:"Um padrão que se repete",sub:"Sempre acabo no mesmo lugar, com as mesmas dores"},{val:"sol",icon:"🫧",title:"Solidão e vazio",sub:"Mesmo rodeada de gente, me sinto sozinha por dentro"},{val:"aut",icon:"🌱",title:"Autoestima e autossabotagem",sub:"Dificuldade de me valorizar e acreditar em mim"}].map(o=>(
                <OptCard key={o.val} {...o} selected={motivo.has(o.val)} onClick={()=>tog(motivo,setMotivo,o.val)}/>
              ))}
            </div>
            {motivo.size>0 && <InsightCard text={INS_MOTIVO[[...motivo][motivo.size-1]]}/>}
            <Err msg="Marque pelo menos uma opção" show={err("motivo")}/>
            <BtnP label="Continuar →" onClick={()=>{ if(!need("motivo",motivo.size>0)) return; goTo(3); }}/>
            <BtnG label="← Voltar" onClick={()=>goTo(1)}/>
          </div>
        )}

        {/* 3 ── TEMPO */}
        {step===3 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <Heading>Há quanto tempo<br/>isso está presente?</Heading>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[{val:"rec",icon:"🕊️",title:"Menos de 1 mês",sub:"Algo recente que me pegou de surpresa"},{val:"meses",icon:"🌿",title:"Alguns meses",sub:"Já está presente na minha rotina"},{val:"ano",icon:"🍂",title:"Cerca de 1 ano",sub:"Tem ficado mais pesado com o tempo"},{val:"anos",icon:"🪨",title:"Mais de 1 ano",sub:"Carrego isso há muito tempo, já virou parte de mim"}].map(o=>(
                <OptCard key={o.val} {...o} selected={tempo===o.val} multi={false} onClick={()=>{ setTempo(o.val); setErrs({}); }}/>
              ))}
            </div>
            {tempo && <InsightCard text={INS_TEMPO[tempo]}/>}
            <Err msg="Escolha uma opção" show={err("tempo")}/>
            <BtnP label="Continuar →" onClick={()=>{ if(!need("tempo",tempo)) return; goTo(4); }}/>
            <BtnG label="← Voltar" onClick={()=>goTo(2)}/>
          </div>
        )}

        {/* 4 ── IMPACTO */}
        {step===4 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <Heading>Onde você sente isso<br/>no seu dia a dia?</Heading>
              <div style={{ fontSize:12, color:P.light, fontFamily:"system-ui", marginTop:8 }}>Pode marcar mais de uma ✦</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10 }}>
              {[{val:"amor",icon:"❤️",title:"Vínculos afetivos"},{val:"trab",icon:"💼",title:"Trabalho e foco"},{val:"corp",icon:"🧘",title:"Corpo e saúde"},{val:"auto",icon:"🪞",title:"Autoconfiança"},{val:"soc",icon:"🫂",title:"Vida social"},{val:"dec",icon:"🧭",title:"Decisões"}].map(o=>(
                <GridCard key={o.val} {...o} selected={impacto.has(o.val)} onClick={()=>tog(impacto,setImpacto,o.val)}/>
              ))}
            </div>
            {impacto.size>=2 && <InsightCard text="Quando a dor se espalha por mais de uma área, quase sempre há uma raiz única alimentando todas elas. É isso que vamos encontrar juntas."/>}
            <Err msg="Marque pelo menos uma área" show={err("impacto")}/>
            <BtnP label="Continuar →" onClick={()=>{ if(!need("impacto",impacto.size>0)) return; goTo(5); }}/>
            <BtnG label="← Voltar" onClick={()=>goTo(3)}/>
          </div>
        )}

        {/* 5 ── TENTOU */}
        {step===5 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <Heading>O que você já tentou<br/>fazer com isso?</Heading>
              <div style={{ fontSize:12, color:P.light, fontFamily:"system-ui", marginTop:8 }}>Pode marcar mais de uma ✦</div>
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
              {[{val:"ter",icon:"🛋️",title:"Terapia ou acompanhamento",sub:"Já fui, ainda vou, ou tentei no passado"},{val:"livros",icon:"📖",title:"Livros, podcasts e conteúdo",sub:"Busquei entender pela informação"},{val:"amigos",icon:"💬",title:"Conversas com amigas",sub:"Tentei elaborar falando com quem confio"},{val:"medi",icon:"🌬️",title:"Meditação ou práticas espirituais",sub:"Busquei silêncio, respiração, fé"},{val:"nada",icon:"🪨",title:"Ainda não fiz nada",sub:"Essa é a primeira vez que peço ajuda"},{val:"outro",icon:"✨",title:"Outro caminho",sub:"Tentei algo diferente dos anteriores"}].map(o=>(
                <OptCard key={o.val} {...o} selected={tentou.has(o.val)} onClick={()=>tog(tentou,setTentou,o.val)}/>
              ))}
            </div>
            {tentou.size>0 && !tentou.has("nada") && <InsightCard text="Quem tenta já está em movimento. Cada caminho percorrido te trouxe até aqui — e aqui é um bom lugar para estar."/>}
            {tentou.has("nada") && <InsightCard text="Pedir ajuda pela primeira vez exige mais coragem do que qualquer coisa que você poderia ter tentado antes. Fico honrada em ser essa primeira vez."/>}
            <Err msg="Marque pelo menos uma opção" show={err("tentou")}/>
            <BtnP label="Continuar →" onClick={()=>{ if(!need("tentou",tentou.size>0)) return; goTo(6); }}/>
            <BtnG label="← Voltar" onClick={()=>goTo(4)}/>
          </div>
        )}

        {/* 6 ── INTENÇÃO + EXTRA */}
        {step===6 && (
          <div style={{ display:"flex", flexDirection:"column", gap:20 }}>
            <div>
              <Heading>Como você quer<br/>sair da sessão?</Heading>
              <div style={{ fontSize:12, color:P.light, fontFamily:"system-ui", marginTop:8 }}>Pode marcar mais de uma ✦</div>
            </div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit, minmax(130px, 1fr))", gap:10 }}>
              {[{val:"clareza",icon:"🔦",title:"Clareza"},{val:"alivio",icon:"🍃",title:"Alívio"},{val:"direcao",icon:"🧭",title:"Direção"},{val:"acolhida",icon:"🤍",title:"Acolhimento"},{val:"coragem",icon:"🔥",title:"Coragem"},{val:"plano",icon:"📌",title:"Um próximo passo"}].map(o=>(
                <GridCard key={o.val} {...o} selected={intencao.has(o.val)} onClick={()=>tog(intencao,setIntencao,o.val)}/>
              ))}
            </div>
            <Err msg="Marque pelo menos uma opção" show={err("intencao")}/>
            <Divider label="última pergunta"/>
            <Heading size="clamp(20px,5vw,26px)">Tem algo que não perguntei<br/>que você quer que eu saiba?</Heading>
            <Textarea value={extra} onChange={e=>setExtra(e.target.value)}/>
            <BtnP label="Enviar →" onClick={()=>{ if(!need("intencao",intencao.size>0)) return; goTo(7); }}/>
            <BtnG label="← Voltar" onClick={()=>goTo(5)}/>
          </div>
        )}

        {/* 7 ── ESCALA PRÉ */}
        {step===7 && (
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            <div>
              <Eyebrow>Antes de começar</Eyebrow>
              <Heading>Onde está sua ansiedade<br/>agora, de 0 a 10?</Heading>
              <div style={{ marginTop:10 }}><Lead>Quero registrar como você chegou — para que você perceba a mudança depois.</Lead></div>
            </div>
            <Escala value={ansPre} onChange={setAnsPre}/>
            {ansPre!==null && (
              <div style={{ background:P.white, border:`1.5px solid ${P.border}`, borderRadius:12, padding:"15px 18px" }}>
                <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.65 }}>Registrado. Vamos fazer o EFT agora — e depois você marca de novo para ver o que mudou.</div>
              </div>
            )}
            <BtnP label="Continuar para o EFT →" onClick={()=>{ if(!need("ansPre",ansPre!==null)) return; goTo(8); }} disabled={ansPre===null}/>
            <Err msg="Selecione um número para continuar" show={err("ansPre")}/>
          </div>
        )}

        {/* 8 ── EFT */}
        {step===8 && <EFTSession onDone={()=>goTo(9)}/>}

        {/* 9 ── ESCALA PÓS */}
        {step===9 && (
          <div style={{ display:"flex", flexDirection:"column", gap:24 }}>
            <div>
              <Eyebrow color={P.sage}>E agora?</Eyebrow>
              <Heading>Como está sua ansiedade<br/>neste momento?</Heading>
            </div>
            <Escala value={ansPos} onChange={setAnsPos}/>
            {ansPos!==null && delta!==null && (
              <div style={{ background:delta>0?"linear-gradient(135deg,#F2FAF2,#EAF5EA)":delta===0?"linear-gradient(135deg,#FDF8F2,#FAF4EE)":"linear-gradient(135deg,#FDF5F7,#F9F1F4)", border:`1.5px solid ${delta>0?"#C0D8C0":P.border}`, borderRadius:14, padding:"20px", textAlign:"center" }}>
                {delta>0 ? (
                  <>
                    <div style={{ fontFamily:"Georgia,serif", fontSize:"clamp(30px,7vw,44px)", color:"#3A6A3A", marginBottom:8 }}>−{delta} pontos</div>
                    <div style={{ fontSize:14, color:"#5A8A5A", fontFamily:"system-ui", lineHeight:1.65 }}>
                      {delta>=5?"Mudança significativa. Seu sistema nervoso respondeu com profundidade.":delta>=3?"Uma redução real. O corpo percebeu o cuidado.":"Pequena mas real. Cada décimo importa."}
                    </div>
                  </>
                ) : delta===0 ? (
                  <Lead>O número pode não ter mudado — mas algo interno se moveu. Às vezes a regulação acontece abaixo do que conseguimos medir.</Lead>
                ) : (
                  <Lead>Tudo bem. Às vezes nomear o que sentimos faz a ansiedade aparecer mais antes de baixar. Continue.</Lead>
                )}
              </div>
            )}
            <BtnP label="Continuar →" onClick={()=>{ if(!need("ansPos",ansPos!==null)) return; goTo(10); }} disabled={ansPos===null}/>
            <Err msg="Selecione um número para continuar" show={err("ansPos")}/>
          </div>
        )}

        {/* 10 ── HAVENING */}
        {step===10 && <HaveningSession onDone={()=>goTo(11)}/>}

        {/* 11 ── ENCERRAMENTO */}
        {step===11 && (
          <div style={{ background:P.white, border:`1.5px solid ${P.border}`, borderRadius:20, padding:"40px 24px", display:"flex", flexDirection:"column", alignItems:"center", gap:22, textAlign:"center", boxShadow:"0 4px 32px rgba(0,0,0,0.05)" }}>
            <div style={{ width:78, height:78, borderRadius:"50%", background:`linear-gradient(135deg,${P.plum},${P.rose})`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:34, color:"white", boxShadow:`0 8px 32px rgba(92,52,68,0.3)` }}>✦</div>
            <div>
              <Eyebrow>Preparação concluída</Eyebrow>
              <Heading size="clamp(22px,5vw,30px)">{nome}, você já começou.</Heading>
              <div style={{ marginTop:12 }}><Lead>Tudo o que você compartilhou chega comigo com atenção. Cada resposta me ajuda a te acompanhar com mais presença.</Lead></div>
            </div>
            {delta!==null && delta>0 && (
              <div style={{ background:P.linen, borderRadius:12, padding:"14px 18px", width:"100%" }}>
                <div style={{ fontSize:13, color:P.muted, fontFamily:"system-ui", lineHeight:1.65 }}>Você entrou com ansiedade <strong style={{ color:P.rose }}>{ansPre}</strong> e encerrou com <strong style={{ color:P.sage }}>{ansPos}</strong>. Isso não é coincidência — é o que um sistema nervoso cuidado faz.</div>
              </div>
            )}
            <div style={{ display:"flex", flexWrap:"wrap", gap:7, justifyContent:"center" }}>
              {motivo.size>0 && <div style={{ background:P.linen, border:`1px solid ${P.border}`, borderRadius:100, padding:"6px 14px", fontSize:12, color:P.muted, fontFamily:"system-ui" }}>Tema: <strong style={{ color:P.rose }}>{[...motivo].map(k=>tL[k]).join(", ")}</strong></div>}
              {tempo && <div style={{ background:P.linen, border:`1px solid ${P.border}`, borderRadius:100, padding:"6px 14px", fontSize:12, color:P.muted, fontFamily:"system-ui" }}>Há: <strong style={{ color:P.rose }}>{tmL[tempo]}</strong></div>}
              {intencao.size>0 && <div style={{ background:P.linen, border:`1px solid ${P.border}`, borderRadius:100, padding:"6px 14px", fontSize:12, color:P.muted, fontFamily:"system-ui" }}>Quer: <strong style={{ color:P.rose }}>{[...intencao].map(k=>iL[k]).join(", ")}</strong></div>}
            </div>
            <Divider label="agende sua sessão"/>
            <a href="https://wa.me/5567981448229?text=Ol%C3%A1%2C%20acabei%20de%20fazer%20o%20onboarding%20e%20quero%20agendar%20minha%20Sess%C3%A3o%20Pocket!" target="_blank" rel="noopener noreferrer"
              style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10, width:"100%", background:"#25D366", color:"white", borderRadius:100, padding:"16px", fontSize:15, fontWeight:600, textDecoration:"none", fontFamily:"system-ui", boxSizing:"border-box" }}>
              <svg width="17" height="17" viewBox="0 0 32 32" fill="white"><path d="M16 0C7.164 0 0 7.163 0 16c0 2.822.736 5.469 2.027 7.773L0 32l8.489-2.001A15.93 15.93 0 0 0 16 32c8.836 0 16-7.163 16-16S24.836 0 16 0zm8.07 22.43c-.34.956-1.99 1.826-2.724 1.942-.698.11-1.58.156-2.549-.16-.588-.19-1.343-.444-2.308-.869-4.063-1.754-6.714-5.84-6.916-6.112-.2-.27-1.634-2.173-1.634-4.146 0-1.973 1.034-2.944 1.4-3.347.367-.403.8-.504 1.067-.504.267 0 .534.002.768.014.246.013.577-.093.903.689.34.807 1.155 2.78 1.255 2.98.1.2.167.433.033.7-.133.267-.2.433-.4.667-.2.233-.42.52-.6.7-.2.2-.408.416-.175.816.233.4 1.034 1.706 2.218 2.763 1.523 1.358 2.806 1.778 3.206 1.978.4.2.633.167.867-.1.233-.267 1-1.167 1.267-1.567.267-.4.533-.333.9-.2.367.133 2.334 1.1 2.734 1.3.4.2.667.3.767.467.1.167.1.967-.24 1.923z"/></svg>
              Agendar minha sessão
            </a>
          </div>
        )}

      </div>
    </div>
  );
}
