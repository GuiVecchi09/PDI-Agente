import { useState } from "react";

const TALENTOS_CLIFTON = [
  "Adaptabilidade","Analítico","Aprendizagem","Ativador","Autoafirmação",
  "Carisma","Comando","Comunicação","Competição","Conectividade",
  "Contexto","Deliberativo","Desenvolvedor","Disciplina","Empatia",
  "Equanimidade","Estudioso","Foco","Futurista","Harmonia",
  "Ideação","Inclusão","Individualização","Iniciativa","Input",
  "Intelecção","Liderança","Maximizador","Positivo","Prudência",
  "Realização","Relacionamento","Responsabilidade","Restauração"
];

const DOMINIO = {
  "Realização":"Execução","Organização":"Execução","Crença":"Execução",
  "Equanimidade":"Execução","Deliberativo":"Execução","Disciplina":"Execução",
  "Foco":"Execução","Responsabilidade":"Execução","Restauração":"Execução",
  "Ativador":"Influência","Comando":"Influência","Comunicação":"Influência",
  "Competição":"Influência","Maximizador":"Influência","Autoafirmação":"Influência",
  "Iniciativa":"Influência","Carisma":"Influência",
  "Adaptabilidade":"Relacionamento","Conectividade":"Relacionamento",
  "Desenvolvedor":"Relacionamento","Empatia":"Relacionamento","Harmonia":"Relacionamento",
  "Inclusão":"Relacionamento","Individualização":"Relacionamento",
  "Positivo":"Relacionamento","Relacionamento":"Relacionamento",
  "Analítico":"Pensamento Estratégico","Contexto":"Pensamento Estratégico",
  "Futurista":"Pensamento Estratégico","Ideação":"Pensamento Estratégico",
  "Input":"Pensamento Estratégico","Intelecção":"Pensamento Estratégico",
  "Aprendizagem":"Pensamento Estratégico","Estudioso":"Pensamento Estratégico",
  "Liderança":"Influência","Prudência":"Execução","Iniciativa":"Influência",
};

const COR_DOMINIO = {
  "Execução": "#3B6D11",
  "Influência": "#534AB7",
  "Relacionamento": "#0F6E56",
  "Pensamento Estratégico": "#185FA5",
};

const BG_DOMINIO = {
  "Execução": "#EAF3DE",
  "Influência": "#EEEDFE",
  "Relacionamento": "#E1F5EE",
  "Pensamento Estratégico": "#E6F1FB",
};

