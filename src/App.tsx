import { useState, useEffect } from 'react';

// API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'https://render-backend-b78c.onrender.com';

interface CheckoutData {
  name: string;
  email: string;
  phone: string;
  taxId: string;
}

interface CheckoutResponse {
  pixCode: string;
  qrCodeUrl: string;
  paymentUrl: string;
}

function App() {
  const [countdown, setCountdown] = useState({
    hours: 23,
    minutes: 45,
    seconds: 30
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    name: '',
    email: '',
    phone: '',
    taxId: ''
  });

  // Countdown Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 23, minutes: 59, seconds: 59 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const showNotification = (message: string, type: 'success' | 'error') => {
    const notification = document.getElementById('notification');
    if (notification) {
      notification.textContent = message;
      notification.className = `notification ${type} show`;
      setTimeout(() => {
        notification.className = `notification ${type}`;
      }, 5000);
    }
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🚀 Enviando dados para checkout:', checkoutData);
      
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(checkoutData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.details || errorData.error || 'Erro no checkout');
      }

      const result: CheckoutResponse = await response.json();
      console.log('✅ Checkout realizado com sucesso:', result);
      
      showNotification('🎉 Pagamento gerado com sucesso! Você será redirecionado para o PIX.', 'success');
      
      // Redirecionar para URL de pagamento
      if (result.paymentUrl) {
        setTimeout(() => {
          window.open(result.paymentUrl, '_blank');
        }, 2000);
      }
      
      setShowModal(false);
      
    } catch (error) {
      console.error('❌ Erro no checkout:', error);
      showNotification(
        error instanceof Error ? error.message : 'Erro ao processar pagamento. Tente novamente.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification */}
      <div id="notification" className="notification"></div>
      
      {/* Modal */}
      {showModal && (
        <div className="modal active items-center justify-center">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
            
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                Último Passo!
              </h3>
              <p className="text-gray-600">
                Preencha seus dados para gerar o PIX de R$ 9,90
              </p>
            </div>

            <form onSubmit={handleCheckout} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  value={checkoutData.name}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="Seu nome completo"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={checkoutData.email}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="seu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={checkoutData.phone}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, phone: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="(11) 99999-9999"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  CPF
                </label>
                <input
                  type="text"
                  required
                  value={checkoutData.taxId}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, taxId: e.target.value }))}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none"
                  placeholder="000.000.000-00"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-bold py-4 rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processando...
                  </span>
                ) : (
                  <>🔥 GERAR QR CODE PIX R$ 9,90</>
                )}
              </button>

              <div className="text-center">
                <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                  <span>🔒</span>
                  <span>Pagamento 100% seguro</span>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #3b82f6 100%)'}}>
        {/* Floating Elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full flex items-center justify-center text-2xl animate-float">💰</div>
          <div className="absolute top-32 right-8 w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl animate-float" style={{animationDelay: '1s'}}>🧁</div>
          <div className="absolute bottom-20 left-16 w-12 h-12 bg-white rounded-full flex items-center justify-center text-lg animate-float" style={{animationDelay: '2s'}}>⭐</div>
          <div className="absolute top-1/2 right-20 w-14 h-14 bg-white rounded-full flex items-center justify-center text-xl animate-float" style={{animationDelay: '3s'}}>🎯</div>
        </div>
        
        <div className="container mx-auto px-4 py-8 text-center relative z-10">
          <div className="mb-6">
            <div className="inline-flex items-center bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full text-white font-bold mb-6">
              <span className="text-yellow-300 mr-2">✨</span>
              <span className="text-sm md:text-base">🔥 MÉTODO VALIDADO POR +5.000 ALUNAS</span>
              <span className="text-yellow-300 ml-2">✨</span>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-black text-white mb-8 leading-tight">
            TRANSFORME
            <span className="text-yellow-300 drop-shadow-2xl"> R$ 9,90</span><br/>
            EM ATÉ<br/>
            <span className="bg-gradient-to-r from-yellow-200 to-orange-200 bg-clip-text text-transparent">R$ 4.000/MÊS</span><br/>
            <span className="text-3xl md:text-4xl lg:text-5xl text-yellow-300">TRABALHANDO DE CASA! 🏠</span>
          </h1>
          
          <p className="text-xl md:text-3xl text-white/95 mb-8 max-w-4xl mx-auto font-bold leading-relaxed">
            🎯 O <span className="text-yellow-300 underline decoration-wavy">ÚNICO MÉTODO</span> que ensina
            <strong className="text-yellow-300 bg-white/20 px-2 py-1 rounded mx-1"> receitas secretas de confeitaria</strong> que 
            <strong className="text-orange-200">faturam até R$ 15.000 por mês</strong> mesmo para iniciantes!
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 justify-center items-center mb-12 max-w-4xl mx-auto">
            <div className="flex items-center text-white bg-white/20 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/30">
              <span className="text-yellow-300 mr-3 text-2xl">⭐</span>
              <div>
                <div className="font-black text-xl">4.9★</div>
                <div className="text-sm opacity-90">+2.847 Avaliações</div>
              </div>
            </div>
            <div className="flex items-center text-white bg-white/20 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/30">
              <span className="text-yellow-300 mr-3 text-2xl">👥</span>
              <div>
                <div className="font-black text-xl">5.247</div>
                <div className="text-sm opacity-90">Alunas Ativas</div>
              </div>
            </div>
            <div className="flex items-center text-white bg-white/20 px-6 py-4 rounded-2xl backdrop-blur-sm border border-white/30">
              <span className="text-yellow-300 mr-3 text-2xl">📈</span>
              <div>
                <div className="font-black text-xl">R$ 187k</div>
                <div className="text-sm opacity-90">Faturado Este Mês</div>
              </div>
            </div>
          </div>
          
          <div className="space-y-6 mb-16">
            <button onClick={() => document.getElementById('oferta')?.scrollIntoView({behavior: 'smooth'})} className="inline-block bg-white text-purple-600 font-black text-2xl px-12 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105">
              <span className="mr-3">▶️</span>
              🎥 ASSISTIR VÍDEO AGORA
            </button>
            
            <div className="text-white/90 text-sm">
              ⚡ <strong>ATENÇÃO:</strong> Vídeo disponível por tempo limitado!
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="mb-8">
              <div className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-full font-bold mb-6">
                <span className="mr-2">⏰</span>
                <span>🔥 VÍDEO EXCLUSIVO - DISPONÍVEL POR TEMPO LIMITADO</span>
                <span className="ml-2">⏰</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-4 gradient-text">
                👀 Veja Como Maria Faturou R$ 8.347
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Em apenas 45 dias vendendo brigadeiros gourmet na porta de casa
              </p>
            </div>
            
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-2xl mb-8">
              <iframe 
                src="https://www.youtube.com/embed/EwJ2IfHfMU8" 
                title="Confeitaria Lucrativa - Curso Completo"
                className="absolute inset-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
              </iframe>
            </div>
            
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-green-50 to-green-100 border-2 border-green-200 p-6 rounded-2xl max-w-2xl mx-auto">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-green-600 mr-2 text-2xl">✅</span>
                  <span className="text-green-800 font-bold text-lg">GARANTIA EXCLUSIVA:</span>
                </div>
                <p className="text-green-700 text-center">
                  Se em 7 dias você não conseguir fazer sua primeira venda, 
                  <strong> devolvemos 100% do seu dinheiro!</strong>
                </p>
              </div>
              
              <button onClick={() => document.getElementById('oferta')?.scrollIntoView({behavior: 'smooth'})} className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white font-black text-2xl px-16 py-6 rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-105 animate-pulse">
                <span className="mr-3">🚀</span>
                🚀 QUERO COMEÇAR AGORA!
              </button>
              
              <p className="text-sm text-gray-600">
                ⚡ Últimas 47 vagas disponíveis • Oferta expira em breve
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Offer Section */}
      <section id="oferta" className="py-20 bg-gradient-to-br from-purple-600 to-pink-600">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            {/* Countdown Timer */}
            <div className="mb-12">
              <div className="inline-flex items-center bg-red-500 text-white px-6 py-3 rounded-full font-bold mb-6">
                <span className="mr-2">⏰</span>
                <span>🔥 OFERTA EXPIRA EM:</span>
                <span className="ml-2">⏰</span>
              </div>
              
              <div className="flex justify-center space-x-4 mb-8">
                <div className="text-center">
                  <div className="countdown-box">
                    {String(countdown.hours).padStart(2, '0')}
                  </div>
                  <div className="text-white/80 text-sm font-semibold mt-2">HORAS</div>
                </div>
                <div className="text-center">
                  <div className="countdown-box">
                    {String(countdown.minutes).padStart(2, '0')}
                  </div>
                  <div className="text-white/80 text-sm font-semibold mt-2">MIN</div>
                </div>
                <div className="text-center">
                  <div className="countdown-box">
                    {String(countdown.seconds).padStart(2, '0')}
                  </div>
                  <div className="text-white/80 text-sm font-semibold mt-2">SEG</div>
                </div>
              </div>
            </div>
            
            <div className="mb-8">
              <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                🎯 OFERTA ESPECIAL
              </h2>
              <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto font-semibold">
                Acesso VITALÍCIO ao curso completo com <strong className="text-yellow-300">10 apostilas exclusivas</strong> 
                e suporte direto no WhatsApp!
              </p>
            </div>
            
            <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-2xl mx-auto mb-8">
              <div className="text-center">
                <div className="text-red-500 line-through text-2xl font-bold mb-2">
                  De R$ 297,00
                </div>
                <div className="text-6xl md:text-8xl font-black text-green-600 mb-4">
                  R$ 9,<span className="text-4xl">90</span>
                </div>
                <div className="text-gray-600 text-lg font-semibold mb-6">
                  ✅ Pagamento único • ✅ Acesso vitalício • ✅ Garantia de 7 dias
                </div>
                
                <button 
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white font-black text-xl md:text-2xl py-6 rounded-2xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105 shadow-xl"
                >
                  🔥 GERAR QR CODE PIX R$ 9,90
                </button>
                
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>🔒</span>
                    <span>Pagamento 100% seguro via PIX</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>⚡</span>
                    <span>Acesso liberado em até 5 minutos</span>
                  </div>
                  <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                    <span>💰</span>
                    <span>Garantia de 7 dias ou seu dinheiro de volta</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-white/90 text-center max-w-2xl mx-auto">
              <p className="mb-4">
                ⚡ <strong>ÚLTIMAS 47 VAGAS</strong> disponíveis neste preço!
              </p>
              <p className="text-sm">
                Após o preenchimento das vagas, o valor volta para R$ 297,00
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8">
            <h3 className="text-2xl font-bold mb-4">🍰 Confeitaria Lucrativa</h3>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Transformando vidas através da confeitaria desde 2020. 
              Mais de 5.000 alunas já mudaram suas realidades financeiras com nosso método!
            </p>
          </div>
          
          <div className="border-t border-gray-800 pt-8">
            <p className="text-gray-400 text-sm">
              © 2024 Confeitaria Lucrativa. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #f59e0b, #ef4444, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .modal {
          display: none;
          position: fixed;
          z-index: 1000;
          left: 0;
          top: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0,0,0,0.5);
        }
        
        .modal.active {
          display: flex;
        }
        
        .notification {
          display: none;
          position: fixed;
          top: 20px;
          right: 20px;
          z-index: 1001;
          padding: 15px 20px;
          border-radius: 8px;
          font-weight: 600;
          max-width: 400px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        .notification.success {
          background-color: #10b981;
          color: white;
        }
        
        .notification.error {
          background-color: #ef4444;
          color: white;
        }
        
        .notification.show {
          display: block;
          animation: slideIn 0.3s ease-out;
        }
        
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .countdown-box {
          background: white;
          color: #dc2626;
          padding: 8px 12px;
          border-radius: 8px;
          font-weight: 900;
          font-size: 1.5rem;
          min-width: 60px;
          text-align: center;
        }
      `}</style>
    </div>
  );
}

export default App;
