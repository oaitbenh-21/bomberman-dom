import { createElement, effect, createSignal, appendTo } from "../../mini-framework/src/mini-framework-z01.js";

const messagesSignals = createSignal([]);

/**
 * Append a new message to the signal.
 */
export function setMessages(message) {
    const currentMessages = [...messagesSignals.get()];
    currentMessages.push(message);
    messagesSignals.set(currentMessages);
}

/**
 * Clear all messages
 */
export function clearMessages() {
    messagesSignals.set([]);
}

const renderChat = (ws, isChating) => {
    function handleSubmit(e) {
        e.preventDefault();
        const input = e.target.elements.chat.value;
        const msg = input.trim();
        if (msg) {
            sendMessage(msg);
            e.target.elements.chat.value = "";
        }
    }

    const sendMessage = (message) => {
        const data = {
            type: "chat-client",
            message: message,
        };
        ws.send(JSON.stringify(data));
    };

    return createElement("div", { class: "chat" }, [
        createElement(
            "div",
            {
                class: "chat-messages",
                onMount: (el) => {
                    let renderedCount = 0; // Track how many messages we've already rendered
                    
                    effect(() => {
                        const messages = messagesSignals.get();
                        
                        // If we have fewer messages than before, clear and re-render all
                        // (handles cases like clearMessages())
                        if (messages.length < renderedCount) {
                            el.innerHTML = '';
                            renderedCount = 0;
                        }
                        
                        // Only render new messages
                        for (let i = renderedCount; i < messages.length; i++) {
                            const message = messages[i];
                            const messageElement = createElement("div", { 
                                class: "chat-message",
                                key: `message-${i}` // Optional: for debugging
                            }, [
                                createElement("span", { class: "chat-user" }, `${message.username}: `),
                                createElement("span", { class: "chat-text" }, message.message),
                            ]);
                            appendTo(el, messageElement);
                        }
                        
                        // Update rendered count
                        renderedCount = messages.length;
                        
                        // Auto-scroll to bottom when new messages arrive
                        if (messages.length > 0) {
                            el.scrollTop = el.scrollHeight;
                        }
                    })
                },
            }
        ),

        createElement(
            "form",
            {
                class: "chat-input",
                onsubmit: handleSubmit,
            },
            [
                createElement("input", {
                    onclick: () => {
                        isChating.setState(true);
                        console.log('now in messages set chatting is to true:', isChating);
                        console.log('try with use getState():', isChating.getState())
                    },
                    type: "text",
                    name: "chat",
                    placeholder: "Type your message...",
                    autocomplete: "off" // Prevent browser autocomplete in chat
                })
            ]
        ),
    ]);
};

export default renderChat;