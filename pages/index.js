import React, { useState, useEffect } from "react";
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
  @keyframes revealProgress{from{width:0%}to{width:100%}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
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

function CyclingHeader({images=[],children,minH="auto",overlay="linear-gradient(to bottom,rgba(28,20,16,0.45) 0%,rgba(28,20,16,0.82) 100%)"}){
  const[idx,setIdx]=useState(0);
  const[vis,setVis]=useState(true);
  useEffect(()=>{
    if(images.length<=1)return;
    const t=setInterval(()=>{setVis(false);setTimeout(()=>{setIdx(i=>(i+1)%images.length);setVis(true);},600);},5000);
    return()=>clearInterval(t);
  },[images.length]);
  return(<div style={{position:"relative",overflow:"hidden",minHeight:minH}}>
    {images[idx]&&<img src={images[idx]} alt="" style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:vis?1:0,transition:"opacity 0.6s ease"}}/>}
    <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.bark} 0%,${C.espresso} 100%)`,opacity:images.length&&images[idx]?0:1,transition:"opacity 0.6s"}}/>
    <div style={{position:"absolute",inset:0,background:overlay}}/>
    <div style={{position:"relative",zIndex:1}}>{children}</div>
  </div>);}

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
function BookingScreen({trip,onBack,onDone,onSummary,homeAirport}){
  const[step,setStep]=useState(0); // 0=flights, 1=hotels, 2=celebration
  const steps=["Flights","Hotels"];

  // Date state — default to 4 weeks from today
  const defaultDepart=()=>{const d=new Date();d.setDate(d.getDate()+28);return d.toISOString().split("T")[0];};
  const defaultReturn=(dep)=>{const d=new Date(dep);d.setDate(d.getDate()+(trip.duration||5));return d.toISOString().split("T")[0];};
  const[datesConfirmed,setDatesConfirmed]=useState(false);
  const[departDate,setDepartDate]=useState(defaultDepart);
  const[returnDate,setReturnDate]=useState(()=>defaultReturn(defaultDepart()));
  const handleDepartChange=(v)=>{setDepartDate(v);setReturnDate(defaultReturn(v));};
  // Hotel finder
  const[hotelStyle,setHotelStyle]=useState(null);
  const[hotelPriority,setHotelPriority]=useState(null);
  const[roomType,setRoomType]=useState(null);
  const[hotelExtras,setHotelExtras]=useState("");
  const[hotelRecs,setHotelRecs]=useState(null);
  const[hotelLoading,setHotelLoading]=useState(false);
  const[hotelCardIndex,setHotelCardIndex]=useState(0);
  const[bookedHotel,setBookedHotel]=useState(null);
  const fetchHotels=async()=>{
    setHotelLoading(true);setHotelRecs(null);setHotelCardIndex(0);
    try{
      const r=await fetch("/api/hotels",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destination:trip.destination,country:trip.country,checkin:departDate,checkout:returnDate,travellers:trip.travellers||2,roomType:roomType||"Double room",hotelStyle:hotelStyle||"Mid-range comfort",priority:hotelPriority||"Great location",extras:hotelExtras})});
      const d=await r.json();
      setHotelRecs(d.hotels||[]);
    }catch(e){setHotelRecs([]);}
    finally{setHotelLoading(false);}
  };
  // Flights
  const[flightSearchOpened,setFlightSearchOpened]=useState(false);
  const[bookedFlight,setBookedFlight]=useState(null);
  const[flightNum,setFlightNum]=useState("");
  const[flightDeparts,setFlightDeparts]=useState("");
  const[flightArrives,setFlightArrives]=useState("");
  const[flightDetailsSaved,setFlightDetailsSaved]=useState(false);
  // When to go
  const[whenType,setWhenType]=useState(null);
  const[whenInsight,setWhenInsight]=useState(null);
  const[whenLoading,setWhenLoading]=useState(false);
  const fetchWhen=async(type)=>{
    setWhenType(type);setWhenInsight(null);setWhenLoading(true);
    try{
      const r=await fetch("/api/when",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destination:trip.destination,country:trip.country,type})});
      const d=await r.json();
      setWhenInsight(d);
    }catch(e){setWhenInsight({insight:"Couldn't load tips right now.",bestMonths:null});}
    finally{setWhenLoading(false);}
  };
  // Refine itinerary
  const[showRefinePanel,setShowRefinePanel]=useState(false);
  const[refineInput,setRefineInput]=useState("");
  const[refineLoading,setRefineLoading]=useState(false);
  const[refinedItinerary,setRefinedItinerary]=useState(null);
  const submitRefine=async()=>{
    if(!refineInput.trim())return;
    setRefineLoading(true);
    try{
      const r=await fetch("/api/refine",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({trip,instructions:refineInput})});
      const d=await r.json();
      if(d.itinerary){
        setRefinedItinerary(d.itinerary);
        const{data:saved}=await supabase.from("trips").select("id").eq("destination",trip.destination).order("created_at",{ascending:false}).limit(1);
        if(saved?.[0]?.id)await supabase.from("trips").update({trip_data:{...trip,itinerary:d.itinerary}}).eq("id",saved[0].id);
      }
    }catch(e){console.error(e);}
    finally{setRefineLoading(false);}
  };
  const buildTransfersUrl=()=>`https://www.welcomepickups.com/${encodeURIComponent(trip.destination.toLowerCase().replace(/\s+/g,'-'))}/`;

  const suggestDates=()=>{
    if(!whenInsight?.bestMonths)return;
    const MONTHS=['january','february','march','april','may','june','july','august','september','october','november','december'];
    const text=whenInsight.bestMonths.toLowerCase();
    const now=new Date();
    let targetMonth=null;
    for(let i=0;i<MONTHS.length;i++){if(text.includes(MONTHS[i])){targetMonth=i;break;}}
    if(targetMonth===null)return;
    let year=now.getFullYear();
    if(targetMonth<=now.getMonth())year++;
    const depart=`${year}-${String(targetMonth+1).padStart(2,'0')}-15`;
    const ret=new Date(depart);
    ret.setDate(ret.getDate()+(trip.duration||7));
    handleDepartChange(depart);
    setReturnDate(ret.toISOString().split('T')[0]);
  };

  // Extract IATA code from airport string e.g. "Manchester (MAN)" → "man"
  const getOriginIATA=(airportStr)=>{
    const match=(airportStr||'').match(/\(([A-Z]{3})\)/);
    return match?match[1].toLowerCase():'lhr';
  };

  // Build Skyscanner deep link
  const buildSkyscannerUrl=()=>{
    const IATA={
      // Greece
      'santorini':'jtr','athens':'ath','mykonos':'jmk','crete':'her','heraklion':'her','rhodes':'rho','corfu':'cfu',
      'zakynthos':'zth','zante':'zth','thessaloniki':'skg','kos':'kgs','lesbos':'mjt','chania':'chq',
      // Italy
      'rome':'fco','milan':'mxp','venice':'vce','florence':'flr','naples':'nap','sicily':'cta','catania':'cta',
      'sardinia':'cag','cagliari':'cag','palermo':'pmo','bologna':'blq','turin':'trn','pisa':'psa','verona':'vrn',
      'bari':'bri','brindisi':'bds','amalfi':'nap','positano':'nap','capri':'nap','cinque terre':'fco',
      // Spain
      'barcelona':'bcn','madrid':'mad','seville':'svq','malaga':'agp','ibiza':'ibz','mallorca':'pmi',
      'menorca':'mah','valencia':'vlc','alicante':'alc','bilbao':'bio','san sebastian':'eas',
      'tenerife':'tfs','gran canaria':'lpa','lanzarote':'ace','fuerteventura':'fue','la palma':'spc',
      'granada':'grx','cordoba':'ods','toledo':'mad',
      // Portugal
      'lisbon':'lis','porto':'opo','algarve':'fao','faro':'fao','madeira':'fnc','funchal':'fnc',
      'azores':'pdl','ponta delgada':'pdl',
      // France
      'paris':'cdg','nice':'nce','marseille':'mrs','lyon':'lys','bordeaux':'bod','toulouse':'tls',
      'strasbourg':'sxb','nantes':'nte','biarritz':'biq','corsica':'ajaccio',
      // Benelux & Nordics
      'amsterdam':'ams','brussels':'bru','copenhagen':'cph','stockholm':'arn','oslo':'osl','helsinki':'hel',
      'reykjavik':'kef','iceland':'kef','gothenburg':'got','bergen':'bgo','tromso':'tos',
      // Central Europe
      'prague':'prg','vienna':'vie','budapest':'bud','krakow':'krk','warsaw':'waw','gdansk':'gdn',
      'salzburg':'szg','innsbruck':'inn','bratislava':'bts','ljubljana':'lju',
      // Eastern Europe & Balkans
      'dubrovnik':'dbv','split':'spu','zagreb':'zag','zadar':'zad','hvar':'spu',
      'montenegro':'tiv','tivat':'tiv','podgorica':'tgd',
      'belgrade':'beg','sofia':'sof','bucharest':'otp','riga':'rix','tallinn':'tll','vilnius':'vno',
      'tirana':'tia','sarajevo':'sjj','skopje':'skp','chisinau':'kiv',
      // Turkey
      'istanbul':'ist','antalya':'ayt','bodrum':'bjv','dalaman':'dlm','cappadocia':'asw','izmir':'adb',
      'ankara':'esb','trabzon':'tzx',
      // Middle East
      'dubai':'dxb','abu dhabi':'auh','doha':'doh','muscat':'mct','kuwait':'kwi','bahrain':'bah',
      'riyadh':'ruh','jeddah':'jed','amman':'amm','beirut':'bey','tel aviv':'tlv',
      // North Africa
      'marrakech':'rak','casablanca':'cmn','fez':'fes','agadir':'aga','tunis':'tun','cairo':'cai',
      'luxor':'lxr','hurghada':'hrg','sharm el sheikh':'ssh','algiers':'alg',
      // Sub-Saharan Africa
      'cape town':'cpt','johannesburg':'jnb','durban':'dur','nairobi':'nbo','zanzibar':'znz',
      'dar es salaam':'dar','kilimanjaro':'jro','kigali':'kgl','addis ababa':'add',
      'accra':'acc','lagos':'los','dakar':'dkr','mauritius':'mru','seychelles':'sez',
      'maldives':'mle','male':'mle',
      // Southeast Asia
      'bali':'dps','denpasar':'dps','lombok':'lop','jakarta':'cgk','yogyakarta':'jog',
      'phuket':'hkt','bangkok':'bkk','chiang mai':'cnx','koh samui':'usm','krabi':'kbv',
      'singapore':'sin','kuala lumpur':'kul','penang':'pen','langkawi':'lgk',
      'kota kinabalu':'bki','borneo':'bki',
      'ho chi minh':'sgn','saigon':'sgn','hanoi':'han','da nang':'dad',
      'phnom penh':'pnh','siem reap':'rep','vientiane':'vte','yangon':'rgn',
      'manila':'mnl','cebu':'ceb','palawan':'pps',
      // East Asia
      'hong kong':'hkg','tokyo':'hnd','osaka':'kix','kyoto':'kix','sapporo':'cts',
      'fukuoka':'fuk','okinawa':'oka','hiroshima':'hij',
      'seoul':'icn','busan':'pus','taipei':'tpe',
      'beijing':'pek','shanghai':'pvg','shenzhen':'szx','chengdu':'ctu','xian':'xiy',
      'guilin':'kwl','sanya':'syx','guangzhou':'can',
      // South Asia
      'delhi':'del','mumbai':'bom','bangalore':'blr','goa':'goi','chennai':'maa',
      'kolkata':'ccu','hyderabad':'hyd','colombo':'cmb','maldives':'mle',
      'kathmandu':'ktm','nepal':'ktm','dhaka':'dac','bhutan':'pbh',
      // Central Asia & Caucasus
      'tbilisi':'tbs','yerevan':'evn','baku':'gyd','tashkent':'tas','samarkand':'skd','almaty':'ala',
      // Oceania
      'sydney':'syd','melbourne':'mel','brisbane':'bne','perth':'per','adelaide':'adl','cairns':'cns',
      'gold coast':'ool','auckland':'akl','queenstown':'zqn','wellington':'wlg','christchurch':'chc',
      'fiji':'nan','bora bora':'bob','tahiti':'ppt','hawaii':'hnl','honolulu':'hnl',
      // North America
      'new york':'jfk','nyc':'jfk','los angeles':'lax','miami':'mia','san francisco':'sfo',
      'las vegas':'las','chicago':'ord','boston':'bos','seattle':'sea','washington':'iad',
      'atlanta':'atl','dallas':'dfw','houston':'iah','denver':'den','phoenix':'phx',
      'san diego':'san','portland':'pdx','new orleans':'msy','nashville':'bna','austin':'aus',
      'toronto':'yyz','vancouver':'yvr','montreal':'yul','calgary':'yyc',
      // Mexico & Caribbean
      'cancun':'cun','mexico city':'mex','los cabos':'sjd','cabo':'sjd','puerto vallarta':'pvr',
      'oaxaca':'oax','tulum':'cun','playa del carmen':'cun',
      'havana':'hav','cuba':'hav','jamaica':'mbj','montego bay':'mbj','kingston':'kin',
      'barbados':'bgi','bridgetown':'bgi','trinidad':'pos',
      'dominican republic':'puj','punta cana':'puj','santo domingo':'sdq',
      'nassau':'nas','bahamas':'nas','aruba':'aua','curacao':'cur',
      'st lucia':'uvf','antigua':'anu','grand cayman':'gcm',
      // Central & South America
      'panama':'pty','costa rica':'sjo','san jose':'sjo','guatemala':'gua','belize':'bze',
      'bogota':'bog','medellin':'mde','cartagena':'ctg','colombia':'bog',
      'lima':'lim','cusco':'cuz','machu picchu':'cuz','peru':'lim',
      'quito':'uio','galapagos':'gps','ecuador':'uio',
      'rio de janeiro':'gig','rio':'gig','sao paulo':'gru','salvador':'ssa','fortaleza':'for',
      'iguazu':'igu','manaus':'mao','brazil':'gru',
      'buenos aires':'eze','bariloche':'brc','mendoza':'mdz','argentina':'eze',
      'santiago':'scl','chile':'scl','patagonia':'fal',
      'montevideo':'mvd','uruguay':'mvd','lima':'lim',
    };
    const key=trip.destination.toLowerCase();
    const destCode=Object.entries(IATA).find(([k])=>key.includes(k))?.[1]||'anywhere';
    const originCode=getOriginIATA(homeAirport||profile?.home_airport);
    const travellers=trip.travellers||2;
    const fmt2=(s)=>s.replace(/-/g,"");
    return `https://www.skyscanner.net/transport/flights/${originCode}/${destCode}/${fmt2(departDate)}/${fmt2(returnDate)}/?adults=${travellers}&cabinclass=economy&currency=GBP&locale=en-GB&market=UK`;
  };

  // Build Booking.com deep link
  const buildBookingUrl=()=>{
    const dest=encodeURIComponent(trip.destination+", "+trip.country);
    return `https://www.booking.com/searchresults.html?ss=${dest}&checkin=${departDate}&checkout=${returnDate}&group_adults=${trip.travellers||2}&no_rooms=1&lang=en-gb&currency=GBP`;
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

  if(!datesConfirmed){return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif"}}>
    <CyclingHeader images={(trip.storySlides||[]).map(s=>s.imageUrl).filter(Boolean)} minH="220px">
      <div style={{padding:"2.5rem 1.5rem 2rem"}}>
        <button onClick={onBack} style={{background:"transparent",border:"none",color:"rgba(242,232,217,0.5)",fontSize:"0.82rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:6}}>← Back to trip</button>
        <ZirvoyLogo light/>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.8rem",fontWeight:600,color:C.sand,margin:"1rem 0 0.25rem"}}>When are you going?</h2>
        <p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>Set your dates for accurate flight & hotel prices</p>
      </div>
    </CyclingHeader>
    <div style={{padding:"1.75rem 1.5rem",maxWidth:480,margin:"0 auto"}}>

      {/* When to go options */}
      <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.65rem"}}>Not sure when to go?</p>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1.25rem"}}>
        {[
          {type:"flexible",emoji:"🤸",label:"I'm flexible"},
          {type:"cheapest",emoji:"💸",label:"When's cheapest?"},
          {type:"warmest",emoji:"☀️",label:"When's warmest?"},
          {type:"busiest",emoji:"👥",label:"Avoid the crowds"},
        ].map(o=>(
          <button key={o.type} onClick={()=>fetchWhen(o.type)}
            style={{padding:"0.75rem 0.85rem",background:whenType===o.type?C.espresso:C.white,color:whenType===o.type?C.sand:C.espresso,border:`1.5px solid ${whenType===o.type?C.espresso:C.border}`,borderRadius:12,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,textAlign:"left",display:"flex",alignItems:"center",gap:"0.5rem",transition:"all 0.2s"}}>
            <span>{o.emoji}</span>{o.label}
          </button>
        ))}
      </div>

      {/* AI insight */}
      {(whenLoading||whenInsight)&&(
        <div style={{background:C.espresso,borderRadius:16,padding:"1.25rem 1.35rem",marginBottom:"1.25rem",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:-20,right:-20,width:80,height:80,borderRadius:"50%",border:"1px solid rgba(196,98,45,0.2)"}}/>
          <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:"0.6rem"}}>
            <div style={{width:3,height:12,background:C.terracotta,borderRadius:2}}/>
            <p style={{fontSize:"0.62rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em",margin:0}}>Zirvoy Insight</p>
          </div>
          {whenLoading?(
            <p style={{margin:0,fontSize:"0.88rem",color:"rgba(242,232,217,0.5)",fontStyle:"italic"}}>Checking the best times for {trip.destination}…</p>
          ):(
            <>
              {whenInsight.bestMonths&&<p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.15rem",fontWeight:600,color:C.sand,margin:"0 0 0.5rem"}}>{whenInsight.bestMonths}</p>}
              <p style={{margin:"0 0 0.85rem",fontSize:"0.88rem",color:"rgba(242,232,217,0.75)",lineHeight:1.7,fontWeight:300}}>{whenInsight.insight}</p>
              {whenInsight.bestMonths&&<button onClick={suggestDates} style={{padding:"0.5rem 1rem",background:"rgba(196,98,45,0.25)",border:"1px solid rgba(196,98,45,0.5)",borderRadius:20,fontSize:"0.78rem",color:C.sand,fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Pick these dates for me →</button>}
            </>
          )}
        </div>
      )}

      {/* Date inputs */}
      <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.65rem"}}>Your dates</p>
      <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.5rem",marginBottom:"1.25rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
        <div style={{marginBottom:"1.25rem"}}>
          <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.4rem"}}>Departure Date</label>
          <input type="date" value={departDate} min={new Date().toISOString().split("T")[0]} onChange={e=>handleDepartChange(e.target.value)} style={{width:"100%",padding:"0.85rem 1rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:"0.95rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",display:"block"}}/>
        </div>
        <div>
          <label style={{display:"block",fontSize:"0.72rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.4rem"}}>Return Date</label>
          <input type="date" value={returnDate} min={departDate} onChange={e=>setReturnDate(e.target.value)} style={{width:"100%",padding:"0.85rem 1rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:"0.95rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box",display:"block"}}/>
        </div>
      </div>
      <div style={{background:C.parchment,borderRadius:12,padding:"0.85rem 1rem",marginBottom:"1.5rem",fontSize:"0.82rem",color:C.muted,lineHeight:1.6}}>
        {trip.duration} nights suggested · {trip.travellers} traveller{trip.travellers>1?"s":""}
      </div>
      <button onClick={()=>setDatesConfirmed(true)} style={{width:"100%",padding:"1rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Find Flights & Hotels →</button>
    </div>
  </div>);}

  return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
    {/* Header */}
    <CyclingHeader images={(trip.storySlides||[]).map(s=>s.imageUrl).filter(Boolean)} minH="220px">
      <div style={{padding:"2.5rem 1.5rem 2rem"}}>
        <button onClick={step===2?()=>setStep(1):()=>setDatesConfirmed(false)} style={{background:"transparent",border:"none",color:"rgba(242,232,217,0.5)",fontSize:"0.82rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",padding:0,marginBottom:"1.25rem",display:"flex",alignItems:"center",gap:6}}>
          {step===2?"← Back to booking":"← Change dates"}
        </button>
        <ZirvoyLogo light/>
        <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:step===2?"2rem":"1.8rem",fontWeight:600,color:C.sand,margin:"1rem 0 0.25rem",lineHeight:1.1}}>
          {step===2?`You're going to ${trip.destination}!`:`Let's book ${trip.destination}`}
        </h2>
        <p style={{fontSize:"0.82rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>{step<steps.length?`Step ${step+1} of ${steps.length}`:"Trip confirmed ✓"}</p>
        <div style={{display:"flex",gap:6,marginTop:"1.25rem"}}>
          {steps.map((s,i)=>(<div key={i} style={{flex:1,height:3,borderRadius:2,background:i<=step?"rgba(196,98,45,0.8)":"rgba(242,232,217,0.15)",transition:"background 0.3s"}}/>))}
        </div>
      </div>
    </CyclingHeader>

    <div style={{padding:"1.5rem",maxWidth:640,margin:"0 auto"}}>
      {/* Hotel finder step */}
      {step===1?(
        <div style={{marginBottom:"1rem"}}>
          {!hotelRecs&&!hotelLoading&&(<>
            {/* Quick browse option */}
            <div style={{background:C.espresso,borderRadius:16,padding:"1rem 1.25rem",marginBottom:"0.75rem",display:"flex",alignItems:"center",justifyContent:"space-between",gap:"0.75rem"}}>
              <div>
                <p style={{fontSize:"0.85rem",fontWeight:600,color:C.sand,margin:"0 0 0.2rem"}}>I'm not fussy — just show me options</p>
                <p style={{fontSize:"0.75rem",color:"rgba(242,232,217,0.55)",margin:0,fontWeight:300}}>Browse {trip.destination} hotels on Booking.com</p>
              </div>
              <a href={buildBookingUrl()} target="_blank" rel="noopener noreferrer"
                style={{flexShrink:0,padding:"0.6rem 1rem",background:"#003580",color:C.white,borderRadius:10,fontSize:"0.8rem",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>
                Browse →
              </a>
            </div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.75rem"}}><div style={{flex:1,height:1,background:C.border}}/><span style={{fontSize:"0.65rem",color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600}}>or get AI recommendations</span><div style={{flex:1,height:1,background:C.border}}/></div>
            <div style={{background:C.white,borderRadius:20,border:`1px solid ${C.border}`,padding:"1.5rem",marginBottom:"0.75rem",boxShadow:"0 4px 24px rgba(28,20,16,0.07)"}}>
              <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>🏨</div>
              <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:600,color:C.espresso,margin:"0 0 0.35rem"}}>Find your perfect hotel</h3>
              <p style={{fontSize:"0.85rem",color:C.muted,margin:"0 0 1.5rem",fontWeight:300,lineHeight:1.6}}>Tell us what matters most and we'll find the right options in {trip.destination}.</p>

              {/* Filter 1: Room type */}
              <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.6rem"}}>Room type</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1.25rem"}}>
                {[{v:"Double room",e:"🛏"},{v:"Twin beds",e:"🛏🛏"},{v:"Family room",e:"👨‍👩‍👧"},{v:"Suite / upgrade",e:"✨"}].map(o=>(
                  <button key={o.v} onClick={()=>setRoomType(o.v)} style={{padding:"0.7rem",background:roomType===o.v?C.espresso:C.sandLight,color:roomType===o.v?C.sand:C.espresso,border:`1.5px solid ${roomType===o.v?C.espresso:C.border}`,borderRadius:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,transition:"all 0.15s"}}>{o.e} {o.v}</button>
                ))}
              </div>

              {/* Filter 2: Hotel style */}
              <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.6rem"}}>Hotel style</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1.25rem"}}>
                {[{v:"Boutique & design",e:"🎨"},{v:"Luxury 5-star",e:"💎"},{v:"Mid-range comfort",e:"👌"},{v:"Budget & clean",e:"💸"}].map(o=>(
                  <button key={o.v} onClick={()=>setHotelStyle(o.v)} style={{padding:"0.7rem",background:hotelStyle===o.v?C.espresso:C.sandLight,color:hotelStyle===o.v?C.sand:C.espresso,border:`1.5px solid ${hotelStyle===o.v?C.espresso:C.border}`,borderRadius:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,transition:"all 0.15s"}}>{o.e} {o.v}</button>
                ))}
              </div>

              {/* Filter 3: Top priority */}
              <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.6rem"}}>What matters most?</p>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.5rem",marginBottom:"1.25rem"}}>
                {[{v:"Pool & outdoor",e:"🏊"},{v:"City-centre location",e:"📍"},{v:"Beach access",e:"🏖"},{v:"Spa & wellness",e:"🧖"}].map(o=>(
                  <button key={o.v} onClick={()=>setHotelPriority(o.v)} style={{padding:"0.7rem",background:hotelPriority===o.v?C.espresso:C.sandLight,color:hotelPriority===o.v?C.sand:C.espresso,border:`1.5px solid ${hotelPriority===o.v?C.espresso:C.border}`,borderRadius:10,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.82rem",fontWeight:500,transition:"all 0.15s"}}>{o.e} {o.v}</button>
                ))}
              </div>

              {/* Extras */}
              <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.6rem"}}>Anything else?</p>
              <textarea value={hotelExtras} onChange={e=>setHotelExtras(e.target.value)} placeholder="e.g. quiet street, rooftop bar, pet-friendly, parking, sea view…" rows={2} style={{width:"100%",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"0.85rem",fontSize:"0.88rem",color:C.ink,resize:"none",outline:"none",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif",marginBottom:"1rem"}}/>

              <button onClick={fetchHotels} disabled={!roomType||!hotelStyle||!hotelPriority} style={{width:"100%",padding:"1rem",background:roomType&&hotelStyle&&hotelPriority?C.terracotta:C.parchment,color:roomType&&hotelStyle&&hotelPriority?C.white:C.muted,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:roomType&&hotelStyle&&hotelPriority?"pointer":"default",fontFamily:"'DM Sans',sans-serif"}}>Find My Hotel in {trip.destination} →</button>
            </div>
          </>)}

          {hotelLoading&&(
            <div style={{background:C.white,borderRadius:20,border:`1px solid ${C.border}`,padding:"2.5rem 1.5rem",textAlign:"center",boxShadow:"0 4px 24px rgba(28,20,16,0.07)"}}>
              <div style={{animation:"pulse 2s ease-in-out infinite",marginBottom:"1rem"}}><ZirvoyMark size={36} color={C.terracotta}/></div>
              <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",color:C.espresso,margin:"0 0 0.35rem"}}>Finding the perfect hotels…</p>
              <p style={{fontSize:"0.82rem",color:C.muted,margin:0,fontWeight:300}}>Searching {trip.destination} based on your preferences</p>
            </div>
          )}

          {hotelRecs&&!hotelLoading&&(<>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"0.75rem"}}>
              <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>3 picks for {trip.destination}</p>
              <button onClick={()=>{setHotelRecs(null);setRoomType(null);setHotelStyle(null);setHotelPriority(null);setHotelExtras("");setBookedHotel(null);}} style={{background:"transparent",border:"none",fontSize:"0.78rem",color:C.terracotta,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>← Refine</button>
            </div>

            {/* Swipeable hotel carousel */}
            <div style={{position:"relative",borderRadius:20,overflow:"hidden",marginBottom:"0.75rem",boxShadow:"0 4px 24px rgba(28,20,16,0.08)",border:`1px solid ${C.border}`}}>
              {hotelRecs.map((h,i)=>(
                <div key={i} style={{display:i===hotelCardIndex?"block":"none",background:C.white}}>
                  {/* Header */}
                  <div style={{background:C.espresso,padding:"1.25rem 1.25rem 1rem",position:"relative"}}>
                    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
                      <div style={{flex:1,paddingRight:"0.5rem"}}>
                        <p style={{fontSize:"0.62rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em",margin:"0 0 0.3rem"}}>{i+1} of {hotelRecs.length} · {h.style}</p>
                        <h4 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:C.sand,margin:"0 0 0.2rem",lineHeight:1.1}}>{h.name}</h4>
                        <p style={{fontSize:"0.75rem",color:"rgba(242,232,217,0.6)",margin:0,fontWeight:300}}>📍 {h.area}</p>
                      </div>
                      <div style={{textAlign:"right",flexShrink:0}}>
                        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:600,color:C.sand,margin:0}}>£{h.pricePerNight}</p>
                        <p style={{fontSize:"0.65rem",color:"rgba(242,232,217,0.5)",margin:0}}>per night</p>
                      </div>
                    </div>
                    {/* Swipe arrows */}
                    {hotelRecs.length>1&&(
                      <div style={{display:"flex",gap:4,marginTop:"0.85rem"}}>
                        <button onClick={()=>setHotelCardIndex(i=>Math.max(0,i-1))} disabled={hotelCardIndex===0}
                          style={{flex:1,padding:"0.4rem",background:"rgba(242,232,217,0.1)",border:"none",color:C.sand,borderRadius:8,cursor:"pointer",fontSize:"0.85rem",opacity:hotelCardIndex===0?0.3:1}}>‹ Prev</button>
                        <button onClick={()=>setHotelCardIndex(i=>Math.min(hotelRecs.length-1,i+1))} disabled={hotelCardIndex===hotelRecs.length-1}
                          style={{flex:1,padding:"0.4rem",background:"rgba(242,232,217,0.1)",border:"none",color:C.sand,borderRadius:8,cursor:"pointer",fontSize:"0.85rem",opacity:hotelCardIndex===hotelRecs.length-1?0.3:1}}>Next ›</button>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div style={{padding:"1.1rem 1.25rem"}}>
                    <p style={{fontSize:"0.86rem",color:C.ink,lineHeight:1.65,fontWeight:300,margin:"0 0 0.6rem"}}>{h.why}</p>
                    <div style={{background:C.sandLight,borderRadius:8,padding:"0.6rem 0.75rem",marginBottom:"1rem",borderLeft:`2.5px solid ${C.terracotta}`}}>
                      <p style={{fontSize:"0.78rem",color:C.muted,margin:0,fontWeight:300}}>✨ {h.highlight}</p>
                    </div>
                    {bookedHotel?.name===h.name?(
                      <div style={{background:C.espresso,borderRadius:10,padding:"0.85rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                        <span style={{fontSize:"1.1rem"}}>✅</span>
                        <div><p style={{fontSize:"0.85rem",fontWeight:600,color:C.sand,margin:0}}>Hotel saved to your trip!</p><p style={{fontSize:"0.72rem",color:"rgba(242,232,217,0.6)",margin:0,fontWeight:300}}>{h.name}</p></div>
                      </div>
                    ):(
                      <div style={{display:"flex",gap:"0.5rem"}}>
                        <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.bookingSearch+", "+trip.destination)}&checkin=${departDate}&checkout=${returnDate}&group_adults=${trip.travellers||2}&no_rooms=1&lang=en-gb&currency=GBP`} target="_blank" rel="noopener noreferrer"
                          style={{flex:2,display:"block",padding:"0.85rem",background:"#003580",color:C.white,borderRadius:10,fontSize:"0.82rem",fontWeight:600,textAlign:"center",textDecoration:"none",fontFamily:"'DM Sans',sans-serif",boxSizing:"border-box"}}>
                          Check on Booking.com ↗
                        </a>
                        <button onClick={()=>setBookedHotel({name:h.name,area:h.area,pricePerNight:h.pricePerNight,checkin:departDate,checkout:returnDate})}
                          style={{flex:1,padding:"0.85rem",background:C.espresso,color:C.sand,border:"none",borderRadius:10,fontSize:"0.78rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                          ✓ Booked it
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {bookedHotel&&<button onClick={()=>setStep(s=>s+1)} style={{width:"100%",padding:"0.85rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.88rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem"}}>Next: book activities →</button>}
            <button onClick={()=>setStep(s=>s+1)} style={{width:"100%",padding:"0.85rem",background:"transparent",color:C.terracotta,border:`1.5px solid ${C.terracotta}`,borderRadius:12,fontSize:"0.88rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>I've found my hotel →</button>
          </>)}
        </div>
      ):(
      /* Flights step */
      step===0?(
      <div style={{background:C.white,borderRadius:20,border:`1px solid ${C.border}`,padding:"1.5rem",marginBottom:"1rem",boxShadow:"0 4px 24px rgba(28,20,16,0.07)"}}>
        <div style={{fontSize:"2rem",marginBottom:"0.75rem"}}>✈</div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",fontWeight:600,color:C.espresso,margin:"0 0 0.5rem"}}>Find your flights</h3>
        <p style={{fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300,margin:"0 0 0.75rem"}}>{trip.flights}</p>
        <div style={{background:C.sandLight,borderRadius:12,padding:"0.85rem 1rem",marginBottom:"1.25rem",borderLeft:`3px solid ${C.terracotta}`}}>
          <p style={{fontSize:"0.78rem",color:C.muted,margin:0,lineHeight:1.6,fontWeight:300}}>Skyscanner opens in a new tab — your Zirvoy booking flow stays open here so you can come straight back.</p>
        </div>
        {!flightSearchOpened?(
          <a href={buildSkyscannerUrl()} target="_blank" rel="noopener noreferrer"
            onClick={()=>setFlightSearchOpened(true)}
            style={{display:"block",width:"100%",padding:"1rem",background:C.terracotta,color:C.white,borderRadius:12,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"center",textDecoration:"none",boxSizing:"border-box",marginBottom:"0.75rem"}}>
            Search Flights on Skyscanner ↗
          </a>
        ):(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{background:"rgba(196,98,45,0.08)",border:`1.5px solid ${C.terracotta}`,borderRadius:12,padding:"1rem",marginBottom:"0.75rem",textAlign:"center"}}>
              <p style={{fontSize:"0.78rem",color:C.terracotta,fontWeight:600,margin:"0 0 0.25rem"}}>Skyscanner is open in another tab ↗</p>
              <p style={{fontSize:"0.75rem",color:C.muted,margin:0,fontWeight:300}}>Come back here once you've found your flight</p>
            </div>
            <a href={buildSkyscannerUrl()} target="_blank" rel="noopener noreferrer"
              style={{display:"block",width:"100%",padding:"0.75rem",background:"transparent",color:C.terracotta,border:`1px solid ${C.terracotta}`,borderRadius:10,fontSize:"0.82rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"center",textDecoration:"none",boxSizing:"border-box",marginBottom:"0.75rem"}}>
              Re-open Skyscanner ↗
            </a>
          </div>
        )}
        {flightSearchOpened&&!bookedFlight&&(
          <button onClick={async()=>{
            const bf={confirmed:true,destination:trip.destination,depart:departDate,return:returnDate};
            setBookedFlight(bf);
            try{
              const{data:saved}=await supabase.from("trips").select("id").eq("destination",trip.destination).order("created_at",{ascending:false}).limit(1);
              if(saved?.[0]?.id)await supabase.from("trips").update({trip_data:{...trip,isBooked:true,departDate,returnDate}}).eq("id",saved[0].id);
            }catch(e){console.error("Booking save:",e);}
          }}
            style={{width:"100%",padding:"1rem",background:C.espresso,color:C.sand,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.75rem"}}>
            ✓ I've booked my flights — save to trip
          </button>
        )}
        {bookedFlight&&(
          <div style={{marginBottom:"0.75rem"}}>
            <div style={{background:C.espresso,borderRadius:12,padding:"0.85rem 1rem",marginBottom:"0.65rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
              <span style={{fontSize:"1.2rem"}}>✅</span>
              <div><p style={{fontSize:"0.85rem",fontWeight:600,color:C.sand,margin:0}}>Flights confirmed!</p><p style={{fontSize:"0.72rem",color:"rgba(242,232,217,0.6)",margin:0,fontWeight:300}}>{departDate} → {returnDate}</p></div>
            </div>
            {!flightDetailsSaved?(
              <div style={{background:C.white,borderRadius:12,border:`1px solid ${C.border}`,padding:"1rem"}}>
                <p style={{fontSize:"0.72rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.75rem"}}>Add flight details (optional)</p>
                <p style={{fontSize:"0.8rem",color:C.muted,margin:"0 0 0.85rem",lineHeight:1.5,fontWeight:300}}>Zirvoy will use these to optimise your Day 1 itinerary around your arrival time.</p>
                <input value={flightNum} onChange={e=>setFlightNum(e.target.value)} placeholder="Flight number e.g. EZY1234"
                  style={{width:"100%",padding:"0.65rem 0.85rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:"0.85rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem",boxSizing:"border-box"}}/>
                <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.75rem"}}>
                  <input value={flightDeparts} onChange={e=>setFlightDeparts(e.target.value)} placeholder="Departs e.g. 06:45"
                    style={{flex:1,padding:"0.65rem 0.85rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:"0.85rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                  <input value={flightArrives} onChange={e=>setFlightArrives(e.target.value)} placeholder="Arrives e.g. 10:30"
                    style={{flex:1,padding:"0.65rem 0.85rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:"0.85rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                </div>
                <div style={{display:"flex",gap:"0.5rem"}}>
                  <button onClick={async()=>{
                    try{
                      const{data:saved}=await supabase.from("trips").select("id").eq("destination",trip.destination).order("created_at",{ascending:false}).limit(1);
                      if(saved?.[0]?.id)await supabase.from("trips").update({trip_data:{...trip,isBooked:true,departDate,returnDate,flightNumber:flightNum,departureTime:flightDeparts,arrivalTime:flightArrives}}).eq("id",saved[0].id);
                    }catch(e){}
                    setFlightDetailsSaved(true);
                  }} style={{flex:2,padding:"0.65rem",background:C.terracotta,color:C.white,border:"none",borderRadius:8,fontSize:"0.82rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Save details →</button>
                  <button onClick={()=>setFlightDetailsSaved(true)} style={{flex:1,padding:"0.65rem",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:8,fontSize:"0.8rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Skip</button>
                </div>
              </div>
            ):(
              <div style={{background:C.parchment,borderRadius:10,padding:"0.65rem 1rem",fontSize:"0.8rem",color:C.muted,fontWeight:300}}>{flightNum||"Flight details"} · {flightDeparts&&flightArrives?`${flightDeparts} → ${flightArrives}`:"saved to trip"} ✓</div>
            )}
          </div>
        )}
        <button onClick={()=>setStep(1)}
          style={{width:"100%",padding:"0.85rem",background:"transparent",color:C.terracotta,border:`1.5px solid ${C.terracotta}`,borderRadius:12,fontSize:"0.88rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          {bookedFlight?"Next: find your hotel →":"I've sorted my flights →"}
        </button>
      </div>
      ):(
      /* Celebration + upsells */
      <div>
        {/* Booking summary */}
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:"1.1rem 1.25rem",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(28,20,16,0.05)"}}>
          <p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.14em",margin:"0 0 0.85rem"}}>Your bookings so far</p>
          {bookedFlight?(
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.65rem"}}>
              <span style={{fontSize:"1rem"}}>✅</span>
              <div><p style={{fontSize:"0.85rem",fontWeight:500,color:C.espresso,margin:0}}>Flights booked</p><p style={{fontSize:"0.72rem",color:C.muted,margin:0,fontWeight:300}}>{departDate} → {returnDate}</p></div>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:"0.65rem",opacity:0.5}}>
              <span style={{fontSize:"1rem"}}>⬜</span>
              <p style={{fontSize:"0.85rem",color:C.muted,margin:0,fontWeight:300}}>Flights — not saved yet</p>
            </div>
          )}
          {bookedHotel?(
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <span style={{fontSize:"1rem"}}>✅</span>
              <div><p style={{fontSize:"0.85rem",fontWeight:500,color:C.espresso,margin:0}}>{bookedHotel.name}</p><p style={{fontSize:"0.72rem",color:C.muted,margin:0,fontWeight:300}}>{bookedHotel.checkin} → {bookedHotel.checkout} · £{bookedHotel.pricePerNight}/night</p></div>
            </div>
          ):(
            <div style={{display:"flex",alignItems:"center",gap:10,opacity:0.5}}>
              <span style={{fontSize:"1rem"}}>⬜</span>
              <p style={{fontSize:"0.85rem",color:C.muted,margin:0,fontWeight:300}}>Hotel — not saved yet</p>
            </div>
          )}
        </div>

        {/* What's next — question tiles */}
        <p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.14em",margin:"0 0 0.65rem"}}>What's next?</p>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1.25rem"}}>
          {/* Redo itinerary */}
          <button onClick={()=>setShowRefinePanel(p=>!p)}
            style={{background:showRefinePanel?C.espresso:C.white,border:`1.5px solid ${showRefinePanel?C.espresso:C.border}`,borderRadius:16,padding:"1.1rem 1rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"all 0.2s"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.4rem"}}>✏️</div>
            <div style={{fontSize:"0.85rem",fontWeight:600,color:showRefinePanel?C.sand:C.espresso,lineHeight:1.3}}>Redo the itinerary?</div>
            <div style={{fontSize:"0.72rem",color:showRefinePanel?"rgba(242,232,217,0.6)":C.muted,marginTop:3,fontWeight:300}}>Update it with your dates</div>
          </button>
          {/* Transfers */}
          <a href={buildTransfersUrl()} target="_blank" rel="noopener noreferrer"
            style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"1.1rem 1rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",textDecoration:"none",display:"block",transition:"all 0.2s"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.4rem"}}>🚗</div>
            <div style={{fontSize:"0.85rem",fontWeight:600,color:C.espresso,lineHeight:1.3}}>Transfers or car hire?</div>
            <div style={{fontSize:"0.72rem",color:C.muted,marginTop:3,fontWeight:300}}>Get from the airport easy</div>
          </a>
          {/* Activities */}
          <a href={buildGYGUrl()} target="_blank" rel="noopener noreferrer"
            style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"1.1rem 1rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",textDecoration:"none",display:"block",transition:"all 0.2s"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.4rem"}}>🎭</div>
            <div style={{fontSize:"0.85rem",fontWeight:600,color:C.espresso,lineHeight:1.3}}>Book activities?</div>
            <div style={{fontSize:"0.72rem",color:C.muted,marginTop:3,fontWeight:300}}>Tours & experiences</div>
          </a>
          {/* Restaurants */}
          <a href={`https://www.tripadvisor.co.uk/Search?q=${encodeURIComponent(trip.destination+"+restaurants")}`} target="_blank" rel="noopener noreferrer"
            style={{background:C.white,border:`1.5px solid ${C.border}`,borderRadius:16,padding:"1.1rem 1rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",textDecoration:"none",display:"block",transition:"all 0.2s"}}>
            <div style={{fontSize:"1.5rem",marginBottom:"0.4rem"}}>🍽</div>
            <div style={{fontSize:"0.85rem",fontWeight:600,color:C.espresso,lineHeight:1.3}}>Browse restaurants?</div>
            <div style={{fontSize:"0.72rem",color:C.muted,marginTop:3,fontWeight:300}}>Find great places to eat</div>
          </a>
        </div>

        {/* Refine panel */}
        {showRefinePanel&&(
          <div style={{background:C.white,borderRadius:14,border:`1px solid ${C.border}`,padding:"1.1rem",marginBottom:"1rem"}}>
            {refinedItinerary?(
              <div style={{background:C.espresso,borderRadius:10,padding:"0.85rem",display:"flex",alignItems:"center",gap:"0.75rem"}}>
                <span>✅</span>
                <p style={{fontSize:"0.85rem",fontWeight:500,color:C.sand,margin:0}}>Itinerary updated and saved!</p>
              </div>
            ):(
              <>
                <textarea value={refineInput} onChange={e=>setRefineInput(e.target.value)}
                  placeholder={`e.g. "Make Day 1 more relaxed", "Add a cooking class", "Swap museum for beach day"`}
                  rows={3} style={{width:"100%",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:10,padding:"0.85rem",fontSize:"0.85rem",color:C.ink,resize:"none",outline:"none",lineHeight:1.6,fontFamily:"'DM Sans',sans-serif",marginBottom:"0.6rem",boxSizing:"border-box"}}/>
                <button onClick={submitRefine} disabled={!refineInput.trim()||refineLoading}
                  style={{width:"100%",padding:"0.85rem",background:refineInput.trim()&&!refineLoading?C.terracotta:C.parchment,color:refineInput.trim()&&!refineLoading?C.white:C.muted,border:"none",borderRadius:10,fontSize:"0.85rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                  {refineLoading?"Updating itinerary…":"Update itinerary →"}
                </button>
              </>
            )}
          </div>
        )}

        <button onClick={onSummary||onDone}
          style={{width:"100%",padding:"1rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.75rem"}}>
          View & plan my trip →
        </button>
      </div>))}

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

function SwipeableTrip({t,onTripClick,onDelete}){
  const[offset,setOffset]=useState(0);
  const[deleting,setDeleting]=useState(false);
  const startX=React.useRef(null);
  const THRESHOLD=80;
  const DELETE_THRESHOLD=200;

  const onStart=(clientX)=>{startX.current=clientX;};
  const onMove=(clientX)=>{
    if(startX.current===null)return;
    const dx=clientX-startX.current;
    if(dx<0)setOffset(Math.max(dx,-240));
  };
  const onEnd=()=>{
    if(offset<-DELETE_THRESHOLD){
      setDeleting(true);
      onDelete(t.id);
    } else if(offset<-THRESHOLD){
      setOffset(-THRESHOLD);
    } else {
      setOffset(0);
    }
    startX.current=null;
  };

  if(deleting)return null;

  return(
    <div style={{position:"relative",borderRadius:16,overflow:"hidden",boxShadow:"0 2px 12px rgba(28,20,16,0.06)"}}>
      {/* Red delete background */}
      <div style={{position:"absolute",inset:0,background:"#c0392b",display:"flex",alignItems:"center",justifyContent:"flex-end",paddingRight:"1.25rem",borderRadius:16}}>
        <div style={{textAlign:"center",color:C.white}}>
          <div style={{fontSize:"1.4rem",marginBottom:"0.2rem"}}>🗑</div>
          <div style={{fontSize:"0.7rem",fontWeight:600,letterSpacing:"0.08em"}}>DELETE</div>
        </div>
      </div>
      {/* Card */}
      <div
        style={{transform:`translateX(${offset}px)`,transition:startX.current===null?"transform 0.3s ease":"none",background:C.white,borderRadius:16,border:`1px solid ${C.border}`,overflow:"hidden",cursor:"pointer",position:"relative",zIndex:1}}
        onClick={()=>{if(offset===0)onTripClick(t);else setOffset(0);}}
        onTouchStart={e=>onStart(e.touches[0].clientX)}
        onTouchMove={e=>onMove(e.touches[0].clientX)}
        onTouchEnd={onEnd}
        onMouseDown={e=>onStart(e.clientX)}
        onMouseMove={e=>{if(startX.current!==null)onMove(e.clientX);}}
        onMouseUp={onEnd}
        onMouseLeave={()=>{if(startX.current!==null)onEnd();}}
      >
        {t.trip_data?.photo&&(<div style={{height:120,overflow:"hidden",position:"relative"}}><img src={t.trip_data.photo} alt={t.destination} style={{width:"100%",height:"100%",objectFit:"cover"}}/><div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(28,20,16,0.7) 100%)"}}/><div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0.75rem 1rem"}}><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",fontWeight:600,color:C.sand,margin:0,lineHeight:1}}>{t.destination}</p><p style={{fontSize:"0.72rem",color:"rgba(242,232,217,0.7)",margin:"0.2rem 0 0",fontFamily:"'DM Sans',sans-serif"}}>{t.trip_data?.country}</p></div></div>)}
        <div style={{padding:"0.85rem 1rem",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",gap:"0.75rem"}}>
            <span style={{fontSize:"0.75rem",color:C.muted}}>{t.trip_data?.duration} nights</span>
            <span style={{fontSize:"0.75rem",color:C.muted}}>·</span>
            <span style={{fontSize:"0.75rem",color:C.muted}}>£{fmt(t.trip_data?.budgetTotal)}</span>
            <span style={{fontSize:"0.75rem",color:C.muted}}>·</span>
            <span style={{fontSize:"0.75rem",color:C.muted}}>{t.trip_data?.travellers} travellers</span>
          </div>
          <span style={{color:C.terracotta,fontSize:"1rem"}}>→</span>
        </div>
      </div>
    </div>
  );
}

function MyTripsScreen({trips,onTripClick,onSummary,onPlanNew,onDeleteTrip,destImages=[]}){
  const bookedTrips=trips.filter(t=>t.trip_data?.isBooked);
  const unbookedTrips=trips.filter(t=>!t.trip_data?.isBooked);
  const getDaysTo=(dateStr)=>{
    if(!dateStr)return null;
    const diff=Math.ceil((new Date(dateStr)-new Date())/(1000*60*60*24));
    return diff>0?diff:null;
  };
  return(
    <div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
      <CyclingHeader images={destImages} minH="180px">
        <div style={{padding:"3rem 1.5rem 2rem"}}>
          <ZirvoyLogo light/>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:600,color:C.sand,margin:"1.25rem 0 0.25rem"}}>My Trips</h2>
          <p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>{trips.length} {trips.length===1?"trip":"trips"} saved</p>
        </div>
      </CyclingHeader>
      <div style={{padding:"1.5rem"}}>
        {trips.length===0?(
          <div style={{textAlign:"center",padding:"3rem 1rem"}}>
            <div style={{marginBottom:"1rem",opacity:0.3}}><ZirvoyMark size={48} color={C.espresso}/></div>
            <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.3rem",color:C.espresso,margin:"0 0 0.5rem"}}>No trips yet</p>
            <p style={{fontSize:"0.85rem",color:C.muted,margin:"0 0 1.5rem",fontWeight:300}}>Plan your first trip and it'll be saved here automatically</p>
            <button onClick={onPlanNew} style={{padding:"0.85rem 1.75rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.9rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Plan a Trip</button>
          </div>
        ):(
          <div>
            <p style={{fontSize:"0.72rem",color:C.muted,margin:"0 0 1rem",fontWeight:300,textAlign:"right"}}>← Swipe left to delete</p>

            {/* Booked trips */}
            {bookedTrips.length>0&&(
              <div style={{marginBottom:"1.25rem"}}>
                <p style={{fontSize:"0.68rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.65rem"}}>✈ Booked</p>
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  {bookedTrips.map(t=>{
                    const daysTo=getDaysTo(t.trip_data?.departDate);
                    return(
                      <div key={t.id}>
                        <SwipeableTrip t={t} onTripClick={onSummary||onTripClick} onDelete={onDeleteTrip}/>
                        {daysTo&&(
                          <div style={{background:C.terracotta,borderRadius:"0 0 14px 14px",padding:"0.45rem 1rem",marginTop:-8,display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:"0.75rem",fontWeight:600,color:C.white}}>{daysTo} days to go! ✈</span>
                            <span style={{fontSize:"0.7rem",color:"rgba(255,255,255,0.7)",fontWeight:300}}>{t.trip_data.departDate}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Unbooked trips */}
            {unbookedTrips.length>0&&(
              <div style={{marginBottom:"1.25rem"}}>
                {bookedTrips.length>0&&<p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.65rem"}}>Ideas & plans</p>}
                <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
                  {unbookedTrips.map(t=>(<SwipeableTrip key={t.id} t={t} onTripClick={onSummary||onTripClick} onDelete={onDeleteTrip}/>))}
                </div>
              </div>
            )}

            <button onClick={onPlanNew} style={{width:"100%",marginTop:"0.25rem",padding:"1rem",background:"transparent",color:C.terracotta,border:`1.5px solid ${C.terracotta}`,borderRadius:14,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>+ Plan a New Trip</button>
          </div>
        )}
      </div>
    </div>
  );
}

function AccountScreen({profile,onSignOut,destImages=[]}){return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}><CyclingHeader images={destImages} minH="200px"><div style={{padding:"3rem 1.5rem 2.5rem"}}><ZirvoyLogo light/><div style={{marginTop:"1.5rem",display:"flex",alignItems:"center",gap:"1rem"}}><div style={{width:52,height:52,borderRadius:"50%",background:"rgba(196,98,45,0.2)",border:`1.5px solid ${C.terracotta}`,display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:C.sand}}>{(profile?.first_name?.[0]||"Z").toUpperCase()}</span></div><div><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:C.sand,margin:0}}>{profile?.first_name} {profile?.last_name}</p><p style={{fontSize:"0.8rem",color:"rgba(242,232,217,0.5)",margin:"0.1rem 0 0",fontWeight:300}}>{profile?.email}</p></div></div></div></CyclingHeader><div style={{padding:"1.5rem"}}><div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.25rem",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(28,20,16,0.05)"}}><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 1rem"}}>Your Details</p>{[["Home Airport",profile?.home_airport||"Not set"],["Nationality",profile?.nationality||"Not set"],["Date of Birth",profile?.date_of_birth||"Not set"]].map(([label,val])=>(<div key={label} style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingBottom:"0.85rem",marginBottom:"0.85rem",borderBottom:`1px solid ${C.parchment}`}}><span style={{fontSize:"0.85rem",color:C.muted}}>{label}</span><span style={{fontSize:"0.85rem",color:C.espresso,fontWeight:500}}>{val}</span></div>))}<div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}><span style={{fontSize:"0.85rem",color:C.muted}}>Passport</span><span style={{fontSize:"0.85rem",color:profile?.passport_number?C.espresso:C.muted,fontWeight:profile?.passport_number?500:300}}>{profile?.passport_number?"••••••••••":"Not added"}</span></div></div>{!profile?.passport_number&&(<div style={{background:C.parchment,borderRadius:14,padding:"1rem 1.1rem",marginBottom:"1rem",border:`1px solid ${C.border}`}}><p style={{fontSize:"0.8rem",fontWeight:600,color:C.espresso,margin:"0 0 0.25rem"}}>💡 Speed up booking</p><p style={{fontSize:"0.78rem",color:C.muted,margin:0,lineHeight:1.5,fontWeight:300}}>Add your passport details and we'll pre-fill them when you book.</p></div>)}<button onClick={onSignOut} style={{width:"100%",padding:"1rem",background:"transparent",color:"#c0392b",border:"1.5px solid #c0392b",borderRadius:14,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginTop:"0.5rem"}}>Sign Out</button></div></div>);}

function LandingPage({onCreateAccount,onLogin,onDecide,onStartPlanning}){
  const[photos,setPhotos]=useState([]);
  const[current,setCurrent]=useState(0);
  const[imgLoaded,setImgLoaded]=useState({});

  useEffect(()=>{
    fetch("/api/destinations").then(r=>r.json()).then(d=>{
      if(d.photos?.length)setPhotos(d.photos);
    }).catch(()=>{});
  },[]);

  useEffect(()=>{
    if(!photos.length)return;
    const t=setInterval(()=>setCurrent(c=>(c+1)%photos.length),5000);
    return()=>clearInterval(t);
  },[photos.length]);

  const photo=photos[current];

  return(
    <div style={{minHeight:"100vh",position:"relative",overflow:"hidden",fontFamily:"'DM Sans',sans-serif",display:"flex",flexDirection:"column"}}>
      {/* Background images */}
      {photos.map((p,i)=>(
        <div key={i} style={{position:"absolute",inset:0,zIndex:0,opacity:i===current&&imgLoaded[i]?1:0,transition:"opacity 1.2s ease"}}>
          <img src={p.url} alt={p.destination} onLoad={()=>setImgLoaded(l=>({...l,[i]:true}))} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
        </div>
      ))}
      {/* Fallback gradient — sits behind photos */}
      <div style={{position:"absolute",inset:0,zIndex:-1,background:`linear-gradient(135deg,${C.bark} 0%,${C.espresso} 100%)`}}/>
      {/* Dark overlay — heavier at bottom to keep text readable on any image */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.35) 0%,rgba(28,20,16,0.5) 35%,rgba(28,20,16,0.97) 100%)",zIndex:1}}/>

      {/* Content */}
      <div style={{position:"relative",zIndex:3,flex:1,display:"flex",flexDirection:"column",padding:"3rem 1.5rem 2.5rem",maxWidth:520,margin:"0 auto",width:"100%"}}>
        <div><ZirvoyLogo light/></div>

        <div style={{marginTop:"auto",paddingTop:"3rem"}}>
          {photo&&(
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:"1rem"}}>
              <div style={{width:6,height:6,borderRadius:"50%",background:C.terracotta}}/>
              <span style={{fontSize:"0.7rem",fontWeight:600,color:C.terra2,letterSpacing:"0.2em",textTransform:"uppercase"}}>{photo.destination}</span>
            </div>
          )}
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.8rem,9vw,4.2rem)",fontWeight:600,color:C.sand,margin:"0 0 1.25rem",lineHeight:1.0}}>
            Where do you<br/>want to go?
          </h1>
          <p style={{fontSize:"0.95rem",color:"rgba(242,232,217,0.6)",margin:"0 0 2rem",lineHeight:1.7,fontWeight:300,maxWidth:340}}>
            Tell Zirvoy your dream trip and get a full AI-generated plan — flights, hotel, itinerary — in seconds.
          </p>
          <div style={{display:"flex",flexDirection:"column",gap:"0.75rem"}}>
            <Btn onClick={onStartPlanning||onCreateAccount} variant="primary" style={{fontSize:"0.98rem",padding:"1.1rem"}}>Start planning free →</Btn>
            <div style={{display:"flex",gap:"0.6rem"}}>
              <Btn onClick={onCreateAccount} variant="outline" style={{flex:1,fontSize:"0.88rem",padding:"0.85rem"}}>Sign up</Btn>
              <Btn onClick={onLogin} variant="outline" style={{flex:1,fontSize:"0.88rem",padding:"0.85rem"}}>Log in</Btn>
            </div>
          </div>
          {photos.length>1&&(
            <div style={{display:"flex",gap:5,justifyContent:"center",marginTop:"1.75rem"}}>
              {photos.map((_,i)=>(
                <div key={i} onClick={()=>setCurrent(i)} style={{width:i===current?20:5,height:5,borderRadius:3,background:i===current?C.terracotta:"rgba(242,232,217,0.3)",transition:"all 0.4s",cursor:"pointer"}}/>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


function SignUpScreen({onSuccess,onLogin}){const[step,setStep]=useState(1);const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const[form,setForm]=useState({firstName:"",lastName:"",email:"",password:"",dateOfBirth:"",nationality:"",homeAirport:"",passportNumber:"",passportExpiry:""});const set=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));const setVal=(k)=>(v)=>setForm(f=>({...f,[k]:v}));const s1v=form.firstName&&form.lastName&&form.email&&form.password.length>=6;const s2v=form.homeAirport;const handleSignUp=async()=>{setLoading(true);setError(null);try{const{data,error:ae}=await supabase.auth.signUp({email:form.email,password:form.password});if(ae)throw ae;if(data.user){const{error:profErr}=await supabase.from("profiles").insert({id:data.user.id,first_name:form.firstName,last_name:form.lastName,email:form.email,home_airport:form.homeAirport,date_of_birth:form.dateOfBirth||null,nationality:form.nationality||null,passport_number:form.passportNumber||null,passport_expiry:form.passportExpiry||null});if(profErr)throw profErr;}onSuccess(data.user);}catch(e){setError(e.message);}finally{setLoading(false);}};const titles=["Create your account","About you","Speed up bookings"];const subs=["Start planning in seconds","Helps us personalise your trips","Optional — save time when booking"];return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif"}}><div style={{background:C.espresso,padding:"2rem 1.5rem 2.5rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative"}}><ZirvoyLogo light/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:600,color:C.sand,margin:"1.25rem 0 0.35rem",lineHeight:1.2}}>{titles[step-1]}</h2><p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>{subs[step-1]}</p><div style={{display:"flex",gap:6,marginTop:"1.25rem"}}>{[1,2,3].map(i=><div key={i} style={{width:i===step?24:6,height:6,borderRadius:3,background:i<=step?C.terracotta:"rgba(242,232,217,0.2)",transition:"all 0.3s"}}/>)}</div></div></div><div style={{padding:"1.75rem 1.5rem",maxWidth:480,margin:"0 auto"}}>{error&&<div style={{background:"#fde8e8",border:"1px solid #e07070",borderRadius:10,padding:"0.75rem 1rem",marginBottom:"1rem",fontSize:"0.85rem",color:"#c0392b"}}>{error}</div>}{step===1&&<><Input label="First Name" value={form.firstName} onChange={set("firstName")} placeholder="John"/><Input label="Last Name" value={form.lastName} onChange={set("lastName")} placeholder="Smith"/><Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="john@example.com"/><Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 6 characters"/><Btn onClick={()=>{setError(null);setStep(2);}} disabled={!s1v}>Continue</Btn><p style={{textAlign:"center",fontSize:"0.85rem",color:C.muted,marginTop:"1.25rem"}}>Already have an account?{" "}<span onClick={onLogin} style={{color:C.terracotta,cursor:"pointer",fontWeight:500}}>Log in</span></p></>}{step===2&&<><AirportInput value={form.homeAirport} onChange={setVal("homeAirport")}/><Input label="Date of Birth" type="date" value={form.dateOfBirth} onChange={set("dateOfBirth")} optional/><NationalityInput value={form.nationality} onChange={setVal("nationality")}/><Btn onClick={()=>setStep(3)} disabled={!s2v}>Continue</Btn><Btn onClick={()=>setStep(1)} variant="secondary" style={{marginTop:"0.5rem"}}>Back</Btn></>}{step===3&&<><div style={{background:C.parchment,borderRadius:12,padding:"0.85rem 1rem",marginBottom:"1.25rem",fontSize:"0.82rem",color:C.muted,lineHeight:1.6}}>We store this securely so you never have to type it again when booking.</div><Input label="Passport Number" value={form.passportNumber} onChange={set("passportNumber")} placeholder="e.g. 123456789" optional/><Input label="Passport Expiry" type="date" value={form.passportExpiry} onChange={set("passportExpiry")} optional/><Btn onClick={handleSignUp} disabled={loading}>{loading?"Creating your account…":"Start Planning →"}</Btn><Btn onClick={()=>setStep(2)} variant="secondary" style={{marginTop:"0.5rem"}}>Back</Btn></>}</div></div>);}

function LoginScreen({onSuccess,onCreateAccount}){const[form,setForm]=useState({email:"",password:""});const[loading,setLoading]=useState(false);const[error,setError]=useState(null);const set=(k)=>(e)=>setForm(f=>({...f,[k]:e.target.value}));const valid=form.email&&form.password;const handleLogin=async()=>{setLoading(true);setError(null);try{const{data,error:ae}=await supabase.auth.signInWithPassword({email:form.email,password:form.password});if(ae)throw ae;onSuccess(data.user);}catch(e){setError("Incorrect email or password — please try again.");}finally{setLoading(false);};};return(<div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif"}}><div style={{background:C.espresso,padding:"2rem 1.5rem 2.5rem",position:"relative",overflow:"hidden"}}><div style={{position:"absolute",inset:0,backgroundImage:`radial-gradient(${C.bark} 1px,transparent 1px)`,backgroundSize:"22px 22px",opacity:0.6}}/><div style={{position:"relative"}}><ZirvoyLogo light/><h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"2rem",fontWeight:600,color:C.sand,margin:"1.25rem 0 0.35rem"}}>Welcome back</h2><p style={{fontSize:"0.85rem",color:"rgba(242,232,217,0.5)",margin:0,fontWeight:300}}>Log in to access your trips</p></div></div><div style={{padding:"1.75rem 1.5rem",maxWidth:480,margin:"0 auto"}}>{error&&<div style={{background:"#fde8e8",border:"1px solid #e07070",borderRadius:10,padding:"0.75rem 1rem",marginBottom:"1rem",fontSize:"0.85rem",color:"#c0392b"}}>{error}</div>}<Input label="Email" type="email" value={form.email} onChange={set("email")} placeholder="john@example.com"/><Input label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Your password"/><Btn onClick={handleLogin} disabled={!valid||loading}>{loading?"Logging in…":"Log In →"}</Btn><p style={{textAlign:"center",fontSize:"0.85rem",color:C.muted,marginTop:"1.25rem"}}>Don't have an account?{" "}<span onClick={onCreateAccount} style={{color:C.terracotta,cursor:"pointer",fontWeight:500}}>Create one</span></p></div></div>);}

function TripRevealScreen({trip,onContinue}){
  const[imgLoaded,setImgLoaded]=useState(false);
  const[visible,setVisible]=useState(false);
  const DURATION=3200;
  useEffect(()=>{
    const show=setTimeout(()=>setVisible(true),60);
    const next=setTimeout(()=>onContinue(),DURATION);
    return()=>{clearTimeout(show);clearTimeout(next);};
  },[]);
  return(
    <div style={{position:"fixed",inset:0,background:C.espresso,zIndex:150,fontFamily:"'DM Sans',sans-serif",overflow:"hidden"}}>
      {/* Hero image */}
      {trip.photo&&<img src={trip.photo} alt={trip.destination} onLoad={()=>setImgLoaded(true)}
        style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",
          opacity:imgLoaded&&visible?1:0,transition:"opacity 1.4s ease",filter:"brightness(0.75)"}}/>}
      {/* Dark gradient */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.05) 0%,rgba(28,20,16,0.5) 50%,rgba(28,20,16,0.97) 100%)"}}/>
      {/* Progress bar */}
      <div style={{position:"absolute",top:0,left:0,right:0,height:2.5,background:"rgba(255,255,255,0.08)"}}>
        <div style={{height:"100%",background:C.terracotta,borderRadius:2,
          animation:`revealProgress ${DURATION}ms linear forwards`}}/>
      </div>
      {/* Zirvoy logo */}
      <div style={{position:"absolute",top:"1.5rem",left:"1.5rem",opacity:visible?1:0,transition:"opacity 0.6s ease 0.2s"}}>
        <ZirvoyLogo light size="sm"/>
      </div>
      {/* Skip button */}
      <button onClick={onContinue} style={{position:"absolute",top:"1.35rem",right:"1.5rem",
        background:"rgba(28,20,16,0.45)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.2)",
        color:C.sand,padding:"0.35rem 0.9rem",borderRadius:20,fontSize:"0.75rem",fontWeight:500,
        cursor:"pointer",fontFamily:"'DM Sans',sans-serif",
        opacity:visible?1:0,transition:"opacity 0.6s ease 0.4s"}}>
        Skip →
      </button>
      {/* Content */}
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"2rem 1.75rem 4.5rem",
        animation:visible?"fadeUp 0.9s ease 0.35s both":"none"}}>
        <p style={{fontSize:"0.62rem",fontWeight:600,color:C.terra2,letterSpacing:"0.22em",
          textTransform:"uppercase",margin:"0 0 0.5rem"}}>{trip.country}</p>
        <h1 style={{fontFamily:"'Cormorant Garamond',serif",
          fontSize:"clamp(3rem,10vw,5rem)",fontWeight:600,color:C.sand,
          margin:"0 0 0.75rem",lineHeight:0.95,letterSpacing:"-0.01em"}}>
          {trip.destination}
        </h1>
        <p style={{fontSize:"clamp(0.9rem,3vw,1.05rem)",color:"rgba(242,232,217,0.65)",
          margin:"0 0 2rem",lineHeight:1.6,fontWeight:300,maxWidth:380}}>
          {trip.tagline}
        </p>
        <button onClick={onContinue}
          style={{padding:"0.9rem 2rem",background:C.terracotta,color:C.white,border:"none",
            borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:"pointer",
            fontFamily:"'DM Sans',sans-serif"}}>
          View your trip →
        </button>
      </div>
    </div>
  );
}

function LoadingScreen({input}){
  const[prog,setProg]=useState(0);
  const steps=["Choosing the perfect destination","Crafting your day-by-day itinerary","Researching flights & hotels","Adding local insider tips"];
  const cur=Math.min(Math.floor((prog/100)*steps.length),steps.length-1);
  useEffect(()=>{
    const start=Date.now();const dur=13000;
    const t=setInterval(()=>{const p=Math.min(((Date.now()-start)/dur)*95,95);setProg(p);},120);
    return()=>clearInterval(t);
  },[]);
  return(
    <div style={{minHeight:"100vh",background:C.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{animation:"pulse 2s ease-in-out infinite",marginBottom:"2rem"}}><ZirvoyMark size={52} color={C.terracotta}/></div>
      {input&&<p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontStyle:"italic",color:"rgba(242,232,217,0.55)",margin:"0 0 2rem",textAlign:"center",lineHeight:1.5,maxWidth:320}}>"{input}"</p>}
      <div style={{width:"100%",maxWidth:280,marginBottom:"1.5rem"}}>
        {steps.map((s,i)=>{
          const done=i<cur;const active=i===cur;
          return(
            <div key={i} style={{display:"flex",alignItems:"center",gap:12,marginBottom:"0.9rem",opacity:i<=cur?1:0.28,transition:"opacity 0.5s"}}>
              <div style={{width:20,height:20,borderRadius:"50%",background:done?C.terracotta:active?"rgba(196,98,45,0.25)":"rgba(242,232,217,0.08)",border:`1.5px solid ${done?C.terracotta:active?C.terracotta:"rgba(242,232,217,0.12)"}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all 0.4s"}}>
                {done&&<span style={{color:C.white,fontSize:"0.62rem",lineHeight:1}}>✓</span>}
                {active&&<div style={{width:6,height:6,borderRadius:"50%",background:C.terracotta,animation:"pulse 1.5s ease-in-out infinite"}}/>}
              </div>
              <span style={{fontSize:"0.82rem",color:done?C.terra2:active?C.sand:"rgba(242,232,217,0.3)",fontWeight:active?500:300,transition:"color 0.4s"}}>{s}</span>
            </div>
          );
        })}
      </div>
      <div style={{width:240,height:2,background:"rgba(242,232,217,0.08)",borderRadius:2}}>
        <div style={{height:"100%",width:`${prog}%`,background:`linear-gradient(90deg,${C.terracotta},${C.gold})`,borderRadius:2,transition:"width 0.12s linear"}}/>
      </div>
    </div>
  );
}

function AuthPromptModal({reason,onClose,onSignUp,onLogin}){
  const msgs={
    save:{headline:"Save your trip",body:"Create a free account to save this trip and access it anytime."},
    book:{headline:"Ready to book?",body:"Create a free account to start booking — we'll save your plan and help you track everything."},
    trips:{headline:"Your trips",body:"Create a free account to save trips, track bookings and plan in detail."},
    default:{headline:"Join Zirvoy free",body:"Create a free account to save trips and start planning your booking."},
  };
  const m=msgs[reason]||msgs.default;
  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,20,16,0.7)",zIndex:200,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:640,background:C.sandLight,borderRadius:"22px 22px 0 0",padding:"1.75rem 1.5rem 2.5rem"}}>
        <div style={{width:36,height:3.5,background:C.parchment,borderRadius:2,margin:"0 auto 1.5rem"}}/>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"0.35rem"}}><ZirvoyMark size={18} color={C.terracotta}/><span style={{fontSize:"0.65rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em"}}>Free to join</span></div>
        <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.75rem",fontWeight:600,color:C.espresso,margin:"0 0 0.5rem"}}>{m.headline}</h3>
        <p style={{fontSize:"0.88rem",color:C.muted,margin:"0 0 1.75rem",lineHeight:1.6,fontWeight:300}}>{m.body}</p>
        <button onClick={onSignUp} style={{width:"100%",padding:"1rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.65rem"}}>Create free account →</button>
        <button onClick={onLogin} style={{width:"100%",padding:"0.85rem",background:"transparent",color:C.espresso,border:`1.5px solid ${C.border}`,borderRadius:12,fontSize:"0.9rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem"}}>Log in to your account</button>
        <button onClick={onClose} style={{width:"100%",padding:"0.65rem",background:"transparent",color:C.muted,border:"none",fontSize:"0.85rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Maybe later</button>
      </div>
    </div>
  );
}

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

function DecideModal({onClose,onGenerate}){
  const AIRPORT_STEP={id:"airport",q:"Where are you flying from?",sub:"We'll plan flights from your nearest airport"};
  const questions=[
    {id:"type",q:"Beach or city?",sub:"What kind of destination are you after?",options:[
      {emoji:"🏖",label:"Beach",sub:"Sun, sea & sand",value:"a beach destination"},
      {emoji:"🏙",label:"City",sub:"Culture & buzz",value:"a vibrant city destination"},
      {emoji:"🏔",label:"Mountains",sub:"Fresh air & scenery",value:"a mountain destination"},
      {emoji:"🌍",label:"Surprise me",sub:"Open to anything",value:"any destination, surprise me"},
    ]},
    {id:"flight",q:"How far do you want to fly?",sub:"From your airport",options:[
      {emoji:"⚡",label:"Short haul",sub:"Under 4 hours",value:"within a short haul flight (under 4 hours)"},
      {emoji:"✈️",label:"Medium haul",sub:"4–8 hours",value:"medium haul (4–8 hours)"},
      {emoji:"🌏",label:"Long haul",sub:"8+ hours",value:"long haul (8+ hours)"},
      {emoji:"🤷",label:"Don't mind",sub:"Open to anywhere",value:"any flight distance"},
    ]},
    {id:"vibe",q:"What's the vibe?",sub:"Pick the feeling you're after",options:[
      {emoji:"😌",label:"Relax & unwind",sub:"Slow days, good food",value:"relaxing and unwinding with slow days"},
      {emoji:"🎉",label:"Party & nightlife",sub:"Bars, clubs, fun",value:"party, nightlife and fun"},
      {emoji:"🥾",label:"Adventure",sub:"Hiking & outdoors",value:"adventure, hiking and outdoor activities"},
      {emoji:"🏛",label:"Culture",sub:"History & art",value:"culture, history, museums and sightseeing"},
      {emoji:"🍷",label:"Food & wine",sub:"Eat & drink well",value:"food, wine and gastronomy"},
      {emoji:"💑",label:"Romance",sub:"Couples escape",value:"romance and couples experiences"},
    ]},
    {id:"who",q:"Who's going?",sub:"",options:[
      {emoji:"🙋",label:"Just me",sub:"Solo adventure",value:"1 person travelling solo"},
      {emoji:"💑",label:"Couple",sub:"Two of us",value:"2 people as a couple"},
      {emoji:"👯",label:"Friends",sub:"Group of friends",value:"4 friends"},
      {emoji:"👨‍👩‍👧",label:"Family",sub:"With kids",value:"a family of 4 including children"},
    ]},
    {id:"budget",q:"What's your budget?",sub:"Per person, total trip",options:[
      {emoji:"💸",label:"Budget",sub:"Under £500pp",value:"a tight budget under £500 per person"},
      {emoji:"💰",label:"Mid-range",sub:"£500–1,000pp",value:"a mid-range budget of around £750 per person"},
      {emoji:"💎",label:"Luxury",sub:"£1,000–2,000pp",value:"a luxury budget of around £1,500 per person"},
      {emoji:"🤑",label:"No limit",sub:"Go all out",value:"no budget limit, spare no expense"},
    ]},
    {id:"when",q:"When are you thinking?",sub:"Helps Zirvoy suggest the ideal time to visit",options:[
      {emoji:"🔜",label:"ASAP",sub:"Next few months",value:"as soon as possible in the next few months"},
      {emoji:"☀️",label:"Summer",sub:"Jun–Aug",value:"over summer (June to August)"},
      {emoji:"🍂",label:"Autumn",sub:"Sep–Nov",value:"in autumn (September to November)"},
      {emoji:"❄️",label:"Winter",sub:"Dec–Feb",value:"over winter (December to February)"},
      {emoji:"🌸",label:"Spring",sub:"Mar–May",value:"in spring (March to May)"},
      {emoji:"🤷",label:"Flexible",sub:"Best time for trip",value:"whenever is best for this destination"},
    ]},
  ];
  const totalSteps=questions.length+1; // +1 for airport step
  const[step,setStep]=useState(0); // 0 = airport, 1+ = questions
  const[airport,setAirport]=useState("");
  const[airportQuery,setAirportQuery]=useState("");
  const[showAirportDropdown,setShowAirportDropdown]=useState(false);
  const[airportFocused,setAirportFocused]=useState(false);
  const[answers,setAnswers]=useState({});

  const filteredAirports=airportQuery.length>0
    ?AIRPORTS.filter(a=>a.toLowerCase().includes(airportQuery.toLowerCase())).slice(0,6)
    :[];

  const selectAirport=(a)=>{setAirport(a);setAirportQuery(a);setShowAirportDropdown(false);};

  const pick=(val)=>{
    const q=questions[step-1];
    const a={...answers,[q.id]:val};
    setAnswers(a);
    if(step<totalSteps-1){setStep(step+1);}
    else{
      const req=`I want to go to ${a.type}, ${a.flight}, the vibe should be ${a.vibe}, travelling as ${a.who}, with ${a.budget}, going ${a.when||"whenever suits best"}. I am flying from ${airport}. Build me the perfect trip.`;
      onClose();
      onGenerate(req);
    }
  };

  const currentQ=step>0?questions[step-1]:null;
  const isAirportStep=step===0;
  const airportValid=airport.trim().length>0;

  return(
    <div style={{position:"fixed",inset:0,background:"rgba(28,20,16,0.75)",zIndex:100,display:"flex",alignItems:"flex-end",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}>
      <div style={{width:"100%",maxWidth:640,background:C.sandLight,borderRadius:"22px 22px 0 0",padding:"1.75rem 1.5rem 3rem",maxHeight:"92vh",overflowY:"auto"}}>
        <div style={{width:36,height:3.5,background:C.parchment,borderRadius:2,margin:"0 auto 1.5rem"}}/>
        <div style={{display:"flex",gap:4,marginBottom:"1.75rem"}}>
          {Array.from({length:totalSteps}).map((_,i)=>(
            <div key={i} style={{flex:1,height:3,borderRadius:2,background:i<step?C.terracotta:i===step?"rgba(196,98,45,0.4)":C.parchment,transition:"background 0.3s"}}/>
          ))}
        </div>
        <p style={{fontSize:"0.65rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em",margin:"0 0 0.4rem"}}>Help me plan · {step+1} of {totalSteps}</p>

        {isAirportStep?(
          <>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.75rem",fontWeight:600,color:C.espresso,margin:"0 0 0.25rem"}}>{AIRPORT_STEP.q}</h3>
            <p style={{fontSize:"0.84rem",color:C.muted,margin:"0 0 1.5rem",fontWeight:300}}>{AIRPORT_STEP.sub}</p>
            <div style={{position:"relative",marginBottom:"1.5rem"}}>
              <input
                type="text"
                value={airportQuery}
                placeholder="e.g. London Heathrow"
                onChange={e=>{setAirportQuery(e.target.value);setAirport(e.target.value);setShowAirportDropdown(true);}}
                onFocus={()=>{setAirportFocused(true);setShowAirportDropdown(true);}}
                onBlur={()=>{setAirportFocused(false);setTimeout(()=>setShowAirportDropdown(false),150);}}
                style={{width:"100%",padding:"0.95rem 1rem",background:C.white,border:`1.5px solid ${airportFocused?C.terracotta:C.border}`,borderRadius:12,fontSize:"1rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s",boxSizing:"border-box"}}
              />
              {showAirportDropdown&&filteredAirports.length>0&&(
                <div style={{position:"absolute",top:"100%",left:0,right:0,background:C.white,border:`1px solid ${C.border}`,borderRadius:12,zIndex:50,boxShadow:"0 8px 24px rgba(28,20,16,0.12)",overflow:"hidden",marginTop:4}}>
                  {filteredAirports.map(a=>(
                    <div key={a} onMouseDown={()=>selectAirport(a)}
                      style={{padding:"0.75rem 1rem",fontSize:"0.88rem",color:C.ink,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",borderBottom:`1px solid ${C.parchment}`}}
                      onMouseEnter={e=>e.target.style.background=C.sandLight}
                      onMouseLeave={e=>e.target.style.background=C.white}>
                      {a}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <button onClick={()=>airportValid&&setStep(1)} disabled={!airportValid}
              style={{width:"100%",padding:"1rem",background:airportValid?C.terracotta:C.parchment,color:airportValid?C.white:C.muted,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:airportValid?"pointer":"default",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem"}}>
              Continue →
            </button>
          </>
        ):(
          <>
            <h3 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.75rem",fontWeight:600,color:C.espresso,margin:"0 0 0.25rem"}}>{currentQ.q}</h3>
            {currentQ.sub&&<p style={{fontSize:"0.84rem",color:C.muted,margin:"0 0 1.5rem",fontWeight:300}}>{currentQ.sub}</p>}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1rem",marginTop:currentQ.sub?"0":"1.5rem"}}>
              {currentQ.options.map(opt=>(
                <button key={opt.label} onClick={()=>pick(opt.value)}
                  onMouseEnter={e=>{e.currentTarget.style.borderColor=C.terracotta;e.currentTarget.style.background=C.parchment;}}
                  onMouseLeave={e=>{e.currentTarget.style.borderColor=C.border;e.currentTarget.style.background=C.white;}}
                  style={{padding:"1.1rem 1rem",background:C.white,border:`1.5px solid ${C.border}`,borderRadius:14,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left",transition:"all 0.15s"}}>
                  <div style={{fontSize:"1.6rem",marginBottom:"0.4rem"}}>{opt.emoji}</div>
                  <div style={{fontSize:"0.9rem",fontWeight:600,color:C.espresso}}>{opt.label}</div>
                  {opt.sub&&<div style={{fontSize:"0.72rem",color:C.muted,marginTop:2,fontWeight:300}}>{opt.sub}</div>}
                </button>
              ))}
            </div>
          </>
        )}

        <div style={{display:"flex",gap:"0.5rem",marginTop:"0.5rem"}}>
          {step>0&&<button onClick={()=>setStep(step-1)} style={{flex:1,padding:"0.85rem",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:12,fontSize:"0.88rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back</button>}
          <button onClick={onClose} style={{flex:1,padding:"0.85rem",background:"transparent",color:C.muted,border:"none",fontSize:"0.88rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

function HomeScreen({user,profile,trips,onGenerate,onDecide,onTripClick,loading,destImages=[]}){
  const[input,setInput]=useState("");
  const[focused,setFocused]=useState(false);
  const firstName=profile?.first_name||"there";
  const suggestions=[
    {label:"Weekend escape",text:"Romantic weekend in Europe, 2 people, budget around £1,000"},
    {label:"Group trip",text:"5 nights for 4 friends somewhere fun, £700 each"},
    {label:"Honeymoon",text:"Luxury honeymoon, 7 nights, no budget limit"},
    {label:"City break",text:"Quick city break for 2, under £600 total"},
  ];
  return(
    <div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
      <CyclingHeader images={destImages} minH="160px">
        <div style={{padding:"2rem 1.5rem 1.75rem"}}>
          <div style={{maxWidth:640,margin:"0 auto"}}>
            <ZirvoyLogo light/>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(1.8rem,5vw,2.4rem)",fontWeight:600,color:C.sand,margin:"0.85rem 0 0.25rem",lineHeight:1.15}}>
              Where to, {firstName}?
            </h1>
            <p style={{color:"rgba(242,232,217,0.5)",fontSize:"0.82rem",margin:0,fontWeight:300}}>
              Full AI trip plan in seconds.
            </p>
          </div>
        </div>
      </CyclingHeader>

      <div style={{maxWidth:640,margin:"0 auto",padding:"1.5rem 1.5rem"}}>
        {/* Primary CTA — guided flow */}
        <button onClick={onDecide} disabled={loading}
          style={{width:"100%",padding:"1.15rem",background:C.terracotta,color:C.white,border:"none",borderRadius:14,fontSize:"1rem",fontWeight:600,cursor:loading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"1.5rem",opacity:loading?0.5:1,display:"flex",alignItems:"center",justifyContent:"center",gap:"0.5rem",boxShadow:"0 4px 20px rgba(196,98,45,0.3)"}}>
          ✨ Help me plan my trip
        </button>

        {/* Freeform input — secondary */}
        <p style={{fontSize:"0.8rem",color:C.muted,margin:"0 0 0.65rem",fontWeight:300,lineHeight:1.5}}>Already know what kind of trip you want? Tell Zirvoy the vibe and let it plan for you.</p>
        <div style={{background:C.white,borderRadius:18,padding:"1.25rem",marginBottom:"1.5rem",boxShadow:"0 4px 24px rgba(28,20,16,0.07)",border:`1px solid ${C.border}`}}>
          <textarea value={input} onChange={e=>setInput(e.target.value)} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
            placeholder='"5 nights in Europe for 2, budget £1,500, we love good food and history"'
            rows={4} style={{width:"100%",background:C.sandLight,border:`1.5px solid ${focused?C.terracotta:C.border}`,borderRadius:10,padding:"1rem",fontSize:"0.93rem",color:C.ink,resize:"none",outline:"none",lineHeight:1.65,fontFamily:"'DM Sans',sans-serif",transition:"border-color 0.2s",boxSizing:"border-box"}}/>
          <button onClick={()=>input.trim()&&!loading&&onGenerate(input.trim())} disabled={!input.trim()||loading}
            style={{width:"100%",marginTop:"0.85rem",padding:"1rem",background:input.trim()&&!loading?C.espresso:C.parchment,color:input.trim()&&!loading?C.sand:C.muted,border:"none",borderRadius:10,fontSize:"0.93rem",fontWeight:600,cursor:input.trim()&&!loading?"pointer":"default",fontFamily:"'DM Sans',sans-serif",transition:"background 0.25s"}}>
            {loading?"Planning your trip…":"Plan My Trip →"}
          </button>
        </div>

        {/* Suggestion chips */}
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:"1rem"}}>
          <div style={{flex:1,height:1,background:C.border}}/>
          <span style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.14em",whiteSpace:"nowrap"}}>or try one of these</span>
          <div style={{flex:1,height:1,background:C.border}}/>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.65rem",marginBottom:"1.75rem"}}>
          {suggestions.map((s,i)=>(
            <button key={i} onClick={()=>!loading&&onGenerate(s.text)} disabled={loading}
              style={{padding:"0.9rem",borderRadius:12,border:`1px solid ${C.border}`,background:C.white,cursor:loading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",textAlign:"left"}}>
              <div style={{fontSize:"0.62rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.3rem"}}>{s.label}</div>
              <div style={{fontSize:"0.78rem",color:C.ink,lineHeight:1.45,fontWeight:300}}>{s.text}</div>
            </button>
          ))}
        </div>

        {/* Recent trips — horizontal scroll */}
        {trips.length>0&&(
          <div style={{marginBottom:"1rem"}}>
            <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",marginBottom:"0.75rem"}}>Recent Trips</p>
            <div style={{display:"flex",gap:"0.75rem",overflowX:"auto",paddingBottom:"0.5rem"}}>
              {trips.slice(0,5).map(t=>(
                <div key={t.id} onClick={()=>onTripClick(t)}
                  style={{flexShrink:0,width:155,background:C.white,borderRadius:14,border:`1px solid ${C.border}`,overflow:"hidden",cursor:"pointer",boxShadow:"0 2px 12px rgba(28,20,16,0.06)"}}>
                  {t.trip_data?.photo?(
                    <div style={{height:88,overflow:"hidden",position:"relative"}}>
                      <img src={t.trip_data.photo} alt={t.destination} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                      <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 30%,rgba(28,20,16,0.7) 100%)"}}/>
                      <p style={{position:"absolute",bottom:5,left:7,right:7,fontFamily:"'Cormorant Garamond',serif",fontSize:"0.95rem",fontWeight:600,color:C.sand,margin:0,lineHeight:1,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.destination}</p>
                    </div>
                  ):(
                    <div style={{height:88,background:`linear-gradient(135deg,${C.bark},${C.espresso})`,display:"flex",alignItems:"flex-end",padding:"6px 8px"}}>
                      <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"0.95rem",fontWeight:600,color:C.sand,margin:0,lineHeight:1}}>{t.destination}</p>
                    </div>
                  )}
                  <div style={{padding:"0.45rem 0.6rem"}}>
                    <p style={{fontSize:"0.67rem",color:C.muted,margin:0,fontWeight:300}}>{t.trip_data?.duration}n · £{fmt(t.trip_data?.budgetTotal)}</p>
                    {t.trip_data?.isBooked&&<p style={{fontSize:"0.62rem",color:C.terracotta,margin:"2px 0 0",fontWeight:600}}>✓ Booked</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ResultsScreen({trip:initialTrip,onNewTrip,onTryAgain,onLetsBook,onSaveTrip,isSaved,onShowStory,onPlanTrip,tripId}){
  const[trip,setTrip]=useState(initialTrip);
  const[activeDay,setActiveDay]=useState(0);
  const[imgLoaded,setImgLoaded]=useState(false);
  const[saving,setSaving]=useState(false);
  const[saved,setSaved]=useState(isSaved);
  const[dayImages,setDayImages]=useState({});
  const[copied,setCopied]=useState(false);
  const[tipLoading,setTipLoading]=useState(false);
  const[tipFresh,setTipFresh]=useState(false);
  const day=trip.itinerary?.[activeDay];
  const handleSave=async()=>{setSaving(true);await onSaveTrip();setSaved(true);setSaving(false);};
  const labels={flights:"Flights",hotel:"Hotel",food:"Food & Drink",activities:"Activities",misc:"Extras"};

  const refreshTip=async()=>{
    if(tipLoading)return;
    setTipLoading(true);setTipFresh(false);
    try{
      const r=await fetch("/api/tip",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({destination:trip.destination,country:trip.country})});
      const d=await r.json();
      if(d.tip){setTrip(t=>({...t,tip:d.tip}));setTipFresh(true);setTimeout(()=>setTipFresh(false),2500);}
    }catch(e){}
    finally{setTipLoading(false);}
  };

  const fetchDayImage=async(idx)=>{
    if(dayImages[idx]!==undefined)return;
    const d=trip.itinerary?.[idx];
    if(!d)return;
    const query=d.morning||d.title||trip.destination;
    try{
      const r=await fetch("/api/day-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({activity:query,destination:trip.destination})});
      const data=await r.json();
      setDayImages(prev=>({...prev,[idx]:data.imageUrl||null}));
    }catch(e){setDayImages(prev=>({...prev,[idx]:null}));}
  };

  // Auto-fetch day 1 image on load
  useEffect(()=>{if(trip.itinerary?.length>0)fetchDayImage(0);},[]);

  const handleDayClick=(i)=>{setActiveDay(i);if(dayImages[i]===undefined)fetchDayImage(i);};

  const shareUrl=tripId?`https://zirvoy.com/trip/${tripId}`:null;
  const shareText=shareUrl?`I'm going to ${trip.destination}! 🌍 ${trip.duration} nights planned with Zirvoy — ${shareUrl}`:`I'm going to ${trip.destination}! 🌍 ${trip.duration} nights planned with Zirvoy — zirvoy.com`;
  const shareWhatsApp=()=>{window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`,"_blank");};
  const copyShare=()=>{
    const fallback=()=>{
      try{const el=document.createElement("textarea");el.value=shareText;el.style.position="fixed";el.style.opacity="0";document.body.appendChild(el);el.select();document.execCommand("copy");document.body.removeChild(el);setCopied(true);setTimeout(()=>setCopied(false),2500);}catch(e){}
    };
    if(navigator.clipboard?.writeText){navigator.clipboard.writeText(shareText).then(()=>{setCopied(true);setTimeout(()=>setCopied(false),2500);}).catch(fallback);}else{fallback();}
  };

  return(
    <div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:80}}>
      {/* Hero */}
      <div style={{position:"relative",height:"min(340px,50vw)",minHeight:260,overflow:"hidden"}}>
        <img src={trip.photo} alt={trip.destination} onLoad={()=>setImgLoaded(true)} style={{width:"100%",height:"100%",objectFit:"cover",opacity:imgLoaded?1:0,transition:"opacity 0.8s",filter:"brightness(0.85)"}}/>
        <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.bark},${C.espresso})`,opacity:imgLoaded?0:1,transition:"opacity 0.8s"}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.2) 0%,rgba(28,20,16,0.85) 100%)"}}/>
        <div style={{position:"absolute",top:"1.25rem",left:"clamp(1.25rem,5vw,2rem)"}}><ZirvoyLogo light size="sm"/></div>
        {trip.storySlides?.length>0&&onShowStory&&(
          <button onClick={onShowStory} style={{position:"absolute",top:"1.25rem",right:"clamp(1.25rem,5vw,2rem)",background:"rgba(28,20,16,0.5)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.25)",color:C.sand,padding:"0.3rem 0.75rem",borderRadius:20,fontSize:"0.72rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"0.35rem"}}>▶ Story</button>
        )}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem clamp(1.25rem,5vw,2rem)"}}>
          <p style={{fontSize:"0.65rem",fontWeight:600,color:C.terra2,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.3rem"}}>{trip.country}</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.2rem,7vw,3.2rem)",fontWeight:600,color:C.sand,margin:"0 0 0.5rem",lineHeight:1}}>{trip.destination}</h2>
          <p style={{fontSize:"0.82rem",color:"rgba(242,232,217,0.72)",margin:"0 0 1rem",lineHeight:1.55,fontWeight:300,maxWidth:480}}>{trip.tagline}</p>
          <div style={{display:"flex",gap:"0.45rem",flexWrap:"wrap"}}>
            {[`${trip.travellers} travellers`,`${trip.duration} nights`,`£${fmt(trip.budgetTotal)} total`].map(t=>(<span key={t} style={{background:"rgba(242,232,217,0.12)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.2)",padding:"0.28rem 0.75rem",borderRadius:20,fontSize:"0.72rem",fontWeight:500,color:C.sand}}>{t}</span>))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"1.25rem clamp(1.25rem,5vw,2rem) 3rem"}}>
        {/* (Story button now in hero corner) */}

        {/* Primary CTA */}
        <button onClick={onLetsBook} style={{width:"100%",padding:"1.05rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.95rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.5rem"}}>Let's Book This Trip →</button>

        {/* Secondary row: save + share */}
        <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.65rem"}}>
          <button onClick={saved?undefined:handleSave} disabled={saved||saving} style={{flex:1,padding:"0.8rem",background:saved?C.parchment:C.white,color:saved?C.muted:C.espresso,border:`1.5px solid ${saved?C.border:C.espresso}`,borderRadius:10,fontSize:"0.82rem",fontWeight:500,cursor:saved?"default":"pointer",fontFamily:"'DM Sans',sans-serif"}}>{saving?"Saving…":saved?"✓ Saved":"Save trip"}</button>
          <button onClick={shareWhatsApp} style={{padding:"0.8rem 1rem",background:"#25D366",color:C.white,border:"none",borderRadius:10,fontSize:"0.82rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>WhatsApp</button>
          <button onClick={copyShare} style={{padding:"0.8rem 1rem",background:copied?C.terracotta:C.white,color:copied?C.white:C.espresso,border:`1.5px solid ${copied?C.terracotta:C.border}`,borderRadius:10,fontSize:"0.82rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{copied?"✓":"Copy"}</button>
        </div>

        {/* Try again — subtle link */}
        <button onClick={onTryAgain} style={{width:"100%",padding:"0.5rem",background:"transparent",color:C.muted,border:"none",fontSize:"0.82rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.75rem"}}>Not quite right? Tell Zirvoy what to change →</button>

        {/* Budget */}
        <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}><div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Estimated Budget</p></div>
          <div style={{background:C.sandLight,borderRadius:8,padding:"0.6rem 0.85rem",marginBottom:"1rem",fontSize:"0.72rem",color:C.muted,lineHeight:1.5}}>Prices are estimates based on typical costs — always check live prices before booking.</div>
          <div style={{display:"flex",justifyContent:"space-around",paddingBottom:"1.25rem",marginBottom:"1.25rem",borderBottom:`1px solid ${C.parchment}`}}>
            {[["£"+fmt(trip.budgetTotal),"Est. Total"],["£"+fmt(trip.budgetPerPerson),"Per person"]].map(([val,lbl])=>(<div key={lbl} style={{textAlign:"center"}}><div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.85rem",fontWeight:600,color:C.espresso}}>{val}</div><div style={{fontSize:"0.65rem",color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginTop:2}}>{lbl}</div></div>))}
          </div>
          {Object.entries(trip.breakdown||{}).map(([k,v])=>{const pct=Math.round((v/trip.budgetTotal)*100);return(<div key={k} style={{marginBottom:"0.8rem"}}><div style={{display:"flex",justifyContent:"space-between",fontSize:"0.82rem",marginBottom:"0.35rem"}}><span style={{color:C.ink}}>{labels[k]||k}</span><span style={{fontWeight:600,color:C.espresso}}>£{fmt(v)}</span></div><div style={{height:3,background:C.parchment,borderRadius:3}}><div style={{height:"100%",width:`${pct}%`,background:`linear-gradient(90deg,${C.terracotta},${C.gold})`,borderRadius:3}}/></div></div>);})}
        </div>

        {/* Flights + Hotel */}
        <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
          <div style={{paddingBottom:"1rem",marginBottom:"1rem",borderBottom:`1px solid ${C.parchment}`}}><p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.5rem"}}>✈  Flights</p><p style={{margin:0,fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.flights}</p></div>
          <div><p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.5rem"}}>🏨  Where to Stay</p><p style={{margin:0,fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.hotel}</p></div>
        </div>

        {/* Insider tip */}
        <div style={{background:tipFresh?"#2a1a0e":C.espresso,borderRadius:18,padding:"1.4rem 1.5rem",marginBottom:"1rem",position:"relative",overflow:"hidden",transition:"background 0.4s ease"}}>
          <div style={{position:"absolute",top:-25,right:-25,width:120,height:120,borderRadius:"50%",border:"1px solid rgba(196,98,45,0.18)"}}/>
          <div style={{position:"absolute",top:8,right:10,opacity:0.1}}><ZirvoyMark size={52} color={C.terracotta}/></div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:7,marginBottom:"0.65rem"}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><div style={{width:3,height:12,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.65rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em",margin:0}}>Zirvoy Insider Tip</p></div>
            <button onClick={refreshTip} disabled={tipLoading} style={{background:tipFresh?"rgba(100,200,100,0.2)":"rgba(196,98,45,0.18)",border:`1px solid ${tipFresh?"rgba(100,200,100,0.4)":"rgba(196,98,45,0.3)"}`,color:tipFresh?"#7ecf7e":C.terra2,padding:"0.25rem 0.65rem",borderRadius:20,fontSize:"0.68rem",fontWeight:500,cursor:tipLoading?"default":"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.3s"}}>{tipLoading?"…":tipFresh?"✓ Updated":"↻ New tip"}</button>
          </div>
          <p key={trip.tip} style={{margin:0,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",color:C.sand,lineHeight:1.8,fontStyle:"italic",transition:"opacity 0.3s"}}>{trip.tip}</p>
        </div>

        {/* Weather */}
        {trip.weather&&(
          <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}><div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>🌤  Weather Guide</p></div>
            <p style={{margin:"0 0 1rem",fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.weather.insight}</p>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"0.6rem"}}>
              {[["✅ Best time",trip.weather.bestMonths],["🌡 Temperature",trip.weather.tempRange],["📈 Peak season",trip.weather.peakSeason],trip.weather.avoidMonths&&["⚠️ Avoid",trip.weather.avoidMonths]].filter(Boolean).map(([label,val])=>(<div key={label} style={{background:C.sandLight,borderRadius:10,padding:"0.75rem 0.85rem"}}><div style={{fontSize:"0.62rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:"0.3rem"}}>{label}</div><div style={{fontSize:"0.82rem",fontWeight:500,color:C.espresso}}>{val}</div></div>))}
            </div>
          </div>
        )}

        {/* Itinerary with day images */}
        {trip.itinerary?.length>0&&(
          <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:"1.25rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
            <div style={{padding:"1.35rem 1.35rem 0"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}><div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Your Itinerary</p></div>
              <div style={{display:"flex",gap:"0.4rem",overflowX:"auto",paddingBottom:"1rem"}}>
                {trip.itinerary.map((d,i)=>(
                  <button key={i} onClick={()=>handleDayClick(i)}
                    style={{flexShrink:0,padding:"0.38rem 1rem",borderRadius:20,border:`1.5px solid ${activeDay===i?C.terracotta:C.border}`,background:activeDay===i?C.terracotta:"transparent",color:activeDay===i?C.white:C.muted,cursor:"pointer",fontSize:"0.76rem",fontWeight:500,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
                    Day {d.day}
                  </button>
                ))}
              </div>
            </div>
            {day&&(
              <div style={{borderTop:`1px solid ${C.parchment}`}}>
                {/* Day image */}
                {dayImages[activeDay]&&(
                  <div style={{height:160,overflow:"hidden",position:"relative"}}>
                    <img src={dayImages[activeDay]} alt={day.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(28,20,16,0.75) 100%)"}}/>
                    <h4 style={{position:"absolute",bottom:12,left:16,right:16,fontFamily:"'Cormorant Garamond',serif",margin:0,fontSize:"1.3rem",fontWeight:600,color:C.sand,lineHeight:1.1}}>{day.title}</h4>
                  </div>
                )}
                <div style={{padding:"1.35rem"}}>
                  {!dayImages[activeDay]&&<h4 style={{fontFamily:"'Cormorant Garamond',serif",margin:"0 0 1.1rem",fontSize:"1.2rem",fontWeight:600,color:C.espresso}}>{day.title}</h4>}
                  {[["Morning",day.morning],["Afternoon",day.afternoon],["Evening",day.evening]].map(([label,text])=>(
                    <div key={label} style={{display:"flex",gap:"1rem",marginBottom:"1rem",alignItems:"flex-start"}}>
                      <span style={{flexShrink:0,fontSize:"0.6rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:"0.2rem",minWidth:64}}>{label}</span>
                      <p style={{margin:0,fontSize:"0.86rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button onClick={onNewTrip} style={{width:"100%",padding:"1rem",background:"transparent",color:C.muted,border:`1px solid ${C.border}`,borderRadius:14,fontSize:"0.88rem",fontWeight:500,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"0.75rem"}}>Plan Another Trip</button>
      </div>
    </div>
  );
}

function ItineraryBuilder({trip,onItineraryChange}){
  const[messages,setMessages]=useState([]);
  const[input,setInput]=useState("");
  const[loading,setLoading]=useState(false);
  const[applying,setApplying]=useState(null);
  const chips=[
    {e:"🚗",l:"Do I need a car?"},
    {e:"✈",l:"Getting from the airport?"},
    {e:"🍽",l:"Best restaurants?"},
    {e:"💎",l:"Hidden gems?"},
    {e:"🎒",l:"What to pack?"},
    {e:"🛡",l:"Is it safe?"},
    {e:"💶",l:"Do I need cash?"},
    {e:"🗺",l:"Best day trips?"},
  ];
  const actionConfig={
    itinerary:null, // handled separately via applyChange
    car_hire:{label:"Search car hire →",emoji:"🚗",url:()=>`https://www.rentalcars.com/search?location=${encodeURIComponent(trip.destination)}`},
    activities:{label:"Browse activities →",emoji:"🎯",url:()=>`https://www.getyourguide.com/s/?q=${encodeURIComponent(trip.destination)}`},
    restaurants:{label:"Find restaurants →",emoji:"🍽",url:()=>`https://www.tripadvisor.co.uk/Search?q=${encodeURIComponent(trip.destination+" restaurants")}`},
    flights:{label:"Search flights →",emoji:"✈",url:()=>`https://www.skyscanner.net/transport/flights-from/gb/?query=${encodeURIComponent(trip.destination)}`},
  };
  const send=async(text)=>{
    if(!text.trim()||loading)return;
    const newMsgs=[...messages,{role:"user",content:text}];
    setMessages(newMsgs);
    setInput("");
    setLoading(true);
    try{
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,trip,history:messages.slice(-8)})});
      const d=await r.json();
      if(d.reply)setMessages(m=>[...m,{role:"assistant",content:d.reply,action:d.action||null,instruction:text}]);
    }catch(e){setMessages(m=>[...m,{role:"assistant",content:"Sorry, I couldn't get a response right now."}]);}
    finally{setLoading(false);}
  };
  const applyChange=async(instruction,msgIdx)=>{
    setApplying(msgIdx);
    try{
      const r=await fetch("/api/refine",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({trip,instructions:instruction})});
      const d=await r.json();
      if(d.itinerary){
        const updated={...trip,itinerary:d.itinerary};
        onItineraryChange&&onItineraryChange(updated);
        try{
          const{data:saved}=await supabase.from("trips").select("id").eq("destination",trip.destination).order("created_at",{ascending:false}).limit(1);
          if(saved?.[0]?.id)await supabase.from("trips").update({trip_data:updated}).eq("id",saved[0].id);
        }catch(e){}
        setMessages(m=>[...m,{role:"assistant",content:"✅ Done! I've updated your itinerary."}]);
      }
    }catch(e){setMessages(m=>[...m,{role:"assistant",content:"Couldn't apply that change right now."}]);}
    finally{setApplying(null);}
  };
  return(
    <div>
      {messages.length===0&&(
        <p style={{fontSize:"0.78rem",color:C.muted,margin:"0 0 0.65rem",fontWeight:300}}>Ask about {trip.destination}, or say what you want to change:</p>
      )}
      {messages.length>0&&(
        <div style={{maxHeight:300,overflowY:"auto",marginBottom:"0.75rem",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
          {messages.map((m,i)=>{
            const cfg=m.action&&m.action!=="itinerary"?actionConfig[m.action]:null;
            return(
            <div key={i}>
              <div style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                <div style={{maxWidth:"82%",padding:"0.65rem 0.9rem",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?C.terracotta:C.sandLight,color:m.role==="user"?C.white:C.ink,fontSize:"0.85rem",lineHeight:1.55,fontWeight:300}}>
                  {m.content}
                </div>
              </div>
              {m.role==="assistant"&&!m.content.startsWith("✅")&&(
                <div style={{display:"flex",justifyContent:"flex-start",marginTop:"0.35rem",gap:"0.4rem",flexWrap:"wrap"}}>
                  {m.action==="itinerary"&&(
                    <button onClick={()=>applyChange(m.instruction,i)} disabled={applying!==null}
                      style={{padding:"0.35rem 0.85rem",background:applying===i?"rgba(196,98,45,0.15)":C.white,border:`1.5px solid ${C.terracotta}`,borderRadius:20,fontSize:"0.75rem",color:C.terracotta,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                      {applying===i?"Updating…":"Apply to my itinerary →"}
                    </button>
                  )}
                  {cfg&&(
                    <a href={cfg.url()} target="_blank" rel="noopener noreferrer"
                      style={{padding:"0.35rem 0.85rem",background:C.espresso,border:"none",borderRadius:20,fontSize:"0.75rem",color:C.sand,fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",textDecoration:"none",display:"inline-flex",alignItems:"center",gap:"0.3rem"}}>
                      {cfg.emoji} {cfg.label}
                    </a>
                  )}
                </div>
              )}
            </div>
            );
          })}
          {loading&&(
            <div style={{display:"flex",justifyContent:"flex-start"}}>
              <div style={{padding:"0.65rem 0.9rem",borderRadius:"16px 16px 16px 4px",background:C.sandLight}}>
                <span style={{fontSize:"0.85rem",color:C.muted}}>…</span>
              </div>
            </div>
          )}
        </div>
      )}
      <div style={{display:"flex",gap:"0.5rem",marginBottom:"0.6rem"}}>
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
          placeholder={`Ask about ${trip.destination} or request a change…`}
          style={{flex:1,padding:"0.65rem 0.9rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:"0.88rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
        <button onClick={()=>send(input)} disabled={!input.trim()||loading}
          style={{padding:"0.65rem 1rem",background:input.trim()&&!loading?C.terracotta:C.parchment,color:input.trim()&&!loading?C.white:C.muted,border:"none",borderRadius:10,fontSize:"0.88rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
          →
        </button>
      </div>
      <div style={{display:"flex",gap:"0.4rem",overflowX:"auto",paddingBottom:"0.2rem",WebkitOverflowScrolling:"touch"}}>
        {chips.map(c=>(
          <button key={c.l} onClick={()=>send(c.l)} disabled={loading}
            style={{padding:"0.3rem 0.75rem",background:C.sandLight,border:`1px solid ${C.border}`,borderRadius:20,fontSize:"0.75rem",color:C.espresso,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:"0.3rem",whiteSpace:"nowrap",flexShrink:0,opacity:loading?0.5:1}}>
            {c.e} {c.l}
          </button>
        ))}
      </div>
    </div>
  );
}

function TripSummaryScreen({trip:initialTrip,onBack,onBook,onTripUpdate}){
  const[trip,setTrip]=useState(initialTrip);
  const[activeDay,setActiveDay]=useState(0);
  const[dayImages,setDayImages]=useState({});
  const[flightNumber,setFlightNumber]=useState(trip.flightNumber||"");
  const[arrivalTime,setArrivalTime]=useState(trip.arrivalTime||"");
  const[departureTime,setDepartureTime]=useState(trip.departureTime||"");
  const[showFlightEdit,setShowFlightEdit]=useState(false);
  const[savingFlight,setSavingFlight]=useState(false);
  const[expandedTile,setExpandedTile]=useState(null);
  const day=trip.itinerary?.[activeDay];

  const fetchDayImg=async(idx)=>{
    if(dayImages[idx]!==undefined)return;
    const d=trip.itinerary?.[idx];
    if(!d)return;
    const query=d.morning||d.title||trip.destination;
    try{
      const r=await fetch("/api/day-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({activity:query,destination:trip.destination})});
      const data=await r.json();
      setDayImages(prev=>({...prev,[idx]:data.imageUrl||null}));
    }catch(e){setDayImages(prev=>({...prev,[idx]:null}));}
  };

  useEffect(()=>{if(trip.itinerary?.length>0)fetchDayImg(0);},[]);

  const handleDayClick=(i)=>{setActiveDay(i);if(dayImages[i]===undefined)fetchDayImg(i);};

  const handleItineraryChange=(updated)=>{
    setTrip(updated);
    onTripUpdate&&onTripUpdate(updated);
  };

  const saveFlightDetails=async()=>{
    setSavingFlight(true);
    const updated={...trip,flightNumber,arrivalTime,departureTime};
    try{
      const{data:saved}=await supabase.from("trips").select("id").eq("destination",trip.destination).order("created_at",{ascending:false}).limit(1);
      if(saved?.[0]?.id)await supabase.from("trips").update({trip_data:updated}).eq("id",saved[0].id);
      setTrip(updated);
      onTripUpdate&&onTripUpdate(updated);
      setShowFlightEdit(false);
    }catch(e){}
    finally{setSavingFlight(false);}
  };

  const buildTransfersUrl=()=>`https://www.welcomepickups.com/${encodeURIComponent(trip.destination.toLowerCase().replace(/\s+/g,'-'))}/`;
  const buildGYGUrl=()=>`https://www.getyourguide.com/s/?q=${encodeURIComponent(trip.destination)}&currency=GBP`;
  const buildRestaurantsUrl=()=>`https://www.tripadvisor.co.uk/Search?q=${encodeURIComponent(trip.destination+"+restaurants")}`;

  return(
    <div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif",paddingBottom:100}}>
      {/* Hero */}
      <div style={{position:"relative",height:"min(280px,45vw)",minHeight:220,overflow:"hidden"}}>
        {trip.photo&&<img src={trip.photo} alt={trip.destination} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.78)"}}/>}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.bark},${C.espresso})`,opacity:trip.photo?0:1}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.3) 0%,rgba(28,20,16,0.85) 100%)"}}/>
        <button onClick={onBack} style={{position:"absolute",top:"1.25rem",left:"clamp(1.25rem,5vw,2rem)",background:"rgba(28,20,16,0.4)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.2)",color:C.sand,padding:"0.3rem 0.75rem",borderRadius:20,fontSize:"0.75rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Back</button>
        {trip.isBooked&&<div style={{position:"absolute",top:"1.25rem",right:"clamp(1.25rem,5vw,2rem)",background:"rgba(196,98,45,0.85)",color:C.white,padding:"0.3rem 0.75rem",borderRadius:20,fontSize:"0.72rem",fontWeight:600,fontFamily:"'DM Sans',sans-serif"}}>✈ Booked</div>}
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.25rem clamp(1.25rem,5vw,2rem)"}}>
          <p style={{fontSize:"0.62rem",fontWeight:600,color:C.terra2,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.25rem"}}>{trip.country}</p>
          <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2rem,7vw,2.8rem)",fontWeight:600,color:C.sand,margin:"0 0 0.4rem",lineHeight:1}}>{trip.destination}</h2>
          <div style={{display:"flex",gap:"0.4rem",flexWrap:"wrap"}}>
            {[`${trip.duration} nights`,`${trip.travellers} travellers`,trip.departDate&&`Departs ${trip.departDate}`].filter(Boolean).map(t=>(<span key={t} style={{background:"rgba(242,232,217,0.12)",border:"1px solid rgba(242,232,217,0.2)",padding:"0.25rem 0.65rem",borderRadius:20,fontSize:"0.7rem",color:C.sand,fontFamily:"'DM Sans',sans-serif"}}>{t}</span>))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"1.25rem 1.5rem"}}>

        {/* Booking status chips */}
        <div style={{display:"flex",gap:"0.45rem",flexWrap:"wrap",marginBottom:"1rem"}}>
          {[
            {label:"Flights",done:!!(trip.isBooked||trip.departDate),icon:"✈"},
            {label:"Hotel",done:!!trip.isBooked,icon:"🏨"},
            {label:"Transfers",done:!!trip.transfersBooked,icon:"🚗"},
            {label:"Activities",done:!!trip.activitiesBooked,icon:"🎭"},
          ].map(({label,done,icon})=>(
            <div key={label} style={{display:"flex",alignItems:"center",gap:5,padding:"0.35rem 0.85rem",borderRadius:20,background:done?"#e8f5e9":"rgba(28,20,16,0.05)",border:`1.5px solid ${done?"#a5d6a7":C.border}`}}>
              <span style={{fontSize:"0.78rem"}}>{icon}</span>
              <span style={{fontSize:"0.72rem",fontWeight:600,color:done?"#2e7d32":C.muted}}>{label}{done?" ✓":""}</span>
            </div>
          ))}
        </div>

        {/* Book trip CTA if not booked */}
        {!trip.isBooked&&onBook&&(
          <button onClick={onBook} style={{width:"100%",padding:"1rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.92rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",marginBottom:"1rem"}}>Let's Book This Trip →</button>
        )}

        {/* Flight details card */}
        <div style={{background:C.white,borderRadius:16,border:`1px solid ${C.border}`,padding:"1.1rem 1.25rem",marginBottom:"1rem",boxShadow:"0 2px 12px rgba(28,20,16,0.05)"}}>
          <p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.14em",margin:"0 0 0.75rem"}}>✈ Flight details</p>
          {(trip.departureTime||trip.arrivalTime||trip.flightNumber)?(
            <div style={{display:"flex",flexDirection:"column",gap:"0.45rem"}}>
              {trip.flightNumber&&<div style={{fontSize:"0.85rem",color:C.ink,fontWeight:500}}>Flight {trip.flightNumber}</div>}
              <div style={{display:"flex",gap:"1.5rem",flexWrap:"wrap"}}>
                {trip.departureTime&&<div><div style={{fontSize:"0.6rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Departs</div><div style={{fontSize:"1rem",fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:C.espresso}}>{trip.departureTime}</div></div>}
                {trip.arrivalTime&&<div><div style={{fontSize:"0.6rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Arrives</div><div style={{fontSize:"1rem",fontWeight:600,fontFamily:"'Cormorant Garamond',serif",color:C.espresso}}>{trip.arrivalTime}</div></div>}
                {trip.arrivalTime&&<div><div style={{fontSize:"0.6rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:2}}>Transfer</div><div style={{fontSize:"0.82rem",fontWeight:400,color:C.ink}}>~45–60 min</div></div>}
              </div>
              <button onClick={()=>setShowFlightEdit(s=>!s)} style={{fontSize:"0.75rem",color:C.terracotta,background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontWeight:500,padding:0,alignSelf:"flex-start"}}>Edit details</button>
            </div>
          ):(
            <div>
              <p style={{margin:"0 0 0.65rem",fontSize:"0.85rem",color:C.muted,lineHeight:1.55,fontWeight:300}}>Add your flight times and Zirvoy will optimise your Day 1 itinerary around your schedule.</p>
              <button onClick={()=>setShowFlightEdit(true)} style={{fontSize:"0.8rem",fontWeight:600,color:C.terracotta,background:"transparent",border:`1.5px solid ${C.terracotta}`,borderRadius:8,padding:"0.45rem 1rem",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>+ Add flight details</button>
            </div>
          )}
          {showFlightEdit&&(
            <div style={{marginTop:"0.85rem",display:"flex",flexDirection:"column",gap:"0.5rem"}}>
              <input value={flightNumber} onChange={e=>setFlightNumber(e.target.value)} placeholder="Flight number e.g. EZY1234"
                style={{padding:"0.6rem 0.85rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:"0.85rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
              <div style={{display:"flex",gap:"0.5rem"}}>
                <input value={departureTime} onChange={e=>setDepartureTime(e.target.value)} placeholder="Departs e.g. 07:15"
                  style={{flex:1,padding:"0.6rem 0.85rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:"0.85rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
                <input value={arrivalTime} onChange={e=>setArrivalTime(e.target.value)} placeholder="Arrives e.g. 11:45"
                  style={{flex:1,padding:"0.6rem 0.85rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:8,fontSize:"0.85rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
              </div>
              <button onClick={saveFlightDetails} disabled={savingFlight}
                style={{padding:"0.6rem 1rem",background:C.terracotta,color:C.white,border:"none",borderRadius:8,fontSize:"0.82rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",alignSelf:"flex-start"}}>
                {savingFlight?"Saving…":"Save"}
              </button>
            </div>
          )}
        </div>

        {/* Day-by-day itinerary */}
        {trip.itinerary?.length>0&&(
          <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
            <div style={{padding:"1.25rem 1.25rem 0"}}>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}><div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/><p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Your Itinerary</p></div>
              <div style={{display:"flex",gap:"0.4rem",overflowX:"auto",paddingBottom:"1rem"}}>
                {trip.itinerary.map((d,i)=>(
                  <button key={i} onClick={()=>handleDayClick(i)}
                    style={{flexShrink:0,padding:"0.38rem 1rem",borderRadius:20,border:`1.5px solid ${activeDay===i?C.terracotta:C.border}`,background:activeDay===i?C.terracotta:"transparent",color:activeDay===i?C.white:C.muted,cursor:"pointer",fontSize:"0.76rem",fontWeight:500,fontFamily:"'DM Sans',sans-serif",transition:"all 0.2s"}}>
                    Day {d.day}
                  </button>
                ))}
              </div>
            </div>
            {day&&(
              <div style={{borderTop:`1px solid ${C.parchment}`}}>
                {dayImages[activeDay]&&(
                  <div style={{height:150,overflow:"hidden",position:"relative"}}>
                    <img src={dayImages[activeDay]} alt={day.title} style={{width:"100%",height:"100%",objectFit:"cover"}}/>
                    <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,transparent 40%,rgba(28,20,16,0.75) 100%)"}}/>
                    <h4 style={{position:"absolute",bottom:12,left:16,right:16,fontFamily:"'Cormorant Garamond',serif",margin:0,fontSize:"1.2rem",fontWeight:600,color:C.sand,lineHeight:1.1}}>{day.title}</h4>
                  </div>
                )}
                <div style={{padding:"1.25rem"}}>
                  {!dayImages[activeDay]&&<h4 style={{fontFamily:"'Cormorant Garamond',serif",margin:"0 0 1rem",fontSize:"1.2rem",fontWeight:600,color:C.espresso}}>{day.title}</h4>}
                  {[["Morning",day.morning],["Afternoon",day.afternoon],["Evening",day.evening]].map(([label,text])=>(
                    <div key={label} style={{display:"flex",gap:"1rem",marginBottom:"0.85rem",alignItems:"flex-start"}}>
                      <span style={{flexShrink:0,fontSize:"0.6rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.12em",marginTop:"0.2rem",minWidth:64}}>{label}</span>
                      <p style={{margin:0,fontSize:"0.85rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{text}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Itinerary Builder */}
        <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.25rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}>
            <div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/>
            <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Plan your trip · Ask Zirvoy anything</p>
          </div>
          <ItineraryBuilder trip={trip} onItineraryChange={handleItineraryChange}/>
        </div>

        {/* Also worth sorting — expandable tiles */}
        <p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.14em",margin:"0 0 0.65rem"}}>Also worth sorting</p>
        <div style={{display:"flex",flexDirection:"column",gap:"0.65rem",marginBottom:"1rem"}}>
          {[
            {
              id:"transfers",icon:"🚗",title:"Transfers",sub:"Airport to hotel",
              desc:`Pre-booking your airport transfer means no hassle when you land in ${trip.destination}. Welcome Pickups offers fixed-price transfers with meet-and-greet.`,
              cta:"Browse transfers",url:buildTransfersUrl()
            },
            {
              id:"activities",icon:"🎭",title:"Activities",sub:"Tours & experiences",
              desc:`From day trips to skip-the-line tickets, GetYourGuide has thousands of things to do in ${trip.destination}. Book in advance for popular experiences.`,
              cta:"Explore activities",url:buildGYGUrl()
            },
            {
              id:"restaurants",icon:"🍽",title:"Restaurants",sub:"Where to eat",
              desc:`Find the best restaurants in ${trip.destination} on TripAdvisor — filter by cuisine, price, and neighbourhoods. Great for planning where to eat each evening.`,
              cta:"Find restaurants",url:buildRestaurantsUrl()
            },
          ].map(tile=>{
            const open=expandedTile===tile.id;
            return(
              <div key={tile.id} style={{background:C.white,border:`1.5px solid ${open?C.terracotta:C.border}`,borderRadius:16,overflow:"hidden",transition:"border-color 0.2s"}}>
                <button onClick={()=>setExpandedTile(open?null:tile.id)}
                  style={{width:"100%",padding:"0.9rem 1rem",background:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <span style={{fontSize:"1.3rem"}}>{tile.icon}</span>
                    <div style={{textAlign:"left"}}>
                      <div style={{fontSize:"0.88rem",fontWeight:600,color:C.espresso}}>{tile.title}</div>
                      <div style={{fontSize:"0.7rem",color:C.muted,marginTop:1,fontWeight:300}}>{tile.sub}</div>
                    </div>
                  </div>
                  <span style={{fontSize:"0.75rem",color:C.muted,transform:open?"rotate(180deg)":"none",transition:"transform 0.2s",display:"inline-block"}}>▼</span>
                </button>
                {open&&(
                  <div style={{padding:"0 1rem 1rem"}}>
                    <p style={{margin:"0 0 0.85rem",fontSize:"0.83rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{tile.desc}</p>
                    <a href={tile.url} target="_blank" rel="noopener noreferrer"
                      style={{display:"inline-block",padding:"0.55rem 1.1rem",background:C.terracotta,color:C.white,borderRadius:8,fontSize:"0.8rem",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif"}}>
                      {tile.cta} ↗
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function TripChat({trip}){
  const[open,setOpen]=useState(false);
  const[messages,setMessages]=useState([]);
  const[input,setInput]=useState("");
  const[chatLoading,setChatLoading]=useState(false);
  const chips=["Best restaurants?","What's the weather like?","Safety tips?","What to pack?","Local transport?","Hidden gems?"];
  const send=async(text)=>{
    if(!text.trim()||chatLoading)return;
    const userMsg={role:"user",content:text};
    const newMsgs=[...messages,userMsg];
    setMessages(newMsgs);
    setInput("");
    setChatLoading(true);
    try{
      const r=await fetch("/api/chat",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({message:text,trip,history:messages.slice(-8)})});
      const d=await r.json();
      if(d.reply)setMessages(m=>[...m,{role:"assistant",content:d.reply}]);
    }catch(e){setMessages(m=>[...m,{role:"assistant",content:"Sorry, couldn't get a response right now."}]);}
    finally{setChatLoading(false);}
  };
  return(
    <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,overflow:"hidden",marginBottom:"1.25rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
      <button onClick={()=>setOpen(o=>!o)}
        style={{width:"100%",padding:"1.1rem 1.35rem",background:"transparent",border:"none",display:"flex",alignItems:"center",justifyContent:"space-between",cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/>
          <span style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em"}}>Ask anything about {trip.destination}</span>
        </div>
        <span style={{color:C.terracotta,fontSize:"0.9rem",display:"inline-block",transform:open?"rotate(180deg)":"none",transition:"transform 0.2s"}}>▾</span>
      </button>
      {open&&(
        <div style={{borderTop:`1px solid ${C.parchment}`,padding:"1rem 1.35rem 1.35rem"}}>
          {messages.length===0&&(
            <div style={{marginBottom:"1rem"}}>
              <p style={{fontSize:"0.8rem",color:C.muted,margin:"0 0 0.65rem",fontWeight:300}}>Quick questions:</p>
              <div style={{display:"flex",flexWrap:"wrap",gap:"0.4rem"}}>
                {chips.map(c=>(
                  <button key={c} onClick={()=>send(c)}
                    style={{padding:"0.35rem 0.8rem",background:C.sandLight,border:`1px solid ${C.border}`,borderRadius:20,fontSize:"0.78rem",color:C.espresso,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}
          {messages.length>0&&(
            <div style={{maxHeight:280,overflowY:"auto",marginBottom:"0.75rem",display:"flex",flexDirection:"column",gap:"0.65rem"}}>
              {messages.map((m,i)=>(
                <div key={i} style={{display:"flex",justifyContent:m.role==="user"?"flex-end":"flex-start"}}>
                  <div style={{maxWidth:"82%",padding:"0.65rem 0.9rem",borderRadius:m.role==="user"?"16px 16px 4px 16px":"16px 16px 16px 4px",background:m.role==="user"?C.terracotta:C.sandLight,color:m.role==="user"?C.white:C.ink,fontSize:"0.85rem",lineHeight:1.55,fontWeight:300}}>
                    {m.content}
                  </div>
                </div>
              ))}
              {chatLoading&&(
                <div style={{display:"flex",justifyContent:"flex-start"}}>
                  <div style={{padding:"0.65rem 0.9rem",borderRadius:"16px 16px 16px 4px",background:C.sandLight}}>
                    <span style={{fontSize:"0.85rem",color:C.muted}}>…</span>
                  </div>
                </div>
              )}
            </div>
          )}
          <div style={{display:"flex",gap:"0.5rem"}}>
            <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==="Enter"&&send(input)}
              placeholder={`Ask about ${trip.destination}…`}
              style={{flex:1,padding:"0.65rem 0.9rem",background:C.sandLight,border:`1.5px solid ${C.border}`,borderRadius:10,fontSize:"0.88rem",color:C.ink,outline:"none",fontFamily:"'DM Sans',sans-serif"}}/>
            <button onClick={()=>send(input)} disabled={!input.trim()||chatLoading}
              style={{padding:"0.65rem 1rem",background:input.trim()&&!chatLoading?C.terracotta:C.parchment,color:input.trim()&&!chatLoading?C.white:C.muted,border:"none",borderRadius:10,fontSize:"0.88rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>
              →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const[savedTripId,setSavedTripId]=useState(null);
  const[loading,setLoading]=useState(false);
  const[error,setError]=useState(null);
  const[originalRequest,setOriginalRequest]=useState("");
  const[showRefine,setShowRefine]=useState(false);
  const[showStory,setShowStory]=useState(false);
  const[showBooking,setShowBooking]=useState(false);
  const[saveError,setSaveError]=useState(null);
  const[showDecide,setShowDecide]=useState(false);
  const[pendingDecide,setPendingDecide]=useState(false);
  const[destImages,setDestImages]=useState([]);
  const[showSummary,setShowSummary]=useState(false);
  const[showAuthPrompt,setShowAuthPrompt]=useState(false);
  const[authPromptAction,setAuthPromptAction]=useState(null);
  const[showReveal,setShowReveal]=useState(false);

  useEffect(()=>{fetch("/api/destinations").then(r=>r.json()).then(d=>{if(d.photos?.length)setDestImages(d.photos.map(p=>p.url));}).catch(()=>{});},[]);

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
      const{data:inserted,error:insertError}=await supabase.from("trips").insert({
        user_id:userId,
        destination:tripData.destination,
        country:tripData.country,
        trip_data:tripData,
      }).select().single();
      if(insertError){console.error("Save error:",insertError);setSaveError(insertError.message||"Failed to save trip");return false;}
      if(inserted?.id)setSavedTripId(inserted.id);
      await loadUserData(userId);
      return true;
    }catch(e){console.error("Save failed:",e);return false;}
  };

  const deleteTrip=async(tripId)=>{await supabase.from("trips").delete().eq("id",tripId);setTrips(prev=>prev.filter(t=>t.id!==tripId));};
  const handleAuthSuccess=async(newUser)=>{
    setUser(newUser);
    if(newUser)await loadUserData(newUser.id);
    setAuthScreen("app");
    // Auto-save any trip generated while browsing as guest
    if(newUser&&trip&&!tripSaved){const saved=await saveTrip(newUser.id,trip);if(saved)setTripSaved(true);}
    if(pendingDecide){setShowDecide(true);setPendingDecide(false);}
  };
  const handleSignOut=async()=>{await supabase.auth.signOut();setUser(null);setProfile(null);setTrips([]);setAuthScreen("splash");setScreen("home");setTrip(null);setActiveTab("home");};

  const generate=async(request)=>{
    setLoading(true);setError(null);setScreen("results");setShowRefine(false);
    setTripSaved(false);setSavedTripId(null);setShowStory(false);setShowBooking(false);setActiveTab("home");
    try{
      const res=await fetch("/api/plan",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({request})});
      const data=await res.json();
      if(!res.ok||!data.trip)throw new Error(data.error||"Something went wrong");
      setTrip(data.trip);
      setShowReveal(true);
      // Auto-save trip
      if(user){const saved=await saveTrip(user.id,data.trip);if(saved)setTripSaved(true);}
    }catch(e){setError(e.message);setScreen("home");}
    finally{setLoading(false);}
  };

  const handleManualSave=async()=>{
    if(!trip)return;
    if(!user){setAuthPromptAction("save");setShowAuthPrompt(true);return;}
    const saved=await saveTrip(user.id,trip);if(saved)setTripSaved(true);
  };
  const handleGenerate=(req)=>{setOriginalRequest(req);generate(req);};
  const handleRefine=(extra)=>generate(`${originalRequest}. Additional preferences: ${extra}`);
  const handleNewTrip=()=>{setTrip(null);setOriginalRequest("");setError(null);setTripSaved(false);setSavedTripId(null);setShowStory(false);setShowBooking(false);setShowSummary(false);setShowReveal(false);setScreen("home");setActiveTab("home");};
  const handleTripClick=(t)=>{setTrip(t.trip_data);setTripSaved(true);setShowStory(false);setShowBooking(false);setShowSummary(false);setScreen("results");setActiveTab("home");};
  const handleSummaryClick=(t)=>{setTrip(t.trip_data);setTripSaved(true);setShowStory(false);setShowBooking(false);setShowSummary(true);};
  const handleOpenSummary=()=>{setShowSummary(true);setShowBooking(false);};
  const handleTripUpdate=(updated)=>{setTrip(updated);};
  const handleLetsBook=()=>{
    if(!user){setAuthPromptAction("book");setShowAuthPrompt(true);return;}
    setShowBooking(true);setShowStory(false);setShowSummary(false);
  };
  const handleTabChange=(tab)=>{
    if((tab==="trips"||tab==="account")&&!user){setAuthPromptAction("trips");setShowAuthPrompt(true);return;}
    setActiveTab(tab);if(tab==="home"&&screen!=="results"&&!showSummary)setScreen("home");
  };

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
    {saveError&&<div onClick={()=>setSaveError(null)} style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#c0392b",color:"#fff",padding:"0.75rem 1.25rem",borderRadius:10,fontSize:"0.85rem",fontFamily:"'DM Sans',sans-serif",zIndex:200,maxWidth:"90vw",textAlign:"center",cursor:"pointer"}}>Trip not saved: {saveError}</div>}

    {/* Auth screens — full screen */}
    {authScreen==="signup"&&<SignUpScreen onSuccess={handleAuthSuccess} onLogin={()=>setAuthScreen("login")}/>}
    {authScreen==="login"&&<LoginScreen onSuccess={handleAuthSuccess} onCreateAccount={()=>setAuthScreen("signup")}/>}

    {/* Landing — for fresh non-users */}
    {!user&&authScreen==="splash"&&<LandingPage onCreateAccount={()=>setAuthScreen("signup")} onLogin={()=>setAuthScreen("login")} onDecide={()=>{setPendingDecide(true);setAuthScreen("signup");}} onStartPlanning={()=>setAuthScreen("app")}/>}

    {/* App — open to everyone once in "app" mode */}
    {(user||authScreen==="app")&&authScreen!=="signup"&&authScreen!=="login"&&(<>

      {showAuthPrompt&&<AuthPromptModal reason={authPromptAction} onClose={()=>setShowAuthPrompt(false)} onSignUp={()=>{setShowAuthPrompt(false);setAuthScreen("signup");}} onLogin={()=>{setShowAuthPrompt(false);setAuthScreen("login");}}/>}

      {/* Full loading screen only on fresh generation (no existing trip in state) */}
      {loading&&!trip&&<LoadingScreen input={originalRequest}/>}

      {/* Trip reveal — smooth landing after generation */}
      {!loading&&trip&&showReveal&&<TripRevealScreen trip={trip} onContinue={()=>setShowReveal(false)}/>}

      {/* Overlay for refine/update (trip already exists) */}
      {loading&&trip&&<div style={{position:"fixed",inset:0,background:"rgba(28,20,16,0.55)",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'DM Sans',sans-serif"}}><div style={{background:C.espresso,borderRadius:20,padding:"2rem 2.5rem",textAlign:"center",maxWidth:280}}><div style={{animation:"pulse 2s ease-in-out infinite",marginBottom:"1rem"}}><ZirvoyMark size={40} color={C.terracotta}/></div><p style={{color:C.sand,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.2rem",margin:"0 0 0.35rem"}}>Updating your trip…</p><p style={{color:"rgba(242,232,217,0.5)",fontSize:"0.78rem",margin:0,fontWeight:300}}>Applying your changes</p></div></div>}

      {!loading&&screen==="results"&&trip&&showStory&&!showBooking&&(
        <TripStoryScreen trip={trip} onSkip={()=>setShowStory(false)} onBook={handleLetsBook}/>
      )}

      {!loading&&screen==="results"&&trip&&showBooking&&(
        <BookingScreen trip={trip} homeAirport={profile?.home_airport} onBack={()=>setShowBooking(false)} onDone={()=>{setShowBooking(false);if(user)setActiveTab("trips");}} onSummary={()=>{setShowBooking(false);setShowSummary(true);}}/>
      )}

      {!loading&&trip&&showSummary&&!showBooking&&(
        <TripSummaryScreen trip={trip} onBack={()=>setShowSummary(false)} onBook={handleLetsBook} onTripUpdate={handleTripUpdate}/>
      )}

      {!(showStory&&screen==="results")&&!showBooking&&!showSummary&&(<>
        {activeTab==="home"&&screen==="home"&&<HomeScreen user={user} profile={profile} trips={trips} onGenerate={handleGenerate} onDecide={()=>setShowDecide(true)} onTripClick={handleTripClick} loading={loading} destImages={destImages}/>}
        {showDecide&&<DecideModal onClose={()=>setShowDecide(false)} onGenerate={handleGenerate}/>}
        {activeTab==="home"&&screen==="results"&&trip&&(<><ResultsScreen trip={trip} onNewTrip={handleNewTrip} onTryAgain={()=>setShowRefine(true)} onLetsBook={handleLetsBook} onSaveTrip={handleManualSave} isSaved={tripSaved} onShowStory={trip.storySlides?.length>0?()=>setShowStory(true):undefined} onPlanTrip={handleOpenSummary} tripId={savedTripId}/>{showRefine&&<RefineModal destination={trip.destination} onClose={()=>setShowRefine(false)} onRefine={handleRefine} loading={loading}/>}</>)}
        {activeTab==="trips"&&(user
          ?<MyTripsScreen trips={trips} onTripClick={handleTripClick} onSummary={handleSummaryClick} onDeleteTrip={deleteTrip} onPlanNew={()=>{setActiveTab("home");setScreen("home");}} destImages={destImages}/>
          :<div style={{minHeight:"100vh",background:C.sandLight,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",fontFamily:"'DM Sans',sans-serif",padding:"2rem",paddingBottom:80}}><ZirvoyMark size={42} color={C.terracotta}/><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:C.espresso,margin:0,textAlign:"center"}}>Sign in to see your trips</p><p style={{fontSize:"0.85rem",color:C.muted,margin:0,fontWeight:300,textAlign:"center"}}>Save and manage all your planned trips</p><button onClick={()=>setAuthScreen("signup")} style={{padding:"0.9rem 2rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.9rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Create free account →</button><button onClick={()=>setAuthScreen("login")} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem"}}>Log in</button></div>
        )}
        {activeTab==="account"&&(user
          ?<AccountScreen profile={profile} onSignOut={handleSignOut} destImages={destImages}/>
          :<div style={{minHeight:"100vh",background:C.sandLight,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:"1rem",fontFamily:"'DM Sans',sans-serif",padding:"2rem",paddingBottom:80}}><ZirvoyMark size={42} color={C.terracotta}/><p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:C.espresso,margin:0,textAlign:"center"}}>Sign in to your account</p><button onClick={()=>setAuthScreen("signup")} style={{padding:"0.9rem 2rem",background:C.terracotta,color:C.white,border:"none",borderRadius:12,fontSize:"0.9rem",fontWeight:600,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Create free account →</button><button onClick={()=>setAuthScreen("login")} style={{background:"transparent",border:"none",color:C.muted,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",fontSize:"0.85rem"}}>Log in</button></div>
        )}
        <BottomNav active={activeTab} onChange={handleTabChange}/>
      </>)}
    </>)}
  </>);
}
