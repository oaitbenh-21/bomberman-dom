import { createElement, render } from "../../mini-framework/src/mini-framework-z01.js";

const renderWelcome = (socket, gameState, container) => {
      const state = gameState.getState();
      const name = state.name.get();
      if (!state.error) {
            state.error = { value: "", set(val) { this.value = val; } };
      }
      const error = state.error.value;

      function handleSubmit(e) {
            e.preventDefault();
            const input = e.target.elements[0];
            const name = input ? input.value.trim() : "";
            gameState.getState().name.set(name);
            if (!name || name.length < 3) {
                  state.error.set("Enter a valid name (min 3 chars)");
                  renderWelcome(socket, gameState, container); // re-render to show error
                  return;
            }
            state.error.set("");
            socket.send(JSON.stringify({ type: "join-player", name }));
            input.value = "";
      }

      const welcome = createElement("div", {}, [
            renderWelcomeScreen(name, error, handleSubmit)
      ]);
      render(welcome, container)
};

function renderWelcomeScreen(name, error, handleSubmit) {
      return createElement("div", { class: "welcome" }, [
            createElement("img", {
                  src: "./assets/img/bomberman-logo.png",
                  alt: "Bomberman Logo"
            }),
            createElement("h1", {}, "Welcome to BombermanGame"),
            createElement("p", {}, "Get creative and enter your name to start!"),
            createElement("form", { class: "form", onSubmit: handleSubmit }, [
                  createElement("input", {
                        type: "text",
                        placeholder: "Enter your creative name (min 3 chars)",
                        value: name,
                  },[]),
                  createElement("button", {}, "Start Game"),
            ]),
            createElement("div", { class: "error" }, error || "")
      ]);
}

export default renderWelcome;
