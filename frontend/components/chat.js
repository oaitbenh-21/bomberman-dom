import { createElement , effect, createSignal, appendTo} from "../../mini-framework/src/mini-framework-z01.js";



const messagesSignals = createSignal([]);

/**
 * Append a new message to the signal.
 */
export function setMessages(message) {

    const currentMessages = [...messagesSignals.get()];
    currentMessages.push(message);
    messagesSignals.set(currentMessages);
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
                    effect(() => {
                        const messages = messagesSignals.get();
                        messages.forEach((message) => {
                            const messageElement = createElement("div", { class: "chat-message" }, [
                                createElement("span", { class: "chat-user" }, `${message.username}: `),
                                createElement("span", { class: "chat-text" }, message.message),
                            ]);
                            appendTo(el, messageElement);
                        });
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
                        console.log('now in messages set chatting is to true :', isChating);
                        console.log('try with use getState(),', isChating.getState())
                    },
                    type: "text",
                    name: "chat",
                    placeholder: "Type your message...",
                })
            ]
        ),
    ]);
};

export default renderChat;
