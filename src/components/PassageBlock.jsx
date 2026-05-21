import { useEffect, useState } from "react";
import { fetchPassage } from "../utils/bible-api";
export default function PassageBlock({ reference, fontSize }) {
  const [state, setStatus] = useState({ status: "loading", data: null, error: null });
  useEffect(() => {
    let cancelled = false;
    setStatus({ status: "loading", data: null, error: null });
    fetchPassage(reference).then((data) => { if (!cancelled) setStatus({ status: "ok", data, error: null }); }).catch((err) => { if (!cancelled) setStatus({ status: "error", data: null, error: err.message }); });
    return () => { cancelled = true; };
  }, [reference]);
  return (<div className="passage-block"><div className="passage-ref-header"><span className="passage-ref-label">{reference}</span><div className="passage-ref-line" /></div>{ state.status === "loading" && <div className="passage-loading"><div className="spinner" /><span>Loading {reference}...</span></div> }{ state.status === "error" && <div className="passage-error">Could not load <em>{reference}</em>. {state.error} <a href={`https://www.biblegateway.com/passage/?search=${encodeURIComponent(reference)}&version=KJV`} target="_blank" rel="noopener noreferrer">Read on BibleGateway &#8599;</a></div> }{ state.status === "ok" && state.data && <div className="bible-text fade-in" style={{ fontSize: `${fontSize}px` }}>{ state.data.verses.length > 0 ? state.data.verses.map((v) => <span key={`${v.chapter}-${v.verse}`} className="verse-line"><sup className="verse-num">{v.verse}</sup>{v.text}{" "}</span>) : state.data.text }</div> }</div>);
}
