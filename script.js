// API Configuration
const API_URL = 'https://render-backend-b78c.onrender.com';

// Global variables
let paymentData = null;
let checkingPayment = false;

// Utility Functions
function scrollToOffer() {
    document.getElementById('oferta').scrollIntoView({ behavior: 'smooth' });
}

function scrollToVideo() {
    document.getElementById('video').scrollIntoView({ behavior: 'smooth' });
}

function handleStickyButton() {
    window.addEventListener('scroll', function() {
        const stickyButton = document.getElementById('sticky-cta');
        if (window.scrollY > 100) {
            stickyButton.style.display = 'block';
        } else {
            stickyButton.style.display = 'none';
        }
    });
}

// Toast Notification System
function showToast(type, title, description) {
    const toast = document.getElementById('toast-notification');
    const icon = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const descEl = document.getElementById('toast-description');
    
    // Set icon based on type
    if (type === 'success') {
        icon.innerHTML = '<i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>';
        toast.className = toast.className.replace(/bg-\w+-500/, 'bg-green-500');
    } else if (type === 'error') {
        icon.innerHTML = '<i data-lucide="x-circle" class="w-5 h-5 text-red-600"></i>';
        toast.className = toast.className.replace(/bg-\w+-500/, 'bg-red-500');
    } else {
        icon.innerHTML = '<i data-lucide="info" class="w-5 h-5 text-blue-600"></i>';
        toast.className = toast.className.replace(/bg-\w+-500/, 'bg-blue-500');
    }
    
    titleEl.textContent = title;
    descEl.textContent = description;
    
    // Show toast
    toast.style.display = 'block';
    setTimeout(() => {
        toast.classList.remove('-translate-x-full', 'opacity-0');
        toast.classList.add('translate-x-0', 'opacity-100');
    }, 100);
    
    // Auto hide after 5 seconds
    setTimeout(() => hideToast(), 5000);
    
    // Recreate icons
    lucide.createIcons();
}

function hideToast() {
    const toast = document.getElementById('toast-notification');
    toast.classList.add('-translate-x-full', 'opacity-0');
    toast.classList.remove('translate-x-0', 'opacity-100');
    
    setTimeout(() => {
        toast.style.display = 'none';
    }, 300);
}

// Purchase Notification System
function startPurchaseNotifications() {
    const notifications = [
        { name: "Ana C.", location: "Rio de Janeiro, RJ", time: "3 min" },
        { name: "Mariana S.", location: "São Paulo, SP", time: "7 min" },
        { name: "Carla M.", location: "Belo Horizonte, MG", time: "12 min" },
        { name: "Juliana R.", location: "Porto Alegre, RS", time: "18 min" },
        { name: "Beatriz L.", location: "Curitiba, PR", time: "25 min" },
        { name: "Fernanda O.", location: "Salvador, BA", time: "31 min" },
        { name: "Patricia N.", location: "Recife, PE", time: "38 min" },
        { name: "Luciana K.", location: "Fortaleza, CE", time: "44 min" }
    ];
    
    let currentIndex = 0;
    
    function showPurchaseNotification() {
        const notification = document.getElementById('purchase-notification');
        const nameEl = document.getElementById('notification-name');
        const locationEl = document.getElementById('notification-location');
        const timeEl = document.getElementById('notification-time');
        
        const currentNotification = notifications[currentIndex];
        nameEl.textContent = currentNotification.name;
        locationEl.textContent = currentNotification.location;
        timeEl.textContent = currentNotification.time;
        
        // Show notification
        notification.style.display = 'block';
        setTimeout(() => {
            notification.classList.remove('translate-y-full', 'opacity-0');
            notification.classList.add('translate-y-0', 'opacity-100');
        }, 100);
        
        // Hide after 4 seconds
        setTimeout(() => {
            notification.classList.add('translate-y-full', 'opacity-0');
            notification.classList.remove('translate-y-0', 'opacity-100');
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 500);
        }, 4000);
        
        currentIndex = (currentIndex + 1) % notifications.length;
    }
    
    // Show first notification after 5 seconds
    setTimeout(showPurchaseNotification, 5000);
    
    // Show subsequent notifications every 15 seconds
    setInterval(showPurchaseNotification, 15000);
    
    // Recreate icons
    lucide.createIcons();
}

// Input Formatting
function formatCPF(value) {
    const numbers = value.replace(/\D/g, '');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
}

function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 11) {
        return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else {
        return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
}

// Form Validation
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const taxId = document.getElementById('taxId').value.trim();
    
    let isValid = true;
    
    // Clear previous errors
    document.querySelectorAll('[id$="-error"]').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
    
    // Validate name
    if (name.length < 2) {
        document.getElementById('name-error').textContent = 'Nome deve ter pelo menos 2 caracteres';
        document.getElementById('name-error').classList.remove('hidden');
        isValid = false;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        document.getElementById('email-error').textContent = 'Email inválido';
        document.getElementById('email-error').classList.remove('hidden');
        isValid = false;
    }
    
    // Validate phone
    const phoneNumbers = phone.replace(/\D/g, '');
    if (phoneNumbers.length < 10) {
        document.getElementById('phone-error').textContent = 'Telefone inválido';
        document.getElementById('phone-error').classList.remove('hidden');
        isValid = false;
    }
    
    // Validate CPF
    const taxIdNumbers = taxId.replace(/\D/g, '');
    if (taxIdNumbers.length !== 11) {
        document.getElementById('taxId-error').textContent = 'CPF deve ter 11 dígitos';
        document.getElementById('taxId-error').classList.remove('hidden');
        isValid = false;
    }
    
    return isValid;
}

