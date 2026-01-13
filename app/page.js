'use client';

import { useState, useRef, useEffect } from 'react';

export default function ChatbotPage() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Bonjour ! Je suis l\'assistant virtuel El Mazraa. Comment puis-je vous aider ?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([]);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          conversation_history: conversationHistory
        })
      });

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      setConversationHistory(data.conversation_history);
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        content: 'Désolé, une erreur est survenue. Veuillez réessayer ou nous contacter au +216 70 020 680.' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatMessage = (text) => {
    return text.replace(
      /(https?:\/\/[^\s]+)/g,
      '<a href="$1" target="_blank" rel="noopener noreferrer" style="color: #c8102e; text-decoration: none;">$1</a>'
    );
  };

  return (
    <>
      <style jsx global>{`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          background: linear-gradient(135deg, #f5f7fa 0%, #e4e8ec 100%);
          min-height: 100vh;
        }
        
        a:hover {
          text-decoration: underline !important;
        }
      `}</style>
      
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '900px',
        margin: '0 auto',
        background: 'white',
        boxShadow: '0 0 40px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <header style={{
          background: 'linear-gradient(135deg, #c8102e 0%, #a00d24 100%)',
          color: 'white',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}>
          <img 
            src="https://www.elmazraa.com/wp-content/themes/elmazeraa/images/logo-elmazraa.webp" 
            alt="El Mazraa"
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'white',
              padding: '8px',
              objectFit: 'contain'
            }}
          />
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '4px' }}>El Mazraa</h1>
            <p style={{ fontSize: '14px', opacity: '0.9' }}>Assistant Virtuel • Depuis 1968</p>
          </div>
        </header>

        {/* Messages */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
          background: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '80%'
              }}
            >
              <div style={{
                padding: '14px 18px',
                borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                background: msg.role === 'user' ? '#c8102e' : 'white',
                color: msg.role === 'user' ? 'white' : '#333',
                boxShadow: msg.role === 'assistant' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                fontSize: '15px',
                lineHeight: '1.6'
              }}
              dangerouslySetInnerHTML={{ __html: formatMessage(msg.content) }}
              />
            </div>
          ))}
          
          {isLoading && (
            <div style={{ alignSelf: 'flex-start' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: '20px 20px 20px 4px',
                background: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex',
                gap: '6px'
              }}>
                {[0, 1, 2].map(i => (
                  <span
                    key={i}
                    style={{
                      width: '10px',
                      height: '10px',
                      borderRadius: '50%',
                      background: '#ccc',
                      animation: 'bounce 1.4s infinite',
                      animationDelay: `${i * 0.2}s`
                    }}
                  />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} style={{
          padding: '16px 24px',
          background: 'white',
          borderTop: '1px solid #eee',
          display: 'flex',
          gap: '12px'
        }}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Écrivez votre message..."
            disabled={isLoading}
            style={{
              flex: 1,
              padding: '14px 20px',
              border: '2px solid #eee',
              borderRadius: '30px',
              fontSize: '15px',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => e.target.style.borderColor = '#c8102e'}
            onBlur={(e) => e.target.style.borderColor = '#eee'}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              border: 'none',
              background: isLoading || !input.trim() ? '#ccc' : '#c8102e',
              color: 'white',
              cursor: isLoading || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
            </svg>
          </button>
        </form>

        {/* Footer */}
        <footer style={{
          padding: '12px 24px',
          background: '#f8f9fa',
          borderTop: '1px solid #eee',
          textAlign: 'center',
          fontSize: '13px',
          color: '#666'
        }}>
          <a href="https://www.elmazraa.com" target="_blank" rel="noopener noreferrer" style={{ color: '#c8102e', textDecoration: 'none' }}>
            www.elmazraa.com
          </a>
          {' • '}
          <a href="tel:+21670020680" style={{ color: '#666', textDecoration: 'none' }}>+216 70 020 680</a>
          {' • '}
          <a href="mailto:info@elmazraa.com.tn" style={{ color: '#666', textDecoration: 'none' }}>info@elmazraa.com.tn</a>
        </footer>
      </div>

      <style jsx>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); background: #ccc; }
          30% { transform: translateY(-8px); background: #c8102e; }
        }
      `}</style>
    </>
  );
}
