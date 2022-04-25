class ConvertApp extends HTMLElement {

    txtChrJson: HTMLTextAreaElement = this.querySelector("#txt-chrome")!;
    txtKValueJson: HTMLTextAreaElement = this.querySelector("#txt-key-value")!;

    constructor() {
        super();

        this.querySelector(".btn-to-i18n")?.addEventListener("click",
            () => void this.convertToChr());
        this.querySelector(".btn-to-key-value")?.addEventListener("click",
            () => void this.convertToKValue());

        this.querySelectorAll<HTMLTextAreaElement>("textarea[id]").forEach(txt => {
            this.addDropSupport(txt);

            const v = localStorage.getItem(txt.id);
            if (v) {
                txt.value = v;
            }
        });

        this.querySelectorAll<HTMLButtonElement>("[data-open-for]").forEach(btn =>
            btn.addEventListener("click", () => void this.onOpen(btn)));
        this.querySelectorAll<HTMLButtonElement>("[data-copy-for]").forEach(btn =>
            btn.addEventListener("click", () => void this.onCopy(btn)));
    }

    private onCopy(btn: HTMLButtonElement) {
        const target = btn.getAttribute("data-copy-for")!;
        const txt = this.querySelector<HTMLTextAreaElement>(target);
        if (!txt) {
            console.warn(target + " not found");
            return;
        }

        const value = txt.value;
        navigator.clipboard.writeText(value);
    }

    private onOpen(btn: HTMLButtonElement) {
        const target = btn.getAttribute("data-open-for")!;
        const txt = this.querySelector<HTMLTextAreaElement>(target);
        if (!txt) {
            console.warn(target + " not found");
            return;
        }

        const txtFile = document.createElement("input");
        txtFile.type = "file";
        txtFile.addEventListener("change", () =>
            void this.readFileToTextbox(txtFile.files?.[0], txt)
        );
        txtFile.click();
    }

    private addDropSupport(txt: HTMLTextAreaElement) {
        txt.addEventListener("dragover", () => {
            txt.style.cursor = "alias";
        });
        txt.addEventListener("dragleave", () => {
            txt.style.removeProperty("cursor");
        });
        txt.addEventListener("drop", e => {
            txt.style.removeProperty("cursor");
            e.preventDefault();

            if (!e.dataTransfer) { return; }
            if (e.dataTransfer.items) {
                for (const item of e.dataTransfer.items) {
                    switch (item.kind) {
                        case "file": {
                            const file = item.getAsFile();
                            if (!file) { continue; }

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
            } else {
                const file = e.dataTransfer.files[0];
                if (!file) { return; }

                void this.readFileToTextbox(file, txt);
            }
        });
    }

    private readFileToTextbox(file: File | undefined, txt: HTMLTextAreaElement) {
        if (!file) { return; }

        const reader = new FileReader();
        reader.onload = () => txt.value = reader.result as string;
        reader.readAsText(file);
    }

    private convert(txtIn: HTMLTextAreaElement, txtOut: HTMLTextAreaElement,
        transform: (json: any) => any) {
        const input = txtIn.value;
        if (input.length < 10000) {
            localStorage.setItem(txtIn.id, input);
        }

        let json;
        try {
            json = JSON.parse(input);
        } catch (e) {
            alert("Invalid input JSON: " + e);
            return;
        }

        transform(json);

        const outJson = JSON.stringify(json, undefined, 4)
        txtOut.value = outJson;
        if (outJson.length < 10000) {
            localStorage.setItem(txtOut.id, outJson);
        }
    }

    convertToChr() {
        this.convert(this.txtKValueJson, this.txtChrJson,
            json => {
                for (const k in json) {
                    json[k] = {
                        message: json[k],
                    }
                }
            });
    }

    convertToKValue() {
        this.convert(this.txtChrJson, this.txtKValueJson,
            json => {
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