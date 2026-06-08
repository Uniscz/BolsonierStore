import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, MapPin } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    alert('Obrigado pela mensagem! Entraremos em contato em breve.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-4">Contato</h1>
          <p className="text-xl">Fale conosco. Estamos aqui para ouvir.</p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <Mail size={40} className="mx-auto mb-4 text-pink-shock" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Email</h3>
              <p className="text-gray-600">contato@bolsonierstore.com</p>
            </div>
            <div className="text-center">
              <MessageCircle size={40} className="mx-auto mb-4 text-lime-acid" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">WhatsApp</h3>
              <p className="text-gray-600">(11) 99999-9999</p>
            </div>
            <div className="text-center">
              <MapPin size={40} className="mx-auto mb-4 text-pink-shock" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Localizacao</h3>
              <p className="text-gray-600">Sao Paulo, Brasil</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold tracking-wider mb-8 uppercase text-center">Envie uma Mensagem</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-bold tracking-wider mb-2 uppercase">Nome</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-black px-4 py-3 font-medium focus:outline-none focus:bg-lime-acid transition-colors"
                  placeholder="Seu nome"
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wider mb-2 uppercase">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-black px-4 py-3 font-medium focus:outline-none focus:bg-lime-acid transition-colors"
                  placeholder="seu@email.com"
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wider mb-2 uppercase">Assunto</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full border-2 border-black px-4 py-3 font-medium focus:outline-none focus:bg-lime-acid transition-colors"
                  placeholder="Assunto da mensagem"
                />
              </div>
              <div>
                <label className="block text-sm font-bold tracking-wider mb-2 uppercase">Mensagem</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full border-2 border-black px-4 py-3 font-medium focus:outline-none focus:bg-lime-acid transition-colors resize-none"
                  placeholder="Sua mensagem aqui..."
                />
              </div>
              <button
                type="submit"
                className="w-full bg-pink-shock text-white px-8 py-4 font-bold tracking-wider hover:bg-black transition-colors duration-200 uppercase text-lg"
              >
                Enviar Mensagem
              </button>
            </form>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
