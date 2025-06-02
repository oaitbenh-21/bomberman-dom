import { createElement } from "../../mini-framework/src/mini-framework-z01.js"

const renderWelcome = (playerName = "", setPlayerName, onSubmit) => {
      function handleInput(e) {
            setPlayerName(e.target.value);
      }

      function handleSubmitWithValidation(name) {
            console.log(name)
            if (!name || name.trim().length < 2) {
                  alert("Please enter a valid name (minimum 2 characters)");
                  return;
            }
            onSubmit && onSubmit(name.trim());
      }

      function handleKeyDown(e) {
            if (e.key === "Enter") {
                  handleSubmitWithValidation(playerName);
            }
      }

      function handleButtonClick() {
            handleSubmitWithValidation(playerName);
      }

      return createElement("div", { class: "welcome" }, [
            createElement("img", { src: "./assets/img/bomberman-logo.png", alt: "Bomberman Logo" }),
            createElement("h1", {}, "Welcome to BombermanGame"),
            createElement("p", {}, "Get creative and enter your name to start!"),
            createElement("input", {
                  type: "text",
                  placeholder: "Enter your creative name (min 2 chars)",
                  value: playerName,
                  oninput: handleInput,
                  onkeydown: handleKeyDown
            }),
            createElement("button", { onclick: handleButtonClick }, "Start Game")
      ]);
};

export default renderWelcome;