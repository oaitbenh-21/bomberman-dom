import { createElement,render} from "../../mini-framework/src/mini-framework-z01.js";



const renderWelcome = (socket, gameState,container) => {
            const state = gameState.getState();
            const name = state.name.get();
      function handleSubmit(e) {
            e.preventDefault();
            const input = e.target.elements[0];
            const name = input ? input.value.trim() : "";
            if (name.length === 0) {
                  alert("Enter a valid name");
                  return;
            }

            gameState.getState().name.set(name);
            socket.send(JSON.stringify({ type: "join-player", name }));
            input.value = "";
      }

      const welcome = createElement("div", {}, [
            renderWelcomeScreen(name, handleSubmit)
      ]);
      render(welcome,container)
};



function renderWelcomeScreen(name, handleSubmit) {
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
                        placeholder: "Enter your creative name (min 2 chars)",
                        value: name
                  }),
                  createElement("button", {}, "Start Game")
            ])
      ]);
}

export default renderWelcome;
