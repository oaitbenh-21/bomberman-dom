import { createElement } from "../../mini-framework/src/mini-framework-z01.js"

const renderWelcome = (socket, gameState) => {
      function handleButtonClick(e) {
            e.preventDefault();
            const input = e.target.elements[0];
            const name = input ? input.value : "";
            // validate the name 
            if (name.trim().length === 0) {
                  alert("enter valid name");
                  return;
            }
            gameState.getState().name.set(name);// = name;

            socket.send(JSON.stringify({
                  type: "join-player",
                  name: name
            }));
            input.value = "";
      }

      return createElement("div", { class: "welcome" }, [
            createElement("img", { src: "./assets/img/bomberman-logo.png", alt: "Bomberman Logo" }),
            createElement("h1", {}, "Welcome to BombermanGame"),
            createElement("p", {}, "Get creative and enter your name to start!"),
            createElement('form', { class: 'form', onSubmit: handleButtonClick }, [
                  createElement("input", {
                        type: "text",
                        placeholder: "Enter your creative name (min 2 chars)",
                        value:gameState.getState().name.get()
                  }),
                  createElement("button", {}, "Start Game")
            ])
      ]);
};

export default renderWelcome;