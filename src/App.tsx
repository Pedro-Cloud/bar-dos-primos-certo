import { useState, useEffect, useMemo } from 'react';
import { 
  Utensils, 
  Beer, 
  Martini, 
  MapPin, 
  Clock, 
  Phone, 
  Instagram, 
  Star, 
  ChevronRight, 
  X, 
  Calendar, 
  Users,
  CheckCircle,
  Menu as MenuIcon,
  MessageSquare,
  Mail
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
// @ts-ignore
import logoImg from './assets/images/logo_primos_clean_1779384509346.png';

// --- Types ---
interface MenuItem {
  id: string;
  name: string;
  price: string;
  description: string;
  tags?: string[];
  category: 'drinks' | 'cocktails' | 'platters' | 'mains';
  popular?: boolean;
  chefChoice?: boolean;
}

// --- Data ---
const MENU_ITEMS: MenuItem[] = [
  // Drinks (Cervejas)
  { id: 'd1', name: 'Heineken Garrafa 600 ml', price: 'R$ 18', description: 'Cerveja premium Heineken estupidamente gelada.', category: 'drinks' },
  { id: 'd2', name: 'Balde Heineken (3 un.)', price: 'R$ 50', description: 'Leve 3 garrafas Heineken 600ml bem geladas com desconto.', category: 'drinks', popular: true },
  { id: 'd3', name: 'Heineken Long Neck', price: 'R$ 12', description: 'Heineken long neck súper gelada.', category: 'drinks' },
  { id: 'd4', name: 'Balde Heineken Long Neck (5 un.)', price: 'R$ 50', description: 'Balde com 5 Heineken long necks super geladas.', category: 'drinks' },
  { id: 'd5', name: 'Cerveja Original 600 ml', price: 'R$ 16', description: 'Original gelada no ponto perfeito.', category: 'drinks' },
  { id: 'd6', name: 'Balde Cerveja Original (3 un.)', price: 'R$ 45', description: 'Leve 3 garrafas de Cerveja Original 600ml em balde com muito gelo.', category: 'drinks', popular: true },
  // Cocktails (Drinks)
  { id: 'c1', name: 'Caipirinha', price: 'R$ 25', description: 'Caipirinha tradicional de cachaça. Nos sabores limão, morango ou maracujá.', category: 'cocktails', popular: true },
  { id: 'c2', name: 'Caipiroska', price: 'R$ 35', description: 'Caipirosca com vodka premium. Nos sabores limão, morango ou maracujá.', category: 'cocktails', chefChoice: true },
  { id: 'c3', name: 'Smirnoff Ice', price: 'R$ 12', description: 'A clássica e refrescante bebida mista gaseificada sabor limão.', category: 'cocktails' },
  { id: 'c4', name: 'Xeque Mate', price: 'R$ 15', description: 'Combinação perfeita e refrescante de chá mate, rum, guaraná e limão.', category: 'cocktails', popular: true },
  { id: 'c5', name: 'Campari (Dose)', price: 'R$ 20', description: 'Dose do clássico bitter italiano aromático com rodela de laranja.', category: 'cocktails' },
  { id: 'c6', name: 'Vodka (Dose)', price: 'R$ 30', description: 'Dose de vodka premium servida bem gelada.', category: 'cocktails' },
  { id: 'c7', name: 'Whisky (Dose)', price: 'R$ 35', description: 'Dose de whisky de qualidade selecionada.', category: 'cocktails' },
  // Platters
  { id: 'p3', name: 'Espeto de Carne', price: 'R$ 10', description: 'Grelhado na brasa à perfeição. Acompanha molho especial de alho e farofa.', category: 'platters', popular: true },
  { id: 'p4', name: 'Espeto de Frango', price: 'R$ 10', description: 'Peito de frango marinado e grelhado. Acompanha molho especial de alho e farofa.', category: 'platters' },
  { id: 'p5', name: 'Espeto de Coração', price: 'R$ 10', description: 'Coraçãozinho temperado na grelha. Acompanha molho especial de alho e farofa.', category: 'platters' },
  { id: 'p6', name: 'Espeto de Kafta', price: 'R$ 10', description: 'Kafta de carne bovina temperada e assada. Acompanha molho especial de alho e farofa.', category: 'platters' },
  { id: 'p7', name: 'Espeto de Linguiça', price: 'R$ 8', description: 'Saborosa linguiça grelhada na brasa. Acompanha molho especial de alho e farofa.', category: 'platters' },
  { id: 'p8', name: 'Pão de Alho', price: 'R$ 8', description: 'Pão de alho super crocante e cremoso. Acompanha molho especial de alho e farofa.', category: 'platters', popular: true },
  // Mains (Almoço)
  { id: 'm1', name: 'Segunda: Carne de Panela', price: 'R$ 29,90', description: 'Gostosa carne de panela cozida lentamente com legumes e toque caseiro. Acompanha arroz, feijão fresco, salada e batatas fritas.', category: 'mains' },
  { id: 'm2', name: 'Terça: Bife a Rolê', price: 'R$ 29,90', description: 'Bife recheado com cenoura e bacon cozido no molho de tomate. Acompanha arroz, feijão, purê de batata e salada.', category: 'mains' },
  { id: 'm3', name: 'Quarta: Feijoada Completa', price: 'R$ 39,90 - R$ 99,90', description: 'Nossa tradicional feijoada completa. Opções: Individual por R$ 39,90, para 2 pessoas por R$ 69,90 ou para 4 pessoas por R$ 99,90. Acompanha bisteca, couve, torresmo, arroz e farofa.', category: 'mains', popular: true },
  { id: 'm4_1', name: 'Quinta: Parmegiana de Carne', price: 'R$ 39,90', description: 'Parmegiana de carne bovina crocante gratinada com queijo derretido, molho de tomate artesanal, arroz e batatas fritas temperadas.', category: 'mains' },
  { id: 'm4_2', name: 'Quinta: Macarrão com Frango ao Molho', price: 'R$ 28,90', description: 'Suculento macarrão com frango ao delicioso molho vermelho caseiro.', category: 'mains' },
  { id: 'm5_1', name: 'Sexta: Tilápia na Manteiga', price: 'R$ 39,90', description: 'Filé de tilápia grelhado na manteiga com ervas finas. Acompanha arroz, purê de batata e salada.', category: 'mains' },
  { id: 'm5_2', name: 'Sexta: Strogonoff de Frango', price: 'R$ 32,90', description: 'Strogonoff de frango cremoso clássico com champignon e batata palha crocante. Acompanha arroz branco.', category: 'mains' },
  { id: 'm6', name: 'Sábado: Feijoada Completa', price: 'R$ 39,90 - R$ 99,90', description: 'Nossa clássica feijoada para animar o sábado. Opções: Individual por R$ 39,90, para 2 pessoas por R$ 69,90 ou para 4 pessoas por R$ 99,90 com acompanhamentos completos incluindo bisteca, couve, torresmo, arroz e farofa.', category: 'mains', chefChoice: true },
  { id: 'm7', name: 'Bife Acebolado (Todos os dias)', price: 'R$ 24,90', description: 'Disponível diariamente. Bife de carne grelhado e coberto com cebolas caramelizadas. Acompanha arroz, feijão, batata frita temperada e salada.', category: 'mains' },
  { id: 'm8', name: 'Linguiça Calabresa (Todos os dias)', price: 'R$ 24,90', description: 'Disponível diariamente. Deliciosa calabresa acebolada grelhada na chapa. Acompanha arroz, feijão, batata frita temperada e salada.', category: 'mains' },
  { id: 'm9', name: 'Linguiça Toscana (Todos os dias)', price: 'R$ 24,90', description: 'Disponível diariamente. Linguiça toscana assada na brasa. Acompanha arroz, feijão, batata frita temperada e salada.', category: 'mains' },
  { id: 'm10', name: 'Frango Grelhado (Todos os dias)', price: 'R$ 24,90', description: 'Disponível diariamente. Peito de frango grelhado à perfeição na brasa. Acompanha arroz, feijão, batata frita temperada e salada.', category: 'mains' },
  { id: 'm11', name: 'O Prato da Casa (Todos os dias)', price: 'R$ 34,90', description: 'Disponível diariamente. Acompanha feijão tropeiro, arroz, mandioca na manteiga e 2 espetos da sua escolha: carne, kafta, linguiça, frango ou coração.', category: 'mains', popular: true },
];

const REVIEWS = [
  { name: 'Lucas Silva', rating: 5, comment: 'Melhor lugar de SP! O bolinho de costela é imbatível.', date: 'Há 2 dias' },
  { name: 'Mariana Costa', rating: 5, comment: 'Drinks maravilhosos e trilha sonora impecável. Voltarei sempre!', date: 'Há 1 semana' },
  { name: 'Rafael Oliveira', rating: 4, comment: 'Atendimento rápido mesmo na sexta à noite. Estão de parabéns.', date: 'Há 2 semanas' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<MenuItem['category']>('platters');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

  // Reservation states
  const [resName, setResName] = useState('');
  const [resDate, setResDate] = useState('');
  const [resGuests, setResGuests] = useState(2);
  const [resTime, setResTime] = useState('');
  const [valError, setValError] = useState('');

  // Handle close modal safely resting states
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setReservationStep(1);
    setResName('');
    setResDate('');
    setResGuests(2);
    setResTime('');
    setValError('');
  };

  // Compile WhatsApp URL dynamically
  const whatsappUrl = useMemo(() => {
    const formattedDate = resDate ? resDate.split('-').reverse().join('/') : '';
    const message = `Olá! Gostaria de reservar uma mesa no Bar dos Primos:\n\n` +
      `👤 Nome: ${resName || 'Não informado'}\n` +
      `📅 Data: ${formattedDate || 'Não informada'}\n` +
      `👥 Pessoas: ${resGuests} ${resGuests === 1 ? 'pessoa' : 'pessoas'}\n` +
      `⏰ Horário: ${resTime || 'Não informado'}`;
    return `https://wa.me/5511986438100?text=${encodeURIComponent(message)}`;
  }, [resName, resDate, resGuests, resTime]);

  // Check if open logic
  useEffect(() => {
    const checkStatus = () => {
      const now = new Date();
      const day = now.getDay(); // 0 is Sunday
      const hour = now.getHours();
      
      // Example: Open Tue-Sun, 17h to 02h
      const isOpenDay = day !== 1; // Not Monday
      const isOpenHour = (hour >= 17 || hour < 2);
      setIsOpenNow(isOpenDay && isOpenHour);
    };
    checkStatus();
    const timer = setInterval(checkStatus, 60000);
    return () => clearInterval(timer);
  }, []);

  // Scroll listener for navbar
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredMenu = useMemo(() => 
    MENU_ITEMS.filter(item => item.category === activeTab), 
  [activeTab]);

  // JSON-LD Schema
  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "Bar dos primos",
    "image": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b",
    "@id": "",
    "url": window.location.href,
    "telephone": "+5511986438100",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua Jose Ataliba Ortiz 615",
      "addressLocality": "Parque São Domingos",
      "addressRegion": "SP",
      "postalCode": "05131-000",
      "addressCountry": "BR"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": -23.55052,
      "longitude": -46.633308
    },
    "openingHoursSpecification": [
      {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
        "opens": "17:00",
        "closes": "02:00"
      }
    ],
    "menu": "https://bardosprimos.com.br/menu",
    "servesCuisine": "Pub Food, Brazilian",
    "priceRange": "$$"
  };

  return (
    <div className="min-h-screen">
      <script type="application/ld+json">
        {JSON.stringify(schemaMarkup)}
      </script>

      {/* --- Sticky Navbar --- */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-charcoal/90 backdrop-blur-lg border-b border-white/5 py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center text-white">
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Logo Bar dos Primos" className="w-10 h-10 object-contain rounded-full border border-primary/20 brightness-110 shadow-md shadow-primary/10" />
            <span className="font-display font-bold text-2xl tracking-tighter uppercase italic text-glow-amber">Bar dos Primos</span>
          </div>
          
          <div className="hidden md:flex items-center gap-6 font-medium">
            <a href="#menu" className="hover:text-primary transition-colors">Cardápio</a>
            <a href="#vibe" className="hover:text-primary transition-colors">Vibe</a>
            <a href="#contato" className="hover:text-primary transition-colors">Localização</a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-accent text-charcoal-dark px-5 py-2.5 rounded-full font-bold transition-all shadow-lg active:scale-95 text-sm"
            >
              Reservar Mesa
            </button>
          </div>

          <button 
            onClick={() => setIsDrawerOpen(true)} 
            className="md:hidden text-white p-2 hover:bg-white/5 rounded-lg transition-colors animate-pulse" 
            aria-label="Menu"
          >
            <MenuIcon />
          </button>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <section className="relative h-[100vh] flex items-center overflow-hidden">
        {/* Background Image / Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80&w=2000" 
            alt="Bar interior with craft drinks" 
            className="w-full h-full object-cover grayscale-[20%]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal-dark via-charcoal-dark/70 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 py-1 px-4 rounded-full mb-6 text-primary text-sm font-semibold uppercase tracking-widest animate-pulse">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOpenNow ? 'bg-green-400' : 'bg-red-400'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${isOpenNow ? 'bg-green-500' : 'bg-red-500'}`}></span>
              </span>
              {isOpenNow ? 'Aberto agora • Happy Hour on' : 'Fechado • Abre amanhã às 17h'}
            </div>
            
            <h1 className="font-display text-6xl md:text-8xl font-bold leading-[0.9] mb-6 tracking-tighter">
              BONS DRINKS.<br/>
              GRANDES <span className="text-primary italic">PRIMOS.</span>
            </h1>
            
            <p className="text-lg text-white/70 max-w-md mb-6 leading-relaxed">
              Onde o rústico encontra o moderno. Gastronomia de autor, canecas zero grau e o melhor clima de SP.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-charcoal-dark overflow-hidden transition-transform hover:scale-110">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
              <div className="text-sm">
                <div className="flex items-center gap-1 text-primary">
                  {[1,2,3,4,5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                </div>
                <p className="text-white/60 font-medium">4.9 estrelas de +1.2k foodies locais</p>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Hero Mascot Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center items-center relative w-full h-full min-h-[300px] md:min-h-[450px]"
          >
            {/* Ambient Back Glow */}
            <div className="absolute w-60 h-60 md:w-[28rem] md:h-[28rem] rounded-full bg-primary/20 blur-[90px] animate-pulse"></div>
            
            {/* Mascot Logo - Perfectly transparent background with no outer artificial borders */}
            <div className="relative z-10 rounded-none overflow-visible md:rounded-full md:overflow-hidden max-w-[245px] xs:max-w-[285px] sm:max-w-[325px] md:max-w-[580px] lg:max-w-[650px] flex items-center justify-center drop-shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:scale-105 hover:rotate-1 transition-all duration-500 ease-out">
              <img 
                src={logoImg} 
                alt="Bar dos Primos - Brasa e Conversa Logo" 
                className="w-full h-auto rounded-none md:rounded-full object-contain" 
              />
            </div>          </motion.div>
        </div>
      </section>

      {/* --- Menu Section --- */}
      <section id="menu" className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Cardápio Inteligente</h2>
            <p className="text-white/60 max-w-xl mx-auto">Dos clássicos às criações autorais dos nossos primos.</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {[ 
              { id: 'platters', label: 'Espetos', icon: Utensils },
              { id: 'mains', label: 'Almoço', icon: MenuIcon },
              { id: 'drinks', label: 'Cervejas', icon: Beer },
              { id: 'cocktails', label: 'Drinks', icon: Martini },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-8 py-3 rounded-full font-bold transition-all border ${activeTab === tab.id ? 'bg-primary text-charcoal-dark border-primary' : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'}`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Schedule Banner depending on active option */}
          <div className="flex justify-center mb-12">
            {activeTab === 'mains' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2.5 bg-primary/10 border border-primary/20 text-primary px-5 py-3 rounded-2xl text-sm font-semibold tracking-wide shadow-sm"
              >
                <Clock size={16} />
                <span>Horário de almoço: <strong>segunda a sábado, das 11h às 15h</strong></span>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 text-white/70 px-5 py-3 rounded-2xl text-xs sm:text-sm font-medium tracking-wide shadow-sm"
              >
                <Clock size={16} />
                <span>Espetos, porções e bebidas servidos durante o funcionamento regular</span>
              </motion.div>
            )}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <AnimatePresence mode="wait">
              {filteredMenu.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-card p-6 rounded-2xl flex justify-between items-start group hover:border-primary/40 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold font-display group-hover:text-primary transition-colors">{item.name}</h3>
                      {item.popular && <span className="bg-primary/20 text-primary text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Popular</span>}
                      {item.chefChoice && <span className="bg-amber-400 text-charcoal-dark text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Chef's Choice</span>}
                    </div>
                    <p className="text-white/50 text-sm leading-relaxed mb-4">{item.description}</p>
                    <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4">
                      Adicionar ao pedido <ChevronRight size={14} />
                    </button>
                  </div>
                  <div className="text-2xl font-display font-black text-white/90">
                    {item.price}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* --- Social Proof & Vibe --- */}
      <section id="vibe" className="py-24 bg-charcoal-dark overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-8 leading-tight">
                UMA ATMOSFERA<br/> QUE <span className="text-primary">CONECTA.</span>
              </h2>
              
              <div className="space-y-8">
                {REVIEWS.map((review, idx) => (
                  <div key={idx} className="border-l-2 border-primary/30 pl-6 relative">
                    <div className="flex items-center gap-1 text-primary mb-2">
                       {Array.from({ length: review.rating }).map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                    </div>
                    <p className="text-lg italic text-white/80 mb-2">"{review.comment}"</p>
                    <cite className="font-bold text-sm not-italic flex items-center gap-2">
                      {review.name} <span className="text-white/20">•</span> <span className="font-normal text-white/40">{review.date}</span>
                    </cite>
                  </div>
                ))}
              </div>

              <div className="mt-12">
                <a 
                  href="https://www.instagram.com/bardosprimos615" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-xl border border-white/10 transition-all inline-flex hover:border-primary/50"
                >
                  <Instagram className="text-pink-500" />
                  <span className="font-bold">Siga o @bardosprimos615 no Instagram</span>
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[300px] object-cover hover:scale-[1.02] transition-transform" alt="Bar food" />
                <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[200px] object-cover hover:scale-[1.02] transition-transform" alt="Cocktails" />
              </div>
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[516px] object-cover hover:scale-[1.02] transition-transform" alt="Bar interior" />
              </div>
              
              {/* Decorative amber glow */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/5 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer & Contact --- */}
      <footer id="contato" className="bg-charcoal border-t border-white/5 pt-24 pb-32 md:pb-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-16">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <img src={logoImg} alt="Logo Bar dos Primos" className="w-12 h-12 object-contain rounded-full border border-primary/20 shadow-md shadow-primary/5" />
                <span className="font-display font-bold text-2xl tracking-tighter uppercase italic text-glow-amber">Bar dos Primos</span>
              </div>
              <p className="text-white/40 mb-8 max-w-xs">Unindo amigos e compartilhando histórias desde 2018.</p>
              <div className="flex items-center gap-4">
                <a href="https://www.instagram.com/bardosprimos615" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-charcoal-dark transition-all" title="Instagram"><Instagram size={20} /></a>
                <a href="https://wa.me/5511986438100" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-charcoal-dark transition-all" title="WhatsApp"><MessageSquare size={20} /></a>
                <a href="mailto:renan.spnight@hotmail.com" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-charcoal-dark transition-all" title="Enviar E-mail"><Mail size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin size={18} className="text-primary" /> Localização</h4>
              <p className="text-white/60 mb-1">Rua Jose Ataliba Ortiz 615</p>
              <p className="text-white/60 mb-4 col-span-2">Parque São Domingos - SP, 05131-000</p>
              <p className="text-white/60 text-sm mb-1 mt-4">E-mail: <a href="mailto:renan.spnight@hotmail.com" className="hover:text-primary transition-colors underline underline-offset-2">renan.spnight@hotmail.com</a></p>
              <p className="text-white/60 text-sm">WhatsApp: <a href="https://wa.me/5511986438100" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors underline underline-offset-2">(11) 98643-8100</a></p>
              <a href="https://maps.google.com/?q=Rua+Jose+Ataliba+Ortiz+615+Parque+Sao+Domingos+SP" target="_blank" rel="noopener noreferrer" className="text-primary text-sm font-bold mt-4 inline-block hover:underline">Abrir no Maps</a>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><Clock size={18} className="text-primary" /> Horários</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Almoço</h5>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li className="flex justify-between">
                      <span>Seg - Sáb</span> 
                      <span className="font-bold text-white">11h - 15h</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h5 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">Bar & Jantar</h5>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li className="flex justify-between">
                      <span>Ter - Qui</span> 
                      <span className="font-bold text-white">17h - 01h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Sex - Sáb</span> 
                      <span className="font-bold text-white">17h - 03h</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Dom</span> 
                      <span className="font-bold text-white">16h - 23h</span>
                    </li>
                    <li className="flex justify-between text-white/30">
                      <span>Segunda</span> 
                      <span>Fechado</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6">Receba Novidades</h4>
              <p className="text-white/40 text-sm mb-4">Entre pro Club dos Primos e receba drinks exclusivos toda semana.</p>
              <div className="flex gap-2">
                <input 
                  type="email" 
                  placeholder="Seu email" 
                  className="bg-white/5 border border-white/10 rounded-full px-4 py-2 flex-1 focus:outline-none focus:border-primary text-sm"
                />
                <button className="bg-primary text-charcoal-dark px-4 py-2 rounded-full font-bold text-sm transform active:scale-95 transition-transform">Ok</button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-white/5 pt-8 text-center text-white/20 text-sm">
            © {new Date().getFullYear()} Bar dos Primos S/A. Todos os direitos reservados.
          </div>
        </div>
      </footer>

      {/* --- Mobile Bottom Nav (Sticky) --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal/90 backdrop-blur-xl border-t border-white/10 px-4 py-3 flex justify-around items-center gap-1">
        <a href="#menu" className="flex flex-col items-center justify-center w-12 text-white/60 hover:text-primary transition-colors">
          <Utensils size={18} />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Cardápio</span>
        </a>
        
        <a 
          href="https://wa.me/5511986438100?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20pedido."
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 text-white px-3.5 py-2.5 rounded-full font-bold shadow-md active:scale-95 transition-all flex items-center gap-1 text-xs"
        >
          <MessageSquare size={14} />
          Peça agora
        </a>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-charcoal-dark px-3.5 py-2.5 rounded-full font-bold shadow-md active:scale-95 transition-all flex items-center gap-1 text-xs"
        >
          <Calendar size={14} />
          Reserva
        </button>

        <a href="tel:+5511986438100" className="flex flex-col items-center justify-center w-12 text-white/60 hover:text-primary transition-colors">
          <Phone size={18} />
          <span className="text-[9px] font-bold uppercase tracking-wider mt-0.5">Ligar</span>
        </a>
      </div>

      {/* --- Reservation Modal --- */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-charcoal-dark/90 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-charcoal border border-white/10 w-full max-w-md rounded-3xl overflow-hidden shadow-2xl relative"
            >
              <button 
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X />
              </button>

              <div className="p-8">
                {reservationStep === 1 ? (
                  <>
                    <h3 className="font-display text-3xl font-bold mb-2">Reservar Mesa</h3>
                    <p className="text-white/50 mb-6 text-sm italic">Garanta seu lugar no melhor bar do São Domingos.</p>
                    
                    <div className="space-y-5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">Seu Nome</label>
                        <input 
                          type="text" 
                          placeholder="Ex: João Silva" 
                          value={resName} 
                          onChange={(e) => setResName(e.target.value)} 
                          className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 focus:outline-none focus:border-primary text-white text-sm" 
                        />
                      </div>

                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">Data</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                              type="date" 
                              value={resDate} 
                              onChange={(e) => { setResDate(e.target.value); setValError(''); }} 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary text-white text-sm" 
                            />
                          </div>
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-1.5">Pessoas</label>
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input 
                              type="number" 
                              value={resGuests} 
                              onChange={(e) => setResGuests(Math.max(1, Number(e.target.value)))} 
                              min={1} 
                              max={20} 
                              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary text-white text-sm" 
                            />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Horário disponível</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(time => (
                            <button 
                              key={time} 
                              type="button"
                              onClick={() => { setResTime(time); setValError(''); }}
                              className={`rounded-lg py-2 text-sm font-medium transition-colors ${resTime === time ? 'bg-primary text-charcoal-dark font-bold' : 'bg-white/5 border border-white/10 hover:border-primary'}`}
                            >
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      {valError && (
                        <p className="text-red-400 text-xs font-semibold">{valError}</p>
                      )}

                      <a 
                        href={whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => {
                          if (!resDate || !resTime) {
                            e.preventDefault();
                            setValError("Por favor, selecione data e horário para a reserva.");
                          } else {
                            setValError("");
                            setReservationStep(2);
                          }
                        }}
                        className="w-full bg-primary hover:bg-accent text-charcoal-dark font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-95 transition-all flex items-center justify-center gap-2 text-sm"
                      >
                        <MessageSquare size={16} />
                        Confirmar pelo WhatsApp
                      </a>
                    </div>
                  </>
                ) : (
                  <motion.div 
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-center py-10"
                  >
                    <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={40} />
                    </div>
                    <h3 className="text-3xl font-display font-bold mb-4">Pronto, Primo!</h3>
                    <p className="text-white/60 mb-8 leading-relaxed">Você foi redirecionado para o nosso WhatsApp com todas as suas informações pré-definidas.</p>
                    <button 
                      onClick={handleCloseModal}
                      className="w-full bg-white/10 hover:bg-white/20 border border-white/20 font-bold py-4 rounded-xl transition-all"
                    >
                      Voltar para o site
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Mobile Sidebar Drawer --- */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              className="fixed inset-0 z-[80] bg-charcoal-dark/80 backdrop-blur-sm md:hidden"
            />
            
            {/* Sidebar content */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.3, ease: 'easeOut' }}
              className="fixed top-0 right-0 bottom-0 z-[90] w-80 max-w-[85vw] bg-charcoal border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl md:hidden overflow-y-auto pt-8"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-8">
                  <div className="flex items-center gap-2.5">
                    <img src={logoImg} alt="Logo" className="w-8 h-8 object-contain rounded-full border border-primary/20" />
                    <span className="font-display font-black text-lg tracking-tight uppercase italic text-glow-amber">Primos</span>
                  </div>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/60 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Primary CTA Buttons (as requested) */}
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">Acesso Rápido</h4>
                <div className="space-y-3 mb-8">
                  <a 
                    href="https://wa.me/5511986438100?text=Ol%C3%A1%21%20Gostaria%20de%20fazer%20um%20pedido."
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3.5 bg-green-600/10 hover:bg-green-600/20 border border-green-600/30 text-green-400 p-4 rounded-xl transition-all font-semibold text-sm cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-green-600/20 flex items-center justify-center text-green-400 shrink-0">
                      <MessageSquare size={16} />
                    </div>
                    <span>Peça Agora</span>
                    <ChevronRight size={14} className="ml-auto opacity-50" />
                  </a>

                  <button 
                    onClick={() => {
                      setIsDrawerOpen(false);
                      setIsModalOpen(true);
                    }}
                    className="w-full flex items-center gap-3.5 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary p-4 rounded-xl transition-all font-semibold text-sm text-left cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
                      <Calendar size={16} />
                    </div>
                    <span>Reservar Mesa</span>
                    <ChevronRight size={14} className="ml-auto opacity-50" />
                  </button>

                  <a 
                    href="#menu"
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white p-4 rounded-xl transition-all font-semibold text-sm cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-white shrink-0">
                      <Utensils size={16} />
                    </div>
                    <span>Ver Cardápio</span>
                    <ChevronRight size={14} className="ml-auto opacity-50" />
                  </a>
                </div>

                {/* Additional Links */}
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-3">Navegação</h4>
                <div className="space-y-1">
                  <a 
                    href="#vibe" 
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 text-white/70 hover:text-primary py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    <Star size={16} />
                    <span>Nossa Vibe</span>
                  </a>
                  <a 
                    href="#contato" 
                    onClick={() => setIsDrawerOpen(false)}
                    className="flex items-center gap-3 text-white/70 hover:text-primary py-2.5 px-3 rounded-lg hover:bg-white/5 transition-all text-sm font-medium"
                  >
                    <MapPin size={16} />
                    <span>Onde Estamos</span>
                  </a>
                </div>
              </div>

              {/* Drawer Footer info */}
              <div className="pt-6 border-t border-white/5 space-y-4 text-xs">
                <div className="flex items-center gap-2 text-white/60">
                  <Clock size={14} className="text-primary" />
                  <span>Almoço: Seg-Sáb 11h às 15h</span>
                </div>
                <div className="flex items-center gap-2 text-white/60">
                  <Phone size={14} className="text-primary" />
                  <span>(11) 98643-8100</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
