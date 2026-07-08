"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, Snowflake, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { ProductVisual } from "@/components/renders/ProductRender";
import { askAssistant, DEFAULT_CHIPS, type AssistantReply } from "@/lib/assistant";
import { formatEur } from "@/lib/utils";
import type { ProductSnapshot } from "@/stores/shop";

/**
 * Modular live-chat mount point.
 *
 * Provider is chosen via env (no code changes needed to swap):
 *   NEXT_PUBLIC_CHAT_PROVIDER="3cx"  + NEXT_PUBLIC_3CX_CHAT_URL → loads the
 *   official 3CX Live Chat script and renders nothing of its own.
 *   Anything else → the built-in KlimaENG assistant below.
 */
export function ChatWidget() {
  const provider = process.env.NEXT_PUBLIC_CHAT_PROVIDER;
  const threeCxUrl = process.env.NEXT_PUBLIC_3CX_CHAT_URL;

  if (provider === "3cx" && threeCxUrl) {
    return <ThreeCxChat url={threeCxUrl} />;
  }
  return <KlimaAssistant />;
}

/** Injects the 3CX web-client script; 3CX renders its own bubble. */
function ThreeCxChat({ url }: { url: string }) {
  useEffect(() => {
    if (document.getElementById("tcx-callus-js")) return;
    const script = document.createElement("script");
    script.id = "tcx-callus-js";
    script.src = "https://downloads-global.3cx.com/downloads/livechatandtalk/v1/callus.js";
    script.defer = true;
    document.body.appendChild(script);

    const widget = document.createElement("call-us-selector");
    widget.setAttribute("phonesystem-url", url);
    widget.setAttribute("party", "LiveChat");
    document.body.appendChild(widget);

    return () => {
      script.remove();
      widget.remove();
    };
  }, [url]);
  return null;
}

type Message =
  | { role: "user"; text: string }
  | ({ role: "bot" } & AssistantReply);

const INTRO: Message = {
  role: "bot",
  text: "Përshëndetje! 👋 Jam asistenti i KlimaENG. Më pyesni për produkte, kapacitet BTU, montim ose çmime — përgjigjem menjëherë.",
  chips: DEFAULT_CHIPS,
};

function KlimaAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INTRO]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const catalogRef = useRef<ProductSnapshot[] | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Load the catalog once, lazily, when the chat first opens.
  useEffect(() => {
    if (!open || catalogRef.current) return;
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => {
        catalogRef.current = data;
      })
      .catch(() => {
        catalogRef.current = [];
      });
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing, open]);

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;
    setMessages((m) => [...m, { role: "user", text }]);
    setInput("");
    setTyping(true);
    // Small delay so the exchange feels conversational, not robotic-instant.
    setTimeout(() => {
      const reply = askAssistant(text, catalogRef.current ?? []);
      setMessages((m) => [...m, { role: "bot", ...reply }]);
      setTyping(false);
    }, 550 + Math.min(text.length * 12, 500));
  };

  return (
    <>
      {/* launcher */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Mbyll asistentin" : "Hap asistentin KlimaENG"}
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 320, damping: 22 }}
        className="fixed right-4 bottom-4 z-110 grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-frost-500 text-white shadow-[0_10px_30px_-6px_rgba(36,86,224,0.6)] transition-transform hover:scale-105 active:scale-95 sm:right-6 sm:bottom-6"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? "x" : "chat"}
            initial={{ rotate: -70, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 70, opacity: 0 }}
            transition={{ duration: 0.18 }}
          >
            {open ? <X size={23} /> : <MessageCircle size={23} />}
          </motion.span>
        </AnimatePresence>
        {!open && (
          <span className="absolute -top-0.5 -right-0.5 grid h-4 w-4 place-items-center">
            <span className="absolute h-full w-full animate-ping rounded-full bg-frost-400 opacity-60" />
            <span className="h-2.5 w-2.5 rounded-full bg-frost-300" />
          </span>
        )}
      </motion.button>

      {/* window */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Asistenti KlimaENG"
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 380, damping: 32 }}
            className="fixed right-4 bottom-21 z-110 flex h-[min(34rem,calc(100dvh-7.5rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-line bg-surface card-shadow-lg sm:right-6 sm:bottom-24"
          >
            {/* header */}
            <div className="relative flex items-center gap-3 bg-gradient-to-r from-brand-700 to-brand-600 px-5 py-4 text-white">
              <div aria-hidden className="absolute inset-0 blueprint-grid opacity-20" />
              <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15 backdrop-blur">
                <Snowflake size={19} />
              </span>
              <div className="relative">
                <p className="font-display text-sm font-bold">Asistenti KlimaENG</p>
                <p className="flex items-center gap-1.5 text-[11px] text-white/80">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                  Online — përgjigje të menjëhershme
                </p>
              </div>
            </div>

            {/* messages */}
            <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg, i) => (
                <div key={i}>
                  {msg.role === "user" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-brand-600 px-4 py-2.5 text-sm text-white"
                    >
                      {msg.text}
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2.5"
                    >
                      <div className="w-fit max-w-[90%] rounded-2xl rounded-bl-md bg-surface-2 px-4 py-2.5 text-sm leading-relaxed text-ink">
                        {msg.text}
                      </div>

                      {msg.products && msg.products.length > 0 && (
                        <div className="space-y-2">
                          {msg.products.map((p) => (
                            <Link
                              key={p.id}
                              href={`/produktet/${p.slug}`}
                              onClick={() => setOpen(false)}
                              className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-2.5 transition-colors hover:border-brand-300 focus-ring"
                            >
                              <span className="h-14 w-16 shrink-0 overflow-hidden rounded-xl bg-surface-2">
                                <ProductVisual render={p.render} accent={p.accent} className="h-full w-full p-1" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block truncate text-[13px] font-semibold text-ink">
                                  {p.name}
                                </span>
                                <span className="text-xs text-muted">
                                  {p.btu ? `${p.btu.toLocaleString("de-DE")} BTU · ` : ""}
                                  <strong className="text-brand-600 dark:text-brand-300">{formatEur(p.price)}</strong>
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}

                      {msg.chips && (
                        <div className="flex flex-wrap gap-1.5">
                          {msg.chips.map((chip) => (
                            <button
                              key={chip}
                              onClick={() => send(chip)}
                              className="rounded-full border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 transition-colors hover:bg-brand-100 focus-ring dark:border-brand-500/25 dark:bg-brand-500/10 dark:text-brand-300 dark:hover:bg-brand-500/20"
                            >
                              {chip}
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              ))}

              {typing && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex w-fit items-center gap-1 rounded-2xl rounded-bl-md bg-surface-2 px-4 py-3"
                >
                  {[0, 1, 2].map((i) => (
                    <motion.span
                      key={i}
                      className="h-1.5 w-1.5 rounded-full bg-muted"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, delay: i * 0.18, repeat: Infinity }}
                    />
                  ))}
                </motion.div>
              )}
            </div>

            {/* input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-line p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Shkruani mesazhin…"
                aria-label="Mesazhi juaj"
                className="h-11 flex-1 rounded-full border border-line-2 bg-bg px-4 text-sm text-ink placeholder:text-muted focus:border-brand-400 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!input.trim() || typing}
                aria-label="Dërgo"
                className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-brand-600 text-white transition-all hover:bg-brand-500 active:scale-95 disabled:opacity-40"
              >
                <Send size={17} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
