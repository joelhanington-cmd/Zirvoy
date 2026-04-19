// Public trip share page — /trip/[id]
// Requires Supabase RLS policy: SELECT on trips FOR ALL (anonymous read)
import Head from "next/head";
import { createClient } from "@supabase/supabase-js";

const C={
  espresso:"#1C1410",bark:"#2E1F14",terracotta:"#C4622D",terra2:"#D4784A",
  sand:"#F2E8D9",sandLight:"#FAF6F0",parchment:"#EDE0CC",ink:"#1C1410",
  muted:"#8A7968",border:"#E0D4C0",white:"#FFFFFF",gold:"#C9943A",
};
const fmt=(n)=>Number(n).toLocaleString("en-GB");

export async function getServerSideProps({params}){
  const supabaseUrl=process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!supabaseUrl||!supabaseKey)return{props:{trip:null}};
  const supabase=createClient(supabaseUrl,supabaseKey);
  const{data}=await supabase.from("trips").select("trip_data").eq("id",params.id).single();
  return{props:{trip:data?.trip_data||null}};
}

export default function SharedTrip({trip}){
  if(!trip){
    return(
      <div style={{minHeight:"100vh",background:C.espresso,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:"2rem",fontFamily:"'DM Sans',sans-serif"}}>
        <Head><title>Zirvoy — Trip not found</title></Head>
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,600;1,400&family=DM+Sans:wght@300;400;600&display=swap');*{box-sizing:border-box;}`}</style>
        <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.5rem",color:C.sand,marginBottom:"1.5rem"}}>Trip not found</p>
        <a href="/" style={{padding:"0.85rem 1.75rem",background:C.terracotta,color:C.white,borderRadius:12,fontSize:"0.9rem",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif"}}>Plan your own trip →</a>
      </div>
    );
  }

  return(
    <div style={{minHeight:"100vh",background:C.sandLight,fontFamily:"'DM Sans',sans-serif"}}>
      <Head>
        <title>{trip.destination}, {trip.country} — planned with Zirvoy</title>
        <meta name="description" content={`${trip.duration} nights in ${trip.destination}. Est. £${fmt(trip.budgetTotal)}. ${trip.tagline}`}/>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content={`${trip.destination} — planned with Zirvoy`}/>
        <meta property="og:description" content={`${trip.duration} nights · ${trip.travellers} travellers · Est. £${fmt(trip.budgetTotal)}. ${trip.tagline}`}/>
        {trip.photo&&<meta property="og:image" content={trip.photo}/>}
        {trip.photo&&<meta property="og:image:width" content="1200"/>}
        {trip.photo&&<meta property="og:image:height" content="630"/>}
        <meta property="og:locale" content="en_GB"/>
        <meta name="twitter:card" content="summary_large_image"/>
        <meta name="twitter:title" content={`${trip.destination} — planned with Zirvoy`}/>
        <meta name="twitter:description" content={`${trip.duration} nights · Est. £${fmt(trip.budgetTotal)}. ${trip.tagline}`}/>
        {trip.photo&&<meta name="twitter:image" content={trip.photo}/>}
        <meta name="viewport" content="width=device-width,initial-scale=1"/>
      </Head>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');*{-webkit-font-smoothing:antialiased;box-sizing:border-box;}body{margin:0;padding:0;background:#FAF6F0;}`}</style>

      {/* Hero */}
      <div style={{position:"relative",height:"min(380px,55vw)",minHeight:280,overflow:"hidden"}}>
        {trip.photo&&<img src={trip.photo} alt={trip.destination} style={{width:"100%",height:"100%",objectFit:"cover",filter:"brightness(0.8)"}}/>}
        <div style={{position:"absolute",inset:0,background:`linear-gradient(135deg,${C.bark},${C.espresso})`,opacity:trip.photo?0:1}}/>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(to bottom,rgba(28,20,16,0.15) 0%,rgba(28,20,16,0.9) 100%)"}}/>
        {/* Zirvoy badge */}
        <div style={{position:"absolute",top:"1.25rem",left:"1.5rem",display:"flex",alignItems:"center",gap:7}}>
          <svg width="20" height="20" viewBox="0 0 40 40" fill="none"><circle cx="20" cy="20" r="18" stroke={C.sand} strokeWidth="1.8"/><line x1="6" y1="20" x2="34" y2="20" stroke={C.sand} strokeWidth="1.4"/><line x1="26" y1="9" x2="14" y2="31" stroke={C.sand} strokeWidth="1.8" strokeLinecap="round"/><circle cx="20" cy="20" r="2.2" fill={C.sand}/></svg>
          <span style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.1rem",fontWeight:600,color:C.sand,letterSpacing:"0.14em",textTransform:"uppercase"}}>Zirvoy</span>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"1.5rem clamp(1.25rem,5vw,2rem)"}}>
          <p style={{fontSize:"0.62rem",fontWeight:600,color:C.terra2,letterSpacing:"0.2em",textTransform:"uppercase",margin:"0 0 0.3rem"}}>{trip.country}</p>
          <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"clamp(2.4rem,8vw,3.5rem)",fontWeight:600,color:C.sand,margin:"0 0 0.5rem",lineHeight:1}}>{trip.destination}</h1>
          <p style={{fontSize:"0.88rem",color:"rgba(242,232,217,0.7)",margin:"0 0 1rem",lineHeight:1.55,fontWeight:300,maxWidth:480}}>{trip.tagline}</p>
          <div style={{display:"flex",gap:"0.45rem",flexWrap:"wrap"}}>
            {[`${trip.travellers} travellers`,`${trip.duration} nights`,`£${fmt(trip.budgetTotal)} est.`].map(t=>(
              <span key={t} style={{background:"rgba(242,232,217,0.12)",backdropFilter:"blur(8px)",border:"1px solid rgba(242,232,217,0.2)",padding:"0.28rem 0.75rem",borderRadius:20,fontSize:"0.72rem",color:C.sand}}>{t}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{maxWidth:640,margin:"0 auto",padding:"1.5rem clamp(1.25rem,5vw,2rem) 3rem"}}>
        {/* Flights + Hotel */}
        <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
          <div style={{paddingBottom:"1rem",marginBottom:"1rem",borderBottom:`1px solid ${C.parchment}`}}>
            <p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.5rem"}}>✈ Flights</p>
            <p style={{margin:0,fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.flights}</p>
          </div>
          <div>
            <p style={{fontSize:"0.65rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:"0 0 0.5rem"}}>🏨 Where to Stay</p>
            <p style={{margin:0,fontSize:"0.88rem",color:C.ink,lineHeight:1.65,fontWeight:300}}>{trip.hotel}</p>
          </div>
        </div>

        {/* Itinerary preview (first 2 days) */}
        {trip.itinerary?.length>0&&(
          <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.35rem",marginBottom:"1rem",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:"1rem"}}>
              <div style={{width:3,height:14,background:C.terracotta,borderRadius:2}}/>
              <p style={{fontSize:"0.68rem",fontWeight:600,color:C.muted,textTransform:"uppercase",letterSpacing:"0.12em",margin:0}}>Itinerary Preview</p>
            </div>
            {trip.itinerary.slice(0,2).map(day=>(
              <div key={day.day} style={{marginBottom:"1rem",paddingBottom:"1rem",borderBottom:`1px solid ${C.parchment}`}}>
                <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",fontWeight:600,color:C.espresso,margin:"0 0 0.5rem"}}>Day {day.day} · {day.title}</p>
                <p style={{margin:0,fontSize:"0.82rem",color:C.muted,lineHeight:1.6,fontWeight:300}}>{day.morning}</p>
              </div>
            ))}
            {trip.itinerary.length>2&&<p style={{fontSize:"0.78rem",color:C.muted,margin:0,fontStyle:"italic",fontWeight:300}}>+ {trip.itinerary.length-2} more days — plan your own trip to see the full itinerary</p>}
          </div>
        )}

        {/* Insider tip */}
        {trip.tip&&(
          <div style={{background:C.espresso,borderRadius:18,padding:"1.4rem 1.5rem",marginBottom:"1.5rem"}}>
            <p style={{fontSize:"0.62rem",fontWeight:600,color:C.terracotta,textTransform:"uppercase",letterSpacing:"0.16em",margin:"0 0 0.6rem"}}>Zirvoy Insider Tip</p>
            <p style={{margin:0,fontFamily:"'Cormorant Garamond',serif",fontSize:"1.05rem",color:C.sand,lineHeight:1.8,fontStyle:"italic"}}>{trip.tip}</p>
          </div>
        )}

        {/* CTA */}
        <div style={{background:C.white,borderRadius:18,border:`1px solid ${C.border}`,padding:"1.5rem",textAlign:"center",boxShadow:"0 2px 16px rgba(28,20,16,0.05)"}}>
          <p style={{fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:600,color:C.espresso,margin:"0 0 0.4rem"}}>Plan your own trip with Zirvoy</p>
          <p style={{fontSize:"0.85rem",color:C.muted,margin:"0 0 1.25rem",fontWeight:300,lineHeight:1.55}}>Full AI trip plan — flights, hotel, day-by-day itinerary — in seconds. Free to use.</p>
          <a href="/" style={{display:"block",padding:"1rem",background:C.terracotta,color:C.white,borderRadius:12,fontSize:"0.95rem",fontWeight:600,textDecoration:"none",fontFamily:"'DM Sans',sans-serif"}}>Start planning free →</a>
        </div>
      </div>
    </div>
  );
}
