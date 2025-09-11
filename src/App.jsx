import React, { useState } from 'react';

const API_URL = 'https://render-backend-b78c.onrender.com';

function App() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    taxId: ''
  });
  const [showPayment, setShowPayment] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  const showNotification = (type, message) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🚀 Enviando dados:', formData);
      
      const response = await fetch(`${API_URL}/api/checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      console.log('📥 Resposta:', result);

      if (!response.ok) {
        throw new Error(result.details || result.error || 'Erro ao processar');
      }

      setPaymentData(result);
      setShowPayment(true);
      showNotification('success', 'QR Code gerado! Escaneie para pagar');

    } catch (error) {
      console.error('❌ Erro:', error);
      showNotification('error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkPayment = async () => {
    if (!paymentData?.pixId) return;

    try {
      const response = await fetch(`${API_URL}/api/payment/check/${paymentData.pixId}`, {
        credentials: 'include'
      });
      
      const result = await response.json();
      
      if (result.isPaid) {
        showNotification('success', 'Pagamento confirmado! Redirecionando...');
        setTimeout(() => {
          window.location.href = 'https://wa.me/5511999999999?text=Olá! Acabei de fazer o pagamento do curso de confeitaria';
        }, 2000);
      } else {
        showNotification('info', 'Pagamento ainda não confirmado');
      }
    } catch (error) {
      console.error('❌ Erro ao verificar:', error);
      showNotification('error', 'Erro ao verificar pagamento');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '20px'
    }}>
      {/* Notification */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          zIndex: 1000,
          padding: '16px',
          borderRadius: '8px',
          color: 'white',
          background: notification.type === 'success' ? '#10b981' : 
                     notification.type === 'error' ? '#ef4444' : '#3b82f6'
        }}>
          {notification.message}
        </div>
      )}

      <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        
        {!showPayment ? (
          // Form Section
          <>
            <div style={{ marginBottom: '40px' }}>
              <div style={{
                background: 'rgba(255,255,255,0.1)',
                padding: '12px 24px',
                borderRadius: '50px',
                display: 'inline-block',
                marginBottom: '20px'
              }}>
                🔥 MÉTODO VALIDADO POR +5.000 ALUNAS
              </div>
              
              <h1 style={{ 
                fontSize: '3rem', 
                fontWeight: 'bold', 
                marginBottom: '20px',
                lineHeight: '1.1'
              }}>
                TRANSFORME
                <span style={{ color: '#fbbf24' }}> R$ 9,90</span><br/>
                EM ATÉ<br/>
                <span style={{ color: '#fbbf24' }}>R$ 4.000/MÊS</span><br/>
                <span style={{ fontSize: '2rem' }}>TRABALHANDO DE CASA! 🏠</span>
              </h1>
              
              <p style={{ 
                fontSize: '1.25rem', 
                marginBottom: '30px',
                maxWidth: '600px',
                margin: '0 auto 30px'
              }}>
                🎯 O ÚNICO MÉTODO que ensina receitas secretas de confeitaria que 
                faturam até R$ 15.000 por mês mesmo para iniciantes!
              </p>
            </div>

            {/* Offer Box */}
            <div style={{
              background: 'white',
              color: '#333',
              padding: '40px',
              borderRadius: '20px',
              marginBottom: '40px',
              border: '4px solid #fbbf24'
            }}>
              <div style={{
                background: '#ef4444',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '20px',
                display: 'inline-block',
                marginBottom: '20px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                🔥 OFERTA RELÂMPAGO!
              </div>
              
              <h2 style={{ 
                fontSize: '2.5rem', 
                fontWeight: 'bold', 
                marginBottom: '20px',
                color: '#7c3aed'
              }}>
                🏆 CONFEITARIA LUCRATIVA
              </h2>
              
              <div style={{
                background: '#fef3c7',
                padding: '20px',
                borderRadius: '12px',
                marginBottom: '20px',
                border: '2px solid #fbbf24'
              }}>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: 'bold', 
                  color: '#92400e',
                  marginBottom: '8px'
                }}>
                  🎉 PROMOÇÃO DE LANÇAMENTO!
                </h3>
                <p style={{ color: '#a16207', fontSize: '1.1rem' }}>
                  Apenas para as primeiras 17 clientes que comprarem hoje!
                </p>
              </div>
              
              <div style={{ marginBottom: '30px' }}>
                <div style={{ fontSize: '3rem', marginBottom: '10px' }}>🎁</div>
                <div style={{
                  background: '#f3f4f6',
                  padding: '20px',
                  borderRadius: '12px'
                }}>
                  <div style={{ 
                    fontSize: '1.25rem', 
                    textDecoration: 'line-through', 
                    color: '#ef4444',
                    marginBottom: '8px'
                  }}>
                    De R$ 297,00
                  </div>
                  <div style={{ 
                    fontSize: '3rem', 
                    fontWeight: 'bold', 
                    color: '#10b981',
                    marginBottom: '8px'
                  }}>
                    R$ 9,90
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                    Pagamento único • Sem mensalidades
                  </div>
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="Seu nome completo"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="seu@email.com"
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    WhatsApp *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="(11) 99999-9999"
                  />
                </div>

                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                    CPF *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.taxId}
                    onChange={(e) => setFormData({...formData, taxId: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                    placeholder="000.000.000-00"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #10b981, #059669)',
                    color: 'white',
                    fontWeight: 'bold',
                    fontSize: '1.25rem',
                    padding: '16px',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    boxShadow: '0 8px 16px rgba(16, 185, 129, 0.3)'
                  }}
                >
                  {loading ? '⏳ Gerando PIX...' : '💳 GARANTIR MINHA VAGA AGORA!'}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: '20px' }}>
                <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '8px' }}>
                  🔒 Compra 100% segura • SSL e dados criptografados
                </p>
                <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                  💳 Pagamento via PIX • Aprovação instantânea
                </p>
              </div>
            </div>
          </>
        ) : (
          // Payment Section
          <div style={{
            background: 'white',
            color: '#333',
            padding: '40px',
            borderRadius: '20px',
            textAlign: 'center'
          }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '20px',
              color: '#7c3aed'
            }}>
              🎯 Finalize seu Pagamento
            </h2>
            
            <div style={{
              background: '#dcfce7',
              border: '2px solid #22c55e',
              padding: '20px',
              borderRadius: '12px',
              marginBottom: '30px'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>✅</div>
              <h3 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                color: '#15803d',
                marginBottom: '8px'
              }}>
                PIX Gerado com Sucesso!
              </h3>
              <p style={{ color: '#166534', fontSize: '1.1rem' }}>
                Escaneie o QR Code ou copie o código PIX para pagar
              </p>
            </div>

            {paymentData?.qrCodeUrl && (
              <div style={{ marginBottom: '30px' }}>
                <img 
                  src={`data:image/png;base64,${paymentData.qrCodeUrl}`}
                  alt="QR Code PIX"
                  style={{
                    maxWidth: '250px',
                    width: '100%',
                    border: '4px solid #e5e7eb',
                    borderRadius: '12px'
                  }}
                />
              </div>
            )}

            {paymentData?.pixCode && (
              <div style={{ marginBottom: '30px' }}>
                <label style={{ 
                  display: 'block', 
                  marginBottom: '8px', 
                  fontWeight: 'bold',
                  color: '#374151'
                }}>
                  Ou copie o código PIX:
                </label>
                <div style={{
                  background: '#f9fafb',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '0.9rem',
                  wordBreak: 'break-all',
                  fontFamily: 'monospace'
                }}>
                  {paymentData.pixCode}
                </div>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(paymentData.pixCode);
                    showNotification('success', 'Código PIX copiado!');
                  }}
                  style={{
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    marginTop: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem'
                  }}
                >
                  📋 Copiar Código
                </button>
              </div>
            )}

            <div style={{ 
              background: '#fef3c7',
              border: '2px solid #f59e0b',
              padding: '16px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <p style={{ color: '#92400e', fontWeight: 'bold' }}>
                💰 Valor: R$ 9,90 • ⏰ Válido por 24 horas
              </p>
            </div>

            <button
              onClick={checkPayment}
              style={{
                background: '#10b981',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                padding: '12px 24px',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              🔄 Verificar Pagamento
            </button>

            <p style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              Após o pagamento, clique em "Verificar Pagamento" para confirmar
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
