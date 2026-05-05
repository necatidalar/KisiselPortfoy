import React, { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Code2,
  Terminal,
  Database,
  Smartphone,
  Wrench,
  Globe,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  Phone,
  MapPin,
  Menu,
  X,
  Send,
  ExternalLink,
  Settings
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiTypescript,
  SiNodedotjs,
  SiPython,
  SiTailwindcss,
  SiPostgresql,
  SiMongodb,
  SiDocker,
  SiGit,
  SiHtml5,
  SiJavascript,
  SiPhp,
  SiLaravel,
  SiMysql
} from "react-icons/si";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";
import { loadSiteData, type SiteData } from "@/lib/siteData";

const serviceIcons = [Globe, Terminal, Database, Smartphone, Wrench];

const technologies = [
  { name: "HTML5", icon: SiHtml5 },
  { name: "CSS3", icon: SiHtml5 },
  { name: "JavaScript", icon: SiJavascript },
  { name: "TypeScript", icon: SiTypescript },
  { name: "React", icon: SiReact },
  { name: "Next.js", icon: SiNextdotjs },
  { name: "Node.js", icon: SiNodedotjs },
  { name: "Python", icon: SiPython },
  { name: "PHP", icon: SiPhp },
  { name: "Laravel", icon: SiLaravel },
  { name: "PostgreSQL", icon: SiPostgresql },
  { name: "MySQL", icon: SiMysql },
  { name: "MongoDB", icon: SiMongodb },
  { name: "Tailwind", icon: SiTailwindcss },
  { name: "Docker", icon: SiDocker },
  { name: "Git", icon: SiGit },
];

const processSteps = [
  "İhtiyaç analizi",
  "Tasarım ve planlama",
  "Geliştirme",
  "Test ve optimizasyon",
  "Yayına alma",
  "Destek ve bakım"
];

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Ad Soyad en az 2 karakter olmalıdır." }),
  email: z.string().email({ message: "Geçerli bir e-posta adresi giriniz." }),
  subject: z.string().min(3, { message: "Konu en az 3 karakter olmalıdır." }),
  message: z.string().min(10, { message: "Mesajınız çok kısa." })
});

