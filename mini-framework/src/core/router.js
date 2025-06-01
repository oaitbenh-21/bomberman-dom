class Router {
  constructor() {
    this.routes = {};
    this.currentRoute = null;
    this.init();
  }

  init() {
    window.addEventListener('popstate', () => this.handleRouteChange());
    this.handleRouteChange();
  }

  addRoute(path, component) {
    this.routes[path] = component;
    console.log(this.routes);
  }

  navigate(path) {
    history.pushState({}, '', path);
    this.handleRouteChange();
  }

  handleRouteChange() {
    const path = window.location.pathname;
    const component = this.routes[path];

    if (component) {
      this.currentRoute = path;
      component();
    }
  }
}

export default Router;
