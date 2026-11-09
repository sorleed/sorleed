import { JSDOM } from "jsdom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "node:test";

const dom = new JSDOM("<!doctype html><html><body></body></html>", {
  url: "http://localhost/",
});

global.window = dom.window;
global.document = dom.window.document;
global.HTMLElement = dom.window.HTMLElement;
global.Element = dom.window.Element;
global.Node = dom.window.Node;
global.NodeFilter = dom.window.NodeFilter;
global.CustomEvent = dom.window.CustomEvent;
global.Event = dom.window.Event;
if (!global.navigator) {
  global.navigator = dom.window.navigator;
}
if (!global.MutationObserver) {
  global.MutationObserver = dom.window.MutationObserver;
}
if (!global.ResizeObserver) {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
global.getComputedStyle = dom.window.getComputedStyle.bind(dom.window);
global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
global.cancelAnimationFrame = (id) => clearTimeout(id);

afterEach(() => {
  cleanup();
  if (document.body) {
    document.body.innerHTML = "";
  }
});
