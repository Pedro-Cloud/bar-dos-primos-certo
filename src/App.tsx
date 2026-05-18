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
  MessageSquare
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

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
  // Drinks
  { id: 'd1', name: 'Chopp Pilsen Extra', price: 'R$ 14', description: 'Chopp gelado em caneca zero grau.', category: 'drinks', popular: true },
  { id: 'd2', name: 'IPA Artesanal da Casa', price: 'R$ 18', description: 'Notas cítricas e amargor equilibrado.', category: 'drinks' },
  // Cocktails
  { id: 'c1', name: 'Negroni Defumado', price: 'R$ 32', description: 'Gin premium, Vermute e Campari com fumaça de carvalho.', category: 'cocktails', chefChoice: true },
  { id: 'c2', name: 'Mula de Moscou (Primos)', price: 'R$ 28', description: 'Versão especial com espuma de gengibre artesanal.', category: 'cocktails', popular: true },
  // Platters
  { id: 'p1', name: 'Tábua dos Primos', price: 'R$ 89', description: 'Mix de carnes defumadas, queijos artesanais e pães da casa.', category: 'platters', popular: true },
  { id: 'p2', name: 'Bolinho de Costela', price: 'R$ 42', description: '6 unidades recheadas com costela desfiada e queijo.', category: 'platters' },
  // Mains
  { id: 'm1', name: 'Hambúrguer Defumado', price: 'R$ 46', description: '200g de blend bovino, cheddar real e bacon crocante.', category: 'mains', chefChoice: true },
  { id: 'm2', name: 'Filé com Aligot', price: 'R$ 72', description: 'Medalhão de filé mignon com purê elástico de queijos.', category: 'mains' },
];

