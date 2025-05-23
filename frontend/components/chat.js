import { createElement } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.7/dist/mini-framework-z01.min.js";

const renderChat = (messages = [], ws, isChating) => {
      const sendMessage = (message) => {
            const data = {
                  type: "chat-client",
                  message: message
            };
            ws.send(JSON.stringify(data));
      }
      return createElement('div', { class: 'chat' },
            [
                  createElement('div', { class: 'chat-messages' },
                        messages.map((message) =>
                              createElement('div', { class: 'chat-message' }, [
                                    createElement('span', { class: 'chat-user' }, `${message.username}: `),
                                    createElement('span', { class: 'chat-text' }, message.message)
                              ])
                        )
                  ),
                  createElement('form', {
                        class: 'chat-input', onsubmit: (e) => {
                              e.preventDefault();
                              const input = e.target.elements.chat;
                              const msg = input.value.trim();
                              if (msg) {
                                    sendMessage(msg);
                                    input.value = '';
                              }
                        }
                  }, [
                        createElement('input', {
                              onclick: () => {
                                    console.log('input clicked, chating:', isChating);
                                    isChating.setState(true)
                                    console.log('did it change:', isChating);
                              },
                              type: 'text',
                              name: 'chat',
                              placeholder: 'Type your message...',
                              autocomplete: 'off'
                        }),
                        createElement('button', { type: 'submit' }, createElement('img', { src: '../assets/img/send.png', alt: "send" }))
                  ]
                  )
            ]
      );
};

export default renderChat;