function App() {
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [siteData, setSiteData] = useState<SiteData>(loadSiteData());

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onStorage = () => setSiteData(loadSiteData());
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const scrollTo = (id: string) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const form = useForm<z.infer<typeof contactFormSchema>>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" }
  });

  function onSubmit(values: z.infer<typeof contactFormSchema>) {
    console.log(values);
    toast({ title: "Mesajınız gönderildi!", description: "En kısa sürede size dönüş yapacağım." });
    form.reset();
  }

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const { hero, about, services, projects, contact } = siteData;

  return (
    <div className="bg-background min-h-screen text-foreground font-sans selection:bg-primary/30 selection:text-primary">
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-background/80 backdrop-blur-md border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
          <div className="text-xl font-bold font-mono tracking-tighter text-white">
            <span className="text-primary">&lt;</span>AY<span className="text-primary">/&gt;</span>
          </div>

          <div className="hidden md:flex space-x-8 items-center text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo('hakkimda')} className="hover:text-primary transition-colors">Hakkımda</button>
            <button onClick={() => scrollTo('hizmetler')} className="hover:text-primary transition-colors">Hizmetler</button>
            <button onClick={() => scrollTo('projeler')} className="hover:text-primary transition-colors">Projeler</button>
            <button onClick={() => scrollTo('iletisim')} className="text-primary hover:text-primary/80 transition-colors">İletişim</button>
            <button
              onClick={() => navigate("/admin")}
              className="flex items-center gap-1.5 bg-white/5 border border-white/10 hover:border-primary/50 hover:text-primary px-3 py-1.5 rounded-lg transition-all"
            >
              <Settings className="h-3.5 w-3.5" />
              Admin
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center space-y-8 md:hidden">
          <button onClick={() => scrollTo('hakkimda')} className="text-2xl font-medium hover:text-primary transition-colors">Hakkımda</button>
          <button onClick={() => scrollTo('hizmetler')} className="text-2xl font-medium hover:text-primary transition-colors">Hizmetler</button>
          <button onClick={() => scrollTo('projeler')} className="text-2xl font-medium hover:text-primary transition-colors">Projeler</button>
          <button onClick={() => scrollTo('iletisim')} className="text-2xl font-medium text-primary">İletişim</button>
          <button onClick={() => { setMobileMenuOpen(false); navigate("/admin"); }} className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <Settings className="h-5 w-5" /> Admin
          </button>
        </div>
      )}

      <main>
        {/* Hero Section */}
        <section id="hero" className="min-h-[100dvh] flex items-center justify-center relative overflow-hidden px-6 pt-20">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

          <div className="container mx-auto max-w-5xl relative z-10 flex flex-col items-center text-center">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer} className="flex flex-col items-center">
              <motion.div variants={fadeIn} className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-xs font-mono text-muted-foreground">{hero.statusText}</span>
              </motion.div>

              <motion.h1 variants={fadeIn} className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-6 text-white">
                Merhaba, ben <br className="md:hidden" /><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">{hero.name}</span>
              </motion.h1>

              <motion.p variants={fadeIn} className="text-xl md:text-2xl text-muted-foreground max-w-3xl mb-4 font-light">
                {hero.subtitle}
              </motion.p>

              <motion.p variants={fadeIn} className="text-lg text-muted-foreground/80 max-w-2xl mb-12">
                {hero.description}
              </motion.p>

              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                <Button size="lg" className="text-base h-14 px-8 glow-primary" onClick={() => scrollTo('projeler')}>
                  {hero.btn1} <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline" className="text-base h-14 px-8 border-white/10 hover:bg-white/5 hover:text-white" onClick={() => scrollTo('iletisim')}>
                  {hero.btn2}
                </Button>
              </motion.div>
            </motion.div>
          </div>

          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <button onClick={() => scrollTo('hakkimda')} className="text-muted-foreground hover:text-white transition-colors">
              <ChevronRight className="h-6 w-6 rotate-90" />
            </button>
          </div>
        </section>

        {/* About Section */}
        <section id="hakkimda" className="py-24 md:py-32 px-6 relative border-t border-white/5 bg-card/30">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="grid md:grid-cols-2 gap-16 items-center"
            >
              <motion.div variants={fadeIn} className="space-y-6">
                <h2 className="text-sm font-mono text-primary uppercase tracking-wider">Hakkımda</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white">{about.heading}</h3>
                <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
                  <p>{about.bio1}</p>
                  <p>{about.bio2}</p>
                </div>
              </motion.div>

              <motion.div variants={fadeIn} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {about.skills.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-3 bg-white/5 border border-white/5 p-4 rounded-xl">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-sm font-medium">{skill}</span>
                  </div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Services Section */}
        <section id="hizmetler" className="py-24 md:py-32 px-6 relative">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="mb-16 md:mb-24"
            >
              <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">Hizmetlerim</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white max-w-2xl">Fikrinizi hayata geçirecek teknik uzmanlık.</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, index) => {
                const Icon = serviceIcons[index % serviceIcons.length];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group bg-card border border-white/5 p-8 rounded-2xl hover:border-primary/50 hover:bg-white/[0.02] transition-all duration-300"
                  >
                    <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                    <p className="text-muted-foreground leading-relaxed">{service.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Technologies Grid */}
        <section className="py-20 border-y border-white/5 bg-card/30 overflow-hidden">
          <div className="container mx-auto max-w-6xl px-6 text-center">
            <p className="text-sm font-mono text-muted-foreground uppercase tracking-widest mb-10">Kullandığım Teknolojiler</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-12">
              {technologies.map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col items-center justify-center space-y-3 group" title={tech.name}
                >
                  <div className="text-muted-foreground group-hover:text-primary group-hover:scale-110 transition-all duration-300">
                    <tech.icon size={40} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground/0 group-hover:text-muted-foreground transition-colors duration-300">{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Section */}
        <section id="projeler" className="py-24 md:py-32 px-6">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="mb-16 md:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6"
            >
              <div>
                <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">Projelerim</h2>
                <h3 className="text-3xl md:text-4xl font-bold text-white max-w-2xl">Son dönemde geliştirdiğim işler.</h3>
              </div>
              <Button variant="outline" className="border-white/10 hover:bg-white/5 group" onClick={() => window.open(contact.githubUrl, "_blank")}>
                Github'da İncele <Github className="ml-2 h-4 w-4 group-hover:text-primary transition-colors" />
              </Button>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group relative bg-card border border-white/5 rounded-2xl overflow-hidden hover:border-primary/30 transition-colors duration-500 flex flex-col h-full"
                >
                  <div className="p-8 flex-grow flex flex-col">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-2">
                        <a href={project.githubLink} className="text-muted-foreground hover:text-white transition-colors bg-white/5 p-2 rounded-full">
                          <Github className="h-5 w-5" />
                        </a>
                        <a href={project.demoLink} className="text-muted-foreground hover:text-primary transition-colors bg-white/5 p-2 rounded-full">
                          <ExternalLink className="h-5 w-5" />
                        </a>
                      </div>
                      <Code2 className="h-8 w-8 text-primary/20 group-hover:text-primary/50 transition-colors" />
                    </div>
                    <h4 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{project.title}</h4>
                    <p className="text-muted-foreground mb-8 flex-grow">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.tags.split(",").map(tag => tag.trim()).filter(Boolean).map((tag, idx) => (
                        <span key={idx} className="text-xs font-mono text-primary/80 bg-primary/10 px-3 py-1 rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-24 md:py-32 px-6 bg-card/30 border-y border-white/5">
          <div className="container mx-auto max-w-6xl">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="text-center mb-16"
            >
              <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">Çalışma Sürecim</h2>
              <h3 className="text-3xl md:text-4xl font-bold text-white">Nasıl Çalışıyorum?</h3>
            </motion.div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 relative">
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-white/5 -translate-y-1/2" />
              {processSteps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="w-12 h-12 rounded-full bg-background border-2 border-white/10 flex items-center justify-center text-lg font-mono font-bold text-muted-foreground group-hover:border-primary group-hover:text-primary transition-colors mb-4 relative z-10">
                    {index + 1}
                  </div>
                  <h4 className="text-sm font-medium text-white/80">{step}</h4>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section id="iletisim" className="py-24 md:py-32 px-6 relative">
          <div className="container mx-auto max-w-6xl">
            <div className="grid lg:grid-cols-2 gap-16">
              <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}>
                <h2 className="text-sm font-mono text-primary uppercase tracking-wider mb-3">İletişim</h2>
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">Projelerinizi birlikte <br />hayata geçirelim.</h3>
                <p className="text-lg text-muted-foreground mb-12 max-w-md">
                  Yeni bir proje fikriniz mi var veya mevcut projeniz için desteğe mi ihtiyacınız var? Mesaj atın, üzerine konuşalım.
                </p>

                <div className="space-y-6">
                  <div className="flex items-center space-x-4 text-muted-foreground hover:text-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/50">E-posta</p>
                      <a href={`mailto:${contact.email}`} className="font-mono text-lg">{contact.email}</a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-muted-foreground hover:text-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <Phone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/50">Telefon</p>
                      <a href={`tel:${contact.phone}`} className="font-mono text-lg">{contact.phone}</a>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 text-muted-foreground hover:text-white transition-colors">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-primary">
                      <MapPin className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white/50">Konum</p>
                      <span className="text-lg">{contact.location}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-white/5 rounded-2xl p-8 shadow-2xl"
              >
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Ad Soyad</FormLabel>
                        <FormControl>
                          <Input placeholder="Ahmet Yılmaz" className="bg-background/50 border-white/10 focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">E-posta</FormLabel>
                        <FormControl>
                          <Input placeholder="hello@example.com" type="email" className="bg-background/50 border-white/10 focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Konu</FormLabel>
                        <FormControl>
                          <Input placeholder="Proje hakkında" className="bg-background/50 border-white/10 focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="message" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/70">Mesaj</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Merhaba, projemiz için sizinle çalışmak istiyoruz..."
                            className="min-h-[150px] bg-background/50 border-white/10 focus-visible:ring-primary resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <Button type="submit" className="w-full h-12 text-base font-medium glow-primary" disabled={form.formState.isSubmitting}>
                      {form.formState.isSubmitting ? "Gönderiliyor..." : (<>Mesaj Gönder <Send className="ml-2 h-4 w-4" /></>)}
                    </Button>
                  </form>
                </Form>
              </motion.div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-white/5 bg-background text-center md:text-left">
        <div className="container mx-auto px-6 max-w-6xl flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-xl font-bold font-mono tracking-tighter text-white">
            <span className="text-primary">&lt;</span>AY<span className="text-primary">/&gt;</span>
          </div>
          <p className="text-sm text-muted-foreground font-mono">
            © 2026 {hero.name}. Tüm hakları saklıdır.
          </p>
          <div className="flex items-center space-x-4">
            <a href={contact.githubUrl} className="text-muted-foreground hover:text-white transition-colors p-2 hover:bg-white/5 rounded-full">
              <Github className="h-5 w-5" />
            </a>
            <a href={contact.linkedinUrl} className="text-muted-foreground hover:text-[#0077b5] transition-colors p-2 hover:bg-white/5 rounded-full">
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}

export default App;
