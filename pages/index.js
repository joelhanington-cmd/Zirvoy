import { useState, useEffect } from "react";
import Head from "next/head";
import { supabase } from "../lib/supabase";

const C = {
  espresso:"#1C1410",bark:"#2E1F14",terracotta:"#C4622D",terra2:"#D4784A",
  sand:"#F2E8D9",sandLight:"#FAF6F0",parchment:"#EDE0CC",ink:"#1C1410",
  muted:"#8A7968",border:"#E0D4C0",white:"#FFFFFF",gold:"#C9943A",
};
const fmt=(n)=>Number(n).toLocaleString("en-GB");
const FONT_STYLE=`
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');
  @keyframes pulse{0%,100%{transform:scale(1);opacity:0.7}50%{transform:scale(1.1);opacity:1}}
  *{-webkit-font-smoothing:antialiased;box-sizing:border-box;}
  body{margin:0;padding:0;background:#FAF6F0;}
  input::placeholder,textarea::placeholder{color:#8A7968;}
  ::-webkit-scrollbar{display:none;}
`;
const AIRPORTS=["London Heathrow (LHR)","London Gatwick (LGW)","London Stansted (STN)","London Luton (LTN)","London City (LCY)","Manchester (MAN)","Birmingham (BHX)","Edinburgh (EDI)","Glasgow (GLA)","Bristol (BRS)","Leeds Bradford (LBA)","Newcastle (NCL)","Liverpool (LPL)","Belfast International (BFS)","Aberdeen (ABZ)","Southampton (SOU)","Cardiff (CWL)","Exeter (EXT)","Inverness (INV)","Dublin (DUB)","Amsterdam Schiphol (AMS)","Paris Charles de Gaulle (CDG)","Paris Orly (ORY)","Frankfurt (FRA)","Munich (MUC)","Berlin Brandenburg (BER)","Madrid Barajas (MAD)","Barcelona El Prat (BCN)","Rome Fiumicino (FCO)","Milan Malpensa (MXP)","Lisbon (LIS)","Porto (OPO)","Athens (ATH)","Brussels (BRU)","Zurich (ZRH)","Geneva (GVA)","Vienna (VIE)","Prague (PRG)","Warsaw (WAW)","Budapest (BUD)","Copenhagen (CPH)","Stockholm Arlanda (ARN)","Oslo Gardermoen (OSL)","Helsinki (HEL)","Reykjavik Keflavik (KEF)","Dubrovnik (DBV)","Split (SPU)","Venice (VCE)","Naples (NAP)","Palma Mallorca (PMI)","Malaga (AGP)","Ibiza (IBZ)","Tenerife (TFS)","Gran Canaria (LPA)","Nice (NCE)","Lyon (LYS)","Marseille (MRS)","Toulouse (TLS)","Seville (SVQ)","Valencia (VLC)","Alicante (ALC)","Faro (FAO)","Santorini (JTR)","Mykonos (JMK)","Corfu (CFU)","Rhodes (RHO)","Heraklion (HER)","Larnaca (LCA)","Paphos (PFO)","Malta (MLA)","Catania (CTA)","Palermo (PMO)","Bologna (BLQ)","Florence (FLR)","Pisa (PSA)","Turin (TRN)","Salzburg (SZG)","Innsbruck (INN)","Krakow (KRK)","Gdansk (GDN)","Wroclaw (WRO)","Riga (RIX)","Tallinn (TLL)","Vilnius (VNO)","Bucharest (OTP)","Sofia (SOF)","Belgrade (BEG)","Tirana (TIA)","Thessaloniki (SKG)","Dubai (DXB)","Abu Dhabi (AUH)","Doha (DOH)","Kuwait City (KWI)","Bahrain (BAH)","Muscat (MCT)","Riyadh (RUH)","Jeddah (JED)","Amman (AMM)","Beirut (BEY)","Tel Aviv (TLV)","Cairo (CAI)","Marrakech (RAK)","Casablanca (CMN)","Tunis (TUN)","Algiers (ALG)","Cape Town (CPT)","Johannesburg (JNB)","Durban (DUR)","Nairobi (NBO)","Addis Ababa (ADD)","Lagos (LOS)","Accra (ACC)","Zanzibar (ZNZ)","Mauritius (MRU)","Maldives Male (MLE)","Bangkok Suvarnabhumi (BKK)","Bangkok Don Mueang (DMK)","Singapore Changi (SIN)","Kuala Lumpur (KUL)","Jakarta (CGK)","Bali Denpasar (DPS)","Manila (MNL)","Hong Kong (HKG)","Tokyo Haneda (HND)","Tokyo Narita (NRT)","Osaka Kansai (KIX)","Seoul Incheon (ICN)","Beijing (PEK)","Shanghai Pudong (PVG)","Guangzhou (CAN)","Chengdu (CTU)","Delhi (DEL)","Mumbai (BOM)","Bangalore (BLR)","Chennai (MAA)","Kolkata (CCU)","Hyderabad (HYD)","Colombo (CMB)","Kathmandu (KTM)","Dhaka (DAC)","Islamabad (ISB)","Karachi (KHI)","Lahore (LHE)","Phuket (HKT)","Chiang Mai (CNX)","Ho Chi Minh City (SGN)","Hanoi (HAN)","Phnom Penh (PNH)","Yangon (RGN)","Taipei (TPE)","Langkawi (LGK)","Penang (PEN)","Lombok (LOP)","New York JFK (JFK)","New York Newark (EWR)","Los Angeles (LAX)","Chicago O'Hare (ORD)","Miami (MIA)","San Francisco (SFO)","Las Vegas (LAS)","Orlando (MCO)","Boston (BOS)","Seattle (SEA)","Dallas Fort Worth (DFW)","Houston (IAH)","Atlanta (ATL)","Washington Dulles (IAD)","Denver (DEN)","Phoenix (PHX)","Toronto Pearson (YYZ)","Vancouver (YVR)","Montreal (YUL)","Calgary (YYC)","Mexico City (MEX)","Cancun (CUN)","Sao Paulo (GRU)","Rio de Janeiro (GIG)","Buenos Aires (EZE)","Santiago (SCL)","Lima (LIM)","Bogota (BOG)","Panama City (PTY)","Havana (HAV)","Nassau (NAS)","Punta Cana (PUJ)","Montego Bay (MBJ)","Sydney (SYD)","Melbourne (MEL)","Brisbane (BNE)","Perth (PER)","Adelaide (ADL)","Auckland (AKL)","Christchurch (CHC)","Wellington (WLG)","Queenstown (ZQN)","Fiji Nadi (NAN)","Honolulu (HNL)"];
const NATIONALITIES=["British","Irish","American","Australian","Canadian","French","German","Italian","Spanish","Portuguese","Dutch","Belgian","Swedish","Norwegian","Danish","Finnish","Swiss","Austrian","Polish","Czech","Greek","Turkish","Indian","Pakistani","Bangladeshi","Chinese","Japanese","Korean","Brazilian","Mexican","South African","Nigerian","Kenyan","Egyptian","Moroccan","Saudi Arabian","Emirati","Israeli","Russian","Ukrainian","New Zealander","Singaporean","Malaysian","Thai","Indonesian","Filipino","Vietnamese","Argentine","Colombian","Chilean","Other"];

