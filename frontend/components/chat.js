import { createElement , effect} from "../../mini-framework/src/mini-framework-z01.js";



const messagesSignals = createSignal([]);

/**
 * Append a new message to the signal.
 */
export function setMessages(message) {
    console.log('adding message:', message);

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
                        messages.forEach((message) => {
                            const messageElement = createElement("div", { class: "chat-message" }, [
                                createElement("span", { class: "chat-user" }, `${message.username}: `),
                                createElement("span", { class: "chat-text" }, message.message),
                            ]);
                            el.appendChild(messageElement);
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
                        console.log("input clicked, chating:", isChating);
                        isChating.setState(true);
                        console.log("did it change:", isChating);
                    },
                    type: "text",
                    name: "chat",
                    placeholder: "Type your message...",
                }),
                createElement("button", { type: "submit" }, [
                    createElement("img", {
                        src: "../assets/img/send.png",
                        alt: "send",
                    }),
                ]),
            ]
        ),
    ]);
};

export default renderChat;