export default function App() {
  const [step, setStep] = useState(1);
  const [nome, setNome] = useState("");
  const [cargo, setCargo] = useState("");
  const [gestor, setGestor] = useState("");
  const [feedbacks, setFeedbacks] = useState("");
  const [talentosSel, setTalentosSel] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState("");

  function toggleTalento(t) {
    setTalentosSel(prev =>
      prev.includes(t) ? prev.filter(x => x !== t) : prev.length < 5 ? [...prev, t] : prev
    );
  }

  async function gerarAnalise() {
    if (!feedbacks.trim() || talentosSel.length === 0) return;
    setLoading(true);
    setErro("");
    try {
      const prompt = `Você é um especialista em desenvolvimento humano e na metodologia CliftonStrengths (livro "Descubra seus Pontos Fortes 2.0").

Analise os feedbacks comportamentais abaixo e os talentos CliftonStrengths do colaborador. Gere uma análise estruturada em JSON puro, sem markdown, sem blocos de código, apenas o objeto JSON.

COLABORADOR: ${nome || "Não informado"}
CARGO: ${cargo || "Não informado"}
TALENTOS CLIFTONSTRENGTHS (Top 5): ${talentosSel.join(", ")}

FEEDBACKS:
${feedbacks}

Retorne APENAS o seguinte JSON (sem texto antes ou depois, sem blocos de código):
{
  "pontos_fortes": ["lista de 6 a 8 pontos fortes comportamentais identificados nos feedbacks, em frases curtas"],
  "oportunidades": ["lista de 4 a 6 oportunidades de melhoria identificadas nos feedbacks, em frases curtas"],
  "resumo_potencial": "parágrafo de 4 a 6 linhas sobre os talentos e potencial do colaborador, integrando os talentos CliftonStrengths com os comportamentos observados",
  "resumo_oportunidades": "parágrafo de 3 a 5 linhas sobre as oportunidades de melhoria, conectando com os talentos e como trabalhar isso de forma positiva",
  "talentos_analise": [
    {
      "talento": "nome do talento",
      "manifestacao": "como esse talento se expressa nos feedbacks (1-2 frases)",
      "tensao": "onde esse talento pode gerar tensão ou ponto cego (1 frase)"
    }
  ],
  "pdi": [
    {
      "pilar": "título do pilar de desenvolvimento",
      "prazo": "ex: 0–3 meses",
      "acoes": [
        {
          "acao": "descrição da ação",
          "talento": "talento CliftonStrengths relacionado",
          "indicador": "como medir o progresso"
        }
      ]
    }
  ]
}`;

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json",
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  "anthropic-version": "2023-06-01",
  "anthropic-dangerous-direct-browser-ipc": "true"},
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 2000,
          messages: [{ role: "user", content: prompt }]
        })
      });
      const data = await response.json();
      const text = data.content.map(i => i.text || "").join("");
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResultado(parsed);
      setStep(3);
    } catch (e) {
      setErro("Erro ao gerar análise. Verifique sua conexão e tente novamente.");
    }
    setLoading(false);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#F7F6F2", fontFamily: "'DM Sans', 'Helvetica Neue', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=DM+Serif+Display&display=swap" rel="stylesheet" />
      <style>{`
        * { box-sizing: border-box; }
        input, textarea, select { font-family: inherit; }
        .pill-tag { display:inline-flex; font-size:11px; padding:3px 10px; border-radius:20px; font-weight:500; }
        .fade-in { animation: fadeIn .4s ease; }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:none} }
        .talent-btn { cursor:pointer; border:1px solid #E0DED8; border-radius:8px; padding:7px 12px;
          font-size:12px; background:#fff; transition:all .15s; user-select:none; }
        .talent-btn:hover { border-color:#888; }
        .talent-btn.sel { background:#1A1A1A; color:#fff; border-color:#1A1A1A; }
        .step-btn { background:#1A1A1A; color:#fff; border:none; border-radius:10px; padding:12px 28px;
          font-size:14px; font-weight:500; cursor:pointer; font-family:inherit; transition:opacity .15s; }
        .step-btn:hover { opacity:.85; }
        .step-btn:disabled { opacity:.4; cursor:not-allowed; }
        .sec-btn { background:#fff; color:#1A1A1A; border:1px solid #E0DED8; border-radius:10px;
          padding:11px 24px; font-size:14px; font-weight:400; cursor:pointer; font-family:inherit; transition:all .15s; }
        .sec-btn:hover { border-color:#888; }
        .input-field { width:100%; border:1px solid #E0DED8; border-radius:8px; padding:10px 14px;
          font-size:14px; background:#fff; outline:none; transition:border .15s; }
        .input-field:focus { border-color:#1A1A1A; }
        textarea.input-field { resize:vertical; min-height:140px; line-height:1.6; }
        .card-block { background:#fff; border:1px solid #E8E6E0; border-radius:14px; overflow:hidden; margin-bottom:16px; }
        .card-block-hdr { padding:14px 20px; border-bottom:1px solid #F0EEE8; display:flex; align-items:center; gap:8px; }
        .print-hide { }
        @media print {
          .print-hide { display:none !important; }
          body { background:#fff; }
        }
      `}</style>

      {/* Header */}
      <div style={{ background:"#1A1A1A", padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:28, height:28, background:"#F0EE8A", borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", fontSize:14, fontWeight:600, color:"#1A1A1A" }}>P</div>
          <span style={{ color:"#fff", fontFamily:"'DM Serif Display', serif", fontSize:18, letterSpacing:".01em" }}>PDI Inteligente</span>
        </div>
        <span style={{ color:"#888", fontSize:12 }}>Gerador de PDI · CliftonStrengths</span>
      </div>

      <div style={{ maxWidth:860, margin:"0 auto", padding:"32px 24px" }}>

        {/* Steps indicator */}
        <div className="print-hide" style={{ display:"flex", alignItems:"center", gap:8, marginBottom:32 }}>
          {["Dados","Feedbacks & Talentos","Resultado"].map((s,i) => (
            <div key={i} style={{ display:"flex", alignItems:"center", gap:8 }}>
              <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                <div style={{ width:24, height:24, borderRadius:"50%", background: step > i+1 ? "#3B6D11" : step === i+1 ? "#1A1A1A" : "#E0DED8",
                  color: step >= i+1 ? "#fff" : "#888", fontSize:11, fontWeight:600, display:"flex", alignItems:"center", justifyContent:"center", transition:"all .2s" }}>{i+1}</div>
                <span style={{ fontSize:13, color: step === i+1 ? "#1A1A1A" : "#999", fontWeight: step === i+1 ? 500 : 400 }}>{s}</span>
              </div>
              {i < 2 && <div style={{ width:32, height:1, background:"#E0DED8" }} />}
            </div>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="fade-in">
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, color:"#1A1A1A", margin:"0 0 6px" }}>Dados do colaborador</h1>
            <p style={{ color:"#888", fontSize:14, margin:"0 0 28px" }}>Preencha as informações básicas antes de inserir os feedbacks.</p>
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div>
                <label style={{ fontSize:12, fontWeight:500, color:"#555", display:"block", marginBottom:6 }}>Nome completo</label>
                <input className="input-field" placeholder="Ex: Ana Souza" value={nome} onChange={e=>setNome(e.target.value)} />
              </div>
              <div>
                <label style={{ fontSize:12, fontWeight:500, color:"#555", display:"block", marginBottom:6 }}>Cargo</label>
                <input className="input-field" placeholder="Ex: Analista de Planejamento" value={cargo} onChange={e=>setCargo(e.target.value)} />
              </div>
            </div>
            <div style={{ marginBottom:28 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"#555", display:"block", marginBottom:6 }}>Gestor responsável</label>
              <input className="input-field" placeholder="Ex: Carlos Lima" value={gestor} onChange={e=>setGestor(e.target.value)} />
            </div>
            <button className="step-btn" onClick={()=>setStep(2)}>Próximo →</button>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="fade-in">
            <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, color:"#1A1A1A", margin:"0 0 6px" }}>Feedbacks & Talentos</h1>
            <p style={{ color:"#888", fontSize:14, margin:"0 0 28px" }}>Cole os feedbacks recebidos e selecione os 5 talentos CliftonStrengths.</p>

            <div style={{ marginBottom:24 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"#555", display:"block", marginBottom:6 }}>
                Feedbacks comportamentais
                <span style={{ fontWeight:400, color:"#aaa", marginLeft:6 }}>Cole todos os feedbacks, de múltiplos avaliadores se houver</span>
              </label>
              <textarea className="input-field" placeholder="Cole aqui os textos de feedback comportamental. Pode incluir feedbacks de múltiplos avaliadores — o agente vai consolidar tudo automaticamente." value={feedbacks} onChange={e=>setFeedbacks(e.target.value)} style={{ minHeight:180 }} />
            </div>

            <div style={{ marginBottom:28 }}>
              <label style={{ fontSize:12, fontWeight:500, color:"#555", display:"block", marginBottom:4 }}>
                Top 5 talentos CliftonStrengths
                <span style={{ fontWeight:400, color:"#aaa", marginLeft:6 }}>Selecione exatamente 5</span>
              </label>
              <div style={{ fontSize:12, color: talentosSel.length === 5 ? "#3B6D11" : "#999", marginBottom:12, fontWeight: talentosSel.length === 5 ? 500 : 400 }}>
                {talentosSel.length}/5 selecionados {talentosSel.length === 5 ? "✓" : ""}
              </div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                {TALENTOS_CLIFTON.map(t => (
                  <button key={t} className={`talent-btn ${talentosSel.includes(t) ? "sel" : ""}`}
                    onClick={()=>toggleTalento(t)}
                    disabled={!talentosSel.includes(t) && talentosSel.length >= 5}>
                    {t}
                    {talentosSel.includes(t) && <span style={{ marginLeft:5, opacity:.7 }}>✓</span>}
                  </button>
                ))}
              </div>
              {talentosSel.length > 0 && (
                <div style={{ marginTop:14, display:"flex", flexWrap:"wrap", gap:6 }}>
                  {talentosSel.map(t => {
                    const dom = DOMINIO[t] || "Outros";
                    return (
                      <span key={t} className="pill-tag" style={{ background: BG_DOMINIO[dom]||"#F0EEE8", color: COR_DOMINIO[dom]||"#555" }}>
                        {t} · {dom}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>

            {erro && <div style={{ background:"#FCEBEB", color:"#A32D2D", border:"1px solid #F09595", borderRadius:8, padding:"10px 14px", fontSize:13, marginBottom:16 }}>{erro}</div>}

            <div style={{ display:"flex", gap:10 }}>
              <button className="sec-btn" onClick={()=>setStep(1)}>← Voltar</button>
              <button className="step-btn" onClick={gerarAnalise}
                disabled={!feedbacks.trim() || talentosSel.length !== 5 || loading}>
                {loading ? "Gerando análise..." : "Gerar PDI →"}
              </button>
            </div>

            {loading && (
              <div style={{ marginTop:20, padding:"16px 20px", background:"#F7F6F2", borderRadius:10, border:"1px solid #E8E6E0" }}>
                <div style={{ fontSize:13, color:"#555", marginBottom:8 }}>⏳ Analisando feedbacks e cruzando com os talentos CliftonStrengths...</div>
                <div style={{ height:3, background:"#E0DED8", borderRadius:2, overflow:"hidden" }}>
                  <div style={{ height:"100%", background:"#1A1A1A", borderRadius:2, animation:"load 2s ease-in-out infinite", width:"60%" }} />
                </div>
                <style>{`@keyframes load { 0%{transform:translateX(-100%)} 100%{transform:translateX(200%)} }`}</style>
              </div>
            )}
          </div>
        )}

        {/* STEP 3 — RESULTADO */}
        {step === 3 && resultado && (
          <div className="fade-in">
            {/* Header do resultado */}
            <div style={{ display:"flex", alignItems:"flex-start", justifyContent:"space-between", marginBottom:28, flexWrap:"wrap", gap:12 }}>
              <div>
                <h1 style={{ fontFamily:"'DM Serif Display',serif", fontSize:28, fontWeight:400, color:"#1A1A1A", margin:"0 0 4px" }}>
                  {nome || "Colaborador"}
                </h1>
                <p style={{ color:"#888", fontSize:14, margin:0 }}>{cargo} {gestor && `· Gestor: ${gestor}`}</p>
              </div>
              <div className="print-hide" style={{ display:"flex", gap:8 }}>
                <button className="sec-btn" onClick={()=>{ setResultado(null); setStep(2); }}>← Editar</button>
                <button className="step-btn" onClick={()=>window.print()}>Imprimir / Salvar PDF</button>
              </div>
            </div>

            {/* Pontos fortes + Oportunidades */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:16 }}>
              <div className="card-block">
                <div className="card-block-hdr">
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#3B6D11", display:"inline-block" }} />
                  <span style={{ fontSize:11, fontWeight:600, letterSpacing:".06em", color:"#3B6D11", textTransform:"uppercase" }}>Pontos fortes</span>
                </div>
                <div style={{ padding:"14px 20px", display:"flex", flexWrap:"wrap", gap:6 }}>
                  {resultado.pontos_fortes?.map((p,i) => (
                    <span key={i} className="pill-tag" style={{ background:"#EAF3DE", color:"#27500A" }}>{p}</span>
                  ))}
                </div>
              </div>
              <div className="card-block">
                <div className="card-block-hdr">
                  <span style={{ width:8, height:8, borderRadius:"50%", background:"#BA7517", display:"inline-block" }} />
                  <span style={{ fontSize:11, fontWeight:600, letterSpacing:".06em", color:"#854F0B", textTransform:"uppercase" }}>Oportunidades de melhoria</span>
                </div>
                <div style={{ padding:"14px 20px", display:"flex", flexWrap:"wrap", gap:6 }}>
                  {resultado.oportunidades?.map((o,i) => (
                    <span key={i} className="pill-tag" style={{ background:"#FAEEDA", color:"#633806" }}>{o}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Resumo qualitativo */}
            <div className="card-block" style={{ marginBottom:16 }}>
              <div className="card-block-hdr">
                <span style={{ fontSize:11, fontWeight:600, letterSpacing:".06em", color:"#555", textTransform:"uppercase" }}>Resumo qualitativo</span>
              </div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                <div style={{ padding:"16px 20px", borderRight:"1px solid #F0EEE8" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#3B6D11", marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Potencial & Talentos</div>
                  <p style={{ fontSize:13, color:"#333", lineHeight:1.75, margin:0 }}>{resultado.resumo_potencial}</p>
                </div>
                <div style={{ padding:"16px 20px" }}>
                  <div style={{ fontSize:11, fontWeight:600, color:"#854F0B", marginBottom:8, textTransform:"uppercase", letterSpacing:".05em" }}>Oportunidades de desenvolvimento</div>
                  <p style={{ fontSize:13, color:"#333", lineHeight:1.75, margin:0 }}>{resultado.resumo_oportunidades}</p>
                </div>
              </div>
            </div>

            {/* Talentos CliftonStrengths */}
            <div className="card-block" style={{ marginBottom:16 }}>
              <div className="card-block-hdr">
                <span style={{ fontSize:11, fontWeight:600, letterSpacing:".06em", color:"#185FA5", textTransform:"uppercase" }}>Talentos CliftonStrengths · Top 5</span>
              </div>
              {resultado.talentos_analise?.map((t,i) => {
                const dom = DOMINIO[t.talento] || "Outros";
                return (
                  <div key={i} style={{ display:"grid", gridTemplateColumns:"160px 1fr 1fr", borderBottom: i < resultado.talentos_analise.length-1 ? "1px solid #F0EEE8" : "none" }}>
                    <div style={{ padding:"12px 16px", background: BG_DOMINIO[dom]||"#F7F6F2", borderRight:"1px solid #F0EEE8" }}>
                      <div style={{ fontSize:13, fontWeight:600, color: COR_DOMINIO[dom]||"#333", marginBottom:3 }}>{t.talento}</div>
                      <div style={{ fontSize:11, color: COR_DOMINIO[dom]||"#888" }}>{dom}</div>
                    </div>
                    <div style={{ padding:"12px 16px", borderRight:"1px solid #F0EEE8" }}>
                      <div style={{ fontSize:10, fontWeight:600, color:"#3B6D11", marginBottom:4, textTransform:"uppercase", letterSpacing:".05em" }}>Manifestação</div>
                      <p style={{ fontSize:12, color:"#333", lineHeight:1.6, margin:0 }}>{t.manifestacao}</p>
                    </div>
                    <div style={{ padding:"12px 16px" }}>
                      <div style={{ fontSize:10, fontWeight:600, color:"#854F0B", marginBottom:4, textTransform:"uppercase", letterSpacing:".05em" }}>Tensão / Ponto cego</div>
                      <p style={{ fontSize:12, color:"#555", lineHeight:1.6, margin:0 }}>{t.tensao}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* PDI */}
            <div className="card-block">
              <div className="card-block-hdr">
                <span style={{ fontSize:11, fontWeight:600, letterSpacing:".06em", color:"#534AB7", textTransform:"uppercase" }}>Plano de Desenvolvimento Individual</span>
              </div>
              {resultado.pdi?.map((pilar, pi) => {
                const cores = [
                  { bg:"#E6F1FB", cor:"#185FA5" },
                  { bg:"#E1F5EE", cor:"#085041" },
                  { bg:"#EEEDFE", cor:"#3C3489" },
                ];
                const c = cores[pi % cores.length];
                return (
                  <div key={pi} style={{ borderBottom: pi < resultado.pdi.length-1 ? "1px solid #F0EEE8" : "none" }}>
                    <div style={{ padding:"12px 20px", background: c.bg, borderBottom:"1px solid #F0EEE8", display:"flex", alignItems:"center", gap:10 }}>
                      <div style={{ width:22, height:22, borderRadius:"50%", background: c.cor, color:"#fff", fontSize:11, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center" }}>{pi+1}</div>
                      <div style={{ fontWeight:500, fontSize:14, color:"#1A1A1A" }}>{pilar.pilar}</div>
                      <div style={{ marginLeft:"auto", fontSize:12, color:"#888" }}>{pilar.prazo}</div>
                    </div>
                    <div style={{ background:"#FAFAF8" }}>
                      <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", borderBottom:"1px solid #F0EEE8" }}>
                        {["Ação","Talento relacionado","Indicador"].map((h,hi) => (
                          <div key={hi} style={{ padding:"8px 16px", fontSize:10, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:".05em", borderRight: hi<2?"1px solid #F0EEE8":"none" }}>{h}</div>
                        ))}
                      </div>
                      {pilar.acoes?.map((a, ai) => (
                        <div key={ai} style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", borderBottom: ai < pilar.acoes.length-1 ? "1px solid #F5F3EE":"none" }}>
                          <div style={{ padding:"10px 16px", fontSize:13, color:"#222", lineHeight:1.6, borderRight:"1px solid #F0EEE8", display:"flex", gap:8 }}>
                            <span style={{ width:6, height:6, borderRadius:"50%", background: c.cor, flexShrink:0, marginTop:6 }} />
                            {a.acao}
                          </div>
                          <div style={{ padding:"10px 16px", fontSize:12, fontWeight:500, color: c.cor, lineHeight:1.5, borderRight:"1px solid #F0EEE8" }}>{a.talento}</div>
                          <div style={{ padding:"10px 16px", fontSize:12, color:"#666", lineHeight:1.5 }}>{a.indicador}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rodapé assinaturas */}
            <div style={{ marginTop:24, padding:"20px 24px", background:"#fff", border:"1px solid #E8E6E0", borderRadius:12 }}>
              <div style={{ fontSize:11, fontWeight:600, color:"#888", textTransform:"uppercase", letterSpacing:".06em", marginBottom:16 }}>Assinaturas</div>
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:24 }}>
                {["Colaborador","Gestor","Data"].map((l,i) => (
                  <div key={i}>
                    <div style={{ borderBottom:"1px solid #1A1A1A", marginBottom:6, paddingBottom:24 }} />
                    <div style={{ fontSize:12, color:"#888" }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