function ZirvoyMark({size=32,color=C.terracotta}){return(<svg width={size} height={size} viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke={color} strokeWidth="1.8"/><line x1="6" y1="20" x2="34" y2="20" stroke={color} strokeWidth="1.4"/><line x1="26" y1="9" x2="14" y2="31" stroke={color} strokeWidth="1.8" strokeLinecap="round"/><circle cx="20" cy="20" r="2.2" fill={color}/></svg>);}
function ZirvoyLogo({light=false,size="md"}){const fs=size==="sm"?"1.2rem":"1.6rem";const ms=size==="sm"?20:28;return(<div style={{display:"flex",alignItems:"center",gap:8}}><ZirvoyMark size={ms} color={light?C.sand:C.terracotta}/><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:fs,fontWeight:600,color:light?C.sand:C.espresso,letterSpacing:"0.14em",textTransform:"uppercase",lineHeight:1}}>Zirvoy</span></div>);}
function Input({label,type="text",value,onChange,placeholder,optional=false}){const[focused,setFocused]=useState(false);return(<div style={{marginBottom:"1rem"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.35rem"}}><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.72rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em"}}>{label}</label>{optional&&<span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.68rem",color:C.muted}}>Optional</span>}</div><input type={type} value={value} onChange={onChange} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder={placeholder} style={{width:"100%",padding:"0.85rem 1rem",background:C.sandLight,border:`1.5px solid ${focused?C.terracotta:C.border}`,borderRadius:10,fontSize:"0.95rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s"}}/></div>);}
function AirportInput({value,onChange}){const[focused,setFocused]=useState(false);const[query,setQuery]=useState(value||"");const[show,setShow]=useState(false);const filtered=query.length>0?AIRPORTS.filter(a=>a.toLowerCase().includes(query.toLowerCase())).slice(0,6):[];const select=(a)=>{setQuery(a);onChange(a);setShow(false);};return(<div style={{marginBottom:"1rem",position:"relative"}}><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.72rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",display:"block",marginBottom:"0.35rem"}}>Home Airport</label><input type="text" value={query} placeholder="e.g. London Heathrow" onChange={e=>{setQuery(e.target.value);onChange(e.target.value);setShow(true);}} onFocus={()=>{setFocused(true);setShow(true);}} onBlur={()=>{setFocused(false);setTimeout(()=>setShow(false),150);}} style={{width:"100%",padding:"0.85rem 1rem",background:C.sandLight,border:`1.5px solid ${focused?C.terracotta:C.border}`,borderRadius:10,fontSize:"0.95rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s"}}/>{show&&filtered.length>0&&(<div style={{position:"absolute",top:"100%",left:0,right:0,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,zIndex:50,boxShadow:"0 8px 24px rgba(28,20,16,0.12)",overflow:"hidden",marginTop:4}}>{filtered.map(a=>(<div key={a} onMouseDown={()=>select(a)} style={{padding:"0.75rem 1rem",fontSize:"0.88rem",color:C.ink,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",borderBottom:`1px solid ${C.parchment}`}} onMouseEnter={e=>e.target.style.background=C.sandLight} onMouseLeave={e=>e.target.style.background=C.white}>{a}</div>))}</div>)}</div>);}
function NationalityInput({value,onChange}){const[focused,setFocused]=useState(false);const[query,setQuery]=useState(value||"");const[show,setShow]=useState(false);const filtered=query.length>0?NATIONALITIES.filter(n=>n.toLowerCase().includes(query.toLowerCase())).slice(0,6):NATIONALITIES.slice(0,6);const select=(n)=>{setQuery(n);onChange(n);setShow(false);};return(<div style={{marginBottom:"1rem",position:"relative"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:"0.35rem"}}><label style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.72rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em"}}>Nationality</label><span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.68rem",color:C.muted}}>Optional</span></div><input type="text" value={query} placeholder="e.g. British" onChange={e=>{setQuery(e.target.value);onChange(e.target.value);setShow(true);}} onFocus={()=>{setFocused(true);setShow(true);}} onBlur={()=>{setFocused(false);setTimeout(()=>setShow(false),150);}} style={{width:"100%",padding:"0.85rem 1rem",background:C.sandLight,border:`1.5px solid ${focused?C.terracotta:C.border}`,borderRadius:10,fontSize:"0.95rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s"}}/>{show&&filtered.length>0&&(<div style={{position:"absolute",top:"100%",left:0,right:0,background:C.white,border:`1px solid ${C.border}`,borderRadius:10,zIndex:50,boxShadow:"0 8px 24px rgba(28,20,16,0.12)",overflow:"hidden",marginTop:4}}>{filtered.map(n=>(<div key={n} onMouseDown={()=>select(n)} style={{padding:"0.75rem 1rem",fontSize:"0.88rem",color:C.ink,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",borderBottom:`1px solid ${C.parchment}`}} onMouseEnter={e=>e.target.style.background=C.sandLight} onMouseLeave={e=>e.target.style.background=C.white}>{n}</div>))}</div>)}</div>);}
function Btn({children,onClick,disabled,variant="primary",style:s={}}){const base={width:"100%",padding:"1rem",border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:disabled?"default":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s",...s};const v={primary:{background:disabled?C.parchment:C.terracotta,color:disabled?C.muted:C.white},secondary:{background:"transparent",color:C.muted},dark:{background:C.espresso,color:C.sand},outline:{background:"transparent",color:C.sand,border:"1px solid rgba(242,232,217,0.2)"}};return<button onClick={!disabled?onClick:undefined} style={{...base,...v[variant]}}>{children}</button>;}

function BottomNav({active,onChange}){
  const tabs=[
    {id:"home",label:"Plan",icon:(a)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.terracotta:C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>)},
    {id:"trips",label:"My Trips",icon:(a)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.terracotta:C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>)},
    {id:"account",label:"Account",icon:(a)=>(<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?C.terracotta:C.muted} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>)},
  ];
  return(<div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.border}`,display:"flex",zIndex:90,paddingBottom:"env(safe-area-inset-bottom)"}}>
    {tabs.map(t=>(<button key={t.id} onClick={()=>onChange(t.id)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"0.65rem 0 0.5rem",background:"transparent",border:"none",cursor:"pointer",gap:3}}>
      {t.icon(active===t.id)}
      <span style={{fontFamily:"'DM Sans',sans-serif",fontSize:"0.65rem",fontWeight:active===t.id?600:400,color:active===t.id?C.terracotta:C.muted}}>{t.label}</span>
    </button>))}
  </div>);}

// ── BOOKING FLOW ──────────────────────────────────────────────────────────────
function BookingScreen({trip,onBack,onDone}){
  const[step,setStep]=useState(0); // 0=flights, 1=hotels, 2=activities
  const steps=["Flights","Hotels","Activities"];

  // Build Skyscanner deep link
  const buildSkyscannerUrl=()=>{
    const dest=encodeURIComponent(trip.destination);
    const travellers=trip.travellers||2;
    const today=new Date();
    const depart=new Date(today.setDate(today.getDate()+30));
    const ret=new Date(depart);
    ret.setDate(ret.getDate()+(trip.duration||4));
    const fmt2=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return `https://www.skyscanner.net/transport/flights/uk/${dest}/${fmt2(depart)}/${fmt2(ret)}/?adults=${travellers}&cabinclass=economy&currency=GBP&locale=en-GB&market=UK`;
  };

  // Build Booking.com deep link
  const buildBookingUrl=()=>{
    const dest=encodeURIComponent(trip.destination+", "+trip.country);
    const today=new Date();
    const checkin=new Date(today.setDate(today.getDate()+30));
    const checkout=new Date(checkin);
    checkout.setDate(checkout.getDate()+(trip.duration||4));
    const fmt2=(d)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    return `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${fmt2(checkin)}&checkout=${fmt2(checkout)}&group_adults=${trip.travellers||2}&no_rooms=1&lang=en-gb&currency=GBP`;
  };

  // Build GetYourGuide link
  const buildGYGUrl=()=>{
    const dest=encodeURIComponent(trip.destination);
    return `https://www.getyourguide.com/s/?q=${dest}&currency=GBP&language=en`;
  };

  const stepContent=[
    {
      icon:"✈",
      title:"Find your flights",
      description:`Search direct flights from the UK to ${trip.destination}. Prices are estimated — Skyscanner will show you live fares.`,
      tip:trip.flights,
      btnLabel:"Search Flights on Skyscanner →",
      btnUrl:buildSkyscannerUrl(),
      btnColor:C.terracotta,
      nextLabel:"I've sorted my flights →",
    },
    {
      icon:"🏨",
      title:"Find your hotel",
      description:`Browse hotels in ${trip.destination}. ${trip.hotel}`,
      tip:`Tip: Search for hotels in the areas Zirvoy recommended for the best experience.`,
      btnLabel:"Browse Hotels on Booking.com →",
      btnUrl:buildBookingUrl(),
      btnColor:"#003580",
      nextLabel:"I've found my hotel →",
    },
    {
      icon:"🎭",
      title:"Book activities",
      description:`Discover tours, experiences and things to do in ${trip.destination}. Skip the queues and book ahead.`,
      tip:`Based on your itinerary: ${trip.itinerary?.[0]?.morning||"Explore the city"}`,
      btnLabel:"Browse Activities on GetYourGuide →",
      btnUrl:buildGYGUrl(),
      btnColor:"#FF5533",
      nextLabel:"All done — view my trip",
    },
  ];

  const current=stepContent[step];

  return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
    {/* Header */}
    <div style={{background:C.espresso,padding:"2.5rem 1.5rem 2rem",position:"relative",overflow:"hidden"}}>
      <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/>
      <div style={{position:"relative"}}>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:"rgba(242,232,217,0.5)",fontSize:"0.82rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:6}}>
          ← Back to trip
        </button>
        <ZirvoyLogo light/>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:600,color:C.sand,margin:"1rem 0 0.25rem"}}>
          Let's book {trip.destination}
        </h2>
        <p style={{fontSize:"0.82rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>Step {step+1} of {steps.length}</p>
        {/* Progress bar */}
        <div style={{display:"flex",gap:6,marginTop:"1.25rem"}}>
          {steps.map((s,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?"rgba(196,98,45,0.8)":"rgba(242,232,217,0.15)",transition:"background 0.3s"}}/>))}
        </div>
      </div>
    </div>

    <div style={{padding:"1.5rem",maxWidth:640,margin:"0 auto"}}>
      {/* Step card */}
      <div style={{background:C.white,borderRadius:20,border:`1px solid ${C.border}`,padding:"1.5rem",marginBottom:"1rem",boxShadow:"0 4px 24px rgba(28,20,16,0.07)"}}>
        <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>{current.icon}</div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:600,color:C.espresso,margin:"0 0 0.5rem"}}>{current.title}</h3>
        <p style={{fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300,margin:"0 0 1.25rem"}}>{current.description}</p>

        {/* Tip box */}
        <div style={{background:C.sandLight,borderRadius:12,padding:"0.85rem 1rem",marginBottom:"1.25rem",borderLeft:`3px solid ${C.terracotta}`}}>
          <p style={{fontSize:"0.78rem",color:C.muted,margin:0,lineHeight:1.6,fontWeight:300}}>{current.tip}</p>
        </div>

        {/* Main CTA */}
        <a href={current.btnUrl} target="_blank" rel="noopener noreferrer"
          style={{display:"block",width:"100%",padding:"1rem",background:current.btnColor,color:C.white,border:"none",borderRadius:12,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"center",textDecoration:"none",boxSizing:"border-box",marginBottom:"0.75rem"}}>
          {current.btnLabel}
        </a>

        {/* Next step */}
        <button onClick={()=>step<steps.length-1?setStep(s=>s+1):onDone()}
          style={{width:"100%",padding:"0.85rem",background:"transparent",color:C.terracotta,border:`1.5px solid ${C.terracotta}`,borderRadius:12,fontSize:"0.88rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          {current.nextLabel}
        </button>
      </div>

      {/* Steps overview */}
      <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.1rem 1.25rem",boxShadow:"0 2px 12px rgba(28,20,16,0.05)"}}>
        <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.85rem"}}>Booking Checklist</p>
        {steps.map((s,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,paddingBottom:i<steps.length-1?"0.75rem":"0",marginBottom:i<steps.length-1?"0.75rem":"0",borderBottom:i<steps.length-1?`1px solid ${C.parchment}`:"none"}}>
          <div style={{width:22,height:22,borderRadius:"50%",background:i<step?C.terracotta:i===step?"rgba(196,98,45,0.15)":C.parchment,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            {i<step?<span style={{fontSize:"0.7rem",color:C.white}}>✓</span>:<span style={{fontSize:"0.65rem",color:i===step?C.terracotta:C.muted,fontWeight:600}}>{i+1}</span>}
          </div>
          <span style={{fontSize:"0.85rem",color:i<=step?C.espresso:C.muted,fontWeight:i===step?500:300,fontFamily:"'DM Sans',sans-serif"}}>{s}</span>
        </div>))}
      </div>
    </div>
  </div>);}

function MyTripsScreen({trips,onTripClick,onPlanNew}){return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}><div style={{background:C.espresso,padding:"3rem 1.5rem 2rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative"}}><ZirvoyLogo light/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:600,color:C.sand,margin:"1.25rem 0 0.25rem"}}>My Trips</h2><p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>{trips.length} {trips.length===1?"trip":"trips"} saved</p></div></div><div style={{padding:"1.5rem"}}>{trips.length===0?(<div style={{textAlign:"center",padding:"3rem 1rem"}}><div style={{marginBottom:"1rem",opacity:0.3}}><ZirvoyMark size={48} color={C.espresso}/></div><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",color:C.espresso,margin:"0 0 0.5rem"}}>No trips yet</p><p style={{fontSize:"0.85rem",color:C.muted,margin:"0 0 1.5rem",fontWeight:300}}>Plan your first trip and it'll be saved here automatically</p><button onClick={onPlanNew} style={{padding:"0.85rem 1.75rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.9rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Plan a Trip</button></div>):(<div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>{trips.map(t=>(<div key={t.id} onClick={()=>onTripClick(t)} style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(28,20,16,0.06)"}}>{t.trip_data?.photo&&(<div style={{height:120,overflow:"hidden",position:"relative"}}><img src={t.trip_data.photo} alt={t.destination} style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(28,20,16,0.7) 100%)"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0.75rem 1rem"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:600,color:C.sand,margin:0,lineHeight:1}}>{t.destination}</p><p style={{fontSize:"0.72rem",color:"rgba(242,232,217,0.7)",margin:"0.2rem 0 0",fontFamily:"'DM Sans',sans-serif"}}>{t.trip_data?.country}</p></div></div>)}<div style={{padding:"0.85rem 1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}><div style={{display:"flex",gap:"0.75rem"}}><span style={{fontSize:"0.75rem",color:C.muted}}>{t.trip_data?.duration} nights</span><span style={{fontSize:"0.75rem",color:C.muted}}>·</span><span style={{fontSize:"0.75rem",color:C.muted}}>£{fmt(t.trip_data?.budgetTotal)}</span><span style={{fontSize:"0.75rem",color:C.muted}}>·</span><span style={{fontSize:"0.75rem",color:C.muted}}>{t.trip_data?.travellers} travellers</span></div><span style={{color:C.terracotta,fontSize:"1rem"}}>→</span></div></div>))}<button onClick={onPlanNew} style={{marginTop:"0.5rem",padding:"1rem",background:"transparent",color:C.terracotta,border:`1.5px solid ${C.terracotta}`,borderRadius:14,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>+ Plan a New Trip</button></div>)}</div></div>);}

