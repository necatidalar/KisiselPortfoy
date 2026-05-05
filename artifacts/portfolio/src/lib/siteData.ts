export interface HeroData {
  name: string;
  subtitle: string;
  description: string;
  statusText: string;
  btn1: string;
  btn2: string;
}

export interface AboutData {
  heading: string;
  bio1: string;
  bio2: string;
  skills: string[];
}

export interface Service {
  title: string;
  description: string;
}

export interface Project {
  title: string;
  description: string;
  tags: string;
  demoLink: string;
  githubLink: string;
}

export interface ContactData {
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
}

export interface SiteData {
  hero: HeroData;
  about: AboutData;
  services: Service[];
  projects: Project[];
  contact: ContactData;
}

export const defaultData: SiteData = {
  hero: {
    name: "Ahmet Yılmaz",
    subtitle: "Yazılım geliştirici olarak web, mobil ve özel yazılım çözümleri geliştiriyorum.",
    description: "Modern, performanslı ve kullanıcı odaklı dijital ürünler tasarlıyor ve geliştiriyorum. Her satır kodda kalite ve hızı ön planda tutuyorum.",
    statusText: "Şu an yeni projelere açık",
    btn1: "Projelerimi Gör",
    btn2: "Benimle İletişime Geç",
  },
  about: {
    heading: "Zanaatkarlık ve Teknolojinin Kesişimi",
    bio1: "Yazılım geliştirmeyi sadece kod yazmak olarak değil, problemleri zarif çözümlere kavuşturan dijital bir zanaatkarlık olarak görüyorum. Yılların verdiği deneyimle, karmaşık sistemleri kullanıcı dostu arayüzlere dönüştürüyorum.",
    bio2: "Çalışma felsefem; temiz kod, performans, ölçeklenebilirlik ve kusursuz bir kullanıcı deneyimi üzerine kuruludur.",
    skills: [
      "Web Geliştirme",
      "Frontend",
      "Backend",
      "Mobil Uygulama",
      "API Entegrasyonları",
      "Veritabanı Tasarımı",
      "Özel Yazılım Çözümleri",
    ],
  },
  services: [
    { title: "Web Sitesi Geliştirme", description: "Kurumsal, kişisel veya özel ihtiyaçlara yönelik modern web siteleri." },
    { title: "Web Uygulaması Geliştirme", description: "Yönetim panelleri, dashboardlar, SaaS projeleri ve özel web uygulamaları." },
    { title: "Backend & API Geliştirme", description: "Güvenli, hızlı ve ölçeklenebilir backend sistemleri ve API servisleri." },
    { title: "Mobil Uygulama Geliştirme", description: "iOS ve Android uyumlu modern mobil uygulama çözümleri." },
    { title: "Bakım ve Teknik Destek", description: "Mevcut projelerin iyileştirilmesi, hata giderme ve performans optimizasyonu." },
  ],
  projects: [
    {
      title: "E-ticaret Web Uygulaması",
      description: "Modern, hızlı ve SEO uyumlu e-ticaret platformu. Sepet, ödeme ve sipariş takibi entegrasyonları.",
      tags: "React, Node.js, PostgreSQL, Stripe",
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "Randevu Yönetim Sistemi",
      description: "Klinikler ve salonlar için geliştirilmiş, takvim destekli online randevu ve yönetim sistemi.",
      tags: "Next.js, TypeScript, Prisma, Tailwind",
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "Kişisel Blog Platformu",
      description: "İçerik üreticileri için Markdown destekli, hızlı ve minimalist blog platformu.",
      tags: "React, Express, MongoDB",
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "Admin Panel / Dashboard",
      description: "Karmaşık verileri görselleştiren, rol tabanlı yetkilendirmeye sahip gelişmiş yönetim paneli.",
      tags: "Vue, Laravel, MySQL, Chart.js",
      demoLink: "#",
      githubLink: "#",
    },
    {
      title: "Mobil Uygulama Projesi",
      description: "Kullanıcıların günlük alışkanlıklarını takip edebildiği, bildirim destekli çapraz platform mobil uygulama.",
      tags: "React Native, Firebase, Redux",
      demoLink: "#",
      githubLink: "#",
    },
  ],
  contact: {
    email: "hello@ahmetyilmaz.dev",
    phone: "+90 (555) 123 45 67",
    location: "İstanbul, Türkiye",
    githubUrl: "#",
    linkedinUrl: "#",
  },
};

const STORAGE_KEY = "portfolio_site_data";

export function loadSiteData(): SiteData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultData;
    return { ...defaultData, ...JSON.parse(raw) };
  } catch {
    return defaultData;
  }
}

export function saveSiteData(data: SiteData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
