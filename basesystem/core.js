// Pluto base-system modified by Envy Group for CharonPSE
(async () => {
  const semver = (await import("./semver.min.js")).default;
  try {
    const coreDetails = {
      version: "v1.6.2",
      codename: "Elysium",
    };
    coreDetails.versionString = coreDetails.version;
    coreDetails.minSupported = `<=${coreDetails.version}`;
    const knownLibraries = [];
    const GlobalLib = {
      getString,
      semver,
      escapeHtml: escapeHtml,
      html: class Html {
        elm;
        constructor(elm) {
          if (elm instanceof HTMLElement) {
            this.elm = elm;
          } else {
            this.elm = document.createElement(elm || "div");
          }
        }
        text(val) {
          this.elm.innerText = val;
          return this;
        }
        html(val) {
          this.elm.innerHTML = val;
          return this;
        }
        cleanup() {
          this.elm.remove();
          return this;
        }
        query(selector) {
          return this.elm.querySelector(selector);
        }
        qs(query) {
          if (this.elm.querySelector(query)) {
            return Html.from(this.elm.querySelector(query));
          } else {
            return null;
          }
        }
        qsa(query) {
          if (this.elm.querySelector(query)) {
            return Array.from(this.elm.querySelectorAll(query)).map((e) =>
              Html.from(e)
            );
          } else {
            return null;
          }
        }
        id(val) {
          this.elm.id = val;
          return this;
        }
        class(...val) {
          for (let i = 0; i < val.length; i++) {
            this.elm.classList.toggle(val[i]);
          }
          return this;
        }
        classOn(...val) {
          for (let i = 0; i < val.length; i++) {
            this.elm.classList.add(val[i]);
          }
          return this;
        }
        classOff(...val) {
          for (let i = 0; i < val.length; i++) {
            this.elm.classList.remove(val[i]);
          }
          return this;
        }
        style(obj) {
          for (const key of Object.keys(obj)) {
            this.elm.style.setProperty(key, obj[key]);
          }
          return this;
        }
        styleJs(obj) {
          for (const key of Object.keys(obj)) {
            this.elm.style[key] = obj[key];
          }
          return this;
        }
        on(ev, cb) {
          this.elm.addEventListener(ev, cb);
          return this;
        }
        un(ev, cb) {
          this.elm.removeEventListener(ev, cb);
          return this;
        }
        appendTo(parent) {
          if (parent instanceof HTMLElement) {
            parent.appendChild(this.elm);
          } else if (parent instanceof Html) {
            parent.elm.appendChild(this.elm);
          } else if (typeof parent === "string") {
            document.querySelector(parent)?.appendChild(this.elm);
          }
          return this;
        }
        prependTo(parent) {
          if (parent instanceof HTMLElement) {
            parent.prepend(this.elm);
          } else if (parent instanceof Html) {
            parent.elm.prepend(this.elm);
          } else if (typeof parent === "string") {
            document.querySelector(parent)?.prepend(this.elm);
          }
          return this;
        }
        append(elem) {
          if (elem instanceof HTMLElement) {
            this.elm.appendChild(elem);
          } else if (elem instanceof Html) {
            this.elm.appendChild(elem.elm);
          } else if (typeof elem === "string") {
            const newElem = document.createElement(elem);
            this.elm.appendChild(newElem);
            return new Html(newElem.tagName);
          }
          return this;
        }
        prepend(elem) {
          if (elem instanceof HTMLElement) {
            this.elm.prepend(elem);
          } else if (elem instanceof Html) {
            this.elm.prepend(elem.elm);
          } else if (typeof elem === "string") {
            const newElem = document.createElement(elem);
            this.elm.prepend(newElem);
            return new Html(newElem.tagName);
          }
          return this;
        }
        appendMany(...elements) {
          for (const elem of elements) {
            this.append(elem);
          }
          return this;
        }
        prependMany(...elements) {
          for (const elem of elements) {
            this.prepend(elem);
          }
          return this;
        }
        ) {
          this.elm.innerHTML = "";
          return this;
        }
        attr(obj) {
          for (let key in obj) {
            if (obj[key] !== null && obj[key] !== undefined) {
              this.elm.setAttribute(key, obj[key]);
            } else {
              this.elm.removeAttribute(key);
            }
          }
          return this;
        }
        val(str) {
          var x = this.elm;
          x.value = str;
          return this;
        }
        getText() {
          return this.elm.innerText;
        }
        getHtml() {
          return this.elm.innerHTML;
        }
        getValue() {
          return this.elm.value;
        }
        swapRef(elm) {
          this.elm = elm;
          return this;
        }
        static from(elm) {
          if (typeof elm === "string") {
            const element = Html.qs(elm);
            if (element === null) return null;
            else return element;
          } else {
            return new Html(elm);
          }
        }
        static qs(query) {
          if (document.querySelector(query)) {
            return Html.from(document.querySelector(query));
          } else {
            return null;
          }
        }
        static qsa(query) {
          if (document.querySelector(query)) {
            return Array.from(document.querySelectorAll(query)).map((e) =>
              Html.from(e)
            );
          } else {
            return null;
          }
        }
      },
      randomString: () => {
        if (crypto && crypto.randomUUID) return crypto.randomUUID();
        else {
          var d = new Date().getTime();
          var d2 =
            (typeof performance !== "undefined" &&
              performance.now &&
              performance.now() * 1000) ||
            0;
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
            /[xy]/g,
            function (c) {
              var r = Math.random() * 16;
              if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
              } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
              }
              return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
            }
          );
        }
      },
      loadLibrary: async function (lib) {
        if (lib.includes(":")) return false;
        knownLibraries.push(lib);
        return await Core.startPkg("lib:" + lib);
      },
      loadComponent: async (cmp) => {
        if (cmp.includes(":")) return false;
        knownLibraries.push(cmp);
        return await Core.startPkg("components:" + cmp);
      },
    };
    GlobalLib.icons = (await import("./assets/icons.js")).default;
    const strings = (await import("./assets/strings.js")).default;
    function replaceString(string, replacements) {
      let str = string;
      for (let rpl in replacements) {
        str = str.replace(`{${rpl}}`, replacements[rpl]);
      }
      return str;
    }
    function getString(str, replacements = null, source) {
      function getStr() {
        if (source && source[language] && source[language][str])
          return source[language][str];
        else if (source && source["en_US"][str]) return source["en_US"][str];
        else if (strings[language] && strings[language][str])
          return strings[language][str];
        else return strings["en_US"][str];
      }
      const newStr = escapeHtml(getStr());
      if (replacements !== null) {
        return replaceString(newStr, replacements);
      } else {
        if (newStr === undefined) return str;
        return newStr;
      }
    }
    function escapeHtml(str) {
      if (str !== undefined)
        return str
          .replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");
    }
    const processLib = class ProcessAvailableLibrary {
      constructor(url, pid, token, strs) {
        var Url = url;
        var Pid = pid;
        var Token = token;
        
        this.escapeHtml = escapeHtml;
        this.getString = function (str, replacements = null) {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "getString",
              pid: Pid,
              url: Url,
              data: arguments,
            },
          });
          return getString(str, replacements, strs);
        };

        this.html = GlobalLib.html;
        this.randomString = GlobalLib.randomString;
        this.icons = GlobalLib.icons;
        this.systemInfo = coreDetails;
        this.semver = GlobalLib.semver;
        this.updateProcTitle = function (newTitle) {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "updateProcTitle",
              pid: Pid,
              url: Url,
              data: arguments,
            },
          });
          if (Core.processList[Pid].proc !== null) {
            Core.processList[Pid].proc.name = newTitle;
          }
        };
        this.updateProcDesc = function (newDescription) {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "updateProcDesc",
              pid: Pid,
              url: Url,
              data: arguments,
            },
          });
          if (Core.processList[Pid].proc !== null) {
            Core.processList[Pid].proc.description = newDescription;
          }
        };
        this.langs = supportedLangs;
        this.launch = async (app, parent = "body") => {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "launch",
              pid: Pid,
              url: Url,
              data: arguments,
            },
          });
          let appName = "";

          if (Core.processList[Pid].proc !== null) {
            appName = Core.processList[Pid].proc.name;
          } else {
            appName = "???";
          }
          if (
            (await Modal.prompt(
              getString("notice"),
              getString("core_appLaunch_notification", {
                suspectedApp: appName,
                targetApp: app.split(":").pop(),
              }),
              parent
            )) === true
          ) {
            return await Core.startPkg(app);
          } else {
            return false;
          }
        };
        this.getProcessList = () => {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "getProcessList",
              pid: Pid,
              url: Url,
              data: arguments,
            },
          });
          return Core.processList
            .filter((m) => m !== null)
            .map((m) => {
              return {
                name: m.name,
                pid: m.pid,
              };
            });
        };
        this.loadLibrary = async (lib) => {
          if (lib.includes(":")) return false;
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "loadLibrary",
              pid: Pid,
              url: Url,
              data: [lib],
            },
          });
          return await Core.startPkg("lib:" + lib);
        };
        this.loadComponent = async (cmp) => {
          if (cmp.includes(":")) return false;
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "loadComponent",
              pid: Pid,
              url: Url,
              data: [cmp],
            },
          });
          return await Core.startPkg("components:" + cmp);
        };
        this.cleanup = function (pid, token) {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "cleanup",
              pid: Pid,
              url: Url,
              data: [pid],
            },
          });
          console.log("Checking..");
          const proc = Core.processList
            .filter((p) => p !== null)
            .findIndex((p) => p.pid === pid && p.token === token);
          if (proc !== -1) {
            console.log(Core.processList[proc]);
            ProcLib.cleanupProcess(pid);
            return true;
          } else {
            return false;
          }
        };
        this.setOnEnd = function (onEndCallback) {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "setOnEnd",
              pid: Pid,
              url: Url,
              data: [onEndCallback],
            },
          });
          this.onEndCallback = onEndCallback;
          this.onEnd = () => {
            console.log("Example process ended, attempting clean up...");
            const result = this.cleanup(Pid, Token);
            if (result === true) {
              this.onEndCallback && this.onEndCallback();
              console.log("Cleanup Success! Token:", Token);
            } else {
              console.log("Cleanup Failure. Token:", Token);
            }
          };
        };
        this.setupReturns = function (onMessage, trayInfo = null) {
          broadcastEventToProcs({
            type: "procEvent",
            data: {
              type: "setOnEnd",
              pid: Pid,
              url: Url,
              data: [onMessage, trayInfo],
            },
          });
          return {
            end: this.onEnd,
            trayInfo,
            send: async (m) => {
              if (
                m &&
                m.type &&
                m.type === "refresh" &&
                m.data &&
                typeof m.data === "function"
              ) {
                this.getString = m.data;
              }
              return await onMessage(m);
            },
          };
        };
      }
    };

    const ProcLib = {
      findEmptyPID: function () {
        let r = Core.processList.findIndex((p) => p === null);
        return r !== -1 ? r : Core.processList.length;
      },
      cleanupProcess: function (pid) {
        let proc = Core.processList
          .filter((p) => p !== null)
          .find((p) => p.pid === pid);
        console.group("Process cleanup (" + pid, proc.name + ")");
        console.debug(
          `%cProcess ${proc.name} (${proc.pid}) was ended.`,
          "color:green;font-weight:bold"
        );
        let x = procsListeningToEvents.findIndex((p) => p === pid);
        if (x !== undefined || x !== null) {
          procsListeningToEvents[x] = null;
        }
        broadcastEventToProcs({
          type: "coreEvent",
          data: {
            type: "pkgEnd",
            data: Core.processList[pid],
          },
        });
        Core.processList[pid] = null;
        console.groupEnd();
      },
    };

    let Modal, Toast;

    const corePrivileges = {
      startPkg: { description: "core_appAccessControl_privilege_startPkg" },
      processList: {
        description: "core_appAccessControl_privilege_processList",
      },
      knownPackageList: {
        description: "core_appAccessControl_privilege_knownPackageList",
      },
      services: { description: "core_appAccessControl_privilege_services" },
      setLanguage: {
        description: "core_appAccessControl_privilege_setLanguage",
      },
      host: {
        description:
          "core_appAccessControl_privilege_desktopOnlyHostPermission",
      },
      full: {
        description: "core_appAccessControl_privilege_full",
      },
    };

    const permittedApps = ["lib:ThemeLib"];
    const procsListeningToEvents = [];

    function broadcastEventToProcs(eventData) {
      procsListeningToEvents
        .filter((m) => m !== null)
        .forEach((e) => {
          Core.processList[e] !== null &&
            Core.processList[e].proc !== null &&
            Core.processList[e].proc.send(eventData);
        });
    }

    const supportedLangs = [
      "en_US",
      "en_GB",
      "de_DE",
      "es_ES",
      "pt_BR",
      "fil_PH",
    ];

    let language = "en_US";

    const Core = {
      version: coreDetails.version,
      codename: coreDetails.codename,
      processList: [],
      knownPackageList: [],

      setLanguage(lang) {
        console.log("setting language to", lang);
        if (supportedLangs.includes(lang)) language = lang;

        // kindly ask all processes to restart
        Core.processList
          .filter((n) => n !== null)
          .forEach((p) => {
            p.proc &&
              p.proc.send &&
              p.proc.send({
                type: "refresh",
                data: function (
                  str,
                  replacements = null,
                  source = p.proc.strings
                ) {
                  return getString(str, replacements, source);
                },
              });
          });
      },
      startPkg: async function (url, isUrl = true, force = false) {
        try {
          let pkg;
          if (isUrl === false) {
            pkg = await import(url);
            url = "none:<Imported as URI>";
          } else {
            pkg = await import("./pkgs/" + url.replace(":", "/") + ".js");
          }

          if (!pkg.default)
            throw new Error('No "default" specified in package');
          pkg = pkg.default;

          if (!Core.knownPackageList.find((m) => m.url === url))
            Core.knownPackageList.push({ url, pkg });
          
          let pkgSatisfies = false;

          if (pkg.ver !== undefined) {
            if (typeof pkg.ver === "number" || typeof pkg.ver === "string") {
              if (semver.satisfies(Core.version, `>=${pkg.ver}`)) {
                pkgSatisfies = true;
              }
            }
          }

          if (pkg.name && pkg.type === "process" && pkgSatisfies === true) {
            console.group("Running " + url);
            console.log(
              `Core version: ${Core.version}\nPackage version: ${pkg.ver}`
            );
            console.log("Good package data");
            if (pkg.type === "process" && typeof pkg.exec === "function") {
              const PID = ProcLib.findEmptyPID();
              Core.processList[PID] = {
                name: url,
                pid: PID,
                proc: null,
              };
              const Token = GlobalLib.randomString();
              const newLib = new processLib(url, PID, Token, pkg.strings);
              if (Core.processList[PID]) Core.processList[PID].token = Token;
              let result;
              if (
                url.startsWith("system:") ||
                url.startsWith("ui:") ||
                url.startsWith("components:") ||
                url.startsWith("services:") ||
                permittedApps.includes(url)
              ) {
                result = await pkg.exec({
                  Lib: newLib,
                  Core,
                  PID,
                  Token,
                  Modal,
                  Services: Core.services,
                  GlobalLib,
                });
              } else if (
                pkg.privileges === undefined ||
                pkg.privileges === false ||
                pkg.optInToEvents === false
              ) {
                result = await pkg.exec({
                  Lib: newLib,
                  Core: null,
                  PID,
                  Token,
                  Modal,
                  Services: null,
                });
              } else {
                let privileges = {};

                if (!Array.isArray(pkg.privileges)) {
                  throw new Error("pkg.privileges must be an array");
                }

                for (const item of pkg.privileges) {
                  if (!item || typeof item !== "object" || !item.privilege)
                    continue;

                  if (item.privilege in corePrivileges) {
                    privileges[item.privilege] = corePrivileges[item.privilege];
                    if (!item.description)
                      item.description =
                        '<span class="danger">No author note</span>';
                    if (item.privilege === "full") {
                      privileges[
                        item.privilege
                      ].description = `<span class=\"danger\">${getString(
                        privileges[item.privilege].description
                      )}</span>`;
                    }
                    privileges[item.privilege].authorNote = item.description;
                  }
                }

                let modalResult = "";
                if (force === false)
                  modalResult = await new Promise((resolve, reject) => {
                    setTimeout(() => {
                      let x = new Audio("./assets/alert.wav");
                      x.volume = 0.75;
                      x.play();
                    }, 100);
                    Modal.modal(
                      getString("core_appAccessControl_title"),
                      `${getString("core_appAccessControl_description", {
                        appName:
                          url === "none:<Imported as URI>"
                            ? pkg.name
                            : url.split(":").pop(),
                      })}<br><br><ul>${Object.keys(privileges)
                        .map(
                          (m) =>
                            `<li>${getString(
                              privileges[m].description
                            )}<br><span class="label">${
                              privileges[m].authorNote !== undefined
                                ? `${getString(
                                    "core_appAccessControl_authorNote",
                                    {
                                      note: escapeHtml(
                                        privileges[m].authorNote
                                      ),
                                    }
                                  )}</li>`
                                : `<span style="color:var(--negative-light)">${getString(
                                    "core_appAccessControl_noAuthorNote"
                                  )}</span>`
                            }</span>`
                        )
                        .join("")}</ul>`,
                      "body",
                      false,
                      {
                        text: getString("allow"),
                        type: "primary",
                        callback: (_) => resolve("allow"),
                      },
                      {
                        text: getString("deny"),
                        callback: (_) => resolve("deny"),
                      },
                      {
                        text: getString("cancel"),
                        callback: (_) => resolve(false),
                      }
                    );
                  });
                else modalResult = "allow";
                if (modalResult === "allow") {
                  let coreObj = {
                    ...(privileges.startPkg ? { startPkg: Core.startPkg } : {}),
                    ...(privileges.processList
                      ? { processList: Core.processList }
                      : {}),
                    ...(privileges.knownPackageList
                      ? { knownPackageList: Core.knownPackageList }
                      : {}),
                    ...(privileges.host ? { host: GlobalLib.host } : {}),
                    ...(privileges.setLanguage
                      ? { setLanguage: Core.setLanguage }
                      : {}),
                    ...(privileges.services ? { services: Core.services } : {}),
                  };
                  if (privileges.full) {
                    coreObj = Core;
                  }
                  result = await pkg.exec({
                    Lib: newLib,
                    Core: coreObj,
                    PID,
                    Token,
                    Modal,
                    Services: Core.services,
                  });
                } else if (modalResult === "deny") {
                  result = await pkg.exec({
                    Lib: newLib,
                    Core: null,
                    PID,
                    Token,
                    Modal,
                    Services: Core.services,
                  });
                } else if (modalResult === false) {
                  result = null;
                  broadcastEventToProcs({
                    type: "coreEvent",
                    data: {
                      type: "pkgEnd",
                      detail: "forceStop",
                      data: Core.processList[PID],
                    },
                  });
                  Core.processList[PID] = null;
                  return;
                }
              }

              if (
                Core.processList[PID] &&
                typeof Core.processList[PID]["proc"] !== "undefined"
              ) {
                Core.processList[PID].proc = Object.assign(
                  {
                    name: pkg?.name,
                    description: pkg?.description,
                    strings: pkg?.strings,
                  },
                  result
                );
                if (
                  typeof pkg?.optInToEvents !== "undefined" &&
                  pkg?.optInToEvents === true
                ) {
                  console.log("Core: adding", PID, "to optInToEvents");
                  procsListeningToEvents.push(PID);
                }

                broadcastEventToProcs({
                  type: "coreEvent",
                  data: {
                    type: "pkgStart",
                    data: Core.processList[PID],
                  },
                });
              }
              console.groupEnd();
              return Core.processList[PID];
            }
          } else if (pkg.type === "library" || pkg.type === "component") {
            if (pkg.data && typeof pkg.data === "object") {
              if (pkg.init && typeof pkg.init === "function") {
                await pkg.init(GlobalLib, Core);
              }

              return pkg.data;
            }
          } else {
            console.log(pkg);
            throw new Error(
              "Bad package metadata" +
                (pkg.ver !== undefined && typeof pkg.ver === "number"
                  ? ` - maybe version "${pkg.ver}" doesn\'t match your current version of "${Core.version}"?`
                  : "")
            );
          }
        } catch (e) {
          const s = `Failed to load package ${url}. ${e}\n\n${e.stack}`;
          if (Modal && Modal.alert) {
            Modal.alert(s);
          } else {
            alert(s);
          }
        }
      },
      services: [],
      broadcastEventToProcs,
    };

    Modal = await Core.startPkg("ui:Modal");
    Toast = await Core.startPkg("lib:Notify");
    window.m = Modal;
    window.t = Toast;
    window.c = Core;
    window.l = GlobalLib;
    window.h = GlobalLib.html;
    window.cd = coreDetails;
    let host;
    if (window.host !== undefined) {
      host = window.host;
      window.host = undefined;
      GlobalLib.host = host;
      window.bootUpCore = Core;
      window.dispatchEvent(new CustomEvent("pluto.boot"));
      setTimeout(() => {
        window.bootUpCore = null;
      }, 1000);
    }

    Core.processList.push({
      name: "system:Core",
      pid: 0,
      proc: {
        name: `Pluto Core (${coreDetails.codename})`,
        description: "Handles core system functionality and package loading.",
        trayInfo: null,
        end: null,
      },
      token: GlobalLib.randomString(),
    });

    await Core.startPkg("system:BootLoader");
  } catch (e) {
    alert(e);
  }
})();