function AccountScreen({profile,onSignOut}){return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}><div style={{background:C.espresso,padding:"3rem 1.5rem 2.5rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative"}}><ZirvoyLogo light/><div style={{marginTop:"1.5rem",display:"flex",alignItems:"center",gap:"1rem"}}><div style={{width:52,height:52,borderRadius:"50%",background:"rgba(196,98,45,0.2)",border:`1.5px solid ${C.terracotta}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:C.sand}}>{(profile?.first_name?.[0]||"Z").toUpperCase()}</span></div><div><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:C.sand,margin:0}}>{profile?.first_name} {profile?.last_name}</p><p style={{fontSize:"0.8rem",color:"rgba(242,232,217,0.5)",margin:"0.1rem 0 0",fontWeight:300}}>{profile?.email}</p></div></div></div></div><div style={{padding:"1.5rem"}}><div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.25rem",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(28,20,16,0.05)"}}><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 1rem"}}>Your Details</p>{[["Home Airport",profile?.home_airport||"Not set"],["Nationality",profile?.nationality||"Not set"],["Date of Birth",profile?.date_of_birth||"Not set"]].map(([label,val])=>(<div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.85rem",marginBottom:"0.85rem",borderBottom:`1px solid ${C.parchment}`}}><span style={{fontSize:"0.85rem",color:C.muted}}>{label}</span><span style={{fontSize:"0.85rem",color:C.espresso,fontWeight:500}}>{val}</span></div>))}<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"0.85rem",color:C.muted}}>Passport</span><span style={{fontSize:"0.85rem",color:profile?.passport_number?C.espresso:C.muted,fontWeight:profile?.passport_number?500:300}}>{profile?.passport_number?"••••••••••":"Not added"}</span></div></div>{!profile?.passport_number&&(<div style={{background:C.parchment,borderRadius:14,padding:"1rem 1.1rem",marginBottom:"1rem",border:`1px solid ${C.border}`}}><p style={{fontSize:"0.8rem",fontWeight:600,color:C.espresso,margin:"0 0 0.25rem"}}>💡 Speed up booking</p><p style={{fontSize:"0.78rem",color:C.muted,margin:0,lineHeight:1.5,fontWeight:300}}>Add your passport details and we'll pre-fill them when you book.</p></div>)}<button onClick={onSignOut} style={{width:"100%",padding:"1rem",background:"transparent",color:"#c0392b",border:"1.5px solid #c0392b",borderRadius:14,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:"0.5rem"}}>Sign Out</button></div></div>);}

function SplashScreen({onCreateAccount,onLogin}){return(<div style={{minHeight:"100vh",background:C.espresso,display:"flex",flexDirection:"column",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-100,right:-100,width:400,height:400,borderRadius:"50%",border:"1px solid rgba(196,98,45,0.12)"}}/><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative",flex:1,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem"}}><div style={{animation:"pulse 3s ease-in-out infinite",marginBottom:"2rem"}}><ZirvoyMark size={72} color={C.terracotta}/></div><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"3.5rem",fontWeight:600,color:C.sand,margin:"0 0 0.5rem",letterSpacing:"0.14em",textTransform:"uppercase",textAlign:"center"}}>Zirvoy</h1><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontStyle:"italic",color:C.terra2,margin:"0 0 4rem",textAlign:"center"}}>Your world. Planned instantly.</p><div style={{width:"100%",maxWidth:380,display:"flex",flexDirection:"column",gap:"0.75rem"}}><Btn onClick={onCreateAccount} variant="primary">Create Account</Btn><Btn onClick={onLogin} variant="outline">Log In</Btn></div></div><p style={{position:"relative",textAlign:"center",fontFamily:"'DM Sans',sans-serif",fontSize:"0.7rem",color:"rgba(242,232,217,0.3)",padding:"1.5rem"}}>Free to use · AI-powered · Your data is secure</p></div>);}

function SignUpScreen({onSuccess,onLogin}){const[step,setStep]=useState(1);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const[form,setForm]=useState({firstName:"",lastName:"",email:"",password:"",dateOfBirth:"",nationality:"",homeAirport:"",passportNumber:"",passportExpiry:""});const set=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));const setVal=(k)=>(v)=>setForm(f=>({...f,[k]:v}));const s1v=form.firstName&&form.lastName&&form.email&&form.password.length>=6;const s2v=form.homeAirport;const handleSignUp=async()=>{setLoading(true);setError(null);try{const{data,error:ae}=await supabase.auth.signUp({email:form.email,password:form.password});if(ae)throw ae;if(data.user){const{error:profErr}=await supabase.from("profiles").insert({id:data.user.id,first_name:form.firstName,last_name:form.lastName,email:form.email,home_airport:form.homeAirport,date_of_birth:form.dateOfBirth||null,nationality:form.nationality||null,passport_number:form.passportNumber||null,passport_expiry:form.passportExpiry||null});if(profErr)throw profErr;}onSuccess(data.user);}catch(e){setError(e.message);}finally{setLoading(false);}};const titles=["Create your account","About you","Speed up bookings"];const subs=["Start planning in seconds","Helps us personalise your trips","Optional — save time when booking"];return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif"}}><div style={{background:C.espresso,padding:"2rem 1.5rem 2.5rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative"}}><ZirvoyLogo light/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:600,color:C.sand,margin:"1.25rem 0 0.35rem",lineHeight:1.2}}>{titles[step-1]}</h2><p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>{subs[step-1]}</p><div style={{display:"flex",gap:6,marginTop:"1.25rem"}}>{[1,2,3].map(i=><div key={i} style={{width:i===step?24:6,height:6,borderRadius:3,background:i<=step?C.terracotta:"rgba(242,232,217,0.2)",transition:"all 0.3s"}}/>)}</div></div></div><div style={{padding:"1.75rem 1.5rem",maxWidth:480,margin:"0 auto"}}>{error&&<div style={{background:"#fde8e8",border:"1px solid #e07070",borderRadius:10,padding:"0.75rem 1rem",marginBottom:"1rem",fontSize:"0.85rem",color:"#c0392b"}}>{error}</div>}{step===1&&<><Input label="First Name" value={form.firstName} onChange={set("firstName")} placeholder="John"/><Input label="Last Name" value={form.lastName} onChange={set("lastName")} placeholder="Smith"/><Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="john@example.com"/><Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 characters"/><Btn onClick={()=>{setError(null);setStep(2);}} disabled={!s1v}>Continue</Btn><p style={{textAlign:"center",fontSize:"0.85rem",color:C.muted,marginTop:"1.25rem"}}>Already have an account?{" "}<span onClick={onLogin} style={{color:C.terracotta,cursor:"pointer",fontWeight:500}}>Log in</span></p></>}{step===2&&<><AirportInput value={form.homeAirport} onChange={setVal("homeAirport")}/><Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} optional/><NationalityInput value={form.nationality} onChange={setVal("nationality")}/><Btn onClick={()=>setStep(3)} disabled={!s2v}>Continue</Btn><Btn onClick={()=>setStep(1)} variant="secondary" style={{marginTop:"0.5rem"}}>Back</Btn></>}{step===3&&<><div style={{background:C.parchment,borderRadius:12,padding:"0.85rem 1rem",marginBottom:"1.25rem",fontSize:"0.82rem",color:C.muted,lineHeight:1.6}}>We store this securely so you never have to type it again when booking.</div><Input label="Passport Number" value={form.passportNumber} onChange={set("passportNumber")} placeholder="e.g. 123456789" optional/><Input label="Passport Expiry" type="date" value={form.passportExpiry} onChange={set("passportExpiry")} optional/><Btn onClick={handleSignUp} disabled={loading}>{loading?"Creating your account…":"Start Planning →"}</Btn><Btn onClick={()=>setStep(2)} variant="secondary" style={{marginTop:"0.5rem"}}>Back</Btn></>}</div></div>);}

function LoginScreen({onSuccess,onCreateAccount}){const[form,setForm]=useState({email:"",password:""});const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const set=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));const valid=form.email&&form.password;const handleLogin=async()=>{setLoading(true);setError(null);try{const{data,error:ae}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});if(ae)throw ae;onSuccess(data.user);}catch(e){setError("Incorrect email or password — please try again.");}finally{setLoading(false);};};return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif"}}><div style={{background:C.espresso,padding:"2rem 1.5rem 2.5rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative"}}><ZirvoyLogo light/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:600,color:C.sand,margin:"1.25rem 0 0.35rem"}}>Welcome back</h2><p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>Log in to access your trips</p></div></div><div style={{padding:"1.75rem 1.5rem",maxWidth:480,margin:"0 auto"}}>{error&&<div style={{background:"#fde8e8",border:"1px solid #e07070",borderRadius:10,padding:"0.75rem 1rem",marginBottom:"1rem",fontSize:"0.85rem",color:"#c0392b"}}>{error}</div>}<Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="john@example.com"/><Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Your password"/><Btn onClick={handleLogin} disabled={!valid||loading}>{loading?"Logging in…":"Log In →"}</Btn><p style={{textAlign:"center",fontSize:"0.85rem",color:C.muted,marginTop:"1.25rem"}}>Don't have an account?{" "}<span onClick={onCreateAccount} style={{color:C.terracotta,cursor:"pointer",fontWeight:500}}>Create one</span></p></div></div>);}

function LoadingScreen({input}){const[step,setStep]=useState(0);const steps=["Scouting your perfect destination…","Crafting a bespoke itinerary…","Calculating the best budget…","Adding insider knowledge…"];useEffect(()=>{const t=setInterval(()=>setStep(s=>(s+1)%steps.length),1200);return()=>clearInterval(t);},[]);return(<div style={{minHeight:"100vh",background:C.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"'DM Sans',sans-serif"}}><div style={{animation:"pulse 2s ease-in-out infinite",marginBottom:"2rem"}}><ZirvoyMark size={56} color={C.terracotta}/></div><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontStyle:"italic",color:C.sand,margin:"0 0 1.25rem",textAlign:"center",lineHeight:1.5,maxWidth:320}}>"{input}"</p><p style={{fontSize:"0.75rem",color:C.terracotta,letterSpacing:"0.14em",textTransform:"uppercase",textAlign:"center"}}>{steps[step]}</p><div style={{display:"flex",gap:6,marginTop:"2rem"}}>{[0,1,2].map(i=><div key={i} style={{width:5,height:5,borderRadius:"50%",background:C.terracotta,opacity:step%3===i?1:0.25,transition:"opacity 0.4s"}}/>)}</div></div>);}

function TripStoryScreen({trip,onSkip,onBook}){
  const SLIDE_DURATION=4500;
  const[activeSlide,setActiveSlide]=useState(0);
  const[progress,setProgress]=useState(0);
  const[paused,setPaused]=useState(false);
  const[imgLoaded,setImgLoaded]=useState({});
  const slides=trip.storySlides||[];
  const isLast=activeSlide===slides.length;
  useEffect(()=>{if(paused||isLast)return;setProgress(0);const start=Date.now();const tick=setInterval(()=>{const elapsed=Date.now()-start;const pct=Math.min((elapsed/SLIDE_DURATION)*100,100);setProgress(pct);if(pct>=100){clearInterval(tick);setActiveSlide(s=>s+1);}},30);return()=>clearInterval(tick);},[activeSlide,paused]);
  const goNext=()=>{if(activeSlide<slides.length)setActiveSlide(s=>s+1);};
  const goPrev=()=>{if(activeSlide>0)setActiveSlide(s=>s-1);};
  if(isLast){return(<div style={{minHeight:"100vh",background:C.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"'DM Sans',sans-serif",position:"relative",overflow:"hidden"}}>
    <div style={{position:"absolute",top:-80,right:-80,width:300,height:300,borderRadius:"50%",border:"1px solid rgba(196,98,45,0.15)"}}/>
    <div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.4}}/>
    <div style={{position:"absolute",top:0,left:0,right:0,padding:"3rem 1rem 0",display:"flex",gap:4}}>
      {[...slides,{type:"closer"}].map((_,i)=>(<div key={i} style={{flex:1,height:2,background:"rgba(242,232,217,0.2)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:i<activeSlide?"100%":"0%",background:C.terracotta,borderRadius:2}}/></div>))}
    </div>
    <div style={{position:"relative",textAlign:"center"}}>
      <div style={{marginBottom:"1.5rem",opacity:0.8}}><ZirvoyMark size={52} color={C.terracotta}/></div>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.85rem",fontStyle:"italic",color:C.terra2,margin:"0 0 0.4rem",letterSpacing:"0.1em",textTransform:"uppercase"}}>{trip.country}</p>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"3rem",fontWeight:600,color:C.sand,margin:"0 0 0.5rem",lineHeight:1.1}}>{trip.destination}</h2>
      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1rem",fontStyle:"italic",color:"rgba(242,232,217,0.55)",margin:"0 0 2rem",lineHeight:1.5,maxWidth:300}}>{trip.tagline}</p>
      <div style={{display:"flex",gap:"0.6rem",justifyContent:"center",marginBottom:"2rem",flexWrap:"wrap"}}>
        {[`${trip.duration} nights`,`${trip.travellers} travellers`,`£${fmt(trip.budgetTotal)} est.`].map(t=>(<span key={t} style={{background:"rgba(242,232,217,0.1)",border:"1px solid rgba(242,232,217,0.2)",padding:"0.3rem 0.85rem",borderRadius:20,fontSize:"0.78rem",color:C.sand,fontFamily:"'DM Sans',sans-serif"}}>{t}</span>))}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:"0.75rem",maxWidth:320,margin:"0 auto"}}>
        <button onClick={onSkip} style={{padding:"1rem 2rem",background:C.terracotta,color:C.white,border:"none",borderRadius:14,fontSize:"1rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>View Full Trip →</button>
        <button onClick={onBook} style={{padding:"0.85rem",background:"rgba(242,232,217,0.08)",color:C.sand,border:"1px solid rgba(242,232,217,0.2)",borderRadius:14,fontSize:"0.9rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>I'm ready to book now!</button>
      </div>
    </div>
  </div>);}
  const slide=slides[activeSlide];
  if(!slide)return null;
  const slideLabel=slide.type==="destination"?trip.country:slide.type==="flight"?"Getting there":slide.type==="hotel"?"Where you'll stay":"On the itinerary";
  return(<div style={{position:"fixed",inset:0,background:C.espresso,fontFamily:"'DM Sans',sans-serif",userSelect:"none"}} onMouseDown={()=>setPaused(true)} onMouseUp={()=>setPaused(false)} onTouchStart={()=>setPaused(true)} onTouchEnd={()=>setPaused(false)}>
    <div style={{position:"absolute",inset:0}}>
      {slide.imageUrl&&<img src={slide.imageUrl} alt={slide.headline} onLoad={()=>setImgLoaded(p=>({...p,[activeSlide]:true}))} style={{width:"100%",height:"100%",objectFit:"cover",opacity:imgLoaded[activeSlide]?1:0,transition:"opacity 0.5s"}}/>}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.35) 0%,rgba(28,20,16,0.05) 40%,rgba(28,20,16,0.75) 100%)"}}/>
    </div>
    <div style={{position:"absolute",top:0,left:0,right:0,padding:"3rem 1rem 0",display:"flex",gap:4,zIndex:10}}>
      {[...slides,{type:"closer"}].map((_,i)=>(<div key={i} style={{flex:1,height:2,background:"rgba(242,232,217,0.25)",borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",width:i<activeSlide?"100%":i===activeSlide?`${progress}%`:"0%",background:C.white,borderRadius:2,transition:i===activeSlide?"width 0.03s linear":"none"}}/></div>))}
    </div>
    <div style={{position:"absolute",top:"1.5rem",left:0,right:0,padding:"0 1rem",display:"flex",justifyContent:"space-between",alignItems:"center",zIndex:10,marginTop:"2.5rem"}}>
      <div style={{display:"flex",alignItems:"center",gap:7}}>
        <svg width="22" height="22" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke={C.sand} strokeWidth="1.8"/><line x1="6" y1="20" x2="34" y2="20" stroke={C.sand} strokeWidth="1.4"/><line x1="26" y1="9" x2="14" y2="31" stroke={C.sand} strokeWidth="1.8" strokeLinecap="round"/><circle cx="20" cy="20" r="2.2" fill={C.sand}/></svg>
        <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:600,color:C.sand,letterSpacing:"0.12em",textTransform:"uppercase"}}>Zirvoy</span>
      </div>
      <button onClick={onSkip} style={{background:"rgba(28,20,16,0.4)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.2)",color:C.sand,padding:"0.35rem 0.9rem",borderRadius:20,fontSize:"0.75rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Skip →</button>
    </div>
    <div style={{position:"absolute",inset:0,display:"flex",zIndex:5}}><div style={{flex:1}} onClick={goPrev}/><div style={{flex:1}} onClick={goNext}/></div>
    <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"2rem 1.5rem 4rem",zIndex:10}}>
      <p style={{fontSize:"0.65rem",fontWeight:600,color:C.terra2,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.5rem"}}>{slideLabel}</p>
      <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,7vw,2.8rem)",fontWeight:600,color:C.sand,margin:"0 0 0.5rem",lineHeight:1.1}}>{slide.headline}</h2>
      <p style={{fontSize:"clamp(0.88rem,3vw,1rem)",color:"rgba(242,232,217,0.75)",margin:0,lineHeight:1.6,fontWeight:300,maxWidth:400}}>{slide.subline}</p>
    </div>
  </div>);}

function HomeScreen({user,profile,trips,onGenerate,onTripClick,loading}){const[input,setInput]=useState("");const[focused,setFocused]=useState(false);const firstName=profile?.first_name||"there";const suggestions=[{label:"Weekend escape",text:"Romantic weekend in Europe, 2 people, budget around £1,000"},{label:"Group trip",text:"5 nights for 4 friends somewhere fun, £700 each"},{label:"Honeymoon",text:"Luxury honeymoon, 7 nights, no budget limit"},{label:"City break",text:"Quick city break for 2, under £600 total"}];return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}><div style={{background:C.espresso,padding:"2.5rem 1.5rem 3rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.7}}/><div style={{position:"relative",maxWidth:640,margin:"0 auto"}}><div style={{marginBottom:"2rem"}}><ZirvoyLogo light/></div><p style={{fontSize:"0.7rem",fontWeight:600,color:C.terracotta,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.6rem"}}>AI Travel Planner</p><h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,6vw,3rem)",fontWeight:600,color:C.sand,margin:"0 0 0.75rem",lineHeight:1.15}}>{trips.length>0?`Welcome back, ${firstName}.`:`Where to, ${firstName}?`}</h1><p style={{color:"rgba(242,232,217,0.5)",fontSize:"0.88rem",margin:0,lineHeight:1.7,fontWeight:300}}>{trips.length>0?"Plan your next adventure or pick up where you left off.":"Tell us your dream trip in plain English. Real AI. Full plan in seconds."}</p></div></div><div style={{maxWidth:640,margin:"0 auto",padding:"1.75rem 1.5rem"}}>{trips.length>0&&(<div style={{marginBottom:"1.75rem"}}><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>Recent Trips</p>{trips.slice(0,2).map(t=>(<div key={t.id} onClick={()=>onTripClick(t)} style={{background:C.white,borderRadius:14,padding:"1rem 1.1rem",border:`1px solid ${C.border}`,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"0.6rem"}}><div><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:600,color:C.espresso}}>{t.destination}</div><div style={{fontSize:"0.75rem",color:C.muted,marginTop:2}}>{t.trip_data?.country} · {t.trip_data?.duration} nights · £{fmt(t.trip_data?.budgetTotal)}</div></div><span style={{color:C.terracotta,fontSize:"1.1rem"}}>→</span></div>))}</div>)}<p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>{trips.length>0?"Plan a New Trip":"Plan My Trip"}</p><div style={{background:C.white,borderRadius:18,padding:"1.25rem",marginBottom:"1.5rem",boxShadow:"0 4px 24px rgba(28,20,16,0.07)",border:`1px solid ${C.border}`}}><textarea value={input} onChange={e=>setInput(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)} placeholder='"5 nights in Europe for 2, budget £1,500, we love good food and history"' rows={4} style={{width:"100%",background:C.sandLight,border:`1.5px solid ${focused?C.terracotta:C.border}`,borderRadius:10,padding:"1rem",fontSize:"0.93rem",color:C.ink,resize:"none",outline:"none",lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s"}}/><button onClick={()=>input.trim()&&!loading&&onGenerate(input.trim())} disabled={!input.trim()||loading} style={{width:"100%",marginTop:"0.85rem",padding:"1rem",background:input.trim()&&!loading?C.terracotta:C.parchment,color:input.trim()&&!loading?C.white:C.muted,border:"none",borderRadius:10,fontSize:"0.93rem",fontWeight:600,cursor:input.trim()&&!loading?"pointer":"default",fontFamily:"'DM Sans',sans-serif",transition:"background 0.25s"}}>{loading?"Planning your trip…":"Plan My Trip with Zirvoy"}</button></div><div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1.1rem"}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.14em",whiteSpace:"nowrap"}}>or try one of these</span><div style={{flex:1,height:1,background:C.border}}/></div><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"2.5rem"}}>{suggestions.map((s,i)=>(<button key={i} onClick={()=>!loading&&onGenerate(s.text)} disabled={loading} style={{padding:"0.9rem",borderRadius:12,border:`1px solid ${C.border}`,background:C.white,cursor:loading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}><div style={{fontSize:"0.62rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.3rem"}}>{s.label}</div><div style={{fontSize:"0.78rem",color:C.ink,lineHeight:1.45,fontWeight:300}}>{s.text}</div></button>))}</div></div></div>);}

function ResultsScreen({trip,onNewTrip,onTryAgain,onLetsBook,onSaveTrip,isSaved}){const[activeDay,setActiveDay]=useState(0);const[imgLoaded,setImgLoaded]=useState(false);const[saving,setSaving]=useState(false);const[saved,setSaved]=useState(isSaved);const day=trip.itinerary?.[activeDay];const handleSave=async()=>{setSaving(true);await onSaveTrip();setSaved(true);setSaving(false);};const labels={flights:"Flights",hotel:"Hotel",food:"Food & Drink",activities:"Activities",misc:"Extras"};return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}><div style={{position:"relative",height:"min(340px,50vw)",minHeight:260,overflow:"hidden"}}><img src={trip.photo} alt={trip.destination} onLoad={()=>setImgLoaded(true)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:imgLoaded?1:0,transition:"opacity 0.8s",filter:"brightness(0.85)"}}/><div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.bark},${C.espresso})`,opacity:imgLoaded?0:1,transition:"opacity 0.8s"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.2) 0%,rgba(28,20,16,0.85) 100%)"}}/><div style={{position:"absolute",top:"1.25rem",left:"clamp(1.25rem,5vw,2rem)"}}><ZirvoyLogo light size="sm"/></div><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem clamp(1.25rem,5vw,2rem)"}}><p style={{fontSize:"0.65rem",fontWeight:600,color:C.terra2,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.3rem"}}>{trip.country}</p><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.2rem,7vw,3.2rem)",fontWeight:600,color:C.sand,margin:"0 0 0.5rem",lineHeight:1}}>{trip.destination}</h2><p style={{fontSize:"0.82rem",color:"rgba(242,232,217,0.72)",margin:"0 0 1rem",lineHeight:1.55,fontWeight:300,maxWidth:480}}>{trip.tagline}</p><div style={{display:"flex",gap:"0.45rem",flexWrap:"wrap"}}>{[`${trip.travellers} travellers`,`${trip.duration} nights`,`£${fmt(trip.budgetTotal)} total`].map(t=>(<span key={t} style={{background:"rgba(242,232,217,0.12)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.2)",padding:"0.28rem 0.75rem",borderRadius:20,fontSize:"0.72rem",fontWeight:500,color:C.sand}}>{t}</span>))}</div></div></div><div style={{maxWidth:640,margin:"0 auto",padding:"1.25rem clamp(1.25rem,5vw,2rem) 3rem"}}><div style={{display:"flex",gap:"0.65rem",marginBottom:"1rem"}}><button onClick={onLetsBook} style={{flex:2,padding:"1rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Let's Book This Trip →</button><button onClick={saved?undefined:handleSave} disabled={saved||saving} style={{flex:1,padding:"1rem",background:saved?C.parchment:C.espresso,color:saved?C.muted:C.sand,border:"none",borderRadius:12,fontSize:"0.82rem",fontWeight:500,cursor:saved?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>{saving?"Saving…":saved?"✓ Saved":"Save Trip"}</button></div><div style={{background:C.white,border:`1px solid ${C.border}`,borderRadius:14,padding:"0.85rem 1rem",marginBottom:"1rem",display:"flex",alignItems:"center",justifyContent:"space-between"}}><div><div style={{fontSize:"0.8rem",fontWeight:500,color:C.espresso}}>Not quite right?</div><div style={{fontSize:"0.72rem",color:C.muted,marginTop:2,fontWeight:300}}>Been there or want something different</div></div><button onClick={onTryAgain} style={{flexShrink:0,padding:"0.5rem 1rem",background:C.espresso,color:C.sand,border:"none",borderRadius:8,fontSize:"0.78rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Try Again</button></div><div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}><div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Estimated Budget</p></div><div style={{background:C.sandLight,borderRadius:8,padding:"0.6rem 0.85rem",marginBottom:"1rem",fontSize:"0.72rem",color:C.muted,lineHeight:1.5}}>Prices are estimates based on typical costs — always check live prices before booking.</div><div style={{display:"flex",justifyContent:"space-around",paddingBottom:"1.25rem",marginBottom:"1.25rem",borderBottom:`1px solid ${C.parchment}`}}>{[["£"+fmt(trip.budgetTotal),"Est. Total"],["£"+fmt(trip.budgetPerPerson),"Per person"]].map(([val,lbl])=>(<div key={lbl} style={{textAlign:"center"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.85rem",fontWeight:600,color:C.espresso}}>{val}</div><div style={{fontSize:"0.65rem",color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:2}}>{lbl}</div></div>))}</div>{Object.entries(trip.breakdown||{}).map(([k,v])=>{const pct=Math.round((v/trip.budgetTotal)*100);return(<div key={k} style={{marginBottom:"0.8rem"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",marginBottom:"0.35rem"}}><span style={{color:C.ink}}>{labels[k]||k}</span><span style={{fontWeight:600,color:C.espresso}}>£{fmt(v)}</span></div><div style={{height:3,background:C.parchment,borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.terracotta},${C.gold})`,borderRadius:3}}/></div></div>);})}</div><div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}><div style={{paddingBottom:"1rem",marginBottom:"1rem",borderBottom:`1px solid ${C.parchment}`}}><p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.5rem"}}>✈  Flights</p><p style={{margin:0,fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.flights}</p></div><div><p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.5rem"}}>🏨  Where to Stay</p><p style={{margin:0,fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.hotel}</p></div></div><div style={{background:C.espresso,borderRadius:18,padding:"1.4rem 1.5rem",marginBottom:"1rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",top:-25,right:-25,width:120,height:120,borderRadius:"50%",border:"1px solid rgba(196,98,45,0.18)"}}/><div style={{position:"absolute",top:8,right:10,opacity:0.1}}><ZirvoyMark size={52} color={C.terracotta}/></div><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.65rem"}}><div style={{width:3,height:12,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.65rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em",margin:0}}>Zirvoy Insider Tip</p></div><p style={{margin:0,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.sand,lineHeight:1.8,fontStyle:"italic"}}>{trip.tip}</p></div>{trip.itinerary?.length>0&&(<div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:"1.25rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}><div style={{padding:"1.35rem 1.35rem 0"}}><div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}><div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Your Itinerary</p></div><div style={{display:"flex",gap:"0.4rem",overflowX:"auto",paddingBottom:"1rem"}}>{trip.itinerary.map((d,i)=>(<button key={i} onClick={()=>setActiveDay(i)} style={{flexShrink:0,padding:"0.38rem 1rem",borderRadius:20,border:`1.5px solid ${activeDay===i?C.terracotta:C.border}`,background:activeDay===i?C.terracotta:"transparent",color:activeDay===i?C.white:C.muted,cursor:"pointer",fontSize:"0.76rem",fontWeight:500,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>Day {d.day}</button>))}</div></div>{day&&(<div style={{borderTop:`1px solid ${C.parchment}`,padding:"1.35rem"}}><h4 style={{fontFamily:"'Cormorant Garamond',serif",margin:"0 0 1.1rem",fontSize:"1.2rem",fontWeight:600,color:C.espresso}}>{day.title}</h4>{[["Morning",day.morning],["Afternoon",day.afternoon],["Evening",day.evening]].map(([label,text])=>(<div key={label} style={{display:"flex",gap:"1rem",marginBottom:"1rem",alignItems:"flex-start"}}><span style={{flexShrink:0,fontSize:"0.6rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:"0.2rem",minWidth:64}}>{label}</span><p style={{margin:0,fontSize:"0.86rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{text}</p></div>))}</div>)}</div>)}<button onClick={onNewTrip} style={{width:"100%",padding:"1rem",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:14,fontSize:"0.88rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.75rem"}}>Plan Another Trip</button></div></div>);}

function RefineModal({destination,onClose,onRefine,loading}){const[extra,setExtra]=useState("");return(<div style={{position:"fixed",inset:0,background:"rgba(28,20,16,0.75)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}><div style={{width:"100%",maxWidth:640,background:C.sandLight,borderRadius:"22px 22px 0 0",padding:"1.75rem 1.5rem 2.5rem"}}><div style={{width:36,height:3.5,background:C.parchment,borderRadius:2,margin:"0 auto 1.75rem"}}/><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.35rem"}}><ZirvoyMark size={16} color={C.terracotta}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.14em",margin:0}}>Try Again</p></div><h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:600,color:C.espresso,margin:"0 0 0.4rem"}}>Not feeling {destination}?</h3><p style={{fontSize:"0.84rem",color:C.muted,margin:"0 0 1.5rem",lineHeight:1.6,fontWeight:300}}>Tell Zirvoy more about what you're looking for and it'll try again.</p><div style={{background:C.white,borderRadius:14,padding:"1.1rem",border:`1px solid ${C.border}`,marginBottom:"0.75rem"}}><textarea value={extra} onChange={e=>setExtra(e.target.value)} placeholder="e.g. Prefer somewhere warmer, love hiking and wine, been to Portugal already" rows={3} style={{width:"100%",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,padding:"0.85rem",fontSize:"0.88rem",color:C.ink,resize:"none",outline:"none",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif"}}/><button onClick={()=>extra.trim()&&onRefine(extra.trim())} disabled={!extra.trim()||loading} style={{width:"100%",marginTop:"0.65rem",padding:"0.9rem",background:extra.trim()&&!loading?C.terracotta:C.parchment,color:extra.trim()&&!loading?C.white:C.muted,border:"none",borderRadius:10,fontSize:"0.9rem",fontWeight:600,cursor:extra.trim()&&!loading?"pointer":"default",fontFamily:"'DM Sans',sans-serif"}}>{loading?"Planning…":"Refine with Zirvoy"}</button></div><button onClick={onClose} style={{width:"100%",padding:"0.75rem",background:"transparent",color:C.muted,border:"none",fontSize:"0.88rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Keep this trip</button></div></div>);}

export default function Home(){
  const[authScreen,setAuthScreen]=useState("splash");
  const[user,setUser]=useState(null);
  const[profile,setProfile]=useState(null);
  const[trips,setTrips]=useState([]);
  const[authLoading,setAuthLoading]=useState(true);
  const[activeTab,setActiveTab]=useState("home");
  const[screen,setScreen]=useState("home");
  const[trip,setTrip]=useState(null);
  const[tripSaved,setTripSaved]=useState(false);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const[originalRequest,setOriginalRequest]=useState("");
  const[showRefine,setShowRefine]=useState(false);
  const[showStory,setShowStory]=useState(false);
  const[showBooking,setShowBooking]=useState(false);

  useEffect(()=>{
    supabase.auth.getSession().then(({data:{session}})=>{if(session?.user){setUser(session.user);loadUserData(session.user.id);}setAuthLoading(false);});
    const{data:{subscription}}=supabase.auth.onAuthStateChange((_e,session)=>{if(session?.user){setUser(session.user);loadUserData(session.user.id);}else{setUser(null);setProfile(null);setTrips([]);}});
    return()=>subscription.unsubscribe();
  },[]);

  const loadUserData=async(userId)=>{
    const[{data:prof},{data:tripsData}]=await Promise.all([
      supabase.from("profiles").select("*").eq("id",userId).single(),
      supabase.from("trips").select("*").eq("user_id",userId).order("created_at",{ascending:false}),
    ]);
    if(prof)setProfile(prof);
    if(tripsData)setTrips(tripsData);
  };

  const saveTrip=async(userId,tripData)=>{
    try{
      const{error:insertError}=await supabase.from("trips").insert({
        user_id:userId,
        destination:tripData.destination,
        country:tripData.country,
        trip_data:tripData,
      });
      if(insertError){console.error("Save error:",insertError);return false;}
      await loadUserData(userId);
      return true;
    }catch(e){console.error("Save failed:",e);return false;}
  };

  const handleAuthSuccess=async(newUser)=>{setUser(newUser);if(newUser)await loadUserData(newUser.id);setAuthScreen("app");};
  const handleSignOut=async()=>{await supabase.auth.signOut();setUser(null);setProfile(null);setTrips([]);setAuthScreen("splash");setScreen("home");setTrip(null);setActiveTab("home");};

  const generate=async(request)=>{
    setLoading(true);setError(null);setScreen("results");setShowRefine(false);
    setTripSaved(false);setShowStory(false);setShowBooking(false);setActiveTab("home");
    try{
      const res=await fetch("/api/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request})});
      const data=await res.json();
      if(!res.ok||!data.trip)throw new Error(data.error||"Something went wrong");
      setTrip(data.trip);
      setShowStory(true);
      // Auto-save trip
      if(user){const saved=await saveTrip(user.id,data.trip);if(saved)setTripSaved(true);}
    }catch(e){setError(e.message);setScreen("home");}
    finally{setLoading(false);}
  };

  const handleManualSave=async()=>{if(!user||!trip)return;const saved=await saveTrip(user.id,trip);if(saved)setTripSaved(true);};
  const handleGenerate=(req)=>{setOriginalRequest(req);generate(req);};
  const handleRefine=(extra)=>generate(`${originalRequest}. Additional preferences: ${extra}`);
  const handleNewTrip=()=>{setTrip(null);setOriginalRequest("");setError(null);setTripSaved(false);setShowStory(false);setShowBooking(false);setScreen("home");setActiveTab("home");};
  const handleTripClick=(t)=>{setTrip(t.trip_data);setTripSaved(true);setShowStory(false);setShowBooking(false);setScreen("results");setActiveTab("home");};
  const handleLetsBook=()=>{setShowBooking(true);setShowStory(false);};
  const handleTabChange=(tab)=>{setActiveTab(tab);if(tab==="home"&&screen!=="results")setScreen("home");};

  if(authLoading)return(<div style={{minHeight:"100vh",background:C.espresso,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{FONT_STYLE}</style><div style={{animation:"pulse 2s ease-in-out infinite"}}><ZirvoyMark size={48} color={C.terracotta}/></div></div>);

  return(<>
    <Head>
      <title>Zirvoy — AI Travel Planner</title>
      <meta name="description" content="Tell Zirvoy where you want to go. Get a full AI-generated trip plan in seconds."/>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1"/>
      <link rel="preconnect" href="https://fonts.googleapis.com"/>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet"/>
      <style>{FONT_STYLE}</style>
    </Head>

    {error&&<div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#c0392b",color:"#fff",padding:"0.75rem 1.25rem",borderRadius:10,fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",zIndex:200,maxWidth:"90vw",textAlign:"center"}}>{error} — please try again.</div>}

    {!user&&authScreen==="splash"&&<SplashScreen onCreateAccount={()=>setAuthScreen("signup")} onLogin={()=>setAuthScreen("login")}/>}
    {!user&&authScreen==="signup"&&<SignUpScreen onSuccess={handleAuthSuccess} onLogin={()=>setAuthScreen("login")}/>}
    {!user&&authScreen==="login"&&<LoginScreen onSuccess={handleAuthSuccess} onCreateAccount={()=>setAuthScreen("signup")}/>}

    {user&&(<>
      {loading&&<LoadingScreen input={originalRequest}/>}

      {!loading&&screen==="results"&&trip&&showStory&&!showBooking&&(
        <TripStoryScreen trip={trip} onSkip={()=>setShowStory(false)} onBook={handleLetsBook}/>
      )}

      {!loading&&screen==="results"&&trip&&showBooking&&(
        <BookingScreen trip={trip} onBack={()=>setShowBooking(false)} onDone={()=>{setShowBooking(false);setActiveTab("trips");}}/>
      )}

      {!loading&&!(showStory&&screen==="results")&&!showBooking&&(<>
        {activeTab==="home"&&screen==="home"&&<HomeScreen user={user} profile={profile} trips={trips} onGenerate={handleGenerate} onTripClick={handleTripClick} loading={loading}/>}
        {activeTab==="home"&&screen==="results"&&trip&&(<><ResultsScreen trip={trip} onNewTrip={handleNewTrip} onTryAgain={()=>setShowRefine(true)} onLetsBook={handleLetsBook} onSaveTrip={handleManualSave} isSaved={tripSaved}/>{showRefine&&<RefineModal destination={trip.destination} onClose={()=>setShowRefine(false)} onRefine={handleRefine} loading={loading}/>}</>)}
        {activeTab==="trips"&&<MyTripsScreen trips={trips} onTripClick={handleTripClick} onPlanNew={()=>{setActiveTab("home");setScreen("home");}}/>}
        {activeTab==="account"&&<AccountScreen profile={profile} onSignOut={handleSignOut}/>}
        <BottomNav active={activeTab} onChange={handleTabChange}/>
      </>)}
    </>)}
  </>);
}
