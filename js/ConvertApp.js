"use strict";
class ConvertApp extends HTMLElement {
    constructor() {
        super();
        this.txtChrJson = this.querySelector("#txt-chrome");
        this.txtKValueJson = this.querySelector("#txt-key-value");
        this.querySelector(".btn-to-i18n")?.addEventListener("click", () => this.convertToChr());
        this.querySelector(".btn-to-key-value")?.addEventListener("click", () => this.convertToKValue());
        this.querySelectorAll("textarea[id]").forEach(txt => {
            this.addDropSupport(txt);
            const v = localStorage.getItem(txt.id);
            if (v) {
                txt.value = v;
            }
        });
    }
    addDropSupport(txt) {
        txt.addEventListener("dragover", () => {
            txt.style.cursor = "alias";
        });
        txt.addEventListener("dragleave", () => {
            txt.style.removeProperty("cursor");
        });
        txt.addEventListener("drop", e => {
            txt.style.removeProperty("cursor");
            e.preventDefault();
            if (!e.dataTransfer) {
                return;
            }
            if (e.dataTransfer.items) {
                for (const item of e.dataTransfer.items) {
                    switch (item.kind) {
                        case "file": {
                            const file = item.getAsFile();
                            if (!file) {
                                continue;
                            }
                            void this.readFileToTextbox(file, txt);
                            break;
                        }
                        case "string": {
                            item.getAsString(str => {
                                if (str) {
                                    txt.value = str;
                                }
                            });
                            break;
                        }
                    }
                }
            }
            else {
                const file = e.dataTransfer.files[0];
                if (!file) {
                    return;
                }
                void this.readFileToTextbox(file, txt);
            }
        });
    }
    readFileToTextbox(file, txt) {
        const reader = new FileReader();
        reader.onload = () => txt.value = reader.result;
        reader.readAsText(file);
    }
    convert(txtIn, txtOut, transform) {
        const input = txtIn.value;
        if (input.length < 10000) {
            localStorage.setItem(txtIn.id, input);
        }
        let json;
        try {
            json = JSON.parse(input);
        }
        catch (e) {
            alert("Invalid input JSON: " + e);
            return;
        }
        transform(json);
        const outJson = JSON.stringify(json, undefined, 4);
        txtOut.value = outJson;
        if (outJson.length < 10000) {
            localStorage.setItem(txtOut.id, outJson);
        }
    }
    convertToChr() {
        this.convert(this.txtKValueJson, this.txtChrJson, json => {
            for (const k in json) {
                json[k] = {
                    message: json[k],
                };
            }
        });
    }
    convertToKValue() {
        this.convert(this.txtChrJson, this.txtKValueJson, json => {
            for (const k in json) {
                json[k] = json[k].message ?? "";
            }
        });
    }
    static register() {
        customElements.define("convert-app", this);
    }
}
ConvertApp.register();