// Checkout Functions
function openCheckout() {
    document.getElementById('checkout-modal').classList.remove('hidden');
    // Reset form
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('payment-section').classList.add('hidden');
    document.getElementById('modal-title').textContent = '🚀 Adquira Agora - R$ 9,90';
    document.getElementById('generate-qr-btn').style.display = 'inline-flex';
    paymentData = null;
}

function closeCheckout() {
    document.getElementById('checkout-modal').classList.add('hidden');
    // Reset form
    document.querySelector('form').reset();
    document.getElementById('checkout-form').style.display = 'block';
    document.getElementById('payment-section').classList.add('hidden');
    document.querySelectorAll('[id$="-error"]').forEach(el => {
        el.classList.add('hidden');
        el.textContent = '';
    });
    paymentData = null;
}

async function processCheckout() {
    if (!validateForm()) {
        return;
    }
    
    const formData = {
        name: document.getElementById('name').value.trim(),
        email: document.getElementById('email').value.trim(),
        phone: document.getElementById('phone').value.replace(/\D/g, ''),
        taxId: document.getElementById('taxId').value.replace(/\D/g, '')
    };
    
    // Show loading state
    const generateBtn = document.getElementById('generate-qr-btn');
    const originalText = generateBtn.innerHTML;
    generateBtn.innerHTML = '<i data-lucide="loader-2" class="w-5 h-5 mr-2 animate-spin"></i>Gerando QR Code...';
    generateBtn.disabled = true;
    
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
            throw new Error(result.details || result.error || 'Erro ao processar pagamento');
        }
        
        paymentData = result;
        showPaymentSection();
        showToast('success', 'QR Code gerado!', 'Escaneie o código QR ou copie o código PIX para pagar');
        
    } catch (error) {
        console.error('❌ Erro:', error);
        showToast('error', 'Erro ao processar pagamento', error.message);
    } finally {
        // Reset button
        generateBtn.innerHTML = originalText;
        generateBtn.disabled = false;
        lucide.createIcons();
    }
}

function showPaymentSection() {
    // Hide form, show payment
    document.getElementById('checkout-form').style.display = 'none';
    document.getElementById('payment-section').classList.remove('hidden');
    document.getElementById('modal-title').textContent = '🎯 Finalize seu Pagamento';
    document.getElementById('generate-qr-btn').style.display = 'none';
    
    // Display QR Code
    if (paymentData.qrCodeUrl) {
        const qrContainer = document.getElementById('qr-code-container');
        qrContainer.innerHTML = `
            <img src="${paymentData.qrCodeUrl}" alt="QR Code PIX" 
                 class="w-64 h-64 border-2 border-gray-300 rounded-lg mx-auto">
        `;
    }
    
    // Display PIX Code
    if (paymentData.pixCode) {
        document.getElementById('pix-code-container').classList.remove('hidden');
        document.getElementById('pix-code-display').textContent = paymentData.pixCode;
    }
}

function copyPixCode() {
    if (paymentData?.pixCode) {
        navigator.clipboard.writeText(paymentData.pixCode).then(() => {
            showToast('success', 'Código PIX copiado!', 'Cole no seu app do banco para pagar');
        });
    }
}

async function checkPayment() {
    if (!paymentData?.pixId) return;
    
    const checkBtn = document.getElementById('check-payment-btn');
    checkBtn.disabled = true;
    checkBtn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 mr-2 animate-spin"></i>Verificando...';
    
    try {
        const response = await fetch(`${API_URL}/api/payment/check/${paymentData.pixId}`, {
            credentials: 'include'
        });
        
        const result = await response.json();
        
        if (result.isPaid) {
            showToast('success', 'Pagamento confirmado!', 'Redirecionando para o acesso ao curso...');
            
            setTimeout(() => {
                window.location.href = 'https://confeitaria-obrigado.netlify.app/';
            }, 2000);
        } else {
            showToast('error', 'Pagamento ainda não confirmado', 'Verifique se o pagamento foi efetuado e tente novamente');
        }
    } catch (error) {
        console.error('❌ Erro ao verificar:', error);
        showToast('error', 'Erro ao verificar pagamento', 'Tente novamente em alguns segundos');
    } finally {
        checkBtn.disabled = false;
        checkBtn.innerHTML = '✅ Já efetuei o pagamento';
        lucide.createIcons();
    }
}

// Input formatting event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Format phone input
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }
    
    // Format CPF input
    const taxIdInput = document.getElementById('taxId');
    if (taxIdInput) {
        taxIdInput.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }
});
