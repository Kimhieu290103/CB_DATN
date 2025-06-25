import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons'
const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);
  const token = useSelector((state) => state.auth.login.token);
  const name = useSelector((state) => state.auth.login.username || 'Người dùng');

  const appendMessage = (content, sender) => {
    setMessages(prev => [...prev, { content, sender }]);
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };
const handleOutput = (output) => {
  try {
    const jsonStart = output.indexOf('{');
    const jsonEnd = output.lastIndexOf('}');

    if (jsonStart !== -1 && jsonEnd !== -1 && jsonEnd > jsonStart) {
      const jsonString = output.substring(jsonStart, jsonEnd + 1);
      const parsed = JSON.parse(jsonString);

      if (parsed.description) {
        // Lấy phần text trước đoạn JSON (ví dụ: "Nội dung chi tiết:\n")
        const beforeJson = output.substring(0, jsonStart);

        // Lấy phần text sau đoạn JSON (ví dụ: "Nếu bạn đồng ý ...")
        const afterJson = output.substring(jsonEnd + 1);

        // Kết hợp lại: phần trước + description + phần sau
        const finalOutput = beforeJson.trim() + '\n' + parsed.description.trim() + '\n' + afterJson.trim();

        appendMessage(finalOutput, 'bot');
        return;
      }
    }
    
    // Nếu không parse được JSON, hiển thị nguyên bản
    appendMessage(output, 'bot');

  } catch (e) {
    console.error('Lỗi xử lý JSON:', e);
    appendMessage(output, 'bot');
  }
};



  const sendMessage = async () => {
    const text = input.trim();
    if (!text || !token) {
      if (!token) appendMessage('Bạn chưa đăng nhập.', 'bot');
      return;
    }

    appendMessage(text, 'user');
    setInput('');

    try {
      const response = await fetch('http://localhost:5678/webhook/9abad9d4-2660-4564-878e-ad9d0ea61cde', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: token,
          name,
          chatInput: text
        }),
      });

      const data = await response.json();
      if (Array.isArray(data)) {
        data.forEach(d => handleOutput(d.output, 'bot'));
      } else {
        handleOutput(data.output || 'Không có phản hồi', 'bot');
      }
    } catch (err) {
      console.error(err);
      appendMessage('Lỗi khi gửi tin nhắn.', 'bot');
    }
  };

  return (
    <>
      <button
        id="chat-button"
        style={styles.chatButton}
        onClick={() => setIsOpen(!isOpen)}
      >
        <FontAwesomeIcon icon={faComment} />

      </button>

      {isOpen && (
        <div id="chat-box" style={styles.chatBox}>
          <div id="chat-messages" style={styles.chatMessages}>
            {messages.map((msg, idx) => (
              <div
                key={idx}
                style={{
                  ...styles.message,
                  alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.sender === 'user' ? '#007bff' : '#f1f0f0',
                  color: msg.sender === 'user' ? '#fff' : '#000',
                  borderRadius: msg.sender === 'user'
                    ? '15px 15px 0 15px'
                    : '15px 15px 15px 0',
                }}
              >
                <div style={{ whiteSpace: 'pre-wrap' }}>{msg.content
                  .replace(/\\n/g, '\n')
                  .replace(/\\\n/g, '\n')} </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div id="chat-input" style={styles.chatInput}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Nhập tin nhắn..."
              style={styles.input}
            />
            <button onClick={sendMessage} style={styles.sendButton}>Gửi</button>
          </div>
        </div>
      )}
    </>
  );
};

const styles = {
  chatButton: {
    position: 'fixed',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '50%',
    width: 60,
    height: 60,
    fontSize: 24,
    cursor: 'pointer',
    zIndex: 1000,
    transition: 'transform 0.2s, background 0.3s',
  },
  chatBox: {
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    bottom: 90,
    right: 20,
    width: 400,
    height: 500,
    border: '1px solid #ccc',
    borderRadius: 15,
    background: 'white',
    boxShadow: '0 0 15px rgba(0,0,0,0.2)',
    zIndex: 999,
    overflow: 'hidden',
  },
  chatMessages: {
    flex: 1,
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    overflowY: 'auto',
    background: '#f9f9f9',
  },
  chatInput: {
    display: 'flex',
    borderTop: '1px solid #ddd',
    padding: 10,
    background: '#fff',
  },
  input: {
    flex: 1,
    border: '1px solid #ccc',
    borderRadius: 20,
    padding: '10px 15px',
    outline: 'none',
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: 20,
    padding: '10px 15px',
    cursor: 'pointer',
    transition: 'background 0.3s, transform 0.2s',
  },
  message: {
    maxWidth: '75%',
    padding: '10px 15px',
    fontSize: 14,
    wordWrap: 'break-word',
  }
};

export default Chatbot;
