import { createElement } from "https://cdn.jsdelivr.net/npm/mini-framework-z01@1.0.10/dist/mini-framework-z01.min.js";

const renderChat = (messages = [], ws, isChating) => {
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
            { class: "chat-messages" },
            messages.map((message) =>
                createElement("div", { class: "chat-message" }, [
                    createElement(
                        "span",
                        { class: "chat-user" },
                        `${message.username}: `
                    ),
                    createElement(
                        "span",
                        { class: "chat-text" },
                        message.message
                    ),
                ])
            )
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
                createElement(
                    "button",
                    createElement("img", {
                        src: "../assets/img/send.png",
                        alt: "send",
                    })
                ),
            ]
        ),
    ]);
};

export default renderChat;
