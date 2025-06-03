// {
//   number: 1,
//   title: "Game Started",
//   message: "The game has started!",
// }

import { createElement } from "../../mini-framework/src/mini-framework-z01.js";


export function renderPopup(status) {
    console.log(status);
    if (status.number == 0) {
        return createElement("div", { class: "popup" }, [createElement("span", { class: "title" }, [status.title]), createElement("span", { class: "content" }, [status.message])]);
    } else {
        return "";
    }
}