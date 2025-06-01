import { setRef } from "./state.js";

class VirtualDOM {
  constructor(eventManager) {
    this.tree = null;
    this.events = eventManager;
    this.refs = new Map();
    this.subscriptions = new Map(); // (optional for advanced cleanup)
  }

  createElement(tag, attrs = {}, children = []) {
    if (!Array.isArray(children)) {
      children = [children];
    }

    children = children.filter(
      (child) => child !== null && child !== undefined && child !== false
    );

    return {
      tag,
      attrs,
      children,
      key: attrs.key ?? null,
    };
  }

  render(newTree, container) {
    if (this.tree === null) {
      const domElement = this.createDOMElement(newTree, true);
      if (!(container instanceof HTMLElement)) {
        container = document.querySelector(container);
      }
      container.innerHTML = "";
      container.appendChild(domElement);
    } else {
      this.diff(this.tree, newTree, container, 0);
    }

    this.tree = newTree;
  }

  createDOMElement(node) {
  
    // Reactive text node from signal
    if (typeof node === "function" && node.isSignal) {
      const textNode = document.createTextNode(node());
      this.subscribe(node, () => {
        textNode.nodeValue = node();
      });
      return textNode;
    }

    // Static text node
    if (typeof node === "string") return document.createTextNode(node);

    const element = document.createElement(node.tag);

    for (const [attr, value] of Object.entries(node.attrs || {})) {
      if (attr === "onMount") {
        // We'll defer this until after mounting
        element._onMount = value;

      } else if (attr.startsWith("on") && typeof value === "function") {
        const eventName = attr.slice(2).toLowerCase();
        element.addEventListener(eventName, value);
      } else if (attr === "style" && typeof value === "object") {
        Object.assign(element.style, value);
      } else if (attr === "ref") {
        if (typeof value === "object" && value !== null && "current" in value) {
          value.current = element;
        } else {
          setRef(value, element);
        }
      } else if (typeof value === "function" && value && value.isSignal) {
        // Reactive attribute binding
        const updateAttr = () => {
          if (attr === "style" && typeof value() === "object") {
            Object.assign(element.style, value());
          } else {
            element.setAttribute(attr, value());
          }
        };

        updateAttr(); // run once initially
        this.subscribe(value, updateAttr);
      } else {
        element.setAttribute(attr, value);
      }
    }

    for (const child of node.children || []) {
      const childEl = this.createDOMElement(child);
      element.appendChild(childEl);
    }
    // Call onMount once the element is added to the DOM
    queueMicrotask(() => {
      if (typeof element._onMount === "function") {
        element._onMount(element);
      }

    });
    return element;
  }

  diff(oldNode, newNode, parent, index = 0) {
    const existingDom = parent.childNodes[index];

    if (!oldNode) {
      const newDom = this.createDOMElement(newNode, true);
      parent.appendChild(newDom);
    } else if (!newNode) {
      if (existingDom) {
        parent.removeChild(existingDom);
        if (oldNode.attrs?.ref) {
          this.removeRef(oldNode.attrs.ref);
        }
      }
    } else if (this.hasChanged(oldNode, newNode)) {
      const newDom = this.createDOMElement(newNode, true);
      parent.replaceChild(newDom, existingDom);
    } else if (newNode.tag) {
      this.updateChildren(
        existingDom,
        oldNode.children || [],
        newNode.children || []
      );
    }
  }

  updateChildren(parentDom, oldChildren, newChildren) {
    const oldKeyed = new Map();
    const usedIndices = new Set();

    oldChildren.forEach((child, i) => {
      if (child.key != null) {
        oldKeyed.set(child.key, { node: child, index: i });
      }
    });

    for (let i = 0; i < newChildren.length; i++) {
      const newChild = newChildren[i];
      let matchedOld = null;
      let oldIndex = i;

      if (newChild.key != null && oldKeyed.has(newChild.key)) {
        const match = oldKeyed.get(newChild.key);
        matchedOld = match.node;
        oldIndex = match.index;
        usedIndices.add(oldIndex);
        oldKeyed.delete(newChild.key);
      } else if (!newChild.key) {
        matchedOld = oldChildren[i];
        usedIndices.add(i);
      }

      this.diff(matchedOld, newChild, parentDom, oldIndex);
    }

    for (let i = oldChildren.length - 1; i >= 0; i--) {
      if (!usedIndices.has(i)) {
        const domNode = parentDom.childNodes[i];
        if (domNode) parentDom.removeChild(domNode);
      }
    }
  }

  hasChanged(oldNode, newNode) {
    if (typeof oldNode !== typeof newNode) return true;
    if (typeof oldNode === "string") return oldNode !== newNode;
    if (oldNode.tag !== newNode.tag) return true;

    const oldAttrs = oldNode.attrs || {};
    const newAttrs = newNode.attrs || {};
    const oldKeys = Object.keys(oldAttrs);
    const newKeys = Object.keys(newAttrs);

    if (oldKeys.length !== newKeys.length) return true;

    for (const key of oldKeys) {
      const oldVal = oldAttrs[key];
      const newVal = newAttrs[key];

      if (typeof oldVal === "function" && typeof newVal === "function") continue;
      if (oldVal !== newVal) return true;
    }

    return false;
  }

  subscribe(signal, callback) {
    signal.subscribers.add(callback);
  }
}

export default VirtualDOM;
