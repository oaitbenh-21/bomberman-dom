import { createElement , effect, createSignal, appendTo} from "../../mini-framework/src/mini-framework-z01.js";



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
    console.log('this is render chat and the isChat is :', isChating)
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
                        console.log('messages rerendering...')
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