const REVIEWS = [
  { name: 'Lucas Silva', rating: 5, comment: 'Melhor lugar de SP! O bolinho de costela é imbatível.', date: 'Há 2 dias' },
  { name: 'Mariana Costa', rating: 5, comment: 'Drinks maravilhosos e trilha sonora impecável. Voltarei sempre!', date: 'Há 1 semana' },
  { name: 'Rafael Oliveira', rating: 4, comment: 'Atendimento rápido mesmo na sexta à noite. Estão de parabéns.', date: 'Há 2 semanas' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<MenuItem['category']>('platters');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOpenNow, setIsOpenNow] = useState(false);
  const [reservationStep, setReservationStep] = useState(1);
  const [isScrolled, setIsScrolled] = useState(false);

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
    "telephone": "+551199999999",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Rua das Palmeiras, 123",
      "addressLocality": "São Paulo",
      "addressRegion": "SP",
      "postalCode": "01226-010",
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
          <div className="flex items-center gap-2">
            <Beer className="text-primary w-8 h-8" />
            <span className="font-display font-bold text-2xl tracking-tighter uppercase italic">Bar dos Primos</span>
          </div>
          
          <div className="hidden md:flex items-center gap-8 font-medium">
            <a href="#menu" className="hover:text-primary transition-colors">Cardápio</a>
            <a href="#vibe" className="hover:text-primary transition-colors">Vibe</a>
            <a href="#contato" className="hover:text-primary transition-colors">Localização</a>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="bg-primary hover:bg-accent text-charcoal-dark px-6 py-2.5 rounded-full font-bold transition-all shadow-lg active:scale-95"
            >
              Reservar Mesa
            </button>
          </div>

          <button className="md:hidden text-white" aria-label="Menu">
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
            
            <p className="text-lg text-white/70 max-w-md mb-10 leading-relaxed">
              Onde o rústico encontra o moderno. Gastronomia de autor, canecas zero grau e o melhor clima de SP.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => setIsModalOpen(true)}
                className="bg-primary hover:bg-accent text-charcoal-dark px-10 py-4 rounded-full font-bold text-lg transition-all shadow-2xl flex items-center justify-center gap-2"
              >
                Reservar agora
                <ChevronRight size={20} />
              </button>
              <a 
                href="#menu"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white px-10 py-4 rounded-full font-bold text-lg transition-all flex items-center justify-center"
              >
                Ver Cardápio
              </a>
            </div>

            <div className="mt-12 flex items-center gap-6">
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
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {[ 
              { id: 'platters', label: 'Petiscos', icon: Utensils },
              { id: 'mains', label: 'Principais', icon: MenuIcon },
              { id: 'drinks', label: 'Chopps', icon: Beer },
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
                <button className="flex items-center gap-3 bg-white/5 hover:bg-white/10 px-6 py-4 rounded-xl border border-white/10 transition-all">
                  <Instagram className="text-pink-500" />
                  <span className="font-bold">Siga a @bardosprimos no IG</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 relative">
              <div className="space-y-4">
                <img src="https://images.unsplash.com/photo-1574096079513-d8259312b785?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[300px] object-cover hover:scale-[1.02] transition-transform" alt="Bar food" />
                <img src="https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[200px] object-cover hover:scale-[1.02] transition-transform" alt="Cocktails" />
              </div>
              <div className="space-y-4 pt-8">
                <img src="https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[200px] object-cover hover:scale-[1.02] transition-transform" alt="Bar interior" />
                <img src="https://images.unsplash.com/photo-1536935338218-84ca21616c21?auto=format&fit=crop&q=80&w=600" className="rounded-2xl w-full h-[300px] object-cover hover:scale-[1.02] transition-transform" alt="Crowd" />
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
              <div className="flex items-center gap-2 mb-6">
                <Beer className="text-primary w-8 h-8" />
                <span className="font-display font-bold text-2xl tracking-tighter uppercase italic">Bar dos Primos</span>
              </div>
              <p className="text-white/40 mb-8 max-w-xs">Unindo amigos e compartilhando histórias desde 2018.</p>
              <div className="flex items-center gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-charcoal-dark transition-all"><Instagram size={20} /></a>
                <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary hover:text-charcoal-dark transition-all"><MessageSquare size={20} /></a>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><MapPin size={18} className="text-primary" /> Localização</h4>
              <p className="text-white/60 mb-2">Rua das Palmeiras, 123</p>
              <p className="text-white/60">Santa Cecília, São Paulo - SP</p>
              <a href="#" className="text-primary text-sm font-bold mt-4 inline-block hover:underline">Abrir no Maps</a>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 flex items-center gap-2"><Clock size={18} className="text-primary" /> Horários</h4>
              <ul className="text-white/60 space-y-2">
                <li className="flex justify-between"><span>Ter - Qui</span> <span className="font-bold text-primary">17h - 01h</span></li>
                <li className="flex justify-between"><span>Sex - Sáb</span> <span className="font-bold text-primary">17h - 03h</span></li>
                <li className="flex justify-between"><span>Dom</span> <span className="font-bold text-primary">16h - 23h</span></li>
                <li className="flex justify-between text-white/20"><span>Segunda</span> <span>Fechado</span></li>
              </ul>
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
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-charcoal/80 backdrop-blur-xl border-t border-white/10 px-6 py-4 flex justify-between items-center">
        <a href="#menu" className="flex flex-col items-center gap-1 text-white/60 hover:text-primary transition-colors">
          <Utensils size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Menu</span>
        </a>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-charcoal-dark px-8 py-3 rounded-full font-bold shadow-lg transform -translate-y-6 border-4 border-charcoal-dark active:scale-95 transition-all"
        >
          Reserva
        </button>
        <a href="tel:+551199999999" className="flex flex-col items-center gap-1 text-white/60 hover:text-primary transition-colors">
          <Phone size={20} />
          <span className="text-[10px] font-bold uppercase tracking-widest">Ligar</span>
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
                onClick={() => { setIsModalOpen(false); setReservationStep(1); }}
                className="absolute top-4 right-4 text-white/40 hover:text-white"
              >
                <X />
              </button>

              <div className="p-8">
                {reservationStep === 1 ? (
                  <>
                    <h3 className="font-display text-3xl font-bold mb-2">Reservar Mesa</h3>
                    <p className="text-white/50 mb-8 text-sm italic">Garanta seu lugar na melhor atmosfera de SP.</p>
                    
                    <div className="space-y-6">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Data</label>
                          <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input type="date" className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary" />
                          </div>
                        </div>
                        <div className="w-32">
                          <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Pessoas</label>
                          <div className="relative">
                            <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
                            <input type="number" defaultValue={2} min={1} max={20} className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-primary" />
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Horário disponível</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['19:00', '19:30', '20:00', '20:30', '21:00', '21:30'].map(time => (
                            <button key={time} className="bg-white/5 border border-white/10 hover:border-primary rounded-lg py-2 text-sm font-medium transition-colors">
                              {time}
                            </button>
                          ))}
                        </div>
                      </div>

                      <button 
                        onClick={() => setReservationStep(2)}
                        className="w-full bg-primary text-charcoal-dark font-bold py-4 rounded-xl shadow-lg mt-4 active:scale-95 transition-transform"
                      >
                        Continuar
                      </button>
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
                    <p className="text-white/60 mb-8 leading-relaxed">Sua mesa foi pré-reservada. Enviamos um link de confirmação para o seu WhatsApp/E-mail.</p>
                    <button 
                      onClick={() => { setIsModalOpen(false); setReservationStep(1); }}
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
    </div>
  );
}
