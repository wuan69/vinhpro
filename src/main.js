import AOS from 'aos';
import 'aos/dist/aos.css';
import { createIcons, icons } from 'lucide';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Initialize Animations
  AOS.init({
    duration: 800,
    easing: 'ease-out-cubic',
    once: true,
    offset: 50
  });

  // 2. Initialize Icons
  createIcons({ icons });

  // 3. Navigation Scroll Effect
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('glass');
      navbar.classList.remove('bg-transparent');
    } else {
      navbar.classList.remove('glass');
      navbar.classList.add('bg-transparent');
    }
  });

  // Mobile Menu Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 4. Modal Logic
  const modal = document.getElementById('register-modal');
  const modalOverlay = document.getElementById('modal-overlay');
  const modalContent = document.getElementById('modal-content');
  const openBtns = document.querySelectorAll('.open-modal-btn');
  const closeBtn = document.getElementById('close-modal-btn');

  const openModal = () => {
    if (!modal) return;
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    
    // Trigger animation next frame
    requestAnimationFrame(() => {
      modalOverlay?.classList.add('active');
      modalContent?.classList.add('active');
    });
  };

  const closeModal = () => {
    if (!modal) return;
    modalOverlay?.classList.remove('active');
    modalContent?.classList.remove('active');
    
    setTimeout(() => {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }, 300);
  };

  openBtns.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openModal();
  }));
  
  closeBtn?.addEventListener('click', closeModal);
  modalOverlay?.addEventListener('click', closeModal);

  // 5. Form Handling with Validation and API Submission
  const handleForm = (formId, sourceName) => {
    const form = document.getElementById(formId);
    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.innerHTML;
      const phoneInput = form.querySelector('input[name="phone"]');

      // Vietnam Phone Validation
      const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
      if (!phoneRegex.test(phoneInput.value.replace(/\s+/g, ''))) {
        showToast('Please enter a valid Vietnam phone number.', 'error');
        phoneInput.focus();
        return;
      }

      // UX: Loading state
      btn.disabled = true;
      btn.innerHTML = '<i data-lucide="loader-2" class="animate-spin w-5 h-5 mr-2 inline"></i> Sending...';
      createIcons({ icons });

      const formData = new FormData(form);
      const data = Object.fromEntries(formData.entries());
      data.source = sourceName;

      try {
        const res = await fetch('/.netlify/functions/sendTelegram', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        if (res.ok) {
          showToast('Success! Your message has been sent.', 'success');
          form.reset();
          if (sourceName === 'Registration Modal') {
            closeModal();
          }
        } else {
          throw new Error('Server returned an error');
        }
      } catch (error) {
        console.error(error);
        showToast('Something went wrong. Please try again later.', 'error');
      } finally {
        btn.disabled = false;
        btn.innerHTML = originalText;
        createIcons({ icons });
      }
    });
  };

  handleForm('modal-form', 'Registration Modal');
  handleForm('consultation-form', 'Consultation Footer');

  // 6. Toast Notification System
  function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `fixed bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full text-white font-medium shadow-lg z-50 transform transition-all duration-300 translate-y-10 opacity-0 flex items-center gap-2 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'}`;
    
    toast.innerHTML = `
      <i data-lucide="${type === 'success' ? 'check-circle' : 'alert-circle'}" class="w-5 h-5"></i>
      ${message}
    `;
    
    document.body.appendChild(toast);
    createIcons({ icons });
    
    // Animate in
    requestAnimationFrame(() => {
      toast.classList.remove('translate-y-10', 'opacity-0');
    });
    
    // Remove after 3 seconds
    setTimeout(() => {
      toast.classList.add('translate-y-10', 'opacity-0');
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }
});
