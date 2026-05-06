import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { Plus, Trash2, Save, RotateCcw, ArrowLeft, ChevronDown, ChevronUp, Check, Mail, Lock, Server } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { loadSiteData, saveSiteData, defaultData, type SiteData, type Service, type Project, type TechItem, type Quote } from "@/lib/siteData";

interface SmtpFormState {
  host: string;
  port: string;
  secure: boolean;
  user: string;
  password: string;
  toEmail: string;
}

function SectionCard({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex justify-between items-center px-8 py-5 text-left hover:bg-white/[0.02] transition-colors"
      >
        <span className="text-white font-semibold text-lg">{title}</span>
        {open ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-8 pb-8 pt-2 border-t border-white/5">
          {children}
        </div>
      )}
    </div>
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}

export default function AdminPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [data, setData] = useState<SiteData>(loadSiteData());
  const [saved, setSaved] = useState(false);

  const [smtp, setSmtp] = useState<SmtpFormState>({
    host: "",
    port: "587",
    secure: false,
    user: "",
    password: "",
    toEmail: "",
  });
  const [smtpSaving, setSmtpSaving] = useState(false);
  const [smtpSaved, setSmtpSaved] = useState(false);

  useEffect(() => {
    setData(loadSiteData());
    fetch("/api/smtp-settings")
      .then(r => r.json())
      .then(d => {
        if (d.configured) {
          setSmtp(prev => ({
            ...prev,
            host: d.host ?? "",
            port: String(d.port ?? 587),
            secure: d.secure ?? false,
            user: d.user ?? "",
            toEmail: d.toEmail ?? "",
          }));
        }
      })
      .catch(() => {});
  }, []);

  function handleSave() {
    saveSiteData(data);
    setSaved(true);
    toast({ title: "Kaydedildi!", description: "Değişiklikler ana sayfaya yansıtıldı." });
    setTimeout(() => setSaved(false), 2000);
  }

  function handleReset() {
    if (!confirm("Tüm değişiklikler sıfırlanacak. Emin misiniz?")) return;
    saveSiteData(defaultData);
    setData(defaultData);
    toast({ title: "Sıfırlandı", description: "Veriler varsayılan değerlere döndürüldü." });
  }

  async function handleSmtpSave() {
    setSmtpSaving(true);
    try {
      const res = await fetch("/api/smtp-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host: smtp.host,
          port: Number(smtp.port),
          secure: smtp.secure,
          user: smtp.user,
          password: smtp.password || undefined,
          toEmail: smtp.toEmail,
        }),
      });
      const d = await res.json();
      if (!res.ok) {
        toast({ title: "Hata!", description: d.error ?? "SMTP ayarları kaydedilemedi.", variant: "destructive" });
      } else {
        setSmtpSaved(true);
        setSmtp(prev => ({ ...prev, password: "" }));
        toast({ title: "SMTP Kaydedildi!", description: "E-posta ayarları güncellendi." });
        setTimeout(() => setSmtpSaved(false), 2000);
      }
    } catch {
      toast({ title: "Bağlantı hatası!", description: "Sunucuya ulaşılamadı.", variant: "destructive" });
    } finally {
      setSmtpSaving(false);
    }
  }

  function updateHero(field: keyof SiteData["hero"], value: string) {
    setData(prev => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  }

  function updateAbout(field: keyof SiteData["about"], value: string | string[]) {
    setData(prev => ({ ...prev, about: { ...prev.about, [field]: value } }));
  }

  function updateSkill(index: number, value: string) {
    const skills = [...data.about.skills];
    skills[index] = value;
    updateAbout("skills", skills);
  }

  function addSkill() {
    updateAbout("skills", [...data.about.skills, "Yeni Yetkinlik"]);
  }

  function removeSkill(index: number) {
    updateAbout("skills", data.about.skills.filter((_, i) => i !== index));
  }

  function updateService(index: number, field: keyof Service, value: string) {
    const services = data.services.map((s, i) => i === index ? { ...s, [field]: value } : s);
    setData(prev => ({ ...prev, services }));
  }

  function addService() {
    setData(prev => ({ ...prev, services: [...prev.services, { title: "Yeni Hizmet", description: "Hizmet açıklaması." }] }));
  }

  function removeService(index: number) {
    setData(prev => ({ ...prev, services: prev.services.filter((_, i) => i !== index) }));
  }

  function updateProject(index: number, field: keyof Project, value: string) {
    const projects = data.projects.map((p, i) => i === index ? { ...p, [field]: value } : p);
    setData(prev => ({ ...prev, projects }));
  }

  function addProject() {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { title: "Yeni Proje", description: "Proje açıklaması.", tags: "", demoLink: "#", githubLink: "#" }]
    }));
  }

  function removeProject(index: number) {
    setData(prev => ({ ...prev, projects: prev.projects.filter((_, i) => i !== index) }));
  }

  function updateContact(field: keyof SiteData["contact"], value: string) {
    setData(prev => ({ ...prev, contact: { ...prev.contact, [field]: value } }));
  }

  function updateTech(index: number, value: string) {
    const technologies = [...data.technologies];
    technologies[index] = { name: value };
    setData(prev => ({ ...prev, technologies }));
  }

  function addTech() {
    setData(prev => ({ ...prev, technologies: [...prev.technologies, { name: "Yeni Teknoloji" }] }));
  }

  function removeTech(index: number) {
    setData(prev => ({ ...prev, technologies: prev.technologies.filter((_, i) => i !== index) }));
  }

  function updateQuote(index: number, field: keyof Quote, value: string) {
    const quotes = data.quotes.map((q, i) => i === index ? { ...q, [field]: value } : q);
    setData(prev => ({ ...prev, quotes }));
  }

  function addQuote() {
    setData(prev => ({ ...prev, quotes: [...prev.quotes, { text: "Yeni alıntı metni.", author: "Yazar" }] }));
  }

  function removeQuote(index: number) {
    setData(prev => ({ ...prev, quotes: prev.quotes.filter((_, i) => i !== index) }));
  }

  const inputClass = "bg-background/50 border-white/10 focus-visible:ring-primary h-11 text-white placeholder:text-muted-foreground/50";
  const textareaClass = "bg-background/50 border-white/10 focus-visible:ring-primary resize-none text-white placeholder:text-muted-foreground/50";

  return (
    <div className="bg-background min-h-screen text-foreground font-sans">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm"
            >
              <ArrowLeft className="h-4 w-4" />
              Ana Sayfaya Dön
            </button>
            <div className="w-px h-4 bg-white/10" />
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold font-mono tracking-tighter text-white">
                <span className="text-primary">&lt;</span>ND<span className="text-primary">/&gt;</span>
              </span>
              <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded-md">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white gap-2"
              onClick={handleReset}
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Sıfırla
            </Button>
            <Button
              size="sm"
              className={`gap-2 transition-all ${saved ? "bg-green-600 hover:bg-green-700" : "glow-primary"}`}
              onClick={handleSave}
            >
              {saved ? <Check className="h-3.5 w-3.5" /> : <Save className="h-3.5 w-3.5" />}
              {saved ? "Kaydedildi" : "Kaydet"}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 md:px-12 max-w-6xl py-10 space-y-6">
        {/* Page Title */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-2"
        >
          <h1 className="text-2xl font-bold text-white">Site İçeriği Yönetimi</h1>
          <p className="text-muted-foreground mt-1">Aşağıdaki alanları düzenleyip Kaydet butonuna basın. Değişiklikler anında ana sayfaya yansır.</p>
        </motion.div>

        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.05 }}>
          <SectionCard title="Hero — Ana Giriş Bölümü" defaultOpen>
            <div className="grid md:grid-cols-2 gap-5 mt-4">
              <FieldGroup label="Ad Soyad">
                <Input className={inputClass} value={data.hero.name} onChange={e => updateHero("name", e.target.value)} placeholder="Necati DALAR" />
              </FieldGroup>
              <FieldGroup label="Durum Metni (yeşil rozet)">
                <Input className={inputClass} value={data.hero.statusText} onChange={e => updateHero("statusText", e.target.value)} placeholder="Şu an yeni projelere açık" />
              </FieldGroup>
              <div className="md:col-span-2">
                <FieldGroup label="Alt Başlık">
                  <Input className={inputClass} value={data.hero.subtitle} onChange={e => updateHero("subtitle", e.target.value)} />
                </FieldGroup>
              </div>
              <div className="md:col-span-2">
                <FieldGroup label="Açıklama Metni">
                  <Textarea className={textareaClass} rows={3} value={data.hero.description} onChange={e => updateHero("description", e.target.value)} />
                </FieldGroup>
              </div>
              <FieldGroup label="1. Buton Metni">
                <Input className={inputClass} value={data.hero.btn1} onChange={e => updateHero("btn1", e.target.value)} />
              </FieldGroup>
              <FieldGroup label="2. Buton Metni">
                <Input className={inputClass} value={data.hero.btn2} onChange={e => updateHero("btn2", e.target.value)} />
              </FieldGroup>
            </div>
          </SectionCard>
        </motion.div>

        {/* About */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <SectionCard title="Hakkımda">
            <div className="space-y-5 mt-4">
              <FieldGroup label="Başlık">
                <Input className={inputClass} value={data.about.heading} onChange={e => updateAbout("heading", e.target.value)} />
              </FieldGroup>
              <FieldGroup label="1. Paragraf">
                <Textarea className={textareaClass} rows={3} value={data.about.bio1} onChange={e => updateAbout("bio1", e.target.value)} />
              </FieldGroup>
              <FieldGroup label="2. Paragraf">
                <Textarea className={textareaClass} rows={3} value={data.about.bio2} onChange={e => updateAbout("bio2", e.target.value)} />
              </FieldGroup>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-sm font-medium text-muted-foreground">Yetkinlikler</label>
                  <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/5 gap-1.5 text-xs" onClick={addSkill}>
                    <Plus className="h-3.5 w-3.5" /> Ekle
                  </Button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.about.skills.map((skill, i) => (
                    <div key={i} className="flex gap-2">
                      <Input className={inputClass + " flex-1"} value={skill} onChange={e => updateSkill(i, e.target.value)} />
                      <button onClick={() => removeSkill(i)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-white/5">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* Services */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}>
          <SectionCard title="Hizmetlerim">
            <div className="space-y-4 mt-4">
              {data.services.map((service, i) => (
                <div key={i} className="bg-background/30 border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-primary/70">#{i + 1}</span>
                    <button onClick={() => removeService(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-white/5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <FieldGroup label="Hizmet Adı">
                    <Input className={inputClass} value={service.title} onChange={e => updateService(i, "title", e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Açıklama">
                    <Textarea className={textareaClass} rows={2} value={service.description} onChange={e => updateService(i, "description", e.target.value)} />
                  </FieldGroup>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 gap-2 text-muted-foreground" onClick={addService}>
                <Plus className="h-4 w-4" /> Yeni Hizmet Ekle
              </Button>
            </div>
          </SectionCard>
        </motion.div>

        {/* Technologies */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.175 }}>
          <SectionCard title="Kullandığım Teknolojiler">
            <div className="space-y-4 mt-4">
              <p className="text-xs text-muted-foreground">
                Bilinen teknoloji adları (React, Node.js, Python vb.) için ikon otomatik gösterilir. Bilinmeyen adlar için varsayılan ikon kullanılır.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {data.technologies.map((tech, i) => (
                  <div key={i} className="flex gap-2">
                    <Input
                      className={inputClass + " flex-1"}
                      value={tech.name}
                      onChange={e => updateTech(i, e.target.value)}
                      placeholder="Teknoloji adı"
                    />
                    <button onClick={() => removeTech(i)} className="p-2 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-white/5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 gap-2 text-muted-foreground" onClick={addTech}>
                <Plus className="h-4 w-4" /> Teknoloji Ekle
              </Button>
            </div>
          </SectionCard>
        </motion.div>

        {/* Projects */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <SectionCard title="Projelerim">
            <div className="space-y-4 mt-4">
              {data.projects.map((project, i) => (
                <div key={i} className="bg-background/30 border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-primary/70">#{i + 1}</span>
                    <button onClick={() => removeProject(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-white/5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-3">
                    <FieldGroup label="Proje Adı">
                      <Input className={inputClass} value={project.title} onChange={e => updateProject(i, "title", e.target.value)} />
                    </FieldGroup>
                    <FieldGroup label="Teknolojiler (virgülle ayır)">
                      <Input className={inputClass} value={project.tags} onChange={e => updateProject(i, "tags", e.target.value)} placeholder="React, Node.js, PostgreSQL" />
                    </FieldGroup>
                  </div>
                  <FieldGroup label="Açıklama">
                    <Textarea className={textareaClass} rows={2} value={project.description} onChange={e => updateProject(i, "description", e.target.value)} />
                  </FieldGroup>
                  <div className="grid md:grid-cols-2 gap-3">
                    <FieldGroup label="Demo Linki">
                      <Input className={inputClass} value={project.demoLink} onChange={e => updateProject(i, "demoLink", e.target.value)} placeholder="https://..." />
                    </FieldGroup>
                    <FieldGroup label="GitHub Linki">
                      <Input className={inputClass} value={project.githubLink} onChange={e => updateProject(i, "githubLink", e.target.value)} placeholder="https://github.com/..." />
                    </FieldGroup>
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 gap-2 text-muted-foreground" onClick={addProject}>
                <Plus className="h-4 w-4" /> Yeni Proje Ekle
              </Button>
            </div>
          </SectionCard>
        </motion.div>

        {/* Contact */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.25 }}>
          <SectionCard title="İletişim Bilgileri">
            <div className="grid md:grid-cols-2 gap-5 mt-4">
              <FieldGroup label="E-posta">
                <Input className={inputClass} value={data.contact.email} onChange={e => updateContact("email", e.target.value)} placeholder="hello@example.com" />
              </FieldGroup>
              <FieldGroup label="Telefon">
                <Input className={inputClass} value={data.contact.phone} onChange={e => updateContact("phone", e.target.value)} placeholder="+90 (555) 000 00 00" />
              </FieldGroup>
              <FieldGroup label="Konum">
                <Input className={inputClass} value={data.contact.location} onChange={e => updateContact("location", e.target.value)} placeholder="İstanbul, Türkiye" />
              </FieldGroup>
              <FieldGroup label="GitHub URL">
                <Input className={inputClass} value={data.contact.githubUrl} onChange={e => updateContact("githubUrl", e.target.value)} placeholder="https://github.com/..." />
              </FieldGroup>
              <div className="md:col-span-2">
                <FieldGroup label="LinkedIn URL">
                  <Input className={inputClass} value={data.contact.linkedinUrl} onChange={e => updateContact("linkedinUrl", e.target.value)} placeholder="https://linkedin.com/in/..." />
                </FieldGroup>
              </div>
            </div>
          </SectionCard>
        </motion.div>

        {/* Quotes */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.275 }}>
          <SectionCard title="Alıntılar (Dönen Bölüm)">
            <div className="space-y-4 mt-4">
              <p className="text-xs text-muted-foreground">Sitede her 5 saniyede bir dönen alıntı bölümü. En az 1 alıntı eklendiğinde görünür.</p>
              {data.quotes.map((quote, i) => (
                <div key={i} className="bg-background/30 border border-white/5 rounded-xl p-5 space-y-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono text-primary/70">#{i + 1}</span>
                    <button onClick={() => removeQuote(i)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors rounded-lg hover:bg-white/5">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <FieldGroup label="Alıntı Metni">
                    <Textarea className={textareaClass} rows={2} value={quote.text} onChange={e => updateQuote(i, "text", e.target.value)} placeholder="İlham verici bir alıntı..." />
                  </FieldGroup>
                  <FieldGroup label="Yazar">
                    <Input className={inputClass} value={quote.author} onChange={e => updateQuote(i, "author", e.target.value)} placeholder="Yazar adı" />
                  </FieldGroup>
                </div>
              ))}
              <Button variant="outline" className="w-full border-dashed border-white/10 hover:bg-white/5 gap-2 text-muted-foreground" onClick={addQuote}>
                <Plus className="h-4 w-4" /> Alıntı Ekle
              </Button>
            </div>
          </SectionCard>
        </motion.div>

        {/* SMTP Settings */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
          <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
            <div className="px-8 py-5 border-b border-white/5 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <span className="text-white font-semibold text-lg">SMTP E-posta Ayarları</span>
                <p className="text-xs text-muted-foreground mt-0.5">İletişim formundan gelen mesajlar bu ayarlar ile gönderilir.</p>
              </div>
            </div>
            <div className="px-8 pb-8 pt-6 space-y-5">
              <div className="grid md:grid-cols-2 gap-5">
                <FieldGroup label="SMTP Sunucu (Host)">
                  <Input
                    className={inputClass}
                    value={smtp.host}
                    onChange={e => setSmtp(p => ({ ...p, host: e.target.value }))}
                    placeholder="smtp.gmail.com"
                  />
                </FieldGroup>
                <FieldGroup label="Port">
                  <Input
                    className={inputClass}
                    value={smtp.port}
                    onChange={e => setSmtp(p => ({ ...p, port: e.target.value }))}
                    placeholder="587"
                    type="number"
                  />
                </FieldGroup>
                <FieldGroup label="Kullanıcı Adı / E-posta">
                  <div className="relative">
                    <Server className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className={inputClass + " pl-9"}
                      value={smtp.user}
                      onChange={e => setSmtp(p => ({ ...p, user: e.target.value }))}
                      placeholder="hesap@gmail.com"
                    />
                  </div>
                </FieldGroup>
                <FieldGroup label="Şifre (boş bırakılırsa değişmez)">
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className={inputClass + " pl-9"}
                      value={smtp.password}
                      onChange={e => setSmtp(p => ({ ...p, password: e.target.value }))}
                      placeholder="••••••••"
                      type="password"
                    />
                  </div>
                </FieldGroup>
                <FieldGroup label="Mesajların Gönderileceği E-posta">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      className={inputClass + " pl-9"}
                      value={smtp.toEmail}
                      onChange={e => setSmtp(p => ({ ...p, toEmail: e.target.value }))}
                      placeholder="hello@necatidalar.dev"
                    />
                  </div>
                </FieldGroup>
                <div className="flex items-center gap-3 pt-1">
                  <label className="text-sm font-medium text-muted-foreground">SSL/TLS (Güvenli Bağlantı)</label>
                  <button
                    type="button"
                    onClick={() => setSmtp(p => ({ ...p, secure: !p.secure }))}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${smtp.secure ? "bg-primary" : "bg-white/10"}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${smtp.secure ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-xs text-muted-foreground">{smtp.secure ? "Açık (port 465)" : "Kapalı (port 587)"}</span>
                </div>
              </div>
              <div className="pt-2 flex justify-end">
                <Button
                  className={`gap-2 transition-all ${smtpSaved ? "bg-green-600 hover:bg-green-700" : "glow-primary"}`}
                  onClick={handleSmtpSave}
                  disabled={smtpSaving}
                >
                  {smtpSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  {smtpSaving ? "Kaydediliyor..." : smtpSaved ? "Kaydedildi" : "SMTP Ayarlarını Kaydet"}
                </Button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Bottom Save */}
        <div className="flex justify-end gap-3 pt-4 pb-10">
          <Button
            variant="outline"
            className="border-white/10 hover:bg-white/5 text-muted-foreground hover:text-white gap-2"
            onClick={handleReset}
          >
            <RotateCcw className="h-4 w-4" />
            Sıfırla
          </Button>
          <Button
            className={`gap-2 px-8 transition-all ${saved ? "bg-green-600 hover:bg-green-700" : "glow-primary"}`}
            onClick={handleSave}
          >
            {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            {saved ? "Kaydedildi!" : "Değişiklikleri Kaydet"}
          </Button>
        </div>
      </main>

      <Toaster />
    </div>
  );
}
